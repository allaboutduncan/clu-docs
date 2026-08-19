# v6.3 Documentation Outline (for the `clu-docs` repo)

This is a work plan to hand to Claude Code **inside the `clu-docs` repo** to draft and revise
documentation for everything shipped in v6.3. It maps each feature to the exact nav section,
file(s) to create or edit, and the doc conventions already used in the repo.

## How to use this file

1. Copy this file into the `clu-docs` repo (or reference it by path).
2. Open Claude Code in `clu-docs` and work section by section — each numbered item below is a
   self-contained task ("create/update this page, with these headings, table, and screenshots").
3. Screenshots referenced as `assets/...` need to be captured and dropped in before publishing —
   the same `assets/` paths are used by the companion blog post (`release63-blog.md`).

## Repo conventions to follow (match existing pages)

- **Front matter:** feature pages use an optional `--- description: ... ---` block; blog posts use
  `--- title / date ---` (see `docs/blog/posts/v62-release-blog.md`).
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

## ⚠️ Read first: the v6.2 docs work was never done

Checked against the live `clu-docs` tree — **`docs/features/users/` does not exist.** None of the
seven pages planned in `release62-docs-outline.md` (index, roles, first-run, managing-users,
library-and-folder-access, personal-data, api-tokens) were created, and there is no `Users & Access`
group in `mkdocs.yml`. The only place multi-user is documented anywhere on the site is the v6.2
**blog post**.

The practical consequences for this plan:

- **Section #1 below is not an edit pass, it's the v6.2 backlog plus v6.3 on top.** Do not write the
  v6.2 pages as originally specified and then correct them — v6.3 changes what several of them say.
  Write them once, already correct.
- `release62-docs-outline.md` is still the right source for the *structure and content* of those
  seven pages. Use it, with the v6.3 deltas in #1 applied.
- Every "also update" item at the end of section #1 of the v6.2 outline (Settings index, Docker env
  vars, Collection, Reading Lists, `/api/v1`, OPDS) is also still outstanding.
- Anything below that cross-links into `features/users/...` depends on this section landing first.

This is the single biggest documentation gap on the site right now: user accounts, roles, and
per-folder permissions have shipped and are undocumented outside a blog post.

---

## 0. Housekeeping found while drafting (do these first, they're quick)

- **`mkdocs.yml` `repo_url` is wrong.** It points at `https://github.com/allaboutduncan/comic-utils`;
  the live repo is `https://github.com/allaboutduncan/clu-comics`. The GitHub icon in the header
  currently 404s.
- **`site_description` predates v6** — no mention of multi-user, the built-in reader, `/api/v1`,
  Usenet or DC++. It's the meta description Google shows; worth a rewrite now that the feature set
  has moved this far. Suggested angle: keep "self-hosted comic library manager", add
  "convert CBR to CBZ", "ComicInfo.xml metadata", "multi-user".
- **The `social` plugin is gated on `!ENV [CI, false]`.** Confirm CI actually sets `CI=true`, or
  Open Graph link-preview cards are never generated for any page.
- **Verify the v6.2 blog post's published URL** before using it as the "Previous release" link in
  the v6.3 post. Note the v6.2 draft's own back-link to v6.0 was built from a *draft* title
  (`v60---usenet-downloads-pull-list-monitoring-split-file--more`) that doesn't match the published
  title ("v6.0 - Usenet Downloads, Library Import, Split File, & More") — so that link is probably
  already broken and should be fixed in the same pass.

---

## 1. Users & Access — create the section (v6.2 backlog + v6.3 per-user settings)

**Highest priority, and larger than the rest of this document combined.** Build the seven pages
specified in `release62-docs-outline.md` §1, with the v6.3 deltas below folded in as you write —
not applied afterwards as corrections.

**v6.3 deltas to apply while writing the v6.2 pages:**

- **`features/users/personal-data.md`** — the v6.2 outline specifies an
  `!!!info "Still shared in v6.2"` callout stating that *"preferences such as the theme are
  app-wide"*. **Do not write that.** As of v6.3:
  - **Theme** and **dashboard layout** belong in the per-user list.
  - The callout should read `!!!info "Still shared"` and cover only **Komga sync** (single shared
    server/account, attributed to the Store Owner) and the **AI recommendation service** — with the
    reason the latter is global: it gates an owner-configured service holding a shared API key, so
    it isn't a display preference.
