## Native Authentication

Native authentication is for developers who want to completely customize the login experience through Nylas to match their application.

![Nylas Native Authentication Flow](https://developer.nylas.com/_images/Authentication_Flow_Native_V12x.png)

## When to Use Native Authentication[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#when-to-use-native-authentication)

-   You want to completely customize the entire authentication process.
-   You don’t mind handling credentials and error handling.

There are 3 steps to get an `access_token` for an account using Native Authentication:

1.  Create a branded login page and have the user enter the information.
2.  Send a request to [/connect/authorize](https://developer.nylas.com/docs/api/#post/connect/authorize) with the required credentials and scopes.
3.  Nylas returns a one-time use code. Send the code to [/connect/token](https://developer.nylas.com/docs/api/#post/connect/token) to get the access token.

## Step 1 Create a Branded Page[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#step-1-create-a-branded-page)

If you are using Native Authentication, instead of Hosted Authentication, you need to create a branded login page. The branded page is where your users will enter the login credentials.

We don’t recommend storing this information, instead, you should immediately make a request to [/connect/authorize](https://developer.nylas.com/docs/api/#post/connect/authorize) with the user-provided credentials.

Use the credentials from your branded login page and make a request to Nylas with the correct provider settings and scopes.

The request parameters are:

-   **Client ID** - The `client_id` from your Nylas application. Create a Nylas app if you need a `client_id`.
-   **Name** - Name of the User
-   **Email Address** - User email address
-   **Provider** - Name of the email provider.
-   **Settings** - The settings object will vary depending on the provider. It typically includes information such as the username, password, SMTP, client\_id, and client\_secret. Check the [provider settings](https://developer.nylas.com/docs/api/#post/connect/authorize) to learn which information you need to provide.
-   **Scopes** - Review [Authentication Scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/) to learn more.
    -   If scopes are not specified, we will add [default scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#default-scopes).

### Example `/connect/authorize` Request[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#example-/connect/authorize-request)

```
curl -X POST https://api.nylas.com/connect/authorize -d '{    "client_id": "nylas_client_id",    "name": "Nyla the Cheetah",    "email_address": "nyla@aol.com",    "provider": "aol",    "settings": {        "password": "MakeEmailSuckLess"    },    "scopes": "email.read_only,calendar.read_only,contacts.read_only"}'   
```

In the response, Nylas will return a one-time use code that you can exchange for an access\_token. This code is only valid for 15 minutes. After that time, the code will expire.

## Step 3 Exchange the Code[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#step-3-exchange-the-code)

Now that you have your one-time use code, send a request to [/connect/token](https://developer.nylas.com/docs/api/#post/connect/token) to get an access token.

### Example `/connect/token` Request[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#example-/connect/token-request)

```
curl -X POST "https://api.nylas.com/connect/token" -d '{  "client_id": "{client-id}",  "client_secret": "{client-secret}",  "code": "{nylas_code}"}'   
```

In response, Nylas will return the account information.

## Keep in Mind Native Authentication[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#keep-in-mind-native-authentication)

-   Your app will need to provide:
    -   Error handling
    -   Provider and server settings detection
    -   Handle credentials securely
-   Determine the [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/) you need. If you need to change scopes, the user will have to reauthenticate.

## Native Authentication Demo Apps[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#native-authentication-demo-apps)

Take a look at our Native Authentication examples on GitHub.

-   [Ruby Native Authentication](https://github.com/nylas/nylas-ruby/tree/main/examples/authentication)
-   [Node.js Native Authentication](https://github.com/nylas/nylas-nodejs/tree/main/example)
-   [Python Native Authentication](https://github.com/nylas/nylas-python/tree/master/examples/native-authentication-gmail)

## What's Next[](https://developer.nylas.com/docs/the-basics/authentication/native-authentication/#whats-next)

Certain providers have extra requirements. Review the documentation for each.

-   [Google](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/)
-   [iCloud](https://developer.nylas.com/docs/the-basics/provider-guides/icloud/)
-   [Microsoft](https://developer.nylas.com/docs/the-basics/provider-guides/microsoft/microsoft-authentication/)