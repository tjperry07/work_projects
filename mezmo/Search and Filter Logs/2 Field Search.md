---
type: page
title: Field Search
listed: true
slug: search-json-fields
description: 
index_title: Field Search
hidden: 
---published

Mezmo provides several capabilities for searching fields in your logs. In this topic you'll find information on nested field searches, searching by field comparison, searching for the existence of fields, and general and exact term field searches.

## JSON Field Search

To search for a field with a particular value, use a colon to separate the field and value. 

This example will return all parsed log lines with the field `response` with a value of `404`. 

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "response:404",
                "language": "bash"
            }
        ]
    }
}]$

### Nested Field Search

To search for a nested field, use periods to separate each nested field. 

This example will return all log lines containing the key:value structure `{ "user": { "id": 12345 }}.`

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "user.id:12345",
                "language": "bash"
            }
        ]
    }
}]$

## Filters

Using the same field search syntax, you can also set filters directly in the search bar. 

This example will return all log lines that originate from the source `myawesomehost` and not from the app `mycoolapp`.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "host:myawesomehost -app:mycoolapp",
                "language": "bash"
            }
        ]
    }
}]$

## Metadata

With the REST API or Node.js library, you can upload a metadata object as part of a log line's context. To search for field values contained in the metadata object, use the `meta` prefix.

This example will return all log lines containing the context object with the key:value structure `{ "status_code": 404}.`

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "meta.status_code:404",
                "language": "bash"
            }
        ]
    }
}]$

## Field Comparison Operators

For parsed fields with a numeric value, we support the following operators:

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "* =\n* <\n* >\n* <=\n* >=",
                "language": "bash"
            }
        ]
    }
}]$

To search for parsed fields matching comparison operators, use a colon followed by the comparison operator. 

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "response:>=400",
                "language": "bash"
            }
        ]
    }
}]$

## Compound Field Comparison Search

To form a compound field search query using comparison operators, use a colon followed by parentheses.

This example will return all log lines with the field `response` with values greater than or equal to `400`, less than `500`, and not `404`.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "response:(>=400 <500 -404)",
                "language": "bash"
            }
        ]
    }
}]$

## Case-Sensitive Field Search

To search for a case-sensitive parsed field, use a colon followed by an equal sign `=`. 

This example will return all log lines with the field `name` with the case-sensitive string value `camelCasedName`.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "name:=camelCasedName",
                "language": "bash"
            }
        ]
    }
}]$

## Existence Field Search

To search for the existence of a parsed field, use a colon followed by the asterisk `*.`

This example will return all log lines that have a value for the `user` field.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "user:*",
                "language": "bash"
            }
        ]
    }
}]$

## Term Match Field Search

To search for a term match for a field value, use `==`. 

This example will return all lines with the exact name field value of `bob`, and will not match `bobby`.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "name:==bob",
                "language": "bash"
            }
        ]
    }
}]$

## Term Match Case-Sensitive Field Search

Prefix search is set by default for all string fields. To search for an **exact** match for a field value, use `===`. 

This example will return all lines with the exact name field value of `Bob`, and will not match `bob` or `Bobby`.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "name:===Bob",
                "language": "bash"
            }
        ]
    }
}]$

## Colons

Since the colon is a reserved character for field search, quotes are required when searching for strings with colons in them. 

This example will return all log lines with the string `response:` in them.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "\"response:\"",
                "language": "bash"
            }
        ]
    }
}]$

## Combining Operators

You can combine operators to make your search more specific. This searches first for logs scanned from`/var/log/syslog` or that contain the word `ERROR`, then limits the results to `node1.`

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "source:node1 AND (file:\/var\/log\/syslog OR ERROR)",
                "language": "bash"
            }
        ]
    }
}]$

This searches logs where the value stored in the status field is greater than 100 and less than 503.

$plugin[{
    "type": "code-block",
    "data": {
        "languageBlocks": [
            {
                "code": "status:(>100 AND <= 503)",
                "language": "bash"
            }
        ]
    }
}]$

## Lists

Any whitespace between search terms is automatically interpreted as AND. For example, searching warning error returns logs containing both warning and error. The only exception is when using lists, which treat whitespace as a part of the search term. For example, searching `message:[file, exists]` will only search for instances of exists that are preceded by a space. Some other examples:

- `level:[warning,error]` will return as normal.  
- `level:[warning, error]`with a space between warning and error, will search for entries of the field level which have "warning" or " error" with space included.
- `level:[warning,(error)]` will search for entries of the field level which have "warning" or "(error)" with parenthesis included.

