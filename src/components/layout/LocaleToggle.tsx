import { Globe } from "lucide-react";
import { useI18n } from "@/libs/i18n/I18nContext";

/** Đổi ngôn ngữ bằng cách chuyển sang URL tương ứng (không lưu localStorage). */
export function LocaleToggle({ className }: { className?: string }) {
  const { locale, toggleLocale, t } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t("nav.changeLanguage")}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold uppercase text-ink-900 transition hover:bg-surface-100"
      }
    >
      <Globe size={18} aria-hidden="true" />
      <span aria-hidden="true">{locale === "vi" ? "EN" : "VI"}</span>
    </button>
  );
}

export default LocaleToggle;
