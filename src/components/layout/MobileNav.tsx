import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import { Sheet } from "@/components/ui/Sheet";
import { useI18n } from "@/libs/i18n/I18nContext";
import { track } from "@/lib/analytics";
import { LocaleToggle } from "./LocaleToggle";

export type NavItem = { key: string; href: string; label: string };

/** Nút ≡ và ngăn kéo menu cho màn hình hẹp. */
export function MobileNav({ items, contactHref }: { items: NavItem[]; contactHref: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const linkCls = "block rounded-lg px-3 py-3 text-base font-semibold text-ink-900 hover:bg-surface-100";
  return (
    <>
      <button
        type="button"
        aria-label={t("nav.openMenu")}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-full text-ink-900 hover:bg-surface-100 lg:hidden"
      >
        <MenuIcon size={22} aria-hidden="true" />
      </button>
      <Sheet side="right" open={open} onOpenChange={setOpen} title={t("nav.menuTitle")}>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.key}>
              <AppLink href={item.href} className={linkCls} onClick={close}>
                {item.label}
              </AppLink>
            </li>
          ))}
          <li>
            <AppLink href="/ask" className={linkCls} onClick={close}>
              {t("nav.ask")}
            </AppLink>
          </li>
        </ul>
        <div className="mt-6 flex items-center justify-between gap-3">
          <AppLink
            href={contactHref}
            localize={false}
            className="inline-flex rounded-pill bg-pill-dark px-6 py-2.5 text-[15px] font-semibold text-white"
            onClick={() => {
              track("cta_click", { cta_id: "collab", location: "mobile_nav" });
              close();
            }}
          >
            {t("nav.collab")}
          </AppLink>
          <LocaleToggle />
        </div>
      </Sheet>
    </>
  );
}

export default MobileNav;
