// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

import { readPosts } from "./scripts/site-posts.mjs";

const STATIC = !!process.env.E2E_STATIC;
// Slug tính từ chính bài viết (cùng công thức với site); bài đổi tiêu đề thì test tự theo.
const posts = readPosts();
const slugOf = (suffix: string) => {
  const p = posts.find((x) => x.file.endsWith(suffix));
  if (!p) throw new Error(`e2e: không tìm thấy bài ${suffix}`);
  return p.slug;
};
Object.assign(process.env, {
  E2E_SLUG_YT: slugOf("data-engineer-lectures/5_databricks/2-architecture.md"),
  E2E_SLUG_LONG: slugOf("ai-lectures/4_deep_learning/markdown/5-transfer-weakly-semi-un-self-supervised-learning.md"),
  E2E_SLUG_SHORT: slugOf("blog-sharing/1_pixta_seminar/10_llm_instruction_finetuning/llm_instruction_finetuning.md"),
  E2E_SLUG_STATS: slugOf("ai-lectures/11_math/markdown/5-statistics.md"),
  E2E_SLUG_OD: slugOf("ai-lectures/5_computer_vision/markdown/4-object-detection.md"),
  E2E_SLUG_LESSON: slugOf("ai-lectures/1_python_basic/markdown/4-loop.md"),
  E2E_PATH_PYTHON: slugOf("ai-lectures/0_series/markdown/1-python-basic.md").replace(/^series-/, ""),
});

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:4173", trace: "retain-on-failure", locale: "vi-VN" },
  projects: [{ name: STATIC ? "static" : "dev", use: { ...devices["Desktop Chrome"] }, grepInvert: STATIC ? /@dev/ : /@static/ }],
  webServer: process.env.BASE_URL ? undefined : {
    command: STATIC ? "yarn serve:out" : "yarn dev -p 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: STATIC ? {} : {
      POSTS_EXTRA_ROOT: "test/fixtures/posts", POSTS_EN_EXTRA_ROOT: "test/fixtures/posts-en", PROJECTS_EXTRA_ROOT: "test/fixtures/projects",
      NEXT_PUBLIC_ADS_MODE: "placeholder", NEXT_PUBLIC_CHAT_MODE: "coming-soon", NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: "",
      COMMENTS_CONFIG: "test/fixtures/comments.json",
    },
  },
});
