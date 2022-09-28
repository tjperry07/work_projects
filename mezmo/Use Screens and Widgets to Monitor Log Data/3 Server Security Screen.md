---
type: page
title: Server Security Screen
listed: true
slug: server-security-screen
description: 
index_title: Server Security Screen
hidden: 
---published

You'll monitor the number of 401 and 429 errors, maintain a list of of IP address causing those errors.

## Daily 400 Errors

1. Create a **Time Shifted Graph** widget.
2. Under Data:
    1. Set the field to All Lines.
    2. Add the query `response:401 OR response:403 request:*`
    3. Leave Operation as Counts.

3. Set Duration to `Today vs Yesterday`.
4. Set the Appearance label to`Access Forbidden/Permission Denied Requests (Daily)`.

## Top IP Address

1. Create a **Table** Widget.
2. Under Data:
    1. Group by `clientip`.
    2. Set the field to `All Lines` and add the query `response:401 OR response:403 request:*`.
    3. Leave Operation as Counts.

3. Set Duration to `Last 1 Day`.
4. Data format can left at the defaults.
5. Under Appearance:
    1. Set the Table label to `Top Offending 401/403 IPs`.
    2. Left Column Label to `Client IP`.
    3. Right Column Label to `Request Counts`.
    4. Turn on Display as a bar chart.

Save your Screen. Give it the name **Server Security** and add the category, **Web App Monitoring**.

