// ページに載せる内容はすべてこのファイルで管理する。
// 文言を変えるときは、ここを書き換えて push すれば自動で公開される。

/** "YYYY-MM" 形式の年月 */
export type YearMonth = `${number}-${number}`;

/** 線画アイコンの名前（IconSprite.astro の symbol id から "i-" を除いたもの） */
export type LineIcon =
  | 'code' | 'briefcase' | 'star' | 'flag' | 'link' | 'mic' | 'pen' | 'monitor'
  | 'users' | 'coffee' | 'trophy' | 'loop' | 'sparkles' | 'compass' | 'mail'
  | 'copy' | 'check' | 'award' | 'pin' | 'chat' | 'ball' | 'walk' | 'book' | 'game';

/** ロゴ。brandIcons にあるものはロゴ、ないものは頭文字のバッジで表示する */
export interface Brand {
  name: string;
  /** ロゴがないときに表示する頭文字 */
  mono?: string;
}

export const profile = {
  name: 'Haya',
  initials: 'H',
  title: 'フルスタックエンジニア',
  location: '東京都在住',
  bio: 'Webエンジニアとして、主にSaaSの開発に携わっています。要件定義・設計から運用保守までを担当し、現在は新規機能開発のリードとして、開発メンバーのマネジメントも行っています。開発以外では、メンターや採用面接、テックブログの執筆や登壇にも取り組んできました。役者・ナレーター志望から、公的機関での勤務を経て、独学でエンジニアになりました。',
  email: 'haya.earth777.dev@gmail.com',
} as const;

export interface Social extends Brand {
  url: string;
}

export const socials: Social[] = [
  { name: 'GitHub', url: 'https://github.com/Haya-earth777' },
  { name: 'X', url: 'https://x.com/Haya_earth777' },
  { name: 'Zenn', url: 'https://zenn.dev/haya_tech' },
  { name: 'Qiita', url: 'https://qiita.com/Haya_earth777', mono: 'Q' },
  { name: 'note', url: 'https://note.com/97997', mono: 'n' },
];

export type SkillRow =
  | { label: string; kind: 'chips'; items: Brand[] }
  | { label: string; kind: 'tags'; items: string[] }
  | { label: string; kind: 'certs'; items: string[] };

export const skills: SkillRow[] = [
  { label: 'バックエンド', kind: 'chips', items: [{ name: 'Ruby' }, { name: 'Ruby on Rails' }] },
  { label: 'フロントエンド', kind: 'chips', items: [{ name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'React' }, { name: 'Next.js' }, { name: 'Tailwind CSS' }, { name: 'jQuery' }] },
  { label: 'テスト', kind: 'chips', items: [{ name: 'RSpec', mono: 'R' }, { name: 'Vitest' }, { name: 'Playwright', mono: 'P' }, { name: 'Autify', mono: 'A' }] },
  { label: 'インフラ', kind: 'chips', items: [{ name: 'AWS' }] },
  { label: '運用・監視', kind: 'chips', items: [{ name: 'New Relic' }, { name: 'Datadog' }, { name: 'Rollbar', mono: 'R' }] },
  {
    label: 'AIツール', kind: 'chips',
    items: [{ name: 'Cursor', mono: 'C' }, { name: 'Devin', mono: 'D' }, { name: 'Claude Code' }, { name: 'Codex' }, { name: 'CodeRabbit', mono: 'C' }],
  },
  {
    label: '開発ツール', kind: 'chips',
    items: [{ name: 'GitHub' }, { name: 'GitHub Actions' }, { name: 'Docker' }, { name: 'Slack', mono: 'S' }, { name: 'Notion' }, { name: 'Figma' }, { name: 'Jira' }],
  },
  { label: 'マネジメント', kind: 'tags', items: ['タスク・進捗管理', 'スケジュール調整', 'オンボーディング設計', 'メンタリング', '採用面接'] },
  {
    label: '資格', kind: 'certs',
    items: [
      'AWS Certified Solutions Architect – Associate',
      'AWS Certified Cloud Practitioner',
      'Ruby Association Certified Ruby Programmer Silver version 3',
    ],
  },
];

