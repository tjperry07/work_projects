# Fix Style (complements Vale)

## Description

Applies grammar, spelling, style guide, and vocabulary from .styleguide. Use when Vale passes but you want human-level polish.

## Prompt

Apply Coalesce style guide to the selected text. Fix what Vale can't catch:

- **Grammar**: Contractions, Oxford comma, active voice, no exclamation points, no "via" (use with/using/through), no parenthetical plurals, no slashes (use "or")
- **Spelling**: Per .styleguide vocabulary (data set not dataset, lifecycle, codebase, healthcare, etc.)
- **Vocabulary**: Capitalize Coalesce terms (Workspace, Node, Packages, Project, Job Schedule, Catalog). Use "version control" where "Git" might confuse. Git (capital G) when referring to the product. On pages that mention both, write **Coalesce Marketplace** for Packages and **Snowflake Marketplace** for trial signup; never bare **Marketplace** or **the marketplace**. For Snowflake trial signup only, use the verbatim sentence and prerequisite note in `.cursor/rules/docs-writing.mdc` (**Snowflake trial signup**); link **Snowflake Marketplace listing** to `https://app.snowflake.com/marketplace/listing/GZSTZ1868F5RH/coalesce-coalesce`.
- **Style**: Friendly, helpful, professional tone. Use "you" not "user" or "customer."

Reference .styleguide and .github/styles/config/vocabularies/docs/accept.txt for vocabulary. Preserve code blocks, links, and technical accuracy. Output only the corrected text.
