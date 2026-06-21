# AGY `/schedule` Config — SynaSystems Watchdog

> **Purpose:** Register the watchdog.py daily run using AGY's built-in `/schedule` slash command.
> This is the *in-session* complement to the Windows Task Scheduler (which is the production mechanism).
> Use AGY `/schedule` for ad-hoc runs, testing, or when Windows Task Scheduler is unavailable.

---

## 1. Cron Expression

| Field       | Value | Meaning                  |
|-------------|-------|--------------------------|
| Minute      | `30`  | 30 minutes past the hour |
| Hour        | `3`   | 03:00 UTC                |
| Day (month) | `*`   | Every day of the month   |
| Month       | `*`   | Every month              |
| Day (week)  | `1-5` | Monday–Friday only       |

```
CronExpression: 30 3 * * 1-5
```

> **IST Conversion:** UTC+05:30 → `09:00 IST = 03:30 UTC`  
> The cron fires at **03:30 UTC**, which equals **09:00 AM IST** (Monday–Friday).

---

## 2. Exact `/schedule` Invocation

Type the following directly in the AGY TUI chat:

```
/schedule
```

When the scheduler modal opens, fill in:

| Field              | Value                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------|
| **CronExpression** | `30 3 * * 1-5`                                                                          |
| **Prompt**         | `Run the SynaSystems watchdog: execute D:/ShivamGem/SynaSystems/scripts/watchdog.py, check agency-brain health, log pipeline status, and report results.` |
| **MaxIterations**  | *(leave blank for unlimited, or set e.g. `20` for a ~4-week trial)*                    |

---

## 3. Prompt Text (Copy-Paste Ready)

```
Run the SynaSystems watchdog: execute D:/ShivamGem/SynaSystems/scripts/watchdog.py, check agency-brain health, log pipeline status, and report results.
```

---

## 4. AGY-Specific Settings & Notes

### 4.1 Session Persistence
- AGY `/schedule` crons are **session-bound** by default.  
- The cron **stops when the AGY TUI session closes**.
- For persistent, system-level scheduling, use the Windows Task Scheduler (`install_schedule.ps1`) instead.

### 4.2 MaxIterations
- If you want the cron to auto-stop after N runs, set `MaxIterations`.
- Example: `MaxIterations=5` → runs 5 weekday mornings, then stops.
- Leave blank for indefinite (production default).

### 4.3 Workspace Context
- Make sure AGY is opened in the `D:/ShivamGem/SynaSystems` workspace when scheduling.
- The agent executing the cron will have access to the workspace files.

### 4.4 Combining with Windows Task Scheduler
| Mechanism               | Persistent? | Needs AGY open? | Best For              |
|-------------------------|-------------|------------------|-----------------------|
| Windows Task Scheduler  | ✅ Yes      | ❌ No            | Production / Always-on |
| AGY `/schedule` cron    | ❌ No       | ✅ Yes           | Dev / Testing / Ad-hoc |
| GitHub Actions          | ✅ Yes      | ❌ No            | CI/CD fallback / Cloud |

### 4.5 One-Shot Timer Variant
To run watchdog.py once at a specific offset (e.g., in 30 minutes):

```
/schedule
DurationSeconds: 1800
Prompt: Run the SynaSystems watchdog: execute D:/ShivamGem/SynaSystems/scripts/watchdog.py and report results.
TimerCondition: never
```

---

## 5. Verifying the Cron Is Running

After issuing `/schedule`, AGY will confirm the cron task ID.  
You can check active schedules with:

```
/schedule list
```

Or ask the agent:

```
What scheduled tasks are currently active?
```

---

## 6. Cancelling the Cron

Use the task ID returned when the cron was created:

```
manage_task: kill <task-id>
```

Or ask the agent:

```
Cancel the SynaSystems watchdog cron.
```

---

*Last updated: 2026-06-20 | Maintained by: Syna Systems Automation*
