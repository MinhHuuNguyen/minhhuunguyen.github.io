import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;
const PILL = "grid min-h-[88px] flex-1 place-items-center rounded-pill px-8 text-center text-xl font-bold sm:min-h-[118px] lg:text-3xl";

export function Pills() {
  const { locale } = useI18n();
  const [a, b, c] = site.pills;
  const photo = site.marqueePhotos[0];
  return (
    <section data-section="pills" className="py-8">
      <Container>
        <Reveal>
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <p className={`${PILL} bg-blue-900 text-accent`}>{pick(a, locale)}</p>
            <span aria-hidden="true" className="mx-auto rotate-90 text-3xl font-bold text-ink-500 md:rotate-0">»</span>
            <p className={`${PILL} relative overflow-hidden bg-ink-800 text-white`}>
              <Img base={photo.base} alt="" widths={[800, 1600]} sizes="33vw" fallback="jpg" width={800} height={533} className="absolute inset-0 size-full opacity-40 blur-sm" />
              <span className="relative">{pick(b, locale)}</span>
            </p>
            <span aria-hidden="true" className="mx-auto rotate-90 text-3xl font-bold text-ink-500 md:rotate-0">»</span>
            <p className={`${PILL} bg-pill-navy text-accent`}>{pick(c, locale)}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
export default Pills;
