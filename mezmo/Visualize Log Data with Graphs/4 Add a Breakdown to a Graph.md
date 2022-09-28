---
type: page
title: Add a Breakdown to a Graph
listed: true
slug: add-a-breakdown-to-a-graph
description: 
index_title: Add a Breakdown to a Graph
hidden: 
---published

A breakdown is a view of your main graph. It shows the distribution of values for the aggregated plots in your graph. For example, you can create a breakdown for a graph on the request field to see the distribution of request values for the HTTP response codes you plotted in Add a Plot to a Graph. You can add different types of breakdowns depending on the kind of information you want to see, in this case you'll create a histogram breakdown.

## Create a Histogram Breakdown

1. Open the graph created in [auto$](/docs/create-a-graph) and [auto$](/docs/add-a-plot-to-a-graph).
2. Expand the downward arrow under the center of the graph.
3. Select a breakdown type of **Histogram**.
4. Set field name to **Response**.
5. Click the **Add Breakdown** button.

The histogram shows a breakdown of the three plotted queries and which code returns the most HTTP responses. 

In this example, the response code 404 returns the most.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/4wj94uwx3274wsok1rrvc76ibrmsh3a00j8vufcoynnaje8n67ffyrd6lzrfiv8b.png",
        "mode": "responsive",
        "width": 2162,
        "height": 562,
        "caption": null
    }
}]$

$plugin[{
    "type": "callout",
    "data": {
        "text": "Each graph can have five breakdowns.",
        "type": "info",
        "title": "Breakdown Limit"
    }
}]$

## Pie Chart Breakdown

With a pie chart breakdown, you can see how the response codes are distributed across hosts.

1. Click **+Add.**
2. Select breakdown type **Pie.**
3. Distribute by **Fields.**
4. Set field to **Host**.

Hover over each part of the pie chart to see the hosts. In this example we can see a host that has a large number of 404's compared to the other hosts. There are no 500 response codes returned.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/kxf8r8djjmtkzsvitu79s8qiply0qaa4ss8ohqlwu62vtproz207oacch8ujnpul.png",
        "mode": "responsive",
        "width": 2102,
        "height": 842,
        "caption": null
    }
}]$

