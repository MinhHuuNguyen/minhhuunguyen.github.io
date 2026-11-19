import "@/styles/globals.css";
import { sans } from "@/styles/fonts";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SearchProvider } from "@/features/search/SearchProvider";
import { ChatProvider } from "@/features/chat/ChatProvider";

import type { AppProps } from "next/app";

import { I18nProvider } from "@/libs/i18n/I18nContext";

import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url: string) => {
      window.gtag?.("config", GA_ID, { page_path: url });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* Biến font ở :root để cả portal của Radix cũng nhận font */}
      <style jsx global>{`:root{--font-sans:${sans.style.fontFamily};}`}</style>
      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      <I18nProvider locale={pageProps.locale} alternates={pageProps.alternates}>
        {/* ChatProvider bọc ngoài: bảng ⌘K (trong SearchProvider) cần mở chat */}
        <ChatProvider>
          <SearchProvider>
            <SiteLayout navCounts={pageProps.navCounts}>
              <Component {...pageProps} />
            </SiteLayout>
          </SearchProvider>
        </ChatProvider>
      </I18nProvider>
    </>
  );
}
