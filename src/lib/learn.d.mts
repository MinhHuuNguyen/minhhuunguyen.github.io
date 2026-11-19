export interface SeriesLesson {
  order: number;
  label: string;
  slug: string;
}
export interface Lesson extends SeriesLesson {
  available: boolean;
  title: string | null;
  minutes: number | null;
  hasVideo: boolean;
  href?: string | null;
  lang?: "en" | "vi";
}
export interface PathInputPost {
  slug: string;
  title?: string;
  description?: string;
  banner_url?: string;
  time?: string;
  tags?: string[];
  content?: string;
  filePath: string;
  readingMinutes?: number;
  video?: unknown;
}
export interface LearningPath {
  slug: string;
  seriesSlug: string;
  title: string;
  description: string;
  banner: string;
  updated: string;
  lessons: Lesson[];
  stats: { total: number; available: number; minutes: number; videos: number };
}
export interface LessonNav {
  path: { slug: string; title: string };
  position: number;
  total: number;
  prev: Lesson | null;
  next: Lesson | null;
}
export declare function parseSeriesLessons(markdown: string | null | undefined): SeriesLesson[];
export declare const pathSlugOf: (seriesSlug: string) => string;
export declare function buildPaths(posts: PathInputPost[]): LearningPath[];
export declare function lessonNav(paths: LearningPath[], postSlug: string): LessonNav | null;
export declare function buildEnPaths(viPaths: LearningPath[], enPosts: { slug: string; title: string; description?: string; content?: string }[], pairs: { viToEn: Record<string, string>; enToVi: Record<string, string> }): LearningPath[];
