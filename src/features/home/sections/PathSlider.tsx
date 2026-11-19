import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PillButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { formatDate } from "@/lib/format.mjs";
import type { PathSummary } from "../types";

export function PathSlider({ paths }: { paths: PathSummary[] }) {
  const { t, locale } = useI18n();
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  if (!paths.length) return null;
  const go = (to: number) => {
    const el = track.current;
    const next = Math.max(0, Math.min(paths.length - 1, to));
    setActive(next);
    el?.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = track.current;
    if (el && el.clientWidth) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const btn = "grid size-11 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10 disabled:opacity-40";
  return (
    <section data-section="paths" className="bg-gradient-to-b from-blue-900 to-black py-16 text-white lg:py-24">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <SectionLabel tone="dark">{t("home.paths.label")}</SectionLabel>
          <div className="flex items-center gap-2">
            <button type="button" aria-label={t("home.paths.prev")} onClick={() => go(active - 1)} disabled={active === 0} className={btn}>
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" aria-label={t("home.paths.next")} onClick={() => go(active + 1)} disabled={active === paths.length - 1} className={btn}>
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div aria-roledescription="carousel" aria-label={t("home.paths.label")}>
          <ul ref={track} onScroll={onScroll} aria-live="polite" className="mt-8 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
            {paths.map((p, i) => (
              <li
                key={p.slug}
                data-slide=""
                aria-roledescription="slide"
                aria-hidden={active === i ? "false" : "true"}
                {...(active === i ? {} : ({ inert: "" } as object))}
                className="grid w-full shrink-0 snap-center gap-8 lg:grid-cols-2 lg:items-center"
              >
                <div>
                  <p className="text-sm text-white/70">
                    {t("home.paths.updated")} {formatDate(p.updated, locale)} · {t("home.paths.lessons").replace("{n}", String(p.stats.total))}
                  </p>
                  <h3 className="mt-3 text-[clamp(28px,3.2vw,44px)] font-bold leading-[1.15] tracking-[-0.015em]">{p.title}</h3>
                  <p className="mt-3 line-clamp-3 text-white/80">{p.description}</p>
                  <div className="mt-6">
                    <PillButton href={`/learn/${p.slug}`} variant="light" track={{ event: "cta_click", params: { cta_id: "start_path", location: "home_paths" } }}>
                      {t("home.paths.start")}
                    </PillButton>
                  </div>
                </div>
                <div className="overflow-hidden rounded-card border border-white/20 bg-white/10">
                  <div aria-hidden="true" className="flex gap-1.5 px-3 py-2">
                    <span className="size-2.5 rounded-full bg-white/40" />
                    <span className="size-2.5 rounded-full bg-white/40" />
                    <span className="size-2.5 rounded-full bg-white/40" />
                  </div>
                  <img src={p.banner} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
export default PathSlider;
