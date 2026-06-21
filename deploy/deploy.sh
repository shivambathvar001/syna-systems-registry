#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Syna Systems Watchdog · Cloud Run Deployment Script
# =============================================================================
# Idempotent: safe to re-run. Each gcloud command uses --quiet and checks
# for existing resources before creating them (create-or-update pattern).
#
# Prerequisites:
#   - gcloud CLI authenticated:  gcloud auth login && gcloud auth configure-docker
#   - Docker daemon running
#   - Billing account ready to link
#   - Run from the repo root: bash deploy/deploy.sh
# =============================================================================

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_ID="syna-systems-moat"
REGION="asia-south1"
IMAGE_NAME="syna-watchdog"
JOB_NAME="syna-watchdog"
SCHEDULER_JOB="syna-watchdog-trigger"
BILLING_ACCOUNT="${BILLING_ACCOUNT:-}"   # Set via env: export BILLING_ACCOUNT=XXXXXX-XXXXXX-XXXXXX

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }
log_section() { echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${GREEN} $*${NC}"; echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

# ── Preflight ─────────────────────────────────────────────────────────────────
log_section "Preflight checks"

command -v gcloud >/dev/null 2>&1 || { log_error "gcloud CLI not found. Install from https://cloud.google.com/sdk"; exit 1; }
command -v docker  >/dev/null 2>&1 || { log_error "Docker not found. Install Docker Desktop."; exit 1; }

log_info "gcloud version: $(gcloud version --format='value(Google Cloud SDK)' 2>/dev/null | head -1)"
log_info "Docker version: $(docker --version)"

# Resolve project number (needed for Cloud Run Jobs API URL)
set_project_context() {
  gcloud config set project "${PROJECT_ID}" --quiet
  PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)" 2>/dev/null || echo "")
  log_info "Project: ${PROJECT_ID} (number: ${PROJECT_NUMBER})"
}

# =============================================================================
# STEP 1 — Create GCP Project
# =============================================================================
log_section "Step 1/4 — Create GCP Project"

if gcloud projects describe "${PROJECT_ID}" --quiet 2>/dev/null; then
  log_warn "Project '${PROJECT_ID}' already exists — skipping creation"
else
  gcloud projects create "${PROJECT_ID}" \
    --name="Syna Systems Moat" \
    --labels=team=syna-systems,env=production \
    --quiet
  log_info "Project '${PROJECT_ID}' created ✓"
fi

set_project_context

# Link billing account (required for Cloud Run + Cloud Build)
if [[ -n "${BILLING_ACCOUNT}" ]]; then
  gcloud beta billing projects link "${PROJECT_ID}" \
    --billing-account="${BILLING_ACCOUNT}" \
    --quiet 2>/dev/null || log_warn "Billing already linked or requires manual setup"
  log_info "Billing linked ✓"
else
  log_warn "BILLING_ACCOUNT not set. If project needs billing, run:"
  log_warn "  export BILLING_ACCOUNT=XXXXXX-XXXXXX-XXXXXX && bash deploy/deploy.sh"
fi

# Enable required APIs
log_info "Enabling required APIs (this may take ~60s first time)..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  cloudscheduler.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  --quiet

log_info "APIs enabled ✓"

# Configure Docker to authenticate to GCR
gcloud auth configure-docker --quiet
log_info "Docker→GCR auth configured ✓"

# =============================================================================
# STEP 2 — Build & Push Docker Image (Cloud Build)
# =============================================================================
log_section "Step 2/4 — Build & Push Docker Image via Cloud Build"

IMAGE_URI="gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest"

# Cloud Build runs the build remotely — no local Docker resources consumed.
# Submits from repo root so Dockerfile COPY paths (scripts/, agency-brain/) resolve.
gcloud builds submit . \
  --tag="${IMAGE_URI}" \
  --project="${PROJECT_ID}" \
  --gcs-log-dir="gs://${PROJECT_ID}_cloudbuild/logs" \
  --suppress-logs \
  --quiet

log_info "Image pushed: ${IMAGE_URI} ✓"

# =============================================================================
# STEP 3 — Create / Update Cloud Run Job
# =============================================================================
log_section "Step 3/4 — Create / Update Cloud Run Job"

