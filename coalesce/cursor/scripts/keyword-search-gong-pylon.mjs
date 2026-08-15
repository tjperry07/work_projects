#!/usr/bin/env node
/**
 * Lightweight keyword-in-text search across Pylon issues and Gong transcripts.
 *
 * Unlike /docs-agent-research (hundreds of get_issue / transcript MCP calls),
 * this script:
 *   - Pylon: uses API search_text (fuzzy, returns body_html) then re-ranks
 *   - Gong: batches transcripts for a bounded call window, scores client-side
 *   - Prints a ranked hit list with snippets — deep-dive only the top matches
 *
 * Env (project-root `.env`):
 *   PYLON_API_TOKEN or PYLON_API
 *   PYLON_API_BASE_URL (optional)
 *   GONG_ACCESS_KEY, GONG_SECRET_KEY, GONG_BASE_URL
 *
 * Usage:
 *   node .cursor/scripts/keyword-search-gong-pylon.mjs lineage dashboard
 *   node .cursor/scripts/keyword-search-gong-pylon.mjs "sync back" --source pylon --days 60
 *   node .cursor/scripts/keyword-search-gong-pylon.mjs omni --source gong --days 30 --gong-limit 40 --top 10
 *   node .cursor/scripts/keyword-search-gong-pylon.mjs metric --json
 */
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env"), quiet: true });

const DEFAULT_DAYS = 90;
const DEFAULT_TOP = 15;
const DEFAULT_PYLON_LIMIT = 50;
const DEFAULT_GONG_LIMIT = 50;
const GONG_TRANSCRIPT_BATCH = 10;
const SNIPPET_RADIUS = 90;

function usage() {
  console.error(`Usage: node .cursor/scripts/keyword-search-gong-pylon.mjs <keywords...> [options]

Options:
  --source both|pylon|gong   Which sources to search (default: both)
  --days N                   Lookback window in days (default: ${DEFAULT_DAYS})
  --top N                    Max ranked hits to print per source (default: ${DEFAULT_TOP})
  --pylon-limit N            Max Pylon issues to fetch (default: ${DEFAULT_PYLON_LIMIT})
  --gong-limit N             Max Gong calls to transcript-scan (default: ${DEFAULT_GONG_LIMIT})
  --json                     Print machine-readable JSON
  --help                     Show this help
`);
}

function parseArgs(argv) {
  const keywords = [];
  let source = "both";
  let days = DEFAULT_DAYS;
  let top = DEFAULT_TOP;
  let pylonLimit = DEFAULT_PYLON_LIMIT;
  let gongLimit = DEFAULT_GONG_LIMIT;
  let json = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      usage();
      process.exit(0);
    }
    if (a === "--json") {
      json = true;
      continue;
    }
    if (a === "--source") {
      source = String(argv[++i] || "").toLowerCase();
      if (!["both", "pylon", "gong"].includes(source)) {
        console.error(`Invalid --source: ${source}`);
        process.exit(1);
      }
      continue;
    }
    if (a === "--days") {
      days = Number(argv[++i]);
      continue;
    }
    if (a === "--top") {
      top = Number(argv[++i]);
      continue;
    }
    if (a === "--pylon-limit") {
      pylonLimit = Number(argv[++i]);
      continue;
    }
    if (a === "--gong-limit") {
      gongLimit = Number(argv[++i]);
      continue;
    }
    if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      usage();
      process.exit(1);
    }
    keywords.push(a);
  }

  if (keywords.length === 0) {
    usage();
    process.exit(1);
  }
  for (const [name, val] of [
    ["--days", days],
    ["--top", top],
    ["--pylon-limit", pylonLimit],
    ["--gong-limit", gongLimit],
  ]) {
    if (!Number.isFinite(val) || val <= 0) {
      console.error(`Invalid ${name}: must be a positive number`);
      process.exit(1);
    }
  }

  return { keywords, source, days, top, pylonLimit, gongLimit, json };
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Score plain text for keyword closeness. Higher = investigate first. */
function scoreText(text, keywords) {
  const hay = String(text || "");
  if (!hay) {
    return { score: 0, hits: 0, coverage: 0, snippet: "", matched: [] };
  }
  const lower = hay.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const matched = [];
  let hits = 0;
  const positions = [];

  for (const kw of keywords) {
    const needle = kw.toLowerCase().trim();
    if (!needle) continue;
    const re = new RegExp(escapeRegExp(needle), "gi");
    let m;
    let kwHits = 0;
    while ((m = re.exec(hay)) !== null) {
      kwHits++;
      hits++;
      positions.push(m.index);
    }
    if (kwHits > 0) matched.push(kw);
  }

  const coverage = keywords.length ? matched.length / keywords.length : 0;
  if (hits === 0) {
    return { score: 0, hits: 0, coverage: 0, snippet: "", matched: [] };
  }

  // Contiguous phrase bonus when the full query string appears
  const phrase = keywords.join(" ").toLowerCase();
  const phraseBonus = phrase.length > 0 && lower.includes(phrase) ? 25 : 0;

  // Proximity: all keywords appear within an ~80-word window
  let proximityBonus = 0;
  if (matched.length === keywords.length && keywords.length > 1) {
    const windows = [];
    for (let i = 0; i < words.length; i++) {
      const window = words.slice(i, i + 80).join(" ");
      if (keywords.every((kw) => window.includes(kw.toLowerCase()))) {
        windows.push(i);
        break;
      }
    }
    if (windows.length) proximityBonus = 20;
  }

  const density = hits / Math.max(words.length, 1);
  const score =
    hits * 3 +
    coverage * 40 +
    phraseBonus +
    proximityBonus +
    Math.min(density * 200, 15);

  // Snippet around earliest hit
  const firstPos = Math.min(...positions);
  const start = Math.max(0, firstPos - SNIPPET_RADIUS);
  const end = Math.min(hay.length, firstPos + SNIPPET_RADIUS);
  let snippet = hay.slice(start, end).trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < hay.length) snippet = snippet + "…";

  return {
    score: Math.round(score * 10) / 10,
    hits,
    coverage: Math.round(coverage * 100) / 100,
    snippet,
    matched,
  };
}

