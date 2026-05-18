# CLU Setup Guide for Windows

A complete, no‑experience‑required walkthrough for installing Docker Desktop on Windows and launching **CLU (Comic Library Utilities)** using Docker Compose.

By the end of this guide you'll have CLU running locally and accessible in your web browser at `http://localhost:5577`.

---

## What You'll Need Before Starting

- **Windows 10 (64‑bit, version 2004 or newer) or Windows 11**
- **8 GB of RAM** recommended (4 GB minimum)
- **About 10 GB of free disk space** for Docker + CLU (plus whatever space your comic library uses)
- **Administrator access** on your PC
- **~30 minutes** for the full setup
- An internet connection

> **No prior Docker experience is assumed.** Every step is spelled out.

---

## Part 1 — Install Docker Desktop

Docker is the program that runs CLU in a self‑contained "container" so it doesn't interfere with anything else on your PC. **Docker Desktop** is the official Windows installer that gives you both Docker itself and a small graphical app for managing it.

### Step 1.1 — Check that virtualization is enabled

Docker requires hardware virtualization. It's enabled by default on most modern PCs, but it's worth a quick check:

1. Press **Ctrl + Shift + Esc** to open Task Manager.
2. Click the **Performance** tab.
3. Click **CPU** in the left column.
4. Look at the bottom‑right for **Virtualization**. It should say **Enabled**.

If it says **Disabled**, you'll need to enable it in your computer's BIOS/UEFI settings. The exact steps vary by manufacturer — search "enable virtualization [your PC brand]" for guidance. Come back here once it's enabled.

### Step 1.2 — Download Docker Desktop

1. Go to **https://www.docker.com/products/docker-desktop/**
2. Click the big **Download Docker Desktop** button.
3. Choose **Download for Windows – AMD64** (this is correct for almost all PCs). If you have an ARM‑based Windows PC, choose ARM64 instead.

You'll get a file called something like `Docker Desktop Installer.exe`.

### Step 1.3 — Run the installer

1. Double‑click `Docker Desktop Installer.exe`.
2. If Windows asks "Do you want to allow this app to make changes?", click **Yes**.
3. On the configuration screen, **leave both checkboxes ticked**:
   - ✅ Use WSL 2 instead of Hyper‑V (recommended)
   - ✅ Add shortcut to desktop
4. Click **OK** and wait for installation to finish (a few minutes).
5. When prompted, click **Close and restart** to reboot your PC.

### Step 1.4 — First launch

1. After your PC restarts, launch **Docker Desktop** from your desktop shortcut or Start menu.
2. The first time, it may ask you to:
   - **Accept the service agreement** → click **Accept**.
   - **Sign in or skip** → you can click **Skip** / **Continue without signing in**. An account isn't required for personal use.
   - **Take a survey** → skip if you like.
3. Docker Desktop will finish setting itself up. You'll know it's ready when the little **whale icon** in your system tray (bottom‑right corner of your screen) stops animating and shows **"Docker Desktop is running"** when you hover over it.

### Step 1.5 — Verify Docker is working

1. Press the **Windows key**, type `powershell`, and press **Enter** to open PowerShell.
2. Type the following and press Enter:

   ```powershell
   docker --version
   ```

3. You should see something like `Docker version 27.x.x, build ...`.

If you see that, Docker is installed correctly. ✅

> **If you get an error**, make sure Docker Desktop is running (whale icon visible in the system tray) and try again.

---

## Part 2 — Prepare Your Folders

CLU stores some of its own data (settings, thumbnail cache, etc.) and also reads from your existing comic library. We'll set up a clean folder structure first.

### Step 2.1 — Decide where CLU's own data will live

Pick a location on your PC for CLU's working files. A simple choice is in your user folder. For this guide we'll use:

```
C:\Users\YourName\clu
```

> Replace `YourName` everywhere in this guide with your actual Windows username (e.g. `C:\Users\Phillip\clu`).

1. Open **File Explorer**.
2. Navigate to `C:\Users\YourName\`.
3. Right‑click an empty area → **New** → **Folder** → name it `clu`.
4. Open the new `clu` folder and create this subfolders inside it:
   - `cache`

You should now have:

```
C:\Users\YourName\clu\
    └── cache\
