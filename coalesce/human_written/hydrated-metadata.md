---
title: Hydrated Metadata
description: Learn Coalesce Hydrated Metadata for custom node development and data transformation workflows. Understand metadata object structures, column definitions, source mappings, and configuration parameters. Complete guide to accessing node information, storage locations, and runtime parameters for building advanced custom node types and data pipeline automation.
keywords: [Coalesce custom nodes, hydrated metadata, node development, custom node types, data transformation metadata, node configuration, metadata objects, column definitions, source mapping, storage locations, node parameters, Jinja templating, YAML configuration, data pipeline development, Coalesce development guide]
---

Hydrated Metadata is the object that you have access to when creating custom Nodes. It contains information like the available columns, storage location information, and other Node information. The metadata is populated from the Node data and user inputs defined in the Node Definition. For example, the Node Name and column names are from the Node data. Fields like tests, business key, and custom fields are populated when the user makes a choice.

This guide goes over some of the available Node Metadata.

Review the [Node Metadata Reference][] for a full list of available Node metadata information.

<details>
<summary>**Hydrated Metadata Example**</summary>

```yaml
columns:
- id: ae9488da-ecb0-4c01-bc76-e7bbe9f4f916
    name: DIM_CUSTOMER1_KEY
    dataType: NUMBER
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSurrogateKey: true
- id: 7223f867-6939-439a-82b5-160b6cefd94f
    name: C_CUSTKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
- id: 3f7491c3-d4b0-4af9-ba3f-1195abce361d
    name: C_NAME
    dataType: VARCHAR(25)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
- id: d731b559-6967-45cf-a988-9645d78057c5
    name: C_ADDRESS
    dataType: VARCHAR(40)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
- id: 2ecc8d8a-cafb-41b6-b251-0f6bd9466dd0
    name: C_NATIONKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
- id: 30dd7333-7d8e-4b71-8468-23b455e03678
    name: C_PHONE
    dataType: VARCHAR(15)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
- id: 27138b8e-063a-4b66-9e5c-6f0f62ebdc92
    name: C_ACCTBAL
    dataType: NUMBER(12,2)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
- id: bfb86085-716f-4761-b3db-6612799db3d1
    name: C_MKTSEGMENT
    dataType: VARCHAR(10)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
- id: c2dd9319-03a8-438f-b2b8-552db628403e
    name: C_COMMENT
    dataType: VARCHAR(117)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
- id: d6376c0f-52fe-4b07-99d6-447c4c114ce0
    name: SYSTEM_VERSION
    dataType: NUMBER
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSystemVersion: true
- id: 7c0345be-e5e9-40f5-8fa4-48775973dc14
    name: SYSTEM_CURRENT_FLAG
    dataType: VARCHAR
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSystemCurrentFlag: true
- id: fa6f3d17-7c30-4711-a1a0-345bba6fe4f3
    name: SYSTEM_START_DATE
    dataType: TIMESTAMP
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSystemStartDate: true
- id: c7823b90-b12c-4132-a0a2-99a0cd407116
    name: SYSTEM_END_DATE
    dataType: TIMESTAMP
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSystemEndDate: true
- id: df8534c7-cb55-4898-a845-01a1aa53b634
    name: SYSTEM_CREATE_DATE
    dataType: TIMESTAMP
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSystemCreateDate: true
- id: f5f0ce1f-d4b0-4c8a-b259-cd54da4ed4c8
    name: SYSTEM_UPDATE_DATE
    dataType: TIMESTAMP
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
    isSystemUpdateDate: true
storageLocations:
- database: SNOWFLAKE_SAMPLE_DATA
    schema: TPCH_SF100
    name: SAMPLE
- database: TATIANA_DOCS_DYNAMIC_TABLES
    schema: HYDRATED
    name: WORK
config:
testsEnabled: true
postSQL: ""
preSQL: ""
myDropdown: option1
sources:
- name: DIM_CUSTOMER1
    columns:
    - id: ae9488da-ecb0-4c01-bc76-e7bbe9f4f916
        name: DIM_CUSTOMER1_KEY
        dataType: NUMBER
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSurrogateKey: true
        transform: ""
        sourceColumns:
        - {}
    - id: 7223f867-6939-439a-82b5-160b6cefd94f
        name: C_CUSTKEY
        dataType: NUMBER(38,0)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: e9cfcbf7-766b-4acc-90c5-c5f4801a64e1
            name: C_CUSTKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    - id: 3f7491c3-d4b0-4af9-ba3f-1195abce361d
        name: C_NAME
        dataType: VARCHAR(25)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: 133f3952-bca1-4ad0-a748-3d9e4c62a4f9
            name: C_NAME
            dataType: VARCHAR(25)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    - id: d731b559-6967-45cf-a988-9645d78057c5
        name: C_ADDRESS
        dataType: VARCHAR(40)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: aaef39a1-da9b-437a-b9ff-5a6def36c1ec
            name: C_ADDRESS
            dataType: VARCHAR(40)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    - id: 2ecc8d8a-cafb-41b6-b251-0f6bd9466dd0
        name: C_NATIONKEY
        dataType: NUMBER(38,0)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: e938c2bf-fb1e-4ff0-b319-5d26ef7c67d8
            name: C_NATIONKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    - id: 30dd7333-7d8e-4b71-8468-23b455e03678
        name: C_PHONE
        dataType: VARCHAR(15)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: dbeaf294-04ab-4b14-98b9-1be0c6d8e441
            name: C_PHONE
            dataType: VARCHAR(15)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    - id: 27138b8e-063a-4b66-9e5c-6f0f62ebdc92
        name: C_ACCTBAL
        dataType: NUMBER(12,2)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: a7ba5727-5e81-4ecb-b76a-f55ec0382458
            name: C_ACCTBAL
            dataType: NUMBER(12,2)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    - id: bfb86085-716f-4761-b3db-6612799db3d1
        name: C_MKTSEGMENT
        dataType: VARCHAR(10)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: 79cdb302-ebb4-472b-8e20-091310dc3e87
            name: C_MKTSEGMENT
            dataType: VARCHAR(10)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
    - id: c2dd9319-03a8-438f-b2b8-552db628403e
        name: C_COMMENT
        dataType: VARCHAR(117)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
        - node:
            id: d9d2dca5-7ec1-4401-b893-443a19419c36
            name: STG_CUSTOMER
            nodeType: Stage
            location:
                name: SAMPLE
            description: Hello
            materializationType: table
            isMultisource: false
            override:
                create:
                enabled: false
                script: ""
            tests: []
            column:
            id: 2998976d-8ac6-4c60-b816-3694225928b8
            name: C_COMMENT
            dataType: VARCHAR(117)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
    - id: d6376c0f-52fe-4b07-99d6-447c4c114ce0
        name: SYSTEM_VERSION
        dataType: NUMBER
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSystemVersion: true
        transform: ""
        sourceColumns:
        - {}
    - id: 7c0345be-e5e9-40f5-8fa4-48775973dc14
        name: SYSTEM_CURRENT_FLAG
        dataType: VARCHAR
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSystemCurrentFlag: true
        transform: ""
        sourceColumns:
        - {}
    - id: fa6f3d17-7c30-4711-a1a0-345bba6fe4f3
        name: SYSTEM_START_DATE
        dataType: TIMESTAMP
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSystemStartDate: true
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
        sourceColumns:
        - {}
    - id: c7823b90-b12c-4132-a0a2-99a0cd407116
        name: SYSTEM_END_DATE
        dataType: TIMESTAMP
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSystemEndDate: true
        transform: CAST('2999-12-31 00:00:00' AS TIMESTAMP)
        sourceColumns:
        - {}
    - id: df8534c7-cb55-4898-a845-01a1aa53b634
        name: SYSTEM_CREATE_DATE
        dataType: TIMESTAMP
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSystemCreateDate: true
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
        sourceColumns:
        - {}
    - id: f5f0ce1f-d4b0-4c8a-b259-cd54da4ed4c8
        name: SYSTEM_UPDATE_DATE
        dataType: TIMESTAMP
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        isSystemUpdateDate: true
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
        sourceColumns:
        - {}
    join: FROM {{ ref('SAMPLE', 'STG_CUSTOMER') }} "STG_CUSTOMER"
    dependencies:
    - node:
        id: d9d2dca5-7ec1-4401-b893-443a19419c36
        name: STG_CUSTOMER
        nodeType: Stage
        location:
            name: SAMPLE
        description: Hello
        materializationType: table
        isMultisource: false
        override:
            create:
            enabled: false
            script: ""
        tests: []
        columns:
        - id: e9cfcbf7-766b-4acc-90c5-c5f4801a64e1
            name: C_CUSTKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
        - id: 133f3952-bca1-4ad0-a748-3d9e4c62a4f9
            name: C_NAME
            dataType: VARCHAR(25)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
        - id: aaef39a1-da9b-437a-b9ff-5a6def36c1ec
            name: C_ADDRESS
            dataType: VARCHAR(40)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
        - id: e938c2bf-fb1e-4ff0-b319-5d26ef7c67d8
            name: C_NATIONKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
        - id: dbeaf294-04ab-4b14-98b9-1be0c6d8e441
            name: C_PHONE
            dataType: VARCHAR(15)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
        - id: a7ba5727-5e81-4ecb-b76a-f55ec0382458
            name: C_ACCTBAL
            dataType: NUMBER(12,2)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
        - id: 79cdb302-ebb4-472b-8e20-091310dc3e87
            name: C_MKTSEGMENT
            dataType: VARCHAR(10)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
        - id: 2998976d-8ac6-4c60-b816-3694225928b8
            name: C_COMMENT
            dataType: VARCHAR(117)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
    customSQL: ""
node:
id: scratch
name: DIM_CUSTOMER1
nodeType: "19"
location:
    name: WORK
description: Hello
materializationType: table
isMultisource: false
override:
    create:
    enabled: false
    script: ""
tests: []
this: "{{ ref_no_link(node.location.name, node.name) }}"
parameters:
hello: goodbye
goodMorning: goodnight
```

