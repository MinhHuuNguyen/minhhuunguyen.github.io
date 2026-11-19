import { useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { useI18n } from "@/libs/i18n/I18nContext";
// Radix DropdownMenu (~18 kB gzip) chỉ tải khi rê chuột, focus hoặc bấm lần đầu (giữ ngân sách bundle 140 kB).
const loadRadix = () => import("./DownloadCvMenuRadix").then((m) => m.DownloadCvMenuRadix);
const DownloadCvMenuRadix = dynamic(loadRadix, { ssr: false, loading: () => <PlainTrigger /> });
const CV_TRIGGER_CLASS =
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-surface-100";
function PlainTrigger(props: Pick<ComponentProps<"button">, "onPointerEnter" | "onPointerDown" | "onFocus" | "onClick">) {
  const { t } = useI18n();
  return (
    <button type="button" aria-haspopup="menu" aria-expanded={false} className={CV_TRIGGER_CLASS} {...props}>
      <Download size={18} aria-hidden="true" />
      {t("resume.download")}
    </button>
  );
}
export function DownloadCvMenu() {
  const [state, setState] = useState<null | { open: boolean; focus: boolean }>(null);
  if (state) return <DownloadCvMenuRadix defaultOpen={state.open} focusTrigger={state.focus} />;
  return (
    <PlainTrigger
      onPointerEnter={() => void loadRadix()}
      onPointerDown={(e) => {
        if (e.button === 0) setState({ open: true, focus: false });
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) setState({ open: false, focus: true });
      }}
      onClick={() => setState({ open: true, focus: false })}
    />
  );
}
export default DownloadCvMenu;
