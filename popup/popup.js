import { PROVIDERS } from "../utils/ai-providers.js";
import { renderMarkdown } from "../utils/markdown.js";
import { CONSULTATION_MODES } from "../utils/consultation.js";

// DOM Elements
const badgeProviderName = document.getElementById("badgeProviderName");
const activeModelBadge = document.getElementById("activeModelBadge");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const openOptionsPageLink = document.getElementById("openOptionsPageLink");

const setupBanner = document.getElementById("setupBanner");
const quickProviderSelect = document.getElementById("quickProviderSelect");
const quickApiKeyInput = document.getElementById("quickApiKeyInput");
const quickModelInput = document.getElementById("quickModelInput");
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
const exportPdfBtn = document.getElementById("exportPdfBtn");
const extractPreviewBtn = document.getElementById("extractPreviewBtn");
const testApiBtn = document.getElementById("testApiBtn");
const rawTextBuffer = document.getElementById("rawTextBuffer");

let currentRawOutput = "";
let currentMetadata = null;

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
    opt.textContent = p.name;
    quickProviderSelect.appendChild(opt);
  });
}

// Refresh state from chrome.storage
async function refreshState() {
  const store = await chrome.storage.local.get([
    "provider",
    "apiKeys",
    "selectedModels",
    "customEndpoints",
    "consultationMode",
    "lastSummary",
    "lastMetadata",
    "isSummarizing"
  ]);

  const providerId = store.provider || "gemini";
  const provider = PROVIDERS[providerId] || PROVIDERS.gemini;
  const apiKeys = store.apiKeys || {};
  const selectedModels = store.selectedModels || {};
  const activeKey = apiKeys[providerId] || "";
  const activeModel = selectedModels[providerId] || provider.defaultModel;

  // Update header badge
  badgeProviderName.textContent = `${provider.name.split(" ")[0]} · ${activeModel.split("/").pop()}`;

  // Update quick setup dropdowns
  quickProviderSelect.value = providerId;
  updateQuickSetupFields(providerId);

  // Check if API key is missing (except for custom/local if key not required)
  if (!activeKey && providerId !== "custom") {
    setupBanner.classList.remove("hidden");
  } else {
    setupBanner.classList.add("hidden");
  }

  // Restore saved consultation mode
  if (store.consultationMode && consultationMode.querySelector(`option[value="${store.consultationMode}"]`)) {
    consultationMode.value = store.consultationMode;
  }

  // Handle summarizing state
  if (store.isSummarizing) {
    setLoadingState(true, "Consulting AI...");
  } else if (store.lastSummary) {
    currentRawOutput = store.lastSummary;
    currentMetadata = store.lastMetadata || null;
    displayResult(store.lastSummary, currentMetadata);
  }
}

// Update quick setup inputs when provider changes
function updateQuickSetupFields(providerId) {
  const provider = PROVIDERS[providerId] || PROVIDERS.gemini;
  chrome.storage.local.get(["apiKeys", "selectedModels"]).then(({ apiKeys = {}, selectedModels = {} }) => {
    quickApiKeyInput.value = apiKeys[providerId] || "";
    quickApiKeyInput.placeholder = provider.keyPlaceholder || "Enter API key...";
    quickModelInput.value = selectedModels[providerId] || provider.defaultModel;

    if (provider.keyUrl) {
      quickGetKeyLink.href = provider.keyUrl;
      quickGetKeyLink.textContent = `🔑 Get free key from ${provider.name.split(" ")[0]} →`;
      quickGetKeyLink.style.display = "inline";
    } else {
      quickGetKeyLink.style.display = "none";
    }
  });
}

