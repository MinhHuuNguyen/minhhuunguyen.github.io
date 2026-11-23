/**
 * Tạo PDF (A4, text copy được) cho mọi bài viết VI + EN đủ điều kiện, ghi vào out/pdf/.
 *
 *   out/pdf/<slug>.pdf        bài VI
 *   out/pdf/en/<slug>.pdf     bài EN
 *
 * HTML in được dựng độc lập từ markdown (scripts/pdf/template.mjs), nạp vào Chromium headless (Puppeteer)
 * qua máy chủ cục bộ 127.0.0.1, không đi qua Next/SiteLayout. PDF được cache theo hash nên bài không đổi không render lại.
 *
 * Chạy:  yarn build:pdf                     (tất cả)
 *        node scripts/build-pdfs.mjs --slug <slug> [--lang vi|en] [--out out] [--cache .pdf-cache] [--concurrency 3] [--no-cache]
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer";
import { getSiteData } from "../src/lib/site-data.mjs";
import { eligiblePosts, pdfFile } from "../src/lib/pdf.mjs";
import { buildPrintHtml, TEMPLATE_FINGERPRINT, KATEX_DIST, FONTSOURCE_DIR } from "./pdf/template.mjs";
import { createImageProxy } from "./pdf/images.mjs";
import { sha256, itemKey, loadManifest, saveManifest, hasFresh, restore, store, prune } from "./pdf/cache.mjs";

const SELF = fileURLToPath(import.meta.url);
const SCRIPT_HASH = sha256(fs.readFileSync(SELF, "utf8"), fs.readFileSync(path.join(path.dirname(SELF), "pdf/images.mjs"), "utf8"));
// Ảnh bài là URL refs/heads/master: thay ảnh mà giữ URL thì HTML không đổi. Mốc tháng trong hash buộc render lại toàn bộ mỗi tháng.
const CACHE_EPOCH = new Date().toISOString().slice(0, 7);
const MIN_PDF_BYTES = 5_000;
const IMAGE_RETRIES = 3;

/** Host quảng cáo/phân tích: luôn chặn, dù HTML in không có script. */
const TRACKER_RE = /(googletagmanager|google-analytics|googlesyndication|doubleclick|googleadservices|adsbygoogle|facebook\.net|hotjar|clarity\.ms)/i;

export function parseArgs(argv) {
  const a = { slug: null, lang: null, out: "out", cache: ".pdf-cache", concurrency: 3, noCache: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--slug") a.slug = argv[++i];
    else if (k === "--lang") a.lang = argv[++i];
    else if (k === "--out") a.out = argv[++i];
    else if (k === "--cache") a.cache = argv[++i];
    else if (k === "--concurrency") a.concurrency = Math.max(1, Number(argv[++i]) || 3);
    else if (k === "--no-cache") a.noCache = true;
    else throw new Error(`Tham số không hợp lệ: ${k}`);
  }
  if (a.lang && !["vi", "en"].includes(a.lang)) throw new Error("--lang chỉ nhận vi hoặc en");
  return a;
}

const MIME = { ".css": "text/css; charset=utf-8", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".html": "text/html; charset=utf-8" };

/** Máy chủ cục bộ chỉ bind 127.0.0.1: trả HTML in đã dựng (/doc/<id>) và font/KaTeX (/assets/...). */
function startServer(docs) {
  const inside = (root, rel) => {
    const f = path.resolve(root, rel);
    return f.startsWith(root + path.sep) ? f : null;
  };
  const server = http.createServer((req, res) => {
    try {
      const { pathname } = new URL(req.url, "http://127.0.0.1");
      let file = null;
      let m;
      if ((m = /^\/doc\/(\d+)$/.exec(pathname))) {
        const html = docs.get(m[1]);
        if (html) {
          res.writeHead(200, { "content-type": MIME[".html"] });
          return res.end(html);
        }
      } else if ((m = /^\/assets\/katex\/(.+)$/.exec(pathname))) file = inside(KATEX_DIST, decodeURIComponent(m[1]));
      else if ((m = /^\/assets\/fonts\/([a-z-]+)\/files\/([^/]+)$/.exec(pathname))) file = inside(path.join(FONTSOURCE_DIR, m[1], "files"), decodeURIComponent(m[2]));
      if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream", "cache-control": "max-age=3600" });
        return fs.createReadStream(file).pipe(res);
      }
      res.writeHead(404).end();
    } catch {
      res.writeHead(400).end();
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });
}

