import type { Locale } from "./types";

/** Chọn giá trị theo ngôn ngữ: `{vi, en}` thì lấy `en` khi có, thiếu thì dùng `vi`; giá trị thường trả nguyên. */
export function pick<T>(value: { vi: T; en?: T } | T, locale: Locale): T {
  if (value && typeof value === "object" && "vi" in (value as object)) {
    const v = value as { vi: T; en?: T };
    return locale === "en" && v.en !== undefined ? v.en : v.vi;
  }
  return value as T;
}
