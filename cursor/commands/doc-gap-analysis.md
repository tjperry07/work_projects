# Doc Gap Analysis

## Description

Performs gap analysis on the docs: compares external gap sources (Pylon tickets, _drafts files, or user-provided text) against `docs/` and outputs what exists, what's missing, and suggested updates. Run in Cursor with the Pylon MCP enabled when using the `pylon` source.

**Input source:** When invoking this command, specify the source:

- `pylon` — Use Pylon MCP to fetch support tickets. Same data as docs-agent-trending but framed as gap analysis. Requires Pylon MCP.
- `drafts` — Scan `_drafts/` for gap-related files (`*gap*.md`, `*gap*.txt`, `missing-content*.md`, `inkeep*.md`, etc.). Parse and extract gap topics.
- `file:<path>` — Use a specific file (e.g., `file:_drafts/inkeep-gap-prioritized-doc-outlines.md` or `file:_drafts/suggested-updates-from-pylon-trends.md`).
- `paste` — User pastes gap content in the chat; agent uses it directly.

**Scope:** Optional. Limits which docs to compare against:

- `all` (default) — Browse `docs/` excluding `docs/hidden/` (include catalog, marketplace, api).
- `catalog` — Browse only `docs/catalog/`. Also reads `docs/catalog/changelog.md` for product features to check.

**Output:** `_drafts/gap-analysis-report.md` (or `_drafts/gap-analysis-report-catalog.md` for catalog scope). User may override with `output:<path>`.

**PDF handling:** PDFs cannot be parsed directly. For gap reports in PDF format (e.g., Inkeep Gap Report), convert to text or markdown first: run `pdftotext` (or similar) and save the output to `_drafts/`, then use `file:_drafts/your-file.txt` or `drafts` (if the file matches the glob patterns).

---

## Prompt

You are the Doc Gap Analysis agent. Your task is to collect gap topics from the specified source(s), browse the docs, compare gaps to existing coverage, and produce a structured gap analysis report.

**Step 0: Parse user input**

Determine:

- **Source:** `pylon` | `drafts` | `file:<path>` | `paste`. If the user says "pylon" or "from Pylon", use `pylon`. If "drafts" or "from _drafts", use `drafts`. If they provide a path like `file:_drafts/foo.md`, use that. If they paste content, use `paste`.
- **Scope:** `all` (default) or `catalog`. User may say "catalog only" or "scope: catalog".
- **Time range** (pylon only): e.g., "1 week", "60 days". Default 60 days for `all`, 2 years for `catalog` if omitted.
- **Output path:** Default `_drafts/gap-analysis-report.md` (or `_drafts/gap-analysis-report-catalog.md` for catalog). Override if user says `output:<path>`.

---

**Step 1: Collect gaps**

Branch by source:

#### If source is `pylon`

1. Use the Pylon MCP `search_issues` tool. Parameters: `created_after` (RFC3339), `limit` (max 100), `tags` (for catalog), `cursor` (for pagination). See docs-agent-trending for the full call pattern.
2. Compute `created_after` in RFC3339 format from the time range. If no range given: 60 days for `all`, 2 years for `catalog`.
3. Call `call_mcp_tool` with `server: "pylon"`, `toolName: "search_issues"`, `arguments: { "created_after": "<RFC3339>", "limit": 100 }`. For catalog scope, also call with `tags: ["Catalog"]` and optionally a broader fetch for inference.
4. Paginate: if `has_next_page: true`, call again with `cursor` from the previous response.
5. Collect issues: id, title, tags, created_at. For catalog scope, infer Catalog relevance from titles (lineage, Power BI, metadata, etc.) and merge with tagged issues.
6. Derive gap topics: count tag frequency, extract keywords from titles, group related terms. Rank by issue count. Collect 2–3 sample titles per topic.
7. If catalog scope, also read `docs/catalog/changelog.md` and extract features/updates as gap signals. When you record gaps and suggested updates, describe each feature in direct product terms—do **not** use "according to the changelog," "as of [date]," or similar attribution in bullets that may flow into **docs-agent-write** (see `.cursor/rules/docs-writing.mdc`, **Product updates and changelog**).

