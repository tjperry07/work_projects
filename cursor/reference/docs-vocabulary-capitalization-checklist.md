# Docs vocabulary and capitalization checklist

Use this reference during **`/docs-agent-check-all`** Phase 1 and **`/docs-agent-write`** Step 5. Vale catches some issues (`Coalesce.Headings`, `Coalesce.OxfordComma`, spelling); **most Coalesce feature capitalization is manual**. Do not pass check-all until you run the scans below on the target file.

Source of truth remains `.styleguide/Style Guide 240a1c3d458581c1a37ac73bbd576011.md` (**Word List**) and `.cursor/rules/docs-writing.mdc`.

---

## Mandatory scan (every check-all run)

Read the target file and grep it (case-sensitive where noted). Flag every hit that is **not** inside a fenced code block, inline backticks, or a literal UI stage name copied from product output.

```bash
# Common lowercase mistakes (review each match in context)
rg -n 'node types|Node types|base node types|Deploy wizard|deploy wizard|\bMarketplace\b|\bthe marketplace\b|\bpackage redeployment\b|\bstorage location\b|\bpresync\b|\brecreat|\brecreation\b' path/to/file.md

# Link reference names with wrong Package casing
rg -n 'Create or Alter package' path/to/file.md
```

Also scan **front matter** `title`, `description`, and `keywords` for the same rules.

---

## Coalesce features — capitalize when referring to the product

| Use | Not |
| --- | --- |
| **Node Types** | node types, Node types |
| **Base Node Types** | base node types, base Node types |
| **Node Type** (singular, when naming the feature) | Node type |
| **Package** / **Packages** (Coalesce Marketplace installable) | package, packages (in Coalesce context) |
| **Workspace**, **Project**, **Environment**, **Node**, **Nodes** | lowercase when meaning the Coalesce feature |
| **Job Schedule**, **Jobs** (Coalesce feature) | job schedule (feature sense) |
| **Storage Location**, **Storage Mapping**, **Storage Mappings** | storage location, storage mapping (feature sense) |
| **Deploy Wizard** (Coalesce UI) | Deploy wizard, deploy wizard |
| **Coalesce Marketplace** | Marketplace alone, the marketplace, marketplace (when meaning in-product Packages) |
| **Snowflake Marketplace** | Marketplace alone, the marketplace, marketplace (when meaning Snowflake trial signup or listings) |
| **Coalesce App** | App alone (unless another vendor App is named) |
| **Presync** (Coalesce deploy reconciliation) | presync |
| **Advanced Deploy** (package or capability name) | advanced deploy |
| **Create or Alter** / **Create or Alter Package** (package name in prose and link text) | Create or Alter package (lowercase package in link labels) |

**Exceptions:** Lowercase is fine for generic English ("a package of changes," "marketplace competition") or inside code, SQL, CLI flags, or verbatim deploy stage strings such as `Edit table description`.

**Coalesce Marketplace vs Snowflake Marketplace (same page):** When a guide discusses in-product Packages and Snowflake trial signup, both full names may appear. Use **Coalesce Marketplace** for Packages ([docs/marketplace](https://docs.coalesce.io/docs/marketplace)). Use **Snowflake Marketplace** for trial signup ([Snowflake docs](https://docs.snowflake.com/en/collaboration/collaboration-marketplace-about)). Never disambiguate with bare **Marketplace** or **the marketplace**.

**Snowflake trial signup (Snowflake only):** Use this sentence verbatim wherever trial signup is referenced: "Start a free Coalesce trial from our Snowflake Marketplace listing." Hyperlink **Snowflake Marketplace listing** to `https://app.snowflake.com/marketplace/listing/GZSTZ1868F5RH/coalesce-coalesce`. In signup or prerequisite sections, add: "To start a Marketplace trial you'll need the ACCOUNTADMIN role (or a role with privileges to create a database, warehouse, user, and role) and a verified email address in Snowflake." Do not apply to non-Snowflake trial paths.

---

## re-create / re-creation (Word List)

Use hyphens so readers do not read "recreation" as leisure activity.

| Use | Not |
| --- | --- |
| re-create, re-creates, re-created (verb) | recreate, recreates, recreated |
| re-creation (noun in body copy) | recreation |
| drop-and-re-create | drop-and-recreate |

**Headings (AP title case + Vale `Coalesce.Headings`):** Hyphenated nouns in H2/H3 use capital on both parts, for example **Re-Creation**, **Re-Creates**, not `Re-creation` in headings.

Body copy and front matter `description` may use sentence-style **re-creation** (lowercase c after hyphen) unless the word starts a sentence.

---

## Link text must match capitalization rules

Reference-style links: `[Link text][]` and `[Link text]: url` must use the same spelling and capitalization.

- Package doc links: `[Create or Alter Package][]`, not `[Create or Alter package][]`.
- Cross-links to troubleshooting or guides: link text should match the target page `title` in front matter (including **Re-creation** in titles when used).

Every `[text][]` in the body needs a matching `[text]:` definition (**Markdownlint MD052**).

---

## Headings and Vale

- **`Coalesce.Headings`:** H2/H3 use AP title case. Watch hyphenated words (**Re-Creation**, **Re-Creates**), **Deploy Wizard** in headings, and **versus** not **vs** in titles.
- **`Coalesce.OxfordComma`:** Serial lists in prose; rephrase "run or schedule" style false positives if Vale misfires.
- **`Vale.Spelling`:** Prefer rephrasing over adding accept.txt unless the term is established product vocabulary.

---

## Quick fix examples (from deploy troubleshooting docs)

| Before | After |
| --- | --- |
| Standard base node types | Standard Base Node Types |
| open the Deploy wizard | open the **Deploy Wizard** |
| in the Marketplace | in the [Coalesce Marketplace][] |
| the marketplace (trial signup) | the [Snowflake Marketplace][] |
| the marketplace (Packages) | the [Coalesce Marketplace][] |
| `[Presync][]` without definition | `[Understanding Presync][]` or add `[Presync]:` at bottom |
| Coalesce recreates the table | Coalesce re-creates the table |
| ## Impact of Table Recreation | ## Impact of Table Re-Creation |
| `[Create or Alter package][]` | `[Create or Alter Package][]` |
| expected storage location | expected **Storage Location** |
| Package-specific Node types | Package-specific Node Types |

---

## When fixing

1. Fix **front matter** (`title`, `description`, `keywords`) first so nav and SEO match body rules.
2. Fix **link text and reference definitions** together so MD052/MD053 stay clean.
3. Update **cross-links in other files** when the target page `title` changes.
4. Re-run **both** linters in the shell before reporting "Looks good":
   - `vale path/to/file.md` — exit code must be 0
   - `npx markdownlint-cli2 "path/to/file.md"` — summary must show 0 error(s)

   Passing Vale alone does **not** complete check-all. Markdownlint catches unused link definitions (MD053), missing languages on fences, heading/list issues, and other rules Vale does not run.
