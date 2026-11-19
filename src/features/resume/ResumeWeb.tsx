import { Mail, MapPin, Link2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { SectionLabel, TagChip } from "@/components/ui/Chip";
import { DownloadCvMenu } from "@/components/layout/DownloadCvMenu";
import { useI18n } from "@/libs/i18n/I18nContext";
import { getDuration } from "@/utils/common";
import data from "@/utils/data/resume.json";

/** CV bản web: nội dung lấy từ resume.json (tiếng Anh), nhãn theo ngôn ngữ trang. */
export function ResumeWeb() {
  const { t } = useI18n();
  const { personal } = data;
  return (
    <div className="font-sans text-ink-900">
      <section className="bg-hero-soft">
        <Container className="grid items-center gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <div>
            <SectionLabel>{t("nav.resume")}</SectionLabel>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">{personal.name}</h1>
            <p className="mt-3 text-lead text-ink-700">{personal.title.join(" · ")}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-700">
              <li className="inline-flex items-center gap-2">
                <Link2 size={16} aria-hidden="true" />
                <a href={`https://${personal.social.linkedin}`} className="underline-offset-2 hover:underline">
                  {personal.social.linkedin}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${personal.social.email}`} className="underline-offset-2 hover:underline">
                  {personal.social.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin size={16} aria-hidden="true" />
                {personal.social.location}
              </li>
            </ul>
            <div className="mt-6 lg:hidden">
              <DownloadCvMenu />
            </div>
          </div>
          <div className="mx-auto w-48 sm:w-64 lg:w-full lg:max-w-xs">
            <Img
              base="/img/portrait/minh-cutout"
              alt=""
              widths={[1600]}
              sizes="(min-width:1024px) 320px, 256px"
              fallback="png"
              width={1600}
              height={1600}
              priority
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-12 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="resume-exp">
          <h2 id="resume-exp" className="text-2xl font-bold">
            {t("resume.professionalExperience")}
          </h2>
          <ol className="mt-6 space-y-8 border-l-2 border-line pl-6">
            {data.experience.map((job) => (
              <li key={`${job.company}-${job.startDate}`} className="relative">
                <span className="absolute -left-[31px] top-2 size-3 rounded-full bg-blue-700" aria-hidden="true" />
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-ink-700">{job.company}</p>
                <p className="mt-1 text-sm font-semibold text-ink-500">
                  {job.startDate} - {job.endDate === "Present" ? t("resume.present") : job.endDate} ({getDuration(job.startDate, job.endDate)})
                </p>
                <details className="mt-3 rounded-card bg-surface-100 p-4">
                  <summary className="cursor-pointer text-[15px] font-semibold">
                    {t("resume.projects")} ({job.projects.length})
                  </summary>
                  <ul className="mt-4 space-y-5">
                    {job.projects.map((p) => (
                      <li key={p.projectName}>
                        <h4 className="font-semibold">
                          {p.projectName} <span className="font-normal text-ink-500">({p.projectYear})</span>
                        </h4>
                        <p className="mt-1 text-[15px] text-ink-700">{p.overall}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.techStack.map((s, i) => (
                            <TagChip key={`${s}-${i}`}>{s}</TagChip>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-10">
          <section aria-labelledby="resume-edu">
            <h2 id="resume-edu" className="text-2xl font-bold">
              {t("resume.educationCertifications")}
            </h2>
            <ul className="mt-4 space-y-4">
              {data.education.map((e) => (
                <li key={e.degree + e.duration}>
                  <h3 className="font-semibold">{e.degree}</h3>
                  <p className="text-ink-700">{e.school}</p>
                  <p className="text-sm text-ink-500">{e.duration}</p>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="resume-award">
            <h2 id="resume-award" className="text-2xl font-bold">
              {t("resume.award")}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-ink-700">
              {data.award.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="resume-lang">
            <h2 id="resume-lang" className="text-2xl font-bold">
              {t("resume.language")}
            </h2>
            <p className="mt-4 text-ink-700">{data.language.join(", ")}</p>
          </section>
          <section aria-labelledby="resume-other">
            <h2 id="resume-other" className="text-2xl font-bold">
              {t("resume.additionalExperience")}
            </h2>
            <ul className="mt-4 space-y-4">
              {data.other_experience.map((o) => (
                <li key={o.title}>
                  <h3 className="font-semibold">{o.title}</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] text-ink-700">
                    {o.info_list.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="resume-skill">
            <h2 id="resume-skill" className="text-2xl font-bold">
              {t("resume.skills")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.skill.map((s) => (
                <TagChip key={s}>{s}</TagChip>
              ))}
            </div>
          </section>
        </aside>
      </Container>
      <style jsx global>{`
        body.pdf-designed :is(header, footer, [data-chat-launcher], [data-skip-link]) {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ResumeWeb;
