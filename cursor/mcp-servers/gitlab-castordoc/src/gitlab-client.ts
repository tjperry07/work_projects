/**
 * Minimal GitLab REST API client for code search and file fetch.
 * @see https://docs.gitlab.com/ee/api/search.html
 * @see https://docs.gitlab.com/ee/api/repository_files.html
 */

export type GitLabBlobHit = {
  basename?: string;
  path?: string;
  data?: string;
  ref?: string;
  startline?: number;
  endline?: number;
  project_id?: number;
};

export type GitLabProject = {
  id: number;
  path_with_namespace?: string;
  name?: string;
  web_url?: string;
  default_branch?: string;
};

export type GitLabProjectSummary = {
  id: number;
  path_with_namespace?: string;
  name?: string;
  description?: string | null;
  web_url?: string;
  default_branch?: string;
  visibility?: string;
};

/**
 * Encode a project id or path_with_namespace for GitLab REST URL segments (/projects/:id/...).
 * Callers should pass an unencoded path (e.g. castordoc/my-app) or a numeric id string.
 * If the value is already percent-encoded, decode once then encode so % is not doubled (%25).
 */
function encodeGitLabProjectPathSegment(pid: string): string {
  try {
    const decoded = decodeURIComponent(pid);
    if (decoded !== pid) {
      return encodeURIComponent(decoded);
    }
  } catch {
    // Malformed % escapes; encode the raw string.
  }
  return encodeURIComponent(pid);
}

export class GitLabClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(options?: { baseUrl?: string; token?: string }) {
    const base =
      options?.baseUrl ??
      process.env.GITLAB_BASE_URL ??
      "https://gitlab.com";
    this.baseUrl = base.replace(/\/$/, "");
    const tok = options?.token ?? process.env.GITLAB_TOKEN;
    if (!tok || tok.trim() === "") {
      throw new Error(
        "GITLAB_TOKEN is required (GitLab personal or project access token with read_api and read_repository)."
      );
    }
    this.token = tok.trim();
  }

  private async request<T>(
    path: string,
    searchParams?: Record<string, string | number | undefined>
  ): Promise<{ data: T; headers: Headers }> {
    const url = new URL(`${this.baseUrl}/api/v4${path}`);
    if (searchParams) {
      for (const [k, v] of Object.entries(searchParams)) {
        if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url, {
      headers: {
        "PRIVATE-TOKEN": this.token,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `GitLab API ${res.status} ${res.statusText}: ${body.slice(0, 500)}`
      );
    }
    const data = (await res.json()) as T;
    return { data, headers: res.headers };
  }

  private async requestText(
    path: string,
    searchParams?: Record<string, string | number | undefined>
  ): Promise<string> {
    const url = new URL(`${this.baseUrl}/api/v4${path}`);
    if (searchParams) {
      for (const [k, v] of Object.entries(searchParams)) {
        if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url, {
      headers: { "PRIVATE-TOKEN": this.token },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `GitLab API ${res.status} ${res.statusText}: ${body.slice(0, 500)}`
      );
    }
    return res.text();
  }

  /**
   * Search file contents (blobs) within a group namespace.
   * @param groupPath Group full path, e.g. "castordoc" or "parent/subgroup" (see GitLab namespaced path encoding).
   */
  async searchGroupBlobs(
    groupPath: string,
    search: string,
    options?: { page?: number; perPage?: number; ref?: string }
  ): Promise<GitLabBlobHit[]> {
    const groupSeg = encodeURIComponent(groupPath);
    const path = `/groups/${groupSeg}/search`;
    const { data } = await this.request<GitLabBlobHit[]>(path, {
      scope: "blobs",
      search,
      page: options?.page ?? 1,
      per_page: Math.min(options?.perPage ?? 20, 100),
      ref: options?.ref,
    });
    return data;
  }

  /**
   * Search blobs in a single project.
   * @param projectId Numeric ID or path_with_namespace (unencoded, e.g. castordoc/my-app). Already-encoded paths are normalized.
   */
  async searchProjectBlobs(
    projectId: string | number,
    search: string,
    options?: { page?: number; perPage?: number; ref?: string }
  ): Promise<GitLabBlobHit[]> {
    const pid = typeof projectId === "number" ? String(projectId) : projectId;
    const path = `/projects/${encodeGitLabProjectPathSegment(pid)}/search`;
    const { data } = await this.request<GitLabBlobHit[]>(path, {
      scope: "blobs",
      search,
      page: options?.page ?? 1,
      per_page: Math.min(options?.perPage ?? 20, 100),
      ref: options?.ref,
    });
    return data;
  }

  /**
   * Search blobs across all projects the token can access (not limited to one group).
   * Use if the namespace is a user account or group search is unavailable.
   */
  async searchGlobalBlobs(
    search: string,
    options?: { page?: number; perPage?: number; ref?: string }
  ): Promise<GitLabBlobHit[]> {
    const { data } = await this.request<GitLabBlobHit[]>("/search", {
      scope: "blobs",
      search,
      page: options?.page ?? 1,
      per_page: Math.min(options?.perPage ?? 20, 100),
      ref: options?.ref,
    });
    return data;
  }

  /** List projects in a group (optionally including subgroups). */
  async listGroupProjects(
    groupPath: string,
    options?: { page?: number; perPage?: number; includeSubgroups?: boolean }
  ): Promise<GitLabProject[]> {
    const groupSeg = encodeURIComponent(groupPath);
    const path = `/groups/${groupSeg}/projects`;
    const { data } = await this.request<GitLabProject[]>(path, {
      page: options?.page ?? 1,
      per_page: Math.min(options?.perPage ?? 50, 100),
      include_subgroups: options?.includeSubgroups !== false ? "true" : "false",
    });
    return data;
  }

  /** Raw file contents for research after a search hit. */
  async getRepositoryFileRaw(
    projectId: string | number,
    filePath: string,
    ref?: string
  ): Promise<string> {
    const pid = typeof projectId === "number" ? String(projectId) : projectId;
    const fp = encodeURIComponent(filePath.replace(/^\//, ""));
    const path = `/projects/${encodeGitLabProjectPathSegment(pid)}/repository/files/${fp}/raw`;
    const params: Record<string, string | number | undefined> = {};
    if (ref && ref.length > 0) params.ref = ref;
    return this.requestText(path, params);
  }

  async getProjectSummary(
    projectId: string | number
  ): Promise<GitLabProjectSummary> {
    const pid = typeof projectId === "number" ? String(projectId) : projectId;
    const { data } = await this.request<GitLabProjectSummary & Record<string, unknown>>(
      `/projects/${encodeGitLabProjectPathSegment(pid)}`
    );
    return {
      id: data.id,
      path_with_namespace: data.path_with_namespace,
      name: data.name,
      description: data.description as string | null | undefined,
      web_url: data.web_url,
      default_branch: data.default_branch,
      visibility: data.visibility as string | undefined,
    };
  }
}
