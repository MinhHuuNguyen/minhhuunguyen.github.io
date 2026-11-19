import { Container } from "@/components/ui/Container";
import { PillButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import resume from "@/utils/data/resume.json";
import siteData from "@/utils/data/site.json";
import { journeySteps } from "../journey";

const site = siteData as SiteConfig;

export function Journey() {
  const { t, locale } = useI18n();
  const j = site.journey;
  const steps = journeySteps(resume as never, j, locale, t("home.journey.now"));
  return (
    <section id="hanh-trinh" data-section="journey" className="bg-hero-soft py-16 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading label={pick(j.label, locale)} lead={{ strong: pick(j.strong, locale), muted: pick(j.muted, locale) }} />
          <div className="mt-6 lg:ml-[33.3%]">
            <PillButton href="/resume" variant="dark">{t("home.journey.cta")}</PillButton>
          </div>
        </Reveal>
        <ol className="mt-12 grid gap-6 rounded-card bg-white p-6 shadow-card lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.range + s.company} data-step="" className="relative border-t-2 border-dotted border-blue-500 pt-6">
              <span aria-hidden="true" className="absolute -top-[7px] left-0 size-3 rounded-full bg-blue-500" />
              <p className="text-sm font-semibold text-blue-700">{s.range}</p>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="text-[15px] font-medium text-ink-500">{s.company}</p>
              <p className="mt-3 text-[15px]">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
export default Journey;
