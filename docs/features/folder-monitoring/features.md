---
description: What can folder monitoring do?
---

# Features

Once enabled and configured, here are a list of features that are available via folder monitoring.

## Ignored Extensions

This setting is used to ignore file types in your **WATCH** folder. Any extension configured here will be ignored. This is used in 2 ways:

1. Ignore temp files associated with downloads. The app monitors filesize and attempts to determine when a file download (or move) is complete. Certain file extensions are associated with temp files and this setting allows us to easily ignore them.
2. Some files could contain multiple files or a single file (RAR) or we may not want to move and rename PDF files or images placed in the WATCH folder. Just add the file extension and they will be ignored.

Default file extensions are:

```ini
.crdownload,.torrent,.tmp,.mega,.rar,.bak
```

## Renaming

This feature is enabled by default and will be running when monitoring is enabled. 

This applies the same renaming logic outlined in the [Rename All Files](../directory-features/rename.md) section to any file added to the directory.

Files will be moved to the **TARGET** directory when they are renamed.

## Process Sub-Directories

When enabled, this feature will apply all other configured options to you **WATCH** folder.

For example, sub-directory files will not be renamed and moved by default. If enabled, all files on the root of your **WATCH** folder will be renamed as well as any sub-directories.

## Move Sub-Directories

If you have multiple issues of a series in a sub-directory of your **WATCH** folder, you may want to keep them in a separate folder as opposed to the root of the **TARGET** folder.

Simply enable this feature and the sub-directory will be moved along with the files.

**Note:** The sub-directory name will be renamed/cleaned using similar logic to the filenames.

## Auto ZIP Extraction

If you download a ZIP file with multiple files, when this feature is enabled, all files will be extracted once the download is complete.

Files are extracted to the **WATCH** folder and will maintain the structure within the ZIP file.

## Convert to CBZ

When enabled, any CBR file will be auto-converted to a CBZ when processed.

## Auto-Unwrap for Hybrid & Multipart Releases

!!! info "New in v6.0"
    Auto-unwrap is new in **v6.0**. There's nothing to configure.

    As of **v6.4** the **Auto-Unpack** setting is gone — archives in WATCH are always unpacked, and unpacked based on what's inside them. See [How archives in WATCH are handled](../app-settings/file-settings.md#how-archives-in-watch-are-handled).

Usenet releases don't always arrive as a ready-to-read comic. Many show up as a **hybrid/multipart release**: a folder of obfuscated, multi-part archives — a set of `.zip` parts that extract to a `.RAR` that finally extracts to the actual PDF, CBR, or CBZ. The old per-file monitor couldn't tell that four zips were really one archive, so it treated each obfuscated part as a separate file.

CLU now recognizes these packaged releases and **unwraps them automatically**. A folder-level pre-pass:

1. **Claims** the release folder in your **WATCH** directory.
2. **Waits** for all parts to finish arriving (settling) before touching anything.
3. **Extracts** the nested archives **layer by layer in an isolated work area**.
4. **Renames** the emerged comic to a clean release name and **converts PDF → CBZ**.
5. **Hands off** to the normal monitoring pipeline.

Key guarantees:

- **The source is never mutated.** Extraction happens in isolation, not in place.
- **Conservative by design.** It won't fire when a ready comic is already present in the folder.
- **Cleans up on success, keeps on failure.** Leftover parts and cruft are deleted after a successful unwrap; on failure the source is left alone and retried later.

<!-- TODO: before/after screenshot — obfuscated parts vs. clean CBZ (assets/monitor/unwrap.png) -->

See [Searching & Grabbing](../usenet/search-and-grab.md) for how these releases arrive from Usenet.

## Fixes in v6.5

Four long-standing ways a WATCH folder could work against you, all fixed in **v6.5**.

### A corrupt archive is opened once, not forever

!!! info "Fixed in v6.5"
    A damaged `.zip` in WATCH used to be re-extracted on **every five-minute sweep**, producing a trail of `Comic (19).cbz`-style duplicates in your processed folder and thousands of log lines — forever, or until you noticed and deleted it.

    It now **fails once**, is recorded on the [Problem Files](../problem-files/index.md) page under **Unpack**, and is left alone.

This is the one row type that explains *"my download vanished and never appeared in the library"* — the file never reached your library, so nothing else would ever have told you about it.

### Partial downloads are left alone

!!! info "Fixed in v6.5"
    An AirDC++ transfer still in progress (a `.dctmp` file) was being imported as a **finished comic every 30 seconds**. One report left **28 copies** of the same file.

Two guards were added alongside it:

- **Orphan cleanup refuses to delete anything that's still growing.** A file whose size is changing is a download in progress, not an orphan.
- **The Clean Up Orphan Files button got the same guard**, so clicking it mid-download no longer kills the download.

!!! info "Another client's queue is never reaped"
    In-progress queue items belonging to another download client are **never** cleaned up, regardless of age. A DC++ queue item can legitimately sit idle for **hours** waiting for a source, and idle is not the same as abandoned.

### A failed move leaves no copy behind

!!! info "Fixed in v6.5"
    If a move out of WATCH failed part-way, the partial destination file was left in place — and a full copy left behind gets **re-imported under a new name on the next sweep**, which is how you end up with numbered duplicates of a file you only downloaded once.

    CLU now cleans up the partial destination when a move fails.

### No more CBR sitting beside its own CBZ

!!! info "Fixed in v6.5"
    On **CIFS/SMB and Windows-backed WSL2 mounts**, a CBR-to-CBZ conversion could write a **perfectly good CBZ and still report itself as failed** — so the original CBR was kept, and you got both files. On **every** download.

    The conversion is now reported correctly. See [Convert Directory](../directory-features/convert.md).

!!! note "Existing pairs need cleaning up by hand"
    The fix stops new pairs being created; it doesn't go looking for the ones you already have. Sort a folder by name and the `.cbr`/`.cbz` pairs are easy to spot.
