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
    Auto-unwrap is new in **v6.0**. It's gated behind the existing **AutoConvert / Auto-Unpack** setting — there's nothing new to configure.

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
