---
title: Hydrated Metadata Reference
description: Comprehensive reference guide for Coalesce Hydrated Metadata objects used in custom node development. Master dot notation syntax, metadata object structures, and node configuration patterns for building advanced data transformation workflows. Essential documentation for accessing column definitions, storage locations, source mappings, and configuration parameters in custom node types.
keywords: [Coalesce custom nodes, hydrated metadata reference, dot notation syntax, node type development, metadata objects, custom node creation, data transformation metadata, node configuration, Jinja templating, YAML configuration, storage location mapping, column metadata, source mapping, node development guide, Coalesce API reference]
---

## How To Use This Reference

This reference is made of three parts.

The Hydrated Metadata objects that includes definitions and examples. It's meant to show the structure of the Hydrated Metadata and provide a quick reference to look up information.

The Example of Hydrated Metadata provides two Nodes. One with one source, and another with multiple sources. They are an example of what a Node looks like when it's contains data.

The Dot Notation contains a Node with the dot notation required to return the value. Use it as a starting point.

Your Node may have different data or structure depending on the type and config options.

<!-- vale off -->

## Hydrated Metadata Object

import Hydrated_Metadata from '../../api/hydrated/schemas/hydrated-metadata.schema.mdx';

<div className="hydrated-metadata-schema-embed">
  <Hydrated_Metadata />
</div>

## Hydrated Metadata Dot Notation

This is a Node that has the dot notation on each line as a comment to return the value. This is not representative of every possible value. See the [Hydrated Metadata Object][]. How you access each value will depend on your use, such as writing a loop.

<details>
<summary>**Hydrated Node Columns**</summary>

```yaml
columns:  # columns
  - id: ea286ca2-d281-4bec-b0ff-669cb90d266d  # columns[0].id
    name: DIM_REGION_KEY  # columns[0].name
    dataType: NUMBER  # columns[0].dataType
    description: ""  # columns[0].description
    nullable: true  # columns[0].nullable
    defaultValue: ""  # columns[0].defaultValue
    tests:  # columns[0].tests
      - name: "Null"  # columns[0].tests[0].name
        description: checks for any null values  # columns[0].tests[0].description
        continueOnFailure: true  # columns[0].tests[0].continueOnFailure
        runOrder: After  # columns[0].tests[0].runOrder
        templateString: |2-  # columns[0].tests[0].templateString
                      SELECT * FROM {{ ref(node.location.name, node.name)}} 
                      WHERE "DIM_REGION_KEY" IS NULL
    isSurrogateKey: true  # columns[0].isSurrogateKey
  - id: adfb932a-f209-471a-8c24-5b032f5092b0  # columns[1].id
    name: R_REGIONKEY  # columns[1].name
    dataType: NUMBER(38,0)  # columns[1].dataType
    description: ""  # columns[1].description
    nullable: false  # columns[1].nullable
    defaultValue: ""  # columns[1].defaultValue
    tests:  # columns[1].tests
      - name: "Null"  # columns[1].tests[0].name
        description: checks for any null values  # columns[1].tests[0].description
        continueOnFailure: true  # columns[1].tests[0].continueOnFailure
        runOrder: After  # columns[1].tests[0].runOrder
        templateString: |2-  # columns[1].tests[0].templateString
                      SELECT * FROM {{ ref(node.location.name, node.name)}} 
                      WHERE "R_REGIONKEY" IS NULL
    myColumnSelector: true  # columns[1].myColumnSelector
  - id: aea6abd5-f3dd-4d3d-92f1-4f315a106096  # columns[2].id
    name: R_NAME  # columns[2].name
    dataType: VARCHAR(25)  # columns[2].dataType
    description: ""  # columns[2].description
    nullable: false  # columns[2].nullable
    defaultValue: ""  # columns[2].defaultValue
    tests: []  # columns[2].tests
    isChangeTracking: true  # columns[2].isChangeTracking
    isBusinessKey: true  # columns[2].isBusinessKey
  - id: 76b8bc1f-4914-4062-8dd9-310aedd2912b  # columns[3].id
    name: R_COMMENT  # columns[3].name
    dataType: VARCHAR(152)  # columns[3].dataType
    description: ""  # columns[3].description
    nullable: true  # columns[3].nullable
    defaultValue: ""  # columns[3].defaultValue
    tests: []  # columns[3].tests
  - id: 4b07200a-2939-4b38-9cb2-f91732518a61  # columns[4].id
    name: SYSTEM_VERSION  # columns[4].name
    dataType: NUMBER  # columns[4].dataType
    description: ""  # columns[4].description
    nullable: true  # columns[4].nullable
    defaultValue: ""  # columns[4].defaultValue
    tests: []  # columns[4].tests
    isSystemVersion: true  # columns[4].isSystemVersion
  - id: fc72d526-2955-4c43-beb1-c0c218b0fb64  # columns[5].id
    name: SYSTEM_CURRENT_FLAG  # columns[5].name
    dataType: VARCHAR  # columns[5].dataType
    description: ""  # columns[5].description
    nullable: true  # columns[5].nullable
    defaultValue: ""  # columns[5].defaultValue
    tests: []  # columns[5].tests
    isSystemCurrentFlag: true  # columns[5].isSystemCurrentFlag
  - id: a1ddbf63-b36e-44c3-98ed-54d8f3fee3bf  # columns[6].id
    name: SYSTEM_START_DATE  # columns[6].name
    dataType: TIMESTAMP  # columns[6].dataType
    description: ""  # columns[6].description
    nullable: true  # columns[6].nullable
    defaultValue: ""  # columns[6].defaultValue
    tests: []  # columns[6].tests
    isSystemStartDate: true  # columns[6].isSystemStartDate
  - id: fec02e47-0d57-4af8-b1ef-9078c8991354  # columns[7].id
    name: SYSTEM_END_DATE  # columns[7].name
    dataType: TIMESTAMP  # columns[7].dataType
    description: ""  # columns[7].description
    nullable: true  # columns[7].nullable
    defaultValue: ""  # columns[7].defaultValue
    tests: []  # columns[7].tests
    isSystemEndDate: true  # columns[7].isSystemEndDate
  - id: 050b1e6f-2617-4366-a916-90a5af99062e  # columns[8].id
    name: SYSTEM_CREATE_DATE  # columns[8].name
    dataType: TIMESTAMP  # columns[8].dataType
    description: ""  # columns[8].description
    nullable: true  # columns[8].nullable
    defaultValue: ""  # columns[8].defaultValue
    tests: []  # columns[8].tests
    isSystemCreateDate: true  # columns[8].isSystemCreateDate
  - id: 9f8224ce-8742-472a-8831-65be08057f63  # columns[9].id
    name: SYSTEM_UPDATE_DATE  # columns[9].name
    dataType: TIMESTAMP  # columns[9].dataType
    description: ""  # columns[9].description
    nullable: true  # columns[9].nullable
    defaultValue: ""  # columns[9].defaultValue
    tests: []  # columns[9].tests
    isSystemUpdateDate: true  # columns[9].isSystemUpdateDate
```

