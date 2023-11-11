export interface INews {
  status?: string;
  time: string;
  title: string;
  slug: string;
  banner_url: string;
  description: string;
  // contents: (IContentText | IContentImage)[];
  author: string;
  tags: string[];
  teams: string[];

  is_highlight?: boolean;
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
