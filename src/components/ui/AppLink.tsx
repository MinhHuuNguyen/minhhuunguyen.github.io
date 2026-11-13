import Link from "next/link";
import { useRouter, type NextRouter } from "next/router";
import type { AnchorHTMLAttributes } from "react";
import { ADS_LIVE, shouldHardNavigate } from "@/lib/navigation.mjs";
import { localeOf, localizePath } from "@/lib/locale-routes.mjs";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /** Mặc định true: link nội bộ tự gắn /en khi trang hiện tại là bản tiếng Anh. Link đã chỉ rõ ngôn ngữ thì đặt false. */
  localize?: boolean;
};

/** Link nội bộ; khi đi vào/ra trang có quảng cáo thì tải lại cả trang (C4). */
export function AppLink({ href: rawHref, localize = true, children, ...rest }: AppLinkProps) {
  const router = useRouter();
  const internal = rawHref.startsWith("/") && !rawHref.startsWith("//");
  const href = localize && internal && localeOf(router.asPath) === "en" ? localizePath(rawHref, "en") : rawHref;
  const hard = shouldHardNavigate(router.asPath, href, ADS_LIVE);
  if (hard) {
    return (
      <a href={href} data-hard-nav="true" {...rest}>
        {children}
      </a>
    );
  }
  if (/^(https?:|mailto:|tel:|\/\/|#)/.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

export function navigate(router: NextRouter, href: string): void {
  if (shouldHardNavigate(router.asPath, href, ADS_LIVE)) window.location.assign(href);
  else void router.push(href);
}

export default AppLink;