async function newPage(browser, images) {
  const page = await browser.newPage();
  page.setDefaultTimeout(180_000);
  const state = { failedImages: new Map() }; // url -> HTTP status (0 = lỗi mạng)
  page.state = state;
  await page.setViewport({ width: 794, height: 1123 });
  await page.emulateMediaType("print");
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    try {
      let u;
      try { u = new URL(req.url()); } catch { return await req.abort(); }
      if (u.protocol === "data:" || u.protocol === "about:" || u.hostname === "127.0.0.1") return await req.continue();
      if (TRACKER_RE.test(u.hostname) || !["http:", "https:"].includes(u.protocol)) return await req.abort();
      // Từ bên ngoài chỉ nhận ảnh (ảnh trong bài), qua proxy: retry, thu nhỏ, biết chính xác mã HTTP. Mọi thứ khác bị chặn.
      if (req.resourceType() !== "image") return await req.abort();
      const r = await images.get(req.url());
      if (r.status !== 200) state.failedImages.set(req.url(), r.status);
      return await req.respond({ status: r.status === 200 ? 200 : r.status || 502, contentType: r.contentType, body: r.body });
    } catch {
      // trang đã đóng hoặc request đã được xử lý
    }
  });
  return page;
}

/** Chờ font + ảnh, trả về danh sách ảnh lỗi. Ảnh "soft" (banner bìa) lỗi thì thay bằng dải màu. */
async function settle(page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const broken = await page.evaluate(async () => {
    const imgs = [...document.images];
    const waiting = imgs.filter((i) => !i.complete).map((i) => new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); }));
    await Promise.race([Promise.all(waiting), new Promise((r) => setTimeout(r, 150_000))]);
    return imgs
      .filter((i) => !i.complete || (i.naturalWidth === 0 && !/\.svg(\?|#|$)/i.test(i.currentSrc || i.src)))
      .map((i) => ({ src: i.currentSrc || i.src, soft: i.dataset.soft === "1" }));
  });
  for (const [url] of page.state.failedImages) if (!broken.some((b) => b.src === url)) broken.push({ src: url, soft: false });
  return broken.map((b) => ({ ...b, status: page.state.failedImages.get(b.src) ?? 0 }));
}

/** 404/410: ảnh đã chết trong chính nội dung bài (web cũng hỏng); lỗi khác (mạng, 429, 5xx) coi là tạm thời. */
const isDead = (status) => status === 404 || status === 410;

