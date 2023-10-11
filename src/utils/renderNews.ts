import { INewsData } from "@/@types/news";
import newsData from "./data/news.json";

export const getNewsBySlug = (slug: string) => {
  const data = newsData as INewsData;

  const news = data?.[slug] || null;
  return news;
};
