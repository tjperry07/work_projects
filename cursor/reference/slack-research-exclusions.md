# Slack research: priority channels and exclusions

Docs agents search Slack for **human product, support, and sales-engineering discussion**. Search **priority channels first**, then broaden only when needed. Always post-filter against the ignore list.

## Phase 1 — Priority channels (search these first)

Run topic keyword searches (with `after:YYYY-MM-DD`, 90 days ago) **scoped with `in:`** before any workspace-wide search.

**Always search first:**

- `#ask-support`
- `#team-sales-eng`

**Then search `#ask-*` and `#team-*` channels:**

1. Call `slack_search_channels` with `query: "ask"` and `query: "team"` (`limit: 20` each, `response_format: "concise"`).
2. Keep channels whose names start with **`ask-`** or **`team-`** (include `#ask-support` and `#team-sales-eng` if not already in the list).
3. Run one scoped search per discovered channel: `{keywords} in:{channel-name} after:YYYY-MM-DD`.
4. **Cap prefix passes at 10 channels total** (beyond the two fixed channels). Stop early when you already have substantive hits.

Use MCP params on every search: `include_context: false`, `response_format: "concise"`, `limit: 10`, `include_bots: false`.

## Phase 2 — Other channels (only if Phase 1 is thin)

Run workspace-wide keyword search only when priority channels did not surface enough context. Post-filter every hit against the ignore list below. At most **2** broad query variants.

Do **not** append dozens of `-in:` clauses to broad queries—post-filter instead.

## Ignore list (post-filter every hit)

Drop results from channels whose names match any of:

- **`feed-*`** — automated feeds (alerts, CRM, ticketing, GitHub Actions, product releases, support mirrors, Datadog, Linear sync, and similar)
- **`feature-*`** — feature-team or initiative channels (not primary support/sales-eng Q&A)

If a hit matches the ignore list, **discard it**. Do not call `slack_read_thread` or `slack_read_channel` on ignored channels.

## Drill-down

Use `slack_read_thread` only for **priority or Phase 2 hits** that survived the ignore list. Prefer thread over full channel reads.

## Commands that intentionally read feeds

Do **not** apply these rules when another command **targets** a specific feed:

- `/docs-agent-proactive` → `#feed-product-releases`
- `/docs-agent-release-notes` → `#project-node-types`
- `/docs-agent-topic-documentation-*` → `#topic-documentation` (read workflow channel only; do not search it during general research)
