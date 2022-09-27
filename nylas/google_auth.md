## Google Authentication

Google requires that you create an application in the Google console before you can integrate them with Nylas. Check out our article on [creating a Google application](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/) for more information. Depending on the scopes you choose from production, you'll need to undergo a Google security review. Nylas can [assist](https://www.nylas.com/blog/express-security-review) you with taking your application to production.

**IMAP Authentication**

Nylas recommends avoiding using IMAP. IMAP has reduced functionality and will eventually be [deprecated by Google](https://workspaceupdates.googleblog.com/2019/12/less-secure-apps-oauth-google-username-password-incorrect.html).

## Prerequisites[](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/#prerequisites)

-   [Hosted Authentication](https://developer.nylas.com/docs/the-basics/authentication/hosted-authentication)
-   [Native Authentication](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/)
-   Google recently made some changes to how end users approve scopes. Review our [guide](https://www.nylas.com/blog/google-authentication-guide) to make sure your users have a seamless experience.

## Google Hosted Authentication Steps[](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/#google-hosted-authentication-steps)

1.  Make sure you've followed the steps to [create a Google application](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/).
2.  Use Hosted Authentication as you normally would.

## Google Native Authentication Steps[](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/#google-native-authentication-steps)

Native Authentication with Google requires you to get a [refresh\_token](https://developers.google.com/identity/protocols/oauth2/web-server) from Google. A `refresh_token` is part of the OAuth 2.0 protocol and gives you access to Google APIs. To implement the `refresh_token` portion, we recommend using one of the Google Client libraries to automate the process.

![Google Native Authentication](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/google_oauth.png)

To implement Native Authentication, follow the steps below:

1.  Make sure you've followed the steps to [create a Google application](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/).
    
2.  Redirect the user to your OAuth login page.
    
3.  Google sends the authentication code to your application.
    
4.  Request the [refresh\_token](https://developers.google.com/identity/protocols/oauth2/web-server) from Google.
    
5.  Google returns the `refresh_token`.
    
6.  Make a request to [/connect/authorize](https://developer.nylas.com/docs/api/#post/connect/authorize) using the `google_client_id`, `google_client_secret` and `google_refresh_token`.
    
    ```
    curl -X POST https://api.nylas.com/connect/authorize -d '{     "client_id": "nylas_client_id",    "name": "Nyla the Cheetah",    "email_address": "nyla@nylas.com",    "provider": "gmail",    "settings": {        "google_client_id": "{google_api_client_id}",        "google_client_secret": "{geoogle_api_client_secret}",        "google_refresh_token": "{google_api_refresh_token}"    },    "scopes": "email.read_only,calendar.read_only,contacts.read_only"}'   
    ```
    
7.  Nylas returns a one-time use authorization code.
    
8.  Make a request to [/connect/token](https://developer.nylas.com/docs/api/#post/connect/token)
    
    ```
    curl -X POST "https://api.nylas.com/connect/token" -d '{  "client_id": "{client-id}",  "client_secret": "{client-secret}",  "code": "{nylas_code}"}'   
    ```
    
9.  Nylas returns an `access_token` for the account.
    

## Scopes[](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/#scopes)

Before authorizing a user, you'll want to make sure you have the correct [Nylas scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/) in your request. If you need to change scopes, the user will have to re-authenticate.

## Example Apps[](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/#example-apps)

We've created several Google Native Authentication example applications to show you how to implement the process in your app.

-   [Ruby Native Authentication](https://github.com/nylas/nylas-ruby/tree/main/examples/authentication)
-   [Node.js Native Authentication](https://github.com/nylas/nylas-nodejs/tree/main/example)
-   [Python Native Authentication](https://github.com/nylas/nylas-python/tree/master/examples/native-authentication-gmail)

## What’s Next?[](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/#whats-next)

-   [Google Workspace Service Accounts](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-workspace-service-accounts/)
-   [Hosted Authentication Endpoint](https://developer.nylas.com/docs/api/#tag--Hosted-Authentication)
-   [Native Authentication Endpoint](https://developer.nylas.com/docs/api/#tag--Native-Authentication)
-   [Create a Google Application](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/)