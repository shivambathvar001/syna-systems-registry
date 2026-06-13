# AiAA Lead Generation Script (Playwright)

## Goal
Scrape business directories or search results to find potential B2B clients who could benefit from AI automation.

## Strategy
1. **Target:** Directories like Clutch.co, G2, or Google Maps for local businesses.
2. **Signal:** Look for companies with manual-heavy processes (e.g., "fast response" not being met, lack of AI chatbot, high volume of reviews suggesting support delays).
3. **Data to Extract:** Company name, Website, Contact Email (if public), Industry, Pain Points (from reviews).

## Implementation Plan
- Use `playwright` to navigate and extract data.
- Save results to `AiAA/agency-brain/clients/leads.csv`.

*(Next Step: Write the actual python script in `AiAA/scripts/lead_gen.py`)*