```

### Step 2.2 — Identify your existing comic library folders

CLU's compose file expects you to point it at the folders where your comics actually live. For this guide we'll use the example paths from the original file:

| Purpose | Example Windows path |
|---|---|
| Main comic library | `E:\Comics` |
| Magazines (optional) | `F:\Magazines` |
| Downloads / monitored folder (optional) | `F:\Downloads` |

You'll plug your **actual** paths in during the next part. If you don't have a magazines or downloads folder, that's fine — we'll show how to skip them.

---

## Part 3 — Create the docker‑compose File

The `docker-compose.yml` file is a single text file that tells Docker exactly how to run CLU. Think of it as a recipe.

### Step 3.1 — Open a text editor

We'll use **Notepad** because it ships with Windows. (If you have VS Code or Notepad++, those are even better, but not required.)

1. Press the **Windows key**, type `notepad`, and press **Enter**.

### Step 3.2 — Paste the compose file

Copy the entire block below and paste it into Notepad:

```yaml
services:
  comic-utils:
    image: allaboutduncan/comic-utils-web:latest
    container_name: clu
    logging:
      driver: "json-file"
      options:
        max-size: '20m'
        max-file: '3'
    restart: always
    ports:
      - '5577:5577'
    volumes:
      - 'config-volume:/config'
      - 'C:/Users/YourName/clu/cache:/cache'
      - 'E:/Comics:/data'
      - 'F:/Magazines:/magazines'
      - 'F:/Downloads:/downloads'
    environment:
      - FLASK_ENV=production
      - MONITOR=no
      - PUID=1000
      - PGID=1000
      - UMASK=022
```

> **Note on paths:** Docker Desktop on Windows accepts paths using **forward slashes** (`C:/Users/YourName/...`). This is the cleanest format inside a YAML file. Don't use backslashes here.

### Step 3.3 — Save the file

1. In Notepad, click **File** → **Save As…**
2. Navigate to `C:\Users\YourName\clu\` (the folder you created earlier).
3. In the **"Save as type"** dropdown at the bottom, change it from `Text Documents (*.txt)` to **`All Files (*.*)`**. *This step is important* — otherwise Windows will silently add `.txt` to the filename.
4. In the **File name** box, type exactly: `docker-compose.yml`
5. Click **Save**.

Your folder should now contain:

```
C:\Users\YourName\clu\
    ├── cache\
    └── docker-compose.yml
```

---

## Part 4 — Customize the File for Your Setup

Now edit `docker-compose.yml` to match your actual folder paths and preferences. Open it again in Notepad (right‑click the file → **Open with** → **Notepad**).

### 4.1 — Update the volume paths

Look at the `volumes:` section. Each line follows the format:

```
- 'WINDOWS_PATH:CONTAINER_PATH'
```

The part **before** the colon is the real folder on your PC. The part **after** the colon is the name CLU sees inside the container — **don't change those.**

Edit each line:

| Line in file | Change to |
|---|---|
| `'C:/Users/YourName/clu/cache:/cache'` | Replace `YourName` with your real username |
| `'E:/Comics:/data'` | Change `E:/Comics` to **your actual main comic library path**, using forward slashes |
| `'F:/Magazines:/magazines'` | Either point to a real magazines folder, **or delete this entire line** if you don't have one |
| `'F:/Downloads:/downloads'` | Either point to your monitored downloads folder, **or delete this entire line** if you don't use folder monitoring |

**Example for a user with comics on the D: drive and no magazines/downloads:**

```yaml
    volumes:
      - 'C:/Users/Sarah/clu/config:/config'
      - 'C:/Users/Sarah/clu/cache:/cache'
      - 'D:/MyComics:/data'
```

> **Paths with spaces** (e.g. `My Comics`) work fine — just leave them inside the single quotes: `'D:/My Comics:/data'`.

### 4.2 — Set MONITOR

In the `environment:` section, find the line `- MONITOR=no`.

- Leave it as `MONITOR=no` if you do **not** want CLU to automatically watch a folder for new downloads.
- Change to `MONITOR=yes` if you **do** want folder monitoring (and you kept the `/downloads` volume mapping above).

### 4.3 — PUID, PGID, and UMASK

For a typical Windows setup, the values `PUID=1000`, `PGID=1000`, `UMASK=022` already in the file are fine. **Leave them alone** unless you specifically know you need different values.

### 4.4 — Save your changes

In Notepad, click **File** → **Save** (or press **Ctrl + S**).

---

## Part 5 — Launch CLU

This is the moment of truth.

### Step 5.1 — Open PowerShell in your CLU folder

1. Open **File Explorer** and navigate to `C:\Users\YourName\clu\`.
2. Click on the address bar at the top, type `powershell`, and press **Enter**.

A blue PowerShell window will open, already positioned in your CLU folder. You should see the path on the prompt, e.g.:

```
PS C:\Users\YourName\clu>
```

### Step 5.2 — Start the container

In PowerShell, type the following and press **Enter**:

```powershell
docker compose up -d
```

What happens:

- Docker downloads the CLU image from the internet (this happens **once**, and may take a few minutes depending on your connection).
- Docker starts the container in the background (`-d` means "detached", so it keeps running after you close PowerShell).

When it finishes you'll see something like:

```
[+] Running 2/2
 ✔ Network clu_default      Created
 ✔ Container clu            Started
