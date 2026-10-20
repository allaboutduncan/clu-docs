---
description: Bring your Mylar3 watchlist, download client, Newznab indexers and ComicVine key into CLU
---

# Import from Mylar3

!!! info "New in v6.8"
    The **Mylar3 importer** is new in **v6.8**.

If you're moving from Mylar3, the importer brings your **watchlist** onto the [Pull List](pull-list/pull-list.md), along with your **SABnzbd or NZBGet client**, your **Newznab indexers** and your **ComicVine API key**. Nothing changes until you've reviewed a preview and clicked **Import selected**.

Find it on the [Settings](app-settings/index.md) page, with the **Import from Mylar3** button above the tabs. It's also the **Mylar3 Import** step of [Guided Setup](../getting-started/guided-setup.md). Opened from there, the page has a **Back to Guided Setup** button.

!!! warning "Store Owner only"
    Like Settings, the importer is [Store Owner](users/roles.md) only.

!!! info "Not using Mylar's database?"
    If your folders already carry `series.json` or `cvinfo` files, from Mylar or another app, [Scan Library](pull-list/automap.md) can map them without the importer.

## Before you start

- **A library that holds your Mylar series folders.** See [Libraries](app-settings/libraries.md).
- **Metron**, to identify each series. Add it in [Metadata Providers](app-settings/metadata.md) first. Without Metron, series are added with ComicVine-only ids, and they don't get Metron's release calendar. Without Metron *or* a ComicVine key, series can't be identified at all. You can import Mylar's ComicVine key from its `config.ini` in the same run.

<!-- TODO: screenshot — the importer with all four cards loaded (assets/pull/mylar-import.png) -->

## 1. Load Mylar's files

Mylar keeps two files in its data folder (`/config/mylar/` in the linuxserver image):

| File | What CLU reads from it |
| --- | --- |
| `mylar.db` | Your watchlist: series, folders and issue statuses. |
| `config.ini` | Your ComicVine key, download client and Newznab indexers. |

Either file can be imported on its own. **Copy them while Mylar is stopped**, or use the copy in Mylar's `backup` folder.

There are two ways to get them into CLU:

- **Upload** them in the browser and click **Load**.
- **Copy them into the drop folder**, `/cache/mylar_import/`. The page shows whether each file was found. Click **Check again** after copying, then **Use these files**. You don't need an extra volume mapping, because `/cache` is already mapped.

!!! info "Mylar's own database is never opened"
    CLU copies the files to a private staging folder, reads them, and deletes the staged copy. Your files in the drop folder are left where they are. A loaded preview expires after an hour; after that, load the files again.

## 2. Where Mylar's folders are in CLU

Mylar records paths as *its* container sees them, which are rarely the paths CLU sees. The importer proposes a mapping from each Mylar folder to a CLU folder, based on Mylar's settings and your libraries. You can edit it.

| Column | Meaning |
| --- | --- |
| **Mylar folder** | A root folder from Mylar's watchlist. |
| **CLU folder** | The folder it's replaced with in CLU. |
| **Found** | How many of the series under it exist at the mapped path, as *N of M*. **check this** means none were found: the mapping is probably wrong. |

Click **Update preview** after changing a mapping. A series folder that doesn't exist yet is **created**, as Subscribe does.

## 3. Series

Every watchlist series is listed with the CLU folder it maps to. Use the filter box and **All / None** to choose which ones to import.

| Status | What happens |
| --- | --- |
| **Folder found** | Imported into the existing folder. |
| **Folder will be created** | Imported, and the folder is created. |
| **Already on Pull List** | Left alone. The same series is already mapped. |
| **Folder mapped to another series** | Left alone. |
| **Duplicate folder** | Left alone: another Mylar series uses the same folder. |
| **No usable folder** | Left alone. The reason is shown: Mylar has no folder for the series, no path mapping covers it, or it isn't inside a CLU library. |

The **From Mylar** column shows what carries over:

| In Mylar | In CLU |
| --- | --- |
| Paused series | Imported with **Monitor off**. |
| Skipped or Ignored issues | Marked **skipped**. |
| Archived issues | Marked **owned**. |

Mylar's marks only fill blanks. An issue you've already marked in CLU keeps its mark. Wanted and Downloaded aren't copied: CLU works those out from the files in your library.

## 4. Settings

From `config.ini`, the importer offers:

- The **ComicVine API key**.
- The **SABnzbd or NZBGet client** Mylar was using: host, port, SSL, URL base, API key, username, password, category and priority.
- Each **Newznab indexer**: name, URL, API key, categories and whether it's enabled. If Mylar's Newznab switch is off, every imported indexer comes in disabled.

Each row has a badge:

| Badge | Default |
| --- | --- |
| **New** | Ticked. CLU has nothing there yet. |
| **Already set** | Disabled. CLU already has the same value. |
| **Differs from CLU** | Unticked. Tick it to **replace** what CLU has. |

So the importer fills blanks, and replaces something only when you opt in.

After saving, CLU **tests** the client and each indexer from its own side. The client address is the one Mylar used, so it may need changing if Mylar reached it differently. An imported client is made active only if CLU has no active Usenet client yet. Once there's an active client and an enabled indexer, **Usenet is added to your [Source Priority](usenet/source-priority.md)** so auto-download uses it.

## Not imported

The **Not imported** card lists what was left out, and why:

- **Torznab indexers and torrent clients**: CLU has no torrent support.
- **The blackhole NZB folder**: CLU sends NZBs to SABnzbd or NZBGet.
- **Annuals**: they aren't imported as separate series.
- **Series with a GCD id, or no ComicVine id**: CLU can't resolve them.

## How each series is identified

When you click **Import selected**, each series is looked up in this order:

1. By its **ComicVine id**, matched to a **Metron** series.
2. If Metron doesn't know it, it's added with a **ComicVine-only** id. When Mylar's database has the issue list, the series is built from that with no API calls.

Missing `cvinfo` and `series.json` files are written into each folder. Existing ones are left alone.

You can leave the page while it runs. The import keeps going, and the page picks it up again when you come back. If ComicVine's hourly request limit is reached, the import pauses and says how long it will wait.

## Results

| Result | Meaning | What to do |
| --- | --- | --- |
| **Added** | On the Pull List, from Metron, from Mylar's ComicVine data, or from ComicVine. | Nothing. For a series built from Mylar's data, **Sync** on its series page refreshes it from ComicVine. |
| **Deferred** | Metron's daily request limit was reached, or it rejected your saved credentials. Every remaining series is deferred, rather than being added with a ComicVine-only id. | **Run the import again later.** |
| **Could not be identified** | Neither Metron nor ComicVine could place the series. | Set up Metron or ComicVine, then run it again. |
| **Skipped** | Already on the Pull List. | Nothing. |
| **Failed** | For example, not inside a CLU library, or the folder couldn't be created. | Fix the path mapping or permissions, then run it again. |

!!! tip "Re-running is safe"
    A series already on the Pull List is skipped, never overwritten. If an import is cut short by Metron's daily limit, run it again the next day: it carries on with what's left.

When it finishes, the page links to the **Pull List** and to **Settings → Download Clients**.

## Related

- [Automap (Scan Library)](pull-list/automap.md): map folders with `series.json`/`cvinfo` sidecars.
- [Adding a Download Client](usenet/setup.md) and [Adding Newznab Indexers](usenet/indexers.md).
- [Metadata Providers](app-settings/metadata.md): Metron and ComicVine credentials.
- [Guided Setup](../getting-started/guided-setup.md).
