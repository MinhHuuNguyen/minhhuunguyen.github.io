import { VideoLibrary } from "@/features/videos/VideoLibrary";
import { withLocale } from "@/lib/with-locale";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import type { VideoItem } from "@/lib/videos.mjs";

export const getStaticProps = withLocale<{ videos: VideoItem[]; navCounts: { videos: number } }>("vi", async () => ({
  props: withNav({ videos: getSiteData().videos as VideoItem[] }),
}));

export default function VideosRoute({ videos }: { videos: VideoItem[] }) {
  return <VideoLibrary videos={videos} />;
}
