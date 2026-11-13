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
    mainLabel: "Main",
    learn: "Learn",
    videos: "Videos",
    projects: "Projects",
    ask: "Ask AI",
    search: "Search",
    collab: "Work with me",
    openMenu: "Open menu",
    menuTitle: "Menu",
    changeLanguage: "Change language",
    skip: "Skip to content",
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
    searchPlaceholder: "Search posts...",
    searchResultsTitle: "SEARCH RESULTS",
    searchNoResults: "No matching posts found.",
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
    download: "Download CV",
    atsShort: "Short CV (PDF, ATS)",
    atsFull: "Full CV (PDF, ATS)",
    designed: "Designed CV (PDF)",
  },
  footer: {
    contact: "Contact",
    tagline: "Building AI that works in the real world, and teaching it to those who come next.",
    copyright: "© {year} Nguyen Huu Minh",
    privacy: "Privacy policy",
    terms: "Terms",
    githubStats: "Github Stats",
  },
  contact: {
    availableLabel: "Available for",
    available: "Training · Consulting · Building · Mentoring",
    prompt: "Have a project or a class in mind? Write to me:",
    badge: "Let's talk • Let's talk • ",
    socialTitle: "Find me online",
    socialDesc: "Whether you need an AI lecturer, an MLOps engineer or just have a question, reach me on any channel below.",
  },
  notFound: {
    title: "Page not found",
    backHome: "Back to home",
  },
};

export default en;
