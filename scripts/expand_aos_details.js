const fs = require('fs');
const path = require('path');

const brainDir = path.join(__dirname, '..', 'agency-brain');

const updates = {
  '01_brand/DESIGN_SYSTEM.md': `# Syna Systems Design System Spec

## Spacing Scale
- 4px grid base.
- \`p-1\`: 4px | \`p-2\`: 8px | \`p-3\`: 12px | \`p-4\`: 16px | \`p-6\`: 24px | \`p-8\`: 32px | \`p-12\`: 48px | \`p-16\`: 64px.
- Horizontal layout grids use standard 24px (\`gap-6\`) or 32px (\`gap-8\`) spacing.

## Border Radius
- Reusable components utilize uniform rounded layouts.
- Cards: \`rounded-3xl (24px)\` for landing cards | \`rounded-2xl (16px)\` for content containers.
- Inputs / Buttons: \`rounded-xl (12px)\` for form elements and action buttons.
- Badges / Tags: \`rounded-full (9999px)\` for status pills.

## Shadows & Gradients
- Panel Borders: \`border border-slate-900\` with clean backdrop blur.
- Ambient Shadow: \`shadow-[0_4px_30px_rgba(0,0,0,0.4)]\`.
- Cyan Glow: \`shadow-[0_0_20px_rgba(34,211,238,0.08)]\` (used on active elements).
- Gradients:
  - Slate Gradient: \`from-slate-950 to-slate-900\` (primary background canvas).
  - Indigo-Cyan Brand Glow: \`from-indigo-500/10 to-cyan-500/10\` border styling.

## Micro-Animations
- Transition Speeds: Standard transition duration is \`200ms\` with \`cubic-bezier(0.4, 0, 0.2, 1)\` curves.
- Hovers: Subtle button scales \`hover:scale-[1.02]\` with border color transition.
- Scroll Fade: Scroll-driven render shifts use Framer Motion \`initial={{ opacity: 0 }}\` with \`animate={{ opacity: 1 }}\`.

## Dark Mode & Accessibility
- Canvas background must resolve to \`#020617\` (Slate-950) with \`#030712\` (Slate-980) panel cards.
- WCAG AA Contrast: Main text must use \`#e2e8f0\` (Slate-200) ensuring >4.5:1 ratio against backgrounds.
- Focus Indicators: All interactive controls must define a clear \`focus-visible:ring-2 focus-visible:ring-cyan-500\` outline.
`,

  '02_strategy/SERVICES.md': `# Syna Systems Service Catalog & Mechanics

## 1. Denial Resolution Engine
- **Purpose:** Automate post-denial appeal letter generation and clinical evidence matching.
- **Outcome:** Reduces manual claim appeal drafting time by 90% and recovers denied revenue pipelines.
- **Deliverables:**
  - Secure integration agent node deployed inside client private cloud environment.
  - Custom appeal drafting dashboard with human-in-the-loop review interface.
  - Weekly analytical reports indicating success rates sorted by payer.
- **Exclusions:** Does not directly submit claims to insurance clearinghouses (human reviews drafts first).
- **Pricing Logic:** $10,000 monthly infrastructure license fee plus 5% of recovered claim revenue.
- **Risks & Mitigation:**
  - Risk: Alteration of payer portal layouts breaking automated extraction.
  - Mitigation: Weekly automated test scripts checking portal DOM nodes and parsing logs.

## 2. Clinical Documentation Improvement (CDI) Automation
- **Purpose:** Audit electronic health record (EHR) notes for documentation gaps prior to billing.
- **Outcome:** Lowers first-pass denial rates to less than 2% by correcting coding mismatch signals.
- **Deliverables:**
  - Real-time Epic/Cerner note auditor agent node using custom LLM check routines.
  - Physician-facing warning alert panels embedded in the EHR context.
- **Exclusions:** Does not auto-sign or finalize medical records; final edits remain physician's responsibility.
- **Pricing Logic:** $8,000 monthly flat subscription fee per 50 clinical FTEs.
- **Risks & Mitigation:**
  - Risk: Physician alert fatigue leading to clinical friction.
  - Mitigation: Custom threshold configurations restricting alerts to high-value validation mismatches.
`,

  '06_website/WEBSITE_SPEC.md': `# website Specifications & Technical Architecture

## Technical Stack & Versions
- **Framework:** Next.js v14.2.3 (App Router model, React Server Components enabled).
- **Language:** TypeScript v5 (Strict type checking, zero any types allowed).
- **Styling:** Tailwind CSS v3.4.3 + custom HSL color system variables.
- **Component Primitives:** Custom headless layouts styled to mimic shadcn/ui clean aesthetics.
- **Animations:** Framer Motion (only imported inside client components).
- **Metadata Management:** Built-in Next.js metadata system (SEO tags, JSON-LD schemas).
- **Validation Engine:** Zod for type-safe form and payload validation.

## Page Specifications & Layouts
- **Home (\`/\`):** Developer documentation portal displaying AOS v2.0 files.
  - Purpose: Exhibit operational discipline, transparent architectures, and developer resources.
  - Target Persona: VP of Revenue Cycle, Chief Information Security Officer (CISO).
  - Business Goal: Build technical authority and showcase systems engineering quality.
  - Primary CTA: Open ROI assessment tool sidebar.
  - Page Hierarchy: Header -> Sidebar Nav + MD Render Panel -> Custom ROI drawer.

## SEO, Crawlers, and AI Indexing
- **SEO Rules:** High-quality metadata schemas containing description, keywords, OpenGraph images.
- **AI-SEO Integration:** Provide static \`sitemap.xml\` and \`robots.txt\` specifying MDX sources. Include clean, unstructured paragraph definitions to enable accurate semantic parsing by Perplexity, Gemini, and SearchGPT.
- **caching:** ISR (Incremental Static Regeneration) caching strategy with 1-hour revalidation intervals.
`,

  '05_marketing/BLOG_BLUEPRINT.md': `# Blog Blueprint & Content Engine

## Content Pillars
- **1. AI Safety & Sandbox Security:** Deep dives into isolated VPC deployments and HIPAA data sanitization.
- **2. RCM Economics:** Practical analysis of billing leakages, appeal success rates, and clearinghouse integrations.
- **3. Stateful Orchestration:** Explanations of supervisor-worker pipelines and deterministic execution layers.

## Editorial & Writing Style
- **Tone:** Professional, calm, engineering-focused documentation quality. No marketing hype.
- **Rules:** Every article must explain a specific workflow, state metrics, and show raw log/code fragments.
- **Internal Linking:** Every blog post must contain at least 2 links to technical AOS documents.

## Repurposing & Distribution Pipeline
- **LinkedIn System:** Reformat technical blogs into concise post templates.
- **Update Cadence:** Publish 1 deep-dive technical article every 2 weeks.
- **Conversion Loop:** Place secondary CTAs in the footer prompting technical readers to review our GitHub registries.
`,

  '08_agents/AGENT_ARCH.md': `# AI Agent System Specifications

## 1. Prospect Research Agent
- **Purpose:** Scan job boards and LinkedIn to locate mid-market hospitals with RCM bottlenecks.
- **Responsibilities:** Identify EHR platforms (Epic, Cerner, Athena) and score leads.
- **Inputs:** Raw job listing queries and company domains.
- **Outputs:** Scored lead profiles saved to \`healthcare_leads.csv\`.
- **Memory & Storage:** Local CSV lead ledger.
- **Allowed Tools:** Playwright crawler node, search APIs.
- **Escalation Rules:** Skip lead and flag if organization is a non-healthcare sector.

## 2. Solution Audit Agent
- **Purpose:** Retrieve clinical documentation guidelines and draft appeal letter frameworks.
- **Responsibilities:** Extract denied codes and match them with Medicare policy indexes.
- **Inputs:** Payer denial letters and patient EHR records.
- **Outputs:** Diagnostic audit report showing appeal strategies.
- **Prompt Directive:** "Match the exact denial code against CMS National Coverage Determinations. Extract clinical evidence."
- **Failure Modes & Mitigation:**
  - Mismatch of payer policy: Fall back to general policy guidelines and flag draft for human compliance check.
`
};

Object.entries(updates).forEach(([relPath, content]) => {
  const filePath = path.join(brainDir, relPath);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Expanded AOS file contents: ${relPath}`);
});
console.log('Finished updating AOS details successfully.');