</details>

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_node_008.png" alt="Split view of Node Type Editor showing detailed column definitions and node settings with properties and options panels" className="mdImages"/>
  <figcaption>Node Type Editor with Metadata</figcaption>
</figure>

## Columns

Columns define the structure of your metadata. Every node will come with:

* `id` - An auto-generated column ID. This can’t be used when creating Nodes.
* `name` - The column identifier.
* `dataType` - A SQL data type.
* `description` - Description of the column.
* `nullable` - Boolean that indicates if NULL values are allowed.
* `defaultValue` - Default value of the column.
* `tests` - An array of column level tests.

```yaml title="Node netadata column object example"
columns:
 - id: e6841805-ab8d-46a5-93cb-5b8528400db2
   name: DIM_CUSTOMER_KEY
   dataType: NUMBER
   description: ""
   nullable: true
   defaultValue: ""
   tests: []
   isSurrogateKey: true
   myMappingColumn: Only available with data
 - id: ddef2ed3-0fae-4133-9012-23e12c880685
   name: C_CUSTKEY
   dataType: NUMBER(38,0)
   description: ""
   nullable: false
   defaultValue: ""
   tests: []
   isBusinessKey: true
....


 - id: 32568624-8008-466f-b62a-672cb6e101be
   name: SYSTEM_UPDATE_DATE
   dataType: TIMESTAMP
   description: ""
   nullable: true
   defaultValue: ""
   tests: []
   isSystemUpdateDate: true
 - id: 5356f829-0de5-43a1-bb40-065d4086f196
   name: GH
   dataType: STRING
   description: ""
   nullable: true
   defaultValue: ""
   tests: []
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_node_008.png" alt="Split view of Node Type Editor showing detailed column definitions and node settings with properties and options panels" className="mdImages"/>
  <figcaption>Node Type Editor with columns</figcaption>
</figure>

### Dynamic Column Fields

Depending on the Node Definition or user input, there can be fields that don't have data, some that aren’t populated unless they contain data, or only populate on initialization. For example, `tests: []` shows as an empty object since there are no tests configured on the Node. To add a test, go to the **Node Editor > Testing**. Then go back to the Node Type Editor and reload the Node. You’ll see the test array populate. The following example has column test added. Node tests will appear in the Node object.

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_node_010.png" alt="The Node Editor interface showing SQL test setup with two panels: left panel has a SQL query test for DIM_CUSTOMER records with failure handling options; right panel displays column testing configuration with null value tests for customer fields." className="mdImages" width="60%"/>
  <figcaption>Tests in the Node Editor</figcaption>
</figure>

```yaml title="Metadata with tests array" showLineNumbers
    tests:
      - name: Unique
        description: check if value is unique
        continueOnFailure: true
        runOrder: After
        templateString: |2-

                      SELECT "DIM_LINEITEM_KEY", COUNT(*)
                      FROM {{ ref(node.location.name, node.name)}} 
                      GROUP BY "DIM_LINEITEM_KEY"
                      HAVING COUNT(*) > 1
