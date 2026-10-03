import { PROVIDERS, AI_PROVIDERS, detectProviderFromKey, analyzeKeyFigure, probeAndDetectProvider, autoResolveWorkingModel, fetchAvailableModels, testConnection } from "../utils/ai-providers.js";
import { checkForUpdates, syncLocalDirectory, downloadUpdatePackage, GITHUB_REPO_URL } from "../utils/updater.js";

// DOM Elements
const providerSelect = document.getElementById("providerSelect");
const providerTagline = document.getElementById("providerTagline");
const activeProviderBadge = document.getElementById("activeProviderBadge");

const modelInput = document.getElementById("modelInput");
const modelSuggestionsList = document.getElementById("modelSuggestionsList");
const autoResolveModelBtn = document.getElementById("autoResolveModelBtn");
const modelAutoFixNotice = document.getElementById("modelAutoFixNotice");

const apiKeyContainer = document.getElementById("apiKeyContainer");
const apiKeyInput = document.getElementById("apiKeyInput");
const toggleApiKeyVisibility = document.getElementById("toggleApiKeyVisibility");
const keyDetectedNotice = document.getElementById("keyDetectedNotice");
const keyGuideBox = document.getElementById("keyGuideBox");
const guideTitle = document.getElementById("guideTitle");
const guideContent = document.getElementById("guideContent");
const apiKeyRequiredLabel = document.getElementById("apiKeyRequiredLabel");

const customEndpointContainer = document.getElementById("customEndpointContainer");
const customEndpointInput = document.getElementById("customEndpointInput");

const testConnectionBtn = document.getElementById("testConnectionBtn");
const testBtnText = document.getElementById("testBtnText");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const diagnosticCard = document.getElementById("diagnosticCard");
const statusBanner = document.getElementById("statusBanner");

const defaultModeSelect = document.getElementById("defaultModeSelect");
const temperatureRange = document.getElementById("temperatureRange");
const tempValueLabel = document.getElementById("tempValueLabel");
const customSystemPrompt = document.getElementById("customSystemPrompt");
const savePreferencesBtn = document.getElementById("savePreferencesBtn");

// Local in-memory state
let currentProvider = "gemini";
let storedApiKeys = {};
let storedSelectedModels = {};
let storedCustomEndpoints = {};

// Initialize on Load
document.addEventListener("DOMContentLoaded", async () => {
  populateProviders();
  await loadStoredSettings();
  setupEventListeners();
  setupSidebarNav();
  setupUpdateEngine();
});

