---
description: Automated processing features, archive unwrapping, and safety guards in Folder Monitoring.
---

# Features

When Folder Monitoring is enabled, CLU applies an automated processing pipeline to any new files or directories appearing in your **WATCH** folder.

## Ignored Extensions

Folder monitoring can be configured to ignore specific file extensions. This serves two purposes:

1. **Ignoring active download temp files**: File transfer tools often create temporary files while downloads are in flight. Adding these extensions ensures CLU ignores them until transfers finish.
2. **Excluding non-comic files**: Prevents unwanted companion files (such as `.nfo`, `.torrent`, or raw images) from being moved or processed into your library.

Default ignored file extensions include:

```ini
.crdownload,.torrent,.tmp,.mega,.rar,.bak,.dctmp
```

## Renaming

When enabled, incoming comic files are automatically cleaned and standardized using the rules described in [Rename All Files](../directory-features/rename.md). Filenames are formatted according to your configured [Custom Rename Pattern](../app-settings/file-settings.md#custom-naming-settings) as they move from WATCH to TARGET.

## Process Subdirectories

By default, monitoring processes only files resting in the root of the **WATCH** directory. Enabling **Process Subdirectories** allows the monitor to traverse nested child folders inside WATCH, applying extraction, conversion, and renaming to all contained files.

## Move Subdirectories

When downloading multi-issue packs or complete series runs, files often arrive inside a series subfolder. Enabling **Move Subdirectories** preserves this grouping: the entire subfolder is cleaned, renamed using standardized series naming rules, and moved into the **TARGET** directory with its issues intact.

## Auto ZIP Extraction

When enabled, multi-file `.zip` packages appearing in the **WATCH** folder are automatically extracted once completely written to disk. Extracted files maintain their internal folder hierarchy and are subsequently processed by the remaining pipeline steps.

## Convert to CBZ

When enabled, any `.cbr` or `.rar` comic archive detected in the **WATCH** folder is automatically converted into a standard `.cbz` archive before moving to TARGET.

## Auto-Unwrap for Hybrid & Multipart Releases

Usenet releases and complex web downloads often arrive as nested, multi-part, or obfuscated packages — such as a folder of `.zip` or `.rar` split volumes that extract to another archive layer before revealing the final comic file.

CLU automatically detects and unwraps these packages through a dedicated pre-processing workflow:

1. **Identifies** the release folder within the **WATCH** directory.
2. **Waits** for all parts to finish downloading (settling) before initiating extraction.
3. **Extracts** nested archives layer-by-layer inside an isolated temporary workspace.
4. **Converts** any extracted PDF documents into standard CBZ archives.
5. **Renames** the extracted comic to a clean title and hands it off to the primary monitoring pipeline.

### Unwrapping Guarantees

- **Isolated extraction**: Files are unpacked in an isolated staging directory, never in place over your active files.
- **Safety checks**: The unwrapper will not trigger if a valid, ready-to-read comic archive already exists in the top level of the folder.
- **Clean error handling**: Temporary extraction artifacts are purged upon success; if an extraction fails, the source archive is preserved so it can be retried or inspected.

See [Searching & Grabbing](../usenet/search-and-grab.md) for details on how Usenet releases interact with this feature.

## Pipeline Safeguards

Folder Monitoring includes several built-in protections to ensure library stability:

### Active Download Detection

CLU monitors file size over time to ensure files have stopped growing before attempting to read, unpack, or move them. In-progress downloads from clients like AirDC++ or torrent applications are left alone until fully written. Orphan cleanup routines will never delete files whose size is actively changing.

### Graceful Archive Error Handling

If an archive in the WATCH directory is corrupted or unreadable, CLU attempts extraction once, logs the failure, and moves the item to the **[Problem Files](../problem-files/index.md)** page under the **Unpack** category. The file will not loop or create duplicate numbered files on successive sweeps.

### Atomic Transfers

Files moved from WATCH to TARGET are verified upon arrival. If a transfer is interrupted, any partial destination file is cleaned up immediately, preventing the creation of numbered duplicate copies (e.g. `Comic (2).cbz`) on subsequent monitoring passes.

### Clean CBR Replacement

When converting CBR files to CBZ, CLU verifies the integrity of the generated CBZ archive before safely removing the source CBR file from disk.
