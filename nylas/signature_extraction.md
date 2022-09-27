## Signature Extraction Guide

Signature Extraction will extract email signatures by removing extra images and HTML. Use the signatures to create contacts and keep your data up to date.

You'll learn how to extract signature data and help train the Nylas machine learning model.

## Parse a Signature[](https://developer.nylas.com/docs/intelligence/signature-extraction/#parse-a-signature)

Before you can parse an email signature you’ll need to have the `message_id` of the message you want to parse the signature from. Use the [`/messages`](https://developer.nylas.com/docs/api/#tag--Messages) endpoint to get a list of message IDs.

Then you can parse the signature by sending a PUT request to `/neural/signature`. You can parse up to 20 messages.

### Parse Signature Request[](https://developer.nylas.com/docs/intelligence/signature-extraction/#parse-signature-request)

-   **message\_ID** - The ID of the message. Required
-   **ignore\_links** - Remove links in the conversation or signature. Default `true`
-   **ignore\_images** - Remove images in the conversation or signature. Default `true`
-   **ignore\_tables** - Remove tables in the conversation or signature. Default `true`
-   **remove\_conclusion\_phrases** - Remove phrases such as `best` and `regards` in the signature. Default `true`
-   **images\_as\_markdown** - If set to false, returns images as HTML. Default is true. This only works if `ignore_images` is set to false.
-   **parse\_contacts** - A contact object is returned that includes phone number, email, job\_title, and url. Default `true`.

```
 curl --location --request PUT 'https://api.nylas.com/neural/signature' \--header 'Authorization: Bearer <access_token>' \--header 'Content-Type: application/json' \--data-raw '{    "message_id": ["<message_ids"],    "ignore_links": false,    "ignore_images": false,    "ignore_tables": false,    "remove_conclusion_phrases": false,    "images_as_markdown": true,    "parse_contacts": false}'   
```

### Parse Signature Response[](https://developer.nylas.com/docs/intelligence/signature-extraction/#parse-signature-response)

Some of the fields returned are:

-   **body** - The body of the email message the signature came from.
-   **signature** - The parsed signature information. Extra HTML and images are removed.
-   **model\_version** - Version of the model parsing out the signature.
-   **contacts** - Returns a contact object if `parse_contacts:true`.

-   Signature Extraction
-   Signature Extraction Parse Contacts False

```
[    {        "account_id": "5tgncdmczat02216u7d6uypyi",        "bcc": [],        "body": "......"            {                "email": "swag@example.com",                "name": "example Swag"            }        ],        "contacts": {            "job_titles": [                "Director of Engineering"            ],            "links": [                {                    "description": "Albert Einstein",                    "url": "https://www.example.com/"                }            ],            "phone_numbers": [                "123-456-8901"            ],            "emails":["al.einstein@physics.com"],            "names":[              {                "first_name":"Albert",                 "last_name": "Einstein"              }            ],        },        "date": 11234567890,        "events": [],        "files": [],        "from": [            {                "email": "albert.einstein@example.com",                "name": "Albert Einstein"            }        ],        "id": "b2l4g9qk0k85mx5dqm1q9sse8",        "labels": [            {                "display_name": "Important",                "id": "c2ig7rwrpethf9bqoaq7tnerm",                "name": "important"            },            {                "display_name": "Inbox",                "id": "cgf6uw9mvagi1fibv67kgz7z",                "name": "inbox"            }        ],        "model_version": "0.0.1",        "object": "message",        "reply_to": [],        "signature": "Best Regards,\n\nAlbert\n\nAlbert Einstein\n\nDirector of Engineering\n\nPhone: +1.234.567.8901\n\nSkype: AlbertEinstein  \n\nParticle Technologies™",        "snippet": "Hi Nylas, Thanks for reaching out. I look forward to working with you in the future.",        "starred": false,        "subject": "Welcome To Nylas",        "thread_id": "9x4ymoysw7p0pwabpkbt1o0ql",        "to": [            {                "email": "swag@nylas.com",                "name": "Nylas Swag"            }        ],        "unread": false    }]   
```

```
[    {        "account_id": "**********",        "bcc": [],        "body": "<div dir=\"ltr\">Welcome&nbsp;to Nylas! Visit us at <a href=\"https://nylas.com\">nylas.com</a>.<br><br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\"><div dir=\"ltr\"><br><table style=\"border:none;border-collapse:collapse\"><colgroup><col width=\"84\"><col width=\"540\"></colgroup><tbody><tr style=\"height:79pt\"><td style=\"vertical-align:top;padding:5pt;overflow:hidden\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt\"><a href=\"https://www.nylas.com/\" target=\"_blank\"><span style=\"font-size:11pt;font-family:Arial;color:rgb(17,85,204);background-color:transparent;vertical-align:baseline;white-space:pre-wrap\"><span style=\"border:none;display:inline-block;overflow:hidden;width:70px;height:70px\"><img src=\"https://lh6.googleusercontent.com/zJp7cuIKWhNYHc6KsuHUsfrhyCp9DKxg243bjSLP9JKi9SEX-uMtTAr5qy54Kdlr3RNkTwAEvIDHKBCjodqu8uVLLbReY47_-KtRilUatWsZRRfO2LH9ZTCykLEVBOj8iJ7XmNeX\" width=\"70\" height=\"70\" style=\"margin-left:0px;margin-top:0px\"></span></span></a></p></td><td style=\"vertical-align:top;padding:5pt;overflow:hidden\"><p dir=\"ltr\" style=\"line-height:1.8;margin-top:0pt;margin-bottom:0pt\"><span style=\"font-size:10pt;font-family:&quot;Source Sans Pro&quot;,sans-serif;color:rgb(0,0,0);background-color:transparent;font-weight:700;vertical-align:baseline;white-space:pre-wrap\">Nylas Product Team</span></p><p dir=\"ltr\" style=\"line-height:1.38;margin-top:0pt;margin-bottom:0pt\"><span style=\"font-size:8pt;font-family:&quot;Source Sans Pro&quot;,sans-serif;color:rgb(0,0,0);background-color:transparent;vertical-align:baseline;white-space:pre-wrap\">Nylas Team, </span><a href=\"https://www.nylas.com/\" target=\"_blank\"><span style=\"font-size:8pt;font-family:&quot;Source Sans Pro&quot;,sans-serif;color:rgb(0,0,0);background-color:transparent;vertical-align:baseline;white-space:pre-wrap\">Nylas</span></a></p><p dir=\"ltr\" style=\"line-height:1.38;margin-top:0pt;margin-bottom:0pt\"><span style=\"font-size:8pt;font-family:&quot;Source Sans Pro&quot;,sans-serif;color:rgb(0,0,0);background-color:transparent;vertical-align:baseline;white-space:pre-wrap\"><a href=\"mailto:swag@nylas.com\" target=\"_blank\">swag@nylas.com</a></span></p></td></tr><tr style=\"height:63pt\"><td colspan=\"2\" style=\"vertical-align:top;padding:5pt;overflow:hidden\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt\"><a href=\"https://www.nylas.com/resources/savings-calculator-integrations/\" target=\"_blank\"><span style=\"font-size:11pt;font-family:Arial;color:rgb(17,85,204);background-color:transparent;vertical-align:baseline;white-space:pre-wrap\"><span style=\"border:none;display:inline-block;overflow:hidden;width:306px;height:45px\"><img src=\"https://lh3.googleusercontent.com/bTFwY25C4D9lD4GJHxsVEWr8--YG25chLhjDJb3rWpmXPw5RngwZHUWhbDracmaXL7n6mtt5JPM9egiGaFwU2bNKMrvMcctgvrHFOI7YxIzze7CTKKVJRqD8kq2hNUE2IJiPWFmL\" width=\"306\" height=\"45\" style=\"margin-left:0px;margin-top:0px\"></span></span></a></p></td></tr></tbody></table></div></div></div>",        "cc": [],        "date": 1608244897,        "events": [],        "files": [],        "from": [            {                "email": "carver@agritech.com",                "name": "George Washington Carver"            }        ],        "id": "177hfdrslcgl6x1srf3d3arez",        "labels": [            {                "display_name": "Important",                "id": "c2ig7rwrpethf9bqoaq7tnerm",                "name": "important"            },            {                "display_name": "Inbox",                "id": "cgf6uw9mvagi1fibv67kgz7z",                "name": "inbox"            }        ],        "model_version": "0.0.1",        "object": "message",        "reply_to": [],        "signature": "\\--  \n\n[![](https://lh6.googleusercontent.com/zJp7cuIKWhNYHc6KsuHUsfrhyCp9DKxg243bjSLP9JKi9SEX-\nuMtTAr5qy54Kdlr3RNkTwAEvIDHKBCjodqu8uVLLbReY47_-KtRilUatWsZRRfO2LH9ZTCykLEVBOj8iJ7XmNeX)](https://www.nylas.com/)\n\n|\n\nNylas Product Team\n\nNylas Team, [Nylas](https://www.nylas.com/)\n\n[swag@nylas.com](mailto:swag@nylas.com)  ",        "snippet": "Welcome to Nylas! Visit us at nylas.com. -- Nylas Product TeamNylas Team, Nylasswag@nylas.com",        "starred": false,        "subject": "Welcome to Nylas!",        "thread_id": "bhqzyakvpbepbn04lhnkj6rki",        "to": [            {                "email": "dorothy@spacetech.com",                "name": "Dorothy Vaughan"            }        ],        "unread": true    }]   
```

**What the signature was extracted from.**

![Signature Extraction Example](https://developer.nylas.com/_images/signature-extraction-example.png "Signature Extraction Example")

## Signature Feedback[](https://developer.nylas.com/docs/intelligence/signature-extraction/#signature-feedback)

If a signature was parsed up in the way you didn’t expect, you can send us feedback using the `/neural/signature/feedback` endpoint. We will use this data to retrain our model for better results in the future.

Send a POST request to `/neural/signature/feedback` with the request body:

-   **message\_id** - ID of the message you want to give feedback on.

### Signature Feedback Request[](https://developer.nylas.com/docs/intelligence/signature-extraction/#signature-feedback-request)

```
curl --location --request POST 'https://api.nylas.com/neural/signature/feedback' \--header 'Accept: application/json' \--header 'Content-Type: application/json' \--header 'Authorization: Bearer <access_token>' \--data-raw '{    "message_id":"<meesage_ID>"}'   
```

## Signature Feedback Response[](https://developer.nylas.com/docs/intelligence/signature-extraction/#signature-feedback-response)

The response includes:

-   **model\_version** - Version of the model parsing out the conversation.
-   **message\_id** - ID of the message that was not parsed correctly.
-   **feedback\_at** - Unix time feedback about the message was most recently given.

```
{  "model_version": "av45hcbkka",  "message_id": "812yzs4goqf4sl4ofswvalt4u",  "feedback_at": "1607537180", }   
```

## Keep in Mind[](https://developer.nylas.com/docs/intelligence/signature-extraction/#keep-in-mind)

-   Only English is supported.
-   No SDK support.
-   Job Status and Webhooks are not available.

## What's Next?[](https://developer.nylas.com/docs/intelligence/signature-extraction/#whats-next)

-   [Signature Extraction Reference](https://developer.nylas.com/docs/api/#put/neural/signature)
-   [Signature Extraction Feedback Reference](https://developer.nylas.com/docs/api/#post/neural/signature/feedback)