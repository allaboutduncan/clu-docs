# v6.5 Documentation Outline (for the `clu-docs` repo)

This is a work plan to hand to Claude Code **inside the `clu-docs` repo** to draft and revise
documentation for everything shipped in v6.5. It maps each feature to the exact nav section,
file(s) to create or edit, and the doc conventions already used in the repo.

## How to use this file

1. Copy this file into the `clu-docs` repo (or reference it by path).
2. Open Claude Code in `clu-docs` and work section by section — each numbered item below is a
   self-contained task ("create/update this page, with these headings, table, and screenshots").
3. Screenshots referenced as `assets/...` need to be captured and dropped in before publishing —
   the same `assets/` paths should be reused by the companion blog post.

## Repo conventions to follow (match existing pages)

- **Front matter:** feature pages use an optional `--- description: ... ---` block; blog posts use
  `--- title / date ---` (see `docs/blog/posts/v64-release-blog.md`).
- **Page title:** single `# H1` at the top of each feature page.
- **Images:** `![Alt](../../assets/<group>/<file>.png){: .center-image}`, optionally followed by a
  caption block:
  ```
  /// caption
  Caption text
  ///
  ```
- **Callouts:** admonitions via `!!!info "Title"` / `!!!warning "Title"`.
- **Tables** for settings, filters, status enumerations and option lists.
- **Cross-links** with relative paths, e.g. `[Download Settings](../app-settings/download-settings.md)`.
- **Nav:** every new page must be registered in `mkdocs.yml` under the right section.

---

## Read first: the state of the docs going in

Unlike the v6.3 plan, **there is no backlog to clear.** Checked against the live `clu-docs` tree:

- `docs/features/users/` (7 pages) — exists. The v6.2/v6.3 backlog was cleared in commit
  `87b809f`.
- `docs/features/dcpp/` (4 pages) — exists.
- v6.4 shipped docs in `04d539c` (credit backfill, notifications, folder art styles, Metron tokens).
- `repo_url` and `site_description` from the v6.3 housekeeping list are both fixed.

So v6.5 is a **purely additive** pass. Two new nav groups, one substantially rewritten page, and a
run of edits to existing pages.

**What makes v6.5 different from v6.3/v6.4 as a documentation job:** most of this release is
*infrastructure the user is not supposed to think about* — corruption recovery, sweep de-duplication,
partial-download detection, archive staging. The temptation is to document the mechanism. Don't.
For each of these, document **the symptom the user saw before the fix** and **what they should see
now**, because the symptom is what they'll search for. The mechanism belongs in the blog post and in
`clu-comics/CLAUDE.md`, not on a feature page.

---

## 0. Housekeeping (quick, do these first)

- **Confirm the v6.4 blog post's published URL** before using it as the "Previous release" link in
  the v6.5 post. This has broken twice now (the v6.2 post's back-link to v6.0 was built from a
  *draft* title), so check the rendered URL, don't construct it from the title.
- **The `social` plugin is still gated on `!ENV [CI, false]`.** Flagged in the v6.3 plan and worth
  re-confirming CI actually sets `CI=true`, or Open Graph cards are never generated.
- **Blog front matter is still inconsistent** — older posts use `categories` + `authors`, newer ones
  title/date only. v6.5 is a good moment to pick one and normalize.
- **`features/app-settings/schedules.md` has two stale `<!-- TODO: screenshot -->` markers**
  (GetComics Scrape Index, Reading List Sync). The Reading List Sync card is being rewritten in §2
  anyway — capture both while you're there.

---

## 1. Problem Files — NEW section