...
  - id: 5f46755f-cad3-48af-a91e-72e2bf030390
    name: L_SUPPKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests:
      - name: "Null"
        description: checks for any null values
        continueOnFailure: true
        runOrder: After
        templateString: |2-

                      SELECT * FROM {{ ref(node.location.name, node.name)}} 
                      WHERE "L_SUPPKEY" IS NULL
```

:::info[Removing Tests]

You can disable testing on the Node by using the Enable Tests option in the Node Definition. Users will still be able to add tests, but the tests will not run.

:::

### Mapping Columns

Some fields only appear in the column metadata if they are applicable to the Node or have data added. For example, [Mapping Columns][]. You can test this out by adding `mappingColumns` to the Node Definition then adding some data to the field, then reloading the Node Type Editor.

```yaml title="Add to Node Definition"
mappingColumns:
- headerName: My Mapping Column Name
  attributeName: myMappingColumn
  type: textBox
```

```yaml title="myMappingColumn is invisible until data is added" showLineNumbers {19}
columns:
 - id: e6841805-ab8d-46a5-93cb-5b8528400db2
   name: DIM_CUSTOMER_KEY
   dataType: NUMBER
   description: ""
   nullable: true
   defaultValue: ""
   tests:
     - name: "Null"
       description: checks for any null values
       continueOnFailure: true
       runOrder: After
       templateString: |2-


                     SELECT * FROM {{ ref(node.location.name, node.name)}}
                     WHERE "DIM_CUSTOMER_KEY" IS NULL
   isSurrogateKey: true
   myMappingColumn: Only available with data
