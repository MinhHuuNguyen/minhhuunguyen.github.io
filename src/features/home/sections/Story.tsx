import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;

export function Story() {
  const { locale } = useI18n();
  const s = site.story;
  return (
    <section id="cau-chuyen" data-section="story" className="relative overflow-hidden py-16 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-[radial-gradient(circle,theme(colors.blue.100)_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-60"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading label={pick(s.label, locale)} lead={{ strong: pick(s.strong, locale), muted: pick(s.muted, locale) }} />
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-12 text-sm font-semibold text-ink-500">{pick(s.logosLabel, locale)}</p>
          <ul className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {site.logos.map((l) => (
              <li key={l.name} data-logo="" className="grid h-20 place-items-center rounded-card bg-white p-3 shadow-card">
                <Img base={l.base} alt={l.name} widths={[96, 192]} sizes="96px" fallback="png" width={96} height={39} className="h-auto max-h-10 w-auto object-contain" />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
export default Story;
