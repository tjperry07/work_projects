---
title: Integrate Cursor with Transform MCP
description: Add the hosted Transform MCP server to Cursor using HTTP transport and your Coalesce refresh token in mcp.json.
keywords: [Cursor MCP, Transform MCP, Coalesce MCP setup]
processed: true
---

Cursor can connect to the hosted Transform MCP server so Agent can list **Projects**, inspect runs, and call other tools within your Coalesce permissions.

For token and endpoint details, see [Configure Transform MCP][].

## Prerequisites

You need:

- A Coalesce refresh token from the **Deploy** tab or COA `~/.coa/config`
- Your Coalesce App host URL
- Cursor with MCP support enabled

## Configure Transform MCP in Cursor

### Step 1: Open MCP Settings

In Cursor, go to **Settings** > **Tools & MCP** > **New MCP server**.

### Step 2: Edit `mcp.json`

Create or edit `~/.cursor/mcp.json`. Add a `coalesce-transform` entry. Replace `<your-app-host>` and `<your-refresh-token>`.

```json title="Cursor MCP configuration"
{
  "mcpServers": {
    "coalesce-transform": {
      "url": "https://<your-app-host>/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer <your-refresh-token>"
      }
    }
  }
}
```

### Step 3: Restart Cursor

Restart Cursor so it loads the new MCP configuration.

### Step 4: Verify in Agent

Open Cursor Agent and ask:

> List Coalesce projects using Transform MCP.

You should see **Projects** from your organization. If the assistant answers from general knowledge instead of calling tools, name the server explicitly in your prompt.

## Project-Level Configuration

Some teams commit a project-level `.cursor/mcp.json` for shared server URLs. Do not commit refresh tokens. Use environment-specific secrets or local overrides for the `Authorization` header.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Failed to connect | Confirm the URL is `https://<your-app-host>/api/v1/mcp` with the host you sign in to. |
| 401 Unauthorized | Regenerate or re-copy the token from the **Deploy** tab. |
| Tools not used | Reference the server by name: *Search Coalesce Transform MCP for…* |

For more errors, see [Transform MCP Troubleshooting][].

## What's Next?

- [Integrate VS Code with Transform MCP][]
- [Transform MCP Available Tools][]
- [Find Coalesce IDs][]

[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
[Integrate VS Code with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-vscode
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
[Find Coalesce IDs]: /docs/reference/whats-my-id
