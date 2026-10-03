import { callAiApi, PROVIDERS, autoResolveWorkingModel, fetchAvailableModels, testConnection } from "./utils/ai-providers.js";
import { CONSULTATION_MODES, buildConsultationPrompt, buildFollowUpPrompt } from "./utils/consultation.js";
import { extractPageContent } from "./utils/extractor.js";

// Setup context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "clarity-quick-summary",
      title: "ClarityAI: Quick Summary",
      contexts: ["page", "selection"]
    });
    chrome.contextMenus.create({
      id: "clarity-takeaways",
      title: "ClarityAI: Key Takeaways",
      contexts: ["page", "selection"]
    });
    chrome.contextMenus.create({
      id: "clarity-deep-consult",
      title: "ClarityAI: Deep Consultation",
      contexts: ["page", "selection"]
    });
    chrome.contextMenus.create({
      id: "clarity-critical",
      title: "ClarityAI: Critical Review & Assessment",
      contexts: ["page", "selection"]
    });
  });

  // Ensure default storage settings exist
  initializeSettings();
});

async function initializeSettings() {
  const data = await chrome.storage.local.get([
    "provider",
    "apiKeys",
    "selectedModels",
    "models",
    "customEndpoints",
    "consultationMode",
    "geminiApiKey",
    "model"
  ]);

  const updates = {};

  // Migration for previous version users
  const apiKeys = data.apiKeys || {};
  if (data.geminiApiKey && !apiKeys.gemini) {
    apiKeys.gemini = data.geminiApiKey;
    updates.apiKeys = apiKeys;
  }

  if (!data.provider) updates.provider = "gemini";

  const currentModels = data.selectedModels || data.models || {};
  // Migrate legacy/retired Gemini models to latest stable
  if (!currentModels.gemini || currentModels.gemini === "gemini-2.5-flash" || currentModels.gemini === "gemini-2.0-flash" || currentModels.gemini === "gemini-1.5-flash" || currentModels.gemini === "gemini-2.5-pro" || currentModels.gemini === "gemini-pro-latest") {
    currentModels.gemini = "gemini-flash-latest";
  }
  if (!currentModels.openrouter) currentModels.openrouter = "meta-llama/llama-3.3-70b-instruct:free";
  if (!currentModels.groq) currentModels.groq = "llama-3.3-70b-versatile";
  if (!currentModels.openai) currentModels.openai = "gpt-4o-mini";
  if (!currentModels.anthropic) currentModels.anthropic = "claude-3-5-haiku-latest";
  if (!currentModels.deepseek) currentModels.deepseek = "deepseek-chat";
  if (!currentModels.mistral) currentModels.mistral = "mistral-small-latest";
  if (!currentModels.grok) currentModels.grok = "grok-2-latest";
  if (!currentModels.zhipu) currentModels.zhipu = "glm-4-flash";
  if (!currentModels.custom) currentModels.custom = "llama3";

  updates.selectedModels = currentModels;
  updates.models = currentModels;

  if (!data.customEndpoints) {
    updates.customEndpoints = {
      custom: "http://localhost:11434/v1/chat/completions"
    };
  }
  const mode = data.consultationMode || data.summaryStyle || "summary_concise";
  if (!data.consultationMode) updates.consultationMode = mode;
  if (!data.summaryStyle) updates.summaryStyle = mode;

  if (Object.keys(updates).length > 0) {
    await chrome.storage.local.set(updates);
  }
}

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  let mode = "summary_concise";
  if (info.menuItemId === "clarity-deep-consult") mode = "consultation_deep";
  else if (info.menuItemId === "clarity-takeaways") mode = "summary_bullets";
  else if (info.menuItemId === "clarity-critical") mode = "critical_review";

  try {
    await chrome.storage.local.set({
      isSummarizing: true,
      summarizingStartTime: Date.now()
    });

    const [execResult] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent
    });

    const pageData = execResult?.result;
    const textContent = pageData?.content || pageData?.text;
    if (!pageData || !textContent) {
      throw new Error("Could not extract readable text from this page.");
    }

    const consultationResult = await runConsultation({
      text: textContent,
      mode,
      title: pageData.title,
      url: pageData.url
    });

    await chrome.storage.local.set({
      lastSummary: consultationResult.output,
      lastPageText: textContent.substring(0, 25000),
      lastMetadata: {
        title: pageData.title,
        url: pageData.url,
        wordCount: pageData.wordCount,
        mode,
        provider: consultationResult.provider,
        model: consultationResult.model,
        timestamp: new Date().toISOString()
      },
      isSummarizing: false
    });

    chrome.action.openPopup?.();
  } catch (err) {
    console.error("Context menu consultation error:", err);
    await chrome.storage.local.set({
      lastSummary: `❌ Error: ${err.message}`,
      isSummarizing: false
    });
  }
});

// Get currently active AI provider, model, key, and endpoint settings from storage
async function getActiveAiSettings() {
  const store = await chrome.storage.local.get([
    "provider",
    "apiKeys",
    "selectedModels",
    "models",
    "customEndpoints",
    "temperature",
    "customSystemPrompt"
  ]);

  const provider = store.provider || "gemini";
  const apiKeys = store.apiKeys || {};
  const selectedModels = store.selectedModels || store.models || {};
  const customEndpoints = store.customEndpoints || {};

  const apiKey = apiKeys[provider] || "";
  const model = selectedModels[provider] || PROVIDERS[provider]?.defaultModel || "gemini-flash-latest";
  const customEndpoint = customEndpoints[provider] || "";
  const temperature = store.temperature ?? 0.2;

  return {
    provider,
    apiKey,
    model,
    customEndpoint,
    temperature,
    customSystemPrompt: store.customSystemPrompt || ""
  };
}

