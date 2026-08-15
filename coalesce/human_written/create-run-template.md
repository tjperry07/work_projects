---
title: Create and Run Templates
description: Build powerful custom nodes in Coalesce using Create and Run templates for defining table structures and data population logic. Learn to implement DDL and DML operations with dynamic Jinja templating, handle platform-specific syntax for Snowflake and Databricks, create complex dimension and fact table logic, and develop reusable node templates with advanced SQL generation capabilities.
keywords: [Coalesce create templates, run templates, custom node development, DDL DML templates, Jinja SQL templating, dynamic node creation, Snowflake custom nodes, Databricks node templates, dimension table templates, fact table logic, custom SQL generation, node template development, enterprise node customization, Coalesce template engine, metadata-driven SQL]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note[Data Platform Identifiers]

Each data platform uses different identifiers in the Create and Run Template. Make sure you are using the right one

- Snowflake uses quotes.
- Databricks uses backticks.

Examples will show each platform.

:::

## Create Template

A **Create Template** is an **optional** template that defines the creation of the table's structure, and is equivalent to DDL.

<details>
<summary>**Snowflake Dimension Node Create Template Example**</summary>

  ```sql
  {% if node.materializationType == 'table' %}
    {{ stage('Create Dimension Table') }}

    CREATE OR REPLACE TABLE {{this}}
    (
      {% for col in columns %}
        "{{ col.name }}" {{ col.dataType }}
        {% if col.isSurrogateKey %}
              identity
        {% endif %}
        {%- if not col.nullable %} NOT NULL
          {%- if col.defaultValue | length > 0 %} DEFAULT {{ col.defaultValue }}{% endif %}
        {% endif %}
        {%- if col.description | length > 0 %} COMMENT '{{ col.description | escape }}'{% endif %}
        {%- if not loop.last -%}, {% endif %}
      {% endfor %}
    )
    {%- if node.description | length > 0 %} COMMENT = '{{ node.description | escape }}'{% endif %}


  {% elif node.materializationType == 'view' %}
    {{ stage('Create Dimension View') }}

    CREATE OR REPLACE VIEW {{ ref_no_link(node.location.name, node.name) }}
    (
      {% for col in columns %}
        "{{ col.name }}"
        {%- if col.description | length > 0 %} COMMENT '{{ col.description | escape }}'{% endif %}
        {%- if not loop.last -%},{% endif %}
      {% endfor %}
    )
    {%- if node.description | length > 0 %} COMMENT = '{{ node.description | escape }}'{% endif %}
    AS
    {% for source in sources %}

      {% if loop.first %}SELECT {% endif %}

      {% for col in source.columns %}
        {% if col.isSurrogateKey or col.isSystemUpdateDate or col.isSystemCreateDate %}
                  NULL
        {% else %}
                  {{ get_source_transform(col) }}
        {% endif %}
        AS "{{ col.name }}"
        {%- if not loop.last -%}, {% endif %}
      {% endfor %}
      {{ source.join }}

      {% if not loop.last %} UNION ALL {% endif %}
    {% endfor %}

  {% endif %}
  ```

</details>

<details>
  <summary>**Databricks Dimension Node Create Template Example**</summary>

```sql
  {#
    Copyright (c) 2023 Coalesce. All rights reserved.
This script and its associated documentation are confidential and proprietary to Coalesce.
Unauthorized reproduction, distribution, or disclosure of this material is strictly prohibited.
Coalesce permits you to copy and modify this script for the purposes of using with Coalesce but
does not permit copying or modification for any other purpose.
#}
{# == Node Type Version        : 1  == #}
{# == Node Type Name           : Dimension  == #}
{# == Node Type Description    : This node creates dimension table,view and also override create sql for view  == #}


{# Override CreateSQL for view #}

{% if node.override.create.enabled %}

    {{ node.override.create.script }}

{% elif node.materializationType == 'table' %}
    {{ stage('Create Dimension Table') }}

{# CreateSQL for Table #}

    CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
    (
        {% for col in columns %}
            `{{ col.name }}` {{ col.dataType }}
            {% if col.isSurrogateKey %}
                GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1)
            {% endif %}
            {%- if not col.nullable %} NOT NULL
            {% endif%}
            {%- if col.description | length > 0 %} COMMENT '{{ col.description | escape }}'{% endif %}
            {%- if not loop.last -%}, {% endif %}
        {% endfor %}
    )
    {%- if node.description | length > 0 %} COMMENT  '{{ node.description | escape }}'{% endif %}
  TBLPROPERTIES('delta.columnMapping.mode' = 'name')


{% elif node.materializationType == 'view' %}
    {{ stage('Create Dimension View') }}

{# CreateSQL for View #}

    CREATE OR REPLACE VIEW {{ ref_no_link(node.location.name, node.name) }}
    (
        {% for col in columns %}
            `{{ col.name }}`
            {%- if col.description | length > 0 %} COMMENT '{{ col.description | escape }}'{% endif %}
            {%- if not loop.last -%},{% endif %}
        {% endfor %}
    )
    {%- if node.description | length > 0 %} COMMENT = '{{ node.description | escape }}'{% endif %}
    AS
    {% for source in sources %}

        {% if loop.first %}SELECT {% endif %}
        {% if config.selectDistinct %}DISTINCT{% endif %}

        {% for col in source.columns %}
            {% if col.isSurrogateKey or col.isSystemUpdateDate or col.isSystemCreateDate %}
                NULL
            {% else %}
                {{ get_source_transform(col) }}
            {% endif %}
            AS `{{ col.name }}`
            {%- if not loop.last -%}, {% endif %}
        {% endfor %}
        {{ source.join }}
        {% if config.groupByAll %} GROUP BY ALL {% endif %}
        {% if not loop.last %} UNION ALL {% endif %}
    {% endfor %}

{% endif %}
```

