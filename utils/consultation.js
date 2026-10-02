/**
 * Consultation prompt templates and utilities
 */

export const CONSULTATION_MODES = {
  summary_concise: {
    id: "summary_concise",
    label: "⚡ Quick Summary",
    description: "Concise 3-4 sentence executive overview",
    buildPrompt: (text) => `You are ClarityAI, an executive research consultant. Summarize the following content in 3-4 crisp, high-impact sentences. Focus on the core message, key rationale, and primary conclusion.\n\nContent:\n${text}`
  },
  summary_bullets: {
    id: "summary_bullets",
    label: "📌 Key Takeaways",
    description: "5-7 structured bullet points with bold highlights",
    buildPrompt: (text) => `You are ClarityAI, an executive research consultant. Extract 5-7 high-value key takeaways from this content. Start each bullet point with a **Bold Concept Name** followed by a clear, insightful explanation.\n\nContent:\n${text}`
  },
  consultation_deep: {
    id: "consultation_deep",
    label: "🔍 Deep-Dive Consultation",
    description: "Comprehensive strategic breakdown with sections",
    buildPrompt: (text) => `You are ClarityAI, a world-class strategic consultant. Provide an in-depth, structured consultation analysis of the following webpage content.\n\nPlease organize your output into these structured markdown sections:\n- ## Executive Overview\n- ## Core Themes & Arguments\n- ## Strategic Insights & Findings\n- ## Practical Implications & Conclusion\n\nContent:\n${text}`
  },
  action_items: {
    id: "action_items",
    label: "✅ Action Items",
    description: "Prioritized steps, advice, and actionable checklist",
    buildPrompt: (text) => `You are ClarityAI. Analyze this content and extract all practical recommendations, action items, workflows, or instructions. Format them as a clear, prioritized checklist of steps with bold titles and practical advice.\n\nContent:\n${text}`
  },
  critical_review: {
    id: "critical_review",
    label: "⚖️ Critical Review",
    description: "Balanced analysis: strengths, weaknesses, credibility",
    buildPrompt: (text) => `You are ClarityAI, an objective analytical consultant. Conduct a balanced critical evaluation of this content:\n- ## Strengths & Well-Supported Arguments\n- ## Potential Biases, Omissions, or Weak Points\n- ## Credibility & Final Assessment\n\nContent:\n${text}`
  }
};

export function buildConsultationPrompt(mode, text, customQuestion = "") {
  if (customQuestion && customQuestion.trim()) {
    return `You are ClarityAI, an elite executive AI consultation assistant. Using the following webpage content as your factual context, answer the user's specific inquiry thoroughly, objectively, and accurately.\n\nUser Question: "${customQuestion.trim()}"\n\nWebpage Content:\n${text}`;
  }

  const modeConfig = CONSULTATION_MODES[mode] || CONSULTATION_MODES.summary_concise;
  return modeConfig.buildPrompt(text);
}
