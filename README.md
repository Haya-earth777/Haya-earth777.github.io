# Haya — Portfolio

Haya のポートフォリオサイトです。

https://haya-earth777.github.io/

## 技術スタック

| 用途 | 使っているもの |
| --- | --- |
| フレームワーク | [Astro](https://astro.build/)（静的サイトとして出力） |
| 言語 | TypeScript（strict） |
| スタイル | 素の CSS（CSS 変数でライト／ダークを切り替え） |
| 公開 | GitHub Actions → GitHub Pages |

静的なページなので、JavaScript のフレームワークを使わずに Astro で HTML を書き出しています。ページの動きは `src/scripts/main.ts` の小さなスクリプトだけです。

## 内容の変え方

職歴・スキル・活動などの文言は、すべて `src/data/profile.ts` にまとまっています。ここを書き換えて `main` に push すると、自動でビルドされて公開されます。

- 職歴の年表のバーの位置は、各職歴の `start` / `end` から自動で計算します。
- 在籍中の職歴は `end: null` にすると、「現在」までのバーと「在籍中」のラベルが付きます。
- 「現在」の位置がずれないよう、毎月 1 日にも自動で作り直します。ただし GitHub の仕様で、リポジトリに 60 日間変更がないと、この定期実行は止まります。止まった場合は Actions の画面から再開してください。

アイコン画像を出すときは、`public/avatar.jpg` を置いてください。ない場合は頭文字（H）を表示します。

## ディレクトリ構成

```
src/
  data/profile.ts      ページに載せる内容
  data/icons.ts        サービスや技術のロゴ（Simple Icons, CC0）
  lib/timeline.ts      年表のバーの位置の計算
  components/          各セクションの部品
  layouts/Base.astro   <head> とページ全体の枠
  scripts/main.ts      ページの動き
  styles/global.css    スタイル
public/                画像など（og.png はリンクを共有したときのカード画像）
og/og.html             og.png の元になる HTML
```

## 開発

Node.js 22.12 以上が必要です。

```sh
npm ci
npm run dev      # http://localhost:4321 で確認
npm run build    # 型チェックをしてから dist/ に書き出し
```

## 工夫していること

- **スマホでカクつかないこと**：スクロールに合わせて動く演出（表示アニメーション、進捗バー、追従カーソル）は、マウス操作の PC でだけ動かしています。スマホで動くのは、読み込み時やタップしたときに 1 回だけ動くものに限っています。
- **ライト／ダーク切り替え**：View Transitions API で、ボタンを中心に円が広がるように切り替えます（対応していないブラウザでは、すぐに切り替わります）。
- **「動きを減らす」設定への対応**：OS の設定で動きを減らしている人には、アニメーションを出しません。
- **フォント**：日本語は端末に入っているフォントを使い、Web フォントの読み込みで表示が遅れないようにしています。

## セキュリティ

静的なページなので、サーバーやデータベース、入力フォームはなく、攻撃を受ける入り口はもともと少ない構成です。そのうえで、次の対策をしています。

- **CSP（Content Security Policy）**：Astro の `security.csp` で、ページ内のスクリプトとスタイルのハッシュを含む CSP を `<meta>` で出力しています。許可したもの以外のスクリプトの実行や、外部への通信はできません。そのため、HTML に `style` 属性や `onclick` などのイベント属性は書かず、位置の指定もクラスで行っています。
- **外部リンク**：`rel="noopener noreferrer"` を付け、`Referrer-Policy` も `strict-origin-when-cross-origin` にしています。
- **依存パッケージ**：バージョンを固定し、`package-lock.json` どおりに `npm ci --ignore-scripts` でインストールします（インストール時のスクリプトは実行しません）。Dependabot で毎週、更新と脆弱性を確認し、更新の提案はプルリクエストで型チェックとビルドが通るか自動で確かめます。
- **GitHub Actions**：使うアクションはコミットの SHA で固定し、権限はジョブごとに必要な最小限だけ付けています。チェックアウトした認証情報も残しません。

## GitHub Pages の設定

リポジトリの Settings → Pages の「Build and deployment」で、Source を「GitHub Actions」にしてください。
