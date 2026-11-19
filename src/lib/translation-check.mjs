import crypto from "node:crypto";
import matter from "gray-matter";
import { slugify } from "./seo.mjs";

export const EN_FM_KEYS = ["title", "description", "source_path", "source_slug", "source_hash", "translated_at"];
export const ALLOWLIST = ["Nguyễn", "Hữu", "Minh", "Hà", "Nội", "Bách", "Khoa", "Kinh", "tế", "Quốc", "dân", "Khoang", "Trời", "Của", "Bé", "Việt", "Nam", "Hiếu", "Phùng", "Théâtre", "opéra"];
const VI_CHARS = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const PIPE = /<!-- publish:video:begin[\s\S]*?<!-- publish:video:end[^>]*-->\n?/g;

export const stripPipelineVideoBlock = (body) => String(body ?? "").replace(PIPE, "");
export const bodyHash = (viBody) =>
  crypto.createHash("sha256").update(stripPipelineVideoBlock(viBody).replace(/\r\n/g, "\n").trim()).digest("hex");
/** Bỏ docstring """...""" và chú thích (# hoặc // tới cuối dòng) để so code: áp dụng giống nhau cho cả 2 bên nên '#' trong chuỗi không gây lệch. */
export const stripCodeComments = (code) => code.replace(/"""[\s\S]*?"""/g, "").split("\n").map((l) => l.replace(/\s*(#|\/\/).*$/, "")).join("\n").trim();

const fences = (s) => [...s.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1]);
const withoutCode = (s) => s.replace(/^```[\s\S]*?^```/gm, " ").replace(/`[^`\n]*`/g, " ");
const urls = (s, re) => [...withoutCode(s).matchAll(re)].map((m) => m[1]).sort();
const countRe = (s, re) => (withoutCode(s).match(re) || []).length;
const headings = (s) => [1, 2, 3, 4, 5, 6].map((n) => countRe(s, new RegExp(`^#{${n}}\\s`, "gm")));

export function vietnameseRatio(text, allowlist = ALLOWLIST) {
  const prose = withoutCode(text)
    .replace(/<span\s+lang="vi"[^>]*>[\s\S]*?<\/span>/g, " ")   // tiếng Việt cố ý (ví dụ NLP), xem 9.9
    .replace(/\]\([^)]*\)/g, "]").replace(/<[^>]+>/g, " ").replace(/https?:\/\/\S+/g, " ");
  const words = prose.split(/[\s.,;:!?()[\]"'“”]+/).filter(Boolean);
  const bad = words.filter((w) => VI_CHARS.test(w) && !allowlist.includes(w));
  return { ratio: words.length ? bad.length / words.length : 0, words: [...new Set(bad)].slice(0, 5) };
}

export function checkPair(viBody, enMarkdown) {
  const errors = [], warnings = [];
  const en = matter(enMarkdown).content;
  const vi = stripPipelineVideoBlock(viBody);
  if (/publish:video:begin/.test(en)) errors.push("bản EN còn khối publish:video (C27: phải bỏ)");
  const [fv, fe] = [fences(vi), fences(en)];
  if (fv.length !== fe.length) errors.push(`số code block ${fe.length} ≠ bản gốc ${fv.length}`);
  else fv.forEach((c, i) => { if (stripCodeComments(c) !== stripCodeComments(fe[i])) errors.push(`code block ${i + 1} khác bản gốc`); });
  const same = (name, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) errors.push(`${name} khác bản gốc: ${JSON.stringify(b)} ≠ ${JSON.stringify(a)}`); };
  same("số công thức khối", countRe(vi, /\$\$/g), countRe(en, /\$\$/g));
  same("số công thức inline", countRe(vi.replace(/\$\$[\s\S]*?\$\$/g, ""), /\$[^$\n]+\$/g), countRe(en.replace(/\$\$[\s\S]*?\$\$/g, ""), /\$[^$\n]+\$/g));
  same("ảnh", urls(vi, /!\[[^\]]*\]\(([^)\s]+)/g), urls(en, /!\[[^\]]*\]\(([^)\s]+)/g));
  same("link", urls(vi, /(?<!!)\[[^\]]*\]\(([^)\s]+)/g), urls(en, /(?<!!)\[[^\]]*\]\(([^)\s]+)/g));
  same("số heading theo cấp", headings(vi), headings(en));
  same("số dòng bảng", countRe(vi, /^\|/gm), countRe(en, /^\|/gm));
  for (const tag of ["img", "video", "details"]) same(`số thẻ <${tag}>`, countRe(vi, new RegExp(`<${tag}\\b`, "g")), countRe(en, new RegExp(`<${tag}\\b`, "g")));
  const { ratio, words } = vietnameseRatio(en);
  if (ratio > 0.005) errors.push(`còn chữ tiếng Việt (${(ratio * 100).toFixed(1)}%): ${words.join(", ")}`);
  else if (words.length) warnings.push(`từ có dấu còn sót: ${words.join(", ")}`);
  return { errors, warnings };
}

export function checkEnFrontmatter(fm, { viBySourcePath, enSlugs }) {
  const errs = [];
  for (const k of Object.keys(fm)) if (!EN_FM_KEYS.includes(k)) errs.push(`khoá không được có: ${k}`);
  for (const k of ["title", "description", "source_path"]) if (typeof fm[k] !== "string" || !fm[k].trim()) errs.push(`thiếu ${k}`);
  const vi = viBySourcePath.get(fm.source_path);
  if (!vi) errs.push(`source_path "${fm.source_path}" không trỏ tới bài VI đang publish`);
  else if (fm.source_slug !== undefined && fm.source_slug !== vi.slug) errs.push(`source_slug "${fm.source_slug}" ≠ slug hiện tại "${vi.slug}"`);
  if (fm.source_hash !== undefined && !/^[0-9a-f]{64}$/.test(fm.source_hash)) errs.push("source_hash phải là 64 ký tự hex");
  if (fm.translated_at !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(fm.translated_at))) errs.push("translated_at phải là YYYY-MM-DD");
  const slug = slugify(fm.title);
  if (enSlugs.has(slug)) errs.push(`trùng slug EN "${slug}" với ${enSlugs.get(slug)}`);
  return errs;
}

/** Q28: mỗi bài cần 1 mục "## <đợt> — <source_path>" có (bảng đề xuất | "Không có đề xuất.") và dòng "**Review bản dịch:**". */
export function missingLogEntries(logText, sourcePaths) {
  const ok = new Set();
  for (const s of String(logText ?? "").split(/^## /m).slice(1)) {
    const head = s.split("\n", 1)[0];
    const m = /—\s*(\S+)\s*$/.exec(head);
    if (!m) continue;                                  // bỏ qua "## Tổng hợp …"
    const body = s.slice(head.length);
    const findings = /^\|\s*\d+\s*\|/m.test(body) || /Không có đề xuất\./.test(body);
    const review = /^\*\*Review bản dịch:\*\*/m.test(body);
    if (findings && review) ok.add(m[1]);
  }
  return sourcePaths.filter((p) => !ok.has(p));
}
