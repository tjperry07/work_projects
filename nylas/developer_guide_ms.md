## Microsoft Developers Guide

To make sure your organization makes the most out of Nylas, there are a few things to keep in mind.

## Choose an Authentication Method[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/developer-guide/#choose-an-authentication-method)

Users will need to authenticate against your application. To do this, you can choose to either have Nylas handle your users' logins or build your own login portal.

-   [Hosted Authentication](https://developer.nylas.com/docs/the-basics/authentication/hosted-authentication/) - Nylas handles the authentication.
-   [Native Authentication](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/) - You'll need to build out the authentication but you're able to fully customize the experience.

Once you've decided on an authentication method, you can choose how to collect the user's information. Microsoft offers two authentication methods:

-   [Modern/OAuth Authentication](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#modern-or-oauth-authentication)
-   [Basic Authentication](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/#basic-authentication)

We recommend reading about both options to determine which method will work best for you.

## Office 365[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/developer-guide/#office-365)

-   Modern/OAuth with Native Authentication only works with Office 365 accounts. To use this method, you'll need to do the following:
    
    -   Create an [Azure application](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
    -   [Invite Nylas](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/invite-nylas-to-your-project/) to your application.
    -   Publish your application and go through [Microsoft Domain Verification](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-configure-publisher-domain).
    -   Become a [Microsoft Verified Publisher](https://docs.microsoft.com/en-us/azure/active-directory/develop/publisher-verification-overview#benefits).
-   Modern/OAuth with Hosted authentication only works with Office 365 accounts. To use this method, you'll need to do the following:
    
    -   Create an [Azure application](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
    -   [Invite Nylas](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/invite-nylas-to-your-project/) to your application.
    -   Publish your application and go through [Microsoft Domain Verification](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-configure-publisher-domain).
    -   Become a [Microsoft Verified Publisher](https://docs.microsoft.com/en-us/azure/active-directory/develop/publisher-verification-overview#benefits).
-   Users can't use an email alias. They need to use the actual email address.
    
-   If the email address uses two-factor authentication/multi-factor authentication, you'll need to enter the app-generated password in place of the password for the email address.
    
-   If your Office 365 application has Exchange Web Services (EWS) scopes and we're unable to connect, we'll fall back to use Exchange ActiveSync (EAS). For more information, check out our article on [How to Detect Mobile Device Management (MDM) Issues for EAS](https://developer.nylas.com/docs/support/troubleshooting/microsoft/detect-mdm-issues-eas/).
    

## Exchange[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/developer-guide/#exchange)

-   If your application requires contacts, **you need to use EAS**. Make sure the contacts scope for both Nylas and Azure is enabled.

## Basic Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/developer-guide/#basic-authentication)

Below are some things to keep in mind if you're using Basic Authentication:

-   An Azure application isn't needed.
-   This method uses the username and password to authenticate.
-   If you have 2FA enabled, you need to provide the app password instead of the email password.
-   If you're trying to enable one of the following personal accounts, you will have to use Basic Authentication:
    -   Office 365
    -   Outlook
    -   Live
    -   Hotmail
-   If the account is sourced from Active Directory, you can use Modern Authentication. Check with your system administrator to confirm the account type.

## Service Accounts[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/developer-guide/#service-accounts)

Below are some things to keep in mind when using service accounts:

-   You must use Native Authentication with service accounts.
-   Create an [Azure application](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/create-azure-app/).
-   [Invite Nylas](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/invite-nylas-to-your-project/) to your application.

## What's Next?[](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/developer-guide/#whats-next)

-   [Hosted Authentication](https://developer.nylas.com/docs/the-basics/authentication/hosted-authentication)
-   [Native Authentication](https://developer.nylas.com/docs/the-basics/authentication/native-authentication)
-   [Microsoft Authentication](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication)
