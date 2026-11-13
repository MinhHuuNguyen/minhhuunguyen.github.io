import { Download } from "lucide-react";
import { Menu } from "@/components/ui/Dropdown";
import { useI18n } from "@/libs/i18n/I18nContext";
import { track } from "@/lib/analytics";

import { RESUME_PDFS } from "@/features/resume/pdfs";

export function DownloadCvMenu() {
  const { t } = useI18n();
  return (
    <Menu
      trigger={
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-surface-100"
        >
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
            {t(pdf.label)}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default DownloadCvMenu;
