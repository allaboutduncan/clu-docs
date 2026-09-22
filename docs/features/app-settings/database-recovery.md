---
description: Salvage a corrupted CLU database, recover what's readable, and rescue an app that won't start
---

# Database Recovery

!!! info "New in v6.5"
    Salvage, quarantined copies and the offline rescue script are new in **v6.5**.

## When you need this page

One of these is true:

- The integrity badge on the [Database](database.md) tab is **red**.
- The [app log](logs.md) is reporting **`database disk image is malformed`**.
- CLU won't start at all — go straight to [the offline rescue script](#the-offline-rescue-script).

Everything here is reached from the gear <i class="bi bi-gear-fill"></i> menu → **Settings → Database**, except the rescue script, which runs from your host shell.

!!! warning "Fix the cause, not just the file"
    Before you do any of this, look at the **[Storage](database.md#storage-is-the-most-important-field-on-this-page)** field on the Database tab.

    **A database on a network mount will corrupt again**, however cleanly you repair it today. CIFS/SMB, NFS and sshfs do not implement the file locking SQLite needs. Salvaging a database on a network share buys you days, not a fix.

## Salvage

**Salvage reads out everything still readable and builds a clean copy.** It **never modifies your current database** — the live file is opened read-only and left exactly as it was, whatever the outcome.

That's the important property: you see the result of the salvage **before** deciding whether to use it. Nothing is destroyed to find out whether the repair worked.

### Reading the result panel

When the salvage finishes, you get a report rather than a yes/no.

| Field | What it tells you |
| --- | --- |
| **Method** | How the data was recovered. Some databases give up their contents more easily than others. |
| **Integrity** | Whether the **new** copy passes its own integrity check. This is the number that matters — a salvage whose output is also corrupt hasn't helped. |
| **Rows lost** | How many rows didn't survive, where that can be determined. See the warning below. |
| **Size** | The size of the salvaged copy, for comparison with the original. |

Below the summary is a **per-table before/after diff**, so you can see exactly where the loss landed. Losing rows from a cache table is very different from losing rows from your reading history.

!!! warning "Rows lost can be reported as unknown, and that's the honest answer"
    The corrupt table is usually the exact table whose row count **cannot be read** — that's what being corrupt means.

    So CLU reports those tables as **unknown** rather than quietly counting them as zero loss. A naive "0 rows lost" on a salvage would be dangerously wrong: it would mean *"we couldn't count them"*, not *"nothing was lost"*.

    Treat **unknown** as "check this table before you trust it", not as "fine".

### Install this database, or discard it

Two buttons follow the report:

| Button | What it does |
| --- | --- |
| **Install this database** | Swaps the salvaged copy in as the live database. A **pre-swap snapshot** of the current (damaged) file is taken automatically first. |
| **Discard** | Throws the salvaged copy away and changes nothing. |

**Restart the app after installing**, so every background worker reloads against the new file.

## Quarantined copies

When CLU detects corruption it takes a **snapshot automatically** and quarantines it. These are listed on the Database tab alongside your backups, but they behave differently.

- **They are never offered for restore.** A quarantined copy *is* the damaged file — restoring it would put you straight back where you started.
- **They are downloadable**, because they are the only surviving copy of whatever was lost. If you need to extract something by hand, or send a file to someone who can look at it, this is the file to take.

## The offline rescue script

!!! warning "This is the page's highest-value content"
    Everything above assumes CLU is running. If the database is damaged badly enough, it isn't — and none of those buttons exist.

CLU ships a standalone repair script that runs inside the container with **nothing but Python's standard library**. It needs no packages, no network, and no working CLU.

<!-- TODO: verify against clu-comics — (a) the in-container path of repair_db.py (assumed /app/tools/), (b) the database filename under /config (assumed clu.db). Both are guessed from the v6.5 outline and have NOT been confirmed in the app repo. -->

```bash
docker exec -it clu python /app/tools/repair_db.py
```

Replace `clu` with your container name if you changed it.

If the container won't stay up long enough to `exec` into it, start it with a shell instead and run the script by hand:

```bash
docker run --rm -it \
  -v config-volume:/config \
  --entrypoint python \
  allaboutduncan/comic-utils-web:latest \
  /app/tools/repair_db.py
```

Use the same `/config` volume or bind mount as your normal container — that's where the database lives.

!!! info "Take a copy first"
    Before running anything, copy the database somewhere safe:

    ```bash
    docker cp clu:/config/clu.db ./clu-damaged.db
    ```

    A repair attempt that makes things worse is much less alarming when you still hold the original.

## After you recover

Once you're running again:

1. **Check the [Storage](database.md#storage-is-the-most-important-field-on-this-page) field.** If it doesn't say local disk, move the database before you do anything else.
2. **Take a manual backup** from the Database tab, so you have a known-good copy of the recovered state.
3. **Watch [Recent database errors](database.md#recent-database-errors)** for a day or two. An empty list is the all-clear.

## Related

- [Database](database.md) — stats, storage verdict, maintenance tools and backups.
- [App Logs](logs.md) — where `database disk image is malformed` shows up.
- [Quickstart](../../getting-started/quickstart.md) — the `/config` volume mapping.
