# Pipeline build handoff

Shared **chat-only** contract between **`/docs-agent-pipeline-builder`**, **`/docs-agent-pipeline-verify`**, **`/docs-agent-guide-author`**, **`/docs-agent-guide-verify`**, and **`/docs-agent-guide-loop`**. Never paste this block into published guides (`docs/guides/` or other user-facing docs).

The handoff is the **source of truth** for what was built in Coalesce Transform and/or Catalog. Guide authors and guide verifiers must align Implementation steps, Node names, parameters, and screenshots to this artifact—not to ticket keys or model memory alone.

---

## When to emit and consume

| Agent | Emits | Consumes |
|-------|-------|----------|
| **pipeline-builder** | Full handoff after Create/Run succeed | Ticket, user-supplied workspace/project URLs |
| **pipeline-verify** | Verification report; builder revision handoff on FAIL | Full handoff |
| **guide-author** | Guide path only (markdown file) | Full handoff (required unless `guide-only` with pasted handoff) |
| **guide-verify** | Guide verification report; author revision handoff on FAIL | Full handoff + guide path |
| **guide-loop** | Final session summary | Orchestrates all phases |

---

## Required template

Copy this structure into chat as **`## Pipeline build handoff`**. Use `N/A` only when a subsection truly does not apply (for example Catalog-only tickets with no Transform Nodes).

```markdown
## Pipeline build handoff

### Ticket (internal)

- **Ticket key:** TEAM-XXXX (or N/A if paste-only brief)
- **Link:** (internal ticket URL; do not copy into guides)
- **Acceptance criteria:** (bulleted list from ticket—internal only)

### Build target

- **Workspace URL:** (user-supplied; required)
- **Project name:** (user-supplied; required)
- **Environment:** dev | QA | other (name)
- **Warehouse / engine:** Snowflake | Databricks | BigQuery | N/A
- **Surface:** transform | catalog | both

### Verified URLs (preflight)

| URL | Purpose | Result |
|-----|---------|--------|
| … | Transform login / Build > Browser | Pass / Fail |

### Artifact inventory

| Name | Type | Package / version | Key config |
|------|------|-------------------|------------|
| … | Fact, Stage, Pivot, View, … | built-in or `@coalesce/…` + version | parameters, **Join / Mapping summary or full SQL**, column list, storage location, business key if Fact/Dimension |

List **only** Nodes and Sources that belong to the **documented lab path** (ticket-critical graph). Do not put Copilot leftovers or exploratory Nodes in this table as if they were required.

**Node Type selection:** Paste the builder **`## Node Type selection`** table (layer → chosen type → package → why → alternatives). If the build is intentionally all-Stage for a simplified lab, say so explicitly under **Known limits**.

**Out-of-scope workspace noise** (if present): leftover Node/Source names that remain in the Workspace but are **not** part of the lab path (for example Copilot extras). Guide authors must ignore these or call them out as optional leftovers—never as required steps.

**Storage mappings:** (locations, schemas if relevant)

**Job / deploy parameters:** (for example `sourcesuffix`, `DEPLOY`)

**Catalog assets** (if surface includes catalog): integration, dashboards, tables cited

**Join / Mapping payloads (Transform):** For each Stage/Fact with custom Join or Mapping transforms, paste **verbatim** Join SQL (or a complete fenced block) and list Mapping column transforms that are not simple `src.col` passthroughs. Note any Coalesce Join constraint discovered during build (for example Join must start with `FROM`, not a bare `WITH`, because Coalesce wraps Join as `SELECT <mapping> <joinCondition>`).

### Execution proof

| Node or scope | Create | Run / Job | Last outcome |
|---------------|--------|-----------|--------------|
| … | Pass | Pass | (brief note) |

**Blocking errors cleared:** yes | no (if no, do not emit handoff—continue build loop)

**Seed / join-key proof** (when seeds, adjustments, or lookups are in scope):

| Seed key | Upstream grain contains key? | Consumer shows expected effect? |
|----------|------------------------------|---------------------------------|
| … | yes / no | yes / no |

Do not emit handoff with orphan seed keys that the guide will claim as successful matches.

### Screenshots captured during build

| File path | Proves |
|-----------|--------|
| `static/img/guides/…` | Package install, graph scaffold, Run View config, etc. |

### Known limits and workarounds

- (discovered during build; safe to paraphrase in guides without ticket keys)
```

---

## Guide fidelity rule

When a guide describes **Implementation** (Nodes, packages, parameters, SQL/Jinja, deploy vs job behavior):

1. **Must match** the **Artifact inventory** and **Execution proof** in the handoff **and** the live Join/Mapping on those Nodes after Create/Run succeeded.
2. **May generalize** example names for readers (no customer codenames) but **must not** rename Nodes or change parameter semantics relative to the built pipeline unless the guide explicitly says "substitute your Node names" and the structure is identical.
3. **Name the real Node Types** (and Coalesce Marketplace packages when used). Do not describe package Fact/Pivot/View Nodes as Stage.
4. **Do not invent graph semantics.** If a seed/catalog Node is not referenced in downstream Join SQL, do not claim the engine "reads" it or calculates "in dependency order" from that metadata unless the built SQL does.
5. **Do not document leftover Sources/Nodes** as required lab steps. Either omit them or label them as optional leftovers outside the lab path.
6. **Prefer full copy-paste Join SQL and non-trivial Mapping transforms** over paraphrases ("pivot inputs," "seed a few rows"). Summaries alone are insufficient when the lab depends on exact SQL.
7. **Expected outcomes** (Preview row counts, sample `input_id` / `kpi_id` values, Create/Run messages) must match a live Preview or handoff execution proof—not guesses.
8. **Guide-verify tier 2 (Pipeline fidelity)** fails when prose contradicts the handoff or live read-only UI inspection, including summarized SQL that omits required Join wrapping or Mapping aggregates, or wrong Node Type labels.

---

## Revision handoffs (related blocks)

- **`## Handoff for docs-agent-pipeline-builder (revision)`** — from pipeline-verify on FAIL; pipeline fixes only.
- **`## Handoff for docs-agent-guide-author (revision)`** — from guide-verify on FAIL; guide markdown fixes only. Pipeline mismatches route back to pipeline-builder via guide-loop, not guide edits alone.

---

## Blocker templates

### Pipeline build blocked (URL verification)

Emit when preflight URLs fail before any graph edits. Do not emit a partial handoff.

### Pipeline build escalation

Emit when build-fix cycles exceed the playbook limit (see `docs-agent-pipeline-builder.md`).

### Pipeline human escalation report

Emit after three failed pipeline-verify attempts.
