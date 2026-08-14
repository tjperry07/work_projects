# Browser automation for guide author / verify

Guide slash commands need live UI for Transform, Catalog, and Quality. The built-in **`cursor-ide-browser`** server is often **not registered** in Agent sessions (Cursor regression). Use **Playwright MCP** from project config instead.

## Important: project `mcp.json` is gitignored

**`.cursor/mcp.json` is not in git** (see `.gitignore`). Agents that only read the repo may report “no project mcp.json” even when the file exists on disk. You must have a **local** `.cursor/mcp.json` and **reload Cursor** after editing it.

This repo already lists **`@playwright/mcp`** in root `package.json`. Run **`npm install`** once so `node_modules/@playwright/mcp/cli.js` exists.

## Recommended: local Playwright MCP (no `npx`)

Avoid `npx @playwright/mcp@latest` if your machine hits **npm EPERM** on `~/.npm` (Playwright never starts and **playwright** won’t appear under Settings → MCP).

Use the **checked-in dependency** and a direct `node` path in **`.cursor/mcp.json`**:

```json
"playwright": {
  "command": "/Users/tatiana/.nvm/versions/node/v20.11.0/bin/node",
  "args": [
    "/Users/tatiana/Documents/coalesce-docs/node_modules/@playwright/mcp/cli.js"
  ],
  "env": {
    "PATH": "/Users/tatiana/.nvm/versions/node/v20.11.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
  }
}
```

(Replace the `node` path with `which node` on your machine. [`.cursor/mcp.json.example`](../mcp.json.example) uses `${workspaceFolder}/node_modules/@playwright/mcp/cli.js` for the args path.)

**Steps:**

1. `npm install` in the repo root (installs `@playwright/mcp`).
2. Merge the **`playwright`** block into **`.cursor/mcp.json`** (copy from example or the block above).
3. **Developer: Reload Window** (or quit and reopen Cursor).
4. **Settings → MCP** — confirm **playwright** is listed with **tools > 0** (not “0 tools” or error).
5. Optional: **`~/.cursor/permissions.json`** with `"playwright:*"` (see [`.cursor/permissions.json.example`](../permissions.json.example)).

## How agents call Playwright

`CallMcpTool` server name (try in order):

1. **`playwright`**
2. **`project-0-coalesce-docs-playwright`** (Cursor sometimes prefixes project MCP servers)

Tool names: `browser_navigate`, `browser_snapshot`, `browser_tabs`, etc. Read each tool schema from the MCP filesystem (`mcps/playwright/tools/` or `mcps/cursor-ide-browser/tools/`) before calling `CallMcpTool`. Workflow: [`.cursor/reference/cursor-ide-browser-tools/INSTRUCTIONS.md`](cursor-ide-browser-tools/INSTRUCTIONS.md).

## Built-in browser (optional)

1. **Settings → Tools & MCP → Browser Automation** — enabled.
2. In **Agent** chat, type **`@browser`** once ([workaround](https://forum.cursor.com/t/cursor-2-1-agent-cant-access-in-ide-browser/143924)).
3. Native **`browser_*`** tools may appear without `CallMcpTool`.

## Verify after reload

In a **new** Agent chat:

> Call `browser_tabs` with action `list` on MCP server `playwright` (or `project-0-coalesce-docs-playwright`).

- **Success:** tab list (even empty) — run guide pipeline commands (`/docs-agent-guide-loop`, `/docs-agent-pipeline-builder`, `/docs-agent-guide-author`, or verify).
- **`MCP server does not exist: playwright`:** MCP did not load — check Settings → MCP for errors, fix `mcp.json` paths, run `npm install`, reload again.
- **npm EPERM on `~/.npm`:** run `sudo chown -R "$(whoami)" ~/.npm` **or** use the local `node …/cli.js` config above (no `npx`).

## If browser stays blocked

- Guide author/verify: **`no ui author`** / **`no ui verify`**, or **`## Authoring blocked (UI grounding)`** — do not invent UI steps.
- Manual screenshots: [`.cursor/skills/catalog-ui-screenshots/SKILL.md`](../skills/catalog-ui-screenshots/SKILL.md).

## Path discovery (guide author / verify)

When a documented click path fails, guide agents must **explore the app** (expand nav, sibling sections, search, alternate routes from `docs/` and code) before reporting blocked. See **Path discovery** in [`.cursor/reference/guide-quality-rubric.md`](guide-quality-rubric.md). The generic "four attempts then stop" rule in browser INSTRUCTIONS does **not** apply until the rubric **path discovery** attempt budget is exhausted.

## Cloud / remote agents

Gitignored **`.cursor/mcp.json`** is not available on Cloud Agents. Use **`~/.cursor/mcp.json`** with the same `playwright` block (absolute path to this repo’s `node_modules/.../cli.js`) or run UI guides **locally**.
