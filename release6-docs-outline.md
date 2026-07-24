# v6.0 Documentation Outline (for the `clu-docs` repo)

This is a work plan to hand to Claude Code **inside the `clu-docs` repo** to draft and revise
documentation for everything shipped in v6.0. It maps each feature to the exact nav section,
file(s) to create or edit, and the doc conventions already used in the repo.

## How to use this file

1. Copy this file into the `clu-docs` repo (or reference it by path).
2. Open Claude Code in `clu-docs` and work section by section — each numbered item below is a
   self-contained task ("create/update this page, with these headings, table, and screenshots").
3. Screenshots referenced as `assets/...` need to be captured and dropped in before publishing —
   the same `assets/` paths are used by the companion blog post (`release6-blog.md`).

## Repo conventions to follow (match existing pages)

- **Front matter:** feature pages use an optional `--- description: ... ---` block; blog posts use
  `--- date / categories / authors ---` (see `docs/blog/posts/`).
- **Page title:** single `# H1` at the top of each feature page.
- **Images:** `![Alt](../../assets/<group>/<file>.png){: .center-image}`, optionally followed by a
  caption block:
  ```
  /// caption
  Caption text
  ///
  ```
- **Callouts:** admonitions via `!!!info "Title"` / `!!!warning "Title"` (see `manga-metadata-and-more.md`).
- **Tables** for settings, filters, and option enumerations (see `pull-list.md`).
- **Cross-links** with relative paths, e.g. `[Download Settings](../app-settings/download-settings.md)`.
- **Nav:** every new page must be registered in `mkdocs.yml` under the right section.

---

## 1. Usenet (Newsgroup) Downloads — NEW section (highest priority)

Usenet is a whole new download source and deserves its own nav group, parallel to **File Downloads**.

**New nav group `Usenet Downloads:` in `mkdocs.yml`, with:**

- `features/usenet/index.md` — **Overview**
  - What Usenet support is; how it sits alongside GetComics (not a replacement).
  - The three pieces: download client, indexers, Source Priority.
  - Requirements: a Usenet provider account, a download client, at least one Newznab indexer.
  - `!!!info` note that this is new in v6.0.
- `features/usenet/setup.md` — **Adding a Download Client**
  - Step-by-step for **SABnzbd** and **NZBGet** (Host, Port, API key/username/password, category).
  - How **Test Connection** works and what the readable error states mean (connection refused / 401 / non-JSON / timeout).
  - `!!!warning` that only one download client is active at a time.
  - Screenshot: `assets/usenet/download-clients.png`.
- `features/usenet/indexers.md` — **Adding Newznab Indexers**
  - Adding one or more indexers (URL, API key), the default comics category (`7030`), priority ordering.
  - Table of fields.
  - Screenshot: `assets/usenet/indexers.png`.
- `features/usenet/source-priority.md` — **Source Priority**
  - Explain Usenet-first vs GetComics-first behavior for **auto-download** (Usenet hit skips GetComics; otherwise Usenet is a fallback when GetComics queues nothing).
  - Explain how priority orders results in the manual/Wanted search UIs.
  - Table: scenario → behavior.
- `features/usenet/search-and-grab.md` — **Searching & Grabbing**
  - Manual search from the series page and from **Wanted Issues** (both now show GetComics + Usenet under labeled headers).
  - The grab button; where the file lands (`<series> <issue>.cbz` in WATCH) and how wanted-matching picks it up.
  - Note that no-issue / bare-title releases appear in manual search but are excluded from auto-download.
  - Screenshot: `assets/usenet/wanted-dual-search.png`.

**Also update:**
- `features/pull-list/wanted.md` — add the Usenet result section + Source Priority note.
- `features/app-settings/download-settings.md` — link out to the new Usenet setup pages.

---

## 2. Auto-Unwrap for Hybrid / Multipart Releases — update Folder Monitoring

Usenet releases often arrive as nested/obfuscated multi-part archives (zip parts → RAR → comic).

