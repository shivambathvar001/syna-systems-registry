import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import os
import datetime

async def scrape_linkedin_rcm_leads(keywords, locations):
    """
    Syna Systems: High-Intent RCM Lead Scraper
    Targets organizations hiring for denial management roles.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        all_leads = []
        
        for kw in keywords:
            for loc in locations:
                print(f"[SYNA_SCRAPE] Searching for '{kw}' in {loc}...")
                
                # Construct LinkedIn Jobs URL (public search)
                search_url = f"https://www.linkedin.com/jobs/search/?keywords={kw.replace(' ', '%20')}&location={loc.replace(' ', '%20')}"
                await page.goto(search_url)
                await page.wait_for_timeout(3000) # Wait for results
                
                # Extract basic job card info
                job_cards = await page.query_selector_all(".base-card")
                
                for card in job_cards[:10]: # Limit to top 10 per query for safety
                    try:
                        title = await (await card.query_selector(".base-search-card__title")).inner_text()
                        company = await (await card.query_selector(".base-search-card__subtitle")).inner_text()
                        location = await (await card.query_selector(".job-search-card__location")).inner_text()
                        link = await (await card.query_selector("a")).get_attribute("href")
                        
                        all_leads.append({
                            "Organization": company.strip(),
                            "Signal_Role": title.strip(),
                            "Location": location.strip(),
                            "Job_Link": link,
                            "Detected_At": datetime.date.today().isoformat(),
                            "Status": "QUALIFIED"
                        })
                    except Exception as e:
                        continue
        
        if all_leads:
            df = pd.DataFrame(all_leads)
            # Remove duplicates
            df = df.drop_duplicates(subset=["Organization"])
            
            output_path = "D:/ShivamGem/SynaSystems/agency-brain/clients/healthcare_leads.csv"
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            df.to_csv(output_path, index=False)
            print(f"[SYNA_SUCCESS] Captured {len(df)} unique healthcare leads.")
        else:
            print("[SYNA_WARN] No leads found. Adjust keywords or locations.")
            
        await browser.close()

if __name__ == "__main__":
    # High-intent keywords for Denial Management
    target_keywords = [
        "Denial Management Specialist",
        "Revenue Cycle Analyst",
        "Medical Billing Appeals",
        "Clinical Documentation Improvement"
    ]
    
    # Target markets (example)
    target_locations = ["United States", "Remote"]
    
    asyncio.run(scrape_linkedin_rcm_leads(target_keywords, target_locations))
