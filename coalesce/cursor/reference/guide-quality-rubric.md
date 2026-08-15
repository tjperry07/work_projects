# Guide quality rubric

Shared contract for **`/docs-agent-pipeline-builder`**, **`/docs-agent-pipeline-verify`**, **`/docs-agent-guide-author`**, **`/docs-agent-guide-verify`**, and **`/docs-agent-guide-loop`**. Read this file **in full** before writing or verifying a guide.

**Build-first workflow:** Pipelines are built and verified against the ticket **before** guide authoring. The **`## Pipeline build handoff`** ([`.cursor/reference/pipeline-build-handoff.md`](pipeline-build-handoff.md)) is the source of truth for Implementation steps. Guide authors walk the **built** pipeline **read-only**; they do not create or modify Nodes, Jobs, packages, or Catalog assets.

The author runs **Playwright MCP UI grounding (Step 1b)** when the guide requires Coalesce app steps—navigation and **`browser_take_screenshot`**; the verifier re-walks those steps in tier 3 with the same Playwright server and re-captures PNGs when alignment fails. **Guide-verify tier 2 (Pipeline fidelity)** compares guide claims to the handoff and live UI.

Guides are **one-stop runbooks**: a reader with prerequisites complete should finish with a working artifact, not a conceptual summary.

---

## Exemplar references

