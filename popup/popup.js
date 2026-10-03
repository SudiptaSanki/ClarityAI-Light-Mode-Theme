import { PROVIDERS, AI_PROVIDERS, detectProviderFromKey, analyzeKeyFigure, autoResolveWorkingModel, getModelDisplayName } from "../utils/ai-providers.js";
import { renderMarkdown } from "../utils/markdown.js";
import { CONSULTATION_MODES } from "../utils/consultation.js";
import { exportSummaryToPDF } from "../utils/pdf-export.js";

// DOM Elements
const badgeProviderName = document.getElementById("badgeProviderName");
const activeModelBadge = document.getElementById("activeModelBadge");
const quickTestBtn = document.getElementById("quickTestBtn");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const openOptionsPageLink = document.getElementById("openOptionsPageLink");

const setupBanner = document.getElementById("setupBanner");
const quickProviderSelect = document.getElementById("quickProviderSelect");
const quickApiKeyInput = document.getElementById("quickApiKeyInput");
const keyDetectionBadge = document.getElementById("keyDetectionBadge");
const quickModelInput = document.getElementById("quickModelInput");
const quickAutoResolveBtn = document.getElementById("quickAutoResolveBtn");
const quickSaveKeyBtn = document.getElementById("quickSaveKeyBtn");
const quickGetKeyLink = document.getElementById("quickGetKeyLink");

const consultationMode = document.getElementById("consultationMode");
const customQuestionInput = document.getElementById("customQuestionInput");
const runConsultationBtn = document.getElementById("runConsultationBtn");
const btnIcon = document.getElementById("btnIcon");
const btnText = document.getElementById("btnText");

const metaBar = document.getElementById("metaBar");
const metaTitle = document.getElementById("metaTitle");
const metaModel = document.getElementById("metaModel");

