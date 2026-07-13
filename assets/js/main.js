/* Lanissima Tejidos — render del sitio (header/footer compartidos + páginas). */

const DATA_VERSION = Date.now(); // evita caché desactualizado de los JSON

async function loadJSON(path) {
  const res = await fetch(path + '?v=' + DATA_VERSION);
  if (!res.ok) throw new Error('No se pudo cargar ' + path);
  return res.json();
}

let SITE_CONFIG = null;
async function getConfig() {
  if (!SITE_CONFIG) {
    try { SITE_CONFIG = await loadJSON('data/config.json'); }
    catch (e) { SITE_CONFIG = {}; }
  }
  return SITE_CONFIG;
}

/* ------------------------------------------------------------------ header */

function renderHeader(activePage) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-top">
      <a class="brand" href="index.html">
        <img src="assets/img/logo-icon.svg" alt="Lanissima">
        <span class="brand-name">Lanissima<span data-i18n="brand.tagline"></span></span>
      </a>
      <div style="display:flex;align-items:center;gap:14px;">
        <div class="lang-switch" role="group" aria-label="Idioma / Language">
          <button type="button" data-lang="es">ES</button>
          <span aria-hidden="true">·</span>
          <button type="button" data-lang="en">EN</button>
        </div>
        <button class="nav-toggle" aria-label="Menú" aria-expanded="false">☰</button>
      </div>
    </div>
    <nav class="site-nav">
      <ul>
        <li><a href="index.html" data-i18n="nav.home" data-page="index"></a></li>
        <li><a href="patrones.html" data-i18n="nav.patterns" data-page="patrones"></a></li>
        <li><a href="videos.html" data-i18n="nav.videos" data-page="videos"></a></li>
        <li><a href="calculadora.html" data-i18n="nav.calculator" data-page="calculadora"></a></li>
        <li><a href="sobre-mi.html" data-i18n="nav.about" data-page="sobre-mi"></a></li>
      </ul>
    </nav>`;
  document.body.prepend(header);

  const active = header.querySelector(`[data-page="${activePage}"]`);
  if (active) active.classList.add('active');

  header.querySelectorAll('.lang-switch button').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('.site-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

/* ------------------------------------------------------------------ footer */

async function renderFooter() {
  const cfg = await getConfig();
  const footer = document.createElement('div');
  footer.innerHTML = `
    <section class="newsletter">
      <h2 data-i18n="newsletter.title"></h2>
      <p data-i18n="newsletter.subtitle"></p>
      <form id="newsletter-form" novalidate>
        <input type="email" name="EMAIL" data-i18n-placeholder="newsletter.placeholder" required>
        <button type="submit" data-i18n="newsletter.button"></button>
      </form>
      <p class="nl-msg" id="nl-msg"></p>
    </section>
    <footer class="site-footer">
      <div class="social" id="footer-social"></div>
      <p class="fineprint">© Lanissima Tejidos · <span data-i18n="footer.rights"></span></p>
      <p class="fineprint" data-i18n="footer.made"></p>
    </footer>`;
  document.body.append(footer);

  const social = footer.querySelector('#footer-social');
  const links = [
    ['Instagram', cfg.instagram],
    ['YouTube', cfg.youtube],
    ['TikTok', cfg.tiktok],
    ['Pinterest', cfg.pinterest],
  ].filter(([, url]) => url);
  social.innerHTML = links
    .map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`)
    .join('');

  const form = footer.querySelector('#newsletter-form');
  const msg = footer.querySelector('#nl-msg');
  if (cfg.newsletterAction) form.action = cfg.newsletterAction;
  form.addEventListener('submit', (ev) => {
    const email = form.EMAIL.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      ev.preventDefault();
      msg.textContent = t('newsletter.invalid');
      msg.classList.add('visible');
      return;
    }
    if (!cfg.newsletterAction) {
      // Sin proveedor configurado todavía: solo confirmamos localmente.
      ev.preventDefault();
      form.reset();
      msg.textContent = t('newsletter.success');
      msg.classList.add('visible');
    }
  });
}

/* --------------------------------------------------------------- patrones */

function patternCard(p, categories) {
  const cat = categories.find((c) => c.id === p.category);
  const catName = cat ? lf(cat, 'name') : '';
  const img = p.image || 'uploads/placeholder-1.svg';
  return `
    <a class="pattern-card diff-${p.difficulty}" href="patron.html?id=${encodeURIComponent(p.id)}">
      <div class="thumb">
        <img src="${img}" alt="${lf(p, 'title')}" loading="lazy"
             onerror="this.onerror=null;this.src='uploads/placeholder-1.svg'">
        <span class="badge-free">${t('patterns.free')}</span>
      </div>
      <div class="meta">
        <div class="name">${lf(p, 'title')}</div>
        <div class="sub"><span class="diff-dot"></span>${t('diff.' + p.difficulty)}${catName ? ' · ' + catName : ''}</div>
      </div>
    </a>`;
}

