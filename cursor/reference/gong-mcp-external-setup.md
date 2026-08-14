# Gong MCP Server

The Gong MCP Server runs from `.cursor/mcp-servers/gong/` in coalesce-docs. See `.cursor/README.md` for setup.

This file contains the full source for reference (e.g. if you need to recreate the folder or set it up elsewhere).

## Quick setup (in-repo)

1. `cd .cursor/mcp-servers/gong && npm install && npm run build`
2. Add `.env` with `GONG_ACCESS_KEY`, `GONG_SECRET_KEY`, `GONG_BASE_URL`
3. Add to `mcp.json` with path `"<repo>/.cursor/mcp-servers/gong/dist/index.js"`

---

## package.json

```json
{
  "name": "gong-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": { "build": "tsc" },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "dotenv": "^16.4.5",
    "zod": "^3.23.8"
  },
  "devDependencies": { "@types/node": "^20.14.0", "typescript": "^5.5.0" }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

## src/gong-client.ts

```typescript
const DEFAULT_BASE_URL = "https://api.gong.io";

export interface GongConfig {
  accessKey: string;
  secretKey: string;
  baseUrl: string;
}

export interface CallParty {
  id?: string;
  emailAddress?: string;
  name?: string;
  affiliation?: string;
}

export interface Call {
  id: string;
  started?: string;
  duration?: number;
  parties?: CallParty[];
  title?: string;
  [key: string]: unknown;
}

export interface CallsResponse {
  calls?: Call[];
  records?: Call[];
  cursor?: string;
}

export interface TranscriptSentence {
  text?: string;
  start?: number;
  end?: number;
}

export interface TranscriptUtterance {
  speakerId?: string;
  speakerName?: string;
  sentences?: TranscriptSentence[];
  topic?: string;
}

export interface CallTranscript {
  callId?: string;
  transcript?: TranscriptUtterance[];
}

export interface TranscriptResponse {
  callTranscripts?: CallTranscript[];
}

export class GongClient {
  private config: GongConfig;

