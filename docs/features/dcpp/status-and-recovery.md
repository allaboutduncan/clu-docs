---
description: Track DC++ bundles on the Download Status page and what survives a restart
---

# Status & Restart Recovery

DC++ bundles appear on the [Download Status](../file-downloads/status.md) page in the same table as direct and Usenet downloads, with live progress, the current stage, and byte counts.

## Job states

| State | What it means | Does it clear itself? |
| --- | --- | --- |
| **Downloading** | AirDC++ is transferring the bundle. Percentage and byte counts update as it goes. | Yes — it moves on when the bundle finishes or fails. |
| **Complete** | The bundle finished **and** CLU moved it into WATCH. The [folder monitor](../folder-monitoring/index.md) owns it from here. | Yes — the row resolves itself and is dropped from the recovery ledger. |
| **Complete (not moved)** | The bundle finished, but CLU could not find the file to move it. Almost always a [Local Target Directory](setup.md#two-different-paths) problem. | **No.** It stays until you dismiss it. |
| **Failed** | AirDC++ reported the download as failed. | **No.** It stays until you dismiss it. |

!!! warning "Failed and not-moved rows persist deliberately"
    **Failed** and **Complete (not moved)** rows survive a restart and stay on the page until you dismiss them by hand.

    This is intentional. Both states mean a human needs to look — a failed grab needs re-trying from another source, and a not-moved bundle means a finished file is sitting somewhere CLU can't reach. Auto-purging them would let a restart silently swallow exactly the jobs worth knowing about.

    Clean completions are the opposite: those are genuinely resolved, so they clear themselves.

## Restart recovery

!!! info "New in v6.3"
    DC++ jobs survive a container restart. This is new in **v6.3**.

AirDC++ runs as its own process and keeps downloading whether CLU is up or not. Previously CLU tracked bundles **in memory only**, so a restart orphaned an in-flight job outright: the bundle vanished from the Status page and the import step never ran, leaving a finished file sitting in the download folder forever.

CLU now writes each job to a **database ledger at grab time** — before polling starts, so a crash in between can't lose the record — and clears the row when the job resolves cleanly.

What this buys you:

- **An in-flight bundle survives a restart.** It reappears on the Status page and resumes being tracked.
- **A bundle that completed while CLU was down can still be imported.** The last known target path is stored, so CLU knows where to look even if AirDC++ has already dropped the finished bundle from its queue.

Recovery at startup is deliberately **database-only**, so booting CLU is never held up waiting on network calls to AirDC++. The reconcile against the live AirDC++ queue happens on the poller's first round, a second or two later.

## Bundles you queued directly in AirDC++

The Status page also shows bundles you queued **yourself, inside AirDC++**, rather than through CLU. These are **read-only**.

!!! warning "CLU will never move these files"
    A bundle CLU didn't queue has no series, issue, or destination attached to it — CLU has no idea what it is. It is shown so the page reflects reality, but CLU will **never** move it into WATCH or import it.

    If you want a hub download filed into your library, grab it [through CLU's search modal](search-and-grab.md) rather than directly in AirDC++.

## Usenet doesn't have this yet

!!! info "Usenet doesn't have this yet"
    The recovery ledger currently covers **DC++ only**. [Usenet](../usenet/index.md) jobs are still tracked in memory, so a restart mid-download can still orphan one. This is a known follow-up rather than an oversight — better documented than discovered.
