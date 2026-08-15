---
title: Automate Coalesce Deploys to Snowflake with Azure DevOps
description: Set up an Azure DevOps Pipelines workflow that plans and deploys Coalesce transformations to Snowflake with Secure File credentials, a published plan artifact, and a human approval gate before coa deploy.
keywords: [Azure DevOps, Azure Pipelines, Coalesce CLI, coa plan, coa deploy, Snowflake key pair, Secure File, CI/CD, Environment Admin, deployment automation]
hide_table_of_contents: true
slug: /guides/automate-coa-deploy-with-azure-devops-snowflake
tags: [Snowflake, Deploy, Azure DevOps]
---

## Before You Begin

This guide walks you through a CI/CD pattern that deploys Coalesce pipelines to Snowflake with Azure DevOps Pipelines. You keep credentials out of YAML, generate a scannable deploy plan, pause for a human approval check, then run `coa deploy`.

Complete the work in this order:

1. Configure service accounts, Environments, Storage Mappings, and tokens in the Coalesce App.
2. Install the Coalesce CLI and create the local config and ignore files the pipeline needs.
3. Upload secrets and create the pipeline in Azure DevOps.

You need the following before you start:

- An [Azure DevOps][] account and project. Azure Pipelines can target GitHub or Azure Repos. Use any Git provider that [Coalesce supports][].
- Version control set up and linked on your Coalesce Project. See [Set Up Version Control][].
- Coalesce Environments for the stages you deploy to, for example DEV, Pre-Prod, and Prod. See [Create Your Environments][].
- Node.js on your machine and on the pipeline agent. v20.x is a common baseline for the Coalesce CLI.
- A Snowflake service user ready for [key pair authentication][].
- Familiarity with [Deploy Pipelines Using the Coalesce CLI][] for cloud `coa plan` and `coa deploy`.

## How This Approach Works

Use this section to decide whether the plan-artifact-plus-approval pipeline fits, see how the stages connect, and avoid common credential and plan mistakes.

### When This Approach Fits

Use this approach when:

- Production deploys must run automatically after merge, with no manual edits on the path to Snowflake.
- You need a human gate after the plan is generated and before `coa deploy` runs.
- Audit or security teams require a published plan artifact they can scan before approval.
- Snowflake credentials for automation must use key pair auth, not interactive SSO.

Prefer a simpler pipeline with plan and deploy in one job and no approval gate when you are only practicing CI or deploying to a non-production Environment. See [Orchestrate Deploys with Azure DevOps][] for a shorter Secure File and YAML starter.

### How Coalesce Models This

Keep secrets in an Azure DevOps Secure File, not in pipeline YAML. Run cloud operations only (`coa plan` and `coa deploy`). Configure the approval gate as an Azure DevOps Environment check in the UI, then reference that Environment from the deploy job in YAML.

<GuideDiagram
  step={2}
  chart={`flowchart LR
  secureConfig[Secure config] --> plan[Plan]
  plan --> artifact[Artifact]
  artifact --> approval[Approval]
  approval --> deploy[Deploy]`}
/>

Use this table to see what each stage does and why it matters:

| Stage | What runs | Why it matters |
| ----- | --------- | -------------- |
| Secure config | `DownloadSecureFile@1` | Credentials stay in Library, not in the repo or YAML |
| Plan | `coa plan` | Produces `coa-plan.json` for review and scanning |
| Artifact | `PublishPipelineArtifact@1` | Auditors and reviewers can inspect what will deploy |
| Approval | Azure DevOps Environment check | Human gate before production changes |
| Deploy | `coa deploy --plan ./coa-plan.json` | Applies the reviewed plan to the Coalesce Environment |

### Limits and What to Avoid

Avoid these patterns when you automate Coalesce deploys with Azure DevOps and Snowflake:

- Storing the Coalesce token in pipeline YAML or plain text variables, or putting the Snowflake private key on the agent instead of on the Coalesce Environment (Step 2).
- Committing `workspaces.yml` or `coa-plan.json` to the repository. `workspaces.yml` is for local development only. Ignore plan files so agents always generate a fresh plan from the commit under test.
- Skipping Environment authentication for the Coalesce service account before CI uses its access token. Complete Steps 1 and 2 before you leave the Coalesce App.
- Skipping Environment Storage Mappings. Complete Step 3 in the Coalesce App before the first pipeline run.
- Treating CLI telemetry network errors as deploy failures. If `coa plan` wrote `coa-plan.json`, the plan step succeeded.

Complete the following steps once per Coalesce Environment you want the pipeline to target. Many teams use one Secure File and one Azure Pipeline per Environment.

