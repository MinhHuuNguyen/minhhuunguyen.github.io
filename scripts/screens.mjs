// Chụp 14 route × 2 cỡ màn hình vào $TMPDIR/screens/. Cần site đang chạy (mặc định http://localhost:4173).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const OUT = join(process.env.TMPDIR ?? tmpdir(), "screens");
const ROUTES = ["/", "/blog", "/learn", "/videos", "/projects", "/resume", "/ask", "/privacy", "/terms",
  "/en", "/en/learn", "/en/videos", "/en/resume", "/en/ask"];
const SIZES = [{ w: 1440, h: 900 }, { w: 375, h: 812 }];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const { w, h } of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, locale: "vi-VN" });
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "-")) + `-${w}.png`;
    await page.screenshot({ path: join(OUT, name), fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log(`Đã chụp ${ROUTES.length * SIZES.length} ảnh vào ${OUT}`);
