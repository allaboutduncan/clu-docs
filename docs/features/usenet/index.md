---
description: Download comics from Usenet using SABnzbd or NZBGet and Newznab indexers.
---

# Usenet Downloads

CLU supports downloading comics from **Usenet** (newsgroups) alongside [Direct Downloads (GetComics)](../file-downloads/index.md) and [DC++](../dcpp/index.md).

Configured from the **Download Clients** tab in Settings, the Usenet subsystem mirrors the modular design of CLU's metadata providers: you connect a download client, add one or more Newznab indexers, and assign Usenet a priority ranking in [Source Priority](source-priority.md).

## How It Fits Together

Usenet support consists of three core components:

| Component | Purpose | Documentation |
| --- | --- | --- |
| **Download Client** | The application that downloads articles and unpacks NZBs (**SABnzbd** or **NZBGet**). | [Adding a Download Client](setup.md) |
| **Indexers** | One or more **Newznab** indexers that CLU queries for comic releases. | [Adding Newznab Indexers](indexers.md) |
| **Source Priority** | The priority ranking that determines whether Usenet, GetComics, or DC++ is searched first during automated sweeps. | [Source Priority](source-priority.md) |

Once configured, Usenet integrates seamlessly into manual single-issue searches on the [Series page](../pull-list/series.md), the [Wanted Issues](../pull-list/wanted.md) dashboard, and nightly automated download sweeps. See [Searching & Grabbing](search-and-grab.md) for day-to-day workflows.

## Prerequisites

To use Usenet downloads, you need:

- A **Usenet Provider** account (the news server containing binary articles that your download client connects to).
- A **Download Client** (SABnzbd or NZBGet) running and reachable over the network by CLU.
- At least one **Newznab Indexer** account with a valid API key.

!!! info "Usenet Provider vs. Indexer"
    These represent two distinct services:
    - Your **Usenet Provider** stores and delivers binary data; server credentials are configured inside SABnzbd or NZBGet.
    - Your **Indexer** catalogs releases and provides searchable `.nzb` metadata; indexers and API keys are configured inside CLU.
