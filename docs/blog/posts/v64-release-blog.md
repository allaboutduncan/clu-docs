---
title: v6.4 - Push Notifications, Folder Art Styles, Metron Tokens, & Credit Repair
date: 2026-09-01
categories:
  - Releases
  - Updates
authors:
  - allaboutduncan
---

Until now, the only way CLU could tell you anything was via a toast in a browser. In v6.4, you can add **push notifications** via **Apprise** — one URL, 100+ services, and a push when a download finishes, fails, or a wanted issue lands in your library.

Alongside it: **folder cover art gets four styles** and you can pin any issue's cover as the folder's art; **Metron API token support**; and a **credit repair sweep** that fixes comics missing creator metadata.

There's other improvements too: downloads retry themselves before reporting failure, the Docker image is **less than half the size it was**, and archives dropped in WATCH now always get unpacked.

<!-- more -->

### Push Notifications

CLU had no outbound notification path at all. The in-app toast list is process-local and expires after 300 seconds, so if you weren't looking at the browser, nothing told you anything had happened.

v6.4 adds [**Apprise**](https://github.com/caronc/apprise) — one dependency, one URL scheme, and over a hundred services behind it. Paste one or more URLs into the new **Notifications** tab in Settings, tick the events you care about, and you get a push when:

- **a download completes**
- **a download fails**
- **wanted issues land in your library**

The URL *is* the configuration. Here are some examples:

`discord://webhook_id/webhook_token`
`tgram://bottoken/ChatID`
`ntfy://topic`
`mailto://user:pass@gmail.com`

Apprise parses the scheme and does the rest. Multiple URLs, one per line, all fire together. A **Send Test Notification** button proves it works before you rely on it.

!!! warning "Notification URLs contain credentials"
    Apprise URLs embed bot tokens and SMTP passwords. They're stored and displayed in plaintext, exactly as the existing API keys are. They're **redacted before anything reaches the logs**, so a debug package won't leak them — but treat the Notifications tab as sensitive.

Three things about how this is wired that are worth knowing:

- **Downloads settle in three independent places** — CLU's own HTTP downloader, the Usenet poller, and the DC++ poller — so there are three hook sites rather than one. All three go through the same code, so all three notify identically.
- **Cancellations never notify.** Aborting a transfer is how a cancel surfaces from most providers, so the failure path runs for cancels too. The notification deliberately sits *after* the cancel guard, so cancelling a download doesn't push you a failure.
- **Wanted issues send one digest per sweep**, not one push per issue. A catch-up sweep can import dozens of issues at once; the digest enumerates up to 20 and adds an "and N more" tail.

A hung Discord webhook can't block a download — every send runs on its own daemon thread, and every failure is noted in the log. **A notification must never break the download it's reporting on.**

!!! info "Not covered yet"
    The "On the Stack" new-issue notice, notifications for newly-*discovered* wanted issues, and files imported by the folder monitor. The monitor runs as its own OS process and needs its own config read to participate.

![Notifications tab in Settings](../../assets/settings/notifications.png){: .center-image}

***

### Downloads Retry Themselves

Related, and shipped in the same release: a failed download used to settle as `error` immediately, and you had to notice the red row on the Status page and click **Retry** by hand.

Most of those failures are transient — an overloaded GetComics mirror, a dropped connection, a 5xx — and would have worked on a second attempt a few minutes later. CLU already fails *over* between mirrors, but once the last mirror raised, that was the end of it.

A failed download is now parked and re-queued **up to 3 times, spaced 1, 5 and 15 minutes apart**. The Status page shows the wait live — `Retrying in 4m 12s (2 of 3)`, in warning colour, with the last error on hover, and a **Cancel** button instead of Retry.

Crucially, **the `download_failed` push is held back until the retries are spent.** A notification now means "this one is genuinely dead", not "the first mirror hiccuped" — and it tells you how many retries were burned getting there.

Two exceptions:

- **Cloudflare failures skip the retries entirely.** A managed challenge is the one failure no automated client can pass, so three more attempts would do nothing but delay the manual link you actually need by twenty minutes. Those rows now read **"Blocked by Cloudflare"** with a **Download manually** button that opens the original GetComics page — ahead of Retry, because Retry is pointless there.
- **Usenet and DC++ are unaffected.** Their clients do their own retrying.

***

### Four Looks for Folder Art

Folder cover art had exactly two looks, both hardcoded. You asked for more.

There are now **four styles**, selectable site-wide under **Settings → Personalization**, with a real preview of each:

| Style | Look |
| --- | --- |
| **Fanned Stack** *(default)* | Unchanged from today — up to four covers fanned at random rotations. |
| **Single Image** | One cover, full-bleed. |
| **Isometric Cascade** | 3–4 covers, no rotation, stepped up-and-right with crisp per-layer shadows. |
| **2x2 Mosaic Grid** | Quad-split, four tiles, interior dividers and one unified outer shadow. |

The previews aren't mockups — they're generated by running the actual composers, so they can't drift from what you'll get.

![Folder thumbnail style picker](../../assets/settings/thumbnail-styles.png){: .center-image}

#### Pin the cover you want

Any issue's three-dots menu gains **Set as Folder Thumbnail**. The pin is the folder's *primary* cover in **every** style — the whole image in Single, the front card in Fanned and Cascade, the top-left tile in the Mosaic — so switching styles never loses your choice.

#### Regenerate All Thumbnails

A style change only affects art that doesn't exist yet, so there's a **Regenerate All Thumbnails** sweep to apply it to art you already have. Run it from Settings for all libraries, or from a top-level folder's three-dots menu for one branch. It's destructive, so it sits behind a confirmation modal.

!!! warning "A sweep never touches the folder it was invoked on"
    Running it on `/data/DC Comics` restyles every series inside and leaves that publisher's own `folder.png` **alone**. A hand-picked publisher image is not what you're replacing when you restyle your series art. The all-libraries sweep excludes the library roots the same way.

Both sweeps now run on a background thread with live progress in Active Operations. The old Generate-All-Missing walked the whole tree inside the web request, which outlasts the 120-second gateway timeout on a real library.

The **folder-icon overlay** for nested folders is now its own site-wide switch, applied to whichever style you've picked, rather than a separate hardcoded look.

#### Two bugs found along the way

- **Single Image could produce a blank thumbnail.** It took cover index 0 blindly, so one corrupt cache entry left the folder with an empty `folder.png` — where every other style fell through to the next cover. Bad entries are now filtered out *before* the four-cover cap, so a corrupt file no longer eats one of the slots either.
- **`folder.webp` was invisible to the generator.** Two separate hardcoded extension lists omitted it, so an uploaded `.webp` survived a rebuild and kept winning — the new image was generated and then never shown. Both lists are now one shared list.

***

### Metron API Tokens, and an End to the Ban Loop

Two related changes, and the second one matters more than the first.

**Metron now supports token authentication.** Generate a token on your metron.cloud account page, paste it into the Metron card in Settings → Metadata Providers, and CLU sends it as a bearer token. The config page now shows an **auth method picker** — username/password or API token — and both stay fully supported.

**And bad credentials no longer hammer Metron until you're banned.** A user reported that after mistyping their Metron credentials, CLU kept sending requests until fail2ban blocked their IP, and a Metron admin asked for it to be reported.

The cause was structural rather than a stray retry loop. CLU couldn't tell a **401** apart from a miss — every API error was caught identically — and the "is Metron configured?" check was a presence-only string test, so credentials that *existed* were credentials that got used. Meanwhile the call volume is large and repeating: the nightly series sync makes one call per mapped series across your library, the Weekly Releases publisher warm is re-kicked by a 5-second browser poll, and credit backfill, library automap and post-download auto-tagging all loop too.

Metron's own [API best practices](https://metron-project.github.io/blog/api-best-practices) put it plainly: *"Only retry on 429 and 5xx. Retrying 4xx errors (other than 429) wastes requests."*

Now, **a 401 or 403 latches a block on all Metron traffic.** Nothing gets through — not the pacer, not a client fetched once and driven in a loop.

!!! info "The block does not time out"
    A rejected credential does not heal on its own, so there's no timed auto-retry. Only **saving your credentials**, **a successful connection test**, or the **Re-enable** button clears it. The block is persisted, so a container crash-looping with bad credentials doesn't resume hammering on every restart.

    **Test Connection is the one path allowed past the block** — otherwise you could never prove you'd fixed it.

Saving Metron credentials now verifies them in the same request, so you find out immediately. They're stored either way — refusing the save would strand you if Metron itself happened to be down.

One bug this surfaced: **arc pages would have broken silently under token auth.** The arc fetcher builds its own HTTP request to escape auto-pagination and was passing username/password unconditionally — both empty on a token session, which strips the only credential and 401s every arc page. It now sends basic auth only when there's a real pair.

![Metron auth method picker](../../assets/settings/metron-token.png){: .center-image}

***

### The Comics That Came Out With No Credits

Several people reported the same thing: comics tagged on release morning came out with **no creator credits at all**. Two files from the same sweep, five seconds apart — one with full credits, one with none. Both named Metron as the source, and Metron's API returns full credits for both issues.

The mapper was never at fault. The body CLU saw simply wasn't the body the API returns now, for two reasons that compound:

1. **The Metron client library's response cache had no working TTL.** It never checked the expiry column, and its cleanup only ran at startup — so on a long-lived container the effective TTL was *process uptime*. Worse, a fresh fetch could never displace a stale row; the old one had to be deleted.
2. **Metron finishes issue records after a comic ships.** One of the reported issues was still being edited two hours after the file was written.

Either way the file was stuck permanently: once ComicInfo carries `Notes`, every automatic tagging path skips it forever — and a manual re-tag did not work, because the cache purge only dropped *series* responses, never the issue detail, which is the response that carries the credits.

#### What changed

**Cache correctness.** There's now a precise issue-cache purge, and one entry point that every "fetch this issue in order to write it into a file" path goes through: purge, then fetch. Bulk re-tag uses it too — without it, "overwrite existing" was rewriting the same half-entered record it was meant to repair. **Refresh from Metron on a series page now also drops the issue bodies**, so it means what it says. Display-only reads still use the cache, because ids are stable and those lists are the bulk of the quota.

**A recovery sweep.** CLU finds credit-less files with a single index query — no archive I/O to select them — re-fetches each issue live, and **rewrites only when Metron now actually has credits**, merging so tags the file already carries survive. There's a `credit_backfill_enabled` toggle and a **Backfill Credits Now** button on the [Schedules](../../features/app-settings/schedules.md) page, and it runs automatically after each series sync behind its own guard so a backfill problem can never fail the sync.

**Then it got better.** Rather than guessing which files might be stale from local timestamps, the sweep now asks Metron directly: Metron stamps each issue with a `modified` date — the field that moves when an editor finishes a half-entered record — and CLU asks *which issues changed since the last sweep*, joins that against your library, and repairs those. One paged call replaces a detail fetch per candidate, and it finds a comic tagged a year ago whose record was completed last night, which no local timestamp can reveal. The credit-less pass stays as the safety net for the *other* cause.

The join is a new indexed column holding the file's Metron issue id, drained in the background at the lowest priority by the metadata scanner — **no big-bang rescan**, nothing to trigger, no restart cost.

!!! note "Editor credits now land too"
    Metron spells editorial roles out in full — *Executive Editor*, *Group Editor*, *Editor In Chief*, *Assistant Editor* — and CLU was matching role names exactly, so it found one name out of four. Editors now match on substring, mirroring how ComicVine already worked, and land in `<Editor>` on newly tagged files and on any file the backfill repairs.

!!! info "ComicVine has the same shape of problem"
    A day-of-release ComicVine issue often has no credits either, and the same "already has Notes" skip locks it in. The candidate query is provider-agnostic, so a ComicVine arm can be added behind the same entry point later.

![Backfill Credits on the Schedules page](../../assets/settings/credit-backfill.png){: .center-image}

***

### Also in v6.4

- **The Docker image is less than half the size.** **2.06 GB → 913 MB.** The dormant Scrape feature was already unreachable — its nav link had been commented out for months — and it was the only thing in the codebase using Playwright, so Chromium and the browser-only system libraries went with it. Two side effects worth noting: its six routes were **still live with no auth decorator**, and every page load was polling a status endpoint every 30 seconds for a badge that didn't exist.
- **Archives dropped in WATCH are always unpacked, and unpacked content-aware.** `AUTO_UNPACK` predated automated downloads and shipped **off**, so a fresh install silently stranded packs in WATCH. The setting is **removed** — the behaviour is now unconditional, and the dead key is stripped from your `config.ini` on next start. Two things fell out of the same code: a loose `.rar` was never unpacked at all (it's on the ignored-extensions list and, unlike `.zip`, had no exemption), and unpacking was content-blind — a `.zip` that was really a comic exploded into loose page images which the pipeline then moved one page at a time. CLU now peeks inside without extracting: ready comics get extracted beside the archive, page images mean **it is the comic** (a `.zip` is renamed to `.cbz`, never repacked), and anything unreadable gets a blind extract so nothing is stranded.
- **Pan the reader's zoom window.** Zooming always centred on the page, so a zoomed-in page could only ever show the middle of the artwork. `Shift`/`Ctrl`+arrows or `W`/`A`/`S`/`D` pan, `0` or `Home` re-centres without changing zoom, and the wheel pans (`Shift`+wheel horizontally). Bare arrows still turn pages and zoom, exactly as before. Two bugs went with it: `Ctrl`+arrow used to *blow the page up* rather than pan it, and the wheel was dead while zoomed.
- **A per-series "Check for Missing Issues" button**, next to API Sync and Refresh on a series page. It runs the same sweep the nightly job runs, scoped to that one series — and it **ignores that series' Monitor toggle**, because the toggle exists to keep the *unattended* sweep off a series and clicking the button is an explicit request. It won't make the nightly sweep look as though it had already run.
- **A compact table view for Weekly Releases.** Cards stay the default; a header toggle swaps in a paginationless table sorted on publisher, series and issue number, listing the whole week at once. Issue numbers sort numerically, so `-1 < 1 < 1.MU < 2 < 10`. Your choice is remembered across sessions and week navigation.
- **Turn off automatic metadata on move.** Moving a comic into a folder carrying a `cvinfo` triggers a provider lookup and a ComicInfo write. If you curate your own metadata and want a move to stay a move, there's now a switch — **default on**, since that's what every existing install already does. On-demand tagging is unaffected. While adding it, **Automatic Metadata** and **Metadata Match Validation** moved onto the **File Processing** tab.
- **A Jump to page select and a Back to top button** on the Browse Library pager. The windowed page numbers only reach ±2 from the current page, so the middle of a long library was unreachable without repeated clicking — and the slot next to them was spent on a duplicate of the per-page select three rows above. It's now a **Jump to** select labelled `3 of 47`, which can only offer pages that exist. The Back to top button returns you to the folder header without scrolling the grid by hand.

***

### Bug Fixes

- **`-1` issues are recognized instead of reported as wanted.** Marvel's 1997 "Flashback" month numbered its books **-1**, which is a real issue number, not a negative to be discarded. The matcher was throwing away the minus sign two different ways, so `Amazing Spider-Man -001 (1997).cbz` sat in the mapped folder while the wanted page kept asking for `#-01`. The mirror image was worse: the pattern for **#1** happily claimed that same file, which in the wanted-issue mover means filing the wrong comic under the right name. The sign rule is structural, not keyword-based — `Spider-Man -001` is a sign, `Batman-001` and `Batman - 001` are separators, and `Batman 001-006` range packs still work. The renamer had the same blind spot from the other direction and was renaming `-001` to `001` — *exactly #1's name* — collapsing two issues onto one file.
- **Wanted issues match when your rename pattern uses `#`.** If your pattern is `{series_name} #{issue_number} (...)`, the `#` compiled as a **hard requirement**, so no file named `Series 001 (2026).cbz` could ever satisfy it — for any series, for as long as that pattern was configured. Downloads landed in TARGET and then sat there while the nightly sweep kept reporting them missing.
- **Re-tagging no longer destroys metadata the new provider doesn't supply.** Applying metadata rebuilt `ComicInfo.xml` from scratch, so re-tagging a GCD-sourced file through ComicVine — which has no genre data at all — always lost its `Genre`. Four more defects stacked on top: ComicVine returns each creator's roles as one comma-joined string (`"penciler, inker"`) and CLU matched the whole string first-match-wins, so **a creator landed in exactly one bucket and every other credit they held was discarded**; `editor`, bare `artist`, `painter`, `plot`, `finishes` and `translator` had no bucket at all (bare `artist` is very common and produced nothing); `Web` was never mapped; and neither XML writer could emit `<Editor>` — the GCD provider computed editor credits and then dropped them at serialization.
- **GCD series matching, four separate ways.** The tokenized variation emitted a **literal backslash** into its regex, so it had never matched anything, for any library, in any language — every multi-word title fell through to a one-token fallback that had no floor, substring-matching the first token (`%le%` matches 18,526 series in the current dump) and taking the newest survivor. The year-constrained branch **never applied the year** to that fallback, so a 2014 file matched a 1999 series. And both search loops took the first row of `ORDER BY year_began DESC`, making the winner the *newest* series that survived the filter rather than the best match — `Superman (2000)` resolved to `Mann and Superman`. Candidates are now ranked on name equality, word overlap, length agreement and year distance, over a much wider candidate window.
- **The GCD language preference now applies to automatic lookups.** `gcd_metadata_languages` was read only by the manual search endpoint. Every automatic caller defaulted to English, so on a non-English library GCD contributed **nothing, without leaving any trace** — there was no fallback and misses weren't logged. Where the English-only query returned a *wrong* result rather than none, that result was selected. Non-English issues were also being tagged `LanguageISO: en` regardless.
- **A matched issue's date is cross-checked against the filename.** When the *series* match is wrong, the issue number still resolves, so a file gets tagged with confidently wrong metadata rather than being left alone. There's now an optional check comparing the matched issue's date against the year in the filename — or, for collections numbered `001.cbz` inside a folder that carries the year, against the **folder**. Three modes, **off by default**: `off`, `log` (so you can see what it would do to your library before letting it change anything), and `enforce` (a conflicting match goes to review instead of being written). Providers that report a series-start year rather than an issue date are exempt.
- **Publication dates are no longer read as issue numbers.** `001 - Il re del terrore (Mondadori 1957-12).cbz` parsed as **issue #1957**, with the series name mangled — and since that parser is what the renamer uses, those files were renamed to match. Dates are now only read from inside brackets with digits delimited on both sides, and **must carry a month**, because plenty of series names *are* numbers (`007 - Licence to Kill (2019)`, `100 Bullets`, `300`).
- **Comixology-scraped files can be re-tagged.** `Notes` doubles as the "already tagged, skip this file" sentinel, and six independent auto-tag entry points each carried their own copy of the exclusion string in two different quote styles. The policy is now in one place, `Scraped metadata from Comixology` is excluded alongside Amazon, and matching is case-insensitive — these strings come from third-party scrapers that don't spell their own product consistently.
- **Tagging a file records its real modification time.** Writing ComicInfo rebuilds the whole archive, so the on-disk mtime jumps to the moment of tagging — but nothing recorded that. A comic that had been in your library for months and was re-tagged today kept a months-old timestamp in the index, which made it **invisible to the credit backfill** — and that's exactly the population the sweep exists to repair.

***

### Notes for Upgraders

**Two dependency bumps happen for you** on a normal image pull: Apprise is new, and the Metron client library moves to 4.4.0 or later for token support. If you somehow end up on an older version, CLU declines with a clear "upgrade" message rather than failing in a worker thread.

Three things worth knowing:

- **Notifications are opt-in and off by default.** Nothing is sent until you add at least one URL and tick at least one event.
- **`AUTO_UNPACK` is gone from your config.** Archives in WATCH are now always unpacked, and the dead key is stripped from `config.ini` on first start so you're not left with a line that looks like it still does something. If you had it *off* deliberately, this is a behaviour change: drop archives somewhere other than WATCH.
- **Your folder art doesn't change.** Fanned Stack is the default and is unchanged from v6.3. New art keeps generating in that style until you pick a different one — and picking a different one only affects art generated from that point on, until you run **Regenerate All Thumbnails**.
- **Metron username/password still works.** Tokens are an addition, not a replacement. But if you're on the receiving end of a fail2ban block, note that the lockout is now the thing standing between a typo and an IP ban.

That's v6.4 — CLU that can finally tell you something happened, folder art that looks the way you want it to, and a Metron integration that repairs its own mistakes instead of compounding them. Feedback is welcome via Discord or GitHub.

Previous release: [v6.3 — Per-User Themes, DC++ Downloads, Reading Lists on the Dashboard, & More](https://clucomics.org/blog/2026/08/18/v63---per-user-themes-dc-downloads-reading-lists-on-the-dashboard--more/)
