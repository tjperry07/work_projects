---
title: "Catalog Onboarding Guide"
description: "Get your team up and running with Coalesce Catalog. Covers account setup, warehouse and BI tool connections, domain structure, governance, phased rollout, and where to find help."
keywords: [Catalog onboarding, Catalog setup, Catalog getting started, data catalog, warehouse integration, BI tool integration, Catalog rollout, Catalog adoption]
processed: true
---

This guide walks you through onboarding to Coalesce Catalog, from account creation through organization-wide adoption. Whether you're an admin setting up integrations or an end user exploring your data, you'll find the steps you need here.

## Who This Guide Is For

Catalog onboarding involves two main roles:

* **Admins and setup owners:** Request accounts, connect warehouses and BI tools, configure integrations, and manage users. See [Phase 1: Initial Setup](#phase-1-initial-setup).
* **End users:** Sign in, explore the interface, and use Catalog to find and understand data. See [Sign In and Explore](#sign-in-and-explore).

## Phase 1: Initial Setup

### Request a Catalog Account

New Catalog accounts are created by the Coalesce team and are not self-service. Contact [support@coalesce.io](mailto:support@coalesce.io) or your Coalesce representative to request a new Catalog account.

Include in your request:

* Company or organization name
* Key user email addresses
* Integrations needed (for example, Snowflake, Sigma, Tableau, Coalesce Transform)
* Timeline and any organizational context (for example, merger, hierarchy change)

Your Catalog admin or Coalesce contact will confirm when your space is ready. For details on user and team provisioning, including SCIM sync, see [User and Team Provisioning][].

### Access and Authentication

* **Basic login:** Start with the credentials provided in your onboarding email. Sign up using the [Catalog sign-up link][] after your space is ready.
* **SSO configuration:** Work with your IT team to set up Single Sign-On for broader access. See [Authentication][] for Okta, Google SSO with SAML, and Azure AD with SAML.
* **SCIM setup:** For automated user provisioning (recommended for larger teams), see [SCIM setup for Microsoft Entra ID][] and [SCIM setup for Okta][].

### Connect Your Data Sources

Once your Catalog space is ready, admins connect data sources so users can discover and understand assets. The core setup has three steps: sign up, connect your warehouse, and connect your BI tool.

#### Step 1: Sign Up

After your Catalog space is set up, sign up using the [Catalog sign-up link][].

#### Step 2: Connect Your Warehouse

Catalog connects to your warehouse to extract metadata (table and column names, types, lineage, and so on). The dedicated Catalog user has very limited access: it can read metadata only, not your data.

1. Go to the [Integrations][integrations] page, find your warehouse technology, and follow the setup instructions. Each integration requires a dedicated user or service account with specific permissions.
2. In Catalog, go to **Settings** > **Integrations** and add your warehouse using the credentials from step 1.

Catalog tests the connection, applies settings, and runs the first sync (usually a couple of hours). You'll be notified when the first sync finishes. After that, Catalog syncs once per day with your warehouse.

#### Step 3: Connect Your BI Tool

Catalog ingests metadata from your BI tools (dashboards, reports, data sources) to power discovery and lineage.

BI tool onboarding follows one of two paths:

* **Catalog managed:** You share admin credentials; Catalog handles extraction and daily syncs. No further action on your part.
* **Client managed:** You run the `castor-extractor` package locally to extract metadata and send the output files to Catalog. Catalog never accesses your BI tool directly.

For full details and supported technologies, see [Warehouses][] and [BI Tools][].

#### Step 4: Connect Other Integrations

Catalog supports transformation tools (Coalesce, dbt), quality tools, communication (Slack, Microsoft Teams), knowledge bases, and more. See the [Integrations][integrations] page for the full list.

### User Management

Assign roles and invite your core team before broader rollout.

* **Admin setup:** Designate 2–3 catalog administrators. See [User roles in Catalog][] for role capabilities.
* **Initial users:** Invite your core data team. See [User and Team Provisioning][] and [Teams in Catalog][].
* **Role assignment:** Set up viewer, contributor, steward, and admin roles. See [User roles in Catalog][] for the full role matrix.

## Phase 2: Foundation Building

### Domain Structure

Create your organizational domains in the [Knowledge section][]. See [Step 1: Create your domains][] for a guided approach.

* **Business domains:** Finance, Marketing, Operations, and so on
* **Technical domains:** Data Engineering, Analytics, Governance
* **Hierarchical structure:** Use parent-child relationships where appropriate. See [Step 1: Create your domains][] for structuring guidance.

### Governance Framework

Define how you tag, own, and document assets consistently.

* **Tagging strategy:** Define consistent tags for PII, data quality, certification status. See [Step 2: Tag your assets][] and [Tags][].
* **Ownership assignment:** Use the [Metadata Editor][] for bulk ownership assignment. If admins enable **custom ownership labels** under **Account Configuration > Ownership Labels**, follow [Assign Custom Ownership Labels in Bulk][] to update existing rows so owners do not stay on **No label**. See [Step 4: Assign ownership][] for governance concepts.
* **Templates:** Create documentation templates for consistency. See [Templates][].
* **Metadata audit trail:** Use the [History][] tab on tables, dashboards, and knowledge pages to review who changed owners, tags, descriptions, and related metadata during rollout.

### Initial Documentation

Start with your most critical assets. See [How to approach a documentation initiative][] for the full 5-step process.

* **Key tables:** Document your 10–15 most important data tables. Use [Describe with AI][] or [Upload existing descriptions][] if you have docs elsewhere.
* **Critical dashboards:** Add descriptions to your most-used reports. See [Dashboards][].
* **Glossary terms:** Define 5–10 essential business terms. See [Step 3: Create key metrics and glossary terms][].
* **Metrics:** Document key KPIs and their calculations. See [Step 3: Create key metrics and glossary terms][].

## Phase 3: Rollout Strategy

### Phased User Rollout

Follow this recommended sequence:

#### Technical Teams

* Data Engineers
* Data Analysts
* BI Developers

#### Data Stewards

* Domain experts
* Business analysts
* Governance team members

#### Business Users

* Report consumers
* Self-service analytics users
* Executive stakeholders

### Docs by Role

What each role needs to read to use Catalog:

**Viewer (read-only):** Search, view assets, add comments, request descriptions.

* [5-Minute Quick Start Guide][]
* [Search][]
* [Advanced Search][]
* [AI Assistant introduction][]
* [Tables][]
* [Lineage][]

**Contributor:** Everything Viewer can do, plus edit descriptions, create knowledge pages, edit tags, certify owned assets, publish to Marketplace.

* All Viewer docs above
* [Describe with AI][]
* [Templates][] (apply when documenting)
* [Knowledge][]
* [Catalog and Marketplace Interfaces][]
* [Source tags][]

**Steward:** Everything Contributor can do, plus certify any asset, manage tags and templates, bulk edit, analytics.

* All Contributor docs above
* [Metadata Editor][]
* [Tag Manager][]
* [Data Documentation Coverage][]
* [Users Activities][]

**Admin:** Everything Steward can do, plus manage users, content access, data sources, account settings.

* All Steward docs above
* [Quick Set Up][]
* [Integrations][integrations]
* [User and Team Provisioning][]
* [Assets Access Control][]
* For hierarchy planning and visibility triage, see [Choose where to restrict access in Catalog][choose restrict access] and [Troubleshooting visibility for asset access][asset access troubleshooting] on the [Assets Access Control][] page.
* [User roles in Catalog][]
* [Tag Settings][]
* [AI Administration][]

## Phase 4: Adoption and Growth

### AI Features Activation

AI features help users find data faster, document at scale, and lower the barrier for business users who prefer natural language over filters and keywords. AI Search lets people ask questions like "What is ARR?" or "Do we have a dashboard about churn?" Describe with AI generates table and column descriptions from metadata so contributors can document assets quickly without writing everything manually.

* **Catalog AI:** See [AI Administration][].
* **AI Assistant:** Set up the AI chatbot for [Slack][] or [Microsoft Teams][].
* **Auto-documentation:** Use [Describe with AI][] to generate initial table and column descriptions.

### Advanced Features

* **Data quality integration:** Catalog integrates with Anomalo, Coalesce Quality, dbt Tests, Great Expectations, Monte Carlo, Sifflet, and Soda. For custom tools, use the [Quality API][]. See [Quality integrations][].
* **Lineage enhancement:** Ensure end-to-end lineage from source to BI. See [Lineage][].
* **Usage analytics:** Monitor catalog adoption and asset popularity. See [Analytics][].

### Continuous Improvement

* **Documentation targets:** Set goals for description coverage (aim for 80%+). See [Step 5: Set targets and execute][].
* **Regular reviews:** Monthly check-ins to assess progress. Use [Data Documentation Coverage][] and [Users Activities][].
* **Feedback collection:** Gather user feedback and iterate.

## Sign In and Explore

Once your space is set up and data sources are connected, end users can sign in and start exploring.

### Log In

1. Go to [https://app.castordoc.com/](https://app.castordoc.com/)
2. Sign in using your SSO or directly using your app credentials
3. If you're having trouble, contact your Catalog admin or [support team](#get-help). For network or login issues, see [Browser login troubleshooting][]

### Explore the Interface

Catalog has two main interfaces: the **Catalog** (all assets and documentation) and the **Data Marketplace** (curated, consumer-friendly view of production-ready data products). Most use cases refer to the Catalog interface.

Key areas to explore:

* **Left panel:** Browse your data ecosystem by Warehouse, BI tool, Business Knowledge, and People. See [Navigation menu][] for details.
* **Search bar:** Use [Advanced Search][] and filters to find assets. Try terms like `revenue`, `orders`, or `customer`, and use filters (type, tags) to narrow results.
* **Asset zoom:** Click into a table or dashboard to see metadata such as lineage, descriptions, and popularity.
* **AI Assistant:** Ask questions in natural language, for example: "Do we have a dashboard about churn?" See [AI Assistant introduction][] for capabilities.

For a visual walkthrough, see the [5-Minute Quick Start Guide][].

## Catalog Versus Marketplace

The **Catalog** is the primary interface where you find all assets from your data stack and documentation. The **Marketplace** is a curated, consumer-friendly interface that showcases only production-ready data products organized by domain.

If your account has Marketplace access, see [Catalog and Marketplace Interfaces][] for setup and publishing guidelines.

## Best Practices

### Documentation Strategy

Focus on high-impact assets first and build from there.

1. **Start small:** Begin with one domain or use case. See [Step 1: Create your domains][].
2. **Use templates:** Create consistent documentation formats. See [Templates][].
3. **Leverage AI:** Use [Describe with AI][] as starting points.
4. **Link assets:** Pin related dashboards, tables, and metrics together. See [Pinned assets][].

### Change Management

Build momentum and adoption across your organization.

1. **Champion network:** Identify power users in each domain.
2. **Success stories:** Share early wins to build momentum.
3. **Regular communication:** Keep stakeholders informed of progress.
4. **Training materials:** Develop internal documentation and videos. Reference [5-Minute Quick Start Guide][] and [How to approach a documentation initiative][].

### Technical Considerations

Plan for security, performance, and reliability.

1. **Network policies:** Allowlist Catalog IPs if needed. See [Snowflake setup][] for IP addresses.
2. **Security reviews:** Work with InfoSec on data classification.
3. **Performance monitoring:** Track integration sync times and success rates in [Integration settings][].
4. **Backup plans:** Document rollback procedures for integrations.

## Success Metrics

Track these KPIs to measure onboarding success:

* **User adoption:** Number of active users per month. See [Users Activities][].
* **Content coverage:** Percentage of assets with descriptions. See [Data Documentation Coverage][].
* **Search usage:** Frequency of catalog searches.
* **Documentation quality:** User ratings of asset descriptions.
* **Time to value:** How quickly new users find relevant data.

## Get Help

### Support Channels

Reach out through these channels depending on your need.

* **Catalog support:** [support@coalesce.io](mailto:support@coalesce.io)
* **In-app support:** Use the Intercom chat on your Catalog instance. See [How to reach us][].
* **Customer Success:** [support@coalesce.io](mailto:support@coalesce.io)
* **General Coalesce support:** [support@coalesce.io](mailto:support@coalesce.io) or the [Support Portal][]

### Common Issues and Solutions

If you run into problems, these resources can help.

* **SSO problems:** Check with IT team on SAML configuration. See [Authentication][].
* **Integration failures:** Verify network connectivity and credentials. See [Warehouses][] and [BI Tools][].
* **Slow adoption:** Focus on high-value use cases first. See [How to approach a documentation initiative][].
* **Documentation gaps:** Use [Describe with AI][] and [Templates][].

## What's Next?

* [Upload existing descriptions][] if you have table or column docs elsewhere
* [Explore Catalog][] to search, discover lineage, and document your data
* [AI Assistant introduction][] to use AI Search, SQL Copilot, and Dashboard Q&A
* [User and Team Provisioning][] for SCIM, Okta, and Microsoft Entra ID setup
* [Step 5: Set targets and execute][] to define and track documentation goals

---

[Catalog sign-up link]: https://app.castordoc.com/auth/sign-up
[User and Team Provisioning]: /docs/catalog/administration/user-and-team-provisioning/
[Authentication]: /docs/catalog/administration/authentication/
[SCIM setup for Microsoft Entra ID]: /docs/catalog/administration/user-and-team-provisioning/scim-setup-for-microsoft-entra-id
[SCIM setup for Okta]: /docs/catalog/administration/user-and-team-provisioning/scim-setup-for-okta
[integrations]: /docs/catalog/integrations
[Search]: /docs/catalog/navigate/search/
[Tables]: /docs/catalog/assets/tables
[Knowledge]: /docs/catalog/assets/knowledge
[Source tags]: /docs/catalog/document-your-data/tags/source-tags
[Tag Manager]: /docs/catalog/document-your-data/tags/tag-manager
[Quick Set Up]: /docs/catalog/quick-set-up
[Assets Access Control]: /docs/catalog/administration/assets-access-control
[choose restrict access]: /docs/catalog/administration/assets-access-control#choose-where-to-restrict-access-in-catalog
[asset access troubleshooting]: /docs/catalog/administration/assets-access-control#troubleshooting
[Tag Settings]: /docs/catalog/administration/tag-settings
[Warehouses]: /docs/catalog/integrations/data-warehouses/
[Snowflake setup]: /docs/catalog/integrations/data-warehouses/snowflake
[BI Tools]: /docs/catalog/integrations/data-viz/
[Slack]: /docs/catalog/integrations/communication/slack
[Microsoft Teams]: /docs/catalog/integrations/communication/microsoft-teams
[User roles in Catalog]: /docs/catalog/administration/user-roles-in-catalog
[Teams in Catalog]: /docs/catalog/administration/teams-in-catalog
[Knowledge section]: /docs/catalog/use-cases/discover/knowledge-section
[Step 1: Create your domains]: /docs/catalog/use-cases/document/how-to-approach-a-documentation-initiative/step-1-create-your-domains
[Step 2: Tag your assets]: /docs/catalog/use-cases/document/how-to-approach-a-documentation-initiative/step-2-tag-your-assets
[Step 3: Create key metrics and glossary terms]: /docs/catalog/use-cases/document/how-to-approach-a-documentation-initiative/step-3-create-key-metrics-and-glossary-terms
[Step 4: Assign ownership]: /docs/catalog/use-cases/document/how-to-approach-a-documentation-initiative/step-4-assign-ownership
[Step 5: Set targets and execute]: /docs/catalog/use-cases/document/how-to-approach-a-documentation-initiative/step-5-set-targets-and-execute
[Tags]: /docs/catalog/use-cases/document/content-and-context/governance-concepts/tags
[Metadata Editor]: /docs/catalog/document-your-data/metadata-editor
[History]: /docs/catalog/collaborate/history
[Assign Custom Ownership Labels in Bulk]: /docs/catalog/document-your-data/metadata-editor#assign-custom-ownership-labels-in-bulk
[Templates]: /docs/catalog/document-your-data/templates
[How to approach a documentation initiative]: /docs/catalog/use-cases/document/how-to-approach-a-documentation-initiative/
[Describe with AI]: /docs/catalog/document-your-data/catalog-scribe/describe-with-ai
[Upload existing descriptions]: /docs/catalog/document-your-data/upload-existing-documentation/upload-existing-descriptions
[Dashboards]: /docs/catalog/assets/dashboards
[AI Administration]: /docs/catalog/administration/ai-administration
[Quality integrations]: /docs/catalog/integrations/quality/
[Quality API]: https://apidocs.castordoc.com/#e4604160-95c5-4f6d-88ce-7908f5e13686
[Lineage]: /docs/catalog/use-cases/discover/lineage
[Analytics]: /docs/catalog/administration/analytics/
[Data Documentation Coverage]: /docs/catalog/administration/analytics/data-documentation-coverage
[Users Activities]: /docs/catalog/administration/analytics/users-activities
[Browser login troubleshooting]: /docs/faq/general-setup-faq-troubleshooting/browser-login-issues
[Navigation menu]: /docs/catalog/use-cases/discover/navigation-menu
[Advanced Search]: /docs/catalog/use-cases/discover/advanced-search
[AI Assistant introduction]: /docs/catalog/ai-assistant/introduction
[5-Minute Quick Start Guide]: /docs/catalog/use-cases/five-minute-quick-start-guide
[Catalog and Marketplace Interfaces]: /docs/catalog/navigate/catalog-and-marketplace-interfaces
[Pinned assets]: /docs/catalog/document-your-data/pinned-assets
[Integration settings]: /docs/catalog/administration/integration-settings
[How to reach us]: /docs/catalog/support/how-to-reach-us
[Support Portal]: https://support.coalesce.io
[Explore Catalog]: /docs/catalog/use-cases/five-minute-quick-start-guide
