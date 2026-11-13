const ORIGIN = "https://www.youtube.com";

function post(iframe: HTMLIFrameElement, message: Record<string, unknown>): void {
  iframe.contentWindow?.postMessage(JSON.stringify(message), ORIGIN);
}

/** Tua iframe YouTube (cần enablejsapi=1) tới giây `s` rồi phát. `data-last-seek` để kiểm thử. */
export function seekTo(iframe: HTMLIFrameElement, s: number): void {
  iframe.setAttribute("data-last-seek", String(s));
  post(iframe, { event: "command", func: "seekTo", args: [s, true] });
  post(iframe, { event: "command", func: "playVideo", args: [] });
}

/** Nghe trạng thái trình phát (onStateChange); trả về hàm huỷ. */
export function listen(iframe: HTMLIFrameElement, onState: (state: number) => void): () => void {
  const handshake = () => post(iframe, { event: "listening", id: 1, channel: "widget" });
  const onMessage = (e: MessageEvent) => {
    if (e.origin !== ORIGIN || e.source !== iframe.contentWindow || typeof e.data !== "string") return;
    try {
      const d = JSON.parse(e.data);
      if (d?.event === "onStateChange" && typeof d.info === "number") onState(d.info);
      else if (d?.event === "infoDelivery" && typeof d.info?.playerState === "number") onState(d.info.playerState);
    } catch {
      /* thông điệp không phải JSON của YouTube */
    }
  };
  window.addEventListener("message", onMessage);
  iframe.addEventListener("load", handshake);
  handshake();
  return () => {
    window.removeEventListener("message", onMessage);
    iframe.removeEventListener("load", handshake);
  };
}
