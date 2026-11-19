import { useRef, useState, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { CHAT_MAX_CHARS } from "@/lib/chat.mjs";
import { useI18n } from "@/libs/i18n/I18nContext";

const COUNTER_FROM = 1800;

/** Ô nhập: Enter gửi, Shift+Enter xuống dòng, tối đa CHAT_MAX_CHARS ký tự. */
export function Composer({ pending, onSend }: { pending: boolean; onSend: (text: string) => void }) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const len = value.length;
  const tooLong = len > CHAT_MAX_CHARS;
  const canSend = value.trim().length > 0 && !tooLong && !pending;

  const grow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };
  const submit = () => {
    if (!canSend) return;
    onSend(value);
    setValue("");
    requestAnimationFrame(grow);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-line-light bg-white p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          aria-label={t("chat.input")}
          onChange={(e) => {
            setValue(e.target.value);
            grow();
          }}
          onKeyDown={onKeyDown}
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-2xl border border-line-light bg-surface-50 px-4 py-2.5 text-[15px] text-ink-900 outline-none focus:border-blue-500"
        />
        <button
          type="button"
          aria-label={t("chat.send")}
          disabled={!canSend}
          onClick={submit}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-900 text-white transition enabled:hover:bg-blue-950 disabled:opacity-40"
        >
          <SendHorizontal size={18} aria-hidden="true" />
        </button>
      </div>
      {len >= COUNTER_FROM && (
        <p data-char-count className={tooLong ? "mt-1 text-right text-xs font-semibold text-danger-700" : "mt-1 text-right text-xs text-ink-500"}>
          {len}/{CHAT_MAX_CHARS}
        </p>
      )}
    </div>
  );
}

export default Composer;
