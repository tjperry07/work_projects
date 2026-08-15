# Docs Agent: Run All Checks

## Description

Runs a full check on the selected text or the current file in **three phases**: first against the Coalesce style guides and manual checklist (structure, links, vocabulary, grammar, formatting, style, readability, **repetition and redundancy**, and **guide-specific shape** when the file is under `docs/guides/`), then Vale, then Markdownlint. Reports every issue in one consolidated list. Use before publishing or when you want a full review. This agent complements **docs-agent-write** (which self-checks during generation) by providing an independent review on any file, whether AI-generated or human-written.

When invoked from **`/docs-agent-guide-loop`** Phase C (after **`/docs-agent-guide-verify`** **PASS**), treat the target as a **verified guide runbook**: run **Preflight** and **Phase 1 — Guides** in full, then Vale and Markdownlint. Product accuracy and UI steps were validated in the verify loop; flag only editorial or structural issues here unless a fix would change product claims (then recommend re-verify).

## Prompt

**The short checklist below is a summary only.** Vocabulary, tone, and many style rules live in the full **Word List** and other sections of the primary style guide. You must complete **Preflight** every time you run this check, then **apply** those sources when reviewing the target file—not from memory and not from the summary bullets alone.

### Preflight — read canonical sources in full (required, before Phase 1)

Read each file from start to end. If a file is long, use multiple read operations until you have read the last section; do not skip the **Vocabulary** / **Word List** table, **Product Names**, **Links**, or appendices.

1. **Primary style guide:** `.styleguide/Style Guide 240a1c3d458581c1a37ac73bbd576011.md` — includes Voice and Tone, Perspective, Grammar and Punctuation, Capitalization, Product Names, and the full **Word List** (alphabetical table). This is the source of truth for vocabulary and most editorial rules.
2. **Docusaurus and repo conventions:** `.cursor/rules/docs-writing.mdc` — structure, chooser docs, links, callouts, strategy sections not fully duplicated in the Notion export.
3. **Doc structure template:** `.styleguide/documentation-template.md` — front matter, headings, lists, media, callouts, link patterns.
4. **Guides template (when the target is under `docs/guides/`):** `.styleguide/guides-template.md` — guide archetypes, section order, prerequisites, procedures, screenshots, endings; read in full. Also read `.cursor/reference/guide-quality-rubric.md` in full for runbook density, anti-patterns, and archetype rules (scenario-driven Catalog labs, pattern guides, UI screenshot cadence).
5. **Vale accepted terms:** `.github/styles/config/vocabularies/docs/accept.txt` — read the full list; use it together with the style guide Word List (Vale allows these spellings; the Word List still governs phrasing, capitalization, and “use X not Y” rules).
6. **Vocabulary and capitalization scan list:** `.cursor/reference/docs-vocabulary-capitalization-checklist.md` — mandatory Coalesce feature forms, **re-create / re-creation** hyphenation, link-text casing, heading rules for Vale `Coalesce.Headings`, and grep patterns to run on every target file.

**After Preflight, implement the style guide during the review:** Walk the target file and, for terms and product names that appear in the doc, cross-check them against the **Word List**, `accept.txt`, and **docs-vocabulary-capitalization-checklist.md**. Flag **dataset** vs **data set**, **Git** vs **version control**, **Coalesce App** vs bare **App**, e.g./i.e., and any other entry that applies. Do not limit vocabulary checks to the few examples in Phase 1; treat the full Word List as the checklist for words that occur in the file. **Run the mandatory grep scans** in the checklist (or equivalent search) on the target path before Phase 2; report every match that violates the Wrong → Right tables unless it is inside code or a verbatim product string.

**Order of operations (required)**

