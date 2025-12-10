---
description: Rebuilds all files in a directory.
---

# Rebuild All Files

![Rebuild Directory](../../assets/directory/rebuild.png){: .center-image }

Very similar to convert, except it doesn't skip any existing CBZ files.

This utility does 2 things:

1. Convert all RAR / CBR files to CBZ
2. Rebuild all ZIP / CBZ files

I often see, in both newer and older files, that Komga doesn't recognize or scan them correctly.&#x20;

More often than not, rebuilding them corrects the error. This option will rebuild all files in a directory (RAR/CBR/ZIP/CBZ --> CBZ)

!!! info
    If the app fails to unpack a CBZ file, it will attempt to extraxt using RAR. I have encountered files where they were CBR files with the extension incorrectly renamed to CBZ instead of being properly converted. The app will account for that during any unpack/re-pack operation.

For PDF conversions - see the next function
