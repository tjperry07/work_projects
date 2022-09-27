## Mailbox Component

Use the Nylas Mailbox Component to connect to any inbox and provide a custom front end for your applications.

Without needing to write a single line of code, the Mailbox Component comes with:

-   To, from, subject display
-   Message previews
-   Thread display and expansion on click
-   Ability to star threads
-   Ability to mark threads as read or unread
-   Thread selection, including selecting all threads
-   Built-in pagination
-   Customization options

![Nylas Mailbox Component opening and closing. Also shows the user selecting and starring messages.](https://developer.nylas.com/_images/components/mailbox_component.gif)

## Quickstart[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#quickstart)

1.  Create a Mailbox component in your Nylas Dashboard.
2.  Add it to your application.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-mailbox"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-mailbox id="<PASTE_YOUR_COMPONENT_ID>"></nylas-mailbox>    </body>   
```

**That’s It! Your Mailbox Component is ready to use!**

## Prerequisites[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#prerequisites)

-   Either an existing Nylas application or sign up using our [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/).
-   If using an existing application, make sure you have the minium required [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#nylas-scopes).
    -   Agenda - `calendar`
    -   Composer - `email.modify`, `email.send`,and `contacts`
    -   Contact List - `contacts`
    -   Email - `email.modify`,`email.folders_and_labels`, and `contacts`
    -   Messages - `email.read_only` and `contacts`
-   An application to add the Component to. You can fork one of the many CodeSandboxes in the documentation.

## Mailbox Installation Options[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#mailbox-installation-options)

You can install the Mailbox Component 2 ways:

### npm Package[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#npm-package)

[Mailbox on npm](https://www.npmjs.com/package/@nylas/components-mailbox)

1.  Run `npm i @nylas/components-mailbox` or `yarn add @nylas/components-mailbox`
2.  Then import and render the component.

```
    // Import the web component    import '@nylas/components-mailbox';        // In render method    <nylas-mailbox></nylas-mailbox>   
```

### Script Tag[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#script-tag)

Use the CDN script tag, `https://unpkg.com/@nylas/components-mailbox`.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-mailbox"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-mailbox></nylas-mailbox>    </body>   
```

## Ways to Use the Mailbox Component[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#ways-to-use-the-mailbox-component)

-   [Use the Mailbox Component with Nylas Data](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#use-the-mailbox-component-with-nylas-data) - Choose this option if you want to integrate your Component Nylas accounts with the Mailbox Component.
-   [Use the Mailbox Component with External Data](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#use-the-mailbox-component-with-external-data) - Choose this option if you want to bring your own data to the Component.

### Use the Mailbox Component with Nylas Data[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#use-the-mailbox-component-with-nylas-data)

You'll learn how to use your Nylas accounts with the Mailbox Component.

#### Create the Mailbox Component[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#create-the-mailbox-component)

1.  Log in to your Nylas dashboard.
2.  Click **Components > Mailbox**
3.  Name your Component and select the account. To quickly start testing your Component select **Enable for a single account.**
    1.  To learn how to enable components for multiple accounts see [Authorizing Components](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#authorizing-components)
4.  Use an existing access token or generate a new one.
5.  Enter the [domain](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#domain-restriction) the component will run on. Without the [domain](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#domain-restriction), the component will not run.
    1.  To run on localhost, enter an asterisk. `*`. Remember to change this before going to production.
6.  Save your new component.
7.  On the **Edit** page, you can configure your component behavior and appearance.

**Generate an Access Token**

Generating a new access token will not replace your existing access token; it will create a second access token with the same scopes as the previous token. You can [revoke access tokens](https://developer.nylas.com/docs/api/#get/oauth/authorizerevoke) at any time.

#### Add the Component To Your Application[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#add-the-component-to-your-application)

1.  On the **Edit** page, there are instructions for installing the new component.
    1.  We recommend that you filter or query your threads. Mailbox will display threads located in inbox and trash.
    2.  Search will accept any keyword and filter accepts any query parameter listed for [Threads](https://developer.nylas.com/docs/api/#get/threads).
2.  If you haven't installed the Mailbox Component already, open a terminal and run `npm i @nylas/components-mailbox`.
3.  Then add your Nylas component. Copy and paste your component code into your application.  
    `<nylas-mailbox id="your-component-id" ></nylas-mailbox>`
4.  You should refresh your application if needed. Any [configuration options](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#nylas-dashboard-display-options) set on the editing page will apply to your Component.

### Use the Mailbox Component with External Data[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#use-the-mailbox-component-with-external-data)

You can pass your own thread data for Mailbox to display. The threads format and type need to match the [Threads](https://developer.nylas.com/docs/api#tag--Threads) object.

```
<script> import Mailbox from "@nylas/components-mailbox"; const staticThreads = [   {     account_id: "3aols9hb9fkqtso7zkzcmwgwv",     drafts: [],     first_message_timestamp: 1634148124,     has_attachments: false,     id: "5mr2pufvjqgfcj3p0x2jp0d27",     labels: [       {         display_name: "IMPORTANT",         id: "8l6c4d11y1p4dm4fxj52whyr9",         name: "important"       },       {         display_name: "SENT",         id: "41nxdpa2klw8u0ml0c4pmmi9q",         name: "sent"       },       {         display_name: "INBOX",         id: "d9zkcr2tljpu3m4qpj7l2hbr0",         name: "inbox"       }     ],     last_message_received_timestamp: 1634148124,     last_message_sent_timestamp: 1634149824,     last_message_timestamp: 1634149824,     messages: [       {         account_id: "3aols9hb9fkqtso7zkzcmwgwv",         bcc: [],         cc: [],         date: 1634148124,         files: [],         from: [           {             email: "healthcare.demo@nylas.com",             name: "Rebecca Lee Crumpler"           }         ],         id: "2oxbhesmhekucib22500nzsnj",         labels: [           {             display_name: "IMPORTANT",             id: "8l6c4d11y1p4dm4fxj52whyr9",             name: "important"           },           {             display_name: "INBOX",             id: "d9zkcr2tljpu3m4qpj7l2hbr0",             name: "inbox"           }         ],         object: "message",         reply_to: [],         snippet:           "Hi Dorothy, Want to get dinner Wednesday night? I'm free 5-9 pm?",         starred: false,         subject: "Dinner Wednesday? 😺",         thread_id: "5mr2pufvjqgfcj3p0x2jp0d27",         to: [           {             email: "demo@nylas.com",             name: "Dorothy Vaughan"           }         ],         unread: false       },       {         account_id: "3aols9hb9fkqtso7zkzcmwgwv",         bcc: [],         cc: [],         date: 1634149824,         files: [],         from: [           {             email: "demo@nylas.com",             name: "Dorothy Vaughan"           }         ],         id: "enppimg7p0udaoydjzkep95zo",         labels: [           {             display_name: "SENT",             id: "41nxdpa2klw8u0ml0c4pmmi9q",             name: "sent"           }         ],         object: "message",         reply_to: [],         snippet:           "Yes, let's make a plan! On Wed, Oct 13, 2021 at 8:02 AM Rebecca Lee Crumpler <healthcare.demo@nylas.com> wrote: Hi Dorothy, Want to get dinner Wednesday night? I'm free 5-9 pm?",         starred: false,         subject: "Re: Dinner Wednesday? 😺",         thread_id: "5mr2pufvjqgfcj3p0x2jp0d27",         to: [           {             email: "healthcare.demo@nylas.com",             name: "Rebecca Lee Crumpler"           }         ],         unread: false       }     ],     object: "thread",     participants: [       {         email: "demo@nylas.com",         name: "Dorothy Vaughan"       },       {         email: "healthcare.demo@nylas.com",         name: "Rebecca Lee Crumpler"       }     ],     snippet:       "Yes, let's make a plan! On Wed, Oct 13, 2021 at 8:02 AM Rebecca Lee Crumpler <healthcare.demo@nylas.com> wrote: Hi Dorothy, Want to get dinner Wednesday night? I'm free 5-9 pm?",     starred: false,     subject: "Dinner Wednesday? 😺",     unread: false,     version: 119   } ];</script><style>  main {    font-family: sans-serif;    text-align: center;    height: 500px;  }  iframe {    display: none !important;  }</style><main> <h1>Nylas Mailbox</h1>  <nylas-mailbox all_threads={staticThreads}></main>   
```

With components, you can authorize them to work with a single account or multiple accounts.

### Enable for a Single Account[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#enable-for-a-single-account)

A single account is a way to get started quickly. If you use this method in production, you'll have to authenticate each account from the dashboard one by one.

![Enable components single account](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_single_account.png)

### Enable for All Accounts[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#enable-for-all-accounts)

To enable all accounts, you'll need to pass in a user's access token as a property of the component. One way to achieve this is to create a login screen, capture the access token and pass it into the component. You can pass in `access_tokens` directly in the Component.

`<nylas-agenda id="COMPONENT-ID" access_token="USER-ACCESS-TOKEN"/>`

Make sure to keep `access_tokens` hidden and never expose them online.

![Enable Components for all accounts](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_all_accounts.png)

**Dashboard Preview**

Dashboard previews do not work when enabling for all accounts.

### Administrator Requirements[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#administrator-requirements)

The Mailbox Component requires administrative privileges in order to authorize all accounts from the dashboard. Non-administrative users can only authorize a single account.

## Customization[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#customization)

Nylas Components are flexible and can be customized for your needs.

### Mailbox Properties[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#mailbox-properties)

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| show\_thread\_checkbox | boolean | Choose whether or not to display selection checkboxes beside each thread. | True |
| items\_per\_page | number | The number of threads to show per page. | 13 |
| show\_star | boolean | Choose whether or not stars appear on each thread. | false |
| header | string | Change what title is displayed at the top of mailbox. | Null or not displayed |
| keyword\_to\_search | string | Return threads that match any string | None |
| query\_string | string | Search for messages using query strings and display those in the component. `"in=trash from=kat@spacetech.com"` Allowed [parameters](https://developer.nylas.com/docs/api/#get/threads). | None |
| show\_reply | boolean | Show reply field | false |
| show\_reply\_all | boolean | Show reply all field | false |
| show\_forward | boolean | Show forward field | false |
| unread\_status \[Deprecated\] | string | _Deprecated as of v1.1.0 - Use the passed thread object's `unread` prop instead_  
`read`, `unread`, or `default`. If set to `default`, uses the read status attached to the thread/message. Otherwise sets all threads and messages in the mailbox to be read and unread for `read` and `unread` respectively. | `default` |

### Mailbox Event Listeners[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#mailbox-event-listeners)

Use event listeners to customize the mailbox.

| Name | Description |
| --- | --- |
| `manifestLoaded` | This event is dispatched on load when the manifest is loaded. The handler is passed the `manifest` argument. |
| `onError` | Emitted if an error occurs while fetching data in the component. The handler is passed an object with the component id as the key and the error as the value. |
| `threadClicked` | When a thread is opened or closed. The handler is passed the `event` and `selectedThreads` arguments. |
| `onChangeSelectedReadStatus` | When selected emails or threads are marked as read or unread. The handler is passed the `event` and `selectedThreads` arguments. |
| `onDeleteSelected` | When emails or threads are deleted. If a single email or thread is deleted, it is captured in `thread`. If multiple emails or threads are deleted, it is captured in `selectedThreads`. The handler is passed the `event` and `selectedThreads` arguments. |
| `onStarSelected` | When selected emails or threads are starred or unstarred. The handler is passed the `event` and `selectedThreads` arguments. |
| `refreshClicked` | When the refresh button in the mailbox is clicked. The handler is passed the `event` argument. |
| `onSelectOneClicked` | When a single email or thread is selected by clicking on the checkbox. The handler is passed the `event` and `thread` arguments |
| `onSelectAllClicked` | When select all checkbox is checked or unchecked. The handler is passed the `event` and `selectedThreads` arguments. |
| `returnToMailbox` | When back button is clicked after clicking a thread. |

### Allowed Domains[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#allowed-domains)

You can restrict the domains that your Component works on. Use glob patterns to enable or disable domains.

Some examples of glob patterns:

-   `nylas.com` will only match [nylas.com](http://nylas.com/)
-   `subdomain.nylas.com` will match `subdomain.nylas.com`
-   `*subdomain.nylas.com` will match `subdomain.nylas.com` and `sub.sub.subdomain.nylas.com`
-   `*` will match any domain

Domain restriction only applies to the domain name. URL paths (/sub-path) or protocols (HTTPS) can not be restricted.

### How Properties Are Handled[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#how-properties-are-handled)

Nylas Components follow an order of operations to decide if the dashboard or code takes precedence.

1.  If the property **is** passed directly to the Component, use that first.
2.  If the property **is not** passed directly in the Component, use the dashboard settings.
3.  If there are **no properties** set in the Component or the dashboard, use the Component defaults.

## Demo Apps[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#demo-apps)

-   [Mailbox event listeners](https://replit.com/@nylasinc/mailbox-component-event-listeners)
-   [Mailbox external data](https://replit.com/@nylasinc/mailbox-external-data)

## What's Next?[](https://developer.nylas.com/docs/user-experience/components/mailbox-component/#whats-next)

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