# AGY Background Task — LinkedIn Authority Series
**Syna Systems | LinkedIn Automation Workflow**
Last Updated: 2026-06-20

---

## OVERVIEW

This document defines how to configure an AGY background task (via `/schedule` or watchdog) to:
1. **Auto-generate** daily LinkedIn drafts using `linkedin_draft.py`
2. **Alert you** for human review
3. **Post** approved drafts via LinkedIn MCP

```
PIPELINE:
  AGY Scheduler → linkedin_draft.py → drafts/YYYY-MM-DD.md
       ↓
  Human Review (Approve / Edit / Reject)
       ↓
  LinkedIn MCP → Post Live
       ↓
  watchdog_log.csv updated
```

---

## STEP 1: DAILY DRAFT GENERATION (AGY Scheduler)

### Using `/schedule` Command
In your AGY session, type:
```
/schedule
```
Then configure:
- **Frequency:** Daily (weekdays only: Mon / Wed / Fri)
- **Time:** 6:00 PM IST (one hour before target posting window)
- **Instruction:** (paste the agent prompt below)

### Equivalent Cron Setup (if using watchdog.py)
Add to `watchdog.py` or cron:
```python
# Run at 18:00 IST every Mon/Wed/Fri
# Cron: 0 12 * * 1,3,5  (12:30 UTC = 18:00 IST)
import subprocess
subprocess.run([
    "python",
    "D:/ShivamGem/SynaSystems/scripts/linkedin_draft.py"
], check=True)
```

---

## STEP 2: AGY AGENT PROMPT (For Drafting Agent)

Use this prompt when scheduling the AGY LinkedIn Drafting Agent:

```
SYSTEM ROLE:
You are the LinkedIn Authority Series Drafting Agent for Syna Systems.
Syna Systems positioning: Operational AI Infrastructure Partner for Healthcare RCM.
Target audience: VP / Director of Revenue Cycle Management.

YOUR TASK TODAY:
1. Read: D:/ShivamGem/SynaSystems/agency-brain/linkedin/content_calendar.md
2. Identify today's scheduled post (based on current date, week in series, Mon/Wed/Fri)
3. Read: D:/ShivamGem/SynaSystems/agency-brain/linkedin/post_templates.md
4. Generate a complete LinkedIn post draft using the correct template (A/B/C/D)
5. Save the draft to: D:/ShivamGem/SynaSystems/agency-brain/linkedin/drafts/YYYY-MM-DD.md
6. Log the run to: D:/ShivamGem/SynaSystems/agency-brain/operations/watchdog_log.csv

DRAFT REQUIREMENTS:
- Hook line: first line EXACTLY as specified in calendar (this is the "see more" line)
- Body: fill template with Syna Systems specifics from the calendar outline
- Include all 5 hashtags from the calendar entry
- Include the CTA from the calendar entry
- Length: 900–1,200 characters for the post body
- NO links in post body (LinkedIn algorithm penalty) — add any links as a comment note
- Format: LinkedIn-optimized (short paragraphs, → arrows, white space)

QUALITY CHECK BEFORE SAVING:
- Does the hook stop the scroll? (Provocative / specific / surprising)
- Does the body deliver tangible value? (Not vague — specific stats, mechanisms, names)
- Does the CTA invite engagement? (Question, DM request, or benchmark challenge)
- Are all 5 hashtags from the calendar included?

AFTER SAVING:
Report back with:
- Draft file path
- Post type and week/day
- Word count
- Top 3 lines of the hook for human preview
```

---

## STEP 3: REVIEW WORKFLOW

### Folder Structure
```
agency-brain/linkedin/
├── content_calendar.md          ← Source of truth
├── post_templates.md            ← Template library
├── agy_linkedin_task.md         ← This file
├── targeting.md                 ← Hashtag + audience research
└── drafts/
    ├── 2026-06-22.md            ← W1-Mon draft (PENDING)
    ├── 2026-06-24.md            ← W1-Wed draft (PENDING)
    └── ...
```

### Draft Status Tags
Each draft file has a **Status** field in its header. Update this manually:
| Status | Meaning |
|--------|---------|
| `DRAFT — Pending Human Review` | Auto-generated, not reviewed |
| `APPROVED — Schedule to Post` | Human approved, ready for LinkedIn MCP |
| `EDITED — Ready to Post` | Human edited + approved |
| `POSTED — [timestamp]` | Successfully published |
| `REJECTED — [reason]` | Draft rejected, regenerate next cycle |

