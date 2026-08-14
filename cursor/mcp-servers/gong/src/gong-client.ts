/**
 * Gong API client. Uses GONG_ACCESS_KEY, GONG_SECRET_KEY, GONG_BASE_URL from .env.
 */

const DEFAULT_BASE_URL = "https://api.gong.io";

/** Safety cap: empty pages with a non-null cursor would otherwise spin forever. */
const MAX_LISTCALLS_ITERATIONS = 500;

/** MCP-internal cursor: Gong fixes ~100 rows per HTTP page; this carries skip + Gong's next cursor. */
const MCP_LIST_CURSOR_PREFIX = "mcpg1.";

interface ParsedListCursor {
  pageGc: string | null;
  skip: number;
  nextAfterPage: string | null;
}

function encodeMcpListTailCursor(input: {
  fromDateTime: string;
  toDateTime: string;
  pageGc: string | null;
  skip: number;
  nextAfterPage: string | null;
}): string {
  return (
    MCP_LIST_CURSOR_PREFIX +
    Buffer.from(
      JSON.stringify({
        v: 1,
        t: "tail",
        f: input.fromDateTime,
        o: input.toDateTime,
        gc: input.pageGc,
        s: input.skip,
        n: input.nextAfterPage,
      }),
      "utf8"
    ).toString("base64url")
  );
}

function parseMcpListCursor(
  cursor: string | null | undefined,
  fromDateTime: string,
  toDateTime: string
): ParsedListCursor {
  if (cursor == null || cursor === "") {
    return { pageGc: null, skip: 0, nextAfterPage: null };
  }
  if (cursor.startsWith(MCP_LIST_CURSOR_PREFIX)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(
        Buffer.from(
          cursor.slice(MCP_LIST_CURSOR_PREFIX.length),
          "base64url"
        ).toString("utf8")
      );
    } catch {
      throw new Error("Invalid Gong list cursor (corrupt encoding)");
    }
    const p = parsed as {
      v?: number;
      t?: string;
      f?: string;
      o?: string;
      gc?: string | null;
      s?: number;
      n?: string | null;
    };
    if (
      p.v !== 1 ||
      p.t !== "tail" ||
      p.f !== fromDateTime ||
      p.o !== toDateTime
    ) {
      throw new Error(
        "Invalid or stale Gong list cursor (from_date and to_date must match the prior request)"
      );
    }
    return {
      pageGc: p.gc ?? null,
      skip: p.s ?? 0,
      nextAfterPage: p.n ?? null,
    };
  }
  return { pageGc: cursor, skip: 0, nextAfterPage: null };
}

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

/**
 * Gong /v2/calls/extensive nests pagination under `records` when `records` is an object
 * (`data.records.cursor`), not at the top level.
 */
export interface CallsRecordsPage {
  cursor?: string | null;
  totalRecords?: number;
  currentPageSize?: number;
  currentPageNumber?: number;
  calls?: Call[];
}

export interface CallsResponse {
  calls?: Call[];
  records?: Call[] | CallsRecordsPage;
  cursor?: string | null;
}

function normalizeCursor(value: string | null | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  return String(value);
}

function pickCursorFromObject(obj: Record<string, unknown>): string | undefined {
  for (const key of ["cursor", "Cursor", "nextCursor", "NextCursor"]) {
    const v = normalizeCursor(obj[key] as string | null | undefined);
    if (v) return v;
  }
  return undefined;
}

function getRecordsPageObject(
  data: CallsResponse
): CallsRecordsPage | undefined {
  const rec = data.records;
  if (rec && typeof rec === "object" && !Array.isArray(rec)) {
    return rec as CallsRecordsPage;
  }
  return undefined;
}

function extractCallsFromExtensive(data: CallsResponse): Call[] {
  const rec = data.records;
  const recordsObj =
    rec && !Array.isArray(rec) ? (rec as CallsRecordsPage) : undefined;
  return (
    data.calls ??
    recordsObj?.calls ??
    (Array.isArray(rec) ? rec : []) ??
    []
  );
}

function extractNextCursorFromExtensive(data: CallsResponse): string | undefined {
  const fromTop = normalizeCursor(data.cursor);
  if (fromTop) return fromTop;
  const meta = getRecordsPageObject(data);
  if (meta) {
    const fromRecord = pickCursorFromObject(meta as unknown as Record<string, unknown>);
    if (fromRecord) return fromRecord;
  }
  return undefined;
}

