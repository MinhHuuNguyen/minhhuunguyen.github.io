export type ChatMode = "coming-soon" | "mock" | "agent";
export type ChatLang = "vi" | "en";
export type ChatContext = { type: "post"; slug: string; title: string; url: string };
export type ChatSendRequest = { message: string; threadId: string | null; language: ChatLang; context: ChatContext | null };
export type ChatCitation = { index: number; label: string; url: string | null };
export type ChatReply = { text: string; threadId: string | null; citations: ChatCitation[] };
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations: ChatCitation[];
  createdAt: string;
  status: "ok" | "error" | "pending";
  errorCode?: string;
  context?: ChatContext;
};
export type ChatSession = { version: 1; threadId: string | null; messages: ChatMessage[] };
export interface ChatAdapter {
  readonly mode: ChatMode;
  send(req: ChatSendRequest, signal?: AbortSignal): Promise<ChatReply>;
}
export declare const COMING_SOON: { vi: string; en: string };
export declare const CHAT_MAX_CHARS: number;
export declare const CHAT_SESSION_KEY: string;
export declare const CHAT_MAX_MESSAGES: number;
export declare class ChatError extends Error {
  code: string;
  status?: number;
  constructor(code: string, status?: number);
}
export declare function resolveChatMode(env: Record<string, string | undefined>): { mode: ChatMode; warning: string | null };
export declare const safeUrl: (u: unknown) => string | null;
export declare function comingSoonAdapter(opts?: { delayMs?: number }): ChatAdapter;
export declare function mockAdapter(fixtures?: { label: string; url: string }[]): ChatAdapter;
export declare function mapAgentTurn(turn: unknown): ChatReply;
export declare function agentAdapter(opts: { baseUrl: string; fetchImpl?: typeof fetch; timeoutMs?: number }): ChatAdapter;
export declare const errorMessage: (code: string, lang: ChatLang) => string;
export declare function loadSession(raw: string | null): ChatSession;
export declare const appendMessage: (s: ChatSession, m: ChatMessage) => ChatSession;
