## Agenda Component

Use the Nylas Agenda Component to display calendar data. Without needing to write a single line of code, the Agenda Component comes with:

-   Theme options
-   Ability to change display date
-   Events listed with time, event title, location, and description
-   Event details are expanded on click
-   Display multiple calendars

![Nylas Agenda](https://developer.nylas.com/_images/components/agenda.gif)

## Quickstart[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#quickstart)

1.  Create a Agenda component in your Nylas Dashboard.
2.  Add it to your application.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-agenda"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-agenda id="<PASTE_YOUR_COMPONENT_ID>"></nylas-agenda>    </body>   
```

**That’s It! Agenda is ready to use!**

## Prerequisites[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#prerequisites)

-   Either an existing Nylas application or sign up using our [Quickstart](https://developer.nylas.com/docs/the-basics/quickstart/).
-   If using an existing application, make sure you have the minium required [scopes](https://developer.nylas.com/docs/the-basics/authentication/authentication-scopes/#nylas-scopes).
    -   Agenda - `calendar`
    -   Composer - `email.modify`, `email.send`,and `contacts`
    -   Contact List - `contacts`
    -   Email - `email.modify`,`email.folders_and_labels`, and `contacts`
    -   Messages - `email.read_only` and `contacts`
-   An application to add the Component to. You can fork one of the many CodeSandboxes in the documentation.

## Agenda Installation Options[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#agenda-installation-options)

You can install Agenda in 2 ways:

### npm Package[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#npm-package)

[Agenda on npm](https://www.npmjs.com/package/@nylas/components-agenda)

1.  Run `npm i @nylas/components-agenda` or `yarn add @nylas/components-agenda`.
2.  Then import and render the component.

```
    // Import the web component    import '@nylas/components-agenda';        // In render method    <nylas-agenda></nylas-agenda>      
```

### Script Tag[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#script-tag)

Use the CDN script tag, `https://unpkg.com/@nylas/components-agenda`.

```
    <head>      <!-- Import the script from CDN -->      <script src="https://unpkg.com/@nylas/components-agenda"></script>    </head>    <body>      <!-- Place the component on the page -->      <nylas-agenda></nylas-agenda>    </body>      
```

## Ways to Use Agenda[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#ways-to-use-agenda)

-   [Use Agenda with Nylas Data](https://developer.nylas.com/docs/user-experience/components/agenda-component/#use-agenda-component-with-nylas-data) - Choose this option if you want to integrate your existing Nylas accounts with the Agenda Component.
-   [Use Agenda with External Data](https://developer.nylas.com/docs/user-experience/components/agenda-component/#use-agenda-component-with-external-data) - Choose this option if you want to pass in your data.

### Use Agenda Component with Nylas Data[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#use-agenda-component-with-nylas-data)

You'll learn how to use your Nylas accounts with the Agenda Component.

#### Create the Agenda Component[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#create-the-agenda-component)

1.  Log in to your Nylas dashboard.
2.  Click **Components > Agenda**
3.  Name your Component and select the account. To quickly start testing your Component select **Enable for a single account.**
    1.  To learn how to enable components for multiple accounts see [Authorizing Components](https://developer.nylas.com/docs/user-experience/components/agenda-component/#authorizing-components)
4.  Use an existing access token or generate a new one.
5.  Enter the [domain](https://developer.nylas.com/docs/user-experience/components/agenda-component/#domain-restriction) the component will run on. Without the [domains](https://developer.nylas.com/docs/user-experience/components/agenda-component/#domain-restriction), the component will not run
    1.  To run on localhost, enter an asterisk. `*`. Remember to change this before going to production.
6.  Save your new component.
7.  On the **Edit** page, you can configure your component behavior and appearance.

**Generate an Access Token**

Generating a new access token will not replace your existing access token; it will create a second access token with the same scopes as the previous token. You can [revoke access tokens](https://developer.nylas.com/docs/api/#get/oauth/authorizerevoke) at any time.

![Create a New Component](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/create_new_component.png)

### Add the Component To Your Application[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#add-the-component-to-your-application)

1.  On the **Edit** page, there are instructions for installing the new component.
2.  If you haven't installed the Agenda Component already, open a terminal and run `npm i @nylas/components-agenda`.
3.  Then add your Nylas component. Copy and paste your component code into your application.  
    `<nylas-agenda id="your-component-id" calendar_id="your-calendar-id"></nylas-agenda>`
4.  You should refresh your application if needed. Any [configuration options](https://developer.nylas.com/docs/user-experience/components/agenda-component/#nylas-dashboard-display-options) set on the editing page will apply to your Component.

![Copy Agenda Component](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/agenda_component_copy_01_05_2020.png)

### Agenda Height[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#agenda-height)

When adding an Agenda component, it takes on the height of the parent container.  
If your agenda isn't showing, try adding it to a div with the height specified.

```
<div class="app" style="height:800px">  <nylas-agenda id="3a3605a4-6d8c-49d4-8e79-0e417ac7483b" > </nylas-agenda> </div>   
```

### Use Agenda Component with External Data[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#use-agenda-component-with-external-data)

The Nylas Agenda Component can accept an array of objects for events. You can pass in any event data from our [events endpoint](https://developer.nylas.com/docs/api/#post/events). In this example, we are passing the data needed to create an event. The data input should match the formatting of the Nylas [Events Object](https://developer.nylas.com/docs/api/#post/events).

1.  Install the Nylas Agenda Component. `npm i @nylas/components-agenda`.
    
    ```
      import Agenda from "@nylas/components-agenda";  const staticEvents = [    {      title: "Some event that I am manipulating outside of the context of Nylas",      description: "Passed in from HTML!",      participants: [],      when: { end_time: 1600444800, object: "timespan", start_time: 1600438500 }    },    {      title: "Some I got from elsewhere",      description: "Passed in from HTML!",      participants: [],      when: { end_time: 1600449999, object: "timespan", start_time: 1600448500 }    },    {      title: "A third event of the day",      description: "Passed in from HTML!",      participants: [],      when: { end_time: 1600468500, object: "timespan", start_time: 1600458500 }    }  ];</script><main>  <h1>Nylas Agenda</h1>  <nylas-agenda events={staticEvents}/></main>   
    ```
    
2.  Add the event data to your `nylas-agenda`. `<nylas-agenda events={staticEvents}/>`.
    

With components, you can authorize them to work with a single account or multiple accounts.

### Enable for a Single Account[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#enable-for-a-single-account)

A single account is a way to get started quickly. If you use this method in production, you'll have to authenticate each account from the dashboard one by one.

![Enable components single account](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_single_account.png)

### Enable for All Accounts[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#enable-for-all-accounts)

To enable all accounts, you'll need to pass in a user's access token as a property of the component. One way to achieve this is to create a login screen, capture the access token and pass it into the component. You can pass in `access_tokens` directly in the Component.

`<nylas-agenda id="COMPONENT-ID" access_token="USER-ACCESS-TOKEN"/>`

Make sure to keep `access_tokens` hidden and never expose them online.

![Enable Components for all accounts](https://nylas-static-assets.s3-us-west-2.amazonaws.com/public-documentation/components_enable_all_accounts.png)

**Dashboard Preview**

Dashboard previews do not work when enabling for all accounts.

## Customization[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#customization)

Nylas components are flexible and can be customized for your needs. You can customize the display in 2 ways:

-   [From your Nylas dashboard](https://developer.nylas.com/docs/user-experience/components/agenda-component/#nylas-dashboard-display-options) - Use this option if you are using the Component created from the dashboard.
-   [Directly in the application](https://developer.nylas.com/docs/user-experience/components/agenda-component/#application-component-display-options) - No matter where you created your Component, you can use this method to edit the display options.

The options are the same for both the application and dashboard. The names are slightly different, and the application requires a few more options.

### Agenda Event Listeners[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#agenda-event-listeners)

| Name | Description |
| --- | --- |
| `manifestLoaded` | This event is dispatched on load when the manifest is loaded. The handler is passed the `manifest` argument. |
| `onError` | Emitted if an error occurs while fetching data in the component. The handler is passed an object with the component id as the key and the error as the value. |
| `eventsLoaded` | Emitted if no `events` prop provided. Returns list of calendar events. |
| `dateChange` | Emitted if date changes. |

### Nylas Dashboard Display Options[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#nylas-dashboard-display-options)

Customize the display by going to your application > **Components**. Then select the Component you want to edit. When you are making changes in the dashboard, the display of the Component will update.

| Name | Description |
| --- | --- |
| Allowed Domains | Use [glob](https://www.digitalocean.com/community/tools/glob?comments=true&glob=%2F%2A%2A%2F%2A.js&matches=false&tests=%2F%2F%20This%20will%20match%20as%20it%20ends%20with%20%27.js%27&tests=%2Fhello%2Fworld.js&tests=%2F%2F%20This%20won%27t%20match%21&tests=%2Ftest%2Fsome%2Fglobs) patterns to match allowed domains |
| Theme | Set the theme of your Agenda Component. |
| Hide Event Details | Show all events as Busy. |
| Show Date in Header | Add date to the Agenda Header. |
| Start or end day when event start or end | Display the Agenda start and end time by 24 hour clock or display Agenda start and end time using earliest and last event. |
| Color items by | Color by calendar or events. |
| Disable pinch to zoom | Adds an effect to expand or contract the calendar display. |
| Hide current time bar | Display a line on the Agenda that illustrates the current time. |
| Allow users to change date | Enable left and right arrows to allow users to change calendar display date. |
| Condensed View | Display the agenda events in a single column. |
| Calendars to Include | Select any available calendars to display. If no calendar is selected, the component must be provided at least one calendar ID using the `calendar_ids` property to display Nylas data. |

### Application Component Display Options[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#application-component-display-options)

To enable most features, add them to your configuration. For example, `allow_date_change` by default is false. Adding it to your configuration will automatically make it true—no need to set it to true.

```
import React from "react";import "./styles.css";import "@nylas/components-agenda";export default function App() {  return (    <div className="App">      <nylas-agenda        id="your-agenda-id"        access_token="your-access-token" // only if this component has been enabled for all accounts        calendar_ids ="your-calendar-ids" //only if using Nylas account data        allow_date_change        allowed_dates        auto_time_box        click_action        color_by="event"        condensed_view        eagerly_fetch_events        header_type        hide_current_time        hide_ticks        prevent_zoom        show_as_busy        show_no_events_message        theme="theme-1"      ></nylas-agenda>    </div>  );}   
```

| Name | Type | Description |
| --- | --- | --- |
| allow\_date\_change | boolean | Allow your users to change the date using arrows. Allow date change will let them go through all calendar events instead of just one day. `header_type` must not be `none`. Default: `false` |
| allowed\_dates | Date\[\] | string | Limits the dates that can be displayed by the Agenda to those provided by this property. Default: `[]` |
| auto\_time\_box | boolean | Display the Agenda start and end time by 24 hour clock or display Agenda start and end time using earliest and last event. Default: `false` |
| calendar\_ids | string | A comma-separated list of IDs of the calendars to display. You can get a list of calendar IDs by making a request to \[GET /calendars\]\[4\]. At least one calendar ID must be provided if using Nylas data. |
| color\_by | enum | Color the calendar by events or by calendar. If you have multiple calendars in one agent view, select `calendar` to show each calendar as it's own color. Available options: `calendar`, `event` Default: `event` |
| condensed\_view | boolean | Display the agenda events in a single column. Default: `false` |
| eagerly\_fetch\_events | boolean | Pre-fetches nearby dates for smoother transitions. Default `true` |
| header\_type | string | Changes the amount of information in displayed in the header. Available options: `full`, `day`, `none` Default `full` |
| hide\_current\_time | boolean | Display a line on the Agenda that illustrates the current time. Default:`false` |
| display\_metadata | boolean | Display [Event Metadata](https://developer.nylas.com/docs/developer-tools/api/metadata/) within event body. Default `true` |
| prevent\_zoom | boolean | Adds an effect to expand or contract the calendar display. Default: `false` |
| hide\_ticks | boolean | Hide hours from the left margin. Default `false` |
| show\_as\_busy | boolean | Show all events as busy instead of event details. `show_as_busy` only has an effect when set in the [Nylas Dashboard](https://dashboard.nylas.com/) Default: `false`. |
| show\_no\_events\_message | boolean | Display a message if there are no events for the selected date. Default: `false` |
| theme | enum | Set the theme of your Agenda Component. Available options: `theme-1`, `theme-2`, `theme-3`, `theme-4`, `theme-5`. Default: `theme-1` |

### Custom CSS[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#custom-css)

To customize the CSS, you can change the `theme` custom property to one of the provided themes by Nylas:

```
    <nylas-agenda id="your-agenda-id" theme="theme-5"></nylas-agenda>   
```

You can also easily override styles for pre-selected themes by writing your own CSS vars. The customizable CSS variables are the following and the value assigned should be a valid CSS property value:

```
    nylas-agenda {      --nylas-agenda-calendar-1-bg-color: inherit;      --nylas-agenda-calendar-2-bg-color: inherit;      --nylas-agenda-calendar-3-bg-color: inherit;      --nylas-agenda-calendar-4-bg-color: inherit;      --nylas-agenda-calendar-5-bg-color: inherit;      --nylas-agenda-calendar-6-bg-color: inherit;      --nylas-agenda-calendar-7-bg-color: inherit;      --nylas-agenda-calendar-8-bg-color: inherit;      --nylas-agenda-calendar-9-bg-color: inherit;      --nylas-agenda-calendar-10-bg-color: inherit;      --nylas-agenda-empty-event-bg-color: inherit;      --nylas-agenda-current-time-bg-color: inherit;      --nylas-agenda-icons-bg-color: inherit;      --nylas-agenda-header-bg: inherit;      --nylas-agenda-header-color: inherit;      --nylas-agenda-declined-event-color: inherit;      --nylas-agenda-ticks-color: inherit;      --nylas-agenda-event-color: inherit;      --nylas-agenda-dividers-border-color: inherit;    }   
```

### Custom Callbacks[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#custom-callbacks)

**You can't pass callbacks as attributes**

You must select the element, for example `document.getElementById`, and then attach the custom properties.

| Name | Type | Description |
| --- | --- | --- |
| `click_action(clickEvent, calendarEvent)` | function | Triggered when a user clicks on an event. The callback is provided with the original click event as `clickEvent` and the event data as `calendarEvent`. If no callback is provided, the default behavior is to expand/collapse an event on click. |

### Emitted Events[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#emitted-events)

The emitted event object will include a `details` property that contains the event payload.

| Name | Type | Description |
| --- | --- | --- |
| `dateChange` | Date | Requires `allow_date_change` to be `true`. Triggered when a user changes the date of the Agenda. |

### Allowed Domains[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#allowed-domains)

You can restrict the domains that your Component works on. Use glob patterns to enable or disable domains.

Some examples of glob patterns:

-   `nylas.com` will only match [nylas.com](http://nylas.com/)
-   `subdomain.nylas.com` will match `subdomain.nylas.com`
-   `*subdomain.nylas.com` will match `subdomain.nylas.com` and `sub.sub.subdomain.nylas.com`
-   `*` will match any domain

Domain restriction only applies to the domain name. URL paths (/sub-path) or protocols (HTTPS) can not be restricted.

### How Properties Are Handled[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#how-properties-are-handled)

Nylas Components follow an order of operations to decide if the dashboard or code takes precedence.

1.  If the property **is** passed directly to the Component, use that first.
2.  If the property **is not** passed directly in the Component use the dashboard settings.
3.  If there are **no properties** set in the Component or the dashboard, use the Component defaults.

## Extending Functionality[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#extending-functionality)

Here are a few ways to add more functionality to Nylas Agenda.

### Multiple Calendars[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#multiple-calendars)

You can display multiple calendars in a single application in a few ways.

To have multiple accounts in the same view, create an agenda component for each account.

In this example, there are 2 accounts with 1 calendar each (`calendar_ids`) displayed.

```
    <section>      <h2>Dorothy</h2>      <nylas-agenda        calendar_ids="ciw5iqmm8e8ywlhb8xl8fg8iz"        id="801d7467-8663-4800-bdf8-f86a366ff3d0"      />    </section>    <section>      <h2>Kate</h2>      <nylas-agenda        calendar_ids="2stq9ckhdhnzvs4t8x2wlin9p"        id="801d7467-8663-4800-bdf8-f86a366ff3d0"      />   
```

To have 1 account with multiple calendars, add the `calender_id` of each account calendar you want to display.

```
      <nylas-agenda         id="0e4d7f3-bf3b-4f0e-9faf-589ba9831d35"        calendar_ids="1234adv5tgh678h, 1234adv5tgh678h"        color_by="calendar"      ></nylas-agenda>   
```

## Demo Apps[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#demo-apps)

Fork any of our demo apps to get started.

-   [Agenda using script tag](https://replit.com/@nylasinc/Agenda-script-tag) - Quickly start using the Agenda Component by adding a script tag and the component to an HTML page.
-   [Agenda React app](https://replit.com/@nylasinc/Agenda-1) - How to deploy the Agenda in an React app.
-   [Agenda month view](https://replit.com/@nylasinc/Agenda-Month-View) - Using React, how to display the Agenda in a monthly view.
-   [Agenda using external data](https://replit.com/@nylasinc/Agenda-External-Data) - Using Svelte, how to using external data with the open source Agenda Component.
-   [Agenda using weekly single calendar view](https://replit.com/@nylasinc/Nylas-Agenda-Weekly-View) - Using Svelte, how to display a single calendar.
-   [Agenda multiple calendars in a weekly view](https://replit.com/@nylasinc/Agenda-Multiple-Calendars) - Using React, how to display multiple calendars.

## What's Next[](https://developer.nylas.com/docs/user-experience/components/agenda-component/#whats-next)

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