/** 文中の [[16]] のように囲んだ数字は、PC で表示されたときに 0 から数え上げる */
export interface Job {
  id: string;
  company: string;
  /** 年表のバーに出す短い名前 */
  short: string;
  role: string;
  /** 本業か副業か（年表の段と、ラベルの出し分けに使う） */
  track: 'main' | 'side';
  start: YearMonth;
  /** 在籍中なら null */
  end: YearMonth | null;
  /**
   * 年表のバーの終わり。次の本業と同じ月に切り替わったときなど、
   * end と別の月で区切りたいときだけ指定する
   */
  chartEnd?: YearMonth;
  about: string;
  achievements: string[];
  tech: string[];
}

/** 職歴。上から順に表示する */
export const jobs: Job[] = [
  {
    id: 'job-sec',
    company: 'セキュリティ認証SaaS企業',
    short: 'セキュリティ認証SaaS',
    role: 'Webエンジニア（新規機能開発のリード）',
    track: 'main',
    start: '2025-02',
    end: null,
    about: 'ISMS認証の取得・運用を支援するSaaSの自社開発',
    achievements: [
      '2・3名の開発メンバーとともに新規機能開発をリードし、タスクの割り振り・進捗管理・コードレビューを担当',
      'アーカイブ・復元機能や操作履歴機能などを、要件定義からリリースまで一貫して開発',
      '[[16]]万件規模のレコードを扱う処理を改善し、1分半でタイムアウトしていたところを[[5]]秒に短縮',
      'テスト体制を整備したほか、新メンバーのメンターや採用（カジュアル面談・一次面接）も担当',
    ],
    tech: ['Ruby on Rails', 'TypeScript', 'React', 'RSpec', 'Vitest', 'Playwright', 'Datadog', 'Rollbar'],
  },
  {
    id: 'job-soc',
    company: '自社開発・受託開発を行うIT企業',
    short: 'セキュリティサービス',
    role: 'Webエンジニア（業務委託）',
    track: 'side',
    start: '2025-08',
    end: '2026-09',
    about: '大手企業向けセキュリティサービスの開発（フロントエンド中心）',
    achievements: [
      'APIの型定義とクライアントの自動生成を軸に、モックAPIの実装から本番APIとの結合までを主導',
      '検索条件の多い画面を設計・実装し、E2Eテストで主要シナリオを自動化',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Playwright'],
  },
  {
    id: 'job-hr',
    company: 'HRテック企業',
    short: 'HRテック',
    role: 'Webエンジニア（業務委託）',
    track: 'side',
    start: '2025-04',
    end: '2025-06',
    about: 'スキルシートを自動作成するSaaSの機能開発',
    achievements: [
      'RailsのViewで作られていた全18ステップの入力フォームをReactで作り直し、画面遷移も簡略化して入力体験を改善',
      '大型機能3件を契約期間内にリリース',
    ],
    tech: ['Ruby on Rails', 'React'],
  },
  {
    id: 'job-dx',
    company: 'コンサルティング企業',
    short: 'サイト制作',
    role: 'Webエンジニア（業務委託）',
    track: 'side',
    start: '2023-10',
    end: '2024-03',
    about: '企業サイトの立ち上げ',
    achievements: [
      '3名のチームで、実装から公開までを担当',
      '各ページのマークアップ・アニメーションと、問い合わせページのバックエンドを実装',
      'サーバーの設定とセキュリティ対策を行い、契約期間内にリリース',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
  },
  {
    id: 'job-lab',
    company: '研究業界向けSaaS企業',
    short: '研究業界向けSaaS',
    role: 'Webエンジニア',
    track: 'main',
    start: '2023-02',
    end: '2025-02',
    chartEnd: '2025-01',
    about: '研究者向けの購買・在庫管理SaaSのフルスタック開発',
    achievements: [
      '機能追加・UI改善・バグ修正・テスト実装まで一貫して担当',
      'EC2のメモリリーク対応、Lambdaの言語バージョン移行、RDS / Glue / Athenaを使ったデータ抽出など、インフラ・運用の改善',
      'E2Eテストの自動化と、監視体制の整備',
      'ISMS認証の取得に向けて社内のセキュリティ統制を整備し、取得に貢献。資格手当制度も提案',
    ],
    tech: ['Ruby on Rails', 'React', 'AWS', 'Autify', 'New Relic'],
  },
];

/** 年表の範囲（この年の1月から、4年分） */
export const chartStartYear = 2023;
export const chartYears = 4;

export interface Strength {
  icon: LineIcon;
  title: string;
  text: string;
}

export const strengths: Strength[] = [
  { icon: 'loop', title: '実装しながら、開発メンバーをまとめる', text: '自分でも実装を進めながら、開発メンバーへのタスクの割り振りや進捗管理、コードレビューを担当しています。メンバーが詰まったときは一緒に手を動かしてサポートし、期日までに確実にリリースできるよう進めています。' },
  { icon: 'compass', title: 'ユーザーとドメインを理解して作る', text: '要件定義や設計の段階から関わり、ユーザーの使い方や業務の流れを理解したうえで仕様を決めることを大切にしています。セールスやカスタマーサクセスと話し合って顧客の課題を要件に落とし込むほか、ドメイン理解を深める勉強会も主催してきました。' },
  { icon: 'sparkles', title: 'AIや新しい技術を取り入れる', text: 'Claude CodeやCursorなどのAIツールを日々の開発で活用し、生産性を高める工夫を続けています。副業では本業と異なる技術スタックの現場にも参加し、新しい技術を吸収してきました。' },
  { icon: 'users', title: '信頼関係を築き、組織づくりにも関わる', text: '部署を越えた懇親会やCoffee Chatを企画・主催し、職種を問わず話しやすい関係づくりに取り組んでいます。テックブログの運営やテックイベントへの参加の推進、採用面接にも携わり、心理的安全性の高い組織づくりを大切にしています。' },
];

export interface Activity {
  /** 年月（"2026-06"）か年だけ（"2024"）。表示は年ごとにまとめ、新しい順に自動で並ぶ（月は並び順にだけ使う） */
  when: YearMonth | `${number}`;
  kind: { label: string; icon: LineIcon };
  title: string;
  /** 記事やイベントのページ。あれば活動の上の「ピックアップ」にカードで並べる（画像とタイトルはビルド時に取得） */
  url?: string;
  text?: string;
}

const kinds = {
  make: { label: '制作', icon: 'monitor' },
  talk: { label: '登壇', icon: 'mic' },
  write: { label: '執筆', icon: 'pen' },
  interview: { label: '取材', icon: 'chat' },
} as const satisfies Record<string, Activity['kind']>;

export const activities: Activity[] = [
  { when: '2026-10', kind: kinds.make, title: '自己紹介サイトを制作', text: 'Astro・TypeScript・Tailwind CSSで構築し、GitHub ActionsでGitHub Pagesに自動デプロイ。View Transitions APIなど新しいブラウザ機能も活用', url: 'https://haya-earth777.github.io/' },
  { when: '2026-06', kind: kinds.talk, title: 'エンジニア向けの共催イベントに登壇', text: 'AI活用やフルリモートでの働き方について発表', url: 'https://note.com/secure_navi/n/n34f072153f64' },
  { when: '2024', kind: kinds.write, title: 'Qiitaのトレンドランキングで2位', text: 'コミュニケーションをテーマにした記事が[[120]]以上のいいねを獲得', url: 'https://qiita.com/Haya_earth777/items/cbf8a832a31d3c2b29b6' },
  { when: '2025', kind: kinds.interview, title: 'フルリモートで働くエンジニアとしてインタビュー記事に掲載', text: 'フルリモートでの働き方について回答', url: 'https://note.com/dear_ixora4308/n/n39611eac4a98' },
  { when: '2024', kind: kinds.talk, title: 'エンジニアコミュニティのイベントでLT', text: 'Ruby技術者認定試験Silverの取得について発表', url: 'https://progaku.connpass.com/event/325129/' },
  { when: '2022-10', kind: kinds.talk, title: 'エンジニア転職をテーマにした座談会に登壇', text: '未経験からエンジニアに転職した経験を共有', url: 'https://x.com/Haya_earth777/status/1585228761922146305' },
];

export interface Hobby {
  icon: LineIcon;
  title: string;
  text: string;
}

export const hobbies: Hobby[] = [
  { icon: 'ball', title: 'プロ野球観戦', text: '中日ドラゴンズファン歴10年' },
  { icon: 'walk', title: 'ウォーキング', text: '毎日1万歩以上' },
  { icon: 'book', title: '漫画', text: '中学生のころから週刊少年ジャンプを購読' },
  { icon: 'game', title: 'ゲーム', text: '人気のFPSを中心にプレイ' },
];

export interface ContactLink extends Brand {
  url: string;
  sub: string;
}

/** 連絡先のカード（メールは別枠で、先頭に表示） */
export const contactLinks: ContactLink[] = [
  { name: 'X', url: 'https://x.com/Haya_earth777', sub: '@Haya_earth777' },
];
