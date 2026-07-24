---
description: >-
  Use offline SQLite copies of the Grand Comics Database and ComicVine for fast,
  rate-limit-free metadata on large collections.
---

# Local Metadata Databases

Getting metadata and building `ComicInfo.xml` files for a large collection through an online API is slow — you're bound by rate limits and network round-trips. CLU can instead read metadata from a **local SQLite database** stored on your own disk, which is dramatically faster for bulk-updating a big library and has **no API rate limits**.

Two local databases are supported:

| Database | What it is | Setup |
| --- | --- | --- |
| **Grand Comics Database (GCD)** | A SQLite dump you download from comics.org. | [GCD SQLite Setup](gcd.md) |
| **ComicVine (Local DB)** | A prebuilt SQLite copy of ComicVine data. | [ComicVine Local DB Setup](comicvine.md) |

!!! info "SQLite replaces MySQL in v6.0"
    Earlier releases required running a separate **MySQL** container for local GCD data. As of **v6.0** that's gone — both local databases are now single **SQLite files** that CLU reads directly from disk. There's no separate database server, no Docker network, and no import step to run.

## How it works

Both databases follow the same pattern:

1. **Download** the SQLite file and place it somewhere mapped into the CLU container.
2. In **Settings → [Metadata Providers](../app-settings/metadata.md)**, enter the file's full path in the provider's **Database Path** field.
3. **Save** and **Test** — CLU reads the file directly from disk (nothing is uploaded).
4. **Enable** the provider for the [libraries](../app-settings/metadata.md#assign-metadata-providers-to-libraries) where you want to use it.

!!! warning "A snapshot in time"
    A local database is a snapshot from the day you downloaded it — it won't contain comics released after that date. This is ideal for bulk-updating your back catalog; pair it with an online provider (Metron or the ComicVine API) to cover brand-new releases.
