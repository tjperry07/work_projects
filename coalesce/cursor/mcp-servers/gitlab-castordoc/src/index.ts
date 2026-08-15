#!/usr/bin/env node
/**
 * GitLab MCP server for code search and repository research (e.g. castordoc group on GitLab.com).
 * Credentials: GITLAB_TOKEN from workspace `.env` (or GITLAB_ENV_PATH); optional GITLAB_BASE_URL, GITLAB_GROUP_PATH.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GitLabClient } from "./gitlab-client.js";
import {
  TOOLS,
  handleGitLabCodeSearch,
  handleGitLabGetFile,
  handleGitLabListProjects,
  handleGitLabListConfiguredRepos,
  handleGitLabGetProject,
} from "./tools.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root when server lives at `.cursor/mcp-servers/gitlab-castordoc/dist`. */
function defaultWorkspaceEnvPath(): string {
  return path.join(path.resolve(__dirname, "../../../.."), ".env");
}

// Prefer explicit GITLAB_ENV_PATH, then workspace `.env` (Cursor cwd is not always the repo).
if (process.env.GITLAB_ENV_PATH) {
  config({ path: process.env.GITLAB_ENV_PATH });
} else {
  const workspaceEnv = defaultWorkspaceEnvPath();
  if (existsSync(workspaceEnv)) {
    config({ path: workspaceEnv });
  } else {
    config();
  }
}

const server = new Server(
  { name: "gitlab-castordoc-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

let client: GitLabClient;

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!client) {
    try {
      client = new GitLabClient();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {
            type: "text",
            text: `Failed to initialize GitLab client: ${msg}`,
          },
        ],
        isError: true,
      };
    }
  }

  switch (name) {
    case "gitlab_code_search":
      return handleGitLabCodeSearch(client, args ?? {});
    case "gitlab_get_file":
      return handleGitLabGetFile(client, args ?? {});
    case "gitlab_list_projects":
      return handleGitLabListProjects(client, args ?? {});
    case "gitlab_list_configured_repos":
      return handleGitLabListConfiguredRepos();
    case "gitlab_get_project":
      return handleGitLabGetProject(client, args ?? {});
    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("GitLab MCP server error:", err);
  process.exit(1);
});
