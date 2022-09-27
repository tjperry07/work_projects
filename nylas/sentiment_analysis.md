**Sentiment Analysis is in beta**.

We can't guarantee feature availability or functionality.

## Sentiment Analysis - Beta

Sentiment analysis will analyze provided text or emails and gives you an emotional opinion on the text. We’ll let you know if the writer was positive, negative, or neutral.

You can use sentiment analysis to:

-   Send surveys to customers who have a positive reaction
-   Schedule follow up calls with customers who have negative reactions
-   Keep track of the general company sentiment based on customer interactions

In this guide, you’ll learn how to analyze messages, text, and send feedback if the sentiment isn’t what you expected.

## Analyze a Message[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#analyze-a-message)

To analyze a message for sentiment, pass in a message as an array.

Only 1 message at a time can be sent.

### Sentiment Analysis Request - Message[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-request-message)

```
curl --location --request PUT 'https://api.nylas.com/neural/sentiment' \--header 'Authorization: Bearer {access_token}' \--header 'Content-Type: application/json' \--data-raw '{    "message_id": ["{message_id}"]}'   
```

### Sentiment Analysis Response - Message[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-response-message)

The response includes:

-   **sentiment** - The emotional opinion of the text. Can be positive, negative, neutral.
-   **sentiment\_score** - The score is on a scale of -1 to 1. If the score is below -0.5, it is negative. If the score is between -0.5 to 0.5 is neutral. If the score is above 0.5, it is positive.

```
[    {        "account_id": "5tgncdmczat02216u7d6uypyi",        "sentiment": "NEUTRAL",        "sentiment_score": 0.0,        "text": "When\n\nTue Apr 20, 2021 11am – 11:30am Central Time - Chicago  \n\nJoining info\n\nChanged: Join Zoom Meeting  \nus02web.zoom.us/j/12345678901 (ID: 12345678901)  \nJoin by phone(US) +1 123-456-7890  \nJoining instructions  \n\nCalendar\n\narver@agritech.com  \n\nWho\n\n•\n\nshashaank.s@nylas.com \\- organizer  \n\n•\n\narver@agritech.com  \n\nmore details »  \n\nGoing (arver@agritech.com)?   Yes \\- Maybe \\- No    more options »  \n\nInvitation from Google Calendar\n\nYou are receiving this email at the account arver@agritech.com because you\nare subscribed for updated invitations on calendar arver@agritech.com.\n\nTo stop receiving these emails, please log in to\nhttps://calendar.google.com/calendar/ and change your notification settings\nfor this calendar.\n\nForwarding this invitation could allow any recipient to send a response to the\norganizer and be added to the guest list, or invite others regardless of their\nown invitation status, or to modify your RSVP. Learn More."    }]   
```

## Analyze Text[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#analyze-text)

Sentiment analysis will also accept free-form text in a text field. You can pass in plain text or text that includes characters such as \\n, \\r, etc.

Text is restricted to 1000 characters.

### Sentiment Analysis Request - Text[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-request-text)

```
curl --location --request PUT 'https://api.nylas.com/neural/sentiment' \--header 'Authorization: Bearer {access_token}' \--header 'Content-Type: application/json' \--data-raw '{    "text": "Hi, thank you so much for reaching out! We can catch up tomorrow."}'   
```

### Sentiment Analysis Response - Text[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-response-text)

The response includes:

-   **sentiment** - The emotional opinion of the text. Can be positive, negative, neutral.
-   **sentiment\_score** - The score is on a scale of -1 to 1. If the score is below -0.5, it is negative. If the score is between -0.5 to 0.5 is neutral. If the score is above 0.5, it is positive.

```
{    "account_id": null,    "model": "sentiment-v0",    "sentiment": "POSITIVE",    "sentiment_score": 0.6000000238418579,    "text": "Hi, thank you so much for reaching out! We can catch up tomorrow."}   
```

## Sentiment Analysis Feedback[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-feedback)

If a message or text sentiment is returned in a way you didn’t expect, you can send us feedback using the `/neural/sentiment/feedback`endpoint. We will use this data to retrain our model for better results in the future.

**Feedback requires:**

-   **sentiment** - Send in the sentiment you think the text or message should be. Values are positive, negative, neutral.
-   **overwrite** - If sentiment feedback has already been sent for the text or message and you correct what you previously provided, use true. If this is new feedback for the text or message, use false. Optional, defaults to false.
    -   If you try to send feedback for a message that was already adjusted without setting overwrite: true. The API will return an error message.

**To send feedback for messages:**

```
{    "message_id": "{message_id}",    "sentiment": "NEUTRAL",    "overwrite": true}   
```

**To send feedback for text:**

```
{ "text": "Hello, How are you", "sentiment": "NEUTRAL", "overwrite": false}   
```

### Sentiment Analysis Feedback Response[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-feedback-response)

```
{    "code_version": "1.0.2",    "feedback_at": 1617335393,    "id": "fc195046788e45fde5ff2b13980730aaa2f12bc594aa6674320dcf149b4af715",    "model_version": "",    "status": "Success"}   
```

### Sentiment Analysis Feedback Response - Error[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#sentiment-analysis-feedback-response-error)

```
{    "error_message": {        "detail": {            "code_version": "1.0.2",            "created_at": 1617299281,            "id": "fc195046788e45fde5ff2b13980730aaa2f12bc594aa6674320dcf149b4af715",            "model_version": "",            "sentiment": "NEUTRAL",            "text": "Hello, How are you"        },        "error": "feedback_exists"    }}   
```

## What's Next?[](https://developer.nylas.com/docs/intelligence/sentiment-analysis/#whats-next)

-   [Sentiment Analysis Endpoint](https://developer.nylas.com/docs/api/#put/neural/sentiment)
-   [Sentiment Analysis Feedback Endpoint](https://developer.nylas.com/docs/api/#post/neural/sentiment/feedback)