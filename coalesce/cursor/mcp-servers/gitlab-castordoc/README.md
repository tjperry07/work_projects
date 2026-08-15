# GitLab code research MCP

[Model Context Protocol](https://modelcontextprotocol.io/) server that searches GitLab repositories and reads files so an agent can explain how a codebase works.

Targets the Castor doc stack by default:

- [castordoc/extractor](https://gitlab.com/castordoc/extractor)
- [castordoc/k8s-deployables/backend](https://gitlab.com/castordoc/k8s-deployables/backend)
- [castordoc/k8s-deployables/frontend](https://gitlab.com/castordoc/k8s-deployables/frontend)
- [castordoc/notebooks/product-ops](https://gitlab.com/castordoc/notebooks/product-ops)
- [castordoc/notebooks/production-774f](https://gitlab.com/castordoc/notebooks/production-774f)

Override with `GITLAB_PROJECT_PATHS` (comma-separated `path_with_namespace` values) for other GitLab instances or repo sets.

## Setup

1. Create a [Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) or project/group token with at least **`read_api`** and **`read_repository`** (broader read scopes are fine). Fine-grained tokens used for `npm run sync-catalog-graphql-schema` also need **Job Artifact: Read** on `castordoc/k8s-deployables/backend`.

2. Install and build:

   ```bash
   cd .cursor/mcp-servers/gitlab-castordoc
   npm install
   npm run build
   ```

3. Put `GITLAB_TOKEN` in the workspace `.env` (same pattern as other local API keys). The server loads that file automatically when it runs from `.cursor/mcp-servers/gitlab-castordoc/dist` (four levels below the repo root). Do not set `GITLAB_TOKEN` in `mcp.json` to an empty string — dotenv will not override variables that are already set.

4. Add to `.cursor/mcp.json` (path must match your machine):

   ```json
   "gitlab-castordoc": {
     "command": "node",
     "args": ["/absolute/path/to/coalesce-docs/.cursor/mcp-servers/gitlab-castordoc/dist/index.js"],
     "env": {
       "GITLAB_BASE_URL": "https://gitlab.com",
       "GITLAB_GROUP_PATH": "castordoc",
       "GITLAB_PROJECT_PATHS": "castordoc/extractor,castordoc/k8s-deployables/backend,castordoc/k8s-deployables/frontend,castordoc/notebooks/product-ops,castordoc/notebooks/production-774f"
     }
   }
   ```

   Optional: set `GITLAB_TOKEN` (or other vars) in `mcp.json` if you prefer not to use `.env`, or set `GITLAB_ENV_PATH` to an absolute path to a specific env file.

5. Restart Cursor so the MCP loads.

## Tools

| Tool | Purpose |
|------|---------|
| `gitlab_code_search` | Full-text search in repo files; **default** scope `configured_projects` hits only the five Castor repos above (or `GITLAB_PROJECT_PATHS`). Also: group, single project, global. |
| `gitlab_list_configured_repos` | Lists which `path_with_namespace` values are included in `configured_projects` search. |
| `gitlab_get_file` | Load full file contents for a path (after search finds a file). |
| `gitlab_list_projects` | Discover projects under the group (includes subgroups by default). |
| `gitlab_get_project` | Project metadata (default branch, `web_url`, description). |

The **research agent** (Cursor) calls these tools and synthesizes answers; this server does not run an LLM by itself.

## Notes

- GitLab search has [syntax and limits](https://docs.gitlab.com/ee/user/search/advanced_search.html); very large monorepos may need narrower `project_id` searches.
- `.cursor/mcp.json` is typically gitignored; do not commit tokens.
