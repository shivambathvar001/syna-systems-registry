#!/usr/bin/env python3
"""
linkedin_draft.py — Syna Systems LinkedIn Authority Series Auto-Drafter
=======================================================================
Reads content_calendar.md, determines today's scheduled post based on
week number and day of week, fills the appropriate template, and saves
a draft to agency-brain/linkedin/drafts/YYYY-MM-DD.md.

Logs every run to agency-brain/operations/watchdog_log.csv.

Usage:
    python scripts/linkedin_draft.py
    python scripts/linkedin_draft.py --date 2026-06-23   # force a specific date
    python scripts/linkedin_draft.py --dry-run           # print draft, don't save
    python scripts/linkedin_draft.py --week 1 --day mon  # force week/day override
"""

import argparse
import csv
import os
import sys
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Optional

# ─── PATH CONFIG ────────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).resolve().parent
SYNA_ROOT    = SCRIPT_DIR.parent
BRAIN_DIR    = SYNA_ROOT / "agency-brain"
LINKEDIN_DIR = BRAIN_DIR / "linkedin"
DRAFTS_DIR   = LINKEDIN_DIR / "drafts"
OPS_DIR      = BRAIN_DIR / "operations"
LOG_FILE     = OPS_DIR / "watchdog_log.csv"
CALENDAR_MD  = LINKEDIN_DIR / "content_calendar.md"

# ─── SERIES START DATE ──────────────────────────────────────────────────────────
# Update this to the Monday you want Week 1 to begin.
SERIES_START_DATE = date(2026, 6, 22)  # First Monday of the authority series

# ─── CONTENT CALENDAR ───────────────────────────────────────────────────────────
# Keyed by (week_number: 1-4, day_abbr: 'mon'/'wed'/'fri')
# Each entry: dict with topic, hook, template, hashtags, post_time, post_type

