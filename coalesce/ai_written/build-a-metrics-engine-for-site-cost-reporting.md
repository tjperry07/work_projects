---
title: Build a Metrics Engine for Site Cost Reporting
description: Build a catalog-driven metrics and KPI engine in Coalesce on Databricks. Derive store-level input values from TPC-DS sample data, store formulas in a KPI catalog, apply audited adjustments, and present flat values for BI.
keywords: [metrics engine, KPI catalog, site cost reporting, Databricks, Coalesce, TPC-DS, adjustments, hierarchy, BI flat table]
hide_table_of_contents: true
slug: /guides/build-a-metrics-engine-for-site-cost-reporting
tags: [Databricks, Advanced]
---

## Introduction

Monthly site cost reporting often depends on hundreds of KPIs with layered formulas, manual adjustments, and a flat table that an existing BI semantic model already expects. Hard-coding every formula in one SQL script does not scale when formulas change, dependencies deepen, or finance needs an auditable adjustment trail.

This guide shows how to model that pattern in Coalesce on Databricks: input values at a consistent grain, a KPI catalog that stores formula and dependency metadata, an engine Node that calculates KPI values in SQL, joins the catalog to apply adjustments only where allowed, and a flat presentation table for BI.

### When Catalog-Driven Metrics Help

A catalog-driven metrics engine is a strong fit when:

- Many KPIs share the same grain, for example period, site, and location, and you want formula and dependency metadata stored as data for governance.
- Formulas change over time and you want to update metadata instead of rewriting dozens of Nodes.
- Manual adjustments must be auditable and must not replace the engine formula output.
- Downstream BI still expects a flat table even if the engine stores metrics in long form.

Prefer simpler Stage or Fact Nodes with fixed SQL when you only have a handful of stable metrics and no adjustment workflow.

### How Coalesce Models This

Keep these layers separate:

1. **Inputs** - values extracted from source systems at engine grain.
2. **KPI catalog** - formula definitions, dependency edges, and whether each KPI is adjustable as data.
3. **Adjustments** - optional deltas from an adjustments application.
4. **Engine output** - long-form KPI values with both engine and final amounts.
5. **Presentation** - reshape for the existing BI model.

This guide calculates KPI math in SQL that mirrors the catalog formulas. Production engines often evaluate `formula_expr` dynamically in dependency order. Here the catalog still drives which KPIs exist and which ones may receive adjustments.

### Avoiding Common Mistakes

Keep these constraints in mind as you build:

- Do not overwrite formula results with adjusted values only. Always retain `engine_value` and apply `adjustment_delta`.
- Do not put a top-level `WITH` as the entire Join string. Wrap CTEs in `FROM ( … ) src`.

## What You Will Build

When you finish this guide, you will have:

- 3 Sources: `store_sales`, `date_dim`, and `store`
- `stg_input_values` with long-form `IN_SALES`, `IN_UNITS`, and `IN_COGS` by store and month
- `ref_kpi_catalog` with 4 sample KPIs, formulas, dependency metadata, and whether each KPI is adjustable
- `ref_adjustments` with synthetic adjustment deltas for an adjustable KPI
- `fct_kpi_values` with `engine_value`, `adjustment_delta`, and `final_value`
- `fct_kpi_bi_flat` with one column per KPI for BI-style consumption

<img src="/img/guides/metrics-engine/graph-overview.png" alt="Build graph with store, date_dim, and store_sales feeding stg_input_values, and ref_kpi_catalog plus ref_adjustments feeding fct_kpi_values into fct_kpi_bi_flat." className="mdImages"/>

### How the Pipeline Fits Together

| Node | Node Type | What it does |
| ---- | --------- | ------------ |
| `store_sales`, `date_dim`, `store` | Source | TPC-DS facts and dimensions that supply raw sales, costs, and store attributes. |
| `stg_input_values` | Stage | Aggregates year 2001 store sales by month and produces 3 long-form input metrics. |
| `ref_kpi_catalog` | Stage | Seeds KPI ids, formula text, `depends_on` edges, and `is_adjustable`. The engine joins this table so only adjustable KPIs accept deltas. |
| `ref_adjustments` | Stage | Seeds manual adjustment deltas keyed by KPI, month, and site. |
| `fct_kpi_values` | Stage | Pivots inputs, calculates KPIs in SQL, joins the catalog and adjustments, and sets `final_value = engine_value + adjustment_delta`. |
| `fct_kpi_bi_flat` | Stage | Pivots KPI final values into 1 wide row per site and month for BI. |