</details>

Below is an example of a Create Template that will create an empty table with two columns.

<Tabs>
  <TabItem value="snowflake-empty-table" label="Snowflake" default>

```sql
{{ stage('Create Stage Table') }}
CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
  (
    "MY_COLUMN" NUMBER(38,0),
    "MY_COLUMN2" NUMBER(38, 0)
  )
```

  </TabItem>
  <TabItem value="databricks-empty-table" label="Databricks">

```sql
{{ stage('Create Stage Table') }}

CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
(
    `MY_COLUMN` NUMBER(38,0),
    `MY_COLUMN2` NUMBER(38,0)
)

```

  </TabItem>
</Tabs>

Below is a more complex (dynamic) example, where the columns of the source node are created using the underlying metadata for the current node. Null values, default values, and the description column are being processed accordingly to create a DDL SQL statement and resulting table.

<Tabs>
  <TabItem value="snowflake-complex-create" label="Snowflake" default>

```sql
{{ stage('Create Stage Table') }}
CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
  (
    {% for col in columns %}
      "{{ col.name }}" {{ col.dataType }}
      {%- if not col.nullable %} NOT NULL
        {%- if col.defaultValue | length > 0 %} DEFAULT {{ col.defaultValue }}{% endif %}
      {% endif %}
      {%- if col.description | length > 0 %} COMMENT '{{ col.description }}'{% endif %}
      {%- if not loop.last -%}, {% endif %}
    {% endfor %}
  )
```

  </TabItem>
  <TabItem value="databricks-complex-create" label="Databricks">

```sql
{{ stage('Create Stage Table') }}
CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
(
  {% for col in columns %}
    `{{ col.name }}` {{ col.dataType }}
    {%- if not col.nullable %} NOT NULL
      {%- if col.defaultValue | length > 0 %} DEFAULT {{ col.defaultValue }}{% endif %}
    {% endif %}
    {%- if col.description | length > 0 %} COMMENT '{{ col.description | escape }}'{% endif %}
    {%- if not loop.last -%}, {% endif %}
  {% endfor %}
)
```

  </TabItem>

</Tabs>

## Run Template

A **Run Template** is a **optional** template that defines how the table will be populated with data and is equivalent to DML.

