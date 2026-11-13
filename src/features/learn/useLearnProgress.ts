import { useCallback, useEffect, useState } from "react";
import { PROGRESS_KEY, parseProgress, pathProgress, safeStorage, serializeProgress, setLesson, type Progress } from "@/lib/progress.mjs";
import { track } from "@/lib/analytics";

export type ProgressInfo = ReturnType<typeof pathProgress>;
export type PathLike = { slug: string; lessons: { slug: string; available: boolean }[] };

const CHANGE_EVENT = "learn-progress:change";
const EMPTY: Progress = { version: 1, paths: {} };

/** Tiến độ học lưu ở localStorage; không dùng được thì giữ trong bộ nhớ của phiên và `available=false`. */
export function useLearnProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [available, setAvailable] = useState(true);

  const read = useCallback((): Progress => {
    const storage = safeStorage("local");
    setAvailable(storage !== null);
    return storage ? parseProgress(storage.getItem(PROGRESS_KEY)) : EMPTY;
  }, []);

  useEffect(() => {
    const sync = () => {
      if (safeStorage("local")) setProgress(read());
    };
    setProgress(read());
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, [read]);

  const mark = useCallback(
    (path: PathLike, lesson: string, done: boolean) => {
      const storage = safeStorage("local");
      const before = storage ? parseProgress(storage.getItem(PROGRESS_KEY)) : progress;
      const after = setLesson(before, path.slug, lesson, done, new Date().toISOString());
      if (storage) {
        try {
          storage.setItem(PROGRESS_KEY, serializeProgress(after));
        } catch {
          setAvailable(false);
        }
      } else setAvailable(false);
      setProgress(after);
      if (done) {
        track("lesson_complete", { path: path.slug, lesson });
        if (!pathProgress(before, path).complete && pathProgress(after, path).complete) track("path_complete", { path: path.slug });
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [progress],
  );

  const percent = useCallback((path: PathLike): ProgressInfo => pathProgress(progress, path), [progress]);

  return { progress, available, mark, percent };
}
