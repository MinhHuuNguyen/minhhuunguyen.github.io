import Image from "next/image";
import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { Container } from "@/components/ui/Container";
import { PillButton } from "@/components/ui/Button";
import { useI18n } from "@/libs/i18n/I18nContext";
import { useSearch } from "@/features/search/SearchProvider";

/** Trang 404 tĩnh: ngôn ngữ lấy từ tiền tố /en/ của URL phía client (I18nProvider suy ra từ asPath). */
function Error404() {
  const { t } = useI18n();
  const { open } = useSearch();
  return (
    <Container className="grid items-center gap-10 py-16 font-sans text-ink-900 lg:grid-cols-2 lg:py-24">
      <DefaultSeo {...SEO} title="404" />
      <div>
        <p className="text-display text-gradient-hero">404</p>
        <h1 className="mt-4 text-3xl font-bold">{t("notFound.title")}</h1>
        <p className="mt-3 max-w-prose text-ink-700">{t("notFound.hint")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <PillButton href="/" variant="dark">
            {t("notFound.backHome")}
          </PillButton>
          <button
            type="button"
            onClick={() => open("button")}
            className="inline-flex rounded-pill bg-white px-6 py-3 text-[15px] font-semibold text-ink-900 shadow-card transition hover:-translate-y-0.5"
          >
            {t("notFound.search")}
          </button>
        </div>
      </div>
      <Image src="/404-illustration.svg" alt="" width={500} height={250} className="h-auto w-full max-w-md justify-self-center" />
    </Container>
  );
}

export default Error404;
