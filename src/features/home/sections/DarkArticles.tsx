import { Container } from "@/components/ui/Container";
import { AppLink } from "@/components/ui/AppLink";
import { SectionLabel } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/libs/i18n/I18nContext";
import { track } from "@/lib/analytics";
import type { PostSummary } from "@/lib/site-data.mjs";

export function DarkArticles({ posts }: { posts: PostSummary[] }) {
  const { t } = useI18n();
  return (
    <section data-section="articles" className="bg-ink-800 py-16 text-white lg:py-24">
      <Container>
        <SectionLabel tone="dark">{t("home.articles.label")}</SectionLabel>
        <p className="mt-6 max-w-2xl text-lead text-ink-300">{t("home.articles.intro")}</p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug} data-article-card="">
              <Reveal delay={i * 80}>
                <AppLink href={`/blog/${p.slug}`} className="block h-full rounded-card bg-white p-4 text-ink-900 shadow-card transition hover:-translate-y-1">
                  {p.banner_url ? <img src={p.banner_url} alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full rounded-xl" /> : null}
                  <h3 className="mt-4 text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-500">{p.description}</p>
                  <span className="mt-4 inline-flex font-semibold text-blue-700">{t("home.articles.read")} ↗</span>
                </AppLink>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <AppLink
            href="/blog"
            onClick={() => track("cta_click", { cta_id: "view_all_posts", location: "home_articles" })}
            className="inline-flex font-semibold text-white underline underline-offset-4"
          >
            {t("home.articles.viewAll")} ↗
          </AppLink>
        </div>
        <ol aria-hidden="true" className="mt-12 flex justify-around">
          {posts.map((_, i) => (
            <li
              key={i}
              data-outline-number=""
              className="select-none text-[clamp(64px,14vw,200px)] font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,.35)]"
            >
              {String(i + 1).padStart(2, "0")}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
export default DarkArticles;
