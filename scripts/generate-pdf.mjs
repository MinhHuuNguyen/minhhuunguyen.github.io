/**
 * Sinh sẵn 2 file PDF cho trang resume bằng cách render thật trang /resume
 * qua headless Chromium (Puppeteer). PDF giữ nguyên layout web, text copy
 * được, và header/footer của site bị ẩn nhờ CSS @media print trong globals.css.
 *
 *   public/resume.pdf       -> chỉ phần resume (#resume)
 *   public/resume-full.pdf  -> resume + phần Project Detail
 *
 * Chạy: yarn generate:pdf
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 4321;
const PAGE_URL = `http://localhost:${PORT}/resume`;

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

const server = spawn("npx", ["next", "dev", "-p", String(PORT)], {
  cwd: ROOT,
  stdio: "inherit",
});

try {
  await waitForServer(PAGE_URL);

  // Bề rộng "trang" PDF = bề rộng layout web desktop, để layout render Y HỆT web
  // (page.pdf dàn layout theo khổ giấy, nên phải đặt khổ = web width thay vì A4).
  const PAGE_WIDTH = 1280;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: PAGE_WIDTH, height: 1000, deviceScaleFactor: 1 });
  await page.goto(PAGE_URL, { waitUntil: "networkidle0" });
  await page.emulateMediaType("print");

  // Sinh 1 trang PDF liền mạch đúng bề rộng web (như khi cuộn trang web).
  const renderPdf = async (resumeOnly, fileName) => {
    await page.evaluate(
      (only) => document.body.classList.toggle("print-resume-only", only),
      resumeOnly
    );
    // Đo chiều cao thực của nội dung ở bề rộng web để làm chiều cao trang.
    const height = await page.evaluate(() =>
      Math.ceil(document.documentElement.getBoundingClientRect().height)
    );
    await page.pdf({
      path: path.join(ROOT, "public", fileName),
      printBackground: true,
      width: `${PAGE_WIDTH}px`,
      height: `${height}px`,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      pageRanges: "1",
    });
  };

  await renderPdf(true, "resume.pdf"); // chỉ phần resume
  await renderPdf(false, "resume-full.pdf"); // resume + Project Detail

  await browser.close();
  console.log("✅ Đã tạo public/resume.pdf và public/resume-full.pdf");
} finally {
  server.kill("SIGTERM");
}
