---
title: Accessing Hydrated Metadata
description: Learn to access and utilize Coalesce's Hydrated Metadata using dot notation syntax in Jinja templates for custom node development. Master object and array navigation techniques, understand metadata structure identification, implement tabular configuration access, and create dynamic SQL templates. Essential guide for leveraging node metadata in Create and Run templates for advanced data transformation customization.
keywords: [Coalesce hydrated metadata, dot notation syntax, Jinja template access, custom node development, metadata object navigation, array access techniques, tabular configuration, dynamic SQL templates, metadata structure analysis, node metadata utilization, custom node templates, Coalesce metadata reference, template development, enterprise node customization, metadata-driven templates]
---

In this guide you'll learn about using dot notation in Coalesce and how it works with Jinja to help you build Nodes.

## What Is Dot Notation?

Dot notation provides a way to access nested data in structured documents like YAML files. Dot notation is used for nested properties and keys. For example, if you wanted to access `zipcode`, it would b e `person.address.zipcode`.

```yaml
person:
  name: Alice
  age: 25
  address:
    city: New York
    zipcode: 10001
```

## Coalesce Hydrated Metadata Structure

Coalesce Hydrated Metadata is structured using objects and arrays.

:::info[]

These examples focus on returning the value. Depending on your use, you may need to adjust the notation.

:::

### Identifying Objects

- Use key-value pairs (key: value)
- No dashes before items
- Nested properties use indentation

```yaml title="Object"
config:
  testsEnabled: true    # No dash, just key: value
  preSQL: ""           # No dash, just key: value
  postSQL: ""          # No dash, just key: value
  myTextbox: hello     # No dash, just key: value
```

### Identifying Arrays

- Start with a dash (-)
- Items are in a list format
- Each item begins at the same indentation level

```yaml title="Array"
storageLocations:
  - database: SNOWFLAKE_SAMPLE_DATA # Starts with -
    schema: TPCH_SF100
    name: SAMPLE
  - database: TATIANA_DOCS_DYNAMIC_TABLES # Starts with -
    schema: HYDRATED
    name: WORK
  - database: TATIANA_DOCS_DYNAMIC_TABLES # Starts with -
    schema: QA
    name: DEV
```

### Identifying Mixed Objects and Arrays

The following examples show how to identify mixed data.

```yaml title="Object Containing an Array"
config:    # This is an object
  myTabularConfig:    # This is a nested object
    items:    # This contains an array
      - tabconfigdropdown: option1    # Array item 1
      - tabconfigdropdown: option2    # Array item 2
```

```yaml title="Array Containing Objects"
columns:    # This contains an array
  - id: "3aeb7039-cc9c-405c"    # First object in array
    name: "S_SUPPKEY"
    dataType: "NUMBER(38,0)"
    
  - id: "e559a0ba-fa32-4ded"    # Second object in array
    name: "S_NAME"
    dataType: "VARCHAR(25)"
```

## Using Dot Notation in Coalesce

The following section contains examples on accessing values in the Hydrated Metadata and what the values would be. This can vary based on the Node data.

### Accessing Object Properties

Object properties are accessed directly using a dot.

- Use the exact attribute name
- Add a dot between each level
- No spaces around the dots

```yaml title="Config Object"
config.testsEnabled → true
config.myTextbox → "hello"
config.myButton → true

#config object
config:
  dropdownSelectorExample: option1
  preSQL: ""
  postSQL: ""
  myDropdown: option1
  myColumnDropdown:
    id: 3aeb7039-cc9c-405c-a179-08453f651b2f
    name: S_SUPPKEY
    dataType: NUMBER(38,0)
    description: ""
    nullable: false
    defaultValue: ""
    tests: []
  insertStrategy: INSERT
  truncateBefore: true
  testsEnabled: true
  myTextbox: hello
  myButton: true

```

### Accessing Array Items

Arrays are counted starting at 0. This means the first element in an array is 0, and the second item is, 1, and so on.

- Use [0] for the first item
- Use [1] for the second item
- Always include the brackets and number

