---
title: Node Definition
description: Master Coalesce Node Definition using YAML for custom node type development and data transformation workflows. Learn to configure UI elements, materialization options, business keys, system columns, and mapping columns. Complete guide to building enterprise-grade custom nodes with advanced configuration patterns and dynamic node properties.
keywords: [Coalesce node definition, custom node types, YAML configuration, node type development, UI element configuration, data transformation nodes, custom node creation, business key configuration, system columns, mapping columns, materialization options, node properties, Coalesce development, enterprise data modeling, node customization]
---

Written in YAML, the Node Definition is where you specify the UI elements and other configurations that should be available for Nodes. This includes the Node's color, its materialization options (table or view), business keys, and more.

For a full list, see the [Node Definition Reference][].

<details>
    <summary>**Node Definition Example**</summary>

```yaml
capitalized: Hydrated Dimension
short: DIM
tagColor: '#1E339A'
plural: Dimensions

config:
- groupName: Options
  items:
  - type: materializationSelector
    isRequired: true
    default: table
    options:
    - table
    - view

  - type: multisourceToggle
    enableIf: "{% if node.materializationType == 'table' %} true {% else %} false {% endif %}"

  - type: businessKeyColumns
    isRequired: true

  - type: changeTrackingColumns
    isRequired: false

  - type: overrideSQLToggle
    enableIf: "{% if node.materializationType == 'view' %} true {% else %} false {% endif %}"

  - displayName: Enable Tests
    attributeName: testsEnabled
    type: toggleButton
    default: true
    
  - displayName: Pre-SQL
    attributeName: preSQL
    type: textBox
    syntax: sql
    isRequired: false

  - displayName: Post-SQL
    attributeName: postSQL
    type: textBox
    syntax: sql
    isRequired: false

- groupName: Dropdown Selector Example
  items:
  - type: dropdownSelector
    displayName: My Dropdown Selector
    attributeName: myDropdown
    default: option1
    options:
    - option1
    - option2
    isRequired: true

systemColumns:

- displayName: '{{NODE_NAME}}_KEY'
  transform: ''
  dataType: NUMBER
  placement: beginning
  attributeName: isSurrogateKey

- displayName: SYSTEM_VERSION
  transform: ''
  dataType: NUMBER
  placement: end
  attributeName: isSystemVersion

- displayName: SYSTEM_CURRENT_FLAG
  transform: ''
  dataType: VARCHAR
  placement: end
  attributeName: isSystemCurrentFlag

- displayName: SYSTEM_START_DATE
  transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
  dataType: TIMESTAMP
  placement: end
  attributeName: isSystemStartDate

- displayName: SYSTEM_END_DATE
  transform: CAST('2999-12-31 00:00:00' AS TIMESTAMP)
  dataType: TIMESTAMP
  placement: end
  attributeName: isSystemEndDate

- displayName: SYSTEM_CREATE_DATE
  transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
  dataType: TIMESTAMP
  placement: end
  attributeName: isSystemCreateDate

- displayName: SYSTEM_UPDATE_DATE
  transform: CAST(CURRENT_TIMESTAMP AS TIMESTAMP)
  dataType: TIMESTAMP
  placement: end
  attributeName: isSystemUpdateDate

mappingColumns:
- headerName: My Mapping Column Name
  attributeName: myMappingColumn
  type: textBox
```

</details>

<img src="/img/docs-images/build-your-pipeline/user_def_nodes_001.png" alt="Shows the dimension's column definitions with properties like ID fields, data types, and nullable flags on the left, while displaying node-level configuration options including materialization settings on the right under the Node Definition tab." className="mdImages"/>

## Node Properties

Nodes will always have an auto-generated Node Properties section. It contains:

* **Storage Location** - Logical storage location representing the database and schema which are mapped in the Workspace/Environment's Storage Mappings.
* **Node Type** - The name of the type of node. This could be user-defined or a core option. This can be changed by clicking the pencil next to the Node Type.
* **Deploy Enabled** - This toggle determines if a Node will be included in a deployment. By default, all Nodes in a Workspace are included in a deployment, this allows changing that behavior.

:::warning[Disabling Deploy]

If a Node exists on the target environment and deploy is disabled, the next deployment will cause that Node's table to be dropped.

:::