// Event Listeners
function setupEventListeners() {
  // Provider switch in quick setup
  quickProviderSelect.addEventListener("change", () => {
    updateQuickSetupFields(quickProviderSelect.value);
  });

  // Save key in quick setup banner
  quickSaveKeyBtn.addEventListener("click", async () => {
    const providerId = quickProviderSelect.value;
    const key = quickApiKeyInput.value.trim();
    const model = quickModelInput.value.trim() || PROVIDERS[providerId].defaultModel;

    if (!key && providerId !== "custom") {
      alert("Please paste your API key to activate.");
      return;
    }

    const { apiKeys = {}, selectedModels = {} } = await chrome.storage.local.get(["apiKeys", "selectedModels"]);
    apiKeys[providerId] = key;
    selectedModels[providerId] = model;

    await chrome.storage.local.set({
      provider: providerId,
      apiKeys,
      selectedModels
    });

    setupBanner.classList.add("hidden");
    await refreshState();
  });

  // Mode change
  consultationMode.addEventListener("change", async () => {
    await chrome.storage.local.set({ consultationMode: consultationMode.value });
  });

  // Main Consultation Trigger
  runConsultationBtn.addEventListener("click", executeConsultation);

  // Pressing Enter in custom question input
  customQuestionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeConsultation();
    }
  });

  // Copy Result
  copyBtn.addEventListener("click", copyToClipboard);

  // Export PDF
  exportPdfBtn.addEventListener("click", exportAsPdf);

  // Preview Extracted Page Text
  extractPreviewBtn.addEventListener("click", previewExtractedText);

  // Test Connection
  testApiBtn.addEventListener("click", testConnection);

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
      if (changes.provider || changes.selectedModels || changes.apiKeys) {
        refreshState();
      }
      if (changes.lastSummary) {
        currentRawOutput = changes.lastSummary.newValue || "";
        chrome.storage.local.get(["lastMetadata"]).then(({ lastMetadata }) => {
          currentMetadata = lastMetadata;
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

// Execute consultation on active page
async function executeConsultation() {
  const store = await chrome.storage.local.get(["provider", "apiKeys", "selectedModels"]);
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

  setLoadingState(true, customQuestion ? "Consulting AI on your question..." : "Analyzing page content...");

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
        💡 Tip: Check your API key or try switching models/providers in Settings.
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
    return;
  }

  const htmlContent = renderMarkdown(text);
  outputContent.innerHTML = htmlContent;
  rawTextBuffer.value = text;

  if (metadata) {
    metaBar.classList.remove("hidden");
    metaTitle.textContent = metadata.title || "Page Analysis";
    metaTitle.title = metadata.title || "";
    metaModel.textContent = `${metadata.provider || "AI"} · ${metadata.model || ""}`;
  } else {
    metaBar.classList.add("hidden");
  }
}

// Set Loading state on UI
function setLoadingState(isLoading, message = "Consulting AI...") {
  if (isLoading) {
    runConsultationBtn.disabled = true;
    btnIcon.textContent = "⏳";
    btnText.textContent = message;
    outputContent.innerHTML = `
      <div class="empty-state loading-pulse">
        <div class="empty-icon">🧠</div>
        <div class="empty-title">Analyzing Page with AI</div>
        <div class="empty-desc">${escapeHtml(message)}</div>
      </div>
    `;
  } else {
    runConsultationBtn.disabled = false;
    btnIcon.textContent = "✨";
    btnText.textContent = "Analyze Page";
  }
}

// Copy to Clipboard
async function copyToClipboard() {
  if (!currentRawOutput) return;

  try {
    let copyText = currentRawOutput;
    if (currentMetadata?.title) {
      copyText = `# ${currentMetadata.title}\nSource: ${currentMetadata.url || ""}\n\n${currentRawOutput}`;
    }

    await navigator.clipboard.writeText(copyText);
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `<span>✓ Copied!</span>`;
    copyBtn.style.color = "var(--success)";
    copyBtn.style.borderColor = "var(--success)";

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.color = "";
      copyBtn.style.borderColor = "";
    }, 1500);
  } catch (err) {
    console.error("Clipboard copy failed:", err);
  }
}

