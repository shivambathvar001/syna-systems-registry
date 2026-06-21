# ─────────────────────────────────────────────────────────────────────────────
# Syna Systems Watchdog — Dockerfile
# Base: python:3.11-slim (smallest production-grade Python image)
# Target: Google Cloud Run Job (runs to completion, not a long-lived server)
# ─────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

# ── System hardening ──────────────────────────────────────────────────────────
# Run as non-root for security best practice on Cloud Run
RUN groupadd --gid 1001 syna && \
    useradd --uid 1001 --gid syna --shell /bin/bash --create-home syna

# ── System packages ───────────────────────────────────────────────────────────
# Only install what the watchdog truly needs (no dev tools, no build compilers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ── Python dependencies ───────────────────────────────────────────────────────
WORKDIR /app

# Copy requirements first — allows Docker layer caching on unchanged deps
COPY scripts/requirements_watchdog.txt /app/requirements_watchdog.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements_watchdog.txt

# ── Application code ──────────────────────────────────────────────────────────
# Copy scripts directory (watchdog.py, lead_gen.py, etc.)
COPY scripts/ /app/scripts/

# Copy agency-brain (read-only reference data: leads CSV, brain files, etc.)
COPY agency-brain/ /app/agency-brain/

# ── Permissions ───────────────────────────────────────────────────────────────
RUN chown -R syna:syna /app
USER syna

# ── Environment defaults ──────────────────────────────────────────────────────
# These are OVERRIDDEN at runtime by Cloud Run Job env vars / Secret Manager
ENV LEADS_CSV_PATH="/app/agency-brain/clients/healthcare_leads.csv"
ENV STALE_DAYS="7"
ENV PYTHONUNBUFFERED="1"
ENV PYTHONDONTWRITEBYTECODE="1"

# ── Entrypoint ────────────────────────────────────────────────────────────────
# Cloud Run Job: runs the script to completion then exits.
# Exit code 0 = success, non-zero = failure (triggers retry per job config).
ENTRYPOINT ["python", "/app/scripts/watchdog.py"]
