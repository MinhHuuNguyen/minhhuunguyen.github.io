import { Download } from "lucide-react";
import { GridFrame } from "@/components/ui/GridFrame";
import { Img } from "@/components/ui/Img";
import { PillButton } from "@/components/ui/Button";
import { BrandIcon, type BrandName } from "@/components/ui/Icons";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import { track } from "@/lib/analytics";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;
const BRANDS: { name: BrandName; label: string }[] = [
  { name: "linkedin", label: "LinkedIn" },
  { name: "github", label: "GitHub" },
  { name: "facebook", label: "Facebook" },
  { name: "youtube", label: "YouTube" },
  { name: "tiktok", label: "TikTok" },
];

export function Hero({ careerYears }: { careerYears: number }) {
  const { t, locale } = useI18n();
  const name = pick(site.person.name, locale);
  const [line1, line2] = pick(site.hero.headline, locale);
  const socials = BRANDS.filter((b) => site.socials[b.name]);
  return (
    <section id="hero" data-section="hero" className="px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-hero bg-hero text-white">
        <GridFrame cols={3} rows={3} crosshair="accent" tone="onBlue" className="px-5 py-6 sm:px-10 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[15px] font-semibold">{pick(site.hero.topLine, locale).replace("{years}", String(careerYears))}</p>
            <a
              href="/resume.pdf"
              download
              onClick={() => track("resume_download", { variant: "ats" })}
              className="inline-flex items-center gap-2 rounded-pill border border-white/30 bg-white/10 py-1.5 pl-5 pr-1.5 text-[15px] font-semibold text-white backdrop-blur transition hover:-translate-y-0.5"
            >
              {t("resume.download")}
              <span className="grid size-9 place-items-center rounded-full bg-white text-blue-700">
                <Download size={18} aria-hidden="true" />
              </span>
            </a>
          </div>
          <div className="relative mt-6 grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,480px)_1fr]">
            <h1 className="text-display text-gradient-hero pointer-events-none relative z-10 text-center lg:absolute lg:inset-x-0 lg:bottom-[12%] lg:z-20 lg:text-[clamp(44px,7.5vw,112px)]">
              <span className="block">{line1}</span> <span className="block">{line2}</span>
            </h1>
            <div className="glass-hero relative z-30 order-2 rounded-card p-5 lg:order-none lg:self-end">
              <p className="text-[15px] leading-relaxed">{pick(site.hero.intro, locale)}</p>
              <div className="mt-4">
                <PillButton href="/learn" variant="light" track={{ event: "cta_click", params: { cta_id: "learn_start", location: "hero" } }}>
                  {t("home.hero.ctaLearn")}
                </PillButton>
              </div>
            </div>
            <div className="order-1 mx-auto w-4/5 max-w-[480px] lg:order-none lg:w-full">
              <Img
                base={site.person.portrait + "/minh-cutout"}
                alt={name}
                widths={[400, 800, 1600]}
                sizes="(min-width:1280px) 480px, 80vw"
                fallback="png"
                width={1600}
                height={1701}
                priority
                className="h-auto w-full"
              />
            </div>
            <div className="glass-hero relative z-30 order-3 rounded-card p-5 lg:order-none lg:self-end">
              <p className="text-[15px] leading-relaxed">{pick(site.hero.credentials, locale)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <PillButton href="#lien-he" variant="light" track={{ event: "cta_click", params: { cta_id: "collab", location: "hero" } }}>
                  {t("home.hero.ctaCollab")}
                </PillButton>
                <ul className="flex items-center gap-2">
                  {socials.map((b) => (
                    <li key={b.name}>
                      <a
                        href={site.socials[b.name] as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={b.label}
                        className="grid size-9 place-items-center rounded-full border border-white/30 text-white transition hover:-translate-y-0.5"
                        onClick={() => track("contact_click", { channel: b.name, location: "hero" })}
                      >
                        <BrandIcon name={b.name} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </GridFrame>
      </div>
    </section>
  );
}
export default Hero;
