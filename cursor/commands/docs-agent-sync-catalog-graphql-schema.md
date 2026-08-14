# Docs Agent: Sync Catalog Public GraphQL Schema

## Description

Regenerates the customer-safe Catalog Public GraphQL SDL at `static/graphql/public-schema.graphql` by fetching the `generate_public_api_schema` job artifact from `castordoc/k8s-deployables/backend` on GitLab. Replaces manual Postman exports for doc tooling ([DOC-15](https://linear.app/coalesce/issue/DOC-15), parent [DOC-14](https://linear.app/coalesce/issue/DOC-14)).

## Prompt

You are syncing the Catalog Public GraphQL schema into coalesce-docs. Follow these steps in order.

### Step 1: Confirm GitLab MCP

- Call `gitlab_list_configured_repos` on server **`gitlab-castordoc`** (or **`project-0-coalesce-docs-gitlab-castordoc`**).
- Confirm `castordoc/k8s-deployables/backend` is in the list.
- If MCP is unavailable or `GITLAB_TOKEN` is missing, stop with setup instructions from `.cursor/mcp-servers/gitlab-castordoc/README.md`.

### Step 2: Run sync script

From repo root:

```bash
npm run sync-catalog-graphql-schema
```

Requires `GITLAB_TOKEN` in `.env`. Fetches:

`/projects/castordoc%2Fk8s-deployables%2Fbackend/jobs/artifacts/master/raw/public-schema.graphql?job=generate_public_api_schema`

Weekly automation: `.github/workflows/catalog-graphql-docs.yml` (Mondays 09:00 UTC).

### Step 3: Validate SDL

On `static/graphql/public-schema.graphql`:

- Contains `type Query` and representative operations (`getTables`, `addAiAssistantJob`, or similar).
- Contains `@group(name:` directives (Tables, Data Quality, AI, etc.).
- Does **not** contain `@public(` (stripped by filter).
- File is non-empty and ends with a newline.

Primary validation (graphql package, already in coalesce-docs):

```bash
node -e "const {buildSchema}=require('graphql'); const fs=require('fs'); buildSchema(fs.readFileSync('static/graphql/public-schema.graphql','utf8')); console.log('SDL OK')"
```

### Step 4: Verify provenance

- Confirm `static/graphql/README.md` **Provenance** table was updated (`generatedAt`, `backendRef`, `source=job-artifact`).

### Step 5: Report

Summarize:

- Backend ref synced
- Source (`job-artifact`)
- Operation count or file size
- Validation results
- Whether commit is recommended (only commit when user asks)

## References

- Pinned SDL: `static/graphql/public-schema.graphql`
- Maintainer README: `static/graphql/README.md`
- Sync script: `scripts/sync-catalog-public-schema.mjs`
- Weekly workflow: `.github/workflows/catalog-graphql-docs.yml`
- Catalog Public API overview: `docs/catalog/developer/catalog-apis/public-api.md`
