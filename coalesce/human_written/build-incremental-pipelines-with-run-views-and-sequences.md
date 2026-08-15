---
title: Build Incremental Pipelines with Run Views and Sequences
description: Build a CDC-style Snowflake pipeline from scratch with the Incremental Loading Package, Run Views, a load-sequence control table, sourcesuffix parameters, and deploy-safe Override Create SQL.
keywords: [incremental loading, Run View, sequence table, sourcesuffix, CDC, Incremental Loading Package, Override Create SQL, Deploy parameters, Snowflake, Coalesce]
hide_table_of_contents: true
slug: /guides/build-incremental-pipelines-with-run-views-and-sequences
tags: [Snowflake, Packages, Incremental Loading]
---

## Introduction

When you load change data in batches across multiple sources, a timestamp watermark alone often is not enough. You need a durable record of which source slice ran, in what order, and which rows belong to the current load window. This guide walks you through building that pipeline in Coalesce with Run Views, a sequence control table, and Job parameters.

This guide assumes you have knowledge of Coalesce including:

- [Environment][]
- [Version Control][]
- [Deployment][]

### What You Will Build

When you finish this guide, you will have:

- Installed the [Incremental Loading Package][] and used **Run View** and **Incremental Load** Node Types.
- A multi-suffix pipeline where Jobs pick branch **A**, **B**, both, or **ALL** through the **`sourcesuffix`** parameter.
- Deploy-safe guards so **Deploy** creates empty views and does not advance **`LOAD_SEQUENCE`**.

<img src="/img/guides/incremental-pipeline-final-graph.png" alt="" className="mdImages"/>

### How the Pipeline Fits Together

| Node | Node Type | What it does |
| ---- | --------- | ------------ |
| `LINEITEM` | Source | Snowflake sample table that supplies row data for every branch. |
| `LOAD_SEQUENCE` | Persistent Stage | Empty control table you create first. Each suffix Run View appends a row with the next sequence number, suffix letter, and load timestamp when a Job runs. |
| `STG_LINEA` | Run View | Staging view for branch **A**. Reads `LINEITEM`, creates the view, and inserts `'A'` into **`LOAD_SEQUENCE`**. Deploy guards skip the insert. |
| `STG_LINEB` | Run View | Same pattern as **`STG_LINEA`** for branch **B**. The trailing **`B`** in the Node name is the suffix the package matches to Job parameters. |
| `RV_LINEITEM` | Run View | Multi-source union over **`STG_LINEA`** and **`STG_LINEB`**. **`sourcesuffix`** selects which branches contribute rows to the union for the current Job. |
| `INC_LINEITEM` | Incremental Load | View over **`RV_LINEITEM`** that returns only rows newer than the watermark in **`PSTG_LINEITEM`** once incremental filtering is on. |
| `PSTG_LINEITEM` | Persistent Stage | Physical table that stores merged rows after each successful load. |

### Source Suffixes and Node Names

The **suffix** is the trailing character on each branch Run View name (**`A`** on **`STG_LINEA`**, **`B`** on **`STG_LINEB`**). The Incremental Loading Package compares that character to the Job parameter **`sourcesuffix`** when **Filter data based on Source** is on.

Name branches with a uniform suffix length. This guide uses one character, which matches **Length of suffix of source table** `1` on **`RV_LINEITEM`**. See [Incremental Loading Package Run View Parameters][] for longer suffix patterns.

### When to Use Run Views

Use this table to decide whether the multi-suffix Run View pattern fits your pipeline.

| Requirement | How this pattern helps |
| ----------- | ---------------------- |
| Multiple source branches into one incremental target | Per-suffix **Run View** Nodes feed a multi-source union (**`RV_LINEITEM`**). |
| Parameterized source selection per Job | **`sourcesuffix`** selects suffix `A`, `B`, a list, or `ALL`. |
| Orchestration metadata across runs | **`LOAD_SEQUENCE`** stores batch id, suffix, and load timestamp. |
| Deploy without re-running load logic | Environment **`sourcesuffix`** `('DEPLOY')` plus **Override Create SQL** guards. |