| Source | Why it is a good model |
|--------|------------------------|
| [Django tutorial 1](https://docs.djangoproject.com/en/6.0/intro/tutorial01/) | Learn-by-example; minimal upfront setup; every action has a command, expected output, and file context. |
| [Django tutorial 2](https://docs.djangoproject.com/en/6.0/intro/tutorial02/) | Continues the same pattern; database steps stay procedural with outcomes after each action. |
| [Stripe mobile accept payment](https://docs.stripe.com/payments/mobile/accept-payment) | Task-first; full copy-paste code; numbered substeps per install path; platform-specific branches only when needed. |
| [`docs/guides/using-coalesce-marketplace-to-build-first-class-data-pipelines.md`](../../docs/guides/using-coalesce-marketplace-to-build-first-class-data-pipelines.md) | Screenshot per distinct Coalesce UI screen; numbered steps with **bold** controls and menu paths. **Do not** copy its long **Before You Start** or **About Coalesce** blocks for new guides. Write **Coalesce Marketplace** for Packages and **Snowflake Marketplace** for trial signup; never bare **Marketplace** or **the marketplace**. For Snowflake trial signup, use the verbatim sentence and prerequisite note in `.cursor/rules/docs-writing.mdc` (**Snowflake trial signup**). |
| [`docs/guides/using-incremental-nodes.md`](../../docs/guides/using-incremental-nodes.md) | Short **Before You Begin**; screenshots at key transitions; tight procedure sections. |
| [`docs/guides/trace-metrics-and-dashboards-in-catalog.md`](../../docs/guides/trace-metrics-and-dashboards-in-catalog.md) | **Scenario-driven investigation:** stakeholder question, deliverables, linear steps with **Checkpoint** subsections, synthesis table, example reply; UI steps serve the story, not a product tour. |

**Density targets:** Django and Stripe for step granularity and expected outcomes; marketplace guide for Coalesce UI screenshot cadence; incremental-nodes for prerequisite length; trace-metrics guide for discovery and Catalog investigation shape.

**Use-case and pattern guides:** [`docs/build-your-pipeline/incremental-loading-strategies.md`](../../docs/build-your-pipeline/incremental-loading-strategies.md) for scenario-first sections, decision criteria, and platform-specific numbered procedures after the reader picks a pattern.

---

## Guide archetypes

Pick **one** archetype in Step 0 (author) or infer from the topic. Both are one-stop runbooks; they differ in how much design context precedes procedures.

| Archetype | When to use | Reader outcome |
|-----------|-------------|----------------|
| **Hands-on lab** | First-time setup, trial flows, UI-heavy walkthroughs, **discovery and investigation** topics | Working pipeline, configured workspace, or **evidence-backed answer** to a stakeholder question (not just "visited these pages") |
| **Use-case / architecture pattern** | Scaling, multi-Project design, package patterns (Run View, sequences), CDC/incremental design, enterprise platform topics | Correct **design choice** plus **implemented** Coalesce configuration for that pattern |

### Hands-on lab: scenario-driven shape (default for discovery and investigation)

Use this shape when the reader must **answer a business question** using Coalesce (especially **Catalog**: trace a KPI, validate a dashboard, find owners and source tables, audit lineage) rather than **build** a new pipeline artifact.

**Do not** structure the guide as a product tour: separate top-level `##` sections per surface (**Dashboards**, **Knowledge**, **Lineage**, **Search**) with no connecting story, or a large "choose your starting point" table as the main body.

**Required flow:**

1. **Opening scenario** (one to three paragraphs): A named situation with stakes (for example a VP questions a metric before a board meeting). State **why** the reader is investigating, not only which product areas exist.
2. **What You Will Accomplish** (`##` heading, title case): Bullets of **deliverables** the reader can give a stakeholder (official definition, dashboard name and owner, warehouse `table.column`, whether documentation and lineage agree). Tell readers to substitute workspace asset names for **example** names you provide (for example **Churn Rate**, a Tableau executive dashboard, `analytics.customer_subscriptions`).
3. **Before You Begin** — minimal prerequisites (see Structure table).
4. **Linear investigation steps** (`## Step 1: …`, `## Step 2: …`, or equivalent action titles): Each step advances the **same case**. UI clicks live **inside** the step that needs them, with a lead-in that ties the click to the scenario ("confirm the definition before you open the dashboard").
5. **Checkpoint** (bold label or short paragraph at the end of each major step): What the reader should know **before** continuing; what to record if Catalog is empty or lineage is broken (gaps are valid outcomes).
6. **Synthesize Your Answer** (or **Deliver your findings**): A table mapping stakeholder questions to Catalog locations, plus an **example** Slack or email reply in a blockquote with placeholders the reader replaces with what they found (see trace-metrics exemplar).
7. **Other Ways to Start** (optional, short): Alternate entry points (dashboard-first, search-first, data browse) in a small table plus `####` subsections—**secondary**, not the primary narrative. Optional AI or advanced paths stay after alternates.
8. **What's Next** / **Resources** — links only; no new procedures.

**UI and screenshots** still follow the Structure and Code tables below (one action per numbered step, screenshot after each new page). The difference is **purpose per step**: every control names **what it proves** in the investigation, not "here is where this page lives."

### Use-case / architecture pattern guides (required shape)

Use when the topic is a **use case** (for example shared dimensions across Projects, incremental pipelines with Run Views and sequences) or when the user supplies a **ticket**, **customer scenario**, or **flow outline** instead of only a product feature name.

**Research (author Step 1):** Must understand the problem **inside and outside Coalesce** before writing:

- **In Coalesce:** `docs/`, Linear identifiers (for example ticket **DOC-123**), Pylon, Slack, Notion, `coalesceio` package repos, monorepo issues/PRs when relevant.
- **Outside Coalesce (when needed):** mainstream data-platform concepts the audience expects (shared conformed dimensions, incremental/CDC patterns, sequence tables, multi-tenant modeling) using **web search** or authoritative vendor docs. Synthesize how Coalesce **maps** those concepts to Projects, Workspaces, Nodes, Storage Locations/Mappings, Packages, Jobs, and deploy/refresh behavior. Do not paste external marketing copy into the guide.

**Typical section flow** (adapt headings to the use case; keep every bullet in the user's flow as its own `##` or `###`):

1. **Intro** — scenario, audience, outcome (one paragraph).
2. **Before You Begin** — minimal prerequisites (see Structure table).
3. **How This Approach Works** (one `##` only) — nest decision criteria, solution shape, and limits as `###` subheadings. Do **not** use three separate `##` headings for those topics.
   - **### When This Approach Fits** / **When to Split or Scale** — decision criteria (node limits, teams, domains, operational boundaries). Use tables or bullets; link to limits and fundamentals in `docs/`. **Banned labels:** never **When to Use This Pattern**.
   - **### How Coalesce Models This** — how Coalesce models the solution (shared `dim.*` in a reference Project, Run View + sequences, storage mapping layout). Diagrams (mermaid) optional when they clarify cross-Project or deploy vs job flows. **Banned labels:** never **Recommended Pattern**.
   - **### Limits and What to Avoid** — duplication, node limits, sequence regeneration on deploy, cross-Project reference constraints, workarounds **proven in research** (not invented). **Banned labels:** never **Anti-Patterns and Limits**.
4. **Procedure steps as their own `##` headings** — each major task is `## Step 1: …`, `## Step 2: …`, or an action-oriented `##` (**Install the Package**, **Create the Pipeline**). Do **not** nest major steps as `###` under a single **Implementation** (or similar) `##`. Numbered lists stay **inside** each step for clicks and substeps. This is not optional for pattern guides: readers must be able to execute the pattern, and guide step navigation is built from every `##`.
5. **Resources** / **What's Next** — links to package listings, fundamentals, related guides.

**Example topics (non-exhaustive):**

- **Scaling to multiple Projects with shared dimensions** (ticket #7608, Project Magnus): when to split Projects; shared `dim.Company`, `dim.Country`; avoiding duplication and node limits; storage mappings and cross-Project references; design patterns and workarounds. Audience: large or multi-domain platforms.
- **Incremental pipelines with Run Views and sequences** (ticket #7705): Incremental Loading package; Run View with override create SQL; reading sequences from a table and passing downstream; deploy-triggered vs job-triggered sequence generation; avoiding regeneration on deploy. Audience: incremental or CDC-style pipeline teams.

---

## Structure and voice

| Dimension | Target |
|-----------|--------|
| **Purpose** | Reader completes a concrete outcome (DAG, integration, configured Node, working flow). |
| **Intro** | **Scenario-driven labs:** open with the business situation and stakes, then what the reader will be able to **tell someone** when done. **Build labs:** one to three sentences on the artifact they will create. Optional tight bullets: **What you'll need**, **What you'll build**, **What you'll learn**. No multi-screen product marketing before procedures. |
| **Before You Begin / Before You Start** | **Minimal**: about four to six bullets or a short numbered list (accounts, roles, browser, dataset pointer). Link to [`docs/setup-your-project/`](../../docs/setup-your-project/) or sibling setup docs for long Snowflake, Partner Connect, or Databricks signup unless the guide **is** explicitly a trial onboarding lab. |
| **Concept sections** | **New guides:** no multi-screen **About Coalesce** (or similar) blocks. One intro paragraph plus links to reference docs. **Legacy rewrites:** keep **Overview** only when the file already uses it and the user asked to preserve shape. |
| **Task headings** | Action-oriented `##` headings (**Install the Package**, **Step 2: Open the Dashboard That Reports Churn**), not abstract product-area labels (**Using Lineage**, **Knowledge Section**) unless nested under a scenario step. |
| **Procedures** | Numbered lists; **one user-visible action per step**; nested numbering for multi-field forms. **Bold** exact control names; use `>` in paths: **Build Settings > Packages**. |
| **Expected outcomes** | After **Run**, **Create**, deploy, or CLI commands, state what the reader should see (message, page title, node on DAG, row count). |
| **Callouts** | `:::info`, `:::tip`, `:::warning` inside steps when needed; link out for long explanations. |
| **Ending** | **Resources**, **What's Next**, or **Conclusion** plus **Resources**; reference-style links at the bottom with no horizontal rule before them. |

---

## Code, screenshots, and video

| Dimension | Target |
|-----------|--------|
| **Code** | Full copy-paste blocks with language tags (`sql`, `jinja`, `yaml`, etc.). File paths as subheadings when editing files. No `...` ellipses in procedural steps. Branching install paths only when the guide truly supports multiple paths (Stripe model). |
| **Screenshots** | **Mandatory:** one image immediately after **each numbered step that sends the reader to a new page** (URL/route change, list → detail, left-nav section landing, project/workspace shell change). Also capture other distinct screen changes when helpful—including **distinct regions on the same URL** (for example dashboard **Read me** top vs **Pinned Assets** after scroll, Knowledge **Overview** vs **Technical Definition**). Descriptive `alt` text and `className="mdImages"`. Place the image **under the step that causes navigation**, not later in the section. Use `<!-- TODO: screenshot -->` only when capture is blocked, with capture instructions in the author post-save message. **Screenshot–guide alignment** (see dedicated section below): every image must show the same assets, control labels, and page the adjacent step describes—re-capture or rewrite prose before save; never ship a mismatch. |
| **Video** | Optional **Video Overview** at top or **Resources** at end (YouTube, Wistia). Video supplements; it does **not** replace numbered steps. |
| **Sample data** | Metabase AI Data Generator or named vendor-native samples when the lab requires them; say which explicitly. |

---

## Anti-patterns (forbidden in guides)

- Section headings or labels **Anti-Patterns and Limits**, **Recommended Pattern**, or **When to Use This Pattern**. Use situation-oriented titles instead (for example **When This Approach Fits**, **How Coalesce Models This**, **Limits and What to Avoid**).
- Three separate `##` headings for pattern when-to-use, solution shape, and limits. Nest those as `###` under one overview `##` (for example **How This Approach Works**).
- Nesting major procedure steps as `### Step 1` / `### Step 2` under a single **Implementation** (or similar) `##`. Promote each major step to its own `##`.
- Summarized procedures: "configure as needed," "follow similar steps," "as described above" without repeating steps.
- Merged steps that hide multiple clicks or form fields in one numbered item.
- Research handoff or internal notes pasted into user-facing prose.
- Hedged product claims (`may`, `might`) when docs or research establish the fact.
- Generic ELT wording without Coalesce UI paths when controls are known.
- Long **About** product essays before the reader can start the lab.
- Defaulting to `<!-- TODO: screenshot -->` instead of capturing when browser access exists.
- A **new-page** navigation step with no screenshot (or a single screenshot covering multiple page arrivals).
- Paraphrased Join/Mapping for a lab Node that already has working SQL in the built pipeline ("seed a few rows," "pivot and calculate") instead of full copy-paste blocks.
- Listing Sources or Nodes the lab Join never uses (including Copilot leftovers) as required steps, or contradicting a later "only these tables" note.
- Claiming catalog/metadata-driven or dependency-order calculation when live engine SQL does not read that catalog Node.
- Instructing a bare leading `WITH` as the entire Coalesce Join string (causes parse errors; wrap as `FROM ( … )`).
- Preview row counts or sample values that were not confirmed on a live Preview after Create/Run succeeded.
- Defaulting every pipeline layer to Stage without reviewing built-in and Coalesce Marketplace Node Types for the warehouse ([Choosing the Right Node](../../docs/marketplace/choosing-the-right-node/index.md)).
- Labeling Fact, Pivot, View, Dimension, or Work Nodes as Stage in guide prose.
- Shipping synthetic seed/adjustment keys that never appear in the upstream grain, or claiming those rows prove a join/delta path without consumer Preview proof.
- Treating Create/Run Pass as proof that LEFT JOIN demo rows matched.
- **Feature tour guides:** Catalog/Transform/Quality content organized only by where to click, with no stakeholder scenario, no **What You Will Accomplish**, no **Checkpoint**, and no synthesis (example reply or findings table).
- **Chooser-first guides:** A large "pick your starting point" table as the main walkthrough instead of one primary investigation thread with alternates at the end.
- **Screenshot–text mismatch:** Prose names one metric, dashboard, table, or column while the paired image shows a different asset (for example step says **Churn Rate** but the screenshot title is **Average Revenue Per Customer**).
- **Control label mismatch:** A numbered step tells the reader to click **Save**, **Run**, or **Create** while the visible control in the screenshot reads **Done**, **Deploy**, or another label—unless the step quotes the **actual** UI label in bold and explains the synonym.
- **Wrong-page screenshot:** Image placed under a navigation step but shows the previous view, a modal from another step, or a hub when the step opened a detail page.
- **Alt text drift:** `alt` describes UI the file does not contain (marketing names, planned assets, or a different integration folder than visible in the crop).
- **Viewport drift:** `alt` cites **Technical Definition**, a formula, **Pinned Assets**, or expanded lineage tables, but the PNG shows only the top of **Read me**, collapsed lineage, or an unfiltered list—**scroll** (`browser_scroll` `scrollIntoView`) or split into multiple images.
- **Overlay obstruction:** Capture includes a hover tooltip, **Related Assets** popover, or join panel that hides the column/table the step names.
- **Empty-lineage primary example:** Guide promises tracing **Parents** to warehouse tables but the demo dashboard has no populated lineage—pick a different end-to-end example or document missing lineage as the finding, not as a workaround path.

---

## Screenshot–guide alignment (mandatory when images are used)

Readers treat screenshots as proof. **Placement under the right step is not enough**—the pixels must match what the step says.

### What must align (per image)

For each `<img>` immediately under a numbered step (or under the prose block that step introduces), confirm:

| Check | Guide source | Must appear in screenshot (or alt, if quoting UI) |
|-------|----------------|---------------------------------------------------|
| **Asset identity** | Metric, dashboard, table, column, integration, folder, or Knowledge page named in the step or intro **example assets** line | Page title, breadcrumb, selected left-nav row, or list row highlight |
| **Control labels** | Verbs and **bold** control names in the step ("click **Save**", "open **Metrics Glossary**") | Exact button, tab, or menu label visible in the crop; if the product uses a different label, **change the step** to the real label |
| **Page / section** | Nav path (`**Knowledge**` > **Metrics Glossary**), URL implied by the step | Left nav selection, breadcrumbs, active tab |
| **Scenario thread** | Example assets named in intro, **What You Will Accomplish**, or **Checkpoint** | Same names across all screenshots in that investigation—do not mix two demo cases in one guide |
| **Alt text** | `alt="…"` on the `<img>` | Factual description of what is visible; no asset the image does not show |

**Fail** alignment when any row disagrees. **Fix** by (1) re-capturing after navigating to the asset named in prose, or (2) revising prose and alt to match what you can prove in the live UI—never leave prose and image telling different stories.

### Author workflow (Step 1b + pre-save)

1. In the walk plan, add **`screenshot_shows`** per planned file: primary title, key labels, active tab, one list row name.
2. **Capture only after** the UI displays the asset named in the plan—do not screenshot a placeholder row or default page and fix the text later.
3. After each `browser_take_screenshot`, record **visible evidence** in scratch notes (browser title, H1/page name, button text).
4. **Pre-save alignment gate:** For every `src="/img/…"` in the draft, **open the PNG file** and read the adjacent numbered step + `alt`. Resolve mismatches before save (re-walk + re-capture, or rewrite step and alt). **Alt must not claim content below the fold unless you scrolled it into view before capture.**
5. In **scenario-driven** guides, state **example assets** once (intro or **What You Will Accomplish**) and ensure every screenshot uses that same demo set. **Verify lineage** for the chosen dashboard before locking the example thread.

### Verifier workflow (tier 1 + tier 3)

1. **Static pass (tier 1):** Build a **Screenshot alignment** table: `Step ID` → image path → quoted prose claims → `Pass` / `Fail` with mismatch type (`asset_name`, `control_label`, `nav_section`, `alt_drift`, `wrong_page`, `viewport_drift`, `overlay_obstruction`, `collapsed_lineage`, `scenario_thread`).
2. **Read each image file** under `static/img/…` (vision or careful inspection)—do not assume filenames imply content.
3. **Tier 3:** When re-walking `ui_coalesce` steps, confirm the live UI still matches both prose **and** the committed screenshot; if product drifted, **Fail** and require re-capture.
4. Any **`Fail`** on a user-facing screenshot alignment row forces overall **FAIL** (same severity as a wrong procedure step).

### Mismatch types (for reports)

| Type | Example |
|------|---------|
| `asset_name` | Step opens **Churn Rate**; image shows **Average Revenue Per Customer (ARPC)** |
| `control_label` | Step says click **Save**; button in image is **Done** |
| `nav_section` | Step says **Data** > **Tables**; nav shows **Dashboards** selected |
| `wrong_page` | Step says open dashboard detail; image is still the hub list |
| `alt_drift` | Alt mentions **Tasty Franchise Sales**; crop shows another dashboard row |
| `viewport_drift` | Alt cites formula on Knowledge **Read me**; image shows only **Overview** at page top |
| `overlay_obstruction` | Step names **FARE_AMOUNT**; PNG shows a join/**Related Assets** popover over the column list |
| `collapsed_lineage` | Step says expand **Parents**; PNG shows collapsed "3 Tables" group without named tables |
| `scenario_thread` | Intro cites metric A; Step 4 screenshot shows metric B without telling the reader to substitute |

---

## Author pre-save checklist

Before saving a guide draft, confirm:

- [ ] Identified archetype: **hands-on lab** or **use-case / architecture pattern** (see Guide archetypes).
- [ ] **Discovery / investigation / Catalog trace topics:** used **scenario-driven hands-on lab** shape (opening scenario, **What You Will Accomplish**, linear steps, **Checkpoint**, synthesis)—not a product-area tour.
- [ ] Read this rubric and skimmed at least one in-repo exemplar (`using-incremental-nodes.md` or marketplace guide for UI density; **trace-metrics-and-dashboards-in-catalog.md** for scenario-driven Catalog labs; **incremental-loading-strategies.md** for pattern guides).
- [ ] For **pattern** guides: research covered Coalesce sources **and** external domain context where needed; ticket/customer facts not copied verbatim into the draft.
- [ ] For **pattern** guides: includes decision criteria, limits or what to avoid, **and** major procedure steps as their own `##` headings (`## Step 1: …` or action titles) with numbered lists inside—not `###` under one **Implementation** `##`. Fit/shape/limits live under **one** overview `##` with `###` subheadings. Headings must **not** be **When to Use This Pattern**, **Recommended Pattern**, or **Anti-Patterns and Limits**.
- [ ] **Before You Begin** is short (about four to six bullets or equivalent); long vendor signup is linked out unless this is an onboarding lab.
- [ ] No new **About Coalesce** (or similar) multi-section product essay.
- [ ] Every major `##` procedure has a lead-in sentence plus numbered steps.
- [ ] Each numbered step has at least one of: screenshot, full code block, or expected outcome.
- [ ] Every numbered step that navigates to a **new page** has a screenshot placed **immediately after** that step (captured in author Step 1b when UI is in scope).
- [ ] Coalesce UI steps name exact controls and menu paths; no collapsed multi-action steps.
- [ ] Code blocks are complete (no procedural ellipses).
- [ ] No forbidden summarization phrases (see Anti-patterns).
- [ ] Product claims are proven by docs/research or removed.
- [ ] Front matter includes `title`, `description`, `keywords`.
- [ ] Screenshot plan documented (captures done or TODO list in post-save message)
- [ ] **Screenshot–guide alignment:** Every `src="/img/…"` matches the adjacent step (asset names, **bold** control labels, nav section, scenario example assets) and `alt` describes only what is visible—**open each PNG on disk** before save
- [ ] **Catalog trace guides:** example dashboard has **populated lineage** walked live; separate screenshots for same-URL regions when steps cite **Pinned Assets**, **Technical Definition** formula, or expanded **Parents**
- [ ] If the guide includes Transform/Catalog/Quality UI: **Step 1b** browser walk (or app-code proof) completed before save, or **`## Authoring blocked (UI grounding)`** returned without inventing click paths.
- [ ] **Transform Join fidelity:** Implementation Join/Mapping blocks match **live** Node Join (and non-passthrough Mapping transforms) after Create/Run succeeded—not paraphrases. Join strings that need CTEs/`UNION ALL` use `FROM ( … )` wrapping when that is what Coalesce requires.
- [ ] **Node Type selection:** Guide names the Node Types actually used; if Stage is used for simplicity, production alternatives (Fact, Pivot, View, Dimension, Work, platform Base/Functional packages) are disclosed with a link to [Choosing the Right Node](../../docs/marketplace/choosing-the-right-node/index.md).
- [ ] **Graph path honesty:** Required Sources/Nodes match what Join SQL references; Copilot leftovers are omitted or labeled optional; no invented catalog→engine edges.
- [ ] **Preview outcomes:** Row counts and sample values cited in prose match live Preview (or handoff execution proof).
- [ ] **Seed / join-key integrity:** Every seeded join key used in demo SQL exists in the upstream Preview grain; claims that deltas/lookups "apply" are proven on the consumer Preview; decorative non-key columns are labeled as such.

---

## Verifier: step classification

Build the **Step verification matrix** from **every numbered list item** under procedure headings, plus prerequisites and fenced code blocks.

| Class | Meaning | Tier 3 UI walk? |
|-------|---------|-----------------|
| `ui_coalesce` | Click path in **Transform**, **Catalog** (`app.castordoc.com`, `app.us.castordoc.com`), or **Quality** | **Yes**, mandatory sequential walk |
| `ui_external` | Snowflake signup, Databricks account creation, third-party dashboards outside Coalesce apps | **No**. Mark **Assumed complete** (reader already has accounts). Verify via docs/links only. |
| `code` | Fenced SQL, Jinja, YAML, shell | Static review (Tier 2 + Step 4); no warehouse execution claim without sandbox |
| `doc_link` | Relative `/docs/` links, anchors | No (Tier 1 link check) |
| `editorial` | Style, Vale, headings | No (verify **Step 5** editorial pass only) |
| `pattern_claim` | Design criteria, when-to-split, workarounds, limits (no single UI click) | No (Tier 1–2 only: docs, package code); **Fail** if invented or contradicted by sources; **Cannot verify** only when research is blocked, not for fabricated claims |

Matrix columns: `Step ID`, `Class`, `Claim`, `Verification method`, `Evidence`, `Result` (`Pass`, `Fail`, `Cannot verify`).

**`Result` values:**

- **`Pass`** — Claim verified with evidence.
- **`Fail`** — Guide content is wrong, **invented**, contradicted by sources, or a **`ui_coalesce`** walkthrough step could not be completed after **Path discovery** (fail-fast stops here; do not mark later UI steps). **`pattern_claim`** rows with no supporting source are **Fail**, not **Cannot verify**.
- **`Cannot verify`** — Blocked after targeted research (missing UI details, no warehouse sandbox, incomplete ticket context)—not for fabricated claims. Use in the matrix and in **Risks**; triggers author **research follow-up** before revision. Do **not** use `Cannot verify` for later `ui_coalesce` rows skipped after fail-fast (omit those rows or note "not attempted" in **Risks** only).

**Pattern guides:** Every **Implementation** numbered step that touches Coalesce UI must still be `ui_coalesce` when tier 3 runs. Decision and anti-pattern bullets are `pattern_claim` unless they include a verifiable UI or code action.

---

## Path discovery (mandatory before fail-fast on missing controls)

When a guide step names a menu path or control that is **not visible** on the current page, do **not** stop immediately and do **not** skip tier 3 in favor of code-only checks. Enter **path discovery** first.

**Hard blockers (fail-fast immediately, no discovery):** `browser_unavailable`, `login`, `permission`, `iframe`, `environment` (feature flag off for entire surface).

**Path discovery eligible:** control or destination not found at the stated location; label text differs slightly; nav section collapsed; guide or canonical `docs/` path may be stale.

### Discovery workflow (author Step 1b and verifier tier 3)

For each blocked **`ui_coalesce`** step:

1. **Snapshot the whole shell** — left nav, top bar, breadcrumbs, page search, workspace/project switcher. Expand **every** collapsed nav group on the current product surface before concluding a item is missing.
2. **Try alternate routes in order** (fresh `browser_snapshot` after each navigation):
   - In-app **global search** (Catalog home search, Transform search, etc.) for the asset or feature name from the step.
   - **Sibling nav sections** — if the guide says **Home > Marketplace**, also try **Data**, **Build**, **Packages**, **Settings**, and other top-level items; open submenus under each.
   - **Breadcrumb back** — return to hub, re-enter via a different parent (for example **Data > Marketplace** instead of **Home > Marketplace**).
   - **Deep links from code** — GitHub/GitLab search for route paths, sidebar config, and menu label strings tied to the feature.
   - **Canonical docs cross-check** — grep `docs/` for the same feature; if another page documents a different path, **walk that path too**.
3. **Log every hypothesis** in scratch notes: `tried: Home > Marketplace (control missing) → Data > Marketplace (found)`.
4. **Budget:** up to **12 distinct navigation attempts** per step (each attempt = new parent section, search query, or code-suggested route). If still blocked, fail-fast with blocker type **`path_discovery_exhausted`** (not `missing_ui` alone).

**When discovery finds the correct path:**

1. **Update the guide** numbered steps and **`>` menu paths** to the verified route. Quote **bold** labels from the live UI.
2. **Re-capture** any screenshot whose nav selection, breadcrumbs, or hub view no longer match the verified path (**stale screenshot**).
3. **Record documentation drift** (see below) for every conflicting path in `docs/` or in the guide's own earlier draft text.
4. Mark the matrix row **`Pass`** with evidence: `Verified path: … (guide said …)`.

**Forbidden during discovery:**

- Declaring tier 3 "blocked" after one failed click without expanding nav or trying sibling sections.
- Marking **`ui_coalesce`** rows **`Pass`** from app code alone when the browser is available — code confirms labels; **live navigation proves the reader path**.
- Leaving the guide on a path you did not walk in the browser.

---

## Documentation drift (verified UI vs existing docs)

When live UI proves a path, label, or screen layout that **differs** from the guide draft or from other pages under `docs/`:

### In the guide being authored or revised

- Use the **verified** path in numbered steps (source of truth is live UI + code, not stale docs).
- When readers may have seen the old path elsewhere in `docs.coalesce.io`, add a short end-user **`:::info[Navigation note]`** callout **once per drift pattern** (not per step): state the **correct** path and the **outdated** path readers might expect (for example "Some pages still say **Home > Marketplace**. In the app today, open **Data > Marketplace**.").
- Do **not** paste internal file paths, ticket keys, or "this doc is wrong" meta-commentary in user-facing prose.

### In verification / author chat reports (mandatory)

Add a **`### Documentation drift`** subsection listing:

| Type | Verified (live UI) | Conflicts with | Action |
|------|-------------------|----------------|--------|
| `nav_path` | Correct menu path | Guide excerpt or `docs/…` path | Guide updated; list doc files needing separate editorial fix |
| `control_label` | Actual button/tab text | Guide or canonical doc label | Guide updated; list affected doc files |
| `stale_screenshot` | Current nav/asset in browser | PNG under `static/img/…` or `<img>` in guide/other docs | Re-capture for this guide; list other docs reusing the same asset |

Grep `docs/` for the **old** path string or control label when drift is found; include every matching file in **Conflicts with**. These are **follow-up doc updates**, not blockers to PASS on the guide if the guide itself is corrected and screenshots re-captured.

---

## Verifier: UI walkthrough scope and rules

**In scope for live browser walkthrough:** Transform, Catalog, Quality (Coalesce apps).

**Out of scope for browser walkthrough:** External vendor signup and account creation (Snowflake trial, Databricks signup, Partner Connect marketing flows). Assume the reader completed those before the Coalesce procedures.

**When any `ui_coalesce` rows exist:**

1. Tier 3 is **required** unless the user explicitly passed `no ui verify` in Step 0 (overall **FAIL** for guides with Coalesce UI procedures if tier 3 is skipped without that scope). **Do not substitute** tier 2 code search for tier 3 when the browser works.
2. Navigate to login; pause once per product surface for the user to complete SSO/MFA manually (no secrets in chat or draft).
3. Execute matrix rows **in document order** for `ui_coalesce` only — **perform each click in the browser**, not as a desk review.
4. When a step's stated path fails, run **Path discovery** (above) before fail-fast. Only stop on hard blockers or **`path_discovery_exhausted`**.
5. On discovery success, update the guide (chained author revision) or hand off **Required edits** with verified path + **Documentation drift** table + stale screenshot re-capture list.
6. Catalog walks: follow [`.cursor/skills/catalog-ui-screenshots/SKILL.md`](../skills/catalog-ui-screenshots/SKILL.md) (fresh snapshot after navigation, expand nav trees).

**PASS rule:** **PASS** only when all **`ui_coalesce`** rows are `Pass`, all **`code`** / **`doc_link`** / critical **`pattern_claim`** rows are `Pass` or documented static-review limits, editorial (**Step 5**) is acceptable, and no unresolved **`Cannot verify`** rows remain for user-facing claims—unless the user scoped verification to **tiers 1–2 only** or passed **`no ui verify`** in Step 0 (skipped **`ui_coalesce`** rows are noted in **Risks**, not auto-**Fail**). Any **`Cannot verify`** on a critical claim keeps overall verdict **FAIL** until research closes the gap or the guide is revised.

---

## Walkthrough blocked at step (fail-fast report)

When tier 3 stops on a blocked step, include this block in **`## Docs guide verification report`** and in **`## Handoff for docs-agent-guide-author (revision)`**:

```markdown
## Walkthrough blocked at step

- **Step ID**: (e.g. Step 14 under "Installing Packages")
- **Guide heading**: …
- **Expected action**: …
- **Attempted**: (URL, control clicked, snapshot note)
- **Observed**: (missing control, wrong label, error text, login wall)
- **Blocker type**: `login` | `missing_ui` | `label_mismatch` | `permission` | `iframe` | `environment` | `path_discovery_exhausted`
- **Path discovery log** (when applicable): bulleted list of every nav hypothesis tried (section > item > outcome)
- **Needed to continue**: (exact label text, role, feature flag, screenshot from author, URL, test workspace)
```

When **`path_discovery_exhausted`**, include the full **Path discovery log** so the human can see the agent explored the app rather than stopping at the first miss.

---

## Verifier pre-report checklist

- [ ] Read this rubric in full.
- [ ] **Screenshot alignment** table completed for every `<img>` (static read of PNG + adjacent step prose **and** live UI during tier 3 when browser ran); no `Fail` rows left unaddressed
- [ ] Matrix includes every numbered procedure step with `Class` set.
- [ ] `ui_external` rows not browser-walked; `ui_coalesce` rows **clicked through in the browser** in order if tier 3 runs.
- [ ] Path discovery run for every step where the stated nav path failed (log attached or "N/A — all steps matched first try").
- [ ] **Documentation drift** table filled when verified UI differs from guide text or other `docs/` pages.
- [ ] Fail-fast report emitted only after path discovery exhausted or on hard blockers (if any).
- [ ] Tier 1 links validated; Tier 2 mismatches mapped to Step IDs.
- [ ] Editorial/Vale pass noted in report.
