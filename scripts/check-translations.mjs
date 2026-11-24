import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "../src/lib/seo.mjs";
import { readAllPosts } from "../src/lib/posts-reader.mjs";
import { bodyHash, checkEnFrontmatter, checkPair, missingLogEntries } from "../src/lib/translation-check.mjs";

const POSTS_ROOT = "posts";
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return null;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) { console.error(`[translations] ${name} cần một giá trị`); process.exit(2); }
  return v;
};
const folder = value("--folder")?.replace(/^\/+|\/+$/g, "") ?? null;
const logFile = value("--log");
const inScope = (rel) => !folder || rel === folder || rel.startsWith(`${folder}/`);
const toRel = (file) => path.relative(POSTS_ROOT, file).split(path.sep).join("/");

function walk(dir, out, root = dir) {
  let names;
  try { names = fs.readdirSync(dir); } catch { return; }
  for (const name of names) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) { if (!name.startsWith(".")) walk(full, out, root); continue; }
    if (name.endsWith(".md") && name !== "README.md") out.push(full);
  }
}

const enRoots = ["posts-en", process.env.POSTS_EN_EXTRA_ROOT].filter((r) => r && fs.existsSync(r));
const enFiles = [];
const rootOf = new Map();
for (const r of enRoots) { const found = []; walk(r, found); for (const f of found) rootOf.set(f, r); enFiles.push(...found); }
const strict = flag("--strict");

const viPosts = readAllPosts().map((p) => ({ ...p, relPath: toRel(p.filePath) }));
const viBySourcePath = new Map(viPosts.map((p) => [p.relPath, p]));
const viScope = viPosts.filter((p) => inScope(p.relPath));

const dateOnly = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v);
const today = new Date().toISOString().slice(0, 10);
const groupOf = (rel) => rel.split("/").slice(0, 2).join("/");

const results = []; // { file, sourcePath, group, errors, warnings, stale }
const enSlugs = new Map();
const translated = new Set();
const sorted = enFiles.map((file) => {
  let parsed = null, error = null;
  try { parsed = matter(fs.readFileSync(file, "utf8")); } catch (e) { error = `không parse được frontmatter: ${e.message}`; }
  return { file, parsed, error };
}).sort((a, b) => a.file.localeCompare(b.file));

for (const { file, parsed, error } of sorted) {
  if (error) { results.push({ file, sourcePath: null, group: "(không đọc được)", errors: [error], warnings: [], stale: false }); continue; }
  const fm = { ...parsed.data };
  for (const k of ["source_slug", "source_hash", "translated_at"]) if (fm[k] != null) fm[k] = dateOnly(fm[k]);
  const sourcePath = typeof fm.source_path === "string" ? fm.source_path : null;
  if (folder && !(sourcePath && inScope(sourcePath))) continue;
  const vi = sourcePath ? viBySourcePath.get(sourcePath) : undefined;

  if (flag("--stamp") && vi) {
    const stamped = {
      title: fm.title, description: fm.description, source_path: fm.source_path,
      source_slug: vi.slug, source_hash: bodyHash(vi.content), translated_at: today,
    };
    Object.keys(stamped).forEach((k) => stamped[k] === undefined && delete stamped[k]);
    fs.writeFileSync(file, matter.stringify({ content: parsed.content }, stamped));
    Object.assign(fm, stamped);
  }

  const errors = checkEnFrontmatter(fm, { viBySourcePath, enSlugs });
  if (typeof fm.title === "string") enSlugs.set(slugify(fm.title), file);
  const warnings = [];
  let stale = false;
  if (vi) {
    translated.add(sourcePath);
    const pair = checkPair(vi.content, fs.readFileSync(file, "utf8"));
    errors.push(...pair.errors);
    warnings.push(...pair.warnings);
    if (fm.source_hash !== undefined && fm.source_hash !== bodyHash(vi.content)) {
      stale = true;
      if (strict) errors.push("bản dịch cũ (stale): bài VI đã đổi, dịch lại rồi chạy --stamp"); else warnings.push("bản dịch cũ (stale): bài VI đã đổi");
    }
  }
  if (strict && sourcePath) {
    const here = path.relative(rootOf.get(file), file).split(path.sep).join("/");
    if (here !== sourcePath) errors.push(`đường dẫn file EN "${here}" phải bằng source_path "${sourcePath}" (cây posts-en đối xứng với posts)`);
  }
  results.push({ file, sourcePath, group: sourcePath ? groupOf(sourcePath) : "(thiếu source_path)", errors, warnings, stale });
}

const missing = viScope.filter((p) => !translated.has(p.relPath));

if (flag("--list-missing")) {
  for (const p of missing) console.log(p.relPath);
  console.log(`${missing.length} bài VI chưa có bản EN`);
  process.exit(0);
}

if (logFile) {
  const logText = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "";
  const need = results.filter((r) => r.sourcePath).map((r) => r.sourcePath);
  const lacking = new Set(missingLogEntries(logText, need));
  for (const r of results) if (r.sourcePath && lacking.has(r.sourcePath)) r.errors.push(`thiếu mục nhật ký trong ${logFile}`);
}

const globalErrors = [];
if (flag("--require-all") || strict) for (const p of missing) globalErrors.push(`thiếu bản EN: ${p.relPath}`);

const errorCount = results.reduce((n, r) => n + r.errors.length, 0) + globalErrors.length;
const staleCount = results.filter((r) => r.stale).length;
const have = viScope.length - missing.length;

if (flag("--json")) {
  console.log(JSON.stringify({ total: viScope.length, translated: have, errors: errorCount, stale: staleCount, globalErrors, results: results.map((r) => ({ ...r, file: path.relative(process.cwd(), r.file) })) }, null, 2));
} else {
  const groups = new Map();
  for (const r of results) {
    const g = groups.get(r.group) ?? { n: 0, e: 0, w: 0 };
    g.n += 1; g.e += r.errors.length; g.w += r.warnings.length;
    groups.set(r.group, g);
  }
  for (const [g, s] of [...groups].sort(([a], [b]) => a.localeCompare(b))) console.log(`[translations] ${g}: ${s.n} bài, ${s.e} lỗi, ${s.w} cảnh báo`);
  for (const r of results) {
    for (const e of r.errors) console.error(`  ✖ ${r.sourcePath ?? r.file}: ${e}`);
    for (const w of r.warnings) console.warn(`  ! ${r.sourcePath ?? r.file}: ${w}`);
  }
  for (const e of globalErrors) console.error(`  ✖ ${e}`);
  if (!flag("--require-all") && !strict && missing.length) console.warn(`  ! ${missing.length} bài VI chưa có bản EN (dùng --list-missing để xem)`);
  console.log(`[translations] tổng: ${have}/${viScope.length} có bản EN, ${errorCount} lỗi, ${staleCount} cũ`);
}
process.exit(errorCount ? 1 : 0);