function daysAgoIso(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

function mapPylonHit({ issue, scored }) {
  return {
    source: "pylon",
    id: issue.id,
    number: issue.number,
    title: issue.title,
    state: issue.state,
    created_at: issue.created_at,
    link:
      issue.link ||
      `https://app.usepylon.com/issues?issueNumber=${issue.number}`,
    score: scored.score,
    hits: scored.hits,
    coverage: scored.coverage,
    matched: scored.matched,
    snippet: scored.snippet,
  };
}

function scorePylonIssue(issue, keywords, createdAfterMs) {
  const plain = [
    issue.title || "",
    stripHtml(issue.body_html || issue.body || ""),
  ].join("\n");
  const scored = scoreText(plain, keywords);
  if (scored.score <= 0) return null;
  if (createdAfterMs != null) {
    const created = issue.created_at ? Date.parse(issue.created_at) : NaN;
    if (Number.isFinite(created) && created < createdAfterMs) return null;
  }
  return { issue, scored, plain };
}

/** @returns {{ hits: object[], warnings: string[] }} */
async function searchPylon(keywords, { days, limit }) {
  const token = process.env.PYLON_API_TOKEN || process.env.PYLON_API;
  const baseUrl = (
    process.env.PYLON_API_BASE_URL || "https://api.usepylon.com"
  ).replace(/\/$/, "");
  if (!token) {
    throw new Error("Missing PYLON_API_TOKEN or PYLON_API in .env");
  }

  const searchText = keywords.join(" ");
  const createdAfter = daysAgoIso(days);
  const createdAfterMs = Date.parse(createdAfter);
  const hits = [];
  const warnings = [];
  let cursor = undefined;
  let pages = 0;
  let useDateFilter = true;

  async function fetchPage(withDateFilter, pageCursor, pageLimit) {
    const body = {
      search_text: searchText,
      limit: pageLimit,
    };
    if (withDateFilter) {
      body.filter = {
        field: "created_at",
        operator: "time_is_after",
        value: createdAfter,
      };
    }
    if (pageCursor) body.cursor = pageCursor;
    return fetch(`${baseUrl}/issues/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  while (hits.length < limit && pages < 10) {
    pages++;
    let res;
    try {
      res = await fetchPage(
        useDateFilter,
        cursor,
        Math.min(100, limit - hits.length)
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (hits.length) {
        warnings.push(`Pylon pagination stopped after page ${pages}: ${msg}`);
        break;
      }
      throw err;
    }

    if (!res.ok) {
      // First-page date-filter failure → retry without filter and paginate that path.
      if (pages === 1 && useDateFilter) {
        useDateFilter = false;
        warnings.push(
          "Pylon date filter rejected; falling back to search_text + client-side --days filter"
        );
        pages = 0;
        cursor = undefined;
        continue;
      }
      const errText = await res.text();
      if (hits.length) {
        warnings.push(
          `Pylon pagination stopped after page ${pages}: ${res.status} ${errText}`
        );
        break;
      }
      throw new Error(`Pylon search ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data ?? [];
    cursor = data.pagination?.cursor ?? data.cursor ?? data.next_cursor;
    const hasNext =
      data.pagination?.has_next_page ??
      data.has_next_page ??
      Boolean(cursor && rows.length > 0);

    for (const issue of rows) {
      const scored = scorePylonIssue(issue, keywords, createdAfterMs);
      if (scored) hits.push(scored);
    }

    if (!hasNext || rows.length === 0) break;
  }

  hits.sort((a, b) => b.scored.score - a.scored.score);
  return {
    hits: hits.slice(0, limit).map(mapPylonHit),
    warnings,
  };
}

function callSurface(c) {
  const m = c.metaData ?? {};
  const rawId = c.id ?? m.id ?? c.callId ?? c.mediaId ?? m.mediaId;
  return {
    id: rawId != null && rawId !== "" ? String(rawId) : undefined,
    started: c.started ?? m.started,
    duration: c.duration ?? m.duration,
    title: c.title ?? m.title,
    parties: c.parties ?? [],
  };
}

function transcriptToPlain(transcript) {
  const turns = transcript.transcript ?? [];
  return turns
    .map((u) => (u.sentences ?? []).map((s) => s.text ?? "").filter(Boolean).join(" "))
    .filter(Boolean)
    .join(" ");
}

/** Max extensive pages to walk before picking the newest `--gong-limit` calls. */
const GONG_LIST_MAX_PAGES = 20;

/** @returns {{ hits: object[], warnings: string[] }} */
async function searchGong(keywords, { days, limit }) {
  const accessKey = process.env.GONG_ACCESS_KEY;
  const secretKey = process.env.GONG_SECRET_KEY;
  const baseUrl = (process.env.GONG_BASE_URL || "https://api.gong.io").replace(
    /\/$/,
    ""
  );
  if (!accessKey || !secretKey) {
    throw new Error("Missing GONG_ACCESS_KEY or GONG_SECRET_KEY in .env");
  }
  const auth = `Basic ${Buffer.from(`${accessKey}:${secretKey}`).toString("base64")}`;

  async function request(path, body) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Gong API ${res.status}: ${await res.text()}`);
    }
    return res.json();
  }

  const fromDateTime = daysAgoIso(days);
  const toDateTime = nowIso();
  const allCalls = [];
  const warnings = [];
  let cursor = null;
  let pages = 0;

  // Collect across pages, then keep the newest N — pagination order is not reliable.
  while (pages < GONG_LIST_MAX_PAGES) {
    pages++;
    const body = {
      filter: { fromDateTime, toDateTime },
      contentSelector: {
        context: "Extended",
        exposedFields: { parties: true },
      },
    };
    if (cursor) body.cursor = cursor;
    let data;
    try {
      data = await request("/v2/calls/extensive", body);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (allCalls.length) {
        warnings.push(`Gong list pagination stopped after page ${pages}: ${msg}`);
        break;
      }
      throw err;
    }
    const page =
      data.calls ??
      data.records?.calls ??
      (Array.isArray(data.records) ? data.records : []);
    cursor = data.cursor ?? data.records?.cursor ?? null;
    for (const c of page) {
      const surf = callSurface(c);
      if (!surf.id) continue;
      allCalls.push(surf);
    }
    if (!cursor || page.length === 0) break;
  }

  if (pages >= GONG_LIST_MAX_PAGES && cursor) {
    warnings.push(
      `Gong list capped at ${GONG_LIST_MAX_PAGES} pages (~${allCalls.length} calls); narrow --days if recent calls look missing`
    );
  }

  allCalls.sort((a, b) =>
    String(b.started || "").localeCompare(String(a.started || ""))
  );
  const calls = allCalls.slice(0, limit);

  const byId = new Map(calls.map((c) => [c.id, c]));
  const hits = [];
  const ids = calls.map((c) => c.id);

  for (let i = 0; i < ids.length; i += GONG_TRANSCRIPT_BATCH) {
    const batch = ids.slice(i, i + GONG_TRANSCRIPT_BATCH);
    let data;
    try {
      data = await request("/v2/calls/transcript", {
        filter: { callIds: batch },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      warnings.push(
        `Gong transcript batch failed at offset ${i} (${batch.length} calls): ${msg}`
      );
      // Keep hits from earlier batches; stop further transcript fetches.
      break;
    }
    const transcripts = data.callTranscripts ?? [];
    for (const t of transcripts) {
      const callId = String(t.callId ?? "");
      const meta = byId.get(callId);
      const plain = transcriptToPlain(t);
      const scored = scoreText(plain, keywords);
      if (scored.score <= 0) continue;
      hits.push({
        source: "gong",
        id: callId,
        title: meta?.title,
        started: meta?.started,
        duration_sec: meta?.duration,
        participants: (meta?.parties ?? [])
          .map((p) => p.name || p.emailAddress)
          .filter(Boolean),
        score: scored.score,
        hits: scored.hits,
        coverage: scored.coverage,
        matched: scored.matched,
        snippet: scored.snippet,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return { hits, warnings };
}

function printHuman(result, top) {
  const { keywords, days, pylon, gong, errors } = result;
  console.log(`Keywords: ${keywords.join(" | ")}`);
  console.log(`Window: last ${days} days`);
  console.log("");

  if (errors?.length) {
    for (const e of errors) console.error(`! ${e}`);
    console.log("");
  }

  if (pylon) {
    console.log(`=== Pylon (top ${Math.min(top, pylon.length)} of ${pylon.length} scored) ===`);
    if (pylon.length === 0) {
      console.log("(no keyword hits)");
    } else {
      for (const [i, h] of pylon.slice(0, top).entries()) {
        console.log(
          `${i + 1}. [#${h.number}] score=${h.score} hits=${h.hits} coverage=${h.coverage}  ${h.title}`
        );
        console.log(`   ${h.link}`);
        console.log(`   matched: ${h.matched.join(", ")}`);
        console.log(`   … ${h.snippet}`);
        console.log("");
      }
    }
  }

  if (gong) {
    console.log(`=== Gong (top ${Math.min(top, gong.length)} of ${gong.length} scored) ===`);
    if (gong.length === 0) {
      console.log("(no keyword hits in scanned transcripts)");
    } else {
      for (const [i, h] of gong.slice(0, top).entries()) {
        const mins =
          h.duration_sec != null ? `${Math.round(h.duration_sec / 60)}m` : "?";
        console.log(
          `${i + 1}. [call ${h.id}] score=${h.score} hits=${h.hits} coverage=${h.coverage}  ${h.started || "?"} (${mins})`
        );
        if (h.title) console.log(`   title (citation only): ${h.title}`);
        if (h.participants?.length) {
          console.log(`   participants: ${h.participants.join(", ")}`);
        }
        console.log(`   matched: ${h.matched.join(", ")}`);
        console.log(`   … ${h.snippet}`);
        console.log("");
      }
    }
  }

  console.log(
    "Next: deep-dive only high-score hits (Pylon get_issue_messages / Gong full transcript)."
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const errors = [];
  let pylon = undefined;
  let gong = undefined;

  if (opts.source === "both" || opts.source === "pylon") {
    try {
      const result = await searchPylon(opts.keywords, {
        days: opts.days,
        limit: opts.pylonLimit,
      });
      pylon = result.hits;
      for (const w of result.warnings) errors.push(w);
    } catch (err) {
      errors.push(`Pylon: ${err instanceof Error ? err.message : String(err)}`);
      pylon = [];
    }
  }

  if (opts.source === "both" || opts.source === "gong") {
    try {
      const result = await searchGong(opts.keywords, {
        days: opts.days,
        limit: opts.gongLimit,
      });
      gong = result.hits;
      for (const w of result.warnings) errors.push(w);
    } catch (err) {
      errors.push(`Gong: ${err instanceof Error ? err.message : String(err)}`);
      gong = [];
    }
  }

  const pylonOut = pylon?.slice(0, opts.top);
  const gongOut = gong?.slice(0, opts.top);

  const result = {
    keywords: opts.keywords,
    days: opts.days,
    top: opts.top,
    scanned: {
      pylon_limit: opts.pylonLimit,
      gong_limit: opts.gongLimit,
      pylon_scored: pylon?.length,
      gong_scored: gong?.length,
    },
    pylon: pylonOut,
    gong: gongOut,
    errors: errors.length ? errors : undefined,
  };

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    // printHuman slices by top; pass full scored lists for accurate "of N" counts
    printHuman(
      {
        ...result,
        pylon,
        gong,
      },
      opts.top
    );
  }

  if (errors.length && !pylonOut?.length && !gongOut?.length) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