```

### System Columns

System Columns only appear as a column on Node initialization. They are given custom attributes which show in the metadata and are set to true to indicate it's a system column. In this example, the custom attribute name is `isHelloGoodbye` and the column name is `system_column_name1`.

```yaml
  - id: 4c1e4719-b72b-41fe-82f6-7b6311475fdd
    name: system_column_name1
    dataType: STRING
    description: Some description
    nullable: true
    defaultValue: hello
    tests: []
    isHelloGoodbye: true
```

## Storage Locations

Storage Locations list out all Storage Locations added to the Node. To know where the Node is currently stored, you can review the [Node object][].

Learn more about [Storage Locations][].

```yaml title="Storage Locations"
storageLocations:
  - database: SNOWFLAKE_SAMPLE_DATA
    schema: TPCH_SF100
    name: SAMPLE
  - database: TATIANA_DOCS_DYNAMIC_TABLES
    schema: HYDRATED
    name: WORK
  - database: TATIANA_DOCS_DYNAMIC_TABLES
    schema: QA
    name: DEV
```

This is where the node is located, `node.location.name`.

```yaml title="Node location information" {6}
node:
  id: scratch
  name: DIM_LINEITEM
  nodeType: "16"
  location:
    name: WORK
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/storage_locations_udn.png" alt="Configuration panel showing Node Properties with fields for Storage Location, Node Type set to 'Custom Dimension Node', and a toggle for Deploy Enabled" className="mdImages" width="50%"/>
  <figcaption>Storage Locations in the Node Editor</figcaption>
