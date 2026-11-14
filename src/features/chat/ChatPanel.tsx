import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { useI18n } from "@/libs/i18n/I18nContext";
import { ChatThread } from "./ChatThread";
import { Composer } from "./Composer";
import { useChat } from "./ChatProvider";

const SUGGESTIONS = ["chat.suggestion1", "chat.suggestion2", "chat.suggestion3"] as const;

/** Thân khung chat dùng chung cho hộp thoại và trang /ask. */
export function ChatSurface({ variant }: { variant: "dialog" | "page" }) {
  const { t } = useI18n();
  const { mode, messages, pending, context, send, retry, clear, clearContext } = useChat();
  const TitleTag = variant === "dialog" ? Dialog.Title : "h1";
  const iconBtn = "grid size-9 place-items-center rounded-full text-ink-900 hover:bg-surface-100";

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-50 font-sans text-ink-900">
      <div className="flex items-center gap-2 border-b border-line-light bg-white px-4 py-3">
        <TitleTag className="text-lg font-semibold">{t("chat.title")}</TitleTag>
        {mode === "coming-soon" && (
          <span className="rounded-pill bg-accent px-2.5 py-0.5 text-xs font-semibold text-ink-900">{t("chat.soonBadge")}</span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {messages.length > 0 && (
            <button type="button" aria-label={t("chat.clear")} title={t("chat.clear")} onClick={clear} className={iconBtn}>
              <Trash2 size={18} aria-hidden="true" />
            </button>
          )}
          {variant === "dialog" && (
            <Dialog.Close aria-label={t("chat.close")} title={t("chat.close")} className={iconBtn}>
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="mb-4">
            <p className="rounded-2xl bg-white px-4 py-3 text-[15px] shadow-card">{t("chat.greeting")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    data-suggestion
                    onClick={() => send(t(key))}
                    className="rounded-pill bg-white px-4 py-2 text-left text-sm font-medium text-ink-900 shadow-card transition hover:-translate-y-0.5"
                  >
                    {t(key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ChatThread messages={messages} pending={pending} onRetry={retry} />
      </div>

      {context && (
        <div data-context-chip className="mx-3 mb-2 flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 text-sm text-ink-700 shadow-card">
          <span className="min-w-0 flex-1 truncate">{t("chat.context").replace("{title}", context.title)}</span>
          <button type="button" aria-label={t("chat.contextRemove")} onClick={clearContext} className="grid size-6 shrink-0 place-items-center rounded-full hover:bg-surface-100">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <Composer pending={pending} onSend={send} />
      <p className="bg-white px-4 pb-3 text-center text-xs text-ink-500">{t("chat.disclaimer")}</p>
    </div>
  );
}

/** Khung chat dạng ngăn phải (toàn màn hình trên mobile). Chỉ tải ở lần mở đầu tiên. */
export function ChatPanel() {
  const { isOpen, close } = useChat();
  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement | null)?.querySelector("textarea")?.focus();
          }}
          className="fixed inset-0 z-50 overflow-hidden shadow-card sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px]"
        >
          <ChatSurface variant="dialog" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ChatPanel;
