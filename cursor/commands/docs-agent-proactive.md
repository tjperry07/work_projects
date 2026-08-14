# Docs Agent Proactive

## Description

Compares the latest Coalesce product and Catalog releases against public-product-documentation and suggests doc updates or new documents. Run in Cursor.

**Sources tracked:**

- **GitHub** — latest release on `Coalesce-Software-Inc/coalesce` via the **GitHub MCP** (`user-github` in Cursor’s MCP list unless your install uses a different server name). Not `curl` or workspace `GITHUB_TOKEN`.
- **[changes.coalesce.io](https://changes.coalesce.io/)** — published Coalesce platform release notes.
- **[Catalog changelog](https://docs.coalesce.io/docs/catalog/changelog)** — `docs/catalog/changelog.md` in this repo (same content as the live page).
- **Slack `#feed-product-releases`** — product release announcements via the **Slack MCP** (`plugin-slack-slack` or `"slack"` per your MCP settings).

If GitHub MCP is unavailable or the connected identity cannot read the private monorepo, continue with the other sources and note the gap in the report. Local fallback: `_drafts/latest-release.*` or pasted release notes.

## GitHub access (MCP)

The agent reads releases and repo data through the **GitHub MCP**. Ensure it is enabled and signed in with an account that can access the Coalesce monorepo if it is private. Credentials come from the MCP connection, not from `GITHUB_TOKEN` in `.env` or shell profile.

## Slack access (MCP)

Use the Slack MCP for `#feed-product-releases`. Read tool schemas under Cursor MCP descriptors before calling (`slack_search_channels`, `slack_read_channel`). If Slack is unavailable, note it in the report and continue from the other sources.

## Prompt

You are the Docs Agent Proactive. Your task is to gather the latest product release signals from GitHub, [changes.coalesce.io](https://changes.coalesce.io/), the Catalog changelog, and Slack `#feed-product-releases`, then compare them against the docs in this repo and suggest updates.

**Step 1: Gather release signals**

Run **1a–1d** in parallel when possible. Collect signals from every source that is reachable; do not stop after the first success.

### Step 1a: GitHub latest release (Coalesce platform)

Use `call_mcp_tool` with server **`user-github`** (read tool schemas first; substitute the server name from your MCP settings if different). Default repository: `owner` `Coalesce-Software-Inc`, `repo` `coalesce`.

1. **Primary:** `toolName: "get_latest_release"`, `arguments: { "owner": "Coalesce-Software-Inc", "repo": "coalesce" }`. Parse `tag_name`, `name`, and `body` (release notes) from the response.
2. **Fallback if missing or not useful:** `toolName: "list_releases"`, `arguments: { "owner": "Coalesce-Software-Inc", "repo": "coalesce", "perPage": 10, "page": 1 }`. Use the first non-draft, non-prerelease item (inspect fields returned by the tool).
3. **If MCP fails or returns auth errors:** Note `<!-- GitHub release: not reachable -->` and continue with Steps 1b–1d.
4. **Local fallback:** Read from `_drafts/latest-release.md` or `_drafts/latest-release.json` if present, or ask the user to paste platform release notes.

### Step 1b: changes.coalesce.io (Coalesce platform)

1. Fetch [https://changes.coalesce.io/](https://changes.coalesce.io/) with **WebFetch** (or browser MCP when WebFetch is blocked).
2. Parse the **most recent** published release (version, date if shown, Updates, Packages, Bug Fixes, and intro text).
3. Optionally parse the **2–3 most recent** releases to catch doc gaps from recent ships not yet reflected in `docs/`.
4. If fetch fails, note `<!-- changes.coalesce.io: not reachable -->` and continue.

Cross-check Step 1a and 1b: when both are available, treat them as the same platform release surface; prefer GitHub tag/body for version identity and changes.coalesce.io for customer-facing wording and Packages sections.

### Step 1c: Catalog changelog

1. Read `docs/catalog/changelog.md` (published at [https://docs.coalesce.io/docs/catalog/changelog](https://docs.coalesce.io/docs/catalog/changelog)).
2. Extract the **most recent dated sections** (typically the latest 1–3 date headers and their feature bullets). Examples of signals: new connectors, lineage improvements, MCP tools, UI capabilities, integration coverage changes.
3. Treat each Catalog feature as a potential doc gap or update, same as **docs-agent-trending** catalog scope.

### Step 1d: Slack `#feed-product-releases`

1. Call `call_mcp_tool` with `server: "plugin-slack-slack"` (or `"slack"`), `toolName: "slack_search_channels"`, `arguments: { "query": "feed-product-releases", "channel_types": "public_channel" }` to resolve the channel ID.
2. Compute Unix timestamps: `oldest` = **4 weeks ago**, `latest` = now (adjust if the user specifies a time range).
3. Call `slack_read_channel` with `channel_id`, `oldest`, `latest`, `limit: 100`. Paginate if the tool supports it and recent volume is high.
4. Extract product release announcements: version numbers, feature names, connector launches, GA/beta notices, and links to changes.coalesce.io or other release surfaces.
5. If the channel is not found or Slack MCP is unavailable, note `<!-- Slack #feed-product-releases: not reachable -->` and continue.

**Step 2: Analyze the docs**

Review the doc structure in `docs/` (excluding only `docs/hidden/`). Include catalog, marketplace, api. Get a sense of what's documented.

**Step 3: Compare and suggest**

For **each signal** from Steps 1a–1d:

- **Platform (GitHub / changes.coalesce.io / matching Slack posts):** Does an existing doc need updates? Should a new doc be written? Check marketplace package docs when Packages sections mention new or updated packages.
- **Catalog (changelog / Catalog-related Slack posts):** Map features to `docs/catalog/` (and related integration pages). Flag missing connector guides, outdated integration steps, or new capabilities without procedural docs.
- **Dedupe:** Merge overlapping suggestions from multiple sources into one recommendation; note which sources mentioned the same change.

When outputting paths that become doc links, use URL format without `index`: for `index.md` files use `/docs/catalog/integrations`, not `/docs/catalog/integrations/index`.

State product deltas and new capabilities in plain language. Avoid "according to the release notes," "according to the changelog," or "as of [date]" in suggested changes—those phrases belong in internal discussion, not in text that will be copied into user-facing drafts (see `.cursor/rules/docs-writing.mdc`, **Product updates and changelog**).

**Step 4: Write the output**

Create or update `_drafts/suggested-updates-from-releases.md` with a markdown report:

```markdown
# Suggested Doc Updates from Release

Generated by Docs Agent Proactive. Review and apply as needed.

---

## Summary
[1-2 sentences on whether docs need updates]

## Sources checked
- GitHub latest release: [version or not reachable]
- changes.coalesce.io: [version or not reachable]
- Catalog changelog: [latest date section(s) reviewed]
- Slack #feed-product-releases: [message count or not reachable]

## Updates needed
[For each existing doc: path, specific changes, and which source(s) triggered the suggestion]

## New docs suggested
[For each new doc: topic, suggested path, and which source(s) triggered the suggestion]

## Looks good
[If no updates needed]
```

Ensure the `_drafts` folder exists. Write the file and tell the user where to find it.
