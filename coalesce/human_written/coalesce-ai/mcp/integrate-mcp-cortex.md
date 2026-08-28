---
title: Integrate Snowflake Cortex Code with Transform MCP
description: Connect Snowflake Cortex Code to the hosted Transform MCP server over HTTP so the agent can list Projects, inspect runs, and call Coalesce tools from your terminal.
keywords: [Snowflake Cortex Code, CoCo, Transform MCP, Cortex MCP, Coalesce MCP setup]
processed: true
---

Snowflake [Cortex Code][], also called CoCo, is Snowflake's AI coding CLI. It acts as an MCP client, so you can connect it to the hosted Transform MCP server and work with Coalesce **Projects**, **Environments**, runs, and **Nodes** from the same terminal session that already knows your Snowflake role and warehouse.

For token and endpoint details, see [Configure Transform MCP][]. To build Snowflake Cortex machine learning functions into Coalesce pipelines, see the [Cortex][] Package.

## Prerequisites

You need:

- A Coalesce refresh token from the **Deploy** tab or COA `~/.coa/config`
- Your Coalesce App host URL, the same host you sign in to
- A Snowflake user with the `SNOWFLAKE.CORTEX_USER` database role
- Network access to your Snowflake account
- The Cortex Code CLI on macOS, Linux, WSL, or Windows

## Step 1: Install Cortex Code

Install the Cortex Code CLI if you have not already.

### macOS, Linux, or WSL

```bash
curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh
```

### Windows PowerShell

```powershell
irm https://ai.snowflake.com/static/cc-scripts/install.ps1 | iex
```

If the shell cannot find `cortex` after install, add `~/.snowflake/bin` to your `PATH`, or call the binary with its absolute path.

## Step 2: Configure Your Snowflake Connection

Start Cortex Code so it can walk you through an existing connection in `~/.snowflake/connections.toml` or create a new one:

```bash
cortex
```

Confirm Snowflake authentication outside MCP before you add Transform MCP:

```bash
cortex sql "select current_role()"
```

## Step 3: Get Your Coalesce Token

Your refresh token is the same credential COA and the REST API use.

1. Sign in to the Coalesce App.
2. Open the **Deploy** tab.
3. Click **Generate Access Token**, or copy an existing access token.

You can also read the `token=` value from your active COA profile in `~/.coa/config`. Treat the token as a secret.

## Step 4: Register Transform MCP

Cortex Code supports HTTP MCP servers. Point it at your hosted Transform MCP endpoint with a bearer token.

### Option A: CLI Registration

If a Cortex Code session is open, exit it first, then run the command from your shell. Replace `<your-app-host>` and `<your-refresh-token>`:

```bash
cortex mcp add coalesce-transform "https://<your-app-host>/api/v1/mcp" --type http -H "Authorization: Bearer <your-refresh-token>"
```

Examples of `<your-app-host>`:

- US primary: `app.coalescesoftware.io`
- Custom subdomain: `mycompany.app.eu.coalescesoftware.io`

### Option B: Edit `mcp.json`

Create or edit `~/.snowflake/cortex/mcp.json`:

```json title="Cortex Code MCP configuration"
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

:::tip[Keep Tokens Out of Plain Text]

Cortex Code can migrate sensitive `headers` values into the OS keychain on first connection. Prefer environment variable expansion such as `${COALESCE_ACCESS_TOKEN}` in `mcp.json` when your shell exports the token, instead of committing secrets to disk.

:::

Confirm registration:

```bash
cortex mcp list
```

Then start or reconnect servers:

```bash
cortex mcp start
```

## Step 5: Verify in a Cortex Code Session

Start a session:

```bash
cortex
```

Inside the session, you can open `/mcp` to see connection state and tool counts. Ask:

> Use coalesce-transform MCP to list Coalesce Projects in this organization.

A successful response returns **Projects** from your organization. Because Cortex Code already has warehouse context, it can route data questions such as row counts to Snowflake and Coalesce metadata or run questions to Transform MCP.

### Example Prompts

These prompts work well after the server connects:

- List Coalesce Environments in this organization.
- Show the latest failed run for Environment `<environment-id>`.
- List Nodes in Workspace `<workspace-id>` that are missing descriptions.
- Start a refresh for job `<job-id>` in Environment `<environment-id>`.

Run action tools trigger real warehouse work. Scope runs with a job ID or Node selector, or confirm a full-environment refresh. See [Configure Transform MCP][].

## Troubleshooting

Use this table to diagnose common Cortex Code and Transform MCP connection issues.

| Symptom | What to check |
| --- | --- |
| `cortex` not found | Add `~/.snowflake/bin` to your `PATH`, or re-run the installer. |
| MCP server missing | Run `cortex mcp list`, then `cortex mcp start`. Restart the Cortex Code session. |
| 401 Unauthorized | Re-copy the token from the **Deploy** tab. Confirm the header is `Bearer <token>`. |
| Wrong host | Use the same app host you sign in to, including single sign-on vanity subdomains. |
| Snowflake authentication fails | Fix the connection with `cortex sql "select current_role()"` before debugging MCP. |
| Tools not called | Ask explicitly to use the coalesce-transform MCP server to list Environments. Check `/mcp` for a connected status. |

For more errors, see [Transform MCP Troubleshooting][] and Snowflake's [CoCo CLI MCP support][] docs.

## What's Next?

- [Integrate Claude with Transform MCP][]
- [Integrate Cursor with Transform MCP][]
- [Transform MCP Available Tools][]
- [Cortex][] Package for Snowflake Cortex machine learning Nodes in Coalesce

[Cortex Code]: https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code-cli
[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Cortex]: /docs/marketplace/package/coalesce_snowflake_cortex
[Transform MCP Troubleshooting]: /docs/coalesce-ai/mcp/mcp-troubleshooting
[CoCo CLI MCP support]: https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code-mcp
[Integrate Claude with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-claude
[Integrate Cursor with Transform MCP]: /docs/coalesce-ai/mcp/integrate-mcp-cursor
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
