---
description: Automated background monitoring, unpacking, converting, and renaming of comic downloads.
---

# Folder Monitoring

Folder Monitoring is CLU's automated background ingestion pipeline. Running as a dedicated background worker process, it continuously watches a designated incoming directory for new comic downloads, unpacks archives, converts formats, cleans filenames, and routes processed issues directly into your library.

Whether files arrive from integrated downloaders (such as [Usenet](../usenet/index.md), [DC++](../dcpp/index.md), or [GetComics](../file-downloads/index.md)) or from manual transfers, Folder Monitoring automates post-processing so your comics are standardized and ready to read without manual intervention.

## Ingestion Pipeline

```
[ Incoming Downloads ]
          │
          ▼
   ┌─────────────┐
   │ WATCH Folder│ ◄── Waits for active downloads to finish (settling)
   └──────┬──────┘
          │
          ▼
   ┌───────────────────────────────────────────────┐
   │ Processing Pipeline                           │
   │  1. Auto-Unwrap nested & multipart archives   │
   │  2. Auto-Convert CBR/RAR to CBZ               │
   │  3. Auto-Extract multi-issue ZIP bundles      │
   │  4. Standardize & clean filenames             │
   └──────┬────────────────────────────────────────┘
          │
          ▼
   ┌──────────────┐
   │ TARGET Folder│ ◄── Clean, organized comics ready for reading & metadata
   └──────────────┘
```

## Folder Monitoring Sections

| Section | Description |
| --- | --- |
| **[Monitoring Setup](setup.md)** | How to enable the background monitor in Docker and configure **WATCH** and **TARGET** paths. |
| **[Features & Automation Rules](features.md)** | Extension filtering, format conversion, archive unwrapping, and pipeline integrity guards. |
| **[Monitoring Logs](logs.md)** | Inspecting real-time background logs to track active file ingestion. |
| **[File Processing Settings](../app-settings/file-settings.md)** | Global configuration for naming patterns, subdirectory traversal, and ignored terms. |