## Step 1: Create a Coalesce Service Account

Create a dedicated Coalesce account for automation. Service accounts need credentials the pipeline can use without browser login.

1. Follow [Service Accounts in Coalesce][] to add the account.
2. Assign roles for least privilege:
   - **Org Member** or **Org Contributor** at the organization level.
   - **Project Member** at the Project level so you can assign Environment roles.
   - **Environment Admin** on each Environment the pipeline will deploy or refresh.
3. Log in to the Coalesce App as the service account.
4. Open **Deploy**, select each target Environment, and authenticate the Snowflake connection for that Environment.

:::warning[Authenticate Environments before CI]

If you skip logging in as the service account and authenticating each Environment, `coa plan` and `coa deploy` can fail even when the access token and config look correct.

:::

Service accounts do not count toward your Coalesce license allocation. See [Service Accounts in Coalesce][].

## Step 2: Configure Snowflake Key Pair Auth

Generate a Snowflake key pair for the warehouse service user, assign the public key in Snowflake, and store the private key on the Coalesce Environment.

1. Follow [Snowflake Key Pair Authentication][] and [Snowflake Service Accounts][] to create the user and assign the public key.
2. In Coalesce, open the Environment settings and set **Authentication Type** to **Key Pair**.
3. Paste the full private key PEM block, including the begin and end lines:

```text
-----BEGIN ENCRYPTED PRIVATE KEY-----
...
-----END ENCRYPTED PRIVATE KEY-----
```

If your passphrase or key material includes special characters such as `#` or `;`, escape them as described in [Snowflake Key Pair Authentication][].

## Step 3: Confirm Storage Locations and Environment Storage Mappings

Each target Environment needs Storage Mappings that point every Storage Location to a Snowflake database and schema. Configure those in the Coalesce App. You do not need a repository YAML file if the Environment already has mappings here.

1. Open **Build Settings > Environments**, select each Environment the pipeline will target, and go to **Storage Mappings**.
2. For each Storage Location, set the Snowflake database and schema for that Environment. Use **Override Mapping Values** when you need to type a database or schema that does not appear in the dropdown. See [Create Your Environments][].
3. Save your changes.

:::tip[Optional: Manage Environment mappings in Git]

If you want deploy-time mappings as code, commit YAML under `environments/` using a name like `environments/<ENVIRONMENT_NAME>-<ID>.yml`. See [Deploy Pipelines Using the Coalesce CLI][] for the file format. Workspace Storage Locations and Workspace Storage Mappings stay in the Coalesce App either way.

:::

## Step 4: Generate an Access Token and Collect Environment Details

Still signed in as the service account, gather the values you need for the CLI config and Azure Secure File.

1. Go to the **Deploy** tab and click **Generate Access Token**. See [Getting an Access Token][].
2. If people in your org use SSO, generate a new token when you add a new Environment for automation.
3. Copy your Coalesce domain from the browser address bar. It must match the `domain` value in your CLI config exactly, for example `https://<your-org>.app.coalescesoftware.io`.
4. Get each target Environment ID from **Build Settings > Environments** or the Deploy page. See [how to find Environment IDs][].

Keep the token, domain, and Environment ID somewhere secure for the next steps. Do not commit them to the repository.

## Step 5: Install and Pin the Coalesce CLI

Install the Coalesce CLI on your machine so you can create and validate the config file before you upload it to Azure. Pin a released version so local checks and pipeline agents stay aligned. Check published versions on the [COA package registry page][].

```bash
npm install -g @coalescesoftware/coa@7.33.2
coa --version
```

Use the same version later in `azure-pipelines.yml`.

## Step 6: Create the CLI Config File

Create a CLI config with the Coalesce cloud credentials you collected in Step 4. Cloud `coa plan` and `coa deploy` need only `token`, `domain`, and `environmentID`. Snowflake key pair auth stays on the Coalesce Environment from Step 2, so do not add warehouse credential overrides to this file. Do not commit the config to the repository. You will upload it as an Azure DevOps Secure File in the next phase.

Example `config` contents:

```txt
[default]
token=your_access_token
domain=https://<your-org>.app.coalescesoftware.io
environmentID=your_env_id
```

Optionally verify the Environment ID with the CLI after the config exists:

```bash
coa environments list --config /path/to/config
```

For full field reference for COA 7.33 and above, see [Command Line Interface][].

## Step 7: Ignore Local Pipeline Files

Before you push pipeline-related changes, ignore local-only and generated files so agents always generate a fresh plan from the commit under test:

