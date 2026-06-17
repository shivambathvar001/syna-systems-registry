# Syna Systems: Healthcare RCM Lead Generation Sprint

## Goal
Identify and qualify 50 High-Value Hospital Systems and Large Medical Groups struggling with first-pass denial rates.

## Strategy: Signal-Based Prospecting
1. **Signal 1: The "Denial Specialist" Hire**
   - Search LinkedIn Jobs/Indeed for "Denial Management Specialist," "Billing Appeals Coordinator," or "RCM Recovery Analyst."
   - **Rationale:** If they are hiring these roles, they are fighting manual fires.

2. **Signal 2: EHR Complexity (Epic/Cerner/Athena)**
   - Target organizations mentioning these EHRs in job descriptions or tech stack signatures.
   - **Rationale:** These systems are powerful but often create documentation bottlenecks that lead to denials.

3. **Signal 3: Expansion & Mergers**
   - News alerts for Medical Group acquisitions.
   - **Rationale:** Mergers create billing chaos and a need for unified, automated infrastructure.

## Data to Extract
- **Organization Name:** (e.g., "NorthStar Medical Group")
- **Estimated Headcount:** (Target 100+ MDs)
- **Primary EHR:** (If detectable)
- **Hiring Intent:** (Yes/No - Specific roles found)
- **Point of Contact:** Director of Revenue Cycle, VP of Finance, or CTO.

## Implementation (Phase 1)
- Update `scripts/lead_gen.py` to scrape LinkedIn Jobs for specific RCM keywords.
- Save results to `SynaSystems/agency-brain/clients/healthcare_leads.csv`.
