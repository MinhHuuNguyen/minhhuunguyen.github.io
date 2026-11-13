import type { Options } from "minisearch";
import type { LearningPath } from "./learn.mjs";
import type { VideoItem } from "./videos.mjs";
import type { Project } from "./projects.mjs";

export type SearchDocType = "post" | "path" | "video" | "project" | "page";
export interface SearchDoc {
  id: string;
  type: SearchDocType;
  title: string;
  titleEn: string;
  url: string;
  tags: string[];
  headings: string[];
  text: string;
  snippet: string;
  date: string | null;
}
export interface SearchPost {
  slug: string;
  title: string;
  description?: string;
  tags?: string[] | null;
  content?: string;
  time?: string;
}
export interface SearchPage {
  url: string;
  title: { vi: string; en: string };
  text: string;
}
export interface Suggestion {
  type: "path" | "post";
  title: string;
  url: string;
}
export declare const SEARCH_FIELDS: string[];
export declare const STORE_FIELDS: string[];
export declare const PLAIN_TEXT_WORDS: number;
export declare const SEARCH_INDEX_MAX_BYTES: number;
export declare function processTerm(term: string): string | null;
export declare function miniSearchOptions(): Options<SearchDoc>;
export declare function buildSearchDocs(input: {
  posts?: SearchPost[];
  paths?: LearningPath[];
  videos?: VideoItem[];
  projects?: Project[];
  pages?: SearchPage[];
}): SearchDoc[];
export declare function buildSuggestions(input: { paths?: LearningPath[]; posts?: SearchPost[] }): Suggestion[];
