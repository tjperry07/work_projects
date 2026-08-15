---
title: Snowflake Username and Password
description: Connect Coalesce to Snowflake using basic username and password authentication. Configure cloud or browser-based credential storage with account URL setup for straightforward data platform connectivity and authentication.
keywords: [Snowflake username password, basic authentication, Coalesce connection, credential storage, cloud storage, browser storage, account URL, data platform authentication, basic auth setup]
---

:::danger[Snowflake MFA Requirements]

Snowflake is moving towards MFA for all password based sign-ins. We recommend using OAuth for user login and Key pair for automation accounts. For the most recent information, see Snowflake's blog post: [Snowflake Will Block Single-Factor Password Authentication by November 2025][].

:::

Basic Auth is the fastest way to connect your target database platform to Coalesce, and the credential can be stored either in your local browser's storage (not recommended) or in Coalesce's cloud secrets vault.

## Get Your Snowflake Account URL

import SnowflakeAccountURL from '/snippets/_snowflake_account_url.md';

<SnowflakeAccountURL/>

## Add Basic Auth to Snowflake

1. Navigate to **Build Settings > Environments or Workspaces**.
2. Select Edit on the environment or workspace that you wish to connect to Snowflake using Basic Auth.
3. In **Edit Environment or Workspace > User Credentials**, select **Authentication Type** as Username and Password (Cloud) or Username and Password (Browser Storage).
4. Enter Username and Password into their respective fields and Save.

<img src="/img/docs-images/setup-your-project/user_name_password_auth.png" alt="Workspace settings interface for configuring Snowflake connection credentials, showing input fields for account URL, username, password, role, and warehouse configurations, with Save and Cancel buttons at the bottom" className="mdImages"/>

[Snowflake Will Block Single-Factor Password Authentication by November 2025]: https://www.snowflake.com/en/blog/blocking-single-factor-password-authentification/