# Check if job already exists
if gcloud run jobs describe "${JOB_NAME}" \
    --region="${REGION}" --project="${PROJECT_ID}" --quiet 2>/dev/null; then
  log_warn "Job '${JOB_NAME}' exists — updating image and config"
  gcloud run jobs update "${JOB_NAME}" \
    --image="${IMAGE_URI}" \
    --region="${REGION}" \
    --project="${PROJECT_ID}" \
    --memory=512Mi \
    --cpu=1 \
    --max-retries=3 \
    --task-timeout=600 \
    --quiet
  log_info "Cloud Run Job updated ✓"
else
  # Create job from scratch
  # Note: --set-env-vars is for non-sensitive config only.
  # Replace REPLACE_WITH_* values with real values or use --set-secrets.
  gcloud run jobs create "${JOB_NAME}" \
    --image="${IMAGE_URI}" \
    --region="${REGION}" \
    --project="${PROJECT_ID}" \
    --memory=512Mi \
    --cpu=1 \
    --max-retries=3 \
    --task-timeout=600 \
    --set-env-vars="STALE_DAYS=7,LEADS_CSV_PATH=/app/agency-brain/clients/healthcare_leads.csv,PYTHONUNBUFFERED=1" \
    --quiet
    # ── To add secrets (recommended for production) ──────────────────────────
    # First create the secrets:
    #   gcloud secrets create slack-webhook-url --replication-policy=automatic
    #   echo -n "https://hooks.slack.com/..." | gcloud secrets versions add slack-webhook-url --data-file=-
    #
    # Then mount them:
    #   --set-secrets="SLACK_WEBHOOK_URL=slack-webhook-url:latest,INSTANTLY_API_KEY=instantly-api-key:latest"

  log_info "Cloud Run Job '${JOB_NAME}' created ✓"
fi

# =============================================================================
# STEP 4 — Create / Update Cloud Scheduler Job
# =============================================================================
log_section "Step 4/4 — Create / Update Cloud Scheduler"

# Re-resolve project number (may be freshly available now)
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
JOB_RUN_URI="https://${REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${PROJECT_NUMBER}/jobs/${JOB_NAME}:run"

# Create / replace Cloud Scheduler job
# --schedule: 30 3 * * 1-5 → 09:00 IST (UTC+5:30) Monday–Friday
if gcloud scheduler jobs describe "${SCHEDULER_JOB}" \
    --location="${REGION}" --project="${PROJECT_ID}" --quiet 2>/dev/null; then
  log_warn "Scheduler job '${SCHEDULER_JOB}' exists — deleting and recreating"
  gcloud scheduler jobs delete "${SCHEDULER_JOB}" \
    --location="${REGION}" \
    --project="${PROJECT_ID}" \
    --quiet
fi

gcloud scheduler jobs create http "${SCHEDULER_JOB}" \
  --location="${REGION}" \
  --project="${PROJECT_ID}" \
  --schedule="30 3 * * 1-5" \
  --time-zone="Asia/Kolkata" \
  --uri="${JOB_RUN_URI}" \
  --message-body="{}" \
  --http-method=POST \
  --headers="Content-Type=application/json" \
  --oidc-service-account-email="$(gcloud iam service-accounts list --filter='displayName:Compute Engine' --format='value(email)' --project="${PROJECT_ID}" | head -1)" \
  --oidc-token-audience="${JOB_RUN_URI}" \
  --attempt-deadline=180s \
  --quiet

log_info "Cloud Scheduler job '${SCHEDULER_JOB}' created ✓"

# =============================================================================
# Done!
# =============================================================================
log_section "✅ Deployment Complete!"
echo ""
echo "  GCP Project : ${PROJECT_ID}"
echo "  Region      : ${REGION}"
echo "  Image       : ${IMAGE_URI}"
echo "  CR Job      : ${JOB_NAME}"
echo "  Schedule    : Mon–Fri 09:00 IST (30 3 * * 1-5 UTC)"
echo ""
echo "  ── Useful commands ──────────────────────────────────────────"
echo "  Trigger now : gcloud run jobs execute ${JOB_NAME} --region=${REGION} --project=${PROJECT_ID}"
echo "  View logs   : gcloud run jobs executions list --job=${JOB_NAME} --region=${REGION} --project=${PROJECT_ID}"
echo "  Cost        : https://console.cloud.google.com/billing"
echo ""
