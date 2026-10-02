/**
 * Smart webpage content extractor for ClarityAI
 * Extracts high-signal reading text while filtering out navigation, ads, footers, and cookie banners.
 */
export function extractPageContent() {
  // 1. If user has actively selected text on the page, prioritize it!
  const activeSelection = window.getSelection()?.toString()?.trim();
  if (activeSelection && activeSelection.length > 20) {
    return {
      title: document.title || "Selected Text",
      url: window.location.href,
      content: activeSelection,
      isSelection: true,
      wordCount: activeSelection.split(/\s+/).length
    };
  }

  // 2. Clone document or body to inspect without modifying page DOM
  const title = document.title || "";
  const url = window.location.href || "";
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

  // Elements to completely ignore
  const ignoredSelectors = [
    "script", "style", "noscript", "svg", "canvas", "iframe",
    "nav", "footer", "header", "aside", "form", "dialog",
    "[role='navigation']", "[role='banner']", "[role='contentinfo']",
    ".cookie-banner", "#cookie-notice", ".ad", ".ads", ".advertisement",
    ".sidebar", ".comment-section", ".comments"
  ];

  // Look for main content container
  const mainCandidates = [
    document.querySelector("article"),
    document.querySelector("main"),
    document.querySelector("[role='main']"),
    document.querySelector(".post-content"),
    document.querySelector(".article-content"),
    document.querySelector(".content"),
    document.body
  ];

  const rootElement = mainCandidates.find(el => el && el.innerText && el.innerText.trim().length > 100) || document.body;
  const clone = rootElement.cloneNode(true);

  // Remove unwanted elements
  ignoredSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Extract text with clean paragraph structure
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const text = node.nodeValue?.trim();
      if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textBlocks = [];
  let currentNode;
  let totalChars = 0;
  const MAX_CHARS = 40000; // ample for all modern LLMs

  while ((currentNode = walker.nextNode())) {
    const cleanText = currentNode.nodeValue.replace(/\s+/g, " ").trim();
    if (cleanText) {
      textBlocks.push(cleanText);
      totalChars += cleanText.length;
      if (totalChars > MAX_CHARS) {
        textBlocks.push("[...Content truncated for model context...]");
        break;
      }
    }
  }

  const rawExtracted = textBlocks.join("\n\n");
  const fullContent = (metaDescription ? `Summary context: ${metaDescription}\n\n` : "") + rawExtracted;

  return {
    title,
    url,
    content: fullContent.trim(),
    isSelection: false,
    wordCount: fullContent.split(/\s+/).filter(Boolean).length
  };
}
