import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { AppLink } from "@/components/ui/AppLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;

export function Services() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="dich-vu" data-section="services" className="py-16 lg:py-24">
      <Container>
        <Reveal>
          <SectionLabel>{t("home.services.label")}</SectionLabel>
        </Reveal>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {site.services.map((s, i) => {
            const isOpen = open === i;
            return (
              <li key={i} data-service="" className="py-5 lg:text-right" onMouseEnter={() => setOpen(i)}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`service-desc-${i}`}
                  onClick={() => setOpen(i)}
                  className="w-full text-left text-service lg:text-right"
                >
                  <span className="mr-3 text-blue-500">[{i + 1}]</span>
                  {pick(s.title, locale)}
                </button>
                <div id={`service-desc-${i}`} data-service-desc="" hidden={!isOpen} className="mt-3 lg:ml-auto lg:max-w-xl">
                  <p className="text-ink-500">{pick(s.desc, locale)}</p>
                  <a href="#lien-he" className="mt-2 inline-flex font-semibold text-blue-700 underline-offset-4 hover:underline">
                    {t("nav.collab")} ↗
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
export default Services;