<img src="/img/docs-images/build-your-pipeline/user_def_nodes_016.png" alt="Config panel showing Node Properties with storage location, node type settings, and an enabled deployment toggle" className="mdImages" width="50%"/>

## Node Definition Config

The `config` section is where you’ll add in UI elements for the user such as a dropdown or business key toggle and then use it in [Macros][], [Create Template][], and [Run Template][].

In the config for the Node below, there is `groupName:Options` which contains the `materializationSelector`, `multisourceToggle`, `businessKeyColumns`, `changeTrackingColumns`, and other options. These correlate to the elements shown in the options. These are pre-built elements you can use.

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_002.png" alt="split view of YAML node definition code and UI configuration panel with options for Business Key and Change Tracking settings" className="mdImages" />
  <figcaption>Node definition config</figcaption>
</figure>

### Adding Groups

Groups are where you can organize Node options. For example, the after the group labeled Options, there is a new group called `Dropdown Selector Example`. This adds a new group with a generic drop down selector that requires the user to select information. Using generic elements is a good way to get custom input.

<!-- markdownlint-disable MD046 -->

```yaml title="Dropdown Selector Example"
- groupName: Dropdown Selector Example
  items:
  - type: dropdownSelector
    displayName: My Dropdown Selector
    attributeName: myDropdown
    default: option1
    options:
    - option1
    - option2
    isRequired: true
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_003.png" alt="Split view of YAML configuration showing dropdown selector definition and corresponding UI panel with dropdown menu options" className="mdImages"/>
  <figcaption>Node definition with new group added</figcaption>
</figure>

## System Columns

System columns add additional columns to a Node when first initialized. System columns can be customized using transforms. In the following image you can see multiple system columns in the Node Definition. System columns can be customized such as placement and the display name accepts Jinja.

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_005.png" alt="YAML configuration showing system column definitions with display names, data types, and attributes for key, version, flag and timestamp fields." className="mdImages" width="50%"/>
  <figcaption>System Columns</figcaption>
</figure>

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_nodes_004.png" alt="Database table mapping view for DIM_CUSTOMER showing customer fields and system tracking columns with data types and nullability settings" className="mdImages"/>
  <figcaption>Coalesce Node Editor showing system columns</figcaption>
</figure>

Here is an example of a system column that will appended to the beginning of the columns, so it appears as the first column. These only appear on initialization, so you might need to add a new Node to see the `systemColumns`.

You can use Jinja templating in the Node Definition, here it’s being used to get the Node Name. The `attributeName` is used in the Create or Run template to access the data.

```yaml title="systemColumns"
systemColumns:

- displayName: '{{NODE_NAME}}_CREATED_BY_COALESCE'
  transform: ''
  dataType: NUMBER
  placement: beginning
  attributeName: isCustomName
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_node_017.png" alt="Dimension table mapping view showing nation data fields including created date, nation key and name with data types and nullability settings" className="mdImages"/>
  <figcaption>System column added with Jinja templating</figcaption>
</figure>

:::warning[Adding and Modifying System Columns]

System columns are only added to a Node when the Node is first created on the graph. When adding new system columns to a user defined Node, these system columns will not immediately be available in the metadata of the current node you are editing.

For these changes to take effect, you must create a new Node of this type on your graph. You must select this new Node in the Node Type Editor to continue authoring it.

:::

## Mapping Columns

Mapping columns append additional metadata to the mapping grid. They are added as a column and are always a textbox.

```yaml title="mappingColumns"
mappingColumns:
- headerName: My Mapping Column Name
  attributeName: myMappingColumn
  type: textBox
```

<figure>
  <img src="/img/docs-images/build-your-pipeline/user_def_node_007.png" alt="Customer database table view with list of column names and additional configuration columns for Default Value, Hash, and Mapping fields with My Mapping Column Name highlights" className="mdImages"/>
  <figcaption>Node Definition with  `My Mapping Column Name` added</figcaption>
</figure>

[Node Definition Reference]: /docs/build-your-pipeline/user-defined-nodes/node-config-options
[Macros]: /docs/reference/macros/
[Create Template]: /docs/build-your-pipeline/user-defined-nodes/create-run-template
[Run Template]: /docs/build-your-pipeline/user-defined-nodes/create-run-template
