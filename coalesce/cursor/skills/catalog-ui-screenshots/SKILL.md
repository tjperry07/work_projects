---
name: catalog-ui-screenshots
description: >-
  Capture Catalog (app.castordoc.com) UI screenshots for documentation using
  Playwright MCP (preferred) or browser MCP, then wire them into Docusaurus
  markdown. Use when documenting a
  Catalog page walkthrough, refreshing product screenshots, or replacing stale
  images in docs/catalog/.
---

# Catalog UI screenshots for documentation

Use this skill when you need accurate, in-product screenshots for Coalesce Catalog docs (`docs/catalog/`). Follow the workflow below before writing or updating markdown.

## When to use

- Documenting how a Catalog surface works (navigation, lists, detail pages).
- Replacing outdated images under `static/img/catalog/assets/`.
- A user provides a URL (for example `https://app.castordoc.com/viz`) and wants a walkthrough with screenshots.

## Prerequisites

1. **Playwright MCP** configured in `.cursor/mcp.json` and the user logged into [Catalog](https://app.castordoc.com). Use **`CallMcpTool`** server **`playwright`** or **`project-0-coalesce-docs-playwright`** for captures in **`/docs-agent-pipeline-builder`**, **`/docs-agent-guide-author`**, and **`/docs-agent-guide-verify`** (read-only for author/verify except builder phase)—see [`.cursor/reference/browser-mcp-setup.md`](../../reference/browser-mcp-setup.md). Read [`.cursor/reference/cursor-ide-browser-tools/INSTRUCTIONS.md`](../../reference/cursor-ide-browser-tools/INSTRUCTIONS.md) and each tool schema from the MCP filesystem before calling `browser_*` tools.
2. **Target doc** identified (for example `docs/catalog/assets/dashboards.md`).
3. **Walkthrough plan** agreed or inferred: start at a menu item, drill down, open detail pages. List every screenshot you need *before* capturing (see template at the end).

## Phase 1: Plan the walkthrough

Write the doc as a **user journey**, not internal taxonomy.

1. **Entry point** — Which left-nav item? (for example **Dashboards**, **Data**, **Knowledge**.)
2. **Hub view** — What appears on the left vs right? List every **column** in tables and what it means.
3. **Filters** — What happens when the user clicks a child in the left tree (integration, folder, connection)?
4. **Detail pages** — For each asset type opened, list tabs and the **Details** panel fields.
5. **Cross-links** — Which other docs to link ([Tables](/docs/catalog/assets/tables), [Knowledge](/docs/catalog/assets/knowledge), [Reports](/docs/catalog/assets/reports), integrations, pinned assets).

Use **one integration as a worked example** only when it clarifies folder names (for example Tableau **Data Sources** vs **default**). Lead with product-neutral language everywhere else.

Avoid internal API names (**tile**, **viz model**, `TILE`, `VIZ_MODEL`) in user-facing prose unless quoting the UI label.

## Phase 2: Capture screenshots in the browser

### Browser workflow (Playwright MCP)

```
1. CallMcpTool → server playwright (or project-0-coalesce-docs-playwright)
2. browser_navigate → target URL
3. Wait until list or detail renders: browser_wait_for when available; otherwise sleep 2–4s + browser_snapshot until title/refs match (not generic "Coalesce Catalog")
4. browser_snapshot → read refs and page title
5. browser_scroll scrollIntoView → when alt or step cites below-the-fold content (Technical Definition, Pinned Assets, expanded lineage Parents)
6. Dismiss overlays (Related Assets popovers, join tooltips) before capture
7. browser_take_screenshot → descriptive filename
8. Copy PNG to static/img/catalog/assets/ and open the file to confirm it matches the step before wiring markdown
9. Repeat for each step in the plan
```

**Expand collapsed nav:** If integrations or folders are missing from the snapshot, click the parent item (for example **Dashboards**) once to expand the tree, then snapshot again.

**Stale refs:** After navigation, always take a fresh `browser_snapshot` before `browser_click`. If click fails, snapshot and use new refs.

**Wait for detail pages:** URL may change before content loads (for example `/viz-models/.../home`). Wait 2s, snapshot, confirm title changed (for example `Application_Users - Data Source`), then screenshot.

**Locking:** Lock only if you need a long multi-step sequence; unlocking is optional at the end.

### What to include in each screenshot

| Shot type | Capture |
|-----------|---------|
| Hub | Left nav + right list + column headers |
| Integration selected | Expanded folders under integration + filtered list + breadcrumbs |
| Folder list | Breadcrumbs + at least two rows with different icons |
| Detail page | Active tab, main content, **Details** panel on the right |
| Same page, different region | Scroll capture when step cites **Pinned Assets**, **Technical Definition**, or a formula block not visible at page load |
| Lineage | **Parents** group **expanded** with named warehouse tables visible—not only a collapsed count row |
| Columns | Column filter applied; no hover popover obscuring the named column |
| Compare | Parent vs child asset (workbook vs view) in separate shots |

Crop is automatic (viewport). Widen the window if the Details panel is cut off.

### Screenshot naming

Use lowercase, underscores, and a shared prefix for the doc:

```
{area}_{view}.png
```

Examples from the Dashboards walkthrough:

| Filename | Shows |
|----------|--------|
| `dashboards_hub.png` | Dashboards expanded, all integrations, full list |
| `dashboards_integration.png` | One integration selected, folder tree |
| `dashboards_data_sources_folder.png` | Data Sources subfolder list |
| `dashboards_data_source_detail.png` | Data source **Home** + Details |
| `dashboards_project_folder.png` | Project folder (`default`) with mixed icons |
| `dashboards_workbook_folder.png` | Workbook folder with two row types |
| `dashboards_workbook_detail.png` | Workbook **Read Me** + Details |
| `dashboards_view_detail.png` | View/sheet **Read Me** + Details |

Do not use `Screen Shot 2023-...` or generic `Screenshot` names for new assets.

## Phase 3: Install images in the repo

Copy from the browser temp path into the repo (adjust source path if the tool reports a different location):

```bash
cp "/var/folders/.../cursor/screenshots/{filename}.png" \
  "/Users/tatiana/Documents/coalesce-docs/static/img/catalog/assets/{filename}.png"
```

Or copy all shots for a page in one command. Verify files exist:

```bash
ls -la static/img/catalog/assets/dashboards_*.png
```

## Phase 4: Wire into markdown

### Image markdown (project convention)

```markdown
<img src="/img/catalog/assets/dashboards_hub.png" alt="Short factual description of what the reader should notice" className="mdImages" />
```

- **Alt text:** Describe what to look at (breadcrumbs, columns, active tab), not "screenshot of page."
- Place each image **immediately after** the prose for that step.
- Prefer one image per major step; avoid duplicating the same UI state.

### Prose pattern per step

For each screenshot section use this order:

1. **Where to click** (left nav path).
2. **What changes** on the right (list filter, breadcrumbs).
3. **Table** for columns, tabs, or icon meanings.
4. **Image**.
5. **Optional:** Link to related docs.

### Reference: Dashboards walkthrough map

Use `docs/catalog/assets/dashboards.md` as the canonical example of this pattern:

| Step | Nav path | Screenshot |
|------|----------|------------|
| Hub | **Dashboards** | `dashboards_hub.png` |
| Integration | **Dashboards** > {Integration} | `dashboards_integration.png` |
| Data sources list | … > **Data Sources** > {folder} | `dashboards_data_sources_folder.png` |
| Data source page | Click row | `dashboards_data_source_detail.png` |
| Project folder | … > {project} (not Data Sources) | `dashboards_project_folder.png` |
| Workbook folder | … > {workbook} | `dashboards_workbook_folder.png` |
| Workbook detail | Click workbook row | `dashboards_workbook_detail.png` |
| View detail | Click view row | `dashboards_view_detail.png` |

### Reference: Catalog trace investigation (`docs/guides/trace-metrics-and-dashboards-in-catalog.md`)

Use this map when authoring or refreshing the trace-metrics guide. **One demo thread** across all shots; confirm **lineage is populated** before save.

| Step / claim | User action | Filename pattern | Must be visible |
|--------------|-------------|------------------|-----------------|
| Knowledge hub | **Knowledge** left nav → `/terms` | `trace_guide_knowledge_hub.png` | Glossary sections list |
| Metrics Glossary | Open **Metrics Glossary** | `trace_guide_metrics_glossary.png` | Glossary **Read me** (parent page—not the metric) |
| Metric definition | **Subpages & Map** → **Fare Revenue Per Mile** → **Read me**; scroll to **Technical Definition** | `trace_guide_knowledge_metric.png` | Breadcrumb ends **Fare Revenue Per Mile**; formula `SUM(fare_revenue) / SUM(trip_distance)`; **Mentioned in** **NY Taxi Overview** |
| Dashboards hub | **Dashboards** | `trace_guide_dashboards_hub.png` | Integration tree + list |
| Dashboard narrative | Open **NY Taxi Overview** **Read me** (top) | `trace_guide_dashboard_readme.png` | **Dashboard Purpose**—not **Pinned Assets** |
| Pinned shortcuts | Scroll **Read me** to **Pinned Assets** | `trace_guide_dashboard_pinned_assets.png` | **Fare Revenue Per Mile** + **FCT_YELLOW_CAB_TRIPS** pins |
| Lineage | **Lineage** tab; expand **Parents** | `trace_guide_dashboard_lineage.png` | Named tables under **NY_TAXI** > **GOLD** expanded |
| Columns | Open **FCT_YELLOW_CAB_TRIPS** **Columns**; filter `FARE` or `TRIP` one term at a time | `trace_guide_table_columns.png` | Filter text + target column row; no **Related Assets** overlay |
| Home / Advanced Search | **Home** search + **Search** → `/results` | `trace_guide_home_search.png` / `trace_guide_advanced_search.png` | Ask/**Search** on home; results + **Filters** on results page |
| AI (optional) | **AI Assistant** | `trace_guide_ai_assistant.png` | AI Search landing |

**Do not** use dashboards with empty **Lineage** as the primary worked example when steps describe **Parents** > warehouse tables.

## Phase 5: Verify

1. **Files:** Every `src="/img/..."` path has a file under `static/img/catalog/assets/`.
2. **Lint:** `npx markdownlint-cli2 "docs/catalog/assets/{file}.md"` (or rely on editor lints).
3. **Build (optional):** `npm run build` if you changed many links or paths.
4. **Accuracy:** Spot-check alt text against screenshots; column names must match the live UI.
5. **Screenshot–guide alignment:** For each image, open the PNG and the **numbered step directly above it**. Confirm asset names (metric, dashboard, table), nav path, tabs, and **bold** control labels in prose match what is visible. Re-capture or rewrite step + `alt` on any mismatch. Full rules: [`.cursor/reference/guide-quality-rubric.md`](../../reference/guide-quality-rubric.md) (**Screenshot–guide alignment**); enforced by `/docs-agent-guide-author` and `/docs-agent-guide-verify`.

## Screenshot plan template (copy for new pages)

Fill this in before capturing:

```markdown
## Screenshot plan: {Page name}

**Doc file:** docs/catalog/assets/{file}.md
**Start URL:** https://app.castordoc.com/{path}
**Example integration (if any):** {name}

| # | User action | Expected UI (asset name, tab, button labels) | Filename | Alt text focus |
|---|-------------|-----------------------------------------------|----------|----------------|
| 1 | | | | |
| 2 | | | | |

**Columns to document:** Name, Description, Popularity, …
**Tabs to document:** Home, Read Me, Lineage, …
**Details panel fields:** Owners, Popularity, Mentioned in, …
**Related doc links:** Tables, Knowledge, Reports, …
```

## Pitfalls (from Dashboards work)

| Pitfall | Fix |
|---------|-----|
| Two **default** links under one integration | Read breadcrumbs; **Data Sources** > default is modeling assets; integration > **default** is project dashboards. |
| List shows all assets at hub | Expected; document that filtering requires clicking an integration. |
| Icon labels confuse readers | Document icons in a table on the folder list step; avoid jargon (**tile**, **viz model**). |
| Page title is the real type label | Example: `Dashboard 1 - Tile` in browser title; user-facing doc can say "view" or quote UI if needed. |
| Main content not loaded | `browser_wait_for` + snapshot until refs count > 20 and title is not generic `Coalesce Catalog`. On Playwright, use **sleep + snapshot** if `browser_wait_for` is unavailable. |
| Knowledge hub 404 | Navigate to **`https://app.castordoc.com/terms`**, not `/knowledge`. |
| Advanced Search shows home widgets | After typing on **Home**, click the **Search** arrow or open `/results?q=…`—do not screenshot the widget dashboard as "Advanced Search." |
| Metric shot looks like Glossary parent | Breadcrumb must end with the **metric name**; scroll to **Technical Definition** so the formula is in the crop. |
| Dashboard Read me alt mentions Pinned Assets | Capture **two** files: top (**Dashboard Purpose**) and scrolled (**Pinned Assets**). |
| Lineage alt says expanded Parents | Expand the schema group before capture; collapsed "N Tables" rows fail verify. |
| Column screenshot has popover | Collapse row or click away from **Joins** / **Related Assets** before `browser_take_screenshot`. |

## Checklist before marking done

- [ ] Walkthrough follows click path a new user would take
- [ ] Every list view documents all column headers
- [ ] Every detail view documents tabs + Details panel
- [ ] Screenshots use `{topic}_*.png` naming in `static/img/catalog/assets/`
- [ ] Images referenced in markdown with `className="mdImages"`
- [ ] Cross-links to related Catalog docs at end of walkthrough or in a table
- [ ] Every screenshot matches the step above it (asset names, control labels, nav)—no prose/image drift
- [ ] No drive-by edits to unrelated docs or images
