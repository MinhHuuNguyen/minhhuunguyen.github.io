# Translation Plan — Chuẩn hoá hard-code string + Song ngữ toàn site (VI + EN)

> Checklist theo dõi tiến độ. Tick `[x]` khi xong từng mục. Code **từng phần nhỏ**, chờ duyệt + commit rồi mới đi tiếp.

## Context

Site `minhhuunguyen.github.io` — Next.js 13.4.5 **Pages Router**, `output: "export"` (static, deploy GitHub Pages).

- Chuỗi UI hard-code rải rác trong JSX (VI lẫn EN), không có nguồn tập trung.
- Nội dung tĩnh trong 4 file JSON (`header/footer/home_banner/resume.json`) chỉ một ngôn ngữ.
- Blog: 151 file markdown (~250.000 từ) trong 5 git submodule dưới `posts/`, đọc build-time bằng `getPostsList()`.
- Chưa có i18n. Nút `LanguageIcon` đã có ở `Header.tsx` nhưng chưa làm gì.

**Mục tiêu:** gom chuỗi hard-code về nguồn tập trung; song ngữ VI ⇄ EN cho UI, navigation, resume, và toàn bộ blog; mặc định Tiếng Việt, lưu `localStorage`.

**Quyết định đã chốt:**
- Cơ chế UI: React Context tự viết (không thư viện). Built-in i18n của Next không tương thích `output: "export"`.
- Mặc định: Tiếng Việt.
- Bản dịch blog lưu trong 1 repo mới `posts-en` (gộp), add làm submodule tại `posts-en/`, mirror toàn bộ cấu trúc `posts/`. Không sửa 5 submodule nguồn.
- Slug EN tính từ title tiếng Anh mới (khác slug VI). Ghép cặp VI↔EN qua khoá `source_slug` trong frontmatter bản EN.
- Dịch bằng script tự động với provider pluggable; commit bản EN ngay sau commit bump submodule nguồn.

---

## PHASE 0 — Foundation i18n (BẮT BUỘC trước) — THẤP (~2-4h)

- [ ] `src/libs/i18n/types.ts`: `type Locale = "vi" | "en"`; kiểu cho dictionary.
- [ ] `src/libs/i18n/locales/vi.ts` + `en.ts`: từ điển UI key-value phẳng theo namespace.
- [ ] `src/libs/i18n/I18nContext.tsx`: `I18nProvider` + hook `useI18n()` → `{ locale, setLocale, t }`, đọc/ghi `localStorage["locale"]`, fallback `"vi"`, hydration-safe.
- [ ] Bọc `<I18nProvider>` trong cây provider tại `_app.tsx`.
- [ ] Thay nút `LanguageIcon` chết → nút toggle gọi `setLocale`, hiển thị "VI"/"EN" tại `Header.tsx`.
- [ ] `<Html lang>` động + inline script set `document.documentElement.lang` tại `_document.tsx`.

## PHASE 1 — Chuẩn hoá chuỗi UI hard-code — THẤP-TB (~3-5h)

- [ ] Điền `vi.ts`/`en.ts` và thay literal → `t(...)`:
  - [ ] `resume/index.tsx` (Professional Experience, Education & Certifications, Language, Additional Experience, Award, Project Detail, Overall:, Techstack:, year/years/month/months).
  - [ ] `404.tsx` ("Trang tìm kiếm không tồn tại", "Quay lại trang chủ").
  - [ ] `blog/index.tsx` ("Bài viết của tôi", "CÁC SERIES BÀI VIẾT", "DANH SÁCH BÀI VIẾT").
  - [ ] `ResumeComponent/index.tsx` ("Xem thêm").
  - [ ] `CardNews.tsx` ("Đọc tiếp").
  - [ ] `ListNews/index.tsx` ("MY BLOG").
- [ ] `footer.json` `title2` + `optionFooter[].text` → key i18n trong `Footer.tsx`.

## PHASE 2 — Song ngữ navigation + resume — TB (~4-7h + biên dịch ~80 chuỗi)

