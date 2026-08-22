/* ==========================================================================
   N's Hotel · Vorlagen-Zentrale — App-Kern
   Router (Hash), Hub, Editor mit automatisch erzeugtem Formular,
   Live-Vorschau, Speicherung und Export.
   ========================================================================== */
import { TEMPLATES, ORDER, GROUPS } from './templates/index.js';
import { esc, e, qs } from './lib/dom.js';
import { logo } from './lib/brand.js';
import { t, getLang, setLang } from './lib/i18n.js';
import * as store from './lib/storage.js';
import { setPageSize, printSheet, sheetToPng, downloadBlob } from './lib/export.js';
import { teilenKodieren, teilenLesen, teilenAdresse, teilenKopieren, TEILEN_MAX } from './lib/teilen.js';
import { lesbarkeit } from './lib/lesbarkeit.js';
import { kontrastBefund } from './lib/kontrast.js';

const PAGE_MAX_H = { 'a4':1123, 'a4-land':794, 'a5':794, 'a5-land':559,
                     'a3':1587, 'a3-land':1123, 'letter':1056, 'letter-land':816 };

/* Interaktive Vorlagen (z. B. der Plan-Editor) geben beim Einhaengen eine
   Aufraeum-Funktion zurueck. Sie wird vor dem naechsten Zeichnen aufgerufen. */
let activeUnmount = null;
function unmountActive(){
  if (activeUnmount){ try{ activeUnmount(); }catch(err){ console.warn(err); } activeUnmount = null; }
}

/** Papierformat einer Vorlage — kann vom Zustand abhaengen (Plan-Editor). */
function pageOf(tpl, state){
  return (typeof tpl.pageOf === 'function' ? tpl.pageOf(state) : tpl.page) || 'a4';
}
/** Ist die Vorlage gerade mehrseitig? Darf vom Zustand abhaengen — der
    Hinweis-Aushang wird es erst, wenn eine Serie ueber mehrere Objekte
    gewaehlt ist. */
function istMehrseitig(tpl, state){
  return Boolean(typeof tpl.multipage === 'function' ? tpl.multipage(state) : tpl.multipage);
}

/** Die druckbaren Seiten eines Blattes — einseitig ist das Blatt selbst. */
function sheetPages(sheet){
  const pages = Array.from(sheet.querySelectorAll('[data-page]'));
  return pages.length ? pages : [sheet];
}

const view = () => document.getElementById('vz-view');

/* ---------- Zustand einer Vorlage ---------------------------------------- */
function draftKey(id){ return 'draft:' + id; }

function loadState(tpl){
  const saved = store.load(draftKey(tpl.id), null);
  return Object.assign({}, structuredClone(tpl.defaults), saved || {});
}
function saveState(tpl, state){ store.save(draftKey(tpl.id), state); }

/* ---------- Topbar ------------------------------------------------------- */
function mountTopbar(){
  const bar = qs('.vz-topbar');
  bar.innerHTML = `
    <button class="vz-brand" id="vz-home" title="${esc(t('back'))}">
      ${logo('white', 30)}
      <span class="vz-brand-txt">${esc(t('tagline'))}<small>Hans Amonn AG · Kerzers</small></span>
    </button>
    <span class="vz-top-spacer"></span>
    <div class="vz-lang" role="group" aria-label="Sprache">
      <button data-lang="de" aria-pressed="${getLang() === 'de'}">DE</button>
      <button data-lang="en" aria-pressed="${getLang() === 'en'}">EN</button>
    </div>`;
  qs('#vz-home', bar).onclick = () => { location.hash = '#/'; };
  bar.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = () => { setLang(b.dataset.lang); mountTopbar(); route(); };
  });
}

