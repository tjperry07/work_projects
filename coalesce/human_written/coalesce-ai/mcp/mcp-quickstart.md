---
title: Connect to Transform MCP
description: Quickstart for the hosted Transform MCP server. Get your Coalesce refresh token, add the HTTP MCP endpoint to your client, and verify with a Projects list call.
keywords: [Transform MCP, MCP quickstart, Coalesce MCP setup, refresh token]
processed: true
---

Connect your MCP-capable AI client to Transform MCP over HTTP. No local install is required. You configure your client with your Coalesce App URL and refresh token instead of running a sidecar process.

For endpoint details, permissions, and regional hosts, see [Configure Transform MCP][].

## Before You Begin

You need:

1. A Coalesce account with permission to access the **Environments**, **Projects**, and runs you want the assistant to use.
2. Your Coalesce **refresh token**, the same credential COA uses.
3. An MCP client that supports HTTP transport with custom headers, such as Claude Desktop, Claude Code, Cursor, or VS Code.

## Step 1: Get Your Token

Your refresh token is the access token COA and the REST API use.

From the Coalesce App:

1. Sign in to the Coalesce App at your usual URL, for example `https://app.coalescesoftware.io` or your custom domain.
2. Open the **Deploy** tab.
3. Click **Generate Access Token**.

Tenancy is resolved from the token, so the subdomain in the URL does not matter. See [Getting Your Token][] for token lifecycle notes and regional base URLs.

## Step 2: Build Your MCP URL

Form the MCP endpoint from the host you sign in to:

```text
https://<your-app-host>/api/v1/mcp
```

Examples:

- US primary: `https://app.coalescesoftware.io/api/v1/mcp`
- Custom subdomain: `https://mycompany.app.eu.coalescesoftware.io/api/v1/mcp`

## Step 3: Add the Server to Your Client

Add the Transform MCP server to your MCP client with HTTP transport and an `Authorization: Bearer <your-refresh-token>` header. Replace `<your-app-host>` with the host you sign in to.

For step-by-step configuration by client, see:

- [Integrate Claude with Transform MCP][]
- [Integrate Cursor with Transform MCP][]
- [Integrate VS Code with Transform MCP][]
- [Integrate Snowflake Cortex Code with Transform MCP][]

To register from Claude Code CLI:

```bash
claude mcp add --transport http coalesce-transform "https://<your-app-host>/api/v1/mcp" --header "Authorization: Bearer <your-refresh-token>"
```

## Step 4: Verify the Connection

Ask your assistant to list your Coalesce **Projects**, for example:

> List Coalesce projects in this organization.

A successful response returns the **Projects** in your organization. If you see an authentication error, re-copy the token from the **Deploy** tab and confirm the URL uses the same app host you sign in to.

## What's Next?

- [Configure Transform MCP][]
- [Transform MCP Available Tools][]
- [Find Coalesce IDs][]
- [Transform MCP Troubleshooting][]

[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Getting Your Token]: /docs/api/authentication
[Integrate Claude with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-claude
[Integrate Cursor with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cursor
[Integrate VS Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-vscode
[Integrate Snowflake Cortex Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cortex
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
[Find Coalesce IDs]: /docs/reference/whats-my-id
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
