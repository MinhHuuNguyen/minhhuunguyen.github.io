import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/libs/i18n/I18nContext";

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalContent = {
  draft?: boolean; // true until the owner has read every word; the page says so while it is true
  title: string;
  updated: string;
  sections: LegalSection[];
};

export default function LegalDoc({ doc }: { doc: LegalContent }) {
  const { t } = useI18n();
  return (
    <Container size="prose" className="py-12 font-sans text-ink-900">
      <DefaultSeo {...SEO} title={doc.title} />
      <h1 className="text-4xl font-extrabold tracking-tight">{doc.title}</h1>
      <p className="mt-2 text-sm text-ink-500">
        {t("legal.updated")}: {doc.updated}
      </p>
      {doc.draft ? (
        <p data-draft-banner role="note" className="mt-4 rounded-card bg-surface-100 px-4 py-3 text-[15px] font-semibold text-ink-900">
          {t("legal.draftBanner")}
        </p>
      ) : null}
      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-bold">{section.heading}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-3 leading-relaxed text-ink-700">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </Container>
  );
}
