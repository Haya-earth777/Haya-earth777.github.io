// ページに載せる内容はすべてこのファイルで管理する。
// 文言を変えるときは、ここを書き換えて push すれば自動で公開される。

/** "YYYY-MM" 形式の年月 */
export type YearMonth = `${number}-${number}`;

/** 線画アイコンの名前（IconSprite.astro の symbol id から "i-" を除いたもの） */
export type LineIcon =
  | 'code' | 'briefcase' | 'star' | 'flag' | 'link' | 'mic' | 'pen' | 'monitor'
  | 'users' | 'coffee' | 'trophy' | 'loop' | 'sparkles' | 'compass' | 'mail'
  | 'copy' | 'check' | 'award' | 'pin';

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
  status: 'カジュアル面談歓迎',
  bio: 'Web エンジニアとして、SaaS の開発をしています。要件を決めるところからリリース後の運用まで担当していて、今はチームのリードとして計画や進行管理も見ています。開発以外では、メンターや採用面接、テックブログや登壇にも関わってきました。役者・ナレーターを目指していた時期と公法人での勤務を経て、独学でエンジニアになりました。',
  email: 'haya.earth777.dev@gmail.com',
} as const;

export interface Social extends Brand {
  url: string;
}

export const socials: Social[] = [
  { name: 'GitHub', url: 'https://github.com/Haya-earth777' },
  { name: 'X', url: 'https://x.com/Haya_earth777' },
  { name: 'Zenn', url: 'https://zenn.dev/haya_tech' },
  { name: 'Qiita', url: 'https://qiita.com/Nine-777', mono: 'Q' },
  { name: 'note', url: 'https://note.com/97997', mono: 'n' },
];

export type SkillRow =
  | { label: string; kind: 'chips'; items: Brand[] }
  | { label: string; kind: 'text'; text: string }
  | { label: string; kind: 'certs'; items: string[] };

export const skills: SkillRow[] = [
  { label: '言語', kind: 'chips', items: [{ name: 'Ruby' }, { name: 'TypeScript' }] },
  { label: 'フレームワーク', kind: 'chips', items: [{ name: 'Ruby on Rails' }, { name: 'React' }, { name: 'Next.js' }] },
  { label: 'テスト', kind: 'chips', items: [{ name: 'RSpec', mono: 'R' }, { name: 'Vitest' }, { name: 'Playwright', mono: 'P' }] },
  { label: 'インフラ', kind: 'chips', items: [{ name: 'AWS' }] },
  { label: '運用・監視', kind: 'chips', items: [{ name: 'New Relic' }, { name: 'Datadog' }, { name: 'Rollbar', mono: 'R' }] },
  {
    label: 'AI ツール', kind: 'chips',
    items: [{ name: 'Cursor', mono: 'C' }, { name: 'Devin', mono: 'D' }, { name: 'Claude Code' }, { name: 'Codex' }, { name: 'CodeRabbit', mono: 'C' }],
  },
  { label: 'マネジメント', kind: 'text', text: '開発ロードマップの設計、タスクの割り振り・進捗管理、スケジュール調整、オンボーディング設計、メンタリング、採用面接' },
  {
    label: '資格', kind: 'certs',
    items: [
      'AWS Certified Solutions Architect – Associate',
      'AWS Certified Cloud Practitioner',
      'Ruby Association Certified Ruby Programmer Silver version 3',
    ],
  },
];

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
    company: 'セキュリティ SaaS 企業',
    short: 'セキュリティ SaaS',
    role: 'ソフトウェアエンジニア（新規機能開発チームのリード）',
    track: 'main',
    start: '2025-02',
    end: null,
    about: 'ISMS 認証の取得・運用を支援する SaaS の自社開発',
    achievements: [
      'チームのリードとして、ロードマップ設計・タスクの割り振り・スケジュール調整を担当。アーカイブ・復元、操作履歴などの機能を要件定義からリリースまで手がける',
      '16万件規模のデータで起きていた処理の遅延を改善',
      'テストと監視体制の整備に加え、新メンバーのメンターや採用面接も担当',
    ],
    tech: ['Ruby on Rails', 'TypeScript', 'React'],
  },
  {
    id: 'job-soc',
    company: 'セキュリティサービス開発会社',
    short: 'セキュリティ開発',
    role: '業務委託エンジニア',
    track: 'side',
    start: '2025-08',
    end: '2026-09',
    about: '大手企業向けセキュリティサービスの開発。フロントエンドを中心に担当',
    achievements: [
      'API の型とクライアントの自動生成を軸に、モックから本番 API へのつなぎ込みまでを主導',
      '検索条件の多い画面の設計・実装と、E2E テストの自動化',
    ],
    tech: ['Next.js', 'TypeScript'],
  },
  {
    id: 'job-hr',
    company: 'HR 系 SaaS 企業',
    short: 'HR 系 SaaS',
    role: '業務委託エンジニア',
    track: 'side',
    start: '2025-04',
    end: '2025-06',
    about: '転職エージェント企業の、スキルシート作成 SaaS の機能開発',
    achievements: [
      '18 ステップある入力フォームを React で作り直し、入力しやすく改善',
      '大型機能 3 件を契約期間内にリリース',
    ],
    tech: ['Ruby on Rails', 'React'],
  },
  {
    id: 'job-lab',
    company: '研究業界向け SaaS 企業',
    short: '研究業界向け SaaS',
    role: 'ソフトウェアエンジニア',
    track: 'main',
    start: '2023-02',
    end: '2025-02',
    chartEnd: '2025-01',
    about: '研究者向けの購買・在庫管理 SaaS のフルスタック開発',
    achievements: [
      'EC2 のメモリリーク対応、E2E テストの自動化、監視の整備など、インフラ・運用を改善',
      '機能追加・UI 改善・バグ修正・テストまで一通り担当',
      'ISMS 認証に向けたセキュリティ整備や、資格手当制度の提案',
    ],
    tech: ['Ruby on Rails', 'React', 'AWS'],
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
  { icon: 'loop', title: '手を動かしながら、チームを回す', text: '実装は自分でしつつ、チームのリードとして計画づくりや進行管理もしています。' },
  { icon: 'sparkles', title: 'AI ツールを日常的に使う', text: 'Claude Code や Cursor などを毎日の開発で使い、生産性を上げる工夫を続けています。副業では、本業と違う技術スタックの現場にも入ってきました。' },
  { icon: 'users', title: '職種をまたいで話を進める', text: 'セールスやカスタマーサクセスと話しながら要件をまとめるのが得意です。社内では雑談の場づくりにも関わってきました。' },
  { icon: 'compass', title: '開発の外の仕事も拾う', text: 'セキュリティ統制の整備や資格手当制度の提案、採用面接など、開発以外で必要なことにも手を出してきました。' },
];