If you only have one source and a single timestamp watermark, start with [Incremental Loading with Coalesce][] or [Incremental Loading Strategies][].

## Before You Begin

1. A Coalesce account with Snowflake access. Start a free Coalesce trial from our [Snowflake Marketplace listing][] if needed.
2. A Project and Workspace with [Storage Locations and Storage Mappings][] configured. This guide uses `SAMPLE` and `WORK`.
3. Have your sources added to the Workspace.
4. Have [Version Control][] configured.
5. Have an [Environment][] configured.
6. Snowflake roles that can create views and tables in those locations.
7. Optional: Snowflake [sample data sets][] available in your account. Map `TPCH_SF1.LINEITEM` or equivalent to location `SAMPLE`.

## Step 1: Install the Incremental Loading Package

1. Go to the [Coalesce Marketplace][] and search for [Incremental Loading][].
2. Copy the Package ID `@coalesce/snowflake/incremental-loading`.
3. Open **Build Settings** from the left sidebar.
4. In the Coalesce App, go to **Build Settings > Packages**. Click **Install**.
5. Enter the Package ID you previously copied.
6. Select the version you want to install.
7. Enter a **Package Alias**. The alias is a unique and descriptive name for the Package so you can identify it later.
   1. A Package alias can only contain letters, numbers, and dashes. It can't contain consecutive dashes.
   2. Package aliases can't start or end with a dash.
8. Click **Install** to add the Package.

    <img src="/img/docs-images/packages_and_the_coalesce_marketplace/c8c8a12-install_package.png" alt="The installation screen for packages requires the user to enter the Package ID and Version, as well as a unique and descriptive Package Alias. For further details and guidelines, users are directed to the Coalesce Documentation. This ensures proper configuration and management of installed packages." className="mdImages" height="400px"/>

## Step 2: Create the LOAD_SEQUENCE Control Table

**`LOAD_SEQUENCE`** is the orchestration control table for this pattern. Create it first, while it is still empty, before you add suffix Run Views that append rows to it. When a Job runs **`STG_LINEA`** or **`STG_LINEB`**, each node inserts the next sequence number, its suffix letter **`A`** or **`B`**, and a load timestamp.

1. In the **Nodes** panel, click the plus sign **+** and select **Create New Node > Persistent Stage**.
2. Rename the Node to **`LOAD_SEQUENCE`**.
3. In **Config > Node Properties**, set the **Storage Location**.
4. You can delete any existing columns.
5. Open the **Mapping** tab and click the plus sign **+** to add a column:

   | Column | Data type |
   | ------ | --------- |
   | `LOAD_SEQUENCE` | NUMBER |
   | `SOURCE_SUFFIX` | VARCHAR |
   | `LOAD_TS` | TIMESTAMP |

6. Click **Create** to create the empty table.

<img src="/img/guides/guide_run_views_LOAD_SEQ.png" alt="LOAD_SEQUENCE Persistent Stage mapping with LOAD_SEQUENCE, SOURCE_SUFFIX, and LOAD_TS columns." className="mdImages"/>

## Step 3: Add STG_LINEA, Suffix A Run View

This Run View stages branch **A** data and records suffix **A** in **`LOAD_SEQUENCE`** when a Job runs.

