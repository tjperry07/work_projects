---
title: Transform MCP Troubleshooting
description: Resolve authentication, connection, permission, and run guardrail errors when using the hosted Transform MCP server with AI clients.
keywords: [Transform MCP troubleshooting, MCP 401, confirmRunAllNodes]
processed: true
---

This page covers common issues when connecting AI clients to the hosted Transform MCP server. For setup steps, see [Connect to Transform MCP][] and [Configure Transform MCP][].

## Authentication Errors

### 401 Unauthorized

The server returns `401` when the `Authorization` header is missing, malformed, or the refresh token is invalid for the regional app host.

Check the following:

1. The header format is `Authorization: Bearer <your-refresh-token>`.
2. The token is current. Re-copy it from the **Deploy** tab or your COA `~/.coa/config` profile.
3. The MCP URL uses the app host for your region. A token from one region cannot authenticate against another region's host.
4. You restarted the MCP client after updating the config file.

See [Getting Your Token][] for token lifecycle events that invalidate existing tokens.

### Token Works for REST but Not MCP

Confirm the MCP URL path is `/api/v1/mcp`, not a REST API path such as `/api/v1/environments`. The token is the same, but the endpoint differs.

## Connection Errors

### Failed to Connect to MCP Server

| Cause | Fix |
| --- | --- |
| Wrong URL | Use `https://<your-app-host>/api/v1/mcp` |
| Network block | Allow HTTPS to your Coalesce app host from your machine |
| Client does not support HTTP MCP | Use a client with HTTP MCP support |

### Wrong Organization or Empty Results

Tenancy is resolved from your token, not the hostname subdomain alone. If results look empty:

1. Confirm you are signed in to the expected Coalesce organization in the Coalesce App.
2. Verify you have access to the **Projects** and **Environments** you are querying.
3. Call `projects_list` or `environments_list` explicitly to inspect raw responses.

## Permission Errors

Transform MCP does not grant permissions beyond your Coalesce account.

| Symptom | Likely cause |
| --- | --- |
| Create or delete denied | Your role lacks **Environment** or **Project** admin rights |
| Run start fails | You lack run permission on the target **Environment** |
| Resource not found | The ID is wrong or belongs to a **Project** you cannot access |

Use the Coalesce App or REST API with the same token to confirm whether the action succeeds outside MCP.

## Run Action Errors

### Refusing to Refresh All Nodes

`runs_start` returns an error when you omit both `jobID` and `includeNodesSelector` without confirming a full-environment refresh:

```text
Refusing to refresh all nodes: pass a jobID or includeNodesSelector to scope the run,
or set confirmRunAllNodes: true to refresh the entire environment.
```

Fix options:

- Pass `jobID` to run a specific **Job**.
- Pass `includeNodesSelector` to scope to selected **Nodes**.
- Set `confirmRunAllNodes: true` only when you intend to refresh every **Node** in the **Environment**.

See [Configure Transform MCP][] for the full guardrail description.

### Wrong Run ID Format

Run tools require a numeric `runID`, the scheduler `runCounter` value, not the UUID from a run URL.

```text
# Correct
runID: 42

# Wrong
runID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

See [Find Coalesce IDs][].

### Run Status Values

`runs_status` returns:

- **Terminal** - `completed`, `failed`, `canceled`
- **Non-terminal** - `waitingToRun`, `running`

Poll `runs_status` until the run reaches a terminal status.

## AI Client Not Calling Tools

If the assistant answers from general knowledge instead of calling MCP tools:

- Name the server in your prompt: *Use coalesce-transform MCP to list environments.*
- Ask for specific resource types: **Projects**, **Environments**, runs, or **Nodes**.
- Confirm the MCP server shows as connected in your client UI.
- Restart the client after config changes.

## Client-Specific Notes

### Claude Desktop

- Config file: `claude_desktop_config.json` under **Settings** > **Developer** > **Edit Config**
- **macOS logs:** `~/Library/Logs/Claude`

### Claude Code

- Project config: `.mcp.json` at the repository root
- CLI alternative: `claude mcp add --transport http …`

### Cursor

- Config file: `~/.cursor/mcp.json`
- Restart Cursor after edits

### VS Code

- Uses `servers` in `mcp.json`, not `mcpServers`
- Reload the window after configuration changes

### Snowflake Cortex Code

- Config file: `~/.snowflake/cortex/mcp.json`
- CLI alternative: `cortex mcp add ... --type http -H "Authorization: Bearer ..."`
- Check status in-session with `/mcp`, or run `cortex mcp list` and `cortex mcp start`

## Still Stuck?

1. Verify setup with [Connect to Transform MCP][].
2. Review [Transform MCP Available Tools][] for required inputs.
3. Contact [Coalesce Support][] if the same token and IDs work in the REST API but fail consistently through MCP.

## What's Next?

- [Connect to Transform MCP][]
- [Transform MCP Available Tools][]
- [Find Coalesce IDs][]

[Connect to Transform MCP]: /docs/coalesce-ai/mcp/mcp-quickstart
[Configure Transform MCP]: /docs/coalesce-ai/mcp/configure-mcp
[Getting Your Token]: /docs/api/authentication
[Find Coalesce IDs]: /docs/reference/whats-my-id
[Transform MCP Available Tools]: /docs/coalesce-ai/mcp/mcp-available-tools
[Coalesce Support]: /docs/get-started/support-information
