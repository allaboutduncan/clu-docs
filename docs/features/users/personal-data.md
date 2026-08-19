---
description: What CLU scopes to each user, and the two things that are still shared
---

# Per-User Data

Sharing a library shouldn't mean sharing a reading history. Nearly everything personal in CLU is scoped to the account that created it.

## What is yours alone

| Data | Notes |
| --- | --- |
| **Read history and read/unread state** | Marking an issue read never changes what anyone else sees. |
| **Reading positions** | Where you left off in an issue. These [follow a file through renames, moves, and CBR→CBZ conversion](../collection/reading.md). |
| **To Read / Want to Read** | Including [bookmarked reading lists](../collection/reading-lists.md). |
| **On the Stack** | Built from your own subscriptions and your own bookmarked lists. |
| **Favorite series and favorite publishers** | |
| **Reading lists** | |
| **[Insights](../insights/index.md), the reading timeline, and CLU Wrapped** | Backed by a per-user stats cache, so one user's numbers can never be served to another. |
| **Recently Added** | Also filtered to the [folders you've been granted](library-and-folder-access.md). |
| **Theme** | Your own [Bootswatch theme](my-account.md#appearance). *(New in v6.3.)* |
| **Dashboard layout** | Your own section order and hidden sections. *(New in v6.3.)* |
| **API tokens** | See [My Account](my-account.md#api-tokens). |

## Operations and notifications

Long-running operations and their toast notifications are scoped to whoever triggered them. The progress indicator shows **your** jobs, not everybody's. The Store Owner still sees the whole picture.

## Still shared

!!! info "Still shared"
    Two things remain app-wide rather than per user:

    - **[Komga sync](../app-settings/download-settings.md)** targets a **single shared server and account**, attributed to the Store Owner. Every user's sync activity lands on that one connection. This is a known follow-up.
    - **The [AI recommendation service](../app-settings/personalization.md#recommendations)** is configured once, globally. It is not a display preference — the toggle gates an owner-configured service holding a **shared API key**, so exposing it per user would mean handing every account the ability to spend against the owner's key.

Everything else that used to be app-wide — notably the theme and the dashboard layout — is now per user. See [My Account](my-account.md).
