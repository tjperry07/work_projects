---
type: page
title: Parsing Operators
listed: true
slug: parsing-operators
description: 
index_title: Parsing Operators
hidden: 
---published


Parsing operators are used to extract and manipulate data.

## Extract Values by Delimiters

Extracts values between a single delimiter. It creates tokens that can be selected and used for the next operator in the rule path. One delimiter is accepted as an input and one or more matching tokens are returned as an output (One to Many).


| Operator Fields | Description | 
| ---- | ---- | 
| Delimiter | The delimiter that the logline or string should be split on. | 
| Preserve Delimiters Between (Start & End) | Preserve any encountered delimiters between start and end keys. | 


## Extract Values Between Delimiters

Extracts values between start and end delimiters. It creates tokens that can be selected and used for the next operator in the rule path. One token is accepted as an input, one or more matching tokens are returned as an output (One to Many).


| Operator Fields | Description | 
| ---- | ---- | 
| Start Key | The delimiter that the logline or string should be split on. | 
| End Key | String delimiter for the end of an extraction. | 


## Parse JSON

Parse stringified json objects into objects.

## Parse CSV

Turn CSV strings into a list.

## Concatenate Values by Delimiter

Combines all of the selected values into a single token separated by a delimiter. At least two or more tokens are accepted as an input. One token is returned as an output (Many to One).


| Operator Fields | Description | 
| ---- | ---- | 
| Delimiter | The key to add between each token selected. | 


## Trim Value

Trims the selected value by specifying start and end indices. Indices are numbered from 0 to n. 0 represents the first character, n represents the last character. One token is accepted as an input and one token returned as an output (One to One).


| Operator Fields | Description | 
| ---- | ---- | 
| Start | Start index for partial selection. | 
| End | End index for partial selection | 


## Convert to Number

Converts a string value to a number. One token is accepted as an input and one 1 token returned as an output (One to One).

## Capture in Field

Captures the value in a field. This operator ends the rule path. The field name is required to successfully end the rule path. Field name has to be unique within the parsing template. 1 or more token is accepted as an input, 1 token returned as an output (One to One, or Many to One).

## Feature Notes

After using Concatenate Values by Delimiter, Trim Value, Convert to Number, you cannot use Extract Values by Delimiters and Extract Values Between Delimiters operators in the same rule path.