1. **Preflight** — Complete all reads above before commenting on the target file.
2. **Phase 1 — Style guides and manual review:** Work through every checklist block below from **Phase 1 — Structure** through **Phase 1 — Guides** (when the target path is under `docs/guides/`), **Phase 1 — Prerequisites and administrator roles**, **Phase 1 — Repetition and redundancy**, then **Phase 1 — Style and readability**. Confirm the doc meets rules from the **full** sources you just read, scan for issues Vale does not cover (for example decorative `**bold**` in prose or repeated explanations), and list or fix findings. Phase 1 is the source of truth for structure, links, vocabulary, grammar, formatting, tone, guide shape, and redundancy **as defined in those files**, not only the abbreviated bullets here.
3. **Phase 2 — Vale (shell required):** Only after Phase 1 is complete, **run in the terminal** (do not skip or substitute memory):

   ```bash
   vale path/to/file.md
   ```

   Report every Vale error, warning, and suggestion with rule name. If Vale flags something Phase 1 already caught, note it once under Vale. **Do not proceed to Phase 3 until this command has been executed** (or report a blocker if Vale is not installed).

4. **Phase 3 — Markdownlint (shell required):** Only after Phase 2 is complete, **run in the terminal** (do not skip, defer, or assume Vale covers Markdownlint):

   ```bash
   npx markdownlint-cli2 "path/to/file.md"
   ```

   Config: `.markdownlint.json` (or `.markdownlint-cli2.jsonc`). Report **every** error and warning with rule ID and line number (for example `MD053/link-image-reference-definitions` at line 415). If Markdownlint flags something Phase 1 or Vale already caught, note it once under Markdownlint. **Do not report "Looks good" until this command exits with zero errors** (or report a blocker if `npx` is unavailable).

**Completion gate:** A check-all run is **incomplete** unless you executed **both** shell commands above on the target file. Passing Vale alone is **not** sufficient. When fixing issues, re-run **both** Vale and Markdownlint before closing the run.

For each issue: quote the problematic text, state the rule (cite the style guide section, `docs-writing.mdc`, `guides-template.md`, `guide-quality-rubric.md`, `accept.txt`, Vale rule, or Markdownlint rule ID when helpful), and suggest a correction. Group issues by category (Structure, Guides, Links, Vocabulary, Grammar, Formatting, Repetition, Style, Vale, Markdownlint). If no issues remain after all three phases **and both linters exit clean**, say "Looks good."

---

**Phase 1 — Structure — from .styleguide/documentation-template.md**
- Front matter has title, description, and keywords
- Doc starts with an introduction, not "Overview". **Exception for `docs/guides/`:** introduction copy must live under the first `##` (see **Phase 1 — Guides**, **Start with H2**); do not treat unheaded paragraphs before the first `##` as an acceptable intro.
- **No faux headings:** Do not use a plain paragraph that starts with a bold pseudo-title on the same line as the rest of the sentence. That includes `**Some Title.**` plus more text, `**Some title:**` plus more text, and `**Label** -` plus more text unless the line is a **list item** (starts with `-` or a number) or the bold label is a **real Markdown heading** with explanation below. Do not stack several consecutive standalone paragraphs that open with `**Label:**` and continue with explanation. Use `### Title Case` (or `####`) with a body paragraph, or a bullet or numbered list with a lead-in. For multiple labeled options on one list, use `- **Label** - explanation` (spaced hyphen, not an em dash) or plain bullets. A single **Term:** glossary-style definition may appear inside one normal paragraph when it is truly one short definition, not as a repeated paragraph opener. See `.cursor/rules/docs-writing.mdc` (**Lists**).
- Every heading has introductory content before subsections or lists
- **Docusaurus:** Do not use custom Markdown heading anchors (`## Title {#custom-id}`). Docusaurus generates IDs from the heading text. Flag any `{#...}` on headings; remove them and fix links to use `#slug-from-heading` on the doc path (for example `/docs/setup-your-project/setup-version-control#add-your-token-and-repo-to-coalesce`).
- Headings use title case and no periods per AP guidelines
- **Headings:** Do not use a plus sign `+` to join phrases or parenthetical asides in the heading (for example not `### Foo + Bar (Variant)`). Use **and**, commas, or move qualifiers such as "most common" into the paragraph under the heading. Applies to scenario-style `###` subheadings and similar.
- Lists have introductory sentences or colons
- Images have descriptive alt text and `className="mdImages"`
- "What's Next?" section (if present) is at the end only, in bullet list format
- **No horizontal rules:** Do not use horizontal lines in the document body. Flag any standalone `---`, `***`, or `___` line used as a thematic break or separator, including before link reference definitions at the bottom. Remove those lines when fixing; one blank line before the first `[Link text]: url` definition is enough. **Exception:** YAML front matter delimiters at the top of the file (`---` opening and closing the front matter block) are required and are not horizontal rules.
- Link reference definitions are at the bottom of the file, after "What's Next?" if present, with no `---` separator before them