  constructor(config?: Partial<GongConfig>) {
    const accessKey = config?.accessKey ?? process.env.GONG_ACCESS_KEY ?? "";
    const secretKey = config?.secretKey ?? process.env.GONG_SECRET_KEY ?? "";
    const baseUrl =
      config?.baseUrl ?? process.env.GONG_BASE_URL ?? DEFAULT_BASE_URL;

    if (!accessKey || !secretKey) {
      throw new Error(
        "Gong credentials missing. Set GONG_ACCESS_KEY and GONG_SECRET_KEY in .env"
      );
    }
    this.config = { accessKey, secretKey, baseUrl };
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.accessKey}:${this.config.secretKey}`;
    return `Basic ${Buffer.from(credentials, "utf-8").toString("base64")}`;
  }

  private async request<T>(
    path: string,
    options: { method?: string; body?: object } = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl.replace(/\/$/, "")}${path}`;
    const headers: Record<string, string> = {
      Authorization: this.getAuthHeader(),
      "Content-Type": "application/json",
    };
    const init: RequestInit = {
      method: options.method ?? "POST",
      headers,
    };
    if (options.body) init.body = JSON.stringify(options.body);
    const response = await fetch(url, init);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gong API error ${response.status}: ${text || response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  async listCalls(params: {
    fromDateTime: string;
    toDateTime: string;
    cursor?: string | null;
    limit?: number;
  }): Promise<{ calls: Call[]; cursor?: string; hasNextPage: boolean }> {
    const body: Record<string, unknown> = {
      filter: { fromDateTime: params.fromDateTime, toDateTime: params.toDateTime },
      cursor: params.cursor ?? null,
    };
    const data = await this.request<CallsResponse>("/v2/calls/extensive", { body });
    const calls = data.calls ?? data.records ?? [];
    const cursor = data.cursor;
    const limit = Math.min(params.limit ?? 100, 100);
    return { calls, cursor, hasNextPage: Boolean(cursor) && calls.length >= limit };
  }

  async getCallDetails(callIds: string[]): Promise<Call[]> {
    if (callIds.length === 0) return [];
    const body = { filter: { callIds }, cursor: null as string | null };
    const data = await this.request<CallsResponse>("/v2/calls/extensive", { body });
    const calls = data.calls ?? data.records ?? [];
    return calls.filter((c) => callIds.includes(c.id));
  }

  async getTranscripts(callIds: string[]): Promise<CallTranscript[]> {
    if (callIds.length === 0) return [];
    const body = { filter: { callIds } };
    const data = await this.request<TranscriptResponse>("/v2/calls/transcript", { body });
    return data.callTranscripts ?? [];
  }
}
```

## src/tools.ts

```typescript
import { z } from "zod";
import type { GongClient } from "./gong-client.js";

export const TOOLS = [
  {
    name: "gong_list_calls",
    description: "List Gong calls in a date range with pagination.",
    inputSchema: {
      type: "object" as const,
      properties: {
        from_date: { type: "string", description: "Start (ISO 8601)" },
        to_date: { type: "string", description: "End (ISO 8601)" },
        cursor: { type: "string", description: "Pagination cursor" },
        limit: { type: "integer", description: "Max per page (default 25, max 100)", default: 25 },
      },
      required: ["from_date", "to_date"],
    },
  },
  {
    name: "gong_get_transcript",
    description: "Get full transcript for one or more call IDs.",
    inputSchema: {
      type: "object" as const,
      properties: { call_ids: { type: "array", items: { type: "string" } } },
      required: ["call_ids"],
    },
  },
  {
    name: "gong_get_call_details",
    description: "Get call metadata for one or more call IDs.",
    inputSchema: {
      type: "object" as const,
      properties: { call_ids: { type: "array", items: { type: "string" } } },
      required: ["call_ids"],
    },
  },
];

const ListCallsArgsSchema = z.object({
  from_date: z.string(),
  to_date: z.string(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).optional().default(25),
});
const CallIdsArgsSchema = z.object({ call_ids: z.array(z.string()).min(1) });

export async function handleGongListCalls(client: GongClient, args: unknown) {
  const parsed = ListCallsArgsSchema.safeParse(args);
  if (!parsed.success)
    return { content: [{ type: "text", text: `Invalid: ${parsed.error.message}` }], isError: true };
  try {
    const result = await client.listCalls({
      fromDateTime: parsed.data.from_date,
      toDateTime: parsed.data.to_date,
      cursor: parsed.data.cursor,
      limit: parsed.data.limit,
    });
    return { content: [{ type: "text", text: JSON.stringify({ calls: result.calls, cursor: result.cursor, has_next_page: result.hasNextPage, count: result.calls.length }, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Gong API error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
  }
}

export async function handleGongGetTranscript(client: GongClient, args: unknown) {
  const parsed = CallIdsArgsSchema.safeParse(args);
  if (!parsed.success)
    return { content: [{ type: "text", text: `Invalid: ${parsed.error.message}` }], isError: true };
  try {
    const transcripts = await client.getTranscripts(parsed.data.call_ids);
    const callDetails = await client.getCallDetails(parsed.data.call_ids);
    const partyMap = new Map<string, string>();
    for (const call of callDetails) {
      for (const party of call.parties ?? []) {
        if (party.id && (party.name || party.emailAddress))
          partyMap.set(party.id, party.name ?? party.emailAddress ?? party.id);
      }
    }
    const enriched = transcripts.map((ct) => ({
      callId: ct.callId,
      turns: (ct.transcript ?? []).map((u) => ({
        speaker: u.speakerName ?? partyMap.get(u.speakerId ?? "") ?? u.speakerId ?? "Unknown",
        text: (u.sentences ?? []).map((s) => s.text ?? "").filter(Boolean).join(" "),
      })),
    }));
    return { content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Gong API error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
  }
}

export async function handleGongGetCallDetails(client: GongClient, args: unknown) {
  const parsed = CallIdsArgsSchema.safeParse(args);
  if (!parsed.success)
    return { content: [{ type: "text", text: `Invalid: ${parsed.error.message}` }], isError: true };
  try {
    const calls = await client.getCallDetails(parsed.data.call_ids);
    return { content: [{ type: "text", text: JSON.stringify(calls, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Gong API error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
  }
}
```

## src/index.ts

```typescript
#!/usr/bin/env node
import { config } from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GongClient } from "./gong-client.js";
import { TOOLS, handleGongListCalls, handleGongGetTranscript, handleGongGetCallDetails } from "./tools.js";

if (process.env.GONG_ENV_PATH) config({ path: process.env.GONG_ENV_PATH });
else config();

const server = new Server({ name: "gong-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });
let client: GongClient;

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!client) {
    try { client = new GongClient(); } catch (err) {
      return { content: [{ type: "text", text: `Failed to init: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
    }
  }
  switch (name) {
    case "gong_list_calls": return handleGongListCalls(client, args ?? {});
    case "gong_get_transcript": return handleGongGetTranscript(client, args ?? {});
    case "gong_get_call_details": return handleGongGetCallDetails(client, args ?? {});
    default: return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```
