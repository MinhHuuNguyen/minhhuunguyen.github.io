import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TagChip } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;
const TOPICS = ["LLM", "RAG", "MLOps", "Computer Vision"];

export function Stack() {
  const { t } = useI18n();
  return (
    <section data-section="stack" className="py-12">
      <Container>
        <Reveal>
          <h2 className="text-center text-[clamp(26px,3vw,40px)] font-bold leading-tight tracking-[-0.015em]">{t("home.journey.stackLabel")}</h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-4">
            {site.stack.map((s) => (
              <li key={s.name} data-tech="" className="flex flex-col items-center gap-2">
                <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-white text-lg font-bold text-blue-700 shadow-card">
                  {s.name.slice(0, 2)}
                </span>
                <span className="text-[13px] font-medium text-ink-500">{s.name}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {TOPICS.map((x) => (
              <li key={x}><TagChip>{x}</TagChip></li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
export default Stack;
