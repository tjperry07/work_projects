---
type: page
title: Variable Retention
listed: true
slug: variable-retention
description: 
index_title: Variable Retention
hidden: 
---published

$plugin[{
    "type": "synced-block",
    "data": {
        "syncedBlockId": "enteprisebanner"
    }
}]$

## About Variable Retention

With **Variable Retention**, you can use Mezmo's search functionality to identify specific log lines, and then set custom retention policies for those lines so they are retained only for the period of time in which they are relevant.

For example, if you are currently on a plan with a 30-day retention period, but have a subset of log lines that only need to be stored for three days, you can use Variable Retention to remove those lines from storage after that three day period. These log lines could originate from ephemeral environment logs, debug-level logs, or CI/CD logs where detailed results aren't needed after a few days.

Variable Retention also includes a **Usage Dashboard,** where you can view the total usage for your account, along with breakdowns for each Variable Retention tier. This can help you understand how your Variable Retention rules are affecting your overall usage and costs.

## Using Variable Retention Rules with Other Mezmo Features

- Variable Retention rules do not allow you to store logs for longer than the plan retention period associated with your account. For example, if your account has a Maple plan retention period of 14 days, but you set a 30 day variable retention rule, logs will not be searchable beyond 14 days.
- Variable Retention rules only affect new log lines received by Mezmo, and do not affect any log lines retained before a rule has been created or changed
- **Index Rate Alerts**, **Usage Quotas**, and **Usage Alerts** are triggered by the total of all GBs/log lines ingested into Mezmo, regardless of retention tier
- **Exclusion Rules** apply before any Variable Retention rules. If you want to apply a Variable Retention rule to an excluded log line, be sure to [make an exception in the corresponding Exclusion Rule](/docs/excluding-log-lines) to not exclude it.
- New Variable Retention rules may require up to five minutes to take effect, as will changes to existing rules

## Create and Manage a Variable Retention Rule

You can create a Variable Retention Rule by specifying the retention period for the log lines, and then the log line search criteria.

### Create a Variable Retention Rule

1. In the Mezmo user interface, go to **Settings** &gt; **Usage** &gt; **Variable Retention**.
2. Click **Add Rule**.
3. Enter a **Name** for the Variable Retention rule.
4. For **Retention Period**, select the number of days that logs matching this rule should be preserved.
5. Provide the the **Host**, **App**, **Level**, or **Query** to use for the log line search.
You can use any of these criteria alone or in combination with the other criteria, and if you set multiple
criteria, they are joined by an AND operator. The topic [auto$](/docs/search-and-filter) contains more
information about using the Mezmo search syntax for creating queries.
6. Click **Save**.

### Enable or Disable a Variable Retention Rule

You can disable or enable a Variable Retention rule by using the on/off switch on the right side of the rule.

### Edit a Variable Retention Rule

Click the three dot icon next to the rule on/off switch and click **Edit** to make changes to the rule **Name**, **Retention Period**, or search criteria.

### Delete a Variable Retention Rule

Click the three dot icon next to the rule on/off switch and click **Delete** to remove the rule.

### Manage Variable Retention Rule Priority

Variable Retention rule priorities determine which rule should be applied to a log line if it matches multiple retention rules. Rules with lower priority numbers take precedence over rules with higher priority numbers. For example, if a log line matches a rule with a priority of 5, and a rule with a priority of 20, only the rule with the priority of 5 will be applied.

There are two ways you can set rule priorities on the **Variable Retention Rules** page.

- Click the six dot icon next to the priority number of the rule and drag it to a new priority rank
- Click the three dot icon next to the rule on/off switch to edit the rule, and enter a new priority number in the **Change Priority** field

## View Variable Retention Usage

### Viewing Variable Retention Usage in the Log Viewer

Once you have enabled Variable Retention rules and they take effect, log lines affected by a Variable Retention rule will have a badge added to the top right of the log line to show its retention period, as shown in this screenshot.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/5fsdh5uko9ezbamiqxn2yypwrbr8b32lwmmut1ey8iyd0fj0x0tg419k6e8wfvwu.png",
        "mode": "responsive",
        "width": 917,
        "height": 162,
        "caption": null
    }
}]$

### Viewing Variable Retention Usage in the Usage Dashboard

Additionally, once you have enabled Variable Retention rules and they become effective, the [Usage Dashboard](/docs/manage-usage) will be updated to show breakdowns based on Variable Retention tiers, as illustrated in this bar chart. Here the log lines that are retained according to the plan retention period of 7 days are shown in blue, while the log lines that are being stored following a Variable Retention rule are shown in green.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/5fsdh5uko9ezbamiqxn2yypwrbr8b32lwmmut1ey8iyd0fj0x0tg419k6e8wfvwu.png",
        "mode": "responsive",
        "width": 917,
        "height": 162,
        "caption": null
    }
}]$

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/nejpoc2vr7gc37zejj2jy0un0aor43v3onioape8te7yz55gofyads78gmswxnui.png",
        "mode": "responsive",
        "width": 840,
        "height": 472,
        "caption": null
    }
}]$

The daily usage chart will be updated to show the number of GBs or lines stored in each retention tier.

- Hover your mouse cursor over each bar in the chart to see the exact number of GBs or lines used for a specific retention tier on a specific day.
- To view the breakdown of data usage by retention tier, hover your mouse cursor over **See Breakdown by Retention** under the **Data Usage** number on the top of the Usage Dashboard.
- To view the breakdown of Variable Retention usage by **Apps**, **Sources**, and **Tags**, use the **Last month in Days - Trends** chart and select the retention tier you want to view. This way you can identify which apps, sources, or tagged logs are utilizing different retention tiers.

$plugin[{
    "type": "callout",
    "data": {
        "text": "If you set a Variable Retention rule to have the same retention period as your plan policy, you will have one breakdown showing your plan retention, and another showing your variable retention tier.\n\nFor example, if you're on a 14 day plan and you set a Variable Retention rule with a 14 day retention period, you'll see one breakdown for **14 day plan retention**, and another for \"14 day variable retention\".",
        "type": "info",
        "title": "Variable Retention Tiers and Plan Retention are tracked separately"
    }
}]$