/* ---------- Hub ---------------------------------------------------------- */
function renderHub(){
  setPageSize('a4');
  const groups = GROUPS.map(g => {
    const cards = g.ids.map(id => {
      const tpl = TEMPLATES[id];
      if (!tpl) return `
        <div class="vz-card vz-card--soon">
          <div class="vz-thumb"><span class="vz-badge vz-badge--soon">${esc(t('soon'))}</span></div>
          <div class="vz-card-body"><h3>${esc(id)}</h3><p>${esc(t('soon'))}</p></div>
        </div>`;
      return `
        <button class="vz-card" data-id="${esc(id)}">
          <div class="vz-thumb">
            <span class="vz-badge${tpl.badgeCyan ? ' vz-badge--cyan' : ''}">${esc(tpl.badge || '')}</span>
            ${tpl.thumb || ''}
          </div>
          <div class="vz-card-body">
            <h3>${esc(tpl.title)}</h3>
            <p>${esc(tpl.sub || '')}</p>
          </div>
        </button>`;
    }).join('');
    return `<section class="vz-group" id="kat-${esc(g.id || '')}">
      <h2>${esc(g.title)}</h2>
      ${g.note ? `<p class="vz-group-note">${esc(g.note)}</p>` : ''}
      <div class="vz-cards">${cards}</div></section>`;
  }).join('');

  view().innerHTML = `
    <div class="vz-hub">
      <header class="vz-hero">
        <p class="eyebrow">${esc(t('heroEyebrow'))}</p>
        <h1>${esc(t('heroTitle'))}</h1>
        <p>${esc(t('heroLede'))}</p>
      </header>
      ${groups}
      <section class="vz-group">
        <h2>${esc(t('help'))}</h2>
        <div style="background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px 22px;
             font-size:13px;line-height:1.7;color:var(--ink-soft);max-width:74ch">
          <b style="color:var(--navy)">1.</b> Vorlage anklicken &nbsp;·&nbsp;
          <b style="color:var(--navy)">2.</b> links Texte anpassen &nbsp;·&nbsp;
          <b style="color:var(--navy)">3.</b> <b style="color:var(--navy)">Drucken / PDF</b> wählen.<br>
          Im Druckdialog <b>Ränder: keine</b> und <b>Hintergrundgrafiken: ein</b> einstellen.
          Aenderungen bleiben im Browser gespeichert, bis jemand <b>Zurücksetzen</b> drückt —
          jede Person am eigenen Gerät. Ein fertiges Blatt geht mit
          <b>Link teilen</b> an die anderen: die Adresse trägt den ganzen Aushang.
        </div>
      </section>
    </div>`;

  view().querySelectorAll('.vz-card[data-id]').forEach(c => {
    c.onclick = () => { location.hash = '#/t/' + c.dataset.id; };
  });
}

/* ---------- Formular-Erzeugung ------------------------------------------- */
function fieldHtml(f, value, path){
  const id = 'f-' + path.replace(/\./g, '-');
  const hint = f.hint ? `<span class="vz-hint">${f.hint}</span>` : '';
  const lbl = `<label for="${id}">${esc(f.label || f.k)}</label>`;
  const v = value == null ? '' : value;

  switch (f.type){
    case 'textarea':
      return `<div class="vz-field">${lbl}
        <textarea id="${id}" data-path="${esc(path)}" rows="${f.rows || 3}">${esc(v)}</textarea>${hint}</div>`;
    case 'number':
      return `<div class="vz-field">${lbl}
        <input id="${id}" type="number" data-path="${esc(path)}" value="${esc(v)}"
          ${f.min != null ? `min="${f.min}"` : ''} ${f.max != null ? `max="${f.max}"` : ''}
          ${f.step != null ? `step="${f.step}"` : ''}>${hint}</div>`;
    case 'select':
      return `<div class="vz-field">${lbl}
        <select id="${id}" data-path="${esc(path)}">${
          (f.options || []).map(o => `<option value="${esc(o.v)}"${String(o.v) === String(v) ? ' selected' : ''}>${esc(o.t)}</option>`).join('')
        }</select>${hint}</div>`;
    case 'color':
      return `<div class="vz-field vz-field--color">
        <input id="${id}" type="color" data-path="${esc(path)}" value="${esc(v || '#2A3350')}">${lbl}</div>`;
    case 'image':
      return imageFieldHtml(f, v, path, id);
    case 'checks':
      /* Mehrfachauswahl als Kästchen — der Zustand ist ein Array von Werten.
         Gebraucht für die Sprachen eines Aushangs. */
      return `<div class="vz-field"><label>${esc(f.label || f.k)}</label>
        <div class="vz-checks" data-checks="${esc(path)}">${
          (f.options || []).map(o => {
            const an = Array.isArray(v) ? v.includes(o.v) : String(v) === String(o.v);
            return `<label class="vz-check${an ? ' is-on' : ''}">
              <input type="checkbox" value="${esc(o.v)}"${an ? ' checked' : ''}>
              <span>${esc(o.t)}</span></label>`;
          }).join('')
        }</div>${hint}</div>`;
    case 'action':
      /* Knopf, der eine in der Vorlage hinterlegte Funktion auf den Zustand
         anwendet — z. B. einen fertigen Textbaustein übernehmen. */
      return `<div class="vz-field">
        <button type="button" class="vz-btn vz-btn--sm" data-action="${esc(f.k)}">${esc(f.label)}</button>
        ${hint}</div>`;
    default:
      return `<div class="vz-field">${lbl}
        <input id="${id}" type="text" data-path="${esc(path)}" value="${esc(v)}">${hint}</div>`;
  }
}

