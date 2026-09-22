---
description: Download a clean copy of a damaged comic straight onto the damaged file's own path
---

# Replacing a damaged file

!!! info "New in v6.5"
    **Find a replacement** is new in **v6.5**, and is reached from a row on the [Problem Files](index.md) page.

For most real archive damage, [Rebuild](index.md#what-you-can-do-about-a-row) can't help — the bytes are gone. What you actually want is a clean copy of the same issue, filed in the same place, with the damaged one taken away. That's what this does.

## Why this had to be built

CLU's normal import only files issues that are **missing**. A corrupt file is still a file, so an ordinary download of the same issue would be matched against a slot that is already occupied, and the replacement would sit in your processed folder forever while the broken copy stayed in your library.

**Find a replacement** breaks that tie: the download is claimed for the damaged file's own path from the moment you queue it.

## The flow

1. **Search.** Click **Find a replacement** on a Problem Files row. The [source search](../file-downloads/send.md#the-search-modal) opens pre-filled from the filename, querying every configured source.
2. **Queue a download.** Pick a result as you normally would.
3. **CLU claims it for that path.** The queued download is bound to the damaged file, not just to the series.
4. **When it lands, CLU verifies it** — see [below](#the-replacement-is-checked-before-anything-is-destroyed).
5. **The swap.** The damaged copy goes to the [trash](../file-management/delete.md) and the replacement moves into its place, taking its name.
6. **A banner on the Problem Files page reports the result** until you dismiss it.

<!-- TODO: screenshot — a claimed replacement and the result banner (assets/settings/problem-files-replacement.png) -->

## What you'll see while it runs

| State | What you'll see | What to do |
| --- | --- | --- |
| **Claimed** | A download has been queued and bound to this file. | Nothing — wait for it to land. |
| **Applied** | The swap completed. The damaged file is in the trash and the row is gone. | Nothing. Empty the trash when you're happy. |
| **Failed** | Verification failed, or the move couldn't complete. **Nothing was changed.** | Run **Find a replacement** again and pick a different release. |
| **Held** | The download arrived in a format that can't replace the original yet — see [below](#a-cbr-wont-replace-a-cbz). | Nothing. The swap happens on a later pass. |

## The replacement is checked before anything is destroyed

!!! info "A failed verification is a no-op"
    Before anything moves, the downloaded file is **CRC-checked end to end** and must actually contain pages. A zero-page archive, a truncated download, or an HTML error page saved with a `.cbz` name all fail here.

    **A partly-readable original is worth more than a broken replacement**, so if verification fails, *nothing moves*. The damaged file stays exactly where it is and the row stays on the page.

The damaged file goes to the **trash**, never straight to deletion — and if the swap fails part-way through, CLU **puts it back**. You can undo this yourself if you change your mind.

## A CBR won't replace a CBZ

!!! info "That's a hold, not a failure"
    If the replacement arrives as a CBR and the file it's replacing is a CBZ, the swap doesn't happen yet. This is recorded as a **hold**, not an error — it means the [conversion pipeline](../directory-features/convert.md) hasn't reached the file yet. The swap happens on a later pass, once it's a CBZ.

    The reverse is allowed: a **CBZ replacing a damaged CBR** is an upgrade, and goes through immediately.

## You don't have to sit on the page

The swap is also applied by the normal download sweep, so closing the tab doesn't strand anything — the replacement will still be applied when it arrives.

The **banner is the only place the result is reported**, though, because a successful swap deletes the Problem Files row it came from. If you navigate away and come back to a page with one fewer row, that's what happened.

## A failed swap stops retrying

!!! warning "Deliberately"
    If a replacement fails verification, CLU **does not try that download again**, and does not keep trying nightly.

    Retrying the same bad release every night would produce the same bad file every night. Run **Find a replacement** again and pick a **different release** instead.

## Related

- [Problem Files](index.md) — the page this is launched from.
- [Click to Download → The Search Modal](../file-downloads/send.md#the-search-modal) — the search window that opens.
- [Download Status Page](../file-downloads/status.md) — where the replacement download itself appears while it runs.
