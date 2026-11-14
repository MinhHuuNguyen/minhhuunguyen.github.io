// scripts/chat.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { COMING_SOON, resolveChatMode, comingSoonAdapter, agentAdapter, mapAgentTurn, ChatError, loadSession, appendMessage, safeUrl } from "../src/lib/chat.mjs";

const req = (o = {}) => ({ message: "Attention là gì?", threadId: "t1", language: "vi", context: null, ...o });

test("coming-soon trả đúng từng chữ theo ngôn ngữ, giữ threadId", async () => {
  const a = comingSoonAdapter({ delayMs: 0 });
  assert.deepEqual(await a.send(req()), { text: "Tính năng này sắp ra mắt", threadId: "t1", citations: [] });
  assert.equal((await a.send(req({ language: "en" }))).text, "This feature is coming soon");
  assert.equal(COMING_SOON.vi, "Tính năng này sắp ra mắt");
});

test("resolveChatMode", () => {
  assert.deepEqual(resolveChatMode({}), { mode: "coming-soon", warning: null });
  assert.equal(resolveChatMode({ NEXT_PUBLIC_CHAT_MODE: "agent" }).mode, "coming-soon");
  assert.match(resolveChatMode({ NEXT_PUBLIC_CHAT_MODE: "agent" }).warning, /NEXT_PUBLIC_CHAT_API_URL/);
  assert.equal(resolveChatMode({ NEXT_PUBLIC_CHAT_MODE: "agent", NEXT_PUBLIC_CHAT_API_URL: "https://x" }).mode, "agent");
  assert.equal(resolveChatMode({ NEXT_PUBLIC_CHAT_MODE: "zzz" }).mode, "coming-soon");
});

test("mapAgentTurn: url trích dẫn lấy từ evidence.metadata.url, chặn javascript:", () => {
  const r = mapAgentTurn({ answer: "A", thread_id: "t9", language: "vi", route: "rag",
    citations: [{ index: 1, evidence_id: "e1", label: "Mô hình Transformer" }, { index: 2, evidence_id: "e2", label: "x" }],
    evidence: [{ id: "e1", source: "blog", kind: "vector", content: "...", metadata: { url: "/blog/mo-hinh-transformer" } },
               { id: "e2", source: "blog", kind: "vector", content: "...", metadata: { url: "javascript:alert(1)" } }] });
  assert.deepEqual(r, { text: "A", threadId: "t9", citations: [{ index: 1, label: "Mô hình Transformer", url: "/blog/mo-hinh-transformer" }, { index: 2, label: "x", url: null }] });
  assert.throws(() => mapAgentTurn({ thread_id: "t" }), (e) => e instanceof ChatError && e.code === "bad_response");
});

test("agentAdapter: gửi đúng body, ánh xạ mã lỗi", async () => {
  let seen;
  const ok = agentAdapter({ baseUrl: "https://api.example/", fetchImpl: async (url, init) => { seen = { url, body: JSON.parse(init.body) }; return new Response(JSON.stringify({ answer: "Đáp", thread_id: "t2", language: "vi", route: "rag", citations: [] }), { status: 200 }); } });
  assert.equal((await ok.send(req({ context: { type: "post", slug: "s", title: "T", url: "/blog/s" } }))).threadId, "t2");
  assert.equal(seen.url, "https://api.example/chat");
  assert.deepEqual(seen.body, { message: "Attention là gì?", thread_id: "t1", language: "vi", context: { type: "post", slug: "s", title: "T", url: "/blog/s" }, include_trace: false });
  const code = async (fetchImpl) => { try { await agentAdapter({ baseUrl: "https://x", fetchImpl, timeoutMs: 20 }).send(req()); } catch (e) { return e.code; } };
  assert.equal(await code(async () => new Response("", { status: 429 })), "rate_limited");
  assert.equal(await code(async () => new Response("", { status: 503 })), "server");
  assert.equal(await code(async () => new Response("", { status: 422 })), "bad_request");
  assert.equal(await code(async () => { throw new TypeError("fetch failed"); }), "network");
  assert.equal(await code((_, init) => new Promise((_, rej) => init.signal.addEventListener("abort", () => rej(new DOMException("x", "AbortError"))))), "timeout");
});

test("phiên chat: dữ liệu hỏng thành rỗng (Review Focus 4), giữ 50 tin cuối", () => {
  assert.deepEqual(loadSession("{oops"), { version: 1, threadId: null, messages: [] });
  let s = loadSession(null);
  for (let i = 0; i < 55; i++) s = appendMessage(s, { id: String(i), role: "user", text: "x", citations: [], createdAt: "t", status: "ok" });
  assert.equal(s.messages.length, 50);
  assert.equal(s.messages[0].id, "5");
  assert.equal(safeUrl("javascript:x"), null);
  assert.equal(safeUrl("/blog/a"), "/blog/a");
});
