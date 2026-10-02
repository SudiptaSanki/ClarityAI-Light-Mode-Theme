/**
 * Lightweight, safe Markdown to HTML renderer for ClarityAI
 * No external dependencies, clean output.
 */
export function renderMarkdown(markdownText) {
  if (!markdownText) return "";

  // 1. Escape HTML special characters for security
  let html = markdownText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Code blocks (```lang ... ```)
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // 3. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // 4. Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

  // 5. Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 6. Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="md-quote">$1</blockquote>');

  // 7. Unordered Lists
  html = html.replace(/^(\s*)[-*+]\s+(.*)$/gim, '<li class="md-li">$2</li>');
  html = html.replace(/(<li class="md-li">[\s\S]*?<\/li>)/gim, '<ul class="md-ul">$1</ul>');
  // Clean up nested adjacent ULs
  html = html.replace(/<\/ul>\s*<ul class="md-ul">/gim, '');

  // 8. Numbered Lists
  html = html.replace(/^\d+\.\s+(.*)$/gim, '<li class="md-ol-li">$1</li>');
  html = html.replace(/(<li class="md-ol-li">[\s\S]*?<\/li>)/gim, '<ol class="md-ol">$1</ol>');
  html = html.replace(/<\/ol>\s*<ol class="md-ol">/gim, '');

  // 9. Paragraphs and line breaks
  const blocks = html.split(/\n{2,}/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("<h1") || trimmed.startsWith("<h2") || 
        trimmed.startsWith("<h3") || trimmed.startsWith("<ul") || 
        trimmed.startsWith("<ol") || trimmed.startsWith("<pre") || 
        trimmed.startsWith("<blockquote")) {
      return trimmed;
    }
    return `<p class="md-p">${trimmed.replace(/\n/g, '<br/>')}</p>`;
  });

  return formattedBlocks.filter(Boolean).join("\n");
}
