/**
 * Backward-compatible helper module for ClarityAI summarizer
 */
import { callAiApi } from "./ai-providers.js";
import { buildConsultationPrompt } from "./consultation.js";

export { buildConsultationPrompt, buildFollowUpPrompt, CONSULTATION_MODES } from "./consultation.js";

export async function summarize(text, { provider = "gemini", model, apiKey, style = "summary_concise" } = {}) {
  const prompt = buildConsultationPrompt(style, text);
  return await callAiApi({
    provider,
    model,
    apiKey,
    prompt
  });
}
