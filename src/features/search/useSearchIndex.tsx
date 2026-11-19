import { useCallback, useEffect, useState } from "react";
import MiniSearch from "minisearch";
import { miniSearchOptions, type SearchDoc, type SearchDocType, type Suggestion } from "@/lib/search.mjs";

export type SearchStatus = "idle" | "loading" | "ready" | "error";
export type SearchHit = Pick<SearchDoc, "id" | "type" | "title" | "titleEn" | "url">;
export type Grouped = Record<SearchDocType, SearchHit[]>;

/** Số kết quả tối đa mỗi nhóm (mục 1.12). */
export const GROUP_LIMITS: Record<SearchDocType, number> = { post: 6, path: 3, video: 3, project: 3, page: 3 };
export const GROUP_ORDER: SearchDocType[] = ["post", "path", "video", "project", "page"];

type Loaded = { mini: MiniSearch<SearchDoc>; suggestions: Suggestion[] };

// Chỉ mục nhớ đệm ở cấp module: mỗi trang chỉ tải đúng 1 lần dù mở bảng nhiều lần.
let loaded: Loaded | null = null;
let inflight: Promise<Loaded> | null = null;

function loadIndex(): Promise<Loaded> {
  if (loaded) return Promise.resolve(loaded);
  if (!inflight) {
    inflight = fetch(`/search-index.json?v=${process.env.NEXT_PUBLIC_BUILD_ID ?? ""}`)
      .then((res) => {
        if (!res.ok) throw new Error(`search-index ${res.status}`);
        return res.json();
      })
      .then((json) => {
        loaded = { mini: MiniSearch.loadJS<SearchDoc>(json.index, miniSearchOptions()), suggestions: json.suggestions ?? [] };
        return loaded;
      })
      .catch((e) => {
        inflight = null;
        throw e;
      });
  }
  return inflight;
}

const emptyGroups = (): Grouped => ({ post: [], path: [], video: [], project: [], page: [] });

export function useSearchIndex(): {
  status: SearchStatus;
  search(q: string): Grouped;
  suggestions: Suggestion[];
  retry(): void;
} {
  const [status, setStatus] = useState<SearchStatus>(loaded ? "ready" : "idle");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!loaded) setStatus("loading");
    loadIndex().then(
      () => alive && setStatus("ready"),
      () => alive && setStatus("error"),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);

  const search = useCallback(
    (q: string): Grouped => {
      const groups = emptyGroups();
      if (!loaded || !q.trim()) return groups;
      for (const r of loaded.mini.search(q)) {
        const type = r.type as SearchDocType;
        if (groups[type] && groups[type].length < GROUP_LIMITS[type]) {
          groups[type].push({ id: r.id, type, title: r.title, titleEn: r.titleEn, url: r.url });
        }
      }
      return groups;
    },
    // `status` đổi sang ready thì kết quả cần tính lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status],
  );

  return { status, search, suggestions: loaded?.suggestions ?? [], retry: () => setAttempt((n) => n + 1) };
}
