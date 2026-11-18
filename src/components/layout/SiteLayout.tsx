import type { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useI18n } from "@/libs/i18n/I18nContext";
import { counterpartUrl, hreflangLinks, localizePath } from "@/lib/locale-routes.mjs";
import { ChatLauncher } from "@/features/chat/ChatLauncher";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

/** Các cặp hreflang của trang; trang bài không có `alternates` thì không đoán (tránh trỏ nhầm). */
function useHreflang() {
  const { alternates } = useI18n();
  const router = useRouter();
  if (router.pathname === "/404") return [];
  if (alternates?.vi || alternates?.en) {
    const vi = alternates.vi ?? alternates.en;
    return vi ? hreflangLinks(vi, { enPath: alternates.en ?? null }) : [];
  }
  const path = router.asPath.split(/[?#]/)[0];
  if (/^(\/en)?\/blog\/[^/]+$/.test(path)) return [];
  const vi = counterpartUrl(path, "vi");
  const en = counterpartUrl(path, "en");
  // Trang không có bản EN (styleguide) được counterpartUrl đưa về /en: không phải bản tương ứng.
  return hreflangLinks(vi, { enPath: en === localizePath(vi, "en") ? en : null });
}

export function SiteLayout({ children, navCounts }: { children: ReactNode; navCounts?: { videos: number } }) {
  const links = useHreflang();
  return (
    <>
      <Head>
        {links.map((l) => (
          <link key={l.hrefLang} rel="alternate" hrefLang={l.hrefLang} href={l.href} />
        ))}
      </Head>
      <SkipLink />
      <Header navCounts={navCounts} />
      <main id="main">{children}</main>
      <Footer />
      <ChatLauncher />
    </>
  );
}

export default SiteLayout;