**Phase 1 — Links**
- Links use reference-style: `[Link text][]` in body, `[Link text]: url` at bottom. Flag any inline `[text](url)` links and suggest converting to reference-style.
- **Internal doc links:** In pages under `docs/` (not release notes), use root-relative paths such as `/docs/deploy-and-refresh/parameters/rtp-default`. Flag full `https://docs.coalesce.io/docs/...` URLs and suggest the equivalent `/docs/...` path.
- **Release notes** (`_drafts/release-notes-*.md` or similar): Doc links must be **absolute** (`https://docs.coalesce.io/docs/...`). Flag root-relative `/docs/...` links in release notes and suggest the full URL.
- URLs never end with `index`: for `index.md` files use `/docs/catalog/integrations`, not `/docs/catalog/integrations/index`. Flag and fix any links that end with `index`.
- Link text describes the destination. Flag "click here," "here," or other non-descriptive link text.

**Phase 1 — Vocabulary, capitalization, and hyphenation — US English**

Apply the **full Word List** and **`.cursor/reference/docs-vocabulary-capitalization-checklist.md`**. Vale does **not** enforce most Coalesce feature capitalization; this block is mandatory manual review, not optional.

- **Mandatory scan:** Run the grep patterns in the checklist (or search the file for the same strings). Review **front matter** `title`, `description`, and `keywords` with the same rules as body copy.
- **Coalesce features (capitalize in prose):** Workspace, Project, Environment, Node, Nodes, **Node Types**, **Base Node Types**, **Node Type**, Package, Packages, Job Schedule, Jobs, Catalog, Subgraph, Custom Node, Org, **Storage Location**, **Storage Mapping**, **Storage Mappings**, **Deploy Wizard**, **Coalesce Marketplace**, **Presync**, **Advanced Deploy**, **Create or Alter Package** (including link reference names). Flag lowercase forms such as `node types`, `Deploy wizard`, bare `Marketplace`, `the marketplace`, `presync`, and `package` when meaning a Coalesce Package.
- **Coalesce Marketplace vs Snowflake Marketplace:** On pages that cover in-product Packages and Snowflake trial signup, flag bare **Marketplace** or **the marketplace**. Require **Coalesce Marketplace** for Packages and **Snowflake Marketplace** for trial signup. See `.cursor/rules/docs-writing.mdc`.
- **Snowflake trial signup (Snowflake only):** When a page references Snowflake trial signup, require the verbatim sentence "Start a free Coalesce trial from our Snowflake Marketplace listing." with **Snowflake Marketplace listing** linked to `https://app.snowflake.com/marketplace/listing/GZSTZ1868F5RH/coalesce-coalesce`, and the ACCOUNTADMIN/verified-email prerequisite note in signup or prerequisite sections. See `.cursor/rules/docs-writing.mdc` (**Snowflake trial signup**).
- **re-create / re-creation (Word List):** Verbs **re-create**, **re-creates**, **re-created**; noun **re-creation** in body copy; compounds **drop-and-re-create**. Flag unhyphenated `recreate`, `recreation`, `recreates`, `recreated`. In **H2/H3 headings**, use AP title case on hyphenated words: **Re-Creation**, **Re-Creates** (Vale `Coalesce.Headings` errors on `Re-creation` in headings).
- **Link text casing:** Reference names must match preferred forms, for example `[Create or Alter Package][]` not `[Create or Alter package][]`. Link text should match the target page `title` when cross-linking. Every `[text][]` needs a bottom `[text]:` definition (**MD052**).
- Per `.github/styles/config/vocabularies/docs/accept.txt` (spelling allowance only; Word List governs phrasing and capitalization)
- Spelling: US English; also flag **data set** not dataset, lifecycle, codebase, healthcare
- Product names: Git not git, OAuth not oauth
- Use "version control" instead of "Git" where it might confuse (people associate Git with GitHub)
- Use "Coalesce App" not "App" standalone
- "e.g." should be "for example"; "i.e." should be "that is"
- Headings: **versus** not **vs** (Word List / Vale); AP title case, no periods

