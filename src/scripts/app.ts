import { EN, EN_RULES } from '../i18n/en';
import { LOGOS } from '../data/logos';
import { jobs } from '../data/jobs';
import { projects, type Project } from '../data/projects';

/* Interações do portfólio: scroll, túnel, terminal, temas, idioma etc. */
(function(){
  const root = document.documentElement;
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const set = (k: string, v: number | string) => root.style.setProperty(k, (+v).toFixed(4));
  /* ---------- idioma (translate / PT | EN) ---------- */
  const LANG = window.RB_LANG || 'pt';
  const T = (s: string): string => {
    if (LANG !== 'en' || typeof s !== 'string') return s;
    const k = s.trim();
    if (Object.prototype.hasOwnProperty.call(EN, k)) return s.replace(k, () => EN[k]);
    let o = s; for (const [a, b] of EN_RULES) o = o.split(a).join(b); return o;
  };
  window.RB_T = T;
  const setLang = (l: 'pt' | 'en') => { try { localStorage.setItem('rb-lang', l); sessionStorage.setItem('rb-scroll', String(window.scrollY)); } catch (e) {} location.reload(); };
  window.RB_setLang = setLang;
  const setMode = (m: 'light' | 'dark') => {
    root.classList.toggle('light', m === 'light');
    try { localStorage.setItem('rb-mode', m); } catch (e) {}
    document.querySelectorAll<HTMLElement>('[data-mode]').forEach((b) => b.setAttribute('aria-label', T(m === 'light' ? 'Mudar para o tema escuro' : 'Mudar para o tema claro')));
  };
  window.RB_setMode = setMode;
  document.querySelectorAll<HTMLElement>('[data-mode]').forEach((b) => b.addEventListener('click', () => setMode(root.classList.contains('light') ? 'dark' : 'light')));
  setMode(root.classList.contains('light') ? 'light' : 'dark');
  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((b) => {
    b.textContent = LANG === 'en' ? 'PT' : 'EN';
    b.setAttribute('aria-label', LANG === 'en' ? 'Ver em português' : 'View in English');
    b.addEventListener('click', () => setLang(LANG === 'en' ? 'pt' : 'en'));
  });

  /* ---------- conteúdo ---------- */
  const phrase = [
    ['Eu construo interfaces onde', 'var(--text)'], ['cada detalhe', 'var(--cyan)'], ['tem um motivo: o', 'var(--text)'],
    ['movimento', 'var(--mag)'], ['guia, a', 'var(--text)'], ['performance', 'var(--lime)'],
    ['sustenta e o código fica fácil de evoluir.', 'var(--text)']
  ];
  const words: [string, string][] = [];
  phrase.forEach(([t, c]) => T(t).split(' ').forEach((w) => words.push([w, c])));
  const K = words.length + 2;
  const ph = $('phrase');
  ph.innerHTML = words.map(([w, c], i) =>
    '<span style="color:' + c + ';opacity:clamp(.12, calc(var(--s) * ' + K + ' - ' + i + '), 1);transform:translateY(calc(clamp(0, ' + (i + 1) + ' - var(--s) * ' + K + ', 1) * 32px))">' + w + '</span>'
  ).join(' ');

  const nWork = jobs.filter((j) => !j.edu).length;
  $('jobs').innerHTML = '<span class="tl-fill" aria-hidden="true"></span><span class="tl-head" aria-hidden="true"></span>' + jobs.map((j, i) =>
    '<li class="tl-item" style="--c:' + j.c + '">' +
      '<span class="tl-dot" aria-hidden="true"></span>' +
      '<div class="tl-date"><span>' + j.when + '</span>' + (j.now || j.badge ? '<span class="tl-now"><i aria-hidden="true"></i>' + (j.badge || 'atual') + '</span>' : '') + '</div>' +
      '<div class="tl-card"><span class="num" aria-hidden="true">' + (j.edu ? '' : '0' + (nWork - i)) + '</span>' +
      (j.logos ? '<div class="tl-logos" aria-hidden="true">' + j.logos.map((k) => '<span class="lg lg-' + k + '">' + LOGOS[k] + '</span>').join('<i class="lg-x">×</i>') + '</div>' : '') +
        '<h3' + (j.logos ? ' class="sr-only"' : '') + '>' + j.co + '</h3><p class="role">' + j.role + '</p><p class="desc">' + j.desc + '</p>' +
        '<div class="chips">' + j.tags.map((t) => '<span>' + t + '</span>').join('') + '</div>' +
        (j.did ? '<details class="tl-mods tl-did"><summary>ver o que eu entreguei</summary><ol>' + j.did.map((m) => '<li>' + m + '</li>').join('') + '</ol></details>' : '') +
      '</div></li>'
  ).join('');
  (function(){
    const firstEdu = document.querySelectorAll<HTMLElement>('#jobs .tl-item')[jobs.findIndex((j) => j.edu)];
    if (firstEdu) firstEdu.insertAdjacentHTML('beforebegin', '<li class="tl-sep"><span class="tl-sep-mark" aria-hidden="true"></span><p class="tl-sep-k">// formação</p><h3 class="tl-sep-t">Formação acadêmica</h3></li>');
  })();
  (function(){
    const list = $('jobs'), items = [...list.querySelectorAll<HTMLElement>('.tl-item')];
    let raf = 0;
    const upd = () => {
      raf = 0;
      const r = list.getBoundingClientRect(), line = innerHeight * 0.62;
      const fillPx = reduce ? r.height : Math.max(0, Math.min(r.height, line - r.top));
      list.style.setProperty('--tl', (fillPx / Math.max(1, r.height)).toFixed(4));
      list.style.setProperty('--tlpx', fillPx.toFixed(1) + 'px');
      list.style.setProperty('--tlo', fillPx > 2 && fillPx < r.height - 2 ? '1' : '0');
      items.forEach((it) => { const dot = it.offsetTop + 16; it.classList.toggle('on', reduce || fillPx >= dot); });
    };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    upd();
  })();

  const D = '#0A0B14';
  const covers: Record<Project['cover'], string> = {
    phone: '<svg class="cover" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="' + D + '" stroke-width="3" stroke-linecap="round"><rect x="150" y="26" width="100" height="208" rx="18" fill="rgba(10,11,20,.12)"/><path d="M185 38h30"/><rect x="164" y="56" width="72" height="34" rx="8" fill="rgba(10,11,20,.2)"/><path d="M164 106h56M164 120h40"/><rect x="164" y="136" width="32" height="32" rx="8"/><rect x="204" y="136" width="32" height="32" rx="8"/><rect x="164" y="176" width="32" height="32" rx="8"/><rect x="204" y="176" width="32" height="32" rx="8" fill="rgba(10,11,20,.2)"/></g><g fill="none" stroke="' + D + '" stroke-width="2" opacity=".45"><rect x="62" y="70" width="58" height="22" rx="11"/><rect x="62" y="104" width="58" height="22" rx="4"/><circle cx="91" cy="160" r="16"/><rect x="282" y="74" width="54" height="54" rx="10"/><path d="M282 146h54M282 160h36"/></g></svg>',
    chart: '<svg class="cover" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="' + D + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="56" y="34" width="288" height="192" rx="12" fill="rgba(10,11,20,.12)"/><path d="M56 60h288"/><circle cx="74" cy="47" r="3"/><circle cx="86" cy="47" r="3"/><circle cx="98" cy="47" r="3"/><path d="M76 84h70M76 98h44"/><path d="M80 196 L130 168 L170 178 L214 132 L254 146 L320 96" stroke-width="4"/><path d="M80 196 L130 168 L170 178 L214 132 L254 146 L320 96 L320 206 L80 206Z" fill="rgba(10,11,20,.14)" stroke="none"/><path d="M76 206h248" opacity=".5"/><circle cx="320" cy="96" r="6" fill="' + D + '"/></g></svg>',
    flow: '<svg class="cover" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="' + D + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="70" cy="130" r="24" fill="rgba(10,11,20,.2)"/><circle cx="160" cy="80" r="20"/><circle cx="160" cy="180" r="20"/><circle cx="250" cy="130" r="22" fill="rgba(10,11,20,.12)"/><circle cx="336" cy="130" r="24" fill="rgba(10,11,20,.2)"/><path d="M92 120 L140 88M92 140 L140 172M180 86 L230 120M180 174 L230 140M272 130 H310"/><path d="M302 122 L312 130 L302 138"/><path d="M60 130h20M70 120v20" stroke-width="3.5"/><path d="M326 130 l7 7 l13 -14" stroke-width="3.5"/></g></svg>',
    mail: '<svg class="cover" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="' + D + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="108" y="56" width="184" height="124" rx="10" fill="rgba(10,11,20,.14)"/><path d="M108 66 L200 132 L292 66"/><g opacity=".5"><rect x="70" y="96" width="120" height="80" rx="8" transform="rotate(-10 130 136)"/><rect x="214" y="104" width="120" height="80" rx="8" transform="rotate(9 274 144)"/></g><path d="M140 206h120M160 222h80" opacity=".6"/></g></svg>'
  };
  const projColors = projects.map((p) => p.color);
  const defs = $('filters');
  defs.innerHTML = projColors.map((_, i) =>
    '<filter id="warp' + i + '" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="' + (i + 3) + '" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>'
  ).join('');
  $('track').innerHTML = projects.map((p, i) => {
    const n = '0' + (i + 1);
    return '<article class="card" data-i="' + i + '" style="--c:' + p.color + '"><div class="card-in">' +
      '<div class="face front">' +
        '<div class="media"><div class="img" style="background-color:' + p.color + ';filter:url(#warp' + i + ')">' + covers[p.cover] + '</div>' +
        '<span class="n">' + n + '</span>' + (p.badge ? '<span class="badge"><i aria-hidden="true"></i>' + p.badge + '</span>' : '') + '</div>' +
        '<div class="body"><h3>' + p.title + '</h3><p class="meta">' + p.meta + '</p><p>' + p.summary + '</p>' +
        '<div class="chips">' + p.tags.map((t) => '<span>' + t + '</span>').join('') + '</div>' +
        '<button class="flip case-btn" type="button" aria-label="Ver estudo de caso: ' + p.title + '">ver estudo de caso →</button></div>' +
      '</div>' +
      '<div class="face back" inert>' +
        '<div class="back-bar"><i style="background:#FF2E88"></i><i style="background:#B6F43C"></i><i style="background:#22D3EE"></i><span>' + p.file + '</span>' +
        '<button class="flip" type="button" aria-label="Voltar para a frente: ' + p.title + '">↺</button></div>' +
        '<div class="case" tabindex="0" aria-label="Estudo de caso: ' + p.title + '">' +
          '<section><h4>// DESAFIO</h4><p>' + p.challenge + '</p></section>' +
          '<section><h4>// O QUE EU FIZ</h4><ul>' + p.did.map((d) => '<li>' + d + '</li>').join('') + '</ul></section>' +
          '<section><h4>// RESULTADO</h4><p>' + p.result + '</p></section>' +
        '</div>' +
      '</div>' +
    '</div></article>';
  }).join('');
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    const front = card.querySelector<HTMLElement>('.front')!, back = card.querySelector<HTMLElement>('.back')!;
    card.querySelectorAll<HTMLElement>('.flip').forEach((btn) => btn.addEventListener('click', () => {
      const on = card.classList.toggle('flipped');
      front.inert = on; back.inert = !on;
      setTimeout(() => (on ? back : front).querySelector<HTMLElement>('.flip')!.focus({ preventScroll: true }), reduce ? 0 : 400);
    }));
  });



  /* letras do contato */
  (function(){
    const words = [['Vamos', 'var(--text)'], ['criar', 'var(--text)'], ['\n'], ['algo', 'var(--text)'], ['juntos', 'var(--cyan)'], ['?', 'var(--text)']].map(([w, c]) => [w === '\n' ? w : T(w), c]);
    let html = '', first = true;
    words.forEach(([w, c]) => {
      if (w === '\n') { html += '<br>'; first = true; return; }
      if (!first && w !== '?') html += '<span class="ch sp"> </span>';
      first = false;
      for (const ch of w) html += '<span class="ch" style="color:' + c + '">' + ch + '</span>';
    });
    document.querySelector<HTMLElement>('#arena .letters')!.innerHTML = html;
  })();

  /* ---------- distorção dos cards ---------- */
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    const disp = defs.querySelector<HTMLElement>('#warp' + card.dataset.i + ' feDisplacementMap')!;
    let cur = 0, target = 0, raf = 0;
    const tick = () => {
      cur += (target - cur) * 0.12;
      disp.setAttribute('scale', cur.toFixed(2));
      if (Math.abs(target - cur) > 0.1) raf = requestAnimationFrame(tick); else { disp.setAttribute('scale', String(target)); raf = 0; }
    };
    const go = (v: number) => { if (reduce) return; target = v; if (!raf) raf = requestAnimationFrame(tick); };
    card.addEventListener('mouseenter', () => go(46));
    card.addEventListener('mouseleave', () => go(0));
  });

  /* ---------- nav, menu, blueprint, topo ---------- */
  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  document.querySelectorAll<HTMLElement>('[data-top]').forEach((b) => b.addEventListener('click', toTop));
  const bpBtns = document.querySelectorAll<HTMLElement>('[data-bp]');
  const toggleBp = () => {
    const on = body.classList.toggle('bp');
    bpBtns.forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      const sp = b.querySelector<HTMLElement>('span')!; if (sp) sp.textContent = on ? 'sair do blueprint' : 'ver como foi construído';
    });
    if (body.classList.contains('menu-open')) body.classList.remove('menu-open');
    return on;
  };
  bpBtns.forEach((b) => b.addEventListener('click', toggleBp));
  /* segredos */
  const secrets = $('secrets'), secBtn = document.querySelector<HTMLElement>('.secrets-btn')!;
  const setSecrets = (open: boolean) => { secrets.classList.toggle('open', open); secBtn.setAttribute('aria-expanded', String(open)); };
  secBtn.addEventListener('click', (e) => { e.stopPropagation(); setSecrets(!secrets.classList.contains('open')); });
  document.addEventListener('click', (e) => { if (secrets.classList.contains('open') && !(e.target as Element).closest('.secrets')) setSecrets(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && secrets.classList.contains('open')) { setSecrets(false); secBtn.focus(); } });
  const menu = document.querySelector<HTMLElement>('.menu')!;
  let menuOpener: HTMLElement | null = null;
  const closeMenu = () => { body.classList.remove('menu-open'); if (menuOpener) { menuOpener.setAttribute('aria-expanded', 'false'); menuOpener.focus(); } };
  document.querySelectorAll<HTMLElement>('.menu-btn').forEach((b) => b.addEventListener('click', () => { menuOpener = b; body.classList.add('menu-open'); b.setAttribute('aria-expanded', 'true'); menu.querySelector<HTMLElement>('a')!.focus(); }));
  menu.querySelector<HTMLElement>('.menu-close')!.addEventListener('click', closeMenu);
  menu.querySelectorAll<HTMLElement>('a').forEach((a) => a.addEventListener('click', () => body.classList.remove('menu-open')));
  menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- cursor + botão magnético ---------- */
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cursor = document.querySelector<HTMLElement>('.cursor')!;
  const magnet = document.querySelector<HTMLElement>('.magnet')!;
  if (fine && !reduce) {
    let cx = 0, cy = 0, tx = 0, ty = 0, craf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      craf = (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY; cursor.classList.add('on');
      if (!craf) craf = requestAnimationFrame(loop);
      if (!magnet) return;
      const r = magnet.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      magnet.style.transform = d < 220 ? 'translate(' + dx * 0.3 + 'px,' + dy * 0.3 + 'px)' : '';
    }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('on'));
    document.querySelectorAll<HTMLElement>('a, button, .card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
  }

  /* ---------- motor de scroll ---------- */
  const hero = $('topo'), sobre = $('sobre'), exp = $('experiencia'), proj = $('projetos'), contato = $('contato');
  const track = $('track');
  let wide = window.innerWidth > 900;
  let navOn = false, endOn = false, sraf = 0;
  const measure = () => {
    wide = window.innerWidth > 900;
    root.style.setProperty('--track-shift', Math.min(0, window.innerWidth - track.scrollWidth) + 'px');
  };
  const update = () => {
    sraf = 0;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const g = clamp(window.scrollY / Math.max(1, max));
    set('--g', g);
    const hr = hero.getBoundingClientRect();
    const h = clamp(-hr.top / hr.height);
    set('--h', h);

    const nOn = hr.bottom < 80, eOn = g > 0.97;
    if (nOn !== navOn) { navOn = nOn; body.classList.toggle('nav-on', navOn); }
    if (eOn !== endOn) { endOn = eOn; body.classList.toggle('end-on', endOn); }
    if (reduce) { set('--s', 1); set('--e', 1); set('--c', 1); }
    else {
      const s = sobre.getBoundingClientRect(); set('--s', clamp((vh * 0.85 - s.top) / (s.height * 0.75)));
      const e = exp.getBoundingClientRect(); set('--e', wide ? clamp((vh * 0.85 - e.top) / (e.height * 0.7)) : 1);
      const c = contato.getBoundingClientRect(); set('--c', clamp((vh - c.top) / (vh * 0.7)));
    }
    { const p = proj.getBoundingClientRect(); set('--x', clamp(-p.top / Math.max(1, p.height - vh))); }
  };
  const schedule = () => { if (!sraf) sraf = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measure(); schedule(); }, { passive: true });
  if (document.fonts) document.fonts.ready.then(() => { measure(); schedule(); });
  measure(); update();

  /* ---------- hero: partículas em camadas ---------- */
  const colors = ['#FF2E88', '#22D3EE', '#B6F43C'];
  const speed = [140, 300, 480], drift = [10, 22, 40];
  let html = '';
  for (let i = 0; i < 60; i++) {
    const L = i % 3, x = (i * 37 + 11) % 100, y = (i * 53 + 7) % 100;
    const sz = [3, 5, 9][L] + (i % 2), c = colors[(i * 5) % 3], o = [0.35, 0.6, 0.9][L];
    html += '<span class="o" style="left:' + x + '%;top:' + y + '%;transform:translate3d(calc(var(--mx, 0) * ' + drift[L] + 'px), calc(var(--h) * -' + speed[L] + 'px + var(--my, 0) * ' + drift[L] + 'px), 0)">' +
      '<span class="d" style="width:' + sz + 'px;height:' + sz + 'px;background:' + c + ';opacity:' + o + ';box-shadow:0 0 ' + (sz * 3) + 'px ' + c + ';animation-delay:-' + (i % 6) + 's"></span></span>';
  }
  $('dots').innerHTML = html;
  if (!reduce && fine) {
    const m = { tx: 0, ty: 0, x: 0, y: 0 };
    let mraf = 0;
    const mloop = () => {
      m.x += (m.tx - m.x) * 0.08; m.y += (m.ty - m.y) * 0.08;
      set('--mx', m.x); set('--my', m.y);
      mraf = (Math.abs(m.tx - m.x) + Math.abs(m.ty - m.y) > 0.002) ? requestAnimationFrame(mloop) : 0;
    };
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      m.tx = (e.clientX - r.left) / r.width * 2 - 1;
      m.ty = (e.clientY - r.top) / r.height * 2 - 1;
      if (!mraf) mraf = requestAnimationFrame(mloop);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { m.tx = 0; m.ty = 0; if (!mraf) mraf = requestAnimationFrame(mloop); });
  }




  /* ---------- abertura blueprint ---------- */
  const intro = (function(){
    const boot = document.querySelector<HTMLElement>('.boot')!;
    const svg = boot.querySelector<HTMLElement>('.boot-svg')!, log = boot.querySelector<HTMLElement>('.boot-log')!, count = boot.querySelector<HTMLElement>('.boot-count')!;
    const skip = boot.querySelector<HTMLElement>('.boot-skip')!;
    const NS = 'http://www.w3.org/2000/svg';
    const parts = [
      ['.top .logo', 'logo'], ['.top .links', 'nav'], ['.top .bp-toggle', 'button'], ['.top .menu-btn', 'button'],
      ['.hero .tag', 'p.tag'], ['.hero h1 .l1', 'h1'], ['.hero h1 .l2', 'h1'], ['.hero .lead', 'p.lead'],
      ['.hero-ctas .btn-primary', 'a.btn'], ['.hero-ctas .btn-ghost', 'a.btn']
    ];
    const steps = ([[0, 'inicializando grid'], [22, 'desenhando wireframe'], [52, 'aplicando tipografia'], [78, 'carregando movimento'], [100, 'render()']] as [number, string][]).map(([v, m]): [number, string] => [v, T(m)]);
    let raf = 0, timers: number[] = [], running = false;
    const el = (tag: string, attrs: Record<string, string | number>) => { const n = document.createElementNS(NS, tag) as SVGElement; for (const k in attrs) n.setAttribute(k, String(attrs[k])); return n; };
    const build = () => {
      svg.innerHTML = '';
      const W = innerWidth, H = innerHeight;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      let i = 0;
      parts.forEach(([sel, name]) => {
        const node = document.querySelector<HTMLElement>(sel)!; if (!node) return;
        const r = node.getBoundingClientRect(); if (r.width < 2 || r.bottom < 0 || r.top > H) return;
        const d = (0.12 + i * 0.11) + 's';
        if (name === 'h1') {
          [r.top, r.bottom].forEach((y) => { const l = el('line', { x1: 0, x2: W, y1: y, y2: y, class: 'g' }); l.style.setProperty('--d', d); svg.appendChild(l); });
          const v = el('line', { x1: r.left, x2: r.left, y1: 0, y2: H, class: 'g' }); v.style.setProperty('--d', d); svg.appendChild(v);
        }
        const rect = el('rect', { x: r.left, y: r.top, width: r.width, height: r.height, rx: name === 'a.btn' || name === 'button' ? r.height / 2 : 2, class: 'w' });
        rect.style.setProperty('--len', String(Math.ceil(2 * (r.width + r.height))));
        rect.style.setProperty('--d', d);
        svg.appendChild(rect);
        const right = r.left + 150 > W;
        const t = el('text', { x: right ? r.right : r.left, y: Math.max(12, r.top - 7), 'text-anchor': right ? 'end' : 'start' });
        t.textContent = name + ' · ' + Math.round(r.width) + '×' + Math.round(r.height);
        t.style.setProperty('--d', d);
        svg.appendChild(t);
        i++;
      });
    };
    const finish = () => {
      if (!running) return; running = false;
      cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = [];
      boot.classList.add('out');
      timers.push(setTimeout(() => { root.classList.remove('intro'); boot.classList.remove('out', 'render'); }, 900));
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    const run = () => {
      if (running) return; running = true;
      window.scrollTo(0, 0);
      root.classList.add('intro');
      boot.classList.remove('out', 'render');
      build();
      document.addEventListener('keydown', onKey);
      const t0 = performance.now(), DUR = 1900;
      const loop = (now: number) => {
        const p = Math.min(1, (now - t0) / DUR);
        const e = 1 - Math.pow(1 - p, 2.2);
        const n = Math.round(e * 100);
        count.firstChild!.nodeValue = String(n);
        let msg = steps[0][1]; steps.forEach(([v, m]) => { if (n >= v) msg = m; });
        log.innerHTML = '&gt; ' + msg + (n >= 100 ? ' <b>✓</b>' : '<b>_</b>');
        if (p < 1) raf = requestAnimationFrame(loop);
        else {
          timers.push(setTimeout(() => boot.classList.add('render'), 120));
          timers.push(setTimeout(finish, 720));
        }
      };
      raf = requestAnimationFrame(loop);
    };
    skip.addEventListener('click', finish);
    if (root.classList.contains('intro')) {
      let started = false;
      const go = () => { if (!started) { started = true; run(); } };
      if (document.fonts) document.fonts.ready.then(go);
      setTimeout(go, 1200);
    }
    return { replay: () => { if (!reduce) run(); } };
  })();

  /* ---------- scroll elástico ---------- */
  if (!reduce) {
    let lastY = window.scrollY, cur = 0, vel = 0, target = 0, eraf = 0, idle = 0;
    const k = window.innerWidth < 600 ? 0.6 : 1;
    const step = () => {
      const y = window.scrollY;
      const dy = y - lastY; lastY = y;
      target = Math.max(-1, Math.min(1, dy / 70)) * k;
      vel += (target - cur) * 0.14;
      vel *= 0.72;
      cur += vel;
      set('--v', cur); set('--va', Math.min(1, Math.abs(cur)));
      idle = dy === 0 ? idle + 1 : 0;
      if (idle < 40 || Math.abs(cur) > 0.002) eraf = requestAnimationFrame(step);
      else { eraf = 0; set('--v', 0); set('--va', 0); }
    };
    window.addEventListener('scroll', () => { idle = 0; if (!eraf) { lastY = window.scrollY; eraf = requestAnimationFrame(step); } }, { passive: true });
  }



  /* ---------- túnel 3D ---------- */
  (function(){
    const sec = $('projetos'), track = $('track'), pin = sec.querySelector<HTMLElement>('.proj-pin')!;
    const cards = [...track.querySelectorAll<HTMLElement>('.card')];
    const N = cards.length, D = 1400, Z0 = 900;
    const slots = cards.map((c) => { const s = document.createElement('div'); s.className = 'slot'; c.parentNode!.insertBefore(s, c); s.appendChild(c); return s; });
    const bg = document.createElement('canvas'); bg.className = 'tun-bg'; bg.setAttribute('aria-hidden', 'true'); pin.insertBefore(bg, pin.firstChild);
    const ctx = bg.getContext('2d')!;
    const counter = document.createElement('div'); counter.className = 'tun-count'; counter.setAttribute('aria-hidden', 'true'); pin.appendChild(counter);
    let vw = 0, vh = 0, F = 800, READ = 200, mobile = false, dpr = 1, lay: { x: number; y: number; z: number; ry: number }[] = [], raf = 0, cloneSlots: HTMLElement[] | null = null;
    const ZEND = Z0 + (N - 1) * D + 2200, PR = 0.74;
    const endEl = document.createElement('div'); endEl.className = 'tun-end';
    endEl.innerHTML = '<p>// fim do túnel</p><h3>Tem mais do outro lado.</h3><a class="btn btn-primary" href="#pessoais">ver projetos pessoais ↓</a>';
    pin.appendChild(endEl);
    const layout = () => {
      vw = pin.clientWidth; vh = pin.clientHeight; mobile = vw < 900;
      READ = mobile ? 520 : 620; F = READ * (mobile ? 0.88 : 0.86);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      bg.width = Math.round(vw * dpr); bg.height = Math.round(vh * dpr);
      lay = cards.map((_, i) => {
        const side = i % 2 ? 1 : -1;
        return {
          x: mobile ? side * vw * 0.05 : side * Math.min(vw * 0.2, 300),
          y: (mobile ? [0.02, 0.05, 0.01, 0.04] : [0.03, 0.07, 0.04, 0.06])[i % 4] * vh,
          z: Z0 + i * D,
          ry: mobile ? 0 : -side * 10
        };
      });
    };
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const hexToRgb = (h: string) => { const m = h.replace('#', ''); const v = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
    const head = sec.querySelector<HTMLElement>('.proj-head')!;
    let passFade = 1;
    const drawTunnel = (cam: number) => {
      const W = vw, H = vh, cx = W / 2, cy = H * (mobile ? 0.58 : 0.6);
      const k = READ / F;
      const TW = W * 1.15 * k, TH = H * 1.05 * k;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const proj = (x: number, y: number, z: number) => { const s = F / Math.max(1, z); return [cx + x * s, cy + y * s, s]; };
      const near = 60, far = 9000;
      const dEnd = ZEND - cam;
      const lineEnd = Math.max(near + 1, Math.min(far, dEnd));
      const acc = hexToRgb(getComputedStyle(root).getPropertyValue('--mag').trim() || '#FF2E88');
      const A = acc.join(',');
      // linhas longitudinais até a saída
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(34,211,238,0.14)';
      ctx.beginPath();
      const cols = 8, rows = 5;
      for (let i = 0; i <= cols; i++) {
        const x = -TW / 2 + TW * i / cols;
        for (const y of [-TH / 2, TH / 2]) { const p1 = proj(x, y, near), p2 = proj(x, y, lineEnd); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); }
      }
      for (let j = 1; j < rows; j++) {
        const y = -TH / 2 + TH * j / rows;
        for (const x of [-TW / 2, TW / 2]) { const p1 = proj(x, y, near), p2 = proj(x, y, lineEnd); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); }
      }
      ctx.stroke();
      // anéis fixos ao longo do túnel (só até a saída)
      const step = 520;
      const k0 = Math.ceil((cam + near) / step), k1 = Math.floor(Math.min(cam + far, ZEND - 1) / step);
      for (let kk = k0; kk <= k1; kk++) {
        const z = kk * step - cam;
        const p1 = proj(-TW / 2, -TH / 2, z), p2 = proj(TW / 2, TH / 2, z);
        const glow = dEnd < far ? Math.max(0, 1 - (dEnd - z) / 2600) : 0;
        const alpha = Math.min(1, (z - near) / 300) * Math.max(0, 1 - z / far) * 0.5;
        ctx.strokeStyle = glow > 0.02 ? 'rgba(' + A + ',' + (alpha * (0.5 + glow)).toFixed(3) + ')' : 'rgba(34,211,238,' + alpha.toFixed(3) + ')';
        ctx.strokeRect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1]);
      }
      // saída iluminada
      if (dEnd < far) {
        const z = Math.max(near * 0.5, dEnd);
        const p1 = proj(-TW / 2, -TH / 2, z), p2 = proj(TW / 2, TH / 2, z);
        const pw = p2[0] - p1[0], ph = p2[1] - p1[1];
        const vis = Math.min(1, (far - dEnd) / 2500) * passFade;
        const R = Math.max(pw, ph) * 0.75;
        // luz vazando pelas paredes
        const halo = ctx.createRadialGradient(cx, cy, Math.min(pw, ph) * 0.3, cx, cy, R * 2.2 + 200);
        halo.addColorStop(0, 'rgba(' + A + ',' + (0.22 * vis).toFixed(3) + ')');
        halo.addColorStop(1, 'rgba(' + A + ',0)');
        ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
        // abertura
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        g.addColorStop(0, 'rgba(255,255,255,' + (0.5 * vis).toFixed(3) + ')');
        g.addColorStop(0.35, 'rgba(' + A + ',' + (0.6 * vis).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + A + ',' + (0.22 * vis).toFixed(3) + ')');
        ctx.fillStyle = g;
        ctx.fillRect(p1[0], p1[1], pw, ph);
        ctx.save();
        ctx.shadowColor = 'rgba(' + A + ',0.9)'; ctx.shadowBlur = 60;
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.6 * vis).toFixed(3) + ')'; ctx.lineWidth = 2;
        ctx.strokeRect(p1[0], p1[1], pw, ph);
        ctx.restore();
      } else {
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.35);
        grd.addColorStop(0, 'rgba(' + A + ',0.10)'); grd.addColorStop(1, 'rgba(' + A + ',0)');
        ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
      }
    };
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      let eased, camZ, u = 0;
      if (p < PR) {
        const seg = (p / PR) * (N - 1);
        const i = Math.min(Math.floor(seg), N - 2), f = seg - i;
        eased = Math.min(N - 1, i + ease(Math.min(1, f)));
        camZ = (Z0 - READ) + eased * D;
      } else {
        u = (p - PR) / (1 - PR);
        eased = N - 1;
        const c0 = (Z0 - READ) + (N - 1) * D, c1 = ZEND - 70;
        camZ = c0 + (c1 - c0) * (u * u * (3 - 2 * u));
      }
      passFade = u > 0.72 ? Math.max(0, 1 - (u - 0.72) / 0.24) : 1;
      const show = Math.max(0, Math.min(1, (u - 0.4) / 0.25));
      head.style.opacity = (1 - Math.min(1, u / 0.45)).toFixed(3);
      endEl.style.opacity = show.toFixed(3);
      endEl.style.pointerEvents = show > 0.6 ? 'auto' : 'none';
      endEl.style.transform = 'translate(-50%,-50%) scale(' + (0.9 + show * 0.1).toFixed(3) + ')';
      counter.style.opacity = (1 - show).toFixed(3);
      drawTunnel(camZ);
      const cx = vw / 2, cy = vh * (mobile ? 0.58 : 0.6);
      if (!cloneSlots) { const c = document.querySelectorAll<HTMLElement>('.xray .slot'); if (c.length) cloneSlots = [...c]; }
      slots.forEach((s, k) => {
        const q = lay[k], depth = q.z - camZ;
        let t: string, op: number;
        if (depth < 60) { op = 0; t = 'translate(-9999px,0)'; }
        else {
          const sc = F / depth;
          op = Math.min(1, Math.max(0, (6500 - depth) / 2000)) * Math.min(1, Math.max(0, (depth - READ * 0.25) / (READ * 0.4)));
          t = 'translate(' + (cx + q.x * sc).toFixed(1) + 'px,' + (cy + q.y * sc).toFixed(1) + 'px) translate(-50%,-50%) scale(' + sc.toFixed(4) + ')' + (q.ry ? ' perspective(1200px) rotateY(' + q.ry + 'deg)' : '');
        }
        s.style.transform = t; s.style.opacity = op.toFixed(3);
        s.style.zIndex = String(Math.max(0, Math.round(10000 - depth)));
        s.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
        if (cloneSlots && cloneSlots[k]) { cloneSlots[k].style.transform = t; cloneSlots[k].style.opacity = op.toFixed(3); cloneSlots[k].style.zIndex = s.style.zIndex; }
      });
      counter.innerHTML = '<b>0' + (Math.max(0, Math.min(N - 1, Math.round(eased))) + 1) + '</b>/ 0' + N;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', kick, { passive: true });
    let lw = 0, lh = 0;
    window.addEventListener('resize', () => { if (Math.abs(innerWidth - lw) > 2 || Math.abs(innerHeight - lh) > 120) { lw = innerWidth; lh = innerHeight; layout(); } kick(); }, { passive: true });
    lw = innerWidth; lh = innerHeight; layout(); update();
  })();

  /* ---------- palavras-chave ---------- */
  (function(){
    const typed = $('kwType').querySelector<HTMLElement>('.typed')!;
    const list = ['performático.', 'acessível.', 'cheio de movimento.', 'detalhista.'].map(T);
    if (reduce) { typed.textContent = list[0]; return; }
    let wi = 0, ci = 0, del = false, running = false, timer = 0;
    const tick = () => {
      const w = list[wi];
      if (!del) { ci++; typed.textContent = w.slice(0, ci); if (ci === w.length) { del = true; timer = setTimeout(tick, 1500); return; } timer = setTimeout(tick, 70 + Math.random() * 60); }
      else { ci--; typed.textContent = w.slice(0, ci); if (ci === 0) { del = false; wi = (wi + 1) % list.length; timer = setTimeout(tick, 300); return; } timer = setTimeout(tick, 35); }
    };
    new IntersectionObserver((en) => {
      if (en[0].isIntersecting && !running) { running = true; tick(); }
      else if (!en[0].isIntersecting && running) { running = false; clearTimeout(timer); }
    }).observe($('kwType'));
  })();


  /* ---------- contato: copiar email + relógio ---------- */
  (function(){
    const btn = $('copyMail'), hint = $('copyHint'), label = btn.querySelector<HTMLElement>('span')!;
    const EM = 'ricardo.baldrez@gmail.com';
    let t = 0;
    const done = (ok: boolean) => {
      btn.classList.toggle('copied', ok);
      label.textContent = T(ok ? 'copiado ✓' : 'copiar');
      hint.textContent = T(ok ? 'email copiado, é só colar' : 'não deu pra copiar: selecione o email acima');
      clearTimeout(t); t = setTimeout(() => { btn.classList.remove('copied'); label.textContent = T('copiar'); hint.textContent = ''; }, 2200);
    };
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(EM); return done(true); } catch (e) {}
      try {
        const ta = document.createElement('textarea'); ta.value = EM; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); done(ok);
      } catch (e) { done(false); }
    });
    const clock = $('spClock');
    const fmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 15000);
  })();


  /* ---------- menu ativo conforme a seção na tela ---------- */
  (function(){
    const ids = ['sobre', 'experiencia', 'projetos', 'pessoais', 'contato'];
    const links = [...document.querySelectorAll<HTMLElement>('.links a, .menu a')];
    let current = '';
    const setCur = (id: string) => {
      if (id === current) return; current = id;
      links.forEach((a) => { if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    let raf = 0;
    const upd = () => {
      raf = 0;
      const mid = innerHeight * 0.45;
      let id = '';
      ids.forEach((k) => { const el = $(k); if (el && el.getBoundingClientRect().top < mid) id = k; });
      const pal = $('palavras');
      if (id === 'pessoais' && pal && pal.getBoundingClientRect().top < mid) id = '';
      setCur(id);
    };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    upd();
  })();

  /* ---------- raio-x ---------- */
  const xray = (function(){
    const layer = document.querySelector<HTMLElement>('.xray')!, lens = document.querySelector<HTMLElement>('.lens')!, label = lens.querySelector<HTMLElement>('span')!;
    let cloned = false;
    const ensureClone = () => {
      if (cloned) return; cloned = true;
      const clone = document.querySelector<HTMLElement>('main')!.cloneNode(true) as HTMLElement;
      clone.querySelectorAll<HTMLElement>('[id]').forEach((el) => el.removeAttribute('id'));
      clone.setAttribute('inert', '');
      layer.appendChild(clone);
    };
    const touchUI = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const R = () => (window.innerWidth < 600 ? 95 : 130);
    let x = innerWidth / 2, y = innerHeight / 2, r = 0, target = 0, raf = 0, pinned = false, timer = 0;
    const draw = () => {
      raf = 0;
      r += (target - r) * (reduce ? 1 : 0.22);
      if (r < 0.5 && target === 0) { r = 0; layer.classList.remove('show'); lens.classList.remove('show'); return; }
      layer.scrollTop = window.scrollY; layer.scrollLeft = window.scrollX;
      layer.style.clipPath = 'circle(' + r.toFixed(1) + 'px at ' + x + 'px ' + y + 'px)';
      lens.style.width = lens.style.height = (r * 2) + 'px';
      lens.style.transform = 'translate(' + (x - r) + 'px,' + (y - r) + 'px)';
      label.textContent = (LANG === 'en' ? 'x-ray' : 'raio-x') + ' · x ' + Math.round(x) + ' · y ' + Math.round(y + window.scrollY);
      if (Math.abs(target - r) > 0.5) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const on = () => { ensureClone(); target = R(); layer.classList.add('show'); lens.classList.add('show'); body.classList.add('xray-hold'); kick(); };
    const off = () => { if (pinned) return; target = 0; body.classList.remove('xray-hold'); kick(); };
    const blocked = (t: EventTarget | null) => (t as Element).closest('a, button, input, .term, .menu, .pill, .top, label, .dock');
    window.addEventListener('scroll', () => { if (target) kick(); }, { passive: true });
    if (!touchUI) {
      document.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || blocked(e.target)) return;
        x = e.clientX; y = e.clientY;
        clearTimeout(timer); timer = setTimeout(on, 160);
      });
      document.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; if (target) kick(); }, { passive: true });
      document.addEventListener('mouseup', () => { clearTimeout(timer); off(); });
      window.addEventListener('blur', () => { clearTimeout(timer); off(); });
    } else {
      let sx = 0, sy = 0;
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1 || blocked(e.target)) return;
        const t = e.touches[0]; sx = x = t.clientX; sy = y = t.clientY;
        clearTimeout(timer); timer = setTimeout(on, 280);
      }, { passive: true });
      document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (target) { e.preventDefault(); x = t.clientX; y = t.clientY; kick(); }
        else if (Math.hypot(t.clientX - sx, t.clientY - sy) > 10) clearTimeout(timer);
      }, { passive: false });
      document.addEventListener('touchend', () => { clearTimeout(timer); off(); });
      document.addEventListener('touchcancel', () => { clearTimeout(timer); off(); });
      document.addEventListener('contextmenu', (e) => { if (target) e.preventDefault(); });
    }
    window.addEventListener('resize', () => { if (target) { target = R(); kick(); } }, { passive: true });
    return {
      toggle() { pinned = !pinned; if (pinned) { if (touchUI) { x = innerWidth / 2; y = innerHeight / 2; } on(); body.classList.remove('xray-hold'); } else { target = 0; kick(); } return pinned; }
    };
  })();


  /* ---------- transições entre seções (teste) ---------- */
  const transitions = (function(){
    const btns = [...document.querySelectorAll<HTMLElement>('.tr-pick [data-tr]')];
    const toast = document.querySelector<HTMLElement>('.tr-toast')!;
    const names: Record<number, string> = { 1: 'fio de luz', 2: 'números gigantes', 3: 'código (arquivo sendo aberto)', 4: 'onda no grid' };
    let mode = 3, toastT = 0;
    const accent = () => getComputedStyle(root).getPropertyValue('--mag').trim() || '#FF2E88';
    const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

    /* 1 · fio de luz */
    const svg = document.querySelector<SVGSVGElement>('.thread')!, NS = 'http://www.w3.org/2000/svg';
    type Seg = { glow: SVGPathElement; line: SVGPathElement; head: SVGCircleElement; halo: SVGCircleElement; len: number; samples: [number, number][]; y0: number; y1: number };
    let segs: Seg[] = [], built = false;
    const buildThread = () => {
      svg.innerHTML = '';
      const docH = document.documentElement.scrollHeight, W = document.documentElement.clientWidth;
      svg.setAttribute('width', String(W)); svg.setAttribute('height', String(docH)); svg.style.height = docH + 'px';
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + docH);
      const defs = document.createElementNS(NS, 'defs');
      defs.innerHTML = '<linearGradient id="thr" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + docH + '"><stop offset="0" stop-color="#FF2E88"/><stop offset=".45" stop-color="#22D3EE"/><stop offset="1" stop-color="#B6F43C"/></linearGradient><filter id="thrGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>';
      svg.appendChild(defs);
      const wrap = document.querySelector<HTMLElement>('#sobre .wrap')!.getBoundingClientRect();
      const L = Math.max(10, wrap.left - (W < 600 ? 12 : 22)), R = Math.min(W - 14, wrap.right + (W < 600 ? 0 : 10));
      const y = (sel: string, k?: number) => { const el = document.querySelector<HTMLElement>(sel)!; const r = el.getBoundingClientRect(); return r.top + window.scrollY + r.height * (k || 0); };
      const mid = (a: number, b: number) => (a + b) / 2;
      const heroEnd = y('#topo', 1), sobreTop = y('#sobre .eyebrow'), sobreEnd = y('#sobre', 1), expTop = y('#experiencia .eyebrow'), expEnd = y('#experiencia', 1);
      const kwTop = y('#palavras .kw-type'), kwEnd = y('#palavras', 1), contTop = y('#contato .eyebrow');
      const mg = document.querySelector<HTMLElement>('#copyMail')!.getBoundingClientRect();
      const magX = mg.left + mg.width / 2, magY = mg.top + window.scrollY + mg.height / 2;
      const ctas = document.querySelector<HTMLElement>('.hero-ctas')!.getBoundingClientRect();
      const start: [number, number] = [L, ctas.bottom + window.scrollY + 40];
      const A: [number, number][] = [start, [R, mid(heroEnd, sobreTop) + 20], [L, sobreTop - 12], [L, sobreEnd - 160], [R, mid(sobreEnd, expTop)], [L, expTop - 12], [L, expEnd]];
      const B: [number, number][] = [[L, kwTop - 60], [L, kwEnd - 60], [R, mid(kwEnd, contTop)], [L, contTop - 12], [L, magY - 40], [magX - mg.width / 2 - 6, magY]];
      const toD = (pts: [number, number][]) => {
        let d = 'M' + pts[0][0] + ' ' + pts[0][1];
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2;
          d += ' C' + x0 + ' ' + my + ' ' + x1 + ' ' + my + ' ' + x1 + ' ' + y1;
        }
        return d;
      };
      segs = [A, B].map((pts) => {
        const g = document.createElementNS(NS, 'g');
        const base = document.createElementNS(NS, 'path');
        base.setAttribute('d', toD(pts)); base.setAttribute('fill', 'none'); base.setAttribute('stroke', 'rgba(236,238,247,.07)'); base.setAttribute('stroke-width', '1.5');
        const glow = document.createElementNS(NS, 'path');
        glow.setAttribute('d', toD(pts)); glow.setAttribute('fill', 'none'); glow.setAttribute('stroke', 'url(#thr)'); glow.setAttribute('stroke-width', '6'); glow.setAttribute('opacity', '.45'); glow.setAttribute('filter', 'url(#thrGlow)'); glow.setAttribute('stroke-linecap', 'round');
        const line = document.createElementNS(NS, 'path');
        line.setAttribute('d', toD(pts)); line.setAttribute('fill', 'none'); line.setAttribute('stroke', 'url(#thr)'); line.setAttribute('stroke-width', '2'); line.setAttribute('stroke-linecap', 'round');
        const head = document.createElementNS(NS, 'circle'); head.setAttribute('r', '5'); head.setAttribute('fill', '#fff');
        const halo = document.createElementNS(NS, 'circle'); halo.setAttribute('r', '16'); halo.setAttribute('fill', 'url(#thr)'); halo.setAttribute('opacity', '.55'); halo.setAttribute('filter', 'url(#thrGlow)');
        g.append(base, glow, line, halo, head); svg.appendChild(g);
        const len = line.getTotalLength();
        const samples: [number, number][] = []; for (let i = 0; i <= 200; i++) { const pt = line.getPointAtLength(len * i / 200); samples.push([pt.y, len * i / 200]); }
        [glow, line].forEach((pth) => { pth.style.strokeDasharray = String(len); pth.style.strokeDashoffset = String(len); });
        return { glow, line, head, halo, len, samples, y0: pts[0][1], y1: pts[pts.length - 1][1] };
      });
      built = true; drawThread();
    };
    const drawThread = () => {
      if (!built || mode !== 1) return;
      const target = window.scrollY + innerHeight * 0.62;
      segs.forEach((sg) => {
        let L = 0;
        if (target >= sg.y1) L = sg.len;
        else if (target > sg.y0) { for (const [yy, ll] of sg.samples) { if (yy <= target) L = Math.max(L, ll); } }
        const off = sg.len - L;
        sg.line.style.strokeDashoffset = String(off); sg.glow.style.strokeDashoffset = String(off);
        const vis = L > 1 && L < sg.len - 1;
        const pt = sg.line.getPointAtLength(L);
        [sg.head, sg.halo].forEach((c) => { c.setAttribute('cx', String(pt.x)); c.setAttribute('cy', String(pt.y)); c.style.opacity = vis ? '' : '0'; });
      });
    };

    /* 2 · números gigantes */
    const nums = [...document.querySelectorAll<HTMLElement>('[data-n]')];
    const drawNums = () => {
      if (mode !== 2) return;
      const vh = innerHeight;
      nums.forEach((n, i) => {
        const r = n.parentElement!.getBoundingClientRect();
        const off = ((r.top + (n.style.bottom ? r.height : 0)) - vh / 2) * -0.28;
        n.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    };

    /* 3 · arquivo sendo aberto */
    const files = [...document.querySelectorAll<HTMLElement>('.fileline')];
    const runFile = (fl: HTMLElement) => {
      if (fl.dataset.done) return; fl.dataset.done = '1';
      const sec = fl.closest('section')!;
      const rev = sec.querySelector<HTMLElement>('[data-reveal]')!;
      const cmd = fl.dataset.file || '';
      if (reduce) { fl.innerHTML = '<span class="cmd">$</span> ' + cmd + '<span class="ok">✓</span>'; if (rev) rev.classList.add('opened'); return; }
      let i = 0;
      const typeIt = () => {
        fl.innerHTML = '<span class="cmd">$</span> ' + cmd.slice(0, i);
        if (i++ < cmd.length) return setTimeout(typeIt, 11);
        let b = 0;
        const barIt = () => {
          fl.innerHTML = '<span class="cmd">$</span> ' + cmd + '<span class="bar">[' + '█'.repeat(b) + '·'.repeat(10 - b) + '] ' + (b * 10) + '%</span>';
          if (b++ < 10) return setTimeout(barIt, 14);
          fl.innerHTML += '<span class="ok">✓</span>';
        };
        setTimeout(barIt, 40);
      };
      typeIt();
      setTimeout(() => { if (rev) rev.classList.add('opened'); }, 120);
    };
    const secOf = (f: HTMLElement) => f.closest('section')!;
    const fio = new IntersectionObserver((en) => { en.forEach((e) => { if (e.isIntersecting && mode === 3) { const f = e.target.querySelector<HTMLElement>('.fileline')!; if (f) runFile(f); } }); }, { rootMargin: '0px 0px -15% 0px' });
    files.forEach((f) => fio.observe(secOf(f)));
    const resetFiles = () => {
      files.forEach((f) => { delete f.dataset.done; f.innerHTML = ''; });
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((r) => r.classList.remove('opened'));
      files.forEach((f) => { const sc = secOf(f); fio.unobserve(sc); fio.observe(sc); });
    };

    /* 4 · onda no grid */
    const cv = document.querySelector<HTMLCanvasElement>('.wave')!, ctx = cv.getContext('2d')!;
    const secs = ['topo', 'sobre', 'experiencia', 'projetos', 'palavras', 'contato'].map((id) => $(id));
    let curSec = -1, waveRaf = 0;
    const wave = (down: boolean, sec: HTMLElement | undefined) => {
      if (reduce || mode !== 4) return;
      const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      const cell = W < 600 ? 32 : 44, col = accent();
      /* origem: o título da seção que está entrando */
      let ox = W * 0.25, oy = down ? H * 0.6 : H * 0.4;
      const tt = sec && sec.querySelector<HTMLElement>('.h2, .eyebrow, h1, .big, .kw-type')!;
      if (tt) { const r = tt.getBoundingClientRect(); ox = Math.min(W, Math.max(0, r.left + Math.min(r.width, 280) / 2)); oy = Math.min(H, Math.max(0, r.top + r.height / 2)); }
      const maxR = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy));
      const rings = [0, 140, 280], DUR = 1100, BAND = 70, t0 = performance.now();
      cancelAnimationFrame(waveRaf);
      const fr = (now: number) => {
        const el = now - t0;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
        if (el > DUR + rings[rings.length - 1]) return;
        ctx.strokeStyle = col; ctx.lineWidth = 1;
        rings.forEach((d, k) => {
          const t = (el - d) / DUR; if (t <= 0 || t >= 1) return;
          const rad = (1 - Math.pow(1 - t, 3)) * maxR, fade = (1 - t) * (k === 0 ? 1 : 0.55);
          const x0 = Math.max(0, Math.floor((ox - rad - BAND) / cell)), x1 = Math.min(Math.ceil(W / cell), Math.ceil((ox + rad + BAND) / cell));
          const y0 = Math.max(0, Math.floor((oy - rad - BAND) / cell)), y1 = Math.min(Math.ceil(H / cell), Math.ceil((oy + rad + BAND) / cell));
          for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) {
            const px = gx * cell, py = gy * cell;
            /* segmento horizontal e vertical que saem deste cruzamento */
            const dh = Math.abs(Math.hypot(px + cell / 2 - ox, py - oy) - rad), dv = Math.abs(Math.hypot(px - ox, py + cell / 2 - oy) - rad);
            if (dh < BAND) { ctx.globalAlpha = (1 - dh / BAND) * fade * 0.9; ctx.beginPath(); ctx.moveTo(px, py + 0.5); ctx.lineTo(px + cell, py + 0.5); ctx.stroke(); }
            if (dv < BAND) { ctx.globalAlpha = (1 - dv / BAND) * fade * 0.9; ctx.beginPath(); ctx.moveTo(px + 0.5, py); ctx.lineTo(px + 0.5, py + cell); ctx.stroke(); }
            const dp = Math.abs(Math.hypot(px - ox, py - oy) - rad);
            if (dp < BAND * 0.5) { ctx.globalAlpha = (1 - dp / (BAND * 0.5)) * fade; ctx.fillStyle = col; ctx.fillRect(px - 1.5, py - 1.5, 3, 3); }
          }
        });
        /* gota no ponto de origem */
        const g = Math.max(0, 1 - el / 500);
        if (g > 0) { ctx.globalAlpha = g * 0.5; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(ox, oy, 6 + (1 - g) * 40, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 1;
        waveRaf = requestAnimationFrame(fr);
      };
      waveRaf = requestAnimationFrame(fr);
    };
    let lastY = scrollY;
    const checkSec = () => {
      const mid = innerHeight * (mode === 4 ? 0.7 : 0.5);
      let idx = 0; secs.forEach((sc, i) => { if (sc.getBoundingClientRect().top < mid) idx = i; });
      if (curSec !== -1 && idx !== curSec) wave(scrollY >= lastY, secs[idx]);
      curSec = idx; lastY = scrollY;
    };

    /* troca de modo */
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; drawThread(); drawNums(); checkSec(); }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    let rT = 0;
    const rebuild = () => { clearTimeout(rT); rT = setTimeout(() => { buildThread(); drawNums(); }, 250); };
    window.addEventListener('resize', rebuild, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(rebuild).observe(document.querySelector<HTMLElement>('main')!);
    const set = (m: number, silent?: boolean) => {
      mode = m;
      body.classList.remove('tr1', 'tr2', 'tr3', 'tr4'); body.classList.add('tr' + m);
      btns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.tr) === m)));
      if (m === 1) buildThread();
      if (m === 2) drawNums();
      if (m === 3) resetFiles();
      if (!silent) { try { localStorage.setItem('rb-transicao', String(m)); } catch (e) {} }
      if (!silent) { toast.textContent = m + ' · ' + T(names[m]); toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 1600); }
    };
    btns.forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); set(Number(b.dataset.tr)); }));
    let saved = 3; try { const v = parseInt(localStorage.getItem('rb-transicao') || '', 10); if (v >= 1 && v <= 4) saved = v; } catch (e) {}
    body.classList.remove('tr1', 'tr2', 'tr4'); body.classList.add('tr' + saved); mode = saved;
    const boot = () => { set(saved, true); checkSec(); };
    if (document.fonts) document.fonts.ready.then(() => setTimeout(boot, 300)); else setTimeout(boot, 300);
    return { set, names };
  })();

  /* ---------- terminal secreto ---------- */
  (function(){
    const term = document.querySelector<HTMLElement>('.term')!, veil = document.querySelector<HTMLElement>('.term-veil')!;
    const out = term.querySelector<HTMLElement>('.term-out')!, form = term.querySelector<HTMLElement>('form')!, input = term.querySelector<HTMLInputElement>('.term-in')!;
    const openBtn = document.querySelector<HTMLElement>('.term-btn')!;
    type Line = [string, string, boolean?];
    type Cmd = (a: string[]) => Promise<unknown>;
    let opener: Element | null = null, booted = false, busy = false, queue: Promise<unknown> = Promise.resolve(), hist: string[] = [], hi = 0, pending = null;
    const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ESC[c]);
    const scrollOut = () => { out.scrollTop = out.scrollHeight; };
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    const type = async (html: string, cls?: string, isHtml?: boolean) => {
      if (!isHtml) html = T(html);
      const p = document.createElement('p'); if (cls) p.className = cls; out.appendChild(p);
      if (isHtml) { p.innerHTML = html; scrollOut(); await wait(30); return; }
      if (reduce) { p.textContent = html; scrollOut(); await wait(30); return; }
      for (let i = 0; i <= html.length; i += 3) { p.textContent = html.slice(0, i); scrollOut(); await wait(8); }
      p.textContent = html; scrollOut();
    };
    const say = async (lines: Line[]) => { for (const l of lines) await type(l[0], l[1], l[2]); };
    const go = (id: string) => { close(); setTimeout(() => { const el = $(id); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 250); };
    const themes: Record<string, string> = { magenta: '#FF2E88', cyan: '#22D3EE', lime: '#B6F43C', violet: '#A78BFA' };
    const cmds: Record<string, Cmd> = {
      help: async () => {
        const groups: [string, [string, string][]][] = [
          ['navegar', [['about', 'vai até o Sobre'], ['experience', 'vai até a Experiência'], ['projects', 'vai até os Projetos'], ['contact', 'vai até o Contato']]],
          ['sobre mim', [['whoami', 'quem é o dev'], ['stack', 'tecnologias'], ['github · linkedin', 'abre os links'], ['ls · cat <arquivo>', 'explora os arquivos']]],
          ['visual', [['theme <cor>', 'cor de destaque: magenta · cyan · lime · violet'], ['theme minimal [cor]', 'versão mais seca, com uma cor só de destaque'], ['theme default', 'volta pro colorido'], ['theme light · dark', 'tema claro ou escuro'], ['blueprint', 'liga/desliga o modo blueprint'], ['xray', 'deixa a lente de raio-x sempre ligada'], ['transition <1-4>', 'troca a transição entre seções'], ['intro', 'replay da abertura']]],
          ['extras', [['translate', LANG === 'en' ? 'muda o site pra inglês' : 'muda o site pra inglês'], ['sudo hire', 'você sabe o que fazer'], ['clear · exit', 'limpa a tela · fecha o terminal']]]
        ];
        await type('comandos disponíveis', 'acc');
        for (const [g, rows] of groups) {
          await type('<span class="h-g">' + T(g) + '</span>' + rows.map(([c, d]) => '<span class="h-row"><span class="h-c">' + esc(T(c)) + '</span><span class="h-d">' + esc(T(d)) + '</span></span>').join(''), 'h-block', true);
        }
        return type('dica: Tab completa, ↑ ↓ navegam no histórico.', 'muted');
      },
      whoami: async () => say([['Ricardo Barbosa Baldrez', 'ok'], ['desenvolvedor front-end e mobile · React, React Native e TypeScript.', ''], ['hoje: app da Crefisa pela GFT Technologies · São Paulo, SP', 'muted'], ['estudando: pós em Engenharia de IA Aplicada (UNIPDS) · LLMs, RAG, MCP e agentes de IA', 'muted']]),
      ls: async () => say([['about.txt  experience.log  projects/  contact.md  secret.txt', 'acc']]),
      cat: async (a: string[]) => {
        const f = (a[0] || '').toLowerCase();
        if (f === 'about.txt') return go('sobre');
        if (f === 'experience.log') return go('experiencia');
        if (f === 'contact.md') return go('contato');
        if (f === 'secret.txt') return say([['você achou o segredo.', 'ok'], ['o segredo é que todo esse site é Astro, CSS e um pouco de TypeScript bem escrito.', 'muted']]);
        if (f.indexOf('projects') === 0) return say([['cat: projects/: é um diretório. tente: projects', 'err']]);
        return say([['cat: ' + (f || '?') + ': arquivo não encontrado', 'err']]);
      },
      stack: async () => say([['front-end: React · TypeScript · JavaScript · Vue · HTML semântico · CSS', 'acc'], ['mobile:    React Native', 'acc'], ['arquitetura: Micro Frontends · Atomic Design · Design System', 'acc'], ['ferramentas: Git · Docker · testes unitários e de integração', 'acc']]),
      about: async () => go('sobre'),
      experience: async () => go('experiencia'),
      projects: async () => go('projetos'),
      contact: async () => go('contato'),
      github: async () => say([['<a href="https://github.com/RicardoBaldrez">github.com/RicardoBaldrez</a>', '', true]]),
      linkedin: async () => say([['<a href="https://www.linkedin.com/in/ricardo-barbosa-baldrez-38b760145">linkedin.com/in/ricardo-barbosa-baldrez</a>', '', true]]),
      theme: async (a: string[]) => {
        const t = (a[0] || '').toLowerCase();
        const accent = (n: string) => { root.setAttribute('data-accent', n); try { localStorage.setItem('rb-accent', n); } catch (e) {} };
        if (t === 'light' || t === 'dark') { setMode(t); return say([[t === 'light' ? 'tema claro aplicado.' : 'tema escuro aplicado.', 'ok']]); }
        if (t === 'minimal') {
          if (root.classList.contains('light')) return say([['o minimal só existe no tema escuro. digite theme dark antes.', 'err']]);
          const n = (a[1] || '').toLowerCase();
          if (n && !themes[n]) return say([['uso: theme minimal [magenta | cyan | lime | violet]', 'err']]);
          if (n) accent(n);
          root.classList.add('minimal');
          return say([['tema minimal aplicado' + (n ? ' com ' + n : '') + '. feche o terminal pra ver.', 'ok']]);
        }
        if (t === 'default') { root.classList.remove('minimal'); return say([['tema padrão aplicado.', 'ok']]); }
        if (!themes[t]) return say([['uso: theme magenta | cyan | lime | violet | minimal | default | light | dark', 'err']]);
        accent(t);
        return say([['cor de destaque: ' + t, 'ok']]);
      },
      blueprint: async () => { document.querySelector<HTMLElement>('.bp-toggle')!.click(); return say([[body.classList.contains('bp') ? 'blueprint ligado. feche o terminal pra ver.' : 'blueprint desligado.', 'ok']]); },
      sudo: async (a: string[]) => {
        if ((a[0] || '') !== 'hire') return say([['sudo: só aceito um comando: sudo hire', 'err']]);
        await say([['[sudo] senha para recrutador: ********', 'muted']]);
        await wait(400);
        await say([['verificando vaga...', 'muted'], ['analisando portfólio... 100%', 'muted'], ['acesso concedido. abrindo canal de contato...', 'ok']]);
        await wait(700);
        go('contato');
      },
      clear: async () => { out.innerHTML = ''; },
      exit: async () => close(),
      date: async () => say([[new Date().toLocaleString(LANG === 'en' ? 'en-US' : 'pt-BR'), '']]),
      debug: async () => {
        const de = document.documentElement, f = document.querySelector('footer')!;
        const fb = Math.round(f.getBoundingClientRect().bottom + scrollY);
        const isFixed = (el: Element | null) => { for (let p = el; p; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return true; return false; };
        const below: string[] = [];
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect(); const b = Math.round(r.bottom + scrollY);
          if (r.height && b > fb + 4 && !isFixed(el)) below.push((el.getAttribute('class') || el.tagName.toLowerCase()) + ' → ' + b);
        });
        const vv = window.visualViewport;
        return say([
          ['altura da página: ' + de.scrollHeight + ' · body: ' + document.body.scrollHeight, 'muted'],
          ['fim do rodapé: ' + fb + ' · sobra: ' + (de.scrollHeight - fb), 'muted'],
          ['tela: ' + innerWidth + '×' + innerHeight + (vv ? ' · visível: ' + Math.round(vv.width) + '×' + Math.round(vv.height) : ''), 'muted'],
          [below.length ? 'passam do rodapé:' : 'nada passa do rodapé', 'ok'],
          ...below.slice(0, 12).map((t): Line => ['  ' + t, '']),
        ]);
      },
      echo: async (a: string[]) => say([[a.join(' '), '']]),
      history: async () => say(hist.length ? hist.map((h, i): Line => [String(i + 1).padStart(3) + '  ' + h, 'muted']) : [['(vazio)', 'muted']]),
      xray: async () => { const on = xray.toggle(); return say([[on ? 'raio-x fixo ligado. feche o terminal e mova o mouse. digite xray de novo pra desligar.' : 'raio-x fixo desligado.', 'ok']]); },
      transition: async (a: string[]) => {
        const n = parseInt(a[0], 10);
        if (!(n >= 1 && n <= 4)) return say([['uso: transition 1 | 2 | 3 | 4', 'err']]);
        transitions.set(n);
        return say([['transição ' + n + ': ' + T(transitions.names[n]), 'ok']]);
      },
      intro: async () => { close(); setTimeout(() => intro.replay(), 300); },
      rm: async () => say([['permissão negada. bela tentativa.', 'err']]),
      translate: async () => { await say([[LANG === 'en' ? 'mudando pra português... reiniciando o RB-OS' : 'switching to English... rebooting RB-OS', 'ok']]); setTimeout(() => setLang(LANG === 'en' ? 'pt' : 'en'), reduce ? 0 : 700); }
    };
    cmds.cls = cmds.clear;
    const names = Object.keys(cmds);
    const run = async (raw: string) => {
      const line = raw.trim();
      const pEl = document.createElement('p'); pEl.className = 'cmd';
      pEl.innerHTML = '<span style="color:var(--lime)">$</span> ' + esc(line); out.appendChild(pEl); scrollOut();
      if (!line) return;
      hist.push(line); hi = hist.length;
      const [c, ...a] = line.split(/\s+/);
      const fn = cmds[c.toLowerCase()];
      if (fn) await fn(a); else await say([['comando não encontrado: ' + c + '. digite help', 'err']]);
    };
    const boot = async () => {
      booted = true;
      queue = queue.then(() => say([['RB-OS v1.0 — portfólio de Ricardo Baldrez', 'acc'], ['digite help pra ver os comandos.', 'muted']]));
    };
    const open = () => {
      if (body.classList.contains('term-open')) return;
      opener = document.activeElement;
      body.classList.add('term-open');
      setTimeout(() => input.focus(), 50);
      if (!booted) boot();
    };
    const close = () => {
      if (!body.classList.contains('term-open')) return;
      body.classList.remove('term-open');
      if (opener instanceof HTMLElement) opener.focus();
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = input.value; input.value = '';
      queue = queue.then(async () => { busy = true; await run(v); busy = false; });
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi]; } }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const v = input.value.toLowerCase();
        const m = names.filter((n) => n.indexOf(v) === 0);
        if (v && m.length === 1) input.value = m[0] + ' ';
        else if (v && m.length > 1) say([[m.join('  '), 'muted']]);
      }
    });
    term.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab' && e.target !== input) { e.preventDefault(); input.focus(); }
    });
    term.addEventListener('click', (e) => { const el = e.target as Element; if (el.tagName !== 'A' && !el.closest('.term-x') && !window.getSelection()?.toString()) input.focus(); });
    term.querySelector<HTMLElement>('.term-x')!.addEventListener('click', close);
    veil.addEventListener('click', close);
    openBtn.addEventListener('click', open);
    document.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const isTilde = e.key === '~' || e.key === '`' || (e.key === 'Dead' && (e.code === 'Quote' || e.code === 'Backquote' || e.code === 'IntlBackslash'));
      if (isTilde) { e.preventDefault(); body.classList.contains('term-open') ? close() : open(); }
    });
  })();

  /* ---------- letras com física ---------- */
  (function(){
    const arena = $('arena');
    const title = arena.querySelector<HTMLElement>('h2')!;
    const resetBtn = document.querySelector<HTMLElement>('.arena-reset')!;
    const els = [...arena.querySelectorAll<HTMLElement>('.ch:not(.sp)')];
    type Body = { el: HTMLElement; w: number; h: number; hx: number; hy: number; x: number; y: number; rad: number; mode: string; vx: number; vy: number; a: number; va: number; i: number; delay: number };
    let bodies: Body[] = [], W = 0, H = 0, raf = 0, last = 0, dropped = false, active = false;
    const G = 2600, REST = 0.42;
    const layout = () => {
      arena.classList.remove('phys');
      arena.style.height = '';
      els.forEach((el) => { el.style.transform = ''; });
      const ar = arena.getBoundingClientRect();
      W = ar.width; H = ar.height;
      bodies = els.map((el, i): Body => {
        const r = el.getBoundingClientRect();
        const b: Body = { el, w: r.width, h: r.height, hx: r.left - ar.left, hy: r.top - ar.top, x: 0, y: 0, rad: 0, mode: 'home', vx: 0, vy: 0, a: 0, va: 0, i, delay: 0 };
        b.x = b.hx; b.y = b.hy; b.rad = Math.min(b.w, b.h) * 0.46;
        return b;
      });
      arena.style.height = H + 'px';
      arena.classList.add('phys');
      bodies.forEach(paint);
    };
    const paint = (b: Body) => { b.el.style.transform = 'translate(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px) rotate(' + b.a.toFixed(3) + 'rad)'; };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const tick = (now: number) => {
      raf = 0;
      let dt = Math.min(0.033, (now - last) / 1000); last = now;
      let moving = false;
      for (const b of bodies) {
        if (b.mode === 'drop') {
          if (now < b.delay) { moving = true; continue; }
          b.vy += G * dt; b.y += b.vy * dt;
          if (b.y >= b.hy) { b.y = b.hy; b.vy *= -0.32; if (Math.abs(b.vy) < 60) { b.vy = 0; b.mode = 'home'; } }
          b.a = (b.hy - b.y) * 0.0009 * (b.i % 2 ? 1 : -1);
          if (b.mode === 'home') b.a = 0;
          moving = true;
        } else if (b.mode === 'free') {
          b.vy += G * dt;
          b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
          if (b.x < 0) { b.x = 0; b.vx = -b.vx * REST; b.va *= -0.6; }
          if (b.x + b.w > W) { b.x = W - b.w; b.vx = -b.vx * REST; b.va *= -0.6; }
          if (b.y < -H) { b.y = -H; b.vy = Math.abs(b.vy) * REST; }
          if (b.y + b.h > H) {
            b.y = H - b.h; b.vy = -b.vy * REST; b.vx *= 0.86;
            b.va = b.va * 0.7 + b.vx * 0.004;
            if (Math.abs(b.vy) < 40) b.vy = 0;
            b.a *= 0.9;
          }
          b.va *= 0.995;
          if (Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.va) * 50 > 8) moving = true;
        } else if (b.mode === 'back') {
          const k = 1 - Math.pow(0.0015, dt);
          b.x += (b.hx - b.x) * k; b.y += (b.hy - b.y) * k; b.a += (0 - b.a) * k;
          if (Math.abs(b.hx - b.x) + Math.abs(b.hy - b.y) < 0.5 && Math.abs(b.a) < 0.01) { b.x = b.hx; b.y = b.hy; b.a = 0; b.mode = 'home'; }
          else moving = true;
        } else if (b.mode === 'drag') moving = true;
      }
      // colisões (círculos) envolvendo letras soltas
      for (let i = 0; i < bodies.length; i++) {
        const A = bodies[i];
        for (let j = i + 1; j < bodies.length; j++) {
          const B = bodies[j];
          const fa = A.mode === 'free', fb = B.mode === 'free';
          if (!fa && !fb) continue;
          const ax = A.x + A.w / 2, ay = A.y + A.h * 0.55, bx = B.x + B.w / 2, by = B.y + B.h * 0.55;
          const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 0.01, min = A.rad + B.rad;
          if (d >= min) continue;
          const nx = dx / d, ny = dy / d, over = min - d;
          const ma = fa ? (fb ? 0.5 : 1) : 0, mb = fb ? (fa ? 0.5 : 1) : 0;
          A.x -= nx * over * ma; A.y -= ny * over * ma; B.x += nx * over * mb; B.y += ny * over * mb;
          const rv = ((fb ? B.vx : 0) - (fa ? A.vx : 0)) * nx + ((fb ? B.vy : 0) - (fa ? A.vy : 0)) * ny;
          if (rv < 0) {
            const jimp = -(1 + REST) * rv;
            if (fa) { A.vx -= nx * jimp * ma; A.vy -= ny * jimp * ma; A.va -= (nx * 0.01) * jimp * 0.1; }
            if (fb) { B.vx += nx * jimp * mb; B.vy += ny * jimp * mb; B.va += (nx * 0.01) * jimp * 0.1; }
          }
        }
      }
      bodies.forEach(paint);
      resetBtn.hidden = !bodies.some((b) => b.mode === 'free' || b.mode === 'drag');
      if (moving && active) kick();
    };
    const drop = () => {
      if (dropped) return; dropped = true;
      const t = performance.now();
      bodies.forEach((b, i) => { b.mode = 'drop'; b.y = b.hy - H - 120 - Math.random() * 200; b.vy = 0; b.delay = t + i * 55; paint(b); });
      kick();
    };
    // arrastar e arremessar
    let drag: { b: Body; ox: number; oy: number; hist: { x: number; y: number; t: number }[] } | null = null;
    arena.addEventListener('pointerdown', (e) => {
      const el = (e.target as Element).closest<HTMLElement>('.ch:not(.sp)');
      if (!el || reduce) return;
      const b = bodies.find((q) => q.el === el); if (!b) return;
      e.preventDefault();
      const ar = arena.getBoundingClientRect();
      drag = { b, ox: e.clientX - ar.left - b.x, oy: e.clientY - ar.top - b.y, hist: [] };
      b.mode = 'drag'; b.vx = b.vy = b.va = 0;
      el.setPointerCapture(e.pointerId);
      kick();
    });
    arena.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const ar = arena.getBoundingClientRect();
      const b = drag.b;
      b.x = Math.max(0, Math.min(W - b.w, e.clientX - ar.left - drag.ox));
      b.y = Math.max(-H, Math.min(H - b.h, e.clientY - ar.top - drag.oy));
      const now = performance.now();
      drag.hist.push({ x: b.x, y: b.y, t: now });
      while (drag.hist.length > 2 && now - drag.hist[0].t > 90) drag.hist.shift();
      b.a = Math.max(-0.5, Math.min(0.5, (e.movementX || 0) * 0.02));
    });
    const release = () => {
      if (!drag) return;
      const b = drag.b, h = drag.hist;
      if (h.length >= 2) {
        const f = h[0], l = h[h.length - 1], dt = Math.max(0.016, (l.t - f.t) / 1000);
        b.vx = Math.max(-3000, Math.min(3000, (l.x - f.x) / dt));
        b.vy = Math.max(-3000, Math.min(3000, (l.y - f.y) / dt));
      }
      b.va = b.vx * 0.006;
      b.mode = 'free'; drag = null; kick();
    };
    arena.addEventListener('pointerup', release);
    arena.addEventListener('pointercancel', release);
    resetBtn.addEventListener('click', () => { bodies.forEach((b) => { if (b.mode !== 'home') { b.mode = 'back'; b.vx = b.vy = b.va = 0; } }); kick(); });
    // visibilidade e tamanho
    new IntersectionObserver((en) => {
      active = en[0].isIntersecting;
      if (active) { if (!reduce && en[0].intersectionRatio > 0.25) drop(); kick(); }
    }, { threshold: [0, 0.25, 0.5] }).observe(arena);
    let lw = 0;
    const relayout = () => {
      if (Math.abs(window.innerWidth - lw) < 2) return;
      lw = window.innerWidth;
      layout();
      if (!dropped && !reduce) bodies.forEach((b) => { b.y = b.hy - H - 400; paint(b); });
    };
    window.addEventListener('resize', relayout, { passive: true });
    const init = () => { relayout(); };
    if (document.fonts) document.fonts.ready.then(init); else init();
  })();
})();
