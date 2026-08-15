---
title: Snowflake Key Pair Authentication
description: Implement Snowflake key pair authentication in Coalesce for secure automated connections to Development Workspaces and Environments. Configure encrypted and unencrypted private keys with proper passphrase management for enterprise-grade security.
keywords: [Snowflake key pair authentication, Coalesce security, automated authentication, private key configuration, encrypted keys, passphrase management, secure connections, Development Workspaces, Environment authentication, enterprise security]
---

import CogSVG from '/svg/cog.svg';
import SnowflakeKeyPair from '/snippets/_snowflake_keypair_workspace.md';

Coalesce supports Snowflake's [key pair authentication][] for connecting **Development Workspaces** and **Environments** to Snowflake instances. Both encrypted and unencrypted private keys are supported. Encrypted keys have a corresponding passphrase that is required to use them, while unencrypted keys can be used directly. While keys are allowed to be encrypted with an empty passphrase by Snowflake, this is not supported in Coalesce and will result in an error.

We recommend using key pair authentication for automated actions.

## Prerequisites

- Administrative access to your Snowflake account.
- Ability to create and manage Snowflake users.
- Access to Coalesce Build Settings for Environments or Workspaces.
- Understanding of your organization's security policies for key management.

## Step 1: Get Your Snowflake Account Identifier

import SnowflakeAccountURL from '/snippets/_snowflake_account_url.md';

<SnowflakeAccountURL/>

## Step 2: Generate Key Pair in Snowflake

1. Go through Snowflake’s [key pair authentication][] steps to generate your keys.
2. Make sure to generate a private key and save it for use in Coalesce.
3. Generate your public key using the private key created for Coalesce.
4. Assign the public key to your Snowflake user.

## Step 3: Authenticate in Coalesce

1. Navigate to **Build Settings** > **Environments or Workspaces**.
2. Select **Edit**, <CogSVG/>, on the Environment or Workspace that you want to connect to Snowflake using key pair authentication.
3. In **Edit Environment or Workspace** > **User Credentials**, select **Authentication Type** as **Key Pair**.
4. Enter your Snowflake **Username**, **Private Key**, **Private Key Passphrase (if applicable)**, **Role** and **Warehouse** into their respective fields and **Save**. Click **Test Connection** to ensure this works as expected.

<img src="/img/docs-images/setup-your-project/workspace_keypair_usercredentials.png" alt="Workspace Settings Development page showing Snowflake connection configuration. Left sidebar lists Settings, User Credentials, Storage Mappings, Parameters, and OAuth Settings. Main panel displays connection details including Snowflake account URL (fka56740.snowflakecomputing.com), authentication fields for Key Pair login, and role set to ACCOUNTADMIN. Cancel and Save buttons at bottom." className="mdImages"/>

:::info[Adding Your Private Key]

When entering your private key, make sure it's formatted properly. It must include the full private key including the lines BEGIN ENCRYPTED PRIVATE KEY and END ENCRYPTED PRIVATE KEY.

```text
-----BEGIN ENCRYPTED PRIVATE KEY-----
...
-----END ENCRYPTED PRIVATE KEY-----
```

:::

## Using Key Pair Authentication with Coalesce API

When using the Coalesce API to trigger Jobs programmatically, you can pass key pair credentials in your API requests.

### API Request Structure

```json
{
  "runDetails": {
    "jobID": "your-job-id",
    "environmentID": "your-environment-id"
  },
  "userCredentials": {
    "snowflakeAuthType": "KeyPair",
    "snowflakeUsername": "YOUR_SERVICE_ACCOUNT",
    "snowflakeKeyPairKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
    "snowflakeKeyPairPass": "your-passphrase",
    "snowflakeWarehouse": "YOUR_WAREHOUSE",
    "snowflakeRole": "YOUR_ROLE"
  }
}
```

### API Credentials vs Environment Credentials

The [Start Run API][start-run-api] requires `userCredentials` in every request. For key pair authentication, you must pass the same key pair credentials (username, private key, passphrase, role, warehouse) that are configured on the Environment in **Build Settings > Environments or Workspaces > User Credentials**.

**What this means for you:**

- **Include `userCredentials` in each request:** API integrations (PowerShell, Airflow, ADF, Snowflake Tasks, GitHub Actions, and similar) must include `userCredentials` in every Start Run request. For key pair, pass the same credentials configured on the Environment.
- **Credential rotation requires updates everywhere:** When you rotate keys or change passphrases, update credentials in Coalesce Build Settings and in all scripts, secrets, and CI/CD configurations that call the Start Run API.

