from airtable import Airtable
import pandas as pd
import os

# Syna Systems Lead Research Agent -> Airtable Sync
# This script is called by the Research Agent after identifying high-signal leads.

def sync_to_airtable(lead_data):
    AIRTABLE_API_KEY = os.environ.get("AIRTABLE_API_KEY")
    AIRTABLE_BASE_ID = os.environ.get("AIRTABLE_BASE_ID")
    
    if not AIRTABLE_API_KEY:
        print("[ERR] No Airtable API Key found.")
        return

    base = Airtable(AIRTABLE_BASE_ID, "Leads", api_key=AIRTABLE_API_KEY)
    
    for lead in lead_data:
        base.insert({
            "Company Name": lead['name'],
            "Industry": lead['industry'],
            "Signal": lead['signal'],
            "Website": lead['website'],
            "Status": "Identified",
            "Friction Score": lead.get('friction_score', 80)
        })
        print(f"[SYNC] Synced {lead['name']} to Airtable.")

if __name__ == "__main__":
    # Placeholder lead data for testing
    mock_leads = [
        {"name": "HealthcareOne", "industry": "Healthcare", "signal": "Hiring RCM Manager", "website": "https://healthcareone.example"}
    ]
    sync_to_airtable(mock_leads)
