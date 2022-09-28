---
type: page
title: Parse Logs with Custom Templates
listed: true
slug: parse-logs-with-custom-templates--in-progress-
description: 
index_title: Parse Logs with Custom Templates
hidden: 
---published

$plugin[{
    "type": "callout",
    "data": {
        "text": "You must be an[ admin or owner ](https:\/\/docs.mezmo.com\/docs\/feature-access-matrix)to use this feature.",
        "type": "info",
        "title": "Permission Levels"
    }
}]$

Mezmo supports [common log types](https://docs.mezmo.com/docs/ingestion#supported-types) and parses the lines automatically for you. However, if you have a log format that does not fit one of the supported log types, you can create your own parsing rules using [auto$](/docs/create-a-parsing-template) or do a one time log extraction using [auto$](/docs/extract-fields).

## Feature Notes

### Multiple Templates

You can have multiple custom parsing templates. Custom Parsing templates are applied to your logs based on the order of active templates. For example if you have two active templates that target the same log line, then the templates are applied in the order on the Manage Parsing page. 

- Template One
- Template Two

First, Template One will be applied to incoming logs, if there is a matching log line in Template Two, it will then be applied.

You can change the order of active templates by dragging them on the Manage Parsing page.

### Template Status

- **On** - Valid parsing templates that will be applied to your logs.
- **Off** _**-**_ __Valid parsing templates that won't be applied to your logs.
- **Draft** -  Invalid parsing templates. These are either incomplete, contains errors or have not been validated.

$plugin[{
    "type": "video",
    "data": {
        "videoId": "R1e_7x3KQko",
        "provider": "youtube"
    }
}]$