#### Scheduled Jobs

For scheduled jobs in the Job Scheduler, the scheduler uses the credentials of the user who created or last modified the scheduled job, not Environment credentials. When you change authentication methods (for example, switching to key pair), scheduled jobs need to be manually updated.

#### Credential Rotation Checklist

When rotating Snowflake key pair credentials, update them in the Coalesce UI and in every API integration (PowerShell, Airflow, ADF, Snowflake Tasks, GitHub Actions, and similar). Otherwise, API-triggered Jobs will fail with authentication errors.

| Trigger | Where credentials come from |
| :------ | :--------------------------- |
| Coalesce UI (Deploy, Refresh) | **Build Settings > Environments or Workspaces > User Credentials** |
| Start Run API (`/scheduler/startRun`) | `userCredentials` in the request body (required) |
| Job Scheduler (scheduled jobs) | Credentials of the user who created or last modified the scheduled job |
| CLI | Depends on context; see [CLI setup][cli-setup] for key pair configuration |

### Important API Considerations

1. **Required fields:**
   - `snowflakeUsername` with KeyPair authentication.
   - `snowflakeKeyPairKey`: The PEM-encoded private key
   - `snowflakeAuthType` must be exactly "KeyPair" (case-sensitive).
   - `snowflakeKeyPairPass` is only required if the private key is encrypted.

2. **Key formatting for API:**
   - For JSON payloads, newlines within the key must be represented as `\n`.
   - Preserve the full key structure including headers and footers.

### Integration Examples

**PowerShell:**

```powershell
# Read and format private key
$privateKeyContent = (Get-Content "path/to/rsa_key.p8" -Raw).Replace("`r`n", "`n")

