import { useRouter } from "next/router";
import { Search } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import { Img } from "@/components/ui/Img";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { Locale } from "@/libs/i18n/types";
import { useSearch } from "@/features/search/SearchProvider";
import { track } from "@/lib/analytics";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";
import { DownloadCvMenu } from "./DownloadCvMenu";
import { LocaleToggle } from "./LocaleToggle";
import { MobileNav, type NavItem } from "./MobileNav";

const site = siteData as SiteConfig;

/** Link tới khối liên hệ ở trang chủ: cùng trang thì chỉ cần hash. */
export function CONTACT_HREF(isHome: boolean, locale: Locale): "#lien-he" | "/#lien-he" | "/en#lien-he" {
  if (isHome) return "#lien-he";
  return locale === "en" ? "/en#lien-he" : "/#lien-he";
}

export function Header() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { open } = useSearch();
  const isHome = router.pathname === "/" || router.pathname === "/en";
  const contactHref = CONTACT_HREF(isHome, locale);

  const items: NavItem[] = [
    { key: "blog", href: "/blog", label: t("nav.blog") },
    { key: "learn", href: "/learn", label: t("nav.learn") },
    ...(site.nav.showVideosWhenEmpty ? [{ key: "videos", href: "/videos", label: t("nav.videos") }] : []),
    { key: "projects", href: "/projects", label: t("nav.projects") },
    { key: "resume", href: "/resume", label: t("nav.resume") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 font-sans backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8">
        <AppLink href="/" aria-label={pick(site.person.name, locale)} className="flex shrink-0 items-center">
          <Img base="/img/logo/logo-square" alt="" widths={[64, 128]} sizes="40px" fallback="png" width={40} height={40} className="size-10 rounded-full" />
        </AppLink>
        <nav aria-label={t("nav.mainLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <AppLink
                  href={item.href}
                  className="rounded-pill px-4 py-2 text-[15px] font-semibold text-ink-900 transition hover:bg-surface-100"
                >
                  {item.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={t("nav.search")}
            onClick={() => open("button")}
            className="grid size-10 place-items-center rounded-full text-ink-900 hover:bg-surface-100"
          >
            <Search size={20} aria-hidden="true" />
          </button>
          <div className="hidden items-center gap-1 lg:flex">
            <DownloadCvMenu />
            <LocaleToggle />
            <AppLink
              href={contactHref}
              localize={false}
              onClick={() => track("cta_click", { cta_id: "collab", location: "header" })}
              className="ml-2 inline-flex rounded-pill bg-pill-dark px-6 py-2.5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5"
            >
              {t("nav.collab")}
            </AppLink>
          </div>
          <MobileNav items={items} contactHref={contactHref} />
        </div>
      </div>
    </header>
  );
}

export default Header;
