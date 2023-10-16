import { INews } from "@/@types/news";
import newsData from "./data/json/news.json";

export const getNewsBySlug = (slug: string) => {
  const data = newsData as INews[];

  const news = data?.find((item) => item.slug == slug) || null;
  return news;
};

export const getNewsByTags = (title: string, tags: string[]) => {
  const data = newsData as INews[];

  const res = data
    .filter((news) => {
      return (
        tags.some((tag) => news.tags.includes(tag)) && news.title !== title
      );
    })
    .sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  return res;
};

export const getNewsWithoutTags = (title: string, tags: string[]) => {
  const data = newsData as INews[];

  const res = data.filter((news) => {
    return (
      tags.every((tag) => !news.tags.includes(tag)) && news.title !== title
    );
  });

  return res;
};

export const getOtherNewWithoutTags = (tagsAlready: string[]) => {
  const data = newsData as INews[];
  const filteredItems = newsData.filter((news) => {
    return !news.tags.find((tag) => tagsAlready?.includes(tag));
  }) as INews[];
  return filteredItems;
};

export const getHighlightNews = () => {
  const data = newsData as INews[];

  const res = data.find((news) => news?.is_highlight);

  return res;
};

export const getMediumNews = () => {
  const data = newsData as INews[];

  const res = data
    .filter((news) => news?.is_medium)
    .sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  return res;
};

export const getSmallNews = () => {
  const data = newsData as INews[];

  const res = data
    .filter((news) => !news?.is_medium && !news?.is_highlight)
    .sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  return res;
};

export const loadMoreSmallNews = async (
  _cursor?: number,
  _pageSize?: number
) => {
  const cursor = _cursor || 0;
  const pageSize = _pageSize || 6;

  const smallNews = getSmallNews();

  const res = smallNews.slice(cursor, cursor + pageSize);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: res,
    pageKey:
      smallNews?.length > cursor + pageSize ? cursor + pageSize : undefined,
  };
};
export const ellipsisText = (lineClamp = 1) => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: `${lineClamp}`,
    WebkitBoxOrient: "vertical",
  };
};
