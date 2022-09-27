## Email Component

Display a single email or thread using the Email Component. Without needing to write a single line of code, the Email Component comes with:

-   Theme options
-   To, from, subject display
-   Thread display and expansion on click
-   Ability to star threads
-   Ability to mark threads as read or unread
-   Customization options

![Shows the Nylas Email Component opening and closing while a single email message is displayed.](https://developer.nylas.com/_images/components/email-component-gif.gif)

## Quickstart[](https://developer.nylas.com/docs/user-experience/components/email-component/#quickstart)

1.  Create an Email component in your [Nylas Dashboard](https://dashboard.nylas.com/applications/app).
2.  Add it to your application.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-email"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-email id="<PASTE_YOUR_COMPONENT_ID>"></nylas-email>    </body>   
```

**That’s It! Your Email Component is ready to use!**

## Prerequisites[](https://developer.nylas.com/docs/user-experience/components/email-component/#prerequisites)

-   Either an existing Nylas application or sign up using our [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/).
-   If using an existing application, make sure you have the minium required [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#nylas-scopes).
    -   Agenda - `calendar`
    -   Composer - `email.modify`, `email.send`,and `contacts`
    -   Contact List - `contacts`
    -   Email - `email.modify`,`email.folders_and_labels`, and `contacts`
    -   Messages - `email.read_only` and `contacts`
-   An application to add the Component to. You can fork one of the many CodeSandboxes in the documentation.

## Email Installation Options[](https://developer.nylas.com/docs/user-experience/components/email-component/#email-installation-options)

You can install the Email Component 2 ways:

### npm Package[](https://developer.nylas.com/docs/user-experience/components/email-component/#npm-package)

[Email on npm](https://www.npmjs.com/package/@nylas/components-email)

1.  Run `npm i @nylas/components-email` or `yarn add @nylas/components-email`
2.  Then import and render the component.

```
    // Import the web component    import '@nylas/components-email';        // In render method    <nylas-email></nylas-email>   
```

### Script Tag[](https://developer.nylas.com/docs/user-experience/components/email-component/#script-tag)

Use the CDN script tag, `https://unpkg.com/@nylas/components-email`.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-email"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-email></nylas-email>    </body>   
```

## Ways to Use the Email Component[](https://developer.nylas.com/docs/user-experience/components/email-component/#ways-to-use-the-email-component)

-   [Use the Email Component with Nylas Data](https://developer.nylas.com/docs/user-experience/components/email-component/#use-the-email-component-with-nylas-data) - Choose this option if you want to integrate your existing Nylas accounts with the Email Component.
-   [Use the Email Component with External Data](https://developer.nylas.com/docs/user-experience/components/email-component/#use-email-component-with-external-data) - Choose this option if you want to pass in your data.

### Use the Email Component with Nylas Data[](https://developer.nylas.com/docs/user-experience/components/email-component/#use-the-email-component-with-nylas-data)

You'll learn how to use your Nylas accounts with the Email Component.

#### Create the Email Component[](https://developer.nylas.com/docs/user-experience/components/email-component/#create-the-email-component)

1.  Log in to your [Nylas Dashboard](https://dashboard.nylas.com/applications/app).
2.  In your [Components tab](https://dashboard.nylas.com/applications/app/components), click **Email**.
3.  Name your Component and select the account. To quickly start testing your Component select **Enable for a single account.**
    1.  To learn how to enable components for multiple accounts see [Authorizing Components](https://developer.nylas.com/docs/user-experience/components/email-component/#authorizing-components).
4.  Use an existing access token or generate a new one.
5.  Enter the [domain](https://developer.nylas.com/docs/user-experience/components/email-component/#domain-restriction) the component will run on. Without the [domains](https://developer.nylas.com/docs/user-experience/components/email-component/#domain-restriction) the component will not run.
    1.  To run on localhost, enter an asterisk. `*`. Remember to change this before going to production.
6.  Save your new component.
7.  On the **Edit** page, you can configure your component behavior and appearance.

**Generate an Access Token**

Generating a new access token will not replace your existing access token; it will create a second access token with the same scopes as the previous token. You can [revoke access tokens](https://developer.nylas.com/docs/api/#get/oauth/authorizerevoke) at any time.

### Add the Component To Your Application[](https://developer.nylas.com/docs/user-experience/components/email-component/#add-the-component-to-your-application)

Before you add the Component to your application, you can either choose a thread ID in the dashboard or you can pass in a message ID or thread ID directly into the Email Component.

#### Dashboard Thread ID[](https://developer.nylas.com/docs/user-experience/components/email-component/#dashboard-thread-id)

1.  On the **Edit** page, there are instructions for installing the new component.
2.  Make sure to select which **Thread to view**.
3.  If you haven't installed the Email Component already, open a terminal and run `npm i @nylas/components-email`.
4.  Then add your Nylas component. Copy and paste your component code into your application. `<nylas-email id="your-email-id" > </nylas-email>`
5.  You should refresh your application if needed. Any [configuration options](https://developer.nylas.com/docs/user-experience/components/email-component/#nylas-dashboard-display-options) set on the editing page will apply to your Component.

#### API Message and Thread ID[](https://developer.nylas.com/docs/user-experience/components/email-component/#api-message-and-thread-id)

1.  On the **Edit** page, there are instructions for installing the new component.
    
2.  If you haven't installed the Email Component already, open a terminal and run `npm i @nylas/components-email`.
    
3.  Then add your Nylas component. Copy and paste your component code into your application. `<nylas-email id="your-email-id" > </nylas-email>`
    
4.  Leave **Thread to view** empty.
    
5.  Then either pass in a [thread](https://developer.nylas.com/docs/api/#get/threads) or [message](https://developer.nylas.com/docs/api/#get/messages) ID.
    
    ```
        <nylas-email id="<NYLAS_COMPONENT_ID>" thread_id="<THREAD_ID"></nylas-email>    //or    <nylas-email id="<NYLAS_COMPONENT_ID>" message_id="<MESSAGE_ID>"></nylas-email>   
    ```
    
6.  You should refresh your application if needed. Any [configuration options](https://developer.nylas.com/docs/user-experience/components/email-component/#nylas-dashboard-display-options) set on the editing page will apply to your Component.
    

### Use Email Component with External Data[](https://developer.nylas.com/docs/user-experience/components/email-component/#use-email-component-with-external-data)

You'll learn how to pass threads and messages to display an email thread within your application.

1.  Install the Nylas Email Component. `npm i @nylas/components-email`.

The Nylas Email Component can accept a [Nylas Thread object](https://developer.nylas.com/docs/api/#tag--Threads--thread-object) or a [Nylas Message object](https://developer.nylas.com/docs/api/#tag--Messages--message-object).

You can pass in:

-   `thread` - A thread of one or more messages
-   `message` - A single message

With components, you can authorize them to work with a single account or multiple accounts.

### Enable for a Single Account[](https://developer.nylas.com/docs/user-experience/components/email-component/#enable-for-a-single-account)

A single account is a way to get started quickly. If you use this method in production, you'll have to authenticate each account from the dashboard one by one.

![Enable components single account](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_single_account.png)

### Enable for All Accounts[](https://developer.nylas.com/docs/user-experience/components/email-component/#enable-for-all-accounts)

To enable all accounts, you'll need to pass in a user's access token as a property of the component. One way to achieve this is to create a login screen, capture the access token and pass it into the component. You can pass in `access_tokens` directly in the Component.

`<nylas-agenda id="COMPONENT-ID" access_token="USER-ACCESS-TOKEN"/>`

Make sure to keep `access_tokens` hidden and never expose them online.

![Enable Components for all accounts](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_all_accounts.png)

**Dashboard Preview**

Dashboard previews do not work when enabling for all accounts.

## Customization[](https://developer.nylas.com/docs/user-experience/components/email-component/#customization)

Nylas Components are flexible and can be customized for your needs.

### Email Properties[](https://developer.nylas.com/docs/user-experience/components/email-component/#email-properties)

| Name | Type | Description |
| --- | --- | --- |
| `clean_conversation` | boolean | The Email Component utilizes our [Clean Conversations](https://developer.nylas.com/docs/intelligence/clean-conversations/) endpoint to remove attachments, images, and other extra information from emails. |
| `click_action` | string | `default` or `custom`. Set the behaviour when clicking on an Email. If `default` is selected, will close the Email if it's an expanded thread, expand the Email if it's a closed thread, and set the active thread to read if previously unread. |
| `message_id` | string | Pass in a `message_id`. |
| `message` | Message | An external [Nylas Message object](https://developer.nylas.com/docs/api/#tag--Messages--message-object). |
| `show_contact_avatar` | boolean | Show contact pictures |
| `show_expanded_email_view_onload` | boolean | When the messages are loaded, expand them on page load. |
| `show_forward` | boolean | Choose if the forward button will appear on each thread. |
| `show_number_of_messages` | boolean | Display or hide the number of messages in a thread when collapsed. |
| `show_received_timestamp` | boolean | Show or hide the timestamp of a message. |
| `show_reply` | boolean | Show or hide the reply button on each thread. |
| `show_reply_all` | boolean | Show or hide the reply all button on each thread. |
| `show_star` | boolean | Show or hide the star button on each thread. |
| `show_thread_actions` | boolean | Show delete and unread icons. |
| `theme` | string | Set the theme. Optionally, you can create your own stylesheets. |
| `thread_id` | string | Pass in a `thread_id`. If using this option, leave the ID blank in the dashboard. |
| `thread` | Thread | An external [Nylas Thread object](https://developer.nylas.com/docs/api/#tag--Threads--thread-object) of one or more messages. |
| `unread` \[Deprecated\] | boolean | _Deprecated as of v1.1.0 - Use the passed thread/message object's `unread` prop instead_  
If set to true, sets all messages in thread to unread (visually). If false, sets all messages in thread to read (visually). If set to `null`, uses the read status attached to the thread. |

### Event Listeners[](https://developer.nylas.com/docs/user-experience/components/email-component/#event-listeners)

Use event listeners to customize the mailbox.

| Name | Description |
| --- | --- |
| `manifestLoaded` | This event is dispatched on load when the manifest is loaded. The handler is passed the `manifest` argument. |
| `onError` | Emitted if an error occurs while fetching data in the component. The handler is passed an object with the component id as the key and the error as the value. |
| `threadClicked` | When an email is opened, closed, expanded, or condensed. The handler is passed the `event`, `thread`, and `messageType`. |
| `toggleThreadUnreadStatus` | When is email is marked as read or unread. The handler is passed the `event` and `thread`. |
| `threadDeleted` | When a thread or email is deleted. The handler is passed the `event` and `thread`. |
| `threadStarred` | When an email is starred or unstarred. The handler is passed the `event` and `thread`. |
| `messageClicked` | When an email is expanded and an individual message is clicked. The handler is passed the `event`, `thread`, and the clicked draft `message`. |
| `draftClicked` | When an individual draft message in the thread is clicked. The handler is passed the `event`, `thread`, and the clicked `message`. |
| `returnToMailbox` | When the left arrow at the top of the email header is clicked. The event is only dispatched when `click_action="mailbox"`. The handler is passed the `event` and `thread`. |
| `replyClicked` | Emitted when reply button is clicked. The handler is passed the `event`, `thread`, the clicked `message` and `value` of a created message for reply. |
| `replyAllClicked` | Emitted when reply all button is clicked. The handler is passed the `event`, `thread`, the clicked `message` and `value` of a created message for reply all. |
| `forwardClicked` | Emitted when forward button is clicked. The handler is passed the `event`, `thread`, the clicked `message` and `value` of a created message for forward. |
| `downloadClicked` | Emitted when an attachment or a file in the message body is downloaded. The handler is passed the `event`, `thread` and `file`. |
| `fileClicked` | Emitted when a file attachment is clicked. The handler is passed the `event` and `file`. |

### Allowed Domains[](https://developer.nylas.com/docs/user-experience/components/email-component/#allowed-domains)

You can restrict the domains that your Component works on. Use glob patterns to enable or disable domains.

Some examples of glob patterns:

-   `nylas.com` will only match [nylas.com](http://nylas.com/)
-   `subdomain.nylas.com` will match `subdomain.nylas.com`
-   `*subdomain.nylas.com` will match `subdomain.nylas.com` and `sub.sub.subdomain.nylas.com`
-   `*` will match any domain

Domain restriction only applies to the domain name. URL paths (/sub-path) or protocols (HTTPS) can not be restricted.

### How Properties Are Handled[](https://developer.nylas.com/docs/user-experience/components/email-component/#how-properties-are-handled)

Nylas Components follow an order of operations to decide if the dashboard or code takes precedence.

1.  If the property **is** passed directly to the Component, use that first.
2.  If the property **is not** passed directly in the Component, use the dashboard settings.
3.  If there are **no properties** set in the Component or the dashboard, use the Component defaults.

## Demo Apps[](https://developer.nylas.com/docs/user-experience/components/email-component/#demo-apps)

-   [Email Component external data](https://replit.com/@nylasinc/email-component-external-data)
-   [Email Component event listeners](https://replit.com/@nylasinc/email-component-event-listeners)

## What's Next?[](https://developer.nylas.com/docs/user-experience/components/email-component/#whats-next)

**Take a look at other Components:**

-   [Mailbox Component](https://developer.nylas.com/docs/user-experience/components/mailbox-component)
-   [Contact List Component](https://developer.nylas.com/docs/user-experience/components/contact-list-component/)
-   [Agenda Component](https://developer.nylas.com/docs/user-experience/components/agenda-component/)
-   [Conversation Component](https://developer.nylas.com/docs/user-experience/components/conversation-component/)
-   [Email Component](https://developer.nylas.com/docs/user-experience/components/email-component)
-   [Composer Component](https://developer.nylas.com/docs/user-experience/componente/composer)

**Check us out on GitHub:**

-   [Components repo](https://github.com/nylas/components)
-   [Code Samples repo](https://github.com/nylas-samples)