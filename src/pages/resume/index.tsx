import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { ResumeWeb } from "@/features/resume/ResumeWeb";
import { useI18n } from "@/libs/i18n/I18nContext";
import { withLocale } from "@/lib/with-locale";

const Resume = () => {
  const { t } = useI18n();
  return (
    <>
      <DefaultSeo {...SEO} title={t("resume.seoTitle")} />
      <ResumeWeb />
    </>
  );
};

export default Resume;

export const getStaticProps = withLocale("vi");