function sortByDate(items) {
  return [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

async function renderHome() {
  const [patterns, videos] = await Promise.all([
    loadJSON('data/patterns.json'),
    loadJSON('data/videos.json'),
  ]);

  const draw = () => {
    const featured = patterns.items.filter((p) => p.featured);
    const list = (featured.length ? featured : sortByDate(patterns.items)).slice(0, 3);
    document.getElementById('featured-grid').innerHTML =
      list.map((p) => patternCard(p, patterns.categories)).join('') ||
      `<p class="empty-note">${t('patterns.empty')}</p>`;

    document.getElementById('home-videos').innerHTML =
      sortByDate(videos.items).slice(0, 2).map(videoCard).join('') ||
      `<p class="empty-note">${t('videos.empty')}</p>`;
    wireVideoCards(document.getElementById('home-videos'));
  };
  draw();
  document.addEventListener('langchange', draw);
}

async function renderPatternsPage() {
  const data = await loadJSON('data/patterns.json');
  let activeCat = 'all';
  let activeDiff = 'all';

  const catBox = document.getElementById('filter-categories');
  const diffBox = document.getElementById('filter-difficulty');
  const grid = document.getElementById('patterns-grid');

  const draw = () => {
    catBox.innerHTML =
      `<button class="chip ${activeCat === 'all' ? 'active' : ''}" data-cat="all">${t('patterns.all')}</button>` +
      data.categories
        .map((c) => `<button class="chip ${activeCat === c.id ? 'active' : ''}" data-cat="${c.id}">${lf(c, 'name')}</button>`)
        .join('');

    diffBox.innerHTML = ['all', 'principiante', 'intermedio', 'avanzado']
      .map((d) => `<button class="chip ${activeDiff === d ? 'active' : ''}" data-diff="${d}">${d === 'all' ? t('patterns.all') : t('diff.' + d)}</button>`)
      .join('');

    const items = sortByDate(data.items).filter(
      (p) => (activeCat === 'all' || p.category === activeCat) &&
             (activeDiff === 'all' || p.difficulty === activeDiff)
    );
    grid.innerHTML = items.map((p) => patternCard(p, data.categories)).join('') ||
      `<p class="empty-note">${t('patterns.empty')}</p>`;
  };

  catBox.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-cat]');
    if (b) { activeCat = b.dataset.cat; draw(); }
  });
  diffBox.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-diff]');
    if (b) { activeDiff = b.dataset.diff; draw(); }
  });

  draw();
  document.addEventListener('langchange', draw);
}

async function renderPatternDetail() {
  const data = await loadJSON('data/patterns.json');
  const id = new URLSearchParams(location.search).get('id');
  const p = data.items.find((x) => x.id === id);
  const box = document.getElementById('pattern-detail');

  const draw = () => {
    if (!p) {
      box.innerHTML = `<p class="empty-note" style="grid-column:1/-1">${t('pattern.notFound')}</p>`;
      return;
    }
    document.title = lf(p, 'title') + ' — Lanissima Tejidos';
    const cat = data.categories.find((c) => c.id === p.category);
    const img = p.image || 'uploads/placeholder-1.svg';

    const buttons = [];
    if (p.pdf) buttons.push(`<a class="btn btn-solid" href="${p.pdf}" download>${t('pattern.download')}</a>`);
    if (p.pdf_en) buttons.push(`<a class="btn" href="${p.pdf_en}" download>${t('pattern.downloadEn')}</a>`);

    box.innerHTML = `
      <div class="photo">
        <img src="${img}" alt="${lf(p, 'title')}"
             onerror="this.onerror=null;this.src='uploads/placeholder-1.svg'">
      </div>
      <div class="info diff-${p.difficulty}">
        <h1>${lf(p, 'title')}</h1>
        <p class="tags"><span class="diff-dot"></span>${t('diff.' + p.difficulty)}${cat ? ' · ' + lf(cat, 'name') : ''}</p>
        <p class="price">${t('pattern.free')}</p>
        <p class="desc">${lf(p, 'desc')}</p>
        <div class="download-buttons">
          ${buttons.join('') || `<p class="empty-note" style="padding:0">${t('pattern.noPdf')}</p>`}
        </div>
        <a class="back-link" href="patrones.html">${t('pattern.back')}</a>
      </div>`;
  };
  draw();
  document.addEventListener('langchange', draw);
}

/* ----------------------------------------------------------------- videos */

function videoCard(v) {
  const thumb = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;
  return `
    <div class="video-card" data-yt="${v.youtubeId}">
      <div class="frame" role="button" tabindex="0" aria-label="${lf(v, 'title')}">
        <img src="${thumb}" alt="${lf(v, 'title')}" loading="lazy"
             onerror="this.onerror=null;this.src='uploads/placeholder-1.svg'">
        <span class="play-btn" aria-hidden="true"></span>
      </div>
      <div class="name">${lf(v, 'title')}</div>
    </div>`;
}

function wireVideoCards(root) {
  root.querySelectorAll('.video-card .frame').forEach((frame) => {
    const play = () => {
      const id = frame.closest('.video-card').dataset.yt;
      frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1"
        title="YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    };
    frame.addEventListener('click', play, { once: true });
    frame.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); play(); }
    }, { once: true });
  });
}

async function renderVideosPage() {
  const data = await loadJSON('data/videos.json');
  const grid = document.getElementById('videos-grid');
  const draw = () => {
    grid.innerHTML = sortByDate(data.items).map(videoCard).join('') ||
      `<p class="empty-note">${t('videos.empty')}</p>`;
    wireVideoCards(grid);
  };
  draw();
  document.addEventListener('langchange', draw);
}

/* ------------------------------------------------------------------- init */

async function initPage(page) {
  document.documentElement.lang = getLang();
  renderHeader(page);
  await renderFooter();
  applyI18n();

  try {
    if (page === 'index') await renderHome();
    if (page === 'patrones') await renderPatternsPage();
    if (page === 'patron') await renderPatternDetail();
    if (page === 'videos') await renderVideosPage();
  } catch (err) {
    console.error(err);
  }
  applyI18n();
}