const outputContent = document.getElementById("outputContent");
const copyBtn = document.getElementById("copyBtn");
const copyBtnText = document.getElementById("copyBtnText");
const copyMarkdownBtn = document.getElementById("copyMarkdownBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const extractPreviewBtn = document.getElementById("extractPreviewBtn");
const testApiBtn = document.getElementById("testApiBtn");
const rawTextBuffer = document.getElementById("rawTextBuffer");

const qaSection = document.getElementById("qaSection");
const qaInput = document.getElementById("qaInput");
const qaSendBtn = document.getElementById("qaSendBtn");
const qaAnswer = document.getElementById("qaAnswer");

let currentRawOutput = "";
let currentMetadata = null;
let currentPageText = "";
let currentProvider = "gemini";
let currentModel = "gemini-flash-latest";

// Initialize on load
document.addEventListener("DOMContentLoaded", async () => {
  populateQuickProviders();
  await refreshState();
  setupEventListeners();
});

// Populate quick provider dropdown
function populateQuickProviders() {
  quickProviderSelect.innerHTML = "";
  Object.values(PROVIDERS).forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.badge})`;
    quickProviderSelect.appendChild(opt);
  });
}

// Dynamically updates search placeholder, action buttons, and empty state to reflect active model
function updateDynamicSearchUI(providerId, modelId) {
  currentProvider = providerId || currentProvider;
  currentModel = modelId || currentModel;
  const engineInfo = getModelDisplayName(currentProvider, currentModel);

  // 1. Update Custom Question / Search Input Placeholder
  if (customQuestionInput) {
    customQuestionInput.placeholder = `Search page or focus query with ${engineInfo.modelName}...`;
  }

  // 2. Update Run Consultation / Search Button
  const hasQuery = customQuestionInput ? customQuestionInput.value.trim().length > 0 : false;
  if (hasQuery) {
    btnIcon.textContent = "🔍";
    btnText.textContent = `Search with ${engineInfo.shortName}`;
    runConsultationBtn.title = `Search active page for "${customQuestionInput.value.trim()}" using ${engineInfo.fullName}`;
  } else {
    btnIcon.textContent = "✨";
    btnText.textContent = `Summarize with ${engineInfo.shortName}`;
    runConsultationBtn.title = `Generate summary using ${engineInfo.fullName}`;
  }

  // 3. Update Q&A Placeholder
  if (qaInput) {
    qaInput.placeholder = `Ask ${engineInfo.modelName} a follow-up question...`;
  }

  // 4. Update Empty State if currently empty/visible
  if (!currentRawOutput && outputContent) {
    const emptyDesc = outputContent.querySelector(".empty-desc");
    const emptyTitle = outputContent.querySelector(".empty-title");
    if (emptyTitle) {
      emptyTitle.textContent = `Ready to Consult with ${engineInfo.modelName}`;
    }
    if (emptyDesc) {
      emptyDesc.innerHTML = `Active Model: <strong style="color: var(--accent-primary);">${engineInfo.fullName}</strong>`;
    }
  }
}

// Refresh state from chrome.storage
async function refreshState() {
  const store = await chrome.storage.local.get([
    "provider",
    "apiKeys",
    "selectedModels",
    "models",
    "customEndpoints",
    "consultationMode",
    "summaryStyle",
    "lastSummary",
    "lastMetadata",
    "lastPageText",
    "isSummarizing",
    "summarizingStartTime",
    "isSearch"
  ]);

  currentProvider = store.provider || "gemini";
  const provider = PROVIDERS[currentProvider] || PROVIDERS.gemini;
  const apiKeys = store.apiKeys || {};
  const selectedModels = store.selectedModels || store.models || {};
  const activeKey = apiKeys[currentProvider] || "";
  currentModel = selectedModels[currentProvider] || provider.defaultModel;

  currentPageText = store.lastPageText || "";

  // Update header badge with clean display name
  const displayInfo = getModelDisplayName(currentProvider, currentModel);
  badgeProviderName.textContent = `${displayInfo.providerName} · ${displayInfo.shortName}`;

  // Update quick setup dropdowns
  quickProviderSelect.value = currentProvider;
  updateQuickSetupFields(currentProvider);

  // Check if API key is missing
  if (!activeKey && currentProvider !== "custom") {
    setupBanner.classList.remove("hidden");
  } else {
    setupBanner.classList.add("hidden");
  }

  // Restore saved consultation mode (with summaryStyle interoperability)
  const activeMode = store.consultationMode || store.summaryStyle;
  if (activeMode && consultationMode.querySelector(`option[value="${activeMode}"]`)) {
    consultationMode.value = activeMode;
  }

  // Update search and button labels to active model
  updateDynamicSearchUI(currentProvider, currentModel);

  // Handle summarizing state with stale lock auto-clear (>25s)
  const now = Date.now();
  if (store.isSummarizing) {
    if (store.summarizingStartTime && now - store.summarizingStartTime > 25000) {
      await chrome.storage.local.set({ isSummarizing: false });
      setLoadingState(false);
    } else {
      const isSearch = store.isSearch || (customQuestionInput && customQuestionInput.value.trim().length > 0);
      const actionText = isSearch ? `Searching with ${displayInfo.modelName}...` : `Summarizing with ${displayInfo.modelName}...`;
      setLoadingState(true, actionText);
    }
  } else if (store.lastSummary) {
    currentRawOutput = store.lastSummary;
    currentMetadata = store.lastMetadata || null;
    displayResult(store.lastSummary, currentMetadata);
  }
}

// Update quick setup inputs when provider changes
function updateQuickSetupFields(providerId) {
  const provider = PROVIDERS[providerId] || PROVIDERS.gemini;
  chrome.storage.local.get(["apiKeys", "selectedModels", "models"]).then(({ apiKeys = {}, selectedModels = {}, models = {} }) => {
    const curModels = Object.keys(selectedModels).length > 0 ? selectedModels : models;
    quickApiKeyInput.value = apiKeys[providerId] || "";
    quickApiKeyInput.placeholder = provider.keyPlaceholder || "Enter API key...";
    quickModelInput.value = curModels[providerId] || provider.defaultModel;

    if (provider.keyUrl) {
      quickGetKeyLink.href = provider.keyUrl;
      quickGetKeyLink.textContent = `🔑 Get free key from ${provider.name.split(" ")[0]} →`;
      quickGetKeyLink.style.display = "inline";
    } else {
      quickGetKeyLink.style.display = "none";
    }
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Provider switch in quick setup
  quickProviderSelect.addEventListener("change", () => {
    updateQuickSetupFields(quickProviderSelect.value);
  });

  // Real-time API Key Pattern Recognition & Automatic Model Resolution
  // Real-time API Key Anatomy Recognition & Automatic Model Resolution
  let quickKeyTimer = null;
  quickApiKeyInput.addEventListener("input", () => {
    const key = quickApiKeyInput.value.trim();
    clearTimeout(quickKeyTimer);

    const figure = analyzeKeyFigure(key);
    if (figure.provider && figure.provider !== quickProviderSelect.value && figure.confidence === "high") {
      quickProviderSelect.value = figure.provider;
      updateQuickSetupFields(figure.provider);
      keyDetectionBadge.classList.remove("hidden");
      keyDetectionBadge.textContent = `✨ Recognized ${figure.providerName} Key!`;
    }

    if (key.length >= 15) {
      keyDetectionBadge.classList.remove("hidden");
      keyDetectionBadge.style.background = "var(--bg-muted)";
      keyDetectionBadge.style.color = "var(--text-secondary)";
      keyDetectionBadge.style.borderColor = "var(--border-light)";
      keyDetectionBadge.textContent = `⏳ Analyzing key figure & probing working models...`;

      quickKeyTimer = setTimeout(async () => {
        try {
          const result = await autoResolveWorkingModel({
            provider: quickProviderSelect.value,
            apiKey: key,
            desiredModel: quickModelInput.value.trim()
          });

          if (result.success) {
            quickModelInput.value = result.resolvedModel;
            keyDetectionBadge.style.background = "var(--success-soft)";
            keyDetectionBadge.style.color = "#065f46";
            keyDetectionBadge.style.borderColor = "#a7f3d0";
            keyDetectionBadge.textContent = `✅ ${result.message}`;

            // Auto-save so user doesn't need to do anything!
            const prov = result.provider || quickProviderSelect.value;
            const { apiKeys = {}, selectedModels = {}, models = {} } = await chrome.storage.local.get(["apiKeys", "selectedModels", "models"]);
            apiKeys[prov] = key;
            const finalModels = Object.keys(selectedModels).length > 0 ? selectedModels : models;
            finalModels[prov] = result.resolvedModel;

            await chrome.storage.local.set({
              provider: prov,
              apiKeys,
              selectedModels: finalModels,
              models: finalModels
            });

            setTimeout(() => {
              setupBanner.classList.add("hidden");
              refreshState();
            }, 1800);
          } else {
            keyDetectionBadge.style.background = "var(--warning-soft)";
            keyDetectionBadge.style.color = "#92400e";
            keyDetectionBadge.style.borderColor = "#fde68a";
            keyDetectionBadge.textContent = `⚠️ ${result.help || result.error}`;
          }
        } catch (err) {
          keyDetectionBadge.style.background = "var(--danger-soft)";
          keyDetectionBadge.style.color = "#991b1b";
          keyDetectionBadge.style.borderColor = "#fecaca";
          keyDetectionBadge.textContent = `❌ ${err.message}`;
        }
      }, 550);
    } else {
      keyDetectionBadge.classList.add("hidden");
    }
  });

  // Auto-resolve working model in quick setup
  quickAutoResolveBtn.addEventListener("click", handleQuickAutoResolve);

  // Save key in quick setup banner
  quickSaveKeyBtn.addEventListener("click", async () => {
    const providerId = quickProviderSelect.value;
    const key = quickApiKeyInput.value.trim();
    const model = quickModelInput.value.trim() || PROVIDERS[providerId].defaultModel;

    if (!key && providerId !== "custom") {
      alert("Please paste your API key to activate.");
      quickApiKeyInput.focus();
      return;
    }

    const { apiKeys = {}, selectedModels = {} } = await chrome.storage.local.get(["apiKeys", "selectedModels"]);
    apiKeys[providerId] = key;
    selectedModels[providerId] = model;

    await chrome.storage.local.set({
      provider: providerId,
      apiKeys,
      selectedModels,
      models: selectedModels
    });

    setupBanner.classList.add("hidden");
    await refreshState();
  });

  // Mode change with dual key sync
  consultationMode.addEventListener("change", async () => {
    await chrome.storage.local.set({
      consultationMode: consultationMode.value,
      summaryStyle: consultationMode.value
    });
  });

  // Main Consultation Trigger
  runConsultationBtn.addEventListener("click", executeConsultation);

  // Real-time button & search adaptation as user enters a question or search query
  customQuestionInput.addEventListener("input", () => {
    updateDynamicSearchUI(currentProvider, currentModel);
  });

  // Pressing Enter in custom question input
  customQuestionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeConsultation();
    }
  });

  // Copy Plain Text
  copyBtn.addEventListener("click", copyToClipboard);

  // Copy Markdown
  copyMarkdownBtn.addEventListener("click", copyMarkdownToClipboard);

  // Export PDF with native generator
  exportPdfBtn.addEventListener("click", handleExportPdf);

  // Interactive Q&A Consultation
  qaSendBtn.addEventListener("click", handleFollowUpQuestion);
  qaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFollowUpQuestion();
    }
  });

  // Preview Extracted Page Text
  extractPreviewBtn.addEventListener("click", previewExtractedText);

  // Test Connection Buttons
  quickTestBtn.addEventListener("click", handleQuickTest);
  testApiBtn.addEventListener("click", handleQuickTest);

  // Open Full Settings
  activeModelBadge.addEventListener("click", openSettingsPage);
  openSettingsBtn.addEventListener("click", openSettingsPage);
  openOptionsPageLink.addEventListener("click", (e) => {
    e.preventDefault();
    openSettingsPage();
  });

  // Storage listener for background updates
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      if (changes.provider || changes.selectedModels || changes.models || changes.apiKeys) {
        refreshState();
      }
      if (changes.lastSummary) {
        currentRawOutput = changes.lastSummary.newValue || "";
        chrome.storage.local.get(["lastMetadata", "lastPageText"]).then(({ lastMetadata, lastPageText }) => {
          currentMetadata = lastMetadata;
          currentPageText = lastPageText || "";
          displayResult(currentRawOutput, currentMetadata);
          setLoadingState(false);
        });
      }
      if (changes.isSummarizing) {
        setLoadingState(changes.isSummarizing.newValue);
      }
    }
  });
}

// Auto-resolve working model in Quick Setup banner
async function handleQuickAutoResolve() {
  const provider = quickProviderSelect.value;
  const apiKey = quickApiKeyInput.value.trim();
  const desiredModel = quickModelInput.value.trim();

  if (!apiKey && provider !== "custom") {
    alert("Please paste your API key first so we can verify available models.");
    quickApiKeyInput.focus();
    return;
  }

  quickAutoResolveBtn.disabled = true;
  quickAutoResolveBtn.textContent = "⏳ Resolving...";

  try {
    const result = await autoResolveWorkingModel({ provider, apiKey, desiredModel });
    if (result.success) {
      quickModelInput.value = result.resolvedModel;
      keyDetectionBadge.classList.remove("hidden");
      keyDetectionBadge.textContent = `✅ ${result.message}`;
    } else {
      keyDetectionBadge.classList.remove("hidden");
      keyDetectionBadge.textContent = `⚠️ ${result.help || result.error}`;
    }
  } catch (err) {
    keyDetectionBadge.classList.remove("hidden");
    keyDetectionBadge.textContent = `❌ ${err.message}`;
  } finally {
    quickAutoResolveBtn.disabled = false;
    quickAutoResolveBtn.textContent = "🔍 Auto-Resolve";
  }
}

// Execute consultation on active page
async function executeConsultation() {
  const store = await chrome.storage.local.get(["provider", "apiKeys", "selectedModels", "models"]);
  const provider = store.provider || "gemini";
  const apiKeys = store.apiKeys || {};
  const activeKey = apiKeys[provider] || "";

  if (!activeKey && provider !== "custom") {
    setupBanner.classList.remove("hidden");
    quickApiKeyInput.focus();
    outputContent.innerHTML = `<div class="notice-box danger">⚠️ Please paste your API key above first to activate AI consultation.</div>`;
    return;
  }

  const mode = consultationMode.value;
  const customQuestion = customQuestionInput.value.trim();
  const engineInfo = getModelDisplayName(provider, currentModel);

  const loadingMsg = customQuestion
    ? `Searching page with ${engineInfo.modelName}...`
    : `Summarizing with ${engineInfo.modelName}...`;

  setLoadingState(true, loadingMsg);

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out after 35 seconds. Check network or model status.")), 35000)
    );

    const messagePromise = chrome.runtime.sendMessage({
      type: "RUN_CONSULTATION",
      mode,
      customQuestion
    });

    const response = await Promise.race([messagePromise, timeoutPromise]);

    if (!response || !response.success) {
      throw new Error(response?.error || "Consultation request failed.");
    }

    currentRawOutput = response.output;
    currentMetadata = response.metadata;
    displayResult(response.output, response.metadata);
  } catch (err) {
    console.error("Consultation error:", err);
    outputContent.innerHTML = `
      <div class="notice-box danger">
        <strong>❌ Consultation Failed</strong>
        <p style="margin-top: 4px;">${escapeHtml(err.message)}</p>
      </div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
        💡 Tip: Check your API key or click ⚡ in the header to run auto-diagnostics.
      </div>
    `;
  } finally {
    setLoadingState(false);
  }
}

// Display formatted consultation result
function displayResult(text, metadata) {
  if (!text) return;

  if (text.startsWith("❌ Error:")) {
    outputContent.innerHTML = `<div class="notice-box danger">${escapeHtml(text)}</div>`;
    metaBar.classList.add("hidden");
    qaSection.classList.add("hidden");
    return;
  }

  const htmlContent = renderMarkdown(text);
  outputContent.innerHTML = htmlContent;
  rawTextBuffer.value = text;

  // Reveal interactive Q&A follow-up
  qaSection.classList.remove("hidden");

  if (metadata) {
    metaBar.classList.remove("hidden");
    metaTitle.textContent = metadata.title || "Page Analysis";
    metaTitle.title = metadata.title || "";
    const displayInfo = getModelDisplayName(metadata.provider, metadata.model);
    metaModel.textContent = `${displayInfo.providerName} · ${displayInfo.shortName}`;
  } else {
    metaBar.classList.add("hidden");
  }
}

// Handle Interactive Follow-up Question
async function handleFollowUpQuestion() {
  const question = qaInput.value.trim();
  if (!question) return;

  const engineInfo = getModelDisplayName(currentProvider, currentModel);
  qaSendBtn.disabled = true;
  qaSendBtn.textContent = "⏳";
  qaAnswer.classList.remove("hidden");
  qaAnswer.innerHTML = `<span style="color: var(--text-muted);">${engineInfo.modelName} is searching & analyzing the page context...</span>`;

  try {
    const response = await chrome.runtime.sendMessage({
      type: "ASK_CONSULTATION",
      question,
      contextSummary: currentRawOutput,
      pageText: currentPageText
    });

    if (response?.error) {
      qaAnswer.innerHTML = `<span style="color: var(--danger);">❌ ${escapeHtml(response.error)}</span>`;
    } else if (response?.answer) {
      qaAnswer.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 6px; color: var(--accent-primary);">Q: ${escapeHtml(question)}</div>
        <div>${renderMarkdown(response.answer)}</div>
      `;
      qaInput.value = "";
    }
  } catch (err) {
    qaAnswer.innerHTML = `<span style="color: var(--danger);">❌ ${escapeHtml(err.message)}</span>`;
  } finally {
    qaSendBtn.disabled = false;
    qaSendBtn.textContent = "➤";
  }
}

