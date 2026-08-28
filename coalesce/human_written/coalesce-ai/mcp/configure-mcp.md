---
title: Configure Transform MCP
description: Configure your MCP client for Transform MCP with your Coalesce App URL, refresh token authentication, regional hosts, and permission model.
keywords: [Transform MCP configuration, Coalesce refresh token, MCP authentication, MCP endpoint]
processed: true
---

Transform MCP runs on your Coalesce regional app host. You connect over HTTP with a bearer refresh token. No local MCP package install is required.

For a minimal first connection, see [Connect to Transform MCP][].

## Endpoint URL

Transform MCP accepts stateless HTTP `POST` requests at a single path on your app host.

| Component | Value |
| --- | --- |
| Method | `POST`, HTTP, stateless |
| Path | `/api/v1/mcp` |
| Full URL | `https://<your-app-host>/api/v1/mcp` |

Use `<your-app-host>` from the host you sign in to. This matches how COA and the REST API target your deployment.

### Regional and SSO Hosts

Coalesce offers multiple regional app hosts. Use the base URL that matches your deployment. See the **Base URLs** table in [Getting Your Token][].

If you use SSO, prefix the regional host with your company subdomain. For example, for Europe primary:

```text
https://mycompany.app.eu.coalescesoftware.io/api/v1/mcp
```

Cross-region isolation is enforced at authentication: a token minted in one region cannot be used against another region's app host.

## Authentication

Transform MCP uses **token-based authentication only**. OAuth is not supported for this server.

### Required Header

| Header | Required | Description |
| --- | --- | --- |
| `Authorization` | Required | `Bearer <refreshToken>`: your Coalesce refresh token |

No environment ID or user ID header is required. Your organization and permissions are resolved server-side from the verified token.

### Obtain a Refresh Token

1. Sign in to the Coalesce App.
2. Open the **Deploy** tab and copy your access token, or generate a new one.
3. Alternatively, read the `token=` value from your active COA profile in `~/.coa/config`.

Treat the token as a secret. Do not commit it to version control or store it in a Coalesce **Environment** variable.

### Token Lifecycle

Access tokens follow the same lifecycle as REST API tokens documented in [Getting Your Token][]. Tokens remain valid until your account is deleted, disabled, or you change your password or email, or similar account events occur.

## Permission Model

Transform MCP does not add a separate permission layer. The server can only perform actions your Coalesce account can perform.

- Read tools return resources your account can access.
- `environments_create`, `projects_update`, and similar CRUD tools require the same rights you would need in the Coalesce App or REST API.
- `runs_start`, `runs_retry`, and `runs_cancel` trigger real warehouse work and require run permissions on the target **Environment**.

## Reads and Writes

Tool calls fall into three behavior groups depending on whether they read metadata or trigger warehouse work.

| Tool type | Behavior |
| --- | --- |
| List and get tools | Read metadata immediately; no warehouse compute |
| Environment and Project CRUD | Apply changes through the Coalesce API |
| Run action tools | Trigger refresh or DML runs using the **Workspace** stored connection |

## Full-Environment Refresh Guardrail

`runs_start` refreshes every **Node** in an **Environment** when you omit both `jobID` and `includeNodesSelector`. The tool requires an explicit confirmation:

- Pass `jobID` or `includeNodesSelector` to scope the run, **or**
- Set `confirmRunAllNodes: true` to confirm an intentional full-environment refresh.

`excludeNodesSelector` alone does not scope the run. Excluding nodes from an otherwise full refresh still requires `confirmRunAllNodes: true`.

## Test Your Configuration

After configuring your client, ask a read-only question such as:

> List environments in this Coalesce organization.

Then try a scoped run only if you intend to trigger warehouse work:

> Start a refresh for job `<job-id>` in environment `<environment-id>`.

## Related Docs

These pages cover setup, tool reference, and client-specific configuration.

- [Connect to Transform MCP][]
- [Transform MCP Available Tools][]
- [Find Coalesce IDs][]
- [Integrate Claude with Transform MCP][]
- [Integrate Cursor with Transform MCP][]
- [Integrate VS Code with Transform MCP][]
- [Integrate Snowflake Cortex Code with Transform MCP][]

## What's Next?

- [Transform MCP Available Tools][]
- [Find Coalesce IDs][]
- [Transform MCP Troubleshooting][]

[Connect to Transform MCP]: /docs/coalesce-ai/mcp/mcp-quickstart
[Getting Your Token]: /docs/api/authentication
[Integrate VS Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-vscode
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
[Find Coalesce IDs]: /docs/reference/whats-my-id
[Integrate Claude with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-claude
[Integrate Cursor with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cursor
[Integrate Snowflake Cortex Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cortex
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
