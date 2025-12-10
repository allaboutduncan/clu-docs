---
description: Clean all filenames in the directory
---

# Clean All Filenames

![Clean All Filenames](../../assets/directory/rename01.png){: .center-image }

Rename (Clean) Filenames is a directory based feature that allows you to clean all filenames in a directory and any sub-directories. It is accessed via the <i class="bi bi-input-cursor-text fs-2 text-primary"></i> icon to the right of the directory name in the File Manager.

Currently this function does 5 things to all files in a directory and any sub-directories.

1. Removes everything in parentheses with the exception of the 4-digit year (if available)
2. Removes `c2c`
3. Removes anything in brackets `[any text removed]` - along with the brackets
4. Removes any text / characters after "filename issue (year)"
5. Removes any extra spaces before the file extension

The pattern used for renaming is `{Series Name} {Issue Number} ({Year})`

[Mylar3](https://mylarcomics.com/) and [ComicRackCE](https://github.com/maforget/ComicRackCE) should be your first choice for performing these actions, but I wanted something I could easily run on my manual downloads directory or repair in a one-off method.

Oftentimes series archives or torrent files will have numerous naming patterns with information in parenthesis, brackets, before the year, after and all over the place. I continuously update these to handle as many as I encounter.

### Renaming Rules

Currently renaming rules are in `rename_rules.ini` and are priority based

The current set of rules are always available to view in the repository and can be found [here](https://github.com/allaboutduncan/comic-utils/blob/main/config/rename_rules.ini)
