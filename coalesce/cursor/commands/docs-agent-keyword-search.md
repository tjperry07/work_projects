# Docs Agent: Keyword Search (Gong + Pylon)

## Description

Lightweight **keyword-in-text** search across **Pylon** issue bodies and **Gong** call transcripts. Use this when you want a ranked hit list before deep-diving — not the full multi-source `/docs-agent-research` playbook.

**When to use:** Topic discovery, “have customers talked about X?”, triage before writing. Prefer this over research when you only need Gong/Pylon signal.

**When not to use:** Full docs research with Slack, Notion, Linear, GitHub, GitLab, and vendor docs — use `/docs-agent-research` instead.

## Prompt

You are running a **light keyword search**. Do not pull hundreds of issues or transcripts into the chat. Run the script, rank by score, then deep-dive only the strongest hits.

### Step 1: Parse input

From the user message, extract:

- **Keywords** — one or more terms/phrases (required). Prefer the user’s exact wording; add at most 1–2 short synonyms only if the first pass is empty.
- **Source** — `both` (default), `pylon`, or `gong` if the user names one.
- **Days** — lookback window (default **90**). Honor shorter windows when asked (e.g. 30).
- **Top** — how many hits to show per source (default **15**).

### Step 2: Run the script (primary path)

From the repo root, run:

```bash
node .cursor/scripts/keyword-search-gong-pylon.mjs <keywords...> --source <both|pylon|gong> --days <N> --top <N>
```

Examples:

```bash
node .cursor/scripts/keyword-search-gong-pylon.mjs lineage dashboard --days 90 --top 15
node .cursor/scripts/keyword-search-gong-pylon.mjs "sync back" bigquery --source pylon --days 60
node .cursor/scripts/keyword-search-gong-pylon.mjs omni --source gong --days 30 --gong-limit 40
```

For machine-readable output (preferred when you will post-process):

```bash
node .cursor/scripts/keyword-search-gong-pylon.mjs <keywords...> --json --days 90 --top 15
```

**Requires project-root `.env`:** `PYLON_API_TOKEN` or `PYLON_API`; `GONG_ACCESS_KEY`, `GONG_SECRET_KEY`, `GONG_BASE_URL`.

### Step 3: Present ranked hits

Summarize for the user:

1. Keywords and window used
2. **Pylon** — top hits by score: issue number, title, score, matched terms, snippet, link
3. **Gong** — top hits by score: call id, date, score, matched terms, snippet (title is citation-only; relevance is transcript text)

Do **not** paste full issue bodies or full transcripts into the reply.

### Step 4: Deep-dive only on request or clear winners

Only after the ranked list:

- **Pylon:** For the top 1–5 high-score hits the user cares about (or score clearly ahead of the rest), call MCP `get_issue` and optionally `get_issue_messages` on `project-0-coalesce-docs-pylon`.
- **Gong:** For the top 1–5 high-score call ids, call `gong_get_transcript` / `gong_get_call_details` on `project-0-coalesce-docs-gong`.

If the user only wanted the hit list, stop after Step 3.

### Constraints

- **Do not** run the research playbook’s “fetch every issue body / every transcript in a 300-item window” pattern.
- **Do not** filter Gong by call title.
- Prefer the script over inventing MCP loops; the script uses Pylon `search_text` (bodies included) and bounded Gong transcript batches with client-side scoring.
- If the script fails (missing credentials or API error), report the error and stop — do not silently fall back to a heavy MCP crawl unless the user asks.
