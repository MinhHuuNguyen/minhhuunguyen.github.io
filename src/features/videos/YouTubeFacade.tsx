import { useState } from "react";
import { Play } from "lucide-react";
import clsx from "clsx";

type Props = {
  embedUrl: string;
  title: string;
  thumbnail: string | null;
  playLabel: string;
  describedBy: string;
  vertical?: boolean;
  onPlay: () => void;
};

/** Ảnh bìa + nút ▶; chỉ nạp iframe YouTube khi người xem bấm. */
export function YouTubeFacade({ embedUrl, title, thumbnail, playLabel, describedBy, vertical, onPlay }: Props) {
  const [playing, setPlaying] = useState(false);
  const frame = clsx("relative w-full overflow-hidden rounded-xl bg-ink-900", vertical ? "aspect-[9/16]" : "aspect-video");
  if (playing) {
    return (
      <div className={frame}>
        <iframe
          src={`${embedUrl}?autoplay=1&enablejsapi=1`}
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
      {thumbnail && <img src={thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
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

export default YouTubeFacade;
