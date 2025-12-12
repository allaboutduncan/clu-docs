---
description: Quick install using Docker
---

# Quickstart

Docker Hub images are available for quick installation and deploy.

### Install via Docker Compose

```yaml
version: '3.9'
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
            - "/path/to/local/config:/config" # Maps local folder to persist settings
            - "/path/to/local/cache:/cache" # Maps to local folder for DB and thumbnail cache
            ## update the line below to map to your library.
            ## Your library MUST be mapped to '/data' for the app to work
            - "/e/Comics:/data"
            ## Additional folder if you want to use Folder Monitoring.
            - "/f/Downloads:/downloads"
        environment:
            - FLASK_ENV=production
            ## Set to 'yes' if you want to use folder monitoring.
            - MONITOR=yes/no
            ## Set the User ID (PUID) and Group ID (PGID) for the container.
            ## This is often needed to resolve permission issues, especially on systems like Unraid
            ## where a specific user/group owns the files.
            ## For Unraid, PUID is typically 99 (user 'nobody') and PGID is typically 100 (group 'users').
            ## For Windows/WSL, you need to set these to match your Windows user ID (see WINDOWS_WSL_SETUP.md)
            - PUID=99
            - PGID=100
            ## Set the file creation mask (UMASK). 022 is a common value.
            - UMASK=022
```

### Install via Docker

```
docker run \
  --name clu \
  --restart always \
  -p 5577:5577 \
  -v /Users/phillipduncan/Documents/docker/clu:/config \
  -v /Users/phillipduncan/Documents/GitHub/comic-utils/bak:/data \
  -v /Users/phillipduncan/Documents/GitHub/comic-utils/files:/downloads \
  -e FLASK_ENV=development \
  -e MONITOR=no \
  -e PUID=99 \
  -e PGID=100 \
  -e UMASK=022 \
  allaboutduncan/comic-utils-web:latest
```

### Parameters

Additional info about the ENV variables can be found [here](../features/app-settings/install.md).

| Parameter | Function |
| --- | --- |
| -p 5577:5577 | The port exposed by the app for the web interface. |
| -v /docker/clu:/config | Location for your CLU directory on a local disk. Enables local storage of the <code>config.ini</code> which preservers settings during updates. Must be mapped to <code>/config</code> |
| -v /User/comics:/data | Location of your library to manage. Must be mapped to <code>/data</code> |
| -v /User/downloads:/downloads | Optional folder to configure if MONITOR is enabled (see below) |
| -e FLASK_ENV=development | Set to 'development' for local development. |
| -e MONITOR=no | Set to 'yes' if you want to use folder monitoring. |
| -e PUID=99 | Set the User ID (PUID) and Group ID (PGID) for the container. |
| -e PGID=100 | Set the User ID (PUID) and Group ID (PGID) for the container. |
| -e UMASK=022 | Set the file creation mask (UMASK). |

### Using a Grand Comics Database (GCD) File

You can connect to a container running a local copy of the Grand Comics Database (GCD) file. This will allow you to use the metadata from the GCD file to populate your comics. 

Additional parameters are needed in your docker-compose.yml file to connect to the GCD file. See [here](../features/gcd-settings/index.md) for  step by step instructions.