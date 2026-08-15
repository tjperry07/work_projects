---
title: "Troubleshoot Power BI Lineage When Columns Are Renamed"
description: "Resolve missing or partial field lineage in Catalog after Power Query column renames. Learn which Table.RenameColumns patterns Catalog maps, how dynamic mashup differs, and how to validate admin settings, refresh, warehouse sync, and extraction."
keywords: [Power BI, lineage, column rename, Table.RenameColumns, field lineage, Catalog, Power Query, troubleshooting]
processed: true
---

Use this guide when column or field lineage in Catalog looks incorrect after you rename columns in Power BI Power Query. You'll learn typical symptoms, why renames affect lineage, which rename patterns Catalog resolves best, how to validate integrations and timing when something still looks off, and where to look for issues unrelated to column renames, such as measure-level detail.

## Symptoms You Might See

You might notice one or more of these behaviors:

- **Field lineage stops after a rename step** - Table-level lineage still shows upstream warehouse tables, but field lineage doesn't continue through the rename.
- **Some columns trace end to end** - Others stop at the semantic data set after heavy merging, splitting, or renaming.
- **Lineage was incomplete before you changed the model** - You simplified rename steps and want to know what to expect after Catalog finishes another extraction cycle.

Lineage is computed using recent activity. Confirm that the asset has been refreshed during the period Catalog uses for lineage, as described in [Lineage troubleshooting][].

## Why Renames Affect Lineage

Catalog links Power BI fields to upstream warehouse columns by pattern matching exported mashup text and related admin API output against the warehouse graph. Catalog does not parse Power Query M. When you rename a column, the field name in the model can differ from the name the warehouse integration ingested. Catalog needs a recognizable mapping in mashup text and metadata to connect the new name back to the source column.

When that mapping is explicit and stable, column-level lineage can run end to end. When mashup builds rename logic indirectly or at runtime, the same logical rename can be harder to trace automatically, so column-level lineage can stay partial even when table-level links exist.

## What Catalog Resolves for Renames

Catalog resolves column-level lineage more reliably when exported mashup matches tested patterns for direct `Table.RenameColumns` usage in Power Query, including a single mapping and multiple rename pairs in one step. In practice, that means the rename list is visible in mashup as a static table of old and new names Catalog can match, not only the outcome after arbitrary logic runs. When generated mashup shows plain old-name and new-name pairs for those steps, lineage mapping back to warehouse columns is strongest.

If you use other ways to relabel fields, for example by only changing display names without a clear rename step in mashup, or by using rename shapes that pattern matching does not treat as direct `Table.RenameColumns` mappings, field lineage can remain weaker until the model uses a pattern Catalog can match.

## Dynamic or Indirect Rename Logic

Some models build the rename list at query time, for example by zipping two lists, reading from parameters, or computing which columns to rename in a step that doesn't leave a fixed pair list in the same form as a direct `Table.RenameColumns` call. In those cases, column-level lineage can stay incomplete because the relationship between old and new names isn't expressed the same way in the metadata Catalog ingests.

When you can change the model, use this sequence:

1. **Simplify to explicit renames** for the fields you need in lineage, using `Table.RenameColumns` with a direct mapping in mashup where possible.
2. **Reduce indirection** in the same query chain where Catalog must tie fields to warehouse columns.
3. After changes, follow **How to Validate Lineage After Changing Renames** in this guide.

Custom wrapper functions or tenant-specific mashup helpers that hide `Table.RenameColumns` inside abstractions can fall outside the mashup patterns Catalog recognizes. If lineage is still wrong after admin settings, refresh, and a full extraction cycle, contact [Coalesce Support][] with a short description of the mashup pattern. Do not include credentials.

## How to Validate Lineage After Changing Renames

Work through these steps in order when you have fixed or simplified rename steps and want Catalog to show updated field lineage.

1. **Confirm Power BI admin settings**  
   In the [Power BI Admin portal][], keep the same **Admin API Settings** that [Power BI setup][] requires for your Catalog service principal, including options that surface detailed metadata and mashup expressions when your organization uses them for lineage.