</details>

<details>
<summary>**Hydrated Node Storage Locations**</summary>

```yaml
storageLocations:  # storageLocations
  - database: SNOWFLAKE_SAMPLE_DATA  # storageLocations[0].database
    schema: TPCH_SF100  # storageLocations[0].schema
    name: SAMPLE  # storageLocations[0].name
  - database: TATIANA_DOCS_DYNAMIC_TABLES  # storageLocations[1].database
    schema: HYDRATED  # storageLocations[1].schema
    name: WORK  # storageLocations[1].name
  - database: TATIANA_DOCS_DYNAMIC_TABLES  # storageLocations[2].database
    schema: QA  # storageLocations[2].schema
    name: DEV  # storageLocations[2].name
```

</details>

<details>
<summary>**Hydrated Node Config**</summary>

```yaml
config:  # config
  postSQL: ""  # config.postSQL
  myTabularConfig:  # config.myTabularConfig
    items:  # config.myTabularConfig.get('items')
      - myColumnDropdown2:  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']
          id: ea286ca2-d281-4bec-b0ff-669cb90d266d  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['id']
          name: DIM_REGION_KEY  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['name']
          dataType: NUMBER  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['dataType']
          description: ""  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['description']
          nullable: true  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['nullable']
          defaultValue: ""  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['defaultValue']
          tests:  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['tests']
            - name: "Null"  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['tests'][0]['name']
              description: checks for any null values  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['tests'][0]['description']
              continueOnFailure: true  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['tests'][0]['continueOnFailure']
              runOrder: After  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['tests'][0]['runOrder']
              templateString: |2-  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['tests'][0]['templateString']
                            SELECT * FROM {{ ref(node.location.name, node.name)}} 
                            WHERE "DIM_REGION_KEY" IS NULL
          isSurrogateKey: true  # config.myTabularConfig.get('items')[0]['myColumnDropdown2']['isSurrogateKey']
        myToggleButton2: true  # config.myTabularConfig.get('items')[0]['myToggleButton2']
        tabconfigdropdown: option2  # config.myTabularConfig.get('items')[0]['tabconfigdropdown']
      - myColumnDropdown2:  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']
          id: 4b07200a-2939-4b38-9cb2-f91732518a61  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['id']
          name: SYSTEM_VERSION  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['name']
          dataType: NUMBER  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['dataType']
          description: ""  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['description']
          nullable: true  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['nullable']
          defaultValue: ""  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['defaultValue']
          tests: []  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['tests']
          isSystemVersion: true  # config.myTabularConfig.get('items')[1]['myColumnDropdown2']['isSystemVersion']
        tabconfigdropdown: option1  # config.myTabularConfig.get('items')[0]['tabconfigdropdown']
        myToggleButton2: true  # config.myTabularConfig.get('items')[1]['myToggleButton2']
  myDropdown: option1  # config.myDropdown
  preSQL: ""  # config.preSQL
  insertStrategy: INSERT  # config.insertStrategy
  testsEnabled: true  # config.testsEnabled
  myButton: true  # config.myButton
  dropdownSelectorExample: option2  # config.dropdownSelectorExample
  myColumnDropdown:  # config.myColumnDropdown
    id: 76b8bc1f-4914-4062-8dd9-310aedd2912b  # config.myColumnDropdown.id
    name: R_COMMENT  # config.myColumnDropdown.name
    dataType: VARCHAR(152)  # config.myColumnDropdown.dataType
    description: ""  # config.myColumnDropdown.description
    nullable: true  # config.myColumnDropdown.nullable
    defaultValue: ""  # config.myColumnDropdown.defaultValue
    tests: []  # config.myColumnDropdown.tests
  myTextbox: Hello  # config.myTextbox
  dropdownSelectorExample: option1 # config.dropdownSelectorExample
```

</details>

<details>
<summary>**Hydrated Node Sources**</summary>

