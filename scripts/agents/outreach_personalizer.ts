/**
 * Syna Systems — Outreach Personalizer Agent
 *
 * Reads dossier + audit → generates personalized 3-email sequences.
 * Exports Instantly.ai-compatible CSV for campaign import.
 *
 * SECURITY: No hardcoded API keys. OPENROUTER_API_KEY from env only.
 */

import { generate } from './lib/openai_client.js';
import { loadLeads, Lead } from './lib/csv_loader.js';
import { logAction } from './lib/logger.js';
import { slugify, ensureDir, readFileContent, fileExists } from './lib/file_utils.js';
import { writeFileSync } from 'node:fs';
import path from 'path';

// ─── Constants ──────────────────────────────────────────────
const DOSSIERS_DIR = 'D:/ShivamGem/SynaSystems/agency-brain/dossiers';
const AUDITS_DIR = 'D:/ShivamGem/SynaSystems/agency-brain/audits';
const OUTREACH_DIR = 'D:/ShivamGem/SynaSystems/agency-brain/outreach';
const EMAIL_TEMPLATES_PATH = 'D:/ShivamGem/SynaSystems/agency-brain/sales/healthcare_rcm_outreach.md';
const INSTANTLY_CSV_PATH = 'D:/ShivamGem/SynaSystems/agency-brain/outreach/instantly_import.csv';

const AGENT_ID = 'outreach-personalizer-agent';

// ─── System Prompt ──────────────────────────────────────────
const SYSTEM_PROMPT = `You are an elite cold email copywriter specializing in healthcare B2B outreach. Generate a hyper-personalized 3-email sequence.

You will receive: the prospect's research dossier, their audit report, and template examples.

Generate in this EXACT format:

# Personalized Outreach: {Company Name}
## Target: {Name} — {Title} at {Company}
## Generated: {Date}

---

### Email 1: The Observation
**Subject:** [personalized subject line]
**Body:**
[Hand-crafted email referencing specific hiring signals and pain points from the dossier. 4-6 sentences. Conversational, not salesy. End with a soft CTA.]

### Email 2: The Technical Proof
**Subject:** [personalized subject line]
**Body:**
[References audit findings, EHR-specific integration details, addresses common objections. 4-6 sentences. Include one specific metric from the audit.]

### Email 3: The Pilot Close
**Subject:** [personalized subject line]
**Body:**
[ROI numbers from audit, recommended pilot department, creates urgency with timeline. 4-5 sentences. Clear CTA for a 15-min call.]

---

### Metadata
- Send cadence: Day 1, Day 4, Day 8
- Best time: [based on location timezone]
- Personalization points used: [list the specific data points referenced]

Every email MUST feel individually hand-written. Generic template fills are UNACCEPTABLE. Use specific company details, EHR platform, hiring signals, and audit numbers in every email.`;

// ─── Types ──────────────────────────────────────────────────

export interface ParsedEmail {
  subject: string;
  body: string;
}

export interface EmailSequence {
  company: string;
  emails: ParsedEmail[];
  recipientEmail: string;
  firstName: string;
  lastName: string;
}

// ─── Email Parser ───────────────────────────────────────────

/**
 * Parse the 3 emails from the LLM-generated markdown output.
 * Extracts Subject and Body from each "### Email N:" section.
 */