// Populate provider dropdown
function populateProviders() {
  providerSelect.innerHTML = "";
  Object.values(PROVIDERS).forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.name} (${p.badge})`;
    providerSelect.appendChild(option);
  });
}

// Load settings from chrome.storage.local
async function loadStoredSettings() {
  const store = await chrome.storage.local.get([
    "provider",
    "apiKeys",
    "selectedModels",
    "models",
    "customEndpoints",
    "consultationMode",
    "summaryStyle",
    "temperature",
    "customSystemPrompt",
    "geminiApiKey",
    "model"
  ]);

  // Migration support for old versions
  storedApiKeys = store.apiKeys || {};
  if (store.geminiApiKey && !storedApiKeys.gemini) {
    storedApiKeys.gemini = store.geminiApiKey;
  }

  storedSelectedModels = store.selectedModels || store.models || {};
  if (store.model && !storedSelectedModels.gemini) {
    storedSelectedModels.gemini = store.model;
  }
  // Migrate legacy Gemini models
  if (storedSelectedModels.gemini === "gemini-2.5-flash" || storedSelectedModels.gemini === "gemini-1.5-flash") {
    storedSelectedModels.gemini = "gemini-flash-latest";
  }

  storedCustomEndpoints = store.customEndpoints || {};

  currentProvider = store.provider || "gemini";
  providerSelect.value = currentProvider;

  // Preferences
  if (store.consultationMode || store.summaryStyle) {
    defaultModeSelect.value = store.consultationMode || store.summaryStyle;
  }
  if (store.temperature !== undefined) {
    temperatureRange.value = store.temperature;
    tempValueLabel.textContent = store.temperature;
  }
  if (store.customSystemPrompt) {
    customSystemPrompt.value = store.customSystemPrompt;
  }

  updateProviderView(currentProvider);
}

// Update UI fields based on selected provider
function updateProviderView(providerId) {
  const provider = PROVIDERS[providerId] || PROVIDERS.gemini;

  // Update badge and tagline
  activeProviderBadge.textContent = `${provider.name.split(" ")[0]} Active`;
  providerTagline.textContent = provider.tagline || "";

  // Update suggestions datalist
  populateSuggestionsWithList(provider.models);

  // Set current model input value
  const savedModel = storedSelectedModels[providerId] || provider.defaultModel;
  modelInput.value = savedModel;

  // Set API Key input value & placeholder
  apiKeyInput.value = storedApiKeys[providerId] || "";
  apiKeyInput.placeholder = provider.keyPlaceholder || "Enter API key...";
  keyDetectedNotice.classList.add("hidden");
  modelAutoFixNotice.classList.add("hidden");

  // Custom Endpoint Container visibility
  if (provider.requiresEndpoint) {
    customEndpointContainer.classList.remove("hidden");
    customEndpointInput.value = storedCustomEndpoints[providerId] || provider.defaultEndpoint || "http://localhost:11434/v1/chat/completions";
    apiKeyRequiredLabel.textContent = "Optional";
    apiKeyRequiredLabel.classList.remove("danger");
  } else {
    customEndpointContainer.classList.add("hidden");
    apiKeyRequiredLabel.textContent = "Required";
    apiKeyRequiredLabel.classList.add("danger");
  }

  // Update Provider Guide Box
  renderGuideBox(provider);
}

function populateSuggestionsWithList(modelsList) {
  modelSuggestionsList.innerHTML = "";
  modelsList.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.label = m.name || m.id;
    modelSuggestionsList.appendChild(opt);
  });
}

// Render instructions for obtaining keys for the selected provider
function renderGuideBox(provider) {
  guideTitle.textContent = `Getting an API Key for ${provider.name}:`;

  let guideHtml = "";
  switch (provider.id) {
    case "gemini":
      guideHtml = `
        <ol>
          <li>Open <a href="https://aistudio.google.com/app/apikey" target="_blank" class="accent-link">Google AI Studio</a>.</li>
          <li>Sign in with your Google account.</li>
          <li>Click <strong>"Create API Key"</strong> and copy it.</li>
          <li>Paste the key above. Gemini Flash (Latest Stable) offers a generous free tier!</li>
        </ol>
      `;
      break;
    case "openrouter":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://openrouter.ai/keys" target="_blank" class="accent-link">OpenRouter Keys</a>.</li>
          <li>Sign in with Google or GitHub (no credit card needed).</li>
          <li>Create a key and paste it above.</li>
          <li>Use free models like <code>meta-llama/llama-3.3-70b-instruct:free</code> or any paid model!</li>
        </ol>
      `;
      break;
    case "groq":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://console.groq.com/keys" target="_blank" class="accent-link">Groq Cloud Console</a>.</li>
          <li>Create a free account and click <strong>"Create API Key"</strong>.</li>
          <li>Copy the key (begins with <code>gsk_</code>) and paste it above.</li>
          <li>Groq provides ultra-fast response times for Llama 3.3 and DeepSeek R1 for free.</li>
        </ol>
      `;
      break;
    case "openai":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" class="accent-link">OpenAI API Keys</a>.</li>
          <li>Log in and create a new secret key.</li>
          <li>Copy and paste above. Supports GPT-4o, GPT-4o-mini, o3-mini, and custom fine-tunes.</li>
        </ol>
      `;
      break;
    case "anthropic":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://console.anthropic.com/settings/keys" target="_blank" class="accent-link">Anthropic Console</a>.</li>
          <li>Generate an API key and paste it above.</li>
          <li>Supports Claude 3.7 Sonnet, Claude 3.5 Haiku, and Claude 3 Opus.</li>
        </ol>
      `;
      break;
    case "deepseek":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://platform.deepseek.com/api_keys" target="_blank" class="accent-link">DeepSeek Platform</a>.</li>
          <li>Create an API key and paste it above.</li>
          <li>Supports DeepSeek-V3 (chat) and DeepSeek-R1 (reasoner).</li>
        </ol>
      `;
      break;
    case "mistral":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://console.mistral.ai/api-keys/" target="_blank" class="accent-link">Mistral AI Console</a>.</li>
          <li>Generate an API key and paste it above.</li>
        </ol>
      `;
      break;
    case "grok":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://console.x.ai/" target="_blank" class="accent-link">xAI Console (console.x.ai)</a>.</li>
          <li>Generate an API key (begins with <code>xai-</code>).</li>
          <li>Supports Grok 2, Grok 2 Mini, and Grok Beta models.</li>
        </ol>
      `;
      break;
    case "zhipu":
      guideHtml = `
        <ol>
          <li>Visit <a href="https://open.bigmodel.cn/" target="_blank" class="accent-link">Zhipu BigModel Platform</a>.</li>
          <li>Create an API key and paste it above.</li>
          <li>Supports free GLM-4-Flash and flagship GLM-4 models.</li>
        </ol>
      `;
      break;
    case "custom":
      guideHtml = `
        <p>Run local models via <strong>Ollama</strong> or <strong>LM Studio</strong>:</p>
        <ul>
          <li><strong>Ollama:</strong> Run <code>ollama run llama3</code> and set endpoint to <code>http://localhost:11434/v1/chat/completions</code>.</li>
          <li><strong>LM Studio:</strong> Start local server and set endpoint to <code>http://localhost:1234/v1/chat/completions</code>.</li>
          <li>API key can be left blank or set to any dummy string.</li>
        </ul>
      `;
      break;
  }

  guideContent.innerHTML = guideHtml;
}

