import LegalDoc from "@/features/legal/LegalDoc";
import legal from "@/utils/data/legal.en.json";
import { withLocale } from "@/lib/with-locale";

export default function Terms() {
  return <LegalDoc doc={legal.terms} />;
}

export const getStaticProps = withLocale("en");
