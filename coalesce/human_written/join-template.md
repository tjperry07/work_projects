---
title: Join Templates
description: Master Coalesce Join Templates for custom SQL join generation and advanced node dependency management. Learn to customize JOIN string creation, implement stage-based templates for complex SQL executions, and use ref macros for dynamic node references. Essential guide for building sophisticated data transformation workflows with automated join logic and dependency handling.
keywords: [Coalesce join templates, custom SQL joins, node dependencies, JOIN string generation, stage-based templates, ref macros, data transformation joins, SQL automation, custom node types, pipeline development, dependency management, Jinja templating, data warehouse joins, Coalesce development, advanced SQL patterns]
---

The Coalesce platform generates a Join string by default when a node is initialized or when a user triggers a Generate Join. This uses the dependencies of the node to generate a generic `JOIN` string using `INNER JOIN`. However, for more complex use cases, users may wish to customize the behavior by using a Join Template that generates the JOIN string based on the metadata of the node.

## Working With Refs

To ensure that Coalesce captures dependencies from the compiled Join string, the `ref` syntax must be left un-rendered as part of the Join Template. This presents a challenge since we need to render part of the Jinja, but exclude the `ref`. To address this challenge, the Join template will only render to a depth of 1, which is inconsistent with other Jinja templates found elsewhere in the app that recursively render Jinja until no Jinja is left.

The following macros can be utilized to render un-rendered `ref` calls. To use these macros they must be added to your Workspace under **Build Settings** > **Macros**.

```sql
{%- macro ref_raw(location_name, node_name) -%}
    {% raw %}{{ ref('{% endraw %}{{ location_name }}{% raw %}', '{% endraw %}{{ node_name }}{% raw %}') }}{% endraw %}
{%- endmacro -%}

{%- macro ref_no_link_raw(location_name, node_name) -%}
    {% raw %}{{ ref_no_link('{% endraw %}{{ location_name }}{% raw %}', '{% endraw %}{{ node_name }}{% raw %}') }}{% endraw %}
{%- endmacro -%}

{%- macro ref_link_raw(location_name, node_name) -%}
    {% raw %}{{ ref_link('{% endraw %}{{ location_name }}{% raw %}', '{% endraw %}{{ node_name }}{% raw %}') }}{% endraw %}
{%- endmacro -%}
```

Here's an example of using `ref_raw` to generate a very simple Join string using the Join Template.

```sql
capitalized: 'My Node Name'
short: 'MNN'
plural: 'My Node Names'
tagColor: '#FF5A5F'

joinTemplate: |
  {%- for dep in sources[0].dependencies -%}
    {%- if loop.first %} FROM {% endif -%}
    {%- if not loop.first %}LEFT JOIN {% endif -%}
    {{- ref_raw(dep.node.location.name, dep.node.name) }} {{ dep.node.name }}
    {% if not loop.first %} ON {{ sources[0].dependencies[loop.index0].node.name }}./*COLUMN*/ = {{ sources[0].dependencies[loop.index0 - 1].node.name }}./*COLUMN*/ {%- endif %}
  {% endfor -%}
  
  WHERE 1=1
```

## Stage-Based Templates

Node Type templates typically generate one or many SQL execution queries, which Coalesce refers to as Stages. Stages allow Coalesce to run multiple queries against the data warehouse while providing additional runtime behavior and tracking metrics about individual SQL executions.

For example, you may decide to output a `TRUNCATE` and a `MERGE` statements as individual stages, using Jinja to render stages at the appropriate time conditionally.

Coalesce then reads the stage output and executes each of the stages one by one, tracking each statement's progress and data results.

A Stage only needs to be declared at the beginning of the query. A Stage ends either at the beginning of the next declared Stage or at the end of the template.

To declare a **Stage**, use the following syntax. `{{ stage('My Stage Name') }}`