<details>
<summary>**Snowflake Dimension Node Run Template Example**</summary>

  ```sql

  {% set is_type_2 = columns | selectattr("isChangeTracking") | list | length > 0 %}

      {% for test in node.tests if config.testsEnabled %}
          {% if test.runOrder == 'Before' %}
              {{ test_stage(test.name, test.continueOnFailure) }}
              {{ test.templateString }}
          {% endif %}
      {% endfor %}

  {% if node.materializationType == 'table' %}

    {% if config.preSQL %}
      {{ stage('Pre-SQL') }}
      {{ config.preSQL }}
    {% endif %}
    
      {% if is_type_2 %}

          {% for source in sources %}
              {{ stage('MERGE ' + source.name | string) }}
              MERGE INTO {{ ref_no_link(node.location.name, node.name) }} "TGT"
              USING (
              /* New Rows That Don't Exist */
              SELECT
              {% for col in source.columns if not col.isSurrogateKey %}
                  {% if col.isSystemVersion %}
                      1
                  {% elif col.isSystemCurrentFlag %}
                      'Y'
                  {% else %}
                    {{ get_source_transform(col) }}
                  {% endif %}
                  AS "{{ col.name }}",
              {% endfor %}
                  'INSERT_INITAL_VERSION_ROWS' AS "DML_OPERATION"
              {{ source.join }}
              LEFT JOIN {{ ref_no_link(node.location.name, node.name) }} "DIM" ON
              {% for col in source.columns if col.isBusinessKey -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                      {{ get_source_transform(col) }} = "DIM"."{{ col.name }}"
              {% endfor %}
              WHERE
              {% for col in source.columns if col.isBusinessKey -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                  "DIM"."{{ col.name }}" IS NULL
              {% endfor %}
              UNION ALL
              /* New Row Needing To Be Inserted Due To Type-2 Column Changes */
              SELECT
              {% for col in source.columns if not col.isSurrogateKey %}
                  {% if col.isSystemVersion %}
                      "DIM"."{{ col.name }}" + 1
                  {% elif col.isSystemCurrentFlag %}
                      'Y'
                  {% else %}
                    {{ get_source_transform(col) }}
                  {% endif %}
                  AS "{{ col.name }}",
              {% endfor %}
                  'INSERT_NEW_VERSION_ROWS' AS "DML_OPERATION"
              {{ source.join }}
              INNER JOIN {{ ref_no_link(node.location.name, node.name) }} "DIM" ON
              {% for col in source.columns if col.isBusinessKey -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                  {{ get_source_transform(col) }} = "DIM"."{{ col.name }}"
              {% endfor %}
              WHERE "DIM"."{{ get_value_by_column_attribute("isSystemCurrentFlag") }}" = 'Y'
              {% for col in source.columns if (col.isChangeTracking == true) %}
                  {% if loop.first %}
                      AND (
                  {% else %}
                      OR
                  {% endif %}
                  ( NVL( CAST({{ get_source_transform(col) }} as STRING), '**NULL**') <> NVL( CAST("DIM"."{{ col.name }}" as STRING), '**NULL**') )
                  {% if loop.last %}
                      )
                  {% endif %}
              {% endfor %}
              UNION ALL
              /* Rows Needing To Be Expired Due To Type-2 Column Changes
              In this case, only two columns are merged (version and end date) */
              SELECT
              {%- for col in source.columns if not col.isSurrogateKey %}
                  {% if col.isSystemEndDate %}
                      DATEADD(MILLISECONDS, -1, CAST(CURRENT_TIMESTAMP AS TIMESTAMP))
                  {% elif col.isSystemCurrentFlag %}
                      'N'
                  {% else %}
                      "DIM"."{{ col.name }}"
                  {% endif %}
                  AS "{{ col.name }}",
              {% endfor -%}
                  'update_expired_version_rows' AS "DML_OPERATION"
              {{ source.join }}
              INNER JOIN {{ ref_no_link(node.location.name, node.name) }} "DIM" ON
              {% for col in source.columns if col.isBusinessKey -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                  {{ get_source_transform(col) }} = "DIM"."{{ col.name }}"
              {% endfor %}
              WHERE "DIM"."{{ get_value_by_column_attribute("isSystemCurrentFlag") }}" = 'Y'
              {% for col in source.columns if (col.isChangeTracking == true) %}
                  {% if loop.first %}
                      AND (
                  {% else %}
                      OR
                  {% endif %}
                  ( NVL( CAST({{ get_source_transform(col) }} as STRING), '**NULL**') <> NVL( CAST("DIM"."{{ col.name }}" as STRING), '**NULL**') )
                  {% if loop.last %}
                      )
                  {% endif %}
              {% endfor %}
              {# The if-block below avoids unnecessary updates when no type 2 column changes are present #}
              {% if source.columns 
                  | rejectattr('isSurrogateKey')
                  | rejectattr('isBusinessKey')
                  | rejectattr('isChangeTracking')
                  | rejectattr('isSystemVersion')
                  | rejectattr('isSystemCurrentFlag')
                  | rejectattr('isSystemStartDate')
                  | rejectattr('isSystemEndDate')
                  | rejectattr('isSystemCreateDate')
                  | rejectattr('isSystemUpdateDate') 
                  | list | length == 0 
              %}
                  {# Skip Section #}
              {% else %}
                UNION ALL
                /* Rows Needing To Be Updated Due To Changes To Non-Type-2 columns
                This case merges only when there are changes in non-type-2 column updates, but no changes in type-2 columns*/
                SELECT
                {%- for col in source.columns if not col.isSurrogateKey %}
                    {% if col.isSystemVersion or col.isSystemCreateDate or col.isSystemStartDate or col.isSystemEndDate %}
                        "DIM"."{{ col.name }}"
                    {% elif col.isSystemCurrentFlag %}
                        'Y'
                    {% else %}
                        {{ get_source_transform(col) }}
                    {% endif %}
                    AS "{{ col.name }}",
                {% endfor -%}
                    'UPDATE_NON_TYPE2_ROWS' AS "DML_OPERATION"
                {{ source.join }}
                INNER JOIN {{ ref_no_link(node.location.name, node.name) }} "DIM" ON
                {% for col in source.columns if col.isBusinessKey -%}
                    {% if not loop.first %}
                        AND
                    {% endif %}
                    {{ get_source_transform(col) }} = "DIM"."{{ col.name }}"
                {% endfor %}
                WHERE "DIM"."{{ get_value_by_column_attribute("isSystemCurrentFlag") }}" = 'Y'
                AND (
                {% for col in source.columns if (col.isChangeTracking) -%}
                    {% if not loop.first %}
                        AND
                    {% endif %}
                    {{ get_source_transform(col) }} = "DIM"."{{ col.name }}"
                {% endfor %} )
                {% for col in source.columns if not (   col.isBusinessKey or
                                                        col.isChangeTracking or
                                                        col.isSurrogateKey or
                                                        col.isSystemVersion or
                                                        col.isSystemCurrentFlag or
                                                        col.isSystemStartDate or
                                                        col.isSystemEndDate or
                                                        col.isSystemUpdateDate or
                                                        col.isSystemCreateDate) -%}
                    {% if loop.first %}
                        AND (
                    {% endif %}
                    {% if not loop.first %}
                        OR
                    {% endif %}
                    NVL( CAST({{ get_source_transform(col) }} as STRING), '**NULL**') <> NVL( CAST("DIM"."{{ col.name }}" as STRING), '**NULL**')
                    {% if loop.last %}
                        )
                    {% endif %}
                {% endfor %}
              {% endif %}
          ) AS "SRC"
          ON
          {% for col in source.columns if col.isBusinessKey -%}
              {% if not loop.first %}
                  AND
              {% endif %}
              "TGT"."{{ col.name }}" = "SRC"."{{ col.name }}"
          {% endfor %}
          AND "TGT"."{{ get_value_by_column_attribute("isSystemVersion") }}" = "SRC"."{{ get_value_by_column_attribute("isSystemVersion") }}"
          WHEN MATCHED THEN UPDATE SET
          {%- for col in source.columns if not (col.isBusinessKey or col.isSurrogateKey or col.isSystemCreateDate) %}
              "TGT"."{{ col.name }}" = "SRC"."{{ col.name }}"
              {% if not loop.last %}, {% endif %}
          {% endfor -%}
          WHEN NOT MATCHED THEN INSERT (
          {%- for col in source.columns if not col.isSurrogateKey %}
              "{{ col.name }}"
              {% if not loop.last %}, {% endif %}
          {% endfor -%}
          )
          VALUES (
          {%- for col in source.columns if not col.isSurrogateKey %}
              "SRC"."{{ col.name }}"
              {% if not loop.last %}, {% endif %}
          {% endfor -%}
          )

      {% endfor %}



      {% else %}
          {% for source in sources %}
              {{ stage('MERGE ' + source.name | string ) }}
              MERGE INTO {{ ref_no_link(node.location.name, node.name) }} "TGT"
              USING (
                  SELECT
                  {% for col in source.columns if not col.isSurrogateKey %}
                      {% if col.isSystemVersion %}
                        1
                      {% elif col.isSystemCurrentFlag %}
                        'Y'
                      {% else %}
                          {{ get_source_transform(col) }}
                      {% endif %}
                      AS "{{ col.name }}"
                      {%- if not loop.last %}, {% endif %}
                  {% endfor %}
                  {{ source.join }})
                  AS "SRC"
              ON
              {% for col in source.columns if col.isBusinessKey -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                  "SRC"."{{ col.name }}" = "TGT"."{{ col.name }}"
              {% endfor %}
              WHEN MATCHED
              {% for col in source.columns if not (   col.isBusinessKey or
                                                      col.isSurrogateKey or
                                                      col.isSystemVersion or
                                                      col.isSystemCurrentFlag or
                                                      col.isSystemStartDate or
                                                      col.isSystemEndDate or
                                                      col.isSystemUpdateDate or
                                                      col.isSystemCreateDate) %}
                  {% if loop.first %}
                      AND (
                  {% else %}
                      OR
                  {% endif %}
                  NVL( CAST("SRC"."{{ col.name }}" as STRING), '**NULL**') <> NVL( CAST("TGT"."{{ col.name }}" as STRING), '**NULL**')
                  {% if loop.last %}
                      )
                  {% endif %}
              {% endfor %}
              THEN UPDATE SET
              {%- for col in source.columns if not (  col.isBusinessKey or
                                                      col.isSurrogateKey or
                                                      col.isSystemVersion or
                                                      col.isSystemCurrentFlag or
                                                      col.isSystemStartDate or
                                                      col.isSystemEndDate or
                                                      col.isSystemCreateDate) %}
                      "TGT"."{{ col.name }}" = "SRC"."{{ col.name }}"
                  {% if not loop.last %}, {% endif %}
              {% endfor %}
              WHEN NOT MATCHED THEN
              INSERT (
              {%- for col in source.columns if not col.isSurrogateKey %}
                  "{{ col.name }}"
                  {% if not loop.last %}, {% endif %}
              {% endfor -%}
              )
              VALUES (
              {%- for col in source.columns if not col.isSurrogateKey %}
                  "SRC"."{{ col.name }}"
                  {% if not loop.last %}, {% endif %}
              {% endfor -%}
              )
          {% endfor %}
      {% endif %}
    
    {% if config.postSQL %}
      {{ stage('Post-SQL') }}
      {{ config.postSQL }}
    {% endif %}
  {% endif %}

  {% if config.testsEnabled %}
    {% for test in node.tests %}
      {% if test.runOrder == 'After' %}
        {{ test_stage(test.name, test.continueOnFailure) }}
        {{ test.templateString }}
          {% endif %}
    {% endfor %}

    {% for column in columns %}
      {% for test in column.tests %}
        {{ test_stage(column.name + ": " + test.name) }}
        {{ test.templateString }}
      {% endfor %}
    {% endfor %}
  {% endif %}
  ```