/** Gong /v2/calls/extensive nests id, title, started, duration under metaData; promote for MCP consumers. */
function normalizeCallFromExtensiveRecord(c: Call): Call {
  const meta = c.metaData as
    | {
        id?: string;
        mediaId?: string;
        title?: string;
        started?: string;
        duration?: number;
      }
    | undefined;
  const rawId = c.id ?? meta?.id ?? meta?.mediaId;
  const id =
    rawId != null && rawId !== "" ? String(rawId) : ("" as string);
  return {
    ...c,
    id,
    title: (c.title ?? meta?.title) as string | undefined,
    started: (c.started ?? meta?.started) as string | undefined,
    duration: (c.duration ?? meta?.duration) as number | undefined,
  };
}

function normalizeCallsFromExtensivePayload(data: CallsResponse): Call[] {
  return extractCallsFromExtensive(data).map((c) =>
    normalizeCallFromExtensiveRecord(c as Call)
  );
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
      throw new Error(
        `Gong API error ${response.status}: ${text || response.statusText}`
      );
    }
    return response.json() as Promise<T>;
  }

  async listCalls(params: {
    fromDateTime: string;
    toDateTime: string;
    cursor?: string | null;
    limit?: number;
  }): Promise<{ calls: Call[]; cursor?: string; hasNextPage: boolean }> {
    const pageSize =
      params.limit != null
        ? Math.min(100, Math.max(1, params.limit))
        : 100;

    const { pageGc: initialGc, skip: initialSkip, nextAfterPage: initialPending } =
      parseMcpListCursor(
        params.cursor ?? null,
        params.fromDateTime,
        params.toDateTime
      );

    let pageGc: string | null = initialGc;
    let skip = initialSkip;
    let pendingNext: string | null = initialPending;

    for (let iteration = 0; ; iteration++) {
      if (iteration >= MAX_LISTCALLS_ITERATIONS) {
        throw new Error(
          `listCalls: exceeded ${MAX_LISTCALLS_ITERATIONS} pagination iterations (possible empty Gong pages with a cursor).`
        );
      }
      const body: Record<string, unknown> = {
        filter: {
          fromDateTime: params.fromDateTime,
          toDateTime: params.toDateTime,
        },
        cursor: pageGc,
        contentSelector: {
          context: "Extended",
          exposedFields: { parties: true },
        },
      };
      const data = await this.request<CallsResponse>("/v2/calls/extensive", {
        body,
      });
      const full = normalizeCallsFromExtensivePayload(data);
      const apiNext = extractNextCursorFromExtensive(data) ?? null;

      if (skip >= full.length) {
        const advance = pendingNext ?? apiNext;
        if (!advance) {
          return { calls: [], hasNextPage: false };
        }
        pageGc = advance;
        skip = 0;
        pendingNext = null;
        continue;
      }

      const window = full.slice(skip, skip + pageSize);
      const moreInPage = skip + window.length < full.length;

      if (moreInPage) {
        return {
          calls: window,
          cursor: encodeMcpListTailCursor({
            fromDateTime: params.fromDateTime,
            toDateTime: params.toDateTime,
            pageGc,
            skip: skip + window.length,
            nextAfterPage: apiNext,
          }),
          hasNextPage: true,
        };
      }

      if (apiNext) {
        return {
          calls: window,
          cursor: apiNext,
          hasNextPage: true,
        };
      }

      return {
        calls: window,
        hasNextPage: false,
      };
    }
  }

  async getCallDetails(callIds: string[]): Promise<Call[]> {
    if (callIds.length === 0) return [];
    const body = {
      filter: { callIds },
      cursor: null as string | null,
      contentSelector: { context: "Extended", exposedFields: { parties: true } },
    };
    const data = await this.request<CallsResponse>("/v2/calls/extensive", {
      body,
    });
    const calls = normalizeCallsFromExtensivePayload(data);
    const want = new Set(callIds.map((id) => String(id)));
    return calls.filter((c) => c.id && want.has(String(c.id)));
  }

  async getTranscripts(callIds: string[]): Promise<CallTranscript[]> {
    if (callIds.length === 0) return [];
    const body = { filter: { callIds } };
    const data = await this.request<TranscriptResponse>("/v2/calls/transcript", {
      body,
    });
    return data.callTranscripts ?? [];
  }
}
