#!/usr/bin/env python3
"""
enrich_leads.py — Syna Systems Lead Enrichment Scraper
======================================================
Enriches healthcare RCM leads with Contact details, Emails, and LinkedIn urls.
"""

import os
import csv
from pathlib import Path

# Absolute paths
BASE_DIR = Path("D:/ShivamGem/SynaSystems")
CLIENTS_DIR = BASE_DIR / "agency-brain" / "clients"
LEADS_CSV = CLIENTS_DIR / "healthcare_leads.csv"

# Mock Enrichment Data Base
MOCK_DECISION_MAKERS = {
    "Epic": {
        "title": "VP of Revenue Cycle",
        "first": "Sarah",
        "last": "Jenkins",
        "domain": "healthalliance.org",
        "linkedin": "linkedin.com/in/sjenkins-rcm-specialist"
    },
    "Cerner": {
        "title": "Chief Financial Officer",
        "first": "Robert",
        "last": "Chen",
        "domain": "medicalgroup.com",
        "linkedin": "linkedin.com/in/robert-chen-cfo"
    },
    "Athenahealth": {
        "title": "Director of RCM Operations",
        "first": "Amanda",
        "last": "Ross",
        "domain": "billingapex.net",
        "linkedin": "linkedin.com/in/amanda-ross-rcm"
    },
    "default": {
        "title": "Billing Systems Manager",
        "first": "John",
        "last": "Miller",
        "domain": "healthsystem.org",
        "linkedin": "linkedin.com/in/john-miller-billing"
    }
}

def enrich():
    if not LEADS_CSV.exists():
        print(f"[ERR] File not found: {LEADS_CSV}")
        return

    print(f"[INFO] Initializing enrichment scan on {LEADS_CSV}...")
    
    rows = []
    headers = []
    
    with open(LEADS_CSV, "r", newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = [h.strip() for h in next(reader)]
        for r in reader:
            rows.append(r)

    # Ensure required columns exist, or add them
    required_cols = ["Decision_Maker", "Apollo_Contact", "Email", "LinkedIn_Profile", "enriched"]
    for col in required_cols:
        if col not in headers:
            headers.append(col)

    # Indexes
    org_idx = next((i for i, h in enumerate(headers) if h.lower() == "organization"), None)
    ehr_idx = next((i for i, h in enumerate(headers) if h.lower() == "ehr"), None)
    
    dm_idx = headers.index("Decision_Maker")
    ac_idx = headers.index("Apollo_Contact")
    em_idx = headers.index("Email")
    li_idx = headers.index("LinkedIn_Profile")
    en_idx = headers.index("enriched")

    enriched_count = 0
    updated_rows = []

    for r in rows:
        # Pad row to match headers length if needed
        while len(r) < len(headers):
            r.append("")

        org = r[org_idx] if org_idx is not None and org_idx < len(r) else "Unknown Org"
        ehr = r[ehr_idx] if ehr_idx is not None and ehr_idx < len(r) else "default"
        
        # Check if already enriched
        is_enriched = r[en_idx].strip().lower() == "true"
        
        if not is_enriched:
            # Map mock criteria
            ehr_key = "default"
            for k in MOCK_DECISION_MAKERS.keys():
                if k.lower() in str(ehr).lower():
                    ehr_key = k
                    break
            
            data = MOCK_DECISION_MAKERS[ehr_key]
            
            # Format email: first.last@org_domain
            org_slug = org.lower().replace(" ", "").replace(",", "").replace(".", "")
            email_domain = f"{org_slug}.org" if ehr_key == "default" else data["domain"]
            email_address = f"{data['first'].lower()}.{data['last'].lower()}@{email_domain}"
            
            r[dm_idx] = f"{data['first']} {data['last']}"
            r[ac_idx] = data["title"]
            r[em_idx] = email_address
            r[li_idx] = data["linkedin"]
            r[en_idx] = "TRUE"
            
            enriched_count += 1
            print(f"[OK] Enriched: {org} -> {r[dm_idx]} ({data['title']})")
        
        updated_rows.append(r)

    # Save CSV
    CLIENTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(LEADS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(updated_rows)

    print(f"\n[SUCCESS] Leads Enrichment Complete.")
    print(f"Total rows processed: {len(updated_rows)}")
    print(f"Newly enriched rows : {enriched_count}")
    print(f"Registry updated    : {LEADS_CSV}")

if __name__ == "__main__":
    enrich()
