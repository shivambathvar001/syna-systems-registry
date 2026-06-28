/**
 * File utilities for Syna Systems agent outputs.
 * Handles slug generation, directory creation, and dossier/audit/outreach writes.
 *
 * All paths use forward slashes and are absolute.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

const DOSSIERS_DIR = "D:/ShivamGem/SynaSystems/agency-brain/dossiers";
const AUDITS_DIR = "D:/ShivamGem/SynaSystems/agency-brain/audits";
const OUTREACH_DIR = "D:/ShivamGem/SynaSystems/agency-brain/outreach";

/**
 * Convert a name to a URL/filesystem-safe slug.
 * Lowercase, replace spaces and special chars with hyphens, collapse consecutive hyphens.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric runs with hyphen
    .replace(/-+/g, "-")         // Collapse consecutive hyphens
    .replace(/^-|-$/g, "");      // Trim leading/trailing hyphens
}

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

/**
 * Write a prospect dossier markdown file.
 * @returns Absolute path to the written file.
 */
export function writeDossier(slug: string, content: string): string {
  ensureDir(DOSSIERS_DIR);
  const filePath = `${DOSSIERS_DIR}/${slug}.md`;
  writeFileSync(filePath, content, "utf-8");
  console.log(`[FILE] Wrote dossier: ${filePath}`);
  return filePath;
}

/**
 * Write an operational audit markdown file.
 * @returns Absolute path to the written file.
 */
export function writeAudit(slug: string, content: string): string {
  ensureDir(AUDITS_DIR);
  const filePath = `${AUDITS_DIR}/${slug}.md`;
  writeFileSync(filePath, content, "utf-8");
  console.log(`[FILE] Wrote audit: ${filePath}`);
  return filePath;
}

/**
 * Write an outreach/email copy markdown file.
 * @returns Absolute path to the written file.
 */
export function writeOutreach(slug: string, content: string): string {
  ensureDir(OUTREACH_DIR);
  const filePath = `${OUTREACH_DIR}/${slug}.md`;
  writeFileSync(filePath, content, "utf-8");
  console.log(`[FILE] Wrote outreach: ${filePath}`);
  return filePath;
}

/**
 * Read and return the full contents of a file.
 * Throws if the file does not exist.
 */
export function readFileContent(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`[FILE] Not found: ${filePath}`);
  }
  return readFileSync(filePath, "utf-8");
}

/**
 * Check whether a file exists at the given path.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}
