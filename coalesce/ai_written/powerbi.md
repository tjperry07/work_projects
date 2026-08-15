---
title: "Power BI Setup"
description: "Connect Power BI to Catalog. Configure Microsoft Entra app, security groups, and admin settings for Catalog-managed or client-managed extraction. Learn native versus BI Importer ingestion paths, optional ingestion scope with folder path allow and block lists, Premium capacity boundaries, multi-integration routing, and governance options for large or CI/CD-heavy tenants."
keywords: [Power BI, Catalog, Microsoft Entra, extraction, BI integration, ingestion scope, workspace filtering, CI/CD, allow list, block list, Premium capacity, Fabric, access control, client secret, credentials]
processed: true
---

Connect Power BI to Coalesce Catalog with Microsoft Entra, Fabric tenant settings, and either Catalog-managed or client-managed extraction. This page covers optional IP allowlisting, app registration, security groups, Admin API settings, credentials, extractor scheduling, and how to narrow Power BI ingestion when you have many workspaces or strict production boundaries.

## Related Guides

Use these companion pages alongside setup:

- [Power BI Dataflows in Catalog][] for lineage through Dataflows, supported mashup patterns, and validation from consuming semantic data sets
- [Power BI troubleshooting in Catalog][] when ingestion fails, credentials expire, search misses assets, or lineage looks stale
- [Troubleshoot Power BI Lineage When Columns Are Renamed][] for Power Query rename behavior and measure expectations in field lineage

## Supported Asset Types

Catalog ties Power BI assets to warehouse objects your integrations have already synced. Lineage depth varies by asset type: semantic data sets and standard reports usually trace farthest. Catalog ingests Dataflow metadata during extraction to compute lineage only; Dataflows are not searchable semantic models, Catalog assets, or semantic representations. Paginated reports typically show lighter field-level detail.

For a full comparison table by asset type, including paginated reports and Dataflows, see [Which Power BI Assets Connect to Warehouse Lineage][] in [Power BI Dataflows in Catalog][].

Catalog's standard integration does not ingest published Power BI Apps as a distinct asset type. It ingests the underlying reports, dashboards, and semantic data sets Microsoft exposes through admin scan metadata. Outbound links from Catalog to Power BI use those workspace-level URLs from Microsoft metadata. That is separate from the Microsoft Entra app you register in [Before You Begin][] for API credentials. For Teams and Microsoft Search link behavior, see [Microsoft Teams and Search Deep Links for Power BI][] in [Power BI troubleshooting in Catalog][].

## Before You Begin

Work through this page in order: optional IP allowlisting, then the Microsoft Entra app, security group, and Power BI Admin portal settings. Confirm the following first:

- You need Cloud Application Administrator or Application Administrator access in Microsoft Entra ID and Fabric Administrator access in Power BI to complete this setup.
- You have a warehouse-type integration configured if you want Catalog to relate Power BI assets to warehouse tables for lineage.
- If Catalog runs ingestion for you, the first sync can take up to 48 hours. Plan to validate in Catalog after that finishes, and again after you change tenant settings or the model so a new sync can run.

For data sets that rarely refresh or that use only DirectQuery, plan to refresh or republish when you need full lineage detail from the Power BI APIs. See [Refresh and Republish Data Sets][].

### 1. IP Allowlisting

This only applies if you need a VPN to connect to Power BI. If you allowlist by IP, map your Catalog hostname to the fixed address:

- `34.42.92.72` for instances at [app.us.castordoc.com][]
- `35.246.176.138` for instances at [app.castordoc.com][]

### 2. Create a Microsoft Entra App for Catalog in the Azure Portal

Log in to the [Azure portal][] and search for Microsoft Entra ID. In it, create the new App with the following parameters and then click Register:

- name: `Catalog`
- Supported account types: `Accounts in this organizational directory only`

On the homepage of your newly created application, from the **Overview** screen, copy the values for the following fields and store them in a secure location for later:

- Application (client) ID
- Directory (tenant) ID

From the left menu, navigate to **Manage** > **API permissions** and add the following two Microsoft Graph permissions, both of type **Application permissions**:

