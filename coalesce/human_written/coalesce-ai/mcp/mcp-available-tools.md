---
title: Transform MCP Available Tools
description: Reference for all 21 Transform MCP tools across Environments, Projects, runs, Nodes, and run actions, with inputs and REST API equivalents.
keywords: [Transform MCP tools, environments_list, runs_start, MCP tool reference]
processed: true
---

Transform MCP exposes 21 tools grouped into five families. Tool names use underscores, for example `environments_list`, to satisfy MCP client naming rules.

List tools return a `{ data, next, limit }` envelope where pagination applies. Pass `startingFrom` from a previous response's `next` field to fetch the next page.

For setup, see [Connect to Transform MCP][]. For ID formats, see [Find Coalesce IDs][].

## Environment Tools

Manage deployment **Environments** in your organization.

| Tool | Purpose | REST equivalent |
| --- | --- | --- |
| `environments_list` | List **Environments** with optional pagination | [Get Environments][] |
| `environments_get` | Get one **Environment** by ID | [Get Environment][] |
| `environments_create` | Create a new **Environment** | [Create Environment][] |
| `environments_update` | Partially update an **Environment** | [Update Environment][] |
| `environments_delete` | Delete an **Environment** | [Delete Environment][] |

### `environments_list`

List deployment **Environments** in your organization.

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `detail` | boolean | No | Include full detail, including **Storage Locations** and health, rather than summaries |
| `limit` | integer | No | Page size, 1–500 (default 100) |
| `startingFrom` | string | No | Pagination cursor from a previous response's `next` |
| `project` | string | No | Filter to a single **Project** ID |

### `environments_get`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `environmentID` | string | Yes | The **Environment** ID |

### `environments_create`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | **Environment** name |
| `project` | string | Yes | **Project** ID the **Environment** belongs to |
| `oauthEnabled` | boolean | Yes | Whether OAuth is enabled for the **Environment** connection |
| `description` | string | No | **Environment** description |
| `connectionAccount` | string | No | Account name for the **Environment** connection |
| `accessUrl` | string | No | Optional access URL for the **Environment** connection |
| `defaultStorageMapping` | string | No | Default **Storage Mapping** name |
| `mappings` | object | No | **Storage Location** mappings keyed by location name |

### `environments_update`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `environmentID` | string | Yes | The **Environment** ID to update |
| `name` | string | No | **Environment** name |
| `description` | string | No | **Environment** description |
| `connectionAccount` | string | No | Account name for the **Environment** connection |
| `accessUrl` | string | No | Access URL for the **Environment** connection |
| `defaultStorageMapping` | string | No | Default **Storage Mapping** name |
| `oauthEnabled` | boolean | No | Whether OAuth is enabled |
| `mappings` | object | No | **Storage Location** mappings |

### `environments_delete`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `environmentID` | string | Yes | The **Environment** ID to delete |

## Project Tools

Manage **Projects**, which group **Environments** and **Workspaces**.

| Tool | Purpose | REST equivalent |
| --- | --- | --- |
| `projects_list` | List **Projects** in your org | [Get Projects in Org][] |
| `projects_get` | Get one **Project** by ID | [Get Project in Org][] |
| `projects_create` | Create a new **Project** | [Create Project][] |
| `projects_update` | Partially update a **Project** | [Update Project][] |
| `projects_delete` | Delete a **Project** | [Delete Project][] |

### `projects_list`

`projects_list` is not paginated upstream. The response always fits on one page. The `next` field is `null`.

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `includeWorkspaces` | boolean | No | Include nested **Workspace** data for all **Projects** |
| `includeJobs` | boolean | No | Include nested **Job** data for all **Workspaces** in the **Projects** |

### `projects_get`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `projectID` | string | Yes | The **Project** ID |
| `includeWorkspaces` | boolean | No | Include nested **Workspace** data |
| `includeJobs` | boolean | No | Include nested **Job** data for all **Workspaces** |

### `projects_create`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `platformKind` | string | Yes | `snowflake`, `databricks`, `bigquery`, or `fabric` |
| `name` | string | Yes | **Project** name |
| `description` | string | No | **Project** description |
| `gitRepoURL` | string | No | Git repository URL |
| `autoPreviewEnabled` | boolean | No | Whether sample data is fetched automatically after running a **Node** |

### `projects_update`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `projectID` | string | Yes | The **Project** ID to update |
| `platformKind` | string | No | `snowflake`, `databricks`, `bigquery`, or `fabric` |
| `name` | string | No | **Project** name |
| `description` | string | No | **Project** description |
| `gitRepoURL` | string | No | Git repository URL |
| `autoPreviewEnabled` | boolean | No | Whether sample data is fetched automatically after running a **Node** |

### `projects_delete`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `projectID` | string | Yes | The **Project** ID to delete |

## Run Read Tools

Inspect run history and results.

| Tool | Purpose | REST equivalent |
| --- | --- | --- |
| `runs_list` | List runs with filters and pagination | [Get Runs][] |
| `runs_get` | Get one run by numeric run ID | [Get Run][] |
| `runs_results` | Get per-run results for a deploy or refresh | [Get Run Results][] |

### `runs_list`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | integer | No | Maximum runs to return, 1–1000 |
| `startingFrom` | number or string | No | Pagination cursor from a previous response's `next` |
| `orderBy` | string | No | Field to sort by. Set explicitly when using `startingFrom` |
| `orderByDirection` | string | No | Sort order |
| `projectID` | string | No | Filter to a single **Project** ID |
| `runType` | string | No | Filter by run type |
| `runStatus` | string | No | Filter by run status |
| `environmentID` | string | No | Filter to a single **Environment** ID |
| `detail` | boolean | No | Include full run detail rather than summaries |