</details>

<details>
  <summary>**Databricks Dimension Node Run Template Example**</summary>

```sql
{#
    Copyright (c) 2023 Coalesce. All rights reserved.
This script and its associated documentation are confidential and proprietary to Coalesce.
Unauthorized reproduction, distribution, or disclosure of this material is strictly prohibited.
Coalesce permits you to copy and modify this script for the purposes of using with Coalesce but
does not permit copying or modification for any other purpose.  
#}
{# == Node Type Version        : 1  == #}
{# == Node Type Name           : Dimension  == #}
{# == Node Type Description    :This node loads data into work table using config options distinct,groupby all,order by ,multi-source  == #}


{# == Variable check to identify type of dimension == #}

{% set is_type_2 = columns | selectattr("isChangeTracking") | list | length > 0 %}

{# == To run data quality tests before data insertion == #}

    {% for test in node.tests if config.testsEnabled %}
        {% if test.runOrder == 'Before' %}
            {{ test_stage(test.name, test.continueOnFailure) }}
            {{ test.templateString }}
        {% endif %}
    {% endfor %}


{% if node.materializationType == 'table' %}

{# == Queries to be executed before data insertion  == #}

    {% if config.preSQL %}            
        {{ stage('Pre-SQL') }}
        {{ config.preSQL }}
    {% endif %}

 {# == Truncate data before data insertion  == #}

    {% if config.truncateBefore %}
        {{ stage('Truncate Dimension Table') }}
        TRUNCATE TABLE {{ ref_no_link(node.location.name, node.name) }}
    {% endif %}
    
    {% if is_type_2 %}
         
         {# SCD-Type 2 Dimension == #}
        
            {{ stage('MERGE ' + ' Sources' | string) }}
            MERGE INTO {{ ref_no_link(node.location.name, node.name) }} `TGT`
            USING (
      

        {% for source in sources %}

           {% set joinclause = source.join %}
           
            /* New Rows That Don't Exist */
            (SELECT
            {% if config.selectDistinct %}
            DISTINCT
            {% endif %}
            {% for col in source.columns if not col.isSurrogateKey %}
                {% if col.isSystemVersion %}
                    1
                {% elif col.isSystemCurrentFlag %}
                    'Y'
                {% else %}
                   {{ get_source_transform(col) }}
                {% endif %}
                AS `{{ col.name }}`,
            {% endfor %}
                'INSERT_INITIAL_VERSION_ROWS' AS `DML_OPERATION`
            {{  get_clause(joinclause,'from')  }}
            LEFT JOIN {{ ref_no_link(node.location.name, node.name) }} `DIM` ON
            {% for col in source.columns if col.isBusinessKey -%}
                {% if not loop.first %}
                    AND
                {% endif %}
                    {{ get_source_transform(col) }} = `DIM`.`{{ col.name }}`
            {% endfor %}
            WHERE
            {% for col in source.columns if col.isBusinessKey -%}
                {% if not loop.first %}
                    AND
                {% endif %}
                `DIM`.`{{ col.name }}` IS NULL
            {% endfor %}
            {{ get_clause(joinclause) }}
            {% if config.groupByAll %}
            GROUP BY ALL
            {% endif %}
            {{ sortorder_by_colv() }}
            )

            UNION ALL
            /* New Row Needing To Be Inserted Due To Type-2 Column Changes */

            (SELECT
            {% if config.selectDistinct %}
            DISTINCT
            {% endif %}
            {% for col in source.columns if not col.isSurrogateKey %}
                {% if col.isSystemVersion %}
                    `DIM`.`{{ col.name }}` + 1
                {% elif col.isSystemCurrentFlag %}
                    'Y'
                {% else %}
                   {{ get_source_transform(col) }}
                {% endif %}
                AS `{{ col.name }}`,
            {% endfor %}
                'INSERT_NEW_VERSION_ROWS' AS `DML_OPERATION`
            {{  get_clause(joinclause,'from')  }}
            INNER JOIN {{ ref_no_link(node.location.name, node.name) }} `DIM` ON
            {% for col in source.columns if col.isBusinessKey -%}
                {% if not loop.first %}
                    AND
                {% endif %}
                {{ get_source_transform(col) }} = `DIM`.`{{ col.name }}`
            {% endfor %}
            WHERE `DIM`.`{{ get_value_by_column_attribute("isSystemCurrentFlag") }}` = 'Y'
            {% for col in source.columns if (col.isChangeTracking == true) %}
                {% if loop.first %}
                    AND (
                {% else %}
                    OR
                {% endif %}
                ( NVL( CAST({{ get_source_transform(col) }} as STRING), '**NULL**') <> NVL( CAST(`DIM`.`{{ col.name }}` as STRING), '**NULL**') )
                {% if loop.last %}
                    )
                {% endif %}
            {% endfor %}
            {{  get_clause(joinclause)  }}
            {% if config.groupByAll %}
            GROUP BY ALL
            {% endif %}
            {{ sortorder_by_colv() }}
            )
            UNION ALL
            /* Rows Needing To Be Expired Due To Type-2 Column Changes
            In this case, only two columns are merged (version and end date) */
            
            (SELECT
            {% if config.selectDistinct %}
            DISTINCT
            {% endif %}
            {%- for col in source.columns if not col.isSurrogateKey %}
                {% if col.isSystemEndDate %}
                    DATEADD(SECOND,-0.001,CAST(CURRENT_TIMESTAMP AS TIMESTAMP))
                {% elif col.isSystemCurrentFlag %}
                    'N'
                {% else %}
                    `DIM`.`{{ col.name }}`
                {% endif %}
                AS `{{ col.name }}`,
            {% endfor -%}
                'update_expired_version_rows' AS `DML_OPERATION`
            {{  get_clause(joinclause,'from')  }}
            INNER JOIN {{ ref_no_link(node.location.name, node.name) }} `DIM` ON
            {% for col in source.columns if col.isBusinessKey -%}
                {% if not loop.first %}
                    AND
                {% endif %}
                {{ get_source_transform(col) }} = `DIM`.`{{ col.name }}`
            {% endfor %}
            WHERE `DIM`.`{{ get_value_by_column_attribute("isSystemCurrentFlag") }}` = 'Y'
            {% for col in source.columns if (col.isChangeTracking == true) %}
                {% if loop.first %}
                    AND (
                {% else %}
                    OR
                {% endif %}
                ( NVL( CAST({{ get_source_transform(col) }} as STRING), '**NULL**') <> NVL( CAST(`DIM`.`{{ col.name }}` as STRING), '**NULL**') )
                {% if loop.last %}
                    )
                {% endif %}
            {% endfor %}
            {{  get_clause(joinclause)  }}
            {% if config.groupByAll %}
            GROUP BY ALL
            {% endif %}
            {{ sortorder_by_colv() }}
            )
            {# The if-block below avoids unnecessary updates when no type 2 column changes are present #}
            {% if source.columns 
                | rejectattr('isSurrogateKey')
                | rejectattr('isBusinessKey')
                | rejectattr('isChangeTracking')
                | rejectattr('isSystemVersion')
                | rejectattr('isSystemCurrentFlag')
                | rejectattr('isSystemStartDate')
                | rejectattr('isSystemEndDate')
                | rejectattr('isSystemCreateDate')
                | rejectattr('isSystemUpdateDate') 
                | list | length == 0 
            %}
                {# Skip Section #}
            {% else %}
              UNION ALL
              /* Rows Needing To Be Updated Due To Changes To Non-Type-2 columns
              This case merges only when there are changes in non-type-2 column updates, but no changes in type-2 columns*/

              (SELECT
              {% if config.selectDistinct %}
              DISTINCT
              {% endif %}
              {%- for col in source.columns if not col.isSurrogateKey %}
                  {% if col.isSystemVersion or col.isSystemCreateDate or col.isSystemStartDate or col.isSystemEndDate %}
                      `DIM`.`{{ col.name }}`
                  {% elif col.isSystemCurrentFlag %}
                      'Y'
                  {% else %}
                      {{ get_source_transform(col) }}
                  {% endif %}
                  AS `{{ col.name }}`,
              {% endfor -%}
                  'UPDATE_NON_TYPE2_ROWS' AS `DML_OPERATION`
              {{  get_clause(joinclause,'from')  }}
              INNER JOIN {{ ref_no_link(node.location.name, node.name) }} `DIM` ON
              {% for col in source.columns if col.isBusinessKey -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                  {{ get_source_transform(col) }} = `DIM`.`{{ col.name }}`
              {% endfor %}
              WHERE `DIM`.`{{ get_value_by_column_attribute("isSystemCurrentFlag") }}` = 'Y'
              AND (
              {% for col in source.columns if (col.isChangeTracking) -%}
                  {% if not loop.first %}
                      AND
                  {% endif %}
                  {{ get_source_transform(col) }} = `DIM`.`{{ col.name }}`
              {% endfor %} )
              
              {% for col in source.columns if not (   col.isBusinessKey or
                                                      col.isChangeTracking or
                                                      col.isSurrogateKey or
                                                      col.isSystemVersion or
                                                      col.isSystemCurrentFlag or
                                                      col.isSystemStartDate or
                                                      col.isSystemEndDate or
                                                      col.isSystemUpdateDate or
                                                      col.isSystemCreateDate) -%}
                  {% if loop.first %}
                      AND (
                  {% endif %}
                  {% if not loop.first %}
                      OR
                  {% endif %}
                  NVL( CAST({{ get_source_transform(col) }} as STRING), '**NULL**') <> NVL( CAST(`DIM`.`{{ col.name }}` as STRING), '**NULL**')
                  {% if loop.last %}
                      )
                  {% endif %}
              {% endfor %}
            
               {{  get_clause(joinclause)  }}
               {% if config.groupByAll %}
                GROUP BY ALL
               {% endif %}
               {{ sortorder_by_colv() }} )      
            {% endif %}   
               {% if config.insertStrategy in ['UNION', 'UNION ALL'] and not loop.last %}
                {{config.insertStrategy}}
               {% endif %}            
        {% endfor %}  
                         
        ) AS `SRC`
        ON
        {% for col in columns if col.isBusinessKey -%}
            {% if not loop.first %}
                AND
            {% endif %}
            `TGT`.`{{ col.name }}` = `SRC`.`{{ col.name }}`
        {% endfor %}
        AND `TGT`.`{{ get_value_by_column_attribute("isSystemVersion") }}` = `SRC`.`{{ get_value_by_column_attribute("isSystemVersion") }}`
        WHEN MATCHED THEN UPDATE SET
        {%- for col in columns if not (col.isBusinessKey or col.isSurrogateKey or col.isSystemCreateDate) %}
            `TGT`.`{{ col.name }}` = `SRC`.`{{ col.name }}`
            {% if not loop.last %}, {% endif %}
        {% endfor -%}
        WHEN NOT MATCHED THEN INSERT (
        {%- for col in columns if not col.isSurrogateKey %}
            `{{ col.name }}`
            {% if not loop.last %}, {% endif %}
        {% endfor -%}
        )
        VALUES (
        {%- for col in columns if not col.isSurrogateKey %}
            `SRC`.`{{ col.name }}`
            {% if not loop.last %}, {% endif %}
        {% endfor -%}
        )

    {% else %}
        
        {# SCD-Type 1 Dimension == #}

            {{ stage('MERGE ' + ' Sources' | string) }}
            MERGE INTO {{ ref_no_link(node.location.name, node.name) }} `TGT`
            USING (

        {% for source in sources %}
               ( SELECT
                {% if config.selectDistinct %}
                DISTINCT
                {% endif %}
                {% for col in source.columns if not col.isSurrogateKey %}
                    {% if col.isSystemVersion %}
                        1
                    {% elif col.isSystemCurrentFlag %}
                        'Y'
                    {% else %}
                        {{ get_source_transform(col) }}
                    {% endif %}
                    AS `{{ col.name }}`
                    {%- if not loop.last %}, {% endif %}
                {% endfor %}
                {{ source.join }}
                 {% if config.groupByAll %}
                 GROUP BY ALL
                 {% endif %}
                 {{ sortorder_by_colv() }} )     
                 {% if config.insertStrategy in ['UNION', 'UNION ALL'] and not loop.last %}
                     {{config.insertStrategy}}
                 {% endif %}
        {% endfor %}
                 )               
                AS `SRC`             
            ON
            {% for col in columns if col.isBusinessKey -%}
                {% if not loop.first %}
                    AND
                {% endif %}
                `SRC`.`{{ col.name }}` = `TGT`.`{{ col.name }}`
            {% endfor %}
            WHEN MATCHED
            {% for col in columns if not (   col.isBusinessKey or
                                                    col.isSurrogateKey or
                                                    col.isSystemVersion or
                                                    col.isSystemCurrentFlag or
                                                    col.isSystemStartDate or
                                                    col.isSystemEndDate or
                                                    col.isSystemUpdateDate or
                                                    col.isSystemCreateDate) %}
                {% if loop.first %}
                    AND (
                {% else %}
                    OR
                {% endif %}
                NVL( CAST(`SRC`.`{{ col.name }}` as STRING), '**NULL**') <> NVL( CAST(`TGT`.`{{ col.name }}` as STRING), '**NULL**')
                {% if loop.last %}
                    )
                {% endif %}
            {% endfor %}
            THEN UPDATE SET
            {%- for col in columns if not (  col.isBusinessKey or
                                                    col.isSurrogateKey or
                                                    col.isSystemVersion or
                                                    col.isSystemCurrentFlag or
                                                    col.isSystemStartDate or
                                                    col.isSystemEndDate or
                                                    col.isSystemCreateDate) %}
                    `TGT`.`{{ col.name }}` = `SRC`.`{{ col.name }}`
                {% if not loop.last %}, {% endif %}
            {% endfor %}
            WHEN NOT MATCHED THEN
            INSERT (
            {%- for col in columns if not col.isSurrogateKey %}
                `{{ col.name }}`
                {% if not loop.last %}, {% endif %}
            {% endfor -%}
            )
            VALUES (
            {%- for col in columns if not col.isSurrogateKey %}
                `SRC`.`{{ col.name }}`
                {% if not loop.last %}, {% endif %}
            {% endfor -%}
            )
    {% endif %}

{# == Queries to be executed post data insertion  == #}

    {% if config.postSQL %}            
        {{ stage('Post-SQL') }}
        {{ config.postSQL }}
    {% endif %}
{% endif %}

{# == To run data quality tests after data insertion == #}

{% if config.testsEnabled %}
    {% for test in node.tests %}
        {% if test.runOrder == 'After' %}
            {{ test_stage(test.name, test.continueOnFailure) }}
            {{ test.templateString }}
        {% endif %}
    {% endfor %}

    {% for column in columns %}
        {% for test in column.tests %}
            {{ test_stage(column.name + ": " + test.name) }}
            {{ test.templateString }}
        {% endfor %}
    {% endfor %}
{% endif %}
```

