# Insert Markdown CSV

## Description

Inserts a pre-made markdown csv block at the cursor location, exactly as written, regardless of whether other markdown csv blocks already exist in the file.
Builds a table from CSV/JSON data and renders cell markdown. Table too big, use a csv.

## Prompt

Insert this at the cursor location, with no modifications, checks, or extra context:

<MarkdownTable filePath="/data/table.csv" />