- **`features/users/roles.md`** — the "Readers may still POST their own personal data" list gains
  **their own theme and dashboard layout**.
- **`features/users/api-tokens.md`** — fold this into the larger **My Account** page below rather
  than writing it standalone; tokens are now one of three panes.

**New page `features/users/my-account.md` — My Account** (replaces the planned standalone
`api-tokens.md`; keep the token content, it's now one pane of three)
  - The three panes: **Appearance**, **Dashboard Layout**, **API Tokens**.
  - **The resolution chain, stated plainly:** personal override → owner-set site default →
    hardcoded default. A user with no override *follows* the site default; that's what the
    "Following site default" badge means, and the Reset button returns you to it.
  - **Table: pane → what it controls → who can change it.**
  - Note the header **person-icon dropdown** (My Account / API Tokens / Logout) appears only when
    there's a session; single-user installs are visually unchanged and reach My Account from the
    gear menu.
  - `!!!info "No migration"` — upgrading changes nothing; every account starts out following the
    site default.
  - Screenshots: `assets/users/account-appearance.png`, `assets/users/account-dashboard.png`.
- **Edit `features/app-settings/personalization.md`** — the theme and dashboard controls here are
  now **site defaults**, not global settings.
  - Reframe the page: what the owner sets here is the default for anyone who hasn't overridden it.
  - `!!!info` that saving a site default also clears the owner's own personal override, so the
    change is visible immediately rather than appearing to do nothing.
  - Cross-link to `features/users/my-account.md`.
  - Note the fixed "(Dark)" theme labels (quartz was mislabelled).
- **Edit `features/users/roles.md`** — add to the "Readers may still POST their own personal data"
  list: **their own theme and dashboard layout**.

---

## 2. DC++ (AirDC++) — NEW section

DC++ is a whole new download source and needs its own nav group, parallel to `Usenet Downloads:`.

**New nav group `DC++ Downloads:` in `mkdocs.yml`, with:**

- `features/dcpp/index.md` — **Overview**
  - What DC++ support is, and the critical framing up front: **the target is the
    [AirDC++ Web Client](https://airdcpp-web.github.io/), not a DC++ client.** DC++ itself has no
    remote API. Users who try to point CLU at DC++ or ApexDC will fail here.
  - How it fits the existing pipeline: completed bundles land in WATCH through the same mover
    Usenet uses, so import behaves identically.
  - `!!!info` that this is new in v6.3.
- `features/dcpp/setup.md` — **Adding AirDC++**
  - Walkthrough of Settings → Download Clients: URL, username, password, target directory,
    **local target directory**, Test Connection.
  - **Table of fields → meaning / example.**
  - `!!!warning "Two different paths"` — this is the #1 support risk. **Target directory** is where
    AirDC++ writes, expressed the way *AirDC++* sees it. **Local target directory** is that same
    folder the way *CLU* sees it. AirDC++ usually runs natively on the host or in its own container,
    so these differ. Test Connection verifies CLU can open the local path.
  - Note that Test Connection tests **the values currently on screen**, not the last saved config,
    so an unsaved correction can be validated before committing.
  - Note that a target directory CLU can't parse is **rejected with a message naming the fix**,
    rather than silently producing mangled filenames.
  - Screenshot: `assets/download/dcpp-client-setup.png`.
- `features/dcpp/search-and-grab.md` — **Searching & Grabbing**
  - The DC++ section in the source-search modal; result scoring and ACCEPT/FALLBACK/REJECT
    collapsing, matching the Usenet page's structure.
  - `!!!info "Hub searches are slow"` — set expectations explicitly. AirDC++ *queues* searches and
    paces them per hub; on a two-hub setup the query may not dispatch for ~17s, with results
    settling around ~30s. CLU waits on the instance's own progress rather than a fixed timeout,
    capped at 45s. This is normal and not a CLU stall.
  - **Back-catalogue naming.** Comic hubs name older files `196103 Strange Tales v1 083.cbz`
    (YYYYMM cover-date prefix, `vN` volume token). CLU normalizes these before scoring, so the
    Golden/Silver Age catalogue is matchable. State that **displayed titles are the real filename**;
    only the scored form is normalized. Also note the declared volume is compared separately.
  - Note DC++ result tokens are **per search instance** — re-running a search re-mints them, which
    is why DC++ rows don't stay locked in the modal the way GetComics/Usenet ones do.
- `features/dcpp/status-and-recovery.md` — **Status & Restart Recovery**
  - DC++ bundles on the Download Status page.
  - **Restart survival**: jobs are recorded in the database at grab time, so a container restart no
    longer orphans an in-flight bundle, and a bundle that completed *while CLU was down* can still
    be imported.
  - **Table: job state → what it means → does it clear itself.** Emphasize that **failed** and
    **completed-but-not-moved** rows persist until dismissed, deliberately — they need a human.
  - Bundles queued **directly in AirDC++** appear read-only on the Status page. State clearly that
    CLU will never move those files, because it has no idea what series they belong to.
  - `!!!info "Usenet doesn't have this yet"` — Usenet jobs are not yet covered by restart recovery.
    Better documented than discovered.

**Also update:**
- `features/usenet/source-priority.md` — **this page's meaning has changed and is now the most
  likely source of confusion in the release.**
  - Source Priority now ranks **three** sources, not two.
  - **State the split explicitly:** priority governs the order *and membership* of the
    **auto-download** cascade — an unranked source is skipped there. The **manual search modal
    queries every configured source** regardless of ranking.
  - Consider renaming/moving this page out of the Usenet group now that it governs three sources
    (e.g. `features/downloads/source-priority.md` with a redirect), or at minimum cross-link it
    from both the Usenet and DC++ groups.
- `features/app-settings/download-settings.md` — download clients now have a **group**
  (`usenet` / `dcpp`), and "only one active" is scoped per group. **Activating AirDC++ does not
  deactivate SABnzbd.** Existing clients backfill to the Usenet group automatically.
- `features/file-downloads/status.md` — add DC++ rows alongside direct and Usenet downloads.

---

## 3. Reading lists on the dashboard — update Reading Lists & Collection

- **Edit `features/collection/reading-lists.md`:**
  - New **Bookmark** action and what it does — the single opt-in that drives both dashboard
    surfaces.
  - **Want to Read** gains a card per bookmarked list: cover stack, read/total, progress bar,
    click-through to the list.
  - **On the Stack** surfaces the list's **next unread issue** — defined precisely: the first entry
    in the list's own sort order that is unread **and** has a matched file. Entries with no matched
    file are **skipped, not counted as unread**, which is worth stating because it's why a list can
    show a later issue than you'd expect.
  - A list you've never started still appears (it doesn't require prior progress).
  - Entries carry a **list-name badge** in On the Stack.
  - `!!!info "Per user"` — bookmarks are user-scoped, so in a multi-user install everyone curates
    their own dashboard from the same shared lists. **Readers can bookmark**.
  - Note deduplication: if a bookmarked list and a subscribed series point at the same next issue,
    On the Stack shows it once.
  - Screenshots: `assets/lists/want-to-read-card.png`, `assets/lists/on-the-stack-badge.png`.
- **Edit `features/collection/index.md`** (or wherever the dashboard sections are enumerated) —
  Want to Read and On the Stack now have two sources: files/folders you flagged, and bookmarked
  reading lists.

---

## 4. Browse Library UI — update the Collection page

- **Edit `features/collection/index.md`:**
  - The **sticky pager**: pinned to the bottom of the viewport while there's grid left, landing
    inline at the true bottom. Windowed page numbers with ellipsis, a "Showing X–Y of Z" readout,
    and a mirrored **Per page** selector.
  - **New: Card size picker** — Standard / Large toggle in the filter bar, saved in the browser
    (like Per page), so it's per-device rather than per-account.
  - Note the removed page-jump dropdown.
  - `!!!info` for upgraders: comic filenames were previously unreadable on dark themes; if you
    switched away from a dark theme because of it, it's fixed.
  - Screenshots: `assets/collection/sticky-pager.png`, `assets/collection/card-size.png`.

---

## 5. Folder thumbnails — update Collection / Settings

- **Edit `features/collection/index.md`** (and any existing "Generate Thumbnail" documentation):
  - Folder art is now **generated automatically as you browse**. The grid asks for art it can't
    draw, a background queue produces it, and the page picks it up within a few seconds.
  - Behavior worth documenting: one worker at a time, in-flight paths deduped, a **6-hour backoff**
    on folders that can't produce art, and **existing folder art is never replaced**.
  - `folder.gif` is now recognized as folder art alongside `.png` / `.jpg` / `.jpeg`.
  - **Card art now renders at a consistent size regardless of source image dimensions.**
  - `!!!info` for upgraders: generated thumbnails previously vanished on reload until the next full
    scan — that's fixed, and it also fixed the manual **Generate Thumbnail** button.
- **Edit `features/app-settings/file-settings.md`** (or wherever toggles live) — document the
  **auto-generate folder thumbnails** setting and when you'd turn it off (very large libraries on
  slow storage; generation opens comic archives).

