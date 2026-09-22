---
description: Database stats, storage health, maintenance tools, and backups
---

# Database

!!! info "New in v6.0"
    The **Database** tab is new in **v6.0**.

!!! info "Expanded in v6.5"
    The tab gained a **Health & Maintenance** card, a **Recent database errors** list, and a **Storage** verdict on the database file's location.

    The corruption side — salvage, quarantined copies and the offline rescue script — has its own page: **[Database Recovery](database-recovery.md)**.

The **Database** tab shows the health of CLU's SQLite database and lets you manage backups. Find it on the Settings page (gear <i class="bi bi-gear-fill"></i> menu → **Settings → Database**).

## Current Database

![Database stats and backups](../../assets/settings/db-backup.png){: .center-image}

The top section reports the SQLite file size and per-table row counts, alongside an **integrity** badge:

- **Healthy** <i class="bi bi-check-circle-fill text-success"></i> — the database passed its integrity check.
- **Corrupted — restore recommended** <i class="bi bi-x-circle-fill text-danger"></i> — the check failed. See [Database Recovery](database-recovery.md).

| Field | Description |
| --- | --- |
| **Path** | The database file location on disk. |
| **DB size** | Size of the main database file. |
| **WAL / SHM** | Size of the write-ahead log and shared-memory files. |
| **Journal / sync** *(new in v6.5)* | The journal mode and synchronous setting currently in force. |
| **Reclaimable** *(new in v6.5)* | Free space inside the file that a [Compact](#health-maintenance) would return to the filesystem. |
| **Storage** *(new in v6.5)* | **What kind of filesystem the database is sitting on.** See below. |
| **Tables** | Number of tables in the database. |
| **Total rows** | Total rows across all tables. |

A per-table breakdown (**Table** / **Rows**) is listed below the summary.

### Storage is the most important field on this page

!!! warning "SQLite on a network share will corrupt, and CLU cannot prevent it"
    SQLite relies on file locking that **CIFS/SMB, NFS and sshfs do not implement reliably**. This is the single commonest cause of the corruption this release is about, it is not a CLU bug, and nothing in CLU can fix it. The only fix is to move the database.

    CLU raises an alert on this field when it detects one.

| Storage verdict | What it means | What to do |
| --- | --- | --- |
| **Local disk** | A real local filesystem or a Docker volume. | Nothing. This is what you want. |
| **`overlay`** | **`/config` was never mounted.** The database is living inside the container's own writable layer, so it will be **destroyed** the next time the container is recreated — which includes every image update. | Fix your compose file now. Map `/config` to a named Docker volume or a local path, then restart. See [Quickstart](../../getting-started/quickstart.md). |
| **CIFS / SMB** | A Windows or NAS share. | Move the database to local storage. |
| **NFS** | A network filesystem. | Move the database to local storage. |
| **sshfs / FUSE** | A user-space mount. | Move the database to local storage. |

!!! info "Your comics can live on the NAS. The database can't."
    This trips people up, because the two feel like the same decision.

    `/data` on a network share is fine and normal — CLU reads and writes whole files there. `/config` holds a database that several workers write to continuously, and continuous concurrent writes are exactly what network file locking gets wrong.

## Health & Maintenance

!!! info "New in v6.5"
    A card of on-demand maintenance tools.

| Control | What it does | When to use it |
| --- | --- | --- |
| **Run integrity check** | A fast structural check of the database. | Any time — it's the default, and it's what the health badge reports. |
| **Full check** | Reads **every page** of the file. Slower, and thorough. | When you suspect damage the quick check missed. |
| **Checkpoint WAL** | Flushes the write-ahead log back into the main database file. | When the `-wal` file has grown large. |
| **Optimize** | Refreshes the query planner's statistics. | When things feel slow. |
| **Compact** | Rebuilds the file, returning free space to the filesystem. | When **Reclaimable** is large. |

**All of it is safe to run while the app is in use.** That's the first question everyone asks — you don't need to stop the container, and nothing goes offline while a check runs.

!!! info "Compact is refused on a damaged database"
    Deliberately. Compacting **rewrites every page in the file**, which is the last thing you want to do to a database that is already failing its integrity check — it can turn a recoverable file into an unrecoverable one.

    If the integrity check is failing, [salvage first](database-recovery.md).

## Recent database errors

!!! info "New in v6.5"
    A list of SQLite failures that the app would previously have swallowed silently.

**An empty table is good news.** It means no database operation has failed since the app started. That's worth saying, because an empty list on a page about health otherwise reads as a broken feature.

!!! info "This list resets when CLU restarts"
    It is held **in memory**, deliberately. Writing the record of database failures *into the database* is how the alarm gets lost at exactly the moment it matters — a database too damaged to read is also too damaged to tell you it's damaged.

    If you're investigating something, capture what's here before you restart.

### Why the badge can be red while the check is green

The health badge goes red if **either** the live integrity check fails **or** an error was latched earlier in this session. A passing check does **not** silently clear a latched failure.

So "badge red, integrity check green" isn't a contradiction — it means something failed earlier and the file happens to read cleanly right now. Look at **Recent database errors** to see what it was. A restart clears the latch, which is another reason to read the list first.

## Backups

Backups are **auto-created on container start** whenever the database has changed. Up to **3** automatic backups are retained, plus any manual snapshots you take and any pre-restore safety snapshots.

- **Last backup** shows when the most recent backup was taken.
- **Back up now** creates a manual snapshot immediately.

Each backup row (**Filename / Created / Size**) has actions:

| Action | What it does |
| --- | --- |
| <i class="bi bi-download"></i> **Download** | Download the backup file to your computer. |
| <i class="bi bi-arrow-counterclockwise"></i> **Restore** | Replace the current database with this backup. |
| <i class="bi bi-trash"></i> **Delete** | Permanently remove this backup (cannot be undone). |

!!! warning "Restoring replaces your current database"
    Restoring replaces the live database with the selected backup. CLU automatically takes a **safety snapshot** of the current database just before restoring, so you can roll back. **Restart the app after restoring** so all background workers reload their state.

### What changed in v6.5

Three things, all of them user-visible:

- **A backup now holds exactly one file.** Backups used to include the `-wal` and `-shm` sidecars, captured at slightly different instants from the main file — a combination that reads back as a **corrupt database**. The backup is now taken as a single consistent file.
- **Filenames step forward a second on collision.** A manual backup and an automatic one taken in the same second no longer overwrite each other.
- **The startup backup no longer delays startup.** It runs in the background, so a large database doesn't add minutes to every container start.

!!! info "Upgrading? Your old backups still work."
    Backups taken before v6.5 are **still restorable**. CLU simply ignores the sidecar files inside them.

## Shutdown is clean

!!! info "New in v6.5"
    `docker stop` and `docker restart` now **flush the write-ahead log before exiting**.

Every restart used to be an unclean shutdown as far as SQLite was concerned, leaving the write-ahead log to be recovered on the next start. That was a contributing cause of the corruption this release is about — and on a container that restarts nightly, it was happening nightly.

There is nothing to configure. It just means a normal stop is now a clean one.

## Related

- **[Database Recovery](database-recovery.md)** — what to do when the integrity badge is red.
- [Problem Files](../problem-files/index.md) — the equivalent page for damaged *comics*, rather than a damaged database.
