export interface INews {
  time: string;
  title: string;
  slug: string;
  banner_url: string;
  description: string;
  author: string;
  tags: string[];
  teams: string[];

  is_highlight?: boolean;
}
