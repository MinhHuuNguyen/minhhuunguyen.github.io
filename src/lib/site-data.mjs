import fs from "node:fs";
import { readAllPosts } from "./posts-reader.mjs";
import { buildPaths, buildEnPaths } from "./learn.mjs";
import { readEnPosts } from "./posts-en-reader.mjs";
import { validateManualVideos, collectVideos } from "./videos.mjs";
import { readProjects, featuredProjects, resumeEngineeringProjects } from "./projects.mjs";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const byTimeDesc = (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime();
let cache = null;

export function getSiteData(opts = {}) {
  const key = JSON.stringify(opts);
  if (cache?.key === key) return cache.data;
  const site = readJson("src/utils/data/site.json");
  const resume = readJson("src/utils/data/resume.json");
  const posts = readAllPosts(opts.postsRoot ?? "posts");
  const meta = fs.existsSync("src/generated/video-meta.json") ? readJson("src/generated/video-meta.json") : {};
  const manual = [
    ...validateManualVideos(readJson("src/utils/data/videos.json")).items,
    ...(process.env.VIDEOS_EXTRA ? validateManualVideos(readJson(process.env.VIDEOS_EXTRA)).items : []),
  ];
  const resumeProjects = resumeEngineeringProjects(resume);
  const roots = [opts.projectsRoot ?? "src/content/projects", ...(process.env.PROJECTS_EXTRA_ROOT ? [process.env.PROJECTS_EXTRA_ROOT] : [])];
  const projects = roots.flatMap((r) => readProjects(r, { resumeProjectNames: resumeProjects.map((p) => p.projectName), publicDir: "public" }).projects);
  const paths = buildPaths(posts);
  const enRoots = ["posts-en", ...(process.env.POSTS_EN_EXTRA_ROOT ? [process.env.POSTS_EN_EXTRA_ROOT] : [])];
  const { enPosts, pairs, errors: enErrors } = readEnPosts(enRoots, posts);
  if (enErrors.length) throw new Error(`[posts-en]\n${enErrors.join("\n")}`);
  const enPaths = buildEnPaths(paths, enPosts, pairs);
  const videos = collectVideos(posts, manual, meta);
  const today = opts.today ? new Date(`${opts.today}T00:00:00Z`) : new Date();
  const [y, m] = site.person.careerStart.split("-").map(Number);
  const careerYears = Math.floor((today.getUTCFullYear() * 12 + today.getUTCMonth() - (y * 12 + (m - 1))) / 12);
  const summary = ({ content, filePath, video, ...rest }) => ({ ...rest, filePath: "", hasVideo: !!video });
  const data = {
    postsSummary: posts.map(summary),
    postBySlug: (slug) => posts.find((p) => p.slug === slug) ?? null,
    postPairs: pairs,
    en: { posts: enPosts, pairs, paths: enPaths, stale: enPosts.filter((p) => p.stale).map((p) => p.slug) },
    paths, videos, projects, resume, resumeProjects,
    counts: {
      posts: posts.length, paths: paths.length, videos: videos.length, engineeringProjects: resumeProjects.length,
      courses: resume.experience.filter((e) => /lecturer/i.test(e.title)).flatMap((e) => e.projects).length,
      awards: resume.award.length, careerYears,
    },
    featured: {
      posts: posts.filter((p) => p.isHighlight && !(p.tags ?? []).includes("series")).sort(byTimeDesc).slice(0, 3).map(summary),
      paths: site.featuredPaths.map((s) => paths.find((p) => p.slug === s)).filter(Boolean).slice(0, 3),
      projects: featuredProjects(projects, resumeProjects, site.featuredProjectsFallback, 4),
    },
  };
  cache = { key, data };
  return data;
}
export const withNav = (props) => ({ ...props, navCounts: { videos: getSiteData().counts.videos } });
