import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execSync } from "node:child_process";

const BANNED = ["@mui/", "@emotion/", "react-slick", "slick-carousel", "flowbite", "font-awesome", "fa-brands", "react-query", "react-alice-carousel", "mui-nested-menu", "fuse.js"];
const DEPS = ["@emotion/react", "@emotion/styled", "@mdx-js/loader", "@mdx-js/react", "@mui/icons-material", "@mui/lab", "@mui/material", "@next/mdx", "@tanstack/react-query", "@types/mdx", "@vercel/analytics", "@vercel/speed-insights", "mui-nested-menu", "react-alice-carousel", "react-grid-gallery", "react-intersection-observer", "react-responsive-masonry", "react-scroll-to-top", "react-slick", "@types/react-responsive-masonry", "@types/react-slick", "fuse.js", "date-fns"];

test("src/ không còn import hay class của thư viện cũ", () => {
  for (const b of BANNED) {
    const hit = execSync(`grep -rl --include=*.ts --include=*.tsx --include=*.js --include=*.mjs --include=*.css -- "${b}" src || true`, { encoding: "utf8" }).trim();
    assert.equal(hit, "", `còn "${b}" trong: ${hit}`);
  }
});

test("package.json không còn thư viện cũ", () => {
  const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const all = { ...p.dependencies, ...p.devDependencies };
  for (const d of DEPS) assert.ok(!(d in all), `còn ${d}`);
});
