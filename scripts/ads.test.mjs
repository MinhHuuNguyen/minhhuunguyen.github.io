import test from "node:test";
import assert from "node:assert/strict";
import { AD_PACKAGES, planInArticleAds, adsMode } from "../src/lib/ads.mjs";

const S = (words, o = {}) => ({ words, first: "text", last: "text", hasMedia: false, ...o });
const max = AD_PACKAGES.max;

test("gói max đúng số của spec C23", () => {
  assert.deepEqual(max, { maxPerPost: 4, minWordsBeforeFirst: 300, minGapWords: 400, minWordsPerAd: 500 });
});

test("bài ngắn, rỗng hoặc 1 section: không quảng cáo", () => {
  assert.deepEqual(planInArticleAds([], max), []);
  assert.deepEqual(planInArticleAds([S(3000)], max), []);
  assert.deepEqual(planInArticleAds([S(200), S(200)], max), []);
});

test("ví dụ chuẩn: [120,300,280,500,150,400] -> sau section 1 và 3", () => {
  assert.deepEqual(planInArticleAds([S(120), S(300), S(280), S(500), S(150), S(400)], max), [1, 3]);
});

test("không đặt sau code, trước media, cạnh section có video (Review Focus 5)", () => {
  const secs = [S(120), S(300, { last: "code" }), S(280), S(500), S(150, { hasMedia: true }), S(400)];
  assert.deepEqual(planInArticleAds(secs, max), [2]);
});

test("trần 4 khối với bài dài", () => {
  assert.deepEqual(planInArticleAds(Array.from({ length: 20 }, () => S(300)), max), [1, 3, 5, 7]);
});

test("adsMode", () => {
  assert.equal(adsMode({ NEXT_PUBLIC_ADS_MODE: "live", NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID: "ca-pub-1" }), "live");
  assert.equal(adsMode({ NEXT_PUBLIC_ADS_MODE: "live" }), "off");
  assert.equal(adsMode({ NODE_ENV: "development", NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID: "ca-pub-1" }), "placeholder");
  assert.equal(adsMode({ NEXT_PUBLIC_ADS_MODE: "weird", NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID: "ca-pub-1" }), "off");
});
