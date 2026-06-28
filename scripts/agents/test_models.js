import OpenAI from "openai";

const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error("OPENROUTER_API_KEY not set in environment");
  process.exit(1);
}
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: key,
});

const models = [
  "openrouter/free",
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3-8b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "deepseek/deepseek-r1:free"
];

async function test() {
  for (const model of models) {
    try {
      console.log(`Testing model: ${model}`);
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: "Say test" }],
        max_tokens: 10
      });
      console.log(`Success with ${model}:`, completion.choices[0].message.content);
      return model;
    } catch (err) {
      console.log(`Failed with ${model}:`, err.message);
    }
  }
}

test();
