import { AppLink } from "@/components/ui/AppLink";
import { Container } from "@/components/ui/Container";
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

export function Footer() {
  const { t, locale } = useI18n();
  const name = pick(site.person.name, locale);
  const linkCls = "text-[15px] text-ink-900/70 transition hover:text-ink-900";
  const socials = BRANDS.filter((b) => site.socials[b.name]);

  return (
    <footer className="mt-20 border-t border-line bg-surface-100 font-sans text-ink-900">
      <Container className="py-12">
        <p data-wordmark className="text-display-footer text-ink-900">
          {name}
        </p>
        <p className="mt-6 max-w-prose text-lead text-ink-900/70">{t("footer.tagline")}</p>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <nav aria-label={t("footer.contact")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><AppLink href="/blog" className={linkCls}>{t("nav.blog")}</AppLink></li>
              <li><AppLink href="/learn" className={linkCls}>{t("nav.learn")}</AppLink></li>
              <li><AppLink href="/projects" className={linkCls}>{t("nav.projects")}</AppLink></li>
              <li><AppLink href="/resume" className={linkCls}>{t("nav.resume")}</AppLink></li>
              <li><AppLink href={site.nav.githubStats} localize={false} className={linkCls}>{t("footer.githubStats")}</AppLink></li>
              <li><AppLink href="/privacy" localize={false} className={linkCls}>{t("footer.privacy")}</AppLink></li>
              <li><AppLink href="/terms" localize={false} className={linkCls}>{t("footer.terms")}</AppLink></li>
            </ul>
          </nav>
          <ul className="flex flex-wrap items-center gap-3">
            <li>
              <a
                href={`mailto:${site.person.email}`}
                className={linkCls}
                onClick={() => track("contact_click", { channel: "email", location: "footer" })}
              >
                {site.person.email}
              </a>
            </li>
            {socials.map((b) => (
              <li key={b.name}>
                <a
                  href={site.socials[b.name] as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={b.label}
                  className="grid size-10 place-items-center rounded-full bg-white text-ink-900 shadow-card transition hover:-translate-y-0.5"
                  onClick={() => track("contact_click", { channel: b.name, location: "footer" })}
                >
                  <BrandIcon name={b.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-sm text-ink-900/60">
          {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
