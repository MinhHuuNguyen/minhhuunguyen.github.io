export interface INews {
  status: string;
  time: string;
  title: string;
  banner_url: string;
  contents: {
    type: string;
    content: string;
  }[];
}

export interface INewsData {
  [slug: string]: INews;
}
