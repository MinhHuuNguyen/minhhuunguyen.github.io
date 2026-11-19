export function Img({
  base,
  alt,
  widths,
  sizes,
  fallback,
  width,
  height,
  priority,
  className,
}: {
  base: string;
  alt: string;
  widths: number[];
  sizes: string;
  fallback: "jpg" | "png";
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  const set = (ext: string) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  const largest = Math.max(...widths);
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}-${largest}.${fallback}`}
        srcSet={set(fallback)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={className}
      />
    </picture>
  );
}
