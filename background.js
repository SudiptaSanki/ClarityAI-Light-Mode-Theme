import { callAiApi, PROVIDERS } from "./utils/ai-providers.js";
import { CONSULTATION_MODES, buildConsultationPrompt } from "./utils/consultation.js";
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
      id: "clarity-deep-consult",
      title: "ClarityAI: Deep Consultation",
      contexts: ["page", "selection"]
    });
    chrome.contextMenus.create({
      id: "clarity-takeaways",
      title: "ClarityAI: Key Takeaways",
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
  if (!data.selectedModels) {
    updates.selectedModels = {
      gemini: data.model || "gemini-2.5-flash",
      openrouter: "meta-llama/llama-3.3-70b-instruct:free",
      groq: "llama-3.3-70b-versatile",
      openai: "gpt-4o-mini",
      anthropic: "claude-3-5-sonnet-latest",
      deepseek: "deepseek-chat",
      mistral: "mistral-small-latest",
      custom: "llama3"
    };
  }
  if (!data.customEndpoints) {
    updates.customEndpoints = {
      custom: "http://localhost:11434/v1/chat/completions"
    };
  }
  if (!data.consultationMode) updates.consultationMode = "summary_concise";

  if (Object.keys(updates).length > 0) {
    await chrome.storage.local.set(updates);
  }
}

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  let mode = "summary_concise";
  if (info.menuItemId === "clarity-deep-consult") mode = "consultation_deep";
  if (info.menuItemId === "clarity-takeaways") mode = "summary_bullets";

  try {
    await chrome.storage.local.set({ isSummarizing: true });

    // Extract text from tab
    const [execResult] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent
    });

    const pageData = execResult?.result;
    if (!pageData || !pageData.content) {
      throw new Error("Could not extract readable text from this page.");
    }

    const consultationResult = await runConsultation({
      text: pageData.content,
      mode,
      title: pageData.title,
      url: pageData.url
    });

    await chrome.storage.local.set({
      lastSummary: consultationResult.output,
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

// Run consultation with user's saved provider configuration
async function runConsultation({ text, mode = "summary_concise", customQuestion = "", title = "", url = "" }) {
  const store = await chrome.storage.local.get([
    "provider",
    "apiKeys",
    "selectedModels",
    "customEndpoints",
    "temperature",
    "customSystemPrompt"
  ]);

  const provider = store.provider || "gemini";
  const apiKeys = store.apiKeys || {};
  const selectedModels = store.selectedModels || {};
  const customEndpoints = store.customEndpoints || {};

  const apiKey = apiKeys[provider] || "";
  const model = selectedModels[provider] || PROVIDERS[provider]?.defaultModel || "gemini-2.5-flash";
  const customEndpoint = customEndpoints[provider] || "";
  const temperature = store.temperature ?? 0.2;

  const prompt = buildConsultationPrompt(mode, text, customQuestion);
  const systemPrompt = store.customSystemPrompt || 
    "You are ClarityAI, an executive AI consultation assistant. Analyze and summarize web content clearly, accurately, and thoroughly with structured markdown formatting.";

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
        const testPrompt = "Please respond with 'ClarityAI connection successful' if you can read this.";
        
        const result = await callAiApi({
          provider: provider || "gemini",
          model,
          apiKey,
          customEndpoint,
          systemPrompt: "You are an API diagnostic tester.",
          prompt: testPrompt,
          temperature: 0.1
        });

        sendResponse({ success: true, result });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // Keep channel open for async response
  }

  // 2. Perform Consultation on Active Tab
  if (message?.type === "RUN_CONSULTATION") {
    (async () => {
      try {
        await chrome.storage.local.set({ isSummarizing: true });

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
          throw new Error("No active browser tab detected.");
        }

        // Extract content from tab
        const [execResult] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractPageContent
        });

        const pageData = execResult?.result;
        if (!pageData || !pageData.content || pageData.content.trim().length === 0) {
          throw new Error("No readable text found on this page. If this page uses protected frames, try highlighting a paragraph.");
        }

        const { mode, customQuestion } = message;
        const result = await runConsultation({
          text: pageData.content,
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

  // 3. Extract text preview only
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