### Review Checklist (2-minute review)
- [ ] Hook line is punchy and stops the scroll
- [ ] Stats/claims are accurate (check against content_calendar.md source)
- [ ] No typos, awkward phrasing
- [ ] CTA is clear and actionable
- [ ] Hashtags are correct (max 5)
- [ ] No outbound links in body
- [ ] Tone matches Syna's voice (confident, technical, not salesy)

---

## STEP 4: POSTING VIA LINKEDIN MCP

Once a draft is marked `APPROVED — Schedule to Post`:

### Option A: Manual LinkedIn MCP Command
In AGY session:
```
Read D:/ShivamGem/SynaSystems/agency-brain/linkedin/drafts/2026-06-22.md
Extract the FULL POST DRAFT section.
Post it to LinkedIn using the LinkedIn MCP tool at the scheduled time.
```

### Option B: Scheduled AGY Post Agent Prompt
```
SYSTEM ROLE: You are the LinkedIn Post Execution Agent for Syna Systems.

TASK:
1. Read the draft file: D:/ShivamGem/SynaSystems/agency-brain/linkedin/drafts/[TODAY].md
2. Check the Status field — only proceed if status is "APPROVED" or "EDITED"
3. Extract the FULL POST DRAFT section (everything between the --- markers)
4. Post to LinkedIn using the LinkedIn MCP tool
5. After successful post:
   - Update the draft file Status to: POSTED — [timestamp]
   - Log to watchdog_log.csv with status=POSTED

If status is not APPROVED/EDITED, do NOT post. Report back and wait for human instruction.
```

### LinkedIn MCP Tool Reference
The LinkedIn MCP is available in the AGY environment. Key operations:
- **Create post:** `linkedin.createPost({ text: "...", visibility: "PUBLIC" })`
- **Schedule post:** Check if LinkedIn MCP supports scheduling; otherwise use LinkedIn's native scheduling after MCP-assisted draft
- **Check analytics:** `linkedin.getPostAnalytics({ postId: "..." })` — use for tracking engagement

---

## STEP 5: INTEGRATION WITH watchdog.py

Add to `D:/ShivamGem/SynaSystems/scripts/watchdog.py` (or create if not exists):

```python
import subprocess
from datetime import date

def run_linkedin_drafter():
    """Run LinkedIn draft generator. Only runs on posting days."""
    today = date.today()
    # Only Mon (0), Wed (2), Fri (4)
    if today.weekday() not in [0, 2, 4]:
        return {"status": "SKIPPED", "reason": "Not a posting day"}
    
    result = subprocess.run(
        ["python", "D:/ShivamGem/SynaSystems/scripts/linkedin_draft.py"],
        capture_output=True,
        text=True
    )
    return {
        "status": "OK" if result.returncode == 0 else "ERROR",
        "output": result.stdout,
        "error": result.stderr,
    }
```

---

## ENGAGEMENT FOLLOW-UP (Post-Publish Checklist)

Within 60 minutes of posting:
1. **Reply to every early comment** — boosts algorithmic reach significantly
2. **Add relevant link in first comment** (e.g., Syna Systems website or pilot page)
3. **Engage on 3 peer posts** in the same hashtag space (comment-first strategy)
4. **DM everyone who likes within 2 hours** — warm lead signal

Weekly analytics review:
- Check impressions, engagement rate, profile visits per post
- Update `agency-brain/linkedin/analytics_log.md` (create if tracking manually)
- Identify top-performing post type → double down next cycle

---

## QUICK REFERENCE: SERIES PARAMETERS

| Parameter | Value |
|-----------|-------|
| Series Start | 2026-06-22 (Monday) |
| Posting Days | Mon / Wed / Fri |
| Posting Time | 7:00–8:00 PM IST |
| Draft Generation | 6:00 PM IST (1hr before) |
| Review Window | 6:00–7:00 PM IST |
| Post Execution | 7:00 PM IST (Mon/Fri) / 8:00 PM IST (Wed) |
| Log File | agency-brain/operations/watchdog_log.csv |

---

*Maintained by: Syna Systems LinkedIn Automation Pipeline*
