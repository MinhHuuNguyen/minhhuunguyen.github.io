import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { useRouter } from "next/router";
import { counterpartUrl, localeOf } from "@/lib/locale-routes.mjs";
import { navigate } from "@/components/ui/AppLink";
import { LOCALES, type Dictionary, type Locale } from "./types";
import vi from "./locales/vi";
import en from "./locales/en";

const dictionaries: Record<Locale, Dictionary> = { vi, en };


type TranslateKey = string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  alternates?: Partial<Record<Locale, string | null>>;
  /** Active dictionary — use for typed access, e.g. `dict.resume.award`. */
  dict: Dictionary;
  /** Dot-path lookup, e.g. `t("resume.award")`. Falls back to the key. */
  t: (key: TranslateKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as string[]).includes(value);
}

function resolve(dict: Dictionary, key: TranslateKey): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined,
      dict,
    );
  return typeof value === "string" ? value : key;
}

export function I18nProvider({
  children,
  locale: localeProp,
  alternates,
}: {
  children: ReactNode;
  /** `pageProps.locale`; thiếu thì suy ra từ URL. */
  locale?: Locale;
  /** `pageProps.alternates`: URL tương ứng ở từng ngôn ngữ (chỉ trang bài cần). */
  alternates?: Partial<Record<Locale, string | null>>;
}) {
  const router = useRouter();
  const locale: Locale = isLocale(localeProp) ? localeProp : localeOf(router.asPath);

  // Client-side navigation giữ nguyên <html>, nên cập nhật lang khi đổi ngôn ngữ.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      navigate(router, alternates?.[next] ?? counterpartUrl(router.asPath, next));
    },
    [alternates, locale, router],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "vi" ? "en" : "vi");
  }, [locale, setLocale]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale];
    return {
      locale,
      setLocale,
      toggleLocale,
      alternates,
      dict,
      t: (key: TranslateKey) => resolve(dict, key),
    };
  }, [alternates, locale, setLocale, toggleLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
