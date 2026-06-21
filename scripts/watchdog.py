"""
watchdog.py — Syna Systems Operations Watchdog Agent
=====================================================
Autonomous ops agent for Syna Systems (Healthcare RCM).

Modes:
  1. SDK Mode  : Uses google-antigravity SDK for AI-assisted analysis & logging.
  2. Standalone: Falls back to pure Python logic if SDK is unavailable.

Usage:
  python watchdog.py              # auto-detects SDK availability
  python watchdog.py --standalone # force standalone mode
  python watchdog.py --sdk        # force SDK mode (errors if SDK not installed)

Author: Syna Systems Watchdog v1.0
"""

import asyncio
import argparse
import csv
import datetime
import os
import subprocess
import sys
from pathlib import Path

# ──────────────────────────────────────────────────────────────────
# PATHS  (all absolute, OS-agnostic)
# ──────────────────────────────────────────────────────────────────
BASE_DIR        = Path("D:/ShivamGem/SynaSystems")
BRAIN_DIR       = BASE_DIR / "agency-brain"
CLIENTS_DIR     = BRAIN_DIR / "clients"
OPERATIONS_DIR  = BRAIN_DIR / "operations"
SCRIPTS_DIR     = BASE_DIR / "scripts"

LEADS_CSV       = CLIENTS_DIR / "healthcare_leads.csv"
CURRENT_STATE   = BRAIN_DIR / "current-state.md"
LEAD_GEN_SCRIPT = SCRIPTS_DIR / "lead_gen.py"
WATCHDOG_LOG    = OPERATIONS_DIR / "watchdog_log.csv"

HIGH_LEAD_THRESHOLD = 50   # trigger lead_gen if HIGH leads < this

# ──────────────────────────────────────────────────────────────────
# LOGGING  (in-memory list, flushed to CSV at end)
# ──────────────────────────────────────────────────────────────────
_log_entries: list[dict] = []


def log(action: str, status: str, details: str) -> None:
    """Append entry to in-memory log and print to stdout."""
    ts = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    entry = {"timestamp": ts, "action": action, "status": status, "details": details}
    _log_entries.append(entry)
    icon = "OK" if status == "OK" else ("WARN" if status == "WARN" else "ERR")
    print(f"[{ts}] [{icon}] [{action}] {details}")


def flush_log() -> None:
    """Write all log entries to watchdog_log.csv (append mode)."""
    OPERATIONS_DIR.mkdir(parents=True, exist_ok=True)
    file_exists = WATCHDOG_LOG.exists()
    with open(WATCHDOG_LOG, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["timestamp", "action", "status", "details"])
        if not file_exists:
            writer.writeheader()
        writer.writerows(_log_entries)
    print(f"\n[WATCHDOG] Log flushed -> {WATCHDOG_LOG}")


# ──────────────────────────────────────────────────────────────────
# STEP 1 — Read current-state.md
# ──────────────────────────────────────────────────────────────────
def read_current_state() -> str:
    """Read and return current-state.md content."""
    if not CURRENT_STATE.exists():
        log("READ_STATE", "WARN", "current-state.md not found — skipping read.")
        return ""
    content = CURRENT_STATE.read_text(encoding="utf-8")
    log("READ_STATE", "OK", f"Read current-state.md ({len(content)} bytes)")
    return content


