import { useI18n } from "@/libs/i18n/I18nContext";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900 focus:shadow-card"
    >
      {t("nav.skip")}
    </a>
  );
}

export default SkipLink;
