
export const ellipsisText = (lineClamp = 1) => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: `${lineClamp}`,
    WebkitBoxOrient: "vertical",
  };
};

/**
 * Compute a human-readable duration between two dates, e.g. "6 years, 1 month".
 * `endDate` may be the literal "Present" to mean "now".
 */
export const getDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = endDate === "Present" ? new Date() : new Date(endDate);

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
