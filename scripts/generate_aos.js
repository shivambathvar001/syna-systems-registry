const fs = require('fs');
const path = require('path');

const brainDir = path.join(__dirname, '..', 'agency-brain');

const dirs = [
  '00_foundation',
  '01_brand',
  '02_strategy',
  '03_services',
  '04_sales',
  '05_marketing',
  '06_website',
  '07_delivery',
  '08_agents',
  '09_operations',
  '10_templates',
  '11_research',
  '12_assets'
];

// Create dirs
dirs.forEach(d => {
  const dirPath = path.join(brainDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${d}`);
  }
});

const docs = {
  '00_foundation/FOUNDATION.md': `# Syna Systems Foundation
- **Who are we?**
  - Next-generation partner for enterprise operational AI infrastructure.
- **Core Philosophy:**
  - Architect robust, stateful agentic workflows.
  - Eliminate manual human bottlenecks in high-friction systems.
  - Focus on deterministic, safe execution.`,

  '00_foundation/MISSION.md': `# Syna Systems Mission
- **What do we solve?**
  - We eliminate manual administrative bottlenecks in enterprise healthcare operations.
  - Specialize in Healthcare Revenue Cycle Management (RCM).
  - Target 300% to 600% ROI via automated denial management and clinical documentation tools.`,

  '00_foundation/VISION.md': `# Syna Systems Vision
- **Where are we going?**
  - Becoming the primary infrastructure provider for secure, observable agentic workflows in enterprise.
  - Scaled from simple bots to resilient enterprise orchestrators.
  - Human-governed, glass-box operational control.`,

  '00_foundation/LONG_TERM_STRATEGY.md': `# Long Term Strategy
- **Strategic Direction:**
  - Build specialized agent runtimes for strict security environments (HIPAA/SOC-2).
  - Mirror all registry code to secure, private instances.
  - Package operational workflows as reusable templates.`,

  '00_foundation/IDENTITY.md': `# Corporate Identity
- **DNA Ethos:**
  - We do not sell "AI" or "chatbots."
  - We build operational infrastructure.
  - Voice: Professional, calm, precise, engineering-driven.`,

  '00_foundation/POSITIONING.md': `# Market Positioning
- **Partner positioning:**
  - **Operational AI Infrastructure Partner.**
  - Focus exclusively on mid-market and enterprise operations.
  - Grounded in proof-driven verification and reliability.`,

  '00_foundation/NON_NEGOTIABLES.md': `# Non-Negotiables
- **Core Constraints:**
  - Zero tolerance for PII leaks.
  - Multi-layer security sandboxing for every agent node.
  - Real-time audit trails with Glass-Box transparency.`,

  '00_foundation/DECISION_PRINCIPLES.md': `# Decision Principles
- **Project Selection:**
  - 1. High manual volume with structured databases (Epic, Cerner, Athena).
  - 2. Target client has clear revenue leakage (denial logs, claim backlogs).
  - 3. Explicit alignment on security and governance boundaries.`,

  '00_foundation/GLOSSARY.md': `# Technical Glossary
- **Supervisor-Worker:** Centralized orchestrator decomposing requests to specialized workers.
- **MCP (Model Context Protocol):** Secure interface standard for tools and resources.
- **RCM (Revenue Cycle Management):** Financial processes in healthcare.`,

  '00_foundation/DECISION_LOG.md': `# Agency Decision Log
- **2026-06-20:** Selected Healthcare Revenue Cycle Management (RCM) as the primary focus niche.
- **2026-06-25:** Adopted Next.js and TypeScript for the developer portal and visual interface.
- **2026-06-28:** Rebuilt Agency Operating System to v2.0 folder hierarchy.`,

  '01_brand/BRAND_GUIDE.md': `# Brand Guide
- **Core Principle:** Professional engineering clarity.
- **Aesthetic:** Minimalist, high contrast, documentation-like presentation.`,

  '01_brand/VOICE_AND_TONE.md': `# Voice and Tone
- **Guidelines:**
  - Calm, direct, authoritative.
  - Avoid marketing buzzwords ("revolutionary", "magic", "disrupt").
  - Focus on metrics, architecture, and security.`,

  '01_brand/VISUAL_LANGUAGE.md': `# Visual Language
- **Ethos:** Dark theme, crisp vector assets, structured grids.
- **Layouts:** Clean typography, generous spacing, visible borders.`,

  '01_brand/COLOR_SYSTEM.md': `# Color System Tokens
- **Background:** Slate 950 (\`#020617\`)
- **Primary Text:** Slate 200 (\`#e2e8f0\`)
- **Accent:** Cyan 400 (\`#22d3ee\`) and Indigo 500 (\`#6366f1\`)`,

  '01_brand/TYPOGRAPHY.md': `# Typography Scale
- **Headings:** Outfit or Inter, high tracking, black weight.
- **Body:** Inter, regular weight, 1.5 line height.
- **Code:** JetBrains Mono for system metrics.`,

  '01_brand/DESIGN_SYSTEM.md': `# Design System Spec
- **Spacing Scale:** 4px grid.
- **Borders:** 1px slate-800 border for panels.
- **Shadows:** Subtle cyan/indigo glows (\`0_0_20px_rgba(34,211,238,0.1)\`).`,

  '01_brand/MOTION_GUIDELINES.md': `# Motion Guidelines
- **Transitions:** Ease-in-out, 200ms duration.
- **States:** Subtle hover scale (1.02), fade-in on render.`,

  '02_strategy/ICP.md': `# Ideal Customer Profile (ICP)
- **Target Persona:** VP of Revenue Cycle, Denial Management Directors.
- **Target Platform:** Epic, Cerner, Athena health shops.
- **Core Signal:** Hiring for Appeals Specialists / RCM managers.`,

  '02_strategy/MARKET_POSITION.md': `# Market Positioning Framework
- **Moat:** Real-time compliance screening + custom appeal generation nodes.
- **Why we win:** Pre-built EHR integration maps and 14-day speed.`,

  '02_strategy/SERVICES.md': `# Services Catalog
- **1. Denial Resolution Engine:** Autonomous post-denial appeal writer.
- **2. Clinical Documentation Automation:** Epic/Cerner note structure assistant.`,

  '02_strategy/PRICING.md': `# Pricing Logic
- **Retainer:** Flat monthly infrastructure fee ($8k - $15k).
- **ROI Share:** 5-10% of recovered cash from appeal pipelines.`,

  '02_strategy/ENGAGEMENT_MODELS.md': `# Engagement Models
- **1. 14-Day Velocity Pilot:** Zero-risk evaluation on historical data.
- **2. Retainer SLA:** Continuous operations with guaranteed uptime.`,

  '02_strategy/PARTNER_STRATEGY.md': `# Partner Strategy
- **Channels:** RCM consulting firms, Epic App Orchard developers.
- **Integrations:** Standard HL7/FHIR interfaces.`,

  '02_strategy/CLIENT_JOURNEY.md': `# Client Journey Map
- **Stage 1:** Secure Audit (Review denial logs).
- **Stage 2:** Velocity Pilot (14-day build).
- **Stage 3:** Retrospective & retaining transition.`,

  '03_services/SERVICES_SPEC.md': `# Technical Services Spec
- **Denial Engine:** Extracts denial codes, checks payer policy, pulls patient file, drafts appeals.
- **CDI Engine:** Scans clinical notes for documentation gaps before claim submission.`,

  '03_services/PILOT_MODEL.md': `# 14-Day Velocity Pilot
- **Scope:** Connect to read-only historical database of 500 denials.
- **Outcome:** Prove >90% accuracy in draft appeals compared to humans.`,

  '04_sales/OPERATIONAL_AUDIT.md': `# Operational Audit Framework
- **Inputs:** Payer denial reports, FTE counts, average appeal turnaround times.
- **Outputs:** ROI estimate showing monthly leakage vs recovery potential.`,

  '04_sales/DISCOVERY.md': `# Discovery Playbook
- **Questions:**
  - What EHR version are you running?
  - What is your current write-off threshold?
  - How many appeals does an FTE draft per day?`,

  '04_sales/QUALIFICATION.md': `# Sales Qualification
- **Criteria:**
  - Mid-market+ health system.
  - Clear hiring activity for RCM personnel.
  - Uses modern EHR system with API access.`,

  '04_sales/PROPOSALS.md': `# Proposal Template Rules
- **Requirements:** Include exact flow diagrams, data flow boundaries, and projected ROI timeline.`,

  '04_sales/OBJECTION_HANDLING.md': `# Objection Handling
- **Security:** Agents run in isolated, compliant sandboxes (HIPAA compliance).
- **EHR Write access:** We start read-only; human reviews and copies to EHR.`,

  '04_sales/CONTRACTS.md': `# Legal Contract Rules
- **Templates:** Use NDA, MSA, BAA, SOW templates strictly without modification.`,

  '04_sales/FOLLOW_UPS.md': `# Follow Up Cadence
- **Sequence:** Day 1: Audit report, Day 3: Custom demo deck, Day 7: Retainer outline.`,

  '05_marketing/BLOG_BLUEPRINT.md': `# Blog Blueprint
- **Content Style:** Deep-dive technical whitepapers.
- **Cadence:** Bi-weekly publication.`,

  '05_marketing/LINKEDIN_SYSTEM.md': `# LinkedIn Strategy
- **Approach:** Post technical findings, workflow walkthroughs, and RCM case studies.`,

  '05_marketing/NEWSLETTER_SYSTEM.md': `# Newsletter System
- **Core Topic:** Operational AI in Healthcare. Focused on denial metrics.`,

  '05_marketing/WHITEPAPER_SYSTEM.md': `# Whitepaper Strategy
- **Focus:** Technical specs on data pipeline security and agent orchestration.`,

  '05_marketing/CASE_STUDY_SYSTEM.md': `# Case Study System
- **Structure:** Context, Bottleneck, Orchestration Stack, Verified Results.`,

  '06_website/WEBSITE_SPEC.md': `# Website Specification
- **Engine:** Next.js App Router, TypeScript, Tailwind.
- **Concept:** Minimialist technical product documentation site.
- **Theme:** Slate/Cyan dark mode.`,

  '06_website/SITE_MAP.md': `# Site Map
- **Routes:**
  - \`/\` - Minimalist overview
  - \`/docs\` - Document viewer for AOS
  - \`/pilot\` - ROI assessment calculator`,

  '06_website/COPY_GUIDE.md': `# Copy Guide
- **Rules:** No hype, no buzzwords. State parameters, architecture, and security protocols.`,

  '06_website/SEO_GUIDE.md': `# SEO Guide
- **Target Keywords:** "Healthcare RCM automation", "Secure agent pipeline", "Model Context Protocol".`,

  '06_website/AI_SEO_GUIDE.md': `# AI SEO (LLM Optimization)
- **Rules:** Clear semantic markup, structured JSON-LD schemas for LLM crawlers.`,

  '06_website/COMPONENT_LIBRARY.md': `# Component Library
- **Components:** NavHeader, Custom Sidebar, MarkdownDocViewer, ROI Calculator.`,

  '07_delivery/DELIVERY.md': `# Delivery Operations
- **Process:** Provision isolated container, map API endpoints, run dry-run, enable client dashboard.`,

  '07_delivery/ONBOARDING.md': `# Client Onboarding Checklist
- **Items:** Establish secure VPN, retrieve API keys, complete HIPAA BAA signing.`,

  '08_agents/AGENT_ARCH.md': `# Multi-Agent Pipeline Architecture
- **Supervisor Node:** Orchestrates tasks.
- **Research Worker:** Scrapes prospect signals.
- **Audit Worker:** Compiles RCM statistics.
- **Personalizer Worker:** Customizes cold outreach copies.`,

  '08_agents/RESEARCH_AGENT.md': `# Prospect Research Agent Spec
- **Tooling:** Playwright, Google Search API.
- **Output:** Enriched JSON with organization size, EHR platforms, and RCM job listings.`,

  '08_agents/AUDIT_AGENT.md': `# Solution Audit Agent Spec
- **Tooling:** LangGraph, custom policy retreival node.
- **Output:** Denial prevention audit reports.`,

  '08_agents/OUTREACH_AGENT.md': `# Outreach Personalization Agent Spec
- **Tooling:** OpenRouter dynamic LLM call.
- **Output:** Tailored email copy in CSV.`,

  '09_operations/WATCHDOG.md': `# Watchdog System Spec
- **Cadence:** Runs every 6 hours via schedule task.
- **Task:** Validates leads count, checks Instantly campaigns, verifies Vercel status.`,

  '09_operations/SECURITY_STANDARDS.md': `# Data Security Standards
- **Standard:** TLS 1.3 in transit, AES-256 at rest, immediate token scrubbing on entry.`,

  '10_templates/NDA_TEMPLATE.md': `# Non-Disclosure Agreement (NDA) Template
- Standard corporate NDA for operational assessments.`,

  '10_templates/MSA_TEMPLATE.md': `# Master Services Agreement (MSA) Template
- Standard retainer and delivery agreement framework.`,

  '10_templates/BAA_TEMPLATE.md': `# Business Associate Agreement (BAA) Template
- HIPAA BAA contract template for medical data processing.`,

  '10_templates/SOW_TEMPLATE.md': `# Statement of Work (SOW) Template
- Scope template for 14-day velocity pilot and retainers.`,

  '11_research/HEALTHCARE_RCM_BENCHMARKS.md': `# Healthcare RCM Industry Benchmarks
- **Average Denial Rate:** 10-12% across hospitals.
- **Appeal Success Rate:** ~40% for manual processes.
- **Target with Syna:** >85% appeal success rate.`,

  '12_assets/ASSETS.md': `# Static Branding Assets
- SVG definitions and links to UI graphics.`,
};

// Write missing files or overwrite basic templates
Object.entries(docs).forEach(([relPath, content]) => {
  const filePath = path.join(brainDir, relPath);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Generated file: ${relPath}`);
  } else {
    console.log(`File already exists, skipping: ${relPath}`);
  }
});

// Helper to copy files
function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    const data = fs.readFileSync(src);
    fs.writeFileSync(dest, data);
    console.log(`Copied: ${src} -> ${dest}`);
  }
}

// Copy existing template files if they exist to the new templates directory
const legalSrc = path.join(brainDir, 'operations', 'legal');
const templatesDest = path.join(brainDir, '10_templates');

copyIfExists(path.join(legalSrc, 'nda_template.md'), path.join(templatesDest, 'NDA_TEMPLATE.md'));
copyIfExists(path.join(legalSrc, 'msa_template.md'), path.join(templatesDest, 'MSA_TEMPLATE.md'));
copyIfExists(path.join(legalSrc, 'baa_template.md'), path.join(templatesDest, 'BAA_TEMPLATE.md'));
copyIfExists(path.join(legalSrc, 'sow_template.md'), path.join(templatesDest, 'SOW_TEMPLATE.md'));

// Copy some sales files
copyIfExists(path.join(brainDir, 'operations', '14_day_delivery_framework.md'), path.join(brainDir, '03_services', 'PILOT_MODEL.md'));
copyIfExists(path.join(brainDir, 'operations', 'ICP_FRAMEWORK.md'), path.join(brainDir, '02_strategy', 'ICP.md'));
copyIfExists(path.join(brainDir, 'operations', 'services.md'), path.join(brainDir, '02_strategy', 'SERVICES.md'));
copyIfExists(path.join(brainDir, 'operations', 'audit_framework.md'), path.join(brainDir, '04_sales', 'OPERATIONAL_AUDIT.md'));
copyIfExists(path.join(brainDir, 'operations', 'onboarding.md'), path.join(brainDir, '07_delivery', 'ONBOARDING.md'));
copyIfExists(path.join(brainDir, 'sales', 'outreach_playbook.md'), path.join(brainDir, '04_sales', 'OUTREACH_PLAYBOOK.md'));
copyIfExists(path.join(brainDir, 'sales', 'outreach_status.md'), path.join(brainDir, '04_sales', 'OUTREACH_STATUS.md'));
copyIfExists(path.join(brainDir, 'sales', 'healthcare_rcm_outreach.md'), path.join(brainDir, '04_sales', 'HEALTHCARE_RCM_OUTREACH.md'));

// Write main README.md for AOS v2.0
const mainReadme = `# Agency Operating System (AOS) v2.0
## Syna Systems Operational AI Infrastructure Registry

This repository serves as the single, immutable source of truth for all human developers, contractors, and autonomous AI agents operating within the agency.

Every document in this system is structured to answer exactly **one** operational, technical, or strategic question with zero duplication, overlap, or contradiction.

---

## Directory Map

### 00_foundation — The DNA
* [FOUNDATION.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/FOUNDATION.md) — Who are we?
* [MISSION.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/MISSION.md) — What do we solve?
* [VISION.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/VISION.md) — Where are we going?
* [LONG_TERM_STRATEGY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/LONG_TERM_STRATEGY.md) — Scaled operating model.
* [IDENTITY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/IDENTITY.md) — Core corporate identity rules.
* [POSITIONING.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/POSITIONING.md) — Strategic market positioning.
* [NON_NEGOTIABLES.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/NON_NEGOTIABLES.md) — Technical & legal standards.
* [DECISION_PRINCIPLES.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/DECISION_PRINCIPLES.md) — Selection frameworks.
* [GLOSSARY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/GLOSSARY.md) — Domain vocabulary definitions.
* [DECISION_LOG.md](file:///D:/ShivamGem/SynaSystems/agency-brain/00_foundation/DECISION_LOG.md) — History of tactical pivots.

### 01_brand — Brand System
* [BRAND_GUIDE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/BRAND_GUIDE.md) — Core branding specs.
* [VOICE_AND_TONE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/VOICE_AND_TONE.md) — Written tone guide.
* [VISUAL_LANGUAGE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/VISUAL_LANGUAGE.md) — Creative direction.
* [COLOR_SYSTEM.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/COLOR_SYSTEM.md) — HEX/HSL tokens.
* [TYPOGRAPHY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/TYPOGRAPHY.md) — Font and sizes rules.
* [DESIGN_SYSTEM.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/DESIGN_SYSTEM.md) — Padding, margins, border systems.
* [MOTION_GUIDELINES.md](file:///D:/ShivamGem/SynaSystems/agency-brain/01_brand/MOTION_GUIDELINES.md) — Animation guidelines.

### 02_strategy — Business Strategy
* [ICP.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/ICP.md) — Ideal Customer Profile parameters.
* [MARKET_POSITION.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/MARKET_POSITION.md) — Strategic differentiation.
* [SERVICES.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/SERVICES.md) — Retainers and engagement definitions.
* [PRICING.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/PRICING.md) — Pricing structures and metrics.
* [ENGAGEMENT_MODELS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/ENGAGEMENT_MODELS.md) — Contract types.
* [PARTNER_STRATEGY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/PARTNER_STRATEGY.md) — Dynamic partner networks.
* [CLIENT_JOURNEY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/02_strategy/CLIENT_JOURNEY.md) — Customer path mapping.

### 03_services — Capabilities
* [SERVICES_SPEC.md](file:///D:/ShivamGem/SynaSystems/agency-brain/03_services/SERVICES_SPEC.md) — Systems architecture specifications.
* [PILOT_MODEL.md](file:///D:/ShivamGem/SynaSystems/agency-brain/03_services/PILOT_MODEL.md) — Velocity Pilot specifications.

### 04_sales — Sales System
* [OPERATIONAL_AUDIT.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/OPERATIONAL_AUDIT.md) — Technical audit formats.
* [DISCOVERY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/DISCOVERY.md) — Discovery call scripts.
* [QUALIFICATION.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/QUALIFICATION.md) — Prospect scoring rubric.
* [PROPOSALS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/PROPOSALS.md) — Structure templates.
* [OBJECTION_HANDLING.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/OBJECTION_HANDLING.md) — Critical responses.
* [CONTRACTS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/CONTRACTS.md) — Contract structuring guide.
* [FOLLOW_UPS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/04_sales/FOLLOW_UPS.md) — Post-audit nurtures.

### 05_marketing — Marketing Engine
* [BLOG_BLUEPRINT.md](file:///D:/ShivamGem/SynaSystems/agency-brain/05_marketing/BLOG_BLUEPRINT.md) — Editorial guidelines.
* [LINKEDIN_SYSTEM.md](file:///D:/ShivamGem/SynaSystems/agency-brain/05_marketing/LINKEDIN_SYSTEM.md) — LinkedIn system copy details.
* [NEWSLETTER_SYSTEM.md](file:///D:/ShivamGem/SynaSystems/agency-brain/05_marketing/NEWSLETTER_SYSTEM.md) — Format specs.
* [WHITEPAPER_SYSTEM.md](file:///D:/ShivamGem/SynaSystems/agency-brain/05_marketing/WHITEPAPER_SYSTEM.md) — Whitepaper specs.
* [CASE_STUDY_SYSTEM.md](file:///D:/ShivamGem/SynaSystems/agency-brain/05_marketing/CASE_STUDY_SYSTEM.md) — Case study guidelines.
* [CONTENT_CALENDAR.md](file:///D:/ShivamGem/SynaSystems/agency-brain/05_marketing/CONTENT_CALENDAR.md) — Dynamic calendar.

### 06_website — Website specifications
* [WEBSITE_SPEC.md](file:///D:/ShivamGem/SynaSystems/agency-brain/06_website/WEBSITE_SPEC.md) — Web specs.
* [SITE_MAP.md](file:///D:/ShivamGem/SynaSystems/agency-brain/06_website/SITE_MAP.md) — Site map definition.
* [COPY_GUIDE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/06_website/COPY_GUIDE.md) — Copy rules.
* [SEO_GUIDE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/06_website/SEO_GUIDE.md) — Technical web indexing.
* [AI_SEO_GUIDE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/06_website/AI_SEO_GUIDE.md) — LLM indexing guide.
* [COMPONENT_LIBRARY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/06_website/COMPONENT_LIBRARY.md) — UI library.

### 07_delivery — Delivery Operations
* [DELIVERY.md](file:///D:/ShivamGem/SynaSystems/agency-brain/07_delivery/DELIVERY.md) — Technical deployment gates.
* [ONBOARDING.md](file:///D:/ShivamGem/SynaSystems/agency-brain/07_delivery/ONBOARDING.md) — Client onboarding.

### 08_agents — AI Agent Specifications
* [AGENT_ARCH.md](file:///D:/ShivamGem/SynaSystems/agency-brain/08_agents/AGENT_ARCH.md) — Inter-agent messaging rules.
* [RESEARCH_AGENT.md](file:///D:/ShivamGem/SynaSystems/agency-brain/08_agents/RESEARCH_AGENT.md) — Research agent details.
* [AUDIT_AGENT.md](file:///D:/ShivamGem/SynaSystems/agency-brain/08_agents/AUDIT_AGENT.md) — Audit generator.
* [OUTREACH_AGENT.md](file:///D:/ShivamGem/SynaSystems/agency-brain/08_agents/OUTREACH_AGENT.md) — Outreach personalization agent.

### 09_operations — Operations & Security
* [WATCHDOG.md](file:///D:/ShivamGem/SynaSystems/agency-brain/09_operations/WATCHDOG.md) — Task schedule & alerting rules.
* [SECURITY_STANDARDS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/09_operations/SECURITY_STANDARDS.md) — Data boundary guidelines.

### 10_templates — Agreements & Contracts
* [NDA_TEMPLATE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/10_templates/NDA_TEMPLATE.md) — Mutual NDA.
* [MSA_TEMPLATE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/10_templates/MSA_TEMPLATE.md) — Master retainer.
* [BAA_TEMPLATE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/10_templates/BAA_TEMPLATE.md) — HIPAA Agreement.
* [SOW_TEMPLATE.md](file:///D:/ShivamGem/SynaSystems/agency-brain/10_templates/SOW_TEMPLATE.md) — Pilot statement of work.

### 11_research — Market Intelligence
* [HEALTHCARE_RCM_BENCHMARKS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/11_research/HEALTHCARE_RCM_BENCHMARKS.md) — Target benchmarks.

### 12_assets — Branding SVGs
* [ASSETS.md](file:///D:/ShivamGem/SynaSystems/agency-brain/12_assets/ASSETS.md) — Asset registry list.
`;

fs.writeFileSync(path.join(brainDir, 'README.md'), mainReadme, 'utf8');
console.log('Generated main README.md for AOS v2.0');