// Event Listeners
function setupEventListeners() {
  // Provider Select Change
  providerSelect.addEventListener("change", (e) => {
    saveCurrentInputsToMemory();
    currentProvider = e.target.value;
    updateProviderView(currentProvider);
    diagnosticCard.classList.add("hidden");
  });

  // Debounced real-time API key pattern recognition & auto-resolution
  let optionsKeyDebounceTimer = null;
  apiKeyInput.addEventListener("input", () => {
    const val = apiKeyInput.value.trim();
    clearTimeout(optionsKeyDebounceTimer);

    const figure = analyzeKeyFigure(val);
    const fastDetected = figure.provider;
    if (fastDetected && fastDetected !== currentProvider && figure.confidence === "high") {
      keyDetectedNotice.classList.remove("hidden");
      keyDetectedNotice.innerHTML = `
        <span>💡 Recognized <strong>${figure.providerName}</strong> key.</span>
        <button type="button" class="btn-switch-detected" id="switchDetectedBtn">Switch to ${figure.providerName}</button>
      `;
      document.getElementById("switchDetectedBtn")?.addEventListener("click", () => {
        saveCurrentInputsToMemory();
        currentProvider = fastDetected;
        providerSelect.value = fastDetected;
        updateProviderView(fastDetected);
        keyDetectedNotice.classList.add("hidden");
        triggerKeyAutoProbe(val, fastDetected);
      });
    } else {
      keyDetectedNotice.classList.add("hidden");
    }

    if (val.length >= 15) {
      optionsKeyDebounceTimer = setTimeout(async () => {
        // Strict Provider Namespacing: Always validate against the selected provider
        await triggerKeyAutoProbe(val, currentProvider);
      }, 550);
    }
  });

  async function triggerKeyAutoProbe(apiKey, provider) {
    if (!apiKey) return;
    const desiredModel = modelInput.value.trim();
    const customEndpoint = provider === "custom" ? customEndpointInput.value.trim() : "";

    modelAutoFixNotice.classList.remove("hidden");
    modelAutoFixNotice.className = "notice-box";
    modelAutoFixNotice.innerHTML = `<span>⏳ Verifying ${PROVIDERS[provider]?.name} credential & discovering models...</span>`;

    try {
      const result = await autoResolveWorkingModel({
        provider,
        apiKey,
        desiredModel,
        customEndpoint
      });

      if (result.success) {
        if (result.availableModels && result.availableModels.length > 0) {
          populateSuggestionsWithList(result.availableModels);
        }
        modelInput.value = result.resolvedModel;
        storedSelectedModels[provider] = result.resolvedModel;
        storedApiKeys[provider] = apiKey;

        // Auto-persist verified model to storage
        chrome.storage.local.set({
          provider,
          apiKeys: storedApiKeys,
          selectedModels: storedSelectedModels,
          models: storedSelectedModels
        });

        const latencyBadge = result.latency ? ` <span style="font-size: 11px; opacity: 0.85;">(${result.latency}ms)</span>` : "";
        let workingModelsHtml = "";
        if (result.availableModels && result.availableModels.length > 0) {
          const sample = result.availableModels.slice(0, 5).map(m => m.id).join(", ");
          workingModelsHtml = `<div style="margin-top: 4px; font-size: 11px; color: var(--text-secondary);">Available Models: <strong>${sample}</strong>${result.availableModels.length > 5 ? '...' : ''}</div>`;
        }

        if (result.autoFixed) {
          modelAutoFixNotice.className = "notice-box warning";
          modelAutoFixNotice.innerHTML = `ℹ️ <strong>Model Auto-Selected:</strong> ${escapeHtml(result.message)}${latencyBadge}${workingModelsHtml}`;
        } else {
          modelAutoFixNotice.className = "notice-box success";
          modelAutoFixNotice.innerHTML = `✅ <strong>Key & Model Verified:</strong> ${escapeHtml(result.message)}${latencyBadge}${workingModelsHtml}`;
        }
      } else {
        if (result.resolvedModel) {
          modelInput.value = result.resolvedModel;
          storedSelectedModels[provider] = result.resolvedModel;
        }

        if (result.credentialStatus === "mismatched") {
          modelAutoFixNotice.className = "notice-box warning";
          modelAutoFixNotice.innerHTML = `
            <strong>⚠️ Provider Mismatch:</strong> ${escapeHtml(result.error)}
            <div style="margin-top: 6px;">
              <button type="button" class="btn btn-secondary btn-sm" id="noticeSwitchBtn">Switch to ${escapeHtml(result.mismatchedProviderName)}</button>
            </div>
          `;
          document.getElementById("noticeSwitchBtn")?.addEventListener("click", () => {
            saveCurrentInputsToMemory();
            currentProvider = result.mismatchedProvider;
            providerSelect.value = currentProvider;
            updateProviderView(currentProvider);
            triggerKeyAutoProbe(apiKey, currentProvider);
          });
        } else if (result.level === 1) {
          modelAutoFixNotice.className = "notice-box warning";
          modelAutoFixNotice.innerHTML = `
            <strong>⚠️ Invalid Key Format:</strong> ${escapeHtml(result.error || 'Syntax check failed.')}
            <div style="margin-top: 4px; font-size: 11.5px;">${escapeHtml(result.help || 'Please verify key format.')}</div>
          `;
        } else {
          modelAutoFixNotice.className = "notice-box danger";
          modelAutoFixNotice.innerHTML = `
            <strong>❌ Authentication Failed:</strong> ${escapeHtml(result.error || 'Could not verify credential.')}
            <div style="margin-top: 4px; font-size: 11.5px;">${escapeHtml(result.help || 'Please verify your API key and quotas.')}</div>
          `;
        }
      }
    } catch (err) {
      modelAutoFixNotice.className = "notice-box danger";
      modelAutoFixNotice.innerHTML = `
        <strong>⚠️ Model Detection:</strong> ${escapeHtml(err.message)}
        <div style="margin-top: 4px; font-size: 11.5px;">You can manually type your model name in the field above and click Test Connection.</div>
      `;
    }
  }

  // Auto-Detect & Resolve Working Model button
  autoResolveModelBtn.addEventListener("click", async () => {
    saveCurrentInputsToMemory();
    const apiKey = apiKeyInput.value.trim();
    const desiredModel = modelInput.value.trim();
    const customEndpoint = currentProvider === "custom" ? customEndpointInput.value.trim() : "";

    if (!apiKey && currentProvider !== "custom") {
      showNotification(`Please enter an API key for ${PROVIDERS[currentProvider]?.name} first.`, "danger");
      apiKeyInput.focus();
      return;
    }

    autoResolveModelBtn.disabled = true;
    autoResolveModelBtn.textContent = "⏳ Discovering Models...";
    modelAutoFixNotice.classList.add("hidden");

    try {
      const result = await autoResolveWorkingModel({
        provider: currentProvider,
        apiKey,
        desiredModel,
        customEndpoint
      });

      if (result.success) {
        if (result.availableModels && result.availableModels.length > 0) {
          populateSuggestionsWithList(result.availableModels);
        }
        modelInput.value = result.resolvedModel;
        storedSelectedModels[currentProvider] = result.resolvedModel;

        const latencyBadge = result.latency ? ` <span style="font-size: 11px; opacity: 0.85;">(${result.latency}ms)</span>` : "";
        let workingModelsHtml = "";
        if (result.availableModels && result.availableModels.length > 0) {
          const sample = result.availableModels.slice(0, 5).map(m => m.id).join(", ");
          workingModelsHtml = `<div style="margin-top: 4px; font-size: 11px; color: var(--text-secondary);">Available Models: <strong>${sample}</strong>${result.availableModels.length > 5 ? '...' : ''}</div>`;
        }

        modelAutoFixNotice.classList.remove("hidden");
        if (result.autoFixed) {
          modelAutoFixNotice.className = "notice-box warning";
          modelAutoFixNotice.innerHTML = `ℹ️ <strong>Model Auto-Selected:</strong> ${escapeHtml(result.message)}${latencyBadge}${workingModelsHtml}`;
        } else {
          modelAutoFixNotice.className = "notice-box success";
          modelAutoFixNotice.innerHTML = `✅ <strong>Key & Model Verified:</strong> ${escapeHtml(result.message)}${latencyBadge}${workingModelsHtml}`;
        }
        showNotification(`✅ ${result.message}`, "success");
      } else {
        if (result.resolvedModel) {
          modelInput.value = result.resolvedModel;
          storedSelectedModels[currentProvider] = result.resolvedModel;
        }
        modelAutoFixNotice.classList.remove("hidden");

        if (result.credentialStatus === "mismatched") {
          modelAutoFixNotice.className = "notice-box warning";
          modelAutoFixNotice.innerHTML = `
            <strong>⚠️ Provider Mismatch:</strong> ${escapeHtml(result.error)}
            <div style="margin-top: 6px;">
              <button type="button" class="btn btn-secondary btn-sm" id="btnNoticeSwitch">Switch to ${escapeHtml(result.mismatchedProviderName)}</button>
            </div>
          `;
          document.getElementById("btnNoticeSwitch")?.addEventListener("click", () => {
            saveCurrentInputsToMemory();
            currentProvider = result.mismatchedProvider;
            providerSelect.value = currentProvider;
            updateProviderView(currentProvider);
            triggerKeyAutoProbe(apiKey, currentProvider);
          });
        } else if (result.level === 1) {
          modelAutoFixNotice.className = "notice-box warning";
          modelAutoFixNotice.innerHTML = `
            <strong>⚠️ Invalid Key Format:</strong> ${escapeHtml(result.error)}
            <div style="margin-top: 4px; font-size: 11.5px;">${escapeHtml(result.help || 'Please verify key format.')}</div>
          `;
        } else {
          modelAutoFixNotice.className = "notice-box danger";
          modelAutoFixNotice.innerHTML = `
            <strong>❌ Authentication Failed:</strong> ${escapeHtml(result.error)}
            <div style="margin-top: 4px; font-size: 11.5px;">${escapeHtml(result.help || 'Please verify key limits, or manually enter your model name above.')}</div>
          `;
        }
        showNotification(`⚠️ ${result.error}`, "danger");
      }
    } catch (err) {
      modelAutoFixNotice.classList.remove("hidden");
      modelAutoFixNotice.className = "notice-box danger";
      modelAutoFixNotice.innerHTML = `❌ <strong>Error:</strong> ${escapeHtml(err.message)}`;
      showNotification(`❌ ${err.message}`, "danger");
    } finally {
      autoResolveModelBtn.disabled = false;
      autoResolveModelBtn.textContent = "🔍 Auto-Detect & Resolve Working Model";
    }
  });

  // Toggle API key password visibility
  toggleApiKeyVisibility.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
      apiKeyInput.type = "text";
      toggleApiKeyVisibility.textContent = "🔒";
    } else {
      apiKeyInput.type = "password";
      toggleApiKeyVisibility.textContent = "👁️";
    }
  });

  // Temperature slider change
  temperatureRange.addEventListener("input", (e) => {
    tempValueLabel.textContent = e.target.value;
  });

  // Save Settings Buttons
  saveSettingsBtn.addEventListener("click", saveAllSettings);
  savePreferencesBtn.addEventListener("click", saveAllSettings);

  // Test Connection Button
  testConnectionBtn.addEventListener("click", runConnectionTest);

  // Quick Preset Buttons
  document.querySelectorAll(".quick-select-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      saveCurrentInputsToMemory();
      const targetProvider = btn.getAttribute("data-provider");
      const targetModel = btn.getAttribute("data-model");

      currentProvider = targetProvider;
      providerSelect.value = targetProvider;
      storedSelectedModels[targetProvider] = targetModel;

      updateProviderView(targetProvider);
      modelInput.value = targetModel;

      showNotification(`Switched to ${PROVIDERS[targetProvider].name}. Paste your key and click Save!`, "success");
      apiKeyInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Sidebar Navigation & Section Highlighting
  setupSidebarNavigation();
}

