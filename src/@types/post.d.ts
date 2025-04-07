import { is } from "date-fns/locale";

export interface PostList {
  time: string;
  title: string;
  description: string;
  banner_url: string;
  tags: string[];
  slug: string;
  filePath: string;
  isHighlight?: boolean;
}