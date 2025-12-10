---
description: All of the Options available in Settings
---

# System and Performance Settings

![System and Performance Settings](/assets/settings/system-settings.png)

### Performance and Timeout Settings

![Performance and Timeout Settings](/assets/settings/timeout.png)

Allows you to better manage large files depending on your system. Adjusting these values will enable/disable additional timing checks when processing large files (converting or rebuilding files). The default settings on average systems should easily handle converting a 2GB CBR file to CBZ.

### File Index Management

![File Index Rebuild](/assets/settings/index-rebuild.png)

In v4, the **Cache Management** has been replaced with databased managed file indexing. This provides faster page loads and improved search performance. 

From this area in admin, you can manually trigger a file index rebuild and schedule daily or weekly rebuilds. You'll also see your current index status here.

#### Automatic Rebuild Schedule

![Rebuild Schedule](/assets/settings/rebuild-schedule.png)

Timing for automatically rebuilding the file index. Default is disabled

You can set Daily or Weekly and specify the hour to rebuild the index. 

### Logging & Debugging

![Logging & Debugging](/assets/settings/debug.png)

If you are experiencing issues or odd behavior, enable this to add more detailed logging.

### ComicInfo.XML Updates

![ComicInfo XML Updates](/assets/settings/clean-xml.png)

All of these features related to updating/cleaning the `ComicInfo.xml` file in archives. I would consider these experimental or beta features - in that they have been tested the least.

**Update Volume to First Issue Year:** If there is not a **volume year** in the `ComicInfo.xml` this will read the (YEAR) from the first issue in the folder and update the **volume year** for each file to match.

**Remove All Markdown Content:** When enabled, if there are _tables_, _bold text_, or _headers_ in the Comments field of the `ComicInfo.xml` file, they will be removed.

**Remove 'Covers & Creators' Table:** When enabled, if there is a _Covers & Creators table_ in the Comments field of the `ComicInfo.xml` file, it will be removed.

### Save & Restart

**SAVE:** Click the Save button to save any changes you have made to the app.

**RESTART APP:** Only require on the initial install and a quick way to force restart to reload the config/settings changes.
