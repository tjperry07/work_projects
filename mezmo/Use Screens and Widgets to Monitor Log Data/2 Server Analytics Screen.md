---
type: page
title: Server Analytics Screen
listed: true
slug: server-analytics-screen
description: 
index_title: Server Analytics Screen
hidden: 
---published

You'll create a Screen that monitors bytes sent to the server and top response codes.

## Bytes Sent

1. Create a new Screen.
2. Add a **Time Shifted Graph** widget.
3. Set the Data field to bytes.
4. Under Field Value:

    1. Set it to Any
    2. Set Advanced Filtering to `request:*`

5. Change Operation to Cumulative.
6. Change Duration to Today vs Yesterday.
7. Change Appearance label to `Bytes Sent Daily`.

## Top Response Codes

1. Create a **Table** widget.
2. Under Data:

    1. Group by Response
    2. Set Field to All Lines and add `response:* request:*` under Advanced Filtering.
    3. Leave Operation as Counts.

3. Set Duration to Last 1 Day.
4. Under Data Formatting:

    1. Set the Number of Rows to 10.
    2. Set Sorting Descending.

5. Under Appearance:

    1. Change the label to Top 10 Response Codes
    2. Change Left Column to Response
    3. Change Right Column to Count

6. Uncheck Display as Bar Chart.

Save your Screen. Give it the name **Server Health** and add the category, **Web App Monitoring**.