- **Edit `features/folder-monitoring/features.md`** (or add `features/folder-monitoring/unwrap.md`):
  - What a "hybrid/multipart" release looks like in WATCH.
  - How CLU claims the folder, waits for parts to settle, extracts layer-by-layer in isolation, renames, converts PDF→CBZ, and hands off.
  - Emphasize: **source is never mutated**; conservative (won't fire when a ready comic is present); parts/cruft deleted on success, source kept with retry on failure.
  - Note it's gated behind the existing **AutoConvert / Auto-Unpack** setting (no new config).
  - `!!!info` that this is new in v6.0.
  - Optional before/after screenshot: `assets/monitor/unwrap.png`.

---

## 3. Pull List: Monitoring, Color-Coding & Bulk Actions — update Pull List

- **Edit `features/pull-list/pull-list.md`:**
  - New **Monitor flag** subsection: what monitoring on/off does (greyed row; excluded from wanted refresh and auto-download).
  - New **Collection health color-coding** subsection: complete / missing / upcoming, the status filter, and the on-page legend. Add a table of status → color → meaning.
  - New **Bulk actions** subsection: checkbox multi-select (SHIFT = range, CTRL/CMD = toggle), the bulk Monitored / Not Monitored toolbar.
  - New note on **import defaults**: complete + ended (Cancelled/Completed) series default to Monitor off on Scan Library import; monitoring is only ever turned off automatically, never back on.
  - Screenshots: `assets/pull-list/monitoring.png`, `assets/pull-list/bulk-select.png`.
- **Edit `features/pull-list/series.md`:** document the per-series Monitor toggle on the series page.

---

## 4. Sidecar-Based Pull List Automap — NEW page in Pull List

- **New `features/pull-list/automap.md`** (add to nav under Pull List):
  - What Automap does: scans library roots for `series.json` / `cvinfo` sidecars, resolves to Metron/ComicVine series, classifies into **auto / needs review / skipped**.
  - The review modal workflow; applying mappings backfills sidecars and triggers background sync + collection match.
  - Note **ComicVine-only series** support and that sidecar `publisher`/`status` are preserved.
  - Mention the Mylar `<publisher>/<series>/v<year>/` layout is handled (volume folder no longer used as the series name).
  - Table: classification → meaning → action.
  - `!!!info` new in v6.0.
  - Screenshot: `assets/pull-list/automap-scan.png`, `assets/pull-list/automap-review.png`.
- **Cross-link** from `features/pull-list/index.md` and the Scan Library docs.

---

## 5. Split File — NEW page in File Management

- **New `features/file-management/split.md`** (add to nav under File Management):
  - When to use it (a "collected" CBZ that's really multiple issues).
  - Walkthrough: dropdown → **Split File** → boundary auto-detection from page filenames → editable grouped grid (add/merge boundaries, rename per issue) → commit.
  - Emphasize the **original file is left untouched**; output is one image-only CBZ per issue in a new series subfolder.
  - `!!!info` that this is CBZ-only and new in v6.0.
  - Screenshots: `assets/file/split-file-grid.png`, `assets/file/split-file-result.png`.

---

## 6. Renaming Improvements — update Custom Naming / Rename docs

- **Edit `features/directory-features/rename.md`** and/or `features/file-management/rename.md`:
  - New **Issue Number Leading Zeros** setting: document None / 3 / 4 with a table of examples
    (`44` / `044` / `0044`), the default (3), and that decimal/alpha suffixes are preserved at every width.
  - Note decimal & suffix issue handling (`001.1`, `1.MU`, `.NOW`, `.INH`) is now preserved in rename + matching.
  - Note DC "One Million" (`#1,000,000`) issues are preserved.
  - Mention **bulk renames are now batched** (single queued operation; progress in the nav ops indicator) — mostly a performance/UX note.
  - Screenshot: `assets/settings/leading-zeros.png`.
- **Check** the Custom Naming Settings docs (wherever the rename pattern UI is documented) and add the dropdown there too.

---

## 7. Smaller doc touch-ups (fold into existing pages)

- **`features/app-settings/download-settings.md`** — download-client config now pre-fills real values with a working reveal toggle, and partial edits no longer wipe other fields. One or two sentences.
- **`features/app-settings/metadata.md`** (or the Metron provider docs) — Metron "Script"/"Plot" credit roles now map to **Writer**. One line.
- **`features/collection/index.md` / Browse Library docs** — the "Per page" selection now persists across navigation. One line.
- **FAQ (`frequently-asked-questions.md`)** — consider a "Illegal seek / CBZ write errors on mergerfs/FUSE" entry pointing at the v6.0 fix (writes now assembled locally and moved into place). Good for the self-hosted crowd.

---

## 8. Blog post

- The companion release post already drafted at `clu-comics/readme/release6-blog.md` should be copied to
  `docs/blog/posts/v6-release-blog.md` and reconciled with the repo's blog front-matter style
  (compare `v414-release-blog.md` vs `source-wall-and-safety-update.md` — decide on `title/date`
  vs `date/categories/authors` + `# H1`).
- Fill in the screenshot `TODO` block at the top of the post before publishing.
- Update the "Previous release" link if the v4.14 post's final URL differs.

---

## Suggested execution order

1. Usenet section (#1) — biggest, most net-new, most likely to generate support questions.
2. Pull List updates (#3) + Automap (#4) — closely related, shared screenshots.
3. Split File (#5) and Rename changes (#6).
4. Auto-unwrap (#2) and the smaller touch-ups (#7).
5. Blog post reconciliation (#8) and final `mkdocs.yml` nav review (confirm every new page is registered).

## `mkdocs.yml` nav additions checklist

- [ ] New `Usenet Downloads:` group with 5 pages (index, setup, indexers, source-priority, search-and-grab)
- [ ] `Automap: features/pull-list/automap.md` under **Pull List**
- [ ] `Split File: features/file-management/split.md` under **File Management**
- [ ] (Optional) `Unwrapping Releases: features/folder-monitoring/unwrap.md` under **Folder Monitoring**
