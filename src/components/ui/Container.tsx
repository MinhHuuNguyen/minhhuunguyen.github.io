import type { ElementType, ReactNode } from "react";
import clsx from "clsx";

const SIZES = { default: "max-w-container", wide: "max-w-[1440px]", prose: "max-w-prose" } as const;

export function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
}: {
  as?: ElementType;
  size?: keyof typeof SIZES;
  className?: string;
  children?: ReactNode;
}) {
  return <Tag className={clsx("mx-auto w-full px-5 sm:px-8", SIZES[size], className)}>{children}</Tag>;
}
