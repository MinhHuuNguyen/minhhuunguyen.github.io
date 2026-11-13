import { PillButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/libs/i18n/I18nContext";

export function CtaBand() {
  const { t } = useI18n();
  return (
    <section data-section="cta" className="py-8">
      <Container className="flex justify-center">
        <PillButton href="#lien-he" variant="dark" size="lg" track={{ event: "cta_click", params: { cta_id: "collab", location: "cta_band" } }}>
          {t("home.projects.cta")}
        </PillButton>
      </Container>
    </section>
  );
}
export default CtaBand;