```yaml
sources: # sources
  - name: DIM_REGION  # sources[0].name
    columns:  # sources[0].columns
      - id: ea286ca2-d281-4bec-b0ff-669cb90d266d  # sources[0].columns[0].id
        name: DIM_REGION_KEY  # sources[0].columns[0].name
        dataType: NUMBER  # sources[0].columns[0].dataType
        description: ""  # sources[0].columns[0].description
        nullable: true  # sources[0].columns[0].nullable
        defaultValue: ""  # sources[0].columns[0].defaultValue
        tests:  # sources[0].columns[0].tests
          - name: "Null"  # sources[0].columns[0].tests[0].name
            description: checks for any null values  # sources[0].columns[0].tests[0].description
            continueOnFailure: true  # sources[0].columns[0].tests[0].continueOnFailure
            runOrder: After  # sources[0].columns[0].tests[0].runOrder
            templateString: |2-  # sources[0].columns[0].tests[0].templateString

                          SELECT * FROM {{ ref(node.location.name, node.name)}} 
                          WHERE "DIM_REGION_KEY" IS NULL
        isSurrogateKey: true  # sources[0].columns[0].isSurrogateKey
        transform: ""  # sources[0].columns[0].transform
        sourceColumns:  # sources[0].columns[0].sourceColumns
          - {}  # sources[0].columns[0].sourceColumns[0]
      - id: adfb932a-f209-471a-8c24-5b032f5092b0  # sources[0].columns[1].id
        name: R_REGIONKEY  # sources[0].columns[1].name
        dataType: NUMBER(38,0)  # sources[0].columns[1].dataType
        description: ""  # sources[0].columns[1].description
        nullable: false  # sources[0].columns[1].nullable
        defaultValue: ""  # sources[0].columns[1].defaultValue
        tests:  # sources[0].columns[1].tests
          - name: "Null"  # sources[0].columns[1].tests[0].name
            description: checks for any null values  # sources[0].columns[1].tests[0].description
            continueOnFailure: true  # sources[0].columns[1].tests[0].continueOnFailure
            runOrder: After  # sources[0].columns[1].tests[0].runOrder
            templateString: |2-  # sources[0].columns[1].tests[0].templateString

                          SELECT * FROM {{ ref(node.location.name, node.name)}} 
                          WHERE "R_REGIONKEY" IS NULL
        myColumnSelector: true  # sources[0].columns[1].myColumnSelector
        transform: ""  # sources[0].columns[1].transform
        sourceColumns:  # sources[0].columns[1].sourceColumns
          - node:  # sources[0].columns[1].sourceColumns[0].node
              id: 247d6d02-f042-4756-af5d-8034a1cb6fb2  # sources[0].columns[1].sourceColumns[0].node.id
              name: STG_REGION  # sources[0].columns[1].sourceColumns[0].node.name
              nodeType: Stage  # sources[0].columns[1].sourceColumns[0].node.nodeType
              location:  # sources[0].columns[1].sourceColumns[0].node.location
                name: WORK  # sources[0].columns[1].sourceColumns[0].node.location.name
              description: Region data as defined by TPC-H  # sources[0].columns[1].sourceColumns[0].node.description
              materializationType: table  # sources[0].columns[1].sourceColumns[0].node.materializationType
              isMultisource: false  # sources[0].columns[1].sourceColumns[0].node.isMultisource
              override:  # sources[0].columns[1].sourceColumns[0].node.override
                create:  # sources[0].columns[1].sourceColumns[0].node.override.create
                  enabled: false  # sources[0].columns[1].sourceColumns[0].node.override.create.enabled
                  script: ""  # sources[0].columns[1].sourceColumns[0].node.override.create.script
              tests: []  # sources[0].columns[1].sourceColumns[0].node.tests
            column:  # sources[0].columns[1].sourceColumns[0].column
              id: 2f63b9c9-937c-4fd2-a1ef-8fb41f596e8e  # sources[0].columns[1].sourceColumns[0].column.id
              name: R_REGIONKEY  # sources[0].columns[1].sourceColumns[0].column.name
              dataType: NUMBER(38,0)  # sources[0].columns[1].sourceColumns[0].column.dataType
              description: ""  # sources[0].columns[1].sourceColumns[0].column.description
              nullable: false  # sources[0].columns[1].sourceColumns[0].column.nullable
              defaultValue: ""  # sources[0].columns[1].sourceColumns[0].column.defaultValue
              tests: []  # sources[0].columns[1].sourceColumns[0].column.tests
      - id: aea6abd5-f3dd-4d3d-92f1-4f315a106096  # sources[0].columns[2].id
        name: R_NAME  # sources[0].columns[2].name
        dataType: VARCHAR(25)  # sources[0].columns[2].dataType
        description: ""  # sources[0].columns[2].description
        nullable: false  # sources[0].columns[2].nullable
        defaultValue: ""  # sources[0].columns[2].defaultValue
        tests: []  # sources[0].columns[2].tests
        isChangeTracking: true  # sources[0].columns[2].isChangeTracking
        isBusinessKey: true  # sources[0].columns[2].isBusinessKey
        transform: ""  # sources[0].columns[2].transform
        sourceColumns:  # sources[0].columns[2].sourceColumns
          - node:  # sources[0].columns[2].sourceColumns[0].node
              id: 247d6d02-f042-4756-af5d-8034a1cb6fb2  # sources[0].columns[2].sourceColumns[0].node.id
              name: STG_REGION  # sources[0].columns[2].sourceColumns[0].node.name
              nodeType: Stage  # sources[0].columns[2].sourceColumns[0].node.nodeType
              location:  # sources[0].columns[2].sourceColumns[0].node.location
                name: WORK  # sources[0].columns[2].sourceColumns[0].node.location.name
              description: Region data as defined by TPC-H  # sources[0].columns[2].sourceColumns[0].node.description
              materializationType: table  # sources[0].columns[2].sourceColumns[0].node.materializationType
              isMultisource: false  # sources[0].columns[2].sourceColumns[0].node.isMultisource
              override:  # sources[0].columns[2].sourceColumns[0].node.override
                create:  # sources[0].columns[2].sourceColumns[0].node.override.create
                  enabled: false  # sources[0].columns[2].sourceColumns[0].node.override.create.enabled
                  script: ""  # sources[0].columns[2].sourceColumns[0].node.override.create.script
              tests: []  # sources[0].columns[2].sourceColumns[0].node.tests
            column:  # sources[0].columns[2].sourceColumns[0].column
              id: e700d0b7-e5f1-4fd5-8c29-3d8c56124aef  # sources[0].columns[2].sourceColumns[0].column.id
              name: R_NAME  # sources[0].columns[2].sourceColumns[0].column.name
              dataType: VARCHAR(25)  # sources[0].columns[2].sourceColumns[0].column.dataType
              description: ""  # sources[0].columns[2].sourceColumns[0].column.description
              nullable: false  # sources[0].columns[2].sourceColumns[0].column.nullable
              defaultValue: ""  # sources[0].columns[2].sourceColumns[0].column.defaultValue
              tests: []  # sources[0].columns[2].sourceColumns[0].column.tests
      - id: 76b8bc1f-4914-4062-8dd9-310aedd2912b  # sources[0].columns[3].id
        name: R_COMMENT  # sources[0].columns[3].name
        dataType: VARCHAR(152)  # sources[0].columns[3].dataType
        description: ""  # sources[0].columns[3].description
        nullable: true  # sources[0].columns[3].nullable
        defaultValue: ""  # sources[0].columns[3].defaultValue
        tests: []  # sources[0].columns[3].tests
        transform: ""  # sources[0].columns[3].transform
        sourceColumns:  # sources[0].columns[3].sourceColumns
          - node:  # sources[0].columns[3].sourceColumns[0].node
              id: 247d6d02-f042-4756-af5d-8034a1cb6fb2  # sources[0].columns[3].sourceColumns[0].node.id
              name: STG_REGION  # sources[0].columns[3].sourceColumns[0].node.name
              nodeType: Stage  # sources[0].columns[3].sourceColumns[0].node.nodeType
              location:  # sources[0].columns[3].sourceColumns[0].node.location
                name: WORK  # sources[0].columns[3].sourceColumns[0].node.location.name
              description: Region data as defined by TPC-H  # sources[0].columns[3].sourceColumns[0].node.description
              materializationType: table  # sources[0].columns[3].sourceColumns[0].node.materializationType
              isMultisource: false  # sources[0].columns[3].sourceColumns[0].node.isMultisource
              override:  # sources[0].columns[3].sourceColumns[0].node.override
                create:  # sources[0].columns[3].sourceColumns[0].node.override.create
                  enabled: false  # sources[0].columns[3].sourceColumns[0].node.override.create.enabled
                  script: ""  # sources[0].columns[3].sourceColumns[0].node.override.create.script
              tests: []  # sources[0].columns[3].sourceColumns[0].node.tests
            column:  # sources[0].columns[3].sourceColumns[0].column
              id: 12f27257-4353-4dd9-86f5-cd3a74b56db2  # sources[0].columns[3].sourceColumns[0].column.id
              name: R_COMMENT  # sources[0].columns[3].sourceColumns[0].column.name
              dataType: VARCHAR(152)  # sources[0].columns[3].sourceColumns[0].column.dataType
              description: ""  # sources[0].columns[3].sourceColumns[0].column.description
              nullable: true  # sources[0].columns[3].sourceColumns[0].column.nullable
              defaultValue: ""  # sources[0].columns[3].sourceColumns[0].column.defaultValue
              tests: []  # sources[0].columns[3].sourceColumns[0].column.tests
      - id: 4b07200a-2939-4b38-9cb2-f91732518a61  # sources[0].columns[4].id
        name: SYSTEM_VERSION  # sources[0].columns[4].name
        dataType: NUMBER  # sources[0].columns[4].dataType
        description: ""  # sources[0].columns[4].description
        nullable: true  # sources[0].columns[4].nullable
        defaultValue: ""  # sources[0].columns[4].defaultValue
        tests: []  # sources[0].columns[4].tests
        isSystemVersion: true  # sources[0].columns[4].isSystemVersion
        transform: ""  # sources[0].columns[4].transform
        sourceColumns:  # sources[0].columns[4].sourceColumns
          - {}  # sources[0].columns[4].sourceColumns[0]
      - id: fc72d526-2955-4c43-beb1-c0c218b0fb64  # sources[0].columns[5].id
        name: SYSTEM_CURRENT_FLAG  # sources[0].columns[5].name
        dataType: VARCHAR  # sources[0].columns[5].dataType
        description: ""  # sources[0].columns[5].description
        nullable: true  # sources[0].columns[5].nullable
        defaultValue: ""  # sources[0].columns[5].defaultValue
        tests: []  # sources[0].columns[5].tests
        isSystemCurrentFlag: true  # sources[0].columns[5].isSystemCurrentFlag
        transform: ""  # sources[0].columns[5].transform
        sourceColumns:  # sources[0].columns[5].sourceColumns
          - {}  # sources[0].columns[5].sourceColumns[0]
      - id: a1ddbf63-b36e-44c3-98ed-54d8f3fee3bf  # sources[0].columns[6].id
        name: SYSTEM_START_DATE  # sources[0].columns[6].name
        dataType: TIMESTAMP  # sources[0].columns[6].dataType
        description: ""  # sources[0].columns[6].description
        nullable: true  # sources[0].columns[6].nullable
        defaultValue: ""  # sources[0].columns[6].defaultValue
        tests: []  # sources[0].columns[6].tests
        isSystemStartDate: true  # sources[0].columns[6].isSystemStartDate
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)  # sources[0].columns[6].transform
        sourceColumns:  # sources[0].columns[6].sourceColumns
          - {}  # sources[0].columns[6].sourceColumns[0]
      - id: fec02e47-0d57-4af8-b1ef-9078c8991354  # sources[0].columns[7].id
        name: SYSTEM_END_DATE  # sources[0].columns[7].name
        dataType: TIMESTAMP  # sources[0].columns[7].dataType
        description: ""  # sources[0].columns[7].description
        nullable: true  # sources[0].columns[7].nullable
        defaultValue: ""  # sources[0].columns[7].defaultValue
        tests: []  # sources[0].columns[7].tests
        isSystemEndDate: true  # sources[0].columns[7].isSystemEndDate
        transform: CAST('2999-12-31 00:00:00' AS TIMESTAMP)  # sources[0].columns[7].transform
        sourceColumns:  # sources[0].columns[7].sourceColumns
          - {}  # sources[0].columns[7].sourceColumns[0]
      - id: 050b1e6f-2617-4366-a916-90a5af99062e  # sources[0].columns[8].id
        name: SYSTEM_CREATE_DATE  # sources[0].columns[8].name
        dataType: TIMESTAMP  # sources[0].columns[8].dataType
        description: ""  # sources[0].columns[8].description
        nullable: true  # sources[0].columns[8].nullable
        defaultValue: ""  # sources[0].columns[8].defaultValue
        tests: []  # sources[0].columns[8].tests
        isSystemCreateDate: true  # sources[0].columns[8].isSystemCreateDate
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)  # sources[0].columns[8].transform
        sourceColumns: 
          - {}  # sources[0].columns[8].sourceColumns[0]
      - id: 9f8224ce-8742-472a-8831-65be08057f63  # sources[0].columns[9].id
        name: SYSTEM_UPDATE_DATE  # sources[0].columns[9].name
        dataType: TIMESTAMP  # sources[0].columns[9].dataType
        description: ""  # sources[0].columns[9].description
        nullable: true  # sources[0].columns[9].nullable
        defaultValue: ""  # sources[0].columns[9].defaultValue
        tests: []  # sources[0].columns[9].tests
        isSystemUpdateDate: true  # sources[0].columns[9].isSystemUpdateDate
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)  # sources[0].columns[9].transform
        sourceColumns:  # sources[0].columns[9].sourceColumns
          - {}  # sources[0].columns[9].sourceColumns[0]
    join: FROM {{ ref('WORK', 'STG_REGION') }} "STG_REGION"  # sources[0].join
    dependencies:  # sources[0].dependencies
      - node:  # sources[0].dependencies[0].node
          id: 247d6d02-f042-4756-af5d-8034a1cb6fb2  # sources[0].dependencies[0].node.id
          name: STG_REGION  # sources[0].dependencies[0].node.name
          nodeType: Stage  # sources[0].dependencies[0].node.nodeType
          location:  # sources[0].dependencies[0].node.location
            name: WORK  # sources[0].dependencies[0].node.location.name
          description: Region data as defined by TPC-H  # sources[0].dependencies[0].node.description
          materializationType: table  # sources[0].dependencies[0].node.materializationType
          isMultisource: false  # sources[0].dependencies[0].node.isMultisource
          override:  # sources[0].dependencies[0].node.override
            create:  # sources[0].dependencies[0].node.override.create
              enabled: false  # sources[0].dependencies[0].node.override.create.enabled
              script: ""  # sources[0].dependencies[0].node.override.create.script
          tests: []  # sources[0].dependencies[0].node.tests
        columns:  # sources[0].dependencies[0].columns
          - id: 2f63b9c9-937c-4fd2-a1ef-8fb41f596e8e  # sources[0].dependencies[0].columns[0].id
            name: R_REGIONKEY  # sources[0].dependencies[0].columns[0].name
            dataType: NUMBER(38,0)  # sources[0].dependencies[0].columns[0].dataType
            description: ""  # sources[0].dependencies[0].columns[0].description
            nullable: false  # sources[0].dependencies[0].columns[0].nullable
            defaultValue: ""  # sources[0].dependencies[0].columns[0].defaultValue
            tests: []  # sources[0].dependencies[0].columns[0].tests
          - id: e700d0b7-e5f1-4fd5-8c29-3d8c56124aef  # sources[0].dependencies[0].columns[1].id
            name: R_NAME  # sources[0].dependencies[0].columns[1].name
            dataType: VARCHAR(25)  # sources[0].dependencies[0].columns[1].dataType
            description: ""  # sources[0].dependencies[0].columns[1].description
            nullable: false  # sources[0].dependencies[0].columns[1].nullable
            defaultValue: ""  # sources[0].dependencies[0].columns[1].defaultValue
            tests: []  # sources[0].dependencies[0].columns[1].tests
          - id: 12f27257-4353-4dd9-86f5-cd3a74b56db2  # sources[0].dependencies[0].columns[2].id
            name: R_COMMENT  # sources[0].dependencies[0].columns[2].name
            dataType: VARCHAR(152)  # sources[0].dependencies[0].columns[2].dataType
            description: ""  # sources[0].dependencies[0].columns[2].description
            nullable: true  # sources[0].dependencies[0].columns[2].nullable
            defaultValue: ""  # sources[0].dependencies[0].columns[2].defaultValue
            tests: []  # sources[0].dependencies[0].columns[2].tests
    customSQL: ""  # sources[0].customSQL
```

