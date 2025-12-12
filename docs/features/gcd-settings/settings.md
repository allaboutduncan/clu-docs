---
description: Update your compose file as detailed below to use the local GCD data
---

# Updated CLU Settings for GCD

Once your GCD database has completed the import, you'll need to update your CLU Docker Compose to use the same network in Docker and connect to your MySQL server.

```yaml
version: '3.9'
services:
    comic-utils:
        image: allaboutduncan/comic-utils-web:latest

        container_name: comic-utils
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
            
            # GCD Database Additions: Update the GCD_MYSQL_PASSWORD 
            # to match the MYSQL_PASSWORD you set in the previous step
            - GCD_MYSQL_HOST=mysql-gcd
            - GCD_MYSQL_PORT=3306
            - GCD_MYSQL_DATABASE=gcd_data
            - GCD_MYSQL_USER=clu
            - GCD_MYSQL_PASSWORD=strong-user-password
        networks:
            - gcd-network

volumes:
  config-volume:

networks:
  gcd-network:
    external: true            
```

Once you restart your CLU container, you should see something like this in the logs

```log
172.21.0.1 - - [07/Oct/2025 08:41:20] "GET /gcd-mysql-status HTTP/1.1" 200 -
```

and in the UI when browsing files, you should see a Cloud Download icon like this <i class="bi bi-cloud-download fs-2 text-primary"></i>

For additional details on usage, see the [File Management --> Get ComicInfo.xml](../file-management/comicinfo.md) section
