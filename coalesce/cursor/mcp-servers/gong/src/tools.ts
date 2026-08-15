/**
 * Gong MCP tool definitions and handlers.
 */

import { z } from "zod";
import type { GongClient } from "./gong-client.js";

export const TOOLS = [
  {
    name: "gong_list_calls",
    description:
      "List Gong calls in a date range with pagination. Returns call metadata (id, started, duration, parties, title). Use the returned cursor to fetch additional pages.",
    inputSchema: {
      type: "object" as const,
      properties: {
        from_date: {
          type: "string",
          description:
            "Start of date range (ISO 8601, e.g. 2025-03-01T00:00:00Z)",
        },
        to_date: {
          type: "string",
          description: "End of date range (ISO 8601, e.g. 2025-03-19T23:59:59Z)",
        },
        cursor: {
          type: "string",
          description:
            "Pagination cursor from the previous response (pass back unchanged). May be a Gong cursor or an MCP-internal token (mcpg1.*) when limit is below Gong's page size.",
        },
        limit: {
          type: "integer",
          description: "Max calls per page (default 25, max 100)",
          default: 25,
        },
      },
      required: ["from_date", "to_date"],
    },
  },
  {
    name: "gong_get_transcript",
    description:
      "Get full transcript for one or more Gong calls. Returns speaker turns with text and timestamps. Use gong_list_calls first to get call IDs.",
    inputSchema: {
      type: "object" as const,
      properties: {
        call_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of Gong call IDs",
        },
      },
      required: ["call_ids"],
    },
  },
  {
    name: "gong_get_call_details",
    description:
      "Get full call metadata (parties, duration, title, etc.) for one or more call IDs. Use to resolve speaker names from transcripts.",
    inputSchema: {
      type: "object" as const,
      properties: {
        call_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of Gong call IDs",
        },
      },
      required: ["call_ids"],
    },
  },
];

const ListCallsArgsSchema = z.object({
  from_date: z.string(),
  to_date: z.string(),
  cursor: z.string().optional(),
  /** MCP hosts may pass JSON numbers as strings; coerce so list_calls still works. */
  limit: z.coerce.number().min(1).max(100).optional().default(25),
});

const CallIdsArgsSchema = z.object({
  call_ids: z.array(z.string()).min(1),
});

export async function handleGongListCalls(
  client: GongClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = ListCallsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [
        {
          type: "text",
          text: `Invalid arguments: ${parsed.error.message}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const result = await client.listCalls({
      fromDateTime: parsed.data.from_date,
      toDateTime: parsed.data.to_date,
      cursor: parsed.data.cursor ?? undefined,
      limit: parsed.data.limit,
    });

    const text = JSON.stringify(
      {
        calls: result.calls,
        cursor: result.cursor,
        has_next_page: result.hasNextPage,
        count: result.calls.length,
      },
      null,
      2
    );
    return { content: [{ type: "text", text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Gong API error: ${message}` }],
      isError: true,
    };
  }
}

export async function handleGongGetTranscript(
  client: GongClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = CallIdsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [
        {
          type: "text",
          text: `Invalid arguments: ${parsed.error.message}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const transcripts = await client.getTranscripts(parsed.data.call_ids);
    const callDetails = await client.getCallDetails(parsed.data.call_ids);
    const partyMap = new Map<string, string>();
    for (const call of callDetails) {
      for (const party of call.parties ?? []) {
        if (party.id != null && party.id !== "" && (party.name || party.emailAddress)) {
          partyMap.set(
            String(party.id),
            party.name ?? party.emailAddress ?? String(party.id)
          );
        }
      }
    }

    const enriched = transcripts.map((ct) => {
      const turns = (ct.transcript ?? []).map((u) => {
        const sid =
          u.speakerId != null && u.speakerId !== ""
            ? String(u.speakerId)
            : "";
        const speakerName =
          u.speakerName ??
          (sid ? partyMap.get(sid) : undefined) ??
          u.speakerId ??
          "Unknown";
        const text = (u.sentences ?? [])
          .map((s) => s.text ?? "")
          .filter(Boolean)
          .join(" ");
        return { speaker: speakerName, text };
      });
      return { callId: ct.callId, turns };
    });

    const text = JSON.stringify(enriched, null, 2);
    return { content: [{ type: "text", text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Gong API error: ${message}` }],
      isError: true,
    };
  }
}

export async function handleGongGetCallDetails(
  client: GongClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = CallIdsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [
        {
          type: "text",
          text: `Invalid arguments: ${parsed.error.message}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const calls = await client.getCallDetails(parsed.data.call_ids);
    const text = JSON.stringify(calls, null, 2);
    return { content: [{ type: "text", text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Gong API error: ${message}` }],
      isError: true,
    };
  }
}
