# minhhuunguyen.github.io

Personal site & blog of Nguyen Huu Minh — live at <https://minhhuunguyen.github.io>.

Built with **Next.js (Pages Router)** as a fully static site (`output: "export"`)
and deployed to **GitHub Pages**. Blog content lives in separate Git repositories
included here as submodules under `posts/`.

## Tech stack

- Next.js (Pages Router, static export) + React 18 + TypeScript
- MUI (Material UI) + Emotion, Tailwind CSS
- `markdown-it` (+ KaTeX) for rendering posts, sanitized with `isomorphic-dompurify`
- `@tanstack/react-query`, `next-seo`
- Puppeteer for build-time resume PDF generation

## Prerequisites

- Node.js 18+
- Yarn (Classic / v1)

## Getting started

```bash
# 1. Clone with submodules (or run the submodule step below afterwards)
git clone --recurse-submodules https://github.com/MinhHuuNguyen/minhhuunguyen.github.io.git
cd minhhuunguyen.github.io

# 2. Fetch / update the blog content submodules under posts/
git submodule update --init --recursive

# 3. Install dependencies
yarn install

# 4. Run the dev server
yarn dev          # http://localhost:3000
```

The blog pages read markdown from `posts/`. If that folder is empty the build
fails fast with a reminder to run `git submodule update --init --recursive`.

### Blog content submodules

| Submodule | Path |
| --- | --- |
| `ai-lectures` | `posts/ai-lectures` |
| `ai-practice-lectures` | `posts/ai-practice-lectures` |
| `data-engineer-lectures` | `posts/data-engineer-lectures` |
| `blog-sharing` | `posts/blog-sharing` |
| `minhhuunguyen` | `posts/minhhuunguyen` |

To pull the latest content for all submodules:

```bash
git submodule update --remote --merge
```

## Comments (giscus)

Every blog post (Vietnamese and English) ends with a discussion thread powered by
[giscus](https://giscus.app). Comments live in the **Blog comments** category of this
repository's GitHub Discussions, and readers sign in with GitHub to post.

- Config: `src/utils/data/comments.json`. `repoId` and `categoryId` come from giscus.app or
  `gh api graphql`. They are public ids, not secrets. Set `"enabled": false` to hide every thread.
- Thread key: the Vietnamese post's file path under `posts/`
  (e.g. `ai-lectures/1_python_basic/markdown/4-loop.md`). The English page uses the key of its
  Vietnamese source, so both languages share one thread. Editing a title keeps the thread.
  Moving or renaming the file changes the key: add `comments_key: <old path>` to the post's
  frontmatter to keep the old thread. Two posts with the same key stop the build.
- Posts without a thread: list their keys in `exclude` (the GitHub stats page is there).
- Sign-in hand-off: an inline script in `src/pages/_document.tsx` moves the `?giscus=` session
  from the URL into `localStorage` before analytics and ads load, so the token never reaches them.
- "Report an error" opens the issue form `.github/ISSUE_TEMPLATE/bao-loi-bai.yml`, which adds
  the label `báo lỗi bài`. Filter: `is:issue is:open label:"báo lỗi bài"`.
- `giscus.json` (repository root, read from `master`) limits which sites may load the threads.
- Moderation: comments appear at once. On GitHub you can hide, edit or delete a comment, lock a
  discussion, block a user, or turn on temporary interaction limits
  (Settings → Moderation options → Interaction limits). You may rename a discussion title; keep
  the `<!-- sha1: … -->` line in its body, because giscus finds the thread by that hash.

## Environment variables

Create a `.env.local` (git-ignored). All are optional in development:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics measurement ID. When unset, GA scripts are not rendered. |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID` | Google AdSense publisher ID. |

## Scripts

```bash
yarn dev            # start the dev server
yarn build          # static export -> ./out
yarn start          # serve a production build
yarn lint           # eslint (next + @typescript-eslint)
yarn generate:pdf   # render /resume via headless Chromium ->
                    #   public/resume.pdf and public/resume-full.pdf
```

> Run `yarn generate:pdf` and commit the generated PDFs before building if the
> resume changed — the download buttons serve the pre-rendered files.

## Deployment

`yarn build` produces a static site in `out/`, which is published to GitHub Pages.
Ensure submodules are initialized and (if needed) the env vars are set in the CI
environment before building.
