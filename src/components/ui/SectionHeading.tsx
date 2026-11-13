import { SectionLabel } from "./Chip";

export function SectionHeading({
  label,
  lead,
  align = "left",
}: {
  label: string;
  lead: { strong: string; muted?: string };
  align?: "left" | "right";
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div className={align === "right" ? "lg:order-2 lg:text-right" : undefined}>
        <SectionLabel>{label}</SectionLabel>
      </div>
      <p className="text-lead [text-indent:3.5em]">
        <span className="font-medium text-ink-900">{lead.strong}</span>
        {lead.muted ? <span className="text-ink-500"> {lead.muted}</span> : null}
      </p>
    </div>
  );
}
