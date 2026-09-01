---
description: Answers to the most asked questions or things I think you should know
---

# Frequently Asked Questions

??? question "How Can I Recommend a Feature?"
    Join the [CLU Discord Server](https://discord.gg/ndDhpvrgBa) and let me know what you would like to see added. Post all feature requests in the #feature-requests channel.


??? question "How Can I Report a Bug?"
    The best way is to [submit an Issue via github](https://github.com/allaboutduncan/clu-comics/issues) and label it as an **enhancement** or **bug** when submitted.

    You can also join the [CLU Discord Server](https://discord.gg/ndDhpvrgBa) and post it in the **#bug-reports** channel.

??? question "How Can I Say Thank You?"
    If you enjoyed this, want to say thanks or want to encourage updates and enhancements, feel free to [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/allaboutduncan)

??? question "Can CLU notify me when a download finishes?"
    Yes, as of **v6.4**. Settings → **Notifications** takes one or more [Apprise](https://github.com/caronc/apprise) URLs — `discord://`, `tgram://`, `ntfy://`, `mailto://` and 100+ others — and pushes when a download completes, a download fails, or wanted issues land in your library.

    Nothing is sent until you add a URL and tick at least one event. See [Notifications](features/app-settings/notifications.md).

??? question "My comics were tagged from Metron with no creator credits"
    This was a real bug, fixed in **v6.4** — and there's an automatic repair.

    The Metron client library's response cache had **no working TTL**, so on a long-lived container CLU could tag a file from a body cached days earlier. Metron also finishes issue records *after* a comic ships, so a release-morning fetch legitimately has no credits yet. Either way the file was stuck: once `ComicInfo.xml` has a `Notes` field, every automatic tagging path skips it forever.

    Turn on **Credit Backfill** (or click **Backfill Credits Now**) on the [Schedules](features/app-settings/schedules.md#credit-backfill) page. It asks Metron which issues have changed, repairs the affected files, and only rewrites a file when Metron actually has credits now.

??? question "CLU got my IP banned from Metron"
    Fixed in **v6.4**. CLU couldn't tell a **401** from a normal miss, so mistyped credentials meant it kept sending requests — through the nightly series sync, the Weekly Releases publisher warm, automap and auto-tagging — until fail2ban blocked the IP.

    A 401 or 403 now **latches a block on all Metron traffic**, persisted across restarts. It doesn't time out: only saving your credentials, a successful **Test**, or the **Re-enable** button clears it. See [Metron Authentication](features/app-settings/metadata.md#metron-authentication).

??? question "Can I use a Metron API token instead of my username and password?"
    Yes, as of **v6.4**. Generate a token on your [metron.cloud](https://metron.cloud) account page, then pick **API Token** in the auth method picker on the Metron card in Settings → Metadata Providers.

    Username and password still works — the token is an addition, not a replacement. If both are stored, the token wins. See [Metron Authentication](features/app-settings/metadata.md#metron-authentication).

??? question "How do I change what folder cover art looks like?"
    Settings → **Personalization** → **Folder Thumbnail Style**, new in **v6.4**. Four styles: Fanned Stack (the default, unchanged from v6.3), Single Image, Isometric Cascade, and 2x2 Mosaic Grid.

    Picking a style only affects art generated **from that point on**. To restyle art you already have, run **Regenerate All Thumbnails** — from Personalization for every library, or from a top-level folder's <i class="bi bi-three-dots-vertical"></i> menu for one branch. See [Folder Thumbnail Style](features/app-settings/personalization.md#folder-thumbnail-style).

??? question "Can I choose which cover a folder uses?"
    Yes. Open the folder, click the <i class="bi bi-three-dots-vertical"></i> menu on the issue you want, and choose **Set as Folder Thumbnail**.

    The pin is the folder's *primary* cover in **every** style — the whole image in Single Image, the front card in Fanned Stack and Cascade, the top-left tile in the Mosaic — so switching styles never loses your choice. See [Set as Folder Thumbnail](features/collection/issues.md#set-as-folder-thumbnail).

??? question "I ran Regenerate All Thumbnails on a publisher and its own art didn't change"
    That's deliberate. A sweep **never touches the folder it was invoked on** — running it on `/data/DC Comics` restyles every series inside and leaves that publisher's own `folder.png` alone, because a hand-picked publisher image isn't what you're replacing when you restyle series art. The all-libraries sweep skips the library roots the same way.

    To change a publisher's own art, upload a new image to that folder.

??? question "Where did the Auto-Unpack setting go?"
    Removed in **v6.4**. Archives dropped in WATCH are now **always** unpacked, so there's nothing left to configure and the dead `AUTO_UNPACK` key is stripped from your `config.ini` on the next start.

    It shipped **off**, which meant a fresh install silently stranded packs in WATCH. Unpacking is also content-aware now: ready comics get extracted, a `.zip` that's really a comic is renamed to `.cbz` rather than exploded into loose pages, and a loose `.rar` — previously ignored outright — is handled too. See [How archives in WATCH are handled](features/app-settings/file-settings.md#how-archives-in-watch-are-handled).

??? question "My download failed but CLU didn't notify me for twenty minutes"
    Working as intended. As of **v6.4** a failed download is **retried up to 3 times**, spaced 1, 5 and 15 minutes apart, and the failure notification is held back until those are spent — so a notification means "genuinely dead" rather than "the first mirror hiccuped".

    Downloads [blocked by Cloudflare](features/file-downloads/status.md#blocked-by-cloudflare) are the exception: they skip the retries and report immediately, because no automated client can pass a managed challenge.

??? question "I get \"Illegal seek\" or CBZ write errors on a mergerfs / FUSE mount"
    This is fixed as of **v6.0**. If your library or `/data` lives on a mergerfs, network, or other FUSE mount, older builds could fail zip writes with `OSError: [Errno 29] Illegal seek`. CLU now assembles every zip write on a local seekable volume and moves the finished file into place, so these failures are gone. Those writes also get consistent parent-folder permissions as a bonus. If you're still seeing the error, update to v6.0 or later.

??? question "Why is my DC++ search taking 30 seconds?"
    That's normal. AirDC++ **queues** searches and paces them per hub to avoid getting you kicked. On a two-hub setup the query may not be dispatched for ~17 seconds, with results settling around ~30 seconds.

    CLU waits on the AirDC++ instance's own progress counters rather than a fixed timeout, capped at 45 seconds, and returns as soon as results stop arriving. It isn't stalled. See [DC++ Searching & Grabbing](features/dcpp/search-and-grab.md#hub-searches-are-slow-thats-normal).

??? question "Can I use DC++ or ApexDC instead of AirDC++?"
    No. CLU talks to the **[AirDC++ Web Client](https://airdcpp-web.github.io/)** through its REST API. DC++ itself, ApexDC, FlylinkDC and the rest have **no remote API** for CLU to call, so there is nothing to connect to.

    You need to install and run AirDC++ Web Client separately — it's the same relationship CLU has with SABnzbd on the Usenet side. See [DC++ Downloads](features/dcpp/index.md).

??? question "My DC++ downloads land with mangled names like \"_downloads_temp_Farmhouse 007\""
    Your **Target Directory** isn't a path shape the AirDC++ host understands. On a Windows host, `/` is a forbidden filename character rather than a separator, so a POSIX path gets folded into the *filename* and sanitized — and the file lands in AirDC++'s own default download folder.

    Set **Target Directory** to a path as **AirDC++** sees it, and **Local Target Directory** to the same folder as **CLU** sees it. Then run **Test Connection**, which validates both. See [Adding AirDC++](features/dcpp/setup.md#two-different-paths).

??? question "Why does the Publisher filter on Weekly Releases only show some publishers?"
    The cache is still warming. Metron's issue-list endpoint doesn't return a publisher, and resolving one per series would be roughly 150 API calls a week against the rate limit — so CLU fills a **self-warming cache** in bulk passes instead.

    On a cold week the pills populate progressively over the first few visits. Once a week is cached, filtering is instant. See [Releases](features/pull-list/releases.md#the-list-fills-in-as-you-watch).

??? question "I set the theme in Settings but my users still see the old one"
    As of **v6.3** the theme in Settings is the **site default**, not a global override. Any user who has picked their own theme in [My Account](features/users/my-account.md) has opted out of the default, and changing it won't move them.

    Users with **no** personal theme follow the site default and will see your change. Anyone showing a *Custom* badge on their Appearance pane needs to hit **Reset** to go back to following it. See [Personalization](features/app-settings/personalization.md).

??? question "Why doesn't my reading list appear on the dashboard?"
    You have to **bookmark** it. The Bookmark action on a reading list card is the single opt-in that puts the list in **Want to Read** and feeds its next unread issue into **On the Stack**.

    Bookmarks are per user, so in a multi-user install everyone bookmarks their own. Readers can bookmark too. See [Reading Lists on the Dashboard](features/collection/reading-lists.md#reading-lists-on-the-dashboard).

??? question "My On the Stack shows a later issue than I expected"
    On the Stack takes the first entry in the list's own sort order that is unread **and has a matched file**. Entries with **no matched file are skipped**, not counted as unread — so if issues 3 and 4 aren't mapped to local files, it will show issue 5.

    [Map the missing issues](features/collection/reading-lists.md#mapping-missing-issues) to put them back in the sequence.

??? question "My folder art disappeared after a refresh"
    Fixed in **v6.3**. Nothing updated the index flag after writing folder art, and the grid reads art off that flag rather than the disk — so generated thumbnails vanished on reload until the next full library scan. The same bug affected the manual **Generate Thumbnail** button.

    Upgrade to v6.3, where folder art also [generates itself as you browse](features/collection/index.md#folder-art).

??? question "I added a user and now everyone has to log in — why?"
    Multi-user mode activates automatically the moment a **second account exists**. There's no separate switch. With a single account and no `CLU_USERNAME`/`CLU_PASSWORD` env gate, CLU runs login-free.

    To get back to no-login, delete the extra accounts and remove the env variables. See [First Run & Logging In](features/users/first-run.md).

??? question "My new user can see the library list but no files"
    A library grant is the outer gate, not access on its own — **a granted library with no folders checked shows nothing**.

    Open the user in Settings → Users and check the folders they should see (or the library root for the whole library). See [Library & Folder Access](features/users/library-and-folder-access.md).

??? question "I lost my only owner password"
    The last active Store Owner can't be demoted, deactivated, or deleted, so you can't lock yourself out from inside the app — but there is **no in-app password recovery**. Setting `CLU_USERNAME`/`CLU_PASSWORD` after an owner exists does *not* reset it; those variables only seed an owner when no account exists at all.

    Recovering means resetting the password directly in the CLU database. Ask on [Discord](https://discord.gg/ndDhpvrgBa) before you start.
