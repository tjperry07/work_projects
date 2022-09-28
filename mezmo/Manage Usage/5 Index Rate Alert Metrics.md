---
type: page
title: Index Rate Alert Metrics
listed: true
slug: index-rate-alert-metrics
description: 
index_title: Index Rate Alert Metrics
hidden: 
---published



Several metrics are used to calculate the index rate of your log lines, which you can then use to set the thresholds for your Index Rate Alerts.

## Index Rate

This rate is the average value of all index rates measured over the last rolling hour. Log lines are indexed every five minutes to get the total number of lines indexed over an hour. The total number of lines is divided by 60 to get the average per minute. That's divided by 60 again to get the average index rate per second for that hour.

If no log lines are ingested for over 60 minutes, you will see a Check Later message instead of the index rate. After log lines resume, the Check later message is replaced with the index rate value.

Since measurements are taken every five minutes, the first measurement of ingested log lines for that five minutes will be averaged out for the full hour. Any time there is an interruption in ingestion, wait at least an hour before using the index rate value for analysis.

### Ingest Rate

The ingest rate measures the average hourly rate at which log lines are ingested. To determine the ingest rate, Mezmo applies the same formula used to determine the index rate average.

### Lines/s

The lines-per-second value is the measurement of the average number of lines that were indexed, per second, over the current rolling hour.

### Z-Score

The z-score is the count of standard deviations. Standard deviations are measured by assessing the hourly index rate averages of the past 30 rolling days to contrast the historic hourly average against the current hourly average to identify significant spikes.

### Historical Hours

Mezmo records the ingest and index rates for fixed hours; for example, June 22 from 1PM to 2PM. These rates for the historical hours are used to calculate a rolling 30 day average index rate and the rolling 30 day std deviation after the collection of 30 days of data.

### Std (standard) Deviation

Mezmo collects index metrics for a rolling 30-day period, and calculates the index rate for each hour in that 30-day time frame. Knowing the standard hourly index rate lets Mezmo to identify spikes, or deviations, in volume relative to standard index volume. The severity of a spike is measured in standard deviation or how far from the regular index rate is the spike.

### No Data

On the graph for average index rates, any area on the graph for which no data was collected will be marked as no data.





