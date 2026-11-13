import { AnchorNav } from "./sections/AnchorNav";
import { Hero } from "./sections/Hero";
import { Pills } from "./sections/Pills";
import { Stats } from "./sections/Stats";
import { Story } from "./sections/Story";
import type { HomeProps } from "./types";

export function HomePage({ counts }: HomeProps) {
  return (
    <>
      <Hero careerYears={counts.careerYears} />
      <AnchorNav />
      <Story />
      <Pills />
      <Stats counts={counts} />
    </>
  );
}
export default HomePage;