// Set Loading state on UI with active model name and search awareness
function setLoadingState(isLoading, message = "") {
  const engineInfo = getModelDisplayName(currentProvider, currentModel);
  const hasQuery = customQuestionInput ? customQuestionInput.value.trim().length > 0 : false;

  if (isLoading) {
    runConsultationBtn.disabled = true;
    btnIcon.textContent = "⏳";
    const actionLabel = hasQuery
      ? `Searching with ${engineInfo.shortName}...`
      : `Summarizing with ${engineInfo.shortName}...`;
    btnText.textContent = actionLabel;

    const mainTitle = message || (hasQuery
      ? `Searching Page with ${engineInfo.modelName}`
      : `Analyzing Page with ${engineInfo.modelName}`);

    outputContent.innerHTML = `
      <div class="empty-state loading-pulse">
        <div class="empty-icon">${hasQuery ? "🔍" : "🧠"}</div>
        <div class="empty-title">${escapeHtml(mainTitle)}</div>
        <div class="empty-desc">Active Model: <strong>${escapeHtml(engineInfo.fullName)}</strong></div>
      </div>
    `;
    qaSection.classList.add("hidden");
  } else {
    runConsultationBtn.disabled = false;
    updateDynamicSearchUI(currentProvider, currentModel);
  }
}

