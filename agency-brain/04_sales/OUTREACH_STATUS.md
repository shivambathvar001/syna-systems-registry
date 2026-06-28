# Syna Systems Outreach Log - Campaigns & Status

## Active Campaigns

### 1. Healthcare RCM (Denial Prevention)
- **Target ICP:** Mid-market healthcare groups and hospitals scaling RCM teams.
- **Trigger Signal:** Hiring for Denial Management, Appeals, or Clinical Documentation Improvement.
- **Lead Source:** LinkedIn Jobs scraped via `lead_gen.py`.
- **Total Leads:** 41 (Populated in `healthcare_leads.csv`).
- **Template Sequence:** [healthcare_rcm_outreach.md](file:///D:/ShivamGem/SynaSystems/agency-brain/sales/healthcare_rcm_outreach.md)
- **Variable Mapping Verification:**
  - `{{company}}` -> CSV Column: `Organization`
  - `{{firstName}}` -> To be enriched via Apollo (Targeting VP/Director of Revenue Cycle).
  - `{{Signal_Role}}` -> CSV Column: `Signal_Role`
  - `{{Primary_EHR_Placeholder}}` -> CSV Column: `Primary_EHR_Placeholder`
- **Status:** **[PIPELINE READY]** (Test lead generated successfully, ready for bulk run of all 64 target prospects).

---

## Historical Phase 3 Outreach Logs

| Company | Sector | Signal | Assessment Sent | Status |
| :--- | :--- | :--- | :--- | :--- |
| ScaleRecruit | Recruitment | Hiring Ops Coord | 2026-06-14 | [DISPATCHED] |
| LogicLogistics | Logistics | Hiring Process Analyst | 2026-06-14 | [DISPATCHED] |
| FinEdge SaaS | B2B SaaS | Scaling SDR Team | 2026-06-14 | [DISPATCHED] |
| GlobalTalent | Recruitment | Admin Assistant Hiring | [TBD] | [IDLE] |
| ShipRight | Logistics | Ops Manager Hiring | [TBD] | [IDLE] |
| Mile Bluff Medical Center | Healthcare RCM | Denial Specialist | 2026-06-28 | [AGENT_GENERATED] |
| Syna Systems | Operational AI | AOS v2.0 Setup | 2026-06-28 | [ACTIVE] |
