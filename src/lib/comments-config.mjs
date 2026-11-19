import fs from "node:fs";
import { validateCommentsConfig } from "./comments.mjs";

export const COMMENTS_CONFIG_FILE = "src/utils/data/comments.json";

/** Đọc và kiểm cấu hình bình luận. Chỉ gọi lúc build (getStaticProps, check-out). COMMENTS_CONFIG trỏ tới file khác (e2e dùng fixture). */
export function readCommentsConfig(file = process.env.COMMENTS_CONFIG || COMMENTS_CONFIG_FILE) {
  const { config, errors } = validateCommentsConfig(JSON.parse(fs.readFileSync(file, "utf8")));
  if (!config) throw new Error(`[comments] ${file} sai:\n${errors.join("\n")}`);
  return config;
}