</details>

<details>
<summary>**Hydrated Node Data**</summary>

```yaml
node:
  id: scratch  # node.id
  name: DIM_REGION  # node.name
  nodeType: Dimension  # node.nodeType
  location:  # node.location
    name: WORK  # node.location.name
  description: Region data as defined by TPC-H  # node.description
  materializationType: table  # node.materializationType
  isMultisource: true  # node.isMultisource
  override:  # node.override
    create:  # node.override.create
      enabled: false  # node.override.create.enabled
      script: ""  # node.override.create.script
  tests:  # node.tests
    - name: Test  # node.tests[0].name
      description: ""  # node.tests[0].description
      continueOnFailure: true  # node.tests[0].continueOnFailure
      runOrder: After  # node.tests[0].runOrder
      templateString: SELECT*FROM COALESCE  # node.tests[0].templateString
```

</details>

<details>
<summary>**Hydrated Node This and Parameters**</summary>

```yaml
this: "{{ ref_no_link(node.location.name, node.name) }}"  # this
parameters:  # parameters
  hello: goodbye  # parameters.hello
  goodMorning: goodnight  # parameters.goodMorning
```

</details>

## Example of Hydrated Metadata

This is an example of a Node with Hydrated Metadata and Node Definition. It can be used to see how information will appear in the Hydrated Metadata and how it correlates to the Node Defintion.

