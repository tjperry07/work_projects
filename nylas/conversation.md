## Conversation Component

View a list of threads or messages in a conversation view. Without writing a single line of code, the Conversation Component comes with:

-   Theme options
-   Chat through email
-   Customization options

![Static image showing a fictional conversation between two people about getting pizza.](https://developer.nylas.com/_images/components/conversation_component.png)

## How It Works[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#how-it-works)

The Conversation Component allows your users to send emails using a chat interface. When a new chat message is sent, an email is being sent. These will show in the user's mailbox.

**Clean Conversations API**

The Conversations Component uses the [Clean Conversations](https://developer.nylas.com/docs/intelligence/clean-conversations/) endpoint. Reach out to our [sales team](https://www.nylas.com/company/contact-platform-specialist/) or account manager for pricing. If the endpoint is not enabled, the Component will return an error message.

## Quickstart[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#quickstart)

1.  Create a Conversation Component in your Nylas Dashboard.
2.  Add it to your application.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-conversation"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-conversation id="<YOUR-COMPONENT-ID>"> </nylas-conversation>    </body>   
```

**That’s It! Your Conversation Component is ready to use!**

## Prerequisites[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#prerequisites)

-   Either an existing Nylas application or sign up using our [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/).
-   If using an existing application, make sure you have the minium required [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#nylas-scopes).
    -   Agenda - `calendar`
    -   Composer - `email.modify`, `email.send`,and `contacts`
    -   Contact List - `contacts`
    -   Email - `email.modify`,`email.folders_and_labels`, and `contacts`
    -   Messages - `email.read_only` and `contacts`
-   An application to add the Component to. You can fork one of the many CodeSandboxes in the documentation.

## Conversation Installation Options[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#conversation-installation-options)

You can install the Conversation Component 2 ways:

### npm Package[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#npm-package)

[Conversation on npm](https://www.npmjs.com/package/@nylas/components-conversation)

1.  Run `npm i @nylas/components-conversation` or `yarn add @nylas/components-conversation`
2.  Then import and render the component.

```
    // Import the web component    import '@nylas/components-conversation';        // In render method    <nylas-conversation></nylas-conversation>   
```

### Script Tag[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#script-tag)

Use the CDN script tag, `https://unpkg.com/@nylas/components-conversation`.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-conversation"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-conversation></nylas-conversation>    </body>   
```

## Ways to Use the Conversation Component[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#ways-to-use-the-conversation-component)

-   [Use the Conversation Component with Nylas Data](https://developer.nylas.com/docs/user-experience/components/conversation-component/#use-the-conversation-component-with-nylas-data) - Choose this option if you want to integrate your existing Nylas accounts with the Conversation Component.
-   [Use the Conversation Component with External Data](https://developer.nylas.com/docs/user-experience/components/conversation-component/#use-conversation-component-with-external-data) - Choose this option if you want to pass in your data.

### Use the Conversation Component with Nylas Data[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#use-the-conversation-component-with-nylas-data)

You'll learn how to use your Nylas accounts with the Conversation Component.

#### Create the Conversation Component[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#create-the-conversation-component)

1.  Log in to your [Nylas Dashboard](https://dashboard.nylas.com/applications/app).
2.  Click **Components > Conversation**
3.  Name your Component and select the account. To quickly start testing your Component select **Enable for a single account.**
    1.  To learn how to enable components for multiple accounts see [Authorizing Components](https://developer.nylas.com/docs/user-experience/components/conversation-component/#authorizing-components).
4.  Use an existing access token or generate a new one.
5.  Enter the [domain](https://developer.nylas.com/docs/user-experience/components/conversation-component/#domain-restriction) the component will run on. Without the [domains](https://developer.nylas.com/docs/user-experience/components/conversation-component/#domain-restriction) the component will not run.
    1.  To run on localhost, enter an asterisk. `*`. Remember to change this before going to production.
6.  Save your new component.
7.  On the **Edit** page, you can configure your component behavior and appearance.

**Generate an Access Token**

Generating a new access token will not replace your existing access token; it will create a new access token with the same scopes as the previous token. You can [revoke access tokens](https://developer.nylas.com/docs/api/#post/oauth/revoke) at any time.

### Add the Component To Your Application[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#add-the-component-to-your-application)

1.  On the **Edit** page, there are instructions for installing the new Component.
2.  If you haven't installed the Contact List Component already, open a terminal and run `npm i @nylas/components-conversation`.
3.  Then add your Nylas Component. Copy and paste your component code into your application.  
    `<nylas-conversation="your-component-id"></nylas-conversation>`.
4.  You should refresh your application if needed. Any [customization options](https://developer.nylas.com/docs/user-experience/components/conversation-component/#customization) set on the editing page will apply to your Component.

### Use Conversation Component with External Data[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#use-conversation-component-with-external-data)

You can pass in any data you want. It should be formatted as a [Message](https://developer.nylas.com/docs/api#tag--Messages) or [Thread](https://developer.nylas.com/docs/api#tag--Threads) object. Check out our [sandbox](https://replit.com/@nylasinc/conversation-external-data) for an example.

With components, you can authorize them to work with a single account or multiple accounts.

### Enable for a Single Account[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#enable-for-a-single-account)

A single account is a way to get started quickly. If you use this method in production, you'll have to authenticate each account from the dashboard one by one.

![Enable components single account](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_single_account.png)

### Enable for All Accounts[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#enable-for-all-accounts)

To enable all accounts, you'll need to pass in a user's access token as a property of the component. One way to achieve this is to create a login screen, capture the access token and pass it into the component. You can pass in `access_tokens` directly in the Component.

`<nylas-agenda id="COMPONENT-ID" access_token="USER-ACCESS-TOKEN"/>`

Make sure to keep `access_tokens` hidden and never expose them online.

![Enable Components for all accounts](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_all_accounts.png)

**Dashboard Preview**

Dashboard previews do not work when enabling for all accounts.

## Customization[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#customization)

Nylas Components are flexible and can be customized for your needs.

### Conversation Properties[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#conversation-properties)

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| thread\_id | string | ID of the thread to display. | None |
| messages | array | Array of message objects | None |
| theme | string | `theme-1`, `theme-2`, `theme-3`, `gmail`, `ellsworth-kelly` | theme-1 |
| show\_avatars | boolean | Show contact avatars | true |
| show\_reply | boolean | Show replies to messages | true |

#### Conversation Event Listeners[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#conversation-event-listeners)

| Name | Description |
| --- | --- |
| `manifestLoaded` | When the event manifest is loaded. The handler is passed the `manifest` argument. |
| `onError` | Emitted if an error occurs while fetching data in the component. The handler is passed an object with the component id as the key and the error as the value. |
| `sendMessageClicked` | When the send message button is clicked. |

### Allowed Domains[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#allowed-domains)

You can restrict the domains that your Component works on. Use glob patterns to enable or disable domains.

Some examples of glob patterns:

-   `nylas.com` will only match [nylas.com](http://nylas.com/)
-   `subdomain.nylas.com` will match `subdomain.nylas.com`
-   `*subdomain.nylas.com` will match `subdomain.nylas.com` and `sub.sub.subdomain.nylas.com`
-   `*` will match any domain

Domain restriction only applies to the domain name. URL paths (/sub-path) or protocols (HTTPS) can not be restricted.

### How Properties Are Handled[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#how-properties-are-handled)

Nylas Components follow an order of operations to decide if the dashboard or code takes precedence.

1.  If the property **is** passed directly to the Component, use that first.
2.  If the property **is not** passed directly in the Component, use the dashboard settings.
3.  If there are **no properties** set in the Component or the dashboard, use the Component defaults.

## Demo Apps[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#demo-apps)

-   [Conversation using external data](https://replit.com/@nylasinc/conversation-external-data)
-   [Conversation event listeners](https://replit.com/@nylasinc/conversation-component-listeners)

## What's Next?[](https://developer.nylas.com/docs/user-experience/components/conversation-component/#whats-next)

**Take a look at other Components:**

-   [Mailbox Component](https://developer.nylas.com/docs/user-experience/components/mailbox-component)
-   [Contact List Component](https://developer.nylas.com/docs/user-experience/components/contact-list-component/)
-   [Agenda Component](https://developer.nylas.com/docs/user-experience/components/agenda-component/)
-   [Conversation Component](https://developer.nylas.com/docs/user-experience/components/conversation-component/)
-   [Email Component](https://developer.nylas.com/docs/user-experience/components/email-component)
-   [Composer Component](https://developer.nylas.com/docs/user-experience/components/composer-component/)

**Check us out on GitHub:**

-   [Components repo](https://github.com/nylas/components)
-   [Code Samples repo](https://github.com/nylas-samples)