import fs from "node:fs";
import { parseArgs } from "node:util";
import { readAllPosts } from "../src/lib/posts-reader.mjs";
import { buildPaths, buildEnPaths } from "../src/lib/learn.mjs";
import { readEnPosts } from "../src/lib/posts-en-reader.mjs";
import { validateManualVideos, collectVideos } from "../src/lib/videos.mjs";
import { readProjects, resumeEngineeringProjects } from "../src/lib/projects.mjs";
import { fetchVideoMeta } from "./fetch-video-meta.mjs";
import { writeSitemap } from "./generate-sitemap.mjs";
import { writeSearchIndex } from "./build-search-index.mjs";

const { values: args } = parseArgs({
  options: {
    offline: { type: "boolean", default: false },
    "posts-root": { type: "string", default: "posts" },
    "public-dir": { type: "string", default: "public" },
    "generated-dir": { type: "string", default: "src/generated" },
    "projects-root": { type: "string", default: "src/content/projects" },
  },
});
const offline = args.offline || process.env.VIDEO_META_FETCH !== "1";
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const posts = readAllPosts(args["posts-root"]);

const manualFile = validateManualVideos(readJson("src/utils/data/videos.json"));
const manualExtra = process.env.VIDEOS_EXTRA ? validateManualVideos(readJson(process.env.VIDEOS_EXTRA)) : { items: [], errors: [] };
const videoErrors = [...manualFile.errors, ...manualExtra.errors];
if (videoErrors.length) {
  console.error("[videos.json]");
  for (const e of videoErrors) console.error(`  ${e}`);
  process.exit(1);
}
const manual = [...manualFile.items, ...manualExtra.items];

const tiktoks = collectVideos(posts, manual, {})
  .filter((v) => v.platform === "tiktok")
  .map((v) => ({ key: v.key, id: v.id, url: v.url }));
const meta = await fetchVideoMeta(tiktoks, { publicDir: args["public-dir"], generatedDir: args["generated-dir"], offline });

const paths = buildPaths(posts);
const enRoots = ["posts-en", ...(process.env.POSTS_EN_EXTRA_ROOT ? [process.env.POSTS_EN_EXTRA_ROOT] : [])];
const { enPosts, pairs, errors: enErrors } = readEnPosts(enRoots, posts);
if (enErrors.length) {
  console.error("[posts-en]");
  for (const e of enErrors) console.error(`  ${e}`);
  process.exit(1);
}
const videos = collectVideos(posts, manual, meta);
const resume = readJson("src/utils/data/resume.json");
const resumeNames = resumeEngineeringProjects(resume).map((p) => p.projectName);
const roots = [args["projects-root"], ...(process.env.PROJECTS_EXTRA_ROOT ? [process.env.PROJECTS_EXTRA_ROOT] : [])];
const projects = [], projectErrors = [];
for (const r of roots) {
  const res = readProjects(r, { resumeProjectNames: resumeNames, publicDir: args["public-dir"] });
  projects.push(...res.projects);
  projectErrors.push(...res.errors);
}
if (projectErrors.length) {
  console.error("[projects]");
  for (const e of projectErrors) console.error(`  ${e}`);
  process.exit(1);
}

writeSitemap({ posts, paths, videos, projects, enPosts }, args["public-dir"]);

const bi = (vi, en) => ({ vi, en });
const resumeText = [
  ...resume.experience.flatMap((e) => [e.title, e.company, ...(e.projects ?? []).map((p) => p.projectName ?? p.name ?? "")]),
  ...resume.award.map((a) => (typeof a === "string" ? a : a.name ?? a.title ?? "")),
].filter(Boolean).join(" ");
const pages = [
  { url: "/", title: bi("Trang chủ", "Home"), text: "Nguyễn Hữu Minh AI Engineer giảng viên trang chủ" },
  { url: "/resume", title: bi("Hồ sơ", "Resume"), text: resumeText },
  { url: "/learn", title: bi("Lộ trình học", "Learning paths"), text: "Lộ trình học trí tuệ nhân tạo học máy Python learning paths" },
  { url: "/videos", title: bi("Kho video", "Videos"), text: "Kho video YouTube Shorts TikTok" },
  { url: "/projects", title: bi("Dự án", "Projects"), text: "Dự án case study projects" },
  { url: "/ask", title: bi("Hỏi đáp", "Ask"), text: "Hỏi đáp trợ lý chat ask" },
];
const buildId = process.env.GITHUB_SHA ?? String(Date.now());
writeSearchIndex({ posts, paths, videos, projects, pages }, args["public-dir"], buildId);
// Chỉ mục EN: bài đã dịch thay bản VI; bài chưa dịch giữ nguyên (không mất kết quả khi tìm bằng tiếng Anh).
writeSearchIndex(
  { posts: [...enPosts, ...posts.filter((p) => !pairs.viToEn[p.slug])], paths: buildEnPaths(paths, enPosts, pairs), videos, projects, pages },
  args["public-dir"], buildId, "search-index.en.json",
);
