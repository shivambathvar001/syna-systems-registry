import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import os
import datetime
import random

# Core signal definitions for dynamic qualification
EHR_KEYWORDS = {
    "Epic": ["epic", "epicsystems"],
    "Cerner": ["cerner", "oracle cerner"],
    "eClinicalWorks": ["eclinicalworks", "ecw"],
    "Athenahealth": ["athenahealth", "athena"],
    "NextGen": ["nextgen", "next gen"],
    "MEDITECH": ["meditech"],
    "Allscripts": ["allscripts", "veradigm"],
    "Centricity": ["centricity", "ge centricity"],
    "CareCloud": ["carecloud"],
    "AdvancedMD": ["advancedmd"]
}

DENIAL_KEYWORDS = [
    "denial", "denials", "appeal", "appeals", "medical necessity", 
    "prior auth", "prior authorization", "underpayment", "write-off", 
    "clearinghouse", "claim rejection", "accounts receivable", "ar resolution"
]

async def scrape_job_description(page, url):
    """
    Navigates to the standalone job URL and extracts the description.
    """
    try:
        # Navigate with normal user behavior simulation
        await page.goto(url, wait_until="domcontentloaded", timeout=15000)
        await page.wait_for_timeout(random.randint(1500, 3000))
        
        # Check standard public LinkedIn job description selectors
        selectors = [
            ".show-more-less-html__markup",
            ".description__text",
            ".jobs-description__content",
            ".jobs-description",
            "section.description"
        ]
        
        for sel in selectors:
            elem = await page.query_selector(sel)
            if elem:
                text = await elem.inner_text()
                if text.strip():
                    return text.strip()
        return ""
    except Exception as e:
        print(f"[SYNA_WARN] Description scraping failed for {url}: {e}")
        return ""

