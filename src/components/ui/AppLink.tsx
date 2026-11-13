import Link from "next/link";
import { useRouter, type NextRouter } from "next/router";
import type { AnchorHTMLAttributes } from "react";
import { ADS_LIVE, shouldHardNavigate } from "@/lib/navigation.mjs";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Link nội bộ; khi đi vào/ra trang có quảng cáo thì tải lại cả trang (C4). */
export function AppLink({ href, children, ...rest }: AppLinkProps) {
  const router = useRouter();
  const hard = shouldHardNavigate(router.asPath, href, ADS_LIVE);
  if (hard) {
    return (
      <a href={href} data-hard-nav="true" {...rest}>
        {children}
      </a>
    );
  }
  if (/^(https?:|mailto:|tel:|\/\/)/.test(href)) {
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
