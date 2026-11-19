import type { Locale } from "@/libs/i18n/types";
import { pick } from "@/libs/i18n/pick";
import type { SiteConfig } from "@/@types/site";

export type JourneyStep = { range: string; title: string; company: string; desc: string };
type ResumeExp = { title: string; company: string; startDate: string; endDate: string };

const yearOf = (s: string) => /\d{4}/.exec(s)?.[0] ?? "";
const startKey = (s: string) => {
  const d = new Date(`1 ${s} UTC`);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
};

/** 3 chặng nghề nghiệp từ resume.json, sắp theo ngày bắt đầu giảm dần; mô tả lấy từ site.json.journey.steps. */
export function journeySteps(
  resume: { experience: ResumeExp[] },
  journey: SiteConfig["journey"],
  locale: Locale,
  now: string,
): JourneyStep[] {
  return [...resume.experience]
    .sort((a, b) => startKey(b.startDate) - startKey(a.startDate))
    .map((e) => {
      const present = /present/i.test(e.endDate);
      const step = journey.steps.find((s) => e.company.includes(s.match));
      return {
        range: `[${yearOf(e.startDate)} – ${present ? now : yearOf(e.endDate)}]`,
        title: locale === "vi" ? e.title.replace("Lecturer", "Giảng viên") : e.title,
        company: e.company.replace("PIXTA Vietnam Co. Ltd.", locale === "vi" ? "PIXTA Việt Nam" : "PIXTA Vietnam").replace(/ - /g, ", "),
        desc: step ? pick(step.desc, locale) : "",
      };
    });
}
