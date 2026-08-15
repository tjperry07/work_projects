#!/usr/bin/env node
/**
 * Import contacts from CSV into Pylon (POST /contacts or PATCH /contacts/{id} by email).
 *
 * Expected CSV headers: LAST_ACTIVITY_TIMESTAMP, USER_EMAIL, ROLE, TYPE, ORG_ID, CLOUD, REGION, LOCATION
 *
 * Env (project root `.env`):
 *   PYLON_API_TOKEN or PYLON_API — Bearer token
 *   PYLON_API_BASE_URL — optional, default https://api.usepylon.com
 *   PYLON_CF_SLUG_CLOUD / REGION / LOCATION — optional (defaults: cloud, region, location)
 *
 * Usage:
 *   node .cursor/scripts/import-pylon-contacts-from-csv.mjs [path/to.csv]
 *   node ... --limit N
 *   node ... --apply
 *   node ... --dump-contact user@example.com
 *   node ... --no-custom-fields
 *   node ... --list-contact-custom-fields
 *   node ... --post-only
 *
 * New contacts: portal_role no_access. Text custom fields from CLOUD, REGION, LOCATION.
 * Upsert: PATCH every search match for email, else POST once.
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

const DEFAULT_CSV = resolve(__dirname, "../../_drafts/pl_users.csv");
const PAUSE_MS = 1100;

function parseArgs(argv) {
  let apply = false;
  let limit = undefined;
  let noCustomFields = false;
  let listContactCustomFields = false;
  let dumpContactEmail = undefined;
  let postOnly = false;
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--apply") {
      apply = true;
      continue;
    }
    if (a === "--post-only") {
      postOnly = true;
      continue;
    }
    if (a === "--no-custom-fields") {
      noCustomFields = true;
      continue;
    }
    if (a === "--list-contact-custom-fields") {
      listContactCustomFields = true;
      continue;
    }
    if (a === "--dump-contact") {
      const em = argv[++i];
      if (!em) {
        console.error("--dump-contact requires an email");
        process.exit(1);
      }
      dumpContactEmail = em.trim();
      continue;
    }
    if (a === "--limit") {
      const n = parseInt(argv[++i], 10);
      if (!Number.isFinite(n) || n < 0) {
        console.error("Invalid --limit");
        process.exit(1);
      }
      limit = n;
      continue;
    }
    if (a.startsWith("--")) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    }
    positional.push(a);
  }
  return {
    apply,
    postOnly,
    limit,
    noCustomFields,
    listContactCustomFields,
    dumpContactEmail,
    csvPath: positional[0] ? resolve(process.cwd(), positional[0]) : DEFAULT_CSV,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function nameFromEmail(email) {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  const local = at === -1 ? trimmed : trimmed.slice(0, at);
  if (local.includes(".")) {
    return local.split(".").filter(Boolean).join(" ");
  }
  return local;
}

function plFieldSlugsFromEnv() {
  return {
    cloud: (process.env.PYLON_CF_SLUG_CLOUD || "cloud").trim(),
    region: (process.env.PYLON_CF_SLUG_REGION || "region").trim(),
    location: (process.env.PYLON_CF_SLUG_LOCATION || "location").trim(),
  };
}

function plCustomFieldsFromRow(row, slugs) {
  const fields = [];
  const cloud = (row.CLOUD ?? "").trim();
  const region = (row.REGION ?? "").trim();
  const location = (row.LOCATION ?? "").trim();
  if (cloud) fields.push({ slug: slugs.cloud, value: cloud });
  if (region) fields.push({ slug: slugs.region, value: region });
  if (location) fields.push({ slug: slugs.location, value: location });
  return fields.length ? fields : null;
}

function rowToBody(row, opts) {
  const email = (row.USER_EMAIL ?? "").trim();
  if (!email) return null;
  const name = nameFromEmail(email);
  const cf = opts.noCustomFields ? null : plCustomFieldsFromRow(row, opts.plFieldSlugs);
  const body = { email, name };
  if (cf) body.custom_fields = cf;
  return body;
}

function createPayload(body) {
  return { ...body, portal_role: "no_access" };
}

function buildContacts(rows, limit, fieldOpts) {
  const seen = new Set();
  const contacts = [];
  const duplicateLog = [];

  for (const row of rows) {
    if (limit !== undefined && contacts.length >= limit) break;
    const body = rowToBody(row, fieldOpts);
    if (!body) continue;
    const key = body.email.toLowerCase();
    if (seen.has(key)) {
      duplicateLog.push(body.email);
      continue;
    }
    seen.add(key);
    contacts.push(body);
  }

  return { contacts, duplicateLog };
}

async function searchContactIdsByEmail(baseUrl, token, email) {
  const res = await fetch(`${baseUrl}/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: { field: "email", operator: "equals", value: email },
      limit: 100,
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`contacts/search ${res.status}: ${raw.slice(0, 500)}`);
  }
  const json = JSON.parse(raw);
  const rows = Array.isArray(json.data) ? json.data : [];
  return rows.map((r) => r.id).filter(Boolean);
}

async function searchContactIdsByEmailCached(baseUrl, token, email, cache) {
  const key = email.toLowerCase();
  if (cache.has(key)) return cache.get(key);
  const ids = await searchContactIdsByEmail(baseUrl, token, email);
  cache.set(key, ids);
  return ids;
}

async function getContactById(baseUrl, token, id) {
  const res = await fetch(`${baseUrl}/contacts/${encodeURIComponent(id)}?limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`GET /contacts/${id} ${res.status}: ${raw.slice(0, 500)}`);
  }
  return JSON.parse(raw);
}

async function patchContact(baseUrl, token, id, patchBody) {
  return fetch(`${baseUrl}/contacts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchBody),
  });
}

async function postContact(baseUrl, token, body) {
  return fetch(`${baseUrl}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function main() {
  const {
    apply,
    postOnly,
    limit,
    csvPath,
    noCustomFields,
    listContactCustomFields,
    dumpContactEmail,
  } = parseArgs(process.argv.slice(2));
  const token = process.env.PYLON_API_TOKEN || process.env.PYLON_API;
  const baseUrl = (process.env.PYLON_API_BASE_URL || "https://api.usepylon.com").replace(/\/$/, "");
  const plFieldSlugs = plFieldSlugsFromEnv();
  const searchCache = new Map();

  if (dumpContactEmail) {
    if (!token) {
      console.error("Missing PYLON_API_TOKEN or PYLON_API in .env");
      process.exit(1);
    }
    const ids = await searchContactIdsByEmailCached(baseUrl, token, dumpContactEmail, searchCache);
    if (!ids.length) {
      console.error(`No contact found for email: ${dumpContactEmail}`);
      process.exit(1);
    }
    if (ids.length > 1) {
      console.error(`Note: ${ids.length} contacts share this email; printing each GET below.\n`);
    }
    for (let i = 0; i < ids.length; i++) {
      if (i > 0) await sleep(PAUSE_MS);
      const json = await getContactById(baseUrl, token, ids[i]);
      console.log(JSON.stringify(json.data ?? json, null, 2));
      if (i < ids.length - 1) console.log("\n---\n");
    }
    return;
  }

  if (listContactCustomFields) {
    if (!token) {
      console.error("Missing token in .env");
      process.exit(1);
    }
    const res = await fetch(`${baseUrl}/custom-fields?object_type=contact`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const raw = await res.text();
    if (!res.ok) {
      console.error(`${res.status} ${raw.slice(0, 2000)}`);
      process.exit(1);
    }
    const json = JSON.parse(raw);
    const list = Array.isArray(json.data) ? json.data : [];
    if (!list.length) {
      console.log(JSON.stringify(json, null, 2));
      return;
    }
    for (const f of list) {
      console.log([f.slug, f.label, f.type].filter(Boolean).join("\t"));
    }
    return;
  }

  if (apply && !token) {
    console.error("Missing PYLON_API_TOKEN or PYLON_API in .env (required with --apply)");
    process.exit(1);
  }

  let text;
  try {
    text = readFileSync(csvPath, "utf8");
  } catch (e) {
    console.error(`Cannot read CSV: ${csvPath}`, e);
    process.exit(1);
  }

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    console.error("CSV parse errors:", parsed.errors);
    process.exit(1);
  }

  const rows = parsed.data;
  const fieldOpts = { plFieldSlugs, noCustomFields };
  const { contacts, duplicateLog } = buildContacts(rows, limit, fieldOpts);

  if (duplicateLog.length) {
    console.error(`Skipped ${duplicateLog.length} duplicate row(s) by email (first row kept).`);
  }

  const upsert = apply && !postOnly;
  console.error(
    `Mode: ${apply ? (upsert ? "apply (upsert)" : "POST only") : "dry-run"}. File: ${csvPath}. Contacts: ${contacts.length}${limit !== undefined ? ` (limit ${limit})` : ""}.` +
      (noCustomFields ? " No custom_fields." : ` CF: ${plFieldSlugs.cloud}/${plFieldSlugs.region}/${plFieldSlugs.location}.`)
  );

  let ok = 0;
  let fail = 0;

  if (apply && contacts.length > 0 && upsert) {
    console.error("\n--- Sample GET (first email in batch that exists) ---");
    try {
      let sid = null;
      let foundEmail = null;
      for (const c of contacts) {
        await sleep(PAUSE_MS);
        const ids = await searchContactIdsByEmailCached(baseUrl, token, c.email, searchCache);
        if (ids.length) {
          foundEmail = c.email;
          sid = ids[0];
          if (ids.length > 1) console.error(`(${ids.length} duplicates for ${c.email}; sample is first id)\n`);
          break;
        }
      }
      if (sid && foundEmail) {
        await sleep(PAUSE_MS);
        const full = await getContactById(baseUrl, token, sid);
        console.error(JSON.stringify(full.data ?? full, null, 2));
      } else {
        console.error("(none exist yet in this batch — rows will POST)\n");
      }
    } catch (e) {
      console.error("(sample failed)", e);
    }
    console.error("--- end sample ---\n");
    await sleep(PAUSE_MS);
  }

  for (let i = 0; i < contacts.length; i++) {
    const body = contacts[i];
    if (!apply) {
      console.log(JSON.stringify(createPayload(body), null, 2));
      ok++;
      continue;
    }

    let res = null;
    let multiPatchDone = false;
    try {
      if (postOnly) {
        res = await postContact(baseUrl, token, createPayload(body));
      } else {
        await sleep(PAUSE_MS);
        const existingIds = await searchContactIdsByEmailCached(baseUrl, token, body.email, searchCache);
        await sleep(PAUSE_MS);
        if (existingIds.length > 0) {
          multiPatchDone = true;
          if (existingIds.length > 1) {
            console.error(`WARN ${body.email}: ${existingIds.length} contacts share email; patching each.`);
          }
          const patchBody = { name: body.name };
          if (body.custom_fields) patchBody.custom_fields = body.custom_fields;
          let rowFail = false;
          for (let j = 0; j < existingIds.length; j++) {
            if (j > 0) await sleep(PAUSE_MS);
            const pres = await patchContact(baseUrl, token, existingIds[j], patchBody);
            const praw = await pres.text();
            if (!pres.ok) {
              rowFail = true;
              fail++;
              console.error(`FAIL ${body.email} PATCH id=${existingIds[j]} ${pres.status} ${praw.slice(0, 400)}`);
            }
          }
          if (!rowFail) {
            ok++;
            console.error(`OK ${body.email} PATCH (${existingIds.length}) ids=${existingIds.join(",")}`);
          }
        } else {
          res = await postContact(baseUrl, token, createPayload(body));
        }
      }
    } catch (e) {
      fail++;
      console.error(`FAIL ${body.email} (error)`, e);
      if (i < contacts.length - 1) await sleep(PAUSE_MS);
      continue;
    }

    if (multiPatchDone) {
      if (i < contacts.length - 1) await sleep(PAUSE_MS);
      continue;
    }

    const raw = await res.text();
    let json = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      /* ignore */
    }

    if (res.ok) {
      ok++;
      const id = json?.data?.id;
      const v = postOnly ? "POST" : "POST";
      console.error(`OK ${body.email} ${v}${id ? ` id=${id}` : ""}`);
    } else {
      fail++;
      console.error(`FAIL ${body.email} ${res.status} ${raw.slice(0, 500)}`);
    }

    if (i < contacts.length - 1) await sleep(PAUSE_MS);
  }

  console.error(`Done. ${ok} ok, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
