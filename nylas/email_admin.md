## Microsoft Email Administrator Guide

If you're an email administrator, there are a few things you can do to make sure your organization makes the most out of Nylas.

## General Settings[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/email-admin/#general-settings)

The following settings apply no matter what type of setup you're using:

-   We recommend using Modern Authentication or OAuth for all accounts.
-   Users can't use an alias to sign in.
-   If the email account requires 2FA, then the user needs to use the app password to sign in.
-   We recommend reviewing our [suggested Office 365 settings](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/suggested-office-365-settings/).

## Office 365[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/email-admin/#office-365)

-   If you're using Basic Authentication and your app passwords aren't enabled, Nylas integration won't work. To resolve this, you can either:
    -   Enable app passwords.
    -   Enable Modern Authentication or OAuth. You'll then also need to set up OAuth for Office 365. Follow the steps in [Create an Azure App](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   If the account is only accessible through a corporate network, VPN, or firewall, you'll need to allow Nylas to connect.
-   During development, you may be asked to [approve](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/admin-approval/) the Azure app if you're using OAuth or Modern Authentication.
-   You may need to allowlist Nylas IP addresses. You can get a list of our [current IP addresses](https://developer.nylas.com/docs/api/#get/a/client_id/ip_addresses) from our API. Please keep in mind that these IP addresses may change at any time.
-   Nylas is unable to sync users that are in admin groups. This is a Microsoft limitation.

## Exchange[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/email-admin/#exchange)

-   Set up a [Microsoft Exchange Login](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-exchange-login/).
-   If the account is only accessible through a corporate network, VPN, or firewall, you'll need to allow Nylas to connect.
-   Make sure that you enable Exchange ActiveSync (EAS) outside of the corporate network and check the [quarantine list](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/quarantined-eas-devices/) for any Nylas connections.
-   Turn on Exchange Web Services (EWS). EWS must be visible outside of the corporate network and enabled for the individual mailbox.
-   If your application requires contacts, **you need to use EAS**. Make sure the contacts scope is enabled for both Nylas and Azure.
-   If auto-discovery is available, we'll attempt to use it. Otherwise, you’ll need to provide all of the settings.
    -   If a user has to enter server settings, then we weren't able to use auto-discovery.
-   Because we use EWS for email and calendar sync, your users must have this turned on. If you're unable to get your users to turn EWS on, let us know and we can force it to use ActiveSync instead.
-   If you're using Basic Authentication and your app passwords aren't enabled, Nylas integration won't work. To resolve this, you can either:
    -   Enable app passwords.
    -   Enable Modern Authentication or OAuth. You'll then also need to set up OAuth for Office 365. Follow the steps in [Create an Azure App](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   During development, you may be asked to [approve](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/admin-approval/) the Azure app if you're using OAuth or Modern Authentication.
-   If your Office 365 application has EWS scopes and we're unable to connect, we'll fall back to use EAS.

## Troubleshooting[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/email-admin/#troubleshooting)

Below are some common issues you may experience while configuring integration with Microsoft:

-   [Office 365 OAuth 403 Error](https://developer.nylas.com/docs/support/troubleshooting/microsoft/authentication/status-403/)
-   [How to Detect Mobile Device Management (MDM) Issues for EAS](https://developer.nylas.com/docs/support/troubleshooting/microsoft/detect-mdm-issues-eas/)
-   [Microsoft Authentication Errors](https://developer.nylas.com/docs/support/troubleshooting/microsoft/authentication/)
-   [Microsoft General Troubleshooting](https://developer.nylas.com/docs/support/troubleshooting/microsoft/)
