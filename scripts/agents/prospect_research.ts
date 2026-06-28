/**
 * Prospect Research Agent — Syna Systems
 *
 * Reads companies from healthcare_leads.csv and generates
 * structured prospect dossiers via OpenRouter LLM.
 *
 * Usage:
 *   npx tsx prospect_research.ts                         # process all leads
 *   npx tsx prospect_research.ts --score HIGH             # HIGH-scored only
 *   npx tsx prospect_research.ts --company "Mayo"         # single company
 *   npx tsx prospect_research.ts --limit 5 --dry-run     # preview 5, no save
 *
 * SECURITY: API key via OPENROUTER_API_KEY env var. NEVER hardcoded.
 */

import { generate } from "./lib/openai_client.js";
import { loadLeads, Lead } from "./lib/csv_loader.js";
import { logAction } from "./lib/logger.js";
import { slugify, ensureDir, writeDossier, fileExists } from "./lib/file_utils.js";

// ─── CLI Argument Parsing ────────────────────────────────────────────

interface CliArgs {
  company?: string;
  score?: string;
  dryRun: boolean;
  limit?: number;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { dryRun: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--company":
        result.company = args[++i];
        break;
      case "--score":
        result.score = args[++i];
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
      case "--limit":
        result.limit = parseInt(args[++i], 10);
        if (isNaN(result.limit) || result.limit <= 0) {
          console.error("[ERROR] --limit must be a positive integer.");
          process.exit(1);
        }
        break;
      default:
        console.warn(`[WARN] Unknown argument: ${arg}`);
    }
  }

  return result;
}

// ─── System Prompt ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior healthcare market research analyst at Syna Systems, an Operational AI Infrastructure partner. Your task is to generate a comprehensive prospect research dossier for a healthcare organization.

You will receive data about a company that is currently hiring for RCM (Revenue Cycle Management) roles. Use this data as seeds and expand with your knowledge of the healthcare industry.

Generate the dossier in this EXACT format:

# Prospect Dossier: {Company Name}
## Prepared by Syna Systems Research Agent | {Date}

### 1. Company Overview
- Industry vertical, estimated size, geographic footprint
- Core services and specialties (infer from company name and location)

### 2. Technology & EHR Landscape
- Primary EHR system: {from data}
- Integration complexity and common pain points with this EHR
- Likely ancillary systems (clearinghouse, practice management)

