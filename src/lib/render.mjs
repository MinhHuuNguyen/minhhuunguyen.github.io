// Markdown -> sanitized HTML for a post. Lives here (not in the page) so the node tests run the very same code.
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import DOMPurify from "isomorphic-dompurify";

const md = new MarkdownIt({ html: true, linkify: true }).use(markdownItKatex);

// Allow only YouTube embeds; drop any other iframe to avoid XSS via untrusted frames.
const YOUTUBE_EMBED = /^https:\/\/www\.youtube\.com\/embed\//;
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = node.getAttribute("src") || "";
    if (!YOUTUBE_EMBED.test(src)) {
      node.parentNode?.removeChild(node);
    }
  }
});

// Keep html:true (posts rely on raw <img>/<video>/<details>/YouTube), but strip
// <script>, event handlers and javascript: URIs before injecting into the DOM.
export const renderMarkdown = (content) =>
  DOMPurify.sanitize(md.render(content), {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "referrerpolicy", "target"],
  });
