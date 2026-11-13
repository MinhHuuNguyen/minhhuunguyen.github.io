import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

export type ChatContext = { type: "post"; slug: string; title: string; url: string };
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
}

const ChatCtx = createContext<ChatContextValue | null>(null);

/** Trạng thái mở/đóng khung chat; giao diện và adapter làm ở T21. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const openChat = useCallback((opts?: OpenChatOptions) => {
    setOpen(true);
    track("chat_open", { location: opts?.location ?? "launcher" });
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ isOpen, openChat, close }), [isOpen, openChat, close]);
  return <ChatCtx.Provider value={value}>{children}</ChatCtx.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