</figure>

## Config

The config is where customizable settings are located. There are some that are standard such as `postSQL`, `preSQL` and `testEnabled`. Custom elements created in Node Definition will also appear here. For example, you can create a [custom `dropdown`][] and it will appear here.

```yaml title="Config"
config:
  testsEnabled: true
  postSQL: ""
  preSQL: ""
  myDropdown: option1
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_018.png" alt="Custom Dimension Node interface showing configuration code on the left, node definition with a dropdown selector example in the center, and test settings on the right. The code includes config settings for tests and SQL scripts, with tabs for DIM_NATION1, DIM_CUSTOMER1, and STG_NATION." className="mdImages"/>
  <figcaption>Config in the Node Type Editor</figcaption>
</figure>

## Sources

Sources map your columns to their immediate parent nodes. Each source shows:

* Which Node the data comes from.
* Which column in that Node maps to your column.
* Sources only tracks the direct predecessor and not the full Node lineage.

In this example:

* The Node is `DIM_CUSTOMER_EXAMPLE`
* The column is `C_CUSTKEY`
* The source is `STG_CUSTOMER`

The column `C_CUSTKEY` in the Node `DIM_CUSTOMER_EXAMPLE`. The column named `C_CUSTKEY` has a source node of `STG_CUSTOMER` and a source column in `STG_CUSTOMER` of `C_CUSTKEY`.

The `sources > name > columns > sourceColumns > node` contains some information about the source Node.

The `sources > name > columns > sourceColumns > column` contains some information about the source column.

```yaml title="Sources example DIM_CUSTOMER_EXAMPLE" {14,28}
sources:
  - name: DIM_CUSTOMER_EXAMPLE
    columns:
      - id: 7223f867-6939-439a-82b5-160b6cefd94f
        name: C_CUSTKEY
        dataType: NUMBER(38,0)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        isBusinessKey: true
        transform: ""
        sourceColumns:
          - node:
              id: d9d2dca5-7ec1-4401-b893-443a19419c36
              name: STG_CUSTOMER
              nodeType: Stage
              location:
                name: SAMPLE
              description: Hello
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: e9cfcbf7-766b-4acc-90c5-c5f4801a64e1
              name: C_CUSTKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_012.png" alt="For the column `C_CUSTKEY,`the `sourceColumns` include a Node and a column. The Node is the direct lineage or the source of the data. The column is just a summary of the column data for `C_CUSTKEY` in the Dimension example node." className="mdImages"/>
  <figcaption>DAG DIM_CUSTOMER node whose source is STG_CUSTOMER.</figcaption>
</figure>

### Columns With No Sources

There are some that won’t have source columns. For example, system columns. These are created on initialization and don’t have a source.

```yaml title="System columns don't have a source" {16-26}
sources:
 - name: DIM_CUSTOMER1
   columns:
     - id: ae9488da-ecb0-4c01-bc76-e7bbe9f4f916
       name: DIM_CUSTOMER1_KEY
       dataType: NUMBER
       description: ""
       nullable: true
       defaultValue: ""
       tests: []
       isSurrogateKey: true
       transform: ""
       sourceColumns:
         - {}
....
     - id: d6376c0f-52fe-4b07-99d6-447c4c114ce0
       name: SYSTEM_VERSION
       dataType: NUMBER
       description: ""
       nullable: true
       defaultValue: ""
       tests: []
       isSystemVersion: true
       transform: ""
       sourceColumns:
         - {}
```

### Multi Source Nodes

If a Node has multiple sources, there will be multiple source columns with their sources listed. In this example, the node has three sources.

* `SRC1`
* `SRC2`
* `SRC3`