1. On the graph, right-click **`LINEITEM`** and select **Add Node** > **Incremental Loading** > **Run View**.
2. Rename the Node to **`STG_LINEA`**.
3. Open **`STG_LINEA`** in the Node editor. Go to **Config > Options** and turn **Override Create SQL** on. A **Create SQL** tab appears in the editor alongside **Join** and **Mapping**.
4. Open the **Create SQL** tab and paste the full script below. Coalesce allows only **one SQL statement per stage** in Override Create SQL, so the view `CREATE` and the `INSERT` use separate `{{ stage(...) }}` blocks. Learn more in [Run Multiple SQL Statements][].

    ```sql
    {{ stage('Override Create SQL', deploy_phase_override="create") }}
    CREATE OR REPLACE VIEW {{ ref('WORK', 'STG_LINEA') }} AS (
        SELECT
            "L_ORDERKEY" AS "L_ORDERKEY",
            "L_PARTKEY" AS "L_PARTKEY",
            "L_SUPPKEY" AS "L_SUPPKEY",
            "L_LINENUMBER" AS "L_LINENUMBER",
            "L_QUANTITY" AS "L_QUANTITY",
            "L_EXTENDEDPRICE" AS "L_EXTENDEDPRICE",
            "L_DISCOUNT" AS "L_DISCOUNT",
            "L_TAX" AS "L_TAX",
            "L_RETURNFLAG" AS "L_RETURNFLAG",
            "L_LINESTATUS" AS "L_LINESTATUS",
            "L_SHIPDATE" AS "L_SHIPDATE",
            "L_COMMITDATE" AS "L_COMMITDATE",
            "L_RECEIPTDATE" AS "L_RECEIPTDATE",
            "L_SHIPINSTRUCT" AS "L_SHIPINSTRUCT",
            "L_SHIPMODE" AS "L_SHIPMODE",
            "L_COMMENT" AS "L_COMMENT"
        FROM {{ ref('SAMPLE', 'LINEITEM') }} "LINEITEM"
    );

    {{ stage('Insert Load Sequence') }}
    {% raw %}{% if 'DEPLOY' not in parameters.sourcesuffix %}{% endraw %}
    INSERT INTO {{ ref_no_link('WORK', 'LOAD_SEQUENCE') }}
    SELECT
      COALESCE(MAX("LOAD_SEQUENCE"), 0) + 1,
      'A',
      CURRENT_TIMESTAMP()
    FROM {{ ref_no_link('WORK', 'LOAD_SEQUENCE') }};
    {% raw %}{% endif %}{% endraw %}
    ```

    <img src="/img/guides/incremental-run-view-run-view-optionsp-enabled.png" alt="STG_LINEA Run View Node editor with Create SQL tab showing Override Create SQL and CREATE OR REPLACE VIEW for STG_LINEA." className="mdImages" />

5. Open the **Join** tab and paste the block below. `LINEITEM` is the data source. `ref_link()` adds a graph edge so Jobs run **`LOAD_SEQUENCE`** before **`STG_LINEA`**. The `INSERT` uses `ref_no_link()` so it resolves the table name without drawing that edge.

    ```sql
    FROM {{ ref('SAMPLE', 'LINEITEM') }} "LINEITEM"
    {{ ref_link('WORK', 'LOAD_SEQUENCE') }}
    ```

6. Click **Create**.

### Insert Load Sequence

The **Insert Load Sequence** SQL stage appends one row to **`LOAD_SEQUENCE`** each time **`STG_LINEA`** runs on a Job. **`STG_LINEB`** uses the same pattern with suffix `'B'`.

- **`{% raw %}{{ stage('Insert Load Sequence') }}{% endraw %}`** - Separate SQL statement from the view `CREATE` in the first stage.
- **`{% raw %}{% if 'DEPLOY' not in parameters.sourcesuffix %}{% endraw %}`** - Skips the insert during Deploy when **`sourcesuffix`** is `('DEPLOY')`. Sequence rows are written on Jobs only.
- **`INSERT`** - Stores the next sequence number (`COALESCE(MAX("LOAD_SEQUENCE"), 0) + 1`, starting at 1), suffix `'A'`, and load timestamp.
- **`ref_no_link()`** - Resolves **`LOAD_SEQUENCE`** without adding a graph edge. Run order comes from `ref_link()` on the **Join** tab.

Each Job run records the batch number, suffix **A**, and load time in the control table.

## Step 4: Add STG_LINEB, Suffix B Run View

