---
description: Download the GCD SQLite dump and point CLU at it for offline metadata
---

# GCD SQLite Setup

The **Grand Comics Database (GCD)** publishes a full SQLite dump of its data. Download it once, point CLU at the file, and you have a fast, offline metadata source for bulk-tagging your collection.

## 1. Download the SQLite dump

You'll need a free account at the Grand Comics Database ([comics.org](https://www.comics.org/)).

Once you're registered and logged in, visit [https://www.comics.org/download/](https://www.comics.org/download/) and:

- Select **Private Use**
- Download the **SQLite** version of the dump

<!-- TODO: screenshot — comics.org download page with SQLite version selected (assets/gcd-download.png is the old MySQL screenshot) -->

!!! info "It's a large file"
    The GCD dump is large (roughly **6&nbsp;GB**). CLU reads it directly from disk — it is never uploaded — so put it somewhere with room to spare.

## 2. Place the file where CLU can reach it

Extract the download and move the `.db` file to a location that is **mapped into your CLU container**. For example, if you map `/config` in your Docker setup, drop the file at `/config/gcd.db`.

## 3. Configure the provider

In **Settings → [Metadata Providers](../app-settings/metadata.md)**, find the **Grand Comics Database** card and enter the full path to the file in the **Database Path** field (e.g. `/config/gcd.db`).

Click **Save** <i class="bi bi-floppy text-info"></i>, then **Test** <i class="bi bi-lightning text-info"></i>. On success you'll see a green **Connected** badge, and the card footer shows live counts from the database (series, issues, stories, publishers, creators).

<!-- TODO: screenshot — Grand Comics Database provider card with Database Path filled and Connected badge -->

!!! info "Docker / headless alternative"
    Instead of entering the path in the UI, you can set the **`GCD_DATABASE_PATH`** environment variable on your CLU container. Saved credentials take priority; the environment variable is the fallback.

!!! warning "Missing tables"
    If the dump is missing tables, the provider footer warns you — credits and characters may be incomplete, or (for core tables) series/issue lookups may fail entirely. Re-download from comics.org if you see this.

### Metadata Languages (optional)

The GCD contains entries in many languages. Use the **Metadata Languages** field on the provider card to restrict lookups to the languages you want, as a comma-separated list of codes (e.g. `en,es,fr`). The default is `en`. Click **Save** next to the field after changing it.

## 4. Enable it for your libraries

Enable the GCD provider for the [libraries](../app-settings/metadata.md#assign-metadata-providers-to-libraries) where you want to use it, and set its priority relative to your other providers.

For usage while browsing, see [File Management → Adding Metadata](../file-management/add-metadata.md).
