#!/usr/bin/env bash
# Build có bài fixture, kiểm K3/K4 bằng test của site VÀ bằng chính check_page của publish_pipeline, rồi build lại bản sạch.
set -euo pipefail
POSTS_EXTRA_ROOT=test/fixtures/posts yarn build
CONTRACT_OUT=out node --test scripts/contract.test.mjs
( cd ../agent-video-editor/publish_pipeline && uv run python -c "
from publish.platforms.website import check_page
p, t = check_page(open('../../minhhuunguyen.github.io-redesign/out/blog/contract-fixture-video-post.html', encoding='utf-8').read(), 'AbCdEfGhIjK')
print('check_page problems:', p, 'types:', t); assert p == [], p" )
yarn build
node scripts/print-slugs.mjs | diff - "$TMPDIR/slugs.before.json" && echo "K1 slugs: không đổi"