function parseEmails(markdown: string): ParsedEmail[] {
  const emails: ParsedEmail[] = [];

  // Match each Email section
  const emailSections = markdown.split(/###\s+Email\s+\d+:/i).slice(1);

  for (const section of emailSections) {
    // Extract subject
    const subjectMatch = section.match(/\*\*Subject:\*\*\s*(.+)/i);
    const subject = subjectMatch
      ? subjectMatch[1].replace(/^\[/, '').replace(/\]$/, '').trim()
      : '';

    // Extract body: fallback to grabbing everything after the Subject line if **Body:** tag is missing
    let body = '';
    const bodyHeaderMatch = section.match(/\*\*Body:\*\*\s*\n?([\s\S]*?)(?=\n###|\n---|$)/i);
    if (bodyHeaderMatch && bodyHeaderMatch[1].trim()) {
      body = bodyHeaderMatch[1].trim();
    } else if (subjectMatch) {
      const subjectIndex = section.indexOf(subjectMatch[0]);
      if (subjectIndex !== -1) {
        const rest = section.substring(subjectIndex + subjectMatch[0].length).trim();
        body = rest.replace(/^(?:\*\*Body:\*\*\s*\n?)/i, '').trim();
      }
    }

    // Clean up trailing delimiters
    const delimiterIndex = body.indexOf('---');
    if (delimiterIndex !== -1) {
      body = body.substring(0, delimiterIndex).trim();
    }

    body = body
      .replace(/^\[/, '').replace(/\]$/, '')  // Remove markdown brackets
      .replace(/\n{3,}/g, '\n\n');  // Normalize excessive newlines

    if (subject || body) {
      emails.push({ subject, body });
    }
  }

  return emails;
}

/**
 * Parse contact name into first/last from Decision_Maker or Apollo_Contact field.
 */
function parseContactName(lead: Lead): { firstName: string; lastName: string } {
  const name = lead.Decision_Maker || lead.Apollo_Contact || '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) {
    return { firstName: lead.Organization.split(/\s+/)[0] || 'there', lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

// ─── Core Export ─────────────────────────────────────────────

/**
 * Generate personalized outreach for a single lead.
 *
 * @param lead      - The lead record from CSV
 * @param templates - Pre-loaded email template content
 * @param dryRun    - If true, skip LLM call
 * @returns EmailSequence object for CSV aggregation, or null if skipped
 */
export async function personalizeOutreach(
  lead: Lead,
  templates: string,
  dryRun?: boolean
): Promise<EmailSequence | null> {
  const slug = slugify(lead.Organization);
  const dossierPath = `${DOSSIERS_DIR}/${slug}.md`;
  const auditPath = `${AUDITS_DIR}/${slug}.md`;

  // ── Guard: both dossier AND audit must exist ──
  if (!fileExists(dossierPath)) {
    console.warn(`[SKIP] No dossier for "${lead.Organization}" — skipping outreach`);
    await logAction(AGENT_ID, 'outreach_gen', `Skipped ${lead.Organization} — no dossier`, 'SKIPPED', '');
    return null;
  }
  if (!fileExists(auditPath)) {
    console.warn(`[SKIP] No audit for "${lead.Organization}" — skipping outreach`);
    await logAction(AGENT_ID, 'outreach_gen', `Skipped ${lead.Organization} — no audit`, 'SKIPPED', '');
    return null;
  }

  const dossier = readFileContent(dossierPath);
  const audit = readFileContent(auditPath);
  const { firstName, lastName } = parseContactName(lead);

  if (dryRun) {
    console.log(`[DRY-RUN] Would generate outreach for "${lead.Organization}"`);
    console.log(`  Dossier: ${dossier.length} chars | Audit: ${audit.length} chars`);
    console.log(`  Contact: ${firstName} ${lastName} <${lead.Email || 'no-email'}>`);
    return null;
  }

  // ── Build user prompt ──
  const today = new Date().toISOString().split('T')[0];
  const userPrompt = `
=== PROSPECT DOSSIER ===
${dossier}

=== AUDIT REPORT ===
${audit}

=== EMAIL TEMPLATES (for style reference, do NOT copy verbatim) ===
${templates}

=== INSTRUCTIONS ===
Company Name: ${lead.Organization}
Contact Name: ${firstName} ${lastName}
Contact Title: ${lead.Signal_Role || 'Decision Maker'}
Primary EHR: ${lead.Primary_EHR || lead.Primary_EHR_Placeholder || 'Unknown'}
Location: ${lead.Location}
Email: ${lead.Email || 'N/A'}
Date: ${today}

Generate the full 3-email personalized sequence now. Every email must reference specific data from the dossier and audit.
`.trim();

  console.log(`[OUTREACH] Generating emails for "${lead.Organization}"...`);

  try {
    const outreachContent = await generate(SYSTEM_PROMPT, userPrompt);

    // Write raw markdown
    ensureDir(OUTREACH_DIR);
    const outputPath = `${OUTREACH_DIR}/${slug}.md`;
    writeFileSync(outputPath, outreachContent, 'utf-8');
    console.log(`[FILE] Wrote outreach: ${outputPath}`);

    // Parse emails
    const parsedEmails = parseEmails(outreachContent);
    if (parsedEmails.length === 0) {
      console.warn(`[WARN] Could not parse emails from LLM output for "${lead.Organization}"`);
    } else {
      console.log(`  ✓ Parsed ${parsedEmails.length} email(s)`);
    }

    const sequence: EmailSequence = {
      company: lead.Organization,
      emails: parsedEmails,
      recipientEmail: lead.Email || '',
      firstName,
      lastName,
    };

    await logAction(
      AGENT_ID,
      'outreach_gen',
      `Generated ${parsedEmails.length}-email sequence for ${lead.Organization}`,
      'DONE',
      outputPath
    );

    console.log(`  ✓ Outreach complete for "${lead.Organization}"`);
    return sequence;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`[ERROR] Outreach generation failed for "${lead.Organization}": ${errMsg}`);
    await logAction(AGENT_ID, 'error', `Outreach failed: ${lead.Organization} — ${errMsg}`, 'ERROR', '');
    return null;
  }
}

// ─── CSV Export ──────────────────────────────────────────────

/**
 * Escape a value for CSV: wrap in quotes if it contains commas, quotes, or newlines.
 */
function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Export all collected email sequences to an Instantly.ai-compatible CSV.
 *
 * Columns: email,first_name,last_name,company_name,subject_1,body_1,subject_2,body_2,subject_3,body_3
 *
 * @param sequences - Array of parsed email sequences from personalizeOutreach()
 * @returns Path to the exported CSV file
 */
export function exportInstantlyCSV(sequences: EmailSequence[]): string {
  ensureDir(OUTREACH_DIR);

  const header = 'email,first_name,last_name,company_name,subject_1,body_1,subject_2,body_2,subject_3,body_3';
  const rows: string[] = [header];

  for (const seq of sequences) {
    const email1 = seq.emails[0] || { subject: '', body: '' };
    const email2 = seq.emails[1] || { subject: '', body: '' };
    const email3 = seq.emails[2] || { subject: '', body: '' };

    const row = [
      escapeCsvField(seq.recipientEmail),
      escapeCsvField(seq.firstName),
      escapeCsvField(seq.lastName),
      escapeCsvField(seq.company),
      escapeCsvField(email1.subject),
      escapeCsvField(email1.body),
      escapeCsvField(email2.subject),
      escapeCsvField(email2.body),
      escapeCsvField(email3.subject),
      escapeCsvField(email3.body),
    ].join(',');

    rows.push(row);
  }

  const csvContent = rows.join('\n') + '\n';
  writeFileSync(INSTANTLY_CSV_PATH, csvContent, 'utf-8');
  console.log(`[CSV] Exported ${sequences.length} sequences to ${INSTANTLY_CSV_PATH}`);

  return INSTANTLY_CSV_PATH;
}

// ─── CLI Main ────────────────────────────────────────────────

function parseArgs(): {
  company?: string;
  score?: string;
  dryRun: boolean;
  limit: number;
  exportCsv: boolean;
} {
  const args = process.argv.slice(2);
  let company: string | undefined;
  let score: string | undefined;
  let dryRun = false;
  let limit = Infinity;
  let exportCsv = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--company':
        company = args[++i];
        break;
      case '--score':
        score = args[++i];
        break;
      case '--dry-run':
        dryRun = true;
        break;
      case '--limit':
        limit = parseInt(args[++i], 10);
        break;
      case '--export-csv':
        exportCsv = true;
        break;
    }
  }

  return { company, score, dryRun, limit, exportCsv };
}

// ── isMain pattern ──
const isMain =
  process.argv[1] &&
  (process.argv[1].includes('outreach_personalizer') ||
   process.argv[1].endsWith('outreach_personalizer.ts'));

if (isMain) {
  (async () => {
    console.log('══════════════════════════════════════════');
    console.log('  SYNA SYSTEMS — OUTREACH PERSONALIZER');
    console.log('══════════════════════════════════════════\n');

    const { company, score, dryRun, limit, exportCsv } = parseArgs();

    // Load email templates
    console.log('[BOOT] Loading email templates...');
    const templates = readFileContent(EMAIL_TEMPLATES_PATH);
    console.log(`  ✓ Templates: ${templates.length} chars`);

    // Load leads with filters
    const leads = await loadLeads({ company, score });
    const batch = leads.slice(0, limit);

    console.log(`\n[RUN] Processing ${batch.length} lead(s)${dryRun ? ' (DRY RUN)' : ''}...\n`);

    const sequences: EmailSequence[] = [];
    let generated = 0;
    let skipped = 0;

    for (let i = 0; i < batch.length; i++) {
      const lead = batch[i];
      console.log(`\n▶ [${i + 1}/${batch.length}] ${lead.Organization}`);
      const result = await personalizeOutreach(lead, templates, dryRun);
      if (result) {
        sequences.push(result);
        generated++;
      } else {
        skipped++;
      }
    }

    // CSV export
    if (exportCsv && sequences.length > 0) {
      const csvPath = exportInstantlyCSV(sequences);
      console.log(`\n  ✓ Instantly CSV exported: ${csvPath}`);
      await logAction(AGENT_ID, 'outreach_gen', `Exported ${sequences.length} sequences to CSV`, 'DONE', csvPath);
    }

    console.log('\n══════════════════════════════════════════');
    console.log(`  OUTREACH PERSONALIZATION COMPLETE`);
    console.log(`  Generated: ${generated} | Skipped: ${skipped}`);
    if (exportCsv) {
      console.log(`  CSV: ${sequences.length > 0 ? 'exported' : 'skipped (no sequences)'}`);
    }
    console.log('══════════════════════════════════════════\n');

    await logAction(
      AGENT_ID,
      'outreach_gen',
      `Batch complete: ${generated} generated, ${skipped} skipped out of ${batch.length}`,
      'DONE',
      OUTREACH_DIR
    );
  })();
}
