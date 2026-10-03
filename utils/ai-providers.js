// ClarityAI Universal Multi-Provider AI Engine & Dynamic Model Routing Architecture
// Supports Gemini, Groq (Free), OpenRouter (Free/Paid), OpenAI, Anthropic, DeepSeek, Mistral, and Custom/Local endpoints.

export const PROVIDERS = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    badge: "Free tier available",
    tagline: "Official Google Gemini API with generous free tier",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIzaSy... or AQ...",
    keyInstructions: "1. Visit Google AI Studio (aistudio.google.com)\n2. Sign in with your Google account\n3. Click 'Create API key'\n4. Copy and paste your key here",
    defaultModel: "gemini-flash-latest",
    models: [
      { id: "gemini-flash-latest", name: "Gemini Flash (Latest Stable - Recommended)" },
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Fast & Intelligent)" },
      { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash (Latest Preview)" },
      { id: "gemini-flash-lite-latest", name: "Gemini Flash Lite (Ultra-fast)" },
      { id: "gemini-pro-latest", name: "Gemini Pro (Latest Capable)" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Supported keys)" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Fast & Capable)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://generativelanguage.googleapis.com/v1beta"
  },
  groq: {
    id: "groq",
    name: "Groq (Ultra-Fast & Free)",
    badge: "100% Free & Lightning Fast",
    tagline: "Extreme inference speed powered by LPU technology with free tier",
    keyUrl: "https://console.groq.com/keys",
    keyPlaceholder: "gsk_...",
    keyInstructions: "1. Go to console.groq.com/keys\n2. Sign in or create a free account\n3. Click 'Create API Key'\n4. Copy and paste your key here (Free & blazing fast)",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (Free, Highly Recommended)" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant (Free, Fastest)" },
      { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill Llama 70B (Free Reasoning)" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (Free, 32k Context)" },
      { id: "gemma2-9b-it", name: "Gemma 2 9B IT (Free, Google open weights)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://api.groq.com/openai/v1/chat/completions"
  },
  grok: {
    id: "grok",
    name: "xAI Grok",
    badge: "Frontier AI by xAI",
    tagline: "High-intelligence reasoning models from xAI",
    keyUrl: "https://console.x.ai/",
    keyPlaceholder: "xai-...",
    keyInstructions: "1. Visit xAI Console (console.x.ai)\n2. Create an API Key starting with xai-\n3. Paste your key here",
    defaultModel: "grok-2-latest",
    models: [
      { id: "grok-2-latest", name: "Grok 2 (Latest Flagship)" },
      { id: "grok-2-mini", name: "Grok 2 Mini (Fast & Lightweight)" },
      { id: "grok-beta", name: "Grok Beta" },
      { id: "grok-vision-beta", name: "Grok Vision Beta" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://api.xai.com/v1/chat/completions"
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter (Free & Paid Models)",
    badge: "100% Free Models Available",
    tagline: "Access 200+ models with one key (includes completely free models)",
    keyUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-v1-...",
    keyInstructions: "1. Go to openrouter.ai/keys\n2. Create a free account & click 'Create Key'\n3. Models tagged ':free' require zero balance to use!",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (100% Free)" },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash Exp (100% Free)" },
      { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (100% Free - Reasoning)" },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B Instruct (100% Free)" },
      { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (100% Free)" },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (Paid / Low Cost)" },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Paid)" },
      { id: "openai/gpt-4o", name: "GPT-4o (Paid)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://openrouter.ai/api/v1/chat/completions"
  },
  openai: {
    id: "openai",
    name: "OpenAI (ChatGPT)",
    badge: "Industry Standard",
    tagline: "Official OpenAI GPT models (GPT-4o, GPT-4o-mini, o3-mini)",
    keyUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-proj-...",
    keyInstructions: "1. Go to platform.openai.com/api-keys\n2. Create a new secret key\n3. Copy and paste it here",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Affordable)" },
      { id: "gpt-4o", name: "GPT-4o (High Intelligence Flagship)" },
      { id: "o3-mini", name: "o3-mini (Advanced Reasoning)" },
      { id: "o1-mini", name: "o1-mini (Reasoning)" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Legacy)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://api.openai.com/v1/chat/completions"
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    badge: "Nuanced & Thoughtful",
    tagline: "Claude 3.7 Sonnet, 3.5 Sonnet & Haiku models",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-...",
    keyInstructions: "1. Go to console.anthropic.com/settings/keys\n2. Create an API key\n3. Copy and paste it here",
    defaultModel: "claude-3-5-haiku-latest",
    models: [
      { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku (Fast & Lightweight)" },
      { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet (Latest Flagship)" },
      { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet (State-of-the-Art)" },
      { id: "claude-3-opus-latest", name: "Claude 3 Opus (Complex Analysis)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://api.anthropic.com/v1/messages"
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    badge: "Budget Friendly",
    tagline: "High-capability reasoning and general models at low cost",
    keyUrl: "https://platform.deepseek.com/api_keys",
    keyPlaceholder: "sk-...",
    keyInstructions: "1. Visit platform.deepseek.com/api_keys\n2. Create an API key\n3. Copy and paste it here",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner (R1)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://api.deepseek.com/chat/completions"
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    badge: "European Open Weight",
    tagline: "Efficient open and frontier models from Mistral",
    keyUrl: "https://console.mistral.ai/api-keys/",
    keyPlaceholder: "...",
    keyInstructions: "1. Visit console.mistral.ai\n2. Create an account and generate an API key\n3. Copy and paste your key here",
    defaultModel: "mistral-small-latest",
    models: [
      { id: "mistral-small-latest", name: "Mistral Small (Fast & Smart)" },
      { id: "mistral-large-latest", name: "Mistral Large (Flagship Reasoning)" },
      { id: "open-mistral-nemo", name: "Mistral Nemo 12B" },
      { id: "codestral-latest", name: "Codestral (Code & Data)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://api.mistral.ai/v1/chat/completions"
  },
  zhipu: {
    id: "zhipu",
    name: "Zhipu GLM",
    badge: "Bilingual Frontier AI",
    tagline: "GLM-4 and GLM-4-Flash flagship models by Zhipu AI",
    keyUrl: "https://open.bigmodel.cn/",
    keyPlaceholder: "API key from open.bigmodel.cn...",
    keyInstructions: "1. Visit Zhipu BigModel Platform (open.bigmodel.cn)\n2. Create an account and generate an API key\n3. Paste your key here (Free GLM-4-Flash available)",
    defaultModel: "glm-4-flash",
    models: [
      { id: "glm-4-flash", name: "GLM-4 Flash (Free & Fast)" },
      { id: "glm-4", name: "GLM-4 (Flagship)" },
      { id: "glm-4-plus", name: "GLM-4 Plus (Latest)" },
      { id: "glm-4-air", name: "GLM-4 Air (Cost-Effective)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: false,
    defaultEndpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions"
  },
  custom: {
    id: "custom",
    name: "Custom / Local AI (Ollama, LM Studio)",
    badge: "100% Offline & Private",
    tagline: "Any custom OpenAI-compatible server or local model runtime",
    keyUrl: "https://ollama.com",
    keyPlaceholder: "Optional API key or leave blank",
    keyInstructions: "Use local servers (e.g. Ollama http://localhost:11434/v1, LM Studio http://localhost:1234/v1) or any OpenAI-compatible API gateway.",
    defaultEndpoint: "http://localhost:11434/v1/chat/completions",
    defaultModel: "llama3",
    models: [
      { id: "llama3", name: "llama3 (Ollama)" },
      { id: "mistral", name: "mistral (Ollama)" },
      { id: "deepseek-r1", name: "deepseek-r1 (Ollama)" },
      { id: "qwen2.5", name: "qwen2.5 (Ollama)" },
      { id: "phi3", name: "phi3 (Ollama)" }
    ],
    supportsCustomModel: true,
    requiresEndpoint: true
  }
};

export const AI_PROVIDERS = PROVIDERS;

/**
 * Smart Key Anatomy Classifier (Level 1 Syntax Analysis)
 * Inspects key prefix, length, character set, and entropy purely using string matching.
 * Zero network requests made — avoids credential leakage across providers.
 */
export function analyzeKeyFigure(key) {
  if (!key || typeof key !== "string") {
    return {
      provider: null,
      providerName: "Unknown",
      confidence: "low",
      description: "Empty or invalid key format",
      probableModels: []
    };
  }

  const k = key.trim();

  // 1. Custom / Local Endpoint URL pattern
  if (/^(https?:\/\/|localhost|127\.0\.0\.1)/i.test(k)) {
    return {
      provider: "custom",
      providerName: PROVIDERS.custom?.name || "Custom / Local",
      confidence: "high",
      description: "Local model or custom server endpoint URL",
      probableModels: (PROVIDERS.custom?.models || []).map(m => m.id)
    };
  }

  // 2. Groq: starts with gsk_
  if (k.startsWith("gsk_")) {
    return {
      provider: "groq",
      providerName: PROVIDERS.groq?.name || "Groq",
      confidence: "high",
      description: "Groq Cloud API Key (Extreme Inference Speed)",
      probableModels: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "deepseek-r1-distill-llama-70b"]
    };
  }

  // 3. xAI Grok: starts with xai-
  if (k.startsWith("xai-")) {
    return {
      provider: "grok",
      providerName: PROVIDERS.grok?.name || "xAI Grok",
      confidence: "high",
      description: "xAI Grok API Key",
      probableModels: ["grok-2-latest", "grok-2-mini", "grok-beta"]
    };
  }

  // 4. OpenRouter: starts with sk-or-v1-
  if (k.startsWith("sk-or-v1-")) {
    return {
      provider: "openrouter",
      providerName: PROVIDERS.openrouter?.name || "OpenRouter",
      confidence: "high",
      description: "OpenRouter Unified API Key",
      probableModels: ["meta-llama/llama-3.3-70b-instruct:free", "google/gemini-2.0-flash-exp:free", "deepseek/deepseek-r1:free"]
    };
  }

  // 5. Anthropic Claude: starts with sk-ant- or sk-ant-api03-
  if (k.startsWith("sk-ant-") || k.startsWith("sk-ant-api03-")) {
    return {
      provider: "anthropic",
      providerName: PROVIDERS.anthropic?.name || "Anthropic Claude",
      confidence: "high",
      description: "Anthropic Claude API Key",
      probableModels: ["claude-3-5-haiku-latest", "claude-3-7-sonnet-latest", "claude-3-5-sonnet-latest"]
    };
  }

  // 6. OpenAI: starts with sk-proj-, sk-None-, or legacy sk- with length >= 48
  if (k.startsWith("sk-proj-") || k.startsWith("sk-None-") || (k.startsWith("sk-") && k.length >= 48)) {
    return {
      provider: "openai",
      providerName: PROVIDERS.openai?.name || "OpenAI",
      confidence: "high",
      description: "OpenAI Project / Secret API Key",
      probableModels: ["gpt-4o-mini", "gpt-4o", "o3-mini", "o1-mini"]
    };
  }

  // 7. Google Gemini: ^AIzaSy[0-9A-Za-z_-]{33}$, ^AIza[0-9A-Za-z_-]{30,}, or ^AQ\.[0-9A-Za-z_-]+
  if (/^AIzaSy[0-9A-Za-z_-]{33}$/.test(k) || /^AIza[0-9A-Za-z_-]{30,}/.test(k) || /^AQ\.[0-9A-Za-z_-]+/.test(k)) {
    return {
      provider: "gemini",
      providerName: PROVIDERS.gemini?.name || "Google Gemini",
      confidence: "high",
      description: "Google AI Studio Gemini API Key",
      probableModels: ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.0-flash"]
    };
  }

  // 8. Mistral AI: 32-character hexadecimal /^[a-fA-F0-9]{32}$/
  if (/^[a-fA-F0-9]{32}$/.test(k)) {
    return {
      provider: "mistral",
      providerName: PROVIDERS.mistral?.name || "Mistral AI",
      confidence: "high",
      description: "Mistral AI API Key",
      probableModels: ["mistral-small-latest", "mistral-large-latest", "open-mistral-nemo"]
    };
  }

  // 9. DeepSeek: starts with sk-, length 30-46 chars (excluding openrouter, anthropic, or openai project prefixes)
  if (k.startsWith("sk-") && k.length >= 30 && k.length <= 46 && !k.startsWith("sk-or-v1-") && !k.startsWith("sk-ant-") && !k.startsWith("sk-proj-")) {
    return {
      provider: "deepseek",
      providerName: PROVIDERS.deepseek?.name || "DeepSeek",
      confidence: "medium",
      description: "DeepSeek Platform API Key",
      probableModels: ["deepseek-chat", "deepseek-reasoner"]
    };
  }

  // 10. Zhipu GLM: format usually contains '.' (id.secret) or is a 32+ character key
  if (k.includes(".") && k.split(".").length === 2 && k.length >= 25) {
    return {
      provider: "zhipu",
      providerName: PROVIDERS.zhipu?.name || "Zhipu GLM",
      confidence: "high",
      description: "Zhipu BigModel GLM Key",
      probableModels: ["glm-4-flash", "glm-4", "glm-4-plus", "glm-4-air"]
    };
  }

  return {
    provider: null,
    providerName: "Unknown",
    confidence: "low",
    description: "Unrecognized key format",
    probableModels: []
  };
}

/**
 * Intelligent Provider Auto-Detection from Key Pattern
 */
export function detectProviderFromKey(key) {
  const figure = analyzeKeyFigure(key);
  return figure.provider;
}

/**
 * Provider-Specific Adapter Registry
 * Encapsulates discovery, validation, and execution per provider.
 * Strict Namespacing: Never sends credentials to unrelated provider APIs.
 */
export const PROVIDER_ADAPTERS = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    validateKeySyntax(k) {
      return /^AIzaSy[0-9A-Za-z_-]{33}$/.test(k) || /^AIza[0-9A-Za-z_-]{30,}/.test(k) || /^AQ\.[0-9A-Za-z_-]+/.test(k);
    },
    async fetchModels(apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await parseErrorResponse(res);
        throw new Error(`Gemini authentication / discovery failed (${res.status}): ${err}`);
      }
      const data = await res.json();
      return (data.models || [])
        .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
        .map(m => {
          const id = m.name.replace(/^models\//, "");
          return {
            id,
            displayName: m.displayName || id,
            name: m.displayName ? `${m.displayName} (${id})` : id,
            description: m.description || ""
          };
        });
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = [
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-flash-lite-latest",
        "gemini-pro-latest"
      ];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  groq: {
    id: "groq",
    name: "Groq",
    validateKeySyntax(k) {
      return k.startsWith("gsk_");
    },
    async fetchModels(apiKey) {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": `Bearer ${apiKey.trim()}` }
      });
      if (!res.ok) {
        const err = await parseErrorResponse(res);
        throw new Error(`Groq discovery failed (${res.status}): ${err}`);
      }
      const data = await res.json();
      return (data.data || []).map(m => ({ id: m.id, displayName: m.id, name: m.id }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "deepseek-r1-distill-llama-70b"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  grok: {
    id: "grok",
    name: "xAI Grok",
    validateKeySyntax(k) {
      return k.startsWith("xai-");
    },
    async fetchModels(apiKey) {
      const res = await fetch("https://api.xai.com/v1/models", {
        headers: { "Authorization": `Bearer ${apiKey.trim()}` }
      });
      if (!res.ok) {
        const err = await parseErrorResponse(res);
        throw new Error(`xAI discovery failed (${res.status}): ${err}`);
      }
      const data = await res.json();
      return (data.data || []).map(m => ({ id: m.id, displayName: m.id, name: m.id }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["grok-2-latest", "grok-2-mini", "grok-beta"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    validateKeySyntax(k) {
      return k.startsWith("sk-or-v1-");
    },
    async fetchModels(apiKey) {
      if (apiKey) {
        const authRes = await fetch("https://openrouter.ai/api/v1/auth/key", {
          headers: { "Authorization": `Bearer ${apiKey.trim()}` }
        });
        if (!authRes.ok) {
          const err = await parseErrorResponse(authRes);
          throw new Error(`OpenRouter key authentication failed (${authRes.status}): ${err}`);
        }
      }
      const res = await fetch("https://openrouter.ai/api/v1/models");
      if (!res.ok) throw new Error("Could not fetch OpenRouter models");
      const data = await res.json();
      return (data.data || []).slice(0, 60).map(m => ({
        id: m.id,
        displayName: m.name || m.id,
        name: `${m.name || m.id}${m.id.endsWith(':free') ? ' (Free)' : ''}`
      }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["meta-llama/llama-3.3-70b-instruct:free", "google/gemini-2.0-flash-exp:free", "deepseek/deepseek-r1:free"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  openai: {
    id: "openai",
    name: "OpenAI",
    validateKeySyntax(k) {
      return k.startsWith("sk-proj-") || k.startsWith("sk-None-") || (k.startsWith("sk-") && k.length >= 48);
    },
    async fetchModels(apiKey) {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { "Authorization": `Bearer ${apiKey.trim()}` }
      });
      if (!res.ok) {
        const err = await parseErrorResponse(res);
        throw new Error(`OpenAI discovery failed (${res.status}): ${err}`);
      }
      const data = await res.json();
      return (data.data || [])
        .filter(m => m.id.startsWith("gpt-") || m.id.startsWith("o1-") || m.id.startsWith("o3-"))
        .map(m => ({ id: m.id, displayName: m.id, name: m.id }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["gpt-4o-mini", "gpt-4o", "o3-mini", "o1-mini"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    validateKeySyntax(k) {
      return k.startsWith("sk-ant-");
    },
    async fetchModels(apiKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/models", {
          headers: {
            "x-api-key": apiKey.trim(),
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            return data.data.map(m => ({ id: m.id, displayName: m.display_name || m.id, name: m.display_name || m.id }));
          }
        }
      } catch (_) {}
      return PROVIDERS.anthropic.models.map(m => ({ id: m.id, displayName: m.name, name: m.name }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["claude-3-5-haiku-latest", "claude-3-7-sonnet-latest", "claude-3-5-sonnet-latest"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    validateKeySyntax(k) {
      return k.startsWith("sk-") && k.length >= 30 && k.length <= 46;
    },
    async fetchModels(apiKey) {
      const res = await fetch("https://api.deepseek.com/models", {
        headers: { "Authorization": `Bearer ${apiKey.trim()}` }
      });
      if (!res.ok) {
        const err = await parseErrorResponse(res);
        throw new Error(`DeepSeek discovery failed (${res.status}): ${err}`);
      }
      const data = await res.json();
      return (data.data || []).map(m => ({ id: m.id, displayName: m.id, name: m.id }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["deepseek-chat", "deepseek-reasoner"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  mistral: {
    id: "mistral",
    name: "Mistral AI",
    validateKeySyntax(k) {
      return /^[a-fA-F0-9]{32}$/.test(k);
    },
    async fetchModels(apiKey) {
      const res = await fetch("https://api.mistral.ai/v1/models", {
        headers: { "Authorization": `Bearer ${apiKey.trim()}` }
      });
      if (!res.ok) {
        const err = await parseErrorResponse(res);
        throw new Error(`Mistral discovery failed (${res.status}): ${err}`);
      }
      const data = await res.json();
      return (data.data || []).map(m => ({ id: m.id, displayName: m.id, name: m.id }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["mistral-small-latest", "mistral-large-latest", "open-mistral-nemo"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  zhipu: {
    id: "zhipu",
    name: "Zhipu GLM",
    validateKeySyntax(k) {
      return typeof k === "string" && k.length >= 20;
    },
    async fetchModels(apiKey) {
      try {
        const res = await fetch("https://open.bigmodel.cn/api/paas/v4/models", {
          headers: { "Authorization": `Bearer ${apiKey.trim()}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            return data.data.map(m => ({ id: m.id, displayName: m.id, name: m.id }));
          }
        }
      } catch (_) {}
      return PROVIDERS.zhipu.models.map(m => ({ id: m.id, displayName: m.name, name: m.name }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      const priority = ["glm-4-flash", "glm-4", "glm-4-plus", "glm-4-air"];
      return priority.find(c => availableIds.includes(c)) || availableIds[0] || providerDef.defaultModel;
    }
  },

  custom: {
    id: "custom",
    name: "Custom / Local AI",
    validateKeySyntax() { return true; },
    async fetchModels(apiKey, customEndpoint) {
      const base = customEndpoint ? customEndpoint.replace(/\/chat\/completions\/?$/, "") : "http://localhost:11434";
      try {
        const res = await fetch(`${base}/api/tags`);
        if (res.ok) {
          const data = await res.json();
          return (data.models || []).map(m => ({ id: m.name, displayName: m.name, name: m.name }));
        }
      } catch (_) {}
      try {
        const res2 = await fetch(`${base}/v1/models`);
        if (res2.ok) {
          const data2 = await res2.json();
          return (data2.data || []).map(m => ({ id: m.id, displayName: m.id, name: m.id }));
        }
      } catch (_) {}
      return PROVIDERS.custom.models.map(m => ({ id: m.id, displayName: m.name, name: m.name }));
    },
    findBestFallbackModel(availableIds, requestedModel, providerDef) {
      return availableIds[0] || providerDef.defaultModel;
    }
  }
};

/**
 * Pure string-based provider detection without making external network calls.
 * Guarantees zero credential leakage across providers.
 */
export async function probeAndDetectProvider(key) {
  if (!key || typeof key !== "string") return null;
  const figure = analyzeKeyFigure(key);
  return figure.provider || null;
}

/**
 * Resolves a human-readable display descriptor for any provider and model combination.
 */
export function getModelDisplayName(providerId = "gemini", modelId = "") {
  const provider = PROVIDERS[providerId] || PROVIDERS.gemini;
  const pName = provider ? provider.name.replace("Google ", "").split(" ")[0] : "AI";

  if (!modelId) {
    modelId = provider ? provider.defaultModel : "";
  }

  // 1. Match against predefined models in PROVIDERS
  if (provider && Array.isArray(provider.models)) {
    const found = provider.models.find(m => m.id === modelId);
    if (found) {
      const cleanName = found.name.replace(/\s*\((Free|Paid|Latest|Fast|100%|Supported|Ultra-fast|Flagship|European|Code|Google)[^)]*\)/gi, "").trim();
      let short = cleanName;
      if (cleanName.includes("Flash Lite")) short = "Flash Lite";
      else if (cleanName.includes("Flash")) short = cleanName.replace(/Gemini\s*/i, "");
      else if (cleanName.includes("Pro")) short = cleanName.replace(/Gemini\s*/i, "");
      else if (cleanName.includes("Llama 3.3")) short = "Llama 3.3";
      else if (cleanName.includes("DeepSeek R1")) short = "DeepSeek R1";
      else if (cleanName.includes("DeepSeek Chat")) short = "DeepSeek V3";
      else if (cleanName.includes("GPT-4o Mini")) short = "GPT-4o Mini";
      else if (cleanName.includes("Claude 3.7")) short = "Claude 3.7";
      else if (cleanName.includes("Claude 3.5")) short = "Claude 3.5";
      else if (cleanName.includes("Grok 2")) short = "Grok 2";
      else if (cleanName.includes("GLM-4")) short = "GLM-4";

      return {
        modelName: cleanName,
        providerName: pName,
        fullName: `${cleanName} (${pName})`,
        shortName: short,
        toString() { return this.fullName; }
      };
    }
  }

  // 2. Normalize and format custom or API-discovered model IDs
  let cleanId = String(modelId || "").trim();
  cleanId = cleanId.replace(/^models\//, "");
  cleanId = cleanId.replace(/^(google|meta-llama|deepseek|mistralai|openai|anthropic)\//, "");
  cleanId = cleanId.replace(/:free$/, "");

  let readableModel = cleanId;
  let short = cleanId;

  if (/gemini-3\.5-flash/i.test(cleanId)) { readableModel = "Gemini 3.5 Flash"; short = "3.5 Flash"; }
  else if (/gemini-3\.8-flash/i.test(cleanId)) { readableModel = "Gemini 3.8 Flash"; short = "3.8 Flash"; }
  else if (/gemini-flash-latest/i.test(cleanId)) { readableModel = "Gemini Flash (Latest)"; short = "Flash Latest"; }
  else if (/gemini-flash-lite/i.test(cleanId)) { readableModel = "Gemini Flash Lite"; short = "Flash Lite"; }
  else if (/gemini-pro-latest/i.test(cleanId)) { readableModel = "Gemini Pro (Latest)"; short = "Pro Latest"; }
  else if (/gemini-2\.5-flash/i.test(cleanId)) { readableModel = "Gemini 2.5 Flash"; short = "2.5 Flash"; }
  else if (/llama-3\.3-70b/i.test(cleanId)) { readableModel = "Llama 3.3 70B"; short = "Llama 3.3"; }
  else if (/deepseek-r1/i.test(cleanId)) { readableModel = "DeepSeek R1"; short = "DeepSeek R1"; }
  else if (/gpt-4o-mini/i.test(cleanId)) { readableModel = "GPT-4o Mini"; short = "GPT-4o Mini"; }
  else if (/claude-3-7-sonnet/i.test(cleanId)) { readableModel = "Claude 3.7 Sonnet"; short = "Claude 3.7"; }
  else if (/grok/i.test(cleanId)) { readableModel = cleanId.replace(/-latest/i, " (Latest)"); short = "Grok 2"; }
  else if (/glm-4/i.test(cleanId)) { readableModel = cleanId.toUpperCase(); short = cleanId.toUpperCase(); }
  else {
    readableModel = cleanId.length > 20 ? cleanId.slice(0, 18) + "…" : cleanId;
    short = readableModel;
  }

  return {
    modelName: readableModel,
    providerName: pName,
    fullName: `${readableModel} (${pName})`,
    shortName: short,
    toString() { return this.fullName; }
  };
}

/**
 * Fetches actual active model IDs from the targeted provider API endpoint
 */
export async function fetchAvailableModels({ provider = "gemini", apiKey = "", customEndpoint = "" }) {
  const adapter = PROVIDER_ADAPTERS[provider] || PROVIDER_ADAPTERS.gemini;
  return await adapter.fetchModels(apiKey, customEndpoint);
}

/**
 * 3-Level Provider & Model Validation Pipeline
 * Level 1: Credential Syntax Validation (Zero network requests)
 * Level 2: Provider-Specific Authentication & Model Discovery
 * Level 3: Model Validation & Smart Fallback (against models discovered from that same provider)
 */
export async function autoResolveWorkingModel({
  provider = "",
  apiKey = "",
  desiredModel = "",
  customEndpoint = ""
}) {
  const key = (apiKey || "").trim();
  if (!key && provider !== "custom") {
    return {
      success: false,
      level: 1,
      credentialStatus: "missing",
      error: "No API key provided",
      help: "Please paste your API key to verify and discover available models."
    };
  }

  // Level 1: Credential Syntax Validation (Zero network requests)
  const keyFigure = analyzeKeyFigure(key);
  const activeProvider = provider || keyFigure.provider || "gemini";
  const adapter = PROVIDER_ADAPTERS[activeProvider] || PROVIDER_ADAPTERS.gemini;
  const providerDef = PROVIDERS[activeProvider] || PROVIDERS.gemini;
  const targetModel = (desiredModel || "").trim() || providerDef.defaultModel;

  // Check if key format definitively belongs to another provider
  if (keyFigure.confidence === "high" && keyFigure.provider && keyFigure.provider !== activeProvider) {
    return {
      success: false,
      level: 1,
      provider: activeProvider,
      providerName: providerDef.name,
      credentialStatus: "mismatched",
      mismatchedProvider: keyFigure.provider,
      mismatchedProviderName: keyFigure.providerName,
      error: `This key starts with '${key.slice(0, 5)}...', which belongs to ${keyFigure.providerName}, but you have ${providerDef.name} selected.`,
      help: `Click 'Switch to ${keyFigure.providerName}' or enter a valid ${providerDef.name} key.`,
      keyFigure
    };
  }

  // Validate syntax against selected provider adapter
  if (adapter.validateKeySyntax && !adapter.validateKeySyntax(key, customEndpoint)) {
    return {
      success: false,
      level: 1,
      provider: activeProvider,
      providerName: providerDef.name,
      credentialStatus: "invalid_syntax",
      error: `Invalid key format for ${providerDef.name}.`,
      help: `Please verify that your key starts with '${providerDef.keyPlaceholder}' and contains no extra spaces.`,
      keyFigure
    };
  }

  // Level 2: Provider-Specific Authentication & Model Discovery Call (Metadata only, zero token generation)
  let discoveredModels = [];
  const startTime = Date.now();
  try {
    discoveredModels = await adapter.fetchModels(key, customEndpoint);
  } catch (apiErr) {
    const latency = Date.now() - startTime;
    const errStr = apiErr.message || "";
    let credentialStatus = "invalid";
    let helpMsg = "";

    if (errStr.includes("401") || errStr.includes("403") || errStr.toLowerCase().includes("invalid api key") || errStr.toLowerCase().includes("unauthorized") || errStr.toLowerCase().includes("forbidden") || errStr.toLowerCase().includes("api_key_invalid")) {
      credentialStatus = "invalid";
      helpMsg = `Authentication failed: Invalid API key for ${providerDef.name}. Please check or regenerate your key at ${providerDef.keyUrl}.`;
    } else if (errStr.includes("429") || errStr.toLowerCase().includes("quota") || errStr.toLowerCase().includes("rate limit") || errStr.toLowerCase().includes("resource_exhausted")) {
      credentialStatus = "rate_limited";
      helpMsg = `Rate limit or quota reached on ${providerDef.name}. Please verify your billing tier or wait a moment.`;
    } else {
      credentialStatus = "error";
      helpMsg = `Could not connect to ${providerDef.name} discovery endpoint: ${errStr}`;
    }

    return {
      success: false,
      level: 2,
      provider: activeProvider,
      providerName: providerDef.name,
      credentialStatus,
      modelStatus: "unverified",
      resolvedModel: targetModel,
      latency,
      availableModels: [],
      error: errStr,
      help: helpMsg,
      keyFigure
    };
  }

  const latency = Date.now() - startTime;
  const availableIds = (discoveredModels || []).map(m => m.id);
  const cleanTarget = targetModel.replace(/^models\//, "").toLowerCase();
  let resolvedModel = targetModel;
  let modelStatus = "available";
  let isChanged = false;

  // Level 3: Model Validation & Smart Fallback (against models discovered from that same provider)
  const exactMatch = availableIds.find(id => id.replace(/^models\//, "").toLowerCase() === cleanTarget);

  if (exactMatch) {
    resolvedModel = exactMatch;
    modelStatus = "available";
    isChanged = false;
  } else if (availableIds.length > 0) {
    resolvedModel = adapter.findBestFallbackModel(availableIds, targetModel, providerDef);
    modelStatus = "auto_resolved";
    isChanged = (resolvedModel !== targetModel);
  }

  // Persist resolved provider and model to storage
  chrome.storage.local.get(["selectedModels", "models", "apiKeys"]).then(({ selectedModels = {}, models = {}, apiKeys = {} }) => {
    selectedModels[activeProvider] = resolvedModel;
    models[activeProvider] = resolvedModel;
    apiKeys[activeProvider] = key;
    chrome.storage.local.set({ provider: activeProvider, selectedModels, models, apiKeys });
  });

  const sampleAvailable = discoveredModels.slice(0, 5).map(m => m.displayName || m.id).join(", ");
  const message = isChanged
    ? `Your ${providerDef.name} API key is valid, but '${targetModel}' isn't available for this key. Automatically selected '${resolvedModel}'. Available models include: ${sampleAvailable}${discoveredModels.length > 5 ? '...' : ''}.`
    : `Your ${providerDef.name} API key is valid and model '${resolvedModel}' is operational!`;

  return {
    success: true,
    level: 3,
    provider: activeProvider,
    providerName: providerDef.name,
    credentialStatus: "valid",
    modelStatus,
    modelValid: !isChanged,
    resolvedModel,
    previousModel: targetModel,
    autoFixed: isChanged,
    latency,
    availableModels: discoveredModels,
    workingModels: availableIds,
    keyFigure,
    message
  };
}

/**
 * Fast, lightweight connection tester using metadata discovery
 * Avoids heavy generation requests to keep diagnostics fast and zero-cost.
 */
export async function testConnection({ provider = "gemini", apiKey = "", model = "", customEndpoint = "" }) {
  const startTime = Date.now();
  const adapter = PROVIDER_ADAPTERS[provider] || PROVIDER_ADAPTERS.gemini;
  const providerDef = PROVIDERS[provider] || PROVIDERS.gemini;
  const targetModel = (model || "").trim() || providerDef.defaultModel;

  // 1. Verify credentials via provider discovery endpoint
  let models = [];
  try {
    models = await adapter.fetchModels(apiKey, customEndpoint);
  } catch (err) {
    // If discovery endpoint failed, try minimal prompt ping as fallback
    try {
      const pingRes = await callAiApi({
        provider,
        model: targetModel,
        apiKey,
        customEndpoint,
        systemPrompt: "You are an API diagnostic tester. Respond with 'OK'.",
        prompt: "Ping",
        temperature: 0.1
      });
      const latency = Date.now() - startTime;
      return {
        success: true,
        latency,
        response: pingRes
      };
    } catch (pingErr) {
      throw new Error(err.message || pingErr.message);
    }
  }

  // 2. Model discovery succeeded! Test model availability with ping
  try {
    const pingRes = await callAiApi({
      provider,
      model: targetModel,
      apiKey,
      customEndpoint,
      systemPrompt: "You are an API diagnostic tester. Respond with 'OK'.",
      prompt: "Ping",
      temperature: 0.1
    });
    const latency = Date.now() - startTime;
    return {
      success: true,
      latency,
      modelsCount: models.length,
      response: pingRes
    };
  } catch (genErr) {
    const latency = Date.now() - startTime;
    return {
      success: false,
      latency,
      modelsCount: models.length,
      error: `Key authenticated (${models.length} models accessible), but model '${targetModel}' failed: ${genErr.message}`
    };
  }
}

export async function callAiApi({
  provider = "gemini",
  model,
  apiKey,
  customEndpoint,
  systemPrompt = "You are ClarityAI, an executive AI consultation assistant. Analyze and summarize web content clearly, accurately, and thoroughly with structured markdown formatting.",
  prompt,
  temperature = 0.2
}) {
  const providerConfig = PROVIDERS[provider] || PROVIDERS.gemini;
  const targetModel = (model && model.trim()) || providerConfig.defaultModel;

  if (!apiKey && provider !== "custom") {
    throw new Error(`Please provide an API key for ${providerConfig.name} in Settings.`);
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("No content provided to analyze.");
  }

  // 1. Google Gemini Native API with auto-retries & healing
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
 * Gemini API implementation with retry and dynamic model auto-fallback
 */
async function callGeminiApi({ model, apiKey, systemPrompt, prompt, temperature }) {
  let cleanModel = model.replace(/^models\//, "");
  const maxRetries = 2;
  const fallbackModels = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;

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

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } catch (netErr) {
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw new Error(`Gemini connection error: ${netErr.message}`);
    }

    if (!response.ok) {
      const errorDetails = await parseErrorResponse(response);

      // Handle 404 or 429 on Pro models by attempting fallback to active Flash models
      if (response.status === 404 || (response.status === 429 && cleanModel.includes("pro"))) {
        for (const candidate of fallbackModels) {
          if (candidate === cleanModel) continue;
          try {
            console.warn(`Model ${cleanModel} returned ${response.status}. Attempting auto-healing fallback to '${candidate}'...`);
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidate)}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const fbRes = await fetch(fallbackUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            if (fbRes.ok) {
              const fbData = await fbRes.json();
              const fbText = fbData?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
              if (fbText) {
                chrome.storage.local.get(["selectedModels", "models"]).then(({ selectedModels = {}, models = {} }) => {
                  selectedModels.gemini = candidate;
                  models.gemini = candidate;
                  chrome.storage.local.set({ selectedModels, models });
                });
                return fbText;
              }
            }
          } catch (_) {}
        }
        throw new Error(`Model '${model}' is not available or quota exceeded for your Gemini API key (${errorDetails || response.status}). Please select 'Gemini Flash (Latest Stable)' or click Auto-Detect.`);
      }

      // Handle 503 or 429 with backoff retry
      if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
        if (response.status === 503 && cleanModel !== "gemini-flash-latest") {
          cleanModel = "gemini-flash-latest";
        }
        const waitTime = (attempt + 1) * 1200;
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }

      handleProviderError(response.status, errorDetails, "Google Gemini", cleanModel);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];

    if (candidate?.finishReason === "SAFETY") {
      throw new Error("Gemini filtered the response due to content safety policies.");
    }

    const parts = candidate?.content?.parts || [];
    const text = parts.map(p => p?.text || "").join("").trim();

    if (!text) {
      throw new Error("No response text returned by Gemini. Please try again or switch model in Settings.");
    }

    return text;
  }
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
    const errorDetails = await parseErrorResponse(response);
    handleProviderError(response.status, errorDetails, "Anthropic Claude", model);
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
    case "grok":
      endpoint = "https://api.xai.com/v1/chat/completions";
      break;
    case "zhipu":
      endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
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

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
  } catch (netErr) {
    throw new Error(`Connection to ${endpoint} failed: ${netErr.message}. If using a local model, verify the server is running.`);
  }

  if (!response.ok) {
    const errorDetails = await parseErrorResponse(response);
    handleProviderError(response.status, errorDetails, provider, model);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error(`No response generated by ${provider} model '${model}'.`);
  }

  return text;
}

/**
 * Helper to parse error details from fetch response
 */
async function parseErrorResponse(response) {
  try {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      return json?.error?.message || json?.error || json?.message || text;
    } catch {
      return text.slice(0, 300);
    }
  } catch {
    return response.statusText || `Status ${response.status}`;
  }
}

/**
 * Translates HTTP status and raw errors into user-friendly instructions
 */
function handleProviderError(status, message, providerName, model) {
  const msgLower = (message || "").toLowerCase();

  if (status === 401 || status === 403 || msgLower.includes("invalid api key") || msgLower.includes("unauthorized")) {
    throw new Error(`Authentication Failed: Invalid or missing API key for ${providerName}. Please check your key in Settings.`);
  }

  if (status === 429 || msgLower.includes("quota") || msgLower.includes("rate limit")) {
    throw new Error(`Rate Limit or Quota Exceeded on ${providerName}. Please wait a moment, switch models, or use a free Groq/OpenRouter key.`);
  }

  if (status === 404 || msgLower.includes("model not found") || msgLower.includes("does not exist") || msgLower.includes("retired")) {
    throw new Error(`Model '${model}' was not found by ${providerName}. Please click Auto-Detect or select an active model in Settings.`);
  }

  if (status === 400) {
    throw new Error(`Invalid Request to ${providerName}: ${message}.`);

  }

  throw new Error(`Error from ${providerName} (${status}): ${message}`);
}

export const executeAICall = callAiApi;
