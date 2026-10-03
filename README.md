# ClarityAI — Universal AI Web Consultation & Intelligence (Light Mode)

![ClarityAI Banner](SmartSummarizer%20Logo%20with%20Paper%20and%20Digital%20Interface.png)

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=flat-square)](https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme)
[![Manifest](https://img.shields.io/badge/manifest-v3-green.svg?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg?style=flat-square)](https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme)

> **Universal, Self-Healing & Model-Agnostic AI Extension for Chrome:** Built with pure vanilla JavaScript (ES modules) and native CSS. Features intelligent key anatomy classification, active multi-model probing matrices, dynamic model-aware search/summarization UI, and direct client-side PDF 1.4 report generation.

---

## 🚀 What's New in Version 2.0.0

Version 2.0.0 is a major architectural evolution designed to eliminate all hardcoding, key configuration errors, and model deprecation friction:

### 1. 🧠 Smart Key Anatomy Classifier (`analyzeKeyFigure`)
* Automatically recognizes provider types in real time based on structural prefix, length, and entropy:
  * **Groq**: `gsk_`
  * **OpenRouter**: `sk-or-v1-`
  * **Anthropic Claude**: `sk-ant-` or `sk-ant-api03-`
  * **OpenAI**: `sk-proj-`, `sk-None-`, or legacy 48+ chars
  * **Google Gemini**: `^AIzaSy[0-9A-Za-z_-]{33}$`, `^AIza[0-9A-Za-z_-]{30,}`, or `^AQ\.[0-9A-Za-z_-]+`
  * **Mistral AI**: 32-character hexadecimal `/^[a-fA-F0-9]{32}$/`
  * **DeepSeek**: `sk-` (30–46 characters)
  * **Custom / Local**: `http://`, `https://`, `localhost`, `127.0.0.1`
* **On-the-Fly Provider Switching**: Pasting an API key instantly identifies the provider and offers a 1-click switch or auto-routes automatically.

### 2. ⚡ Active Gemini Multi-Model Probing Matrix (`probeGeminiModelMatrix`)
* Solves model deprecation and key permission issues forever!
* Concurrently sends lightweight 1-token diagnostic requests (`maxOutputTokens: 1`) to candidate models:
  * `gemini-3.5-flash`
  * `gemini-flash-latest`
  * `gemini-3.8-flash`
  * `gemini-2.5-flash`
  * `gemini-2.0-flash`
  * `gemini-flash-lite-latest`
  * `gemini-pro-latest`
  * `gemini-2.5-pro`
  * `gemini-1.5-flash`
* Measures roundtrip latency for each model and automatically binds to the fastest operational candidate.

### 3. 🔍 Dynamic Model-Aware UI Engine
* The popup interface adapts in real time to the exact AI engine in use:
  * **Summary Mode**: `"✨ Summarize with Llama 3.3"` or `"✨ Summarize with 3.5 Flash"`
  * **Search Mode**: Transforms dynamically when typing a query to `"🔍 Search with Llama 3.3"`
  * **Adaptive Placeholders**: Input placeholders update to `Search page or focus query with Gemini 3.5 Flash...`
  * **Model-Aware Empty State**: Indicates the exact active engine ready for consultation.

### 4. 📄 Pure Client-Side PDF 1.4 Generator (`pdf-export.js`)
* Generates pristine executive intelligence reports directly in the browser with **zero external libraries** or CDN dependencies.
* Fully styled in the Light Mode color palette (`#2563eb`, `#0f172a`, `#64748b`, `#f8fafc`, `#e2e8f0`).
* Embeds clickable PDF hyperlink annotations (`/Subtype /Link /A << /S /URI /URI (...) >>`) pointing directly to the open-source repository.

### 5. 🔄 Storage Dual-Key Interoperability & Self-Healing
* Seamlessly bridges both `selectedModels` and legacy `models` storage keys.
* Syncs both `consultationMode` and `summaryStyle` across background tasks, popup sessions, and options.

---

## 🌐 Supported AI Providers & Models

| Provider | Access & Cost | Recommended Models | Key Generation |
| :--- | :--- | :--- | :--- |
| **Google Gemini** | **Free Tier Available** | `gemini-3.5-flash`<br>`gemini-flash-latest`<br>`gemini-2.5-flash` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Groq** | **Free & Ultra-Fast** | `llama-3.3-70b-versatile`<br>`llama-3.1-8b-instant`<br>`deepseek-r1-distill-llama-70b` | [Groq Cloud Console](https://console.groq.com/keys) |
| **OpenRouter** | **100% Free & Paid** | `meta-llama/llama-3.3-70b-instruct:free`<br>`deepseek/deepseek-r1:free` | [OpenRouter Keys](https://openrouter.ai/keys) |
| **OpenAI** | Paid API Key | `gpt-4o-mini`<br>`gpt-4o`<br>`o3-mini` | [OpenAI Platform](https://platform.openai.com/api-keys) |
| **Anthropic** | Paid API Key | `claude-3-7-sonnet-latest`<br>`claude-3-5-haiku-latest` | [Anthropic Console](https://console.anthropic.com/settings/keys) |
| **DeepSeek** | Low-Cost / Paid | `deepseek-chat` (V3)<br>`deepseek-reasoner` (R1) | [DeepSeek Platform](https://platform.deepseek.com/api_keys) |
| **Mistral AI** | Free & Paid Tier | `mistral-small-latest`<br>`open-mistral-nemo` | [Mistral Console](https://console.mistral.ai/api-keys/) |
| **Local AI** | **100% Offline & Free** | `llama3`, `mistral`, `qwen2.5` | [Ollama](https://ollama.com) (`localhost:11434`) or LM Studio |

---

## 🎯 Executive Consultation Modes

ClarityAI goes far beyond basic summaries by providing tailored intelligence modes:

1. **⚡ Quick Summary**: Clean 3–4 sentence executive synthesis.
2. **📌 Key Takeaways**: 5–7 prioritized bullet points with bold impact highlights.
3. **🔍 Deep-Dive Consultation**: Strategic analysis covering Executive Overview, Core Arguments, Strategic Insights, and Practical Implications.
4. **✅ Action Items & Checklist**: Actionable, prioritized next steps extracted from technical or business documents.
5. **⚖️ Critical Review & Evaluation**: Balanced assessment of arguments, credibility, potential biases, and critical omissions.
6. **💬 Conversational Follow-Up (Q&A)**: Grounded question-answering strictly using the active page's context.

---

## 🛠️ Installation & Setup

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme.git
   ```
2. Open Chrome (or any Chromium browser like Brave, Edge, Arc, Opera) and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the upper-right corner.
4. Click **Load unpacked** and select the `ClarityAI-extension - Light Mode` directory.
5. Click the **ClarityAI** icon in your toolbar, paste your API key, and you're ready!

---

## 🔒 Privacy & Architecture

* **Pure Vanilla JavaScript (ES Modules)**: No webpack, no npm bundle bloat, no third-party CDNs.
* **Direct Client Requests**: Your API keys and webpage data remain in your browser's encrypted `chrome.storage.local`.
* **Zero Telemetry or Intermediaries**: All communication happens strictly between your browser and your chosen AI provider endpoint.
* **Manifest V3 Compliant**: Uses modern service worker architecture with persistent state resilience.

---

## 📄 Repository & Attribution

* **Official Repository**: [https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme](https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme)
* **License**: [MIT License](LICENSE)