### `runs_get` and `runs_results`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `runID` | integer | Yes | Numeric run ID. The scheduler API calls this value `runCounter`. |

:::warning[Run ID is numeric]

`runID` must be the numeric run counter, for example `42`, not the UUID in a run URL. See [Find Coalesce IDs][].

:::

## Node Read Tools

Inspect **Nodes** in an **Environment** or **Workspace**.

| Tool | Purpose | REST equivalent |
| --- | --- | --- |
| `nodes_list_environment` | List **Nodes** deployed in an **Environment** | [Get Nodes][] |
| `nodes_get_environment` | Get one **Environment** **Node** | [Get Node][] |
| `nodes_list_workspace` | List **Nodes** in a **Workspace** | [Get Workspace Nodes][] |
| `nodes_get_workspace` | Get one **Workspace** **Node** | [Get Workspace Node][] |

### `nodes_list_environment`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `environmentID` | string | Yes | The **Environment** ID |
| `detail` | boolean | No | Include full **Node** detail rather than summaries |
| `limit` | integer | No | Page size, 1–500 (default 100) |
| `startingFrom` | string | No | Pagination cursor from a previous response's `next` |
| `skipParsing` | boolean | No | Skip parsing column references and updating sources |

### `nodes_get_environment`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `environmentID` | string | Yes | The **Environment** ID |
| `nodeID` | string | Yes | The **Node** ID |
| `skipParsing` | boolean | No | Skip parsing column references and updating sources |

### `nodes_list_workspace`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `workspaceID` | string | Yes | The **Workspace** ID |
| `detail` | boolean | No | Include full **Node** detail rather than summaries |
| `limit` | integer | No | Page size, 1–500 (default 100) |
| `startingFrom` | string | No | Pagination cursor from a previous response's `next` |
| `skipParsing` | boolean | No | Skip parsing column references and updating sources |

### `nodes_get_workspace`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `workspaceID` | string | Yes | The **Workspace** ID |
| `nodeID` | string | Yes | The **Node** ID |
| `skipParsing` | boolean | No | Skip parsing column references and updating sources |

## Run Action Tools

Trigger and manage refresh runs. These tools call the scheduler API and can start warehouse compute.

| Tool | Purpose | REST equivalent |
| --- | --- | --- |
| `runs_start` | Start a refresh run | [Start Run][] |
| `runs_retry` | Re-run a previous run | [Retry Failed Run][] |
| `runs_cancel` | Cancel an in-progress run | [Cancel Run][] |
| `runs_status` | Poll run status | [Run Status][] |

### `runs_start`

Trigger a refresh or DML run on a deployed **Environment** using the **Workspace** stored connection.

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `environmentID` | string | Yes | Target **Environment** ID |
| `jobID` | string | No | **Job** to scope the refresh to |
| `includeNodesSelector` | string | No | Selector for **Nodes** to include |
| `excludeNodesSelector` | string | No | Selector for **Nodes** to exclude |
| `parallelism` | integer | No | Number of **Nodes** to process in parallel |
| `forceIgnoreWorkspaceStatus` | boolean | No | Run even if **Workspace** status would normally block it |
| `confirmRunAllNodes` | boolean | No | Must be `true` when neither `jobID` nor `includeNodesSelector` is set |

### `runs_retry`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `runID` | integer | Yes | Numeric run ID to re-run |
| `forceIgnoreWorkspaceStatus` | boolean | No | Re-run even if **Workspace** status would normally block it |

### `runs_cancel`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `runID` | integer | Yes | Numeric run ID to cancel |
| `environmentID` | string | Yes | **Environment** ID the run belongs to |
| `runType` | string | No | Type of run to cancel |

### `runs_status`

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `runID` | integer | Yes | Numeric run ID to look up |

Terminal statuses are `completed`, `failed`, and `canceled`. Non-terminal statuses are `waitingToRun` and `running`.

## What's Next?

- [Find Coalesce IDs][]
- [Configure Transform MCP][]
- [Transform MCP Troubleshooting][]

[Connect to Transform MCP]: /docs/coalesce-ai/mcp/mcp-quickstart
[Find Coalesce IDs]: /docs/reference/whats-my-id
[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
[Get Environments]: /docs/api/coalesce/get-environments
[Get Environment]: /docs/api/coalesce/get-environment
[Create Environment]: /docs/api/coalesce/create-environment
[Update Environment]: /docs/api/coalesce/update-environment
[Delete Environment]: /docs/api/coalesce/delete-environment
[Get Projects in Org]: /docs/api/coalesce/get-projects-in-org
[Get Project in Org]: /docs/api/coalesce/get-project-in-org
[Create Project]: /docs/api/coalesce/create-project
[Update Project]: /docs/api/coalesce/update-project
[Delete Project]: /docs/api/coalesce/delete-project
[Get Runs]: /docs/api/coalesce/get-runs
[Get Run]: /docs/api/coalesce/get-run
[Get Run Results]: /docs/api/coalesce/get-run-results
[Get Nodes]: /docs/api/coalesce/get-nodes
[Get Node]: /docs/api/coalesce/get-node
[Get Workspace Nodes]: /docs/api/coalesce/get-workspace-nodes
[Get Workspace Node]: /docs/api/coalesce/get-workspace-node
[Start Run]: /docs/api/runs/startrun
[Retry Failed Run]: /docs/api/runs/retry-failed-run
[Cancel Run]: /docs/api/runs/cancelrun
[Run Status]: /docs/api/runs/run-status
