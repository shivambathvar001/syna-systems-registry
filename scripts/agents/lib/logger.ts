/**
 * Watchdog logger for Syna Systems agent operations.
 * Appends structured entries to the canonical watchdog_log.csv.
 *
 * Schema: timestamp, agent_id, action_type, description, status, output_file
 */

import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LOG_PATH =
  "D:/ShivamGem/SynaSystems/agency-brain/operations/watchdog_log.csv";

const CSV_HEADER =
  "timestamp,agent_id,action_type,description,status,output_file";

/**
 * Ensure the log file and its parent directory exist.
 * Creates the directory tree and writes the CSV header if the file is missing.
 */
function ensureLogFile(): void {
  const dir = dirname(LOG_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(LOG_PATH)) {
    appendFileSync(LOG_PATH, CSV_HEADER + "\n", "utf-8");
  }
}

/**
 * Escape a CSV field: wrap in quotes if it contains commas, quotes, or newlines.
 */
function escapeField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Append a single action entry to the watchdog log.
 *
 * @param agentId    - Identifier for the agent (e.g. "prospect-agent")
 * @param actionType - Category: lead_gen | outreach_sync | file_edit | api_call | error
 * @param description - Human-readable summary of what happened
 * @param status     - DONE | ERROR | IN_PROGRESS
 * @param outputFile - Path to any output artifact, or empty string
 */
export async function logAction(
  agentId: string,
  actionType: string,
  description: string,
  status: string,
  outputFile: string
): Promise<void> {
  ensureLogFile();

  const timestamp = new Date().toISOString();
  const row = [
    timestamp,
    escapeField(agentId),
    escapeField(actionType),
    escapeField(description),
    escapeField(status),
    escapeField(outputFile),
  ].join(",");

  appendFileSync(LOG_PATH, row + "\n", "utf-8");
  console.log(`[LOG] ${timestamp} | ${agentId} | ${actionType} | ${status}`);
}
