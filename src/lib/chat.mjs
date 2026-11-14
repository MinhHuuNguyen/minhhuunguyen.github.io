export const COMING_SOON = { vi: "Tính năng này sắp ra mắt", en: "This feature is coming soon" };
export const CHAT_MAX_CHARS = 2000, CHAT_SESSION_KEY = "chat:v1", CHAT_MAX_MESSAGES = 50;
export class ChatError extends Error { constructor(code, status) { super(code); this.name = "ChatError"; this.code = code; this.status = status; } }
const MODES = ["coming-soon", "mock", "agent"];
export function resolveChatMode(env) {
  const mode = env.NEXT_PUBLIC_CHAT_MODE || "coming-soon";
  if (!MODES.includes(mode)) return { mode: "coming-soon", warning: `NEXT_PUBLIC_CHAT_MODE không hợp lệ: ${mode}` };
  if (mode === "agent" && !env.NEXT_PUBLIC_CHAT_API_URL) return { mode: "coming-soon", warning: "NEXT_PUBLIC_CHAT_MODE=agent nhưng thiếu NEXT_PUBLIC_CHAT_API_URL" };
  return { mode, warning: null };
}
const sleep = (ms, signal) => new Promise((res, rej) => {
  const t = setTimeout(res, ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); rej(new ChatError("timeout")); }, { once: true });
});
export const safeUrl = (u) => (typeof u === "string" && /^(https?:\/\/|\/(?!\/))/.test(u) ? u : null);
export function comingSoonAdapter({ delayMs = 300 } = {}) {
  return { mode: "coming-soon", async send(req, signal) {
    if (delayMs) await sleep(delayMs, signal);
    return { text: COMING_SOON[req.language] ?? COMING_SOON.vi, threadId: req.threadId, citations: [] };
  } };
}
export function mockAdapter(fixtures = []) {
  return { mode: "mock", async send(req, signal) {
    await sleep(500, signal);
    const text = req.language === "en"
      ? `(mock) You asked: "${req.message}". This is sample text for building the UI.`
      : `(mock) Bạn hỏi: "${req.message}". Đây là câu trả lời mẫu để dựng giao diện.`;
    return { text, threadId: req.threadId ?? "mock-thread", citations: fixtures.slice(0, 2).map((f, i) => ({ index: i + 1, label: f.label, url: safeUrl(f.url) })) };
  } };
}
export function mapAgentTurn(turn) {
  if (typeof turn?.answer !== "string" || typeof turn?.thread_id !== "string") throw new ChatError("bad_response");
  const ev = new Map((turn.evidence ?? []).map((e) => [e.id, e]));
  return { text: turn.answer, threadId: turn.thread_id,
    citations: (turn.citations ?? []).map((c) => ({ index: c.index, label: c.label, url: safeUrl(ev.get(c.evidence_id)?.metadata?.url) })) };
}
export function agentAdapter({ baseUrl, fetchImpl = globalThis.fetch, timeoutMs = 60000 }) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat`;
  return { mode: "agent", async send(req, signal) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(new ChatError("timeout")), timeoutMs);
    signal?.addEventListener("abort", () => ctrl.abort(), { once: true });
    let res;
    try {
      res = await fetchImpl(url, { method: "POST", headers: { "content-type": "application/json" }, signal: ctrl.signal,
        body: JSON.stringify({ message: req.message, thread_id: req.threadId ?? undefined, language: req.language, context: req.context ?? undefined, include_trace: false }) });
    } catch {
      throw ctrl.signal.reason instanceof ChatError ? ctrl.signal.reason : new ChatError(ctrl.signal.aborted ? "timeout" : "network");
    } finally { clearTimeout(timer); }
    if (res.status === 429) throw new ChatError("rate_limited", 429);
    if (res.status >= 500) throw new ChatError("server", res.status);
    if (!res.ok) throw new ChatError("bad_request", res.status);
    let json;
    try { json = await res.json(); } catch { throw new ChatError("bad_response", res.status); }
    return mapAgentTurn(json);
  } };
}
const MSG = {
  vi: { network: "Không kết nối được máy chủ chat. Kiểm tra mạng rồi thử lại.", timeout: "Máy chủ trả lời quá lâu. Thử lại sau.",
        rate_limited: "Bạn hỏi hơi nhanh. Đợi một chút rồi thử lại.", server: "Máy chủ chat đang bận. Thử lại sau ít phút.",
        bad_request: "Câu hỏi chưa hợp lệ. Thử viết ngắn hơn.", bad_response: "Máy chủ trả dữ liệu lạ. Thử lại sau." },
  en: { network: "Cannot reach the chat server. Check your connection and try again.", timeout: "The server took too long. Try again later.",
        rate_limited: "You're asking a bit fast. Wait a moment and try again.", server: "The chat server is busy. Try again in a few minutes.",
        bad_request: "The question is not valid. Try a shorter one.", bad_response: "The server sent an unexpected response. Try again later." },
};
export const errorMessage = (code, lang) => (MSG[lang] ?? MSG.vi)[code] ?? MSG.vi.server;
const EMPTY_SESSION = () => ({ version: 1, threadId: null, messages: [] });
export function loadSession(raw) {
  try {
    const v = JSON.parse(raw ?? "");
    if (v?.version === 1 && Array.isArray(v.messages))
      return { version: 1, threadId: typeof v.threadId === "string" ? v.threadId : null, messages: v.messages.slice(-CHAT_MAX_MESSAGES) };
  } catch { /* hỏng thì làm lại */ }
  return EMPTY_SESSION();
}
export const appendMessage = (s, m) => ({ ...s, messages: [...s.messages, m].slice(-CHAT_MAX_MESSAGES) });
