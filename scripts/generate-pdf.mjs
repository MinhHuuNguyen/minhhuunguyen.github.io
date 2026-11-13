/**
 * Sinh sẵn 3 file PDF cho CV bằng headless Chromium (Puppeteer), render qua `next dev`:
 *
 *   public/resume.pdf          -> /resume/print, bản ATS gọn (body.ats-short ẩn phần Project Detail)
 *   public/resume-full.pdf     -> /resume/print, bản ATS đầy đủ
 *   public/resume-designed.pdf -> /resume, bản thiết kế, một trang liền mạch rộng 1280px
 *
 * Chạy: yarn generate:pdf
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 4321;

const VARIANTS = [
  { file: "public/resume.pdf", url: "/resume/print", media: "print", bodyClass: "ats-short" },
  { file: "public/resume-full.pdf", url: "/resume/print", media: "print", bodyClass: "" },
  { file: "public/resume-designed.pdf", url: "/resume", media: "screen", bodyClass: "pdf-designed", width: 1280, singlePage: true },
];

async function waitForServer(url, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server chưa sẵn sàng
    }
    await sleep(1000);
  }
  throw new Error("Dev server không khởi động kịp");
}

const pageCount = (f) => (fs.readFileSync(f, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

const server = spawn("npx", ["next", "dev", "-p", String(PORT)], { cwd: ROOT, stdio: "inherit" });

try {
  await waitForServer(`http://localhost:${PORT}/resume/print`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  for (const v of VARIANTS) {
    await page.setViewport({ width: v.width ?? 1000, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${PORT}${v.url}`, { waitUntil: "networkidle0" });
    await page.emulateMediaType(v.media);
    await page.evaluate((c) => {
      document.body.className = c;
    }, v.bodyClass);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(ROOT, v.file);
    const opts = v.singlePage
      ? {
          width: "1280px",
          height: `${await page.evaluate(() => document.documentElement.scrollHeight)}px`,
          printBackground: true,
          pageRanges: "1",
        }
      : { format: "A4", printBackground: false, margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" } };
    await page.pdf({ path: out, ...opts });
    console.log(`✓ ${v.file} (${Math.round(fs.statSync(out).size / 1024)} KB, ${pageCount(out)} trang)`);
  }
  await browser.close();
} finally {
  server.kill("SIGTERM");
}