---

## 6. Weekly Releases publisher filter — update Pull List

- **Edit `features/pull-list/releases.md`:**
  - New **Publisher filter pills** with live counts; filtering is client-side and the selection is
    mirrored into the URL, so a filtered view is **deep-linkable** (`?publisher=`).
  - `!!!info "The list fills in as you watch"` — set expectations. Metron's issue-list endpoint
    doesn't return a publisher, so CLU resolves them into a self-warming cache. On a **cold week**
    the pills populate progressively over the first few visits rather than appearing complete
    immediately. Explain briefly *why* (resolving per series would be ~150 API calls a week against
    the rate limit) so this reads as a design decision rather than a bug.
  - Screenshot: `assets/pull/releases-publisher-filter.png`.

---

## 7. Search modal: multi-queue — update the download docs

- **Edit `features/file-downloads/send.md`** (and/or the Usenet search-and-grab page — this behavior
  is shared across all three sources):
  - Each result now has **two buttons**: download, or **download and keep searching**.
  - Queued rows **stay locked for the visit**, so re-running or narrowing a search won't let you
    send the same release twice.
  - `!!!info` the DC++ exception: its result tokens are per search instance, so DC++ rows re-arm on
    a new search.
  - Note the **Reading List page's search modal** now has Usenet and DC++ sections and result
    scoring (it was GetComics-only before) — worth a line on
    `features/collection/reading-lists.md` too.

