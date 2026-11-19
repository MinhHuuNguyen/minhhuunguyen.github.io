export const WORDS_PER_MINUTE = 200;
export function plainText(markdown, maxWords = Infinity) {
  const text = String(markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+\$/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return Number.isFinite(maxWords) ? text.split(" ").slice(0, maxWords).join(" ") : text;
}
export const wordCount = (text) => (text ? text.split(/\s+/).filter(Boolean).length : 0);
export const readingMinutes = (markdown) => Math.max(1, Math.round(wordCount(plainText(markdown)) / WORDS_PER_MINUTE));
