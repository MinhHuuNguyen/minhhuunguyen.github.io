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