Repeat the **`STG_LINEA`** pattern for branch **B**. The only differences are the Node name, view name, and `'B'` in the sequence insert.

1. Right-click **`LINEITEM`** and select **Add Node** > **Incremental Loading** > **Run View**.
2. Rename the Node to **`STG_LINEB`**.
3. Set **Storage Location**.
4. In **Config > Options**, turn **Override Create SQL** on, then open the **Create SQL** tab. Paste the full script below.

    ```sql
    {{ stage('Override Create SQL', deploy_phase_override="create") }}
    CREATE OR REPLACE VIEW {{ ref('WORK', 'STG_LINEB') }} AS (
        SELECT
            "L_ORDERKEY" AS "L_ORDERKEY",
            "L_PARTKEY" AS "L_PARTKEY",
            "L_SUPPKEY" AS "L_SUPPKEY",
            "L_LINENUMBER" AS "L_LINENUMBER",
            "L_QUANTITY" AS "L_QUANTITY",
            "L_EXTENDEDPRICE" AS "L_EXTENDEDPRICE",
            "L_DISCOUNT" AS "L_DISCOUNT",
            "L_TAX" AS "L_TAX",
            "L_RETURNFLAG" AS "L_RETURNFLAG",
            "L_LINESTATUS" AS "L_LINESTATUS",
            "L_SHIPDATE" AS "L_SHIPDATE",
            "L_COMMITDATE" AS "L_COMMITDATE",
            "L_RECEIPTDATE" AS "L_RECEIPTDATE",
            "L_SHIPINSTRUCT" AS "L_SHIPINSTRUCT",
            "L_SHIPMODE" AS "L_SHIPMODE",
            "L_COMMENT" AS "L_COMMENT"
        FROM {{ ref('SAMPLE', 'LINEITEM') }} "LINEITEM"
    );

    {{ stage('Insert Load Sequence') }}
    {% raw %}{% if 'DEPLOY' not in parameters.sourcesuffix %}{% endraw %}
    INSERT INTO {{ ref_no_link('WORK', 'LOAD_SEQUENCE') }}
    SELECT
      COALESCE(MAX("LOAD_SEQUENCE"), 0) + 1,
      'B',
      CURRENT_TIMESTAMP()
    FROM {{ ref_no_link('WORK', 'LOAD_SEQUENCE') }};
    {% raw %}{% endif %}{% endraw %}
    ```

5. On the **Join** tab, add `LINEITEM` as the source plus `ref_link()` to **`LOAD_SEQUENCE`**.

    ```sql
    FROM {{ ref('SAMPLE', 'LINEITEM') }} "LINEITEM"
    {{ ref_link('WORK', 'LOAD_SEQUENCE') }}
    ```

6. Click **Create**.

## Step 5: Add RV_LINEITEM

**`RV_LINEITEM`** unions the suffix staging views and applies **`sourcesuffix`** so each Job reads only the branches you select.

1. Right-click **`STG_LINEA`** and select **Add Node** > **Incremental Loading** > **Run View**.
2. Rename the Node to **`RV_LINEITEM`**.
3. In **Config > Options**, set:

   | Option | Value |
   | ------ | ----- |
   | **Multi Source** | On |
   | **Multi Source Strategy** | `UNION ALL` |
   | **Filter data based on Source** | On |
   | **Length of suffix of source table** | `1` |

    <figure>
      <img src="/img/guides/incremental-run-view-rv-lineitem-multi-source-options.png" alt="RV_LINEITEM Node editor with Config Options expanded showing Multi Source enabled, Multi Source Strategy set to UNION ALL, Filter data based on Source enabled, and Length of suffix of source table set to 1." className="mdImages" />
      <figcaption>RV_LINEITEM Config and Options with multi-source union and `sourcesuffix` filtering enabled</figcaption>
    </figure>

