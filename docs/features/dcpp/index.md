---
description: Download comics from DC++ hubs through your own AirDC++ Web Client
---

# DC++ Downloads

!!! info "New in v6.3"
    DC++ support is new in **v6.3**. It is a **third** download source alongside [File Downloads](../file-downloads/index.md) (GetComics) and [Usenet](../usenet/index.md) — not a replacement for either.

CLU can search DC++ hubs and queue downloads from them. Completed bundles land in your **WATCH** folder through the same mover [Usenet](../usenet/index.md) uses, so import behaves identically to every other source once the file arrives.

## The target is AirDC++, not DC++

!!! warning "You need the AirDC++ Web Client"
    CLU talks to the **[AirDC++ Web Client](https://airdcpp-web.github.io/)** through its REST API. It does **not** talk to DC++ itself, or to ApexDC, FlylinkDC, or any other DC++ client.

    Those clients have **no remote API** for CLU to call. Pointing CLU at one will not work, and no amount of host/port fiddling will change that.

AirDC++ Web Client is a separate application that you install and run yourself. It connects to your hubs, and CLU drives it — much the same relationship CLU has with SABnzbd or NZBGet on the Usenet side.

## How it fits the pipeline

| Step | What happens |
| --- | --- |
| **1. Search** | CLU asks your AirDC++ instance to search its connected hubs, then scores the results the same way it scores GetComics and Usenet results. |
| **2. Grab** | You pick a result (or [auto-download](../pull-list/wanted.md) picks one). CLU queues it in AirDC++ and records the job in its database. |
| **3. Download** | AirDC++ downloads the bundle from the hub. CLU polls it for progress and shows it on the [Download Status](status-and-recovery.md) page. |
| **4. Import** | When the bundle completes, CLU moves it into **WATCH**, where [folder monitoring](../folder-monitoring/index.md) picks it up exactly as it would a Usenet or direct download. |

Because step 4 is shared, everything downstream — renaming, metadata, filing into the library — is identical no matter which source the file came from.

## Requirements

- A running **[AirDC++ Web Client](https://airdcpp-web.github.io/)** instance, reachable from CLU over HTTP.
- An AirDC++ **username and password** with API access.
- At least one **hub** connected in AirDC++, sharing comics.
- A **download folder** that AirDC++ writes to and CLU can also read. See the [two-paths warning](setup.md#two-different-paths) — this is the single most common setup mistake.

## In this section

- **[Adding AirDC++](setup.md)** — connecting CLU to your instance, and getting the two path settings right.
- **[Searching & Grabbing](search-and-grab.md)** — the DC++ section of the search modal, scoring, and why hub searches take ~30 seconds.
- **[Status & Restart Recovery](status-and-recovery.md)** — tracking bundles, and what survives a container restart.

DC++ also participates in [Source Priority](../usenet/source-priority.md), which now ranks **three** sources rather than two.
