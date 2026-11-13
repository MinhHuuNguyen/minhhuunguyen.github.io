import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import sharp from "sharp";
import { IMAGE_BUDGETS, OUTPUTS } from "./images.config.mjs";

test("mọi biến thể ảnh đã sinh, đúng bề rộng", async () => {
  for (const o of OUTPUTS) {
    assert.ok(fs.existsSync(o.file), `thiếu ${o.file}`);
    const meta = await sharp(o.file).metadata();
    assert.equal(meta.width, o.width, o.file);
  }
});

test("ảnh nằm trong ngân sách", () => {
  assert.ok(fs.statSync("public/img/portrait/minh-cutout-800.avif").size <= IMAGE_BUDGETS.portraitAvif800);
  for (const n of ["pixta-yep-2024", "neu-2024", "pixta-5-years", "pixta-horizon-2024", "protonx-2024"]) {
    assert.ok(fs.statSync(`public/img/events/${n}-1600.webp`).size <= IMAGE_BUDGETS.eventWebp1600, n);
  }
});

test("ảnh OG đúng 1200×630", async () => {
  const m = await sharp("public/img/og-default.jpg").metadata();
  assert.deepEqual([m.width, m.height], [1200, 630]);
});
