// ページの動き。どれも読み込み時か操作したときだけ動き、スクロール中に動き続けるものは置かない

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// 開いた時点で画面に入っている要素は、紹介文に続けて少しずつずらして出す（読み込み時に 1 回だけ）
const revealTargets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
if (!reduce) {
  revealTargets
    .filter((el) => el.getBoundingClientRect().top < innerHeight)
    .forEach((el, i) => {
      el.style.setProperty('--enter-delay', `${0.75 + i * 0.08}s`);
      el.classList.add('enter');
    });
}

// スクロールで表示（マウス操作の PC のみ）。最初の画面に入っている要素は隠さない
if (!reduce && finePointer && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.remove('pre');
        io.unobserve(en.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add('pre', 'reveal');
      io.observe(el);
    }
  });
}

// 年表のバーを押したら、その職歴までスクロールして軽く光らせる
document.querySelectorAll<HTMLAnchorElement>('.bar').forEach((bar) => {
  bar.addEventListener('click', (e) => {
    const href = bar.getAttribute('href');
    const li = href ? document.querySelector<HTMLElement>(href) : null;
    if (!li) return;
    e.preventDefault();
    li.classList.remove('flash');
    void li.offsetWidth;
    li.classList.add('flash');
    li.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
});

// 追従するカーソル（マウス操作の PC のみ）。マウスが止まったら計算も止める
const cur = document.querySelector<HTMLElement>('.cursor');
if (cur && finePointer && !reduce) {
  let x = 0, y = 0, cx = 0, cy = 0, running = false;
  const loop = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cur.style.transform = `translate(${cx}px, ${cy}px)`;
    if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) requestAnimationFrame(loop);
    else running = false;
  };
  addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    cur.classList.add('on');
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });
  document.addEventListener('mouseleave', () => cur.classList.remove('on'));
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
}

// ライト／ダーク切り替え。対応ブラウザでは View Transitions API でボタンから円形に広がる
const themeBtn = document.getElementById('theme-btn');
const dark = matchMedia('(prefers-color-scheme: dark)');
const current = () => root.dataset.theme || (dark.matches ? 'dark' : 'light');
root.dataset.mode = current();
dark.addEventListener('change', () => {
  if (!root.dataset.theme) root.dataset.mode = current();
});
themeBtn?.addEventListener('click', () => {
  const next = current() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    root.dataset.mode = next;
    themeBtn.classList.remove('spin');
    void themeBtn.offsetWidth;
    themeBtn.classList.add('spin');
  };
  if (!document.startViewTransition || reduce) {
    apply();
    return;
  }
  const r = themeBtn.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document
    .startViewTransition(apply)
    .ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.2,.7,.1,1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
});

// メールアドレスのコピー（カードの右側の表示だけを切り替える）
const copyBtn = document.getElementById('copy-btn');
const email = document.getElementById('email');
const state = document.getElementById('copy-state');
if (copyBtn && email && state) {
  const idle = state.innerHTML;
  copyBtn.addEventListener('click', async () => {
    let label = 'コピーしました';
    try {
      await navigator.clipboard.writeText(email.textContent?.trim() ?? '');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(email);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      label = '選択しました';
    }
    state.innerHTML = `<svg class="ic" aria-hidden="true"><use href="#i-check"/></svg><span>${label}</span>`;
    copyBtn.classList.add('ok');
    setTimeout(() => {
      state.innerHTML = idle;
      copyBtn.classList.remove('ok');
    }, 1800);
  });
}
