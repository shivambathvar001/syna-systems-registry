# AI Agent System Specifications

## 1. Prospect Research Agent
- **Purpose:** Scan job boards and LinkedIn to locate mid-market hospitals with RCM bottlenecks.
- **Responsibilities:** Identify EHR platforms (Epic, Cerner, Athena) and score leads.
- **Inputs:** Raw job listing queries and company domains.
- **Outputs:** Scored lead profiles saved to `healthcare_leads.csv`.
- **Memory & Storage:** Local CSV lead ledger.
- **Allowed Tools:** Playwright crawler node, search APIs.
- **Escalation Rules:** Skip lead and flag if organization is a non-healthcare sector.

## 2. Solution Audit Agent
- **Purpose:** Retrieve clinical documentation guidelines and draft appeal letter frameworks.
- **Responsibilities:** Extract denied codes and match them with Medicare policy indexes.
- **Inputs:** Payer denial letters and patient EHR records.
- **Outputs:** Diagnostic audit report showing appeal strategies.
- **Prompt Directive:** "Match the exact denial code against CMS National Coverage Determinations. Extract clinical evidence."
- **Failure Modes & Mitigation:**
  - Mismatch of payer policy: Fall back to general policy guidelines and flag draft for human compliance check.
