---
description: Installation Steps for Config
---

# Config Installation

When installed, the following values are set by default in the config file

```ini
[SETTINGS]
WATCH=/downloads/temp
TARGET=/downloads/processed
IGNORED_TERMS=Annual
IGNORED_EXTENSIONS=.crdownload,.torrent,.tmp,.mega,.rar,.bak
IGNORED_FILES=cover.jpg,cvinfo,.DS_Store
READ_SUBDIRECTORIES=True
CONVERT_SUBDIRECTORIES=True
AUTOCONVERT=True
MOVE_DIRECTORY=True
AUTO_UNPACK=True
```

During installation (see [Quickstart](../../getting-started/quickstart.md)),the `/config` is mapped to a separate docker volume to ensure that config settings are persisted on updates.

```yaml
volumes:
  - 'config-volume:/config'
```

**First Install:** On the first install with new config settings, visit the config page, ensure everything is configured as desired.

* Save your Config settings
* Click the Restart App button

### Explanation of Values

<table><thead><tr><th>Parameter</th><th width="439">Function</th></tr></thead><tbody><tr><td><pre><code>WATCH
</code></pre></td><td>Path/Folder to watch if folder monitoring enabled</td></tr><tr><td><pre><code>TARGET
</code></pre></td><td>Path/Folder to where watched files are moved after processing</td></tr><tr><td><pre><code>INGNORED_TERMS
</code></pre></td><td>Option for Missing Issue Check to not look for issues.</td></tr><tr><td><pre><code>IGNORED_EXTENSIONS
</code></pre></td><td>File types that will be ignored by Missing Issue Check</td></tr><tr><td><pre><code>IGNORED_FILES
</code></pre></td><td>Files here will not show when browsing file structure in the app.</td></tr><tr><td><pre><code>READ_SUBDIRECTORIES
</code></pre></td><td>Read sub-directories when folder monitoring enabled</td></tr><tr><td><pre><code>CONVERT_SUBDIRECTORIES
</code></pre></td><td>Enable traversing sub-directories when converting CBR to CBZ</td></tr><tr><td><pre><code>AUTOCONVERT
</code></pre></td><td>Auto-convert files to CBZ as they are downloaded with folder monitoring enabled</td></tr><tr><td><pre><code>XML_YEAR
</code></pre></td><td>Move sub-directories when moving files in folder monitoring</td></tr><tr><td><pre><code>AUTO_UNPACK
</code></pre></td><td>When using <strong>Folder Monitoring</strong>, this will enable auto-extraction of ZIP archives</td></tr><tr><td><pre><code>GCD_METADATA_LANGUAGES
</code></pre></td><td>When using <strong>GCD Metadata</strong>, CLU will search for metadata on these languages</td></tr></tbody></table>
