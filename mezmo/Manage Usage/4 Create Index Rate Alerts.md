---
type: page
title: Create Index Rate Alerts
listed: true
slug: create-index-rate-alerts
description: 
index_title: Create Index Rate Alerts
hidden: 
---published



## Create Alerts

1. Go the [Settings &gt; Organization &gt; Usage &gt; Index Rate Alerts](https://app.Mezmo.com/manage/index-rate-alerts).
2. Set the **Max lines/s** and **Max z-score**. You can set one or both.
3. Set the Threshold Alerts. You can send alerts for each threshold or when both thresholds are reached.
4. Alert on each threshold separately - You will get an alert indicating whichever threshold is crossed first, either Max lines/s or Max z-score, or both.
5. Alert only when both thresholds have been exceeded - Mezmo will send one alert (per channel) every 60 minutes/24 hours. The alert will say what thresholds were crossed.
6. Decide how you want to get alerts. Slack, email, or Pager Duty.
7. Set the frequency of the alerts. Alerts will be sent hourly or daily until the index rate is below the threshold. You can also set a custom alert schedule.

## Alert Message

The alert message includes information about the top 20 sources and apps that have had the largest index rate growth in the past 2 hours and a list of the 20 newest sources added. The alert also includes a link to download generated lists of all applications and sources. You can view the download the list from Usage in the app.





