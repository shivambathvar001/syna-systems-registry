# Syna Systems | Autonomous Lead Enrichment Template

This workflow monitors business signals (hiring, funding, news) and performs multi-source enrichment to generate high-intent sales opportunities.

## Stack
- n8n (Stateful Orchestration)
- Clay (Data Enrichment)
- Apollo (Contact Data)
- GPT-4o (Intent Synthesis)

## Deployment
1. Import `lead-enrichment.json` into your n8n instance.
2. Configure credentials for Clay and Apollo.
3. Define your target ICP in the 'Filter' node.
