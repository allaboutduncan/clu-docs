---
description: A first-run walkthrough that checks your install, asks how you plan to use CLU, and sets up only what you need
---

# Guided Setup

!!! info "New in v6.8"
    **Guided Setup** is new in **v6.8**. Now that every setting lives in the database, CLU can walk you through them in one place.

Guided Setup gets a new install to a working library in a few minutes. It checks the install, asks what you want CLU to do, and then shows only the settings those use cases need. Every step explains what it is in plain language and links to the full documentation.

On an install that's already set up, it works as a **health check**: what is configured, what is broken, and what you haven't used yet.

Guided Setup doesn't replace [Settings](../features/app-settings/index.md). It saves through the same settings Settings does, so a change in one shows up in the other. Each step also links to the matching Settings tab for the options the walkthrough leaves out.

<!-- TODO: screenshot — the Guided Setup page, progress rail on the left (assets/setup/guided-setup.png) -->

## When it opens

| Install | What happens |
| --- | --- |
| **New install** | The Store Owner's **first visit to the home page** opens Guided Setup. This happens **once**: after that, the home page opens normally. |
| **Upgraded install** | Nothing is redirected. Instead, the Store Owner sees a one-time banner: *"New: Guided Setup can check your configuration and point out anything missing."* with **Run Guided Setup** and **Dismiss**. Opening Guided Setup or dismissing the banner removes it for good. |

Readers and Clerks are never redirected and never see the banner.

## Running it again

You can re-run Guided Setup at any time from either of these:

- The **Run Guided Setup** button above the tabs on the [Settings](../features/app-settings/index.md) page.
- **gear <i class="bi bi-gear-fill"></i> menu → Guided Setup**, between Settings and Schedules.

!!! warning "Store Owner only"
    Guided Setup is gated like [Settings](../features/app-settings/index.md): **Clerks and Readers never see it**, in the menu or by direct URL. See [Roles & Permissions](../features/users/roles.md).

## Step 1: System Check

The first step is a read-only check of the install. Each row is **OK**, a **warning** or a **failure**, or is skipped when it can't run on your platform. A row that isn't OK shows how to fix it and links here.

**Only the Database check blocks you.** If it fails, **Next** stays disabled until it's fixed. Everything else is a warning you can come back to. **Run again** repeats the check after you've changed something.

<!-- TODO: screenshot — System Check with a mix of OK and warning rows (assets/setup/system-check.png) -->

