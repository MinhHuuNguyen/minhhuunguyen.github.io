import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

/** Menu: bọc Radix Dropdown. `trigger` là phần tử bấm; `children` là các mục (Menu.Item). */
export function Menu({ trigger, children, align = "end" }: { trigger: ReactNode; children: ReactNode; align?: "start" | "center" | "end" }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align={align} sideOffset={8} className="z-50 min-w-[160px] rounded-card bg-white p-1.5 font-sans shadow-card">
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

Menu.Item = function MenuItem({ onSelect, asChild, children }: { onSelect?: () => void; asChild?: boolean; children: ReactNode }) {
  return (
    <DropdownMenu.Item onSelect={onSelect} asChild={asChild} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-ink-900 outline-none data-[highlighted]:bg-surface-100">
      {children}
    </DropdownMenu.Item>
  );
};

export default Menu;
