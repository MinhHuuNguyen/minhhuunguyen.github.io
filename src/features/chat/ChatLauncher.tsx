import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Sparkles } from "lucide-react";
import { useAnchorOffset } from "@/features/ads/useAnchorOffset";
import { useI18n } from "@/libs/i18n/I18nContext";
import { useChat } from "./ChatProvider";

// Khung chat (Radix Dialog, thread, composer) chỉ tải khi mở lần đầu để giữ ngân sách bundle.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

const HIDDEN_ON = new Set(["/ask", "/en/ask"]);

/** Nút nổi "Hỏi AI" + nơi tải lười khung chat (khung cũng mở được từ ⌘K và "Hỏi về bài này"). */
export function ChatLauncher() {
  const { t } = useI18n();
  const router = useRouter();
  const { isOpen, openChat } = useChat();
  const offset = useAnchorOffset();
  const [everOpened, setEverOpened] = useState(false);
  useEffect(() => {
    if (isOpen) setEverOpened(true);
  }, [isOpen]);
  const hidden = isOpen || HIDDEN_ON.has(router.pathname);

  return (
    <>
      {!hidden && (
        <button
          type="button"
          data-chat-launcher
          aria-label={t("chat.launcher")}
          onClick={() => openChat({ location: "launcher" })}
          style={{ bottom: 16 + offset }}
          className="fixed right-4 z-30 inline-flex size-14 items-center justify-center gap-2 rounded-full bg-pill-blue font-sans text-[15px] font-semibold text-white shadow-card transition hover:-translate-y-0.5 sm:size-auto sm:px-5 sm:py-3"
        >
          <Sparkles size={20} aria-hidden="true" />
          <span aria-hidden="true" className="hidden sm:inline">
            {t("chat.launcher")}
          </span>
        </button>
      )}
      {everOpened && <ChatPanel />}
    </>
  );
}

export default ChatLauncher;
