---
type: page
title: View Log Data by Timeline
listed: true
slug: view-log-data-by-timeline
description: 
index_title: View Log Data by Timeline
hidden: 
---published

The Mezmo Timeline is a tool for seeing patterns and trends in log lines over time. By default, it shows the most recent 60 minutes of log lines.

Use the timeline to:

- View the counts of logs that match a specific query to understand how often the same action is occurring in a timeframe.
- Debug issues that occurred during a specific timeframe to do root cause analysis.
- Determine exactly when a certain error first started occurring.

Access the timeline by selecting [__Views__](https://app.logdna.com/logs/view).

## Change the Time Scale

To change the time scale, click the downward arrow beside the Time scale, then select a predefined time scale. The time scale will update to show the time you selected.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/8k5dm42mtgi0r2brkltg4o2wvrazkzp0tppmujuypibdmmfp0911rns0j124zun3.gif",
        "mode": "600",
        "width": 1600,
        "height": 1054,
        "caption": "Change the time scale by selecting the times in the drop down."
    }
}]$

## Scope In

To zoom in or **Scope** to a block of time, place your cursor in the timeline, click to select, and then drag up or down the timeline to select a time frame. The Log Viewer and time scale update to show the time you selected. 

You can continue to scope until you get to the time you want to view. Each bar represents 15 minutes.

$plugin[{
    "type": "callout",
    "data": {
        "text": "You can not use the Time scale selector to zoom in further than your current time frame selection.",
        "type": "info",
        "title": "Time Scale Zoom"
    }
}]$

### Compare Time Scale

Once you have scoped in on the time scale, you can investigate and compare times before and after. For example, the original time you zoomed in on was 10 minutes. Then you selected 30 minutes in the time scale drop down. You will see log lines for:

- 10 minutes before the original selection 
- The original 10 minutes
- 10 minutes after the original selection

$plugin[{
    "type": "callout",
    "data": {
        "text": "Changing the time scale will not change the log viewer. You must zoom in.",
        "type": "info",
        "title": "Changing the Log Viewer."
    }
}]$

## Select a Time

Select a time by clicking one of the lines in the timeline and clicking **Jump to**. The log viewer will update to show the selected time. Before selecting **Jump to**, it will show which time has been selected.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/oj0o5i3g2wtb7h4a6h8mpvj2s8ub7yt6ywllpohgsuln0uc8tfudniw41kkspwnl.gif",
        "mode": "responsive",
        "width": 1600,
        "height": 1054,
        "caption": "Select jump to on the time scale to jump to a certain block of time."
    }
}]$

## Reset the Time Scale

Click the circle with the arrow to reset the time scale.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/3lcgc4n3731ypm8b3lvbolor99lekvku63x3qxapsouyjjxsjuew855208jqu1gw.gif",
        "mode": "responsive",
        "width": 1600,
        "height": 952,
        "caption": null
    }
}]$

## Jump to Timeframe

To jump to a point in time in your logs, type the desired day and time in the **Jump to timeframe** field. You can enter queries such as yesterday at a11pm.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "today at 11am",
                "language": "bash"
            }
        ]
    }
}]$

To set a timeframe for your logs, type two different dates and times separated by `to`.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "last fri 4:30p to 11\/12 1 AM",
                "language": "bash"
            }
        ]
    }
}]$

This will show all logs between last Friday at 4:30 PM and November 12 at 1 AM.

## Feature Notes

- When the Log Viewer is in live tail mode, the timeline graph is a few minutes behind the Log Viewer display. To turn if off, toggle the **Live** button in the Log Viewer.

