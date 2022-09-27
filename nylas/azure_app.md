## Create an Azure App

This guide covers how to set up a Microsoft OAuth application to start authenticating Microsoft 365 users via OAuth.

If you don't already have one, create your free [Microsoft Azure](https://azure.microsoft.com/en-us/free/) account. You'll use this account to create the Microsoft developer application that is used for authenticating end users via OAuth with Nylas.

**Staging and Production OAuth**

Don't set up Microsoft 365 on your production app before testing on your staging app. Once you add the OAuth settings, you can't delete them.

## Create an OAuth Application[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#create-an-oauth-application)

Using the Azure web portal, create an app for authenticating your users to Microsoft 365.

### Log in to Azure[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#log-in-to-azure)

1.  Browse to [https://portal.azure.com](https://portal.azure.com/) and log in.
2.  In the menu, click **Azure Active Directory**.
3.  Click **App Registrations**.
4.  Click **New Registration**.

![Azure Portal Home](https://developer.nylas.com/_images/portal_azure_home.png)

### New App Registration[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#new-app-registration)

1.  Give your application a name. This will be visible to your users.
    
2.  Set the audience for this app to **Account in any organizational directory** to be able to log in to any account using Microsoft 365. If you're builiding an internal app, you can restrict it to internal accounts by setting it to **Accounts in this organizational directory only**
    
3.  Set the **Redirect URI** to **Web**
    
    -   If you are using Hosted Authentication, use `https://api.nylas.com/oauth/callback`.
    -   If you are using Hosted Authentication and are using our European datacenter, use `https://ireland.api.nylas.com/oauth/callback`.
    -   If you are using Native Authentication, use your app's callback URI.
4.  Click **Register**
    

![Azure Register App](https://developer.nylas.com/_images/microsoft/azure_register_app.png)

**Congrats!**

You've just created your app!

## Enable the Required APIs[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#enable-the-required-apis)

To enable the required APIs, you need to add the permissions to the app's Manifest.

### Required Permissions[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#required-permissions)

-   Azure Active Directory Graph
    -   User.Read - Sign in and read user profile
-   Microsoft Graph
    -   offline\_access - Maintain access to data you've given it access to
    -   openid - Sign users in
    -   profile - View users' basic profile
    -   User.Read - Sign in and read user profile
    -   Calendars.Read.Shared - Read user calendars
    -   Calendars.ReadWrite.Shared - Read and write to user calendars
    -   EAS.AccessAsUser.All - Access mailboxes via Exchange ActiveSync
    -   EWS.AccessAsUser.All - Access mailboxes as the signed-in user via Exchange Web Services

To get there from within the Azure portal:

1.  Go to **Home > Azure Active Directory > App Registrations**.
2.  Click on the app you want to configure.
3.  On the left, click **Manifest**.
4.  In the code, look for `requiredResourceAccess`.

The application manifest allows you to update the app directly by editing the JSON. To learn more about the Manifest, click [here](https://docs.microsoft.com/azure/active-directory/develop/active-directory-application-manifest?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps).

![Azure App Manifest](https://developer.nylas.com/_images/Manifest_Azure.png)

**Existing Manifest Data**

If you already have values in `requiredResourceAccess`, you will need to add to the existing data. if you need help with this, please reach out to [Nylas support](https://support.nylas.com/hc/en-us/requests/new). To help get support faster, add [Nylas to your application as a user](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/invite-nylas-to-your-project/).

5.  Update the `requiredResourceAccess` to include the Manifest code. If there are existing permissions, this will overwrite them.

### Manifest JSON[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#manifest-json)

This example includes [the required Graph permissions when creating an Azure App with the changes to Microsoft Exchange Online and Basic Auth](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/microsoft-basic-authentication/#create-an-azure-app).

```
 "requiredResourceAccess": [     {            "resourceAppId": "00000002-0000-0ff1-ce00-000000000000",            "resourceAccess": [                {                    "id": "266d2589-20b5-4f91-9a03-89247d1be8da",                    "type": "Scope"                },                {                    "id": "3b5f3d61-589b-4a3c-a359-5dd4b5ee5bd5",                    "type": "Scope"                }            ]        },        {"resourceAppId": "00000003-0000-0000-c000-000000000000","resourceAccess": [{"id": "a4b8392a-d8d1-4954-a029-8e668a39a170","type": "Scope"},{"id": "570282fd-fa5c-430d-a7fd-fc8dc98a9dca","type": "Scope"},{"id": "7427e0e9-2fba-42fe-b0c0-848c9e6a8182","type": "Scope"},{"id": "9769c687-087d-48ac-9cb3-c37dde652038","type": "Scope"},{"id": "a367ab51-6b49-43bf-a716-a1fb06d2a174","type": "Scope"},{"id": "5df07973-7d5d-46ed-9847-1271055cbd51","type": "Scope"},{"id": "7b9103a5-4610-446b-9670-80643382c1fa","type": "Scope"},{"id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d","type": "Scope"},{"id": "024d486e-b451-40bb-833d-3e66d98c5c73","type": "Scope"},{"id": "e383f46e-2787-4529-855e-0e479a3ffac0","type": "Scope"},{"id": "1ec239c2-d7c9-4623-a91a-a9775856bb36","type": "Scope"},{"id": "ff74d97f-43af-4b68-9f2a-b77ee6968c5d","type": "Scope"},{"id": "d56682ec-c09e-4743-aaf4-1a3aac4caa21","type": "Scope"},{"id": "37f7f235-527c-4136-accd-4a02d197296e","type": "Scope"},{"id": "64a6cdd6-aab1-4aaf-94b8-3cc8405e90d0","type": "Scope"},{"id": "14dad69e-099b-42c9-810b-d002981feec1","type": "Scope"},{"id": "ff91d191-45a0-43fd-b837-bd682c4a0b0f","type": "Scope"}]},        {            "resourceAppId": "00000002-0000-0000-c000-000000000000",            "resourceAccess": [                {                    "id": "311a71cc-e848-46a1-bdf8-97ff7156d8e6",                    "type": "Scope"                }            ]        } ]   
```

6.  Click **Save**
7.  All the necessary permissions have now been added. To check the API permissions, click **API Permissions** from the menu.

![Azure App Permissions](https://developer.nylas.com/_images/Azure_App_Permissions.png)

## Create the OAuth Credentials[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#create-the-oauth-credentials)

1.  From within the Azure portal, go to **Home > Azure Active Directory > App Registrations**.
2.  Click on the app you want to configure.
3.  On the left, click **Certificates & secrets**.
4.  Click **New client secret**.
5.  Enter a description and set an expiration date of **24 months**.
6.  Click **Add**.

![Azure add client secret](https://developer.nylas.com/_images/microsoft/azure/azure_add_client_secret.png)

7.  **Copy the value** from the Client secrets page and save it somewhere safe. Once you leave this page, you won't be able to retrieve the value.

![Azure Client secrets](https://developer.nylas.com/_images/microsoft/azure/azure_app_client_secrets.png "Copy the value from your Azure app")

## Copy the Client ID[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#copy-the-client-id)

In the Azure portal, go to the **App Registrations** page and copy the **Application (client) ID**.

![Azure client ID](https://developer.nylas.com/_images/Azure_Client_ID.png)

## Add Client ID and Client Secret to Nylas[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#add-client-id-and-client-secret-to-nylas)

1.  Go to your [Nylas Dashboard / App Settings / Authentication](https://dashboard.nylas.com/applications/app/settings/authentication) section.
2.  Add the Client ID and Client Secret to **Office 365 Auth.**
3.  Click **Save Changes**.

![Office365 Auth in Dashboard](https://developer.nylas.com/_images/dashboard/dashboard_auth_office365.png "The Office365 Auth section of Authentication in App Settings on the Nylas Dashboard has input fields for the OAath Client ID and Client Secret.")

## Getting Ready for Production[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/#getting-ready-for-production)

Microsoft requires apps that access user data to go through a [domain verification process](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-configure-publisher-domain). Reach out to [Nylas support](https://support.nylas.com/hc/en-us/requests/new) for more assistance.