import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Sparkles } from "lucide-react";
import { navigate } from "@/components/ui/AppLink";
import { useChat } from "@/features/chat/ChatProvider";
import { track } from "@/lib/analytics";
import { localizePath } from "@/lib/locale-routes.mjs";
import type { SearchDocType } from "@/lib/search.mjs";
import { useI18n } from "@/libs/i18n/I18nContext";
import { useSearch } from "./SearchProvider";
import { GROUP_ORDER, useSearchIndex } from "./useSearchIndex";

const GROUP_KEY: Record<SearchDocType, string> = {
  post: "search.groupPost",
  path: "search.groupPath",
  video: "search.groupVideo",
  project: "search.groupProject",
  page: "search.groupPage",
};
type Row = { value: string; label: string; url: string; type: SearchDocType };

const itemCls =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink-900 aria-selected:bg-surface-100";
const headingCls = "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-ink-500";

/** Bảng tìm kiếm ⌘K. Chỉ tải ở lần mở đầu (kéo theo cmdk, minisearch và search.mjs). */
export function CommandPalette() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOpen, close, initialQuery } = useSearch();
  const { openChat } = useChat();
  const { status, search, suggestions, retry } = useSearchIndex();
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (isOpen) setQuery(initialQuery);
  }, [isOpen, initialQuery]);

  const q = query.trim();
  const titleOf = (h: { title: string; titleEn: string }) => (locale === "en" && h.titleEn ? h.titleEn : h.title);
  const grouped = useMemo(() => {
    const res = search(q);
    return GROUP_ORDER.map((type) => ({
      type,
      rows: res[type].map((h): Row => ({ value: h.id, label: titleOf(h), url: h.url, type })),
    })).filter((g) => g.rows.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, q, locale]);
  const total = grouped.reduce((n, g) => n + g.rows.length, 0);
  const suggestionRows: Row[] = suggestions.map((s) => ({ value: `${s.type}:${s.url}`, label: s.title, url: s.url, type: s.type }));
  // Không để cmdk lọc, nên tự chọn sẵn mục đầu khi danh sách đổi: Enter mở ngay kết quả đầu.
  const firstValue = q ? (grouped[0]?.rows[0]?.value ?? "ask-ai") : (suggestionRows[0]?.value ?? "");
  useEffect(() => setActive(firstValue), [firstValue, isOpen]);

  useEffect(() => {
    if (status === "ready" && q && total === 0) track("search_no_results", { query_length: q.length });
  }, [status, q, total]);

  const go = (url: string, type: SearchDocType, position: number) => {
    track("search_select", { type, position });
    close();
    // Phase 1 chưa có bài tiếng Anh: bài vẫn mở bản gốc tiếng Việt.
    navigate(router, url.startsWith("/blog/") ? url : localizePath(url, locale));
  };
  const ask = () => {
    track("search_select", { type: "ask", position: total + 1 });
    close();
    openChat({ location: "palette", message: q });
  };

  let position = 0;

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={(o) => !o && close()}
      label={t("search.title")}
      shouldFilter={false}
      value={active}
      onValueChange={setActive}
      overlayClassName="fixed inset-0 z-50 bg-ink-900/40"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-card bg-white font-sans text-ink-900 shadow-card"
    >
      <Dialog.Title className="sr-only">{t("search.title")}</Dialog.Title>
      <div className="flex items-center gap-3 border-b border-line-light px-4">
        <Search size={18} aria-hidden="true" className="shrink-0 text-ink-500" />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder={t("search.placeholder")}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-500"
        />
      </div>
      <Command.List className={`max-h-[60vh] overflow-y-auto p-2 ${headingCls}`}>
        {status === "loading" && <p role="status" className="px-3 py-6 text-center text-sm text-ink-500">{t("search.loading")}</p>}
        {status === "error" && (
          <div className="px-3 py-6 text-center text-sm text-danger-700">
            <p>{t("search.error")}</p>
            <button type="button" onClick={retry} className="mt-3 rounded-pill bg-white px-4 py-1.5 font-semibold text-ink-900 shadow-card">
              {t("search.retry")}
            </button>
          </div>
        )}
        {status === "ready" && !q && suggestionRows.length > 0 && (
          <Command.Group heading={t("search.suggestions")}>
            {suggestionRows.map((r) => (
              <Command.Item key={r.value} value={r.value} className={itemCls} onSelect={() => go(r.url, r.type, suggestionRows.indexOf(r) + 1)}>
                {r.label}
              </Command.Item>
            ))}
          </Command.Group>
        )}
        {status === "ready" && q && total === 0 && <p role="status" className="px-3 py-4 text-center text-sm text-ink-500">{t("search.empty")}</p>}
        {status === "ready" &&
          q &&
          grouped.map((g) => (
            <Command.Group key={g.type} heading={t(GROUP_KEY[g.type])}>
              {g.rows.map((r) => {
                const pos = ++position;
                return (
                  <Command.Item key={r.value} value={r.value} className={itemCls} onSelect={() => go(r.url, r.type, pos)}>
                    {r.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
          ))}
        {q && (
          <Command.Group>
            <Command.Item value="ask-ai" className={itemCls} onSelect={ask}>
              <Sparkles size={16} aria-hidden="true" className="shrink-0 text-blue-700" />
              {t("search.ask").replace("{q}", q)}
            </Command.Item>
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
}

export default CommandPalette;
