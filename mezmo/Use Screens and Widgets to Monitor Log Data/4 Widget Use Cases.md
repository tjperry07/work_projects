---
type: page
title: Widget Use Cases
listed: true
slug: widget-use-cases
description: 
index_title: Widget Use Cases
hidden: 
---published

You can use widgets to monitor various aspects of application health. To learn how to build a Screen to monitor your web application, see [Use Screens and Widgets to Monitor Log Data](https://logdna.slite.com/app/docs/7uw4zKMJ-P3H80).

This article lists some other ways you can use Widgets.

## Count All Log Lines for the Past Day

1. Create a **Count** widget.
2. Set the duration to **Last 1 Day**.
3. Optionally set the host and field value if you want to filter the log lines.

## Monitor Error Logs

There are multiple ways to measure error logs. 

### **Time Shifted Graph**

Compare errors over a period.

1. Create a **Time Shifted** widget.
2. Set field to `level`.
3. Select **Advanced** filtering and enter the query `level:(warn OR error)`.
4. Set the duration to **Last 1 Week**.

### **Count**

See the number of errors using a filter. 

1. Create a **Count** widget.
2. Select **Advanced** filtering and enter the query ```level:(warn OR error)```.
3. Set the **Duration** to **Last 1 Week.**
4. To get a view of errors over time, you can create the widget again and choose a different duration. 

### **Table**

Use a table to see error levels.

1. Create a **Table** widget.
2. Under **Data**:

    1. Set **Group by** to `level`.
    2. Set **Field** to `All Lines`.

3. Set **Duration** to `Last 1 Week`.
4. Under **Appearance**:

    1. Set Left Column Label to `Level`. 
    2. Set Right Column Label to `Counts`.

## See Log Lines by App

1. Create a **Table** widget. 
2. Under **Data**:

    1. **Group** by `app`.
    2. Set **Field** to `host`.
    3. Optionally set the field value. 

3. Set the **Duration**. 
4. Under **Appearance**:

    1. Set Left Column Label to `App`.
    2. Set Right Column Label to `Counts`.

## Authentication Attempts

1. Create a **Count** widget.
2. Under **Data**:

    1. Set **Field** to `host`.
    2. Set **Field** value to the host you want to monitor. 
    3. Click **Advanced Monitoring** and add `authentication`

3. Set the **Duration** to **Last 1 Day.**

