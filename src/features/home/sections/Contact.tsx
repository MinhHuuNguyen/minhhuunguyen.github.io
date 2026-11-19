import { Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { BrandIcon, type BrandName } from "@/components/ui/Icons";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
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

export function Contact() {
  const { t, locale } = useI18n();
  const c = site.contact;
  const name = pick(site.person.name, locale);
  const mail = `mailto:${site.person.email}`;
  const socials = BRANDS.filter((b) => site.socials[b.name]);
  return (
    <section id="lien-he" data-section="contact" className="py-16 lg:py-24">
      <Container className="grid gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-hero bg-ink-800 p-8 text-white lg:col-span-2">
          <h2 className="text-[clamp(26px,3vw,40px)] font-bold leading-tight tracking-[-0.015em]">{name}</h2>
          <p className="mt-2 text-lead text-ink-300">{pick(c.tagline, locale)}</p>
          <p className="mt-6 text-sm font-semibold text-ink-300">{pick(c.availableLabel, locale)}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {pick(c.available, locale).map((x) => (
              <li key={x} className="rounded-pill border border-white/20 px-4 py-1.5 text-sm font-semibold">{x}</li>
            ))}
          </ul>
          <p className="mt-6 text-ink-300">{pick(c.prompt, locale)}</p>
          <a
            href={mail}
            onClick={() => track("contact_click", { channel: "email", location: "contact" })}
            className="mt-1 inline-block text-lg font-semibold text-accent underline-offset-4 hover:underline"
          >
            {site.person.email}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <a
              href="/resume.pdf"
              download
              onClick={() => track("resume_download", { variant: "ats" })}
              className="inline-flex items-center gap-2 rounded-pill border border-white/30 bg-white/10 py-1.5 pl-5 pr-1.5 font-semibold backdrop-blur transition hover:-translate-y-0.5"
            >
              {t("resume.download")}
              <span className="grid size-9 place-items-center rounded-full bg-white text-blue-700"><Download size={18} aria-hidden="true" /></span>
            </a>
            <div className="text-white">
              <RotatingBadge text={pick(c.badge, locale)} href={mail} label={`${pick(c.badge, locale).split("•")[0].trim()}: ${site.person.email}`} onClick={() => track("contact_click", { channel: "email", location: "contact" })} />
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-4 right-4 hidden w-56 sm:block">
            <Img base={site.person.portrait + "/minh-cutout"} alt="" widths={[400, 800]} sizes="224px" fallback="png" width={400} height={425} className="h-auto w-full" />
          </div>
        </div>
        <div className="rounded-hero bg-white p-8 shadow-card">
          <h3 className="text-xl font-bold">{pick(c.socialTitle, locale)}</h3>
          <p className="mt-2 text-ink-500">{pick(c.socialDesc, locale)}</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {socials.map((b) => (
              <li key={b.name}>
                <a
                  href={site.socials[b.name] as string}
                  data-social=""
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={b.label}
                  onClick={() => track("contact_click", { channel: b.name, location: "contact" })}
                  className="grid size-12 place-items-center rounded-full bg-surface-100 text-ink-900 transition hover:-translate-y-0.5"
                >
                  <BrandIcon name={b.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
export default Contact;
