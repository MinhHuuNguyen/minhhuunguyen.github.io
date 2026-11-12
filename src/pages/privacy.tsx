import LegalDoc from "@/components/features/legal/LegalDoc";
import legal from "@/utils/data/legal.json";

export default function Privacy() {
  return <LegalDoc doc={legal.privacy} />;
}
