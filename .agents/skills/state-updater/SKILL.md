---
name: syna-state-update
description: Update agency-brain current-state.md and outreach_status.md with latest operations summary
---

# Syna State Updater Skill

## Purpose
Keep Syna Systems brain files accurate and current after every significant operation. These files are the agent's primary memory — stale data causes wrong decisions.

## Files to Update

### Primary: `D:/ShivamGem/SynaSystems/agency-brain/current-state.md`
### Secondary: `D:/ShivamGem/SynaSystems/agency-brain/outreach_status.md`

## When to Update
- After any lead gen run (update lead counts)
- After any outreach sync (update campaign status)
- After website/registry changes (update deployment status)
- At end of every agent session (update Next Steps)
- When a blocker is resolved or created

## `current-state.md` Required Format

```markdown
# Syna Systems Agency State

## Active Operations
- **Positioning:** [current positioning statement]
- **Niche:** [active niche + ROI target]
- **Private Registry:** [status]
- **Public Registry:** [latest template live]

## Sales & Identity
- **Status:** [Production Scaling/Pilot/Research] [ACTIVE/PAUSED]
- **Deployment:** [deployment status + pipeline status]

## Technical Achievements (Current Session)
1. [Achievement 1 — be specific, include file paths]
2. [Achievement 2]
...

## Next Steps
1. [Concrete action — no vague items]
2. [Second action]
...
```

### Required Fields (MUST always be present):
- `Active Operations` section with Positioning + Niche
- `Sales & Identity` with Status tag `[ACTIVE/PAUSED]`
- `Technical Achievements` — at least 1 item from current session
- `Next Steps` — at least 2 concrete, actionable items

## `outreach_status.md` Required Format

```markdown
# Outreach Status Log

## <YYYY-MM-DD> Session
- **Leads total:** <N> in healthcare_leads.csv
- **HIGH score leads:** <N>
- **MEDIUM score leads:** <N>
- **Synced to Instantly.ai:** <N> (campaign: <ID>)
- **Campaign status:** [Active/Paused/Scheduled]
- **Open rate:** <N>% (if available)
- **Reply rate:** <N>% (if available)
- **Next enrichment target:** [specific action]
```

### Required Fields (MUST always be present):
- Date header
- Leads total count
- Score breakdown (HIGH/MEDIUM/LOW)
- Campaign status
- Next enrichment or outreach action

## Update Procedure

1. **Read current file** — do not overwrite blindly
2. **Preserve existing history** — only update/append, never delete old entries
3. **Merge achievements** — add new items to Technical Achievements list
4. **Replace Next Steps** — these should always reflect current priority
5. **Append outreach log** — new date header entry in outreach_status.md

## Caveman Format Rules
- No fluff — short, dense sentences
- Use bullet points, not paragraphs
- Use `[ACTIVE]` / `[PAUSED]` / `[DONE]` status tags
- Always include file paths when referencing outputs
- Never leave "TBD" or "TODO" without a specific owner/date