```bash
echo "workspaces.yml" >> .gitignore
echo "coa-plan.json" >> .gitignore
```

Commit and push the `.gitignore` update on the branch the pipeline will build.

## Step 8: Upload the Secure File in Azure DevOps

Upload the CLI config so credentials never appear in pipeline YAML.

1. In Azure DevOps, open **Pipelines > Library**.
2. Select **+ Secure File** and upload the config file you created in Step 6.
3. Note the Secure File name. The YAML in this guide uses `config`.

## Step 9: Create the Azure Pipelines Definition

Create the pipeline that plans, publishes an artifact, waits for approval, then deploys.

1. In Azure DevOps, open **Pipelines > Pipelines**.
2. Select **Create Pipeline** and connect the Git repository that holds your Coalesce Project.
3. Choose **Starter pipeline**.
4. Replace the YAML with the following. Adjust `pool`, the pinned CLI version from Step 5, Secure File name, Azure DevOps Environment name, and Coalesce Environment ID for your project.

```yaml title="azure-pipelines.yml"
pool: default

variables:
  - name: coalesceCliVersion
    value: 7.33.2 # Pin a released version from https://www.npmjs.com/package/@coalescesoftware/coa

trigger:
  branches:
    include:
      - main

stages:
  - stage: Plan
    displayName: Generate Coalesce plan
    jobs:
      - job: Plan
        displayName: Run coa plan
        steps:
          - checkout: self

          - task: DownloadSecureFile@1
            name: coaConfig
            displayName: Download coa config
            inputs:
              secureFile: 'config'

          - task: CmdLine@2
            displayName: Install Coalesce CLI
            inputs:
              script: |
                npm list -g | grep "@coalescesoftware/coa@$(coalesceCliVersion)" || npm install -g @coalescesoftware/coa@$(coalesceCliVersion)

          - task: CmdLine@2
            displayName: Generate Coalesce deploy plan
            inputs:
              script: |
                coa plan --environmentID <id> --config $(coaConfig.secureFilePath)

          - task: PublishPipelineArtifact@1
            displayName: Publish plan as artifact
            inputs:
              targetPath: 'coa-plan.json'
              artifact: 'coalesce-plan'

  - stage: Deploy
    displayName: Approve and deploy
    dependsOn: Plan
    jobs:
      - deployment: Deploy
        displayName: Run coa deploy
        # Create this Environment in Azure DevOps and add an approval check in the UI.
        environment: coalesce-prod
        strategy:
          runOnce:
            deploy:
              steps:
                - checkout: self

                - task: DownloadPipelineArtifact@2
                  displayName: Download plan artifact
                  inputs:
                    artifact: 'coalesce-plan'
                    path: $(Pipeline.Workspace)/coa-plan

                - task: DownloadSecureFile@1
                  name: coaConfig
                  displayName: Download coa config
                  inputs:
                    secureFile: 'config'

                - task: CmdLine@2
                  displayName: Install Coalesce CLI
                  inputs:
                    script: |
                      npm list -g | grep "@coalescesoftware/coa@$(coalesceCliVersion)" || npm install -g @coalescesoftware/coa@$(coalesceCliVersion)

                - task: CmdLine@2
                  displayName: Execute Coalesce deploy
                  inputs:
                    script: |
                      coa deploy --environmentID <id> --plan $(Pipeline.Workspace)/coa-plan/coa-plan.json --config $(coaConfig.secureFilePath)
```

After you save the YAML:

1. In Azure DevOps, create or select the **Environment** named in the deploy job, for example `coalesce-prod`.
2. Add an approval check for the people who must review production deploys.
3. Save the pipeline and run it on a non-production Coalesce Environment first.

In Coalesce CLI 7.33 and above, the default plan output file is `coa-plan.json`. Pass `--verbose` or `--debug` on `coa plan` and `coa deploy` when you need more detail in the agent logs.

## Network and Proxy Requirements

Pipeline agents need outbound HTTPS on port 443 to Coalesce and related Google Firebase endpoints. Allowlist the domains in [Network Requirements][], including:

- `identitytoolkit.googleapis.com`
- `securetoken.googleapis.com`
- `firestore.googleapis.com`
- `firebasestorage.googleapis.com`
- `storage.coalescesoftware.io`
- Your Coalesce app hostname, for example `https://*.app.coalescesoftware.io`

The metadata service at `firestore.googleapis.com` uses gRPC over HTTP/2. If your corporate proxy performs SSL or TLS inspection, exclude these domains from deep packet inspection. Otherwise connections can succeed at the TCP layer and still return no usable data.