This lab uses Stage Nodes for every layer so you can focus on the Join and Mapping pattern. In production, review [Choosing the Right Node][] for Fact, View, Dimension, Work, and platform Base or Functional Node Types that may fit inputs, facts, and presentation tables better.

## Before You Begin

- A Coalesce account with a Databricks connection configured. See the [Databricks Connection Guide][].
- A Project and Workspace you have edit permissions on.
- Access to Unity Catalog `samples.tpcds_sf1`, which is included in Unity Catalog-enabled Databricks workspaces.
- Storage Locations for **SRC**, mapped to the sample catalog, and **TARGET**, mapped to a writable schema such as your development schema.
- This guide uses Databricks Unity Catalog sample data in `samples.tpcds_sf1` as a stand-in for operational source systems. Store locations play the role of sites.

## Step 1: Add TPC-DS Sources

Add the 3 TPC-DS tables that supply sales, dates, and store attributes.

1. In your Workspace, click the **+** control next to the Nodes search box.
2. Choose **Add Sources**.
3. Select only these tables from `samples.tpcds_sf1`:
   1. `store_sales`
   2. `date_dim`
   3. `store`
4. Click **Add 3 sources** so the Sources appear on the graph.

<img src="/img/guides/metrics-engine/build_a_metric_engine_add_sources.png" alt="Add Sources modal with date_dim, store, and store_sales selected from the TPC-DS sample list and Add 3 sources ready to confirm." className="mdImages"/>

## Step 2: Build Input Values

Create a Stage Node that aggregates 2001 store sales by month and reshapes sales, units, and COGS into long-form input rows.

1. In **Browser**, click the **+** control next to the Nodes search box.
2. Choose **Add Node > Stage**.
3. Name the Node `stg_input_values` and set its Storage Location to **TARGET**.
4. Set the Node description to `Unpivoted input metrics from store sales aggregated by store and month for 2001`.
5. On the **Join** tab, paste:

    ```sql
    FROM (
      WITH base_agg AS (
        SELECT
          date_dim.d_moy AS period_month,
          store.s_store_sk AS site_id,
          store.s_store_name AS site_name,
          SUM(store_sales.ss_ext_sales_price) AS agg_sales,
          SUM(store_sales.ss_quantity) AS agg_units,
          SUM(store_sales.ss_ext_wholesale_cost) AS agg_cogs
        FROM {{ ref('SRC', 'store_sales') }} store_sales
        INNER JOIN {{ ref('SRC', 'date_dim') }} date_dim
          ON store_sales.ss_sold_date_sk = date_dim.d_date_sk
        INNER JOIN {{ ref('SRC', 'store') }} store
          ON store_sales.ss_store_sk = store.s_store_sk
        WHERE date_dim.d_year = 2001
        GROUP BY date_dim.d_moy, store.s_store_sk, store.s_store_name
      )
      SELECT period_month, site_id, site_name, CAST('IN_SALES' AS STRING) AS input_id,
            CAST(agg_sales AS DECIMAL(18,2)) AS input_value FROM base_agg
      UNION ALL
      SELECT period_month, site_id, site_name, CAST('IN_UNITS' AS STRING) AS input_id,
            CAST(agg_units AS DECIMAL(18,2)) AS input_value FROM base_agg
      UNION ALL
      SELECT period_month, site_id, site_name, CAST('IN_COGS' AS STRING) AS input_id,
            CAST(agg_cogs AS DECIMAL(18,2)) AS input_value FROM base_agg
    ) src
    ```

    <details>
      <summary>What does `stg_input_values` do?</summary>

      This Join builds `stg_input_values`: 1 row per input metric, store, and month for 2001.

      1. **`base_agg`** aggregates TPC-DS `store_sales` by month and store into 3 measures: sales, units, and COGS.
      2. **`UNION ALL`** reshapes those 3 columns into long form: each measure becomes a row with `input_id` set to `IN_SALES`, `IN_UNITS`, or `IN_COGS`, plus `input_value`.
      3. **`FROM ( … ) src`** wraps the CTE so Coalesce can treat it as a Join source, as in `SELECT … FROM ( … ) src`.
    </details>