function setupSidebarNavigation() {
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  const sectionIds = ["providers-section", "consultation-section", "quick-presets-section"];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function setActiveNavItem(targetId) {
    navItems.forEach(item => {
      const section = item.getAttribute("data-section") || item.getAttribute("href")?.replace("#", "");
      if (section === targetId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Handle click on sidebar nav links
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.getAttribute("data-section") || item.getAttribute("href")?.replace("#", "");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        setActiveNavItem(targetId);
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) {
          history.replaceState(null, "", `#${targetId}`);
        }
      }
    });
  });

  // ScrollSpy / IntersectionObserver to track viewport position
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(e => e.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        setActiveNavItem(visibleEntries[0].target.id);
      }
    }, {
      rootMargin: "-15% 0px -50% 0px",
      threshold: [0.1, 0.3, 0.6]
    });

    sections.forEach(s => observer.observe(s));
  }
}

function saveCurrentInputsToMemory() {
  const model = modelInput.value.trim();
  const key = apiKeyInput.value.trim();
  const endpoint = customEndpointInput.value.trim();

  if (model) storedSelectedModels[currentProvider] = model;
  if (key) storedApiKeys[currentProvider] = key;
  if (endpoint) storedCustomEndpoints[currentProvider] = endpoint;
}

// Save all configurations to chrome.storage.local
async function saveAllSettings() {
  saveCurrentInputsToMemory();

  const provider = currentProvider;
  const activeKey = storedApiKeys[provider] || "";
  const activeModel = storedSelectedModels[provider] || PROVIDERS[provider].defaultModel;

  if (!activeKey && provider !== "custom") {
    showNotification(`Warning: Please provide an API key for ${PROVIDERS[provider].name}.`, "danger");
  }

  await chrome.storage.local.set({
    provider: currentProvider,
    apiKeys: storedApiKeys,
    selectedModels: storedSelectedModels,
    models: storedSelectedModels,
    customEndpoints: storedCustomEndpoints,
    consultationMode: defaultModeSelect.value,
    summaryStyle: defaultModeSelect.value,
    temperature: parseFloat(temperatureRange.value),
    customSystemPrompt: customSystemPrompt.value.trim()
  });

  showNotification(`Settings successfully saved! Active model: ${activeModel}`, "success");
}

