# Syna Systems Service Catalog & Mechanics

## 1. Denial Resolution Engine
- **Purpose:** Automate post-denial appeal letter generation and clinical evidence matching.
- **Outcome:** Reduces manual claim appeal drafting time by 90% and recovers denied revenue pipelines.
- **Deliverables:**
  - Secure integration agent node deployed inside client private cloud environment.
  - Custom appeal drafting dashboard with human-in-the-loop review interface.
  - Weekly analytical reports indicating success rates sorted by payer.
- **Exclusions:** Does not directly submit claims to insurance clearinghouses (human reviews drafts first).
- **Pricing Logic:** $10,000 monthly infrastructure license fee plus 5% of recovered claim revenue.
- **Risks & Mitigation:**
  - Risk: Alteration of payer portal layouts breaking automated extraction.
  - Mitigation: Weekly automated test scripts checking portal DOM nodes and parsing logs.

## 2. Clinical Documentation Improvement (CDI) Automation
- **Purpose:** Audit electronic health record (EHR) notes for documentation gaps prior to billing.
- **Outcome:** Lowers first-pass denial rates to less than 2% by correcting coding mismatch signals.
- **Deliverables:**
  - Real-time Epic/Cerner note auditor agent node using custom LLM check routines.
  - Physician-facing warning alert panels embedded in the EHR context.
- **Exclusions:** Does not auto-sign or finalize medical records; final edits remain physician's responsibility.
- **Pricing Logic:** $8,000 monthly flat subscription fee per 50 clinical FTEs.
- **Risks & Mitigation:**
  - Risk: Physician alert fatigue leading to clinical friction.
  - Mitigation: Custom threshold configurations restricting alerts to high-value validation mismatches.
