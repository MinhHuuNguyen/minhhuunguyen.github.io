import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import MiniSearch from "minisearch";
import { buildSearchDocs, buildSuggestions, miniSearchOptions, SEARCH_INDEX_MAX_BYTES } from "../src/lib/search.mjs";

export function writeSearchIndex(data, publicDir, buildId, fileName = "search-index.json") {
  const docs = buildSearchDocs(data);
  const ms = new MiniSearch(miniSearchOptions());
  ms.addAll(docs);
  const json = JSON.stringify({ version: 1, builtAt: new Date().toISOString(), buildId, index: ms.toJSON(), suggestions: buildSuggestions(data) });
  const bytes = Buffer.byteLength(json);
  if (bytes > SEARCH_INDEX_MAX_BYTES) throw new Error(`[search] chỉ mục ${bytes} B vượt ngân sách ${SEARCH_INDEX_MAX_BYTES} B`);
  const file = path.join(publicDir, fileName);
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(file, json);
  const count = (type) => docs.filter((d) => d.type === type).length;
  const kb = (n) => Math.round(n / 1024);
  console.log(`[search] ${docs.length} docs (${count("post")} bài, ${count("path")} lộ trình, ${count("video")} video, ${count("project")} dự án, ${count("page")} trang), ${kb(bytes)} KB raw, ${kb(zlib.gzipSync(json).length)} KB gzip -> ${file}`);
}