If agents must use an HTTP proxy, set `HTTPS_PROXY` and, when needed, `NO_PROXY` for hosts that must bypass the proxy. Example PowerShell on a Windows agent:

```powershell
$env:HTTPS_PROXY = "http://your-proxy-address:port"
$env:NO_PROXY = "firestore.googleapis.com,firebasestorage.googleapis.com,identitytoolkit.googleapis.com,securetoken.googleapis.com"
```

Or as Azure Pipelines variables:

```yaml
variables:
  - name: HTTPS_PROXY
    value: http://your-proxy-address:port
  - name: NO_PROXY
    value: firestore.googleapis.com,firebasestorage.googleapis.com,identitytoolkit.googleapis.com,securetoken.googleapis.com
```

See [Command Line Interface][] for proxy setup details for COA 7.33 and above.

## Troubleshooting

### CLI Telemetry Request Fails

You might see an error similar to:

```text
An error occurred during the HTTP request: [FetchError]: request to https://http-intake.logs.datadoghq.com/api/v2/logs failed, reason: getaddrinfo ENOENT http-intake.logs.datadoghq.com
```

The Coalesce CLI sends operational telemetry to `http-intake.logs.datadoghq.com`. That traffic does not include your Snowflake data, credentials, or repository contents. If your firewall blocks that host, the message is cosmetic noise.

Treat the step as successful when `coa plan` completes and produces `coa-plan.json`. There is no environment variable or config flag to disable this telemetry today.

### Plan or Deploy Fails with a Valid Token

Confirm the service account has **Environment Admin** on the target Environment, that you authenticated that Environment while signed in as the service account, and that `domain` in the Secure File matches the browser URL exactly.

### Secrets Appear in Logs

Move the Coalesce token into the Secure File. Prefer `DownloadSecureFile@1` over echoing secret variables into scripts. Keep the Snowflake private key on the Coalesce Environment from Step 2, not in pipeline YAML or agent scripts.

## Quick Reference

Use this table when you need a fast answer while wiring the pipeline:

| Question | Answer |
| -------- | ------ |
| Which CLI commands does the pipeline need? | `coa plan` and `coa deploy` for cloud operations |
| Default plan file in CLI 7.33 and above | `coa-plan.json` |
| Where do credentials live? | Azure DevOps Library Secure File, referenced with `$(coaConfig.secureFilePath)` |
| Where is the approval gate? | Azure DevOps Environment approval check in the UI, referenced by the deploy job `environment` |
| Where do Environment Storage Mappings live? | Coalesce App under **Build Settings > Environments > Storage Mappings**. Git YAML under `environments/` is optional |
| Is `workspaces.yml` required in CI? | No. Local development only |
| Do service accounts consume a license seat? | No |

## What's Next?

- Start from the shorter Azure DevOps Secure File examples in [Orchestrate Deploys with Azure DevOps][].
- Review cloud plan and deploy steps in [Deploy Pipelines Using the Coalesce CLI][].
- Deepen Snowflake automation setup with [Snowflake Key Pair Authentication][] and [Snowflake Service Accounts][].
- Look up flags in [CLI Commands][].

[Azure DevOps]: https://azure.microsoft.com/en-us/services/devops/
[Coalesce supports]: /docs/setup-your-project/setup-version-control
[Set Up Version Control]: /docs/setup-your-project/setup-version-control
[Create Your Environments]: /docs/setup-your-project/create-your-environments
[key pair authentication]: /docs/setup-your-project/connection-guides/snowflake/snowflake-key-pair-authentication
[Deploy Pipelines Using the Coalesce CLI]: /docs/coa/version-733-and-above/coa-deploying-pipelines
[Orchestrate Deploys with Azure DevOps]: /docs/deploy-and-refresh/third-party-devops-tools/continuous-integration/scheduling-azure-devops-pipelines
[Service Accounts in Coalesce]: /docs/organization-and-accounts/organization-management/role-based-access-control/service-accounts
[Snowflake Key Pair Authentication]: /docs/setup-your-project/connection-guides/snowflake/snowflake-key-pair-authentication
[Snowflake Service Accounts]: /docs/setup-your-project/connection-guides/snowflake/snowflake-service-accounts
[Getting an Access Token]: /docs/organization-and-accounts/account-management/access-tokens
[how to find Environment IDs]: /docs/reference/whats-my-id
[Command Line Interface]: /docs/coa/version-733-and-above
[COA package registry page]: https://www.npmjs.com/package/@coalescesoftware/coa
[Network Requirements]: /docs/setup-your-project/setup-requirements/network-requirements
[CLI Commands]: /docs/coa/version-733-and-above/coa-commands
