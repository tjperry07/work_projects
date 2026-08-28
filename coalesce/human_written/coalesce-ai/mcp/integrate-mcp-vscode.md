---
title: Integrate VS Code with Transform MCP
description: Connect VS Code to the hosted Transform MCP server using the servers key in mcp.json and your Coalesce refresh token.
keywords: [VS Code MCP, Transform MCP, GitHub Copilot MCP]
processed: true
---

Visual Studio Code supports MCP servers through workspace or user `mcp.json` configuration. After setup, your AI assistant in VS Code can call Transform MCP tools against your Coalesce account.

For token and endpoint details, see [Configure Transform MCP][].

## Prerequisites

You need:

- A Coalesce refresh token from the **Deploy** tab or COA `~/.coa/config`
- Your Coalesce App host URL
- VS Code with MCP support through an MCP-compatible extension

## Configure Transform MCP

### Step 1: Open MCP Configuration

1. Open the Command Palette with **Cmd+Shift+P** on macOS or **Ctrl+Shift+P** on Windows.
2. Run **MCP: Open Workspace Folder MCP Configuration**. If your extension offers a user-level command instead, use that equivalent.

### Step 2: Add the Server

VS Code uses the `servers` key, not `mcpServers`. Replace `<your-app-host>` and `<your-refresh-token>`.

```json title="VS Code MCP configuration"
{
  "servers": {
    "coalesce-transform": {
      "type": "http",
      "url": "https://<your-app-host>/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer <your-refresh-token>"
      }
    }
  }
}
```

### Step 3: Reload and Verify

Reload the VS Code window if prompted. Ask your assistant:

> List Coalesce environments in this organization.

## Configuration Notes

- Use `https://<your-app-host>/api/v1/mcp` as the full URL.
- The `Authorization` header must be `Bearer <your-refresh-token>`.
- No additional Coalesce headers are required.

Exact MCP UI and command names depend on your VS Code MCP extension. Refer to your extension documentation if the palette command differs.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Server not found | Confirm you used `servers`, not `mcpServers`. |
| Authentication failed | Re-copy the token from the **Deploy** tab. |
| Wrong host | Use the same app host you sign in to, including SSO vanity subdomains. |

For more errors, see [Transform MCP Troubleshooting][].

## What's Next?

- [Integrate Claude with Transform MCP][]
- [Integrate Cursor with Transform MCP][]
- [Transform MCP Available Tools][]

[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
[Integrate Claude with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-claude
[Integrate Cursor with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cursor
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