# ──────────────────────────────────────────────────────────────────
# STEP 2 — Check HIGH-quality lead count & trigger lead_gen.py
# ──────────────────────────────────────────────────────────────────
def check_leads_and_run_lead_gen() -> dict:
    """
    Returns: {total, high, medium, low, missing_enrichment_orgs}
    Runs lead_gen.py if HIGH leads < HIGH_LEAD_THRESHOLD.
    """
    if not LEADS_CSV.exists():
        log("LEAD_CHECK", "WARN", f"{LEADS_CSV} not found. Cannot count leads.")
        return {"total": 0, "high": 0, "medium": 0, "low": 0, "missing_enrichment_orgs": []}

    try:
        import pandas as pd
    except ImportError:
        log("LEAD_CHECK", "ERROR", "pandas not installed. Run: pip install pandas")
        return {"total": 0, "high": 0, "medium": 0, "low": 0, "missing_enrichment_orgs": []}

    df = pd.read_csv(LEADS_CSV)

    # Normalize column names
    df.columns = [c.strip() for c in df.columns]
    score_col = next((c for c in df.columns if c.lower() == "qualification_score"), None)

    if score_col is None:
        log("LEAD_CHECK", "WARN", "No 'Qualification_Score' column found in CSV. Initializing to 'MEDIUM'.")
        df['Qualification_Score'] = 'MEDIUM'
        score_col = 'Qualification_Score'

    counts = df[score_col].astype(str).str.upper().value_counts().to_dict()
    total  = len(df)
    high   = counts.get("HIGH", 0)
    medium = counts.get("MEDIUM", 0)
    low    = counts.get("LOW", 0)

    log("LEAD_CHECK", "OK",
        f"Total={total} | HIGH={high} | MEDIUM={medium} | LOW={low}")

    # Step 3 — enrichment audit (while df is in scope)
    enrichment_audit = _audit_enrichment(df)

    # Trigger lead_gen.py if HIGH count is below threshold
    if high < HIGH_LEAD_THRESHOLD:
        log("LEAD_GEN_TRIGGER", "OK",
            f"HIGH leads ({high}) < threshold ({HIGH_LEAD_THRESHOLD}). Launching lead_gen.py...")
        _run_lead_gen()
        
        # Re-read CSV after lead generation to report updated stats
        if LEADS_CSV.exists():
            try:
                df = pd.read_csv(LEADS_CSV)
                df.columns = [c.strip() for c in df.columns]
                score_col = next((c for c in df.columns if c.lower() == "qualification_score"), None)
                if score_col is not None:
                    counts = df[score_col].astype(str).str.upper().value_counts().to_dict()
                    total  = len(df)
                    high   = counts.get("HIGH", 0)
                    medium = counts.get("MEDIUM", 0)
                    low    = counts.get("LOW", 0)
                    log("LEAD_CHECK_POST", "OK",
                        f"Post-run Stats: Total={total} | HIGH={high} | MEDIUM={medium} | LOW={low}")
                    enrichment_audit = _audit_enrichment(df)
            except Exception as e:
                log("LEAD_CHECK_POST", "ERROR", f"Failed to reload leads post-run: {e}")
    else:
        log("LEAD_GEN_TRIGGER", "OK",
            f"HIGH leads ({high}) >= threshold ({HIGH_LEAD_THRESHOLD}). lead_gen.py not needed.")

    return {
        "total": total,
        "high": high,
        "medium": medium,
        "low": low,
        "missing_enrichment_orgs": enrichment_audit,
    }


def _run_lead_gen() -> None:
    """Invoke lead_gen.py as a subprocess."""
    if not LEAD_GEN_SCRIPT.exists():
        log("LEAD_GEN_RUN", "ERROR", f"lead_gen.py not found at {LEAD_GEN_SCRIPT}")
        return
    try:
        result = subprocess.run(
            [sys.executable, str(LEAD_GEN_SCRIPT)],
            capture_output=True, text=True, timeout=300
        )
        if result.returncode == 0:
            log("LEAD_GEN_RUN", "OK", "lead_gen.py completed successfully.")
        else:
            err_snippet = result.stderr[-300:] if result.stderr else "no stderr"
            log("LEAD_GEN_RUN", "ERROR",
                f"lead_gen.py exited {result.returncode}. stderr: {err_snippet}")
    except subprocess.TimeoutExpired:
        log("LEAD_GEN_RUN", "ERROR", "lead_gen.py timed out after 300s.")
    except Exception as exc:
        log("LEAD_GEN_RUN", "ERROR", f"Failed to run lead_gen.py: {exc}")


