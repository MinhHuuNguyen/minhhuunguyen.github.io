import { Img } from "@/components/ui/Img";
import { Marquee } from "@/components/ui/Marquee";
import { AppLink } from "@/components/ui/AppLink";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import type { MarqueeItem } from "../types";

export function HomeMarquee({ items }: { items: MarqueeItem[] }) {
  const { t, locale } = useI18n();
  const isVideo = items[0]?.kind === "video";
  const nodes = items.map((it) =>
    it.kind === "photo" ? (
      <Img key={it.base} base={it.base} alt={pick(it.alt, locale)} widths={[800, 1600]} sizes="320px" fallback="jpg" width={320} height={214} className="h-52 w-80 rounded-card" />
    ) : (
      <AppLink key={it.video.key} href="/videos" className="block w-80">
        {it.video.thumbnail ? <img src={it.video.thumbnail} alt={pick(it.video.title, locale)} loading="lazy" className="h-52 w-80 rounded-card" /> : <span>{pick(it.video.title, locale)}</span>}
      </AppLink>
    ),
  );
  return (
    <section data-section="marquee" className="py-12">
      <Marquee items={nodes} label={t(isVideo ? "home.marquee.videos" : "home.marquee.photos")} />
    </section>
  );
}
export default HomeMarquee;
