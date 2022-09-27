## Contact List Component

Use Contact List to display your Contacts in a sortable, interactive list. Without needing to write a line of code, Contact List comes with:

-   Display picture
-   Contact Email
-   Last date emailed
-   Sortable list
-   Customization

![Nylas Contact List](https://developer.nylas.com/_images/components/contact_list.gif)

## Quickstart[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#quickstart)

1.  Create a Contact List component in your Nylas Dashboard.
2.  Add it to your application.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-contact-list"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-contact-list id="<PASTE_YOUR_COMPONENT_ID>"></nylas-contact-list>    </body>   
```

**That’s It! Contact List is ready to use!**

## Prerequisites[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#prerequisites)

-   Either an existing Nylas application or sign up using our [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/).
-   If using an existing application, make sure you have the minium required [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#nylas-scopes).
    -   Agenda - `calendar`
    -   Composer - `email.modify`, `email.send`,and `contacts`
    -   Contact List - `contacts`
    -   Email - `email.modify`,`email.folders_and_labels`, and `contacts`
    -   Messages - `email.read_only` and `contacts`
-   An application to add the Component to. You can fork one of the many CodeSandboxes in the documentation.

You can install Contact List in 2 ways:

### npm Package[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#npm-package)

1.  Run `npm i @nylas/components-contact-list` or `yarn add @nylas/components-contact-list`.
2.  Then import and render the component.

```
    // Import the web component    import '@nylas/components-contact-list';        // In render method    <nylas-contact-list></nylas-contact-list>     
```

### Script Tag[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#script-tag)

Use the CDN script tag, `https://unpkg.com/@nylas/components-contact-list`.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-contact-list"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-contact-list></nylas-contact-list>     </body>      
```

You'll learn how to use your Nylas accounts with the Contact List Component.

-   [Use Contact with Nylas Data](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#use-contact-list-component-with-nylas-data) - Choose this option if you want to integrate your existing Nylas accounts with the Contact List Component.
-   [Use Contact List with External Data](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#use-contact-list-with-external-data) - Choose this option if you want to pass in your data.

### Use Contact List Component with Nylas Data[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#use-contact-list-component-with-nylas-data)

You'll learn how to use your Nylas accounts with the Contact List Component.

### Create the Contact List Component[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#create-the-contact-list-component)

1.  Log in to your Nylas dashboard.
2.  Click **Components > Contact List**
3.  Name your Component and select the account.
4.  Use an existing access token or generate a new one. To quickly start testing your Component select **Enable for a single account.**
    1.  To learn how to enable components for multiple accounts see [Authorizing Components](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#authorizing-components)
5.  Enter the [domain](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#allowed-domains) the component will run on. Without the [domains](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#allowed-domains), the component will not run.
6.  Save your new Component.
7.  On the **Edit** page, you can configure your component behavior and appearance.

**Generate an Access Token**

Generating a new access token will not replace your existing access token; it will create a second access token with the same scopes as the previous token. You can [revoke access tokens](https://developer.nylas.com/docs/api/#get/oauth/authorizerevoke) at any time.

![Nylas Contact Create](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/create-new-contactlist.png)

#### Add the Component To Your Application[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#add-the-component-to-your-application)

1.  On the **Edit** page, there are instructions for installing the new Component.
    
2.  If you haven't installed the Contact List Component already, open a terminal and run `npm i @nylas/components-contact-list`.
    
3.  Then add your Nylas Component. Copy and paste your component code into your application.  
    `<nylas-contact-list="your-component-id"></nylas-contact-list>`.
    
    ![Nylas Contact npm](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/contact-list-options.png)
4.  You should refresh your application if needed. Any [customization options](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#customization) set on the editing page will apply to your Component.
    

If you want to get started without installing the components in your application, fork this CodeSandbox and replace the ID with your Contact List ID.

#### Contact List CodeSandbox[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#contact-list-codesandbox)

The application uses demo data. Create a new Component so you can use your data.

### Use Contact List with External Data[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#use-contact-list-with-external-data)

You'll learn how to pass in an contacts array and display an contact list within your application.

#### Create the Contact List Component[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#create-the-contact-list-component-1)

1.  Install the Nylas Contact List Component. `npm i @nylas/components-contact-list`.

The Nylas Contact List Component can accept an array of objects for contacts.

You can pass in:

-   `email` - Emails must be unique for each contact.
-   `given_name` - Full contact name

```
<script>  import ContactList from "@nylas/components-contact-list";  const staticContacts = [    {      emails: [        {          email: "tom@brightideas.com"        }      ],      given_name: "Thomas Edison"    },    {      emails: [        {          email: "alex@bell.com"        }      ],      given_name: "Alexander Graham Bell"    },    {      emails: [        {          email: "al@particletech.com"        }      ],      given_name: "Albert Einstein"    }  ];</script><style>  main {    font-family: sans-serif;    text-align: center;    height: 800px;  }</style><main> <h1>Nylas Contact List</h1>  <nylas-contact-list contacts={staticContacts}/></main>   
```

### Contact List External Data Example[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#contact-list-external-data-example)

If you want to get started quickly, grab a copy of our CodeSandbox to get started. The application uses demo data. Create a new Component when you're ready to use your data.

With components, you can authorize them to work with a single account or multiple accounts.

### Enable for a Single Account[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#enable-for-a-single-account)

A single account is a way to get started quickly. If you use this method in production, you'll have to authenticate each account from the dashboard one by one.

![Enable components single account](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_single_account.png)

### Enable for All Accounts[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#enable-for-all-accounts)

To enable all accounts, you'll need to pass in a user's access token as a property of the component. One way to achieve this is to create a login screen, capture the access token and pass it into the component. You can pass in `access_tokens` directly in the Component.

`<nylas-agenda id="COMPONENT-ID" access_token="USER-ACCESS-TOKEN"/>`

Make sure to keep `access_tokens` hidden and never expose them online.

![Enable Components for all accounts](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_all_accounts.png)

**Dashboard Preview**

Dashboard previews do not work when enabling for all accounts.

## Customization[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#customization)

Customize your Contact List with these properties.

| Property | Value | Description |
| --- | --- | --- |
| click\_action | `select`, `email` | Default, `select`, set the behavior when clicking on contacts. For `email` , clicking a contact attempts to open the email program |
| sort\_by | `name`, `last_emailed` | Default `name`, sort contacts by last name. `last_emailed` also requires `email` scopes to sort by date |
| contacts\_to\_load | `10`, `50` , `100`, `1000` | Default `100`, number of contacts to display |
| theme | `theme-1`, `theme-2`, `theme-3`, `theme-4` | Default `theme-1`, set the theme |

### Contact List Event Listeners[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#contact-list-event-listeners)

| Name | Description |
| --- | --- |
| `manifestLoaded` | This event is dispatched on load when the manifest is loaded. The handler is passed the `manifest` argument. |
| `onError` | Emitted if an error occurs while fetching data in the component. The handler is passed an object with the component id as the key and the error as the value. |
| `contactClicked` | Emitted when contact is clicked. Returns the `KeyboardEvent` or `MouseEvent` as `event`, `contact` clicked and the list of `contacts`. |

### Allowed Domains[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#allowed-domains)

You can restrict the domains that your Component works on. Use glob patterns to enable or disable domains.

Some examples of glob patterns:

-   `nylas.com` will only match [nylas.com](http://nylas.com/)
-   `subdomain.nylas.com` will match `subdomain.nylas.com`
-   `*subdomain.nylas.com` will match `subdomain.nylas.com` and `sub.sub.subdomain.nylas.com`
-   `*` will match any domain

Domain restriction only applies to the domain name. URL paths (/sub-path) or protocols (HTTPS) can not be restricted.

### How Properties Are Handled[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#how-properties-are-handled)

Nylas Components follow an order of operations to decide if the dashboard or code takes precedence.

1.  If the property **is** passed directly to the Component, use that first.
2.  If the property **is not** passed directly in the Component, use the dashboard settings.
3.  If there are **no properties** set in the Component or the dashboard, use the Component defaults.

The Contact List Component pulls from the /[contact endpoint](https://developer.nylas.com/docs/api/#get/contacts). It displays:

-   Name
-   Photo if available. If there is no photo available, it defaults to showing the contact initials.
-   Last Emailed Date
-   Email

## Demo Apps[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#demo-apps)

Fork our demo to get started.

-   [Contact List](https://codesandbox.io/embed/nylas-contact-list-pj1vj)
-   [Contact List script tag](https://replit.com/@nylasinc/Contact-List-Script-Tag)
-   [Contact List external data](https://replit.com/@nylasinc/Contact-List-External-Data)

## What's Next?[](https://developer.nylas.com/docs/user-experience/components/contact-list-component/#whats-next)

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