6. On the **Mapping** tab, make sure the columns are mapped to the following:

   - `src.period_month` - `BIGINT`
   - `src.site_id` - `BIGINT`
   - `src.site_name` - `STRING`
   - `src.input_id` - `STRING`
   - `src.input_value` - `DECIMAL(18,2)`

7. Click **Create**. Confirm the Node creates successfully.
8. Click **Run**. Confirm the run succeeds.
9. Open **Preview** and confirm long-form rows for `IN_SALES`, `IN_UNITS`, and `IN_COGS`.

<img src="/img/guides/metrics-engine/stg-input-values-preview.png" alt="Preview of stg_input_values with period_month, site_id, site_name, input_id set to IN_SALES, and large decimal input_value amounts." className="mdImages"/>

## Step 3: Seed the KPI Catalog

Create a Stage Node that seeds KPI definitions, formulas, dependencies, and whether each KPI is adjustable as data.

1. In **Browser**, click the **+** control next to the Nodes search box.
2. Choose **Add Node > Stage**.
3. Name the Node `ref_kpi_catalog` and set its Storage Location to **TARGET**.
4. Set the Node description to `KPI catalog defining calculation formulas, dependencies, and whether each KPI is adjustable`.
5. On the **Join** tab, paste:

    ```sql
    FROM (
      SELECT 'KPI_GROSS_MARGIN' AS kpi_id, 'Gross Margin' AS kpi_name,
            'IN_SALES - IN_COGS' AS formula_expr, 'IN_SALES,IN_COGS' AS depends_on,
            'input' AS calc_level, FALSE AS is_adjustable
      UNION ALL
      SELECT 'KPI_ASP', 'Average Selling Price',
            'IN_SALES / NULLIF(IN_UNITS, 0)', 'IN_SALES,IN_UNITS',
            'input', FALSE
      UNION ALL
      SELECT 'KPI_MARGIN_PCT', 'Margin Percentage',
            '(KPI_GROSS_MARGIN / NULLIF(IN_SALES, 0)) * 100', 'KPI_GROSS_MARGIN,IN_SALES',
            'derived', FALSE
      UNION ALL
      SELECT 'KPI_CONTRIBUTION', 'Contribution to Total',
            'KPI_GROSS_MARGIN', 'KPI_GROSS_MARGIN',
            'derived', TRUE
    ) src
    ```

    <details>
      <summary>What does `ref_kpi_catalog` do?</summary>

      This Join seeds `ref_kpi_catalog`: 1 row per KPI definition, built from hard-coded `UNION ALL` selects.

      1. Each `SELECT` defines a KPI: `kpi_id`, display name, `formula_expr`, comma-separated `depends_on` inputs or KPIs, `calc_level` as `input` or `derived`, and `is_adjustable`.
      2. **`UNION ALL`** stacks the 4 sample KPIs into 1 result set: gross margin and ASP from inputs, then margin percentage and contribution from derived KPIs.
      3. **`FROM ( … ) src`** wraps the seed so Coalesce can treat it as a Join source.

      `ref_kpi_catalog` and `ref_adjustments` are built from hard-coded `UNION ALL` rows in the Join. In production, you can load them from an application or admin process instead. They do not read `store_sales`, `date_dim`, or `store`, so the graph correctly shows no upstream Sources. Their outgoing lines go into `fct_kpi_values`.

      How they get updates:

      - **In this guide** - You change the seed SQL, then **Create** and **Run** those Nodes again. They do not refresh from warehouse Sources.
      - **Production use case** - Update the catalog with manual Databricks changes or a formula UI. Load adjustments from the adjustments application, not from sales Sources.

      Refresh `stg_input_values` from Sources often. Refresh the refs when the catalog or adjustment feed changes, then re-run `fct_kpi_values` and `fct_kpi_bi_flat`.
    </details>

6. On the **Mapping** tab, make sure the columns are mapped to the following:

   - `src.kpi_id` - `STRING`
   - `src.kpi_name` - `STRING`
   - `src.formula_expr` - `STRING`
   - `src.depends_on` - `STRING`
   - `src.calc_level` - `STRING`
   - `src.is_adjustable` - `BOOLEAN`

