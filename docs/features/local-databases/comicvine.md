---
description: Point CLU at a local ComicVine SQLite database for rate-limit-free metadata
---

# ComicVine Local DB Setup

CLU can read ComicVine metadata from a **local SQLite database** instead of the ComicVine API. Because it's read straight from disk, there are **no API rate limits** — ideal for tagging a large library quickly.

!!! info "New in v6.0"
    Local ComicVine (SQLite) support is new in **v6.0**.

!!! info "New in v6.5 — CLU can fetch and update the database for you"
    You no longer have to download and unpack the database by hand. Point CLU at a path, click **Download now**, and it does the rest — and it can keep the copy current on its own from then on.

## 1. Choose a path CLU can reach

Pick a location that is **mapped into your CLU container**. If you map `/config` in your Docker setup, `/config/comicvine.db` is a good choice.

The file doesn't have to exist yet — CLU will create it. It reads the database directly from disk; nothing is uploaded.

!!! warning "Check you have the room first"
    The download is around **540 MB** and unpacks to **several GB** — on the same volume that will hold your current copy.

    Because a replacement is only swapped in once it's fully verified, **peak usage is roughly old + new**. Make sure the volume has room for both.

## 2. Configure the provider

In **Settings → [Metadata Providers](../app-settings/metadata.md)**, find the **ComicVine (Local DB)** card and enter the full path in the **Database Path** field (e.g. `/config/comicvine.db`).

Click **Save** <i class="bi bi-floppy text-info"></i>.

<!-- TODO: screenshot — ComicVine (Local DB) provider card with Database Path filled and Connected badge -->

!!! info "Docker / headless alternative"
    Instead of entering the path in the UI, you can set the **`COMICVINE_DATABASE_PATH`** environment variable on your CLU container. Saved credentials take priority; the environment variable is the fallback.

## 3. Download the database

Under the database path field are two controls:

| Control | What it does |
| --- | --- |
| **Download now** | Fetches, unpacks and verifies the database **immediately**. This also works as a **first** download, so it's how you bootstrap a new install — there are no manual steps to do first. |
| **Keep this database up to date automatically** | Checks for a newer copy every **2 weeks** and replaces the file at the path above. |

<!-- TODO: screenshot — the Download now button and auto-update switch on the ComicVine (Local DB) card (assets/settings/comicvine-db-autoupdate.png) -->

**Progress appears in [Active Operations](../app-settings/index.md).** This runs in the background because it far outlasts a web request — you can navigate away, and closing the tab doesn't cancel it.

When it finishes, click **Test** <i class="bi bi-lightning text-info"></i>. On success you'll see a green **Connected** badge.

!!! info "Automatic updates are off by default"
    A download and disk write of this size must not start unannounced when you upgrade CLU, so the switch ships **off**.

    The **Download now** button isn't gated — clicking it is a choice you've just made.

!!! info "An update is a no-op until it succeeds"
    **Nothing replaces your database** until the new file has been downloaded, unpacked, **checksum-verified against the publisher's own hash**, and confirmed to actually be a ComicVine database.

    A failed run — a dead mirror, a truncated download, a full disk — leaves your existing file **exactly where it was**. You can't end up with a half-written database.

### Downloading it yourself

If you'd rather fetch it by hand — an air-gapped install, or you already have a copy — you still can. Grab a prebuilt ComicVine SQLite database and drop it at the path you configured above. A community-maintained copy (last updated **July 16, 2026**) is available here:

[https://pixeldrain.com/u/YkFtSLoC](https://pixeldrain.com/u/YkFtSLoC)

This is the fallback path, not the normal one. **Download now** is simpler and verifies what it fetches.

## 4. Order it above the ComicVine API

For the best of both worlds, order **ComicVine (Local DB)** *above* the online **ComicVine** provider in your [library's provider priority](../app-settings/metadata.md#assign-metadata-providers-to-libraries). CLU will serve metadata from the local database first and **fall back to the ComicVine API** for anything the local copy is missing (such as very recent releases).

For usage while browsing, see [File Management → Adding Metadata](../file-management/add-metadata.md).
