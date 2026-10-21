---
description: Search Usenet alongside other sources, grab releases, and track automated ingestion.
---

# Searching & Grabbing

Once you have configured an [indexer](indexers.md) and an active [download client](setup.md), Usenet is integrated across CLU's manual and automated search interfaces.

## Where Usenet Appears

- **Series Page (Manual Search)**: When searching for a specific issue, CLU queries your enabled indexers alongside GetComics and DC++, ordering results according to your [Source Priority](source-priority.md).
- **Wanted Issues Dashboard**: The combined search modal on the [Wanted Issues](../pull-list/wanted.md) page displays Usenet results under dedicated section headers with direct **Download** action buttons.
- **Automated Sweeps**: The nightly wanted-issues sweep queries enabled indexers automatically based on your Source Priority ranking.

!!! info "Activation Requirement"
    Usenet results only appear in search interfaces once at least one indexer is enabled. If indexers are active but no download client is configured, CLU displays a warning indicator so grabs do not silently fail.

## Grabbing a Release

When you click **Download** on a Usenet search result:

1. CLU dispatches the release's NZB payload directly to your configured download client (SABnzbd or NZBGet).
2. The download client verifies, repairs, and unpacks the binary articles, reporting live progress to CLU's [Download Status](../file-downloads/status.md) dashboard.
3. Completed comic files are transferred into your **WATCH** directory.
4. The [Folder Monitoring](../folder-monitoring/index.md) pipeline detects the new arrival, matches it against your wanted list, standardizes the filename, and moves the comic into your library.

!!! tip "Multipart and Obfuscated Usenet Releases"
    Usenet releases frequently arrive as nested split-volumes or multi-layer archives (e.g. `.zip` parts containing a `.rar` that wraps the comic). CLU's background pipeline automatically unwraps and extracts these archives layer-by-layer. See [Auto-Unwrap for Hybrid & Multipart Releases](../folder-monitoring/features.md#auto-unwrap-for-hybrid-multipart-releases).

## Ambiguous and Bare-Title Releases

Releases on Usenet that do not contain an identifiable issue number in their title (or consist solely of a bare series title) are treated with caution:

- **Manual Search**: These releases remain visible in manual search modals so you can inspect and grab them if you recognize the release.
- **Automated Sweeps**: Ambiguous releases without issue numbers are strictly excluded from automated auto-download sweeps, preventing false-positive grabs for unrelated annuals or one-shots.