// Export as PDF / Print View
function exportAsPdf() {
  if (!currentRawOutput) {
    alert("Please generate a consultation first before exporting.");
    return;
  }

  const pageTitle = currentMetadata?.title || "ClarityAI Consultation";
  const pageUrl = currentMetadata?.url || "";
  const modelInfo = currentMetadata ? `${currentMetadata.provider || "AI"} (${currentMetadata.model || ""})` : "ClarityAI";
  const dateStr = new Date().toLocaleString();
  const renderedHtml = renderMarkdown(currentRawOutput);

  // Generate clean, high-resolution printable report
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup blocked! Please allow popups for ClarityAI to export PDF.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(pageTitle)} - ClarityAI Consultation</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          line-height: 1.6;
          margin: 0;
          padding: 24px;
          background: #ffffff;
        }
        .header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .brand {
          font-size: 20px;
          font-weight: 700;
          color: #2563eb;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4px 12px;
          font-size: 12px;
          color: #64748b;
          margin-top: 12px;
        }
        .meta-label {
          font-weight: 600;
          color: #475569;
        }
        .content {
          font-size: 14px;
          color: #1e293b;
        }
        h1, h2, h3 {
          color: #0f172a;
          margin-top: 18px;
          margin-bottom: 8px;
        }
        h1 { font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        h2 { font-size: 16px; }
        h3 { font-size: 14px; }
        p { margin-bottom: 12px; }
        ul, ol { margin: 8px 0 14px 24px; }
        li { margin-bottom: 6px; }
        blockquote {
          border-left: 3px solid #2563eb;
          background: #eff6ff;
          margin: 12px 0;
          padding: 8px 14px;
          font-style: italic;
          color: #1e3a8a;
        }
        code {
          background: #f1f5f9;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }
        pre {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
        }
        .footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">✦ ClarityAI Consultation Report</div>
        <div class="meta-grid">
          <span class="meta-label">Page:</span>
          <span>${escapeHtml(pageTitle)}</span>
          <span class="meta-label">Source URL:</span>
          <span>${escapeHtml(pageUrl)}</span>
          <span class="meta-label">Model:</span>
          <span>${escapeHtml(modelInfo)}</span>
          <span class="meta-label">Generated:</span>
          <span>${escapeHtml(dateStr)}</span>
        </div>
      </div>
      <div class="content">
        ${renderedHtml}
      </div>
      <div class="footer">
        <span>ClarityAI &bull; Universal AI Web Intelligence</span>
        <span>Generated via Browser Extension</span>
      </div>
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 300);
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Preview raw text extracted from page
async function previewExtractedText() {
  outputContent.innerHTML = `<div class="empty-state loading-pulse"><div class="empty-icon">📄</div><div class="empty-title">Extracting page content...</div></div>`;
  
  const response = await chrome.runtime.sendMessage({ type: "EXTRACT_PAGE_TEXT" });
  if (response?.success && response?.data) {
    const data = response.data;
    outputContent.innerHTML = `
      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">
        <strong>Extracted Preview:</strong> ${data.wordCount} words detected (${data.isSelection ? "User Selected Text" : "Full Page Content"})
      </div>
      <pre style="white-space: pre-wrap; font-size: 11px; font-family: monospace; color: #334155;">${escapeHtml(data.content.slice(0, 3000))}${data.content.length > 3000 ? "\n\n[...Content truncated for preview...]" : ""}</pre>
    `;
    currentRawOutput = data.content;
  } else {
    outputContent.innerHTML = `<div class="notice-box danger">Failed to extract text: ${escapeHtml(response?.error || "Unknown error")}</div>`;
  }
}

// Test Connection for active provider
async function testConnection() {
  const store = await chrome.storage.local.get(["provider", "apiKeys", "selectedModels", "customEndpoints"]);
  const provider = store.provider || "gemini";
  const apiKey = store.apiKeys?.[provider] || "";
  const model = store.selectedModels?.[provider] || PROVIDERS[provider].defaultModel;
  const customEndpoint = store.customEndpoints?.[provider] || "";

  if (!apiKey && provider !== "custom") {
    alert("Please set an API key first.");
    return;
  }

  outputContent.innerHTML = `<div class="empty-state loading-pulse"><div class="empty-icon">⚡</div><div class="empty-title">Testing connection to ${PROVIDERS[provider].name}...</div></div>`;

  const response = await chrome.runtime.sendMessage({
    type: "TEST_API",
    provider,
    model,
    apiKey,
    customEndpoint
  });

  if (response?.success) {
    outputContent.innerHTML = `
      <div class="notice-box success">
        <strong>✅ Connection Successful!</strong>
        <p style="margin-top: 4px;">Successfully communicated with <strong>${escapeHtml(model)}</strong> via ${escapeHtml(PROVIDERS[provider].name)}.</p>
        <div style="font-size: 11px; margin-top: 6px; color: #065f46;">Response: "${escapeHtml(response.result)}"</div>
      </div>
    `;
  } else {
    outputContent.innerHTML = `
      <div class="notice-box danger">
        <strong>❌ Connection Test Failed</strong>
        <p style="margin-top: 4px;">${escapeHtml(response?.error || "Check your network or key.")}</p>
      </div>
    `;
  }
}

// Open settings page
function openSettingsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open("../options/options.html");
  }
}

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