/** Trả về { dead } = URL ảnh 404 đã bị bỏ khỏi PDF. Ảnh lỗi tạm thời được thử lại; hết lượt thì ném lỗi. */
async function renderPdf(page, base, id, tmpFile, label) {
  let lastBroken = [];
  for (let attempt = 1; attempt <= IMAGE_RETRIES; attempt++) {
    page.state.failedImages.clear();
    // Chỉ chờ DOM: ảnh đi qua proxy (đã có timeout + retry riêng), settle() chờ ảnh.
    await page.goto(`${base}/doc/${id}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const broken = await settle(page);
    const hard = broken.filter((b) => !b.soft);
    const transient = hard.filter((b) => !isDead(b.status));
    if (!transient.length) {
      const dead = hard.map((b) => b.src);
      await page.evaluate((deadUrls) => {
        // Banner bìa lỗi: thay bằng dải màu. Ảnh 404 trong bài: bỏ (như trình duyệt không hiện được).
        document.querySelectorAll('img[data-soft="1"]').forEach((i) => {
          if (!i.complete || i.naturalWidth === 0) { const d = document.createElement("div"); d.className = "cover-band"; i.replaceWith(d); }
        });
        document.querySelectorAll(".post img").forEach((i) => { if (deadUrls.includes(i.currentSrc || i.src)) i.remove(); });
      }, dead);
      if (broken.some((b) => b.soft)) console.warn(`⚠ ${label}: bỏ banner bìa không tải được`);
      await sleep(50); // để layout ổn định (không dùng rAF: tab nền không bao giờ chạy rAF)
      await page.pdf({ path: tmpFile, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true, displayHeaderFooter: false });
      return { dead };
    }
    lastBroken = transient;
    if (attempt < IMAGE_RETRIES) await sleep(1000 * 2 ** (attempt - 1));
  }
  throw new Error(`${label}: ảnh không tải được sau ${IMAGE_RETRIES} lần: ${lastBroken.map((b) => `${b.src} [${b.status || "lỗi mạng"}]`).join(", ")}`);
}

const isPdf = (f) => {
  const fd = fs.openSync(f, "r");
  const b = Buffer.alloc(5);
  fs.readSync(fd, b, 0, 5, 0);
  fs.closeSync(fd);
  return b.toString("latin1") === "%PDF-";
};

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const t0 = Date.now();
  const data = getSiteData();
  const all = eligiblePosts(data);
  const wanted = args.slug || args.lang;
  const items = all.filter((it) => (!args.slug || it.slug === args.slug) && (!args.lang || it.locale === args.lang));
  if (!items.length) throw new Error(`Không có bài đủ điều kiện khớp ${args.slug ?? ""} ${args.lang ?? ""}`.trim());
  const outRoot = path.resolve(args.out);
  const cacheDir = path.resolve(args.cache);
  const manifest = args.noCache ? {} : loadManifest(cacheDir);

  // Dựng HTML + hash trước (nhanh), quyết định bài nào cần render.
  const viToEn = data.postPairs.viToEn;
  const jobs = [];
  let cached = 0;
  for (const it of items) {
    const key = itemKey(it.locale, it.slug);
    const dest = path.join(outRoot, pdfFile(it.slug, it.locale));
    const html = await buildPrintHtml({ post: it.post, locale: it.locale, viToEn });
    const hash = sha256(TEMPLATE_FINGERPRINT, SCRIPT_HASH, CACHE_EPOCH, html);
    if (!args.noCache && hasFresh(cacheDir, manifest, key, hash)) {
      restore(cacheDir, key, dest);
      cached++;
      continue;
    }
    jobs.push({ ...it, key, dest, html, hash });
  }
  console.log(`PDF: ${items.length} bài (${cached} từ cache, ${jobs.length} cần render)`);

  const failures = [];
  const deadImages = [];
  if (jobs.length) {
    const docs = new Map();
    const { server, base } = await startServer(docs);
    const images = createImageProxy({ concurrency: args.concurrency * 2 });
    const ci = process.env.CI === "true" || process.env.PDF_NO_SANDBOX === "1";
    const browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 300_000,
      // Nhiều tab song song: tắt throttle tab nền để timer/layout của mọi tab chạy bình thường.
      args: ["--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", ...(ci ? ["--no-sandbox", "--disable-dev-shm-usage"] : [])],
    });
    try {
      const queue = jobs.map((j, i) => ({ ...j, id: String(i) }));
      jobs.forEach((j, i) => docs.set(String(i), j.html));
      let done = 0;
      let aborted = false;
      const worker = async () => {
        const page = await newPage(browser, images);
        for (let job; !aborted && (job = queue.shift()); ) {
          const label = job.key;
          const s = Date.now();
          const tmp = `${job.dest}.tmp`;
          try {
            fs.mkdirSync(path.dirname(job.dest), { recursive: true });
            let dead;
            try {
              ({ dead } = await renderPdf(page, base, job.id, tmp, label));
            } catch (e) {
              // Lỗi ảnh đã được thử lại trong renderPdf; lỗi khác (timeout, tab treo) thì thử lại một lần.
              if (/ảnh không tải được/.test(String(e?.message))) throw e;
              console.warn(`⚠ ${label}: ${e?.message ?? e}; thử lại`);
              ({ dead } = await renderPdf(page, base, job.id, tmp, label));
            }
            if (dead.length) deadImages.push(...dead.map((url) => ({ key: job.key, url })));
            if (!isPdf(tmp) || fs.statSync(tmp).size < MIN_PDF_BYTES) throw new Error(`${label}: PDF tạo ra không hợp lệ`);
            fs.renameSync(tmp, job.dest);
            // Bài có ảnh 404 không vào cache: lần sau render lại để nhặt ảnh khi nó được sửa.
            if (!args.noCache && !dead.length) { store(cacheDir, job.key, job.dest); manifest[job.key] = job.hash; }
            docs.delete(job.id);
            console.log(`[${++done}/${jobs.length}] ${label} ${((Date.now() - s) / 1000).toFixed(1)}s`);
          } catch (e) {
            aborted = true; // fail-fast: dừng cấp việc mới
            const msg = e instanceof Error ? e.message : String(e);
            failures.push(msg.startsWith(label) ? msg : `${label}: ${msg}`);
            fs.rmSync(tmp, { force: true });
          }
        }
        await page.close();
      };
      await Promise.all(Array.from({ length: Math.min(args.concurrency, jobs.length) }, worker));
    } finally {
      await browser.close();
      server.close();
      if (!args.noCache) saveManifest(cacheDir, manifest); // lưu cả khi lỗi để lần chạy lại tận dụng phần đã xong
    }
  }
  if (deadImages.length) {
    // Lỗi nội dung (ảnh 404 trong bài): không chặn deploy nhưng phải thấy rõ, kể cả trong log/annotation của GitHub Actions.
    for (const d of deadImages) console.warn(`${process.env.GITHUB_ACTIONS ? "::warning::" : "⚠ "}${d.key}: ảnh 404 đã bị bỏ khỏi PDF: ${d.url}`);
  }
  if (failures.length) {
    console.error(`❌ Lỗi tạo PDF:\n${failures.join("\n")}`);
    process.exitCode = 1;
    return;
  }

  // Bản đầy đủ: dọn cache thừa và đối chiếu số lượng.
  if (!wanted) {
    if (!args.noCache) { const n = prune(cacheDir, manifest, all.map((it) => itemKey(it.locale, it.slug))); saveManifest(cacheDir, manifest); if (n) console.log(`Đã xoá ${n} bản cache không còn dùng`); }
    const problems = [];
    for (const it of all) {
      const f = path.join(outRoot, pdfFile(it.slug, it.locale));
      if (!fs.existsSync(f)) problems.push(`thiếu ${pdfFile(it.slug, it.locale)}`);
      else if (fs.statSync(f).size < MIN_PDF_BYTES || !isPdf(f)) problems.push(`PDF không hợp lệ: ${pdfFile(it.slug, it.locale)}`);
    }
    if (problems.length) {
      console.error(`❌ Kiểm tra số lượng PDF thất bại (${all.length} bài đủ điều kiện):\n${problems.join("\n")}`);
      process.exitCode = 1;
      return;
    }
  }
  const secs = (Date.now() - t0) / 1000;
  const bytes = items.reduce((n, it) => n + fs.statSync(path.join(outRoot, pdfFile(it.slug, it.locale))).size, 0);
  console.log(`✅ ${items.length} PDF, ${(bytes / 1048576).toFixed(1)} MB, ${secs.toFixed(1)}s (${jobs.length ? ((secs / jobs.length)).toFixed(1) : "0"}s/bài đã render)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