### 3. RCM Pain Signal Analysis
- Hiring signal detected: {role they're hiring}
- Denial-related keywords found: {signals}
- Pain severity assessment: {score}
- Estimated monthly revenue impact of current denial rate

### 4. Decision-Maker Mapping
- Known contact: {from data}
- Likely RCM org chart positions
- Recommended engagement targets

### 5. Competitive & Market Intelligence
- Likely existing RCM solutions or vendors
- Recent industry pressures affecting this type of organization
- Regulatory factors (CMS changes, payer policy shifts)

### 6. Engagement Strategy
- Top 3 personalized engagement hooks
- Recommended outreach angle
- Potential objections and counter-arguments
- Suggested 14-day pilot scope

Be specific, actionable, and data-driven. This dossier feeds directly into personalized audit reports and outreach emails.`;

// ─── Sleep Utility ───────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Build User Prompt from Lead Data ────────────────────────────────

function buildUserPrompt(lead: Lead): string {
  const today = new Date().toISOString().split("T")[0];

  return `Research Date: ${today}

Company Data:
- Organization: ${lead.Organization}
- Signal Role (hiring for): ${lead.Signal_Role}
- Location: ${lead.Location}
- Primary EHR System: ${lead.Primary_EHR || lead.Primary_EHR_Placeholder || "Unknown"}
- Hiring Density: ${lead.Hiring_Density}
- Qualification Score: ${lead.Qualification_Score}
- Denial Signals: ${lead.Denial_Signals || "None detected"}
- Job Posting: ${lead.Job_Link}
- Detected At: ${lead.Detected_At}
- Current Status: ${lead.Status}
- Decision Maker: ${lead.Decision_Maker || "Unknown"}
- Apollo Contact: ${lead.Apollo_Contact || "Not enriched"}
- Email: ${lead.Email || "Not available"}
- LinkedIn Profile: ${lead.LinkedIn_Profile || "Not available"}

Generate the full prospect dossier now.`;
}

// ─── Core Processing Function ────────────────────────────────────────

/**
 * Process a single lead: generate dossier via LLM, optionally write to disk.
 *
 * @param lead    - The Lead record from CSV.
 * @param dryRun  - If true, prints output but does not save to file.
 * @returns File path of the written dossier, or null on error.
 */
export async function processLead(
  lead: Lead,
  dryRun: boolean = false
): Promise<string | null> {
  const companyName = lead.Organization;
  const slug = slugify(companyName);

  if (!companyName || companyName.trim() === "") {
    console.warn("[SKIP] Lead with empty Organization name — skipping.");
    return null;
  }

  // Skip if dossier already exists (unless dry-run)
  const dossierPath = `D:/ShivamGem/SynaSystems/agency-brain/dossiers/${slug}.md`;
  if (!dryRun && fileExists(dossierPath)) {
    console.log(`[SKIP] Dossier already exists: ${dossierPath}`);
    return dossierPath;
  }

  console.log(`[PROCESSING] ${companyName} (score: ${lead.Qualification_Score})...`);

  try {
    const userPrompt = buildUserPrompt(lead);
    const dossierContent = await generate(SYSTEM_PROMPT, userPrompt);

    if (dryRun) {
      console.log("\n" + "═".repeat(80));
      console.log(`DRY RUN — ${companyName}`);
      console.log("═".repeat(80));
      console.log(dossierContent);
      console.log("═".repeat(80) + "\n");

      await logAction(
        "prospect-agent",
        "api_call",
        `Dry-run dossier generated for ${companyName}`,
        "DONE",
        ""
      );

      return null;
    }

    // Write dossier to disk
    const filePath = writeDossier(slug, dossierContent);

    await logAction(
      "prospect-agent",
      "file_edit",
      `Dossier generated for ${companyName} (${lead.Qualification_Score})`,
      "DONE",
      filePath
    );

    return filePath;
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : String(err);
    console.error(`[ERROR] Failed to process ${companyName}: ${errorMsg}`);

    await logAction(
      "prospect-agent",
      "error",
      `Dossier generation failed for ${companyName}: ${errorMsg}`,
      "ERROR",
      ""
    );

    return null;
  }
}

// ─── Main Entry Point ────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   SYNA SYSTEMS — PROSPECT RESEARCH AGENT               ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  const cliArgs = parseArgs();

  // Load leads with filters
  const filters: { score?: string; company?: string } = {};
  if (cliArgs.score) filters.score = cliArgs.score;
  if (cliArgs.company) filters.company = cliArgs.company;

  let leads = await loadLeads(Object.keys(filters).length > 0 ? filters : undefined);

  // Apply limit
  if (cliArgs.limit && leads.length > cliArgs.limit) {
    console.log(`[LIMIT] Capping from ${leads.length} to ${cliArgs.limit} leads.`);
    leads = leads.slice(0, cliArgs.limit);
  }

  if (leads.length === 0) {
    console.log("[INFO] No leads matched the given filters. Nothing to process.");
    return;
  }

  console.log(
    `[PROSPECT RESEARCH AGENT] Processing ${leads.length} leads...` +
      (cliArgs.dryRun ? " (DRY RUN)" : "")
  );
  console.log("");

  let success = 0;
  let failed = 0;

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] ${lead.Organization}`);

    const result = await processLead(lead, cliArgs.dryRun);
    if (result !== null || cliArgs.dryRun) {
      success++;
    } else if (!cliArgs.dryRun) {
      // null result when not dry-run means either skip or error
      // Check if it was a skip (file exists) vs actual failure
      const slug = slugify(lead.Organization);
      const path = `D:/ShivamGem/SynaSystems/agency-brain/dossiers/${slug}.md`;
      if (fileExists(path)) {
        success++; // Already existed = success
      } else {
        failed++;
      }
    }

    // Rate limit: 1 second between API calls (skip delay after last item)
    if (i < leads.length - 1) {
      await sleep(1000);
    }
  }

  // Summary
  console.log("\n" + "─".repeat(60));
  console.log(`Completed: ${success}/${leads.length} dossiers generated`);
  if (failed > 0) {
    console.log(`Failed: ${failed} leads encountered errors`);
  }
  if (cliArgs.dryRun) {
    console.log("(Dry run — no files were saved)");
  }
  console.log("─".repeat(60) + "\n");

  await logAction(
    "prospect-agent",
    "lead_gen",
    `Prospect research batch complete: ${success}/${leads.length} dossiers (${failed} failed)`,
    failed > 0 ? "PARTIAL" : "DONE",
    "agency-brain/dossiers/"
  );
}

// ─── Standalone Detection ────────────────────────────────────────────

const isMain = process.argv[1]?.replace(/\\/g, "/").endsWith("prospect_research.ts");
if (isMain) {
  main();
}