2. **Refresh or republish affected data sets**  
   Refresh or republish in Power BI so the service returns updated mashup text and metadata that match your changes. This matters for data sets that refresh rarely or that use DirectQuery, as described in [Power BI setup][].

3. **Confirm warehouse tables and columns are in Catalog**  
   The warehouse objects referenced in mashup must be in scope for your warehouse integration. If Catalog doesn't have a table or column, field lineage can't attach to it. Use your warehouse integration documentation, for example [Snowflake][], to verify scope and sync.

4. **Allow a full Catalog extraction cycle**  
   Catalog only reflects updated mashup text after the next successful Power BI extraction. For Catalog-managed environments, that follows the schedule you coordinate with Catalog operations. For client-managed environments, that follows your `castor-extract-powerbi` schedule and upload, as in [Power BI setup][]. The first Power BI sync can take up to 48 hours. After that, wait for at least one successful extraction on your schedule before you judge field lineage.

5. **Re-check lineage after both sides have synced**  
   If table-level lineage looks right but some fields still don't trace, compare those columns to the rename patterns in this guide. If everything matches supported patterns and extraction succeeded, contact [Coalesce Support][] with timestamps and asset names.

After configuration is correct and extraction runs successfully, you can see more column links than before for the same model, especially where you replaced ambiguous rename logic with direct `Table.RenameColumns` mappings. Large tenants still follow the same timing expectations as other Power BI ingestion.

## When Lineage Stays Partial for Other Reasons

Column renaming is one reason field lineage can stop early. These situations overlap with rename issues in the UI:

- **Multiple warehouse sources in one logical table** - Catalog can't always reduce paths to a single resolved column.
- **Heavy merge, join, or append steps** - These steps can obscure which input column feeds an output field.
- **Parameterized or highly dynamic connection logic** - Extraction may infer less. See [Power BI Dataflows in Catalog][] and [Power BI troubleshooting in Catalog][] for broader troubleshooting steps.

Table-level lineage can be present while column-level lineage ends at an ambiguous transform. That is expected until mashup text and metadata give a clear enough mapping.

## Measures and DAX

Column rename behavior in Power Query M is separate from how Catalog treats DAX measures in lineage. Field lineage shows how warehouse columns, model fields, and measures connect in the graph when paths resolve. It does not reproduce the full DAX measure definition from Power BI Desktop inside lineage or asset detail views.

That gap is expected when admin API settings are correct and extraction succeeds. For a comparison table, setup requirements, and a symptom-based FAQ, see [DAX, Mashup Expressions, and Field Lineage in Catalog][] on [Power BI setup][] and [Missing DAX measure definitions in Catalog][] in [Power BI troubleshooting in Catalog][].

## What's Next?

- Complete or review credentials and **Admin API Settings** in [Power BI setup][].
- Read broader Power BI Dataflow patterns and limits in [Power BI Dataflows in Catalog][] and step through Power BI issues in [Power BI troubleshooting in Catalog][].
- Use the general lineage guide for timeouts, temporary tables, and other topics in [Lineage troubleshooting][].
- Practice expanding upstream and downstream graphs in [Lineage][].

[DAX, Mashup Expressions, and Field Lineage in Catalog]: /docs/catalog/integrations/data-viz/power-bi/powerbi#dax-mashup-expressions-and-field-lineage-in-catalog
[Coalesce Support]: mailto:support@coalesce.io
[Lineage]: /docs/catalog/navigate/lineage
[Lineage troubleshooting]: /docs/catalog/navigate/lineage/lineage-troubleshooting
[Power BI Admin portal]: https://app.fabric.microsoft.com/admin-portal/tenantSettings
[Power BI Dataflows in Catalog]: /docs/catalog/integrations/data-viz/power-bi
[Power BI setup]: /docs/catalog/integrations/data-viz/power-bi/powerbi
[Power BI troubleshooting in Catalog]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting
[Snowflake]: /docs/catalog/integrations/data-warehouses/snowflake
[Missing DAX measure definitions in Catalog]: /docs/catalog/integrations/data-viz/power-bi/power-bi-troubleshooting#missing-dax-measure-definitions-in-catalog
