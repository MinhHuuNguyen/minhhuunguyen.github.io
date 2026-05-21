import type { Dictionary } from "../types";

/**
 * English dictionary. Must mirror every key in `vi.ts`.
 */
const en: Dictionary = {
  common: {
    readMore: "See more",
  },
  nav: {
    home: "Home",
    resume: "Resume",
    blog: "Blog",
    githubStats: "Github Stats",
    downloadPdf: "Download PDF",
  },
  home: {
    myBlog: "MY BLOG",
  },
  news: {
    readMore: "Read more",
  },
  blog: {
    seoTitle: "My posts",
    seriesTitle: "ARTICLE SERIES",
    listTitle: "ARTICLE LIST",
  },
  resume: {
    seoTitle: "My resume",
    professionalExperience: "Professional Experience",
    educationCertifications: "Education & Certifications",
    language: "Language",
    additionalExperience: "Additional Experience",
    award: "Award",
    projectDetail: "Project Detail",
    overall: "Overall:",
    techstack: "Techstack:",
    year: "year",
    years: "years",
    month: "month",
    months: "months",
  },
  footer: {
    contact: "Contact",
  },
  notFound: {
    title: "Page not found",
    backHome: "Back to home",
  },
};

export default en;
