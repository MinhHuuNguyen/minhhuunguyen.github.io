// Proxy ảnh cho Chromium khi tạo PDF: tải ảnh từ Node (có retry, giới hạn đồng thời, dedupe) và thu nhỏ bằng sharp
// trước khi nhúng. Chromium nhúng ảnh gần nguyên bản vào PDF nên ảnh chụp lớn làm PDF phình tới hàng trăm MB.
import sharp from "sharp";
import { setTimeout as sleep } from "node:timers/promises";

export const MAX_WIDTH = 1500; // ~220 dpi với bề rộng nội dung A4 (176 mm)
const PASS_THROUGH = /^image\/(svg\+xml)/i;
const CACHE_LIMIT_BYTES = 256 * 1024 * 1024;

/** Thu nhỏ ảnh raster: rộng tối đa MAX_WIDTH; có alpha -> PNG, còn lại -> JPEG. SVG/không đọc được thì giữ nguyên. */
export async function shrink(body, contentType, maxWidth = MAX_WIDTH) {
  if (PASS_THROUGH.test(contentType)) return { body, contentType };
  try {
    const img = sharp(body, { failOn: "none" }).rotate();
    const meta = await sharp(body, { failOn: "none" }).metadata();
    const resized = img.resize({ width: maxWidth, withoutEnlargement: true });
    if (meta.hasAlpha) return { body: await resized.png({ compressionLevel: 9, palette: true }).toBuffer(), contentType: "image/png" };
    return { body: await resized.jpeg({ quality: 82, mozjpeg: true }).toBuffer(), contentType: "image/jpeg" };
  } catch {
    return { body, contentType };
  }
}

/**
 * @returns {{ get(url: string): Promise<{status:number, contentType:string, body:Buffer, transient?:boolean}> }}
 * status: mã HTTP thật (404/410 = ảnh chết); transient=true khi lỗi mạng/429/5xx sau khi hết lượt thử.
 */
// timeoutMs rộng: vài ảnh GIF trong bài nặng tới ~75 MB (chỉ khung đầu được nhúng vào PDF).
export function createImageProxy({ concurrency = 6, retries = 3, timeoutMs = 120_000, fetchImpl = fetch } = {}) {
  const done = new Map(); // url -> Promise<kết quả> (chỉ giữ kết quả không tạm thời)
  let cachedBytes = 0;
  let active = 0;
  const waiters = [];
  const acquire = async () => {
    if (active >= concurrency) await new Promise((r) => waiters.push(r));
    active++;
  };
  const release = () => {
    active--;
    waiters.shift()?.();
  };

  async function load(url) {
    let last = { status: 0, contentType: "text/plain", body: Buffer.alloc(0), transient: true };
    for (let attempt = 1; attempt <= retries; attempt++) {
      await acquire();
      try {
        const res = await fetchImpl(url, { redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
        if (res.ok) {
          const raw = Buffer.from(await res.arrayBuffer());
          const type = res.headers.get("content-type") ?? "application/octet-stream";
          return { status: 200, ...(await shrink(raw, type)) };
        }
        if (res.status === 404 || res.status === 410) return { status: res.status, contentType: "text/plain", body: Buffer.alloc(0) };
        last = { status: res.status, contentType: "text/plain", body: Buffer.alloc(0), transient: true };
      } catch {
        last = { status: 0, contentType: "text/plain", body: Buffer.alloc(0), transient: true };
      } finally {
        release();
      }
      if (attempt < retries) await sleep(1000 * 2 ** (attempt - 1));
    }
    return last;
  }

  return {
    async get(url) {
      const hit = done.get(url);
      if (hit) return hit;
      const p = load(url).then((r) => {
        if (r.transient) done.delete(url); // lần sau thử lại
        else if (cachedBytes + r.body.length > CACHE_LIMIT_BYTES) done.delete(url);
        else cachedBytes += r.body.length;
        return r;
      });
      done.set(url, p);
      return p;
    },
  };
}
