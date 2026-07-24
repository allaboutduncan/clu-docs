---
description: Point CLU at a local ComicVine SQLite database for rate-limit-free metadata
---

# ComicVine Local DB Setup

CLU can read ComicVine metadata from a **local SQLite database** instead of the ComicVine API. Because it's read straight from disk, there are **no API rate limits** — ideal for tagging a large library quickly.

!!! info "New in v6.0"
    Local ComicVine (SQLite) support is new in **v6.0**.

## 1. Download the database

Grab a prebuilt ComicVine SQLite database and place it on disk. A community-maintained copy (last updated **July 16, 2026**) is available here:

[https://pixeldrain.com/u/YkFtSLoC](https://pixeldrain.com/u/YkFtSLoC)

## 2. Place the file where CLU can reach it

Move the `.db` file to a location that is **mapped into your CLU container**. For example, if you map `/config` in your Docker setup, drop the file at `/config/comicvine.db`. CLU reads the file directly from disk — nothing is uploaded.

## 3. Configure the provider

In **Settings → [Metadata Providers](../app-settings/metadata.md)**, find the **ComicVine (Local DB)** card and enter the full path to the file in the **Database Path** field (e.g. `/config/comicvine.db`).

Click **Save** <i class="bi bi-floppy text-info"></i>, then **Test** <i class="bi bi-lightning text-info"></i>. On success you'll see a green **Connected** badge.

<!-- TODO: screenshot — ComicVine (Local DB) provider card with Database Path filled and Connected badge -->

!!! info "Docker / headless alternative"
    Instead of entering the path in the UI, you can set the **`COMICVINE_DATABASE_PATH`** environment variable on your CLU container. Saved credentials take priority; the environment variable is the fallback.

## 4. Order it above the ComicVine API

For the best of both worlds, order **ComicVine (Local DB)** *above* the online **ComicVine** provider in your [library's provider priority](../app-settings/metadata.md#assign-metadata-providers-to-libraries). CLU will serve metadata from the local database first and **fall back to the ComicVine API** for anything the local copy is missing (such as very recent releases).

For usage while browsing, see [File Management → Adding Metadata](../file-management/add-metadata.md).
