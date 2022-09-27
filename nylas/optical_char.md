## Optical Character Recognition Guide

With Nylas, you can parse the data from email attachments without needing to download the attachment. Nylas uses Optical character recognition(OCR) to pull the data from email attachments and return the data as text.

## How to Process Files[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#how-to-process-files)

Files need to be attached to a [message](https://developer.nylas.com/docs/api/#tag--Messages). You are not able to upload attachments for processing.

1.  Get the ID of a file from a message using [/files](https://developer.nylas.com/docs/api/#get/files).
2.  Send a PUT request to `/neural/ocr.`

### OCR Request[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#ocr-request)

-   **file\_id** - The ID of the [file](https://developer.nylas.com/docs/api/#get/files) you want to parse the content from. The file must be attached to a [message](https://developer.nylas.com/docs/api/#tag--Messages). By default, OCR will work on the first 5 pages and can only work on 5 pages at a time.
-   **pages** - Specify which 5 pages to run OCR on. This is optional.

```
curl --location --request PUT 'https://api.nylas.com/neural/ocr' \--header 'Authorization: Bearer <access_token>' \--header 'Content-Type: application/json' \--data-raw '{    "file_id": "*******",    "pages": [1,3,5,6,7]}'   
```

**Page Limit**

OCR has a limit of 5 pages per request.

### OCR Response[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#ocr-response)

The response includes:

-   **account\_id** - ID of the account the message came from.
-   **content\_type** - Content-type of the file. Currently available [content types](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#content-types).
-   **filename** - Name of the file attachment.
-   **id** - IDs of the messages the file is attached to.
-   **object** - Always file.
-   **ocr** - The parsed file attachment returned as text.
-   **size** - Size of the file, in bytes.

```
{  "account_id": "*******",  "content_id": "<f_kiubrkoa0>",  "content_type": "application/pdf",  "filename": "intelligent-workflow-automations-coming-to-the-nylas-platform.pdf",  "id": "*******",  "message_ids": [      "*******"  ],  "object": "file",  "ocr": [      "Nylas\nINTELLIGENT WORKFLOW AUTOMATIONS COMING TO THE\nNYLAS PLATFORM\nPosted on December 7, 2020 by Matt Harper\nOutbox Endpoint\nCategorier\nEmail Parse\nOCR\nEntity Recognition\nSignature Detection\nPlatform updates help developers quickly and securely build new productivity features for their end-users.\nToday, we are proud to announce several updates to the Nylas platform. These additions further our mission of\nproviding Productivity Infrastructure solutions to help developers across industries boost their end-users'\nproductivity.\nAs part of our Early Access program, Nylas customers can begin integrating new, Al-powered workflow\nautomations triggered by the communications data contained in users' inboxes, calendars, and contacts, and\nextracted by the core Nylas' APIs.\nHere is just a handful of the new capabilities you can expect to be building with in the coming weeks:\nPage: 1\n",      "Nylas\nOutbox\nEnable your users to schedule and send large numbers of emails with near-perfect deliverability rates and full\nCRUD (Create, Read, Update, Delete) capabilities. With the Outbox endpoint, you can now eliminate error\nmessages and navigate deliverability issues that plague many sales and marketing automation platforms.\nCategorizer\nCategorizer declutters your users' overcrowded inboxes so they can read and respond to the most important\nmessages first. Categorizer automatically differentiates human communications from machine-to-human\ncommunications to channel spam emails, newsletters, and more to a separate folder. You can also set up\ncustom categories for your users' specific needs, like categories for internal group projects, external candidate\nemails, prospect emails, and more.\nEmail Parse\nEmail contains essential business communications, but it can be challenging for your users to navigate\nconversations as email threads grow. Company logos, nested responses, legal language, and other elements\nclutter emails and create significant problems for developers looking to integrate important email data into\ntheir applications. Email Parse allows you to quickly clean up emails and provide critical communications to\nyour users within your application without the standard inbox clutter.\nOCR\nOptical Character Recognition automatically reads and extracts key information from unstructured data\nsources like PDFs, images, and attachments so that you can enter it directly into your application (and sync\nwith other third-party systems).\nPage: 2\n",      "Nylas\nEntity Recognition\nEntity Recognition detects specific words within emails and subject lines — such as times, dates, and SKU\nnumbers – so that you can trigger powerful workflows in your application.\nSignature Detection\nSignature detection finds key information in email signatures so you can automatically enrich your users'\ncontact database. Automatically keep email addresses, phone numbers, job titles, and profile photos up to date\nfor your users – no manual work required.\nWorkflow Templates\nNylas can help you automate entire business processes with a single endpoint. For instance, a user in recruiting\ncan now send a templated email response to a candidate and schedule an interview with all the correct\nparticipants with just one-click in an Applicant Tracking System.\nToday, there are over 50,000 developers around the world using the Nylas platform to build productivity\nfeatures in their applications. Our focus is to help you quickly compose entirely new solutions that leverage the\npower of your users' communications data while avoiding the cost and complexity of building your own\nintegrations, workflows, and security features.\nIf you'd like to learn more about what you can build with these new capabilities, I invite you to please set up a\ntime with a Nylas platform specialist who can help you get started.\nPage: 3\n",      "Nylas\nAbout the Author\nPage: 4\n"  ],  "size": 192584}   
```

**See an example of the message before OCR.**

[Intelligent Workflow Automations Coming to the Nylas Platform](https://www.nylas.com/blog/nylas-intelligent-platform-announcement?print-posts=pdf&mkt_tok=eyJpIjoiWmpNNVptVXlOak16WmpNeiIsInQiOiJod0tMaVIxbHFzWHlDUFR6SVFFSCtBTGdYcjNKb004Z0szNEFoSmdUM3N3ajZ0SWxLUWNXeERocUtwZWd0b1BCYURXd1RDd25ucFVxUHNtUkJ0anRnOHZhM3RMa0xrMEJGQzhUXC9DeFZoYWtzcEFMSGY3TmVUanN0TXcrNURISU0ifQ%3D%3D "@embed")

## OCR Feedback[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#ocr-feedback)

You can help Nylas train it’s model by providing feedback about the text.

### OCR Feedback Request[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#ocr-feedback-request)

-   **file\_id** - ID of the file you want to give feedback on.

```
curl --location --request PUT 'https://api.nylas.com/neural/ocr/feedback' \--header 'Accept: application/json' \--header 'Content-Type: application/json' \--header 'Authorization: Bearer <access_token>' \--data-raw '{    "file_id":"<file_id>"}'   
```

### OCR Feedback Response[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#ocr-feedback-response)

Returns a 200 OK.

## Content Types[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#content-types)

OCR supports the following content types:

-   .pdf - application/pdf
-   .tif- image/tiff
-   .tif - image/x-tiff
-   .tiff - image/tiff
-   .tiff - image/x-tiff
-   .gif - image/gif

## Keep in Mind[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#keep-in-mind)

-   PDF, GIF, and TIFF file types are supported.
-   You can parse up to 5 pages at a time OR you can parse the first 5 pages of a file.
-   The file size is limited to 20 MB.
-   The request may take a few seconds to return a response.
-   No SDK support.
-   Job Status and Webhooks are not available.

## What's Next?[](https://developer.nylas.com/docs/intelligence/optical-character-recognition/#whats-next)

-   [OCR Reference](https://developer.nylas.com/docs/api/#put/neural/ocr)
-   [OCR Feedback Reference](https://developer.nylas.com/docs/api/#post/neural/ocr/feedback)