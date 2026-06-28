/**
 * Syna Systems — Master Agent Pipeline v1.0
 *
 * Chains all 3 agents in sequence:
 *   1. Prospect Research → Dossier
 *   2. Audit Generation → Audit Report
 *   3. Outreach Personalizer → Email Sequences + CSV
 *
 * SECURITY: No hardcoded API keys. OPENROUTER_API_KEY from env only.
 */

import { processLead } from './prospect_research.js';
import { generateAudit, loadFrameworks, AuditFrameworks } from './audit_generator.js';
import { personalizeOutreach, exportInstantlyCSV, EmailSequence } from './outreach_personalizer.js';
import { loadLeads } from './lib/csv_loader.js';
import { logAction } from './lib/logger.js';
import { readFileContent } from './lib/file_utils.js';

// ─── Constants ──────────────────────────────────────────────
const EMAIL_TEMPLATES_PATH = 'D:/ShivamGem/SynaSystems/agency-brain/sales/healthcare_rcm_outreach.md';
const AGENT_ID = 'pipeline-agent';

// ─── CLI Argument Parser ─────────────────────────────────────

function parseArgs(): {
  company?: string;
  score?: string;
  limit: number;
  exportCsv: boolean;
} {
  const args = process.argv.slice(2);
  let company: string | undefined;
  let score: string | undefined;
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
      case '--limit':
        limit = parseInt(args[++i], 10);
        break;
      case '--export-csv':
        exportCsv = true;
        break;
    }
  }

  return { company, score, limit, exportCsv };
}

// ─── Main Pipeline ───────────────────────────────────────────

(async () => {
  // ── Banner ──
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   SYNA SYSTEMS — AGENT PIPELINE v1.0    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  const { company, score, limit, exportCsv } = parseArgs();

  // ── Step 0: Load shared resources ──
  console.log('─── Loading Shared Resources ───\n');

  const frameworks = loadFrameworks();

  console.log('\n[BOOT] Loading email templates...');
  const templates = readFileContent(EMAIL_TEMPLATES_PATH);
  console.log(`  ✓ Email templates: ${templates.length} chars`);

  // ── Step 1: Load leads ──
  console.log('\n─── Loading Leads ───\n');
  const leads = await loadLeads({ company, score });
  const batch = leads.slice(0, limit);
  console.log(`\n[PIPELINE] Processing ${batch.length} lead(s)...\n`);

  // ── Stats tracking ──
  let dossiersGenerated = 0;
  let auditsGenerated = 0;
  let outreachGenerated = 0;
  const sequences: EmailSequence[] = [];

  // ── Step 2: Process each lead through all 3 stages ──
  for (let i = 0; i < batch.length; i++) {
    const lead = batch[i];
    console.log(`\n▶ [${i + 1}/${batch.length}] ${lead.Organization}`);
    console.log('  ─────────────────────────────');

    // Stage 1: Prospect Research → Dossier
    try {
      console.log('  Step 1: Prospect Research...');
      const dossierResult = await processLead(lead);
      if (dossierResult) {
        dossiersGenerated++;
        console.log('  ✓ Dossier generated');
      } else {
        console.log('  ⊘ Dossier skipped');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Dossier failed: ${errMsg}`);
    }

    // Stage 2: Audit Generation → Audit Report
    try {
      console.log('  Step 2: Audit Generation...');
      const auditResult = await generateAudit(lead, frameworks);
      if (auditResult) {
        auditsGenerated++;
        console.log('  ✓ Audit generated');
      } else {
        console.log('  ⊘ Audit skipped');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Audit failed: ${errMsg}`);
    }

    // Stage 3: Outreach Personalizer → Email Sequence
    try {
      console.log('  Step 3: Outreach Personalization...');
      const seq = await personalizeOutreach(lead, templates);
      if (seq) {
        sequences.push(seq);
        outreachGenerated++;
        console.log('  ✓ Outreach generated');
      } else {
        console.log('  ⊘ Outreach skipped');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Outreach failed: ${errMsg}`);
    }
  }

  // ── Step 3: CSV Export ──
  let csvStatus = 'skipped';
  if (exportCsv && sequences.length > 0) {
    try {
      const csvPath = exportInstantlyCSV(sequences);
      csvStatus = 'exported';
      console.log(`\n  ✓ Instantly CSV exported: ${csvPath}`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`\n  ✗ CSV export failed: ${errMsg}`);
      csvStatus = 'failed';
    }
  }

  // ── Summary ──
  console.log('');
  console.log('═══ PIPELINE COMPLETE ═══');
  console.log(`Leads processed: ${batch.length}`);
  console.log(`Dossiers:  ${dossiersGenerated} generated`);
  console.log(`Audits:    ${auditsGenerated} generated`);
  console.log(`Outreach:  ${outreachGenerated} generated`);
  console.log(`CSV:       ${csvStatus}`);
  console.log('═════════════════════════\n');

  // ── Log pipeline run ──
  await logAction(
    AGENT_ID,
    'pipeline_run',
    `Pipeline complete: ${batch.length} leads → ${dossiersGenerated} dossiers, ${auditsGenerated} audits, ${outreachGenerated} outreach, CSV: ${csvStatus}`,
    'DONE',
    ''
  );
})();
