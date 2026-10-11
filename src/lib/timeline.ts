import { chartStartYear, chartYears, type Job, type YearMonth } from '../data/profile';

const totalMonths = chartYears * 12;

/** ビルドした月（"現在" の位置に使う） */
export const nowYM: YearMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}` as YearMonth;
})();

const parse = (ym: YearMonth) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

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
 * global.css にあらかじめ用意したクラス（cs-* / ce-* / at-* / yl-*）で指定する。
 */

/** 年表のバーの位置のクラスと、細いバーかどうか */
export const barOf = (job: Job) => {
  const from = column(job.start);
  const to = column(job.chartEnd ?? job.end ?? nowYM) + 1;
  return { className: `cs-${from} ce-${to}`, tiny: to - from <= 3 };
};

/** "現在" の線とラベルの位置のクラス */
export const nowClass = `at-${Math.min(Math.max(column(nowYM), 1), totalMonths)}`;

export const yearLabels = Array.from({ length: chartYears }, (_, i) => ({
  year: chartStartYear + i,
  className: `yl-${i}`,
}));
