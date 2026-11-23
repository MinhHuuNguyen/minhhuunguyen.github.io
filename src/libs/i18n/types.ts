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
    mainLabel: string;
    learn: string;
    videos: string;
    projects: string;
    ask: string;
    search: string;
    collab: string;
    openMenu: string;
    menuTitle: string;
    changeLanguage: string;
    skip: string;
  };
  home: {
    myBlog: string;
    anchorsLabel: string;
    hero: { ctaLearn: string; ctaCollab: string };
    stats: { title: string };
    journey: { cta: string; stackLabel: string; awardsLabel: string; now: string };
    projects: { strong: string; muted: string; viewDetails: string; cta: string };
    marquee: { photos: string; videos: string };
    services: { label: string };
    paths: { label: string; updated: string; lessons: string; start: string; prev: string; next: string };
    articles: { label: string; intro: string; viewAll: string; read: string };
  };
  ads: {
    label: string;
  };
  post: {
    videoTitle: string;
    timestamps: string;
    readingTime: string;
    toc: string;
    related: string;
    ask: string;
    prev: string;
    next: string;
    markDone: string;
    done: string;
    chapters: string;
    progress: string;
    storageOff: string;
    downloadPdf: string;
    downloadPdfLabel: string;
  };
  comments: {
    title: string;
    report: string;
    hint: string;
    openOnGithub: string;
    noscript: string;
  };
  news: {
    readMore: string;
  };
  blog: {
    seoTitle: string;
    seriesTitle: string;
    listTitle: string;
    searchPlaceholder: string;
    searchResultsTitle: string;
    searchNoResults: string;
    title: string;
    count: string;
    search: string;
    topics: string;
    all: string;
    paths: string;
    more: string;
    enComing: string;
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
    download: string;
    skills: string;
    projects: string;
    contact: string;
    present: string;
  };
  legal: {
    updated: string;
    draftBanner: string;
  };
  learn: {
    seoTitle: string;
    heading: string;
    lead: string;
    pathPrefix: string;
    meta: string;
    videoCount: string;
    progress: string;
    start: string;
    continue: string;
    completed: string;
    comingSoon: string;
    hasVideo: string;
    lessonsHeading: string;
    allPaths: string;
    viewPath: string;
    storageBlocked: string;
    viOnly: string;
  };
  videos: {
    seoTitle: string;
    heading: string;
    lead: string;
    empty: string;
    filterLabel: string;
    filterAll: string;
    filterYoutube: string;
    filterShorts: string;
    filterTiktok: string;
    play: string;
    watchOn: string;
    viewPost: string;
    noThumb: string;
  };
  projects: {
    seoTitle: string;
    heading: string;
    lead: string;
    viewDetail: string;
    allProjects: string;
    otherTitle: string;
    otherLead: string;
    enMissing: string;
    role: string;
    company: string;
    period: string;
    stack: string;
    links: string;
  };
  footer: {
    contact: string;
    tagline: string;
    copyright: string;
    privacy: string;
    terms: string;
    githubStats: string;
  };
  contact: {
    availableLabel: string;
    available: string;
    prompt: string;
    badge: string;
    socialTitle: string;
    socialDesc: string;
  };
  notFound: {
    title: string;
    backHome: string;
    hint: string;
    search: string;
  };
  chat: {
    launcher: string;
    title: string;
    soonBadge: string;
    greeting: string;
    suggestion1: string;
    suggestion2: string;
    suggestion3: string;
    input: string;
    send: string;
    clear: string;
    close: string;
    context: string;
    contextRemove: string;
    disclaimer: string;
    retry: string;
    pending: string;
    citation: string;
    countLimit: string;
  };
  search: {
    title: string;
    placeholder: string;
    groupPost: string;
    groupPath: string;
    groupVideo: string;
    groupProject: string;
    groupPage: string;
    suggestions: string;
    loading: string;
    error: string;
    retry: string;
    empty: string;
    ask: string;
  };
};
