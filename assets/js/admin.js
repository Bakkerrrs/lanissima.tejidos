/* Panel de administración de Lanissima Tejidos.
 *
 * Funciona sin backend: guarda el contenido directamente en este repositorio
 * de GitHub usando la API REST con un Fine-grained Personal Access Token
 * (permiso "Contents: Read and write" solo sobre este repositorio).
 * El token queda guardado únicamente en el navegador (localStorage).
 */

const ADMIN = {
  owner: 'Bakkerrrs',
  repo: 'lanissima.tejidos',
  basePath: '', // el sitio vive en la raíz del repo
  state: { patterns: null, videos: null, config: null, shas: {}, editing: null },
};

/* ------------------------------------------------------------- utilidades */

function adminSettings() {
  try { return JSON.parse(localStorage.getItem('lanissima-admin') || '{}'); }
  catch (e) { return {}; }
}

function saveAdminSettings(s) {
  localStorage.setItem('lanissima-admin', JSON.stringify(s));
}

function showStatus(msg, isError) {
  const el = document.getElementById('admin-status');
  el.textContent = msg;
  el.classList.toggle('error', !!isError);
  el.classList.add('visible');
  clearTimeout(showStatus._t);
  showStatus._t = setTimeout(() => el.classList.remove('visible'), isError ? 8000 : 4000);
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'item';
}

function b64EncodeUtf8(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function b64DecodeUtf8(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ---------------------------------------------------------- API de GitHub */

async function gh(path, options = {}) {
  const { token } = adminSettings();
  const res = await fetch(`https://api.github.com/repos/${ADMIN.owner}/${ADMIN.repo}/${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`GitHub ${res.status}: ${body.message || res.statusText}`);
  }
  return res.json();
}

function branch() {
  return adminSettings().branch || 'main';
}

async function ghGetFile(sitePath) {
  return gh(`contents/${ADMIN.basePath}${sitePath}?ref=${encodeURIComponent(branch())}`);
}

async function ghPutFile(sitePath, base64Content, message, sha) {
  return gh(`contents/${ADMIN.basePath}${sitePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: branch(),
      ...(sha ? { sha } : {}),
    }),
  });
}

async function loadDataFile(name) {
  const file = await ghGetFile(`data/${name}.json`);
  ADMIN.state.shas[name] = file.sha;
  return JSON.parse(b64DecodeUtf8(file.content.replace(/\n/g, '')));
}

async function saveDataFile(name, data, message) {
  const res = await ghPutFile(
    `data/${name}.json`,
    b64EncodeUtf8(JSON.stringify(data, null, 2) + '\n'),
    message,
    ADMIN.state.shas[name]
  );
  ADMIN.state.shas[name] = res.content.sha;
}

async function uploadBinary(sitePath, file, message) {
  const content = await fileToBase64(file);
  let sha;
  try { sha = (await ghGetFile(sitePath)).sha; } catch (e) { /* archivo nuevo */ }
  await ghPutFile(sitePath, content, message, sha);
  return sitePath;
}

/* ----------------------------------------------------------------- login */

async function adminLogin() {
  const token = document.getElementById('token-input').value.trim();
  const branchName = document.getElementById('branch-input').value.trim() || 'main';
  if (!token) { showStatus('Pega tu token de GitHub primero.', true); return; }
  saveAdminSettings({ token, branch: branchName });
  try {
    await bootAdmin();
  } catch (err) {
    showStatus('No se pudo conectar: ' + err.message, true);
    localStorage.removeItem('lanissima-admin');
  }
}

function adminLogout() {
  localStorage.removeItem('lanissima-admin');
  location.reload();
}

async function bootAdmin() {
  showStatus('Conectando con GitHub…');
  const [patterns, videos, config] = await Promise.all([
    loadDataFile('patterns'),
    loadDataFile('videos'),
    loadDataFile('config'),
  ]);
  ADMIN.state.patterns = patterns;
  ADMIN.state.videos = videos;
  ADMIN.state.config = config;

  document.getElementById('login-card').style.display = 'none';
  document.getElementById('admin-panels').style.display = 'block';
  showStatus('Conectado ✓');
  renderAdminPatterns();
  renderAdminVideos();
  renderAdminConfig();
}

/* -------------------------------------------------------------- patrones */

