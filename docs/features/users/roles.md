---
description: The Reader, Clerk, and Store Owner roles and what each one can do
---

# Roles & Permissions

CLU has three roles in a strict hierarchy — **`reader` < `clerk` < `owner`** — and each role inherits everything below it. A Clerk can do everything a Reader can; a Store Owner can do everything a Clerk can.

## What each role can do

| Role | Can do |
| --- | --- |
| **Reader** | Browse and read comics, track their own reading history and reading position, keep their own favorites, To Read list, and stats, view reading lists, set their own theme and dashboard layout, and manage their own API tokens. |
| **Clerk** | Everything a Reader can do, plus file management, renaming, metadata and scraping, downloads, the Pull List, Wanted Issues, Weekly Packs, and Releases. |
| **Store Owner** | Everything a Clerk can do, plus app settings, user management, library and folder grants, provider credentials, database tools, [Problem Files](../problem-files/index.md), logs, and system actions. |

!!! note "Clerk role maturity"
    The Clerk role is active but less widely tested than Reader and Store Owner. If something in the Clerk surface behaves unexpectedly, please report it.

## Minimum role by feature

| Feature / page | Minimum role |
| --- | --- |
| [Collection](../collection/index.md) browsing and the [reader](../collection/reading.md) | Reader |
| [Reading Lists](../collection/reading-lists.md) — viewing and bookmarking | Reader |
| [Reading Lists](../collection/reading-lists.md) — **Track Wanted** *(new in v6.5)* | Clerk |
| [My Account](my-account.md) — theme, dashboard layout, own API tokens | Reader |
| [File Manager](../file-management/index.md) and all file operations | Clerk |
| [Pull List](../pull-list/index.md), [Releases](../pull-list/releases.md), [Wanted](../pull-list/wanted.md), [Weekly Packs](../pull-list/weekly.md), [Series Search](../pull-list/series-search.md), [Publishers](../pull-list/publishers.md) | Clerk |
| [Download Status](../file-downloads/status.md) and grabbing from any source | Clerk |
| Metadata scraping, Metadata History, [Source Wall](../collection/source-wall.md) | Clerk |
| [App Logs](../app-settings/logs.md) | Clerk |
| [Settings](../app-settings/index.md) — every tab | Store Owner |
| **Users** — creating accounts, roles, library and folder grants | Store Owner |
| Library and publisher create/edit/delete, provider credentials | Store Owner |
| [Database tools](../app-settings/database.md), [Database Recovery](../app-settings/database-recovery.md), [Schedules](../app-settings/schedules.md), GCD import, restart, rebuild index | Store Owner |
| [Problem Files](../problem-files/index.md) and **Find a replacement** | Store Owner |

## The default policy

Anything not explicitly classified falls back to a simple rule:

- **Reads** (`GET`) default to **Reader**.
- **Mutations** (`POST` / `PUT` / `DELETE` / `PATCH`) default to **Clerk**.
- **Store Owners always pass.**

The default is deliberately conservative: a new endpoint that nobody has classified is Clerk-gated rather than open.

### Readers may still POST their own personal data

The mutation-means-Clerk default has a carve-out for data that belongs to the person making the request. Readers can write:

- Read history and read/unread state
- Reading position (where they left off in an issue)
- Reading stats
- Favorites
- To Read and On the Stack
- **Their own theme and dashboard layout**
- Their own API tokens

Everything in that list is scoped to the requesting user, so a Reader can never write over somebody else's copy. See [Per-User Data](personal-data.md).

!!! info "Why Bookmark is Reader but Track Wanted is not"
    Both buttons sit next to each other on a [reading list](../collection/reading-lists.md), so the split is worth stating.

    **Bookmarking** a list is personal data — it changes one person's dashboard and nothing else. **[Track Wanted](../collection/reading-lists.md#track-wanted)** spends **bandwidth and disk**: every unmatched entry in the list becomes a wanted issue that the nightly sweep searches for and downloads. That's a shared consequence, so it takes the role that manages the list.

!!! warning "Gating is not just cosmetic"
    Role enforcement covers **both** nav visibility and direct-URL access. Hiding a menu item is a convenience; typing the URL for a page above your role returns **403**, and so does calling its API directly.