4. On the **Join** tab for `STG_LINEA`, add the following. Make sure to update to match your Nodes and Storage Locations:

    ```sql
    FROM {{ ref('WORK', 'STG_LINEA') }} "STG_LINEA"
    {% if 'DEPLOY' in parameters.sourcesuffix %}
      WHERE 1=0
    {%- elif 'ALL' not in parameters.sourcesuffix -%}
    WHERE 'A' in {{ parameters.sourcesuffix }}
    {% endif %}
    ```

5. Click the plus sign **+** to add a new source. Rename it `STG_LINEB`. Then drag `STG_LINEB` from the Nodes list into **Map to Existing Columns**. You should see the source update for `STG_LINEB`.

    <img src="/img/guides/incremental-run-view-package-add-lineb.png" alt="RV_LINEITEM Mapping tab with STG_LINEB selected and the drop zone to map columns from STG_LINEB." className="mdImages"/>

6. On the **Join** tab for `STG_LINEB`, add the following. Make sure to update to match your Nodes and Storage Locations:

    ```sql
    FROM {{ ref('WORK', 'STG_LINEB') }} "STG_LINEB"
    {%- if 'DEPLOY' in parameters.sourcesuffix -%}
    WHERE 1=0
    {%- elif 'ALL' not in parameters.sourcesuffix -%}
    WHERE 'B' in {{ parameters.sourcesuffix }}
    {% endif %}
    ```

Each source pill on the **Join** tab uses the same `sourcesuffix` pattern with a different suffix letter:

- **`FROM STG_LINEA` or `FROM STG_LINEB`** - Reads from that branch Run View.
- **`DEPLOY` in `sourcesuffix`** - `WHERE 1=0` creates the view empty so no data loads during Deploy.
- **`'ALL' not in sourcesuffix`** - `WHERE 'A' in sourcesuffix` or `WHERE 'B' in sourcesuffix` includes that branch only when its letter is in the Job parameter list, for example `('A')`, `('B')`, or `('A','B')`.
- **`('ALL')`** - No `WHERE` clause, so both branches contribute rows.

`sourcesuffix` controls which branches contribute rows: A, B, both, or all.

:::note[Checkpoint]

At this point you should have a multi-source Node named `RV_LINEITEM` with `STG_LINEA` and `STG_LINEB` mapped. Do not click **Create** until you set Workspace parameters in **Step 6**.

:::

## Step 6: Set Workspace Parameters and Create RV_LINEITEM

Set **Workspace** parameters before you **Create** **`RV_LINEITEM`**. With **Filter data based on Source** on, the join template reads `parameters.sourcesuffix`. Workspace defaults apply until an Environment or Job Schedule overrides them.

1. Open **Build Settings** > **Workspace** > **Settings** > **Parameters**.
2. Add a default for the first **Create**, for example:

    ```json
    {
      "sourcesuffix": "('ALL')"
    }
    ```

    You can also set it to `('A')` or `('B')`. **`RV_LINEITEM`** then returns rows from that branch only. With `('ALL')`, it unions both branches.

    <img src="/img/guides/incremental-run-view-parameters.png" alt="Workspace Settings Parameters tab with sourcesuffix set to ('ALL') in JSON format." className="mdImages"/>

3. Open **`RV_LINEITEM`** and click **Create** so the union view exists in Snowflake with your default `sourcesuffix`.

## Step 7: Add INC_LINEITEM and PSTG_LINEITEM and Run the Initial Load

Create the incremental view and its persistent target before you turn on watermark filtering.

1. Right-click **`RV_LINEITEM`** and select **Add Node** > **Incremental Load**.
2. Rename the Node to **`INC_LINEITEM`** and set the **Storage Location** . Leave **Filter data based on Persistent table** **off** for now.

    <figure>
      <img src="/img/guides/incremental-run-view-inc-lineitem-initial-config.png" alt="INC_LINEITEM Node editor with Config showing Storage Location set to WORK and Filter data based on Persistent Table disabled in Options." className="mdImages" />
      <figcaption>INC_LINEITEM initial setup with Storage Location WORK and persistent-table filtering off</figcaption>
    </figure>