- `GroupMember.Read.All`
- `User.ReadBasic.All`

Once added, make sure **Admin consent is granted** for both permissions.

:::warning[Avoid extra Power BI permissions on the app]

Make sure the app does not have any admin-consent required permissions for Power BI set on it. They're never used and can cause errors that are hard to troubleshoot. See how to [check whether your app has admin-consent required permissions][Power BI admin-consent permissions].

:::

Navigate to **Manage** > **Certificates & secrets** and create a new client secret with the description and expiration date of your choosing. Then, for the newly created client secret, click the clipboard icon to copy the **Value** and store it in a secure location for later.

For more details, see [Create an Azure AD app for Power BI embedded][].

### 3. Create a Microsoft Entra Security Group

In the left menu of the **Microsoft Entra ID** page, under the **Manage** section, click **Groups**.

Then create a new group with the following configuration:

- Set the **Group type** to Security.
- Enter `API AD` as **Group name** and, if you want, a **Group description**.
- Under **Members**, search for the application registration created above and add it to the list.

For more details, see [Create an Azure AD security group][].

### 4. Enable the Power BI Service Admin Settings

Go to the [Power BI Admin portal][] tenant settings. See [how to get to the Admin portal][] for navigation help. For Microsoft guidance, see [Enable the Power BI service admin settings][] and [Metadata scanning setup][].

- In the **Developer Settings** section, enable:
  - Enable `Service principals can use Fabric APIs`
- Add the group **API AD** to it.

- In the **Admin API Settings** section, enable:
  - Enable `Service principals can access read-only admin APIs`
  - Enable `Enhance admin APIs responses with detailed metadata`
  - Enable `Enhance admin APIs responses with DAX and mashup expressions`
- Add the group **API AD** to all of them.

### Refresh and Republish Data Sets

This step is recommended. To get lineage information from the Power BI API:

- Refresh or republish data sets, especially those that are not scheduled.
- Republish data sets that contain only DirectQuery tables.

## Ingestion Architecture

Power BI connects to Catalog through a native integration built for Power BI admin APIs and `castor-extract-powerbi` output. That path is separate from the generic [BI Importer][] workflow used for BI tools Catalog does not integrate with directly.

Who runs extraction defines how metadata reaches Catalog:

- **Catalog-managed extraction** - You supply Entra app credentials in **Settings > Integrations**. Catalog runs scheduled extraction against Power BI on your behalf. Choose this path when your tenant allows stored service principal credentials and you want Catalog to own the schedule.
- **Client-managed extraction** - You install `castor-extractor[powerbi]`, run `castor-extract-powerbi` on infrastructure you control, and upload artifacts with `castor-upload` on a schedule you define. Catalog ingests when upload files are present. Choose this path when you prefer not to store Power BI secrets in Catalog or when you already operate extract-and-upload jobs.

Extraction modes describe how metadata enters Catalog. They are not the same as sync back features that push descriptions from Catalog into a BI tool. Sync back is documented separately under [Sync back integrations][].

## DAX, Mashup Expressions, and Field Lineage in Catalog

When **Enhance admin APIs responses with DAX and mashup expressions** is enabled, Microsoft's admin APIs can return measures, DAX expressions, and mashup text. Catalog uses that output while ingesting Power BI metadata and building lineage. Catalog does not parse Power Query M; it applies pattern matching and heuristics against exported mashup for the connector and transform shapes Catalog tests. Microsoft's documentation for Fabric and Power BI describes how tenant administrators expose that level of detail for admin and scanning scenarios.

In Catalog, field lineage shows how warehouse columns, semantic model tables and columns, and measures connect in the lineage graph when those paths resolve. That view centers on relationships and dependencies, not on reproducing every authoring surface from Power BI Desktop.

Use this table to compare what each surface shows for measures:

| Surface | What Catalog shows | What Catalog does not show |
| ------- | ------------------ | -------------------------- |
| **Power BI Desktop** | Full DAX measure definition in the formula bar or measure dialog | N/A, authoring environment |
| **Catalog field lineage** | Dependency paths among warehouse columns, model fields, and measures when the graph resolves | Full DAX formula text inside the lineage canvas |
| **Catalog asset detail and search** | Names, descriptions, and lineage relationships from ingested metadata | Complete measure definition text as in Power BI Desktop |