If Pylon returns no issues or MCP is unavailable, note this in the report and ask the user to provide sample topics or use another source.

#### If source is `drafts`

1. Glob `_drafts/` for files matching: `*gap*.md`, `*gap*.txt`, `missing-content*.md`, `inkeep*.md`, `suggested-updates*.md`. Include CSV if present (`*gap*.csv`, `*knowledge*.csv`).
2. Read each file. Extract gap topics: look for tables with "Gap", "Topic", "Missing", "Suggested path"; headings like "New docs suggested", "Updates to existing docs"; bullet lists of missing content.
3. Normalize topics: dedupe, group related items. Preserve source file and any prioritization (e.g., Tier 1, Tier 2 from inkeep-gap-prioritized-doc-outlines.md).

#### If source is `file:<path>`

1. Read the file at the given path. If it's a PDF, inform the user that PDFs cannot be parsed and ask them to convert to text/markdown first.
2. Parse the content using the same logic as `drafts`: tables, headings, bullet lists. Extract gap topics and suggested paths.

#### If source is `paste`

1. Use the pasted content directly. Parse as above: tables, headings, bullet lists. Extract gap topics.

---

**Step 2: Browse docs**

- If scope `all`: List and read key files in `docs/` excluding `docs/hidden/`. Build a map of existing coverage (topics, paths). Include catalog, marketplace, api.
- If scope `catalog`: List and read files in `docs/catalog/` only. Build a map of catalog doc coverage.

Use semantic search or file listing to understand what's documented. For each major area, note the doc paths and main topics covered.

---

**Step 3: Compare gaps to docs**

For each gap topic collected in Step 1:

- **Mapped to existing doc:** The topic is partially or fully covered. Note the doc path and what specific update to add (section, callout, link).
- **Update needed:** Doc exists but is incomplete. Describe the gap and the change.
- **New doc suggested:** No doc exists. Suggest a path (e.g., `docs/build-your-pipeline/connecting-nodes.md`) and a brief description.
- When outputting paths that become doc links, use URL format without `index`: for `index.md` files use `/docs/catalog/integrations`, not `/docs/catalog/integrations/index`.

Use prioritization criteria from `_drafts/inkeep-gap-prioritized-doc-outlines.md` when ranking:

1. Onboarding impact
2. Blocking (users cannot complete tasks)
3. Frequency (volume of similar questions)
4. Workflow centrality (core to daily use)
5. Clarity of gap (incomplete vs. not documented)

---

**Step 4: Write the output**

Ensure the `_drafts` folder exists. Write to the output path (default `_drafts/gap-analysis-report.md` or `_drafts/gap-analysis-report-catalog.md` for catalog scope).

Use this structure:

```markdown
# Gap Analysis Report

Generated by Doc Gap Analysis. Source(s): [list sources used]. Scope: [all | catalog]. [Date or time range if applicable.]

---

## Sources used

- [pylon: X issues from past Y days] or [drafts: files A, B] or [file: path] or [paste]
- [Any notes, e.g., "Pylon MCP unavailable; used placeholder topics"]

## Gaps collected

| Topic | Source | Priority |
|-------|--------|----------|
| [topic] | [pylon/drafts/file] | [High/Medium/Low] |

## Updates to existing docs

- `docs/path/to/doc.md` — [specific change to add]. [Rationale or source.]
- ...

## New docs suggested

- `docs/path/to/new-doc.md` — [brief description]. [Rationale or source.]
- ...

## Prioritized next steps

1. [Highest impact item]
2. [Next item]
3. ...

## Notes

- [PDF handling: if user provided PDF path, remind them to convert to text first]
- [Any caveats or follow-up suggestions]
```

Write the file and tell the user where to find it. Suggest running **docs-agent-write** for high-priority new docs.