```yaml title="Storage Location Array"
# Array access with index
storageLocations[0].database → "SNOWFLAKE_SAMPLE_DATA"
storageLocations[0].schema → "TPCH_SF100"
storageLocations[0].name → "SAMPLE"

storageLocations[1].database → "TATIANA_DOCS_DYNAMIC_TABLES"
storageLocations[1].schema → "HYDRATED"
storageLocations[1].name → "WORK"

## storage location array
storageLocations:
  - database: SNOWFLAKE_SAMPLE_DATA #0
    schema: TPCH_SF100
    name: SAMPLE
  - database: TATIANA_DOCS_DYNAMIC_TABLES #1
    schema: HYDRATED
    name: WORK
  - database: TATIANA_DOCS_DYNAMIC_TABLES #2
    schema: QA
    name: DEV
```

### Accessing Tabular Config Items

These items use a slightly different syntax to access the items because of how it's structured. Tabular config uses `get()` to access item. Get is used access a value for a given key in a dictionary.

Review [Tabular Configuration Component][].

```yaml title="Tabular Config"
config.myTabularConfig.get('items')[0].myColumnDropdown2.tests[0].description # The first myColumnDropdown2
config.myTabularConfig.get('items')[0].myColumnDropdown2.isSurrogateKey
config.myTabularConfig.get('items')[1].myColumnDropdown2.name # The second myColumnDropdown2

config:
  postSQL: ""
  myTabularConfig:
    items:
      - myColumnDropdown2:
          id: ea286ca2-d281-4bec-b0ff-669cb90d266d
          name: DIM_REGION_KEY
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
                            WHERE "DIM_REGION_KEY" IS NULL
          isSurrogateKey: true
        myToggleButton2: true
        tabconfigdropdown: option2
      - myColumnDropdown2:
          id: 4b07200a-2939-4b38-9cb2-f91732518a61
          name: SYSTEM_VERSION
          dataType: NUMBER
          description: ""
          nullable: true
          defaultValue: ""
          tests: []
          isSystemVersion: true
        tabconfigdropdown: option1
        myToggleButton2: true
```

### Dot Notation in Jinja Templates

Below are a few examples of using Hydrated Metadata and dot notation in Jinja templates. The format can be used in the Create or Run templates.

```sql title="Access Object Properties"
-- Check direct properties
{% if config.testsEnabled %}
    -- Test logic here
{% endif %}

-- Check nested properties
{% if node.override.create.enabled %}
    {{ node.override.create.script }}
{% endif %}
```

```sql title="Loop Through Arrays"
-- Basic array loop
{% for location in storageLocations %}
    {{ location.database }}.{{ location.schema }}
{% endfor %}

-- Nested array access
{% for source in sources %}
    {% for col in source.columns %}
        {{ col.name }}
    {% endfor %}
{% endfor %}
```

```sql title="Basic Create Table"
CREATE OR REPLACE TABLE {{ ref_no_link(node.location.name, node.name) }}
(
    {% for col in columns %}
        -- Access column properties in a loop
        "{{ col.name }}" {{ col.dataType }}
        
        -- Check nullable property
        {%- if not col.nullable %} NOT NULL
            -- Check default value length
            {%- if col.defaultValue | length > 0 %}
                DEFAULT {{ col.defaultValue }}
            {% endif %}
        {% endif %}
        
        -- Add column description
        {%- if col.description | length > 0 %}
            COMMENT '{{ col.description | escape }}'
        {% endif %}
        
        -- Handle commas between columns
        {%- if not loop.last -%}, {% endif %}
    {% endfor %}
)
```

```sql title="Basic Create Views"
CREATE OR REPLACE VIEW {{ ref_no_link(node.location.name, node.name) }}
(
    {% for col in columns %}
        -- Column name from array
        "{{ col.name }}"
        
        -- Optional column comment
        {%- if col.description | length > 0 %}
            COMMENT '{{ col.description | escape }}'
        {% endif %}
        
        -- Comma handling
        {%- if not loop.last -%}, {% endif %}
    {% endfor %}
)
```

## What's Next?

- Review the [Hydrated Metadata Dot Notation Reference][]

[Tabular Configuration Component]: /docs/build-your-pipeline/user-defined-nodes/node-config-options#tabular-configuration-component
[Hydrated Metadata Dot Notation Reference]: /docs/build-your-pipeline/user-defined-nodes/hydrated-metadata-reference#hydrated-metadata-dot-notation
