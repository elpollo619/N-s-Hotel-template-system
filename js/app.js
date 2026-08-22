/* ==========================================================================
   N's Hotel · Vorlagen-Zentrale — App-Kern

   Aufbau der Oberflaeche, drei Ebenen:

     #/            Startseite — Suche, zuletzt benutzt, die Kapitel
     #/k/<kapitel> ein Kapitel mit seinen Vorlagen
     #/t/<vorlage> der Editor

   Warum ueberhaupt Kapitel? Achtzehn Vorlagen auf einer Seite sind eine
   Wand. Wer den Waschplan sucht, will nicht an Sicherheitszeichen und
   Etikettenbogen vorbeiscrollen. Dieselbe Ueberlegung im Editor: das
   Formular ist in aufklappbare Kapitel geteilt, statt in einer Kolonne von
   vierzig Feldern zu enden.
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
import { suche, trefferZiel, gruppeVon, ART_LABEL } from './lib/suche.js';
import { verlauf, merken } from './lib/verlauf.js';
import { schriftHinweis } from './lib/schrift.js';

const PAGE_MAX_H = { 'a4':1123, 'a4-land':794, 'a5':794, 'a5-land':559,
                     'a3':1587, 'a3-land':1123, 'letter':1056, 'letter-land':816 };

/* Klartext fuer die Leiste ueber der Vorschau — damit man sieht, auf welchem
   Papier man gerade arbeitet, ohne im Formular nachzusehen. */
const PAGE_NAME = {
  'a4':'A4 hoch · 210 × 297 mm',       'a4-land':'A4 quer · 297 × 210 mm',
  'a5':'A5 hoch · 148 × 210 mm',       'a5-land':'A5 quer · 210 × 148 mm',
  'a3':'A3 hoch · 297 × 420 mm',       'a3-land':'A3 quer · 420 × 297 mm',
  'letter':'Letter hoch',              'letter-land':'Letter quer'
};

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
/* Die Suche steht oben und ist von ueberall erreichbar — auch mitten im
   Editor. Mit "/" springt der Fokus hinein, ohne die Maus zu bemuehen. */
function mountTopbar(){
  const bar = qs('.vz-topbar');
  bar.innerHTML = `
    <button class="vz-brand" id="vz-home" title="${esc(t('back'))}">
      ${logo('white', 30)}
      <span class="vz-brand-txt">${esc(t('tagline'))}<small>Hans Amonn AG · Kerzers</small></span>
    </button>
    <div class="vz-suche" role="search">
      <input id="vz-suchfeld" type="search" autocomplete="off" spellcheck="false"
             placeholder="${esc(t('searchPlaceholder'))}" aria-label="${esc(t('search'))}">
      <kbd>/</kbd>
      <div class="vz-treffer" id="vz-treffer" hidden></div>
    </div>
    <span class="vz-top-spacer"></span>
    <div class="vz-lang" role="group" aria-label="Sprache">
      <button data-lang="de" aria-pressed="${getLang() === 'de'}">DE</button>
      <button data-lang="en" aria-pressed="${getLang() === 'en'}">EN</button>
    </div>`;
  qs('#vz-home', bar).onclick = () => { location.hash = '#/'; };
  bar.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = () => { setLang(b.dataset.lang); mountTopbar(); route(); };
  });
  mountSuche();
}

/* ---------- Suche im Kopf ------------------------------------------------ */
let sucheAktiv = -1;

