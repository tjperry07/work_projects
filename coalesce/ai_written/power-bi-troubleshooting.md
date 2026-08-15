---
title: "Power BI Troubleshooting in Catalog"
description: "Fix incomplete lineage, stale metadata, expired credentials, Teams and Microsoft Search deep links, and ingestion failures when Power BI connects to Coalesce Catalog. Covers wrong ingestion path versus native setup, Admin API settings, warehouse scope, semantic model authoring modes, mashup pattern matching, DAX measure expectations, schedules, and client-managed extraction."
keywords: [Power BI, Catalog, troubleshooting, lineage, Dataflows, extraction, Admin API, mashup, client secret, credentials, DAX, Databricks, semantic model, Microsoft Teams, Microsoft Search]
processed: true
---

Use this guide when lineage through Power BI Dataflows looks incomplete or stale, when you expected to find a Dataflow as a Catalog asset, when metadata in Catalog still looks wrong after you fix tenant settings, when credentials expire, or when Power BI ingestion never completes.

Work through the sections that match your situation.

## Ingestion Fails or Metadata Never Appears

Use this section when a Catalog-managed Power BI integration stays empty after the first sync window, client-managed uploads do not refresh Catalog, or your Catalog contact reports that ingestion failed because pull extraction is not supported for Power BI.

Native Power BI integrations expect the setup in [Power BI setup][]. Catalog-managed extraction uses Entra credentials in **Settings > Integrations**. Client-managed extraction uses `castor-extract-powerbi` and `castor-upload`. See [Ingestion architecture][] on the setup page for how those paths differ from [BI Importer][].

### Symptoms

You may see one or more of the following:

- A Catalog-managed integration shows no dashboards or data sets after 48 hours or longer, even when tenant admin settings match [Power BI setup][].
- `castor-extract-powerbi` finishes locally but Catalog stays stale after upload.
- Support or your Catalog team confirms ingestion failed with an error that pull extraction is not supported for Power BI.
- Ingestion errors reference an expired client secret. See [Integration Paused After Expired Credentials][].

### Likely Cause

The Power BI source is configured on Catalog's generic BI Importer ingestion path instead of the native Power BI integration path. That mismatch often follows an earlier trial upload, a custom MVP integration, or a source that was never moved to standard Entra-based setup.

When credentials are the issue instead, the Entra client secret expired or the JSON in Catalog does not match the active secret in Azure.

### What To Do

Work through these steps in order:

1. Confirm you follow [Power BI setup][] for Catalog-managed or client-managed extraction, not BI Importer CSV templates unless your Catalog team explicitly scoped a custom BI Importer integration.
2. For Catalog-managed sources, verify credentials in **Settings > Integrations** and allow up to 48 hours for the first cycle after a clean configuration. If errors mention an expired secret, follow [Integration Paused After Expired Credentials][].
3. For client-managed sources, confirm `castor-upload` uses the Source Id and token Catalog provided, that upload files match a recent `castor-extract-powerbi` run, and that your scheduler runs extract before upload.
4. If ingestion still fails immediately or your Catalog team confirms the generic path error, contact [Coalesce Support][] with your integration name and the approximate time of the failed ingestion run.

## Integration Paused After Expired Credentials

Use this section when Catalog-managed Power BI ingestion stopped after an Entra client secret expired, or when Support notified you that the integration was paused until credentials are updated.

You may see an email or Support message about an expired client secret, a paused Power BI source under **Settings > Integrations**, or search and lineage that stop updating for Power BI assets while warehouse sync continues. Ingestion errors often include text such as `The provided client secret keys for app '...' are expired.`

When authentication fails repeatedly, Catalog operations may temporarily pause the Power BI source so failed runs do not keep firing. Updating credentials in Catalog is required. Saving new credentials does not always resume a paused schedule by itself.

Work through these steps in order:

