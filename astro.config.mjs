// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { EARLY_SCRIPT } from './src/scripts/early.mjs';

// <head> に直接埋め込むスクリプトは Astro が自動でハッシュを計算しないので、ここで許可する
/** @type {`sha256-${string}`} */
const earlyScriptHash = `sha256-${createHash('sha256').update(EARLY_SCRIPT).digest('base64')}`;

export default defineConfig({
  site: 'https://haya-earth777.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
  // 見た目を Artifact 版と完全に一致させるため、HTML の空白は詰めない
  compressHTML: false,
  build: {
    // CSS をページに埋め込み、読み込みを 1 回減らす
    inlineStylesheets: 'always',
  },
  security: {
    // CSP（Content Security Policy）を <meta> で出力する。
    // Astro がページ内のスクリプトとスタイルのハッシュを計算し、それ以外の実行・読み込みを禁止する
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'none'",
        "img-src 'self'",
        "font-src https://fonts.gstatic.com",
        "connect-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
        "manifest-src 'self'",
      ],
      scriptDirective: {
        hashes: [earlyScriptHash],
      },
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com'],
      },
    },
  },
});
