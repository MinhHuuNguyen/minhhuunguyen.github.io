import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { track } from "@/lib/analytics";

export type SearchTrigger = "kbd" | "button" | "blog_field";

interface SearchContextValue {
  isOpen: boolean;
  /** Câu điền sẵn khi mở bảng (mỗi lần mở được đặt lại). */
  initialQuery: string;
  open(trigger: SearchTrigger, query?: string): void;
  close(): void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

// Bảng ⌘K (cmdk, minisearch, search.mjs) chỉ tải ở lần mở đầu tiên.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

const isTypingTarget = (el: EventTarget | null) => {
  const n = el as HTMLElement | null;
  return !!n && (n.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(n.tagName));
};

/** Trạng thái mở/đóng tìm kiếm, phím tắt (⌘K, Ctrl+K, "/") và nơi tải lười bảng tìm kiếm. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [everOpened, setEverOpened] = useState(false);
  const openRef = useRef(false);
  openRef.current = isOpen;

  const open = useCallback((trigger: SearchTrigger, query?: string) => {
    setInitialQuery(query ?? "");
    setOpen(true);
    setEverOpened(true);
    track("search_open", { trigger });
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) close();
        else open("kbd");
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !openRef.current && !isTypingTarget(e.target)) {
        e.preventDefault();
        open("kbd");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const value = useMemo(() => ({ isOpen, initialQuery, open, close }), [isOpen, initialQuery, open, close]);
  return (
    <SearchContext.Provider value={value}>
      {children}
      {everOpened && <CommandPalette />}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}