function imageFieldHtml(f, v, path, id){
  return `<div class="vz-field">
    <label for="${id}">${esc(f.label || f.k)}</label>
    <div class="vz-img" data-imgslot="${esc(path)}">
      ${v ? `<img class="vz-img-prev" src="${esc(v)}" alt="">` : ''}
      <div class="vz-img-txt">${v ? esc(t('imgChange')) : esc(t('imgDrop'))}</div>
      <input id="${id}" type="file" accept="image/*">
    </div>
    ${v ? `<button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" data-imgclear="${esc(path)}">${esc(t('imgRemove'))}</button>` : ''}
    ${f.hint ? `<span class="vz-hint">${f.hint}</span>` : ''}
  </div>`;
}

function listHtml(f, arr, base){
  const items = (arr || []).map((item, i) => `
    <div class="vz-item" data-item="${i}">
      <div class="vz-item-head">
        <span>${esc(f.itemLabel || t('row'))} ${i + 1}</span>
        <div class="vz-item-btns">
          <button type="button" class="vz-mini" data-move="${i}" data-dir="-1" title="nach oben">&#8593;</button>
          <button type="button" class="vz-mini" data-move="${i}" data-dir="1" title="nach unten">&#8595;</button>
          <button type="button" class="vz-mini vz-mini--del" data-del="${i}" title="löschen">&#215;</button>
        </div>
      </div>
      ${f.item.map(sf => fieldHtml(sf, item[sf.k], `${base}.${i}.${sf.k}`)).join('')}
    </div>`).join('');
  const canAdd = !f.max || (arr || []).length < f.max;
  return `<div class="vz-field"><label>${esc(f.label)}</label>
    <div class="vz-list" data-list="${esc(base)}">${items}</div>
    ${canAdd ? `<button type="button" class="vz-btn vz-btn--sm" data-add="${esc(base)}" style="margin-top:8px">+ ${esc(t('add'))}</button>` : ''}
    ${f.hint ? `<span class="vz-hint">${f.hint}</span>` : ''}</div>`;
}

function buildForm(tpl, state){
  return tpl.fields.map(f => {
    if (f.t === 'group') return `<div class="vz-fgroup">${esc(f.label)}</div>`;
    if (f.t === 'note')  return `<p class="vz-hint" style="margin:0">${f.label}</p>`;
    if (f.type === 'list') return listHtml(f, getPath(state, f.k), f.k);
    return fieldHtml(f, getPath(state, f.k), f.k);
  }).join('');
}

/* Pfad "rows.2.de" im Zustand lesen. */
function getPath(state, path){
  return String(path).split('.').reduce((n, k) => (n == null ? n : n[k]), state);
}

/* Pfad "rows.2.de" im Zustand setzen. */
function setPath(state, path, value){
  const parts = path.split('.');
  let node = state;
  for (let i = 0; i < parts.length - 1; i++){
    const key = parts[i];
    if (node[key] == null) node[key] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    node = node[key];
  }
  node[parts[parts.length - 1]] = value;
}

/* ---------- Editor -------------------------------------------------------- */
function renderEditor(id, geteilt){
  const tpl = TEMPLATES[id];
  if (!tpl){ view().innerHTML = `<div class="vz-hub"><p>${esc(t('notFound'))}</p></div>`; return; }
  if (geteilt){ uebernehmeGeteilt(tpl, geteilt); return; }

  const state = loadState(tpl);
  unmountActive();
  setPageSize(pageOf(tpl, state));

  view().innerHTML = `
    <div class="vz-editor">
      <aside class="vz-panel no-print">
        <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-back">&#8592; ${esc(t('back'))}</button>
        <div class="vz-panel-head">
          <h2>${esc(tpl.title)}</h2>
          <p>${esc(tpl.sub || '')}</p>
        </div>
        <div class="vz-actions">
          <button class="vz-btn vz-btn--navy" id="vz-print">${esc(t('print'))}</button>
          <button class="vz-btn" id="vz-png">${esc(t('png'))}</button>
          <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-share">${esc(t('share'))}</button>
          <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-json-save">${esc(t('saveJson'))}</button>
          <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-json-load">${esc(t('loadJson'))}</button>
          <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-reset">${esc(t('reset'))}</button>
          <input type="file" id="vz-json-file" accept="application/json" hidden>
        </div>
        <div class="vz-fit vz-fit--ok" id="vz-fit"></div>
        ${tpl.fern ? '<div class="vz-fern" id="vz-fern"></div>' : ''}
        ${tpl.fern ? '<div class="vz-kontrast" id="vz-kontrast"></div>' : ''}
        <div class="vz-extra" id="vz-extra"></div>
        <div class="vz-form" id="vz-form">${buildForm(tpl, state)}</div>
      </aside>
      <div class="vz-stage" id="vz-stage">
        <div class="vz-scaler" id="vz-scaler">
          <div class="sheet sheet--${esc(pageOf(tpl, state))}${istMehrseitig(tpl, state) ? ' sheet--multi' : ''} ${esc(tpl.root)}" id="vz-sheet"></div>
        </div>
      </div>
    </div>`;

  const form   = document.getElementById('vz-form');
  const sheet  = document.getElementById('vz-sheet');
  const scaler = document.getElementById('vz-scaler');
  const fitBox = document.getElementById('vz-fit');

  function paint(){
    unmountActive();
    const page = pageOf(tpl, state);
    sheet.className = `sheet sheet--${page} ${istMehrseitig(tpl, state) ? 'sheet--multi ' : ''}${tpl.root}`;
    setPageSize(page);
    sheet.innerHTML = tpl.render(state);
    if (typeof tpl.mount === 'function'){
      activeUnmount = tpl.mount({
        sheet,
        panel: document.getElementById('vz-extra'),
        state,
        /* Nur sichern — ohne Neuzeichnen, damit das Ziehen fluessig bleibt. */
        save: () => saveState(tpl, state),
        /* Alles neu zeichnen, z. B. nach einem Formatwechsel. */
        repaint: () => { saveState(tpl, state); paint(); }
      }) || null;
    }
    fitScaler();
    checkFit();
    checkFern();
    checkKontrast();
  }
  function fitScaler(){
    const stage = document.getElementById('vz-stage');
    if (!stage) return;
    const avail = stage.clientWidth - 56;
    const s = Math.min(1, avail / sheet.offsetWidth);
    scaler.style.transform = `scale(${s})`;
    scaler.style.height = (sheet.offsetHeight * s) + 'px';
    scaler.style.width  = sheet.offsetWidth + 'px';
  }
  function checkFit(){
    const max = PAGE_MAX_H[pageOf(tpl, state)] || 1123;
    /* Mehrseitige Vorlagen: jede Seite einzeln pruefen, nicht die Gesamthoehe. */
    const pages = sheetPages(sheet);
    const worst = pages.reduce((acc, el, i) =>
      (el.offsetHeight > acc.h ? { h: el.offsetHeight, i } : acc), { h: 0, i: 0 });
    const ok = worst.h <= max + 1;
    fitBox.className = 'vz-fit ' + (ok ? 'vz-fit--ok' : 'vz-fit--warn');
    const where = (pages.length > 1 && !ok) ? ` · ${t('pageWord')} ${worst.i + 1}` : '';
    fitBox.textContent = (ok ? '✓ ' : '⚠ ') + (ok ? t('fitOk') : t('fitWarn')) +
      `  (${Math.round(worst.h)} / ${max} px${where})`;
  }
  /* Leseabstand der groessten Schrift — nur bei Vorlagen mit `fern:true`. */
  function checkFern(){
    const box = document.getElementById('vz-fern');
    if (!box) return;
    const b = lesbarkeit(sheetPages(sheet)[0]);
    box.className = 'vz-fern vz-fern--' + b.stufe;
    box.textContent = '\u2194 ' + b.text;
    box.title = 'Faustregel der Beschilderung: n\u00f6tige x-H\u00f6he in mm = Leseabstand in m \u00d7 2,5. '
              + 'Gilt f\u00fcr gutes Licht und geraden Blick.';
  }

  /* Schwächster Schrift-Grund-Kontrast auf dem Blatt. Nur melden, wenn er
     unter der Schwelle liegt — sonst wäre die Leiste nur Rauschen. */
  function checkKontrast(){
    const box = document.getElementById('vz-kontrast');
    if (!box) return;
    const b = kontrastBefund(sheetPages(sheet)[0]);
    if (!b || b.ok){ box.className = 'vz-kontrast'; box.textContent = ''; return; }
    box.className = 'vz-kontrast is-warn';
    box.textContent = `\u25D1 Schwacher Kontrast ${b.wert}:1 (n\u00f6tig ${b.noetig}:1) — \u00ab${b.text}\u00bb`;
    box.title = 'Gepr\u00fcft nach der Kontrastformel der WCAG, Stufe AA. '
              + 'Auf Papier und bei schwachem Licht wirkt es noch flauer als am Bildschirm.';
  }

  function commit(){ saveState(tpl, state); paint(); }

  /* Live-Bindung: nur die Vorschau neu zeichnen, damit der Fokus bleibt. */
  form.addEventListener('input', ev => {
    const el = ev.target.closest('[data-path]');
    if (!el) return;
    const val = el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value;
    setPath(state, el.dataset.path, val);
    commit();
  });
  form.addEventListener('change', ev => {
    const el = ev.target.closest('[data-path]');
    if (el && (el.tagName === 'SELECT' || el.type === 'color')){
      setPath(state, el.dataset.path, el.value);
      commit();
      return;
    }
    const slot = ev.target.closest('[data-imgslot]');
    if (slot && ev.target.files && ev.target.files[0]) readImage(ev.target.files[0], slot.dataset.imgslot);
  });

  /* Bild: Drag & Drop + Klick */
  form.addEventListener('click', ev => {
    const slot = ev.target.closest('[data-imgslot]');
    if (slot && ev.target.tagName !== 'INPUT'){ slot.querySelector('input').click(); return; }

    const clear = ev.target.closest('[data-imgclear]');
    if (clear){ setPath(state, clear.dataset.imgclear, ''); commit(); rebuild(); return; }

    /* Knopf einer Vorlagen-Aktion, z. B. "Baustein übernehmen". Die Funktion
       gibt einen neuen Zustand zurück; das Formular wird danach neu gezeichnet,
       damit die überschriebenen Felder sichtbar werden. */
    const act = ev.target.closest('[data-action]');
    if (act){
      const fn = tpl.actions && tpl.actions[act.dataset.action];
      if (typeof fn === 'function'){
        const next = fn({ ...state });
        if (next && typeof next === 'object'){
          Object.keys(state).forEach(k => { delete state[k]; });
          Object.assign(state, next);
          commit(); rebuild();
        }
      }
      return;
    }

    /* Kästchen einer Mehrfachauswahl. Der Zustand wird komplett aus den
       angehakten Kästchen neu gebildet — so bleibt die Reihenfolge die des
       Formulars und nicht die des Anklickens. */
    const box = ev.target.closest('[data-checks]');
    if (box && ev.target.tagName === 'INPUT'){
      const werte = Array.from(box.querySelectorAll('input:checked')).map(i => i.value);
      setPath(state, box.dataset.checks, werte);
      box.querySelectorAll('.vz-check').forEach(l =>
        l.classList.toggle('is-on', l.querySelector('input').checked));
      commit();
      return;
    }

    const add = ev.target.closest('[data-add]');
    if (add){
      const f = tpl.fields.find(x => x.k === add.dataset.add);
      state[f.k] = (state[f.k] || []).concat([structuredClone(f.defaultItem || {})]);
      commit(); rebuild(); return;
    }
    const del = ev.target.closest('[data-del]');
    if (del){
      const key = del.closest('[data-list]').dataset.list;
      state[key].splice(Number(del.dataset.del), 1);
      commit(); rebuild(); return;
    }
    const mv = ev.target.closest('[data-move]');
    if (mv){
      const key = mv.closest('[data-list]').dataset.list;
      const i = Number(mv.dataset.move), j = i + Number(mv.dataset.dir);
      const arr = state[key];
      if (j >= 0 && j < arr.length){ const x = arr[i]; arr[i] = arr[j]; arr[j] = x; commit(); rebuild(); }
      return;
    }
  });
  ['dragover','dragleave','drop'].forEach(type => {
    form.addEventListener(type, ev => {
      const slot = ev.target.closest('[data-imgslot]');
      if (!slot) return;
      ev.preventDefault();
      slot.classList.toggle('is-over', type === 'dragover');
      if (type === 'drop' && ev.dataTransfer.files[0]) readImage(ev.dataTransfer.files[0], slot.dataset.imgslot);
    });
  });

  function readImage(file, path){
    const fr = new FileReader();
    fr.onload = () => { setPath(state, path, fr.result); commit(); rebuild(); };
    fr.readAsDataURL(file);
  }
  function rebuild(){
    const scroll = form.scrollTop;
    form.innerHTML = buildForm(tpl, state);
    form.scrollTop = scroll;
  }

  /* Aktionen */
  document.getElementById('vz-back').onclick  = () => { location.hash = '#/'; };
  document.getElementById('vz-print').onclick = () => printSheet();
  document.getElementById('vz-png').onclick   = async (ev) => {
    const btn = ev.currentTarget; const old = btn.textContent;
    btn.disabled = true; btn.textContent = '…';
    try{
      const pages = sheetPages(sheet);
      if (pages.length > 1){
        /* Jede Seite als eigene Datei — ein Bild ueber neun Seiten waere unbrauchbar.
           Der Browser fragt beim ersten Mal nach, ob mehrere Downloads erlaubt sind. */
        for (let i = 0; i < pages.length; i++){
          const nr = String(i + 1).padStart(2, '0');
          btn.textContent = `… ${i + 1}/${pages.length}`;
          await sheetToPng(pages[i], `ns-hotel-${tpl.id}-${nr}.png`, 3);
        }
      } else {
        await sheetToPng(sheet, `ns-hotel-${tpl.id}.png`, 3);
      }
      toast(t('pngDone'));
    }catch(err){
      console.warn(err);
      toast(t('pngFail'));
    }finally{ btn.disabled = false; btn.textContent = old; }
  };
  document.getElementById('vz-reset').onclick = () => {
    if (!confirm(t('resetAsk'))) return;
    store.remove(draftKey(tpl.id));
    renderEditor(tpl.id);
  };
  document.getElementById('vz-json-save').onclick = () => {
    const blob = new Blob([JSON.stringify({ template: tpl.id, data: state }, null, 2)], { type:'application/json' });
    downloadBlob(blob, `ns-hotel-${tpl.id}-entwurf.json`);
    toast(t('saved'));
  };
  document.getElementById('vz-share').onclick = async (ev) => {
    const btn = ev.currentTarget; const old = btn.textContent;
    btn.disabled = true; btn.textContent = '\u2026';
    try{
      const { payload, bilder } = await teilenKodieren(state);
      const url = teilenAdresse(tpl.id, payload);
      if (url.length > TEILEN_MAX){ alert(t('shareLong')); return; }
      const ok = await teilenKopieren(url);
      if (!ok){ window.prompt(t('shareManual'), url); return; }
      let msg = t('shareCopied');
      if (bilder) msg += ' \u00b7 ' + t('shareNoImg');
      /* Eine Datei-Adresse zeigt auf diesen einen Rechner. */
      if (location.protocol === 'file:') msg = t('shareLocal');
      toast(msg);
    }catch(err){
      console.warn(err);
      toast(t('shareFail'));
    }finally{ btn.disabled = false; btn.textContent = old; }
  };

  const fileInput = document.getElementById('vz-json-file');
  document.getElementById('vz-json-load').onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const f = fileInput.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try{
        const parsed = JSON.parse(fr.result);
        const data = parsed && parsed.data ? parsed.data : parsed;
        store.save(draftKey(tpl.id), Object.assign({}, structuredClone(tpl.defaults), data));
        renderEditor(tpl.id);
        toast(t('loaded'));
      }catch(err){ alert('Diese Datei ist kein gültiger Entwurf.'); }
    };
    fr.readAsText(f);
  };

  window.addEventListener('resize', fitScaler);
  paint();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitScaler(); checkFit(); });
}

/* ---------- Geteilten Link uebernehmen ------------------------------------ */
/* Der Zustand steckt in der Adresse. Er wird als Entwurf gespeichert und die
   Adresse danach aufgeraeumt — sonst wuerde ein Neuladen den Entwurf immer
   wieder ueberschreiben und "Zuruecksetzen" haette keine Wirkung. */
async function uebernehmeGeteilt(tpl, payload){
  let daten = null;
  try{ daten = await teilenLesen(payload); }
  catch(err){ console.warn(err); }

  history.replaceState(null, '', location.href.split('#')[0] + '#/t/' + tpl.id);

  if (!daten){ renderEditor(tpl.id); toast(t('shareBad')); return; }

  const vorhanden = store.load(draftKey(tpl.id), null);
  if (vorhanden && !confirm(t('shareAsk'))){ renderEditor(tpl.id); return; }

  store.save(draftKey(tpl.id), Object.assign({}, structuredClone(tpl.defaults), daten));
  renderEditor(tpl.id);
  toast(t('shareGot'));
}

/* ---------- Toast --------------------------------------------------------- */
let toastTimer = null;
function toast(msg){
  let el = document.getElementById('vz-toast');
  if (!el){
    el = e('div', { class:'vz-toast no-print', id:'vz-toast' });
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
}

/* ---------- Router -------------------------------------------------------- */
function route(){
  unmountActive();
  const hash = location.hash || '#/';
  /* #/t/<vorlage> — optional mit geteiltem Zustand: ?d=<Nutzlast> */
  const m = /^#\/t\/([\w-]+)(?:\?d=([A-Za-z0-9\-_]+))?/.exec(hash);
  window.scrollTo(0, 0);
  if (m) renderEditor(m[1], m[2] || null); else renderHub();
}

window.addEventListener('hashchange', route);
document.documentElement.lang = getLang();
mountTopbar();
route();

/* Für Tests/Automatisierung erreichbar machen. */
window.VZ = { TEMPLATES, ORDER, GROUPS, route, PAGE_MAX_H };
