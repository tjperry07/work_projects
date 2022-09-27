## BigQuery

Google BigQuery is a data cloud platform designed to simplify building and managing data warehouse solutions.

You'll learn how to add [BigQuery](https://cloud.google.com/bigquery/docs/introduction) as a Nylas Streams.

## Prerequisites[](https://developer.nylas.com/docs/streams/big-query/#prerequisites)

Before you begin, you need to create an integration and grants. Depending on your data needs, review the options below.

-   [Google app](https://developer.nylas.com/docs/streams/google-app/), if you want to stream messages or grants from Google connected accounts.
-   [Azure app](https://developer.nylas.com/docs/streams/azure-app/), if you want to stream messages or grants from Microsoft connected accounts.
-   [Zoom app](https://developer.nylas.com/docs/streams/zoom-transcripts/), if you want to stream meeting transcripts from your connected Zoom accounts.

## Create a Service Account[](https://developer.nylas.com/docs/streams/big-query/#create-a-service-account)

Create a service account to use with BigQuery.

1.  Go to **IAM & Admin > Service Accounts**, then click **Create Service account**.
2.  Fill out the **Service account details** section. This can be anything you want.
3.  You can skip, Grant this service account access to project and Grant users access to this service account.
4.  Keep track service account email, you'll need this in [Create a BigQuery dataset](https://developer.nylas.com/docs/streams/big-query/#create-the-bigquery-dataset).
5.  Now, you need to create a new key. Click **Actions > Manage keys**.
6.  Click **Add key > Create new key**.
7.  Choose JSON. The key will automatically download. Keep this safe. You'll need it in the [Create a BigQuery stream](https://developer.nylas.com/docs/streams/big-query/#create-a-bigquery-stream) step.

![Google console showing the Create service account page](https://developer.nylas.com/_images/google/google_service_account_create.png)

## Create the BigQuery Dataset[](https://developer.nylas.com/docs/streams/big-query/#create-the-bigquery-dataset)

We've created a script that will set up the dataset, tables, and permissions.

1.  Go to [BigQuery](https://console.cloud.google.com/bigquery) in Google Console.
2.  Run the following script to set up BigQuery for Nylas Streams.
    1.  Replace `your_service_account` with your own service account email created in [Create a BigQuery Dataset](https://developer.nylas.com/docs/streams/big-query/#create-the-bigquery-dataset). For example, `sa-for-nylas-streams-bigquery@iam.gserviceaccount.com`.
    2.  **Do not change** the dataset name or table names. Otherwise, your Stream will not work.

**Do not change the dataset name or table names!**

Only edit the service account email.

```
-- create datasetcreate schema if not exists data_streams;-- create three tablescreate table if not exists data_streams.message (    id string,    grant_id string,    subject string,    body string,    thread_id string,    received_at timestamp,    _synced_at timestamp);create table if not exists data_streams.participant(    message_id string,    type string,    name string,    email string,    _synced_at timestamp  );create table if not exists data_streams.nylas_test(    test_data string  ,    _synced_at timestamp  );-- grant proper access to the dataset and tablesgrant `roles/bigquery.dataEditor`on schema data_streams to "serviceAccount:your_service_account";grant `roles/bigquery.dataEditor`on table data_streams.messageTO "serviceAccount:your_service_account";grant `roles/bigquery.dataEditor`on table data_streams.participantTO "serviceAccount:your_service_account";grant `roles/bigquery.dataEditor`on table data_streams.nylas_testTO "serviceAccount:your_service_account";   
```

![BigQuery console showing the completed script and code pasted in.](https://developer.nylas.com/_images/google/google_bigquery_script_completed.png)

## Create a BigQuery Stream[](https://developer.nylas.com/docs/streams/big-query/#create-a-bigquery-stream)

You'll connect your BigQuery data to Nylas.

1.  Select **Streams** > **Create new Stream**. On the next screen, select **BigQuery**.
2.  Choose your data source.
3.  Enter the following information:
    1.  Give your Stream a name.
    2.  Enter the Google Project ID. You can find the ID under Project info on the Google Console dashboard.
    3.  Copy and paste the service account JSON from [Create a Service Account](https://developer.nylas.com/docs/streams/big-query/#create-a-service-account) into Big Query Service Account Credentials.
    4.  Your dataset name is `data_streams`. This must match the schema name and can not be changed.
4.  Create your Stream. It will take a few minutes for the Stream to activate.

## Test Your Integration[](https://developer.nylas.com/docs/streams/big-query/#test-your-integration)

Make sure you're able to receive data.

### Message[](https://developer.nylas.com/docs/streams/big-query/#message)

If you selected `message.create` as your data source, create a new email message.

### Grants[](https://developer.nylas.com/docs/streams/big-query/#grants)

If you selected grants as your data source, you’ll get notifications when a grant expires or when an account is granted access to an Integration.

![BigQuery showing a successful test message.](https://developer.nylas.com/_images/streams/bigquery_success_message.png)

## Troubleshooting[](https://developer.nylas.com/docs/streams/big-query/#troubleshooting)

### Streaming insert is not allowed on the free tier[](https://developer.nylas.com/docs/streams/big-query/#streaming-insert-is-not-allowed-on-the-free-tier)

If you try to set up a Stream on a free trial, Google will return an access denied. A billing account is required with a payment method to use streams.

![Nylas dashboard returning the error: Streaming insert is not allowed on the free tier](https://developer.nylas.com/_images/streams/bigquery_streaming_free_tier.png)

### Stream creation failed; Dataset notFound[](https://developer.nylas.com/docs/streams/big-query/#stream-creation-failed;-dataset-notfound)

The **BigQuery dataset name** in the dashboard must be `data_streams`.

![Nylas dashboard returning the error:  Stream creation failed; Dataset notFound](https://developer.nylas.com/_images/streams/bigquery_dataset_not_found.png)

### Stream creation failed; Invalid dataset name[](https://developer.nylas.com/docs/streams/big-query/#stream-creation-failed;-invalid-dataset-name)

The **BigQuery dataset name** in the dashboard must be `data_streams`.

![Nylas dashboard returning the error:  Stream creation failed; Invalid dataset name](https://developer.nylas.com/_images/streams/bigquery_invalid_dataset_name.png)

### Invalid value: IAM setPolicy failed for Table[](https://developer.nylas.com/docs/streams/big-query/#invalid-value-iam-setpolicy-failed-for-table)

When replacing `your_service_account` with the service account email, remove any spaces between `serviceAccount:` and `your_service_account`. For example, `TO "serviceAccount:your_service_account";`

![BigQuery console retuning the error: Invalid value: IAM setPolicy failed for Table](https://developer.nylas.com/_images/streams/error_running_query_policy_failed.png)