// Test Connection
async function runConnectionTest() {
  saveCurrentInputsToMemory();

  const provider = currentProvider;
  const model = modelInput.value.trim() || PROVIDERS[provider].defaultModel;
  const apiKey = apiKeyInput.value.trim();
  const customEndpoint = customEndpointInput.value.trim();

  if (!apiKey && provider !== "custom") {
    showNotification("Please enter an API key before testing.", "danger");
    apiKeyInput.focus();
    return;
  }

  testConnectionBtn.disabled = true;
  testBtnText.textContent = "Testing...";
  diagnosticCard.className = "diagnostic-card";
  diagnosticCard.classList.remove("hidden");
  diagnosticCard.innerHTML = `<strong>⏳ Connecting to ${PROVIDERS[provider].name} (${model})...</strong>`;

  try {
    const response = await testConnection({
      provider,
      apiKey,
      model,
      customEndpoint
    });

    if (response?.success) {
      diagnosticCard.className = "diagnostic-card success";
      diagnosticCard.innerHTML = `
        <strong>✅ Connection Successful!</strong>
        <p style="margin-top: 4px; font-size: 12px;">Connected to ${PROVIDERS[provider].name} in ${response.latency}ms.</p>
        <div style="font-size: 11px; margin-top: 6px; color: var(--text-secondary); background: #ffffff; padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-light);">
          Response: "${escapeHtml(response.response)}"
        </div>
      `;
    } else {
      diagnosticCard.className = "diagnostic-card danger";
      diagnosticCard.innerHTML = `
        <strong>❌ Connection Failed</strong>
        <p style="margin-top: 4px; font-size: 12px;">${escapeHtml(response?.error || 'Unknown error occurred.')}</p>
      `;
    }
  } catch (err) {
    diagnosticCard.className = "diagnostic-card danger";
    diagnosticCard.innerHTML = `
      <strong>❌ Connection Failed</strong>
      <p style="margin-top: 4px; font-size: 12px;">${escapeHtml(err.message)}</p>
    `;
  } finally {
    testConnectionBtn.disabled = false;
    testBtnText.textContent = "Test Connection";
  }
}

