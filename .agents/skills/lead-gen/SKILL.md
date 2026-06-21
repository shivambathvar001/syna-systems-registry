---
name: syna-lead-gen
description: Run Playwright scraper to generate and score Healthcare RCM leads, export to CSV
---

# Syna Lead Gen Skill

## Purpose
Run `scripts/lead_gen.py` to scrape, score, and export Healthcare RCM leads to CSV. Targets denial management and clinical documentation decision-makers.

## Script Location
```
D:/ShivamGem/SynaSystems/scripts/lead_gen.py
```

## How to Run

### Basic run (default output path):
```bash
cd D:/ShivamGem/SynaSystems
python scripts/lead_gen.py
```

### With explicit args:
```bash
python scripts/lead_gen.py --output healthcare_leads.csv --limit 50
```

### Common args:
| Arg | Default | Description |
|-----|---------|-------------|
| `--output` | `healthcare_leads.csv` | Output CSV filename |
| `--limit` | None | Max leads to scrape |
| `--headless` | True | Run Playwright headless |
| `--score-threshold` | MEDIUM | Only export leads >= this score |

## Scoring Logic

Scores are assigned based on EHR platform signals and RCM pain signals found in job descriptions:

| Score | Criteria | Action |
|-------|----------|--------|
| **HIGH** | 2+ EHR platforms (Epic, Cerner, Athena) + denial/RCM keyword | Prioritize for outreach immediately |
| **MEDIUM** | 1 EHR platform OR 1 RCM pain signal | Add to sequence, enrich first |
| **LOW** | Generic healthcare, no EHR/RCM signal | Skip or archive |

### EHR Platforms detected:
- Epic, Cerner, Athena, eClinicalWorks, Meditech, Allscripts

### RCM Pain Signals detected:
- denial management, prior authorization, AR recovery, claims processing, revenue cycle, coding accuracy, reimbursement, billing automation

## Output Location
```
D:/ShivamGem/SynaSystems/healthcare_leads.csv
```

### CSV Schema:
```
company_name, website, contact_name, contact_title, email, linkedin_url, ehr_platform, rcm_signals, score, source_url, scraped_at
```

## Post-Run Checklist
1. Open `healthcare_leads.csv` — verify row count > 0
2. Filter `score == HIGH` — these go to outreach first
3. Check `scraped_at` timestamp is recent
4. If 0 rows: check Playwright browser install (`playwright install chromium`)
5. Log run in `agency-brain/outreach_status.md` with date + lead count

## Error Handling
- **Playwright not installed**: Run `pip install playwright && playwright install chromium`
- **0 leads scraped**: Check if target job boards changed structure — update CSS selectors in script
- **Rate limiting**: Add `--delay 3` arg to slow scraper down
- **CSV permission error**: Close the file in Excel before re-running
