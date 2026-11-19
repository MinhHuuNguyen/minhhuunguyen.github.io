import path from "node:path";
import { readAllPosts } from "../src/lib/posts-reader.mjs";
// Rút gọn của readAllPosts (nguồn đọc bài dùng chung với src/utils/posts.ts). Ném lỗi khi hai bài trùng slug.
export function readPosts(root = path.join(process.cwd(), "posts")) {
  return readAllPosts(root, undefined).map(({ filePath, title, slug, time }) => ({ file: filePath, title, slug, time: time ?? null }));
}