CONTENT_CALENDAR = {
    # ── WEEK 1 ──────────────────────────────────────────────────────────────────
    (1, "mon"): {
        "post_type": "INSIGHT",
        "topic": "The hidden cost of manual denial management",
        "hook": "Your RCM team is losing $40K+ per month — not to denials, but to the 48-hour lag before they catch them.",
        "template": "A",
        "post_time_ist": "7:30 PM IST",
        "hashtags": "#HealthcareRCM #DenialManagement #AIinHealthcare #RevenueIntegrity #HealthcareOperations",
        "outline": [
            "Stat: Average healthcare org takes 2-3 days to identify denial patterns",
            "Gap: By day 3, appeal window is narrowing, staff is reactive",
            "Syna angle: AI detection layer flags denial clusters in <4 hours",
            "Close: This is the difference between patching and preventing",
        ],
        "cta": "What's your team's average time-to-denial-detection? Drop a number below.",
    },
    (1, "wed"): {
        "post_type": "PROVOCATION",
        "topic": "Why hiring more coders doesn't solve your denial problem",
        "hook": "You don't have a billing problem. You have a data latency problem. Hiring more coders won't fix it.",
        "template": "D",
        "post_time_ist": "8:00 PM IST",
        "hashtags": "#HealthcareLeadership #RCMLeaders #ClinicalDocumentation #HealthcareAI #MedicalBilling",
        "outline": [
            "67% of denials are preventable at point of care — not at billing",
            "Root cause sits in upstream clinical documentation, not billing codes",
            "Syna intercepts at the clinical documentation layer",
            "CTA: Where does your team first see denials?",
        ],
        "cta": "Where does your team first see denials — billing desk or intake? Tell me below.",
    },
    (1, "fri"): {
        "post_type": "LIST",
        "topic": "5 signs your RCM is in reactive mode",
        "hook": "5 signs your Revenue Cycle team is firefighting instead of preventing — and what intelligent RCM infrastructure looks like instead.",
        "template": "C",
        "post_time_ist": "7:00 PM IST",
        "hashtags": "#RevenueCycleManagement #HealthcareCFO #AIAutomation #HealthcareInnovation #DenialPrevention",
        "outline": [
            "1. Your denial rate report is weekly, not real-time",
            "2. Appeals are written from scratch — no pre-built argument library",
            "3. Payer policy changes hit you after denials spike",
            "4. Your AR dashboard shows dollars — not denial reason codes + trends",
            "5. Root cause analysis takes a meeting, not a dashboard",
        ],
        "cta": "Which of these 5 hits hardest for your team? Drop the number in comments.",
    },
    # ── WEEK 2 ──────────────────────────────────────────────────────────────────
    (2, "mon"): {
        "post_type": "INSIGHT",
        "topic": "The anatomy of an AI denial detection pipeline",
        "hook": "Here's what's running inside a denial management AI system that catches 73% of avoidable denials before claim submission.",
        "template": "A",
        "post_time_ist": "7:30 PM IST",
        "hashtags": "#HealthcareAI #AIInfrastructure #DenialManagement #HealthcareRCM #LangChain",
        "outline": [
            "Layer 1: Clinical NLP extraction (ICD/CPT validation against payer rules)",
            "Layer 2: Payer policy retrieval (LangGraph agent, LCD/NCD feeds)",
            "Layer 3: Denial prediction scoring (<0.65 = flag for human review)",
            "Layer 4: Auto-appeal drafting (evidence synthesis from EHR + guidelines)",
        ],
        "cta": "Which layer surprises you most? Which one does your current vendor NOT have?",
    },
    (2, "wed"): {
        "post_type": "TOOL DEMO",
        "topic": "How the Denial Resolution Engine handles payer policy drift",
        "hook": "Payer policies change 200+ times per year. Most RCM teams find out after the denial. We built a system that doesn't wait.",
        "template": "B",
        "post_time_ist": "8:00 PM IST",
        "hashtags": "#HealthcareRCM #PayerDenials #AIAgent #ClaimsManagement #HealthcareInnovation",
        "outline": [
            "Problem: UHC/Aetna/BCBS update LCDs constantly",
            "Agent crawls payer portals + CMS policy feeds on schedule",
            "Policy delta detection → auto-update to pre-submission validation layer",
            "Live demo offer: run against your top 3 payers",
        ],
        "cta": "What payer gives your team the most denial headaches? Drop it below.",
    },
    (2, "fri"): {
        "post_type": "INSIGHT",
        "topic": "Why LangGraph is the right architecture for healthcare AI agents",
        "hook": "Most healthcare AI demos are chatbots. Real RCM automation is a stateful, multi-agent pipeline. Here's the difference.",
        "template": "A",
        "post_time_ist": "7:00 PM IST",
        "hashtags": "#LangGraph #AIEngineering #HealthcareAI #AgentArchitecture #RCMTech",
        "outline": [
            "Chatbot problem: single-turn, no memory, no coordination",
            "LangGraph: nodes = specialists, edges = workflow logic",
            "HIPAA compliance baked into graph boundaries",
            "Syna: denial-resolution-engine — 4 specialist nodes, 1 compliance screener",
        ],
        "cta": "Are you evaluating AI for RCM? I'll send you the architecture decision doc — just DM me.",
    },
    # ── WEEK 3 ──────────────────────────────────────────────────────────────────
    (3, "mon"): {
        "post_type": "INSIGHT",
        "topic": "The ROI math of AI denial management (300-600% return)",
        "hook": "We modeled the ROI on AI-assisted denial management for a 300-bed hospital. The number surprised even us: 412% in Year 1.",
        "template": "A",
        "post_time_ist": "7:30 PM IST",
        "hashtags": "#HealthcareROI #RCMLeadership #AIinHealthcare #DenialManagement #RevenueRecovery",
        "outline": [
            "8,000 claims/month, 11% denial rate = 880 denials",
            "Manual cost: $45/denial → $39,600/month",
            "With AI: denials drop 73% → 238 denials; appeal success 40% → 67%",
            "Net lift: +$187K/month | Annual: $2.24M | ROI: 412% net",
        ],
        "cta": "DM me your denial rate + monthly claim volume. I'll run the model and send it back.",
    },
    (3, "wed"): {
        "post_type": "STORY",
        "topic": "Before/After: RCM team shifts from reactive to proactive in 6 weeks",
        "hook": "6 weeks ago, their RCM team was running manual denial scrubs every Friday. This week, denials flag themselves before 9 AM.",
        "template": "B",
        "post_time_ist": "8:00 PM IST",
        "hashtags": "#HealthcareTransformation #RCMSuccess #AIAutomation #DenialManagement #HealthcareOperations",
        "outline": [
            "BEFORE: 2hrs/Friday manual scrubs, 38% appeal success, 14-day resolution",
            "TRANSITION: Syna deployed Pre-Submission Validation + Denial Cluster Detection",
            "AFTER: Real-time flags, <90s appeal drafts, 61% appeal success, 6-day resolution",
            "$83K additional monthly revenue recovered",
        ],
        "cta": "What would your team do with 10 hours/week back from manual denial work?",
    },
    (3, "fri"): {
        "post_type": "LIST",
        "topic": "5 revenue leakage points AI infrastructure seals in healthcare RCM",
        "hook": "5 places your healthcare organization is leaking revenue right now — and the AI infrastructure layer that seals each one.",
        "template": "C",
        "post_time_ist": "7:00 PM IST",
        "hashtags": "#RevenueLeakage #HealthcareFinance #RCMLeadership #AIInfrastructure #ClaimsManagement",
        "outline": [
            "1. Pre-auth gaps → real-time prior auth requirement check",
            "2. Coding errors → NLP validation of ICD-10/CPT vs clinical docs",
            "3. Payer policy drift → automated policy update ingestion",
            "4. Appeal delays → auto-drafted letters with clinical evidence in <2min",
            "5. Underpayment → claim-to-contract variance detection",
        ],
        "cta": "Which of these 5 is your #1 revenue leak right now?",
    },
    # ── WEEK 4 ──────────────────────────────────────────────────────────────────
    (4, "mon"): {
        "post_type": "CASE STUDY",
        "topic": "Project BIO-GUARD — AI clinical documentation layer",
        "hook": "Project BIO-GUARD: We built an AI layer that reads clinical notes and flags documentation gaps before they become denials. Here's what happened.",
        "template": "B",
        "post_time_ist": "7:30 PM IST",
        "hashtags": "#CaseStudy #HealthcareAI #ClinicalDocumentation #DenialManagement #HealthcareRCM",
        "outline": [
            "Client: Mid-size healthcare network (NDA)",
            "Problem: 23% of denials from incomplete clinical documentation at discharge",
            "Solution: NLP agent scans discharge summaries vs payer coverage criteria",
            "Result: Documentation denials -67% in 90 days; $1.2M annualized recovery",
        ],
        "cta": "Is your denial root cause sitting in clinical documentation? Most teams don't know until they look.",
    },
    (4, "wed"): {
        "post_type": "CASE STUDY",
        "topic": "Project IRON-LOGIC — Payer intelligence + auto-appeal engine",
        "hook": "Project IRON-LOGIC: We gave a billing team the ability to auto-draft appeals with clinical evidence in 90 seconds. Their appeal success rate went from 38% to 71%.",
        "template": "B",
        "post_time_ist": "8:00 PM IST",
        "hashtags": "#HealthcareAI #AppealManagement #RCMAutomation #LangGraph #AIAgents",
        "outline": [
            "Client: 12-provider specialty group, high-volume authorizations",
            "Problem: 4+ hours/appeal, 38% success rate, team burnout",
            "Solution: LangGraph 3-node engine (parser → evidence retriever → synthesizer)",
            "Result: 90-second drafts, 71% approval rate, $640K annual recovery",
        ],
        "cta": "What's your current appeal approval rate? Drop it in the comments — I'll benchmark it.",
    },
    (4, "fri"): {
        "post_type": "PROVOCATION",
        "topic": "Why your EHR vendor's AI features won't solve your denial problem",
        "hook": "Your EHR just announced AI features. Your payer just increased denial rates 8%. Coincidence? No. And those AI features won't help you.",
        "template": "D",
        "post_time_ist": "7:00 PM IST",
        "hashtags": "#HealthcareIT #EHR #AIinHealthcare #DenialManagement #HealthcareLeadership",
        "outline": [
            "Epic's AI = documentation helper, not denial prevention system",
            "EHR AI trained on documentation quality, not payer policy logic",
            "Need: a layer BETWEEN EHR and clearinghouse that understands payer behavior",
            "Syna = that infrastructure layer: payer-aware, denial-trained, workflow-integrated",
        ],
        "cta": "What's your EHR vendor telling you about AI? I'll tell you what they're not saying.",
    },
}

