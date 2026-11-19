import test from "node:test";
import assert from "node:assert/strict";
import { slotsFromAdUnits, validateSlots, applySlots } from "./set-ad-slots.mjs";

const unit = (displayName, id, state = "ACTIVE") => ({ name: `accounts/pub-1/adclients/ca-pub-1/adunits/${id}`, displayName, state });

test("slotsFromAdUnits lấy ID cuối của name theo displayName", () => {
  const slots = slotsFromAdUnits([
    unit("post-rail-300x600", "1111111111"),
    unit("post-in-article", "2222222222"),
    unit("post-multiplex", "3333333333"),
    unit("other", "4444444444"),
  ]);
  assert.deepEqual(slots, { rail: "1111111111", inArticle: "2222222222", multiplex: "3333333333" });
});

test("thiếu hoặc trùng ad unit thì lỗi", () => {
  assert.throws(() => slotsFromAdUnits([unit("post-rail-300x600", "1111111111")]));
  assert.throws(() =>
    slotsFromAdUnits([
      unit("post-rail-300x600", "1111111111"),
      unit("post-rail-300x600", "5555555555"),
      unit("post-in-article", "2222222222"),
      unit("post-multiplex", "3333333333"),
    ]),
  );
});

test("validateSlots từ chối sai định dạng và slot giữ chỗ", () => {
  assert.throws(() => validateSlots({ rail: "123", inArticle: "2222222222", multiplex: "3333333333" }));
  assert.throws(() => validateSlots({ rail: "4893845087", inArticle: "4893845087", multiplex: "4893845087" }));
});

test("applySlots giữ package và enPosts, bỏ note", () => {
  const out = applySlots({ package: "max", enPosts: false, slots: {}, note: "x" }, { rail: "1", inArticle: "2", multiplex: "3" });
  assert.deepEqual(out, { package: "max", enPosts: false, slots: { rail: "1", inArticle: "2", multiplex: "3" } });
});
