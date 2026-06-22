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

---

## 9. AGENT HARDENING v2 — MOAT RULES (Syna-Specific)

### Claim Tribunal (before every ✅ Done)
1. What exact command/API call proved this worked? Show HTTP status + payload.
2. What was the raw output? Paste it.
3. What does failure look like (empty CSV, 4xx, 0 leads)? Did I check?
If any answer is "I assumed" → do NOT report success. Investigate.

### Hidden Error Scanner
After every API call / Playwright run / file write — scan for:
`error`, `failed`, `0 results`, `rate_limit`, `unauthorized`, `4xx`, `5xx`, `undefined`.
Zero leads found ≠ success. Check for silent scraper failure.

### Prove Me Wrong Protocol
Before declaring done: "What evidence proves this is still broken?" Find it first.

### Confidence Labeling: `[VERIFIED]` | `[INFERRED]` | `[ASSUMED]`

### Destructive Gate (require explicit "approve")
`DELETE FROM leads` / `TRUNCATE` / production Instantly campaign launch / `rm -rf`.

### Git Branch Safety
`cmd /c git branch --show-current` before every push. Main → STOP. Ask user.

### Secret Exposure Gate
Before any file write or commit:
`cmd /c powershell -ExecutionPolicy Bypass -File D:\ShivamGem\Atlas2.0\scripts\secret_scanner.ps1 -ScanGitStaged`
Keys: `INSTANTLY_API_KEY`, `APOLLO_API_KEY`, `OPENAI_API_KEY` — never in files.

### Failure Recovery Ladder
L1→Retry | L2→Read error | L3→Check env/API key | L4→Isolate | L5→Report with full log.
Never jump to L5 without L1–L4.

### Dependency Health Check (session boot)
`cmd /c powershell -ExecutionPolicy Bypass -File D:\ShivamGem\Atlas2.0\scripts\dep_health_check.ps1 -Project syna`

### Auto-Rollback Awareness
Before overwriting leads CSV or agency-brain files:
`cmd /c powershell -ExecutionPolicy Bypass -File D:\ShivamGem\Atlas2.0\scripts\rollback_manager.ps1 -Action backup -Target <file>`

### Pattern Blacklist Check (boot)
Read: `D:/ShivamGem/project-brain/pattern-blacklist.md` before proposing solutions.

### Proven Commands Check
Read: `D:/ShivamGem/project-brain/proven-commands.md` before running any API call or scraper.
Add successes back after verified.

### Session Retrospective (session end)
Write: `D:/ShivamGem/project-brain/retrospectives/YYYY-MM-DD-syna.md`
Failures → pattern-blacklist.md | Successes → proven-commands.md.

### Context Contamination Guard
At every new task: "Context cleared." Re-read current-state.md + outreach_status.md. Never assume.

### Ambiguity Refusal
2+ interpretations → STOP. Ask: "(A) X or (B) Y?" Never assume.

### Scope Creep Lock
Out-of-scope file needed → STOP. Re-present plan. Get approval.

### CI Green Gate (before task close)
Check: `agency-brain/watchdog_log.csv` last entry shows DONE not ERROR.
If ERROR → fix before closing.

### Token Efficiency Audit (every 5 tool calls)
"Am I reading files I don't need?" Self-correct. Grep > full read.
