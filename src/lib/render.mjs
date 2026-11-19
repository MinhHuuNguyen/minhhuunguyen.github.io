// Markdown -> HTML đã sanitize, chia theo h2 cấp cao nhất. Chạy lúc build (getStaticProps) và trong node:test.
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import DOMPurify from "isomorphic-dompurify";
import { slugify } from "./seo.mjs";

const md = new MarkdownIt({ html: true, linkify: true }).use(markdownItKatex);
const inlineText = (inline) =>
  (inline?.children ?? []).filter((c) => c.type === "text" || c.type === "code_inline").map((c) => c.content).join("").trim();

// id cho h2/h3: "h-" + slug, trùng thì thêm -2, -3 (tiền tố tránh DOM clobbering).
md.core.ruler.push("heading_ids", (state) => {
  const used = new Map();
  state.tokens.forEach((t, i) => {
    if (t.type !== "heading_open" || (t.tag !== "h2" && t.tag !== "h3")) return;
    const base = "h-" + (slugify(inlineText(state.tokens[i + 1])) || `section-${i}`);
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    t.attrSet("id", n === 1 ? base : `${base}-${n}`);
  });
});

// Chỉ giữ iframe YouTube embed (luật cũ). Sau sanitize: thêm enablejsapi=1 và loading=lazy (C7).
const YOUTUBE_EMBED = /^https:\/\/www\.youtube\.com\/embed\//;
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe" && !YOUTUBE_EMBED.test(node.getAttribute("src") || "")) node.parentNode?.removeChild(node);
});
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  // <img> HTML thô trong bài thiếu alt: gán alt="" như markdown-it làm với ![](src) (Lighthouse image-alt).
  if (node.nodeName === "IMG" && !node.hasAttribute("alt")) node.setAttribute("alt", "");
  if (node.nodeName !== "IFRAME") return;
  const src = node.getAttribute("src") || "";
  if (!YOUTUBE_EMBED.test(src)) return;
  if (!/[?&]enablejsapi=1\b/.test(src)) node.setAttribute("src", src + (src.includes("?") ? "&" : "?") + "enablejsapi=1");
  node.setAttribute("loading", "lazy");
});
const SANITIZE = { ADD_TAGS: ["iframe"], ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "referrerpolicy", "target", "loading"] };

const MEDIA_RE = /<(iframe|video)\b/i;
const isComment = (t) => t.type === "html_block" && /^\s*<!--[\s\S]*?-->\s*$/.test(t.content);
function kindOf(t) {
  switch (t?.type) {
    case "fence": case "code_block": return "code";
    case "table_open": case "table_close": return "table";
    case "math_block": return "math";
    case "html_block": return MEDIA_RE.test(t.content) ? "media" : "html";
    case "blockquote_open": case "blockquote_close": return "quote";
    case "bullet_list_open": case "bullet_list_close": case "ordered_list_open": case "ordered_list_close": return "list";
    case "heading_open": case "heading_close": return "heading";
    case "paragraph_open": case "paragraph_close": return "text";
    default: return "other";
  }
}
const firstContent = (toks) => toks.find((t) => t.level === 0 && t.nesting !== -1 && !isComment(t) && t.type !== "heading_open" && t.type !== "inline");
const lastTop = (toks) => { for (let i = toks.length - 1; i >= 0; i--) if (toks[i].level === 0 && !isComment(toks[i])) return toks[i]; };
const countWords = (toks) => toks.filter((t) => t.type === "inline").reduce((n, t) => n + t.content.split(/\s+/).filter(Boolean).length, 0);

export function renderPost(markdown) {
  const env = {};
  const tokens = md.parse(markdown ?? "", env);
  const groups = [[]];
  for (const t of tokens) {
    if (t.type === "heading_open" && t.tag === "h2" && t.level === 0 && groups.at(-1).length) groups.push([]);
    groups.at(-1).push(t);
  }
  const toc = [];
  let words = 0;
  const sections = groups.filter((g) => g.length).map((toks) => {
    toks.forEach((t, i) => {
      if (t.type === "heading_open" && t.level === 0 && (t.tag === "h2" || t.tag === "h3"))
        toc.push({ id: t.attrGet("id"), text: inlineText(toks[i + 1]), level: t.tag === "h2" ? 2 : 3 });
    });
    const n = countWords(toks);
    words += n;
    return {
      html: DOMPurify.sanitize(md.renderer.render(toks, md.options, env), SANITIZE),
      words: n,
      first: kindOf(firstContent(toks)),
      last: kindOf(lastTop(toks)),
      hasMedia: toks.some((t) => t.type === "html_block" && MEDIA_RE.test(t.content)),
    };
  });
  return { sections: sections.length ? sections : [{ html: "", words: 0, first: "other", last: "other", hasMedia: false }], toc, words };
}
export const renderMarkdown = (markdown) => renderPost(markdown).sections.map((s) => s.html).join("");
