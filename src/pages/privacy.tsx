import LegalDoc from "@/features/legal/LegalDoc";
import legal from "@/utils/data/legal.json";
import { withLocale } from "@/lib/with-locale";

export default function Privacy() {
  return <LegalDoc doc={legal.privacy} />;
}

export const getStaticProps = withLocale("vi");