$body = @{
    runDetails = @{
        jobID = "your-job-id"
        environmentID = "your-env-id"
    }
    userCredentials = @{
        snowflakeAuthType = "KeyPair"
        snowflakeUsername = "your_service_account"
        snowflakeKeyPairKey = $privateKeyContent
        snowflakeKeyPairPass = $keyPassphrase
        snowflakeWarehouse = "your_warehouse"
        snowflakeRole = "your_role"
    }
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer $coalesceBearerToken"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "https://your-instance.coalescesoftware.io/scheduler/startRun" -Method Post -Headers $headers -Body $body
```

**Python (Apache Airflow):**

```python
import requests
from airflow.models import Variable

def trigger_coalesce_job():
    # Get private key from Airflow Variable (stored securely)
    private_key = Variable.get("SNOWFLAKE_PRIVATE_KEY")
    
    payload = {
        "runDetails": {
            "jobID": Variable.get("COALESCE_JOB_ID"),
            "environmentID": Variable.get("COALESCE_ENV_ID")
        },
        "userCredentials": {
            "snowflakeAuthType": "KeyPair",
            "snowflakeUsername": Variable.get("SNOWFLAKE_USERNAME"),
            "snowflakeKeyPairKey": private_key,
            "snowflakeWarehouse": Variable.get("SNOWFLAKE_WAREHOUSE"),
            "snowflakeRole": Variable.get("SNOWFLAKE_ROLE")
        }
    }
    
    headers = {
        "Authorization": f"Bearer {Variable.get('COALESCE_API_TOKEN')}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://your-instance.coalescesoftware.io/scheduler/startRun",
        json=payload,
        headers=headers
    )
    
    return response.json()
```

## Troubleshooting Common Issues

### JWT Token Invalid Errors

**Symptoms:**

- "JWT token is invalid" error messages.
- Authentication failures despite correct credentials.

**Solutions:**

1. **Verify key assignment in Snowflake:**

   ```sql
   DESC USER your_service_account;
   -- Check that RSA_PUBLIC_KEY_FP is populated with a fingerprint value
   ```

2. **Validate account identifier:** Ensure you're using the correct Snowflake account identifier format in your connection settings.

3. **Check private key format:**

   - Ensure the private key includes proper header and footer lines.
   - Verify there are no extra spaces, line breaks, or invalid characters.
   - The key should be continuous text between the header and footer.

### Private Key Parsing Failures

**Symptoms:**

- "Unable to parse private key" errors.
- Connection validation failures in Coalesce.

**Solutions:**

1. **Test key validity:**

   ```bash
   # Verify your private key is valid
   openssl rsa -in rsa_key.p8 -check
   ```

2. **Special character handling in passphrases:** If your passphrase contains special characters such as `;` or `#`, you may need to escape them:
   - Example: `hnw6a#n` should be entered as `hnw6a\#n`.
   - This is particularly important if you're storing the passphrase in configuration files.

3. **Format requirements:**
   - The private key must be in PEM format.
   - Ensure no extra whitespace before or after the header and footer lines.
   - Maintain original line breaks within the key content.

### Environment-Specific Authentication Issues

**Symptoms:**

- Authentication works in development but fails in production.
- Cached credential issues after switching authentication methods.

**Solutions:**

1. **Clear Environment cache:** After changing authentication methods, redeploy your Environments. This ensures all cached credentials are refreshed.

2. **Service account configuration:**
   - Use dedicated service accounts for automated processes
   - Verify the service account has the necessary Snowflake roles assigned:

   ```sql
   -- Check service account permissions
   SHOW GRANTS TO USER your_service_account;
   ```

3. **Consistent authentication:** Ensure all Environments use the same authentication method. Avoid mixing password and key pair authentication for the same user.

### Connection Test Failures

**Symptoms:**

- **Test Connection** button fails in Coalesce UI.
- Error messages about invalid credentials or permissions.

**Solutions:**

1. **Verify all required fields:**
   - Username must match the Snowflake user with the assigned public key
   - Private key must be complete with headers and footers
   - Passphrase must be provided if the key is encrypted
   - Role must be a valid role assigned to the user
   - Warehouse must exist and be accessible to the user

2. **Check Snowflake user status:**

   ```sql
   -- Ensure user is not locked or disabled
   SHOW USERS LIKE 'your_service_account';
   ```

3. **Validate role and warehouse access:**

   ```sql
   -- Verify the user can access the specified warehouse
   USE ROLE your_role;
   USE WAREHOUSE your_warehouse;
   ```

### Authentication Policy Conflicts

**Symptoms:**

- `Authentication attempt rejected by the current authentication policy` error.
- Key pair works in some accounts or for some users but not others.

If you see this error, Snowflake's account-level or user-level authentication policies are blocking your key pair login. Snowflake documentation states that key pair and OAuth are exempt from MFA policies, but custom authentication policies can still restrict which methods are allowed.

**What causes this:** Account-level or user-level authentication policies in Snowflake can restrict login to specific methods (for example, password only, PAT only, or SSO only). A policy that allows only PAT (Personal Access Token) authentication will block key pair users until the policy is changed or a separate policy allows key pair for the affected users.

**How to resolve it:**

1. **Identify the policy:** Ask your Snowflake SECURITYADMIN which authentication policy is assigned to your account or to your service account user. Policies can be set at the account level (default for all users) or at the user level.

2. **Request a user-level policy for service accounts:** For Coalesce service accounts that use key pair authentication, work with SECURITYADMIN to create or assign a user-level authentication policy that explicitly allows key pair authentication. This keeps account-wide policies (for example, MFA for interactive users) in place while permitting key pair for automation.

3. **Avoid PAT-only policies for key pair users:** If an account or user has a policy that allows only PAT authentication, key pair will fail. Either revert or adjust the policy to include key pair, or assign a different policy to users who need key pair for Coalesce.

:::tip[Coordinate With Your Snowflake Admin]

Authentication policies are managed in Snowflake, not in Coalesce. Document which Coalesce service accounts use key pair auth so your SECURITYADMIN can assign appropriate user-level policies.

:::

## Best Practices

### Service Accounts

- Use dedicated Snowflake service accounts for automation.
- Apply the principle of least privilege when assigning Snowflake roles.
- Monitor service account usage and access patterns.
- Document which applications and processes use each service account.

### Migration From Password Authentication

If you're migrating from password-based authentication to key pair authentication:

1. **Preparation phase:**
   - Generate and test key pairs in Development Workspaces.
   - Update any automation scripts or API integrations.
   - Coordinate with your security team on key management procedures.
   - Document the migration plan and rollback procedures.

2. **Implementation phase:**
   - Deploy key pair authentication to Development Workspaces first.
   - Test all Job executions and API integrations.
   - Gradually migrate Production Environments.
   - Maintain password authentication as a fallback during transition.

3. **Validation phase:**
   - Monitor Job execution success rates.
   - Verify all automated processes function correctly.
   - Confirm all API integrations work as expected.
   - Once stable, remove password-based authentication configurations.

[key pair authentication]: https://docs.snowflake.com/en/user-guide/key-pair-auth
[start-run-api]: https://docs.coalesce.io/docs/api/runs/startrun
[cli-setup]: https://docs.coalesce.io/docs/coa/version-732-and-below/coa-setup
