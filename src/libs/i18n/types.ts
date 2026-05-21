export type Locale = "vi" | "en";

export const LOCALES: Locale[] = ["vi", "en"];
export const DEFAULT_LOCALE: Locale = "vi";

/**
 * Shape of a UI translation dictionary. The Vietnamese dictionary (`vi.ts`) is
 * the source of truth for available keys; every other locale must match it.
 */
export type Dictionary = {
  common: {
    readMore: string;
  };
  nav: {
    home: string;
    resume: string;
    blog: string;
    githubStats: string;
    downloadPdf: string;
  };
  home: {
    myBlog: string;
  };
  news: {
    readMore: string;
  };
  blog: {
    seoTitle: string;
    seriesTitle: string;
    listTitle: string;
  };
  resume: {
    seoTitle: string;
    professionalExperience: string;
    educationCertifications: string;
    language: string;
    additionalExperience: string;
    award: string;
    projectDetail: string;
    overall: string;
    techstack: string;
    year: string;
    years: string;
    month: string;
    months: string;
  };
  footer: {
    contact: string;
  };
  notFound: {
    title: string;
    backHome: string;
  };
};