function renderAdminPatterns() {
  const { patterns } = ADMIN.state;
  const list = document.getElementById('patterns-list');
  list.innerHTML = patterns.items.map((p, i) => `
    <li>
      <img src="${p.image || 'uploads/placeholder-1.svg'}" alt=""
           onerror="this.onerror=null;this.src='uploads/placeholder-1.svg'">
      <div class="grow">
        <div class="title">${p.title_es}${p.featured ? ' ⭐' : ''}</div>
        <div class="sub">${p.category} · ${p.difficulty} · ${p.pdf ? 'PDF ✓' : 'sin PDF'}</div>
      </div>
      <button class="btn-small" data-edit="${i}">Editar</button>
      <button class="btn-small danger" data-del="${i}">Eliminar</button>
    </li>`).join('') || '<li><div class="grow sub">Aún no hay patrones.</div></li>';

  const catSel = document.querySelector('#pattern-form [name=category]');
  catSel.innerHTML = patterns.categories
    .map((c) => `<option value="${c.id}">${c.name_es}</option>`)
    .join('');
}

function fillPatternForm(p) {
  const f = document.getElementById('pattern-form');
  f.title_es.value = p ? p.title_es : '';
  f.title_en.value = p ? p.title_en || '' : '';
  f.desc_es.value = p ? p.desc_es || '' : '';
  f.desc_en.value = p ? p.desc_en || '' : '';
  f.category.value = p ? p.category : f.category.value;
  f.difficulty.value = p ? p.difficulty : 'principiante';
  f.featured.checked = p ? !!p.featured : false;
  f.image.value = '';
  f.pdf.value = '';
  f.pdf_en.value = '';
  document.getElementById('pattern-form-title').textContent =
    p ? `Editando: ${p.title_es}` : 'Nuevo patrón';
  document.getElementById('pattern-cancel').style.display = p ? 'inline-block' : 'none';
}

async function submitPatternForm(ev) {
  ev.preventDefault();
  const f = ev.target;
  const { patterns } = ADMIN.state;
  const editing = ADMIN.state.editing;
  const isNew = editing === null;

  const item = isNew
    ? { id: '', title_es: '', title_en: '', desc_es: '', desc_en: '',
        category: '', difficulty: '', image: '', pdf: '', pdf_en: '',
        date: new Date().toISOString().slice(0, 10), featured: false }
    : patterns.items[editing];

  item.title_es = f.title_es.value.trim();
  item.title_en = f.title_en.value.trim() || item.title_es;
  item.desc_es = f.desc_es.value.trim();
  item.desc_en = f.desc_en.value.trim() || item.desc_es;
  item.category = f.category.value;
  item.difficulty = f.difficulty.value;
  item.featured = f.featured.checked;
  if (!item.id) item.id = slugify(item.title_es) + '-' + Math.random().toString(36).slice(2, 6);

  try {
    showStatus('Guardando…');
    if (f.image.files[0]) {
      const ext = (f.image.files[0].name.split('.').pop() || 'jpg').toLowerCase();
      item.image = await uploadBinary(`uploads/${item.id}.${ext}`, f.image.files[0],
        `Foto del patrón ${item.title_es}`);
    }
    if (f.pdf.files[0]) {
      item.pdf = await uploadBinary(`patterns/${item.id}-es.pdf`, f.pdf.files[0],
        `PDF (ES) del patrón ${item.title_es}`);
    }
    if (f.pdf_en.files[0]) {
      item.pdf_en = await uploadBinary(`patterns/${item.id}-en.pdf`, f.pdf_en.files[0],
        `PDF (EN) del patrón ${item.title_es}`);
    }
    if (isNew) patterns.items.unshift(item);
    await saveDataFile('patterns', patterns,
      `${isNew ? 'Nuevo patrón' : 'Actualiza patrón'}: ${item.title_es}`);
    ADMIN.state.editing = null;
    fillPatternForm(null);
    renderAdminPatterns();
    showStatus('Patrón guardado ✓ (el sitio se actualizará en 1-2 minutos)');
  } catch (err) {
    showStatus('Error al guardar: ' + err.message, true);
  }
}

async function deletePattern(index) {
  const { patterns } = ADMIN.state;
  const p = patterns.items[index];
  if (!confirm(`¿Eliminar el patrón "${p.title_es}"?`)) return;
  patterns.items.splice(index, 1);
  try {
    showStatus('Eliminando…');
    await saveDataFile('patterns', patterns, `Elimina patrón: ${p.title_es}`);
    renderAdminPatterns();
    showStatus('Patrón eliminado ✓');
  } catch (err) {
    showStatus('Error: ' + err.message, true);
  }
}

/* ---------------------------------------------------------------- videos */

function youtubeIdFromUrl(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,20})/);
  return m ? m[1] : (/^[\w-]{6,20}$/.test(url.trim()) ? url.trim() : null);
}

function renderAdminVideos() {
  const { videos } = ADMIN.state;
  const list = document.getElementById('videos-list');
  list.innerHTML = videos.items.map((v, i) => `
    <li>
      <img src="https://i.ytimg.com/vi/${v.youtubeId}/default.jpg" alt=""
           onerror="this.onerror=null;this.src='uploads/placeholder-1.svg'">
      <div class="grow">
        <div class="title">${v.title_es}</div>
        <div class="sub">youtube.com/watch?v=${v.youtubeId}</div>
      </div>
      <button class="btn-small danger" data-del-video="${i}">Eliminar</button>
    </li>`).join('') || '<li><div class="grow sub">Aún no hay videos.</div></li>';
}

