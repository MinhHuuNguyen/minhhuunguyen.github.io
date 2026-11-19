export interface Progress {
  version: 1;
  paths: Record<string, Record<string, string>>;
}
export declare const PROGRESS_KEY: string;
export declare function parseProgress(raw: string | null): Progress;
export declare const serializeProgress: (p: Progress) => string;
export declare function setLesson(p: Progress, path: string, lesson: string, done: boolean, nowIso: string): Progress;
export declare function pathProgress(
  p: Progress,
  path: { slug: string; lessons: { slug: string; available: boolean }[] }
): { done: number; total: number; percent: number; complete: boolean };
export declare function safeStorage(kind: "local" | "session", win?: object): Storage | null;
