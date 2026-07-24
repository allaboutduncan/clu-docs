---
description: Download comics from Usenet with SABnzbd or NZBGet and Newznab indexers
---

# Usenet Downloads

!!! info "New in v6.0"
    Usenet download support is new in **v6.0**. It sits alongside the existing [File Downloads](../file-downloads/index.md) (GetComics) flow — it is not a replacement.

CLU can now download comics from **Usenet** (newsgroups) in addition to the Direct Download site. The whole system mirrors the metadata-provider design you already know: you add a download client, add one or more indexers, and set a **Source Priority** that decides whether Usenet or GetComics is tried first.

## How it fits together

Usenet support has three pieces, all configured from the new **Download Clients** tab in Settings:

| Piece | What it is | Docs |
| --- | --- | --- |
| **Download client** | The app that actually downloads and assembles NZBs — **SABnzbd** or **NZBGet**. | [Adding a Download Client](setup.md) |
| **Indexers** | One or more **Newznab** indexers that CLU searches for releases. | [Adding Newznab Indexers](indexers.md) |
| **Source Priority** | The rule that decides whether Usenet or GetComics is tried first for search and auto-download. | [Source Priority](source-priority.md) |

Once configured, Usenet is wired into manual search on the series page, the [Wanted Issues](../pull-list/wanted.md) page, and nightly auto-download. See [Searching & Grabbing](search-and-grab.md) for the day-to-day workflow.

## Requirements

To use Usenet downloads you need:

- A **Usenet provider** account (your news server — this is what your download client connects to).
- A **download client** — SABnzbd or NZBGet — reachable from CLU.
- At least one **Newznab indexer** with an API key.

!!! warning "Usenet provider vs. indexer"
    These are two different services. Your **provider** stores and serves the articles; your **indexer** tells CLU *where* a release lives. You configure the provider inside SABnzbd/NZBGet, and the indexer inside CLU.
