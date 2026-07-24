---
description: Search Usenet and GetComics together, grab an issue, and let CLU import it
---

# Searching & Grabbing

Once you've added an [indexer](indexers.md) and a [download client](setup.md), Usenet is wired into CLU's search — both the manual per-issue search on the series page and the [Wanted Issues](../pull-list/wanted.md) page.

## Where you can search

- **Series page (manual search)** — searching for a specific issue now queries the GetComics site **and** your enabled indexers in [priority order](source-priority.md), with a grab button on every result and per-indexer error reporting when something's misconfigured.
- **Wanted Issues page** — the same combined search runs from your wanted list. Both sources appear under labeled section headers, ordered by your Source Priority.

<!-- TODO: screenshot — dual-source results on the Wanted page (assets/usenet/wanted-dual-search.png) -->

!!! info "Usenet stays hidden until it's ready"
    Usenet results only appear once you've added an indexer. If you have indexers configured but **no active download client**, CLU warns you so grabs don't silently fail.

## Grabbing a result

Click the **grab** button on any Usenet result. CLU submits the release to your download client as real NZB content, and a background poller tracks it to completion.

When the download finishes, the comic is moved into your **WATCH** folder as:

```
<series> <issue>.cbz
```

From there the normal [wanted-matching pipeline](../pull-list/wanted.md) picks it up exactly as it would any other file that lands in WATCH — matching it to the wanted issue and filing it into your library.

!!! info "Multipart / obfuscated releases"
    Some Usenet releases arrive as nested, multi-part archives instead of a ready comic. CLU unwraps those automatically — see [Auto-Unwrap for Hybrid & Multipart Releases](../folder-monitoring/features.md#auto-unwrap-for-hybrid-multipart-releases).

## No-issue and bare-title releases

Releases that don't include an identifiable issue number (or are just a bare series title) **appear in manual search** so you can grab them by hand if you know what they are — but they are **excluded from auto-download**. This keeps the nightly job from grabbing an ambiguous release that only matched on series and year.

!!! info "New in v6.0"
    Combined GetComics + Usenet search and grabbing is new in **v6.0**.
