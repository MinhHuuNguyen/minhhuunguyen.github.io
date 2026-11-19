import { Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;

export function Awards() {
  const { t, locale } = useI18n();
  return (
    <section data-section="awards" className="py-12">
      <Container>
        <h2 className="text-[clamp(26px,3vw,40px)] font-bold leading-tight tracking-[-0.015em]">{t("home.journey.awardsLabel")}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.awards.map((a, i) => (
            <li key={i} data-award="">
              <Reveal delay={i * 80}>
                <div className="flex h-full gap-4 rounded-card bg-white p-5 shadow-card transition hover:-translate-y-1">
                  <Award size={28} aria-hidden="true" className="shrink-0 text-blue-500" />
                  <p className="text-[15px] font-medium">{pick(a, locale)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
export default Awards;
