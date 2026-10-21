---
description: Review duplicate comics found by the library health scan, keep one copy and trash the rest
---

# Duplicates

!!! info "New in v6.8"
    The **Duplicate Files** page is new in **v6.8**.

The [library health scan](index.md#library-health-scan) groups copies of the same comic. The **Duplicate Files** page is where you review those groups: pick the copy to keep, and send the rest to the [trash](../file-management/delete.md).

Find it from [Problem Files](index.md) with the **Review duplicates** button, or from the Library Health in [Guided Setup](../../getting-started/guided-setup.md#library-health).

!!! warning "Store Owner only"
    Like Problem Files, the Duplicates page is [Store Owner](../users/roles.md) only.

<!-- TODO: screenshot — the Duplicate Files page with an exact and a likely group (assets/settings/duplicates.png) -->

## Exact and likely groups

| Group | Why it's grouped | How sure |
| --- | --- | --- |
| **Exact** | *Identical files (same content hash).* The files are byte-for-byte identical. | Certain. |
| **Likely** | *Tagged as the same series, issue and year, with matching file names*, or *same name in one folder, apart from a copy marker* (`Comic (1).cbz` next to `Comic.cbz`). | **Check before you trash.** A variant cover or a different scan can match on tags. |

Each group shows how much space you'd get back by keeping one copy.

!!! info "Only checked files can be exact duplicates"
    The scan works through the library a batch at a time, and a file can only join an **exact** group once the scan has read it. On a large library the list fills in over several runs. An empty page means *no duplicates among the files checked so far*. The coverage figure on [Problem Files](index.md#library-health-scan) shows how far the scan has got.

## Picking the copy to keep

Each file in a group is listed with its folder, size and modified date, plus badges for **Damaged**, **Tagged** or **No ComicInfo**, and the metadata provider.

CLU pre-selects a keeper, preferring a copy that is, in order:

1. Not damaged
2. Tagged with `ComicInfo.xml`
3. A `.cbz`
4. Larger
5. Newer

Change the **Keep** button if you'd rather keep a different one.

## Actions

| Action | What it does |
| --- | --- |
| **Compare** | For a pair, a read-only side-by-side view of tags, pages and file details. |
| **Keep selected, trash the rest** | Asks you to confirm, listing what is kept and what is trashed, then moves the others to the trash. You can restore them from there. |
| **Dismiss** | Hides the group **until the next health scan**. It comes back if that scan still finds it. |
| **Not duplicates** | Hides the group **for good**. It comes back only if another copy turns up. |
| **Restore** | Turn on **Show dismissed** to see hidden groups, labelled *Dismissed until next scan* or *Marked not duplicates*, and restore one. |

Nothing is removed unless you choose a copy to keep. Before trashing, CLU checks again that the group hasn't changed. If a new copy has appeared since the page loaded, you get a *Group changed* message: reload and review the group again.

## Related

- [Problem Files](index.md): the health scan, coverage and damaged files.
- [Delete](../file-management/delete.md): how the trash works.
