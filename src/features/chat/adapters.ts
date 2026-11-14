import { agentAdapter, comingSoonAdapter, mockAdapter, resolveChatMode, type ChatAdapter } from "@/lib/chat.mjs";

const MOCK_FIXTURES = [
  { label: "Blog", url: "/blog" },
  { label: "Lộ trình học", url: "/learn" },
];

/** Tạo adapter theo biến môi trường. Viết literal từng biến: Next chỉ thay `process.env.TÊN`, không thay cả object. */
export function createChatAdapter(): { adapter: ChatAdapter; warning: string | null } {
  const { mode, warning } = resolveChatMode({
    NEXT_PUBLIC_CHAT_MODE: process.env.NEXT_PUBLIC_CHAT_MODE,
    NEXT_PUBLIC_CHAT_API_URL: process.env.NEXT_PUBLIC_CHAT_API_URL,
  });
  if (mode === "agent") return { adapter: agentAdapter({ baseUrl: process.env.NEXT_PUBLIC_CHAT_API_URL as string }), warning };
  if (mode === "mock") return { adapter: mockAdapter(MOCK_FIXTURES), warning };
  return { adapter: comingSoonAdapter(), warning };
}
