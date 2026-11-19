import { useCallback, useEffect, useState } from "react";
import MiniSearch from "minisearch";
import { useI18n } from "@/libs/i18n/I18nContext";
import type { Locale } from "@/libs/i18n/types";
import { miniSearchOptions, type SearchDoc, type SearchDocType, type Suggestion } from "@/lib/search.mjs";

export type SearchStatus = "idle" | "loading" | "ready" | "error";
export type SearchHit = Pick<SearchDoc, "id" | "type" | "title" | "titleEn" | "url">;
export type Grouped = Record<SearchDocType, SearchHit[]>;

/** Số kết quả tối đa mỗi nhóm (mục 1.12). */
export const GROUP_LIMITS: Record<SearchDocType, number> = { post: 6, path: 3, video: 3, project: 3, page: 3 };
export const GROUP_ORDER: SearchDocType[] = ["post", "path", "video", "project", "page"];

type Loaded = { mini: MiniSearch<SearchDoc>; suggestions: Suggestion[] };

// Chỉ mục nhớ đệm ở cấp module theo ngôn ngữ: mỗi ngôn ngữ chỉ tải đúng 1 lần dù mở bảng nhiều lần.
const cache: Partial<Record<Locale, Loaded>> = {};
const pending: Partial<Record<Locale, Promise<Loaded> | null>> = {};
const FILES: Record<Locale, string> = { vi: "/search-index.json", en: "/search-index.en.json" };
function loadIndex(locale: Locale): Promise<Loaded> {
  const hit = cache[locale];
  if (hit) return Promise.resolve(hit);
  if (!pending[locale]) {
    pending[locale] = fetch(`${FILES[locale]}?v=${process.env.NEXT_PUBLIC_BUILD_ID ?? ""}`)
      .then((res) => {
        if (!res.ok) throw new Error(`search-index ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const next = { mini: MiniSearch.loadJS<SearchDoc>(json.index, miniSearchOptions()), suggestions: json.suggestions ?? [] };
        cache[locale] = next;
        return next;
      })
      .catch((e) => {
        pending[locale] = null;
        throw e;
      });
  }
  return pending[locale] as Promise<Loaded>;
}
const emptyGroups = (): Grouped => ({ post: [], path: [], video: [], project: [], page: [] });

export function useSearchIndex(): {
  status: SearchStatus;
  search(q: string): Grouped;
  suggestions: Suggestion[];
  retry(): void;
} {
  const { locale } = useI18n();
  const [status, setStatus] = useState<SearchStatus>(cache[locale] ? "ready" : "idle");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!cache[locale]) setStatus("loading");
    loadIndex(locale).then(
      () => alive && setStatus("ready"),
      () => alive && setStatus("error"),
    );
    return () => {
      alive = false;
    };
  }, [attempt, locale]);

  const search = useCallback(
    (q: string): Grouped => {
      const groups = emptyGroups();
      const cur = cache[locale];
      if (!cur || !q.trim()) return groups;
      for (const r of cur.mini.search(q)) {
        const type = r.type as SearchDocType;
        if (groups[type] && groups[type].length < GROUP_LIMITS[type]) {
          groups[type].push({ id: r.id, type, title: r.title, titleEn: r.titleEn, url: r.url });
        }
      }
      return groups;
    },
    // `status` đổi sang ready thì kết quả cần tính lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, locale],
  );

  return { status, search, suggestions: cache[locale]?.suggestions ?? [], retry: () => setAttempt((n) => n + 1) };
}
