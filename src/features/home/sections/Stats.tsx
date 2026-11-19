import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";
import type { SiteCounts } from "../types";

const site = siteData as SiteConfig;

export function Stats({ counts }: { counts: SiteCounts }) {
  const { t, locale } = useI18n();
  const photo = site.marqueePhotos[1];
  return (
    <section data-section="stats" aria-label={t("home.stats.title")} className="py-12 lg:py-16">
      <Container>
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <Reveal>
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-card">
              <Img base={photo.base} alt={pick(photo.alt, locale)} widths={[800, 1600]} sizes="(min-width:768px) 50vw, 100vw" fallback="jpg" width={1600} height={1066} className="absolute inset-0 size-full" />
              {["left-3 top-3", "right-3 top-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
                <span key={pos} aria-hidden="true" className={`absolute ${pos} hidden text-lg font-bold leading-none text-accent sm:block`}>+</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="divide-y divide-line rounded-card bg-white shadow-card">
              {site.stats.map((s) => (
                <li key={s.source} className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-1 p-5 sm:p-6">
                  <CountUp value={`${counts[s.source]}${s.suffix ?? ""}`} className="text-stat min-w-[2.2em] text-blue-500" />
                  <div>
                    <p className="text-[15px] font-semibold">[{pick(s.label, locale)}]</p>
                    <p className="text-sm text-ink-500">{pick(s.desc, locale)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
export default Stats;
