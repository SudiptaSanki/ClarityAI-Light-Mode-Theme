# Changelog

All notable changes to the **ClarityAI Light Mode** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-10-03

### 🌟 Major Architectural Upgrades

#### 1. Smart Key Anatomy Classifier (`analyzeKeyFigure`)
* Added structural key classifier inspecting key prefix, character set, length, and entropy.
* Instant recognition for:
  * **Groq**: `gsk_`
  * **OpenRouter**: `sk-or-v1-`
  * **Anthropic Claude**: `sk-ant-` or `sk-ant-api03-`
  * **OpenAI**: `sk-proj-`, `sk-None-`, or legacy `sk-` (length $\ge 48$)
  * **Google Gemini**: `AIzaSy...`, `AIza...`, or `AQ....`
  * **Mistral AI**: 32-character hexadecimal `/^[a-fA-F0-9]{32}$/`
  * **DeepSeek**: `sk-` (30–46 characters)
  * **Custom / Local**: `http://`, `https://`, `localhost`, `127.0.0.1`
* Automated provider detection and 1-click auto-switching on paste.

#### 2. Active Gemini Multi-Model Probing Matrix (`probeGeminiModelMatrix`)
* Solves version mismatches and restricted key permissions.
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
* Measures operational roundtrip latency for each model.
* Auto-selects the fastest verified operational model and auto-persists to storage.

#### 3. Parallel Cross-Provider Fallback Probing (`probeAndDetectProvider`)
* Probes provider `/models` endpoints in parallel using `Promise.any` to auto-resolve keys when pattern recognition is ambiguous.

#### 4. Dynamic Search & Consultation Engine UI
* Search and summarize buttons adapt dynamically based on user input:
  * When input has text: changes icon to `🔍` and text to `Search with ${engineInfo.shortName}`.
  * When empty: changes icon to `✨` and text to `Summarize with ${engineInfo.shortName}`.
* Input placeholders dynamically adapt to active model (e.g., `Search page or focus query with Gemini 3.5 Flash...`).
* Empty state display reflects the exact active AI model name and provider.

#### 5. Pure Client-Side PDF 1.4 Generator (`pdf-export.js`)
* Standards-compliant PDF 1.4 generation without any external libraries or CDNs.
* Crisp Light Mode styling with colors `#2563eb`, `#0f172a`, `#64748b`, `#f8fafc`, `#e2e8f0`.
* Embedded clickable PDF link annotations linking to `https://github.com/SudiptaSanki/ClarityAI-Light-Mode-Theme`.

#### 6. Dual Storage Key Interoperability
* Full backwards and forwards compatibility between `selectedModels` and `models`.
* Full interoperability between `consultationMode` and `summaryStyle`.
* Auto-healing and migration for previously stored settings.

---

## [0.2.0] - 2026-09-15

### Added
* Multi-provider support (OpenRouter, Groq, Gemini, OpenAI, Claude, DeepSeek, Mistral, Local).
* 5 Executive Consultation Modes (Quick Summary, Key Takeaways, Deep Consultation, Action Items, Critical Review).
* Interactive grounded follow-up Q&A.
* Export to PDF functionality.
* One-click Markdown and text clipboard copy.

---

## [0.1.0] - Initial Release
* Initial release of ClarityAI Light Mode extension.
