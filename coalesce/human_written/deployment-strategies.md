---
title: Deployment Strategies for Custom Node Types
description: Configure optimal deployment strategies for Coalesce custom node types using default and transient deployment options. Learn the differences between CLONE/ALTER operations in default strategy versus DROP/CREATE operations in transient strategy, understand performance implications, and choose the right deployment approach based on your data transformation requirements and change management needs.
keywords: [Coalesce deployment strategies, custom node deployment, default deployment strategy, transient deployment strategy, CLONE ALTER operations, DROP CREATE deployment, node deployment configuration, deployment performance optimization, custom node types deployment, enterprise deployment patterns, deployment strategy selection, node deployment methods, Coalesce deployment options, deployment workflow optimization, node deployment best practices]
---

Coalesce uses a `default` deployment strategy by default, which can be changed by adding `deployStrategy: transient` to a custom Node definition. If a user desires an out-of-the-box Node type with transient strategy, they can make a copy of the Node Type and edit it to change its deployment strategy. Example formatting and where to add the YAML in a UDN's definition.

```yaml Node Definition
capitalized: My New Node
short: NN
plural: My New Nodes
tagColor: '#2EB67D'

deployStrategy: transient # <-- 
```

## Default Strategy

`default` deploy strategy will be used, unless otherwise specified. When a change is made to a Node, Coalesce will attempt to CLONE and ALTER a copy of the Node, then swap/rename the cloned Node with the original Node. Notice the column's Description field was edited and the change took place over four stages.

<img src="/img/docs-images/build-your-pipeline/6c6a719-default_strategy.png" alt="An example deployment where a column's Description field was edited, notice the change took place over four stages" className="mdImages"/>

## Transient Strategy

`transient` is an alternate strategy, and only used if specified. When a change is made to a Node, Coalesce will attempt to DROP and execute the CREATE TEMPLATE of the Node Type. Notice the same column's Description field was edited, notice there's only two stages.

<img src="/img/docs-images/build-your-pipeline/9d5643c-transient_strategy.png" alt="An example deployment where the same column's Description field was edited, notice there's only two stages" className="mdImages"/>
