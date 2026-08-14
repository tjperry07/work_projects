/**
 * GitLab MCP tool definitions and handlers for code research.
 */

import { z } from "zod";
import type { GitLabClient, GitLabBlobHit } from "./gitlab-client.js";

/** Default repos for Castor doc research when GITLAB_PROJECT_PATHS is unset. */
export const DEFAULT_CASTORDOC_PROJECT_PATHS = [
  "castordoc/extractor",
  "castordoc/k8s-deployables/backend",
  "castordoc/k8s-deployables/frontend",
  "castordoc/notebooks/product-ops",
  "castordoc/notebooks/production-774f",
] as const;

function defaultGroup(): string {
  return process.env.GITLAB_GROUP_PATH ?? "castordoc";
}

/** Comma-separated `path_with_namespace` values; falls back to DEFAULT_CASTORDOC_PROJECT_PATHS. */
export function configuredProjectPaths(): string[] {
  const raw = process.env.GITLAB_PROJECT_PATHS?.trim();
  if (!raw) {
    return [...DEFAULT_CASTORDOC_PROJECT_PATHS];
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const TOOLS = [
  {
    name: "gitlab_code_search",
    description:
      'Search source code across GitLab repos. Prefer default scope "configured_projects": searches only the fixed list in GITLAB_PROJECT_PATHS (defaults to castordoc extractor, k8s-deployables backend/frontend, notebooks product-ops and production-774f). Other scopes: group, single project, or global. Returns snippets and project_id; use gitlab_get_file for full files.',
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search string (GitLab syntax). Use keywords, symbols, or quoted phrases. Example: \"class Pipeline\" or \"def transform\".",
        },
        scope: {
          type: "string",
          enum: ["configured_projects", "group", "project", "global"],
          description:
            'Default "configured_projects" searches GITLAB_PROJECT_PATHS (or built-in castordoc repo list). Use "group", "project", or "global" for broader or narrower search.',
        },
        group_path: {
          type: "string",
          description:
            "Group path (e.g. castordoc). Defaults to GITLAB_GROUP_PATH env or castordoc.",
        },
        project_id: {
          type: "string",
          description:
            'When scope is "project": numeric project id or unencoded path_with_namespace (e.g. "castordoc/my-service"). Do not pre-encode slashes; the server encodes for the API.',
        },
        ref: {
          type: "string",
          description: "Optional branch or tag name to search (repository ref).",
        },
        page: {
          type: "integer",
          description:
            "Page number (default 1). For scope configured_projects, GitLab's page is applied to each configured repo search (same page index per project).",
        },
        per_page: {
          type: "integer",
          description: "Results per page (default 20, max 100).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "gitlab_get_file",
    description:
      "Fetch the full raw contents of a repository file by project id/path and file path. Use after gitlab_code_search to read complete definitions, configs, or modules.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description:
            "Numeric project ID or unencoded path_with_namespace (e.g. castordoc/extractor). Pre-encoded paths are normalized so slashes are not double-encoded.",
        },
        file_path: {
          type: "string",
          description: "Path to the file in the repo (e.g. src/main.py).",
        },
        ref: {
          type: "string",
          description: "Branch, tag, or commit SHA (defaults to project default branch if omitted).",
        },
        max_chars: {
          type: "integer",
          description:
            "Optional safety cap on returned characters (default 120000). Longer files are truncated with a notice.",
        },
      },
      required: ["project_id", "file_path"],
    },
  },
  {
    name: "gitlab_list_projects",
    description:
      "List GitLab projects under a group (with optional subgroup projects). Use to discover repos, paths, and IDs before searching.",
    inputSchema: {
      type: "object" as const,
      properties: {
        group_path: {
          type: "string",
          description:
            "Group path. Defaults to GITLAB_GROUP_PATH env or castordoc.",
        },
        page: {
          type: "integer",
          description: "Page number (default 1).",
        },
        per_page: {
          type: "integer",
          description: "Projects per page (default 50, max 100).",
        },
      },
      required: [],
    },
  },
  {
    name: "gitlab_get_project",
    description:
      "Get project metadata: path_with_namespace, description, default_branch, web_url, visibility. Useful to disambiguate project_id from search hits.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description:
            "Numeric project ID or unencoded path_with_namespace (e.g. castordoc/extractor).",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "gitlab_list_configured_repos",
    description:
      "Return the list of repository paths used for scope configured_projects (from GITLAB_PROJECT_PATHS or the default castordoc stack). Use to see which projects code search covers.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

const CodeSearchSchema = z.object({
  query: z.string().min(1),
  scope: z
    .enum(["configured_projects", "group", "project", "global"])
    .optional()
    .default("configured_projects"),
  group_path: z.string().optional(),
  project_id: z.string().optional(),
  ref: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(20),
});

const GetFileSchema = z.object({
  project_id: z.string().min(1),
  file_path: z.string().min(1),
  ref: z.string().optional(),
  max_chars: z.coerce.number().int().min(1000).optional().default(120_000),
});

const ListProjectsSchema = z.object({
  group_path: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(50),
});

const GetProjectSchema = z.object({
  project_id: z.string().min(1),
});

function formatHit(h: GitLabBlobHit, projectPath?: string): Record<string, unknown> {
  const row: Record<string, unknown> = {
    path: h.path,
    basename: h.basename,
    ref: h.ref,
    project_id: h.project_id,
    startline: h.startline,
    endline: h.endline,
    snippet: h.data,
  };
  if (projectPath) row.project_path = projectPath;
  return row;
}

function formatHits(hits: GitLabBlobHit[]): unknown[] {
  return hits.map((h) => formatHit(h));
}

export async function handleGitLabCodeSearch(
  client: GitLabClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = CodeSearchSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [{ type: "text", text: `Invalid arguments: ${parsed.error.message}` }],
      isError: true,
    };
  }

  const group = parsed.data.group_path ?? defaultGroup();

  try {
    if (parsed.data.scope === "configured_projects") {
      const paths = configuredProjectPaths();
      if (paths.length === 0) {
        return {
          content: [
            {
              type: "text",
              text:
                "No projects configured: set GITLAB_PROJECT_PATHS or rely on built-in defaults.",
            },
          ],
          isError: true,
        };
      }
      const perRepo = Math.max(
        5,
        Math.ceil(parsed.data.per_page / paths.length)
      );
      const results: unknown[] = [];
      const errors: Array<{ project_path: string; message: string }> = [];
      for (const projectPath of paths) {
        try {
          const hits = await client.searchProjectBlobs(
            projectPath,
            parsed.data.query,
            {
              page: parsed.data.page,
              perPage: Math.min(perRepo, 100),
              ref: parsed.data.ref,
            }
          );
          for (const h of hits) {
            results.push(formatHit(h, projectPath));
          }
        } catch (e) {
          errors.push({
            project_path: projectPath,
            message: e instanceof Error ? e.message : String(e),
          });
        }
      }
      const text = JSON.stringify(
        {
          scope: "configured_projects",
          projects_searched: paths,
          query: parsed.data.query,
          page: parsed.data.page,
          count: results.length,
          results,
          ...(errors.length ? { search_errors: errors } : {}),
        },
        null,
        2
      );
      return { content: [{ type: "text", text }] };
    }

    let hits: GitLabBlobHit[];
    if (parsed.data.scope === "project") {
      const pid = parsed.data.project_id;
      if (!pid) {
        return {
          content: [
            {
              type: "text",
              text: 'When scope is "project", project_id is required.',
            },
          ],
          isError: true,
        };
      }
      hits = await client.searchProjectBlobs(pid, parsed.data.query, {
        page: parsed.data.page,
        perPage: parsed.data.per_page,
        ref: parsed.data.ref,
      });
    } else if (parsed.data.scope === "global") {
      hits = await client.searchGlobalBlobs(parsed.data.query, {
        page: parsed.data.page,
        perPage: parsed.data.per_page,
        ref: parsed.data.ref,
      });
    } else {
      hits = await client.searchGroupBlobs(group, parsed.data.query, {
        page: parsed.data.page,
        perPage: parsed.data.per_page,
        ref: parsed.data.ref,
      });
    }

    const text = JSON.stringify(
      {
        group_path:
          parsed.data.scope === "group" ? group : undefined,
        scope: parsed.data.scope,
        query: parsed.data.query,
        page: parsed.data.page,
        count: hits.length,
        results: formatHits(hits),
      },
      null,
      2
    );
    return { content: [{ type: "text", text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `GitLab error: ${message}` }],
      isError: true,
    };
  }
}

