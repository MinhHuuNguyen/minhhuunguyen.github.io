import { Container } from "@/components/ui/Container";
import { TagChip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AppLink } from "@/components/ui/AppLink";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectMockup } from "@/features/projects/ProjectMockup";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import { track } from "@/lib/analytics";
import type { FeaturedProject } from "@/lib/projects.mjs";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";

const site = siteData as SiteConfig;

export function FeaturedProjects({ projects }: { projects: FeaturedProject[] }) {
  const { t, locale } = useI18n();
  return (
    <section id="du-an" data-section="projects" className="py-16 lg:py-24">
      <Container>
        <SectionHeading
          label={pick(site.anchors[2].label, locale)}
          lead={{ strong: t("home.projects.strong"), muted: t("home.projects.muted") }}
        />
        <ol className="mt-12">
          {projects.map((p, i) => (
            <li key={p.slug ?? i} data-project="" className="grid items-center gap-8 border-t border-line py-10 lg:grid-cols-2">
              <Reveal>
                <div className="lg:order-2"><ProjectMockup project={p} /></div>
              </Reveal>
              <div className="lg:order-1">
                <p className="font-mono text-sm font-semibold text-blue-700">{`//${i + 1}`}</p>
                <h3 className="mt-3 text-[clamp(28px,3.2vw,44px)] font-bold leading-[1.15] tracking-[-0.015em]">{pick(p.title, locale)}</h3>
                <p className="mt-3 text-ink-500">{pick(p.summary, locale)}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.stack.slice(0, 6).map((s) => (
                    <li key={s}><TagChip>{s}</TagChip></li>
                  ))}
                </ul>
                {p.href ? (
                  <AppLink href={p.href} className="mt-6 inline-flex font-semibold text-blue-700 underline-offset-4 hover:underline">
                    {t("home.projects.viewDetails")} ↗
                  </AppLink>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
export default FeaturedProjects;
