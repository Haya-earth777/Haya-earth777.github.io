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
 * Tailwind のクラスで指定する（使う可能性のあるクラスは global.css の @source inline で生成済み）。
 */

/** 年表のバーの位置のクラスと、細いバーかどうか */
export const barOf = (job: Job) => {
  const from = column(job.start);
  const to = column(job.chartEnd ?? job.end ?? nowYM) + 1;
  return { className: `col-start-${from} col-end-${to}`, tiny: to - from <= 3 };
};

/** "現在" の位置（%）。Artifact 版と同じく小数第 2 位で切り捨てる */
const nowPercent = (() => {
  const col = Math.min(Math.max(column(nowYM), 1), totalMonths);
  return `${(Math.floor((col / totalMonths) * 10000) / 100).toFixed(2).replace(/\.?0+$/, '')}%`;
})();

/** "現在" の線（疑似要素）とラベルの位置のクラス */
export const nowLineClass = `before:left-[${nowPercent}]`;
export const nowLabelClass = `left-[${nowPercent}]`;

const yearLeft = ['left-0', 'left-1/4', 'left-1/2', 'left-3/4'];

export const yearLabels = Array.from({ length: chartYears }, (_, i) => ({
  year: chartStartYear + i,
  className: yearLeft[i] ?? 'left-0',
}));
