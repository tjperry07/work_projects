## Google Pub/Sub

Google Pub/Sub is a fully managed messaging and ingestion solution for event-driven systems and streaming analytics.

You’ll learn how to add Google Pub/Sub as a Nylas Stream.

## Prerequisites[](https://developer.nylas.com/docs/streams/google-pub-sub/#prerequisites)

Before you begin, you need to create an integration and grants. Depending on your data needs, review the options below.

-   [Google app](https://developer.nylas.com/docs/streams/google-app/), if you want to stream messages or grants from Google connected accounts.
-   [Azure app](https://developer.nylas.com/docs/streams/azure-app/), if you want to stream messages or grants from Microsoft connected accounts.
-   [Zoom app](https://developer.nylas.com/docs/streams/zoom-transcripts/), if you want to stream meeting transcripts from your connected Zoom accounts.

## Create a Pub/Sub Topic[](https://developer.nylas.com/docs/streams/google-pub-sub/#create-a-pub/sub-topic)

Before you begin make sure you have Pub/Sub enabled. If you’re not able to find it in the menu, then search for Pub/Sub. Select the product and after a moment, it will be enabled.

![Google console, enable Pub/Sub](https://developer.nylas.com/_images/streams/google_pub_sub_enable.png)

1.  In your Google Console, go to Pub/Sub and create a new Topic. Give it an ID and create the topic.
2.  Create a Topic ID.
3.  Copy the project ID and enter that in your dashboard in **Google Project ID**.
4.  Copy the Topic ID and enter that in your dashboard in **Destination Topic ID**.

## Create a Service Account[](https://developer.nylas.com/docs/streams/google-pub-sub/#create-a-service-account)

You’ll need to create a service account with publish access to the Pub/Sub topic you created.

1.  Go to **IAM & Admin > Service Accounts**, then click **Create Service account**.
2.  Fill out the **Service account details** section. This can be anything you want.
3.  For the **Grant this service account access to project** section, look for the **Pub/Sub Publisher** role.
4.  You can skip, Grant users access to this service account section.
5.  Now, you need to create a new key. Click **Actions > Manage keys**.
6.  Click **Add key > Create new key**.
7.  Choose JSON. The key will automatically download. Keep this safe.
8.  Copy your key into the dashboard in the **Service Account JSON** text box.
9.  If you have an existing key, make sure the key is formatted as JSON.
10.  Create your Nylas Stream.
11.  It will take a few minutes for the Stream to activate.

## Test Your Integration[](https://developer.nylas.com/docs/streams/google-pub-sub/#test-your-integration)

Make sure you're able to receive data.

### Message[](https://developer.nylas.com/docs/streams/google-pub-sub/#message)

If you selected `message.create` as your data source, create a new email message.

### Grants[](https://developer.nylas.com/docs/streams/google-pub-sub/#grants)

If you selected grants as your data source, you’ll get notifications when a grant expires or when an account is granted access to an Integration.

![GCP events streaming](https://developer.nylas.com/_images/streams/gcp_events.png)