# ──────────────────────────────────────────────────────────────────
# STEP 3 — Enrichment audit (Apollo / LinkedIn)
# ──────────────────────────────────────────────────────────────────
def _audit_enrichment(df) -> list:
    """
    Checks which leads are missing Apollo/LinkedIn enrichment fields.
    Returns list of organization names that need enrichment.
    """
    ENRICHMENT_COLS = [
        "Apollo_Contact",
        "LinkedIn_Profile",
        "Decision_Maker",
        "Email",
        "enriched",
    ]

    present_cols = [c for c in ENRICHMENT_COLS if c in df.columns]

    if not present_cols:
        log("ENRICHMENT_AUDIT", "WARN",
            "No Apollo/LinkedIn enrichment columns found in CSV. All leads need enrichment.")
        org_col = next((c for c in df.columns if c.lower() == "organization"), None)
        if org_col:
            orgs = df[org_col].dropna().tolist()
        else:
            orgs = [f"Row_{i}" for i in range(len(df))]
        preview = ", ".join(str(o) for o in orgs[:10])
        suffix  = f"... (+{len(orgs)-10} more)" if len(orgs) > 10 else ""
        log("ENRICHMENT_AUDIT", "WARN",
            f"{len(orgs)} leads need enrichment: {preview}{suffix}")
        return orgs

    def is_missing(row):
        return all(
            (str(row.get(col, "")).strip() in ("", "nan", "None", "N/A"))
            for col in present_cols
        )

    org_col = next((c for c in df.columns if c.lower() == "organization"), None)
    missing_rows = df[df.apply(is_missing, axis=1)]
    missing_orgs = (
        missing_rows[org_col].tolist()
        if org_col
        else [f"Row_{i}" for i in missing_rows.index]
    )

    status = "OK" if not missing_orgs else "WARN"
    log("ENRICHMENT_AUDIT", status,
        f"{len(missing_orgs)}/{len(df)} leads missing Apollo/LinkedIn enrichment.")

    if missing_orgs:
        preview = ", ".join(str(o) for o in missing_orgs[:10])
        suffix  = f"... (+{len(missing_orgs)-10} more)" if len(missing_orgs) > 10 else ""
        log("ENRICHMENT_AUDIT", "WARN", f"Needs enrichment: {preview}{suffix}")

    return missing_orgs


# ──────────────────────────────────────────────────────────────────
# STEP 4 — Instantly.ai outreach sync
# ──────────────────────────────────────────────────────────────────
def sync_instantly() -> dict:
    """
    Simulates/calls Instantly.ai sync.
    Set env var INSTANTLY_SIMULATE=false and INSTANTLY_CLI_PATH=<path>
    to enable live sync.
    """
    INSTANTLY_CLI   = os.environ.get("INSTANTLY_CLI_PATH", "instantly")
    USE_SIMULATION  = os.environ.get("INSTANTLY_SIMULATE", "true").lower() == "true"

    if USE_SIMULATION:
        log("INSTANTLY_SYNC", "OK",
            "[SIMULATED] Instantly.ai sync — would push enriched leads to active campaign. "
            "Set INSTANTLY_SIMULATE=false and INSTANTLY_CLI_PATH to enable live sync.")
        return {"exit_code": 0, "message": "simulated_ok"}

    # Live path
    try:
        result = subprocess.run(
            [INSTANTLY_CLI, "campaign", "sync", "--all"],
            capture_output=True, text=True, timeout=120
        )
        msg = result.stdout.strip()[-200:] if result.stdout else "no output"
        if result.returncode == 0:
            log("INSTANTLY_SYNC", "OK", f"Instantly.ai sync succeeded. {msg}")
        else:
            err = result.stderr.strip()[-200:] if result.stderr else "no stderr"
            log("INSTANTLY_SYNC", "ERROR",
                f"Instantly.ai sync failed (exit {result.returncode}). {err}")
        return {"exit_code": result.returncode, "message": msg}
    except FileNotFoundError:
        log("INSTANTLY_SYNC", "WARN",
            "Instantly CLI not found. Install it or set INSTANTLY_CLI_PATH env var.")
        return {"exit_code": -1, "message": "cli_not_found"}
    except subprocess.TimeoutExpired:
        log("INSTANTLY_SYNC", "ERROR", "Instantly.ai sync timed out after 120s.")
        return {"exit_code": -2, "message": "timeout"}
    except Exception as exc:
        log("INSTANTLY_SYNC", "ERROR", f"Unexpected error: {exc}")
        return {"exit_code": -3, "message": str(exc)}


