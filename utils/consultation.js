/**
 * ClarityAI Consultation Prompt Engineering & Multi-Turn Utilities
 * Formulates structured prompts for executive briefing, deep-dive consultation,
 * key insights, actionable checklists, critical review, and interactive follow-up Q&A.
 */

export const CONSULTATION_MODES = {
  summary_concise: {
    id: "summary_concise",
    label: "⚡ Quick Summary",
    description: "Concise 3-4 sentence executive overview",
    systemPrompt: `You are ClarityAI, an elite executive intelligence assistant. Your role is to deliver crystal-clear, high-signal executive briefings. Eliminate fluff, avoid preamble, and synthesize the essential truth directly.`,
    buildPrompt: (text) => `Summarize the following content in 3-4 crisp, high-impact sentences. Focus on the core problem/topic, the primary argument or evidence, and the ultimate conclusion.\n\nContent:\n${text}`
  },
  summary_bullets: {
    id: "summary_bullets",
    label: "📌 Key Takeaways",
    description: "5-7 structured bullet points with bold highlights",
    systemPrompt: `You are ClarityAI, a precision research analyst. Extract the most vital findings, arguments, and data points into crisp, high-impact bullet points with bold headline lead-ins.`,
    buildPrompt: (text) => `Extract 5-7 high-value key takeaways from this content. Start each bullet point with a **[Bold Concept Name]:** followed by a clear, insightful explanation citing facts or numbers where available.\n\nContent:\n${text}`
  },
  consultation_deep: {
    id: "consultation_deep",
    label: "🔍 Deep-Dive Consultation",
    description: "Comprehensive strategic breakdown with sections",
    systemPrompt: `You are ClarityAI, a senior strategic consultant. Provide a comprehensive, structured consultative analysis of the source material with clear markdown sections, insights, and actionable conclusions.`,
    buildPrompt: (text) => `Provide an in-depth, structured consultation analysis of the following webpage content.\n\nPlease organize your output into these structured markdown sections:\n- ## Executive Overview & Core Thesis\n- ## Key Arguments, Pillars & Evidence\n- ## Critical Findings & Strategic Risks\n- ## Recommendations & Practical Takeaways\n\nContent:\n${text}`
  },
  action_items: {
    id: "action_items",
    label: "✅ Action Items",
    description: "Prioritized steps, advice, and actionable checklist",
    systemPrompt: `You are ClarityAI, a tactical operations and workflow advisor. Extract and formulate clear, actionable steps, decisions, and practical checklists from the material.`,
    buildPrompt: (text) => `Analyze this content and extract all practical recommendations, action items, workflows, or instructions. Format them as a clear, prioritized numbered checklist of steps with bold titles, who should act, and immediate priority.\n\nContent:\n${text}`
  },
  critical_review: {
    id: "critical_review",
    label: "⚖️ Critical Review",
    description: "Balanced analysis: strengths, weaknesses, credibility",
    systemPrompt: `You are ClarityAI, an elite analytical consultant. Conduct a rigorous, balanced, and objective evaluation of the provided material, identifying strong evidence as well as potential biases, flaws, or omitted counterarguments.`,
    buildPrompt: (text) => `Conduct a balanced, objective critical evaluation of this content:\n- ## Strengths & Well-Supported Arguments\n- ## Potential Biases, Omissions, or Weak Points\n- ## Credibility & Final Verdict\n\nContent:\n${text}`
  }
};

/**
 * Builds the consultation prompt with intelligent sentence-boundary truncation
 */
export function buildConsultationPrompt(mode, text, customQuestion = "", title = "", url = "") {
  // Truncate to safe context size while respecting sentence boundaries
  const maxChars = 35000;
  let cleanText = text || "";
  if (cleanText.length > maxChars) {
    const cutPoint = cleanText.lastIndexOf(".", maxChars);
    cleanText = cutPoint > maxChars * 0.8 ? cleanText.substring(0, cutPoint + 1) : cleanText.substring(0, maxChars);
  }

  let docHeader = "";
  if (title) docHeader += `Document Title: "${title}"\n`;
  if (url) docHeader += `Source URL: ${url}\n\n`;

  if (customQuestion && customQuestion.trim()) {
    return `${docHeader}You are ClarityAI, an elite executive AI consultation assistant. Using the following webpage content as your factual context, answer the user's specific inquiry thoroughly, objectively, and accurately.\n\nUser Question: "${customQuestion.trim()}"\n\nWebpage Content:\n${cleanText}`;
  }

  const modeConfig = CONSULTATION_MODES[mode] || CONSULTATION_MODES.summary_concise;
  return `${docHeader}${modeConfig.buildPrompt(cleanText)}`;
}

/**
 * Formulates an interactive follow-up consultation prompt for post-analysis Q&A
 */
export function buildFollowUpPrompt({
  contextSummary = "",
  pageText = "",
  question = ""
}) {
  const truncatedContent = pageText && pageText.length > 25000 ? pageText.substring(0, 25000) : (pageText || "");

  const systemPrompt = `You are ClarityAI, an elite interactive research consultant. The user is asking a specific follow-up question regarding a web page they just reviewed. Answer clearly, accurately, and citing specific points from the content where applicable.`;

  const userPrompt = `Page Content Reference:\n"""\n${truncatedContent}\n"""\n\nExisting Consultation Summary Overview:\n${contextSummary}\n\nUser Follow-up Question:\n"${question}"\n\nPlease provide a clear, direct, and well-reasoned answer to the user's question based on the content above.`;

  return { systemPrompt, userPrompt };
}