export async function handleGitLabGetFile(
  client: GitLabClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = GetFileSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [{ type: "text", text: `Invalid arguments: ${parsed.error.message}` }],
      isError: true,
    };
  }

  try {
    let raw = await client.getRepositoryFileRaw(
      parsed.data.project_id,
      parsed.data.file_path,
      parsed.data.ref
    );
    let truncated = false;
    if (raw.length > parsed.data.max_chars) {
      raw = raw.slice(0, parsed.data.max_chars);
      truncated = true;
    }
    const header = [
      `project_id: ${parsed.data.project_id}`,
      `file_path: ${parsed.data.file_path}`,
      parsed.data.ref ? `ref: ${parsed.data.ref}` : null,
      truncated ? `\n[Truncated at ${parsed.data.max_chars} characters]` : null,
      "",
      "---",
      "",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    return { content: [{ type: "text", text: header + raw }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `GitLab error: ${message}` }],
      isError: true,
    };
  }
}

export async function handleGitLabListProjects(
  client: GitLabClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = ListProjectsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [{ type: "text", text: `Invalid arguments: ${parsed.error.message}` }],
      isError: true,
    };
  }

  const group = parsed.data.group_path ?? defaultGroup();

  try {
    const projects = await client.listGroupProjects(group, {
      page: parsed.data.page,
      perPage: parsed.data.per_page,
      includeSubgroups: true,
    });
    const text = JSON.stringify(
      {
        group_path: group,
        page: parsed.data.page,
        count: projects.length,
        projects: projects.map((p) => ({
          id: p.id,
          path_with_namespace: p.path_with_namespace,
          name: p.name,
          web_url: p.web_url,
          default_branch: p.default_branch,
        })),
      },
      null,
      2
    );
    return { content: [{ type: "text", text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `GitLab error: ${message}` }],
      isError: true,
    };
  }
}

export async function handleGitLabListConfiguredRepos(): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const paths = configuredProjectPaths();
  const source = process.env.GITLAB_PROJECT_PATHS?.trim()
    ? "GITLAB_PROJECT_PATHS"
    : "default (coalesce MCP built-in list)";
  const text = JSON.stringify(
    {
      source,
      count: paths.length,
      project_paths: paths,
      urls: paths.map((p) => `https://gitlab.com/${p}`),
    },
    null,
    2
  );
  return { content: [{ type: "text", text }] };
}

export async function handleGitLabGetProject(
  client: GitLabClient,
  args: unknown
): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  const parsed = GetProjectSchema.safeParse(args);
  if (!parsed.success) {
    return {
      content: [{ type: "text", text: `Invalid arguments: ${parsed.error.message}` }],
      isError: true,
    };
  }

  try {
    const summary = await client.getProjectSummary(parsed.data.project_id);
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `GitLab error: ${message}` }],
      isError: true,
    };
  }
}
