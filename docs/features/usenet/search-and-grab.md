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

## Grabs no longer create ".cbz" folders

!!! info "Fixed in v6.3"
    A grab for `Heavy Metal 5.cbz` no longer produces a **directory** named `Heavy Metal 5.cbz`.

CLU was handing the NZB client the destination **filename**, extension included, and download clients name the completed job folder after whatever you submit. The result was a folder called `Heavy Metal 5.cbz` holding the real comic — which the [folder monitor](../folder-monitoring/index.md) then read as a comic *file*, producing a series folder named `Heavy Metal 5.cbz` and nothing at the TARGET level at all.

The submitted name is now stripped of its extension before it reaches the client.

!!! info "You don't need to re-grab"
    The monitor-side half of the fix strips comic extensions when deriving folder names, so it also **repairs folders already queued at your client** — and folders created this way by other download clients.

!!! info "New in v6.0"
    Combined GetComics + Usenet search and grabbing is new in **v6.0**.