3. Right-click **`INC_LINEITEM`** and select **Add Node** > **Base Node Types** > **Persistent Stage**.
4. Rename the Node to **`PSTG_LINEITEM`**.
5. Open **`INC_LINEITEM`**. On the **Join** tab, confirm the source is **`RV_LINEITEM`**, then click **Create** so the view exists before you load the persistent table.
6. Open **`PSTG_LINEITEM`** and click **Create**, then **Run** to load the initial data set.

## Step 8: Configure INC_LINEITEM for Incremental Loads

Turn on incremental filtering so **`INC_LINEITEM`** returns only rows newer than the watermark in **`PSTG_LINEITEM`**.

1. Open **`INC_LINEITEM`** Node.
2. In **Config > Options**:
   1. **Filter data based on Persistent table** **on**. Set **Persistent table location** to your Storage Location.
   2. **Persistent table name** to `PSTG_LINEITEM`
   3. **Incremental load column (date)** to `L_SHIPDATE`.
3. On the **Join** tab, remove any existing Join text, enter the following SQL. Make sure to update to match your Nodes and sources.

    ```sql
    FROM {{ ref('WORK', 'RV_LINEITEM') }} "RV_LINEITEM"
    WHERE "RV_LINEITEM"."L_SHIPDATE" >
    (SELECT COALESCE(MAX("L_SHIPDATE"), '1900-01-01')
                FROM {{ ref_no_link('WORK', 'PSTG_LINEITEM') }} )
    ```

   This keeps rows from **`RV_LINEITEM`** whose **`L_SHIPDATE`** is newer than the maximum already in **`PSTG_LINEITEM`**, or after `1900-01-01` when the table is empty.

4. Click **Create**, then **Run**.

<figure>
  <img src="/img/guides/incremental-run-view-inc-lineitem-join.png" alt="INC_LINEITEM Node editor with Join tab watermark SQL on L_SHIPDATE and Config Options showing Filter data based on Persistent Table enabled with PSTG_LINEITEM as the persistent table." className="mdImages" />
  <figcaption>INC_LINEITEM incremental configuration with persistent-table filtering and Join watermark on L_SHIPDATE</figcaption>
</figure>

:::note[Checkpoint]

**`INC_LINEITEM`** returns only rows newer than the watermark in **`PSTG_LINEITEM`**.

:::

## Step 9: Create a Job

You'll create a Job that contains the Nodes to refresh.

1. In the left sidebar, click **Jobs**, then click **+** and select **Create Job**.

    <img src="/img/guides/incremental-run-view-create-job.png" alt="Jobs sidebar with the plus menu open and Create Job highlighted." className="mdImages" width="70%"/>

2. Create a new Job called `RV_REFRESH_JOB`.
3. While on the Jobs screen, click **Nodes**.
4. Drag all your Nodes into the Job except for the Source Node.

<img src="/img/guides/incremental-run-view-job.png" alt="RV_REFRESH_JOB graph with LOAD_SEQUENCE, STG_LINEA, STG_LINEB, RV_LINEITEM, INC_LINEITEM, and PSTG_LINEITEM; LINEITEM source excluded." className="mdImages"/>

## Step 10: Commit and Deploy

Commit and deploy your changes using the version control provider and Environment created in Before You Begin.

Set **`sourcesuffix`** on the [target environment][] so Deploy uses empty views and skips sequence inserts.

    ```json
    {
      "sourcesuffix": "('DEPLOY')"
    }
    ```

## Step 11: Schedule the Job with Parameters

Use the Coalesce Scheduler to refresh the pipeline on a schedule. You can set different refresh times and a different `sourcesuffix` for each schedule if needed.

