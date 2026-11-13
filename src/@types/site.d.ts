export type Bi<T = string> = { vi: T; en: T };

export type StatSource = "careerYears" | "engineeringProjects" | "courses" | "posts" | "videos" | "awards";

export interface SiteConfig {
  meta: { copyStatus: "draft" | "approved" };
  person: {
    name: Bi;
    roles: Bi<string[]>;
    location: Bi;
    careerStart: string;
    email: string;
    portrait: string;
  };
  socials: {
    linkedin: string | null;
    github: string | null;
    facebook: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  nav: { showVideosWhenEmpty: boolean; githubStats: string };
  hero: {
    topLine: Bi;
    headline: Bi<string[]>;
    intro: Bi;
    credentials: Bi;
  };
  anchors: { id: string; label: Bi }[];
  story: { label: Bi; strong: Bi; muted: Bi; logosLabel: Bi };
  logos: { name: string; base: string }[];
  pills: Bi[];
  stats: { source: StatSource; suffix?: string; label: Bi; desc: Bi }[];
  journey: { label: Bi; strong: Bi; muted: Bi; steps: { match: string; desc: Bi }[] };
  stack: { name: string; icon?: string }[];
  awards: Bi[];
  services: { title: Bi; desc: Bi }[];
  featuredPaths: string[];
  featuredProjectsFallback: string[];
  contact: {
    tagline: Bi;
    availableLabel: Bi;
    available: Bi<string[]>;
    prompt: Bi;
    badge: Bi;
    socialTitle: Bi;
    socialDesc: Bi;
  };
  marqueePhotos: { base: string; alt: Bi }[];
}