---

## 8. Two new folder actions — update File Management & Pull List

- **Edit `features/file-management/additional.md`** (and the collection grid docs):
  - **Want to Read** on files and folders — flags the item for the Want to Read swiper.
  - **Add to Pull List** on folders — runs the same identity resolution Scan Library uses, on one
    folder, so the result is indistinguishable from a full library scan (sidecars backfilled,
    issues synced, owned/missing rebuilt in the background).
  - **Table: outcome → meaning → what to do next** —
    `already_mapped` (no-op) / `applied` (mapped, syncing) / `needs_match` (no usable
    `series.json` or `.cvinfo`; a Metron picker opens) / `conflict` (series already mapped to a
    **different** folder — CLU reports where rather than re-pointing it) / `failed`.
  - `!!!info` constraints: the folder must be inside a configured library root (this is what keeps
    `/downloads` off the Pull List), and **root-level folders are excluded** in the collection grid
    because those are publishers, not series.
- **Cross-link from `features/pull-list/automap.md`** — this is single-folder Scan Library; a
  corrupt/unreadable sidecar returns *needs match* rather than failing.

---

## 9. Issue picker fallback — update Metadata docs

- **Edit `features/file-management/add-metadata.md`** (and the Source Wall / bulk metadata pages
  where relevant):
  - What changed: when the **volume matches but the issue number doesn't**, CLU now shows the
    volume's issues and lets you pick, instead of dead-ending on "No metadata found for selection".
  - The cases this covers: decimal/suffixed numbering (`1.MU`, `13A`) and files whose number differs
    from the provider's (`003` vs `23`).
  - **Batch behavior**: unmatched files are collected during a folder run and you walk through them
    afterwards, one at a time.
  - `!!!info` — near-miss providers are only offered **after the whole provider cascade comes up
    empty**, so a genuine match from a later provider always wins.
  - Scope note: Metron, ComicVine, ComicVine local DB and GCD API on the single-file path; the
    batch path also covers GCD. The bulk-review wizard already had its own picker.
  - Screenshot: `assets/single/issue-picker.png`.

---

## 10. Smaller doc touch-ups (fold into existing pages)

- **`features/file-downloads/status.md` — Cancel now actually stops a download.** Worth an explicit
  `!!!info` because the old failure modes were actively misleading: a cancelled Pixeldrain download
  completed and imported anyway, and a cancelled GetComics download came back as **Failed with a
  Retry button**. Mention that stopping isn't instantaneous — granularity is bounded by chunk size,
  so a slow link takes a few seconds.