# ──────────────────────────────────────────────────────────────────
# STEP 6 — Update current-state.md
# ──────────────────────────────────────────────────────────────────
def update_current_state(lead_stats: dict, instantly_result: dict) -> None:
    """Appends a watchdog ops summary block to current-state.md."""
    ts_human  = datetime.datetime.now().strftime("%Y-%m-%d %H:%M UTC")
    high      = lead_stats.get("high", "?")
    total     = lead_stats.get("total", "?")
    missing   = len(lead_stats.get("missing_enrichment_orgs", []))
    inst_code = instantly_result.get("exit_code", "?")
    inst_msg  = instantly_result.get("message", "")
    triggered = "Yes" if (isinstance(high, int) and high < HIGH_LEAD_THRESHOLD) else "No"

    block = (
        f"\n## Watchdog Report — {ts_human}\n"
        f"- **Leads (Total/HIGH):** {total} / {high}\n"
        f"- **Enrichment Gap:** {missing} leads missing Apollo/LinkedIn data\n"
        f"- **Lead Gen Triggered:** {triggered} (threshold={HIGH_LEAD_THRESHOLD})\n"
        f"- **Instantly.ai Sync:** exit_code={inst_code} ({inst_msg})\n"
        f"- **Log:** `agency-brain/operations/watchdog_log.csv`\n"
    )

    if not CURRENT_STATE.exists():
        log("UPDATE_STATE", "WARN", "current-state.md missing — creating fresh file.")
        CURRENT_STATE.parent.mkdir(parents=True, exist_ok=True)
        CURRENT_STATE.write_text(block.strip(), encoding="utf-8")
    else:
        with open(CURRENT_STATE, "a", encoding="utf-8") as f:
            f.write(block)
    log("UPDATE_STATE", "OK", f"Appended watchdog summary to {CURRENT_STATE}")


# ──────────────────────────────────────────────────────────────────
# STANDALONE MODE
# ──────────────────────────────────────────────────────────────────
def run_standalone() -> None:
    """Full ops cycle — pure Python, no SDK dependency."""
    print("\n" + "=" * 60)
    print("  SYNA SYSTEMS — WATCHDOG AGENT (Standalone Mode)")
    print("=" * 60 + "\n")

    state_content    = read_current_state()           # Step 1
    lead_stats       = check_leads_and_run_lead_gen() # Steps 2 & 3
    instantly_result = sync_instantly()               # Step 4
    flush_log()                                       # Step 5
    update_current_state(lead_stats, instantly_result) # Step 6

    print("\n" + "=" * 60)
    print("  WATCHDOG CYCLE COMPLETE")
    print(f"  Total leads        : {lead_stats['total']}")
    print(f"  HIGH-quality leads : {lead_stats['high']}")
    print(f"  Needs enrichment   : {len(lead_stats['missing_enrichment_orgs'])}")
    print(f"  Instantly sync     : exit={instantly_result['exit_code']}")
    print(f"  Log written to     : {WATCHDOG_LOG}")
    print("=" * 60 + "\n")


