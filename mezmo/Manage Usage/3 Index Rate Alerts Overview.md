---
type: page
title: Index Rate Alerts Overview
listed: true
slug: index-rate-alerts
description: 
index_title: Index Rate Alerts Overview
hidden: 
---published



Configuring alerts based on the index rate or retention and storage rate of your log data helps you track unusual behavior in your systems. For example, if there's a sudden spike in volume,. Mezmo's Index Rate Alert feature tells you which applications or sources produced the data spike. It also shows any recently added sources. Index rate alerts can also help managers who are responsible for budgets to analyze and predict storage costs.

## Index Rates Alert Dashboard

The Index Rate Alert page tells you the rate of indexing and ingestion for your account. You can see the ratio of log lines being ingested to the number of log lines being stored. In other words, you can see how much of what you're taking in and getting indexed.

### Rate Alerts

There are two types of index rate alerts:

- **Max lines/s** - An excessive flow rate alert which measures, in lines per second, the log lines indexed or stored.
- **Max z-score** - An alert for anomalous flow rates, based on the number of standard deviations away from the regular baseline of the last 30 days.

### Average Index Rates Graph

The Index Rate Alert page displays a graph that visualizes the index rate for your log data over the past 7 days. You can toggle the graph to view visualizations.

- **Index Rate** - The daily average index rates contrasted to the daily minimum and maximum index rates.
- **Standard Deviation** - The daily average index rates contrasted to the standard range for the past 30 days.

You can also toggle between viewing index rates for the past 30 days, the past seven days, or the past one day (24 hours).



$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/k8c8n69933gj59tbdg30cjj10rfhhzsozt21rkks1lsz7syugl46fzo0wh2ff6eo.png",
        "mode": "responsive",
        "width": 826,
        "height": 274,
        "caption": ""
    }
}]$