export interface Activity {
  /** 年月が分かるものは YearMonth、分からないものは「継続中」などの表示文字 */
  when: YearMonth | string;
  kind: { label: string; icon: LineIcon };
  title: string;
  text?: string;
}

const kinds = {
  make: { label: '制作', icon: 'monitor' },
  talk: { label: '登壇', icon: 'mic' },
  write: { label: '執筆', icon: 'pen' },
  host: { label: '主催', icon: 'users' },
  team: { label: 'チーム', icon: 'coffee' },
} as const satisfies Record<string, Activity['kind']>;

export const activities: Activity[] = [
  { when: '2026-10', kind: kinds.make, title: 'このポートフォリオサイトを制作', text: 'Astro と TypeScript で作成し、GitHub Actions で GitHub Pages に自動公開。View Transitions API などの新しいブラウザ機能も取り入れています' },
  { when: '副業', kind: kinds.make, title: 'ベンチャー企業のホームページを立ち上げ', text: '副業として、企業サイトの立ち上げを担当' },
  { when: '2026-06', kind: kinds.talk, title: 'エンジニア向けの共催イベントに登壇' },
  { when: '実績', kind: kinds.write, title: 'Qiita のトレンドで 2 位を獲得', text: '技術記事が 120 以上のいいねを集め、トレンドランキングで 2 位に' },
  { when: '継続中', kind: kinds.write, title: 'テックブログ・技術記事の執筆', text: '勤務先のテックブログ、Zenn、Speaker Deck などで発信' },
  { when: '継続中', kind: kinds.talk, title: 'LT 会・座談会・協賛イベントでの登壇', text: '採用広報も兼ねて、社外のイベントで登壇' },
  { when: '継続中', kind: kinds.host, title: 'ユーザーインタビュー・顧客理解の勉強会を主催', text: 'チーム全体でドメインと顧客への理解を深める取り組み' },
  { when: '継続中', kind: kinds.team, title: '雑談の場「Coffee Chat」を導入', text: 'チームの心理的安全性を高めるための取り組み' },
];

export interface ContactLink extends Brand {
  url: string;
  sub: string;
}

/** 連絡先のカード（メールは別枠で、先頭に表示） */
export const contactLinks: ContactLink[] = [
  { name: 'X', url: 'https://x.com/Haya_earth777', sub: '@Haya_earth777' },
];
