# Statement of Work (SOW)
**SOW ID:** SOW-2026-[XXXX]  
**Project Name:** Post-Denial Resolution Engine Pilot  
**Master Agreement Date:** [Insert MSA Date]  

This Statement of Work ("SOW") is issued pursuant to the Master Services Agreement ("MSA") between **Airwalk AI LLC** ("Airwalk") and **[Client Name]** ("Client").

---

## 1. Project Objective & Scope
The objective is to integrate, configure, and validate the Airwalk Post-Denial Resolution Engine (the "Engine") within Client’s EHR environment to automate clinical evidence synthesis and appeal drafting for commercial claims denials.

### In-Scope Work:
* API diagnostics and read-only connection to EHR sandbox endpoints (`/ClaimResponse`, `/DiagnosticReport`).
* Custom setup of the LangGraph node graph mapping top 3 regional commercial payer medical necessity guidelines.
* Zero-trust security gateway proxy deployment for PII/PHI scrubbing.
* Provisioning of the Human-in-the-Loop (HITL) review dashboard interface.

### Out-of-Scope Work:
* Writing or modifying claims data directly in the production EHR system.
* Direct claim appeals submissions to payers without clinical coder review.

---

## 2. Deliverables & Milestones

| Milestone | Deliverable | Target Timeline | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **M1: Setup** | API Diagnostics Report | Day 3 | Verification of read-only EHR sandbox authentication |
| **M2: Deployment** | LangGraph Node Map | Day 7 | Completed configuration of Payer Rule nodes |
| **M3: Validation** | Gateways & PHI Audit | Day 11 | Successful scrubbing of 100 mock transaction logs |
| **M4: Handoff** | Production Release | Day 14 | Verification of HITL queue status and SLA triggers |

---

## 3. Financial Terms & Pricing
* **Pilot Setup Fee:** $[X,XXX] one-time setup fee, due 50% upon SOW execution and 50% upon Live Production Handover.
* **Performance License:** [XX]% of successfully recovered patient revenue generated from appeals drafted by the Engine during the active trial period.
* **Invoicing:** Monthly invoices net 30 terms.

---

## 4. Key Assumptions & Dependencies
* Client will provide API sandbox credentials and developer access within forty-eight (48) hours of SOW execution.
* Client will allocate a primary billing contact for weekly 30-minute review sessions.

---

**IN WITNESS WHEREOF**, the Parties have executed this Statement of Work.

**For Client:**
Name: ______________________
Title: ______________________
Date: ______________________

**For Airwalk AI LLC:**
Name: ______________________
Title: Principal Architect
Date: ______________________
