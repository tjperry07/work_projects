## Create a Google Application

Before you create your application with Google, there are a few things to keep in mind.

## Hosted or Native Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#hosted-or-native-authentication)

You'll first need to decide which method of authentication works for you.

### Hosted Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#hosted-authentication)

This is the fastest way to get started. If you aren't interested in customizing your application, or want to test with a few users, use Hosted Authentication.

-   Review our [Hosted Authentication Guide](https://developer.nylas.com/docs/the-basics/authentication/hosted-authentication).

### Native Authentication[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#native-authentication)

Use this method if you'd like to customize your application. This means your users will see your company name instead of Nylas on the OAuth screen. Native Authentication requires that you have an application built with a callback URL.

-   Review our [Native Authentication Guide](https://developer.nylas.com/docs/the-basics/authentication/native-authentication).

We also recommend reviewing our [Google Authentication Guide](https://developer.nylas.com/docs/the-basics/provider-guides/google/google-authentication/).

**Switching Authentication Methods**

Switching between Hosted and Native Authentication will require a new application and for accounts to be re-authenticated.

## Internal or External Application[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#internal-or-external-application)

You'll also need to decide if you want your application available to anyone or only users that are part of your organization.

### Internal Application[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#internal-application)

For any development or production applications that are for internal use only, we recommend using internal users for Google account access. Only users who have an account within your organization, i.e. any user with a `@your-organization.com` email address, can access the application.

When users from your organization authorize against your application, they won't see the unverified application warning.

Use internal applications to skip the app verification and security review process. If anyone outside your organization needs to verify against your application at any time, you'll need to go through Google's security review.

### External Application[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#external-application)

For any production applications that will need to go through Google's security verification, use external users. This option will allow users who aren't from your organization to authenticate against your application.

When users from your organization authorize against your application, they'll see the unverified application warning.

External apps are limited to 100 accounts before verification.

## Create a Google App[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#create-a-google-app)

Follow the steps below to create your Google application:

1.  Browse to [https://console.cloud.google.com/projectcreate](https://console.cloud.google.com/projectcreate)
    
    ![Google Create Project page](https://developer.nylas.com/_images/google/google_create_new_project.png)
2.  Give your project a name.
    
3.  Select your project **Organization** and **Location**.
    
4.  It can take several minutes for the project to be created. Once complete, you'll return to the dashboard with Create Project notifications.
    

![Google Cloud Platform Dashboard notification for Create Project](https://developer.nylas.com/_images/google/google_project_notification.png)

## Enable Your APIs[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#enable-your-apis)

1.  From the Google Cloud Platform home page, click **APIs and Services > Enable APIs and Services**.
    
    ![Google Console Enable APIs](https://developer.nylas.com/_images/google_console_enable_apis.png)
2.  Search for and enable the following APIs:
    

-   Gmail API - Required to read and send messages including drafts and attachments. Needed for threads, labels, drafts, outbox, send, files, and neural.
-   Google Calendar API - Required to use the calendar and events endpoints. Required for Scheduler and Agenda Components.
-   People API - Required for contacts and Contact List Component.
-   Admin SDK API - Enable this if you need access to room information for calendar events.

![Google API Library](https://developer.nylas.com/_images/google_api_library.png)

## Configure Your OAuth Screen[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#configure-your-oauth-screen)

You can configure your application's OAuth screen. This is the page users will see when they authenticate your application.

![Google OAuth Screen](https://developer.nylas.com/_images/google_oauth_consent_screen.png)

-   From the [Google APIs dashboard](https://console.developers.google.com/apis/dashboard), click **OAuth consent screen**.
-   Choose either [Internal](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#internal-application) or [External](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#external-application) for your user type.

### Internal OAuth Screen[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#internal-oauth-screen)

1.  Fill out the required OAuth consent information. Use `nylas.com` for the **Authorized domains**.
2.  Click **Save and Continue**.
3.  Click **Add or Remove Scopes**.
4.  Select `.../auth/userinfo.email`, `.../auth/userinfo.profile`, and `openid`.
5.  Review the [Google scopes](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#google-authentication-scopes) and how they map Nylas. Select the scopes needed for your application.
6.  Review the **Summary** and make sure the information is correct for your application.

### External OAuth Screen[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#external-oauth-screen)

1.  Fill out the required OAuth consent information. Use `nylas.com` for the **Authorized domains**.
2.  Click **Save and Continue**.
3.  Click **Add or Remove Scopes**.
4.  Select `.../auth/userinfo.email`, `.../auth/userinfo.profile`, and `openid`.
5.  Review the [Google scopes](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#google-authentication-scopes) and how they map Nylas. Select the scopes needed for your application.
6.  At step 3, **Test Users,** you can skip this for now. We’ll go back and change the app to **Production.**
7.  Review the **Summary** and make sure the information is correct for your application.
8.  Click **Back to Dashboard**.
9.  Under the heading **Publishing status,** click **Publish App.**

Publishing your app sets it so that you'll need to authorize users using the Nylas API instead of adding them one at a time to the Google test users. The app will show as unverified until you go through the [Google security review](https://www.nylas.com/blog/express-security-review).

![Google Console App Dashboard](https://developer.nylas.com/_images/google_console_app_dashboard.png)

## Google Authentication Scopes[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#google-authentication-scopes)

Review the scopes and choose the ones needed for your application.

**Known Bug in Google Scopes**

Due to a [known bug with the Google API](https://issuetracker.google.com/issues/115621456), you shouldn't authenticate Google accounts with both `email.read_only` and `email.metadata` scopes. This will cause Google to return 403 errors.

| Google Scope | Nylas Scopes |
| --- | --- |
| userinfo.email | Required Google scopes |
| userinfo.profile | Required Google scopes |
| openid | Required Google scopes |
| gmail.compose | email.drafts, email.send |
| gmail.modify | email.modify, email.send |
| gmail.labels | email.folders\_and\_labels |
| gmail.metadata | email.metadata |
| gmail.send | email.send |
| gmail.readonly | email.read\_only |
| calendar | calendar |
| calendar.readonly | calendar.read\_only |
| contacts | contacts |
| admin.directory.resource.calendar.readonly | room\_resources.read\_only |

## Create Credentials[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#create-credentials)

1.  Click **Create Credentials** or **Credentials**.
2.  Select **OAuth client ID**.
3.  Select **Web Application** as the **Application Type**.
4.  Give the application a name.
5.  Update the **Authorized redirect URIs:**
    -   **Hosted Authentication** - [https://api.nylas.com/oauth/callback](https://api.nylas.com/oauth/callback)
    -   **Native Authentication** - Use the callback URI for your application.
6.  Click **Create**.
7.  You’ll see your Client ID and Secret displayed in **OAuth client created.** Save these somewhere safe as you'll need them for your Nylas application.

![Google Console Create Credentials](https://developer.nylas.com/_images/google_console_create_credentials.png)

## Add Nylas to Your Application[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#add-nylas-to-your-application)

Adding Nylas as an application owner helps our support team diagnose any issues that you may encounter.

1.  Click the menu, and select **IAM & Admin > IAM**.
2.  Click **Add**.
3.  Add `support@nylas.com` as an owner.
4.  Click **Save**.

![Google Console IAM](https://developer.nylas.com/_images/google_console_IAM.png)

### Push Notification Requirements[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#push-notification-requirements)

For push notifications from Google to Nylas, Nylas must be added as an application owner. This allows you to verify `api.nylas.com` as a domain. For EU customers, you'll also need to verify the domain `ireland.api.nylas.com`.

Navigate to **API & Services > Domain Verification** to verify domains. These domains are only verifiable through `support@nylas.com`.

## Add Your Client ID and Client Secret to Nylas[](https://developer.nylas.com/docs/the-basics/provider-guides/google/create-google-app/#add-your-client-id-and-client-secret-to-nylas)

1.  Log in to your [Nylas Dashboard](https://dashboard.nylas.com/).
    -   If you don’t have an application, select **Create New App**.
2.  Select the App you want to update.
3.  Click **App Settings**.
4.  Select **Google OAuth**.
5.  Fill out your **Google OAuth Client ID** and **Google OAuth Client Secret**.

![Nylas Dashboard Google Auth](https://developer.nylas.com/_images/nylas_dashboard_google_auth.png)

**Congrats!**

You’ve created a Google App and added it to your Nylas application!