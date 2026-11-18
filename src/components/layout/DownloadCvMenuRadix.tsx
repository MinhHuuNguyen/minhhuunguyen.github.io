import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Menu } from "@/components/ui/Dropdown";
import { useI18n } from "@/libs/i18n/I18nContext";
import { track } from "@/lib/analytics";
/** Hai bản PDF cũ của CV (sinh từ trang /resume bằng scripts/generate-pdf.mjs). */
const RESUME_PDFS = [
  { variant: "resume", file: "/resume.pdf", label: "CV (PDF)" },
  { variant: "resume_full", file: "/resume-full.pdf", label: "CV + Project Detail (PDF)" },
] as const;

const CV_TRIGGER_CLASS =
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-surface-100";
/** Menu Tải CV đầy đủ (Radix). Chỉ được tải lười từ DownloadCvMenu. */
export function DownloadCvMenuRadix({ defaultOpen, focusTrigger }: { defaultOpen?: boolean; focusTrigger?: boolean }) {
  const { t } = useI18n();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (focusTrigger && !defaultOpen) ref.current?.focus();
  }, [focusTrigger, defaultOpen]);
  return (
    <Menu
      defaultOpen={defaultOpen}
      trigger={
        <button ref={ref} type="button" className={CV_TRIGGER_CLASS}>
          <Download size={18} aria-hidden="true" />
          {t("resume.download")}
        </button>
      }
    >
      {RESUME_PDFS.map((pdf) => (
        <Menu.Item key={pdf.variant} asChild>
          <a
            href={pdf.file}
            download
            className="block"
            onClick={() => track("resume_download", { variant: pdf.variant })}
          >
            {pdf.label}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
}
export default DownloadCvMenuRadix;
