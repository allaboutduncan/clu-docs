---
description: Quick install using Docker
---

# Quickstart

Docker Hub images are available for quick installation and deploy.

!!! tip "New to Docker on Windows?"
    [Installing CLU on Windows with Docker Desktop](../blog/posts/windows-install-walkthrough.md) walks through every step, from installing Docker Desktop to opening CLU in your browser.

### Install via Docker Compose

```yaml
services:
    comic-utils:
        image: allaboutduncan/comic-utils-web:latest

        container_name: clu
        logging:
            driver: "json-file"
            options:
                max-size: '20m'  # Reduce log size to 20MB
                max-file: '3'     # Keep only 3 rotated files
        restart: always
        ports:
            - '5577:5577'
        volumes:
            ## REQUIRED. Without this, the database lives in the container's own
            ## writable layer and is destroyed on the next image update.
            - 'config-volume:/config' # Maps to a Docker Volume for Database Storage and Backups
            - "/path/to/local/cache:/cache" # Maps to local folder for thumbnail cache
            ## update the line below to map to your library.
            ## Map your first/main library to /data
            - "/e/Comics:/data"
            ## Map additional drives/libraries and add them in the app settings
            - "/f/Magazines:/magazines"
            ## Additional folder if you want to use Folder Monitoring.
            - "/f/Downloads:/downloads"
        environment:
            - FLASK_ENV=production
            ## Set the User ID (PUID) and Group ID (PGID) for the container.
            ## This is often needed to resolve permission issues, especially on systems like Unraid
            ## where a specific user/group owns the files.
            ## For Unraid, PUID is typically 99 (user 'nobody') and PGID is typically 100 (group 'users').
            ## For Windows/WSL, you need to set these to match your Windows user ID (see WINDOWS_WSL_SETUP.md)
            - PUID=99
            - PGID=100
            ## File creation mask. 000 -> world-writable folders (drwxrwsrwx) and files
            ## (-rw-rw-rw-). Use 002 for group-writable (775/664) or 022 for owner-only writes.
            - UMASK=000
volumes:
  config-volume: # Required for Database Storage and Backups
```

### Install via Docker

```text
docker run -d \
  --name clu \
  --restart always \
  -p 5577:5577 \
  --log-driver json-file \
  --log-opt max-size=20m \
  --log-opt max-file=3 \
  -v config-volume:/config \
  -v /path/to/local/cache:/cache \
  -v /e/Comics:/data \
  -v /f/Magazines:/magazines \
  -v /f/Downloads:/downloads \
  -e FLASK_ENV=production \
  -e PUID=99 \
  -e PGID=100 \
  -e UMASK=000 \
  allaboutduncan/comic-utils-web:latest
```

### Parameters

Additional info about the ENV variables can be found [here](../features/app-settings/install.md).

| Parameter | Function |
| --- | --- |
| -p 5577:5577 | The port exposed by the app for the web interface. |
| - 'config-volume:/config' | Maps to a Docker Volume for Database Storage and Backups |
| -v /User/comics:/data | Location of your library to manage. Must be mapped to <code>/data</code> |
| -v /User/downloads:/downloads | Optional folder to configure for Folder Monitoring. |
| -e FLASK_ENV=development | Set to 'development' for local development. |
| -e PUID=99 | Set the User ID (PUID) for the container. |
| -e PGID=100 | Set the Group ID (PGID) for the container. |
| -e UMASK=000 | Set the file creation mask (UMASK). |

!!! info "Accounts and logins"
    CLU is login-free with a single account. Real user accounts, roles, and per-folder permissions are covered in [Users & Access](../features/users/index.md).

## Next: Guided Setup

Once CLU is running, open it in your browser. On a new install, [Guided Setup](guided-setup.md) opens on your first visit: it checks your volumes and permissions, then walks you through libraries, metadata and the rest.
