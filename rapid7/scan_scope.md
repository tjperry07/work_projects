# How to Use Scan Scope

You can use scan scope to decide which URLs are attacked or crawled. You can set the app level URLs within the app or set the scan config URLs from within the scan config.

## Set app-level scan scope

You create the app-level scan scope when you add an app. Go to **Apps** and click **Add App > Target Domains**.

![InsightAppSec Add New App](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_new_app_target_domain_2020_06_08.png)

The URLs specified for the app are added in Target Domains. These URLs make up the seed URLs for a scan. Any scans on an app will use the app-level URLs as seed URLs.

## App scan scope behavior

When you add an app-level URL, default [crawling](https://docs.rapid7.com/insightappsec/scan-scope#crawling-restrictions) and [attack restrictions](https://docs.rapid7.com/insightappsec/scan-scope#attack-restrictions) are added. A wildcard is added after the domain URL.

The wildcard is added to the top level domain.

-   **App URL** - http://[domain.com](http://domain.com/) or https://[domain.com](http://domain.com/)
    
-   **Crawling and Attack Restrictions** - http://[domain.com/\*](http://domain.com/*) or https://[domain.com/\*](http://domain.com/*)
    
-   **App URL** - http://[domain.com/subdir/](http://domain.com/subdir/) or https://[domain.com/subdir/](http://domain.com/subdir/)
    
-   **Crawling and Attack Restrictions** - http://[domain.com/\*](http://domain.com/*) or https://[domain.com/\*](http://domain.com/*)
    
-   **App URL** - http://[domain.com/virdir](http://domain.com/virdir) or https://[domain.com/virdir](http://domain.com/virdir)
    
-   **Crawling and Attack Restrictions** - http://[domain.com/\*](http://domain.com/*) or https://[domain.com/\*](http://domain.com/*)
    
-   **App URL** - http://[domain.com/index.html](http://domain.com/index.html) or https://[domain.com/index.html](http://domain.com/index.html)
    
-   **Crawling and Attack Restrictions** - http://[domain.com/\*](http://domain.com/*) or https://[domain.com/\*](http://domain.com/*)
    

## Set scan config scan scope

You can establish additional scan URLs for each app. Go to **Scan Scope** and click **Scan URLs**.

![InsightAppSec Scan Scope URLs](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_scan_urls_2020_06_08.png)

-   **App URLs** - The URLs that were set when the app was created. Any scans run from the App will use the App URLs as the seed or base URL.
-   **Scan Config URLs** - Add more seed URLs that only apply to this config. You can choose a protocol (HTTP or HTTPS), subdomain (such as www or api), and sub-pages. You can add one URL at a time or type in a list of URLs.

## Scan scope inheritance

The way you set up your scan determines how seed URLs are inherited.

Example 1

-   **App level** - Include http://[domain.com/\*](http://domain.com/*)
-   **Scan Config level** - Exclude http://[domain.com/\*](http://domain.com/*)

The scan config level will override the app level URL.

Example 2

-   **App level** - Include http://[domain.com/](http://domain.com/*)\*
-   **Scan Config level** - Exclude http://[domain.com/](http://domain.com/*)login.php

The scan will ignore http://[domain.com/](http://domain.com/*)login.php

## Scan scope configuration example

In this section, we cover different app-level and scan-level configurations along with the expected behavior for each configuration.

### Crawl 2 pages

Use this configuration if you only need to crawl 2 pages in your app.

For example:

-   [http://webscantest.com/index.html](http://webscantest.com/index.html)
-   [http://webscantest.com/privacy.php](http://webscantest.com/privacy.php)

1.  Create your app with your URL.

![InsightAppSec Add New App](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_add_new_app_2020_06_08.png)

2.  Go to **Scan Scope > Scan URLs** and add your target URLs.

![InsightAppSec Scan Scope Configure URLs](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scna_scope_scan_config_urls_2020_06_08.png)

3.  Go to the **Crawling Restrictions** tab and exclude all site URLs using a wildcard, then add each page your want to scan.

For example:

-   **Exclude** [http://webscantest.com/\*](http://webscantest.com/*) as Wildcard
-   **Include** [http://webscantest.com/index.html](http://webscantest.com/index.html) as Literal
-   **Include** [http://webscantest.com/privacy.php](http://webscantest.com/privacy.php) as Literal

![InsightAppSec Scan Scope Crawling Restrictions](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_crawling_privacy_2020_06_0.png)

The scan will only include the pages specified.

### Scan 2 directories

Use this configuration if you need to scan 2 directories in your app, but you only want to attack the pages in 1 directory.

For example:

-   **App** - [http://webscantest.com](http://webscantest.com/)
-   **Directories** - [http://webscantest.com/datastore/](http://webscantest.com/datastore/) and [http://webscantest.com/cors/](http://webscantest.com/cors/)

1.  Create your app with your URL.

![InsighAppSec Add New Image](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_add_new_app_2020_06_08.png)

2.  Go to **Scan Scope > Scan URLs** and add the subdirectories that you want to target.

**For example:**

-   [http://webscantest.com/datastore/](http://webscantest.com/datastore/)
-   [http://webscantest.com/cors/](http://webscantest.com/cors/)

![InsighAppSec Scan Scope URLs](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_scan_urls_datastore_2020_06_08.png)

3.  Click the **Crawl Restrictions** tab and add your 3 restrictions. One should **exclude** the site with a wildcard, while 2 should **include** the subdirectories to scan with a wildcard.

For example:

-   **Exclude** [http://webscantest.com/\*](http://webscantest.com/*) as Wildcard
-   **Include** [http://webscantest.com/datastore/\*](http://webscantest.com/datastore/*) as Wildcard
-   **Include** [http://webscantest.com/cors/\*](http://webscantest.com/cors/*) as Wildcard

![InsightAppSec Scan Scope Crawling](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_crawling_2020_06_08.png)

4.  Click the **Attack Restrictions** tab and add 3 new constraints. This is where you will only attack the pages in one directory. One will **include** the subdirectory to attack, the other 2 will exclude the site and other subdirectory.

**For example:**

-   **Exclude** [http://webscantest.com/\*](http://webscantest.com/*) as WILDCARD
-   **Include** [http://webscantest.com/datastore/\*](http://webscantest.com/datastore/*) as WILDCARD
-   **Exclude** [http://webscantest.com/cors/\*](http://webscantest.com/cors/*) as WILDCARD

![Insight AppSec Scan Scope Attack](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_attack_restrictions_2020_06_08.png)

5.  Run your scan.

Only the pages included in the Attack Restrictions will be attacked, but both subdirectories will be crawled.

### Scan you app and restrict 1 directory from attacks

Use this configuration if you need to scan your app, but want to restrict a directory from attacks.

1.  Create your app with your URL.

For example:

-   [http://webscantest.com](http://webscantest.com/)

![InsightAppSec Add New App](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_add_new_app_2020_06_08.png)

2.  Go to **Scan Scope > Scan URLs** and add the subdirectories that you want to target.

![InsightAppSec Scan Scope Scan URLs](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_scan_urls_datastore_2020_06_08.png)

3.  Click the **Attack Restrictions** tab and one new constraint that excludes your directory with a wildcard and includes the app URL as a wildcard.

For example:

-   **Exclude** [http://webscantest.com/cors/\*](http://webscantest.com/cors/*) as Wildcard
-   **Include** [http://webscantest.com/](http://webscantest.com/cors/*) as Wildcard

![InsightAppSec Scan Scope Attack CORS](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec_scan_scope_attack_cors_2020_06_08.png)

4.  Run your scan.

The whole site will be crawled, but pages within the CORS directory will not be attacked.