**The single biggest net-new surface in v6.5** (PR #572), and the one most likely to be discovered
before it's documented: it's a new item in the gear menu that only the Store Owner can see.

Before this, a damaged comic produced a generic `error.svg` tile in the grid and a line in
`app.log`. There was no user-facing list of what was broken and no way to act on it.

**New nav group `Problem Files:` in `mkdocs.yml`**, placed after **App Settings** (it's an
owner-only maintenance surface reached from the same gear menu), with:

- `features/problem-files/index.md` — **Problem Files**
  - Where it is: **gear <i class="bi bi-gear-fill"></i> menu → Problem Files**. **Owner only** —
    it's gated the same way Settings and Schedules are, so Clerks and Readers never see it.
  - **Lead with the framing, because the empty state is ambiguous.** CLU does **not** scan your
    library for damage. A file appears here because an operation CLU actually attempted tried to
    read it and could not. An empty page means *nothing has failed*, not *your library is clean*.
    The page says this in so many words and the docs should too.
  - **Table: source → what was being attempted → where it came from.**

    | Source | Meaning |
    | --- | --- |
    | **Thumbnail** | Generating the cover for the grid |
    | **Rebuild** | A single-file or directory rebuild |
    | **Metadata write** | Writing `ComicInfo.xml` back into the archive |
    | **CBR conversion** | A CBR/RAR that wouldn't convert to CBZ |
    | **Unpack** | An archive in your **WATCH** folder that wouldn't open |

  - **Call out that Unpack is the odd one.** Its path is a *download*, not a library comic — the
    file never reached `/data`, which is exactly why nothing else would ever have told you about it.
    This is the one row type that explains "my download vanished and never appeared in the library".
  - **One file can appear twice.** Rows are keyed on file **and** source, so a comic whose thumbnail
    fails *and* whose rebuild fails is two rows, tracked independently. Fixing one doesn't clear
    the other.
  - **Filters:** source pills, a path filter box, and a **Show dismissed** switch.
  - **Actions table: action → what it does → when it's the right one.**

    | Action | What it does |
    | --- | --- |
    | **Details** | The archive error in full |
    | **Retry** | Thumbnail rows only — re-attempts immediately, synchronously |
    | **Rebuild** | Unpacks and repacks the archive as a fresh CBZ |
    | **Find a replacement** | Opens the source search, pre-filled from the filename |
    | **Dismiss** | Hides the row until the file changes on disk |
    | **Delete** | Moves the file to the trash |
    | **Remove** | Forgets the row without touching the file |

  - **`!!!info "Rebuild is honest about its odds"`** — Rebuild's only real repair is an archive
    that's a RAR wearing a `.cbz` name. A genuine CRC error aborts the whole extraction, so for most
    real damage the page **demotes Rebuild and promotes Find a replacement**. Document that the
    button placement is a recommendation, not a limitation.
  - **`!!!info "Dismiss is keyed to the file, not the message"`** — a dismissal lifts by itself if
    the file is rewritten and still fails. It doesn't match on the error text, because a damaged
    archive raises a different error depending on which page is read first.
  - **Unreachable rows.** If a library is unmounted, its rows come back marked unreachable and only
    **Remove** is offered — CLU deliberately won't prune rows it can't positively prove are gone,
    so a sleeping NAS never empties the page.
  - **`!!!info "An unwritable cache is not a damaged comic"`** — when the failure is CLU's own
    `/cache` rather than the archive, the page says so and **hides Delete entirely**. Worth its own
    line; it's the one case where the fix is a permissions change, not a replacement.
  - Note the page caps at **2,000 open rows** — a mount whose permissions are revoked mid-scan
    turns every file into an error, and a 40,000-row page helps nobody.
  - Screenshots: `assets/settings/problem-files.png`, `assets/settings/problem-files-details.png`.

- `features/problem-files/replacing-a-file.md` — **Replacing a damaged file**
  - This is the feature inside the feature, and it deserves its own page: **Find a replacement**
    files the download straight onto the damaged file's own path.
  - **Why this had to be built** — worth one sentence, because it explains the whole design.
    CLU's normal import only files issues that are *missing*. A corrupt file is still a file, so
    without this the replacement would sit in your processed folder forever.
  - **The flow:** Search → queue a download → CLU claims it for that path → when it lands, CLU
    verifies it, trashes the damaged copy and moves the replacement into its place → a banner on the
    Problem Files page reports the result until you dismiss it.
  - **Table: state → what you'll see → what to do.** (claimed / applied / failed / held.)
  - **`!!!info "The replacement is checked before anything is destroyed"`** — the download is
    CRC-checked end to end and must actually contain pages. A partly-readable original is worth more
    than a broken replacement, so a failed verification is a **no-op**: nothing moves.
  - **`!!!info "A CBR won't replace a CBZ"`** — that's a *hold*, not a failure. It means the
    conversion pipeline hasn't got to the file yet; the swap happens on a later pass once it's a
    CBZ. The reverse (a CBZ replacing a damaged CBR) is an upgrade and is allowed.
  - The damaged file goes to the **trash**, never straight to deletion, and a failed swap **puts it
    back**. Say this plainly — it's the reassurance people need before clicking.
  - **You don't have to sit on the page.** The swap is also applied by the normal download sweep, so
    closing the tab doesn't strand anything. The banner is the only place the result is reported,
    though, because a successful swap deletes the problem row it came from.
  - **`!!!warning "A failed swap stops retrying"`** — deliberately. Re-run **Find a replacement** to
    try a different release rather than having CLU retry the same bad download nightly.
  - Screenshot: `assets/settings/problem-files-replacement.png`.

**Also update:**
- `features/collection/index.md` — the grid's broken-cover tile now has somewhere to go; cross-link
  Problem Files from wherever thumbnails are described.
- `features/users/roles.md` — add Problem Files to the owner-only surfaces list.
- `features/single-file-features/rebuild.md` — note that a failed rebuild now **restores the comic
  where it found it** instead of leaving it renamed to `.bak`/`.zip` beside a folder of loose pages,
  and that failures are recorded on the Problem Files page.
- `features/folder-monitoring/features.md` — an archive in WATCH that won't unpack is now **reported
  and stood down**, rather than retried every five minutes forever. See §8.

---

## 2. Reading Lists — the big functional upgrade

Five PRs land here (#563, #564, #566, #574, #577) and they compound into one story: **an imported
reading list stops being a snapshot and becomes something CLU maintains.** Write it that way rather
than as five separate change notes.

### 2a. Sync now covers every source — edit `features/collection/reading-lists.md`

- **What changed:** Sync existed but covered **GitHub CBLs only**. It now covers all four import
  sources: a **GitHub CBL URL**, a **Metron reading list**, a **Metron story arc**, and a
  **ComicVine story arc**.
- **Table: source → what syncing it does → how CLU knows it changed.** Keep the "how" column
  non-technical ("the file's contents", "the list's last-modified date", "which issues are in the
  arc") — the point is that CLU asks a cheap question first and only rebuilds when the answer moved.
- **The Sync button's two outcomes**, because they look like a bug otherwise:
  - **Nothing changed** — answered instantly, in the request. No progress bar, no task.
  - **Something changed** — the rebuild runs in the background and the page tells you so. A large
    ComicVine arc genuinely takes minutes.
- **`!!!info "Re-importing the same list makes a second list"`** — this is still true and is exactly
  what Sync is for. Sync the list you have; don't re-import it.
- **`!!!info "Why an arc syncs differently from a reading list"`** — one short paragraph. Adding an
  issue to a story arc modifies the *issue*, not the arc, so an arc's own "last modified" date never
  moves. CLU compares the arc's membership instead. Worth documenting because it's the reason arc
  syncs are slightly slower than list syncs.
- Note the **Sync button only appears on lists that have a syncable source** — a list you built by
  hand, or imported from an uploaded CBL file, has nothing to sync against.
- **Re-match** (the button next to Sync) is a different thing and the page should say so explicitly:
  **Sync** pulls what the *source* now holds; **Re-match** re-runs local file matching on what's
  already there. Two buttons with the same icon, so this is a real confusion risk.

### 2b. Track Wanted — edit `features/collection/reading-lists.md` and `features/pull-list/wanted.md`

New per-list **Track Wanted** button (<i class="bi bi-binoculars"></i>), on the reading-list page
beside Sync.

- **What it does:** every entry in the list with **no matched file** becomes a wanted issue — it
  shows on the [Wanted](../pull-list/wanted.md) page under **From Reading Lists**, and the nightly
  GetComics sweep searches for it.
- **`!!!warning "Off by default, and that's deliberate"`** — a 300-issue arc import must not
  silently start 300 nightly searches. It's opt-in per list.
- **Permissions:** unlike bookmarking (personal data any role may set), Track Wanted **spends
  bandwidth and disk**, so it's restricted to users who can manage the list. State this — it's an
  inconsistency users will notice next to the Bookmark button.
- **Mapping an issue by hand removes it from the list; clearing the mapping brings it back.**
  Nothing is stored — "unmatched" *is* the definition — so there's nothing to rebuild or refresh.
- **On the Wanted page** (`features/pull-list/wanted.md`), add a **From Reading Lists** section:
  - Its own count tile and its own table, with a **Reading List** column linking back to the list.
  - **Table: column → meaning.**
  - **`!!!info "Undated issues are searched, mapped-series issues aren't"`** — the opposite rule to
    the rest of the page, and it will look like a bug. A release calendar entry with no date is an
    unscheduled solicitation; a reading list is back catalogue, so a missing year means *already
    released*, not *skip*.
  - **`!!!info "A queued issue keeps showing"`** — it's still missing until the file lands. What
    changes is that CLU won't re-queue the same issue for **7 days**, so a dead mirror or an archive
    that won't unpack can't produce the same download every night.
  - Entries with a blank series name or issue number are excluded — they can never match anything.

### 2c. Lists heal themselves — edit `features/collection/reading-lists.md` §Mapping Missing Issues

Three separate fixes, one user-facing promise: **a reading list keeps pointing at the right file.**

- **Gaps fill the moment the file arrives** (#577). When a download lands in your library, CLU
  checks whether it closes a gap on any tracked list and maps it immediately — you don't have to
  wait for the nightly re-match or press Re-match yourself.
  - **`!!!info`** that this only ever *adds* a match. Clearing a match stays a decision for the
    nightly sweep and the explicit Re-match button, so an arriving file can never un-map something
    you'd already mapped.
- **Matches follow the file** (#574). Rename a comic, move it, or convert it from CBR to CBZ and the
  list entry follows. Delete it and the entry goes back to unmatched — which, on a tracked list, is
  what puts it back on Wanted.
  - **Call out manual overrides specifically.** Re-match deliberately *skips* an entry you mapped by
    hand — your answer beats the matcher's. That used to mean a hand-picked mapping broken by a
    rename could never heal itself. Now the path follows, so it can.
  - This is the headline of the three; give it its own sentence.
- **The right volume** (#563). A list entry no longer maps to an issue of the same number from a
  different volume/year. Short note in the Mapping Missing Issues section.

### 2d. Also update

- **`features/app-settings/schedules.md` → Reading List Sync Schedule.** The page currently says
  it "automatically syncs **GitHub-sourced** reading lists". **That sentence is now wrong.** Rewrite:
  it syncs every list with a syncable source, and it pre-filters Metron lists with a single call so
  a library with dozens of imported lists doesn't cost dozens of requests per run. Capture the
  outstanding screenshot TODO here.
- **`features/users/roles.md`** — Track Wanted is manage-level, Bookmark is not.
- **`features/pull-list/index.md`** — the Wanted list now has two sources.

---

## 3. Database — Health, Maintenance & Recovery (rewrite `features/app-settings/database.md`)

PR #573. The existing page documents stats + backups and stops there. The tab now has **three
cards**, and the recovery half is the kind of thing people read at 2am, so it should be findable on
its own.

**Recommendation: split into two pages.**

- Keep `features/app-settings/database.md` — **Database** (stats, health, maintenance, backups)
- Add `features/app-settings/database-recovery.md` — **Database Recovery** (corruption, salvage,
  quarantine, the offline rescue script)

### 3a. `database.md` — additions to the existing page

- **Current Database** gains **Reclaimable**, **Journal / sync** and — the important one —
  **Storage**.
  - **`!!!warning "Storage is the most important field on this page"`** — give it real estate.
    A database on **CIFS/NFS/sshfs** is the single commonest cause of SQLite corruption, and nothing
    in CLU can fix it. **`overlay` means `/config` was never mounted** and the database dies with
    the container. The page raises an alert for both.
  - **Table: storage verdict → what it means → what to do.**
- **New card: Health & Maintenance.**

  | Control | What it does | When to use it |
  | --- | --- | --- |
  | **Run integrity check** | Fast structural check | Any time; it's the default |
  | **Full check** | Reads every page | When you suspect damage the quick check missed |
  | **Checkpoint WAL** | Flushes the write-ahead log into the database | A `-wal` that's grown large |
  | **Optimize** | Refreshes query planner statistics | Things feel slow |
  | **Compact** | Rebuilds the file, reclaiming free space | **Reclaimable** is large |

  - All of it is **safe to run while the app is in use** — say so, it's the first question.
  - **`!!!info "Compact is refused on a damaged database"`** — deliberately. Compacting rewrites
    every page, which is the last thing you want to do to a file that's already failing its
    integrity check. Salvage first.
- **New: Recent database errors.** A list of SQLite failures the app would previously have swallowed
  silently. **An empty table is good news** — state that, or it reads as broken.
  - **`!!!info "This list resets when CLU restarts"`** — it's deliberately in memory. Writing it to
    the database is how the alarm gets lost exactly when it matters.
  - Note the health badge goes red if *either* the live check fails **or** an error was latched
    earlier, and that a passing check does **not** silently clear a latched failure. Otherwise the
    combination ("badge red, check green") looks like a bug.
- **Backups — three things changed and all three are user-visible:**
  - A backup now holds **exactly one file**. Backups used to include the `-wal`/`-shm` sidecars
    captured at slightly different instants, which reads back as a *corrupt* database. Restoring an
    older archive still works; CLU just ignores the sidecars.
  - Backup filenames **step forward a second on collision**, so a manual backup and an automatic one
    taken in the same second no longer overwrite each other.
  - **The startup backup no longer delays startup** — it runs in the background.
  - **`!!!info` for upgraders:** if you have backups from before v6.5, they're still restorable.
- **New: shutdown is clean.** `docker stop` / `restart` now flushes the write-ahead log before
  exiting. Worth a line under maintenance — an unclean shutdown every restart was a contributing
  cause of the corruption this release is about.

### 3b. `database-recovery.md` — NEW page

- **When you need this page:** the integrity badge is red, or the app is logging
  "database disk image is malformed".
- **Salvage** — what it does, in the page's own framing: it reads out everything still readable and
  builds a **clean copy**, and **never modifies the current database**. You see the result before
  deciding.
  - **Table: the result panel's fields** — Method / Integrity / Rows lost / Size, plus the per-table
    before/after diff.
  - **`!!!warning "Rows lost can be reported as unknown, and that's the honest answer"`** — the
    corrupt table is usually the exact table whose row count can't be read, so CLU reports those
    tables as unknown rather than quietly counting them as zero loss. Explain this; a naive reading
    of "0 rows lost" on a salvage would be dangerously wrong.
  - **Install this database** / **Discard** — a pre-swap snapshot is taken automatically.
  - **Restart after installing.**
- **Quarantined copies** — snapshots taken automatically when corruption was detected. They are
  **never offered for restore** (they contain the damaged file) but they are the only surviving copy
  of what was lost, so they're downloadable.
- **The offline rescue script.** If CLU won't start at all, `tools/repair_db.py` runs via
  `docker exec` with nothing but Python's standard library. Give the exact command. This is the page's
  highest-value content — everything else on it assumes a running app.
- **`!!!warning "Fix the cause, not just the file"`** — link back to the **Storage** field. A
  database on a network mount will corrupt again.

### 3c. Also update

- `features/app-settings/index.md` — register the new page.
- `frequently-asked-questions.md` — see §9.
- `getting-started/quickstart.md` / `features/app-settings/install.md` — if either shows a
  `docker-compose` example, make sure `/config` is a real volume and say why in one line.

---

## 4. Local ComicVine DB keeps itself up to date — edit `features/local-databases/comicvine.md`

PR #576. The page currently ends at "Order it above the ComicVine API". Add a section.

- **Where:** Settings → **MetaData Providers** → the **ComicVine Local DB** card, under the database
  path field.
- **Two controls:**

  | Control | What it does |
  | --- | --- |
  | **Keep this database up to date automatically** | Checks for a newer copy every **2 weeks** and replaces the file at the path above |
  | **Download now** | Runs it immediately — **also works as a first download**, so you can bootstrap without the manual steps in §1 above |

- **`!!!warning "Check you have the room"`** — the download is around **540 MB** and unpacks to
  **several GB**, on the same volume that already holds your current copy. Peak usage is roughly
  *old + new*.
- **`!!!info "Off by default"`** — a download and disk write that size must not start unannounced on
  upgrade. The **Download now** button isn't gated; clicking it is a choice.
- **The update is a no-op until it succeeds.** Nothing replaces your database until the new file has
  been downloaded, unpacked, checksum-verified against the publisher's own hash, and confirmed to be
  a ComicVine database. A failed run leaves your existing file exactly where it was.
- **Progress appears in Active Operations** — this runs in the background because it far outlasts a
  request. You can navigate away.
- **`!!!info "Restructure §1 of this page around the button"`** — the manual download steps are now
  the fallback, not the happy path. Reorder accordingly: configure the path, click **Download now**,
  done.
- Screenshot: `assets/settings/comicvine-db-autoupdate.png`.

---

## 5. Download Packs, and downloading the right thing — edit the download docs

Four PRs (#555, #557, #578, #584) that all answer the same complaint: *CLU downloaded the wrong
comic, or the same comic twenty times.*

### 5a. New setting — `features/app-settings/download-settings.md`

Add **Download Packs** to the **Search Variant Settings** card (that's where it lives in the UI).

- **Definition first:** a **pack** is a download holding **more than one issue** — "Batman #1–50",
  or the "#1–15" part of a post split into several downloads.
- **What the switch does:** when **on**, the scheduled download and **Check for Missing Issues**
  will take a pack containing a missing issue if no single-issue download is found. When **off**,
  that issue stays missing.
- **What it does *not* affect:** downloads you pick yourself from a search window, and Weekly Packs.
  The search window marks packs so choosing one is always your call.
- **Default: off.** Say so, and say why — a pack can be tens of gigabytes fetched to satisfy one
  missing issue.
- **`!!!info "This is what 'fallback' in the search results means"`** — tie it to the ACCEPT /
  FALLBACK / REJECT vocabulary already documented for the search modal. A FALLBACK result is a
  **score**, not a decision to download.

### 5b. Scoring fixes — same page, the variant list

- **Plurals now score like their singulars** (#557). "Annuals", "TPBs", "Quarterlies",
  "Omnibuses" and "Galleries" are matched by the corresponding `VARIANT_TYPES` keyword — you don't
  need to add plural forms to the list yourself. Worth stating, because the docs currently imply the
  list is matched literally.
- **"+ Annuals" is an add-on, not a sub-series.** "Batman #1–50 + Annuals" is still a Batman #1–50
  pack; it isn't rejected as a different series.

### 5c. Split posts and listing pages — `features/file-downloads/send.md` and `features/usenet/search-and-grab.md`

This is #578 and #584 and it's the most consequential bug fix in the release. Document the
**symptom**, since that's what people searched for.

- **`!!!info "Fixed in v6.5"`** — a GetComics *listing* page (a weekly update, a Top-10 roundup)
  holds many unrelated comics. CLU used to fetch the first one on the page whatever it was aiming
  for, so a run of wanted issues could all download the same unrelated comic. A download of the
  wrong comic under the right name is worse than no download; CLU now takes the specific entry or
  nothing.
- **A post split into several downloads** now has the correct part picked per issue, rather than
  always the first.
- **A sweep can't run twice over the same scope.** If a scheduled run is already in progress, **Run
  Now** and the scheduled trigger stand down rather than starting a second copy that re-queues
  everything the first is still working through.
  - **`!!!info "Check for Missing Issues is the exception"`** — a full sweep does **not** block the
    per-series button. Clicking it is an explicit request about one series, and making you wait out
    a multi-hour sweep would be worse than the single duplicate it can cost.
- **A sweep queues at most 150 downloads.** It's a blast-radius limit, not a throughput limit —
  hitting it stops that run, and the rest is picked up next time. Say that, so hitting it doesn't
  look like data loss.
- **A rate-limited host is stood down**, not asked again on every queued item. MEGA in particular
  used to produce dozens of identical "Too many requests" failures against a handful of files. A
  cooling host is moved to the back of the list rather than dropped, so it's still used when it's
  the only link a post offers.

### 5d. Progress is visible — `features/file-downloads/status.md` and `features/pull-list/wanted.md`

The scheduled sweep and **Run Now** now report into the header's **Active Operations** indicator,
not just the per-series button. A run that can last hours used to be completely invisible unless you
started it from a series page.

---

## 6. Thumbnails actually update — edit `features/collection/index.md`

PRs #568 and #569. `features/collection/index.md` already has a **Folder art** section from v6.3;
this extends it and adds a per-comic note.

- **`!!!info "Fixed in v6.5 — thumbnails never updating"`** — the headline symptom (#548). Editing,
  rebuilding or re-tagging a comic left its cover stale. Two specifics worth naming because they're
  what people actually reported:
  - **Rebuilding a whole directory** left every cover stale, while rebuilding one issue at a time
    worked.
  - On installs running under `PUID`/`PGID`, thumbnails written by an earlier root-fallback start
    could never be overwritten at all.
- **What changed for the user:** every operation that rewrites a comic now refreshes its cover, and
  the grid additionally notices on its own if a comic is newer than its cached cover. You shouldn't
  need to do anything.
- **`!!!info` for upgraders:** existing stale thumbnails repair themselves as the grid asks for
  them. There's no rescan to trigger.
- **Formats that can't be thumbnailed are skipped permanently, not retried.** PDFs (and CBR/RAR on
  the background scan) have no thumbnail reader. They used to be re-queued at **every restart**,
  which is why large libraries saw a thumbnail storm on boot. They're now skipped once, and —
  importantly — **not** recorded as problems on the Problem Files page, because "a PDF has no
  thumbnail reader" is a fact about the format, not damage.
- **macOS sidecar files** (`._Foo.cbz`) are no longer queued as comics.
- **A genuinely failed thumbnail is retryable**, and now shows up on **Problem Files** with the
  actual archive error instead of a silent broken tile. Cross-link.

---

## 7. Security: `/api/folder-thumbnail` — a short, plain note

PR #585 / **GHSA-vhvw-93fg-whm8**. This needs to be documented somewhere findable, briefly and
without a how-to.

- **Where:** a short `!!!warning "Security fix in v6.5"` on `features/collection/index.md` under
  **Folder art**, and a line in the v6.5 blog post. Do not write a dedicated page.
- **What to say:** the endpoint serving folder cover art did not properly confine which files it
  would return, so a signed-in user could read files outside the libraries they had access to.
  Fixed in v6.5. **Upgrade.**
- **What not to say:** no path examples, no reproduction, no description of the bypass.
- If any install runs with untrusted users, the relevant line is simply *upgrade to v6.5*.

---

## 8. Smaller touch-ups (fold into existing pages)

Each of these is one to three sentences on an existing page. Write the **symptom**, not the
mechanism.

- **`features/folder-monitoring/features.md` — a corrupt archive is opened once, not forever.**
  A damaged `.zip` in WATCH used to be re-extracted on every five-minute sweep, producing
  `Comic (19).cbz`-style duplicates in your processed folder and thousands of log lines. It now
  fails once, is recorded on **Problem Files** under *Unpack*, and is left alone. Cross-link §1.
- **`features/folder-monitoring/features.md` — partial downloads are left alone.** An AirDC++
  transfer in progress (`.dctmp`) was being imported as a finished comic every 30 seconds — one
  report left **28 copies** of the same file. Also: CLU's orphan cleanup now refuses to delete
  anything that's still growing, and the **Clean Up Orphan Files** button got the same guard, so
  clicking it mid-download no longer kills the download.
  - **`!!!info`** that another client's in-progress queue items are never reaped at all — a DC++
    queue item can legitimately sit idle for hours waiting for a source.
- **`features/folder-monitoring/features.md` — a failed move leaves no copy behind.** If a move out
  of WATCH fails, CLU cleans up the partial destination rather than leaving a full copy to be
  re-imported under a new name next sweep.
- **`features/directory-features/convert.md` and `features/folder-monitoring/features.md` — no more
  CBR beside its own CBZ.** On CIFS/SMB and Windows-backed WSL2 mounts, a conversion could write a
  perfectly good CBZ and *still* be reported as failed, leaving both files in place on **every**
  download. Fixed. Note that existing stray pairs need cleaning up by hand.
- **`features/file-downloads/status.md` — Clear Completed clears everything.** It only ever cleared
  direct downloads, so AirDC++ and Usenet rows stayed on the page reading "Complete" — which is what
  made the button look broken. It now covers all three sources.
  - Note that a download which **finished but couldn't be filed** clears as *completed*, not failed:
    the download worked, what failed is CLU finding the file afterwards (commonly a client on
    another host).
  - Note bundles queued directly in AirDC++ are still never cleared — they're not CLU's to forget.
- **`features/collection/source-wall.md` — the Pull List menu is back** (#571). It was missing from
  this page only.
- **`features/app-settings/metadata.md` — ComicVine works again on current Simyan** (#567), **and
  saving settings no longer signs you out**. The second one is the user-visible half; lead with it.
- **`features/app-settings/install.md` / `getting-started/quickstart.md` — the container now talks
  while it starts** (#570). First-run and large-library starts could sit silent for **two minutes**,
  which is indistinguishable from a container that never started. Add a
  `!!!info "If your container seems to hang on start"` pointing at the startup log, and note that
  ownership passes over `/cache` and `/config` are timed and reported.

---

## 9. FAQ additions — `frequently-asked-questions.md`

Strong candidates, in rough priority order:

- **"CLU says my database is corrupted — what do I do?"** → Storage field first, then salvage, then
  the offline rescue script. Link `database-recovery.md`.
- **"Should my database be on a NAS share?"** → No. The single highest-value FAQ entry in this
  release.
- **"What is the Problem Files page, and why is it empty?"** → report-only, not a scanner.
- **"A comic in my library is corrupt. Can CLU replace it?"** → yes, from its Problem Files row.
- **"Why did CLU download a comic I didn't ask for?"** → listing-page entries; fixed in v6.5.
- **"Why is CLU downloading 50-issue packs?"** (or: why isn't it?) → the Download Packs switch.
- **"My reading list doesn't show missing issues on the Wanted page"** → you have to turn on
  **Track Wanted**, per list.
- **"I re-imported my reading list and now I have two"** → use **Sync**, not re-import.
- **"My covers never update after I edit a comic"** → fixed in v6.5.
- **"There's a `.cbr` sitting next to its own `.cbz`"** → fixed in v6.5; clean up the strays.
- **"My container takes two minutes to start with no output"** → fixed in v6.5.
- **"Can I get the local ComicVine database without downloading it by hand?"** → yes, **Download
  now** on the provider card.

---

## 10. Blog post

- **`clu-comics/readme/release65-blog.md` does not exist yet** — unlike v6.3, there's no drafted
  companion post to copy. It needs writing, then copying to `docs/blog/posts/v65-release-blog.md`.
- Suggested framing, based on what's actually in the release: **"Damaged comics get a page of their
  own, reading lists maintain themselves, and the database can repair itself."** Three headline
  features, then a long run of download-correctness fixes.
- Match `v64-release-blog.md`'s front matter (title / date), a short intro, then `<!-- more -->`.
- Mention the security fix (§7) in one line with an upgrade recommendation — no detail.
- **Confirm the "Previous release" link** resolves to the *published* v6.4 post URL. See §0.
- Reuse the same `assets/` paths as the feature pages so screenshots are captured once.

---

## Suggested execution order

1. **Problem Files (§1)** — biggest net-new surface, it's already visible in the gear menu of every
   owner's install, and it's undocumented. Do `index` → `replacing-a-file`.
2. **Reading Lists (§2)** — five PRs, one story, and it changes what an existing documented feature
   *means* (Sync used to be GitHub-only, the schedules page still says so). Semantic changes to
   documented features are what generate confused issues.
3. **Database (§3)** — the recovery page is the one people read in an emergency, so it wants to
   exist before the emergency. The **Storage** warning is the highest-value support deflection in
   the release.
4. **Download Packs and download correctness (§5)** — a new user-facing setting plus the fixes
   people will want confirmation of.
5. **ComicVine auto-update (§4)** and **thumbnails (§6)** — short, self-contained.
6. **Security note (§7)** and the smaller touch-ups (§8).
7. **FAQ (§9)**, **blog post (§10)**, and a final `mkdocs.yml` nav review plus §0 housekeeping.

## `mkdocs.yml` nav additions checklist

- [ ] New `Problem Files:` group — `features/problem-files/index.md`,
      `features/problem-files/replacing-a-file.md` (place after **App Settings**)
- [ ] New page `features/app-settings/database-recovery.md` under **App Settings**
- [ ] Confirm `features/app-settings/schedules.md` no longer says reading-list sync is GitHub-only
- [ ] Confirm `features/local-databases/comicvine.md` leads with **Download now**, not the manual steps
- [ ] New blog post `docs/blog/posts/v65-release-blog.md` (draft it in `clu-comics/readme/` first)
- [ ] Clear the two outstanding `<!-- TODO: screenshot -->` markers in `schedules.md`
- [ ] Decide and normalize blog front-matter style across all posts
- [ ] Confirm the new FAQ entries are registered/linked