7. Click **Create**. Confirm the Node creates successfully.
8. Click **Run**. Confirm the run succeeds.
9. Open **Preview** and confirm 4 catalog rows.

<img src="/img/guides/metrics-engine/ref-kpi-catalog-preview.png" alt="Preview of ref_kpi_catalog with 4 KPI rows including KPI_ASP, KPI_CONTRIBUTION, and KPI_MARGIN_PCT, plus formula_expr and depends_on columns." className="mdImages"/>

`depends_on` and `formula_expr` document the intended hierarchy for governance and for a future dynamic evaluator. In this guide, Step 5 implements matching math in SQL and joins the catalog so `is_adjustable` controls whether adjustment deltas apply.

## Step 4: Seed Adjustments

Create a Stage Node with sample adjustment deltas for the adjustable KPI.

1. In **Browser**, click the **+** control next to the Nodes search box.
2. Choose **Add Node > Stage**.
3. Name the Node `ref_adjustments` and set its Storage Location to **TARGET**.
4. Set the Node description to `Manual adjustments for adjustable KPIs`.
5. On the **Join** tab, paste:

    ```sql
    FROM (
      SELECT 'KPI_CONTRIBUTION' AS kpi_id, 1 AS period_month, 1 AS site_id,
             'Store A' AS site_name, 150.00 AS adjustment_delta,
             'Q1 promotional boost' AS adjustment_reason
      UNION ALL
      SELECT 'KPI_CONTRIBUTION', 2, 1, 'Store A', -75.50, 'Inventory write-down'
      UNION ALL
      SELECT 'KPI_CONTRIBUTION', 3, 2, 'Store B', 200.00, 'New product launch'
      UNION ALL
      SELECT 'KPI_CONTRIBUTION', 1, 4, 'Store C', -50.00, 'Discount campaign'
    ) src
    ```

    <details>
      <summary>What does `ref_adjustments` do?</summary>

      This Join seeds `ref_adjustments`: 1 row per manual delta for an adjustable KPI, site, and month, built from hard-coded `UNION ALL` selects.

      1. Each `SELECT` defines an adjustment: which `kpi_id` it applies to, the `period_month`, `site_id`, and `site_name` grain, a signed `adjustment_delta`, and an `adjustment_reason`.
      2. **`UNION ALL`** stacks the 4 sample adjustments into 1 result set. All rows target `KPI_CONTRIBUTION`, the only adjustable KPI in the catalog.
      3. **`FROM ( … ) src`** wraps the seed so Coalesce can treat it as a Join source.
      4. Use `site_id` values that appear in `stg_input_values` for year 2001. In this sample, those keys are `1`, `2`, `4`, `7`, `8`, and `10`. A seed row for a missing `site_id` never joins in Step 5.
    </details>

6. On the **Mapping** tab, make sure the columns are mapped to the following:

   - `src.kpi_id` - `STRING`
   - `src.period_month` - `BIGINT`
   - `src.site_id` - `BIGINT`
   - `src.site_name` - `STRING`
   - `src.adjustment_delta` - `DECIMAL(18,2)`
   - `src.adjustment_reason` - `STRING`

7. Click **Create**. Confirm the Node creates successfully.
8. Click **Run**. Confirm the run succeeds.
9. Open **Preview** and confirm 4 adjustment rows.

<img src="/img/guides/metrics-engine/ref-adjustments-preview.png" alt="Preview of ref_adjustments with KPI_CONTRIBUTION rows, period_month, site_id, adjustment_delta, and adjustment_reason values." className="mdImages"/>

In production, load this table from your adjustments application. In this guide, synthetic rows prove the delta path on matching `kpi_id`, `period_month`, and `site_id` keys for adjustable KPIs. The `site_name` values in the seed, such as Store A, are labels only and are not join keys. Step 5 keeps `site_name` from `stg_input_values`, so preview names can differ from the seed labels.

## Step 5: Calculate KPI Values

Create the engine Stage Node that pivots inputs, calculates each KPI in SQL, and applies adjustments only where the catalog allows them.

