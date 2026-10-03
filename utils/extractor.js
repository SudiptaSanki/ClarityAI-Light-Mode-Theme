/**
 * Smart webpage content extractor for ClarityAI
 * Extracts high-signal reading text while filtering out navigation, ads, footers, and cookie banners.
 */
export function extractPageContent() {
  const pageTitle = document.title || "Untitled Page";
  const pageUrl = window.location.href || "";

  // 1. If user has actively selected text on the page, prioritize it!
  const activeSelection = window.getSelection?.()?.toString()?.trim();
  if (activeSelection && activeSelection.length > 20) {
    const wordCount = activeSelection.split(/\s+/).filter(Boolean).length;
    return {
      title: pageTitle,
      url: pageUrl,
      content: activeSelection,
      text: activeSelection,
      isSelection: true,
      wordCount
    };
  }

  // 2. Meta description and OpenGraph description
  const metaDescription =
    document.querySelector('meta[name="description"]')?.getAttribute("content") ||
    document.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
    "";

  // Elements and tags to completely ignore
  const ignoredTags = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "NAV", "HEADER", "FOOTER",
    "ASIDE", "DIALOG", "IFRAME", "SVG", "CANVAS", "FORM", "BUTTON"
  ]);

  // Look for prime article or main content container
  const mainCandidates = [
    document.querySelector("article"),
    document.querySelector("main"),
    document.querySelector("[role='main']"),
    document.querySelector(".post-content"),
    document.querySelector(".article-content"),
    document.querySelector(".entry-content"),
    document.querySelector(".content"),
    document.body
  ];

  const rootElement = mainCandidates.find(el => el && el.innerText && el.innerText.trim().length > 250) || document.body;

  // 3. TreeWalker scanning clean readable text nodes while filtering hidden elements
  const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      let parent = node.parentElement;
      while (parent && parent !== rootElement) {
        if (ignoredTags.has(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        const classOrId = ((parent.className || "") + " " + (parent.id || "")).toLowerCase();
        if (/advertisement|ad-container|cookie|banner|sidebar|newsletter|social-share|comment-section|comments/i.test(classOrId)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.style && (parent.style.display === "none" || parent.style.visibility === "hidden")) {
          return NodeFilter.FILTER_REJECT;
        }
        parent = parent.parentElement;
      }

      const text = node.nodeValue?.trim();
      if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textBlocks = [];
  let currentNode;
  let totalChars = 0;
  const MAX_CHARS = 80000; // ample context for modern LLMs

  while ((currentNode = walker.nextNode())) {
    const cleanText = currentNode.nodeValue.replace(/\s+/g, " ").trim();
    if (cleanText) {
      textBlocks.push(cleanText);
      totalChars += cleanText.length + 1;
      if (totalChars > MAX_CHARS) break;
    }
  }

  const rawExtracted = textBlocks.join("\n\n").trim();
  const fullContent = (metaDescription && rawExtracted)
    ? `Page Context: ${metaDescription.trim()}\n\n${rawExtracted}`
    : (rawExtracted || metaDescription.trim());

  const wordCount = fullContent.split(/\s+/).filter(Boolean).length;

  return {
    title: pageTitle,
    url: pageUrl,
    content: fullContent.trim(),
    text: fullContent.trim(),
    isSelection: false,
    wordCount
  };
}
