export type BrandName = "linkedin" | "github" | "facebook" | "youtube" | "tiktok";

const LETTER: Record<BrandName, string> = { linkedin: "in", github: "G", facebook: "f", youtube: "Y", tiktok: "T" };

/** Biểu tượng thương hiệu: vòng tròn kèm chữ cái đầu (nhãn đặt ở link cha). */
export function BrandIcon({ name, className }: { name: BrandName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" className={className} data-brand={name}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="inherit">
        {LETTER[name]}
      </text>
    </svg>
  );
}