1. In the [Azure portal][], open the Catalog app registration and create a new client secret under **Manage** > **Certificates & secrets**. Copy the new **Value** before you leave the page. The secret value is shown only once.
2. In Catalog, go to **Settings > Integrations**, open the Power BI source, and choose **Edit credentials**. Update the JSON with the current `clientId`, `secret`, and `tenantId`. Use **Check credentials** when the UI offers it.
3. Reply to Support or contact [Coalesce Support][] after you save valid credentials if the integration remains paused. Catalog operations may need to re-enable the source and run ingestion again.
4. Allow one full extraction cycle before you judge search or lineage freshness.

For proactive renewal cadence and the first-sync rotation warning, see [Credential lifecycle][] on [Power BI setup][].

## Missing DAX Measure Definitions in Catalog

Use this section when field lineage shows column and measure relationships but not the complete DAX measure definition you see in Power BI Desktop.

Typical signs include field lineage that lists measure names and upstream columns but not the full DAX text from the formula bar, or asset detail and search that surface names and descriptions without the measure definition body. Admin API settings for DAX and mashup expressions can be enabled and extraction can succeed while lineage panels still omit formula text.

Catalog field lineage is built around dependency relationships in the metadata graph. Enabling **Enhance admin APIs responses with DAX and mashup expressions** is required for Power BI integration and helps lineage computation, but Catalog does not reproduce the full measure editor experience inside lineage or asset detail views. That behavior is expected when extraction is healthy. It is not the same signal as a broken integration.

To validate and work around the gap:

1. Confirm extraction completed successfully after your last model change.
2. Use **Open Field Lineage** on the semantic data set or report when you need to inspect how columns connect into measures in the graph.
3. For the full DAX definition, open the measure in Power BI Desktop or your standard authoring tools.
4. For Power Query rename behavior that affects field paths, see [Troubleshoot Power BI Lineage When Columns Are Renamed][].

For the comparison table across Power BI Desktop, field lineage, and asset detail, see [DAX, Mashup Expressions, and Field Lineage in Catalog][] on [Power BI setup][].

## Lineage or Metadata Still Looks Wrong After Admin API Changes

When **Admin API Settings** are correct but graphs or upstream paths still look empty or old, the gap is usually timing or scope rather than the toggle itself.

1. **Refresh or republish** the affected semantic data sets in Power BI so mashup and related metadata match what you expect in the service.
2. **Wait for Power BI** to show consistent metadata for those assets in the admin experience you use outside Catalog, then plan for one full Catalog extraction afterward.
3. **Confirm warehouse objects** for the same logical environment, for example DEV compared to prod, are actually in Catalog and match what the Dataflow queries.
4. **Re-run validation** only after both warehouse sync and Power BI extraction have completed successfully for that cycle.

## Lineage When Semantic Models Use Table Navigation Versus SQL

Use this section when a semantic data set appears in Catalog but shows no upstream warehouse tables, or when lineage works for one model but not another that points at the same Databricks tables.

Catalog derives Power BI to warehouse links by pattern matching exported mashup text and related metadata from Microsoft's admin APIs against tested connector and transform shapes. Catalog does not parse Power Query M. Lineage is strongest when mashup exposes an explicit SQL statement, for example through `Value.NativeQuery`, that Catalog can match to tables already synced from your warehouse integration.

### How Authoring Mode Affects Lineage

| Authoring approach in Power BI | Typical exported mashup shape | Lineage in Catalog |
| ------------------------------ | ----------------- | ------------------ |
| **Embedded or pasted SQL** in Power Query | `Value.NativeQuery` with a SQL string that references catalog, schema, and table names | Strongest path to Databricks, Snowflake, and other warehouse tables when those objects exist in Catalog |
| **Visual table navigation**, browse and select tables in the connector UI | Connector navigation steps without an explicit SQL string in exported mashup | Weaker or missing warehouse links even when the model is valid in Power BI |
| **DirectQuery or import with mixed steps** | Combination of navigation and transforms | Depends on whether exported mashup still contains explicit SQL or table paths Catalog can match |

Embedded SQL is not always practical. Some models need visual table selection, for example when you configure incremental refresh in Power BI. In those cases, warehouse lineage may be thinner or missing until metadata exposes a path Catalog can resolve.

