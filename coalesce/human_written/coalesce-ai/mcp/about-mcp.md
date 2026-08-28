---
title: About Transform MCP
description: Connect MCP-capable AI assistants to your Coalesce account through the hosted Transform Model Context Protocol server. Operate Environments, Projects, runs, and Nodes with your existing permissions and no local install.
keywords: [Transform MCP, Model Context Protocol, Coalesce MCP, AI assistant, Environments, Projects, Nodes]
processed: true
---

The Transform Model Context Protocol, or MCP, server lets MCP-capable AI clients operate your Coalesce **Environments**, **Projects**, **Runs**, and **Nodes** through your existing Coalesce account. Point your client at your Coalesce App URL, authenticate with your API, and the Transform MCP assistant can list metadata, manage **Environments** and **Projects**, inspect runs, and trigger refreshes.

This section covers hosted setup, available tools, client integrations, and troubleshooting. For Catalog search and lineage through MCP, see [MCP Integration][].

## When to Use Transform MCP

Transform MCP is the right choice when:

- You want AI assistants to operate Coalesce **Environments**, **Projects**, runs, and **Nodes** without installing software locally.
- You do not need MCP to deploy **Workspaces** or author **Node** SQL. Those workflows stay in COA and the Coalesce App.

## What Transform MCP Is

Transform MCP is a hosted, stateless server run by Coalesce on your regional app host. It is a thin adapter over the Coalesce cloud API: it holds no project graph, cache, session store, or warehouse secrets. Every action runs as you, scoped to your organization and existing Coalesce permissions.

- **Transport** - HTTP at `POST https://<your-app-host>/api/v1/mcp`. Each tool call is one stateless request.
- **Authentication** - `Authorization: Bearer <refreshToken>`. This is the same credential as COA and the **Deploy** tab access token.
- **Tenancy** - Resolved from your token. Use the app host you sign in to, including vanity SSO subdomains.

## What Transform MCP Does Not Do

Transform MCP does not replace the Coalesce App or COA for these workflows:

- **Deploy** - Deploying a **Workspace** stays in COA or the Coalesce App.
- **Authoring** - Editing **Node** SQL, subgraphs, or **Job** definitions stays in COA or the Coalesce App.
- **Warehouse credentials** - Refreshes use the **Workspace** stored connection. You do not pass Snowflake or other warehouse secrets through MCP.

For pipeline authoring with AI inside the Coalesce App, see [Coalesce Copilot][].

## Get Started

Use this table to pick the right starting page for your goal.

| Goal | Start here |
| --- | --- |
| Connect an AI assistant to a Coalesce account | [Connect to Transform MCP][] |
| Configure the endpoint URL, token, and regional hosts in detail | [Configure Transform MCP][] |
| See every tool name, input, and REST equivalent | [Transform MCP Available Tools][] |
| Find **Environment**, **Project**, run, and **Node** IDs | [Find Coalesce IDs][] |
| Set up Claude Desktop or Claude Code | [Integrate Claude with Transform MCP][] |
| Set up Cursor | [Integrate Cursor with Transform MCP][] |
| Set up VS Code | [Integrate VS Code with Transform MCP][] |
| Set up Snowflake Cortex Code | [Integrate Snowflake Cortex Code with Transform MCP][] |

## Capabilities

Transform MCP exposes 21 tools across five areas:

| Area | Tools | What you can do |
| --- | --- | --- |
| Environments | `environments_list`, `environments_get`, `environments_create`, `environments_update`, `environments_delete` | List, inspect, create, update, and delete deployment **Environments** |
| Projects | `projects_list`, `projects_get`, `projects_create`, `projects_update`, `projects_delete` | List, inspect, create, update, and delete **Projects** |
| Runs, read-only | `runs_list`, `runs_get`, `runs_results` | Inspect run history and per-run results |
| Nodes, read-only | `nodes_list_environment`, `nodes_get_environment`, `nodes_list_workspace`, `nodes_get_workspace` | Inspect deployed and in-progress **Nodes** |
| Run actions | `runs_start`, `runs_retry`, `runs_cancel`, `runs_status` | Start, retry, cancel, and poll refresh runs |

Read and CRUD tools apply immediately. Run action tools trigger real warehouse work on the target **Environment**.

For the full tool reference with parameters, see [Transform MCP Available Tools][].

## Authentication

Transform MCP accepts your Coalesce **refresh token** in the `Authorization: Bearer` header. This is the same credential COA stores after `coa login` and the token shown on the **Deploy** tab.

1. Open the **Deploy** tab in the Coalesce App and copy your access token, or read the `token=` value from your active COA profile in `~/.coa/config`.
2. Configure your MCP client with `Authorization: Bearer <your-token>`.
3. Set the server URL to `https://<your-app-host>/api/v1/mcp`, where `<your-app-host>` is the host you use to sign in.

See [Getting Your Token][] and [Configure Transform MCP][] for regional hosts and SSO vanity subdomains.

## MCP Client Integrations

Step-by-step configuration for common clients:

- [Integrate Claude with Transform MCP][]
- [Integrate Cursor with Transform MCP][]
- [Integrate VS Code with Transform MCP][]
- [Integrate Snowflake Cortex Code with Transform MCP][]

## Data Handling

Transform MCP does not store production data or run results. It reads metadata and triggers actions against the Coalesce API in real time when a tool is called. Your organization's data retention policies govern how long runs and artifacts remain available in Coalesce.

## What's Next?

- [Connect to Transform MCP][]
- [Transform MCP Available Tools][]
- [Transform MCP Troubleshooting][]

[MCP Integration]: /docs/catalog/developer/mcp-integration
[Coalesce Copilot]: /docs/coalesce-ai/copilot/
[Connect to Transform MCP]: /docs/coalesce-ai/mcp/mcp-quickstart
[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
[Getting Your Token]: /docs/api/authentication
[Find Coalesce IDs]: /docs/reference/whats-my-id
[Integrate Claude with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-claude
[Integrate Cursor with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cursor
[Integrate VS Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-vscode
[Integrate Snowflake Cortex Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cortex
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
