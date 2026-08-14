# Cursor configuration

## MCP servers

`mcp.json` is gitignored because it may contain auth identifiers (e.g., Slack `CLIENT_ID`). To set up MCP:

1. Copy `mcp.json.example` to `mcp.json`.
2. Configure each server as needed (see below).

### Pylon MCP Server

The Pylon MCP Server exposes Pylon data to AI tools that support the Model Context Protocol (e.g. Claude, ChatGPT, Cursor). AI tools authenticate with your Pylon account via OAuth and can read and update issues, accounts, and contacts within the data you can see in Pylon.

- **Server URL:** `https://mcp.usepylon.com`
- **Auth:** OAuth 2.0 (AuthKit). Actions are performed on behalf of the authenticated user; access is scoped to the same data as in the Pylon dashboard.
- **Transport:** Streamable HTTP (stateless; no server-side sessions).

**Setup in Pylon:** Configure and enable the MCP Server from the Pylon dashboard: Settings → AI Controls → MCP Server. Use the MCP URL above in your AI tool. For more detailed instructions see [Connecting to the Pylon MCP Server](https://support.usepylon.com/articles/2407390554-connecting-to-the-pylon-mcp-server?lang=en). All tools are scoped to the authenticated user's organization. Rate limits apply per tool.

**Use case examples:**

- **Debug an issue end to end:** Solve an issue with Claude Code with a prompt like "debug this \<pylon link>" and put up a PR for a bug fix
- **Write a product spec notion doc:** Feed it a bunch of issues and use a Claude Code skill to generate a product spec doc based on evidence
- **Ad hoc analysis:** Ask a question about a customer in ChatGPT and leverage data from Pylon in addition to other tools like Notion or Linear

### Slack

Get your `CLIENT_ID` from [Slack's Connect to Cursor](https://docs.slack.dev/ai/slack-mcp-server/connect-to-cursor/) flow and replace the placeholder in `mcp.json`.

### Gong MCP Server

The Gong MCP Server exposes Gong call data to AI tools. It runs from `.cursor/mcp-servers/gong/` (not in public docs).

**Prerequisites:** Gong API credentials. Add to `.env` in the project root:

```dotenv
GONG_ACCESS_KEY=your_access_key
GONG_SECRET_KEY=your_access_key_secret
GONG_BASE_URL=https://us-22846.api.gong.io
```

The MCP server loads that **project-root `.env` automatically** (it resolves upward from `dist/index.js`, same idea as the GitLab MCP), so it still works when Cursor’s working directory is not the repo. Optional: set **`GONG_ENV_PATH`** to an absolute path if you keep secrets elsewhere.

**Setup:**

1. Build: `cd .cursor/mcp-servers/gong && npm install && npm run build`
2. Add to `mcp.json`:

   ```json
   "gong": {
     "command": "node",
     "args": ["<absolute-path-to-repo>/.cursor/mcp-servers/gong/dist/index.js"]
   }
   ```

   Replace `<absolute-path-to-repo>` with the full path to coalesce-docs (e.g. `/Users/you/Documents/coalesce-docs`).

**Tools:** `gong_list_calls`, `gong_get_transcript`, `gong_get_call_details`

If Cursor shows **“Gong MCP server error”** on connect: usually **missing keys** (server exits before stdio handshake) or a bad **`GONG_BASE_URL`** for your Gong stack. After changing `.env`, restart the Gong MCP server.

**Light keyword search (Gong + Pylon):** Prefer `/docs-agent-keyword-search` or:

```bash
node .cursor/scripts/keyword-search-gong-pylon.mjs <keywords...> --days 90 --top 15
```

Uses Pylon API `search_text` (issue bodies) and bounded Gong transcript scoring. Ranked snippets first; deep-dive only top hits. Needs `PYLON_API_TOKEN` (or `PYLON_API`) plus Gong keys in `.env`. Full multi-source research remains `/docs-agent-research`.

### GitHub MCP (official server + `.env`)

The hosted Copilot URL (`https://api.githubcopilot.com/mcp/`) is convenient, but **`Authorization: Bearer ${env:GITHUB_TOKEN}` in `mcp.json` is unreliable in Cursor** (the header is often sent literally or with an empty value because workspace `.env` is not applied to that interpolation).

This repo uses **`envmcp`** plus GitHub’s **official Docker image** so `GITHUB_TOKEN` in the **project-root `.env`** is loaded and substituted into `docker run -e GITHUB_PERSONAL_ACCESS_TOKEN=…` (see `mcp.json` `github` entry). Requires **Docker Desktop** running and `npx` on PATH (the checked-in config uses an absolute Node/npx path for GUI-launched Cursor).

`list_issues`, `list_pull_requests`, and reads against **`Coalesce-Software-Inc/coalesce`** need a token that **actually has access** to that private repository.

- **401 / bad credentials:** PAT expired, revoked, or wrong value — create a new PAT and update `.env` `GITHUB_TOKEN` (or confirm `envmcp -e` points at the file that defines it).
- **403 / Resource not accessible by integration** (or tools consistently failing): the PAT’s account is not a collaborator on the repo, or a **fine-grained PAT** is not granted that repository (enable the repo under “Repository access” and grant **Issues** and **Metadata** at minimum for issue lists; add **Contents** if you use file APIs).
- **Classic PAT:** private repo access typically needs the **`repo`** scope.

Hosted GitHub MCP (`https://api.githubcopilot.com/mcp/`) still uses **your** Bearer token; Copilot subscription alone does not substitute for org/repo permissions on the monorepo.

### Postman MCP (remote)

Uses Postman’s **remote HTTP MCP server** (not the local `npx` stdio server).

Add to **`.cursor/mcp.json`**:

```json
"postman": {
  "url": "https://mcp.postman.com/code"
}
```

**Modes** — change the URL:

| Mode | URL |
|------|-----|
| Code (default) | `https://mcp.postman.com/code` |
| Full | `https://mcp.postman.com/mcp` |
| Minimal | `https://mcp.postman.com/minimal` |

**Auth (pick one):**

1. **OAuth (recommended for remote)** — leave the block as above with **no `headers`**. In **Settings → MCP → postman**, click **Login** and complete Postman OAuth. Disable the separate **Postman marketplace plugin** so only this project `postman` entry is active.

2. **API key** — if OAuth does not reach agent tool calls, add a header (this file is gitignored):

   ```json
   "postman": {
     "url": "https://mcp.postman.com/code",
     "headers": {
       "Authorization": "Bearer PMAK-your-key-here"
     }
   }
   ```

   Cursor does **not** reliably read `POSTMAN_API_KEY` from project `.env` for remote HTTP headers (same limitation as GitHub MCP). Paste the key in `headers` or use OAuth.

After changes, **reload Cursor** and run `/postman:setup`.

### Browser MCP (guide pipeline commands)

Slash commands **`/docs-agent-pipeline-builder`**, **`/docs-agent-pipeline-verify`**, **`/docs-agent-guide-author`**, and **`/docs-agent-guide-verify`** use **Playwright MCP** for Transform, Catalog, and Quality UI steps. The **builder** mutates pipelines; **pipeline-verify**, **guide-author**, and **guide-verify** use **read-only** inspection except builder phase.

**If you see “Browser MCP not available”:** configure **Playwright** first — full steps in [`.cursor/reference/browser-mcp-setup.md`](reference/browser-mcp-setup.md). The built-in **`cursor-ide-browser`** server is a fallback only (often missing from Agent sessions).

**Minimum setup (Playwright):**

1. Copy [`.cursor/mcp.json.example`](mcp.json.example) → **`.cursor/mcp.json`** and keep the **`playwright`** entry (`npx -y @playwright/mcp@latest`).
2. Restart Cursor; confirm **playwright** shows tools under **Settings → MCP**.
3. Optional: copy [`.cursor/permissions.json.example`](permissions.json.example) → **`~/.cursor/permissions.json`** (`playwright:*` and/or `cursor-ide-browser:*` in `mcpAllowlist`).
4. Run guide commands in **Agent** mode; type **`@browser`** once in the chat if built-in browser tools still do not attach.

Read browser tool schemas from the MCP filesystem (`mcps/playwright/tools/` or `mcps/cursor-ide-browser/tools/`). Workflow: [`.cursor/reference/cursor-ide-browser-tools/INSTRUCTIONS.md`](reference/cursor-ide-browser-tools/INSTRUCTIONS.md). Do not invent UI click paths when browser tools are blocked—fix setup or pass **`no ui author`** / **`no ui verify`**.

## Documentation slash commands

Markdown definitions for Cursor slash commands live in [`.cursor/commands/`](commands/). Highlights for **long-form guides** (build-first pipeline):

- **`/docs-agent-guide-loop`** — **Recommended full pipeline:** build (`docs-agent-pipeline-builder`) → pipeline verify loop → guide author (read-only UI + write) → guide verify loop → **`docs-agent-check-all`** after guide verify **PASS**. Requires **Workspace URL** and **Project name**. See [`.cursor/commands/docs-agent-guide-loop.md`](commands/docs-agent-guide-loop.md) and [`.cursor/reference/pipeline-build-handoff.md`](reference/pipeline-build-handoff.md).
- **`/docs-agent-pipeline-builder`** — Review ticket, verify URLs, build pipeline in Coalesce/Catalog until Create and Run succeed; emit **`## Pipeline build handoff`** (no guide files). See [`.cursor/commands/docs-agent-pipeline-builder.md`](commands/docs-agent-pipeline-builder.md).
- **`/docs-agent-pipeline-verify`** — Read-only audit: live pipeline vs ticket and handoff; builder revision handoff on FAIL. See [`.cursor/commands/docs-agent-pipeline-verify.md`](commands/docs-agent-pipeline-verify.md).
- **`/docs-agent-guide-author`** — Write `docs/guides/` from **Pipeline build handoff**; **read-only** Playwright walk and screenshots; does not build pipelines or run verify. See [`.cursor/commands/docs-agent-guide-author.md`](commands/docs-agent-guide-author.md).
- **`/docs-agent-guide-verify`** — Guide vs handoff and live UI (tiers: docs, **pipeline fidelity**, read-only walkthrough, code, editorial). See [`.cursor/commands/docs-agent-guide-verify.md`](commands/docs-agent-guide-verify.md).
- **`/docs-agent-topic-documentation-command`** — Handles explicit bot-invoked actions in `#topic-documentation`: `@cursor` or `@Cursor` plus `docs help`, `research <question>`, `write <topic>`, or `approve-write <thread or request id>` (legacy syntax also supported). The `research` path runs in strict multi-source mode and requires Pylon, Gong, Slack, Notion, Linear, GitHub, and GitLab connectivity, and it stays aligned with the full `docs-agent-research` workflow.
- **`/docs-agent-topic-documentation-monitor`** — Processes new questions from Slack channel `#topic-documentation`: if docs already answer, it posts links; otherwise it runs research -> write -> check, writes directly to `docs/`, then commits and opens a PR.
