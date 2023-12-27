---
type: page
title: OneLogin SAML Setup
listed: true
slug: onelogin-saml-setup
description: 
index_title: OneLogin SAML Setup
hidden: 
---published

<table _ngcontent-elb-c103=""><tbody _ngcontent-elb-c103=""><tr _ngcontent-elb-c103=""><th _ngcontent-elb-c103="" rowspan="2"></th><td _ngcontent-elb-c103=""></td></tr><tr _ngcontent-elb-c103=""><td _ngcontent-elb-c103=""><p>This feature is only available for customers on an Enterprise plan, and is restricted to <strong>Owner</strong> and <strong>Admin</strong> user roles. Please contact your Customer Support Manager or <a href="mailto:support@mezmo.com">support@mezmo.com</a> for more information.</p></td></tr></tbody></table> d

## Step 1: Get Your Mezmo Single Sign On URL

1. In your Mezmo app go to [**Settings &gt; Organization &gt; Security**](https://app.Mezmo.com/manage/team-settings).
2. Go to **SAML Configuration** and copy the URL under **URL for the Single Sign On Service to Consume**.
3. Keep this URL available since it will be used in [Step 2: Configure OneLogin](#step-2-configure-onelogin).

## Step 2: Configure OneLogin

1. Log in to your instance of OneLogin.
2. Go to **Applications &gt; Applications**. Then click **Add App**.
3. In the search box, search for `SAML Custom Connector`. Select `SAML Customer Connector (Advanced)`.

![Look for SAML Custom Connector in the search for OneLogin.](https://uploads.developerhub.io/prod/2KW7/pflszxklyj3jbn6fjiv9ra3xxvf7n379khu5ewoiei1w7300fhng4l3v1kqrhit7.png) d

4. Give the connector a name and then Save.
5. Select configuration from the menu in OneLogin.
6. Enter the Mezmo Single Sign On Service to Consume URL from [Step 1: Get Your Mezmo Single Sign On URL](#step-1-get-your-mezmo-single-sign-on-url), into `ACS (Consumer) URL Validator` and `ACS (Consumer) URL`.
7. Select **SSO** from the left menu.
8. Make sure the **SAML Signature Algorithm** is SHA-256 in the dropdown.

![Look for SAML Custom Connector in the search for OneLogin.](https://uploads.developerhub.io/prod/2KW7/pflszxklyj3jbn6fjiv9ra3xxvf7n379khu5ewoiei1w7300fhng4l3v1kqrhit7.png)


![Select SHA-256 from the dropdown in Okta.](https://uploads.developerhub.io/prod/2KW7/sysbkd291nwu8n3oo8j7swefyxank4jqghp6nyt7ef24azu657i533tdn62tez4c.jpg)


## Step 3: SAML Configuration

1. In OneLogin, go to the **SSO** tab.
2. In the **More Actions** dropdown, select **SAML Metadata**. An XML file will download.
3. In your Mezmo app, go to **Settings &gt; Organization &gt; Security**.
4. Toggle **SAML Sign-in** to on.
5. In **SAML Configuration** upload the XML file downloaded.
6. Save and your OneLogin SSO is ready to go.