---
description: Clean and standardize comic filenames across a directory and subdirectories.
---

# Rename All Files

![Rename All Files](../../assets/directory/rename01.png){: .center-image }

The **Rename All Files** tool standardizes and cleans filenames across all comics in a directory and its subdirectories. It is accessed via the <i class="bi bi-input-cursor-text fs-2 text-primary"></i> icon to the right of any directory name in the **File Manager**.

When executed, the renaming engine applies the following cleaning rules:

1. Removes all parenthetical metadata with the exception of the 4-digit release year (if present).
2. Removes release format tags such as `c2c` (cover-to-cover).
3. Strips bracketed annotations (e.g. `[any text]`) along with the brackets themselves.
4. Trims scanner watermarks and trailing metadata appearing after `{Series} {Issue} ({Year})`.
5. Removes duplicate whitespace and trailing spaces before the file extension.

The default naming pattern is:
`{Series Name} {Issue Number} ({Year})`

You can configure custom naming formats in [File Settings](../app-settings/file-settings.md#custom-naming-settings).

### Issue Number Handling

The renaming engine includes built-in rules for edge cases:

- **Configurable leading zeros**: The [Issue Number Leading Zeros](../app-settings/file-settings.md#issue-number-leading-zeros) setting controls issue padding: **None** (`44`), **3 digits** (`044`, default), or **4 digits** (`0044`).
- **Decimal and suffix issues**: Point issues (e.g. `001.1`) and publisher event tags (e.g. `1.MU`, `.NOW`, and `.INH`) are preserved during renaming.
- **Large issue numbers**: High issue numbers (such as DC `#1,000,000` one-shots like *Action Comics 1000000*) are preserved without truncation.

### Batched Bulk Renames

Renaming directories with large file counts executes as a single, coalesced background task. Progress updates in real time via the **operations indicator** in the top navigation bar.

Batch renames run on a shared file job queue alongside post-move tagging, Remove XML, and bulk metadata tasks:

- Jobs run sequentially in the order submitted, ensuring a rename operation never moves a file while a tagging job is active.
- If another file operation is running, the rename dialog indicates that the job is queued and will start automatically once the current job finishes.

### Renaming Rules & Year Parsing

Renaming rules are configured in `rename_rules.ini` on a priority basis. The default rule definitions are maintained in the [project repository](https://github.com/allaboutduncan/comic-utils/blob/main/config/rename_rules.ini).

#### Bare-Year Filenames

Filenames containing unparenthesized release years (such as `Star Wars - Poe Dameron 001 2016`) are parsed correctly, ensuring the four-digit year is not mistakenly captured as the issue number. When an archive lacks a `ComicInfo.xml` tag, the `{issue_year}` token falls back to the year extracted from the filename.

!!! tip "Resolving collision suffixes"
    If files in a folder previously acquired collision suffixes (such as `Series (2).cbz`, `Series (3).cbz`), simply re-run **Rename All Files** on that folder to re-parse the archives and restore their proper issue numbers.