async function submitVideoForm(ev) {
  ev.preventDefault();
  const f = ev.target;
  const id = youtubeIdFromUrl(f.url.value);
  if (!id) { showStatus('No reconozco esa URL de YouTube.', true); return; }
  const { videos } = ADMIN.state;
  videos.items.unshift({
    id: 'v-' + Math.random().toString(36).slice(2, 8),
    youtubeId: id,
    title_es: f.title_es.value.trim() || 'Video',
    title_en: f.title_en.value.trim() || f.title_es.value.trim() || 'Video',
    date: new Date().toISOString().slice(0, 10),
  });
  try {
    showStatus('Guardando…');
    await saveDataFile('videos', videos, `Nuevo video: ${f.title_es.value.trim()}`);
    f.reset();
    renderAdminVideos();
    showStatus('Video guardado ✓ (el sitio se actualizará en 1-2 minutos)');
  } catch (err) {
    videos.items.shift();
    showStatus('Error al guardar: ' + err.message, true);
  }
}

async function deleteVideo(index) {
  const { videos } = ADMIN.state;
  const v = videos.items[index];
  if (!confirm(`¿Eliminar el video "${v.title_es}"?`)) return;
  videos.items.splice(index, 1);
  try {
    showStatus('Eliminando…');
    await saveDataFile('videos', videos, `Elimina video: ${v.title_es}`);
    renderAdminVideos();
    showStatus('Video eliminado ✓');
  } catch (err) {
    showStatus('Error: ' + err.message, true);
  }
}

/* ---------------------------------------------------------------- config */

function renderAdminConfig() {
  const f = document.getElementById('config-form');
  const c = ADMIN.state.config;
  f.instagram.value = c.instagram || '';
  f.youtube.value = c.youtube || '';
  f.tiktok.value = c.tiktok || '';
  f.pinterest.value = c.pinterest || '';
  f.newsletterAction.value = c.newsletterAction || '';
}

async function submitConfigForm(ev) {
  ev.preventDefault();
  const f = ev.target;
  const c = ADMIN.state.config;
  c.instagram = f.instagram.value.trim();
  c.youtube = f.youtube.value.trim();
  c.tiktok = f.tiktok.value.trim();
  c.pinterest = f.pinterest.value.trim();
  c.newsletterAction = f.newsletterAction.value.trim();
  try {
    showStatus('Guardando…');
    await saveDataFile('config', c, 'Actualiza configuración del sitio');
    showStatus('Configuración guardada ✓');
  } catch (err) {
    showStatus('Error: ' + err.message, true);
  }
}

/* ------------------------------------------------------------------ init */

function initAdmin() {
  document.getElementById('login-btn').addEventListener('click', adminLogin);
  document.getElementById('logout-btn').addEventListener('click', adminLogout);
  document.getElementById('pattern-form').addEventListener('submit', submitPatternForm);
  document.getElementById('video-form').addEventListener('submit', submitVideoForm);
  document.getElementById('config-form').addEventListener('submit', submitConfigForm);

  document.getElementById('pattern-cancel').addEventListener('click', () => {
    ADMIN.state.editing = null;
    fillPatternForm(null);
  });

  document.getElementById('patterns-list').addEventListener('click', (ev) => {
    const edit = ev.target.closest('[data-edit]');
    const del = ev.target.closest('[data-del]');
    if (edit) {
      ADMIN.state.editing = Number(edit.dataset.edit);
      fillPatternForm(ADMIN.state.patterns.items[ADMIN.state.editing]);
      document.getElementById('pattern-form').scrollIntoView({ behavior: 'smooth' });
    }
    if (del) deletePattern(Number(del.dataset.del));
  });

  document.getElementById('videos-list').addEventListener('click', (ev) => {
    const del = ev.target.closest('[data-del-video]');
    if (del) deleteVideo(Number(del.dataset.delVideo));
  });

  // Tabs
  document.querySelectorAll('.admin-tabs .chip').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs .chip').forEach((x) => x.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.admin-panel').forEach((p) => {
        p.style.display = p.id === 'panel-' + tab.dataset.tab ? 'block' : 'none';
      });
    });
  });

  const { token } = adminSettings();
  if (token) {
    document.getElementById('branch-input').value = adminSettings().branch || 'main';
    bootAdmin().catch((err) => {
      showStatus('Sesión expirada o sin acceso: ' + err.message, true);
      document.getElementById('login-card').style.display = 'block';
    });
  }
}
