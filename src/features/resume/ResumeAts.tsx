import { useI18n } from "@/libs/i18n/I18nContext";
import { getDuration } from "@/utils/common";
import data from "@/utils/data/resume.json";

/**
 * Bố cục ATS: một cột, nền trắng, chữ đen, không ảnh, không icon, link in dạng chữ.
 * Phần chi tiết dự án có `data-full-only` để bản gọn (body.ats-short) ẩn đi.
 */
export function ResumeAts() {
  const { t } = useI18n();
  const { personal } = data;
  return (
    <div className="ats-doc mx-auto max-w-[800px] bg-white px-6 py-8 font-sans text-[13px] leading-relaxed text-black">
      <header>
        <h1 className="text-2xl font-bold">{personal.name}</h1>
        <p>{personal.title.join(" | ")}</p>
        <p>
          {personal.social.email} | {personal.social.linkedin} | {personal.social.location}
        </p>
      </header>

      <section className="mt-4">
        <h2 className="ats-h">{t("resume.professionalExperience")}</h2>
        {data.experience.map((job) => (
          <div key={`${job.company}-${job.startDate}`} className="mt-2">
            <h3 className="font-bold">
              {job.title}, {job.company}
            </h3>
            <p>
              {job.startDate} - {job.endDate} ({getDuration(job.startDate, job.endDate)})
            </p>
            <ul className="list-disc pl-5">
              {job.projects.map((p) => (
                <li key={p.projectName}>
                  {p.projectName} ({p.projectYear})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="ats-h">{t("resume.educationCertifications")}</h2>
        {data.education.map((e) => (
          <p key={e.degree + e.duration}>
            <strong>{e.degree}</strong>, {e.school}, {e.duration}
          </p>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="ats-h">{t("resume.language")}</h2>
        <p>{data.language.join(", ")}</p>
      </section>

      <section className="mt-4">
        <h2 className="ats-h">{t("resume.additionalExperience")}</h2>
        {data.other_experience.map((o) => (
          <div key={o.title}>
            <h3 className="font-bold">{o.title}</h3>
            <ul className="list-disc pl-5">
              {o.info_list.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="ats-h">{t("resume.award")}</h2>
        <ul className="list-disc pl-5">
          {data.award.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="ats-h">{t("resume.skills")}</h2>
        <p>{data.skill.join(", ")}</p>
      </section>

      <section className="mt-4" data-full-only>
        <h2 className="ats-h">{t("resume.projectDetail")}</h2>
        {data.experience.map((job, ji) => (
          <div key={`${job.company}-${job.startDate}`} className="mt-2">
            <h3 className="font-bold">
              {ji + 1}. {job.title}: {job.company} ({job.startDate} - {job.endDate})
            </h3>
            {job.projects.map((p, pi) => (
              <div key={p.projectName} className="mt-1" style={{ breakInside: "avoid" }}>
                <h4 className="font-semibold">
                  {ji + 1}.{pi + 1}. {p.projectName} ({p.projectYear})
                </h4>
                <p>
                  <strong>{t("resume.overall")}</strong> {p.overall}
                </p>
                <p>
                  <strong>{t("resume.techstack")}</strong> {p.techStack.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ))}
      </section>

      <style jsx global>{`
        .ats-h {
          margin-bottom: 2px;
          border-bottom: 1px solid #000;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        body.ats-short [data-full-only] {
          display: none;
        }
        #__next > header,
        #__next > footer,
        [data-chat-launcher],
        [data-skip-link] {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ResumeAts;
