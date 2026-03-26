commit 1f4b79109c6e993f22c0aa0c37c96460c48afc42
Author: Phillip Duncan <phillip.duncan@gmail.com>
Date:   Wed Mar 25 09:08:10 2026 -0500

    New Feartures

diff --git a/docs/assets/settings/desktop.ini b/docs/assets/settings/desktop.ini
index c7de01b..75f83cd 100644
--- a/docs/assets/settings/desktop.ini
+++ b/docs/assets/settings/desktop.ini
@@ -1,2 +1,5 @@
 [LocalizedFileNames]
 Screenshot 2026-03-16 103117.png=@Screenshot 2026-03-16 103117.png,0
+Screenshot 2026-03-23 182526.png=@Screenshot 2026-03-23 182526.png,0
+Screenshot 2026-03-22 172404.png=@Screenshot 2026-03-22 172404.png,0
+Screenshot 2026-03-24 085259.png=@Screenshot 2026-03-24 085259.png,0
diff --git a/docs/assets/settings/gcd-api-modal.png b/docs/assets/settings/gcd-api-modal.png
new file mode 100644
index 0000000..3ac6aa7
Binary files /dev/null and b/docs/assets/settings/gcd-api-modal.png differ
diff --git a/docs/assets/settings/gcd-mysql.png b/docs/assets/settings/gcd-mysql.png
new file mode 100644
index 0000000..610ab9e
Binary files /dev/null and b/docs/assets/settings/gcd-mysql.png differ
diff --git a/docs/assets/settings/hide-directories.png b/docs/assets/settings/hide-directories.png
new file mode 100644
index 0000000..5542f34
Binary files /dev/null and b/docs/assets/settings/hide-directories.png differ
diff --git a/docs/features/app-settings/file-settings.md b/docs/features/app-settings/file-settings.md
index 85535ca..e21fffc 100644
--- a/docs/features/app-settings/file-settings.md
+++ b/docs/features/app-settings/file-settings.md
@@ -65,6 +65,10 @@ The two options here will vary greatly on how much you use [Missing Issue Check]
 
 **DELETED TYPES:** Add a comma-separated list of extensions to delete while performing actions on files. When any operation unpacks a RAR/ZIP File, files with these extensions will deleted before the file is re-packed. Examples are: `.nfo,.sfv,.db,.DS_Store`
 
+![Hide Directories](../../assets/settings/hide-directories.png){: .center-image}
+
+**HIDDEN DIRECTORIES:** You can enter a comma-separated list of directory names to hide from all views (File Manager, Collection and Source Wall). Default configuration is: `@eaDir`
+
 ## Custom Naming Settings
 
 ![Custom Naming Settings](../../assets/settings/naming-settings.png){: .center-image}
diff --git a/docs/features/app-settings/metadata.md b/docs/features/app-settings/metadata.md
index bfe1729..59ede71 100644
--- a/docs/features/app-settings/metadata.md
+++ b/docs/features/app-settings/metadata.md
@@ -26,6 +26,7 @@ Metadata providers and implementations status are listed below:
 |----------|--------|-------------|
 | [Metron](https://metron.cloud) | <i class="bi bi-check-circle-fill text-success"></i> | Metron Comic Book Database |
 | [ComicVine](https://comicvine.gamespot.com/) | <i class="bi bi-check-circle-fill text-success"></i> | ComicVine Database |
+| [GCD API](https://github.com/GrandComicsDatabase/gcd-django/wiki/API) | <i class="bi bi-check-circle-fill text-success"></i> | Grand Comics Database API |
 | [GCD](https://www.comics.org/) | <i class="bi bi-info-circle-fill text-info"></i> | Grand Comics Database (requires [local setup](../gcd-settings/index.md)) |
 | MangaDex | <i class="bi bi-check-circle-fill text-success"></i> | MangaDex Database |
 | MangaUpdates | <i class="bi bi-check-circle-fill text-success"></i> | MangaUpdates Database
diff --git a/docs/features/gcd-settings/settings.md b/docs/features/gcd-settings/settings.md
index 5a78d24..46fdf98 100644
--- a/docs/features/gcd-settings/settings.md
+++ b/docs/features/gcd-settings/settings.md
@@ -4,44 +4,31 @@ description: Update your compose file as detailed below to use the local GCD dat
 
 # Updated CLU Settings for GCD
 
-Once your GCD database has completed the import, you'll need to update your CLU Docker Compose to use the same network in Docker and connect to your MySQL server.
+Once your GCD database has completed the import, you have two options for connecting to your local GCD database:
+
+1. **Metadata Providers** - You can enter you connection details in the [Metadata Providers](../app-settings/metadata.md) tab of the settings page.
+
+This is the recommended approach as it allows you to use the Metadata Providers tab to manage all connections. Once you SAVE and TEST your connection, you will see a green checkmark <i class="bi bi-check-circle-fill text-success"></i> in the provider header and you will see counts from the relevant tables in the database.
+
+![Metadata Providers](../../assets/settings/gcd-mysql.png){: .center-image}
+
+You will still need to add the network to your `docker-compose.yml` file as shown below.
+
+```yaml
+networks:
+  gcd-network:
+    external: true            
+```
+
+2. **Docker Compose** - Update your CLU Docker Compose to use the same network in Docker and connect to your MySQL server.
 
 ```yaml
 version: '3.9'
 services:
     comic-utils:
-        image: allaboutduncan/comic-utils-web:latest
-
-        container_name: comic-utils
-        logging:
-            driver: "json-file"
-            options:
-                max-size: '20m'  # Reduce log size to 20MB
-                max-file: '3'     # Keep only 3 rotated files
-        restart: always
-        ports:
-            - '5577:5577'
-        volumes:
-            - "/path/to/local/config:/config" # Maps local folder to persist settings
-            - "/path/to/local/cache:/cache" # Maps to local folder for DB and thumbnail cache
-            ## update the line below to map to your library.
-            ## Your library MUST be mapped to '/data' for the app to work
-            - "/e/Comics:/data"
-            ## Additional folder if you want to use Folder Monitoring.
-            - "/f/Downloads:/downloads"
+    ..... Existing Settings in Docker Compose .....
         environment:
-            - FLASK_ENV=production
-            ## Set to 'yes' if you want to use folder monitoring.
-            - MONITOR=yes/no
-            ## Set the User ID (PUID) and Group ID (PGID) for the container.
-            ## This is often needed to resolve permission issues, especially on systems like Unraid
-            ## where a specific user/group owns the files.
-            ## For Unraid, PUID is typically 99 (user 'nobody') and PGID is typically 100 (group 'users').
-            ## For Windows/WSL, you need to set these to match your Windows user ID (see WINDOWS_WSL_SETUP.md)
-            - PUID=99
-            - PGID=100
-            ## Set the file creation mask (UMASK). 022 is a common value.
-            - UMASK=022
+            ..... Existing Settings in Docker Compose .....
             
             # GCD Database Additions: Update the GCD_MYSQL_PASSWORD 
             # to match the MYSQL_PASSWORD you set in the previous step
@@ -52,10 +39,6 @@ services:
             - GCD_MYSQL_PASSWORD=strong-user-password
         networks:
             - gcd-network
-
-volumes:
-  config-volume:
-
 networks:
   gcd-network:
     external: true            