### Validation Checklist

Work through these steps before you open a Support ticket:

1. **Confirm the warehouse side is in Catalog**  
   Open the integration for your warehouse platform, for example [Databricks][], and verify the catalog, schema, and tables the semantic model reads are in scope and synced. Lineage only connects to objects Catalog already knows about.

2. **Confirm Power BI admin settings**  
   Keep the **Admin API Settings** from [Power BI setup][] enabled for your Catalog service principal's security group, including detailed metadata and mashup expressions when your organization uses them for lineage.

3. **Refresh or republish the semantic data set**  
   Update the model in Power BI so mashup metadata matches what you expect in the service, then wait for one full Catalog extraction cycle.

4. **Compare authoring modes on a test model**  
   When policy allows, republish a copy of the model with embedded SQL that references the same warehouse tables. If lineage appears for the SQL version but not the table-navigation version, the gap is tied to exported mashup text rather than warehouse sync or credentials.

5. **Allow extraction to finish**  
   For Catalog-managed Power BI, the first sync can take up to 48 hours. After model changes, wait for at least one successful extraction before you judge lineage.

### When To Contact Support

If the checklist passes and warehouse lineage is still missing for a model that uses table navigation, contact [Coalesce Support][] with the semantic data set name, the warehouse platform, and screenshots of the Power Query steps in Power BI Desktop. Do not include credentials or connection secrets.

For a short summary on the setup page, see [Troubleshooting in Power BI setup][].

## No Upstream Lineage From a Data Set That Uses Dataflows

Check these common causes when a Dataflow-backed data set shows no upstream objects in Catalog.

- **Admin API metadata is off or scoped wrong** - If DAX and mashup expressions or detailed metadata are disabled or the security group for your Catalog service principal is missing, Catalog doesn't receive enough information to resolve Dataflow-backed tables. Fix the settings, then refresh data sets and wait for the next extraction.

- **Warehouse not in Catalog** - Lineage only connects assets Catalog already knows about. Add or expand the warehouse integration for the database your Dataflow queries, then sync again.

- **Stale Power BI metadata** - When admin settings are already correct, follow the refresh, wait, and extraction steps in [Lineage or Metadata Still Looks Wrong After Admin API Changes][] for the affected data sets.

- **Mashup pattern not matched** - If the data set's mashup does not expose both Dataflow ID and entity in a supported Power BI Dataflows or Power Platform Dataflows pattern, Catalog does not resolve lineage through that Dataflow. Compare the model's mashup to the supported patterns in [Power BI Dataflows in Catalog][], republish after changes, and wait for extraction.

For a step-by-step validation flow after you fix prerequisites, see [How to Validate Dataflow Lineage][] on [Power BI Dataflows in Catalog][].

## Lineage Is Partial or Stops at Some Columns

Column-level lineage depends on how clearly mashup text maps fields to upstream columns. Heavy merging or indirection inside the Dataflow or data set can limit column-level links even when table-level lineage appears. For column renames and `Table.RenameColumns` behavior in Power Query, see [Troubleshoot Power BI Lineage When Columns Are Renamed][]. When one entity effectively draws from multiple warehouse sources in parallel, column-level lineage can stop where Catalog cannot pick a single resolved path.

## Parameterized or Dynamic Mashup Logic

Organizations often use M parameters for environment or database names. Resolution depends on what Catalog can match in exported mashup text and metadata. If you use complex parameter wiring or highly dynamic connection logic and lineage stays incomplete after you try the other guidance in this article, contact [Coalesce Support][] with a short description of the pattern. Do not include credentials.

## Client-Managed Extraction

If you run `castor-extract-powerbi` yourself, compare your log output and output files with a recent successful run on the current extractor. If extraction completes but lineage doesn't improve, gather the run timestamp and contact [Coalesce Support][] so the team can trace ingestion with you.

## When You Cannot Tell Which Workspace an Asset Belongs To

Depending on how names are shown in lineage, you might not see the Power BI workspace at every step in the graph. When many workspaces share similar content, use consistent data set and report naming that includes the environment so you can tell assets apart.

