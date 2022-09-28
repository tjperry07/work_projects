---
type: page
title: Format Log Lines with  Custom Line Templates
listed: true
slug: format-log-lines-with--custom-line-templates
description: 
index_title: Format Log Lines with  Custom Line Templates
hidden: 
---published

You can use custom line templates to format the lines in the log viewer to make it easier for you to identify specific information that is of interest to you. 

1. Select an existing View or [Create and Edit Views](# link).
2. Select **Edit View Properties.**
3. In the **Custom %LINE Template** area, enter your template.

## Display PID, Program, and Log Source

If you have log lines that look similar to the example, you can decide to display the information in a more easily parsed format.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/e5cpcsho4qptzqgn9afgbl28uehi79it2b7ahj5jhpbcjogxzajoxezdosygj4l6.png",
        "mode": "300",
        "width": 770,
        "height": 1060,
        "caption": "Images of log lines from Viewer."
    }
}]$

1. Enter `PID: {{pid}} | Program: {{program}} | Log Source: {{logsource}}` into Custom %LINE Template area.
2. You logs should now look like:

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "Aug 8 11:29:03 samir-Debian-10 daemon.log PID: 468 | Program: logdna-agent | Log Source: ip-12-34-5-67",
                "language": "bash"
            }
        ]
    }
}]$

## Use Reserved Fields

[Reserved fields](/docs/log-parsing) are marked by an underscore. 

If your data resembles: 

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "user 1234 requested endpoint \/api\/endpoint",
                "language": "bash"
            }
        ]
    }
}]$

And contains this field metadata:

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "{\n\tmeta: {\n\t\tfirst_name: Jane,\n\t\tlast_name: Doe\n\t}\n}",
                "title": "JSON",
                "language": "json"
            }
        ]
    }
}]$

Enter `{{_meta.first_name}} {{_meta.last_name}}, aka $@`  into Custom %LINE Template area. Using `$@`  will reference the original line.

This will display log messages in that view in this format:

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "Jane Doe, aka user 1234 requested endpoint \/api\/endpoint",
                "language": "bash"
            }
        ]
    }
}]$

## Return as JSON

You can format your data to return as JSON.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "{\"index\": {{query.index}}, \"size\": {{query.size}}, \"ignore_unavailable\": {{query.ignore_unavailable}}, \"track_total_hits\": {{query.track_total_hits}}, \"body\": {\"query\": {{query.body.query}}, \"sort\": {{query.body.sort}}, \"aggs\":{{query.body.aggs}}}}",
                "language": "json"
            }
        ]
    }
}]$

### Formatted Log Line Example

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "Aug 8 12:49:20  xxxx-xxxx-xxxxxxxxx-xxxx  apiinternal info  {\"index\": [\"*:logline.*\"], \"size\": 0, \"ignore_unavailable\": true, \"track_total_hits\": true, \"body\": {\"query\": {\n  \"bool\": {\n    \"must\": [\n      {\n        \"range\": {\n          \"_ts\": {\n            \"gte\": 1659976890001,\n            \"lte\": 1659977360647\n          }\n        }\n      },\n      {\n        \"bool\": {\n          \"should\": [\n            {\n              \"term\": {\n                \"_app\": \"localhost\"\n              }\n            }\n          ]\n        }\n      }\n    ]\n  }\n}, \"sort\": {\n  \"_lid\": {\n    \"order\": \"desc\"\n  }\n}, \"aggs\":{\n  \"metrics\": {\n    \"date_histogram\": {\n      \"field\": \"_ts\",\n      \"interval\": \"30s\"\n    }\n  }\n}}}",
                "language": "json"
            }
        ]
    }
}]$

