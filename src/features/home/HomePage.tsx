import { AnchorNav } from "./sections/AnchorNav";
import { Awards } from "./sections/Awards";
import { CtaBand } from "./sections/CtaBand";
import { FeaturedProjects } from "./sections/FeaturedProjects";
import { Hero } from "./sections/Hero";
import { HomeMarquee } from "./sections/HomeMarquee";
import { Journey } from "./sections/Journey";
import { Pills } from "./sections/Pills";
import { Stack } from "./sections/Stack";
import { Stats } from "./sections/Stats";
import { Story } from "./sections/Story";
import type { HomeProps } from "./types";

export function HomePage({ counts, featured, marquee }: HomeProps) {
  return (
    <>
      <Hero careerYears={counts.careerYears} />
      <AnchorNav />
      <Story />
      <Pills />
      <Stats counts={counts} />
      <Journey />
      <Stack />
      <Awards />
      <FeaturedProjects projects={featured.projects} />
      <CtaBand />
      <HomeMarquee items={marquee} />
    </>
  );
}
export default HomePage;