// Copy Plain Text to Clipboard
async function copyToClipboard() {
  if (!currentRawOutput) return;

  try {
    let copyText = currentRawOutput
      .replace(/###\s+/g, "")
      .replace(/##\s+/g, "")
      .replace(/#\s+/g, "")
      .replace(/\*\*/g, "");

    if (currentMetadata?.title) {
      copyText = `${currentMetadata.title}\nSource: ${currentMetadata.url || ""}\n\n${copyText}`;
    }

    await navigator.clipboard.writeText(copyText);
    flashButtonSuccess(copyBtn, copyBtnText, "Copied! ✓");
  } catch (err) {
    console.error("Clipboard copy failed:", err);
  }
}

// Copy Markdown to Clipboard
async function copyMarkdownToClipboard() {
  if (!currentRawOutput) return;

  try {
    const title = currentMetadata?.title || "Web Page Consultation";
    const url = currentMetadata?.url || "";
    const model = currentMetadata?.model || "";
    const markdownWithHeader = `# ${title}\nSource: ${url}\nModel: ${model}\n\n${currentRawOutput}`;

    await navigator.clipboard.writeText(markdownWithHeader);
    const originalText = copyMarkdownBtn.innerHTML;
    copyMarkdownBtn.innerHTML = `<span>✓ Copied!</span>`;
    copyMarkdownBtn.style.color = "var(--success)";
    copyMarkdownBtn.style.borderColor = "var(--success)";

    setTimeout(() => {
      copyMarkdownBtn.innerHTML = originalText;
      copyMarkdownBtn.style.color = "";
      copyMarkdownBtn.style.borderColor = "";
    }, 1500);
  } catch (err) {
    console.error("Markdown copy failed:", err);
  }
}

// Export as PDF Document (Native Zero-Dependency Engine)
function handleExportPdf() {
  if (!currentRawOutput) {
    alert("Please generate a consultation first before exporting to PDF.");
    return;
  }

  exportSummaryToPDF({
    title: currentMetadata?.title || "Web Page Consultation",
    url: currentMetadata?.url || "",
    provider: currentMetadata?.provider || "gemini",
    model: currentMetadata?.model || "",
    style: consultationMode.value,
    content: currentRawOutput
  });
}

// Quick Connection Diagnostic Test
async function handleQuickTest() {
  const store = await chrome.storage.local.get(["provider", "apiKeys", "selectedModels", "models"]);
  const provider = store.provider || "gemini";
  const apiKeys = store.apiKeys || {};
  const currentModels = store.selectedModels || store.models || {};
  const activeKey = apiKeys[provider] || "";
  const model = currentModels[provider] || PROVIDERS[provider].defaultModel;

  if (!activeKey && provider !== "custom") {
    setupBanner.classList.remove("hidden");
    quickApiKeyInput.focus();
    return;
  }

  outputContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⏳</div>
      <div class="empty-title">Testing Connection</div>
      <div class="empty-desc">Testing connectivity to <strong>${PROVIDERS[provider]?.name}</strong> (${model})...</div>
    </div>
  `;

  try {
    const response = await chrome.runtime.sendMessage({
      type: "RESOLVE_MODEL",
      provider,
      apiKey: activeKey,
      desiredModel: model
    });

    if (response?.success) {
      outputContent.innerHTML = `
        <div class="notice-box success" style="margin-top: 10px;">
          <strong>✅ Connection Successful!</strong>
          <p style="margin-top: 4px;">${escapeHtml(response.message || 'Successfully connected to AI provider.')}</p>
          <div style="font-size: 11px; margin-top: 6px;">Latency: ${response.latency ? response.latency + 'ms' : 'Fast'} • Active Model: <strong>${response.resolvedModel}</strong></div>
        </div>
      `;
      if (response.autoFixed) {
        await refreshState();
      }
    } else {
      outputContent.innerHTML = `
        <div class="notice-box danger" style="margin-top: 10px;">
          <strong>❌ Connection Test Failed</strong>
          <p style="margin-top: 4px;">${escapeHtml(response?.error || 'Unable to connect to model.')}</p>
          <div style="font-size: 11px; margin-top: 6px; color: var(--text-secondary);">${escapeHtml(response?.help || 'Please verify your API key in Settings.')}</div>
        </div>
      `;
    }
  } catch (err) {
    outputContent.innerHTML = `
      <div class="notice-box danger">
        <strong>❌ Diagnostic Error</strong>
        <p>${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}

// Preview Extracted Page Text
async function previewExtractedText() {
  setLoadingState(true, "Extracting page content...");
  try {
    const response = await chrome.runtime.sendMessage({ type: "EXTRACT_PAGE_TEXT" });
    if (response?.success && response?.data) {
      const data = response.data;
      const text = data.content || data.text || "No readable text detected.";
      outputContent.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: 600; font-size: 12px; color: var(--accent-primary);">
          Extracted Content Preview (${data.wordCount} words detected ${data.isSelection ? 'from selection' : ''}):
        </div>
        <pre style="white-space: pre-wrap; font-size: 11.5px; color: var(--text-secondary); line-height: 1.5; max-height: 250px; overflow-y: auto;">${escapeHtml(text)}</pre>
      `;
    } else {
      outputContent.innerHTML = `<div class="notice-box danger">Could not extract readable text from this page.</div>`;
    }
  } catch (err) {
    outputContent.innerHTML = `<div class="notice-box danger">Extraction failed: ${escapeHtml(err.message)}</div>`;
  } finally {
    setLoadingState(false);
  }
}

function flashButtonSuccess(button, textEl, successText) {
  const original = textEl.textContent;
  textEl.textContent = successText;
  button.style.color = "var(--success)";
  button.style.borderColor = "var(--success)";
  setTimeout(() => {
    textEl.textContent = original;
    button.style.color = "";
    button.style.borderColor = "";
  }, 1500);
}

function openSettingsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open("../options/options.html");
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
