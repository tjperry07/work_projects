---
type: page
title: Add Alerts to Views
listed: true
slug: add-alerts-to-views
description: 
index_title: Add Alerts to Views
hidden: 
---published

You can add an alert to a single view, or create an alert template that you can apply to multiple views.

## Add an Alert to a Single View

We'll create an email alert for the 404 view created in [auto$](/docs/create-and-edit-views). Views can have multiple alerts and multiple alert types.

1. Go to Views and select your Alert.
2. Click the Alert name and select **Attach an Alert**.
3. Under Build My Own, select **View Specific Alert**.
4. Select Email.
5. You can configure presence or absence alerts. Set the alert to **Presence**.
6. For this example, set it to **100 log lines in 15 minutes**. As you update the number of log lines and times, the graph will update to show how many lines for that time.

$plugin[{
    "type": "callout",
    "data": {
        "text": "The graph will update reflect your selections, the gray areas show the times you will not receive alerts.",
        "type": "info",
        "title": "Reading the Graph"
    }
}]$

7. You can send an alert at the end of 15 minutes, immediately after 100 lines, or set a custom schedule. For this example, we'll select **at the end of 15 minutes**.
8. Add you email recipients.
9. Set the timezone to send the alerts.

$plugin[{
    "type": "callout",
    "data": {
        "text": "Congratulations. You've set an alert, for the 404 View. Now you'll get an alert at the end of 15 minutes if there are 100 or more 404 errors logged.",
        "type": "success",
        "title": "Success"
    }
}]$

## Create an Alert Template for Views

Preset alerts are templates that can be used on multiple Views. In this example, you'll create a custom schedule for alerts that only notifies those on call Monday, Wednesday, and Friday from 8:00 AM - 5:00 PM. Then you'l assign that alert to a view.

### Create the Preset

1. Go to [Settings &gt; Alerts](https://app.mezmo.com/manage/alerts). 
2. Click **Add a Preset**. 
3. Select **Email**.
4. Give the preset a name.
5. Set Presence and when 5 log lines appear within 15 minutes.
6. Send the alert at the end of 15 minutes.
7. Toggle Custom Schedule. When you set a custom schedule, alerts will only be send during that time. If your app alerts outside of that time, you will not receive an alert.
8. Select Monday, Wednesday, and Friday as the active days.
9. Restrict the time to 8:00 AM - 5:00 PM. 

$plugin[{
    "type": "callout",
    "data": {
        "text": "As you update the days and time, you'll notice the graph updating. Areas shaded gray will not send alerts during that time.",
        "type": "info",
        "title": "Reading the Graph"
    }
}]$

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/4osdlch1jol78630hbwli8qfxkllkfi6tyyviaic5gdpp3ox8hyax9ya2l54qlm2.png",
        "mode": "300",
        "width": 1278,
        "height": 1230,
        "caption": "A custom alert schedule showing Monday, Wednesday, and Friday from 8:00 AM - 5:00"
    }
}]$

### Assign Preset to a View

1. Go to Views. 
2. Select the View you want to add the alert to. 
3. Click the View name in the Viewer, then attach alert. 
4. Search for the alert name.

