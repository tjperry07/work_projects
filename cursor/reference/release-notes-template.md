# Release Notes Template Reference

This reference captures the structure and formatting of Coalesce product release notes from [changes.coalesce.io](https://changes.coalesce.io/). Use when writing release notes.

## Section Order

1. **Header** — Version and attribution
2. **Intro paragraph** (optional) — Brief summary when needed
3. **Updates** — New features and improvements
4. **Packages** — Marketplace package updates, grouped by platform
5. **Bug Fixes** — Bug fixes and corrections

Additional sections (e.g., UI Changes, Copilot, BigQuery in Private Preview) may appear when relevant. Place them logically between intro and Bug Fixes.

## Formatting Rules

### Header

```markdown
# Version X.Y.Z

by Coalesce
```

For version ranges: `# Version 7.30.2 - v7.30.6`

### Intro Paragraph

Optional. Use for minor releases or when a single sentence suffices:

- "This release includes performance improvements and stability fixes across the platform."
- "This release includes bug fixes and performance improvements."
- "We fixed an issue where the Deploy Page would continuously spin if the user didn't have the correct RBAC permissions."

### Updates Section

```markdown
## Updates

- **Feature Name** (DOC-123): Description in a sentence or two.
- **Another Feature** (DOC-456): Another description.
```

- **Format:** `- **Feature Name** (DOC-123): Description.` Include the Linear identifier in parentheses after the feature name. (bullet list with bold titles)
- Use title case for feature names
- Descriptions are full sentences with periods
- One bullet per feature

### Packages Section

```markdown
## Packages

### BigQuery

[Package Name X.Y.Z](https://docs.coalesce.io/docs/marketplace/package/<slug>): Description.

### Databricks

[Package Name X.Y.Z](https://docs.coalesce.io/docs/marketplace/package/<slug>): Description.

### Snowflake

[Package Name X.Y.Z](https://docs.coalesce.io/docs/marketplace/package/<slug>): Description.
```

- **Platform order:** BigQuery, Databricks, Snowflake (Fabric when applicable)
- **Link format:** `[Package Name X.Y.Z](https://docs.coalesce.io/docs/marketplace/package/<slug>) (DOC-123)` — Include Linear ticket identifier in parentheses when available from the source.
- **Slug source:** Resolve from `marketplaceSidebar.js` (label → id → extract slug from `marketplace/package/<slug>`)
- **Description:** What changed in this release

### Bug Fixes Section

```markdown
## Bug Fixes

- **Fix Name** (DOC-123): Description of what was fixed.
- **Another Fix** (DOC-456): Another description.
```

- **Format:** `- **Fix Name** (DOC-123): Description.` Include the Linear identifier in parentheses after the fix name. (bullet list with bold titles)
- Same format as Updates
- Focus on customer-facing impact

## Example Entries

### Updates

- **Copilot File Upload**: Copilot now accepts file uploads and drag and drop. This makes it easier to convert existing SQL.
- **BigQuery Run Error Visibility**: BigQuery run errors are now clearly surfaced in the UI. Rows with errors are highlighted with an icon, and a badge at the top displays detailed error information on hover.
- **Workspace Settings Dropdown Icons**: Added icons for Copy Objects, Duplicate Settings, and Delete Workspace to make actions easier to recognize at a glance.
- **Builder Deep Links with Node ID**: Builder URLs now include the Node ID at `/projects/ /workspaces/ /build/nodes/`, enabling reliable deep linking directly to specific Nodes from documentation, tickets, or shared links.

### Packages

- [Base Node Types - Advanced Deploy 1.0.0](https://docs.coalesce.io/docs/marketplace/package/coalesce_bigquery_bigquery-base-node-types-advanced-deploy): Initial release.
- [External Data Package 2.1.2](https://docs.coalesce.io/docs/marketplace/package/coalesce_snowflake_external-data-package): Added support for API key authentication, including a toggle to forcibly add credentials in the request header.
- [Incremental Loading 2.1.0](https://docs.coalesce.io/docs/marketplace/package/coalesce_snowflake_incremental-loading): Added data quality support and Test Passed/Failed records node type.

### Bug Fixes

- **Authentication Type Dropdown Behavior**: Fixed an issue where the Authentication Type dropdown caret in Workspace or Environment Settings under User Credentials did not reliably open. Alignment issues in the tab were also corrected.
- **Refresh Results Missing Nodes**: SQL Nodes that do not execute SQL, such as views now appear in refresh results, ensuring the results list accurately reflects all participating nodes.
- **Storage Mapping on Partial Deployment Failures**: When deployments fail partway through, successfully deployed nodes now correctly write their location and mapping to environment metadata. This prevents environments from entering a blocked state and reduces manual intervention.

## Style Guide

- Use "We" for Coalesce; "you" for the customer
- Contractions, Oxford comma; avoid exclamation points, "please," "via"
- Capitalize Coalesce terms: Workspace, Node, Packages, Project, Job Schedule, Catalog
- Flesch-Kincaid 8–10; friendly, helpful, professional
