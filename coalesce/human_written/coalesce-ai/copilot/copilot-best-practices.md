---
title: Copilot Best Practices and Limitations
description: Coalesce Copilot Best Practices and Limitations provides guidance for using AI-assisted data modeling effectively within the Coalesce platform. Learn how to review generated Nodes, apply version control safeguards, validate configurations, collaborate with your team, and understand Copilot's capabilities and constraints across Workspace operations, data governance, and advanced customization. This page helps you achieve accurate, reliable, and secure results when building data pipelines with Copilot.
keywords: [
  "Coalesce Copilot best practices",
  "Copilot limitations",
  "Coalesce validation checklist",
  "Copilot review workflow",
  "version control checkpoints",
  "Coalesce Node configuration",
  "Copilot team collaboration",
  "Copilot governance guidelines",
  "Coalesce security considerations",
  "AI prompt best practices",
  "Copilot accuracy tracking",
  "Coalesce Workspace metadata",
  "Copilot safety guidance",
  "Coalesce Node validation",
  "Copilot operational limits",
  "Workspace-level restrictions",
  "Coalesce data governance",
  "Copilot advanced configuration limits",
  "Coalesce DAG creation rules",
  "Copilot troubleshooting tips"
]
---

<!-- vale off -->

This guide covers recommended practices for working with Coalesce Copilot effectively, along with its current limitations. Following these guidelines helps you get the best results while avoiding common pitfalls.

## Copilot Is Evolving

As with any AI-powered tool, Copilot is under active development. We regularly ship improvements based on feedback and testing, but you may occasionally encounter:

- Unexpected Node configurations or SQL outputs.
- Intermittent service interruptions.
- Changes to available capabilities as we refine features.

## Always Review and Verify

:::warning Review Before Deployment
Examine all generated SQL, Node configurations, and transformations before deploying to production. Test changes in a development environment first.
:::

**Before deploying Copilot-generated work, verify:**

- Business logic matches your requirements
- Generated code follows your organization's standards
- Column mappings and transformations are accurate
- Join conditions and relationships are correct
- SQL syntax works in your target data platform
- Node Types match intended use (such as Dimension, Fact, or View)
- Business keys are properly set
- System columns are preserved

### Use Version Control Checkpoints for Safety

- Create a checkpoint before starting Copilot sessions
- Review all changes in version control before deployment
- Roll back easily if Copilot makes unwanted changes

## Write Effective Prompts

**Be specific about requirements:**

| Instead of | Try |
| ------------ | ----- |
| "Create a table" | "Create a dimension table for customers with customer_id as the business key" |
| "Add columns" | "Add columns for first_name, last_name, and email to the dim_customer Node" |

**Break complex tasks into smaller steps:**

Start with basic structure, then add complexity iteratively. For example:

1. First create the base dimension
2. Then add calculated columns
3. Then configure slowly changing dimension logic

**Provide context and examples:**

- Reference existing Nodes: "Create a Node like dim_product but for stores"
- Include domain-specific terminology
- Specify Node Types when relevant (Dimension, Fact, Persistent Stage)
- Include your data platform specifics when needed (Snowflake-specific functions, Databricks syntax)

**Use iterative refinement:**

1. "Create a customer dimension"
2. Review the generated Node
3. "Add loyalty_tier and lifetime_value columns"
4. "Set customer_id as the business key"

## What Copilot Does Well

- Generating boilerplate transformations and staging layers
- Converting SQL queries into Node chains
- Adding columns and updating Node configurations
- Explaining existing Node logic and dependencies
- Building standard Coalesce patterns quickly
- Rapid prototyping and iteration

## Where You Should Be Cautious

:::caution Exercise Extra Care
The following scenarios require additional review and testing:
:::

- Complex multi-node dependencies with intricate business logic
- Migrations from legacy systems (always validate thoroughly)
- Production-critical transformations without testing
- Interpreting domain-specific business rules

## Copilot Limitations

### Workspace-Level Operations

Copilot **cannot**:

- Create source Nodes
- Create or delete entire Subgraphs (it can only add or remove Nodes from existing Subgraphs)
- Modify Workspace settings or configurations
- Manage Environments or deployments

### External Data Operations

Copilot **cannot**:

- Query your data warehouse to preview actual data
- Create new Storage Locations or database connections
- Run actual data transformations (it only builds the DAG)

### Advanced Customization

Copilot **cannot**:

- Set advanced Node configuration options
- Create Custom Node Types
- Modify Package definitions or install new Packages
- Change Workspace-level templates or Macros

### Data and Metadata Awareness

Copilot:

- Knows your table schemas and metadata
- **Doesn't** know the actual data in your tables
- **Can't** automatically detect data quality issues without your description
- **Can't** recommend optimizations based on query performance

## Team Collaboration

- Share Copilot-generated Nodes for peer review
- Document business context that Copilot can't know
- Use Copilot for scaffolding and the Coalesce UI for fine-tuning
- Track time saved on repetitive tasks
- Monitor accuracy of generated transformations
- Identify patterns where Copilot excels or needs guidance

## Security and Data Governance

### Understand Copilot's Scope

| Copilot Can Access | Copilot Cannot Access |
| -------------------- | ---------------------- |
| Your Workspace metadata (Node names, columns, schemas) | Actual data in your tables |
| Your Workspace permissions | External systems or databases directly |
| Your Storage Locations | |

### Avoid Sharing Sensitive Information in Prompts

- Don't paste proprietary business logic that should remain private
- Use generic examples when asking questions about patterns

## Learn With Copilot

Ask questions to deepen your understanding:

- "How should I structure slowly changing dimensions?"
- "What's the difference between Persistent Stage and View for this use case?"
- "Can you explain the join logic you created?"
- "What columns are in sales_fact?"
- "Which Nodes depend on customer_dim?"

## Troubleshooting

If you encounter issues:

- If Copilot stops responding or produces an error, wait 1-2 minutes before trying again
- Start a new conversation if the issue persists. Sometimes a fresh context helps
- Complex requests may take longer to process; simpler, focused prompts often work better
- If results aren't what you expected, rephrase your prompt with more specificity or context
- Report persistent issues to our support team so we can investigate

---

## What's Next?

- [Migrating SQL to Coalesce with Copilot](/docs/guides/migrating-sql-to-coalesce-with-copilot)
- [Coalesce Copilot][]
- [AI Policy][]

---

[AI Policy]: https://coalesce.io/company/ai-policy/
[Coalesce Copilot]: /docs/coalesce-ai/copilot
