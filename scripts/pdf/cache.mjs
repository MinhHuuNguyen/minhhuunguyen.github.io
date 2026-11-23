// Cache PDF theo hash: thư mục chứa các PDF đã tạo + manifest.json { "<lang>/<slug>": "<hash>" }.
// Bài không đổi (cùng hash) thì chép PDF từ cache thay vì render lại.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const sha256 = (...parts) => {
  const h = crypto.createHash("sha256");
  for (const p of parts) h.update(String(p)).update("\0");
  return h.digest("hex");
};

export const itemKey = (locale, slug) => `${locale}/${slug}`;

export function loadManifest(dir) {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
    return m && typeof m === "object" && !Array.isArray(m) ? m : {};
  } catch {
    return {};
  }
}

export function saveManifest(dir, manifest) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "manifest.json"), `${JSON.stringify(manifest, null, 1)}\n`);
}

const cachedFile = (dir, key) => path.join(dir, `${key}.pdf`);

/** Cache có bản hợp lệ (đúng hash, file là PDF) cho `key` không. */
export function hasFresh(dir, manifest, key, hash) {
  if (manifest[key] !== hash) return false;
  try {
    const f = cachedFile(dir, key);
    const fd = fs.openSync(f, "r");
    const buf = Buffer.alloc(5);
    fs.readSync(fd, buf, 0, 5, 0);
    fs.closeSync(fd);
    return buf.toString("latin1") === "%PDF-" && fs.statSync(f).size > 1024;
  } catch {
    return false;
  }
}

export function restore(dir, key, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(cachedFile(dir, key), dest);
}

export function store(dir, key, src) {
  const f = cachedFile(dir, key);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.copyFileSync(src, f);
}

/** Xoá khỏi manifest và đĩa các bản cache không còn thuộc `liveKeys` (bài bị xoá/đổi slug). */
export function prune(dir, manifest, liveKeys) {
  const live = new Set(liveKeys);
  let removed = 0;
  for (const key of Object.keys(manifest)) {
    if (live.has(key)) continue;
    delete manifest[key];
    fs.rmSync(cachedFile(dir, key), { force: true });
    removed++;
  }
  return removed;
}