Enabling admin API settings for DAX and mashup expressions is required for Power BI integration and lineage computation. It does not add the complete measure formula to lineage panels or asset detail views.

If your tenant matches this setup page and extraction completes successfully, missing formula text in the lineage UI reflects how Catalog presents lineage today, not a failed or incorrectly configured integration. For a symptom-based FAQ and what to use instead, see [Missing DAX measure definitions in Catalog][] in [Power BI troubleshooting in Catalog][].

For scenarios that compare measure lineage to Power Query rename behavior, see [Troubleshoot Power BI Lineage When Columns Are Renamed][].

## Catalog Managed

Send your Microsoft Entra app credentials in **Settings > Integrations** so Catalog can run scheduled extraction against Power BI on your behalf.

Send the following:

- `Tenant (Directory) ID`: Your Power BI instance tenant identifier
- `Client (Application) ID`: the ID of the Catalog application for Power BI
- `Secret Value`: the value of the secret associated to the Catalog App

Input your credentials directly in the [Catalog App integration settings][] under the following format:

```json
{
    "clientId": "****",
    "secret": "****",
    "tenantId": "****"
}
```

Your first sync can take up to 48 hours. Your Catalog team will notify you when it completes.

If you prefer not to store Power BI credentials in Catalog, continue to [Client Managed][].

### Credential Lifecycle

Microsoft Entra client secrets expire on the schedule you chose when you created the secret. Plan renewals before expiry so Catalog-managed extraction does not stop.

Typical symptoms when a secret expires:

- Ingestion errors that reference an expired client secret for your Catalog app registration
- The Power BI integration shows as paused in **Settings > Integrations**
- Search and lineage stop updating even though tenant admin settings are unchanged

To renew credentials:

1. In the [Azure portal][], open your Catalog app registration and create a new client secret under **Manage** > **Certificates & secrets**. Copy the new **Value** before you leave the page.
2. In Catalog, go to **Settings > Integrations**, open your Power BI source, and choose **Edit credentials**. Paste the updated `clientId`, `secret`, and `tenantId` JSON.
3. If Support or your Catalog team paused the integration after the failure, notify [Coalesce Support][] after you save valid credentials so they can re-enable the source and run ingestion again when needed.
4. Allow one full extraction cycle before you judge search or lineage freshness.

:::warning[First sync window]

Avoid rotating the client secret while the first 48-hour sync is still running unless Microsoft has already invalidated the old secret. A mid-sync rotation can extend the time before Catalog shows a complete graph.

:::

For step-by-step recovery when the integration is already paused, see [Integration Paused After Expired Credentials][] in [Power BI troubleshooting in Catalog][].

## Client Managed

Client-managed extraction runs on your infrastructure. You install the extractor, schedule runs, and push artifacts to Catalog with the upload tooling your Catalog team provides.

### Running the Extraction Package

#### Install the PyPI Package

```bash
pip install castor-extractor[powerbi]
```

For further details, see the [castor-extractor PyPI page][].

#### Run the Package

Once the package has been installed, you should be able to run the following command in your terminal:

```bash
castor-extract-powerbi [arguments]
```

The script will run and display logs as follows:

```text
INFO - Starting extraction of PowerBiAsset.ACTIVITY_EVENTS
INFO - Wrote output file: ./files/1708021983-activity_events.json
INFO - Starting extraction of PowerBiAsset.DASHBOARDS
INFO - Wrote output file: ./files/1708021983-dashboards.json
INFO - Starting extraction of PowerBiAsset.DATASETS
INFO - Wrote output file: ./files/1708021983-datasets.json
INFO - Starting extraction of PowerBiAsset.METADATA
INFO - scan bbe1669a-8d4b-4598-a3a1-8763ea2babe7 ready
INFO - Wrote output file: ./files/1708021983-metadata.json
INFO - Starting extraction of PowerBiAsset.REPORTS
INFO - Wrote output file: ./files/1708021983-reports.json
INFO - Wrote output file: /tmp/catalog/1649078755-summary.json
```

