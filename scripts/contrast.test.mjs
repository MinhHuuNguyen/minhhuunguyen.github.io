// scripts/contrast.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { CONTRAST_RULES, GLASS_RULES, colors, resolveColor } from "../src/styles/tokens.mjs";
import { contrastRatio, composite } from "../src/lib/contrast.mjs";

test("contrastRatio và composite khớp số đo tay", () => {
  assert.equal(contrastRatio("#FFFFFF", "#82A7D2").toFixed(2), "2.50");
  assert.equal(contrastRatio("#3E91FF", "#FFFFFF").toFixed(2), "3.13");
  assert.equal(composite("rgba(13,45,98,0.55)", "#71D1F2"), "#3a77a3");
});

test("mọi cặp chữ/nền trong CONTRAST_RULES đạt ngưỡng", () => {
  for (const [fg, bg, min, usage] of CONTRAST_RULES) {
    const r = contrastRatio(resolveColor(fg), resolveColor(bg));
    assert.ok(r >= min, `${usage}: ${fg} trên ${bg} = ${r.toFixed(2)} < ${min}`);
  }
});

test("chữ trắng trên glass hero đạt 4.5 ở mọi điểm gradient", () => {
  for (const stop of GLASS_RULES.stops) {
    const bg = composite(GLASS_RULES.glass, resolveColor(stop));
    assert.ok(contrastRatio("#FFFFFF", bg) >= 4.5, `${stop} -> ${bg}`);
  }
});

test("accent không dùng được trên nền sáng (lý do của luật cấm)", () => {
  assert.ok(contrastRatio(colors.accent, colors.surface[0]) < 1.2);
});
