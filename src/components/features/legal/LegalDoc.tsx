import { Container } from "@mui/material";
import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalContent = {
  draft?: boolean; // true until the owner has read every word; the page says so while it is true
  title: string;
  updated: string;
  sections: LegalSection[];
};

export default function LegalDoc({ doc }: { doc: LegalContent }) {
  return (
    <Container maxWidth="md" className="py-8">
      <DefaultSeo {...SEO} title={doc.title} />
      <h1 className="text-3xl mb-2">{doc.title}</h1>
      <p>
        <em>Cập nhật: {doc.updated}</em>
      </p>
      {doc.draft ? (
        <p>
          <strong>Bản nháp: nội dung này đang chờ chủ website duyệt.</strong>
        </p>
      ) : null}
      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-6">
          <h2 className="text-xl mb-2">{section.heading}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-2">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </Container>
  );
}
