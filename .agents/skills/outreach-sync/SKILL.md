---
name: syna-outreach-sync
description: Sync enriched leads to Instantly.ai and validate email campaign status
---

# Syna Outreach Sync Skill

## Purpose
Load enriched leads from CSV → validate → push to Instantly.ai campaign → confirm sync status. Part of the 3-step cold email sequence for Healthcare RCM decision-makers.

## Pre-Conditions (check before running)
- [ ] `healthcare_leads.csv` exists and has enriched contacts (name + email populated)
- [ ] Instantly.ai API key set in env: `INSTANTLY_API_KEY`
- [ ] Target campaign ID known (get from Instantly.ai dashboard)
- [ ] Leads scored HIGH or MEDIUM only — do NOT sync LOW score leads

## Step-by-Step Sequence

### Step 1 — Read and validate CSV
```bash
cd D:/ShivamGem/SynaSystems
python -c "
import pandas as pd
df = pd.read_csv('healthcare_leads.csv')
print(f'Total: {len(df)}')
print(f'Ready (email not null): {df[df.email.notna()].shape[0]}')
print(df[['company_name','email','score']].head(10))
"
```
Only proceed if email column is populated. Missing emails = enrichment not done yet.

### Step 2 — Filter to sync-ready leads
```python
df_sync = df[(df['email'].notna()) & (df['score'].isin(['HIGH', 'MEDIUM']))]
```

### Step 3 — Push to Instantly.ai
```bash
python scripts/sync_instantly.py --csv healthcare_leads.csv --campaign-id <CAMPAIGN_ID>
```

Script reads `INSTANTLY_API_KEY` from environment. Pass campaign ID from Instantly.ai dashboard.

### Step 4 — Validate sync status
After running, check sync confirmation:
```bash
python scripts/sync_instantly.py --status --campaign-id <CAMPAIGN_ID>
```

Expected output fields:
```
campaign_id | leads_added | leads_existing | errors | status
```

### Step 5 — Log result
Append to `agency-brain/outreach_status.md`:
```
## <date>
- Synced: <N> leads to campaign <ID>
- Errors: <count>
- Campaign status: [Active/Paused/Scheduled]
```

## Which CSV to Read
Primary: `D:/ShivamGem/SynaSystems/healthcare_leads.csv`
Reference mapping: `D:/ShivamGem/SynaSystems/agency-brain/healthcare_rcm_outreach.md`

## Checking Campaign Status in Instantly.ai Dashboard
1. Login → Campaigns → select campaign by ID
2. Check: Sent / Opened / Replied / Bounced counts
3. Target benchmarks: Open rate > 30%, Reply rate > 5%
4. If bounced > 10%: pause campaign, re-validate email list

## Error Handling
| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Bad API key | Re-export key from Instantly.ai settings |
| `Campaign not found` | Wrong campaign ID | Copy exact ID from dashboard URL |
| `Lead already exists` | Duplicate email | Script deduplicates — safe to ignore |
| `Rate limit 429` | Too many requests | Add `--batch-size 50 --delay 2` flags |
| `Email invalid` | Bad email format | Re-run Apollo enrichment on those rows |

## NEVER
- Sync LOW score leads to active campaigns
- Expose `INSTANTLY_API_KEY` in logs or commits
- Push contacts without `email` populated
