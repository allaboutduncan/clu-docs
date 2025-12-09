# Collection Browsing

![Publisher Example Page](/assets/collection/publisher.png)
/// caption
Example Publisher Page with Nested Folders
///

With CLU, you can visually browse your collection. It will load you root (/data) folder and display all folders and files in it. For documentation purposes, we'll refer to this as the "Publisher" section, but it can be any folder structure you have in your collection.

Each folder will have a <i class="bi bi-three-dots-vertical fs-2 text-icon"></i> menu that will allow you to perform actions on the folder. Publisher folders will have different options than folders that contain issues. 

!!! Warning
    On the first load, CLU will scan your collection and generate thumbnails for all files. This can take some time if you have a large collection. A collection of 100,000 files will take ~2 hours to scan. All future loads will be near-instant.

## Publisher Folders

![Publisher Dropdown Menu](/assets/collection/pub-dropdown.png)

There are 3 options in the dropdown menu:

- **Scan Files**: This will scan the folder and rebuild the database for this publisher, capturing any new files or structure changes.
- **Generate Missing Thumbnails**: This will generate thumbnails for all folder that are missing a thumbnail.
- **Missing File Check**: This will check for missing files in the folder based on the [Directory Features Missing File Check](../directory-features/missing.md).

## Series or Issue Folders

