import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { ChatMessage } from "@/lib/chat.mjs";
import { useI18n } from "@/libs/i18n/I18nContext";
import { AppLink } from "@/components/ui/AppLink";

/** Danh sách tin nhắn; chữ trong bong bóng nằm trong phần tử `data-role`, chip trích dẫn nằm ngoài. */
export function ChatThread({ messages, pending, onRetry }: { messages: ChatMessage[]; pending: boolean; onRetry: () => void }) {
  const { t } = useI18n();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [messages.length, pending]);

  return (
    <div role="log" aria-live="polite" className="flex flex-col gap-3">
      {messages.map((m, i) =>
        m.role === "user" ? (
          <div key={m.id} className="flex justify-end">
            <p data-role="user" className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-blue-900 px-4 py-2.5 text-[15px] text-white">
              {m.text}
            </p>
          </div>
        ) : (
          <div key={m.id} className="flex flex-col items-start gap-2">
            <p
              data-role="assistant"
              data-status={m.status}
              className={
                m.status === "error"
                  ? "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-danger-50 px-4 py-2.5 text-[15px] text-danger-700"
                  : "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[15px] text-ink-900 shadow-card"
              }
            >
              {m.text}
            </p>
            {m.status === "error" && i === messages.length - 1 && !pending && (
              <button type="button" onClick={onRetry} className="rounded-pill bg-white px-4 py-1.5 text-sm font-semibold text-ink-900 shadow-card">
                {t("chat.retry")}
              </button>
            )}
            {m.citations.length > 0 && (
              <ul aria-label={t("chat.citation")} className="flex flex-wrap gap-2">
                {m.citations.map((c) => (
                  <li key={c.index}>
                    {c.url ? (
                      <AppLink
                        href={c.url}
                        onClick={() => track("chat_citation_click", { position: c.index })}
                        className="inline-flex rounded-pill bg-surface-100 px-3 py-1 text-[13px] font-medium text-blue-700 hover:bg-surface-50"
                      >
                        [{c.index}] {c.label} ↗
                      </AppLink>
                    ) : (
                      <span className="inline-flex rounded-pill bg-surface-100 px-3 py-1 text-[13px] font-medium text-ink-700">
                        [{c.index}] {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      )}
      {pending && (
        <p role="status" className="text-sm text-ink-500">
          {t("chat.pending")}
        </p>
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatThread;
