## Microsoft Authentication

When you authenticate accounts with Microsoft, you need to decide if you want to use OAuth or Basic Authentication. Administrators can configure their app to use either protocol.

## Prerequisites[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#prerequisites)

We recommend reading our guides on Hosted and Native Authentication:

-   [Hosted Authentication](https://developer.nylas.com/docs/the-basics/authentication/hosted-authentication)
-   [Native Authentication](https://developer.nylas.com/docs/the-basics/authentication/native-authentication)

## Native Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#native-authentication)

Microsoft has two types of Exchange authentication:

-   [Basic, Exchange, or Former Authentication](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#basic-authentication)
-   [Modern or OAuth 2.0 Authentication](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#modern-or-oauth-authentication)

Administrators can choose which authentication protocol to use.

For security reasons, we recommend using OAuth or Modern Authentication. Additionally, Microsoft will be [deprecating Basic Authentication support](https://techcommunity.microsoft.com/t5/exchange-team-blog/basic-authentication-and-exchange-online-september-2021-update/ba-p/2772210) for all Exchange Online accounts as of **October 1, 2022**.

### Basic Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#basic-authentication)

Exchange or Basic Authentication is a former authentication protocol for Microsoft. Basic Authentication uses a username and password flow. The steps to set up Basic Authentication are:

-   Create a branded page where users will enter their login credentials.
-   Make a request to [/connect/authorize](https://developer.nylas.com/docs/api/#post/connect/authorize) with the user-provided credentials in the settings and required scopes.

**Autodiscovery**

Nylas will attempt to automatically discover the exchange host. You can turn this feature off by adding `exchange_server_host` to the settings. See [Exchange Auto-discovery](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/exchange-auto-discovery/) for more information.

#### Exchange Accounts Example[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#exchange-accounts-example)

```
curl -X POST https://api.nylas.com/connect/authorize -d '{    "client_id": "nylas_client_id",    "name": "Nyla the Cheetah",    "email_address": "nyla@nylas.com",    "provider": "exchange",    "settings": {        "username": "nyla@nylas.com",        "password": "MakeEmailSuckLess",        "exchange_server_host": "exchange.nylas.com"    },    "scopes": "email.read_only,calendar.read_only,contacts.read_only"}'   
```

-   In the response, Nylas will return a one-time use code that you can exchange for an `access_token`.
-   Now that you have your one-time use code, send a request to [/connect/token](https://developer.nylas.com/docs/api/#post/connect/token) to get an access token.

## Modern or OAuth Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#modern-or-oauth-authentication)

[OAuth](https://docs.microsoft.com/en-us/microsoft-365/enterprise/hybrid-modern-auth-overview?view=o365-worldwide#what-is-modern-authentication) for Microsoft requires that you do the following:

-   Obtain a [refresh\_token](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow).
-   Create an [Azure app](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   Follow the steps to go through [domain verification](https://docs.microsoft.com/en-us/microsoft-365/admin/setup/add-domain?view=o365-worldwide).
-   Become a [Microsoft verified publisher](https://docs.microsoft.com/en-us/azure/active-directory/develop/publisher-verification-overview#benefits).

![Microsoft Native Authentication](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/microsofit_oauth.png)

To set up Modern or OAuth Authentication, follow the steps below:

-   Make sure you've [created an Azure App](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   Redirect the user to your OAuth login page.
-   Microsoft then sends the authentication code to your application.
-   Request the [refresh\_token](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) from Microsoft. When requesting the refresh token, set `tenant` to `common` and set `scope` to `offline_access https://outlook.office365.com/EAS.AccessAsUser.All https://outlook.office365.com/EWS.AccessAsUser.All openid profile User.Read`
-   Microsoft then returns the `refresh_token`.
-   Make a request to [/connect/authorize](https://developer.nylas.com/docs/api/#post/connect/authorize) using the `microsoft_client_id`, `microsoft_client_secret` (from your Azure application), and the `microsoft_refresh_token`.

```
curl -X POST https://api.nylas.com/connect/authorize -d '{     "client_id": "nylas_client_id",    "name": "Nyla the Cheetah",    "email_address": "nyla@nylas.com",    "provider": "office365",    "settings":{        "microsoft_client_id":     "{microsoft_client_id}",        "microsoft_client_secret": "{microsoft_client_secret}",        "microsoft_refresh_token": "{microsoft_refresh_token}",        "redirect_uri":            "https://example.com/redirect", # Redirect URI that was originally used to get the refresh token            },    "scopes": "email.read_only,calendar.read_only,contacts.read_only"}'   
```

-   Nylas returns a one-time use authorization code.
-   Make a request to [/connect/token](https://developer.nylas.com/docs/api/#post/connect/token).

### Example POST Exchange the Token Request[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#example-post-exchange-the-token-request)

```
curl -X POST "https://api.nylas.com/connect/token" -d '{  "client_id": "{client-id}",  "client_secret": "{client-secret}",  "code": "{nylas_code}"}'   
```

-   Nylas returns an `access_token` for the account.
-   Follow the steps to go through [domain verification](https://docs.microsoft.com/en-us/microsoft-365/admin/setup/add-domain?view=o365-worldwide).
-   Become a [Microsoft verified publisher](https://docs.microsoft.com/en-us/azure/active-directory/develop/publisher-verification-overview#benefits).

## Hosted Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#hosted-authentication)

Hosted Authentication follows the OAuth 2.0 process. Nylas takes care of the authentication when using Hosted Authentication.

Hosted Authentication for Microsoft requires that you do the following:

-   Create an [Azure app](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   Follow the steps to go through [domain verification](https://docs.microsoft.com/en-us/microsoft-365/admin/setup/add-domain?view=o365-worldwide).
-   Become a [Microsoft verified publisher](https://docs.microsoft.com/en-us/azure/active-directory/develop/publisher-verification-overview#benefits).

### Microsoft Hosted Authentication Steps[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#microsoft-hosted-authentication-steps)

-   Create an [Azure App](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   Follow the steps to set up [Hosted Authentication](https://developer.nylas.com/docs/the-basics/authentication/hosted-authentication).

Nylas will attempt to detect the exchange host. If we're unable to, the user is given the option to enter the exchange host.

![Exchange Host Enter Credentials](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/exchange_host_enter_creds.png)

## Exchange Autodiscovery[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#exchange-autodiscovery)

### Native Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#native-authentication-1)

When using Native Authentication, Nylas will attempt to automatically detect the provider. You can turn auto-discovery off for Exchange accounts by specifying the `exchange_server_host` in the settings.

### Hosted Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#hosted-authentication-1)

When using Hosted Authentication, Nylas attempts to discover the Exchange server and guide the user through authentication. If we're unable to find the server, the user will need to enter the server information.

### Deactivate Auto-discovery[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#deactivate-auto-discovery)

You can turn auto-discovery off by specifying the `exchange_server_host` in the settings.

Some providers, such as Office 365 Native Authentication, don't allow you to turn off the discovery settings.

## Microsoft Exchange ActiveSync[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#microsoft-exchange-activesync)

Nylas can sync the majority of Exchange accounts. The provider attribute should be set to **exchange**.

The `exchange_server_host` value is optional. If it's not present, Nylas Cloud will attempt auto-discovery for the server host or endpoint.

## Things to Keep in Mind[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#things-to-keep-in-mind)

-   When requesting the refresh token from Microsoft make sure you properly set the tenant and scope:
    -   Set `tenant` to `common`
    -   Set `scope` to `offline_access https://outlook.office365.com/EAS.AccessAsUser.All https://outlook.office365.com/EWS.AccessAsUser.All openid profile User.Read`
-   OAuth is the preferred authentication method for security reasons.
-   You can turn off Exchange auto-discovery if you're using Native Authentication.

## Scopes[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#scopes)

Before authorizing a user, make sure you have the correct [Nylas scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/) in your request. If you need to change scopes, the user will have to re-authenticate.

## Example Apps[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#example-apps)

We've created several Microsoft Authentication applications so you can see how to implement the process in your app:

-   [Ruby Native Authentication](https://github.com/nylas/nylas-ruby/tree/main/examples/authentication)
-   [Node.js Native Authentication](https://github.com/nylas/nylas-nodejs/tree/main/example)
-   [Python Native Authentication](https://github.com/nylas/nylas-python/tree/master/examples/native-authentication-gmail)

## What’s Next?[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#whats-next)

-   [Service Accounts](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/office-365-service-accounts/)
-   [Hosted Authentication Endpoint](https://developer.nylas.com/docs/api/#tag--Hosted-Authentication)
-   [Native Authentication Endpoint](https://developer.nylas.com/docs/api/#tag--Native-Authentication)