function mountSuche(){
  const feld = document.getElementById('vz-suchfeld');
  const kasten = document.getElementById('vz-treffer');
  if (!feld || !kasten) return;

  function zeichne(){
    const treffer = suche(feld.value, 10);
    sucheAktiv = treffer.length ? 0 : -1;
    if (!feld.value.trim()){ kasten.hidden = true; kasten.innerHTML = ''; return; }
    kasten.hidden = false;
    kasten.innerHTML = treffer.length
      ? treffer.map((tr, i) => `
        <a class="vz-treffer-zeile${i === 0 ? ' is-aktiv' : ''}" href="${trefferZiel(tr)}"
           data-i="${i}">
          <span class="vz-treffer-art vz-treffer-art--${esc(tr.art)}">${esc(ART_LABEL[tr.art])}</span>
          <span class="vz-treffer-txt">
            <b>${esc(tr.titel)}</b>
            ${tr.unter ? `<i>${esc(tr.unter)}</i>` : ''}
          </span>
        </a>`).join('')
      : `<p class="vz-treffer-leer">${esc(t('searchNone'))}</p>`;
  }

  function schliessen(){ kasten.hidden = true; sucheAktiv = -1; }

  feld.addEventListener('input', zeichne);
  feld.addEventListener('focus', () => { if (feld.value.trim()) zeichne(); });
  feld.addEventListener('keydown', ev => {
    const zeilen = Array.from(kasten.querySelectorAll('.vz-treffer-zeile'));
    if (ev.key === 'Escape'){ feld.value = ''; schliessen(); feld.blur(); return; }
    if (!zeilen.length) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp'){
      ev.preventDefault();
      sucheAktiv = (sucheAktiv + (ev.key === 'ArrowDown' ? 1 : -1) + zeilen.length) % zeilen.length;
      zeilen.forEach((z, i) => z.classList.toggle('is-aktiv', i === sucheAktiv));
      zeilen[sucheAktiv].scrollIntoView({ block:'nearest' });
    }
    if (ev.key === 'Enter'){
      ev.preventDefault();
      const ziel = zeilen[Math.max(0, sucheAktiv)];
      if (ziel){ location.hash = ziel.getAttribute('href'); feld.value = ''; schliessen(); feld.blur(); }
    }
  });
  kasten.addEventListener('mousedown', ev => {
    const z = ev.target.closest('.vz-treffer-zeile');
    if (z){ feld.value = ''; setTimeout(schliessen, 0); }
  });
  document.addEventListener('click', ev => {
    if (!ev.target.closest('.vz-suche')) schliessen();
  });
}

/* ---------- Startseite und Kapitel --------------------------------------- */

/** Wie viele Vorlagen ein Kapitel wirklich hat (leere Platzhalter zaehlen nicht). */
function kapitelZahl(g){ return g.ids.filter(id => TEMPLATES[id]).length; }

/** Eine Vorlagenkarte. */
function karte(id){
  const tpl = TEMPLATES[id];
  if (!tpl) return `
    <div class="vz-card vz-card--soon">
      <div class="vz-thumb"><span class="vz-badge vz-badge--soon">${esc(t('soon'))}</span></div>
      <div class="vz-card-body"><h3>${esc(id)}</h3><p>${esc(t('soon'))}</p></div>
    </div>`;
  return `
    <a class="vz-card" href="#/t/${esc(id)}">
      <div class="vz-thumb">
        <span class="vz-badge${tpl.badgeCyan ? ' vz-badge--cyan' : ''}">${esc(tpl.badge || '')}</span>
        ${tpl.thumb || ''}
      </div>
      <div class="vz-card-body">
        <h3>${esc(tpl.title)}</h3>
        <p>${esc(tpl.sub || '')}</p>
      </div>
    </a>`;
}

/** Die Kapitelspalte links — auf jeder Uebersichtsseite dieselbe. */
function kapitelSpalte(aktiv){
  const zeilen = GROUPS.map(g => `
    <a class="vz-nav-zeile${g.id === aktiv ? ' is-aktiv' : ''}" href="#/k/${esc(g.id)}">
      <span>${esc(g.title)}</span>
      <em>${kapitelZahl(g)}</em>
    </a>`).join('');
  return `
    <nav class="vz-nav" aria-label="${esc(t('chapters'))}">
      <a class="vz-nav-zeile${!aktiv ? ' is-aktiv' : ''}" href="#/">
        <span>${esc(t('startPage'))}</span>
        <em>${ORDER.filter(id => TEMPLATES[id]).length}</em>
      </a>
      <p class="vz-nav-titel">${esc(t('chapters'))}</p>
      ${zeilen}
    </nav>`;
}

/** Gemeinsamer Rahmen: Kapitelspalte links, Inhalt rechts. */
function uebersicht(aktiv, inhalt){
  view().innerHTML = `
    <div class="vz-uebersicht">
      ${kapitelSpalte(aktiv)}
      <div class="vz-inhalt">${inhalt}</div>
    </div>`;
}

