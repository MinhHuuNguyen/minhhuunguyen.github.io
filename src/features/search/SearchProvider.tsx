import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

export type SearchTrigger = "kbd" | "button" | "blog_field";

interface SearchContextValue {
  isOpen: boolean;
  open(trigger: SearchTrigger, query?: string): void;
  close(): void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** Trạng thái mở/đóng tìm kiếm; giao diện (palette) làm ở T22. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback((trigger: SearchTrigger) => {
    setOpen(true);
    track("search_open", { trigger });
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}