#### Arguments

- `-t`: Tenant ID, your Power BI instance tenant identifier
- `-c`: Client (Application) ID, the ID of the Catalog application for Power BI
- `-s`: Secret Value, the value of the secret associated to the Catalog App
- `-o`, `--output`: Target folder to store the extracted files

#### Optional Arguments

- `-sc`, `--scopes` : Power BI Scopes to be used, optional
- `-l`, `--login_url` : Login URL of your Microsoft Entra server, optional
- `-a`, `--api_base`: Power BI REST API base URL, optional

Run any extractor command with `--help` to print the full argument list.

### Scheduling and Push to Catalog

When moving out of trial, you'll want to refresh your Power BI content in Catalog. Here is how to do it:

The Catalog team will provide you with:

1. `Source Id`. Catalog uses this identifier to match your uploaded files to your Catalog instance.
2. `Catalog Token`, the API token for upload.

You can then use the `castor-upload` command:

```bash
castor-upload [arguments]
```

#### Upload Arguments

- `-k`, `--token`: Token provided by Catalog
- `-s`, `--source_id`: Source ID provided by Catalog
- `-t`, `--file_type`: source type to upload. Currently supported are { `DBT` | `VIZ` | `WAREHOUSE` }

#### Target Files

To specify the target files, use exactly one of the following:

- `-f`, `--file_path`: to push a single file.
- `-d`, `--directory_path`: to push several files at once from one directory.

When you use `--directory_path`, the upload tool sends every file in that directory. Confirm the directory contains only the extracted artifacts before you push.

Then you will need to schedule the script run and the push to Catalog. Use your preferred scheduler to create this job.

## Scope Power BI Ingestion

Large tenants, frequent deployments, and CI/CD pipelines that create many Power BI workspaces can push more metadata into Catalog than you want to browse or link in lineage. Catalog can limit which Power BI visualization assets are ingested by applying path-based glob rules to each asset's folder path in the integration pipeline. Your Catalog team can also layer Premium capacity or Fabric capacity boundaries when that matches how you separate production from experimentation. This section explains how that scope works and how to plan changes with your Catalog team.

You connect the Power BI app and credentials in **Settings > Integrations**. Folder allow lists, block lists, and optional capacity-backed scope are applied during ingestion on the Catalog side. Coordinate path and capacity rules with your Catalog point of contact or [Coalesce Support][] so they match your next extraction or refresh cycle.

### What the Rules Target

Catalog stores a normalized folder path for each visualization asset. Your allow list or block list patterns match those paths using glob-style rules, so you can include or exclude segments that stay stable in your tenant, such as a production workspace label or a shared root folder.

Workspace names and other labels from Power BI often appear as segments in the paths Catalog evaluates. The exact layout depends on your tenant and how assets are organized, so you should confirm real path examples with your Catalog contact when you design patterns. Teams that standardize prefixes or brackets in workspace names, for example to mark production, often get simpler patterns and fewer surprises after deployment.

### Allow List or Block List

You configure either an allow list of path patterns or a block list of path patterns for the Power BI visualization integration, not both at the same time.

- **Allow list** - Catalog ingests an asset only when its path matches at least one active pattern. The typical starting point when you only need to omit a bounded set of development, test, or sandbox paths.
- **Block list** - Catalog ingests every asset whose path does not match any active pattern. Good for teams that prefer to send the definitive list of folders or workspaces to keep instead of maintaining a growing exclude list whenever CI/CD creates new spaces.

If both modes are present in the integration configuration, ingestion fails with a clear configuration error until your Catalog team removes one of the modes.

When you have a very large dashboard count and workspaces or folders change often, fixed lists of workspace names can be hard to maintain. Ask your Catalog contact for a scope model that fits high churn, which can include capacity-based rules, broader path patterns, or a staged plan across several extraction cycles.

### Scope by Premium Capacity or Deployment Workspaces

Some organizations group workspaces by Microsoft Fabric capacity or by deployment pipeline stages such as development, test, and production Premium capacities. In those layouts you can ask your Catalog team to include only the capacities that host approved workspaces or to exclude specific capacities you treat as non-production, for example reserved personal capacities you never want in Catalog.

