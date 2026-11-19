import { Container } from "@/components/ui/Container";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;

export function AnchorNav() {
  const { t, locale } = useI18n();
  return (
    <nav aria-label={t("home.anchorsLabel")} className="mt-8">
      <Container>
      <ul className="flex gap-2 overflow-x-auto border-b border-line pb-3 md:grid md:grid-cols-3 md:gap-0 md:overflow-visible">
        {site.anchors.map((a) => (
          <li key={a.id} className="shrink-0">
            <a
              href={`#${a.id}`}
              className="inline-flex rounded-pill bg-white px-4 py-2 text-[15px] font-bold text-ink-900 shadow-card transition hover:-translate-y-0.5 md:bg-transparent md:px-0 md:shadow-none"
            >
              {pick(a.label, locale)}
            </a>
          </li>
        ))}
      </ul>
      </Container>
    </nav>
  );
}
export default AnchorNav;
