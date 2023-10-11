export interface INews {
  status?: string;
  time: string;
  title: string;
  banner_url: string;
  description: string;
  contents: (IContentText | IContentImage)[];
  author: string;
  tags: string[];
}

export interface IContentText {
  type: "text";
  content: string;
}

export interface IContentImage {
  type: "image";
  url: string;
  caption: string;
}

export interface INewsData {
  [slug: string]: INews;
}