</details>

Below is a simple (static) example **Run Template** that corresponds to the previous simple **Create Template** and adds one value to each column.

<Tabs>
  <TabItem value="snowflake-insert-table" label="Snowflake" default>

```sql
{{ stage('Insert Into Table') }}
INSERT INTO {{ ref_no_link(node.location.name, node.name) }}
(
  "MY_COLUMN", 
  "MY_COLUMN2"
)
VALUES(
  3, 
  4
)
```

  </TabItem>
  <TabItem value="databricks-insert-table" label="Databricks">

```sql
{{ stage('Insert Into Table') }}
INSERT INTO {{ ref_no_link(node.location.name, node.name) }}
(
  `MY_COLUMN`, 
  `MY_COLUMN2`
)
VALUES(
  3, 
  4
)
```

  </TabItem>

</Tabs>

Below is a more complex (dynamic) example, looping through all the sources, and source columns, applying transformations, and ultimately creating a DML statement.

<Tabs>
  <TabItem value="snowflake-loop-sources" label="Snowflake" default>

```sql
{% for source in sources %}
  {{ stage('Insert into Table') }}
  INSERT INTO {{ ref_no_link(node.location.name, node.name) }}
  (
     {% for col in source.columns %}
       "{{ col.name }}"
        {%- if not loop.last -%},{% endif %}
     {% endfor %}
  )
  SELECT
  {% for col in source.columns %}
    {{ get_source_transform(col) }} AS "{{ col.name }}"
    {%- if not loop.last -%}, {% endif %}
  {% endfor %}
  {{ source.join }}
{% endfor %}
```

  </TabItem>
  <TabItem value="databricks-loop-sources" label="Databricks">

```sql
{% for source in sources %}
  {{ stage('Insert into Table') }}
  INSERT INTO {{ ref_no_link(node.location.name, node.name) }}
  (
     {% for col in source.columns %}
       `{{ col.name }}`
        {%- if not loop.last -%},{% endif %}
     {% endfor %}
  )
  SELECT
  {% for col in source.columns %}
    {{ get_source_transform(col) }} AS `{{ col.name }}`
    {%- if not loop.last -%}, {% endif %}
  {% endfor %}
  {{ source.join }}
{% endfor %}
```

  </TabItem>
</Tabs>
