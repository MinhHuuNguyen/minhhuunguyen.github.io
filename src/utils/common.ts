import { INewsData } from "@/@types/news";
import newsData from "./data/news.json";

export const getNewsBySlug = (slug: string) => {
  const data = newsData as INewsData;

  const news = data?.[slug] || null;
  return news;
};

export const getNewsByTags = (title: string, tags: string[]) => {
  const data = newsData as INewsData;

  const res = Object.values(data).filter((news) => {
    return tags.some((tag) => news.tags.includes(tag)) && news.title !== title;
  });

  return res;
};

export const getNewsWithoutTags = (title: string, tags: string[]) => {
  const data = newsData as INewsData;

  const res = Object.values(data).filter((news) => {
    return (
      tags.every((tag) => !news.tags.includes(tag)) && news.title !== title
    );
  });

  return res;
};
