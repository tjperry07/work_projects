---
type: page
title: Web Analytics Screen
listed: true
slug: web-analytics-screen
description: 
index_title: Web Analytics Screen
hidden: 
---published

You'll create a screen that monitors:

- Week over week traffic
- Most popular pages

## Week Over Week Traffic

1. Create a **Time Shifted Graph** Widget. 
2. Under Data:

    1. Set Field to **All Lines**.
    2. Set Advanced Search to: `response:>=200 response:<300 request:*`.
    3. Leave Operation as Counts.

3. Set Duration to **This Week vs Last Week(Mon-Sun)**.
4. Under Appearance set the label to **Week Over Week Traffic Trends**.

## Most Popular Pages

1. Create a **Table Widget**.
2. Under Data:

    1. Group by Request
    2. Field to All Lines
    3. Advanced Filter to `response:>=200 response:<300 request:*`

3. Leave the Operation as **Counts**.
4. Set the Duration to **Past 1 Week**.
5. Under Data Format:

    1. Set the number of rows to 10.
    2. Sort Descending.

6. Under Appearance:

    1. Label the table: Most Popular Web Pages
    2. Left Colulmn Label: URL Path
    3. Right Column Label: Count

7. Uncheck Display as Bar Chart.

Save your Screen. Give it the name **Web Analytics** and add the category, **Web App Monitoring**.