1. In **Browser**, right-click `stg_input_values` and select **Add Node > Stage**.
2. Name the Node `fct_kpi_values` and set its Storage Location to **TARGET**.
3. Set the Node description to `Calculated KPI values with engine-computed values plus manual adjustments`.
4. On the **Join** tab, paste:

    ```sql
    FROM (
      WITH input_pivot AS (
        SELECT
          period_month,
          site_id,
          site_name,
          MAX(CASE WHEN input_id = 'IN_SALES' THEN input_value END) AS in_sales,
          MAX(CASE WHEN input_id = 'IN_UNITS' THEN input_value END) AS in_units,
          MAX(CASE WHEN input_id = 'IN_COGS' THEN input_value END) AS in_cogs
        FROM {{ ref('TARGET', 'stg_input_values') }} stg_input_values
        GROUP BY period_month, site_id, site_name
      ),
      kpi_calc AS (
        SELECT
          'KPI_GROSS_MARGIN' AS kpi_id,
          period_month,
          site_id,
          site_name,
          in_sales - in_cogs AS engine_value
        FROM input_pivot
        UNION ALL
        SELECT
          'KPI_ASP',
          period_month,
          site_id,
          site_name,
          in_sales / NULLIF(in_units, 0) AS engine_value
        FROM input_pivot
        UNION ALL
        SELECT
          'KPI_MARGIN_PCT',
          period_month,
          site_id,
          site_name,
          ((in_sales - in_cogs) / NULLIF(in_sales, 0)) * 100 AS engine_value
        FROM input_pivot
        UNION ALL
        SELECT
          'KPI_CONTRIBUTION',
          period_month,
          site_id,
          site_name,
          in_sales - in_cogs AS engine_value
        FROM input_pivot
      )
      SELECT
        kpi_calc.kpi_id,
        kpi_calc.period_month,
        kpi_calc.site_id,
        kpi_calc.site_name,
        kpi_calc.engine_value,
        CASE
          WHEN ref_kpi_catalog.is_adjustable THEN COALESCE(ref_adjustments.adjustment_delta, 0.0)
          ELSE 0.0
        END AS adjustment_delta,
        kpi_calc.engine_value + CASE
          WHEN ref_kpi_catalog.is_adjustable THEN COALESCE(ref_adjustments.adjustment_delta, 0.0)
          ELSE 0.0
        END AS final_value
      FROM kpi_calc
      INNER JOIN {{ ref('TARGET', 'ref_kpi_catalog') }} ref_kpi_catalog
        ON kpi_calc.kpi_id = ref_kpi_catalog.kpi_id
      LEFT JOIN {{ ref('TARGET', 'ref_adjustments') }} ref_adjustments
        ON kpi_calc.kpi_id = ref_adjustments.kpi_id
        AND kpi_calc.period_month = ref_adjustments.period_month
        AND kpi_calc.site_id = ref_adjustments.site_id
    ) src
    ```

    <details>
      <summary>What does `fct_kpi_values` do?</summary>

      This Join builds `fct_kpi_values`: 1 row per KPI, store, and month with engine-computed and final values.

      1. **`input_pivot`** pivots long-form inputs into wide columns `in_sales`, `in_units`, and `in_cogs` per site and month.
      2. **`kpi_calc`** calculates each catalog KPI in SQL, mirroring `formula_expr`, and stacks the results with `UNION ALL`.
      3. The outer `SELECT` joins `ref_kpi_catalog` and `ref_adjustments`, applies deltas only when `is_adjustable` is true, and sets `final_value = engine_value + adjustment_delta`.
      4. **`FROM ( … ) src`** wraps the CTEs so Coalesce can treat the query as a Join source.
    </details>

5. On the **Mapping** tab, make sure the columns are mapped to the following:

   - `src.kpi_id` - `STRING`
   - `src.period_month` - `BIGINT`
   - `src.site_id` - `BIGINT`
   - `src.site_name` - `STRING`
   - `src.engine_value` - `DECIMAL(18,2)`
   - `src.adjustment_delta` - `DECIMAL(18,2)`
   - `src.final_value` - `DECIMAL(18,2)`

6. Click **Create**. Confirm the Node creates successfully.
7. Click **Run**. Confirm the run succeeds.
8. Open **Preview** and confirm `engine_value`, `adjustment_delta`, and `final_value` for each KPI. Preview typically returns 100 sample rows. Where an adjustment matches an adjustable KPI, `final_value` differs from `engine_value` by that delta.