function renderHub(){
  setPageSize('a4');
  const zuletzt = verlauf().filter(id => TEMPLATES[id]).slice(0, 4);

  const kacheln = GROUPS.map(g => `
    <a class="vz-kachel" href="#/k/${esc(g.id)}">
      <span class="vz-kachel-zahl">${kapitelZahl(g)}</span>
      <b>${esc(g.title)}</b>
      ${g.note ? `<i>${esc(g.note)}</i>` : ''}
    </a>`).join('');

  uebersicht(null, `
    <header class="vz-hero">
      <p class="eyebrow">${esc(t('heroEyebrow'))}</p>
      <h1>${esc(t('heroTitle'))}</h1>
      <p>${esc(t('heroLede'))}</p>
    </header>

    ${zuletzt.length ? `
    <section class="vz-block">
      <h2>${esc(t('recent'))}</h2>
      <div class="vz-cards vz-cards--klein">${zuletzt.map(karte).join('')}</div>
    </section>` : ''}

    <section class="vz-block">
      <h2>${esc(t('chapters'))}</h2>
      <div class="vz-kacheln">${kacheln}</div>
    </section>

    <div class="vz-schriftwarnung" id="vz-schrift" hidden></div>

    <section class="vz-block">
      <h2>${esc(t('help'))}</h2>
      <ol class="vz-schritte">
        <li><b>${esc(t('step1'))}</b><span>${esc(t('step1sub'))}</span></li>
        <li><b>${esc(t('step2'))}</b><span>${esc(t('step2sub'))}</span></li>
        <li><b>${esc(t('step3'))}</b><span>${esc(t('step3sub'))}</span></li>
      </ol>
      <p class="vz-hilfe-fuss">${t('helpFoot')}</p>
    </section>`);

  zeigeSchrift();
}

/* Der Schrifthinweis kann erst beurteilt werden, wenn der Browser mit dem
   Laden fertig ist — vorher meldet fonts.check() immer false. */
function zeigeSchrift(){
  const kasten = document.getElementById('vz-schrift');
  if (!kasten) return;
  const sage = () => {
    const text = schriftHinweis();
    if (!text) return;
    kasten.hidden = false;
    kasten.innerHTML = `<b>${esc(t('fontSub'))}</b> ${esc(text)} `
      + `<span>${t('fontHow')}</span>`;
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sage);
  else sage();
}

