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

// 区切り線を左から引く（マウス操作の PC のみ）。最初の画面にある線は、紹介文のあとに引く
if (!reduce && finePointer && 'IntersectionObserver' in window) {
  let first = true;
  const lio = new IntersectionObserver(
    (entries) => {
      let i = 0;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        el.style.setProperty('--line-delay', `${(first ? 0.7 : 0) + i++ * 0.08}s`);
        el.classList.add('drawn');
        lio.unobserve(el);
      });
      first = false;
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
    const cs = getComputedStyle(el);
    const t = parseFloat(cs.borderTopWidth);
    const b = parseFloat(cs.borderBottomWidth);
    if (t) {
      el.style.setProperty('--bw-t', `${t}px`);
      el.classList.add('draw-t');
    }
    if (b) {
      el.style.setProperty('--bw-b', `${b}px`);
      el.classList.add('draw-b');
    }
    if (t || b) lio.observe(el);
  });
}

// 名前にマウスを乗せると、1 文字ずつ波打つ（マウス操作の PC のみ。せり上がりが終わってから）
const nameEl = document.getElementById('name');
const nameLine = nameEl?.firstElementChild;
if (nameEl && nameLine && finePointer && !reduce) {
  const count = nameLine.children.length;
  let ended = 0;
  nameLine.addEventListener('animationend', (e) => {
    const name = (e as AnimationEvent).animationName;
    if (name === 'rise' && ++ended === count) nameLine.classList.add('done');
    if (name === 'wave' && e.target === nameLine.lastElementChild?.firstElementChild) nameEl.classList.remove('wave');
  });
  for (const letter of nameLine.children) {
    letter.addEventListener('mouseenter', () => {
      if (nameLine.classList.contains('done')) nameEl.classList.add('wave');
    });
  }
}

// 活動のカードの横スクロール。ボタンで 1 枚ずつ送り、マウスではドラッグでも動かせる（指では普通にスワイプ）
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((wrap) => {
  const track = wrap.querySelector<HTMLElement>('[data-track]');
  const prev = wrap.querySelector<HTMLButtonElement>('[data-prev]');
  const next = wrap.querySelector<HTMLButtonElement>('[data-next]');
  if (!track || !prev || !next) return;
  const step = () => {
    const card = track.firstElementChild as HTMLElement | null;
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0') : 260;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= max;
    wrap.classList.toggle('at-end', track.scrollLeft >= max);
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  if (!finePointer) return;
  let startX = 0, startLeft = 0, moved = false, down = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true;
    moved = false;
    startX = e.clientX;
    startLeft = track.scrollLeft;
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      track.classList.add('dragging');
    }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    if (!moved) return;
    // スナップを戻してから、いちばん近いカードに合わせる
    const left = track.scrollLeft;
    track.classList.remove('dragging');
    track.scrollLeft = left;
    track.scrollTo({ left: Math.round(left / step()) * step(), behavior: reduce ? 'auto' : 'smooth' });
  });
  // ドラッグした後のクリックでリンクが開かないようにする
  track.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      moved = false;
    }
  }, true);
});

// 職歴の行と年表のバーを連動させる（マウス操作の PC のみ）。片方に乗せると、もう片方の対応するものが目立つ
const chartEl = document.querySelector<HTMLElement>('.bar')?.closest<HTMLElement>('[role="img"]');
if (chartEl && finePointer) {
  const pairs = [...document.querySelectorAll<HTMLAnchorElement>('.bar')].flatMap((bar) => {
    const row = document.querySelector<HTMLElement>(bar.getAttribute('href') ?? '');
    return row ? [{ bar, row }] : [];
  });
  pairs.forEach(({ bar, row }) => {
    const on = () => {
      chartEl.classList.add('dim');
      bar.classList.add('on');
      row.classList.add('hl');
    };
    const off = () => {
      chartEl.classList.remove('dim');
      bar.classList.remove('on');
      row.classList.remove('hl');
    };
    [bar, row].forEach((el) => {
      el.addEventListener('mouseenter', on);
      el.addEventListener('mouseleave', off);
    });
  });
}

// カードの光の位置をカーソルに合わせる（マウス操作の PC のみ）
if (finePointer) {
  document.querySelectorAll<HTMLElement>('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// 成果の数字を、表示されたときに 0 から数え上げる（マウス操作の PC のみ。開いた時点で見えている数字はそのまま）
if (!reduce && finePointer && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        cio.unobserve(el);
        const to = Number(el.dataset.count);
        const start = performance.now();
        const tick = (t: number) => {
          const k = Math.min((t - start) / 1200, 1);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  document.querySelectorAll<HTMLElement>('.count').forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.style.display = 'inline-block';
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    el.style.textAlign = 'right';
    el.textContent = '0';
    cio.observe(el);
  });
}

// ボタンが少しだけカーソルに吸い寄せられる（マウス操作の PC のみ）
// ボタンが動くと境目で出入りを繰り返すので、出入りではなく「ボタンの中心からの距離」で判断する
if (finePointer && !reduce) {
  const magnets = [...document.querySelectorAll<HTMLElement>('[data-magnet]')].map((el) => ({ el, tx: 0, ty: 0, x: 0, y: 0, raf: 0 }));
  const loop = (m: (typeof magnets)[number]) => {
    m.x += (m.tx - m.x) * 0.2;
    m.y += (m.ty - m.y) * 0.2;
    if (Math.abs(m.tx - m.x) + Math.abs(m.ty - m.y) > 0.05) {
      m.el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
      m.raf = requestAnimationFrame(() => loop(m));
    } else {
      m.raf = 0;
      m.el.style.translate = m.tx || m.ty ? `${m.tx.toFixed(2)}px ${m.ty.toFixed(2)}px` : '';
    }
  };
  addEventListener('pointermove', (e) => {
    magnets.forEach((m) => {
      const r = m.el.getBoundingClientRect();
      // いまずれている分を引いて、本来の中心を求める
      const dx = e.clientX - (r.left - m.x + r.width / 2);
      const dy = e.clientY - (r.top - m.y + r.height / 2);
      const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + 12;
      const tx = near ? dx * 0.3 : 0;
      const ty = near ? dy * 0.3 : 0;
      if (tx === m.tx && ty === m.ty) return;
      m.tx = tx;
      m.ty = ty;
      if (!m.raf) m.raf = requestAnimationFrame(() => loop(m));
    });
  }, { passive: true });
}

// ページの先頭へ戻るボタン（なめらかにスクロールする）
document.querySelectorAll<HTMLAnchorElement>('[data-totop]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
});

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
// ブラウザの上部の色も、ページのテーマに合わせる
const themeColors = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
const setMode = (mode: string) => {
  root.dataset.mode = mode;
  if (root.dataset.theme) themeColors.forEach((m) => (m.content = mode === 'dark' ? '#121311' : '#f7f6f2'));
};
setMode(current());
dark.addEventListener('change', () => {
  if (!root.dataset.theme) setMode(current());
});
themeBtn?.addEventListener('click', () => {
  const next = current() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    setMode(next);
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