# ─── TEMPLATE BUILDERS ───────────────────────────────────────────────────────────

def build_template_a(entry: dict) -> str:
    """Insight / Stat-Led Post"""
    outline_lines = "\n".join(f"→ {point}" for point in entry["outline"])
    return f"""{entry['hook']}

Most Revenue Cycle leaders don't see this coming until it hits their AR.

Here's the breakdown:

{outline_lines}

At Syna Systems, we built infrastructure to move healthcare organizations from reactive 
to intelligent mode — not dashboards, decision pipelines.

{entry['cta']}

{entry['hashtags']}"""


def build_template_b(entry: dict) -> str:
    """Story / Before-After Post"""
    outline_lines = "\n".join(f"→ {point}" for point in entry["outline"])
    return f"""{entry['hook']}

Here's the full picture:

{outline_lines}

What changed wasn't headcount — it was the infrastructure supporting the team.

The best RCM teams don't work harder. They operate with better systems.

{entry['cta']}

{entry['hashtags']}"""


def build_template_c(entry: dict) -> str:
    """List / 5 Things Post"""
    numbered_lines = "\n\n".join(
        f"{point}" for point in entry["outline"]
    )
    return f"""{entry['hook']}

(Most RCM leaders can spot 2. The best teams have eliminated all of them.)

{numbered_lines}

Every one of these is an infrastructure problem — not a people problem.

The teams that solve all 5 don't hire more billers.
They build systems that make these problems impossible.

That's what Syna Systems builds.

{entry['cta']}

{entry['hashtags']}"""


