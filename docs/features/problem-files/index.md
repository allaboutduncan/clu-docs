---
description: The report of comics CLU tried to read and couldn't, and what you can do about each one
---

# Problem Files

!!! info "New in v6.5"
    The **Problem Files** page is new in **v6.5**.

Before v6.5, a damaged comic produced a generic broken tile in the grid and a line in the [app log](../app-settings/logs.md). There was no list of what was broken and no way to act on it.

Find it in the **gear <i class="bi bi-gear-fill"></i> menu → Problem Files**.

!!! warning "Store Owner only"
    Problem Files is gated exactly like [Settings](../app-settings/index.md) and [Schedules](../app-settings/schedules.md) — **Clerks and Readers never see it**, in the menu or by direct URL. See [Roles & Permissions](../users/roles.md).

<!-- TODO: screenshot — the Problem Files page with a mix of sources (assets/settings/problem-files.png) -->

## An empty page does not mean your library is clean

This is the first thing to understand about the page, because the empty state is otherwise ambiguous.

**CLU does not scan your library looking for damage.** A file appears here because an operation CLU *actually attempted* tried to read it and could not. Nothing on this page is speculative, and nothing is a prediction.

So an empty page means **nothing has failed** — not *your library is healthy*. A comic you have never opened, never rebuilt and never re-tagged could be thoroughly corrupt and will not appear here until something touches it.

## Where a row came from

Every row records which operation hit the error, and that tells you what CLU was doing at the time.

| Source | What was being attempted |
| --- | --- |
| **Thumbnail** | Generating the cover for the grid. |
| **Rebuild** | A [single-file](../single-file-features/rebuild.md) or [directory](../directory-features/rebuild.md) rebuild. |
| **Metadata write** | Writing `ComicInfo.xml` back into the archive. |
| **CBR conversion** | A CBR/RAR that wouldn't [convert](../directory-features/convert.md) to CBZ. |
| **Unpack** | An archive in your **WATCH** folder that wouldn't open. |

!!! info "Unpack is the odd one out"
    An **Unpack** row's path is a **download**, not a library comic. The file never reached your library at all — which is exactly why nothing else would ever have told you about it.

    This is the row type that explains *"my download vanished and never appeared in the library"*. See [Folder Monitoring → Features](../folder-monitoring/features.md).

### One file can appear twice

Rows are keyed on the file **and** the source. A comic whose thumbnail fails *and* whose rebuild fails is **two rows**, tracked independently — fixing or dismissing one does not clear the other.

That's deliberate: the two failures can have different causes, and a thumbnail that can't be written because of a [cache permissions problem](#an-unwritable-cache-is-not-a-damaged-comic) says nothing at all about the archive.

## Filtering the list

| Filter | What it does |
| --- | --- |
| **Source pills** | Show only rows from one operation — Thumbnail, Rebuild, Metadata write, CBR conversion, Unpack. |
| **Path filter** | Narrows the list to paths matching what you type. Useful for checking a single series or a single mount. |
| **Show dismissed** | Brings [dismissed](#dismiss) rows back into view. Off by default. |

## What you can do about a row

| Action | What it does |
| --- | --- |
| **Details** | Shows the archive error in full, exactly as the library reported it. |
| **Retry** | *Thumbnail rows only.* Re-attempts the thumbnail immediately and synchronously, so you see the result straight away. |
| **Rebuild** | Unpacks the archive and repacks it as a fresh CBZ. |
| **Find a replacement** | Opens the source search, pre-filled from the filename. See [Replacing a damaged file](replacing-a-file.md). |
| **Dismiss** | Hides the row until the file changes on disk. |
| **Delete** | Moves the file to the [trash](../file-management/delete.md). |
| **Remove** | Forgets the row without touching the file. |

<!-- TODO: screenshot — the Details panel showing a full archive error (assets/settings/problem-files-details.png) -->

### Rebuild

!!! info "Rebuild is honest about its odds"
    **Rebuild's only real repair is an archive that's a RAR wearing a `.cbz` name.** Repacking fixes the container; it cannot invent bytes that aren't there.

    A genuine CRC error aborts the whole extraction, so for most *real* damage a rebuild will fail the same way the original operation did. That's why the page **demotes Rebuild and promotes [Find a replacement](replacing-a-file.md)** on those rows.

    The button placement is a **recommendation, not a limitation** — Rebuild is still there, and it's still worth one click if you're not sure which kind of problem you have.

### Dismiss

!!! info "Dismiss is keyed to the file, not the message"
    A dismissal lifts by itself if the file is **rewritten on disk and still fails**. You don't have to remember to un-dismiss anything.

    It deliberately does *not* match on the error text, because a damaged archive raises a **different error depending on which page happens to be read first** — so matching on the message would let the same broken comic come back as a "new" problem over and over.

### Unreachable rows

If a library is unmounted — a sleeping NAS, a disconnected share — its rows come back marked **unreachable**, and **Remove** is the only action offered.

CLU deliberately won't prune rows it can't positively prove are gone. A mount that's simply asleep would otherwise empty the page overnight and take the record of every real problem with it.

### An unwritable cache is not a damaged comic

!!! info "When the failure is CLU's own `/cache`"
    Some thumbnail failures aren't about the archive at all — the comic reads fine and CLU can't **write** the result, usually because `/cache` has the wrong ownership or is mounted read-only.

    The page says so explicitly on those rows and **hides Delete entirely**. It is the one case where the fix is a permissions change rather than a replacement, and deleting a perfectly good comic would be exactly the wrong move.

    Check your `/cache` volume mapping and your `PUID`/`PGID`. See [Quickstart](../../getting-started/quickstart.md).

## The page caps at 2,000 open rows

A mount whose permissions are revoked mid-scan turns **every file in it** into an error. A 40,000-row page helps nobody and takes a long time to load, so CLU stops recording new open rows at **2,000**.

If you hit the cap, the problem is almost certainly one shared cause — a mount, a permissions change, a full disk — rather than 2,000 individually broken comics. Fix the cause and clear the rows.

## Related

- [Replacing a damaged file](replacing-a-file.md) — download a clean copy straight onto the damaged file's own path.
- [Single File Rebuild](../single-file-features/rebuild.md) — what Rebuild does, and what happens when it fails.
- [Folder Monitoring → Features](../folder-monitoring/features.md) — where **Unpack** rows come from.