function renderKategorie(katId){
  setPageSize('a4');
  const g = GROUPS.find(x => x.id === katId);
  if (!g){ renderHub(); return; }

  uebersicht(g.id, `
    <nav class="vz-krumen" aria-label="Pfad">
      <a href="#/">${esc(t('startPage'))}</a><span>›</span><b>${esc(g.title)}</b>
    </nav>
    <header class="vz-kap-kopf">
      <h1>${esc(g.title)}</h1>
      ${g.note ? `<p>${esc(g.note)}</p>` : ''}
    </header>
    <div class="vz-cards">${g.ids.map(karte).join('')}</div>`);
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
      /* `options` darf eine Funktion sein — dann wird die Liste bei jedem
         Zeichnen neu geholt. Gebraucht fuer die eigenen Textbausteine, die
         waehrend der Arbeit dazukommen koennen. */
      return `<div class="vz-field">${lbl}
        <select id="${id}" data-path="${esc(path)}">${
          optionen(f).map(o => `<option value="${esc(o.v)}"${String(o.v) === String(v) ? ' selected' : ''}>${esc(o.t)}</option>`).join('')
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
          optionen(f).map(o => {
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

/* Die Felder einer Vorlage in Kapitel schneiden. Jede `{t:'group'}`-Marke
   beginnt ein neues; was davor steht, kommt in ein erstes Kapitel ohne
   eigenen Namen. */
function kapitelVon(tpl){
  const kap = [];
  let jetzt = null;
  for (const f of tpl.fields){
    if (f.t === 'group'){ jetzt = { label:f.label, felder:[] }; kap.push(jetzt); continue; }
    if (!jetzt){ jetzt = { label:'', felder:[] }; kap.push(jetzt); }
    jetzt.felder.push(f);
  }
  return kap.filter(k => k.felder.length);
}

function offenKey(id){ return 'kap:' + id; }

/** Welche Kapitel sind aufgeklappt? Voreinstellung: nur das erste. */
function offeneKapitel(tpl){
  const gespeichert = store.load(offenKey(tpl.id), null);
  if (Array.isArray(gespeichert)) return new Set(gespeichert.map(Number));
  return new Set([0]);
}
function offeneKapitelSichern(tpl, menge){
  store.save(offenKey(tpl.id), Array.from(menge));
}

function buildForm(tpl, state){
  const kapitel = kapitelVon(tpl);
  const offen = offeneKapitel(tpl);

  return kapitel.map((k, i) => {
    const inhalt = k.felder.map(f => {
      if (f.t === 'note') return `<p class="vz-hint" style="margin:0">${f.label}</p>`;
      if (f.type === 'list') return listHtml(f, getPath(state, f.k), f.k);
      return fieldHtml(f, getPath(state, f.k), f.k);
    }).join('');
    const auf = offen.has(i);
    return `
      <section class="vz-kap${auf ? ' is-offen' : ''}" data-kap="${i}">
        <button type="button" class="vz-kap-kopfzeile" data-kaptoggle="${i}"
                aria-expanded="${auf}">
          <span class="vz-kap-nr">${i + 1}</span>
          <span class="vz-kap-name">${esc(k.label || t('preview'))}</span>
          <span class="vz-kap-pfeil" aria-hidden="true"></span>
        </button>
        <div class="vz-kap-inhalt">${inhalt}</div>
      </section>`;
  }).join('');
}

/** Auswahlliste eines Feldes — fest hinterlegt oder bei Bedarf berechnet. */
function optionen(f){
  const o = typeof f.options === 'function' ? f.options() : f.options;
  return Array.isArray(o) ? o : [];
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
function renderEditor(id, geteilt, suchwert){
  const tpl = TEMPLATES[id];
  if (!tpl){ view().innerHTML = `<div class="vz-hub"><p>${esc(t('notFound'))}</p></div>`; return; }
  if (geteilt){ uebernehmeGeteilt(tpl, geteilt); return; }

  const state = loadState(tpl);

  /* Aus der Suche gekommen: die Vorlage gleich auf den gewählten Baustein,
     das gewählte Zeichen oder die gewählte Fraktion stellen. Die Adresse
     wird danach aufgeräumt, damit ein Neuladen nichts überschreibt. */
  if (suchwert && typeof tpl.ausSuche === 'function'){
    const naechster = tpl.ausSuche({ ...state }, suchwert);
    if (naechster && typeof naechster === 'object'){
      Object.keys(state).forEach(x => { delete state[x]; });
      Object.assign(state, naechster);
      saveState(tpl, state);
    }
  }
  if (suchwert){
    history.replaceState(null, '', location.href.split('#')[0] + '#/t/' + tpl.id);
  }
  unmountActive();
  setPageSize(pageOf(tpl, state));

  const gruppe = gruppeVon(tpl.id);
  merken(tpl.id);

  view().innerHTML = `
    <div class="vz-editor">
      <aside class="vz-panel no-print">
        <nav class="vz-krumen" aria-label="Pfad">
          <a href="#/">${esc(t('startPage'))}</a><span>›</span>
          ${gruppe ? `<a href="#/k/${esc(gruppe.id)}">${esc(gruppe.title)}</a><span>›</span>` : ''}
          <b>${esc(tpl.title)}</b>
        </nav>
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
        <div class="vz-formkopf">
          <span>${esc(t('chapters'))}</span>
          <button type="button" class="vz-mini-link" id="vz-alle-kap"></button>
        </div>
        <div class="vz-form" id="vz-form">${buildForm(tpl, state)}</div>
      </aside>
      <div class="vz-buehne">
        <div class="vz-leiste no-print" id="vz-leiste"></div>
        <div class="vz-stage" id="vz-stage">
          <div class="vz-scaler" id="vz-scaler">
            <div class="sheet sheet--${esc(pageOf(tpl, state))}${istMehrseitig(tpl, state) ? ' sheet--multi' : ''} ${esc(tpl.root)}" id="vz-sheet"></div>
          </div>
        </div>
      </div>
    </div>`;

  const form   = document.getElementById('vz-form');
  const sheet  = document.getElementById('vz-sheet');
  const scaler = document.getElementById('vz-scaler');
  const fitBox = document.getElementById('vz-fit');
  const leiste = document.getElementById('vz-leiste');

  /* 'fit' passt das Blatt in die Buehne; eine Zahl ist ein fester Massstab.
     Die Wahl bleibt fuer diese Vorlage gespeichert — wer am Plan-Editor
     zieht, will nicht bei jedem Wechsel neu zoomen. */
  let zoom = store.load('zoom:' + tpl.id, 'fit');

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
    zeichneLeiste();
  }

  /** Der Massstab, mit dem gerade gezeichnet wird. */
  function massstab(){
    const stage = document.getElementById('vz-stage');
    if (!stage || !sheet.offsetWidth) return 1;
    if (zoom === 'fit') return Math.min(1, (stage.clientWidth - 56) / sheet.offsetWidth);
    return Number(zoom) || 1;
  }

  function fitScaler(){
    const m = massstab();
    scaler.style.transform = `scale(${m})`;
    scaler.style.height = (sheet.offsetHeight * m) + 'px';
    scaler.style.width  = sheet.offsetWidth + 'px';
  }

  /* Die Leiste ueber der Vorschau: Seitenzaehler links, Massstab rechts.
     Der Seitenzaehler erscheint nur, wenn es wirklich mehrere Seiten gibt. */
  function zeichneLeiste(){
    if (!leiste) return;
    const seiten = sheet.querySelectorAll('[data-page]').length;
    const stufen = [['fit', t('zoomFit')], [0.5, '50 %'], [0.75, '75 %'],
                    [1, '100 %'], [1.5, '150 %'], [2, '200 %']];
    leiste.innerHTML = `
      <div class="vz-leiste-links">
        <span class="vz-papier">${esc(PAGE_NAME[pageOf(tpl, state)] || '')}</span>
        ${seiten > 1 ? `
        <button type="button" class="vz-mini" data-seite="-1" title="${esc(t('pageOf'))} zurück">&#8593;</button>
        <select class="vz-seitenwahl" id="vz-seitenwahl" aria-label="${esc(t('pageOf'))}">
          ${Array.from({ length:seiten }, (_, i) =>
            `<option value="${i}">${esc(t('pageOf'))} ${i + 1} / ${seiten}</option>`).join('')}
        </select>
        <button type="button" class="vz-mini" data-seite="1" title="${esc(t('pageOf'))} vor">&#8595;</button>` : ''}
      </div>
      <div class="vz-leiste-rechts">
        <button type="button" class="vz-mini" data-zoom="raus" title="kleiner">&#8722;</button>
        <select class="vz-zoomwahl" id="vz-zoomwahl" aria-label="${esc(t('preview'))}">
          ${stufen.map(([v, l]) =>
            `<option value="${v}"${String(v) === String(zoom) ? ' selected' : ''}>${esc(l)}</option>`).join('')}
        </select>
        <button type="button" class="vz-mini" data-zoom="rein" title="grösser">&#43;</button>
      </div>`;
  }

  /** Zum n-ten Blatt scrollen. */
  function zurSeite(n){
    const seiten = Array.from(sheet.querySelectorAll('[data-page]'));
    if (!seiten.length) return;
    const i = Math.max(0, Math.min(seiten.length - 1, n));
    const stage = document.getElementById('vz-stage');
    const m = massstab();
    stage.scrollTo({ top:Math.max(0, seiten[i].offsetTop * m - 18), behavior:'smooth' });
    const wahl = document.getElementById('vz-seitenwahl');
    if (wahl) wahl.value = String(i);
  }

  function setzeZoom(wert){
    zoom = wert;
    store.save('zoom:' + tpl.id, wert);
    fitScaler();
    zeichneLeiste();
  }

  if (leiste){
    leiste.addEventListener('click', ev => {
      const s = ev.target.closest('[data-seite]');
      if (s){
        const wahl = document.getElementById('vz-seitenwahl');
        zurSeite(Number(wahl ? wahl.value : 0) + Number(s.dataset.seite));
        return;
      }
      const z = ev.target.closest('[data-zoom]');
      if (z){
        const stufen = [0.5, 0.75, 1, 1.5, 2];
        const jetzt = zoom === 'fit' ? massstab() : Number(zoom);
        const naechste = z.dataset.zoom === 'rein'
          ? stufen.find(v => v > jetzt + 0.01)
          : [...stufen].reverse().find(v => v < jetzt - 0.01);
        if (naechste) setzeZoom(naechste);
      }
    });
    leiste.addEventListener('change', ev => {
      if (ev.target.id === 'vz-zoomwahl'){
        setzeZoom(ev.target.value === 'fit' ? 'fit' : Number(ev.target.value));
      }
      if (ev.target.id === 'vz-seitenwahl') zurSeite(Number(ev.target.value));
    });
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

  /* Kapitel auf- und zuklappen. Der Zustand haelt sich je Vorlage. */
  function kapitelZustand(){
    const menge = new Set();
    form.querySelectorAll('.vz-kap.is-offen').forEach(k => menge.add(Number(k.dataset.kap)));
    return menge;
  }
  function alleKapitelKnopf(){
    const knopf = document.getElementById('vz-alle-kap');
    if (!knopf) return;
    const zu = form.querySelectorAll('.vz-kap:not(.is-offen)').length;
    knopf.textContent = zu ? t('allOpen') : t('allClosed');
    knopf.dataset.auf = zu ? 'ja' : 'nein';
  }

  form.addEventListener('click', ev => {
    const kap = ev.target.closest('[data-kaptoggle]');
    if (kap){
      const sek = kap.closest('.vz-kap');
      const offen = sek.classList.toggle('is-offen');
      kap.setAttribute('aria-expanded', String(offen));
      offeneKapitelSichern(tpl, kapitelZustand());
      alleKapitelKnopf();
      return;
    }
  });

  const alleKap = document.getElementById('vz-alle-kap');
  if (alleKap){
    alleKap.onclick = () => {
      const auf = alleKap.dataset.auf === 'ja';
      form.querySelectorAll('.vz-kap').forEach(k => {
        k.classList.toggle('is-offen', auf);
        k.querySelector('[data-kaptoggle]').setAttribute('aria-expanded', String(auf));
      });
      offeneKapitelSichern(tpl, kapitelZustand());
      alleKapitelKnopf();
    };
    alleKapitelKnopf();
  }

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
    alleKapitelKnopf();
  }

  /* Aktionen — zurueck geht ueber die Krumenleiste oben, nicht ueber einen
     eigenen Knopf. */
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
  window.scrollTo(0, 0);

  /* #/k/<kapitel> — eine Kategorieseite */
  const k = /^#\/k\/([\w-]+)/.exec(hash);
  if (k){ renderKategorie(k[1]); return; }

  /* #/t/<vorlage> — der Editor. Optional:
       ?d=<Nutzlast>  ein geteilter Entwurf
       ?w=<Wert>      ein Treffer aus der Suche (Baustein, Zeichen, Fraktion) */
  const m = /^#\/t\/([\w-]+)(?:\?(?:d=([A-Za-z0-9\-_]+)|w=([^&]*)))?/.exec(hash);
  if (m){
    renderEditor(m[1], m[2] || null, m[3] ? decodeURIComponent(m[3]) : null);
    return;
  }
  renderHub();
}

/* ---------- Tastatur ------------------------------------------------------ */
/* "/" springt in die Suche, Escape kommt zurueck. Zwei Kuerzel reichen —
   mehr merkt sich im Alltag niemand. */
document.addEventListener('keydown', ev => {
  const imFeld = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
  if (ev.key === '/' && !imFeld && !ev.metaKey && !ev.ctrlKey){
    const feld = document.getElementById('vz-suchfeld');
    if (feld){ ev.preventDefault(); feld.focus(); feld.select(); }
    return;
  }
  if (ev.key === 'Escape' && !imFeld && /^#\/t\//.test(location.hash)){
    location.hash = '#/';
  }
});

window.addEventListener('hashchange', route);
document.documentElement.lang = getLang();
mountTopbar();
route();

/* Für Tests/Automatisierung erreichbar machen. */
window.VZ = { TEMPLATES, ORDER, GROUPS, route, PAGE_MAX_H };
