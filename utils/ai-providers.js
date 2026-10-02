// Registry and client for all AI providers and models

export const PROVIDERS = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    badge: "Free tier available",
    tagline: "Official Google Gemini API with generous free tier",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIzaSy...",
    defaultModel: "gemini-2.5-flash",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Recommended - Fast & Smart)" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Deep Reasoning)" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Fast & Capable)" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Standard)" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Long Context)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter (Free & Paid Models)",
    badge: "100% Free Models Available",
    tagline: "Access 100+ models with one key (includes completely free models)",
    keyUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-v1-...",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (100% Free)" },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash Exp (100% Free)" },
      { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (100% Free - Reasoning)" },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B Instruct (100% Free)" },
      { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (100% Free)" },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Paid)" },
      { id: "openai/gpt-4o", name: "GPT-4o (Paid)" },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (Paid / Low Cost)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  groq: {
    id: "groq",
    name: "Groq (Ultra-Fast & Free)",
    badge: "Free & Lightning Fast",
    tagline: "Extreme inference speed powered by LPU technology with free tier",
    keyUrl: "https://console.groq.com/keys",
    keyPlaceholder: "gsk_...",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (Recommended)" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant (Super Fast)" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (32k Context)" },
      { id: "gemma2-9b-it", name: "Gemma 2 9B IT" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  openai: {
    id: "openai",
    name: "OpenAI (ChatGPT)",
    badge: "Industry Standard",
    tagline: "Official OpenAI GPT models (GPT-4o, GPT-4o-mini, o3)",
    keyUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-proj-...",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Affordable)" },
      { id: "gpt-4o", name: "GPT-4o (High Intelligence Flagship)" },
      { id: "o3-mini", name: "o3-mini (Advanced Reasoning)" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Legacy)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    badge: "Nuanced & Thoughtful",
    tagline: "Claude 3.5 Sonnet & Haiku models",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-api03-...",
    defaultModel: "claude-3-5-sonnet-latest",
    models: [
      { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet (State-of-the-Art)" },
      { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku (Fast & Lightweight)" },
      { id: "claude-3-opus-latest", name: "Claude 3 Opus (Complex Analysis)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    badge: "Budget Friendly",
    tagline: "High-capability reasoning and general models at low cost",
    keyUrl: "https://platform.deepseek.com/api_keys",
    keyPlaceholder: "sk-...",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", name: "DeepSeek-V3 (Chat)" },
      { id: "deepseek-reasoner", name: "DeepSeek-R1 (Reasoner)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    badge: "European Open Weight",
    tagline: "Efficient open and frontier models from Mistral",
    keyUrl: "https://console.mistral.ai/api-keys/",
    keyPlaceholder: "...",
    defaultModel: "mistral-small-latest",
    models: [
      { id: "mistral-small-latest", name: "Mistral Small (Fast & Smart)" },
      { id: "mistral-large-latest", name: "Mistral Large (Flagship)" },
      { id: "open-mistral-nemo", name: "Mistral Nemo 12B" },
      { id: "codestral-latest", name: "Codestral (Code & Structure)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false
  },
  custom: {
    id: "custom",
    name: "Custom / Local AI (Ollama, LM Studio)",
    badge: "100% Offline & Private",
    tagline: "Any custom OpenAI-compatible server or local model runtime",
    keyUrl: "",
    keyPlaceholder: "Optional API key or leave blank",
    defaultEndpoint: "http://localhost:11434/v1/chat/completions",
    defaultModel: "llama3",
    models: [
      { id: "llama3", name: "llama3 (Ollama)" },
      { id: "mistral", name: "mistral (Ollama)" },
      { id: "qwen2.5", name: "qwen2.5 (Ollama)" },
      { id: "deepseek-r1:latest", name: "deepseek-r1:latest (Ollama)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: true
  }
};

/**
 * Universal caller function supporting all providers
 */
export async function callAiApi({
  provider = "gemini",
  model,
  apiKey,
  customEndpoint,
  systemPrompt = "You are ClarityAI, an elite executive AI consultation assistant. Analyze and summarize web content clearly, accurately, and thoroughly with structured markdown.",
  prompt,
  temperature = 0.2
}) {
  const providerConfig = PROVIDERS[provider] || PROVIDERS.gemini;
  const targetModel = (model && model.trim()) || providerConfig.defaultModel;

  // Rate limiting check
  if (!apiKey && provider !== "custom") {
    throw new Error(`Please provide an API key for ${providerConfig.name} in Settings.`);
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("No content provided to analyze.");
  }

  // 1. Google Gemini Native API
  if (provider === "gemini") {
    return await callGeminiApi({
      model: targetModel,
      apiKey: apiKey.trim(),
      systemPrompt,
      prompt,
      temperature
    });
  }

  // 2. Anthropic Claude Native Messages API
  if (provider === "anthropic") {
    return await callAnthropicApi({
      model: targetModel,
      apiKey: apiKey.trim(),
      systemPrompt,
      prompt,
      temperature
    });
  }

  // 3. OpenAI-Compatible Providers (OpenRouter, Groq, OpenAI, Mistral, DeepSeek, Custom)
  return await callOpenAiCompatibleApi({
    provider,
    model: targetModel,
    apiKey: apiKey ? apiKey.trim() : "",
    customEndpoint,
    systemPrompt,
    prompt,
    temperature
  });
}

/**
 * Gemini API implementation
 */
async function callGeminiApi({ model, apiKey, systemPrompt, prompt, temperature }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `${systemPrompt}\n\n${prompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: Number(temperature) || 0.2
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errMessage = `Gemini API returned HTTP ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData?.error?.message) {
        errMessage = errData.error.message;
      }
    } catch (_) {
      // fallback to statusText
    }
    handleProviderError(response.status, errMessage, "Google Gemini", model);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];

  if (candidate?.finishReason === "SAFETY") {
    throw new Error("Gemini blocked the response due to safety filters on this page's content.");
  }

  const parts = candidate?.content?.parts || [];
  const text = parts.map(p => p?.text || "").join("").trim();

  if (!text) {
    throw new Error("No response text returned by Gemini. Please try again with another model version.");
  }

  return text;
}

/**
 * Anthropic Messages API implementation
 */
async function callAnthropicApi({ model, apiKey, systemPrompt, prompt, temperature }) {
  const url = "https://api.anthropic.com/v1/messages";

  const body = {
    model: model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: Number(temperature) || 0.2
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errMessage = `Anthropic API returned HTTP ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.error?.message) {
        errMessage = errData.error.message;
      }
    } catch (_) {}
    handleProviderError(response.status, errMessage, "Anthropic Claude", model);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text?.trim();

  if (!text) {
    throw new Error("No response text returned by Anthropic Claude.");
  }

  return text;
}

/**
 * Unified OpenAI-Compatible API caller
 */
async function callOpenAiCompatibleApi({
  provider,
  model,
  apiKey,
  customEndpoint,
  systemPrompt,
  prompt,
  temperature
}) {
  let endpoint = "";
  const headers = { "Content-Type": "application/json" };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  switch (provider) {
    case "openrouter":
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      headers["HTTP-Referer"] = "https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme";
      headers["X-Title"] = "ClarityAI Browser Extension";
      break;
    case "groq":
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
      break;
    case "openai":
      endpoint = "https://api.openai.com/v1/chat/completions";
      break;
    case "deepseek":
      endpoint = "https://api.deepseek.com/chat/completions";
      break;
    case "mistral":
      endpoint = "https://api.mistral.ai/v1/chat/completions";
      break;
    case "custom":
      endpoint = customEndpoint?.trim() || "http://localhost:11434/v1/chat/completions";
      break;
    default:
      endpoint = "https://api.openai.com/v1/chat/completions";
  }

  const body = {
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: Number(temperature) || 0.2
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errMessage = `API request to ${provider} failed with HTTP ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.error?.message) {
        errMessage = errData.error.message;
      } else if (typeof errData?.error === "string") {
        errMessage = errData.error;
      }
    } catch (_) {}
    handleProviderError(response.status, errMessage, provider, model);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error(`No response generated by ${provider} model '${model}'.`);
  }

  return text;
}

/**
 * Translates HTTP status and raw errors into user-friendly instructions
 */
function handleProviderError(status, message, providerName, model) {
  if (status === 401 || status === 403 || message.toLowerCase().includes("invalid api key") || message.toLowerCase().includes("unauthorized")) {
    throw new Error(`Authentication Failed: Invalid or missing API key for ${providerName}. Please check your key in Settings.`);
  }

  if (status === 429 || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit")) {
    throw new Error(`Rate Limit or Quota Exceeded on ${providerName}. If you are using a free tier, please wait a minute, switch models, or use a free OpenRouter/Groq key.`);
  }

  if (status === 404 || message.toLowerCase().includes("model not found") || message.toLowerCase().includes("does not exist")) {
    throw new Error(`Model '${model}' was not found by ${providerName}. Please select or type an active model name in Settings.`);
  }

  if (status === 400) {
    throw new Error(`Invalid Request to ${providerName}: ${message}. Check your model version and parameters.`);
  }

  throw new Error(`Error from ${providerName} (${status}): ${message}`);
}