```yaml title="Multi Source" {2,35,40}
sources:
  - name: SRC1
    columns:
      - id: f8457ba3-fda2-4141-bcb5-857140b7724b
        name: N_CREWKEY
        dataType: NUMBER(38,0)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 82023b9f-eafe-4a8b-8f9b-b31bd3323d2c
              name: NOSTROMO_SRC1
              nodeType: Source
              location:
                name: SAMPLE
              description: ""
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 32991b79-632f-4729-9c84-61f53e53069c
              name: N_CREWKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
  - name: SRC2
    columns:
      - id: f8457ba3-fda2-4141-bcb5-857140b7724b
        name: N_CREWKEY
      .....
  - name: SRC3
    columns:
      - id: f8457ba3-fda2-4141-bcb5-857140b7724b
        name: N_CREWKEY
```

## Node

This contains core information about the Node itself, such as the Storage Location. Use this object when accessing Node data.

```yaml title="Node"
node:
 id: scratch
 name: DIM_CUSTOMER1
 nodeType: "19"
 location:
   name: WORK
 description: Hello
 materializationType: table
 isMultisource: false
 override:
   create:
     enabled: false
     script: ""
 tests: []
```

### Scratch ID

When a Node is selected dropdown menu in the Node Type Editor the system makes a copy of the Node. This copy is referred to as the `scratch` Node. When working with Nodes, you are working with a `scratch copy` of the Node. `id: scratch` can't be used for anything or be accessed. The `nodeType` is the type of Node you are working on. For scratch nodes, or nodes you are building this is a random number.

```yaml title="Scratch"
node:
  id: scratch
  name: DOCS_DIM_LINE_ITEM
  nodeType: "16"
```

## This

This refers to the Node. `this` refers to a templating reference that provides a shorthand way to reference the fully qualified name of the Node being worked on. Instead of writing out the full reference with location name and node name, you can use `this` to reference the current Node in templates. Learn more about [Ref Functions][].

```yaml title="This"
this: "{{ ref_no_link(node.location.name, node.name) }}"
```

For example, in a Create Template you might have `{{ ref_no_link(node.location.name, node.name) }}`, which can be shortened to `{{this}}`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="create-template-with-this" label="Create template with this" default>

```sql {5}
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
```

  </TabItem>
  <TabItem value="create-template-orignal" label="Create template using ref_no_link">

```sql {5}
{% if node.materializationType == 'table' %}
{{ stage('Create Dimension Table') }}


CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
(
    {% for col in columns %}
        "{{ col.name }}" {{ col.dataType }}
        {% if col.isSurrogateKey %}
            identity
        {% endif %}
```

  </TabItem>
</Tabs>

## Parameters

Parameters in the metadata represent runtime parameters that can be passed to templates. They can contain arbitrary key-pair values. They act as a way to pass in variables without having to hard code them into the template.

```yaml title="Paramters" {7-9}
columns:...
storageLocations:...
config:...
sources:...
node:...
this:...
parameters:{}
```

Using JSON add a parameter, for example:

```json
{
    "hello": "goodbye",
    "goodMorning": "goodnight"
}
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_015.png" alt="Custom Dimension Node configuration interface showing collapsed sections for columns, storage locations, config, sources, and node definitions, with expanded parameters section containing key-value pairs for greetings like 'hello: goodbye'" className="mdImages" width="60%"/>
  <figcaption>Node metadata with parameters data</figcaption>
</figure>

## What's Next

* Learn how to [access][] Hydrated Metadata in templates
* Review the [Hydrated Metadata Reference][]

[Node Metadata Reference]: /docs/build-your-pipeline/user-defined-nodes/hydrated-metadata-reference
[Mapping Columns]: /docs/build-your-pipeline/user-defined-nodes/node-definition#mapping-columns
[Storage Locations]: /docs/get-started/coalesce-fundamentals/storage-locations-and-storage-mappings
[Ref Functions]: /docs/reference/ref-functions/
[Node object]: /docs/build-your-pipeline/user-defined-nodes/hydrated-metadata#node
[custom `dropdown`]: /docs/build-your-pipeline/user-defined-nodes/node-config-options#dropdown-selector
[access]: /docs/build-your-pipeline/user-defined-nodes/access-hyrdated-metadata#dot-notation-in-jinja-templates
[Hydrated Metadata Reference]: /docs/build-your-pipeline/user-defined-nodes/hydrated-metadata-reference