**Phase 1 — Grammar**
- Use contractions, Oxford comma, active voice
- No exclamation points, no "please," no "via" (use "with," "using," or "through"). No slashes (use "or")
- **Never use em dashes** `—`. Use commas, colons, or rephrase instead.
- **No Unicode arrows** `→`. Use `>` for UI paths (for example, **Source > Database > Schema**).
- **Never use parentheses in body copy** except inside **math** or **code** (fenced code blocks or inline backticks). Rephrase with commas, colons, or separate sentences. That includes optional-plural shortcuts like "item(s)"; spell out the wording instead.
- **Do not use `+` to join words or phrases** in body copy or headings (for example not `Batch Jobs + Timestamp` meaning "Batch Jobs and Timestamp"). Use **and**, **or**, commas, or restructure. Allow `+` only in math, fenced code, inline code, or where it is literal syntax (for example `CTRL + F`, `SELECT a + b`).
- Avoid italics. Bold for UI elements, definitions, and important information.
- Use "you" not "user" or "customer"
- All numbers written numerically (1 Node, not "one Node"). "Data" is singular.

**Phase 1 — Formatting**
- **Horizontal rules:** Same as Structure (**No horizontal rules**). Scan the full file for `---` / `***` / `___` on their own line outside front matter; Vale and Markdownlint may not flag them.
- Callouts use `:::info[Title]`, `:::tip[Title]`, `:::warning[Title]` with a descriptive title in brackets. "Note" or "Info" alone is not descriptive. Flag callouts without titles or with generic titles.
- Maximum 2 callouts per page. Flag stacked callouts (callouts placed back-to-back).
- Code blocks specify a language.
- **Bold — allowed uses:** UI elements and paths in steps (for example click **Build Settings**, **User Settings > Account and Security**), troubleshooting scaffold labels that stand alone before a list (**What You'll See**, **Solutions**), bold lead-ins on list items that name an action (**Clear Browser Cache**), and optional labels on bullets using `- **Label** - explanation` (list marker required for that pattern; spaced hyphen, not an em dash) after a list lead-in. For glossary-style **Term:** definitions, use at most one short **Term:** clause inside a single paragraph, not stacked **Label:** paragraphs.
- **Bold — flag and fix (decorative or unnecessary):** Running prose that bolds words only for emphasis, including proper nouns or products used as plain nouns (**Snowflake**, **OAuth**, **Catalog** in a sentence), role or audience labels (**SSO users**), or ordinary terms (**access tokens**, **just-in-time**) when the style guide does not require bold there. **Also flag** ordinary adjectives or shorthand before Coalesce terms when the bold is not a UI label, for example `**base** Nodes` should be `base Nodes` unless **base** matches text in the Coalesce App. Prefer normal weight; keep correct capitalization from the vocabulary rules instead of bold. This overlaps with **no faux headings** when a paragraph starts with bold that acts like a mini title before the rest of the sentence; rephrase or use a real heading. Vale does not enforce this rule; you must scan the file for `**` in running prose.

**Phase 1 — Repetition and redundancy**

Apply **docs-writing.mdc** (**Update Over Create**, **Avoid redundancy**, **Consolidate**). Vale does not detect repeated prose; you must read the file for overlap.

**Within the target file**

- **Duplicate or near-duplicate prose:** Flag paragraphs, sentences, or bullets that say the same thing twice (same facts, steps, or warnings in different words). Quote both locations and suggest keeping one canonical block; move unique detail into the survivor or a subheading.
- **Intro vs body:** Flag when the introduction repeats what a later **H2** or procedure section already covers in full. The intro should set scope and outcome, not restate every step.
- **Chooser vs deep sections:** On strategy or chooser pages, flag when an early scenario block repeats long explanations that appear again under a later **H2** (for example the same Snowflake/Databricks/BigQuery bullets in the chooser and again in a platform section). Prefer a thin chooser plus links or one deep section.
- **Lists and steps:** Flag repeated bullets, numbered steps, or prerequisites listed in multiple places without a reason (for example **Before You Begin** duplicated under every provider H2 when one shared block suffices).
- **Callouts:** Flag callouts that repeat body copy or each other. Remind: maximum 2 callouts per page; no back-to-back callouts.
- **What's Next?** Flag links or bullets that only repeat topics already explained on the page with no new angle. Prefer links to **next** tasks or deeper docs, not a second copy of the same how-to.
- **Glossary-style repetition:** Flag the same term defined or explained in multiple sections when one definition plus a link is enough.

**Phase 1 — Guides — when the target path is under `docs/guides/`**

Apply `.styleguide/guides-template.md` and `.cursor/reference/guide-quality-rubric.md` in addition to the general structure rules above. Skim at least one in-repo exemplar for the same archetype when judging shape (for example `docs/guides/trace-metrics-and-dashboards-in-catalog.md` for scenario-driven Catalog labs, `docs/guides/using-incremental-nodes.md` for build labs).

- **Start with H2 (required):** After YAML front matter, the body must **start with an H2** (`##`). The page title is H1 from front matter only; never use `#` in the body. Scan from the first line after the closing `---` of front matter: skip only blank lines and optional HTML comment blocks (for example `<!-- vale ... -->`). The **first non-comment line of body content must be a `##` heading**. Flag any paragraphs, callouts, lists, images, imports, or other content before that first `##`. Flag `#` anywhere in the body. Flag `###` or deeper headings that appear before the first `##`. **Why:** Guides under `docs/guides/` render with `QuickstartTOC` (`src/components/QuickstartTOC/index.js`), which builds the step wizard from every `##`; material before the first H2 is outside the step flow and breaks generated guide navigation. **Fix:** Move intro scope, scenario, and callouts into the first `##` section (for example **Before You Start**, **What You Will Accomplish**, or the first procedure heading), or split so the file opens with `##` immediately after front matter, as in `docs/guides/snowflake-quickstart.md`.
- **Archetype:** Identify whether the guide is a **hands-on build lab**, **scenario-driven investigation**, **use-case / architecture pattern**, **extended lab (legacy Overview/About shape)**, or **concept / reference hub**. Flag content that mixes archetypes without reason (for example a feature tour with no scenario or synthesis).
- **Front matter:** `title`, `description`, and `keywords` required. Optional `hide_table_of_contents`, `slug`, `tags`, and `video` should match sibling guides when used; flag missing `slug`/`tags` only when inconsistent with peers in the same folder.
- **Introduction:** **New guides** should not open with `## Overview` or multi-screen **About Coalesce** blocks. Scenario and outcome copy belong **inside** the first `##` section (see **Start with H2**), not as unheaded paragraphs before it. **Legacy rewrites** may keep **Overview** when preserving an existing file the user asked to retain; still flag unheaded intro blocks before the first `##` unless the user explicitly exempts the file from the step wizard.
- **Prerequisites:** `## Before You Begin`, `## Before You Start`, or `## Prerequisites` should stay short (about four to six bullets or equivalent). Flag long vendor signup inlined here when setup docs exist unless the guide is explicitly onboarding.
- **Scenario-driven investigation (Catalog trace, KPI validation, lineage):** Require opening scenario with stakes, **What You Will Accomplish**, linear **Step 1…N** tied to one case, **Checkpoint** after major steps, synthesis table and example stakeholder reply, and **Other ways to start** only as a short secondary section. Flag product-area tours (top-level `##` per surface only) or chooser-first tables as the main body.
- **Build labs:** Action-oriented `##` task sections with lead-in paragraphs; numbered procedures with **one user-visible action per step**; expected outcomes after **Run**, **Create**, deploy, or CLI steps. Flag merged multi-click steps and summarization phrases from the rubric anti-patterns list.
- **Pattern guides:** Require decision criteria, limits or what to avoid where applicable, and executable procedures when the guide promises a pattern—not advice-only prose. Nest fit/shape/limits as `###` under **one** overview `##` (for example **How This Approach Works**). Require each major procedure step as its own `##` (`## Step 1: …` or action title)—**flag** a single **Implementation** `##` that nests `### Step` children. **Flag** three separate `##` pattern overview sections, and banned headings: **When to Use This Pattern**, **Recommended Pattern**, **Anti-Patterns and Limits**.
- **Screenshots and code:** Flag numbered steps that navigate to a **new page** without a screenshot immediately under that step (unless `<!-- TODO: screenshot -->` with a clear capture note). Flag procedural code blocks with `...` ellipses or missing language tags. Images need descriptive `alt` and `className="mdImages"`.
- **Screenshot–guide alignment:** Per `.cursor/reference/guide-quality-rubric.md` (**Screenshot–guide alignment**), flag when adjacent step prose names a different metric, dashboard, table, column, nav section, or **bold** control label than the paired image shows (for example step says **Save**, screenshot shows **Done**; step says **Churn Rate**, screenshot title is **Average Revenue Per Customer**). Flag `alt` text that describes assets not visible in the file. Open PNGs under `static/img/…` when feasible—do not pass on filename assumptions alone.
- **Ending:** One primary ending (`## What's Next?`, **Conclusion**, **Wrap Up**, or **Conclusion and Next Steps**). **What's Next?** must be bullet list format at the end only; flag duplicate link hubs that repeat body procedures without a new angle.
- **Runbook quality:** Flag forbidden anti-patterns from the rubric (for example "configure as needed," "follow similar steps," hedged product claims when docs establish the fact, generic ELT without Coalesce UI paths when controls are known). Also flag banned section titles **Anti-Patterns and Limits**, **Recommended Pattern**, and **When to Use This Pattern**. Also flag major guide steps nested as `###` under **Implementation**.

**Phase 1 — Banned pattern-guide phrases (all doc paths)**

- **Flag** exact headings or labels **Anti-Patterns and Limits**, **Recommended Pattern**, or **When to Use This Pattern** anywhere in the file. Suggest renaming to situation-oriented titles such as **When This Approach Fits**, **How Coalesce Models This**, or **Limits and What to Avoid**. See `.cursor/rules/docs-writing.mdc`.
- **Flag** pattern guides (or similar) that use three separate `##` headings for when-to-use, recommended shape, and limits or anti-patterns. Require one overview `##` with `###` subheadings.
- **Flag** guides that nest major procedure steps as `### Step 1` / `### Step 2` (or equivalent) under a single **Implementation** (or similar) `##`. Each major step must be its own `##`.

**Phase 1 — Prerequisites and administrator roles**

- **Flag standalone "several steps require" warnings:** Paragraphs that open with **Several steps on this page require** (or similar) and list admin roles, then tell readers **If you do not hold those roles, coordinate with someone who does** (or **before you continue**). Remove the paragraph; state the requirement once in **Before You Begin**, **Before you begin**, or **Prerequisites**.
- **Flag deferred "someone with" admin bullets:** In those same prerequisite sections, bullets like **Someone with** *Role* **can** … or **Someone with** *Role* **rights** when the doc also has a separate admin warning paragraph. Consolidate to one line.
- **Preferred pattern (one line in the prerequisite section):** `You need [named role(s)] in [Product] to complete this setup.` or `You need to be a [Product] administrator` (or superuser, when accurate). Examples: `docs/catalog/integrations/data-warehouses/postgres.md`, `docs/catalog/integrations/data-warehouses/salesforce.md`, `docs/catalog/integrations/transformation/dbt/dbt-cloud.md`, `docs/catalog/integrations/data-viz/zoho.md`.
- **Do not** tell readers to coordinate with another person for roles they lack; state what access they need up front so they can confirm it before starting.

**Across the doc set (when the file is under `docs/`)**

- Search `docs/` (exclude `docs/hidden/` unless the target lives there) for the same topic, feature name, and key procedure phrases. Use repo search/read; do not rely on memory.
- **Flag overlap with an existing canonical page:** If another doc already covers the same setup, troubleshooting, or reference material, suggest **updating that doc**, **linking** to it, or **moving** unique content there instead of keeping a second full copy. Cite the existing path (for example `docs/path/to/existing.md`).
- **Acceptable repetition:** Brief reminders at a decision point (for example a one-line warning before a risky step), intentional cross-links, or a short recap that adds a **new** constraint. Say explicitly when repetition is justified.

**Phase 1 — Style and readability**
- Friendly, helpful, professional tone (see primary style guide Voice and Tone)
- Flesch-Kincaid 8-10; plain language
- Apply **docs-writing.mdc** rules for instructional voice, chooser docs, and avoiding negative cross-product comparisons where they apply to this page

**Phase 1 — Troubleshooting placement (when the page is or includes troubleshooting)**
- **Prefer a hybrid pattern (common in mature doc sets):** a short **Common issues** or **Troubleshooting** section at the end of a feature article for the most frequent, simple problems; a **separate** dedicated troubleshooting article or hub for complex, multi-step, or **cross-feature** issues; the feature article **links** to the standalone page for anything that needs depth.
- **Flag likely misplaced content:** very long troubleshooting in a feature doc that should be split out; or a standalone article that is only about one narrow feature and would work better embedded with a link from search still possible.
- **Standalone troubleshooting** is usually the right shape when: the issue spans **multiple** features; the troubleshooting content is long enough to **bury** the main feature doc; readers are likely to land on it **directly** from search or a support ticket; the audience **already knows** the feature and only needs a fix.
- **Embedded troubleshooting** (inside the feature doc) is usually better when: the issues are **tightly scoped** to that one feature; the doc set is **small** and discoverability is a concern; you want to **lower navigation** load; the steps need **deep context** from the surrounding documentation.
- If the page uses the hybrid pattern, confirm the feature article’s short section points to the dedicated article for deeper scenarios (link text should describe the destination).

---

**Phase 2 — Vale**
- **Mandatory:** Execute `vale path/to/file.md` in the shell after Phase 1 (including the vocabulary grep scan). Do not mark Phase 2 done from editor diagnostics or prior runs alone.
- Report every Vale error, warning, and suggestion with rule name. Fix them when the command is run in a fixing context.
- Common rules on Coalesce docs: **`Coalesce.Headings`** (AP title case; hyphenated **Re-Creation** in headings), **`Coalesce.OxfordComma`**, **`Vale.Spelling`**. If Vale passes but Phase 1 vocabulary scans still fail, the file is **not** clean—fix capitalization before reporting "Looks good."
- Vale complements Phase 1; it does not replace manual checks for Coalesce feature capitalization, **re-create** hyphenation, bold misuse, heading `+` or parentheses, full Word List entries, repetition, or other rules called out above as not Vale-enforced.

**Phase 3 — Markdownlint**
- **Mandatory:** Execute `npx markdownlint-cli2 "path/to/file.md"` in the shell after Phase 2 completes. **Vale passing does not satisfy Phase 3.** Skipping Markdownlint invalidates the check-all run.
- Quote the exact file path linted. For a single target file, lint that path only (do not run the full `docs/**/*.md` glob unless the user asks for a repo-wide pass).
- Report every Markdownlint error and warning with rule ID and line number (for example `MD053` unused reference, `MD036` emphasis-as-heading). Fix them when the command is run in a fixing context.
- Config: `.markdownlint.json` (or `.markdownlint-cli2.jsonc`). Markdownlint complements Phases 1 and 2; it does not replace editorial rules (reference-style links, Word List, repetition, decorative bold, horizontal rules, and similar) that Vale also does not enforce.
- If the file starts with `<!-- markdownlint-disable -->` or disables specific rules inline, note that in the report when relevant; do not treat intentional disables as failures unless the disable looks broader than needed.
- **After fixes:** Re-run Vale **and** Markdownlint until both exit with zero errors, or report remaining blockers with command output.
