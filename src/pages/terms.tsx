import LegalDoc from "@/components/features/legal/LegalDoc";
import legal from "@/utils/data/legal.json";

export default function Terms() {
  return <LegalDoc doc={legal.terms} />;
}