async def scrape_linkedin_rcm_leads(keywords, locations):
    """
    Syna Systems: Enhanced High-Intent RCM Lead Scraper
    Targets organizations hiring for RCM / Denial Management.
    Enriches with EHR tech stack detection, hiring density, and qualification scoring.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use common user agent to prevent request blocking
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        all_leads = []
        
        for kw in keywords:
            for loc in locations:
                print(f"[SYNA_SCRAPE] Searching for '{kw}' in {loc}...")
                
                search_url = f"https://www.linkedin.com/jobs/search/?keywords={kw.replace(' ', '%20')}&location={loc.replace(' ', '%20')}"
                try:
                    await page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
                    await page.wait_for_timeout(random.randint(2000, 4000))
                    
                    # Extract basic job cards
                    job_cards = await page.query_selector_all(".base-card")
                    print(f"[SYNA_INFO] Found {len(job_cards)} job cards. Scraping top 10 details...")
                    
                    desc_page = await context.new_page()
                    for card in job_cards[:10]:
                        try:
                            title_elem = await card.query_selector(".base-search-card__title")
                            company_elem = await card.query_selector(".base-search-card__subtitle")
                            loc_elem = await card.query_selector(".job-search-card__location")
                            link_elem = await card.query_selector("a")
                            
                            if not (title_elem and company_elem and loc_elem and link_elem):
                                continue
                                
                            title = (await title_elem.inner_text()).strip()
                            company = (await company_elem.inner_text()).strip()
                            location = (await loc_elem.inner_text()).strip()
                            link = await link_elem.get_attribute("href")
                            
                            # Clean company name (remove common suffixes for cleaner email personalization)
                            clean_company = company.replace(", Inc.", "").replace(" Inc.", "").replace(", Inc", "").replace(" Inc", "").replace(", LLC", "").replace(" LLC", "").replace(" Corporation", "").replace(" Corp.", "").replace(" Corp", "")
                            
                            # Navigate to extract job description
                            description = await scrape_job_description(desc_page, link)
                            desc_lower = description.lower()
                            
                            # 1. EHR System Detection
                            detected_ehrs = []
                            for ehr, synonyms in EHR_KEYWORDS.items():
                                if any(syn in desc_lower for syn in synonyms):
                                    detected_ehrs.append(ehr)
                            
                            primary_ehr = ", ".join(detected_ehrs) if detected_ehrs else "Unknown EHR"
                            primary_ehr_placeholder = primary_ehr if detected_ehrs else "your current EHR"
                            
                            # 2. Denial Management Signals Detection
                            found_signals = []
                            for sig in DENIAL_KEYWORDS:
                                if sig in desc_lower:
                                    found_signals.append(sig)
                            
                            # 3. Dynamic Qualification Score
                            # HIGH: Explicit EHR + denial signals
                            # MEDIUM: Either EHR or denial signals found
                            # LOW: None of the above (generic role)
                            if detected_ehrs and found_signals:
                                score = "HIGH"
                            elif detected_ehrs or found_signals:
                                score = "MEDIUM"
                            else:
                                score = "LOW"
                                
                            all_leads.append({
                                "Organization": clean_company.strip(),
                                "Signal_Role": title,
                                "Location": location,
                                "Job_Link": link,
                                "Primary_EHR": primary_ehr,
                                "Primary_EHR_Placeholder": primary_ehr_placeholder,
                                "Denial_Signals": ", ".join(found_signals[:3]) if found_signals else "None detected",
                                "Qualification_Score": score,
                                "Detected_At": datetime.date.today().isoformat(),
                                "Status": "QUALIFIED"
                            })
                            
                        except Exception as card_err:
                            print(f"[SYNA_WARN] Error processing job card: {card_err}")
                            continue
                    await desc_page.close()
                except Exception as search_err:
                    print(f"[SYNA_WARN] Error during search for '{kw}' in {loc}: {search_err}")
                    continue
        
        if all_leads:
            # Calculate hiring density (count duplicate occurrences of the same company before dropping them)
            company_counts = {}
            for lead in all_leads:
                org = lead["Organization"]
                company_counts[org] = company_counts.get(org, 0) + 1
            
            for lead in all_leads:
                lead["Hiring_Density"] = company_counts[lead["Organization"]]
                
            df = pd.DataFrame(all_leads)
            # Remove duplicates based on company name
            df = df.drop_duplicates(subset=["Organization"])
            
            # Reorder columns for clean presentation
            cols = [
                "Organization", "Signal_Role", "Location", "Primary_EHR", 
                "Primary_EHR_Placeholder", "Hiring_Density", "Qualification_Score", 
                "Denial_Signals", "Job_Link", "Detected_At", "Status"
            ]
            df = df[cols]
            
            output_path = "D:/ShivamGem/SynaSystems/agency-brain/clients/healthcare_leads.csv"
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # If leads file already exists, load it and merge to preserve historical data
            if os.path.exists(output_path):
                try:
                    existing_df = pd.read_csv(output_path)
                    # Align columns if existing has fewer columns
                    for c in cols:
                        if c not in existing_df.columns:
                            existing_df[c] = "your current EHR" if c == "Primary_EHR_Placeholder" else (1 if c == "Hiring_Density" else ("MEDIUM" if c == "Qualification_Score" else "Unknown"))
                    
                    combined_df = pd.concat([df, existing_df]).drop_duplicates(subset=["Organization"], keep="first")
                    combined_df.to_csv(output_path, index=False)
                    print(f"[SYNA_SUCCESS] Updated lead registry. Total unique leads: {len(combined_df)}")
                except Exception as merge_err:
                    print(f"[SYNA_WARN] Could not merge with existing CSV: {merge_err}. Overwriting instead.")
                    df.to_csv(output_path, index=False)
            else:
                df.to_csv(output_path, index=False)
                print(f"[SYNA_SUCCESS] Created new lead registry with {len(df)} leads.")
        else:
            print("[SYNA_WARN] No leads found. Adjust keywords or locations.")
            
        await browser.close()

if __name__ == "__main__":
    # High-intent keywords for Denial Management and RCM
    target_keywords = [
        "Denial Management Specialist",
        "Revenue Cycle Analyst",
        "Medical Billing Appeals",
        "Clinical Documentation Improvement"
    ]
    
    # Target markets
    target_locations = ["United States", "Remote"]
    
    asyncio.run(scrape_linkedin_rcm_leads(target_keywords, target_locations))
