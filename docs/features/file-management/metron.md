---
description: How to get metadata and create ComicInfo.xml files
---

# Metron Metadata

![Metron Info](../../assets/settings/metron.png){: .center-image}

If you have entered a [Metron Username and Password](../app-settings/download-settings.md#metadata-api-configuration) in settings, Metron will be used to search for metadata when moving issues.

!!! info "Single Issue Metadata Only"
    The **Metron** feature only searches for metadata for a single issue. If you have multiple issues in a directory, you will need to use the [GCD Database Method](../gcd-settings/index.md) feature to process multiple issues.

After reviewing metadata providers, Metron has new release data updated before other providers. When moving files, if configured, Metron will be used before falling back to ComicVine.

## Metadata Added on File Move

If enabled, when you move a file (or files) to a new location the metadata will be applied automatically if the following criteria are met:

- There is a valid `cvinfo` file in the same directory
- There is no `ComicInfo.xml` file
- If there is a Comicvine ID in the `cvinfo` file, we will attempt to get the Metron ID and add that to the `cvinfo` file
- Metron will be used to search for metadata for the issue before ComicVine