## Dataflows Do Not Appear as Catalog Assets

Power BI Dataflows are not published as semantic models, searchable visualization models, or semantic representations in Catalog. That is expected. Catalog ingests Dataflow metadata during extraction and uses it only to compute lineage for **semantic data sets** and **reports** that load from Dataflows.

If you search for a Dataflow name under **Dashboards** or in [Catalog search][] and find no match, validate lineage from the consuming asset instead:

1. **Open the semantic data set or report** that loads from the Dataflow in Power BI, then find that same asset in Catalog under **Dashboards** or [Catalog search][].
2. **Select the Lineage tab** on that asset and expand upstream warehouse tables, as described in [Lineage in the Catalog UI][] on [Power BI Dataflows in Catalog][].
3. **Confirm the Power BI integration is healthy** in **Settings > Integrations**. A paused integration or expired secret stops lineage updates until you fix the connection. See [Integration Paused After Expired Credentials][].
4. **Allow a full extraction cycle** after admin setting or model changes. For Catalog-managed Power BI, the first ingestion can take up to 48 hours, as noted in [Ingestion Fails or Metadata Never Appears][].
5. **Work through Dataflow-backed lineage checks** in [No Upstream Lineage From a Data Set That Uses Dataflows][] and [How to Validate Dataflow Lineage][] when upstream tables are still missing.

## Users See Power BI Workspaces They Should Not

When a new user sees every Power BI workspace in Catalog, or a new workspace appears with company-wide visibility after extraction, the cause is usually default-open dashboard folder access rather than a sync or credentials problem.

Work through [Power BI workspaces and Catalog visibility][], then the Power BI items under [Assets Access Control troubleshooting][]: [New User Sees All Power BI Workspaces][] and [New Power BI Workspace Appears With Broad Access][]. If the workspace should not appear in Catalog at all, see [Scope Power BI ingestion][]. Confirm the behavior with a non-admin account in the same teams as the affected user.

## Microsoft Teams and Search Deep Links for Power BI

Use this section when users open Catalog Power BI results from Microsoft Teams, Microsoft Search, or the Catalog AI Assistant and land on a workspace report or dashboard in Power BI instead of your organization's published Power BI App.

Typical signs include one or more of the following:

- Federated search or Teams results link to a Power BI workspace report or tile dashboard URL.
- Users expected the published Power BI App entry point your organization uses for audience controls.
- App-level permissions in Power BI do not apply the way they do when users open content from the app directly.

### What Catalog Ingests and Links Today

Catalog's standard Power BI integration ingests reports, dashboards, and semantic data sets from Microsoft admin scan APIs, and reads Dataflow metadata during extraction to compute lineage. Dashboards here are tile collections Power BI exposes through admin metadata. Catalog does not ingest published Power BI Apps as a separate asset type, and Dataflows are not published as searchable Catalog assets.

For each ingested report or dashboard, Catalog stores the `webUrl` Microsoft returns in admin metadata when available. When that URL is missing, Catalog falls back to a default workspace path under `app.powerbi.com`. Catalog search, the AI Assistant, and federated Microsoft surfaces pass that stored URL through as the outbound link to Power BI. Catalog does not rewrite links to a published app URL.

:::tip[Published Power BI App vs Microsoft Entra app]

A **published Power BI App** is Microsoft's distribution package for curated reports and dashboards. The **Microsoft Entra app** you register for Catalog extraction is a separate concept used only for API access. See [Supported asset types][] on [Power BI setup][].

:::

### What You Can Do Today

1. **Limit what Catalog ingests**  
   Use [Scope Power BI ingestion][] to exclude workspaces or folders whose raw reports or dashboards should not appear in Catalog search. That removes them from federated results indexed from Catalog, not from Power BI itself.

2. **Limit who discovers assets in Catalog**  
   **Manage access** on dashboard folders restricts which teams see ingested Power BI content in Catalog browse and search. See [Assets Access Control][]. That control does not change Power BI App audience rules when someone follows an outbound link into the Power BI service.

