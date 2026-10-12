// 活動のリンク先から OGP（タイトルと画像）を取得し、サイト内に保存する（ビルドの前に実行する）
// - 画像は public/og/ に保存して自分のサイトから配信する（見る人のブラウザから外部サイトへは通信しない）
// - 取得に失敗してもビルドは止めない。その項目は画像なしのカードになる
// 使い方: node scripts/fetch-og.mjs [URL ...]（URL を省くと profile.ts の活動から集める）
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const IMAGE_DIR = 'public/og';
const DATA_FILE = 'src/data/og.json';
const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 10_000;
// SVG はスクリプトを含められるので受け付けない
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const HEADERS = { 'user-agent': 'Mozilla/5.0 (compatible; OGP fetcher for haya-earth777.github.io)' };

const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|#39|apos);/gi, (m, e) => {
    const k = e.toLowerCase();
    if (k.startsWith('#x')) return String.fromCodePoint(parseInt(k.slice(2), 16));
    if (k.startsWith('#')) return String.fromCodePoint(Number(k.slice(1)));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[k] ?? m;
  });

/** <meta property="og:xxx" content="..."> を、属性の順番によらず取り出す */
const metaContent = (html, key) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1];
    const content = tag.match(/\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i);
    if (name?.toLowerCase() === key && content) return decode(content[1] ?? content[2]).trim();
  }
  return undefined;
};

const get = async (url) => {
  if (!/^https?:$/.test(new URL(url).protocol)) throw new Error(`unsupported URL: ${url}`);
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) throw new Error(`too large: ${url}`);
  return { res, buf };
};

const fetchOne = async (url) => {
  const { buf: htmlBuf } = await get(url);
  const html = htmlBuf.toString('utf8');
  const entry = {};
  const title = metaContent(html, 'og:title');
  if (title) entry.title = title.slice(0, 200);
  const image = metaContent(html, 'og:image');
  if (image) {
    try {
      const { res, buf } = await get(new URL(image, url).href);
      const ext = IMAGE_TYPES[(res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()];
      if (!ext) throw new Error(`not an allowed image type: ${image}`);
      const file = `${createHash('sha256').update(url).digest('hex').slice(0, 16)}.${ext}`;
      await writeFile(`${IMAGE_DIR}/${file}`, buf);
      entry.image = `og/${file}`;
    } catch (e) {
      console.warn(`[og] 画像を取得できませんでした: ${e.message}`);
    }
  }
  return entry;
};

const urls = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (await import('../src/data/profile.ts')).activities.flatMap((a) => (a.url ? [a.url] : []));

await rm(IMAGE_DIR, { recursive: true, force: true });
await mkdir(IMAGE_DIR, { recursive: true });
const data = {};
for (const url of urls) {
  try {
    data[url] = await fetchOne(url);
    console.log(`[og] ${url} → ${data[url].image ? '画像あり' : '画像なし'}`);
  } catch (e) {
    console.warn(`[og] 取得できませんでした: ${e.message}`);
  }
}
await writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`);
