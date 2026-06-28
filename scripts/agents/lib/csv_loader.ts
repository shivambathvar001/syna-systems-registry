/**
 * CSV loader for healthcare leads.
 * Parses the canonical leads CSV with proper quoted-field handling.
 *
 * No external CSV library — uses built-in fs + manual RFC-4180 parsing.
 */

import { readFileSync } from "node:fs";

const LEADS_CSV_PATH =
  "D:/ShivamGem/SynaSystems/agency-brain/clients/healthcare_leads.csv";

/** Canonical Lead schema matching the healthcare_leads.csv columns. */
export interface Lead {
  Organization: string;
  Signal_Role: string;
  Location: string;
  Primary_EHR: string;
  Primary_EHR_Placeholder: string;
  Hiring_Density: string;
  Qualification_Score: string;
  Denial_Signals: string;
  Job_Link: string;
  Detected_At: string;
  Status: string;
  Decision_Maker: string;
  Apollo_Contact: string;
  Email: string;
  LinkedIn_Profile: string;
  enriched: string;
}

/**
 * Parse a single CSV line respecting quoted fields.
 * Handles commas inside double-quoted fields and escaped quotes ("").
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote ("")
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i += 2;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      }
      current += char;
      i++;
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (char === ",") {
        fields.push(current.trim());
        current = "";
        i++;
        continue;
      }
      current += char;
      i++;
    }
  }

  // Push last field
  fields.push(current.trim());
  return fields;
}

/**
 * Load leads from the healthcare CSV.
 *
 * @param filters - Optional filters:
 *   - score: filter by Qualification_Score (e.g. "HIGH")
 *   - company: filter by Organization name (case-insensitive substring match)
 * @returns Array of Lead objects matching the filters.
 */
export async function loadLeads(
  filters?: { score?: string; company?: string }
): Promise<Lead[]> {
  const raw = readFileSync(LEADS_CSV_PATH, "utf-8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length < 2) {
    console.warn("[CSV] File has no data rows.");
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const leads: Lead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const record: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] ?? "";
    }

    leads.push(record as unknown as Lead);
  }

  // Apply filters
  let filtered = leads;

  if (filters?.score) {
    const target = filters.score.toUpperCase();
    filtered = filtered.filter(
      (l) => l.Qualification_Score.toUpperCase() === target
    );
  }

  if (filters?.company) {
    const target = filters.company.toLowerCase();
    filtered = filtered.filter((l) =>
      l.Organization.toLowerCase().includes(target)
    );
  }

  console.log(
    `[CSV] Loaded ${leads.length} total leads, ${filtered.length} after filters.`
  );
  return filtered;
}