- **`features/collection/reading.md` — reading position reliability.** The reader now saves on tab
  close, refresh and navigation rather than only on an explicit close; "Start Over" actually clears
  the saved position; very short comics (≤3 pages) can be bookmarked; and **reading positions follow
  a file through renames, moves and CBR→CBZ conversion**. That last one is the user-visible headline
  — worth its own sentence.
- **`features/usenet/search-and-grab.md` — the `.cbz` folder bug.** Grabs no longer create a
  *directory* named `Heavy Metal 5.cbz`. Note the monitor-side fix also repairs folders **already
  queued at your client** or created by other download clients, so users don't need to re-grab.
- **`features/directory-features/rename.md` / Smart Rename docs — bare-year filenames.**
  `Series ### YYYY` (unparenthesized year) previously parsed the year as the issue number, collapsing
  every file in a series to one name with " (2)", " (3)" suffixes. Fixed, and `{issue_year}` now
  falls back to the year in the filename when ComicInfo has none. `!!!warning` that files already
  renamed into collision suffixes need a re-run to recover.
- **`features/collection/series.md` — the Refresh button.** It now genuinely refetches from Metron
  (a provider-side response cache was serving stale data indefinitely), so a Summary edited on
  Metron appears. Same fix applies to **API Sync**, which additionally now updates a description
  that already had content instead of only filling a blank one.
- **FAQ (`frequently-asked-questions.md`)** — strong candidates:
  - "Why is my DC++ search taking 30 seconds?" (AirDC++ paces searches per hub)
  - "Can I use DC++ / ApexDC instead of AirDC++?" (no — DC++ has no remote API)
  - "My DC++ downloads land with mangled names" (target directory / separator; link to setup)
  - "Why does the Publisher filter on Weekly Releases only show some publishers?" (cache warming)
  - "I set the theme in Settings but my users still see the old one" (site default vs personal
    override)
  - "Why doesn't my reading list appear on the dashboard?" (you have to bookmark it)
  - "My folder art disappeared after a refresh" (fixed in v6.3 — prompt to upgrade)

---

## 11. Blog post

- The companion release post drafted at `clu-comics/readme/release63-blog.md` should be copied to
  `docs/blog/posts/v63-release-blog.md` and reconciled with the repo's blog front-matter style
  (match `v62-release-blog.md`).
- Fill in the screenshot `TODO` block at the top of the post before publishing.
- **Confirm the "Previous release" link** resolves to the published v6.2 post URL — see item #0;
  the equivalent link in the v6.2 post appears to be broken already.
- Add `categories: [Releases, Updates]` and `authors: [allaboutduncan]` if matching the older posts'
  style rather than the newer title/date-only style (the repo is inconsistent — pick one).

---

## Suggested execution order

1. **Users & Access (#1)** — the v6.2 backlog with v6.3 folded in. This is the largest piece of work
   here by a wide margin, and it's a shipped headline feature currently documented only in a blog
   post. If you only have time for one section, it's this one.
2. **DC++ section (#2)** — biggest net-new surface in v6.3, and the setup page (two-paths warning) is the
   highest-value support deflection in the release. Do `index` → `setup` → `search-and-grab` →
   `status-and-recovery`, then the Source Priority rewrite.
3. **Source Priority clarification** (end of #2) — small, but it's a *semantic* change to an
   existing documented feature, which is exactly what generates confused issues.
4. **Reading lists on the dashboard (#3)** and **Weekly Releases publisher filter (#6)** — visible
   new behavior people will hit immediately.
5. **Browse Library UI (#4)**, **folder thumbnails (#5)**, **folder actions (#8)**, **multi-queue
   modal (#7)** — UI changes, mostly short additions to existing pages.
6. **Issue picker (#9)** and the smaller touch-ups (#10).
7. **Blog post (#11)** and a final `mkdocs.yml` nav review, plus the #0 housekeeping.

## `mkdocs.yml` nav additions checklist

- [ ] New `Users & Access:` group — **does not exist yet** (v6.2 backlog): index, roles, first-run,
      managing-users, library-and-folder-access, personal-data, my-account
- [ ] New `DC++ Downloads:` group with 4 pages (index, setup, search-and-grab, status-and-recovery)
- [ ] Decide whether Source Priority moves out of the Usenet group now that it governs three sources
- [ ] Fix `repo_url` → `allaboutduncan/clu-comics`
- [ ] Refresh `site_description` for the v6.x feature set
- [ ] Confirm `features/users/personal-data.md` no longer claims theme is app-wide
- [ ] Confirm the new FAQ entries are registered/linked