- [ ] `header.json`: nhãn cố định → key i18n; 8 tên series blog → `{ vi, en }`; resolve theo locale ở `Header.tsx`, `Menu/index.tsx`, `SideMenuSection/index.tsx`. Cập nhật type `MenuType`; dọn `@ts-nocheck`.
- [ ] `resume.json`: tách `resume.vi.json` / `resume.en.json`. Biên dịch toàn bộ field text. **Cần duyệt bản dịch.**
- [ ] Consumer resume chọn theo locale: `resume/index.tsx`, `ResumeComponent/index.tsx`, logic tạo PDF (`Menu/index.tsx`) xuất đúng locale.
- [ ] Type chặt cho `resume.json` ở `src/@types/` (thay `any`).

## PHASE 3 — Hạ tầng blog song ngữ (build + routing) — CAO (~1-2 ngày)

- [ ] Tạo repo `posts-en`, add submodule tại `posts-en/` (cập nhật `.gitmodules`); mirror cấu trúc `posts/`.
- [ ] `getPostsList()` → `getPostsList(locale)`: `en` đọc `posts-en/`, fallback `posts/`. Slug EN từ title EN; bản EN lưu `source_slug`; build map ghép cặp 2 chiều `viSlug ↔ enSlug`.
- [ ] Error-handling + bỏ magic path `endsWith('posts/minhhuunguyen/README.md')` (AUDIT.md M5).
- [ ] Route EN: `src/pages/en/blog/index.tsx` + `[id].tsx`, tái dùng component dùng chung.
- [ ] Toggle trên trang blog: `router.push` URL đối ứng qua map `source_slug`; thiếu EN → fallback VI.
- [ ] (Tuỳ chọn) `<link rel="alternate" hreflang>`.

## PHASE 4 — Script dịch tự động (provider pluggable) + đồng bộ submodule — CAO (~1-2 ngày)

- [ ] `scripts/providers/index.mjs`: interface `translate({ text, glossary }) -> text` + chọn qua env `TRANSLATE_PROVIDER`. Stub + adapter mẫu, không khoá SDK.
- [ ] `scripts/translate-file.mjs`: dịch 1 `.md` → mirror trong `posts-en/`. Dịch `title`/`description`, giữ `time/banner_url/tags/is_highlight/is_published`, inject `source_slug`. Không dịch code/KaTeX/URL; chunk theo heading; glossary.
- [ ] `scripts/translate-all.mjs`: duyệt toàn bộ `posts/**/*.md` (bỏ README), idempotent.
- [ ] `scripts/translate-changed.mjs <submodule>`: diff `--name-only` lọc `*.md` → chỉ dịch file đã đổi.
- [ ] `scripts/update-submodule.sh <name>`: bump submodule nguồn → commit → translate-changed → commit trong `posts-en` + bump pointer ngay sau.
- [ ] (Tuỳ chọn) Git hook `post-commit` / GitHub Action.
- [ ] `package.json` scripts: `i18n:translate-all`, `i18n:sync`.
- [ ] README: tài liệu quy trình + env.

## PHASE 5 — Dịch lần đầu + rà soát — rất CAO về thời gian

- [ ] Chọn & cấu hình provider dịch.
- [ ] Chạy `i18n:translate-all` → sinh 151 file EN.
- [ ] Rà soát chất lượng, chỉnh glossary, dịch lại nếu cần.
- [ ] Commit trong `posts-en` + bump pointer ở repo chính.

---

## Verification

1. `yarn build` pass, không warning TS mới; `out/` có `index.html` (VI) và `en/blog/*.html` (EN) markup đầy đủ.
2. `yarn dev`: toggle Header đổi UI/nav/resume tức thì; reload giữ ngôn ngữ; xoá localStorage → mặc định VI. Trang blog toggle → điều hướng `/en/blog/[slug]`; thiếu EN → fallback VI.
3. Grep: không còn literal chuỗi hiển thị trong JSX.
4. PDF resume đúng ngôn ngữ đang chọn.
5. Script: sửa thử 1 file trong submodule nguồn → `i18n:sync` tạo lại đúng 1 file EN, commit + bump pointer; code/KaTeX/URL giữ nguyên; `source_slug` đúng.
6. `<html lang>` đổi theo locale; cặp URL có `hreflang` (nếu làm).

---

## Tiến độ commit (log từng phần nhỏ)

- [ ] Part 1: i18n core library (`types.ts`, `locales/vi.ts`, `locales/en.ts`, `I18nContext.tsx`) — chưa wiring.
