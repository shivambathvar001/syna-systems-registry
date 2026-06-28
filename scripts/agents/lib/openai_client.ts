/**
 * Shared OpenAI-compatible client wrapper for Syna Systems agents.
 * Uses OpenRouter API via the OpenAI SDK.
 *
 * SECURITY: Credential is read from OPENROUTER_API_KEY env var. NEVER hardcoded.
 */

import OpenAI from "openai";

const DEFAULT_MODEL = "openrouter/free";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

/**
 * Returns a configured OpenAI client pointing at OpenRouter.
 * Throws immediately if OPENROUTER_API_KEY is not set.
 */
function getClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[FATAL] OpenRouter token missing from environment variables."
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

/**
 * Sleep utility for exponential backoff.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a chat completion via OpenRouter.
 *
 * @param systemPrompt - The system-level instruction.
 * @param userPrompt   - The user-level prompt / payload.
 * @param model        - Override the default model (optional).
 * @returns The assistant's response text.
 *
 * Retry logic: up to 3 attempts with exponential backoff (1s, 2s, 4s).
 * Rate-limit (429) and transient server errors (5xx) trigger retries.
 */
export async function generate(
  systemPrompt: string,
  userPrompt: string,
  model?: string
): Promise<string> {
  const client = getClient();
  const targetModel = model ?? DEFAULT_MODEL;

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: targetModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      // Print token usage
      const usage = response.usage;
      if (usage) {
        console.log(
          `[TOKENS] prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens}, total: ${usage.total_tokens}`
        );
      }

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("[ERROR] Empty response from model — no content returned.");
      }

      return content;
    } catch (err: any) {
      lastError = err;

      // Determine if retryable
      const status = err && typeof err === 'object' && 'status' in err ? err.status : undefined;
      const isRateLimit = status === 429;
      const isServerError = status !== undefined && status >= 500;

      if ((isRateLimit || isServerError) && attempt < MAX_RETRIES) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[RETRY] Attempt ${attempt}/${MAX_RETRIES} failed (status=${status}). Retrying in ${delayMs}ms...`
        );
        await sleep(delayMs);
        continue;
      }

      // Non-retryable or final attempt — rethrow
      break;
    }
  }

  throw lastError;
}
