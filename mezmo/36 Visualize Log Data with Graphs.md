---
type: page
title: Visualize Log Data with Graphs
listed: true
slug: visualize-log-data-with-graphs
description: 
index_title: Visualize Log Data with Graphs
hidden: 
---published

Use Graphs to visualize log data over time. Track error messages, see data trends, and gather insights. Learn the basics of using boards and graphs.

## Boards

**Boards** are a collection of Graphs. Both graphs and boards can be filtered and queried.

$plugin[{
    "type": "callout",
    "data": {
        "text": "Changes to the filters or date and time on a board, also changes the graphs.",
        "type": "info",
        "title": "Board Filters"
    }
}]$

### Filtering

You can filter your board by entering an query into **Filter this board**. Filter the board using [search](/docs/search-and-filter).

### Date and Time

Set the date and time on a board by selecting the calendar. You can also set a duration by selecting from preset duration time. 

You can also add live data to your board, by toggling **Live**. 

## Graphs

Graphs are used to aggregate metrics about your log lines over time. Graphs are displayed as a line graph. 

### Graph Functions

- **Operation** - Choose a metric used to plot the data
- **Filter** - Add a query filter to a single graph.
- **Stack Lines** - Place multiple lines together. on the same graph as a percentage of all other line values.
- **Plots** - Add additional data points to your graph. All the plots are listed by the line color used to represent that plot, under the corresponding graph. Learn how to in [auto$](/docs/add-a-plot-to-a-graph).

### Operation

A metric is a function that changes a graphed dataset. They are also known as operations. When graphing data, the metric default is Counts. You can change the metric on your graphs. 

Only number fields can use all metrics. Metrics only work with data that includes the selected plots and matches the dataset filter.

Current available metrics or operations:

- **Counts** - Counts the number of lines in each interval. This is the only metric function that can be applied to string fields.
- **Min** - Returns the lowest value for each interval.
- **Max** - Returns the highest value for each interval.
- **Average** - Returns the average value for each interval
- **Cumulative** - Returns the sum of values for each interval
- **Diff** - Returns the largest difference between values for each interval
- **Percentiles** - Returns the Nth percentile of a set of values for each interval. You can choose from the 75th, 85th, 95th, and 99th percentile presets.

### Breakdown

Breakdowns can be added to graphs. They are represented as histograms and pie graphs. Learn how to [auto$](/docs/add-a-breakdown-to-a-graph).

### Histograms

Can show data from available fields. They show the distribution of the plots against a chosen field. For example, you have added plots for 200 and 500 response codes. Create a histogram based on the request field to see which URL is returning certain responses.

### Pie

A pie breakdown can show data from a plotted data or added fields. 

## Feature Notes

- For STRING fields, you can only graph count. 
- For NUMBER fields, you can choose field values and operations. 
- When creating a Graph, they use Live data. Toggle live to turn on and off. 
- Change the [Boards](/docs/visualize-log-data-with-graphs) date to change the graph date.
- Choose **All Lines** to graph or plot all lines in your application.

