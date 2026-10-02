import { PROVIDERS } from "../utils/ai-providers.js";

// DOM Elements
const providerSelect = document.getElementById("providerSelect");
const providerTagline = document.getElementById("providerTagline");
const activeProviderBadge = document.getElementById("activeProviderBadge");

const modelInput = document.getElementById("modelInput");
const modelSuggestionsList = document.getElementById("modelSuggestionsList");

const apiKeyContainer = document.getElementById("apiKeyContainer");
const apiKeyInput = document.getElementById("apiKeyInput");
const toggleApiKeyVisibility = document.getElementById("toggleApiKeyVisibility");
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
    "customEndpoints",
    "consultationMode",
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

  storedSelectedModels = store.selectedModels || {};
  if (store.model && !storedSelectedModels.gemini) {
    storedSelectedModels.gemini = store.model;
  }

  storedCustomEndpoints = store.customEndpoints || {};

  currentProvider = store.provider || "gemini";
  providerSelect.value = currentProvider;

  // Preferences
  if (store.consultationMode) {
    defaultModeSelect.value = store.consultationMode;
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
  modelSuggestionsList.innerHTML = "";
  provider.models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.label = m.name;
    modelSuggestionsList.appendChild(opt);
  });

  // Set current model input value
  const savedModel = storedSelectedModels[providerId] || provider.defaultModel;
  modelInput.value = savedModel;

  // Set API Key input value & placeholder
  apiKeyInput.value = storedApiKeys[providerId] || "";
  apiKeyInput.placeholder = provider.keyPlaceholder || "Enter API key...";

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
          <li>Paste the key above. Gemini 2.5 Flash has a generous free tier!</li>
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
          <li>Groq provides ultra-fast response times for Llama 3.3 and Mixtral for free.</li>
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
          <li>Supports Claude 3.5 Sonnet, Claude 3.5 Haiku, and Claude 3 Opus.</li>
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
    // Save current values to in-memory cache before switching
    saveCurrentInputsToMemory();
    currentProvider = e.target.value;
    updateProviderView(currentProvider);
    diagnosticCard.classList.add("hidden");
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

  // Save Settings Button
  saveSettingsBtn.addEventListener("click", saveAllSettings);
  savePreferencesBtn.addEventListener("click", saveAllSettings);

  // Test Connection Button
  testConnectionBtn.addEventListener("click", runConnectionTest);

  // Quick Preset Buttons
  document.querySelectorAll(".quick-select-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
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
    customEndpoints: storedCustomEndpoints,
    consultationMode: defaultModeSelect.value,
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

  const startTime = Date.now();

  try {
    const response = await chrome.runtime.sendMessage({
      type: "TEST_API",
      provider,
      model,
      apiKey,
      customEndpoint
    });

    const elapsed = Date.now() - startTime;

    if (response?.success) {
      diagnosticCard.className = "diagnostic-card success";
      diagnosticCard.innerHTML = `
        <strong>✅ Connection Successful! (${elapsed}ms)</strong>
        <p style="margin-top: 6px;">Successfully communicated with <strong>${escapeHtml(model)}</strong> via ${escapeHtml(PROVIDERS[provider].name)}.</p>
        <p style="font-size: 11px; margin-top: 4px; color: #065f46;">Model test response: "${escapeHtml(response.result)}"</p>
      `;
    } else {
      diagnosticCard.className = "diagnostic-card danger";
      diagnosticCard.innerHTML = `
        <strong>❌ Connection Failed (${elapsed}ms)</strong>
        <p style="margin-top: 6px;">${escapeHtml(response?.error || "Unknown diagnostic error.")}</p>
        <div style="font-size: 11px; margin-top: 6px; color: #991b1b;">
          Check that your API key is active and that the model name <code>${escapeHtml(model)}</code> is spelled correctly.
        </div>
      `;
    }
  } catch (err) {
    diagnosticCard.className = "diagnostic-card danger";
    diagnosticCard.innerHTML = `<strong>❌ Request Failed:</strong> ${escapeHtml(err.message)}`;
  } finally {
    testConnectionBtn.disabled = false;
    testBtnText.textContent = "Test Connection";
  }
}

// Notification Banner Helper
function showNotification(message, type = "success") {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner ${type}`;
  statusBanner.classList.remove("hidden");

  setTimeout(() => {
    statusBanner.classList.add("hidden");
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
