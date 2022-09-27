## Composer Component

Use the Nylas Composer to connect to any email data and provide a custom front end for your applications. Composer provides an out of the box solution for writing and sending emails.

Without needing to write a single line of code, Composer comes with:

-   To, from, cc, and bcc fields
-   Subject field
-   Header
-   Attachment
-   Sending right out the box
-   Ability to format messages
-   Light and dark themes
-   Customization options

If you want to change the behavior of Composer, it comes with [custom callback functions](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-behavior) and [custom hooks](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-behavior).

![Nylas Composer](https://developer.nylas.com/_images/components/composer.gif)

## Quickstart[](https://developer.nylas.com/docs/user-experience/components/composer-component/#quickstart)

1.  Create a Composer component in your Nylas Dashboard.
2.  Add it to your application.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-composer"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-composer id="<PASTE_YOUR_COMPONENT_ID>"></nylas-composer>    </body>   
```

**That’s It! Composer is ready to use!**

## Prerequisites[](https://developer.nylas.com/docs/user-experience/components/composer-component/#prerequisites)

-   Either an existing Nylas application or sign up using our [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/).
-   If using an existing application, make sure you have the minium required [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#nylas-scopes).
    -   Agenda - `calendar`
    -   Composer - `email.modify`, `email.send`,and `contacts`
    -   Contact List - `contacts`
    -   Email - `email.modify`,`email.folders_and_labels`, and `contacts`
    -   Messages - `email.read_only` and `contacts`
-   An application to add the Component to. You can fork one of the many CodeSandboxes in the documentation.

## Composer Installation Options[](https://developer.nylas.com/docs/user-experience/components/composer-component/#composer-installation-options)

You can install Composer 2 ways:

### npm Package[](https://developer.nylas.com/docs/user-experience/components/composer-component/#npm-package)

[Composer on npm](https://www.npmjs.com/package/@nylas/components-composer)

1.  Run `npm i @nylas/components-composer` or `yarn add @nylas/components-composer`
2.  Then import and render the component.

```
    // Import the web component    import '@nylas/components-composer';        // In render method    <nylas-composer></nylas-composer>   
```

### Script Tag[](https://developer.nylas.com/docs/user-experience/components/composer-component/#script-tag)

Use the CDN script tag, `https://unpkg.com/@nylas/components-composer`.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-composer"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-composer></nylas-composer>    </body>   
```

### Create the Composer Component[](https://developer.nylas.com/docs/user-experience/components/composer-component/#create-the-composer-component)

1.  Log in to your Nylas dashboard.
2.  Click **Components**.
3.  Click the **Composer**.
4.  Name your Component and select the account.
5.  Use an existing access token or generate a new one. To quickly start testing your Component select **Enable for a single account.**
    1.  To learn how to enable components for multiple accounts see [Authorizing Components](https://developer.nylas.com/docs/user-experience/components/composer-component/#authorizing-components)
6.  Enter the [domain](https://developer.nylas.com/docs/user-experience/components/composer-component/#domain-restriction) the component will run on. Without the [domains](https://developer.nylas.com/docs/user-experience/components/composer-component/#domain-restriction), the component will not run.
7.  Save your new Component.
8.  On the **Edit** page, you can configure your component behavior and appearance.

**Generate an Access Token**

Generating a new access token will not replace your existing access token; it will create a second access token with the same scopes as the previous token. You can [revoke access tokens](https://developer.nylas.com/docs/api/#get/oauth/authorizerevoke) at any time.

![Nylas Composer](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/create-new-composer.png)

### Add the Component To Your Application[](https://developer.nylas.com/docs/user-experience/components/composer-component/#add-the-component-to-your-application)

1.  On the **Edit** page, there are instructions for installing the new Component.
    
2.  If you haven't installed the Composer Component already, open a terminal and run `npm i @nylas/components-composer`.
    
3.  Then add your Nylas component. Copy and paste your component code into your application.  
    `<nylas-composer id="your-component-id"></nylas-composer>`
    
    ![Nylas Composer Copy Code](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/composer_copy_01_05_2020.png)
    
4.  You should refresh your application if needed. Any configuration options set on the editing page will apply to your component.
    

With components, you can authorize them to work with a single account or multiple accounts.

### Enable for a Single Account[](https://developer.nylas.com/docs/user-experience/components/composer-component/#enable-for-a-single-account)

A single account is a way to get started quickly. If you use this method in production, you'll have to authenticate each account from the dashboard one by one.

![Enable components single account](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_single_account.png)

### Enable for All Accounts[](https://developer.nylas.com/docs/user-experience/components/composer-component/#enable-for-all-accounts)

To enable all accounts, you'll need to pass in a user's access token as a property of the component. One way to achieve this is to create a login screen, capture the access token and pass it into the component. You can pass in `access_tokens` directly in the Component.

`<nylas-agenda id="COMPONENT-ID" access_token="USER-ACCESS-TOKEN"/>`

Make sure to keep `access_tokens` hidden and never expose them online.

![Enable Components for all accounts](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_all_accounts.png)

**Dashboard Preview**

Dashboard previews do not work when enabling for all accounts.

## Usage[](https://developer.nylas.com/docs/user-experience/components/composer-component/#usage)

There are 2 ways to use Composer:

-   You can create a [Nylas Account](https://developer.nylas.com/docs/user-experience/components/composer-component/#use-a-nylas-account) and Composer comes ready to use without any coding needed.
-   You can [bring your own data](https://developer.nylas.com/docs/user-experience/components/composer-component/#bring-your-data).

### Use a Nylas Account[](https://developer.nylas.com/docs/user-experience/components/composer-component/#use-a-nylas-account)

Install the Composer, then add it to your application. That's it! You're ready to start sending emails. You can alter the [appearance](https://developer.nylas.com/docs/user-experience/components/composer-component/#css-customization) and [behavior](https://developer.nylas.com/docs/user-experience/components/composer-component/#customizing-behavior) for more functionality.

### Bring Your Data[](https://developer.nylas.com/docs/user-experience/components/composer-component/#bring-your-data)

After installing Composer you will need to use [custom callbacks](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-callbacks) to send emails. Check out our [example](https://replit.com/@nylasinc/Composer-Custom-Callbacks) using callbacks to send emails.

## Send Emails[](https://developer.nylas.com/docs/user-experience/components/composer-component/#send-emails)

Once attached to an account, you can send emails from that account. Emails can be sent directly using the [Send Endpoint](https://developer.nylas.com/docs/api/#post/send) to ensure a high rate of deliverability.

## Attachments[](https://developer.nylas.com/docs/user-experience/components/composer-component/#attachments)

File attachments are limited to 4 MB.

## Customization[](https://developer.nylas.com/docs/user-experience/components/composer-component/#customization)

Nylas components are flexible and can be customized for your needs. You can customize the display in 2 ways:

### From Your Nylas Dashboard[](https://developer.nylas.com/docs/user-experience/components/composer-component/#from-your-nylas-dashboard)

Use this option if you are using the Component created from the dashboard. Customize the display by going to your application, selecting **Components**. Then select the Component you want to edit. If you are customizing using the dashboard, you can not [edit the CSS](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-css) or use [custom callbacks](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-behavior).

### Directly in the Application[](https://developer.nylas.com/docs/user-experience/components/composer-component/#directly-in-the-application)

No matter where you created your Component, you can use this method to edit the display options.

Pass them as component props:

```
    <nylas-composer       theme="dark"       show_header="false"    />   
```

### Custom Properties[](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-properties)

| Name | Type | Description | Default value |
| --- | --- | --- | --- |
| theme | string | Light or dark theme. Possible values are `light`, `dark` or URL / relative path to [custom CSS file](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-css). | light |
| show\_header | boolean | Show the Composer header. If removed, the minimize, close and new message text are removed. | `true` |
| show\_from | boolean | Display the from field. | `true` |
| show\_to | boolean | Display the to field. | `true` |
| show\_cc | boolean | Display the cc field. | `true` |
| show\_bcc | boolean | Display the bcc field. | `true` |
| minimized | boolean | Minimize composer. | `false` |
| show\_subject | boolean | Show the subject line. | `true` |
| show\_close\_button | boolean | Show the close icon. | `true` |
| show\_minimize\_button | boolean | Display the minimize icon. | `true` |
| show\_cc\_button | boolean | Display cc field. | `true` |
| show\_bcc\_button | boolean | Display bcc field. | `true` |
| show\_attachment\_button | boolean | Display attachment icon. | `true` |
| show\_editor\_toolbar | boolean | Display toolbar with options such as bold, lists and underline. | `true` |
| tracking | [Nylas Tracking Object](https://developer.nylas.com/docs/developer-tools/webhooks/message-tracking/#the-tracking-object) | Allows tracking for message opens, link clicks, and thread replies. | `null` |

### Custom CSS[](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-css)

To customize the CSS, you can change the `theme` custom property to one of the provided themes by Nylas:

```
    <nylas-composer id="your-composer-id" theme="dark"></nylas-composer>   
```

You can also easily override styles for pre-selected themes by writing your own CSS vars. The customizable CSS variables are the following and the value assigned should be a valid CSS property value:

```
    nylas-composer {    --composer-background-color: #282b2b;    --composer-background-muted-color: #454949;    --composer-text-color: #fff;    --composer-text-light-color: #b0b0c0;    --composer-text-secondary-color: #ffffff;    --composer-font: lato, sans-serif;    --composer-font-size: 14px;    --composer-font-size-small: 12px;    --composer-border-color: #282828;    --composer-primary-color: #00c1a0;    --composer-primary-light-color: #434343;    --composer-primary-dark-color: #00a88b;    --composer-icons-color: #8e8e98;    --composer-header-background-color: var(--composer-background-color);    --composer-success-color: white;    --composer-success-light-color: var(--composer-primary-color);    --composer-danger-color: #ffffff;    --composer-danger-light-color: #ff5454;    --composer-info-color: white;    --composer-info-light-color: var(--composer-primary-light-color);    }   
```

You can also provide your own stylesheet to the `theme` custom property. Review the [dark.css](https://unpkg.com/@nylas/components-composer/themes/dark.css) theme to get the CSS variable names:

```
    <nylas-composer       id="your-composer-id"      show_header="false"      theme="https://example.com/my-composer-theme.css"    ></nylas-composer>   
```

### Allowed Domains[](https://developer.nylas.com/docs/user-experience/components/composer-component/#allowed-domains)

You can restrict the domains that your Component works on. Use glob patterns to enable or disable domains.

Some examples of glob patterns:

-   `nylas.com` will only match [nylas.com](http://nylas.com/)
-   `subdomain.nylas.com` will match `subdomain.nylas.com`
-   `*subdomain.nylas.com` will match `subdomain.nylas.com` and `sub.sub.subdomain.nylas.com`
-   `*` will match any domain

Domain restriction only applies to the domain name. URL paths (/sub-path) or protocols (HTTPS) can not be restricted.

### How Properties Are Handled[](https://developer.nylas.com/docs/user-experience/components/composer-component/#how-properties-are-handled)

Nylas Components follow an order of operations to decide if the dashboard or code takes precedence.

1.  If the property **is** passed directly to the Component, use that first.
2.  If the property **is not** passed directly in the Component use the dashboard settings.
3.  If there are **no properties** set in the Component or the dashboard, use the Component defaults.

## Custom Behavior[](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-behavior)

You can attach custom callbacks to Composer. These custom callbacks let you change the behavior or use the Component completely detached from Nylas.

Composer comes with callback and hooks. Use callback to change the component behavior and hooks to change behavior or get data when certain actions are taken.

In this example, we are using the `composer.send` callback and `composer.afterSendSuccess` to control the behavior of sending a message and closing the Composer after a message is sent.

```
...      // Use custom callbacks, implement send function      el.send = async (data) => {        return new Promise((resolve, reject) => {          setTimeout(() => {            return resolve({ success: true });          }, 250);        });      };      // Use after send hook      el.afterSendSuccess = async (response) => {        el.close(); // Hide the composer after sending      };   
```

### Custom Callbacks[](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-callbacks)

**You can't pass callbacks as attributes**

You must select the element, for example `document.getElementById`, and then attach the custom properties.

| Name | Type | Description |
| --- | --- | --- |
| `composer.send(message)` | function | Function that implements sending the email |
| `composer.from` | function or array | Array of contacts to pre-fill the `from` field or function that returns array of contacts or promise. |
| `composer.to` | function or array | Array of contacts to pre-fill the `to` field or function that returns array of contacts or promise. |
| `composer.cc` | function or array | Array of contacts to pre-fill the `cc` field or function that returns array of contacts or promise. |
| `composer.bcc` | function or array | Array of contacts to pre-fill the `bcc` field or function that returns array of contacts or promise. |
| `composer.uploadFile` | Function | Function that has single argument (file) and returns object in format as described in [Nylas file documentation](https://developer.nylas.com/docs/api/#tag--Files) |

### Emitted Events[](https://developer.nylas.com/docs/user-experience/components/composer-component/#emitted-events)

The emitted event object will include a `details` property that contains the event payload, if available. You can observe these events in your application by calling `.addEventListener(<EVENT_NAME>, () => {})` on your composer.

| Name | Description |
| --- | --- |
| `manifestLoaded` | This event is dispatched on load when the manifest is loaded. The handler is passed the `manifest` argument. |
| `onError` | Emitted if an error occurs while fetching data in the component. The handler is passed an object with the component id as the key and the error as the value. |
| `composerMinimized` | Emitted whenever the minimize button is clicked from a maximized composer. |
| `composerMaximized` | Emitted whenever the minimize button is clicked from a minimized composer. |
| `composerClosed` | Emitted whenever the × button is clicked, or when the `.close()` [custom hook](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-hooks) is called. |
| `composerOpened` | Emitted whenever the `.open()` [custom hook](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-hooks) is called. |

### Custom Hooks[](https://developer.nylas.com/docs/user-experience/components/composer-component/#custom-hooks)

| Name | Type | Description |
| --- | --- | --- |
| `composer.change(message)` | function | Called every time composer data is changed. First (and only) argument contains the latest version of the message. |
| `composer.beforeSend` | function | Called before sending the message. |
| `composer.afterSendSuccess` | function | Called before after the message is sent. |
| `composer.afterSendError` | function | Called if error happens during sending. |
| `composer.beforeFileUpload` | function | Called before sending the message. |
| `composer.afterFileUploadSuccess` | function | Called after the message is sent. |
| `composer.afterFileUploadError` | function | Called if error happens during sending. |
| `composer.beforeFileRemove` | function | Called before attachment is removed. |
| `composer.afterFileRemove` | function | Called after attachment is removed. |

You can use a custom method to open and close the Composer.

```
<body>  <nylas-composer id="PASTE_YOUR_COMPONENT_ID"></nylas-composer>  <script>  const composer = document.getElementById('PASTE_YOUR_COMPONENT_ID')    // to show the composer  composer.open();  // to close the composer  composer.close();   </script></body>   
```

## Demo Apps[](https://developer.nylas.com/docs/user-experience/components/composer-component/#demo-apps)

You can fork any of these to get started right away with Composer.

-   [Custom Options](https://replit.com/@nylasinc/Composer-Custom-Options) - How to use custom configuration with your Composer.
-   [Vue.js Composer](https://replit.com/@nylasinc/Composer-Vue) - How to deploy Composer using Vue.js
-   [Custom Callbacks](https://replit.com/@nylasinc/Composer-Custom-Callbacks) - How to use callbacks in your Composer Component.
-   [React Composer](https://replit.com/@nylasinc/Composer-React) - How to deploy Composer using React

## What's Next?[](https://developer.nylas.com/docs/user-experience/components/composer-component/#whats-next)

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