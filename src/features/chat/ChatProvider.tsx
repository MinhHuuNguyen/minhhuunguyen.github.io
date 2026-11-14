import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import { track } from "@/lib/analytics";
import { safeStorage } from "@/lib/progress.mjs";
import {
  CHAT_MAX_CHARS,
  CHAT_SESSION_KEY,
  ChatError,
  appendMessage,
  errorMessage,
  loadSession,
  type ChatContext,
  type ChatMessage,
  type ChatMode,
  type ChatSession,
} from "@/lib/chat.mjs";
import { useI18n } from "@/libs/i18n/I18nContext";
import { createChatAdapter } from "./adapters";

export type { ChatContext };
export type ChatLocation = "launcher" | "ask_page" | "post" | "palette";

interface OpenChatOptions {
  context?: ChatContext;
  message?: string;
  location: ChatLocation;
}

interface ChatContextValue {
  isOpen: boolean;
  openChat(opts?: OpenChatOptions): void;
  close(): void;
  mode: ChatMode;
  messages: ChatMessage[];
  pending: boolean;
  context: ChatContext | null;
  send(text: string): void;
  retry(): void;
  clear(): void;
  clearContext(): void;
}

const ChatCtx = createContext<ChatContextValue | null>(null);
const emptySession = (): ChatSession => ({ version: 1, threadId: null, messages: [] });
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Trạng thái chat: mở/đóng, phiên (lưu sessionStorage nếu được phép), gửi qua adapter. Giao diện nặng tải lười ở ChatLauncher. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const router = useRouter();
  const [{ adapter, warning }] = useState(createChatAdapter);
  const [isOpen, setOpen] = useState(false);
  const [session, setSession] = useState<ChatSession>(emptySession);
  const [pending, setPending] = useState(false);
  const [context, setContextState] = useState<ChatContext | null>(null);
  const sessionRef = useRef<ChatSession>(session);
  const pendingRef = useRef(false);
  const contextRef = useRef<ChatContext | null>(null);
  const localeRef = useRef(locale);
  const abortRef = useRef<AbortController | null>(null);
  localeRef.current = locale;

  useEffect(() => {
    if (warning && process.env.NODE_ENV !== "production") console.warn(`[chat] ${warning}`);
  }, [warning]);

  const commit = useCallback((next: ChatSession) => {
    sessionRef.current = next;
    setSession(next);
    try {
      safeStorage("session")?.setItem(CHAT_SESSION_KEY, JSON.stringify(next));
    } catch {
      /* storage đầy hoặc bị chặn: hội thoại vẫn sống trong bộ nhớ */
    }
  }, []);

  // Đọc phiên sau khi hydrate để HTML tĩnh và lần render đầu khớp nhau.
  useEffect(() => {
    const loaded = loadSession(safeStorage("session")?.getItem(CHAT_SESSION_KEY) ?? null);
    sessionRef.current = { ...loaded, messages: loaded.messages.filter((m) => m.status !== "pending") };
    setSession(sessionRef.current);
  }, []);

  const setContext = useCallback((c: ChatContext | null) => {
    contextRef.current = c;
    setContextState(c);
  }, []);

  // Ngữ cảnh bài chỉ đúng với trang đã mở nó.
  useEffect(() => {
    setContext(null);
  }, [router.asPath, setContext]);

  const send = useCallback(
    async (text: string, ctxOverride?: ChatContext | null) => {
      const message = text.trim();
      if (!message || message.length > CHAT_MAX_CHARS || pendingRef.current) return;
      const ctx = ctxOverride === undefined ? contextRef.current : ctxOverride;
      const lang = localeRef.current;
      const now = () => new Date().toISOString();
      const userMsg: ChatMessage = { id: uid(), role: "user", text: message, citations: [], createdAt: now(), status: "ok", ...(ctx ? { context: ctx } : {}) };
      const before = appendMessage(sessionRef.current, userMsg);
      commit(before);
      pendingRef.current = true;
      setPending(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      track("chat_send", { mode: adapter.mode, has_context: !!ctx });
      let reply: ChatMessage;
      let threadId = before.threadId;
      try {
        const r = await adapter.send({ message, threadId: before.threadId, language: lang, context: ctx }, ctrl.signal);
        threadId = r.threadId ?? threadId;
        reply = { id: uid(), role: "assistant", text: r.text, citations: r.citations, createdAt: now(), status: "ok" };
      } catch (e) {
        const code = e instanceof ChatError ? e.code : "network";
        reply = { id: uid(), role: "assistant", text: errorMessage(code, lang), citations: [], createdAt: now(), status: "error", errorCode: code };
      }
      if (ctrl.signal.aborted && abortRef.current !== ctrl) return; // đã xoá hội thoại giữa chừng
      abortRef.current = null;
      commit({ ...appendMessage(sessionRef.current, reply), threadId });
      pendingRef.current = false;
      setPending(false);
    },
    [adapter, commit],
  );

  const openChat = useCallback(
    (opts?: OpenChatOptions) => {
      if (opts?.context) setContext(opts.context);
      setOpen(true);
      track("chat_open", { location: opts?.location ?? "launcher" });
      if (opts?.message) void send(opts.message, opts.context);
    },
    [send, setContext],
  );
  const close = useCallback(() => setOpen(false), []);

  const retry = useCallback(() => {
    const msgs = sessionRef.current.messages;
    const last = msgs[msgs.length - 1];
    const asked = msgs[msgs.length - 2];
    if (pendingRef.current || last?.status !== "error" || asked?.role !== "user") return;
    commit({ ...sessionRef.current, messages: msgs.slice(0, -2) });
    void send(asked.text, asked.context ?? null);
  }, [commit, send]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    pendingRef.current = false;
    setPending(false);
    commit(emptySession());
  }, [commit]);

  const clearContext = useCallback(() => setContext(null), [setContext]);
  const sendText = useCallback((text: string) => void send(text), [send]);

  const value = useMemo<ChatContextValue>(
    () => ({ isOpen, openChat, close, mode: adapter.mode, messages: session.messages, pending, context, send: sendText, retry, clear, clearContext }),
    [isOpen, openChat, close, adapter.mode, session.messages, pending, context, sendText, retry, clear, clearContext],
  );
  return <ChatCtx.Provider value={value}>{children}</ChatCtx.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