```

### Step 5.3 — Confirm it's running

Still in PowerShell, type:

```powershell
docker ps
```

You should see a row showing the `clu` container with **STATUS** column reading something like `Up 30 seconds`.

If you'd rather see this graphically, open **Docker Desktop**, click **Containers** in the left sidebar, and look for `clu`. There should be a green "Running" indicator next to it.

---

## Part 6 — Access CLU in Your Browser

Open any web browser and go to:

**http://localhost:5577**

CLU's interface should load. 🎉

From here, follow CLU's in‑app settings to point it at your library, configure metadata providers, etc.

> **If you added extra libraries** (like `/magazines`), you'll add them inside CLU's settings page — they'll show up as the path names you used after the colon in the compose file (`/magazines`, `/downloads`, etc.).

---

## Managing Your CLU Container

All of the following commands are run from PowerShell **inside your `clu` folder** (where the `docker-compose.yml` file lives), the same way you started it.

| Task | Command |
|---|---|
| **Stop CLU** | `docker compose stop` |
| **Start CLU** again | `docker compose start` |
| **View live logs** (useful for troubleshooting) | `docker compose logs -f` (press **Ctrl + C** to exit) |
| **Restart CLU** | `docker compose restart` |
| **Update to the latest version** | `docker compose pull` then `docker compose up -d` |
| **Stop and remove the container** (keeps your data) | `docker compose down` |

CLU is set to `restart: always`, so it will automatically start again whenever you restart your PC (as long as Docker Desktop is running).

> **Tip:** You can set Docker Desktop to launch automatically when Windows starts. Open Docker Desktop → click the gear icon → **General** → check **"Start Docker Desktop when you sign in"**.

---

## Troubleshooting

### "The system cannot find the file specified" when running docker compose

You're not in the right folder. Make sure PowerShell's prompt shows the path to your `clu` folder (`PS C:\Users\YourName\clu>`). If not, use:

```powershell
cd C:\Users\YourName\clu
```

### "docker: command not found" or "docker is not recognized"

Docker Desktop isn't running, or it didn't finish starting up. Open Docker Desktop from the Start menu and wait until the whale icon in the system tray shows "Docker Desktop is running" before retrying.

### CLU loads but my comics aren't showing

- Double‑check that your volume paths in `docker-compose.yml` actually point at the folder containing your comics.
- Inside CLU's settings, make sure the library path is set to `/data` (or whatever container path you mapped to), **not** the Windows path.
- After changing the compose file, you must apply changes with:
  ```powershell
  docker compose up -d
  ```

### "Bind mount failed" or "path does not exist" errors

Docker can't see the folder you pointed it at. Check that:
1. The path uses forward slashes (`D:/Comics`, not `D:\Comics`).
2. The drive is **shared** with Docker. Open Docker Desktop → gear icon → **Resources** → **File sharing**, and make sure the drive (e.g. `D:`) is enabled. With WSL2 backend, all fixed drives are usually shared automatically.
3. The folder actually exists.

### Port 5577 is already in use

Some other program on your PC is using that port. The easiest fix is to map CLU to a different port. In `docker-compose.yml`, change:

```yaml
    ports:
      - '5577:5577'
```

to (for example):

```yaml
    ports:
      - '5588:5577'
```

Save, then run `docker compose up -d` again. CLU will now be reachable at **http://localhost:5588**.

### I want to start completely over

From inside your `clu` folder in PowerShell:

```powershell
docker compose down
```

Then delete the `config` and `cache` subfolders, recreate them empty, and run `docker compose up -d` again.

---

## Quick Reference — The Full Working Compose File

For convenience, here's a clean example you can adapt. Replace usernames and paths with your own:

```yaml
services:
  comic-utils:
    image: allaboutduncan/comic-utils-web:latest
    container_name: clu
    logging:
      driver: "json-file"
      options:
        max-size: '20m'
        max-file: '3'
    restart: always
    ports:
      - '5577:5577'
    volumes:
      - 'config-volume:/config'
      - 'C:/Users/YourName/clu/cache:/cache'
      - 'E:/Comics:/data'
      - 'F:/Magazines:/magazines'
      - 'F:/Downloads:/downloads'
    environment:
      - FLASK_ENV=production
      - MONITOR=no
      - PUID=1000
      - PGID=1000
      - UMASK=022
  volumes:
    config-volume:
```

---

That's it — you're now running CLU in Docker on Windows. 🎉

For project documentation, updates, and the source code, visit **https://github.com/allaboutduncan/clu-comics**.