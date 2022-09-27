# Upgrade an On-Premises Scan EngineUpgrade an On-Premises Scan Engine

Engine upgrades include new features, expanded vulnerability coverage and bug fixes for older versions. New features can sometimes introduce new configuration options on the Insight platform, which may be incompatible with older versions of the engine. Hence, we recommend keeping your on-premises engines up-to-date.

The upgrade process will differ based on whether you have a legacy version of the engine which is not capable of automatic upgrades, or a new version which is capable of automatic upgrades.

To find out if you are running a legacy version of the engine, go to the **Settings > Manage On-Premises Engines** screen. In the “On-Premises Engines” table, find the scan engine you wish to upgrade. Check the “Auto Upgrade” column for this engine; if the “Auto Upgrade” option is grayed out you are using a legacy version of the engine.

To jump to upgrading your engine, choose one of the options below:

-   [Auto upgrade engine](https://docs.rapid7.com/insightappsec/upgrade-an-on-premises-scan-engine/#auto-upgrade-summary)
-   [Upgrade a legacy engine](https://docs.rapid7.com/insightappsec/upgrade-an-on-premises-scan-engine/#upgrade-a-legacy-engine)

## How Auto Upgrades Work

To facilitate communication between InsightAppSec and an on-premise engine, the engine installation includes a windows service named InsightAppSec-Broker, which regularly checks to see if there are jobs for the scan engine to perform, such as running a scan or updating the engine. The broker reports back the version of both the scan engine and the broker to the Insight platform. If the broker or the engine are out-of-date, the platform will inform the broker that an upgrade is available. An engine that is scanning can be busy for an unspecified length of time.

If you opt out of automatic upgrades, the auto-upgrade feature also enables you to upgrade your engines manually, with the click of a button, from the **Settings > Manage On-Premises Engines** screen.

If the engine is set to auto-upgrade, the broker will request for the upgrade process to initiate when the engine becomes idle.

If any new scans are scheduled to begin on an engine while it is upgrading, they will be started after the engine has been upgraded.

### Auto Upgrade Summary

-   Auto upgrade is turned on automatically. To turn it off, go to the **Settings > Manage On-Premises Engines** screen.
-   The option to toggle auto upgrades is available for admins only.
-   If the auto upgrade is off, the engine will continue to scan, but **will not** upgrade.
-   If the auto upgrade is turned on, the engine **will wait** for the scan to finish before upgrading.

## Manually Upgrade an On-Premise Engine

If auto upgrades are not enabled for new engines then you will need to manually upgrade your engine. To manually upgrade an engine:

1.  Go to the **Settings > Manage On-Premise Engines** screen.
2.  From the “On-Premise Engines” table, find the scan engine you wish to upgrade. In the “Latest Version” column, click the **Upgrade Now** button. The status of the engine will change to “Upgrading.”
3.  After the upgrade is completed, ensure that there is a green check mark in the “Latest Version” column.

## Auto Upgrade Statuses

You can view the status of any automatically upgraded engine selecting **InsightAppSec > Engine Management**, and going to the "Latest Version" column.

These are all the available status and version information on the “Manage On-Premises Engine” screen. Status and version information may be combined in a variety of different ways. For example an engine can have a grayed out table row, but still have a check because it will be terminated after the scan is complete.

-   Status Column
    -   Upgrading - Manual or auto upgrade in process
-   Latest Version Column
    -   Green check - latest engine version
    -   Red warning - out of date engine version
    -   Amber warning - Unknown engine version as engine has not paired
    -   Progress spinner - Manual or auto upgrade in process
    -   Upgrade now button - Manual upgrade for opted-out engines or where auto-upgrade has failed
-   Table Row
    -   Greyed table row - Engine terminating or waiting to terminate

### Latest Version Required

The engine is not on the latest version. Hover over the exclamation for instructions to download the latest engine installer.

![Engine Upgrade Latest Version](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/scan-engine-latest_version.png)

### Upgrade Failed

This status applies to manual and auto engines. It **will not** display for legacy engines.

This status indicates that the upgrade has failed. We recommended that you retry the upgrade, then contact support if that fails.

![Engine Upgrade Failed](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/retry_upgrade.png)

### Unknown Version

The engine is installed, but the [broker](https://docs.rapid7.com/insightappsec/upgrade-an-on-premises-scan-engine/#how-auto-upgrades-work) has not been contacted yet. The version is unknown because the engine has not been paired.

![Engine Upgrade Unknown Version](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/unknown_version.png)

### Upgrade in Progress

The grayed out progress spinner means an engine upgrade is in progress.

![Engine Upgrade In Progress](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/upgrade_progress.png)

### Engine Terminating

If the **entire** row is grayed out this means the engine is terminating. During this stage, you will see a gray warning in the “Latest Version” column. Once the upgrade completes, you will see a green check mark.

![Engine Upgrade Terminating](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/engine_terminate.png)

### Engine on Latest Version

![Engine Upgrade Latest Version](https://docs.rapid7.com/api/docs/file/product-documentation__master/insightappsec/images/on_latest_version.png)

## Upgrade a Legacy Engine

To upgrade a legacy engine you must first uninstall the current engine installer, then install the new engine installer.

1.  [Uninstall](https://docs.rapid7.com/insightappsec/uninstall-an-on-premise-scan-engine) the currently running installer.
2.  Go to the **Settings > Manage On-Premise Engines** screen.
3.  Click the **Download Latest Engine Installer** link to download the latest engine installer.
4.  From the “On-Premise Engines” table, click the name of the scan engine you want to upgrade. The "Edit Engine" panel will pop up.
5.  Copy the API Key from the "Edit Engine" panel.
6.  Run the installer on the server running your on-premises engine. When you are prompted for the API Key, provide the key you had copied in Step 4.
7.  After you finish running the installer, return to the “On-Premise Engines” table and find the scan engine you just upgraded. Ensure that there is a green check mark in the “Latest Version” column, and the “Auto Upgrade” column is available for editing.