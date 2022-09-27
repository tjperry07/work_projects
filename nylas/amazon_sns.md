## Amazon SNS

Amazon Simple Notification Service (Amazon SNS) is a managed messaging service that supports pub/sub messaging and mobile push notifications.

You’ll learn how to add [Amazon SNS](https://aws.amazon.com/sns/) as a Nylas Stream.

## Prerequisites[](https://developer.nylas.com/docs/streams/amazon-sns/#prerequisites)

Before you begin, you need to create an integration and grants. Depending on your data needs, review the options below.

-   [Google app](https://developer.nylas.com/docs/streams/google-app/), if you want to stream messages or grants from Google connected accounts.
-   [Azure app](https://developer.nylas.com/docs/streams/azure-app/), if you want to stream messages or grants from Microsoft connected accounts.
-   [Zoom app](https://developer.nylas.com/docs/streams/zoom-transcripts/), if you want to stream meeting transcripts from your connected Zoom accounts.

## Create a New Connector[](https://developer.nylas.com/docs/streams/amazon-sns/#create-a-new-connector)

**Set up tip**

Keep your dashboard open because you'll be frequently referring to the information there.

1.  Go to the Nylas dashboard and select Streams.
2.  Select **Amazon SNS**.
3.  Choose your data source.
4.  Keep your dashboard open, we'll move onto the next steps and let you know when you need to refer to the dashboard and when to enter information.

## Create SNS Topic[](https://developer.nylas.com/docs/streams/amazon-sns/#create-sns-topic)

1.  Go through the steps in [Creating an Amazon SNS topic](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html).
    1.  We recommend topic type to be Standard.
2.  Keep your Topic ARN ready, you’ll need this in [Create IAM Role](https://developer.nylas.com/docs/streams/amazon-sns/#create-iam-role).
3.  Copy the Topic ARN into your dashboard into **Destination ARN**.

![Image of Amazon SNS Topic ARN page.](https://developer.nylas.com/_images/streams/topic_create.png)

## Create an S3 Bucket (Optional)[](https://developer.nylas.com/docs/streams/amazon-sns/#create-an-s3-bucket-optional)

Create an S3 bucket to stream data that is larger than 256 KB. By default, the AWS SNS Connector will skip publishing data objects larger than 256 KB.

1.  Go to Amazon S3 and create a new bucket.
2.  Select the bucket and click Copy ARN.
3.  Copy the ARN into the dashboard and save the S3 ARN for [Create IAM Role](https://developer.nylas.com/docs/streams/amazon-sns/#create-iam-role).

![Image showing Amazon console with Topic screen](https://developer.nylas.com/_images/streams/topic_create.png)

## Create IAM Role[](https://developer.nylas.com/docs/streams/amazon-sns/#create-iam-role)

You’ll need to create an [IAM Role](https://docs.aws.amazon.com/sns/latest/dg/sns-using-identity-based-policies.html) that gives Nylas access to write to your [SNS topic](https://developer.nylas.com/docs/streams/amazon-sns/#create-sns-topic) and your [S3 bucket](https://developer.nylas.com/docs/streams/amazon-sns/#create-an-s3-bucket-optional). You’ll be creating a new role and policy.

1.  Go to [IAM](https://console.aws.amazon.com/iamv2/home).
    
2.  Go to **Access management > Roles**.
    
3.  Select **Another AWS account**.
    
    1.  **Account ID** - 925176737378
    2.  Select **Require external ID (Best practice when a third party will assume this role)**
    3.  In your dashboard, copy the **External ID** and add it as the External ID into AWS console.
    
    ![Image showing Amazon console create a new role screen](https://developer.nylas.com/_images/streams/external_id.png)
4.  On the next screen, click **Create policy**. This will open a new window or tab. You’ll need to keep both the **Create role** and **Create policy** windows open.
    
5.  Select JSON. Depending on if you are using S3 or not, copy the JSON for your policy. Modify the highlighted items with `<YOUR-TOPIC-ARN>` and `<YOUR-S3-BUCKET-ARN>`.
    
    -   Did not set up S3 bucket
    -   Set up S3 bucket
    
    ```
    {    "Version": "2012-10-17",    "Statement": [        {            "Sid": "VisualEditor0",            "Effect": "Allow",            "Action": "sns:Publish",            "Resource": "<YOUR-TOPIC-ARN>"         }    ]}   
    ```
    
    ```
    {  "Version": "2012-10-17",  "Statement": [{    "Sid": "VisualEditor0",    "Effect": "Allow",    "Action": [      "s3:*Object*",      "sns:Publish"    ],    "Resource": [      "<YOUR-S3-BUCKET-ARN>/*",      "<YOUR-TOPIC-ARN>"    ]  }]}   
    ```
    
6.  Name the policy **nylas-streams-write-policy** and save.
    
7.  Go back to the **Create role** window and click refresh.
    
8.  Search for **nylas-streams-write-policy** and select the policy.
    
9.  Name the role **nylas-streams-write-role** and create the role.
    
10.  Copy the role ARN, and add it your dashboard in **IAM Role ARN**.
    
11.  You can save your Nylas Stream.
    
12.  It will take a few minutes for the Stream to activate.
    

## Test Your Stream[](https://developer.nylas.com/docs/streams/amazon-sns/#test-your-stream)

To test for receiving data, setup a subscription in AWS that's listening to the configured SNS topic. View the link below for more about the Amazon configuration.

-   [Subscribing to an Amazon SNS topic](https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html)

The sections below detail pulling new messages using SQS.

### Poll for New Messages[](https://developer.nylas.com/docs/streams/amazon-sns/#poll-for-new-messages)

1.  Go to SQS and select the queue you created for your Stream.
2.  Click **Poll for messages**

![Poll for new messages in SQS](https://developer.nylas.com/_images/streams/amazon_poll_messages.png)

### Message[](https://developer.nylas.com/docs/streams/amazon-sns/#message)

If you selected `message.create` as your data source, create a new email message.

### Grants[](https://developer.nylas.com/docs/streams/amazon-sns/#grants)

If you selected grants as your data source, you’ll get notifications when a grant expires or when an account is granted access to an Integration.