// Display toast notification in options header
function showNotification(message, type = "success") {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner ${type}`;
  statusBanner.classList.remove("hidden");

  setTimeout(() => {
    statusBanner.classList.add("hidden");
  }, 4000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sidebar Navigation Active Slider & Section Tracking
function setupSidebarNav() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // IntersectionObserver to auto-update active sidebar link as user scrolls
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(i => {
          if (i.getAttribute("data-section") === id || i.getAttribute("href") === `#${id}`) {
            i.classList.add("active");
          } else {
            i.classList.remove("active");
          }
        });
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll("section.settings-card").forEach(section => {
    observer.observe(section);
  });
}

// GitHub-Based Update & Local Synchronization Engine
function setupUpdateEngine() {
  const currentVersionLabel = document.getElementById("currentVersionLabel");
  const updateVersionBadge = document.getElementById("updateVersionBadge");
  const checkUpdatesBtn = document.getElementById("checkUpdatesBtn");
  const checkUpdatesIcon = document.getElementById("checkUpdatesIcon");
  const checkUpdatesText = document.getElementById("checkUpdatesText");
  const updateFeedbackNotice = document.getElementById("updateFeedbackNotice");
  const updateFeedbackIcon = document.getElementById("updateFeedbackIcon");
  const updateFeedbackText = document.getElementById("updateFeedbackText");
  const updateDetailsBox = document.getElementById("updateDetailsBox");
  const updateTargetVersion = document.getElementById("updateTargetVersion");
  const updateReleaseNotes = document.getElementById("updateReleaseNotes");
  const updateCommitDate = document.getElementById("updateCommitDate");
  const syncFolderBtn = document.getElementById("syncFolderBtn");
  const downloadPackageBtn = document.getElementById("downloadPackageBtn");
  const syncProgressContainer = document.getElementById("syncProgressContainer");
  const syncProgressBar = document.getElementById("syncProgressBar");
  const syncProgressText = document.getElementById("syncProgressText");

  // Display current local manifest version
  const manifest = chrome.runtime.getManifest();
  const installedVer = manifest.version || "2.0.0";
  if (currentVersionLabel) currentVersionLabel.textContent = installedVer;
  if (updateVersionBadge) updateVersionBadge.textContent = `v${installedVer} Installed`;

  // 1. Check for Updates
  checkUpdatesBtn?.addEventListener("click", async () => {
    checkUpdatesBtn.disabled = true;
    checkUpdatesIcon.textContent = "⏳";
    checkUpdatesText.textContent = "Checking...";

    updateFeedbackNotice.className = "update-notice-banner info";
    updateFeedbackNotice.classList.remove("hidden");
    updateFeedbackIcon.textContent = "🔍";
    updateFeedbackText.textContent = "Checking for updates...";

    try {
      const result = await checkForUpdates((statusMsg) => {
        updateFeedbackText.textContent = statusMsg;
      });

      if (result.success && result.updateAvailable) {
        updateFeedbackNotice.className = "update-notice-banner warning";
        updateFeedbackIcon.textContent = "✨";
        updateFeedbackText.textContent = `Update available.`;
        updateDetailsBox.classList.remove("hidden");
        updateTargetVersion.textContent = `Version ${result.remoteVersion}`;
        updateReleaseNotes.textContent = result.releaseNotes || result.commitMessage || "New updates available on main branch.";
        updateCommitDate.textContent = result.publishedAt ? `Released on ${result.publishedAt}` : "";
      } else if (result.success) {
        updateFeedbackNotice.className = "update-notice-banner success";
        updateFeedbackIcon.textContent = "✅";
        updateFeedbackText.textContent = "Already up to date.";
        updateDetailsBox.classList.add("hidden");
      } else {
        updateFeedbackNotice.className = "update-notice-banner danger";
        updateFeedbackIcon.textContent = "❌";
        updateFeedbackText.textContent = `Update failed. (${result.error || 'Network error'})`;
      }
    } catch (err) {
      updateFeedbackNotice.className = "update-notice-banner danger";
      updateFeedbackIcon.textContent = "❌";
      updateFeedbackText.textContent = `Update failed. (${err.message})`;
    } finally {
      checkUpdatesBtn.disabled = false;
      checkUpdatesIcon.textContent = "🔄";
      checkUpdatesText.textContent = "Check for Updates";
    }
  });

  // 2. Direct Local Directory Sync (File System Access API)
  syncFolderBtn?.addEventListener("click", async () => {
    if (!window.showDirectoryPicker) {
      alert("Direct folder sync requires a Chromium browser (Chrome or Edge). Please use 'Download Package (.zip)' to update files.");
      return;
    }

    try {
      syncFolderBtn.disabled = true;
      syncProgressContainer.classList.remove("hidden");
      syncProgressBar.style.width = "5%";
      syncProgressText.textContent = "Selecting local project folder...";

      // Prompt user to select their extension folder
      const dirHandle = await window.showDirectoryPicker({
        id: "clarityai_project_root",
        mode: "readwrite"
      });

      updateFeedbackNotice.className = "update-notice-banner info";
      updateFeedbackIcon.textContent = "⏳";
      updateFeedbackText.textContent = "Downloading update...";

      await syncLocalDirectory(dirHandle, (status, data) => {
        if (status === "Updating files..." && data?.total) {
          const pct = Math.round((data.current / data.total) * 100);
          syncProgressBar.style.width = `${pct}%`;
          syncProgressText.textContent = `Updating files... (${data.current}/${data.total}: ${data.filePath})`;
        } else if (status === "Update completed successfully.") {
          syncProgressBar.style.width = "100%";
          syncProgressText.textContent = `Update completed successfully. (${data?.updatedFilesCount || 0} files updated)`;
          updateFeedbackNotice.className = "update-notice-banner success";
          updateFeedbackIcon.textContent = "✅";
          updateFeedbackText.textContent = "Update completed successfully.";

          setTimeout(() => {
            if (confirm("Update completed successfully! Would you like to reload the extension now?")) {
              chrome.runtime.reload();
            }
          }, 350);
        } else if (status === "Update failed.") {
          updateFeedbackNotice.className = "update-notice-banner danger";
          updateFeedbackIcon.textContent = "❌";
          updateFeedbackText.textContent = `Update failed. (${data?.error || ''})`;
        } else {
          updateFeedbackText.textContent = status;
        }
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        updateFeedbackNotice.className = "update-notice-banner danger";
        updateFeedbackIcon.textContent = "❌";
        updateFeedbackText.textContent = `Update failed. (${err.message})`;
      }
    } finally {
      syncFolderBtn.disabled = false;
    }
  });

  // 3. Download Package (.zip) button
  downloadPackageBtn?.addEventListener("click", async () => {
    downloadPackageBtn.disabled = true;
    updateFeedbackNotice.className = "update-notice-banner info";
    updateFeedbackIcon.textContent = "📥";
    updateFeedbackText.textContent = "Downloading update...";

    try {
      await downloadUpdatePackage((status, data) => {
        if (status === "Update completed successfully.") {
          updateFeedbackNotice.className = "update-notice-banner success";
          updateFeedbackIcon.textContent = "✅";
          updateFeedbackText.textContent = "Update completed successfully. Extract the downloaded ZIP to update your files.";
        } else if (status === "Update failed.") {
          updateFeedbackNotice.className = "update-notice-banner danger";
          updateFeedbackIcon.textContent = "❌";
          updateFeedbackText.textContent = `Update failed. (${data?.error || ''})`;
        } else {
          updateFeedbackText.textContent = status;
        }
      });
    } catch (err) {
      updateFeedbackNotice.className = "update-notice-banner danger";
      updateFeedbackIcon.textContent = "❌";
      updateFeedbackText.textContent = `Update failed. (${err.message})`;
    } finally {
      downloadPackageBtn.disabled = false;
    }
  });
}
