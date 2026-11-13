import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { OUTPUTS, PORTRAIT_SRC } from "./images.config.mjs";
import { colors } from "../src/styles/tokens.mjs";

const force = process.argv.includes("--force");

function heroSvg(w, h) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${colors.blue[900]}"/><stop offset="0.55" stop-color="${colors.blue[300]}"/>` +
      `<stop offset="1" stop-color="${colors.cyan[300]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`,
  );
}

async function composePortrait(width, height, portraitHeight, left) {
  const portrait = await sharp(PORTRAIT_SRC).resize({ height: portraitHeight }).png().toBuffer();
  const meta = await sharp(portrait).metadata();
  return sharp(heroSvg(width, height)).composite([
    { input: portrait, left: left ?? Math.round((width - meta.width) / 2), top: height - portraitHeight },
  ]);
}

async function render(o) {
  if (o.format === "og") {
    const portraitH = 560;
    const meta = await sharp(PORTRAIT_SRC).resize({ height: portraitH }).metadata();
    const img = await composePortrait(1200, 630, portraitH, 1200 - meta.width - 60);
    return img.jpeg({ quality: 82 }).toBuffer();
  }
  const p = sharp(o.src).rotate().resize({ width: o.width });
  switch (o.format) {
    case "avif": return p.avif({ quality: 55 }).toBuffer();
    case "webp": return p.webp({ quality: 72 }).toBuffer();
    case "png": return p.png({ compressionLevel: 9 }).toBuffer();
    case "jpg": return p.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    default: throw new Error(`định dạng không hỗ trợ: ${o.format}`);
  }
}

const previewIdx = process.argv.indexOf("--preview-cutout");
if (previewIdx !== -1) {
  const file = process.argv[previewIdx + 1];
  const img = await composePortrait(900, 1000, 900);
  await img.png().toFile(file);
  console.log(`preview: ${file}`);
} else {
  let made = 0, skipped = 0;
  for (const o of OUTPUTS) {
    if (!force && fs.existsSync(o.file) && fs.statSync(o.file).mtimeMs >= fs.statSync(o.src).mtimeMs) {
      skipped++;
      continue;
    }
    const buf = await render(o);
    fs.mkdirSync(path.dirname(o.file), { recursive: true });
    fs.writeFileSync(o.file, buf);
    console.log(`${o.file} | ${o.width} | ${buf.length}`);
    made++;
  }
  console.log(`${made} files, ${skipped} skipped`);
}
