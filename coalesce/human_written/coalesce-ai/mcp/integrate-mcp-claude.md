---
title: Integrate Claude with Transform MCP
description: Connect Claude Desktop and Claude Code to the hosted Transform MCP server using HTTP transport and your Coalesce refresh token.
keywords: [Claude MCP, Transform MCP, Claude Desktop, Claude Code]
processed: true
---

Claude Desktop and Claude Code can connect to the hosted Transform MCP server over HTTP. After setup, Claude can list **Projects**, inspect runs, and perform other actions your Coalesce account allows.

For token and endpoint details, see [Configure Transform MCP][].

## Prerequisites

You need:

- A Coalesce refresh token from the **Deploy** tab or COA `~/.coa/config`
- Your Coalesce App host URL, the same host you sign in to
- Claude Desktop or Claude Code with MCP support

Transform MCP uses token authentication only. OAuth is not supported.

## Claude Desktop

Claude Desktop reads MCP servers from `claude_desktop_config.json`.

### Open the Configuration File

1. In Claude Desktop, go to **Settings**.
2. Select the **Developer** tab.
3. Click **Edit Config**.

File locations:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

### Add Transform MCP

Add a `coalesce-transform` entry under `mcpServers`. Replace `<your-app-host>` and `<your-refresh-token>`.

```json title="Claude Desktop configuration"
{
  "mcpServers": {
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

### Restart and Verify

1. Save the file and quit Claude Desktop completely.
2. Reopen Claude Desktop. An MCP indicator should appear when the server connects.
3. Ask: *List Coalesce projects in this organization.*

## Claude Code

Claude Code reads MCP servers from `.mcp.json` at your project root, or from user-level config when you use the CLI.

### Option 1: CLI Registration

With Claude Code open, run:

```bash
claude mcp add --transport http coalesce-transform "https://<your-app-host>/api/v1/mcp" --header "Authorization: Bearer <your-refresh-token>"
```

### Option 2: Project `.mcp.json`

Create or edit `.mcp.json` at your repository root:

```json title="Claude Code project configuration"
{
  "mcpServers": {
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

Claude Code picks up `.mcp.json` on startup. Ask a Coalesce question to confirm the connection.

:::info[Project Versus User Config]

The `claude mcp add` command may write to user-level config at `~/.claude.json` rather than the project `.mcp.json`. For team-shared setup, commit `.mcp.json` without secrets and inject the token from your environment.

:::

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Authentication error | Re-copy the token from the **Deploy** tab. Confirm the header is `Bearer <token>`. |
| Server not listed | Restart Claude after editing the config file. |
| Tools not called | Ask explicitly: *Use the coalesce-transform MCP server to list environments.* |

For more errors, see [Transform MCP Troubleshooting][].

## What's Next?

- [Integrate Cursor with Transform MCP][]
- [Transform MCP Available Tools][]
- [Find Coalesce IDs][]

[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
[Integrate Cursor with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cursor
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
[Find Coalesce IDs]: /docs/reference/whats-my-id
