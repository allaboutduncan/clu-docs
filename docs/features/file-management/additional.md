---
description: >-
  As you browse and manage your library, there are additional features that will
  help you manage your collection
---

# Additional Features

### Directory Filtering

For any directory that has more than more than 25 folders, you can now start typing to filter the list. This does not search within the directories, this just quickly narrows down your results.

| ![](<../../assets/file/filter01.png>) | ![](<../../assets/file/filter02.png>) |
| :---------: | :----------------------------------: |

### Search

Search your Comic folders to see if you have a particular issue or to see if you want to look for a better file.

![Search](../../assets/file/search01.png){: .center-image}

When you start the app, all files and folders will be indexed and saved to the database. Timing on this will be dependent on your library. During testing, a library with 110,000 files indexed in about 12-minutes. 

When files and folders are moved, the app will add/update/delete them in the database. 

See the **File Index Management** section on [App Settings](../app-settings/file-settings.md) for more details and to manually re-index your library.

This searches you entire '/data' library, but ignores the 'TARGET' folder if you are using [folder-monitoring](../folder-monitoring/index.md)

### Recent Files

Clicking the "Recent Files" button will show the last 100 files that have been added (or moved) withing you collection. This is useful for seeing new downloads.

This provides results from your entire '/data' library, but ignores the 'TARGET' folder if you are using [folder-monitoring](../folder-monitoring/index.md)

![Recent Files](../../assets/file/recent-files.png){: .center-image}

### File & Folder Sizes

When viewing folders, you can click the _**info icon**_ and CLU will scan the folder and return the size and file count. This is done on request, as providing that data in the list would increase load time significantly.

![Folder Info](../../assets/file/folder-info.png){: .center-image}

When browsing files, you'll also see file size next to each file. This allows you compare two files, allowing you to see if a newer file was larger / better quality than an existing file.

![File Size](../../assets/file/file-size.png){: .center-image}

### View Cover, Meta-Data and ComicInfo.xml

Additionally, you'll see a new **info icon** next to all comics as well. Clicking this will open a modal window and the cover, meta-data and ComicInfo.xml data (if available) will be displayed.

Using the `<— Prev` and `Next -->` buttons, you can quickly view details for multiple issues.

![Info Modal](../../assets/file/info01.png){: .center-image}

For any comic that has a valid 'ComicInfo.xml' file, you'll also see a <i class="bi bi-eraser fs-2 text-danger"></i> icon that will let you clear the comic info for that file. This is useful if the metadata is incorrect or incomplete.

![Clear Comic Info](../../assets/file/clear-xml.png){: .center-image}

After clicking the icon, you'll be asked to confirm you want to delete the metadata. Clicking Yes, will unpack the file, delete the XML and re-pack the file.
