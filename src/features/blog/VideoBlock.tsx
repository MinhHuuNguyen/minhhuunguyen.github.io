import { useI18n } from "@/libs/i18n/I18nContext";
import type { PostVideo } from "@/lib/seo.mjs";
/** Video YouTube của bài. Bài VI có sẵn khối video trong nội dung; bài EN lấy video từ bài VI gốc nên dựng ở đây. */
export function VideoBlock({ video }: { video: PostVideo }) {
  const { t } = useI18n();
  return (
    <div data-video-block>
      <h2>{t("post.videoTitle")}</h2>
      <iframe
        src={`https://www.youtube.com/embed/${video.youtube_id}?enablejsapi=1`}
        title={video.name}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="aspect-video w-full rounded-card"
      />
    </div>
  );
}
