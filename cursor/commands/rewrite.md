# Rewrite for Clarity and Grammar

## Description

Rewrites the selected text for clarity, grammar, and readability. Complements Vale—focus on what Vale can't fix.

## Prompt

Rewrite the selected text for clarity and grammar. Apply .styleguide rules:

- **Grammar**: Contractions, Oxford comma, active voice, no exclamation points, no "via," no parenthetical plurals
- **Vocabulary**: Use .styleguide Word List (data set, lifecycle, Git vs git, etc.). Capitalize Coalesce terms. On pages that mention both, write **Coalesce Marketplace** for Packages and **Snowflake Marketplace** for trial signup; never bare **Marketplace** or **the marketplace**. For Snowflake trial signup only, use the verbatim sentence and prerequisite note in `.cursor/rules/docs-writing.mdc` (**Snowflake trial signup**); link **Snowflake Marketplace listing** to `https://app.snowflake.com/marketplace/listing/GZSTZ1868F5RH/coalesce-coalesce`.
- **Readability**: Flesch-Kincaid 8–10; plain language; use "you" not "user"
- **Banned phrases**: Never introduce or keep headings/labels **Anti-Patterns and Limits**, **Recommended Pattern**, or **When to Use This Pattern**. Rename to situation-oriented titles (for example **When This Approach Fits**, **How Coalesce Models This**, **Limits and What to Avoid**). If those topics are three separate `##` headings, collapse them under one overview `##` with `###` subheadings. If major guide steps are nested as `###` under **Implementation**, promote each to its own `##`.
- Preserve meaning, code blocks, links, and technical accuracy

Output only the rewritten text.
