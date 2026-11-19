import { AdSlot } from "./AdSlot";

/** Cột quảng cáo bên phải, chỉ hiện từ 1280px; dính khi cuộn. */
export function AdRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0">
      <div className="sticky top-24">
        <AdSlot slot="rail" />
      </div>
    </aside>
  );
}
