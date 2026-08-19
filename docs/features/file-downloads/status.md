---
description: See files downloaded, currently downloading and pending.
---

# Download Status Page

From this page you can view current and pending downloads.

![Current Download Status](../../assets/download/status.png)

#### **Download Queue**

Downloads are queued in the order they are received. Downloads are restricted to 3 at a time. When one download finishes, the next in the queue will start.

Once a download is started, the Filename and File Size/Downloaded fields will populate. Prior to starting, downloads currently show "N/A" for file details.

#### Status

This will show one of the following statuses:

* queued
* in\_progress
* error
* complete

### Downloads from every source

The Status page shows all three download sources in one table, each with its own icon:

| Source | What you see | Notes |
| --- | --- | --- |
| **Direct (GetComics)** | Queue position, filename, size, and percentage. | Downloaded by CLU itself. |
| **[Usenet](../usenet/index.md)** | Live percentage, byte counts, and the client's current stage — **Downloading / Verifying / Repairing / Extracting / Moving**. | View-only rows; SABnzbd/NZBGet does the work. Refreshed on a ~5-second cadence while active. |
| **[DC++](../dcpp/index.md)** | Live percentage, stage, byte counts, and the bundle's target. | View-only rows. Bundles queued **directly in AirDC++** also appear, read-only — CLU never moves those. See [Status & Restart Recovery](../dcpp/status-and-recovery.md). |

!!! info "DC++ jobs survive a restart"
    DC++ bundles are recorded in the database at grab time, so a container restart no longer orphans one — and a bundle that completed while CLU was down can still be imported. **Failed** and **complete-but-not-moved** rows persist until you dismiss them, deliberately. Usenet jobs are **not** yet covered by this. See [Status & Restart Recovery](../dcpp/status-and-recovery.md).

### Completed Downloads

Downloads use the [Folder Monitoring](../folder-monitoring/index.md) feature to process downloads. All files will saved in the **WATCH** directory and moved to the **TARGET** once they are processed. 

You can adjust how files are processed in the [File Settings](../app-settings/file-settings.md).

#### Cancel

Before a download starts or while in progress, you can cancel a download. Once cancelled, the details are still present until you click the "Clear Completed / Cancelled Downloads" button

!!! info "Cancel actually stops the download (fixed in v6.3)"
    Cancellation is cooperative — the button sets a flag and the download worker has to notice it. Two providers didn't, and the old failure modes were actively misleading:

    - A cancelled **Pixeldrain** download ran to completion and **got imported anyway**, while the UI said "cancelled".
    - A cancelled **GetComics** download came back as **Failed with a Retry button** — the cancel triggered an error that then overwrote the cancelled status.

    Both now check for cancellation before and during transfer, delete the partial file (which is resume state and must not survive a cancel), close the connection so the mirror stops streaming, and refuse to overwrite a *cancelled* status with an error.

    **Stopping isn't instantaneous.** Granularity is bounded by chunk size, so on a slow link a cancel takes a few seconds to take effect.

## Automated Downloads

If you are using the Metron API and the [Pull List](../pull-list/index.md) feature, CLU will attempt to auto-download all missing issues for the series on your pull list.

