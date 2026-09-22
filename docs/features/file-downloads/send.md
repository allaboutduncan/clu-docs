---
description: Right-click and send to CLU for download
---

# Click to Download

## Supported Sites

Currently, GetComics.org and [Comic Book Plus](https://comicbookplus.com) are supported for downloads.

As you browse these sites and find a book you'd like to read, v2 of the extension will append a `CLU` icon next to the supported download link(s).

![Click to send to CLU](../../assets/download/append.png){: .center-image}
/// caption
Click to send to CLU
///

Clicking this will send the download request to CLU and you'll see it show up in the download status page.

Some older style links may not have the icon appended. In this case, you can right click one of the [supported download providers](send.md#supported-providers) and you should see `Send to CLU` in your context menu

![Send download to CLU](../../assets/download/send.png){: .center-image}
/// caption
Send download to CLU
///

You can then navigate to the Download Status page in CLU (http://localhost/status) and watch the progress of the file download

### Supported Providers <a href="#supported-providers" id="supported-providers"></a>

All supported providers are free tier only and currently do not support login or credentials.

#### **GetComics.Org**

Indicated by Red Download Now and Blue Mirror Download buttons.

#### **Pixeldrain**

Indicated by the Pixeldrain button

#### **Mega.nz**

Indicated by the Mega button

#### **Comic Book +**
When logged in and browsing [https://comicbookplus.com](https://comicbookplus.com), right-click on the "Download File" link

## The Search Modal

Separately from the browser extension, CLU has a **source-search modal** you open from inside the app — on a series page, the [Wanted Issues](../pull-list/wanted.md) page, and the [Reading Lists](../collection/reading-lists.md) page. It queries every configured download source at once: GetComics, [Usenet](../usenet/index.md), and [DC++](../dcpp/index.md), each under its own section header ordered by [Source Priority](../usenet/source-priority.md).

### Queue more than one at a time <a href="#queue-more-than-one-at-a-time" id="queue-more-than-one-at-a-time"></a>

!!! info "New in v6.3"
    Every result now has **two buttons**: **download**, or **download and keep searching**.

Clicking a result used to queue it *and close the modal*, which made queuing a terminal action — so spotting a second or third file you wanted meant reopening the modal and re-running the entire search for each one.

| Button | What it does |
| --- | --- |
| **Download** | Queues the release and closes the modal. The original behavior. |
| **Download and keep searching** | Queues the release and leaves the modal open, so you can carry on browsing the same result set. |

### Duplicate protection

Because the grab endpoints aren't idempotent, keeping the modal open needs protection against sending the same release twice:

- **Both buttons in a row lock together** while a grab is in flight. Otherwise the second button stays live and the same release gets sent twice.
- **Queued rows stay locked for the visit.** Narrowing your query and re-searching brings already-taken rows back **locked** rather than arming them again.

!!! warning "DC++ is the exception"
    DC++ result tokens belong to a **single live search instance** and are re-minted on every search, so DC++ rows **re-arm** when you run a new search. They can't be matched back to what you already queued. See [DC++ Searching & Grabbing](../dcpp/search-and-grab.md).

## Downloading the right comic

!!! info "Fixed in v6.5 — CLU downloaded a comic you didn't ask for"
    This is the most consequential fix in the release, and it's worth describing by its **symptom**, because that's what people searched for.

    A GetComics **listing** page — a weekly update post, a Top-10 roundup — holds **many unrelated comics**. CLU used to fetch the **first download link on the page**, whatever it was aiming for. So a run of wanted issues could all quietly download the **same unrelated comic**, each one filed under the name of the issue it was supposed to be.

    **A download of the wrong comic under the right name is worse than no download**, because nothing looks broken until you open it. CLU now takes the **specific entry** it was after, or nothing at all.

### Posts split into several downloads

A GetComics post is often split into parts — "#1–15", "#16–30", "#31–50". CLU used to take the **first part** regardless of which issue it wanted. The correct part is now picked **per issue**.

### One sweep at a time

If a scheduled download run is already in progress, **Run Now** and the next scheduled trigger **stand down** rather than starting a second copy that re-queues everything the first run is still working through.

!!! info "Check for Missing Issues is the exception"
    A full sweep does **not** block the per-series **[Check for Missing Issues](../pull-list/wanted.md#check-for-missing-issues)** button.

    Clicking that is an explicit request about **one series**, and making you wait out a multi-hour sweep would be worse than the single duplicate download it can occasionally cost.

### A sweep queues at most 150 downloads

This is a **blast-radius limit, not a throughput limit**. Hitting it stops that run; the rest is picked up on the next one.

Worth knowing so that hitting the cap doesn't look like data loss — nothing has been dropped or forgotten, it's just been deferred.

### A rate-limited host is stood down

When a host starts refusing requests, CLU now **stops asking it for a while** instead of asking again on every queued item.

MEGA in particular used to produce **dozens of identical "Too many requests" failures** against a handful of files, burning the queue without downloading anything.

A cooling host is **moved to the back of the list, not dropped** — so it's still used when it's the only link a post offers.