| Check | What it means | How to fix a warning |
| --- | --- | --- |
| **Database** | CLU can open its database, and no corruption has been reported. | If it can't be opened, check that `/config` is mounted and writable, then restart the container. The container log shows the underlying error. If corruption was reported, open **Settings → Database** to run a full check and repair or restore it. See [Database](#database). |
| **Database storage** | The filesystem holding `/config` is safe for a database. A network share (CIFS/NFS) or the container's own temporary layer is not. | Mount `/config` on local storage or a Docker named volume. See [Volumes and permissions](#volumes-and-permissions). |
| **/config is writable**<br>**/cache is writable** | CLU can create and delete a file in each. `/config` holds the database, its backups and the logs; `/cache` holds thumbnails and the trash. | Map a volume onto that path that the container user (`PUID:PGID`) can write to. |
| **Comic folders under /data** | A comics volume is mapped. CLU lists the folders it finds under `/data`; the Libraries step uses that list. | Map your comics folder into the container under `/data` in `docker-compose.yaml` (for example `/mnt/comics:/data/comics`), then recreate the container. An empty `/data` is fine if your libraries are mapped somewhere else, such as `/comics`. |
| **WATCH folder**<br>**TARGET folder** | The [Folder Monitoring](../features/folder-monitoring/setup.md) folders are outside `/data` and writable. Unset, they default to `/downloads/temp` and `/downloads/processed`. | Set them in **Settings → File Processing** to folders mapped into the container outside `/data`. The container user must be able to write to them. |
| **Libraries** | Shown only when no library exists yet. | Add one in the next steps, or in [Settings → Libraries](../features/app-settings/libraries.md). |
| **Library: *name*** | One row per enabled library: the path exists, is a folder, and can be read and written. | A missing path usually means the volume mapping changed: check `docker-compose.yaml`, or edit the library's path. A read-only library still works, but renaming, metadata writes and conversion will fail. Give the container user write access, or set `PUID`/`PGID` to the folder's owner. |
| **Owner account** | The owner account exists and, if login is required, has a password. A single-user, login-free install is OK as it is. | If login is required and the owner has no password, set one in the [Users](#users) step or on the [Users](../features/users/index.md) page. |
| **Container user** | CLU runs as your `PUID`, not as root, and your library folders are owned by the same user. | Make the mounted folders writable by `PUID:PGID` (fix the volume's ownership, or set `PUID`/`PGID` to match it) and recreate the container. |

!!! info "\"Did not respond within 5s\""
    Every check gives up after 5 seconds, so one hung mount can't stall the page. That warning almost always means a network mount (CIFS/NFS) has stopped responding. Check the share on the host, then **Run again**.

### Volumes and permissions

Most warnings come down to the volume mapping in your `docker-compose.yaml`. Guided Setup can't change it, because it runs inside the container, but it can tell you what's wrong:

- **Paths are container paths.** CLU only sees what you map. A folder on your NAS has to be mapped to a path under `/data` (or another mapped volume) before you can add it as a library.
- **`PUID`/`PGID` must match the owner of your folders.** When a mount isn't writable by `PUID:PGID`, the container falls back to running as root, and every file it writes is then root-owned.
- **Recreate, don't just restart.** A changed volume or environment variable needs `docker compose up -d`, not just a restart.

See [Config Installation](../features/app-settings/install.md) and the [Quickstart](quickstart.md) for the full `docker-compose.yaml`.

### Database

The System Check runs a quick check that the database opens, and reports any corruption CLU has already recorded. **Settings → Database** runs the full integrity check, and is where you repair or restore. See [Database](../features/app-settings/database.md) and [Database Recovery](../features/app-settings/database-recovery.md).

## Step 2: How do you plan to use CLU?

Your answers decide which steps come next. You can change them by coming back to this step.

**Do you already have comics organized in folders?**

- **No, I'm starting fresh**: you go through every section in order, and each one can be skipped. The two sections that need an existing collection, **Mylar3 Import** and **Pull List Scan**, are left out.
- **Yes**: pick any of the use cases below. You get each section the use cases need, once, however many of them ask for it.

<!-- TODO: screenshot — the use-case question with several options ticked (assets/setup/use-cases.png) -->

| Use case | What it's for | Sections it adds |
| --- | --- | --- |
| **Repair and fix my existing collection** | Rename, convert CBR to CBZ, and find damaged or duplicate files. | Libraries, Folder Monitoring, Notifications, Repair Tour |
| **Add or update metadata** | Tag comics with `ComicInfo.xml` from Metron, ComicVine or GCD. | Libraries, Metadata |
| **Import from Mylar3** | Bring over your watchlist, download client, indexers and ComicVine key. | Libraries, Metadata, Mylar3 Import, Downloads |
| **Map existing folders to my pull list** | Read `series.json`/`cvinfo` in your folders to build the Pull List. | Libraries, Metadata, Pull List Scan |
| **Subscribe and download comics** | Follow series and download new issues automatically. | Libraries, Metadata, Folder Monitoring, Downloads, Schedules, Users, Notifications |
| **Read my comics and track stats** | Nothing extra is needed beyond a library. | Libraries, Users |

**Personalization** is part of every path.

!!! warning "Metron is required for three of these"
    Importing from Mylar3, mapping folders to the Pull List, and subscribing to series all need a [Metron](../features/app-settings/metadata.md) account. The Pull List, Wanted and subscriptions are built on Metron's release data. ComicVine is optional.

## The steps

Sections always run in this order, and each one appears only if your path includes it:

**Libraries → Metadata → Mylar3 Import → Pull List Scan → Folder Monitoring → Downloads → Schedules → Users → Notifications → Personalization → Repair Tour → Summary**

Every step has the same shape: what this is, the few fields that matter, a **Save** and **Test** where it applies, a link to the full Settings tab, and a link to the docs. Each step saves as you go, so there's no "save everything" at the end.

### Libraries

A library is a folder CLU indexes and shows in the collection. The step lists the folders the System Check found under `/data`, each with a one-click **Add as library**, and has a folder picker for anywhere else you've mapped. Adding a library starts the file index, and the step shows its progress.

<!-- TODO: screenshot — Libraries step with folders found under /data (assets/setup/libraries.png) -->

More in [Libraries](../features/app-settings/libraries.md).

### Metadata

Set up the providers CLU tags your comics from. **Metron** is the one the Pull List needs; **ComicVine** and **GCD** are optional. You can test credentials before you save them. The step can also download the [ComicVine local database](../features/local-databases/comicvine.md) for you, and sets the `ComicInfo.xml` write options.

More in [Metadata Providers](../features/app-settings/metadata.md) and [Local Metadata Databases](../features/local-databases/index.md).

### Mylar3 Import

Checks that you have a library and Metron set up, then opens the [Mylar3 importer](../features/mylar-import.md). The importer's **Back to Guided Setup** button returns you to this step, which shows the result of your last import.

### Pull List Scan

Runs [Scan Library](../features/pull-list/automap.md) from inside the walkthrough. It reads the `series.json` and `cvinfo` files in your folders and maps each series to the Pull List. Folders that need a decision open in the Pull List page's review window, where you confirm them.

### Folder Monitoring

Sets the **WATCH** and **TARGET** folders with the folder picker, then turns monitoring on. Here too: auto-convert, auto-rename with a live preview of your rename pattern, and the trash.

More in [Monitoring Setup](../features/folder-monitoring/setup.md) and [File Processing Settings](../features/app-settings/file-settings.md).

### Downloads

Choose which sources CLU downloads from: **GetComics**, **Usenet** and **DC++**. A source is used only while it's ticked, and the ticked ones are tried in the order shown. You can reorder them, but you can't untick the last one.

- **GetComics** works with nothing to configure. You can set the mirror order and a PixelDrain key. If you already follow series, a **dry run** shows what one would download.
- **Usenet** needs a SABnzbd or NZBGet client and at least one Newznab indexer.
- **DC++** needs an AirDC++ client.

For clients and indexers, **Save is enabled only after a passing Test** of what's on screen.

<!-- TODO: screenshot — Downloads step with GetComics and Usenet ticked (assets/setup/downloads.png) -->

More in [Download & API Settings](../features/app-settings/download-settings.md), [Adding a Download Client](../features/usenet/setup.md), [Adding Newznab Indexers](../features/usenet/indexers.md), [Adding AirDC++](../features/dcpp/setup.md) and [Source Priority](../features/usenet/source-priority.md).

### Schedules

Pick your timezone and set the recurring jobs: the file index rebuild, series sync, GetComics index, GetComics auto-download and reading-list sync. **Use recommended defaults** turns the rebuild and sync on daily at off-peak times. Times are shown in your timezone.

More in [Schedules](../features/app-settings/schedules.md).

### Users

*Will anyone else use this CLU?*

- **No**: CLU stays login-free. That's fine for one person on a private network.
- **Yes**: set the owner's username and password, then optionally add a second account. Adding that account is what turns login on.

More in [Users & Access](../features/users/index.md).

### Notifications

Add Apprise URLs and choose which events notify you. **Test** works before you save.

More in [Notifications](../features/app-settings/notifications.md).

### Personalization

Pick the site theme, with previews.

More in [Personalization](../features/app-settings/personalization.md).

### Repair Tour

Turn on the [library health scan](../features/problem-files/index.md#library-health-scan), set how often it runs, and run one now. The step then shows what the scan found, with links to where you fix things:

- [Problem Files](../features/problem-files/index.md): damaged archives, failed conversions, orphans and empty folders.
- [Duplicates](../features/problem-files/duplicates.md): exact and likely duplicate copies.
- [Source Wall](../features/collection/source-wall.md): edit `ComicInfo.xml` across a folder, and see which provider tagged each file.

## Skipping and resuming

| Button | What it does |
| --- | --- |
| **Skip this step** | Marks the step **Skipped** and moves on. You can come back to it from the progress rail or the Summary. |
| **Skip setup** | Leaves Guided Setup and goes to the home page. You won't be redirected again; run it from Settings or the gear menu when you want. |
| **All Settings** | Opens the full Settings page. |

Your place is saved on every **Next** and **Skip**. If you leave midway, reopening Guided Setup picks up at the step you were on.

## The Summary

The last step shows one row per section:

| Status | Meaning |
| --- | --- |
| **Configured** | The section is set up and working. |
| **Needs attention** | Something is set up but broken, or incomplete. The row says what. |
| **Not set up** | Nothing is configured yet. |
| **Skipped** | You skipped the step and it still isn't configured. |
| **Configure in Settings** | The section has no step in the walkthrough. |

Each row has **Open step**, which takes you back to it (adding it to your path if it wasn't there), and **Settings** or **Open page** for the full options. Under the table, the System Check runs again.

<!-- TODO: screenshot — Summary with a mix of statuses (assets/setup/summary.png) -->

- **Finish** marks Guided Setup complete and goes to the home page.
- **Download summary (for support)** saves `clu-setup-summary.json`: your path, skipped steps, section statuses and the System Check results. Attach it when you ask for help on [Discord](https://discord.gg/ndDhpvrgBa) or GitHub.
