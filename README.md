# ClarityAI — Universal AI Web Consultation & Intelligence (Light Mode)

![ClarityAI Banner](SmartSummarizer%20Logo%20with%20Paper%20and%20Digital%20Interface.png)

> **Universal & Model-Agnostic:** No more hardcoded API keys or obsolete model versions! ClarityAI lets you use **any AI model** from **any provider** (free or paid) with a simple copy-paste UI.

---

## 🌟 What's New in v0.2.0

* 🌐 **Universal AI Multi-Provider Support**: Choose between **Google Gemini**, **OpenRouter**, **Groq**, **OpenAI**, **Anthropic Claude**, **DeepSeek**, **Mistral**, or **Local AI (Ollama/LM Studio)**.
* 🆓 **100% Free Forever Options**: Step-by-step presets to use free models via OpenRouter (`meta-llama/llama-3.3-70b-instruct:free`, `deepseek/deepseek-r1:free`), Groq's high-speed free tier, or Google AI Studio.
* 🔓 **Zero Hardcoded Models**: Never edit code when models update! Easily select recommended models or type **any custom model version** directly into the input.
* 🧠 **Executive Consultation Modes**:
  * ⚡ **Quick Summary**: Concise 3–4 sentence executive overview.
  * 📌 **Key Takeaways**: 5–7 high-impact structured bullet points with bold highlights.
  * 🔍 **Deep-Dive Consultation**: Strategic analysis covering Executive Summary, Core Arguments, Strategic Insights, and Practical Implications.
  * ✅ **Action Items & Checklist**: Concrete, prioritized steps and takeaways extracted from the page.
  * ⚖️ **Critical Review & Evaluation**: Balanced breakdown of strengths, weaknesses, credibility, and omissions.
* 💬 **Interactive Page Consultation (Q&A)**: Type any question about the current webpage (e.g., *"What are the pricing details?"*, *"Summarize arguments against X"*) and ClarityAI will answer using the page context.
* 📄 **Export to PDF**: Generate a clean, branded, high-resolution printable report with source URL, date, model metadata, and formatted analysis.
* 📋 **One-Click Copy**: Copy formatted Markdown or structured plain text with automatic source attribution.
* 🎨 **Curated Light Mode Design**: Crisp typography, modern pill badges, smooth animations, and clean readability.

---

## 🚀 Supported AI Providers

| Provider | Type | Recommended Models | How to get key |
| :--- | :--- | :--- | :--- |
| **OpenRouter** | **100% Free & Paid** | `meta-llama/llama-3.3-70b-instruct:free`<br>`google/gemini-2.0-flash-exp:free`<br>`deepseek/deepseek-r1:free` | [openrouter.ai/keys](https://openrouter.ai/keys) *(No credit card needed)* |
| **Groq** | **Free & Ultra-Fast** | `llama-3.3-70b-versatile`<br>`llama-3.1-8b-instant`<br>`mixtral-8x7b-32768` | [console.groq.com/keys](https://console.groq.com/keys) *(Generous free rate limits)* |
| **Google Gemini** | **Free & Paid Tier** | `gemini-2.5-flash`<br>`gemini-2.0-flash`<br>`gemini-1.5-pro` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| **OpenAI** | Paid | `gpt-4o-mini`, `gpt-4o`, `o3-mini` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic** | Paid | `claude-3-5-sonnet-latest`, `claude-3-5-haiku-latest` | [console.anthropic.com](https://console.anthropic.com) |
| **DeepSeek** | Low-Cost / Paid | `deepseek-chat`, `deepseek-reasoner` | [platform.deepseek.com](https://platform.deepseek.com) |
| **Mistral AI** | Free/Paid Tier | `mistral-small-latest`, `open-mistral-nemo` | [console.mistral.ai](https://console.mistral.ai) |
| **Local AI** | **100% Offline & Free** | `llama3`, `mistral`, `qwen2.5` | Run Ollama (`localhost:11434`) or LM Studio |

> **Note for Non-Coders:** When a new model comes out (e.g. `gemini-3.0-flash` or `gpt-5`), simply type the name directly in the **Model Name** field in Settings. No code changes required!

---

## 🛠️ Quick Installation Guide

1. Clone or download this repository to your computer.
2. Open your Chromium-based browser (Chrome, Brave, Edge, Arc, Opera).
3. Navigate to `chrome://extensions/` (or `edge://extensions/`).
4. Enable **Developer mode** using the toggle switch in the top-right corner.
5. Click **Load unpacked** and select the extension folder: `ClarityAI-extension - Light Mode`.
6. Click the extension icon in your toolbar and paste your API key!

---

## 🔑 How to Get a 100% Free API Key

### Option A: OpenRouter (Recommended — Completely Free Models)
1. Go to [openrouter.ai/keys](https://openrouter.ai/keys).
2. Sign in with Google or GitHub (no credit card required).
3. Click **Create Key**, give it a name, and copy it.
4. Open ClarityAI Settings, pick **OpenRouter**, paste your key, and select `meta-llama/llama-3.3-70b-instruct:free`.

### Option B: Groq (Ultra-Fast Free Tier)
1. Go to [console.groq.com/keys](https://console.groq.com/keys).
2. Sign in and click **Create API Key**.
3. Copy the key starting with `gsk_`.
4. Open ClarityAI Settings, select **Groq**, and paste the key.

### Option C: Google Gemini
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key** and copy it.
4. Select **Google Gemini** in ClarityAI and paste the key.

---

## 💡 How to Use

1. **Summarize / Consult**: Open any web page or article, click the ClarityAI extension icon, select your consultation mode (e.g., Quick Summary or Deep-Dive), and click **Analyze Page**.
2. **Selective Analysis**: Highlight any paragraph on the page before opening the extension; ClarityAI will automatically prioritize your selected text!
3. **Ask Custom Questions**: Use the query input box to ask specific questions about the article or document.
4. **Export PDF**: Click the **Export PDF** button in the top toolbar to print or save a clean, formatted consultation report with metadata.
5. **Right-Click Context Menu**: Right-click anywhere on a webpage to quickly run Quick Summary, Deep Consultation, or Key Takeaways.

---

## 🔒 Privacy & Security

* **Direct Client Requests**: Your API keys are stored locally inside your browser's encrypted extension storage (`chrome.storage.local`).
* **Zero Intermediary Servers**: ClarityAI calls AI provider APIs directly from your browser. No third-party servers see your keys or page content.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
