---
description: Rename all files in the directory
---

# Rename All Files

![Rename All Files](../../assets/directory/rename01.png){: .center-image }

Rename (Clean) Filenames is a directory based feature that allows you to clean all filenames in a directory and any sub-directories. It is accessed via the <i class="bi bi-input-cursor-text fs-2 text-primary"></i> icon to the right of the directory name in the File Manager.

Currently this function does 5 things to all files in a directory and any sub-directories.

1. Removes everything in parentheses with the exception of the 4-digit year (if available)
2. Removes `c2c`
3. Removes anything in brackets `[any text removed]` - along with the brackets
4. Removes any text / characters after "filename issue (year)"
5. Removes any extra spaces before the file extension

The default pattern used for renaming is `{Series Name} {Issue Number} ({Year})`

You can define custom naming patterns in [File Settings](../app-settings/file-settings.md#custom-naming-settings).

### Issue Number Handling

!!! info "Improved in v6.0"
    The rename engine picked up one new setting and several correctness fixes in **v6.0**.

- **Configurable leading zeros** — the [Issue Number Leading Zeros](../app-settings/file-settings.md#issue-number-leading-zeros) setting controls issue-number padding: **None** (`44`), **3** (`044`, the default), or **4** (`0044`).
- **Decimal & suffix issues preserved** — point issues like `001.1` and Marvel tags like `1.MU`, `.NOW`, and `.INH` keep their suffix through renaming and wanted-matching (previously `Avengers 001.1` could become `Avengers 001`).
- **DC "One Million" issues** — `#1,000,000` one-shots (e.g. *Action Comics 1000000*) are preserved and no longer truncated to `1000`.

### Batched Bulk Renames

Renaming many files at once now runs as a **single queued, coalesced background operation** instead of one request per file. This is dramatically faster on large batches and doesn't hammer the database — progress shows in the nav **operations indicator**. This is mainly a performance/UX improvement; the resulting filenames are unchanged.

Oftentimes series archives or torrent files will have numerous naming patterns with information in parenthesis, brackets, before the year, after and all over the place. I continuously update these to handle as many as I encounter.

### Renaming Rules

Currently renaming rules are in `rename_rules.ini` and are priority based

The current set of rules are always available to view in the repository and can be found [here](https://github.com/allaboutduncan/comic-utils/blob/main/config/rename_rules.ini)
