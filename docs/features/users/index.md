---
description: User accounts, roles, and per-library and per-folder access in CLU
---

# Users & Access

!!! info "New in v6.2"
    User accounts, roles, and per-library/per-folder grants arrived in **v6.2**. **v6.3** added [per-user themes and dashboard layouts](my-account.md).

CLU supports real user accounts so you can share your library with family or friends without handing over the keys to your settings, your file manager, or your downloads. Everyone gets their own reading history, favorites, and stats.

It is **opt-in by design**. If you run CLU on your own, nothing changes — there is still no login, and every screen works exactly as it did before.

## The two operating modes

CLU decides which mode to run in on its own. You never set it directly.

| Mode | When it applies | What happens |
| --- | --- | --- |
| **Implicit-owner mode** *(default)* | One account, and no `CLU_USERNAME`/`CLU_PASSWORD` environment gate. | **No login at all.** Every request runs as the Store Owner. Role checks and library/folder scoping are skipped outright. |
| **Multi-user mode** | A **second account exists**, or the `CLU_USERNAME`/`CLU_PASSWORD` env gate is set. | Login is required and enforcement activates everywhere — nav visibility, API routes, and path access. |

!!! info "Multi-user turns itself on"
    Creating your second account is what flips CLU into multi-user mode. There is no toggle to hunt for — and no way to be halfway there. See [First Run & Logging In](first-run.md) if you want to stay single-user.

## The three pieces

| Piece | What it controls | Docs |
| --- | --- | --- |
| **Accounts & roles** | *What* an account can do — browse, manage files, or change settings. | [Roles & Permissions](roles.md) |
| **Library grants** | *Which libraries* an account can see at all. | [Library & Folder Access](library-and-folder-access.md) |
| **Folder grants** | *Which folders within a granted library* an account can see. | [Library & Folder Access](library-and-folder-access.md) |

Roles and grants are independent. A Clerk with no library grants sees no files; a Reader granted every library still can't reach Settings.

## In this section

- **[Roles & Permissions](roles.md)** — the `Reader → Clerk → Store Owner` hierarchy and what each role unlocks.
- **[First Run & Logging In](first-run.md)** — the one-time Store Owner Setup screen, and migrating the legacy `CLU_USERNAME`/`CLU_PASSWORD` env gate.
- **[Managing Users](managing-users.md)** — Settings → Users: adding, editing, deactivating, and deleting accounts.
- **[Library & Folder Access](library-and-folder-access.md)** — the two-layer grant model and exactly what each combination shows.
- **[Per-User Data](personal-data.md)** — what is now yours alone, and the two things that are still shared.
- **[My Account](my-account.md)** — every user's own theme, dashboard layout, and API tokens.
