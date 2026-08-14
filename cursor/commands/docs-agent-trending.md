# Docs Agent: Trending

## Description

Analyzes Pylon support tickets to identify trending issues, then suggests documentation updates or new documents. Run in Cursor with the Pylon MCP enabled.

**Scope:** When invoking this command, specify the scope:

- `all` (default) — Trending across all product docs. Outputs to `_drafts/suggested-updates-from-pylon-trends.md`.
- `catalog` — Catalog product doc gaps only. Outputs to `_drafts/suggested-updates-from-catalog-pylon.md`. Uses Pylon tickets (tagged + inferred) and `docs/catalog/changelog.md`.

**Time range:** For `all` scope, specify how far back to look (e.g., `1 week`, `1 month`, `60 days`). If omitted, defaults to 60 days. For `catalog` scope, time range is optional; if omitted, uses all available data (tagged Catalog tickets + broader set with 2-year default for inference).

## Prompt

You are the Docs Agent Trending. Your task is to fetch Pylon support tickets (and for catalog scope, the catalog changelog), derive trending topics, compare them to the docs, and suggest updates or new documentation.

**Scope and time range:** The user may specify:

- A time range only (e.g., "1 month") → scope `all`, use that time range.
- `catalog` or `scope: catalog` → scope `catalog`; time range optional (if given, use it; if not, no time filter for tagged search, 2-year default for broader fetch).
- `catalog, 60 days` → scope `catalog`, use 60-day filter.

**Step 1: Fetch Pylon issues**

Use the Pylon MCP `search_issues` tool. Branch by scope:

#### If scope is `all` (default)

1. Compute `created_after` from the user's time range in RFC3339 format (e.g., for "1 week" on 2025-02-26 → `2025-02-19T00:00:00Z`; for "1 month" → ~30 days ago; for "60 days" → 60 days ago). If no range given, use 60 days.
2. Call `call_mcp_tool` with:
   - `server`: `"pylon"`
   - `toolName`: `"search_issues"`
   - `arguments`: `{ "created_after": "<RFC3339 date>", "limit": 100 }`
3. Paginate: if the response has `has_next_page: true`, call again with `cursor` from the previous response. Repeat until `has_next_page` is false.
4. Collect all issues: id, title, tags, created_at from each page.

#### If scope is `catalog`

1. Fetch tagged Catalog issues: call `search_issues` with `tags: ["Catalog"]` and optionally `created_after` if the user provided a time range. If no time range, omit `created_after` to get all tagged Catalog issues. Paginate as above.
2. Fetch a broader set for inference: call `search_issues` with no tag filter. Use `created_after` from user's time range if given; otherwise use 2 years ago as default (many untagged Catalog tickets may exist). Paginate as above.
3. Proceed to Step 1b.

If Pylon returns no issues or the MCP is unavailable, note this in the report and skip to Step 1c (catalog) or Step 3 (all) using placeholder data or ask the user to provide sample topics.

**Step 1b: Infer Catalog relevance** (catalog scope only)

From the broader set fetched in Step 1:

- Filter by analyzing titles for Catalog-related terms: lineage, Power BI, Tableau, metadata, integration, credential, AI assistant, Knowledge Map, Castor, catalog API, etc.
- Optionally call `get_issue` for ambiguous cases to inspect the body.
- Merge with tagged Catalog issues and dedupe by issue id.
- The combined set is your Catalog-related issues for analysis.

**Step 1c: Read catalog changelog** (catalog scope only)

Parse `docs/catalog/changelog.md` and extract features/updates (e.g., "Apply changes to all matching assets", "MCP Server", "Full Metadata History", "Data Product Images"). These are product changes that may need or lack documentation. Include them as signals when comparing to docs in Step 3. When you describe those features in Step 3–4, use plain product language only—do **not** write "according to the changelog," "as of [date]," or "the changelog says" in suggestion bullets; those suggestions are often pasted into **docs-agent-write** and should read like direct doc guidance, not commentary on the changelog file.

**Step 2: Derive trending topics**

From the collected issues (and for catalog scope, changelog entries):

- **Tags:** Count tag frequency across all issues. High-volume tags are strong signals.
- **Titles:** Extract keywords and phrases (e.g., "incremental refresh", "Snowflake", "Git", "workspace access", "lineage", "Power BI credentials"). Filter common stopwords. Group related terms.
- **Changelog** (catalog scope): Treat each changelog feature as a topic; check if it has doc coverage.
- **Rank:** Sort topics by issue count. Optionally sample the top 5–10 topics and call `get_issue` for full details to understand pain points and common questions.
- **Sample titles:** For each top topic, collect 2–3 representative issue titles.

**Step 3: Compare to docs**

Branch by scope:

#### If scope is `all`

- Browse `docs/` excluding **only** `docs/hidden/` (include catalog, marketplace, api).
- Map each trending topic to either:
  - An existing doc that could be updated (path + what to add), or
  - A documentation gap (suggest new doc path).

#### If scope is `catalog`

- Browse **only** `docs/catalog/`.
- Map Pylon topics and changelog entries to existing catalog docs or gaps. For each changelog feature, check whether a doc exists; if not, suggest one.
- Use prioritization criteria: onboarding impact, blocking issues, frequency, workflow centrality (see `_drafts/inkeep-gap-prioritized-doc-outlines.md` for reference).

**Step 4: Write the output**

When suggesting doc paths that could become links in docs, use URL format without `index`: e.g. `/docs/catalog/integrations` for `docs/catalog/integrations/index.md`, not `/docs/catalog/integrations/index`.

Ensure the `_drafts` folder exists. Use the output path based on scope:

- `all` → `_drafts/suggested-updates-from-pylon-trends.md`
- `catalog` → `_drafts/suggested-updates-from-catalog-pylon.md`

Create or update the file with:

#### For scope `all`

```markdown
# Suggested Doc Updates from Pylon Trends

Generated by Docs Agent Trending. Support tickets from: [time range used, e.g., past 1 week].

---

## Top trending topics
| Topic | Issue count | Sample titles |
|-------|-------------|---------------|
| [topic] | [count] | "[title1]", "[title2]" |

## Updates to existing docs
- `docs/path/to/doc.md` — [specific change to add]
- ...

## New docs suggested
- `docs/path/to/new-doc.md` — [issue count] tickets; no doc exists. [Brief description]
- ...

## Next steps
Run **docs-agent-write** with a topic above to draft a new doc.
```

#### For scope `catalog`

```markdown
# Suggested Doc Updates for Catalog (from Pylon + Changelog)

Generated by Docs Agent Trending. Catalog product docs. [Time filter: past X days / all time]. [Optional: X issues tagged Catalog, Y inferred from titles.]

---

## Top trending topics
| Topic | Issue count | Sample titles |
|-------|-------------|---------------|
| [topic] | [count] | "[title1]", "[title2]" |

## Changelog features to document
- [Feature or capability] — [suggested doc path or update]
- ...

## Updates to existing docs
- `docs/catalog/path/to/doc.md` — [specific change to add]
- ...

## New docs suggested
- `docs/catalog/path/to/new-doc.md` — [issue count] tickets; no doc exists. [Brief description]
- ...

## Next steps
Run **docs-agent-write** with a topic above to draft a new doc.
```

Write the file and tell the user where to find it.