def build_template_d(entry: dict) -> str:
    """Provocation / Contrarian Post"""
    outline_lines = "\n\n".join(f"{point}" for point in entry["outline"])
    return f"""{entry['hook']}

I know that's not what you've been told.

But here's what the data actually shows:

{outline_lines}

The conventional wisdom isn't wrong because people are stupid.
It's wrong because the problem is upstream of where most vendors operate.

Syna Systems operates upstream.

{entry['cta']}

{entry['hashtags']}"""


TEMPLATE_BUILDERS = {
    "A": build_template_a,
    "B": build_template_b,
    "C": build_template_c,
    "D": build_template_d,
}

# ─── DATE RESOLUTION ─────────────────────────────────────────────────────────────

POSTING_DAYS = {0: "mon", 2: "wed", 4: "fri"}  # Monday=0, Wednesday=2, Friday=4


def resolve_calendar_key(target_date: date) -> Optional[tuple]:
    """
    Given a date, return (week_number, day_abbr) key for CONTENT_CALENDAR,
    or None if target_date is not a posting day.
    """
    weekday = target_date.weekday()
    if weekday not in POSTING_DAYS:
        return None

    day_abbr = POSTING_DAYS[weekday]
    delta = (target_date - SERIES_START_DATE).days

    if delta < 0:
        return None  # Before series starts

    week_number = (delta // 7) + 1
    if week_number > 4:
        week_number = ((week_number - 1) % 4) + 1  # Roll over 4-week cycle

    return (week_number, day_abbr)


# ─── DRAFT BUILDER ───────────────────────────────────────────────────────────────

def build_draft(target_date: date) -> Optional[str]:
    """Build the full markdown draft for target_date. Returns None if no post scheduled."""
    key = resolve_calendar_key(target_date)
    if key is None:
        return None

    entry = CONTENT_CALENDAR.get(key)
    if entry is None:
        return None

    template_fn = TEMPLATE_BUILDERS.get(entry["template"], build_template_a)
    post_body = template_fn(entry)

    draft = f"""# LinkedIn Draft — {target_date.strftime('%B %d, %Y')}
**Post Type:** {entry['post_type']}
**Template:** {entry['template']}
**Topic:** {entry['topic']}
**Schedule:** {entry['post_time_ist']}
**Status:** DRAFT — Pending Human Review

---

## HOOK (first line — never change this)
{entry['hook']}

---

## FULL POST DRAFT

{post_body}

---

## NOTES FOR REVIEWER
- Character count target: 900–1,200 characters
- Do NOT add links in the body — put any links in the first comment
- Hashtags capped at 5 (already included above)
- Posting window: {entry['post_time_ist']} (schedule in LinkedIn creator tools)
- After approval: post via LinkedIn MCP or manually schedule

## REVISION HISTORY
- {target_date.isoformat()} — Auto-generated by linkedin_draft.py
"""
    return draft


# ─── LOGGING ────────────────────────────────────────────────────────────────────

def log_run(
    run_date: date,
    status: str,
    draft_path: str,
    post_type: str = "",
    week: int = 0,
    day: str = "",
    notes: str = "",
) -> None:
    """Append a run record to watchdog_log.csv."""
    OPS_DIR.mkdir(parents=True, exist_ok=True)
    write_header = not LOG_FILE.exists()

    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if write_header:
            writer.writerow([
                "timestamp", "run_date", "week", "day",
                "post_type", "status", "draft_path", "notes",
            ])
        writer.writerow([
            datetime.now().isoformat(),
            run_date.isoformat(),
            week,
            day,
            post_type,
            status,
            draft_path,
            notes,
        ])


# ─── MAIN ────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Syna Systems LinkedIn Authority Series Auto-Drafter"
    )
    parser.add_argument(
        "--date",
        type=str,
        help="Target date in YYYY-MM-DD format (default: today)",
    )
    parser.add_argument(
        "--week",
        type=int,
        choices=[1, 2, 3, 4],
        help="Force a specific week number (1-4)",
    )
    parser.add_argument(
        "--day",
        type=str,
        choices=["mon", "wed", "fri"],
        help="Force a specific day (mon/wed/fri)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print draft to stdout, do not save",
    )
    args = parser.parse_args()

    # Resolve target date
    if args.date:
        try:
            target_date = date.fromisoformat(args.date)
        except ValueError:
            print(f"[ERROR] Invalid date format: {args.date}. Use YYYY-MM-DD.")
            sys.exit(1)
    else:
        target_date = date.today()

    # Override week/day if provided
    if args.week and args.day:
        key = (args.week, args.day)
        entry = CONTENT_CALENDAR.get(key)
        if not entry:
            print(f"[ERROR] No entry found for week={args.week}, day={args.day}")
            sys.exit(1)
        draft = build_draft.__wrapped__ if hasattr(build_draft, "__wrapped__") else None
        # Build directly
        template_fn = TEMPLATE_BUILDERS.get(entry["template"], build_template_a)
        post_body = template_fn(entry)
        draft_content = f"""# LinkedIn Draft — {target_date.strftime('%B %d, %Y')} (Forced: W{args.week}/{args.day.upper()})
**Post Type:** {entry['post_type']}
**Template:** {entry['template']}
**Topic:** {entry['topic']}
**Schedule:** {entry['post_time_ist']}
**Status:** DRAFT — Pending Human Review

---

## HOOK
{entry['hook']}

---

## FULL POST DRAFT

{post_body}

---

## NOTES FOR REVIEWER
- Character count target: 900–1,200 characters
- Posting window: {entry['post_time_ist']}
- After approval: post via LinkedIn MCP or manually schedule
"""
        week_num = args.week
        day_abbr = args.day
        post_type = entry["post_type"]
    else:
        # Auto-detect from date
        draft_content = build_draft(target_date)
        if draft_content is None:
            msg = f"No post scheduled for {target_date} (not a Mon/Wed/Fri or outside series range)"
            print(f"[INFO] {msg}")
            log_run(target_date, "SKIPPED", "", notes=msg)
            sys.exit(0)
        key = resolve_calendar_key(target_date)
        week_num, day_abbr = key
        post_type = CONTENT_CALENDAR[key]["post_type"]

    if args.dry_run:
        print("=" * 60)
        print(draft_content)
        print("=" * 60)
        print("[DRY RUN] Draft not saved.")
        return

    # Save draft
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    draft_filename = DRAFTS_DIR / f"{target_date.isoformat()}.md"

    if draft_filename.exists():
        print(f"[WARN] Draft already exists: {draft_filename}")
        print("[INFO] Overwriting with fresh draft.")

    draft_filename.write_text(draft_content, encoding="utf-8")
    print(f"[OK] Draft saved: {draft_filename}")
    print(f"     Week {week_num} | {day_abbr.upper()} | {post_type}")

    # Log the run
    log_run(
        run_date=target_date,
        status="DRAFT_CREATED",
        draft_path=str(draft_filename),
        post_type=post_type,
        week=week_num,
        day=day_abbr,
    )
    print(f"[OK] Logged to: {LOG_FILE}")


if __name__ == "__main__":
    main()
