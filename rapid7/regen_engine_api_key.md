# Regenerate Engine API Key

These steps cover regenerating the API key for an engine. If you are looking for the API keys to use the InsightAppSec API, see [Getting Started With the InsightAppSec API](https://docs.rapid7.com/insightappsec/api-get-started).

### Regenerating the API key for a busy engine

If you regenerate the API key for a busy engine, the engine becomes unavailable and loses any in-progress activities.

## When to generate a new engine key

A new engine key should be generated only if you think the original engine key has been compromised.

Do not generate a new engine key if you are running the installer again. Instead, create a new engine with its own API key. Each engine you create needs its own API key.

## Generate a new engine key

1.  Go to **Settings > Manage on-premises engines**.
2.  Click on the engine name you need to generate a new engine key for.
3.  Step 3 contains the API key information. From here you can generate a new engine key or copy the existing engine key.

![InsightAppSec Edit Engine](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/InsightAppSec-Edit-Egine-06-22-2020.png)

## Apply your new API key

After you regenerate your API key, you need to apply it to the engine.

1.  On the Engine host machine, open Windows Explorer and navigate to the installation location of the InsightAppSec Engine. The default location is `C:\Program Files\Rapid7\InsightAppSec`.
2.  Navigate to the `\broker\conf` folder and open the file `restclient-platform.cfg`.
3.  In the `restclient-platform.cfg` file, replace the value of the `credentials` property with the API key you regenerated. For example, `'credentials=X-API-KEY:<new-api-key>`.
4.  Repeat this process for the file `upgraderestclient-platform.cfg`.

### Update both files

Make sure to update the `restclient-platform.cfg` and `upgraderestclient-platform.cfg` with the regenerated API key.