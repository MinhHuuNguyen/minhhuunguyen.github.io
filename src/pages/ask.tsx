import { useEffect } from "react";
import { NextSeo } from "next-seo";
import { Container } from "@/components/ui/Container";
import { ChatSurface } from "@/features/chat/ChatPanel";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/seo.mjs";
import { localizePath } from "@/lib/locale-routes.mjs";
import { withLocale } from "@/lib/with-locale";
import { useI18n } from "@/libs/i18n/I18nContext";

export default function AskPage() {
  const { t, locale } = useI18n();
  useEffect(() => {
    track("chat_open", { location: "ask_page" });
  }, []);
  const canonical = `${SITE}${localizePath("/ask", locale)}`;
  return (
    <Container size="prose" className="py-8 sm:py-12">
      <NextSeo title={t("chat.title")} canonical={canonical} openGraph={{ url: canonical, title: t("chat.title") }} />
      <div className="h-[calc(100dvh-14rem)] min-h-[480px] overflow-hidden rounded-card border border-line-light shadow-card">
        <ChatSurface variant="page" />
      </div>
    </Container>
  );
}

export const getStaticProps = withLocale("vi");
