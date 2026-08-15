---
title: Custom Node Types
description: Create custom Coalesce node types using YAML, Jinja 2, and SQL for advanced data transformation workflows. Master node definition, create templates, run templates, and hydrated metadata to build enterprise-grade data pipeline components. Complete guide to extending Coalesce functionality with user-defined nodes and custom transformation logic.
keywords: [Coalesce custom node types, user-defined nodes, YAML node configuration, Jinja 2 templating, custom data transformation, node type development, create templates, run templates, hydrated metadata, custom SQL nodes, data pipeline customization, enterprise data modeling, Coalesce development, custom transformation logic, node type creation]
---

Coalesce comes with built-in [Node types][] and [Packages][] for data transformations, you can also create your own custom Nodes or UDN(user-defined Nodes) using YAML, Jinja 2, and SQL.

To make your own **Node Type**, go to **Build Settings**>**Node Types** and select **New Node Type** to start from scratch or **Duplicate** on any Node Type to extend existing functionality.

## Learn About the Components of a Node

Before building a Node, review our guides on each part of a Node and how they work together.

A Node consists of these components:

1. [**Node Definition**][] - Written in YAML, specifies UI elements and configurations like node color, materialization options, and business keys.
2. [**Create Template**][] - Defines the table's structure (DDL).
3. [**Run Template**][] - Defines how the table will be populated with data (DML).
4. [**Hydrated Metadata**][] -   An object that contains all the structured information needed to define a Node in Coalesce.
5. [**Macros**][] - A block of code you can define once to use multiple times. They can be used in the Create or Run template.

<img src="/img/docs-images/build-your-pipeline/user_def_nodes_example.png" alt="Shows the dimension's column definitions with properties like ID fields, data types, and nullable flags on the left, while displaying node-level configuration options including materialization settings on the right under the Node Definition tab." className="mdImages"/>

## What's Next

* Video - [What Are Custom Node Types in Coalesce?][]

import DocCardList from '@theme/DocCardList';

<DocCardList />

[Node types]: /docs/get-started/coalesce-fundamentals/nodes/
[Packages]: /docs/marketplace
[What Are Custom Node Types in Coalesce?]:https://www.youtube.com/watch?v=I-A_mjTgbAA
[**Node Definition**]: /docs/build-your-pipeline/user-defined-nodes/node-definition
[**Create Template**]: /docs/build-your-pipeline/user-defined-nodes/create-run-template
[**Run Template**]: /docs/build-your-pipeline/user-defined-nodes/create-run-template
[**Hydrated Metadata**]: /docs/build-your-pipeline/user-defined-nodes/hydrated-metadata
[**Macros**]: /docs/reference/macros/
