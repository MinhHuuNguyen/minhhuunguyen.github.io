import { useState } from "react";
import { Play } from "lucide-react";

type Props = {
  embedUrl: string;
  title: string;
  thumbnail: string | null;
  playLabel: string;
  describedBy: string;
  fallbackLabel: string;
  onPlay: () => void;
};

/** TikTok không có ảnh bìa công khai khi chưa lấy được meta nên dùng nền trơn; iframe chỉ nạp khi bấm. */
export function TikTokFacade({ embedUrl, title, thumbnail, playLabel, describedBy, fallbackLabel, onPlay }: Props) {
  const [playing, setPlaying] = useState(false);
  const frame = "relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink-900";
  if (playing) {
    return (
      <div className={frame}>
        <iframe
          src={`${embedUrl}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }
  return (
    <div className={frame}>
      {thumbnail ? (
        <img src={thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-sm font-semibold text-white/70">
          {fallbackLabel}
        </span>
      )}
      <button
        type="button"
        aria-label={playLabel}
        aria-describedby={describedBy}
        onClick={() => {
          setPlaying(true);
          onPlay();
        }}
        className="absolute inset-0 grid place-items-center bg-black/20 transition hover:bg-black/30"
      >
        <span className="grid size-14 place-items-center rounded-full bg-white text-ink-900 shadow-card">
          <Play size={24} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}

export default TikTokFacade;
