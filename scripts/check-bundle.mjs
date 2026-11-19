import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
export const BUNDLE_BUDGETS = { "/": 140_000, "/blog/[id]": 150_000, default: 140_000 };
const PAGES = ["/", "/blog", "/blog/[id]", "/learn", "/learn/[path]", "/videos", "/projects", "/resume", "/ask"];
const manifest = JSON.parse(fs.readFileSync(".next/build-manifest.json", "utf8"));
const gz = (f) => zlib.gzipSync(fs.readFileSync(path.join(".next", f))).length;
const js = (list) => (list ?? []).filter((f) => f.endsWith(".js"));
let failed = false;
for (const page of PAGES) {
  const files = new Set([...js(manifest.pages["/_app"]), ...js(manifest.pages[page])]);
  const total = [...files].reduce((n, f) => n + gz(f), 0);
  const budget = BUNDLE_BUDGETS[page] ?? BUNDLE_BUDGETS.default;
  failed ||= total > budget;
  console.log(`[bundle] ${page.padEnd(14)} ${(total / 1000).toFixed(1)} kB / ${budget / 1000} kB ${total <= budget ? "ok" : "VƯỢT"}`);
}
if (failed) process.exit(1);

