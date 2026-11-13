import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import clsx from "clsx";

export function Sheet({
  side,
  open,
  onOpenChange,
  title,
  children,
}: {
  side: "right" | "bottom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className={clsx(
            "fixed z-50 overflow-auto bg-white p-6 font-sans text-ink-900 shadow-card",
            side === "right" ? "inset-y-0 right-0 w-[min(420px,100vw)]" : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-card",
          )}
        >
          <Dialog.Title className="mb-4 text-lg font-semibold">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
