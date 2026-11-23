export type EventMap = {
  cta_click: { cta_id: "learn_start" | "collab" | "download_cv" | "view_projects" | "view_all_posts" | "start_path" | "next_project"; location: string };
  contact_click: { channel: "email" | "linkedin" | "github" | "facebook" | "youtube" | "tiktok"; location: string };
  channel_click: { platform: "youtube" | "tiktok"; location: string };
  video_play: { platform: "youtube" | "youtube_short" | "tiktok"; video_id: string; location: "library" | "post" | "home" };
  lesson_complete: { path: string; lesson: string };
  path_complete: { path: string };
  search_open: { trigger: "kbd" | "button" | "blog_field" };
  search_select: { type: "post" | "path" | "video" | "project" | "page" | "ask"; position: number };
  search_no_results: { query_length: number };
  chat_open: { location: "launcher" | "ask_page" | "post" | "palette" };
  chat_send: { mode: "coming-soon" | "mock" | "agent"; has_context: boolean };
  chat_citation_click: { position: number };
  comments_view: { lang: "vi" | "en" };
  comments_report_click: { lang: "vi" | "en" };
  resume_download: { variant: "resume" | "resume_full" };
  post_pdf_download: { slug: string; lang: "vi" | "en" };
};

/**
 * Bắn sự kiện GA4 (qua gtag nếu có) và phát `site:analytics` trên window để e2e/công cụ khác nghe.
 * Không có GA thì chỉ phát sự kiện nội bộ.
 */
export function track<E extends keyof EventMap>(event: E, params: EventMap[E]): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("site:analytics", { detail: { event, params } }));
    window.gtag?.("event", event, params);
  } catch {
    /* đo lường không được làm hỏng trang */
  }
}
