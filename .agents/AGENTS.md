# Syna Systems — Agent Rules (auto-injected every session)

## 1. Session Boot (MANDATORY — run before any other action)
Read memory files first. No exceptions.
- `D:/ShivamGem/SynaSystems/agency-brain/current-state.md` — active ops, next steps
- `D:/ShivamGem/SynaSystems/agency-brain/outreach_status.md` — campaign state, lead counts

Do NOT write any code, edit any file, or call any API until both files are read.

## 2. Prose Format
Write all summaries, logs, and notes in caveman mode:
- Short sentences. No fluff.
- Bullet points > paragraphs.
- Status tags: `[ACTIVE]` `[PAUSED]` `[DONE]` `[BLOCKED]`
- Never write paragraphs of prose. Dense bullets only.

## 3. API Key Security (NEVER violate)
- Never log API keys to any file
- Never print API keys in terminal output
- Never include API keys in git commits
- Keys live in environment only: `INSTANTLY_API_KEY`, `APOLLO_API_KEY`, `OPENAI_API_KEY`
- If key not found in env — stop and ask user. Never hardcode.

## 4. Action Logging (MANDATORY)
Every significant action MUST be logged to `agency-brain/watchdog_log.csv`.

### watchdog_log.csv schema:
```
timestamp, agent_id, action_type, description, status, output_file
```

### Log immediately after:
- Lead gen run completed → `action_type: lead_gen`
- Outreach sync completed → `action_type: outreach_sync`
- File edited → `action_type: file_edit`
- API call made → `action_type: api_call`
- Error encountered → `action_type: error`

### Example log entry:
```
2026-06-20T14:30:00Z, antigravity-agent, lead_gen, Scraped 41 leads from LinkedIn/Indeed, DONE, healthcare_leads.csv
```

## 5. RCM Focus (strategic reminder)
Syna Systems = Operational AI Infrastructure Partner.
Active niche = Healthcare Revenue Cycle Management (RCM).
Target personas = VP/Director of Revenue Cycle, Denial Management Leads.
Target platforms = Epic, Cerner, Athena shops.
Pitch = 300-600% ROI via denial management + clinical documentation automation.

Do NOT drift into non-RCM work without explicit user instruction.

## 6. Session End Protocol
Before ending session:
1. Update `agency-brain/current-state.md` — add achievements, refresh Next Steps
2. Append to `agency-brain/outreach_status.md` — add today's date entry
3. Append any new actions to `agency-brain/watchdog_log.csv`
4. Confirm all edits committed if on tracked branch

## 7. Skills Available
- `syna-lead-gen` — run Playwright scraper for RCM leads
- `syna-outreach-sync` — push enriched leads to Instantly.ai
- `syna-state-update` — update agency-brain files

---

## 8. PROOF-DRIVEN VERIFICATION MANDATE (CRITICAL — NO EXCEPTIONS)

> ⚠️ ZERO HALLUCINATION POLICY. Every claim requires verifiable evidence.

### Anti-Hallucination Rules
- exit code 0 ≠ success. Always read full stdout/stderr. Look for hidden errors.
- "It should work" = invalid. Only runtime output is evidence.
- Never report partial work as complete.
- Never skip verification steps to report success.
- If env/sandbox blocks verification → state it explicitly. Never assume.

### Verification Protocol (by task type)

**API / Outreach calls (Instantly, Apollo):**
1. Show raw HTTP response: status code + full payload.
2. Verify expected data fields are present in response.
3. Check API rate limits or error fields in response body.

**Lead generation runs:**
1. Show exact scraped count: `N leads found`.
2. Show sample rows from output CSV (first 3 rows minimum).
3. Verify no duplicate records in output.

**Deployments / web services:**
1. Pull raw deployment logs. Paste output.
2. HTTP GET the deployed URL. Assert `status == 200`. Show HTML snippet.
3. Any non-200 → report FAILURE immediately.

**Code edits:**
1. Run linter/type-check. Show exact stdout/stderr.
2. Run tests. Show: `X passed, Y failed, Z skipped`.
3. If tests skipped → note it explicitly.

**File edits (agency-brain files):**
1. Read back modified file. Confirm changes persisted.
2. Append action to `watchdog_log.csv`. Show log entry.

### Mandatory Proof of Work Block (EVERY concluding response)
```
### Proof of Work
- **Verification Commands Run**: <exact commands>
- **Evidence Output**: <raw logs / API response / CSV sample / screenshot path>
- **Result**: [SUCCESS/FAILURE — verified by evidence, not assumption]
```
No Proof of Work block = task NOT complete. No exceptions. No skipping.