3. **Contact Support for product requests**  
   If you need federated search to open published app URLs or to suppress individual dashboards while keeping other Power BI assets indexed, contact [Coalesce Support][]. Catalog does not expose a customer setting for app-level deep links today.

For workspace visibility defaults after ingestion, see [Users See Power BI Workspaces They Should Not][] earlier in this guide.

## What's Next?

- Review extraction modes and native versus BI Importer paths in [Ingestion architecture][].
- Walk through setup, credential lifecycle, admin settings, first sync, and table navigation versus embedded SQL in [Power BI setup][] and [Troubleshooting in Power BI setup][].
- Return to concepts, UI paths, and supported mashup patterns in [Power BI Dataflows in Catalog][].
- Fix or understand field lineage after column renames in [Troubleshoot Power BI Lineage When Columns Are Renamed][].
- Review quick and advanced search behavior in [Catalog search][].
- For general lineage behavior that is not specific to Power BI, see [Lineage troubleshooting][].

[Assets Access Control]: /docs/catalog/administration/assets-access-control
[Assets Access Control troubleshooting]: /docs/catalog/administration/assets-access-control#troubleshooting
[Azure portal]: https://portal.azure.com/
[BI Importer]: /docs/catalog/developer/catalog-apis/bi-importer
[Credential lifecycle]: /docs/catalog/integrations/data-viz/power-bi/powerbi#credential-lifecycle
[Databricks]: /docs/catalog/integrations/data-warehouses/databricks
[DAX, Mashup Expressions, and Field Lineage in Catalog]: /docs/catalog/integrations/data-viz/power-bi/powerbi#dax-mashup-expressions-and-field-lineage-in-catalog
[Lineage or Metadata Still Looks Wrong After Admin API Changes]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#lineage-or-metadata-still-looks-wrong-after-admin-api-changes
[New Power BI Workspace Appears With Broad Access]: /docs/catalog/administration/assets-access-control#new-power-bi-workspace-appears-with-broad-access
[New User Sees All Power BI Workspaces]: /docs/catalog/administration/assets-access-control#new-user-sees-all-power-bi-workspaces
[Power BI workspaces and Catalog visibility]: /docs/catalog/administration/assets-access-control#power-bi-workspaces-and-catalog-visibility
[Scope Power BI ingestion]: /docs/catalog/integrations/data-viz/power-bi/powerbi#scope-power-bi-ingestion
[Troubleshooting in Power BI setup]: /docs/catalog/integrations/data-viz/power-bi/powerbi#troubleshooting
[How to Validate Dataflow Lineage]: /docs/catalog/integrations/data-viz/power-bi#how-to-validate-dataflow-lineage
[Lineage in the Catalog UI]: /docs/catalog/integrations/data-viz/power-bi#lineage-in-the-catalog-ui
[No Upstream Lineage From a Data Set That Uses Dataflows]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#no-upstream-lineage-from-a-data-set-that-uses-dataflows
[Ingestion Fails or Metadata Never Appears]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#ingestion-fails-or-metadata-never-appears
[Integration Paused After Expired Credentials]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#integration-paused-after-expired-credentials
[Catalog search]: /docs/catalog/navigate/search
[Coalesce Support]: mailto:support@coalesce.io
[Ingestion architecture]: /docs/catalog/integrations/data-viz/power-bi/powerbi#ingestion-architecture
[Lineage troubleshooting]: /docs/catalog/navigate/lineage/lineage-troubleshooting
[Power BI Dataflows in Catalog]: /docs/catalog/integrations/data-viz/power-bi
[Power BI setup]: /docs/catalog/integrations/data-viz/power-bi/powerbi
[Troubleshoot Power BI Lineage When Columns Are Renamed]: /docs/catalog/integrations/data-viz/power-bi/power-bi-lineage-column-rename
[Supported asset types]: /docs/catalog/integrations/data-viz/power-bi/powerbi#supported-asset-types
[Users See Power BI Workspaces They Should Not]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#users-see-power-bi-workspaces-they-should-not