<details>
<summary>**Fully Hydrated Node Example**</summary>

```yaml
columns:
  - id: 4c1e4719-b72b-41fe-82f6-7b6311475fdd
    name: system_column_name1
    dataType: STRING
    description: Some description
    nullable: true
    defaultValue: hello
    tests: []
    isSystemColumnName: true
  - id: 8791b268-3a95-4ac0-9929-1a2b328c60bd
    name: L_ORDERKEY
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
                      WHERE "L_ORDERKEY" IS NULL
      - name: Unique
        description: check if value is unique
        continueOnFailure: true
        runOrder: After
        templateString: |2-

                      SELECT "L_ORDERKEY", COUNT(*)
                      FROM {{ ref(node.location.name, node.name)}} 
                      GROUP BY "L_ORDERKEY"
                      HAVING COUNT(*) > 1
  - id: 6f73c0e2-fe2b-45bc-b181-dcaa02256b38
    name: L_PARTKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 72636ad8-6c64-4983-a222-f9ac533c4eed
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
      - name: Unique
        description: check if value is unique
        continueOnFailure: true
        runOrder: After
        templateString: |2-

                      SELECT "L_SUPPKEY", COUNT(*)
                      FROM {{ ref(node.location.name, node.name)}} 
                      GROUP BY "L_SUPPKEY"
                      HAVING COUNT(*) > 1
  - id: 99710860-2240-42ac-bcad-d5011ce50909
    name: L_LINENUMBER
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 6dc793eb-8f7d-4f13-a315-8a1cacdf541a
    name: L_QUANTITY
    dataType: NUMBER(12,2)
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
                      WHERE "L_QUANTITY" IS NULL
  - id: 9fc64e2f-fd37-42e6-8f40-bc78a21680ed
    name: C_CUSTKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: eb70b19f-dc09-4b42-833b-c9c5d9d4897a
    name: C_NAME
    dataType: VARCHAR(25)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 4a062af3-1777-474a-b6c8-635adb540959
    name: C_ADDRESS
    dataType: VARCHAR(40)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 7dbe0df9-10b8-4c6b-8376-eae71c25632e
    name: C_NATIONKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 59c6ddb9-e8bd-4608-b011-6377c8906534
    name: C_PHONE
    dataType: VARCHAR(15)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 3d1a6245-0bef-4fa3-b2c9-273b24a0c275
    name: C_ACCTBAL
    dataType: NUMBER(12,2)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: a4b64e99-eb5f-406b-9c5f-baddf3c99103
    name: C_MKTSEGMENT
    dataType: VARCHAR(10)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
  - id: bd37ac6b-ce51-485a-9e52-8a3e4b79475a
    name: C_COMMENT
    dataType: VARCHAR(117)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
  - id: a96cd9cb-8201-4c54-8f04-c41e46c41115
    name: L_EXTENDEDPRICE
    dataType: NUMBER(12,2)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 7ba1fe2a-6ff6-44ce-a76c-831dc01d0b59
    name: L_DISCOUNT
    dataType: NUMBER(12,2)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 2dc17e49-4013-445b-81e1-9ec64a25f472
    name: L_TAX
    dataType: NUMBER(12,2)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: c2823c69-a131-4c5c-93b5-1630b1385595
    name: L_RETURNFLAG
    dataType: VARCHAR(1)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: fe7dc273-d716-45a6-92d6-d311a5355440
    name: L_LINESTATUS
    dataType: VARCHAR(1)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 54e1b35c-4676-46da-a371-7c7da356f2bb
    name: L_SHIPDATE
    dataType: DATE
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 8959011e-a95b-4673-860c-a8f48e1d6b48
    name: L_COMMITDATE
    dataType: DATE
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 591df848-a979-4cd8-8bb2-4c88204aba2d
    name: L_RECEIPTDATE
    dataType: DATE
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: f2fd738f-ca2b-4845-bb7f-4d18703ecb23
    name: L_SHIPINSTRUCT
    dataType: VARCHAR(25)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: 602fa59d-4697-4e27-b9a1-bbb2d6400e67
    name: L_SHIPMODE
    dataType: VARCHAR(10)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  - id: ee257834-ee7f-4da5-8689-4e1b22500fad
    name: L_COMMENT
    dataType: VARCHAR(44)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
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
config:
  testsEnabled: true
  myDropdown: option1
  insertStrategy: INSERT
  myButton: false
  preSQL: ""
  postSQL: ""
  truncateBefore: true
  dropdownSelectorExample: option1
  myTextbox: ""
  myTabularConfig:
    items:
      - myToggleButton2: false
  myColumnDropdown: null
sources:
  - name: DOCS_DIM_LINE_ITEM
    columns:
      - id: 4c1e4719-b72b-41fe-82f6-7b6311475fdd
        name: system_column_name1
        dataType: STRING
        description: Some description
        nullable: true
        defaultValue: hello
        tests: []
        isSystemColumnName: true
        transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
        sourceColumns:
          - {}
      - id: 8791b268-3a95-4ac0-9929-1a2b328c60bd
        name: L_ORDERKEY
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
                          WHERE "L_ORDERKEY" IS NULL
          - name: Unique
            description: check if value is unique
            continueOnFailure: true
            runOrder: After
            templateString: |2-

                          SELECT "L_ORDERKEY", COUNT(*)
                          FROM {{ ref(node.location.name, node.name)}} 
                          GROUP BY "L_ORDERKEY"
                          HAVING COUNT(*) > 1
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 6bf537d0-c46a-4179-8a7d-0e1b0a1d1108
              name: L_ORDERKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 6f73c0e2-fe2b-45bc-b181-dcaa02256b38
        name: L_PARTKEY
        dataType: NUMBER(38,0)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 4108767a-2457-4ee5-8eac-7681326d1a88
              name: L_PARTKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 72636ad8-6c64-4983-a222-f9ac533c4eed
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
          - name: Unique
            description: check if value is unique
            continueOnFailure: true
            runOrder: After
            templateString: |2-

                          SELECT "L_SUPPKEY", COUNT(*)
                          FROM {{ ref(node.location.name, node.name)}} 
                          GROUP BY "L_SUPPKEY"
                          HAVING COUNT(*) > 1
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 2c9b638c-360f-4b86-8752-52d1120d445e
              name: L_SUPPKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 99710860-2240-42ac-bcad-d5011ce50909
        name: L_LINENUMBER
        dataType: NUMBER(38,0)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: edf4d472-6aad-4a41-8f5a-1da1dfe6bfc8
              name: L_LINENUMBER
              dataType: NUMBER(38,0)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 6dc793eb-8f7d-4f13-a315-8a1cacdf541a
        name: L_QUANTITY
        dataType: NUMBER(12,2)
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
                          WHERE "L_QUANTITY" IS NULL
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 1a2db895-c5d1-49c3-9677-09b6d1f6f742
              name: L_QUANTITY
              dataType: NUMBER(12,2)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 9fc64e2f-fd37-42e6-8f40-bc78a21680ed
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
      - id: eb70b19f-dc09-4b42-833b-c9c5d9d4897a
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
      - id: 4a062af3-1777-474a-b6c8-635adb540959
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
      - id: 7dbe0df9-10b8-4c6b-8376-eae71c25632e
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
      - id: 59c6ddb9-e8bd-4608-b011-6377c8906534
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
      - id: 3d1a6245-0bef-4fa3-b2c9-273b24a0c275
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
      - id: a4b64e99-eb5f-406b-9c5f-baddf3c99103
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
      - id: bd37ac6b-ce51-485a-9e52-8a3e4b79475a
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
      - id: a96cd9cb-8201-4c54-8f04-c41e46c41115
        name: L_EXTENDEDPRICE
        dataType: NUMBER(12,2)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 31b65bef-42f8-4f73-bd93-5cdcf785f490
              name: L_EXTENDEDPRICE
              dataType: NUMBER(12,2)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 7ba1fe2a-6ff6-44ce-a76c-831dc01d0b59
        name: L_DISCOUNT
        dataType: NUMBER(12,2)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 332bfaf3-7b6b-440d-a4e9-d8c5cd2c64db
              name: L_DISCOUNT
              dataType: NUMBER(12,2)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 2dc17e49-4013-445b-81e1-9ec64a25f472
        name: L_TAX
        dataType: NUMBER(12,2)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 1838f7d7-f0b7-4359-b69a-d4b80bd9370c
              name: L_TAX
              dataType: NUMBER(12,2)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: c2823c69-a131-4c5c-93b5-1630b1385595
        name: L_RETURNFLAG
        dataType: VARCHAR(1)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: c2f5a9e8-dda3-467c-ae2b-f48335e87a73
              name: L_RETURNFLAG
              dataType: VARCHAR(1)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: fe7dc273-d716-45a6-92d6-d311a5355440
        name: L_LINESTATUS
        dataType: VARCHAR(1)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: aaaa9052-9c2e-4212-a79e-eb302677e3d0
              name: L_LINESTATUS
              dataType: VARCHAR(1)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 54e1b35c-4676-46da-a371-7c7da356f2bb
        name: L_SHIPDATE
        dataType: DATE
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 9cad565a-7c63-42cd-a3c1-0f79fee13102
              name: L_SHIPDATE
              dataType: DATE
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 8959011e-a95b-4673-860c-a8f48e1d6b48
        name: L_COMMITDATE
        dataType: DATE
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 7b339c3a-fe69-42cc-99ec-b59a4a648b33
              name: L_COMMITDATE
              dataType: DATE
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 591df848-a979-4cd8-8bb2-4c88204aba2d
        name: L_RECEIPTDATE
        dataType: DATE
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 3813fedb-aa3c-4d28-a2aa-3915556def9d
              name: L_RECEIPTDATE
              dataType: DATE
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: f2fd738f-ca2b-4845-bb7f-4d18703ecb23
        name: L_SHIPINSTRUCT
        dataType: VARCHAR(25)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 59b4d78a-5719-4c4e-b564-c02057badb5f
              name: L_SHIPINSTRUCT
              dataType: VARCHAR(25)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: 602fa59d-4697-4e27-b9a1-bbb2d6400e67
        name: L_SHIPMODE
        dataType: VARCHAR(10)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 1c0e32ea-70b3-446c-8c0b-77c7fab2c701
              name: L_SHIPMODE
              dataType: VARCHAR(10)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
      - id: ee257834-ee7f-4da5-8689-4e1b22500fad
        name: L_COMMENT
        dataType: VARCHAR(44)
        description: ""
        nullable: false
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
              name: STG_LINEITEM
              nodeType: Stage
              location:
                name: WORK
              description: Lineitem data as defined by TPC-H
              materializationType: table
              isMultisource: false
              override:
                create:
                  enabled: false
                  script: ""
              tests: []
            column:
              id: 031c8ddc-9fe6-4754-bc54-eba44190d9a7
              name: L_COMMENT
              dataType: VARCHAR(44)
              description: ""
              nullable: false
              defaultValue: ""
              tests: []
    join: FROM {{ ref('WORK', 'STG_LINEITEM') }} "STG_LINEITEM"
    dependencies:
      - node:
          id: 9fcf37c9-c8b2-4b86-9009-5cda886df1ba
          name: STG_LINEITEM
          nodeType: Stage
          location:
            name: WORK
          description: Lineitem data as defined by TPC-H
          materializationType: table
          isMultisource: false
          override:
            create:
              enabled: false
              script: ""
          tests: []
        columns:
          - id: 6bf537d0-c46a-4179-8a7d-0e1b0a1d1108
            name: L_ORDERKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 4108767a-2457-4ee5-8eac-7681326d1a88
            name: L_PARTKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 2c9b638c-360f-4b86-8752-52d1120d445e
            name: L_SUPPKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: edf4d472-6aad-4a41-8f5a-1da1dfe6bfc8
            name: L_LINENUMBER
            dataType: NUMBER(38,0)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 1a2db895-c5d1-49c3-9677-09b6d1f6f742
            name: L_QUANTITY
            dataType: NUMBER(12,2)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 31b65bef-42f8-4f73-bd93-5cdcf785f490
            name: L_EXTENDEDPRICE
            dataType: NUMBER(12,2)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 332bfaf3-7b6b-440d-a4e9-d8c5cd2c64db
            name: L_DISCOUNT
            dataType: NUMBER(12,2)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 1838f7d7-f0b7-4359-b69a-d4b80bd9370c
            name: L_TAX
            dataType: NUMBER(12,2)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: c2f5a9e8-dda3-467c-ae2b-f48335e87a73
            name: L_RETURNFLAG
            dataType: VARCHAR(1)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: aaaa9052-9c2e-4212-a79e-eb302677e3d0
            name: L_LINESTATUS
            dataType: VARCHAR(1)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 9cad565a-7c63-42cd-a3c1-0f79fee13102
            name: L_SHIPDATE
            dataType: DATE
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 7b339c3a-fe69-42cc-99ec-b59a4a648b33
            name: L_COMMITDATE
            dataType: DATE
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 3813fedb-aa3c-4d28-a2aa-3915556def9d
            name: L_RECEIPTDATE
            dataType: DATE
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 59b4d78a-5719-4c4e-b564-c02057badb5f
            name: L_SHIPINSTRUCT
            dataType: VARCHAR(25)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 1c0e32ea-70b3-446c-8c0b-77c7fab2c701
            name: L_SHIPMODE
            dataType: VARCHAR(10)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
          - id: 031c8ddc-9fe6-4754-bc54-eba44190d9a7
            name: L_COMMENT
            dataType: VARCHAR(44)
            description: ""
            nullable: false
            defaultValue: ""
            tests: []
    customSQL: ""
node:
  id: scratch
  name: DOCS_DIM_LINE_ITEM
  nodeType: "16"
  location:
    name: WORK
  description: Lineitem data as defined by TPC-H
  materializationType: table
  isMultisource: true
  override:
    create:
      enabled: false
      script: ""
  tests:
    - name: Test
      description: ""
      continueOnFailure: true
      runOrder: After
      templateString: SELECT * FROM COALESCE
this: "{{ ref_no_link(node.location.name, node.name) }}"
parameters:
  hello: goodbye
  goodMorning: goodnight
```

