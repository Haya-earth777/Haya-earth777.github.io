// <head> の先頭で同期的に実行する小さなスクリプト（Base.astro がそのまま埋め込む）。
// 動きの準備ができるまで表示用の要素を隠す目印を付ける。main.ts が読み込めなくても、3 秒後には表示する。
// CSP では、この文字列のハッシュを astro.config.mjs で許可している
export const EARLY_SCRIPT =
  "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('ready')},3000);";
