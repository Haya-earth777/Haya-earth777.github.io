import { chartStartYear, type Job, type YearMonth } from '../data/profile';

/** ビルドした月（"現在" の位置に使う） */
export const nowYM: YearMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}` as YearMonth;
})();

const parse = (ym: YearMonth) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

/** 年表の最大の年数。年表の位置のクラスを global.css で生成している範囲（2023〜2030 年） */
const maxYears = 8;
/** 年表に出す年数。最低 4 年で、年が変わると 1 年ずつ自動で伸びる */
export const chartYears = Math.max(4, parse(nowYM).y - chartStartYear + 1);
if (chartYears > maxYears) {
  throw new Error(`年表は ${maxYears} 年分までです。chartStartYear を進めるか、global.css の @source inline を広げてください`);
}
const totalMonths = chartYears * 12;

/** 年表の 1 か月を 1 列とするグリッドのクラス */
export const gridColsClass = `grid-cols-[repeat(${totalMonths},minmax(0,1fr))]`;

/** 年表の列番号（年表の最初の月を 1 とする） */
const column = (ym: YearMonth) => {
  const { y, m } = parse(ym);
  return (y - chartStartYear) * 12 + m;
};

/** "2025-02" → "2025.02" */
export const formatYM = (ym: YearMonth) => {
  const { y, m } = parse(ym);
  return `${y}.${String(m).padStart(2, '0')}`;
};

/*
 * 年表の位置は、CSP（Content Security Policy）で style 属性を禁止しているため、
 * Tailwind のクラスで指定する（使う可能性のあるクラスは global.css の @source inline で生成済み）。
 */

const endColumn = (job: Job) => column(job.chartEnd ?? job.end ?? nowYM) + 1;

/*
 * 年が増えると年表が詰まり、バーの外に出す名前や年のラベルが重なることがある。
 * 重なるかどうかは、年表がいちばん狭くなるときの幅で見積もる（PC・タブレットは 460px、スマホは 322px）。
 * gap は段の名前（本業・副業）と年表の間の余白で、1 本目のバーの名前はそこまではみ出してよい
 */
const layouts = [
  { width: 460, gap: 14, font: 12 },
  { width: 322, gap: 8, font: 11 },
] as const;
/** 文字の幅の見積もり（全角は 1 文字分、半角は 0.62 文字分） */
const textWidth = (text: string, font: number) => [...text].reduce((w, c) => w + (c.charCodeAt(0) < 128 ? 0.62 : 1), 0) * font;
/** 重なる幅によって、PC でも隠す（'sr-only' / 'invisible'）か、スマホだけ隠すか（'sp:…'）を返す */
const hideWhen = (fits: (layout: (typeof layouts)[number]) => boolean, hidden: string) =>
  !fits(layouts[0]) ? hidden : !fits(layouts[1]) ? `sp:${hidden}` : '';

/**
 * 年表のバーの位置のクラスと、細いバーかどうか（半年以下は、名前をバーの左に出す）。
 * 左に出す名前が直前のバーや段の名前と重なるときは、名前を画面に出さず、
 * カーソルを合わせたときのツールチップと読み上げだけにする（labelHide）
 */
export const barOf = (job: Job, prev?: Job) => {
  const from = column(job.start);
  const to = endColumn(job);
  const tiny = to - from <= 6;
  const space = (l: (typeof layouts)[number]) =>
    prev ? (from - endColumn(prev)) * (l.width / totalMonths) : (from - 1) * (l.width / totalMonths) + l.gap;
  const labelHide = tiny ? hideWhen((l) => textWidth(job.short, l.font) + 8 <= space(l), 'sr-only') : '';
  return { className: `col-start-${from} col-end-${to}`, tiny, labelHide };
};

/** "現在" の月の列。線と点とラベルは、この列の右端に置く */
const nowCol = Math.min(Math.max(column(nowYM), 1), totalMonths);
export const nowColClass = `col-start-${nowCol} col-end-${nowCol + 1}`;

/**
 * 年の区切り（目盛りの線と年のラベル）。それぞれの年の 12 か月分の列に置く。
 * 年のラベルが "現在" のラベルと重なるとき（年が明けてすぐ）は、年のラベルを隠す
 */
export const yearLabels = Array.from({ length: chartYears }, (_, i) => {
  const year = chartStartYear + i;
  const nowLabelHalf = textWidth('現在', 11.5) / 2;
  const fits = (l: (typeof layouts)[number]) =>
    nowCol <= i * 12 || (nowCol - i * 12) * (l.width / totalMonths) >= textWidth(String(year), 11.5) + nowLabelHalf + 4;
  return { year, className: `col-start-${1 + i * 12} col-end-${13 + i * 12}`, labelHide: hideWhen(fits, 'invisible') };
});