</details>

<details>
<summary>**Multi Source Node Example**</summary>

```yaml
columns:
  - id: f8457ba3-fda2-4141-bcb5-857140b7724b
    name: N_CREWKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
  - id: f158fed0-78b2-400f-a24b-1fb5dd385f2b
    name: N_FIRSTNAME
    dataType: VARCHAR(50)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
  - id: fd76799a-f594-4668-8d13-52372bd125b1
    name: N_LASTNAME
    dataType: VARCHAR(50)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
  - id: 8cb29d5c-eac4-4bc5-a3e1-ac9069adab6f
    name: N_COMMENT
    dataType: VARCHAR(152)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
  - id: 4f4ed987-12e5-4d7f-b051-ba2ba6e75a83
    name: N_MIDDLEINITIAL
    dataType: VARCHAR(1)
    description: ""
    nullable: true
    defaultValue: ""
    tests: []
storageLocations:
  - database: TATIANA_GENERAL
    schema: DEV
    name: SAMPLE
  - database: TATIANA_GENERAL
    schema: WORK
    name: WORK
config:
  preSQL: ""
  truncateBefore: true
  insertStrategy: INSERT
  testsEnabled: true
  postSQL: ""
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
      - id: f158fed0-78b2-400f-a24b-1fb5dd385f2b
        name: N_FIRSTNAME
        dataType: VARCHAR(50)
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
              id: 7772191a-c470-4b20-b90b-79fbfcd41072
              name: N_FIRSTNAME
              dataType: VARCHAR(50)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: fd76799a-f594-4668-8d13-52372bd125b1
        name: N_LASTNAME
        dataType: VARCHAR(50)
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
              id: f7d3b0ac-8ea4-4cc6-8299-54443242a70f
              name: N_LASTNAME
              dataType: VARCHAR(50)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: 8cb29d5c-eac4-4bc5-a3e1-ac9069adab6f
        name: N_COMMENT
        dataType: VARCHAR(152)
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
              id: 24cc3381-cd9d-491a-8ec8-166d29769610
              name: N_COMMENT
              dataType: VARCHAR(152)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: 4f4ed987-12e5-4d7f-b051-ba2ba6e75a83
        name: N_MIDDLEINITIAL
        dataType: VARCHAR(1)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - {}
    join: FROM {{ ref('SAMPLE', 'NOSTROMO_SRC1') }} "NOSTROMO_SRC1"
    dependencies:
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
        columns:
          - id: 32991b79-632f-4729-9c84-61f53e53069c
            name: N_CREWKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 7772191a-c470-4b20-b90b-79fbfcd41072
            name: N_FIRSTNAME
            dataType: VARCHAR(50)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: f7d3b0ac-8ea4-4cc6-8299-54443242a70f
            name: N_LASTNAME
            dataType: VARCHAR(50)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 24cc3381-cd9d-491a-8ec8-166d29769610
            name: N_COMMENT
            dataType: VARCHAR(152)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
    customSQL: ""
  - name: SRC2
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
              id: 9ee5c8a0-b962-48ef-96c5-2e5e3e2516bc
              name: NOSTROMO_SRC2
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
              id: d0d3a1be-4068-4f5d-b61f-c74bf4952025
              name: N_CREWKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: f158fed0-78b2-400f-a24b-1fb5dd385f2b
        name: N_FIRSTNAME
        dataType: VARCHAR(50)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9ee5c8a0-b962-48ef-96c5-2e5e3e2516bc
              name: NOSTROMO_SRC2
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
              id: 11611358-8d45-4284-ad77-d377ceb117dc
              name: N_FIRSTNAME
              dataType: VARCHAR(50)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: fd76799a-f594-4668-8d13-52372bd125b1
        name: N_LASTNAME
        dataType: VARCHAR(50)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9ee5c8a0-b962-48ef-96c5-2e5e3e2516bc
              name: NOSTROMO_SRC2
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
              id: 30774bd2-455e-4211-95f0-2b9e45363dde
              name: N_LASTNAME
              dataType: VARCHAR(50)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: 8cb29d5c-eac4-4bc5-a3e1-ac9069adab6f
        name: N_COMMENT
        dataType: VARCHAR(152)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9ee5c8a0-b962-48ef-96c5-2e5e3e2516bc
              name: NOSTROMO_SRC2
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
              id: 01d323c6-5958-4e47-a521-219bad4ac172
              name: N_COMMENT
              dataType: VARCHAR(152)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: 4f4ed987-12e5-4d7f-b051-ba2ba6e75a83
        name: N_MIDDLEINITIAL
        dataType: VARCHAR(1)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: 9ee5c8a0-b962-48ef-96c5-2e5e3e2516bc
              name: NOSTROMO_SRC2
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
              id: 8c45b2ed-1e76-4c1f-802c-8f39dd75de0c
              name: N_MIDDLEINITIAL
              dataType: VARCHAR(1)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
    join: FROM {{ ref('SAMPLE', 'NOSTROMO_SRC2') }} "NOSTROMO_SRC2"
    dependencies:
      - node:
          id: 9ee5c8a0-b962-48ef-96c5-2e5e3e2516bc
          name: NOSTROMO_SRC2
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
        columns:
          - id: d0d3a1be-4068-4f5d-b61f-c74bf4952025
            name: N_CREWKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 11611358-8d45-4284-ad77-d377ceb117dc
            name: N_FIRSTNAME
            dataType: VARCHAR(50)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 8c45b2ed-1e76-4c1f-802c-8f39dd75de0c
            name: N_MIDDLEINITIAL
            dataType: VARCHAR(1)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 30774bd2-455e-4211-95f0-2b9e45363dde
            name: N_LASTNAME
            dataType: VARCHAR(50)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 01d323c6-5958-4e47-a521-219bad4ac172
            name: N_COMMENT
            dataType: VARCHAR(152)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
    customSQL: ""
  - name: SRC3
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
              id: e49d528e-dbbc-48c5-82d7-408a5c44f05f
              name: NOSTROMO_SRC3
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
              id: 9cf87c06-3016-44e7-ac34-efd58c83cab4
              name: N_CREWKEY
              dataType: NUMBER(38,0)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: f158fed0-78b2-400f-a24b-1fb5dd385f2b
        name: N_FIRSTNAME
        dataType: VARCHAR(50)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: e49d528e-dbbc-48c5-82d7-408a5c44f05f
              name: NOSTROMO_SRC3
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
              id: 8f1f539f-1077-4740-b71e-2cd3d08ba760
              name: N_FIRSTNAME
              dataType: VARCHAR(50)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: fd76799a-f594-4668-8d13-52372bd125b1
        name: N_LASTNAME
        dataType: VARCHAR(50)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: e49d528e-dbbc-48c5-82d7-408a5c44f05f
              name: NOSTROMO_SRC3
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
              id: b28e03e2-a8c2-4a97-a676-399b5ddd0258
              name: N_LASTNAME
              dataType: VARCHAR(50)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: 8cb29d5c-eac4-4bc5-a3e1-ac9069adab6f
        name: N_COMMENT
        dataType: VARCHAR(152)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - node:
              id: e49d528e-dbbc-48c5-82d7-408a5c44f05f
              name: NOSTROMO_SRC3
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
              id: a32323d1-705e-4bb0-8318-9fb105f32f65
              name: N_COMMENT
              dataType: VARCHAR(152)
              description: ""
              nullable: true
              defaultValue: ""
              tests: []
      - id: 4f4ed987-12e5-4d7f-b051-ba2ba6e75a83
        name: N_MIDDLEINITIAL
        dataType: VARCHAR(1)
        description: ""
        nullable: true
        defaultValue: ""
        tests: []
        transform: ""
        sourceColumns:
          - {}
    join: FROM {{ ref('SAMPLE', 'NOSTROMO_SRC3') }} "NOSTROMO_SRC3"
    dependencies:
      - node:
          id: e49d528e-dbbc-48c5-82d7-408a5c44f05f
          name: NOSTROMO_SRC3
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
        columns:
          - id: 9cf87c06-3016-44e7-ac34-efd58c83cab4
            name: N_CREWKEY
            dataType: NUMBER(38,0)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: 8f1f539f-1077-4740-b71e-2cd3d08ba760
            name: N_FIRSTNAME
            dataType: VARCHAR(50)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: b28e03e2-a8c2-4a97-a676-399b5ddd0258
            name: N_LASTNAME
            dataType: VARCHAR(50)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
          - id: a32323d1-705e-4bb0-8318-9fb105f32f65
            name: N_COMMENT
            dataType: VARCHAR(152)
            description: ""
            nullable: true
            defaultValue: ""
            tests: []
    customSQL: ""
node:
  id: scratch
  name: STG_NOSTROMO_COMBINED
  nodeType: Stage
  location:
    name: SAMPLE
  description: ""
  materializationType: table
  isMultisource: true
  override:
    create:
      enabled: false
      script: ""
  tests: []
this: "{{ ref_no_link(node.location.name, node.name) }}"
parameters: {}
```

</details>

[Hydrated Metadata Object]:/docs/build-your-pipeline/user-defined-nodes/hydrated-metadata-reference#hydrated-metadata-object
