
/**
 * Normalize text for accent-insensitive matching (Vietnamese-friendly):
 * lowercase, strip diacritics, and map "đ" → "d".
 * Used for both the search index and the user's query so e.g. "cong nghe"
 * matches "Công nghệ" and "ai" matches "AI".
 */
export const normalizeText = (input: string): string =>
  (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d")
    .replace(/[̀-ͯ]/g, "");

export const ellipsisText = (lineClamp = 1) => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: `${lineClamp}`,
    WebkitBoxOrient: "vertical",
  };
};

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Parse the resume's "Month YYYY" date strings (e.g. "May 2019") in an
 * engine-independent way. `new Date("May 2019")` is a non-standard format that
 * parses differently across JS engines (Node vs Safari), which desyncs SSR and
 * client renders and breaks hydration. "Present" resolves to the current date.
 */
export const parseResumeDate = (value: string): Date => {
  if (!value || value.trim().toLowerCase() === "present") return new Date();
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const month = MONTH_INDEX[match[1].slice(0, 3).toLowerCase()];
    if (month !== undefined) {
      return new Date(Date.UTC(Number(match[2]), month, 1));
    }
  }
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? new Date(0) : fallback;
};

/**
 * Compute a human-readable duration between two dates, e.g. "6 years, 1 month".
 * `endDate` may be the literal "Present" to mean "now".
 */
export const getDuration = (startDate: string, endDate: string): string => {
  const start = parseResumeDate(startDate);
  const end = endDate === "Present" ? new Date() : parseResumeDate(endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  const diffMonths = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30)
  );

  const yearString =
    diffYears > 1 ? `${diffYears} years` : diffYears === 1 ? `${diffYears} year` : "";
  const monthString =
    diffMonths > 1 ? `${diffMonths} months` : diffMonths === 1 ? `${diffMonths} month` : "";

  return [yearString, monthString].filter(Boolean).join(", ");
};
