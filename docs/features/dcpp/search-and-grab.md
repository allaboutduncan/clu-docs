---
description: Search DC++ hubs from the source-search modal, and how results are scored
---

# Searching & Grabbing

Once [AirDC++ is configured](setup.md), DC++ appears as a third section in CLU's source-search modal, alongside GetComics and Usenet.

## Where you can search

- **Series page (manual search)** — searching for a specific issue queries GetComics, your Usenet [indexers](../usenet/indexers.md), **and** your DC++ hubs.
- **[Wanted Issues](../pull-list/wanted.md)** — the same combined search runs from your wanted list.
- **[Reading Lists](../collection/reading-lists.md)** — the reading-list search modal gained Usenet and DC++ sections in v6.3; it was GetComics-only before.

Each source gets its own labeled section header, ordered by [Source Priority](../usenet/source-priority.md).

!!! info "The modal searches everything you've configured"
    Source Priority controls the order of these sections, and it governs which sources the **auto-download** cascade uses. The **manual modal queries every configured source** regardless of ranking — a client you never ranked is still searchable by hand. See [Source Priority](../usenet/source-priority.md).

## Hub searches are slow — that's normal

!!! info "Hub searches are slow"
    A DC++ search typically takes **around 30 seconds**. This is not CLU stalling.

    AirDC++ **queues** searches and paces them per hub to avoid getting you kicked. Measured against a live two-hub setup, the query wasn't even dispatched for roughly **17 seconds**, with results settling around **30 seconds**.

    CLU waits on the AirDC++ instance's **own progress counters** rather than a fixed timeout — an earlier flat timeout gave up before the query had even been sent. The wait is capped at **45 seconds**, and CLU returns early once results stop arriving.

Usenet and GetComics results appear far faster. Expect the DC++ section to fill in last.

## Result scoring

DC++ results run through the **same scorer** as GetComics and Usenet, and collapse into the same three tiers:

| Tier | Meaning |
| --- | --- |
| **ACCEPT** | A confident match for the series, issue, and year. Eligible for [auto-download](../pull-list/wanted.md). |
| **FALLBACK** | A plausible match with something missing or ambiguous. Used only when nothing better exists. |
| **REJECT** | Not a match. Shown for manual review, never auto-grabbed. |

Alongside the tier, results show the number of users sharing the file — a higher count generally means a faster, more reliable download.

## Back-catalogue naming

Comic hubs name older files in their own dialect:

```
196103 Strange Tales v1 083.cbz
```

That's a **`YYYYMM` cover-date prefix** and a **`vN` volume token** — a shape the shared scorer, which expects scene-style `Series 083 (1961)`, does not recognize. Every date-prefixed file previously scored **REJECT**, which made the entire Golden and Silver Age catalogue unreachable while modern releases matched fine.

CLU now **normalizes these titles before scoring**, so the back catalogue is matchable.

Two details worth knowing:

- **Displayed titles are the real filename.** Only the *scored* form is normalized. What you see in the results list is exactly what's on the hub, so you can always tell what you're grabbing.
- **The declared volume is compared separately.** Stripping the `vN` token to make the title scorable would also throw away the scorer's chance to catch a volume mismatch, so CLU extracts the volume first and rejects a wrong one on its own.

## Grabbing a result

Click **download** on any DC++ result and CLU queues the bundle in AirDC++, then tracks it on the [Download Status](status-and-recovery.md) page. When it completes, CLU moves it into **WATCH** and the normal import pipeline takes over.

You can also use **download and keep searching** to queue a result without closing the modal — see [Click to Download](../file-downloads/send.md#queue-more-than-one-at-a-time).

!!! warning "DC++ rows re-arm on a new search"
    For GetComics and Usenet, a queued row stays **locked for the rest of your visit**, so you can't send the same release twice. DC++ is the exception: its result tokens belong to a **single live search instance** and are re-minted every time you search. Re-running a search gives DC++ results brand-new tokens, so those rows come back armed.

    Nothing breaks if you grab the same bundle twice — AirDC++ recognizes it — but the row will not remember that you already took it.