1. In the Coalesce App, open **Deploy**, click the dropdown next to the Environment and click **View Scheduled Jobs**.
2. Click **Create Job Schedule**.
3. Fill out the **Configuration** information.
4. Then set the **Notifications**.
5. On Parameters, enable **Override Environment**. Then set the parameters based on how you want this refresh Job to run. You can create multiple Job Schedules if you want to run this job multiple times with different parameters.

    - **Branch A only**

        ```json
        {
          "sourcesuffix": "('A')"
        }
        ```

    - **Branches A and B**

        ```json
        {
          "sourcesuffix": "('A','B')"
        }
        ```

    - **All branches**

        ```json
        {
          "sourcesuffix": "('ALL')"
        }
        ```

    <img src="/img/guides/incremental-run-refresh-parameters.png" alt="Create Job Schedule Parameters step with Override environment enabled and sourcesuffix set to ('A') in JSON." className="mdImages"/>

6. Save the **Job Schedule**. Each scheduled run re-creates the Run Views with your **`sourcesuffix`**, advances **`LOAD_SEQUENCE`**, and drives **`INC_LINEITEM`** for the selected branches.

## Common Issues

- **Sequence rows on every Deploy:** Confirm **Step 10** sets environment **`sourcesuffix`** to `('DEPLOY')`, and **Steps 3 and 4** include `deploy_phase_override="create"` and the `{% if 'DEPLOY' not in parameters.sourcesuffix %}` guard on sequence inserts.
- **`Actual statement count 2 did not match the desired statement count 1`:** Put the view `CREATE` and the `INSERT` into separate `{{ stage(...) }}` blocks. See [Run Multiple SQL Statements][].
- **Wrong branch or no rows from `RV_LINEITEM`:** Keep suffix length uniform on **`STG_LINEA`** and **`STG_LINEB`** with length **1**, and regenerate Join on each source pill after you change suffix length.
- **Empty incremental load on first run:** Leave **Filter data based on Persistent table** off until **`PSTG_LINEITEM`** has data from **Step 7**.
- **`LOAD_SEQUENCE` dependency errors:** Create and **Create** **`LOAD_SEQUENCE`** before you add `ref_link()` on the suffix Run Views.

## What's Next?

- [Incremental Loading Strategies][] for chooser context across warehouses
- [Incremental Loading with Coalesce][] for watermark basics on a single source
- [Incremental Loading Package][] listing for Run View, Looped Load, and Grouped Incremental Load reference
- [Parameters][] for inheritance between environments and Jobs
- [Refreshing Your Pipeline Using the Coalesce Scheduler][] for cron, notifications, and schedule management

[Snowflake Marketplace listing]: https://app.snowflake.com/marketplace/listing/GZSTZ1868F5RH/coalesce-coalesce
[sample data sets]: /docs/setup-your-project/connection-guides/snowflake/
[Storage Locations and Storage Mappings]: /docs/get-started/coalesce-fundamentals/storage-locations-and-storage-mappings
[Incremental Loading with Coalesce]: /docs/guides/using-incremental-nodes
[Incremental Loading Strategies]: /docs/build-your-pipeline/incremental-loading-strategies
[Incremental Loading Package]: /docs/marketplace/package/coalesce_snowflake_incremental-loading/
[Incremental Loading Package Run View Parameters]: /docs/marketplace/package/coalesce_snowflake_incremental-loading#run-view-parameters
[Parameters]: /docs/deploy-and-refresh/parameters/
[Coalesce Marketplace]: /docs/marketplace
[Run Multiple SQL Statements]: /docs/build-your-pipeline/pre-post-sql#run-multiple-sql-statements
[Version Control]: /docs/git-integration
[Environment]: /docs/get-started/coalesce-fundamentals/environments
[Deployment]: /docs/deploy-and-refresh/deploy
[Incremental Loading]: /docs/marketplace/package/coalesce_snowflake_incremental-loading
[Refreshing Your Pipeline Using the Coalesce Scheduler]: /docs/deploy-and-refresh/refresh/scheduling-jobs-in-coalesce
[target environment]: /docs/marketplace/package/coalesce_snowflake_incremental-loading#run-view-deployment
