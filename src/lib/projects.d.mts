export type ProjectMetric = { value: string; label: string };
export type ProjectLink = { label: string; url: string };

export type ProjectLocale = {
  title: string;
  summary: string;
  company?: string;
  period?: string;
  role?: string;
  stack?: string[];
  cover?: string;
  metrics?: ProjectMetric[];
  links?: ProjectLink[];
  featured?: boolean;
  order?: number;
  is_published?: boolean;
  resume_project?: string;
  html: string;
};

export type Project = {
  slug: string;
  featured: boolean;
  order: number;
  vi: ProjectLocale;
  en: ProjectLocale | null;
};

export type ResumeProject = {
  projectName: string;
  projectYear?: string;
  company?: string;
  techStack?: string[];
  overall?: string;
  [key: string]: unknown;
};

export type FeaturedProject = {
  slug: string | null;
  title: { vi: string; en: string };
  summary: { vi: string; en: string };
  stack: string[];
  year: string;
  company: string;
  cover: string | null;
  href: string | null;
};

export declare function readProjects(
  root: string,
  opts?: { resumeProjectNames?: string[]; publicDir?: string },
): { projects: Project[]; errors: string[] };

export declare function resumeEngineeringProjects(resume: {
  experience: { title: string; company: string; projects: ResumeProject[] }[];
}): ResumeProject[];

export declare function featuredProjects(
  projects: Project[],
  resumeProjects: ResumeProject[],
  fallbackNames: string[],
  limit?: number,
): FeaturedProject[];