Bring the capacity display names or object identifiers from the Microsoft Fabric admin center and describe which capacities should remain in scope. Your Catalog team maps that intent onto the ingestion configuration the same way they manage path rules.

### Multiple Power BI Integrations in One Tenant

Some organizations run more than one Catalog Power BI integration against the same tenant when different product lines or warehouses need separate graphs. Give each integration its own path allow or block rules so the same published artifact does not appear twice under two sources unless that duplication is intentional. Your Catalog contact can help mirror exclusion logic across integrations so each integration stays aligned with its warehouse or domain.

### Narrow Discovery Without Removing Assets From Ingestion

Path and capacity rules remove assets from Catalog for that integration, which shrinks search and lineage graphs. Ingestion scope controls what Catalog pulls from Power BI. **Manage access** on dashboard folders controls who can see what was ingested. Use both when you need to separate production from non-production workspaces and limit discovery by team.

When you still need the metadata in Catalog but want to steer readers away from legacy or non-production dashboards, combine ingestion scope with Catalog governance instead of relying on ingestion alone:

- **Manage access** on dashboard folders limits which teams can browse and search those folders while admins retain full visibility. Power BI workspaces map to dashboard folders; new workspace folders are company-wide visible until you restrict them. See [Power BI workspaces and Catalog visibility][] and [Assets Access Control][].
- Deprecation marks a dashboard as outdated but keeps it discoverable for admins and in lineage with a clear visual signal. It does not hide the asset the way an ingestion block list does. See **Deprecated** under [Dashboards][].

### How to Request a Change

Work with your Catalog point of contact or [Coalesce Support][] to update ingestion scope. Share the workspace or folder boundaries you want, whether you need an allow list or a block list, capacity names or IDs if you use capacity-based scope, and any naming conventions your CI/CD system uses so paths stay predictable.

After your Catalog team applies an update, expect the change on the next successful extraction or refresh cycle for that Power BI source.

When you narrow an allow list or add block patterns, dashboards, reports, or semantic models can disappear from Catalog on the next run, which removes their downstream lineage until you broaden scope and ingest them again. After each change, spot check critical assets in Catalog. If you switch from a block list to an allow list but the set of ingested assets intentionally stays the same, lineage should stay aligned, but you should still confirm a sample of dashboards and models because any accidental exclusion drops links that depended on those assets.

If production reporting workspaces are omitted from an allow list, those assets stop appearing in Catalog and no longer participate in lineage graphs until you fix the patterns and complete another successful ingestion.

## Troubleshooting

These topics come up often while onboarding Power BI or validating lineage in Catalog. For ingestion failures, expired credentials, Dataflow lineage validation, DAX expectations, semantic model authoring modes, and longer diagnosis flows, see [Power BI troubleshooting in Catalog][].

### Lineage Differs When You Build a Semantic Model From the Table Browser Versus Embedded SQL

Links to warehouse tables are strongest when mashup text exposes explicit SQL, for example through `Value.NativeQuery`, that Catalog can match to objects already synced from your warehouse integration. Models built only through the visual table picker often export less explicit SQL, which limits what Catalog can resolve.

For symptoms, a validation checklist that includes Databricks and other warehouses, and when to contact Support, see [Lineage When Semantic Models Use Table Navigation Versus SQL][] in [Power BI troubleshooting in Catalog][].

### First Sync Still Running After a Day

Large tenants or metadata-heavy workspaces extend first ingestion toward the upper end of the documented window.

To resolve this:

1. Confirm **Admin API Settings** and **Developer Settings** match [Enable the Power BI service admin settings][] on this page.
2. Avoid concurrent credential rotations until the first sync completes.
3. If progress stalls beyond two days while settings are correct, contact [Coalesce Support][].

### Admin Portal APIs Return Errors for the Service Principal

Missing security group attachment or disabled Fabric API toggles block Catalog's read-only calls.

To resolve this:

