# Syna Systems Watchdog — Cloud Run Deployment

> **24/7 serverless moat.** This package deploys the Syna Systems watchdog to Google Cloud Run so it runs automatically every weekday at 9 AM IST — even when your laptop is off.

---

## Architecture

```
Cloud Scheduler  ──(OIDC POST)──►  Cloud Run Job  ──►  Watchdog Python Script
(9 AM IST M-F)                     (asia-south1)         • Lead freshness audit
                                                          • Pipeline digest
                                                          • Slack notification
```

---

## Prerequisites

| Requirement | Version | Check |
|---|---|---|
| [gcloud CLI](https://cloud.google.com/sdk/docs/install) | ≥ 450.0.0 | `gcloud version` |
| Docker Desktop | ≥ 24.x | `docker --version` |
| Python (local testing only) | 3.11+ | `python --version` |
| GCP Billing Account | — | [console.cloud.google.com/billing](https://console.cloud.google.com/billing) |

**gcloud auth setup (one-time):**
```bash
gcloud auth login
gcloud auth application-default login
gcloud auth configure-docker
```

---

## One-Command Deploy

From the repository root (`D:/ShivamGem/SynaSystems/`):

```bash
# Set your billing account ID (find it at console.cloud.google.com/billing)
export BILLING_ACCOUNT="XXXXXX-XXXXXX-XXXXXX"

# Run the deploy script
bash deploy/deploy.sh
```

The script is **idempotent** — safe to re-run. It will update existing resources rather than fail on conflicts.

> ⚠️ **Before running:** Set your real `SLACK_WEBHOOK_URL` in the Cloud Run Job environment variables (or via Secret Manager — see below).

---

## Configuration: Setting Secrets (Recommended)

Instead of plain-text env vars, use Secret Manager for sensitive keys:

```bash
# 1. Create the secrets
echo -n "https://hooks.slack.com/services/T.../B.../..." | \
  gcloud secrets create slack-webhook-url --data-file=- --project=syna-systems-moat

echo -n "your-instantly-api-key" | \
  gcloud secrets create instantly-api-key --data-file=- --project=syna-systems-moat

echo -n "your-apollo-api-key" | \
  gcloud secrets create apollo-api-key --data-file=- --project=syna-systems-moat

# 2. Grant the job's service account access
gcloud secrets add-iam-policy-binding slack-webhook-url \
  --member="serviceAccount:$(gcloud iam service-accounts list --filter='displayName:Compute Engine' --format='value(email)' --project=syna-systems-moat | head -1)" \
  --role="roles/secretmanager.secretAccessor" \
  --project=syna-systems-moat

# 3. Update the job to use secrets
gcloud run jobs update syna-watchdog \
  --set-secrets="SLACK_WEBHOOK_URL=slack-webhook-url:latest,INSTANTLY_API_KEY=instantly-api-key:latest,APOLLO_API_KEY=apollo-api-key:latest" \
  --region=asia-south1 \
  --project=syna-systems-moat
```

---

## How to Trigger Manually

```bash
# Trigger immediately (one-shot execution)
gcloud run jobs execute syna-watchdog \
  --region=asia-south1 \
  --project=syna-systems-moat

# Watch execution status
gcloud run jobs executions list \
  --job=syna-watchdog \
  --region=asia-south1 \
  --project=syna-systems-moat
```

---

## How to Check Logs

### Option A: Cloud Console (easiest)
1. Go to [Cloud Run → Jobs](https://console.cloud.google.com/run/jobs?project=syna-systems-moat)
2. Click **syna-watchdog** → **Executions** tab
3. Click any execution → **Logs** tab

### Option B: gcloud CLI
```bash
# List recent executions
gcloud run jobs executions list \
  --job=syna-watchdog \
  --region=asia-south1 \
  --project=syna-systems-moat \
  --format="table(name, completionTime, status.conditions[0].type)"

# Stream logs for the latest execution
gcloud logging read \
  'resource.type="cloud_run_job" AND resource.labels.job_name="syna-watchdog"' \
  --project=syna-systems-moat \
  --limit=50 \
  --format="value(timestamp, textPayload)" \
  --freshness=1h
```

### Option C: Cloud Logging (full observability)
Go to [Logs Explorer](https://console.cloud.google.com/logs?project=syna-systems-moat) and filter:
```
resource.type="cloud_run_job"
resource.labels.job_name="syna-watchdog"
```

---

## Schedule Reference

| Field | Value | Meaning |
|---|---|---|
| Cron | `30 3 * * 1-5` | 03:30 UTC = 09:00 IST |
| Timezone | `Asia/Kolkata` | IST (UTC+5:30) |
| Days | `1-5` | Monday through Friday |
| Trigger | Cloud Scheduler → Cloud Run Jobs API | OIDC-authenticated HTTP POST |

To change the schedule:
```bash
gcloud scheduler jobs update http syna-watchdog-trigger \
  --schedule="0 4 * * 1-5" \
  --location=asia-south1 \
  --project=syna-systems-moat
```

---

## Cost Estimate

| Service | Usage | Cost |
|---|---|---|
| Cloud Run Jobs | ~22 executions/month × 10min × 512Mi | **~$0** (free tier covers 180,000 vCPU-seconds/mo) |
| Cloud Build | ~1 build/month | **~$0** (120 free build-minutes/day) |
| Cloud Scheduler | 1 job | **~$0** (3 free jobs/month) |
| Container Registry | ~200 MB image | **~$0.03/mo** (GCS storage) |
| Secret Manager | 3 secrets | **~$0** (<6 active versions free) |
| **Total** | | **~$0 – $0.05 / month** |

> 💡 All services used fall within GCP's **Always Free tier** at this scale. Enable [budget alerts](https://console.cloud.google.com/billing/budgets) at $1/month as a safety net.

---

## Files in This Package

```
deploy/
├── Dockerfile              # Container definition (python:3.11-slim)
├── .dockerignore           # Build context exclusions (secrets, .git, etc.)
├── cloudrun_job.yaml       # Cloud Run Job spec reference
├── cloud_scheduler.yaml    # Cloud Scheduler config reference
├── deploy.sh               # Idempotent end-to-end deploy script
└── README.md               # This file

scripts/
├── watchdog.py             # Main entrypoint (runs inside container)
└── requirements_watchdog.txt  # Python dependencies
```

---

## Updating the Watchdog

After editing `watchdog.py` or `requirements_watchdog.txt`:

```bash
# Rebuild and redeploy (idempotent)
bash deploy/deploy.sh
```

The script rebuilds the image via Cloud Build and updates the existing job in-place.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `PERMISSION_DENIED` on Cloud Build | Enable billing account and run `gcloud auth application-default login` |
| Job exits with code `1` | Check env vars — `SLACK_WEBHOOK_URL` is missing |
| Job exits with code `2` | Slack webhook is invalid — verify the URL |
| Scheduler not firing | Check timezone — ensure IST offset hasn't drifted (DST-free zone) |
| Image not found | Re-run `deploy.sh` to rebuild; check `gcloud builds list --project=syna-systems-moat` |
