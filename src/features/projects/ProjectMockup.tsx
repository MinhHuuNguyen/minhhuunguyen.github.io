import { Layers } from "lucide-react";
import type { FeaturedProject } from "@/lib/projects.mjs";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";

/** Khung mockup dự án: có ảnh bìa thì hiện ảnh, không thì panel gradient + icon stack + năm. */
export function ProjectMockup({ project }: { project: FeaturedProject }) {
  const { locale } = useI18n();
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-hero shadow-card">
      {project.cover ? (
        <img src={project.cover} alt={pick(project.title, locale)} loading="lazy" decoding="async" className="size-full" />
      ) : (
        <div className="grid size-full place-items-center text-white">
          <div className="flex flex-col items-center gap-3">
            <Layers size={48} aria-hidden="true" />
            <span className="text-stat">{project.year}</span>
          </div>
        </div>
      )}
      {["left-3 top-3", "right-3 top-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
        <span key={pos} aria-hidden="true" className={`absolute ${pos} hidden text-lg font-bold leading-none text-accent sm:block`}>+</span>
      ))}
    </div>
  );
}
export default ProjectMockup;