1. Confirm the Microsoft Entra security group contains the Catalog app registration and appears in **Service principals can use Fabric APIs**.
2. Verify **Service principals can access read-only admin APIs** and the detailed metadata toggles stay enabled.
3. Retry ingestion after fifteen minutes so Admin API caches clear.

### Lineage Looks Thin for Rarely Refreshed or DirectQuery-Only Data Sets

Catalog reads data set metadata that reflects your refresh and modeling patterns. To resolve this:

1. Refresh data sets or republish when you need full lineage expansion, as noted in [Refresh and Republish Data Sets][].
2. Schedule refreshes that align with how analysts consume the semantic models.

### Credentials Saved but Catalog Cannot Pull Workspaces

Wrong tenant ID, expired client secret, or restricted service principal membership produces auth failures that surface as integration errors.

To resolve this:

1. Follow [Credential lifecycle][] on this page to rotate the client secret in Azure and update **Settings > Integrations** immediately after Microsoft invalidates the old secret.
2. Confirm the Catalog app remains in the Entra security group tied to Fabric tenant settings.
3. If the integration is paused, see [Integration Paused After Expired Credentials][] in [Power BI troubleshooting in Catalog][].

[Assets Access Control]: /docs/catalog/administration/assets-access-control
[Power BI workspaces and Catalog visibility]: /docs/catalog/administration/assets-access-control#power-bi-workspaces-and-catalog-visibility
[BI Importer]: /docs/catalog/developer/catalog-apis/bi-importer
[Azure portal]: https://portal.azure.com/
[app.castordoc.com]: https://app.castordoc.com/
[app.us.castordoc.com]: https://app.us.castordoc.com/
[castor-extractor PyPI page]: https://pypi.org/project/castor-extractor/#pip-install
[Catalog App integration settings]: https://app.castordoc.com/settings/integrations
[Client Managed]: /docs/catalog/integrations/data-viz/power-bi/powerbi#client-managed
[Coalesce Support]: mailto:support@coalesce.io
[Create an Azure AD app for Power BI embedded]: https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal#step-1---create-an-azure-ad-app
[Create an Azure AD security group]: https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal#step-2---create-an-azure-ad-security-group
[Credential lifecycle]: /docs/catalog/integrations/data-viz/power-bi/powerbi#credential-lifecycle
[Dashboards]: /docs/catalog/assets/dashboards#details-panel
[Enable the Power BI service admin settings]: https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal#step-3---enable-the-power-bi-service-admin-settings
[how to get to the Admin portal]: https://learn.microsoft.com/en-us/fabric/admin/admin-center#how-to-get-to-the-admin-portal
[Integration Paused After Expired Credentials]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#integration-paused-after-expired-credentials
[Lineage When Semantic Models Use Table Navigation Versus SQL]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#lineage-when-semantic-models-use-table-navigation-versus-sql
[Metadata scanning setup]: https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-setup
[Power BI Admin portal]: https://app.fabric.microsoft.com/admin-portal/tenantSettings
[Power BI Dataflows in Catalog]: /docs/catalog/integrations/data-viz/power-bi
[Power BI troubleshooting in Catalog]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting
[Power BI admin-consent permissions]: https://learn.microsoft.com/en-us/power-bi/enterprise/read-only-apis-service-principal-authentication#how-to-check-if-your-app-has-admin-consent-required-permissions
[Sync back integrations]: /docs/catalog/integrations/sync-back
[Refresh and Republish Data Sets]: /docs/catalog/integrations/data-viz/power-bi/powerbi#refresh-and-republish-data-sets
[Which Power BI Assets Connect to Warehouse Lineage]: /docs/catalog/integrations/data-viz/power-bi#which-power-bi-assets-connect-to-warehouse-lineage
[Troubleshoot Power BI Lineage When Columns Are Renamed]: /docs/catalog/integrations/data-viz/power-bi/power-bi-lineage-column-rename
[Missing DAX measure definitions in Catalog]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#missing-dax-measure-definitions-in-catalog
[Microsoft Teams and Search Deep Links for Power BI]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#microsoft-teams-and-search-deep-links-for-power-bi
[Before You Begin]: /docs/catalog/integrations/data-viz/power-bi/powerbi#before-you-begin