// Run consultation with user's saved provider configuration
async function runConsultation({ text, mode = "summary_concise", customQuestion = "", title = "", url = "" }) {
  const activeSettings = await getActiveAiSettings();
  const { provider, model, apiKey, customEndpoint, temperature, customSystemPrompt: storedCustomPrompt } = activeSettings;

  const prompt = buildConsultationPrompt(mode, text, customQuestion, title, url);
  const modeDef = CONSULTATION_MODES[mode];
  const baseSystemPrompt = modeDef?.systemPrompt || "You are ClarityAI, an executive AI consultation assistant. Analyze and summarize web content clearly, accurately, and thoroughly with structured markdown formatting.";
  const systemPrompt = storedCustomPrompt && storedCustomPrompt.trim()
    ? `${storedCustomPrompt.trim()}\n\n${baseSystemPrompt}`
    : baseSystemPrompt;

  const output = await callAiApi({
    provider,
    model,
    apiKey,
    customEndpoint,
    systemPrompt,
    prompt,
    temperature
  });

  return {
    output,
    provider,
    model
  };
}

// Runtime messaging listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 1. Test API Key / Connectivity
  if (message?.type === "TEST_API") {
    (async () => {
      try {
        const { provider, model, apiKey, customEndpoint } = message;
        const res = await testConnection({ provider, apiKey, model, customEndpoint });
        sendResponse({ success: true, result: res.response, latency: res.latency });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  // 2. Perform Consultation on Active Tab
  if (message?.type === "RUN_CONSULTATION") {
    (async () => {
      try {
        const activeSettings = await getActiveAiSettings();
        await chrome.storage.local.set({
          isSummarizing: true,
          summarizingStartTime: Date.now(),
          isSearch: !!message.customQuestion,
          activeModel: activeSettings.model,
          activeProvider: activeSettings.provider
        });

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
          throw new Error("No active browser tab detected.");
        }

        if (tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:") || tab.url.startsWith("chrome-extension://"))) {
          const pageName = tab.url.split("/")[2] || "internal page";
          throw new Error(`Cannot analyze browser internal pages (${pageName}). Please open a standard web page or article to analyze.`);
        }

        const [execResult] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractPageContent
        });

        const pageData = execResult?.result;
        const textContent = pageData?.content || pageData?.text;
        if (!pageData || !textContent || textContent.trim().length === 0) {
          throw new Error("No readable text found on this page. If this page uses protected frames, try highlighting a paragraph.");
        }

        const { mode, customQuestion } = message;
        const result = await runConsultation({
          text: textContent,
          mode: mode || "summary_concise",
          customQuestion: customQuestion || "",
          title: pageData.title,
          url: pageData.url
        });

        const metadata = {
          title: pageData.title || tab.title || "Webpage Analysis",
          url: pageData.url || tab.url || "",
          wordCount: pageData.wordCount || 0,
          mode: customQuestion ? "custom_question" : mode,
          customQuestion: customQuestion || null,
          provider: result.provider,
          model: result.model,
          timestamp: new Date().toISOString()
        };

        await chrome.storage.local.set({
          lastSummary: result.output,
          lastPageText: textContent.substring(0, 25000),
          lastMetadata: metadata,
          isSummarizing: false
        });

        sendResponse({
          success: true,
          output: result.output,
          metadata
        });
      } catch (err) {
        console.error("Consultation run failed:", err);
        await chrome.storage.local.set({ isSummarizing: false });
        sendResponse({
          success: false,
          error: err.message
        });
      }
    })();
    return true;
  }

  // 3. Interactive Follow-up Consultation Question (Q&A)
  if (message?.type === "ASK_CONSULTATION") {
    (async () => {
      try {
        const { question, contextSummary = "", pageText = "" } = message;
        if (!question || !question.trim()) {
          throw new Error("Please enter a question to ask.");
        }

        const activeSettings = await getActiveAiSettings();
        const { provider, model, apiKey, customEndpoint, customSystemPrompt: storedCustomPrompt } = activeSettings;

        const { systemPrompt, userPrompt } = buildFollowUpPrompt({
          contextSummary,
          pageText,
          question: question.trim()
        });

        const finalSystemPrompt = storedCustomPrompt && storedCustomPrompt.trim()
          ? `${storedCustomPrompt.trim()}\n\n${systemPrompt}`
          : systemPrompt;

        const answer = await callAiApi({
          provider,
          model,
          apiKey,
          customEndpoint,
          systemPrompt: finalSystemPrompt,
          prompt: userPrompt,
          temperature: 0.3
        });

        sendResponse({ success: true, answer });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  // 4. Auto-Resolve Working Model
  if (message?.type === "RESOLVE_MODEL") {
    (async () => {
      try {
        const result = await autoResolveWorkingModel(message);
        sendResponse(result);
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  // 5. Fetch Models dynamically from provider API
  if (message?.type === "FETCH_MODELS") {
    (async () => {
      try {
        const models = await fetchAvailableModels(message);
        sendResponse({ success: true, models });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  // 6. Extract text preview only
  if (message?.type === "EXTRACT_PAGE_TEXT") {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) throw new Error("No active browser tab.");

        const [execResult] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractPageContent
        });

        sendResponse({ success: true, data: execResult?.result });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});