<img src="/img/guides/metrics-engine/fct-kpi-values-preview.png" alt="Preview of fct_kpi_values showing KPI_GROSS_MARGIN rows with period_month, site_id, site_name, and engine_value. Scroll the preview horizontally to confirm adjustment_delta and final_value." className="mdImages"/>

On the graph, `fct_kpi_values` should show parents `stg_input_values`, `ref_kpi_catalog`, and `ref_adjustments`.

## Step 6: Present a Flat BI Table

Create a Stage Node that pivots long-form KPI finals into 1 wide row per site and month for BI.

1. In **Browser**, right-click `fct_kpi_values` and select **Add Node > Stage**.
2. Name the Node `fct_kpi_bi_flat` and set its Storage Location to **TARGET**.
3. Set the Node description to `Flattened BI-ready table with one column per KPI for reporting tools`.
4. On the **Join** tab, paste:

    ```sql
    FROM {{ ref('TARGET', 'fct_kpi_values') }} fct_kpi_values
    GROUP BY
      period_month,
      site_id,
      site_name
    ```

    <details>
      <summary>What does `fct_kpi_bi_flat` do?</summary>

      This Join builds `fct_kpi_bi_flat`: 1 wide row per site and month for BI consumption.

      1. The Join reads `fct_kpi_values` and groups by `period_month`, `site_id`, and `site_name`.
      2. Mapping transforms pivot each `kpi_id` into its own column with `MAX(CASE WHEN … THEN final_value END)`.
    </details>

5. On the **Mapping** tab, define the grain columns and conditional aggregates:

   | Column | Transform | Type |
   | ------ | --------- | ---- |
   | `period_month` | `fct_kpi_values.period_month` | `BIGINT` |
   | `site_id` | `fct_kpi_values.site_id` | `BIGINT` |
   | `site_name` | `fct_kpi_values.site_name` | `STRING` |
   | `kpi_gross_margin` | `MAX(CASE WHEN fct_kpi_values.kpi_id = 'KPI_GROSS_MARGIN' THEN fct_kpi_values.final_value END)` | `DECIMAL(18,2)` |
   | `kpi_asp` | `MAX(CASE WHEN fct_kpi_values.kpi_id = 'KPI_ASP' THEN fct_kpi_values.final_value END)` | `DECIMAL(18,2)` |
   | `kpi_margin_pct` | `MAX(CASE WHEN fct_kpi_values.kpi_id = 'KPI_MARGIN_PCT' THEN fct_kpi_values.final_value END)` | `DECIMAL(18,2)` |
   | `kpi_contribution` | `MAX(CASE WHEN fct_kpi_values.kpi_id = 'KPI_CONTRIBUTION' THEN fct_kpi_values.final_value END)` | `DECIMAL(18,2)` |

6. Click **Create**. Confirm the Node creates successfully.
7. Click **Run**. Confirm the run succeeds.
8. Open **Preview** and confirm the wide table. **Previewed Rows** should show 72 site-month combinations for year 2001 store sales in this example, with 1 column per KPI. That count is the distinct site and month pairs present in the filtered sales data, not every store key in TPC-DS.

<img src="/img/guides/metrics-engine/fct-kpi-bi-flat-preview.png" alt="Preview of fct_kpi_bi_flat with 72 previewed rows showing period_month, site_id, site_name, and pivoted kpi_gross_margin. Scroll horizontally for the remaining KPI columns." className="mdImages"/>

## What's Next?

- Review [Databricks Connection Guide][] if teammates need the same warehouse setup.
- Explore [Databricks & Coalesce: Build a Weather Analytics Pipeline][] for another Databricks Stage and Fact walkthrough.
- Read [Using Incremental Nodes][] when input extracts should load only new periods.

[Databricks Connection Guide]: /docs/setup-your-project/connection-guides/databricks
[Databricks & Coalesce: Build a Weather Analytics Pipeline]: /docs/guides/databricks-build-weather-analytics
[Using Incremental Nodes]: /docs/guides/using-incremental-nodes
[Choosing the Right Node]: /docs/marketplace/choosing-the-right-node