# ──────────────────────────────────────────────────────────────────
# SDK MODE — Google Antigravity Agent
# ──────────────────────────────────────────────────────────────────
async def run_sdk_mode() -> None:
    """
    Orchestrate watchdog using the Google Antigravity SDK.
    AI agent reads state and generates an executive ops summary;
    file mutations still use the Python helpers above.
    """
    try:
        from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig  # type: ignore
    except ImportError:
        print("[WATCHDOG] google-antigravity not installed. Falling back to standalone mode.")
        run_standalone()
        return

    print("\n" + "=" * 60)
    print("  SYNA SYSTEMS — WATCHDOG AGENT (SDK Mode)")
    print("=" * 60 + "\n")

    # Gather data (same helpers as standalone)
    state_content    = read_current_state()
    lead_stats       = check_leads_and_run_lead_gen()
    instantly_result = sync_instantly()

    missing_preview = ", ".join(
        str(o) for o in lead_stats["missing_enrichment_orgs"][:15]
    )

    prompt = f"""You are the Syna Systems Operations Watchdog.
Analyse the current agency state and generate a concise executive ops summary.

=== CURRENT STATE (truncated) ===
{state_content[:2000]}

=== LEAD METRICS ===
- Total leads  : {lead_stats['total']}
- HIGH-quality : {lead_stats['high']}
- MEDIUM       : {lead_stats['medium']}
- LOW          : {lead_stats['low']}
- Missing Apollo/LinkedIn enrichment: {len(lead_stats['missing_enrichment_orgs'])}
- Sample missing orgs: {missing_preview}
- lead_gen.py triggered: {"YES — below threshold" if lead_stats['high'] < HIGH_LEAD_THRESHOLD else "NO"}

=== INSTANTLY.AI SYNC ===
- Exit code : {instantly_result['exit_code']}
- Message   : {instantly_result['message']}

Produce:
1. A 3-sentence ops status paragraph.
2. Top 3 priority actions for the next 24 hours.
3. Risk flags (if any).
Keep total output under 250 words.
"""

    config = LocalAgentConfig(
        model="gemini-2.5-pro",
        capabilities=CapabilitiesConfig(
            code_execution=False,
            web_search=False,
        ),
    )

    async with Agent(config=config) as agent:
        response = await agent.chat(prompt)
        ai_summary = response.text if hasattr(response, "text") else str(response)

    log("SDK_ANALYSIS", "OK", "AI ops summary generated via Antigravity SDK.")
    print("\n-- AI OPS SUMMARY --")
    print(ai_summary)
    print("--------------------\n")

    # Log snippet of AI summary
    snippet = ai_summary[:120].replace("\n", " ")
    log("SDK_ANALYSIS", "OK", f"Summary snippet: {snippet}...")

    flush_log()
    update_current_state(lead_stats, instantly_result)

    print("\n" + "=" * 60)
    print("  WATCHDOG CYCLE COMPLETE (SDK Mode)")
    print(f"  Log written to: {WATCHDOG_LOG}")
    print("=" * 60 + "\n")


# ──────────────────────────────────────────────────────────────────
# ENTRY POINT
# ──────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Syna Systems Operations Watchdog Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--standalone", action="store_true",
        help="Force standalone Python mode (no SDK)"
    )
    group.add_argument(
        "--sdk", action="store_true",
        help="Force SDK mode (fails if google-antigravity not installed)"
    )
    args = parser.parse_args()

    if args.standalone:
        run_standalone()
    elif args.sdk:
        asyncio.run(run_sdk_mode())
    else:
        # Auto-detect: use SDK if available, else standalone
        try:
            import google.antigravity  # noqa: F401
            asyncio.run(run_sdk_mode())
        except ImportError:
            print(
                "[WATCHDOG] google-antigravity SDK not detected — "
                "running in standalone mode.\n"
            )
            run_standalone()


if __name__ == "__main__":
    main()
