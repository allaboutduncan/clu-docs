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
