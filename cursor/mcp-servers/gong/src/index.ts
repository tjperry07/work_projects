#!/usr/bin/env node
/**
 * Gong MCP Server for Cursor.
 * Loads credentials from .env: GONG_ACCESS_KEY, GONG_SECRET_KEY, GONG_BASE_URL.
 * Defaults to the workspace `.env` (same resolution as gitlab-castordoc) because
 * Cursor’s process cwd is not always the repo root.
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
import { GongClient } from "./gong-client.js";
import {
  TOOLS,
  handleGongListCalls,
  handleGongGetTranscript,
  handleGongGetCallDetails,
} from "./tools.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root when server lives at `.cursor/mcp-servers/gong/dist`. */
function defaultWorkspaceEnvPath(): string {
  return path.join(path.resolve(__dirname, "../../../.."), ".env");
}

if (process.env.GONG_ENV_PATH) {
  config({ path: process.env.GONG_ENV_PATH });
} else {
  const workspaceEnv = defaultWorkspaceEnvPath();
  if (existsSync(workspaceEnv)) {
    config({ path: workspaceEnv });
  } else {
    config();
  }
}

const server = new Server(
  { name: "gong-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

let client: GongClient;

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!client) {
    try {
      client = new GongClient();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {
            type: "text",
            text: `Failed to initialize Gong client: ${msg}`,
          },
        ],
        isError: true,
      };
    }
  }

  switch (name) {
    case "gong_list_calls":
      return handleGongListCalls(client, args ?? {});
    case "gong_get_transcript":
      return handleGongGetTranscript(client, args ?? {});
    case "gong_get_call_details":
      return handleGongGetCallDetails(client, args ?? {});
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
  console.error("Gong MCP server error:", err);
  process.exit(1);
});
