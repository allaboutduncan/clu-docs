---
description: >-
  Renaming has been updated to allow removing text, renaming specific files or
  renaming all files in a directory.
---

# Rename

### Rename Single Files

![Folder Layout](../../assets/file/rename01.png)

Navigate to the directory or file you'd like to rename and click the :pencil2: icon. This will change to an input, allowing you to rename the folder or file.

`ENTER` to save/update the name

![Renaming the file](../../assets/file/rename02.png)

![File is renamed](../../assets/file/rename03.png)

### Rename All Files in a Directory

In all directory listings, you'll see a <i class="bi bi-input-cursor-text text-info fs-2"></i> icon button that will "Rename All Files" in that directory using your custom renaming logic or the default logic.

![Rename All Files in Directory](../../assets/file/rename-all.png)

Clicking this will run the same renaming functions detailed on [Clean All Filenames](../directory-features/clean.md "mention"). This let's you easily run this feature as you are browsing your folders of if you manually add bulk issues or don't use the [folder-monitoring](../folder-monitoring/index.md "mention") features.

### Remove Text from Files

You can now remove characters from groups of files while browsing a directory. If there are files present, you will see a "Remove Text from Filenames" button. Clicking this will bring up a modal and prompt for the characters to remove. Include any spaces you want removed as well.

In this example, I want to update all files and remove the " v01" from the titles.

![Remove Text Modal](../../assets/file/remove01.png)

Click preview once you have your text entered and the app will show a preview of the results. 

![Remove Text Preview Results](../../assets/file/remove02.png)

If the naming is as you would like, click the "Execute Rename" and the app will update all of the files, provide a summary and then close the modal.

![Remove Text Complete](../../assets/file/remove03.png)

### Replace Text in Filenames

You can also replace text in all filenames in a directory. In this example, the series is "Saga of the Swamp Thing" and I want the naming to be "**The** Saga of the Swamp Thing"

Simply click the "Replace Text" button, enter the text to replace and then the replacement text.

![Replace Text Modal](../../assets/file/replace01.png)

Click "Preview" to ensure your results are correct.

![Replace Text Preview Results](../../assets/file/replace02.png)

Once you are satisfied with the results, click "Execute Rename" to process. Once completed, you'll see a summary of files renamed.

![Replace Text Complete](../../assets/file/replace03.png)

### Rename Series

You can also rename all files in a directory, replacing everything except the {issue} & {year}. This is useful if a series is named differently or truncated. In this example, all files were named Swamp Thing, but the series didn't switch to that naming until issue 31. We can rename all the files quickly.

![Rename Series Modal](../../assets/file/rename-series01.png)

Type in the new file naming you want and click preview. You'll see the expected results for the first 3 files. Click "Execute Rename" to proceed or adjust your naming and click "Preview" to review.

![Rename Series Preview Results](../../assets/file/rename-series02.png)

Once you are satisfied with the results, click "Execute Rename" to process. Once completed, you'll see a summary count of all files renamed.

![Rename Series Complete](../../assets/file/rename-series03.png)
