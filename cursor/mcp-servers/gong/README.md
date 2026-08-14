# Gong MCP Server

MCP server for Gong call data. Loads credentials from **project-root `.env`** by resolving paths from `dist/` (same pattern as `gitlab-castordoc`), so Cursor’s cwd does not need to be the repo. Override with **`GONG_ENV_PATH`** (absolute path to an env file) if needed.

## Setup

1. Add `.env` in the project root with `GONG_ACCESS_KEY`, `GONG_SECRET_KEY`, `GONG_BASE_URL`
2. `npm install && npm run build`
3. Add to Cursor `mcp.json` (see `.cursor/README.md`)

## Tools

- **gong_list_calls** – List calls in a date range
- **gong_get_transcript** – Get transcript for call IDs
- **gong_get_call_details** – Get call metadata for call IDs
