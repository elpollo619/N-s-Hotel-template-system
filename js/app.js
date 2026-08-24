/* ==========================================================================
   N's Hotel · Vorlagen-Zentrale — App-Kern

   Die Zentrale ist ein Werkzeug mit mehreren Seiten, nicht eine lange
   Seite. Geteilt wird nach Arbeitsbereichen — nach dem, was jemand am
   Stueck erledigt, nicht nach der Art des Dokuments:

     #/            Startseite — Stand, offene Entwuerfe, die Arbeitsbereiche
     #/b/<bereich> ein Arbeitsbereich mit seinen Vorlagen
     #/t/<vorlage> der Editor
     #/s/<seite>   Werkzeugseite: Anleitung, eigene Bausteine, Marke

   Auf jeder dieser Seiten steht dieselbe Seitenleiste. Sie beantwortet
   «wo bin ich» und spart den Umweg ueber die Startseite. Dieselbe
   Ueberlegung im Editor: das Formular ist in aufklappbare Kapitel geteilt,
   statt in einer Kolonne von vierzig Feldern zu enden.
   ========================================================================== */
import { TEMPLATES, ORDER } from './templates/index.js';
import { BEREICHE, SEITEN, BEREICH_ORDER, bereich, bereichVon } from './bereiche.js';
import { alleObjekte, alleAbsender, eigeneObjekte, eigeneAbsender, objekt, objektAdresse,
         objektSichern, objektLoeschen, istEigenesObjekt,
         absenderSichern, absenderLoeschen, istEigenerAbsender,
         aktivesObjektId, aktivesObjekt, setzeAktivesObjekt, objektVorgabe,
         bestandAlsDatei, bestandLaden } from './objekte.js';
import { esc, e, qs } from './lib/dom.js';
import { logo } from './lib/brand.js';
import { t, getLang, setLang } from './lib/i18n.js';
import * as store from './lib/storage.js';
import { setPageSize, printSheet, sheetToPng, downloadBlob } from './lib/export.js';
import { teilenKodieren, teilenLesen, teilenAdresse, teilenKopieren, TEILEN_MAX } from './lib/teilen.js';
import { lesbarkeit } from './lib/lesbarkeit.js';
import { kontrastBefund } from './lib/kontrast.js';
import { suche, trefferZiel, ART_LABEL, normal } from './lib/suche.js';
import { verlauf, merken } from './lib/verlauf.js';
import { favoriten, istFavorit, favoritToggle } from './lib/favoriten.js';
import { sicherungAlsDatei, sicherungLaden } from './lib/sicherung.js';
import { staende, standSpeichern, stand, standLoeschen } from './lib/staende.js';
import { schriftHinweis, schriftBefund, MARKEN_SCHRIFTEN } from './lib/schrift.js';
import { icon, iconListe, GRUPPEN, ICON_KEYS } from './lib/icons.js';
import { SPRACH_IDS } from './lib/sprachen.js';
import { PRESETS } from './presets.js';
import { eigeneBausteine, bausteinLoeschen, sammlungAlsDatei, sammlungLaden } from './lib/eigene.js';
import { ROLLEN, FAMILIEN, EIGEN_FAMILIE, familienFuer, wahl, setzeWahl, wahlZuruecksetzen,
         istVoreinstellung, eigeneSchrift, eigeneSchriftSichern, eigeneSchriftLoeschen,
         schriftAnwenden } from './lib/schriftwahl.js';

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
  const state = Object.assign({}, structuredClone(tpl.defaults), saved || {});
  /* Noch kein Entwurf und eine Liegenschaft ist aktiv? Dann startet die
     Vorlage bei ihr. Ein vorhandener Entwurf wird nicht angetastet — was
     jemand einmal eingestellt hat, bleibt stehen, bis er es selbst
     umstellt. Der Editor weist darauf hin, wenn beides auseinanderlaeuft. */
  if (!saved && Object.hasOwn(state, 'objekt')){
    setzeObjektImZustand(state, objektVorgabe(state.objekt));
  }
  return state;
}

/** Liegenschaft im Zustand setzen — und den Absender gleich mit, weil jede
    Liegenschaft weiss, unter welcher Firma sie laeuft. */
function setzeObjektImZustand(state, id){
  if (!id || !Object.hasOwn(state, 'objekt')) return false;
  if (state.objekt === id) return false;
  state.objekt = id;
  const o = objekt(id);
  if (Object.hasOwn(state, 'absender') && o.absender) state.absender = o.absender;
  return true;
}
function saveState(tpl, state){ store.save(draftKey(tpl.id), state); }

/* ---------- Rahmen: Kopfzeile und Seitenleiste --------------------------- */
/* Die Seitenleiste steht auf jeder Seite, auch im Editor. Sie ist die
   Antwort auf «wo bin ich gerade» und spart den Umweg über die Startseite:
   von jeder Vorlage direkt in jeden anderen Arbeitsbereich.

   Schmal wird sie zur Schiene aus Icons, auf dem Telefon zur Schublade. */

/** Wie viele Vorlagen ein Arbeitsbereich wirklich hat. */
function bereichZahl(b){ return b.ids.filter(id => TEMPLATES[id]).length; }

/** Alle vorhandenen Vorlagen in Bereichsreihenfolge. */
function alleVorlagen(){ return BEREICH_ORDER.filter(id => TEMPLATES[id]); }

/** Vorlagen, an denen schon gearbeitet wurde — der gespeicherte Entwurf. */
function entwuerfe(){
  return store.keys()
    .filter(k => k.startsWith('draft:'))
    .map(k => k.slice('draft:'.length))
    .filter(id => TEMPLATES[id]);
}

/** Heutiges Datum ausgeschrieben. Steht im Kopf, damit auf einem
    ausgedruckten Aushang später klar ist, wann er entstanden ist. */
function heuteText(){
  const ort = getLang() === 'en' ? 'en-GB' : 'de-CH';
  try{
    return new Date().toLocaleDateString(ort,
      { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }catch(_){ return ''; }
}

function mountTopbar(){
  const bar = qs('.vz-topbar');
  bar.innerHTML = `
    <button class="vz-burger" id="vz-burger" aria-expanded="false"
            aria-controls="vz-seitenleiste" aria-label="${esc(t('menu'))}">
      <span></span><span></span><span></span>
    </button>
    <a class="vz-brand" href="#/" id="vz-home">
      ${logo('white', 30)}
      <span class="vz-brand-txt">${esc(t('tagline'))}<small>Hans Amonn AG · Kerzers</small></span>
    </a>
    <div class="vz-suche" role="search">
      <input id="vz-suchfeld" type="search" autocomplete="off" spellcheck="false"
             placeholder="${esc(t('searchPlaceholder'))}" aria-label="${esc(t('search'))}">
      <kbd>/</kbd>
      <div class="vz-treffer" id="vz-treffer" hidden></div>
    </div>
    ${objektWaehler('vz-objektwahl', 'vz-objekt')}
    <span class="vz-heute" title="${esc(t('today'))}">${esc(heuteText())}</span>
    <div class="vz-lang" role="group" aria-label="${esc(t('uiLang'))}">
      <button data-lang="de" aria-pressed="${getLang() === 'de'}">DE</button>
      <button data-lang="en" aria-pressed="${getLang() === 'en'}">EN</button>
    </div>`;

  bar.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = () => { setLang(b.dataset.lang); mountRahmen(); route(); };
  });
  const burger = document.getElementById('vz-burger');
  burger.onclick = () => schubladeZeigen(!document.body.classList.contains('vz-nav-offen'));

  objektWaehlerBinden(bar);
  mountSuche();
}

/* ---------- Aktive Liegenschaft ------------------------------------------- */
/* Das Haus, an dem gerade gearbeitet wird. Steht im Kopf, weil es fuer jede
   Vorlage gilt und nicht in einer einzelnen versteckt sein darf. */
function objektWaehler(id, klasse){
  const jetzt = aktivesObjektId();
  const zeilen = alleObjekte().filter(o => o.code).map(o =>
    `<option value="${esc(o.id)}"${o.id === jetzt ? ' selected' : ''}>${
      esc(`${o.code} — ${o.name}`)}</option>`).join('');
  return `
    <div class="${esc(klasse)}" title="${esc(t('propertyActive'))}">
      <label for="${esc(id)}">${esc(t('property'))}</label>
      <select id="${esc(id)}" data-objektwahl>
        <option value="">${esc(t('propertyNone'))}</option>
        ${zeilen}
      </select>
    </div>`;
}

/* Beide Umschalter — der im Kopf und der in der Schublade — haengen an
   derselben Wahl. Sichtbar ist je nach Breite genau einer. */
function objektWaehlerBinden(wurzel){
  wurzel.querySelectorAll('[data-objektwahl]').forEach(sel => {
    sel.onchange = () => objektWechseln(sel.value);
  });
}

/**
 * Die aktive Liegenschaft wechseln. Steht gerade ein Editor offen, wird er
 * gleich mit umgestellt — wer im Kopf umschaltet, waehrend ein Aushang vor
 * ihm liegt, will genau das sehen.
 */
function objektWechseln(id){
  setzeAktivesObjekt(id);
  const m = /^#\/t\/([\w-]+)/.exec(location.hash || '');
  if (m && id){
    const tpl = TEMPLATES[m[1]];
    if (tpl){
      const state = loadState(tpl);
      if (setzeObjektImZustand(state, id)){
        saveState(tpl, state);
        renderEditor(tpl.id);
        toast(`${t('propertySwitched')}: ${objekt(id).name}`);
        return;
      }
    }
  }
  route();
  if (id) toast(`${t('propertySwitched')}: ${objekt(id).name}`);
}

/** Die Schublade auf dem Telefon auf- und zuziehen. */
function schubladeZeigen(auf){
  document.body.classList.toggle('vz-nav-offen', auf);
  const burger = document.getElementById('vz-burger');
  if (burger) burger.setAttribute('aria-expanded', String(auf));
  const schleier = document.getElementById('vz-schleier');
  if (schleier) schleier.hidden = !auf;
}

/* Ein Griff neben die Schublade schliesst sie — so wie es jeder von seinem
   Telefon kennt. */
{
  const schleier = document.getElementById('vz-schleier');
  if (schleier) schleier.addEventListener('click', () => schubladeZeigen(false));
}

function mountSeitenleiste(){
  const leiste = qs('#vz-seitenleiste');
  const werkzeug = Object.values(SEITEN).map(s => `
    <a class="vz-nav-zeile" href="#/s/${esc(s.id)}" data-nav="s:${esc(s.id)}"
       title="${esc(s.title)}">
      <span class="vz-nav-ico">${icon(s.icon, 19)}</span>
      <span class="vz-nav-txt">${esc(s.title)}</span>
    </a>`).join('');

  leiste.innerHTML = `
    ${objektWaehler('vz-objektwahl-nav', 'vz-objekt-nav')}
    <nav aria-label="${esc(t('areas'))}">
      <a class="vz-nav-zeile vz-nav-zeile--start" href="#/" data-nav="start"
         title="${esc(t('startPage'))}">
        <span class="vz-nav-ico">${icon('info', 19)}</span>
        <span class="vz-nav-txt">${esc(t('startPage'))}</span>
        <em>${alleVorlagen().length}</em>
      </a>

      <p class="vz-nav-titel">${esc(t('areas'))}</p>
      ${BEREICHE.map(b => `
        <a class="vz-nav-zeile" href="#/b/${esc(b.id)}" data-nav="b:${esc(b.id)}"
           title="${esc(b.title)}">
          <span class="vz-nav-ico">${icon(b.icon, 19)}</span>
          <span class="vz-nav-txt">${esc(b.kurz)}</span>
          <em>${bereichZahl(b)}</em>
        </a>`).join('')}

      <p class="vz-nav-titel">${esc(t('tools'))}</p>
      ${werkzeug}
    </nav>`;

  /* Ein Klick in der Schublade schliesst sie wieder — sonst verdeckt sie
     auf dem Telefon genau die Seite, die man gerade geöffnet hat. */
  leiste.addEventListener('click', ev => {
    if (ev.target.closest('.vz-nav-zeile')) schubladeZeigen(false);
  });
  objektWaehlerBinden(leiste);
}

/** Kopfzeile und Seitenleiste zusammen aufbauen (nach Sprachwechsel). */
function mountRahmen(){ mountTopbar(); mountSeitenleiste(); }

/** Die aktive Zeile in der Seitenleiste markieren. */
function markiereNav(schluessel){
  document.querySelectorAll('#vz-seitenleiste .vz-nav-zeile').forEach(a => {
    const an = a.dataset.nav === schluessel;
    a.classList.toggle('is-aktiv', an);
    if (an) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
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

/* ---------- Bausteine der Seiten ----------------------------------------- */

/** Eine Vorlagenkarte. */
function karte(id){
  const tpl = TEMPLATES[id];
  if (!tpl) return '';
  const fav = istFavorit(id);
  return `
    <div class="vz-card-wrap">
      <a class="vz-card" href="#/t/${esc(id)}">
        <div class="vz-thumb">
          <span class="vz-badge${tpl.badgeCyan ? ' vz-badge--cyan' : ''}">${esc(tpl.badge || '')}</span>
          ${tpl.thumb || ''}
        </div>
        <div class="vz-card-body">
          <h3>${esc(tpl.title)}</h3>
          <p>${esc(tpl.sub || '')}</p>
        </div>
      </a>
      <button type="button" class="vz-fav${fav ? ' is-on' : ''}" data-fav="${esc(id)}"
        aria-pressed="${fav ? 'true' : 'false'}"
        title="${esc(fav ? t('favRemove') : t('favAdd'))}"
        aria-label="${esc(fav ? t('favRemove') : t('favAdd'))}">${icon('stern', 18, 1.8)}</button>
    </div>`;
}

/** Brotkrumen. Erwartet Paare [Text, Ziel]; der letzte Eintrag ohne Ziel. */
function krumen(teile){
  const html = teile
    .map(([txt, ziel]) => ziel ? `<a href="${esc(ziel)}">${esc(txt)}</a>` : `<b>${esc(txt)}</b>`)
    .join('<span aria-hidden="true">\u203a</span>');
  return `<nav class="vz-krumen" aria-label="${esc(t('path'))}">${html}</nav>`;
}

/** Gemeinsamer Seitenrahmen: Krumen, Kopf, Inhalt. */
function seite({ nav, krumenTeile, eyebrow, titel, lede, inhalt }){
  markiereNav(nav);
  view().innerHTML = `
    <div class="vz-seite">
      ${krumenTeile ? krumen(krumenTeile) : ''}
      <header class="vz-seitenkopf">
        ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
        ${lede ? `<p class="vz-lede">${esc(lede)}</p>` : ''}
      </header>
      ${inhalt}
    </div>`;
}

/* ---------- Startseite ---------------------------------------------------- */
function renderStart(){
  setPageSize('a4');

  const offen = entwuerfe();
  const zuletzt = verlauf().filter(id => TEMPLATES[id] && !offen.includes(id)).slice(0, 3);
  const angeheftet = favoriten().filter(id => TEMPLATES[id]);

  const zahlen = [
    { z: alleVorlagen().length,                     l: t('kpiTemplates') },
    { z: BEREICHE.length,                           l: t('kpiAreas') },
    { z: SPRACH_IDS.length,                         l: t('kpiLanguages') },
    { z: PRESETS.length + eigeneBausteine().length, l: t('kpiBlocks') }
  ];

  const kacheln = BEREICHE.map(b => `
    <a class="vz-kachel" href="#/b/${esc(b.id)}">
      <span class="vz-kachel-ico">${icon(b.icon, 22)}</span>
      <b>${esc(b.title)}</b>
      <i>${esc(b.lede)}</i>
      <em>${bereichZahl(b)} ${esc(bereichZahl(b) === 1 ? t('templateOne') : t('templateMany'))}</em>
    </a>`).join('');

  seite({
    nav: 'start',
    eyebrow: t('heroEyebrow'),
    titel: t('heroTitle'),
    lede: t('heroLede'),
    inhalt: `
      <div class="vz-zahlen">${zahlen.map(k => `
        <div class="vz-zahl"><b>${k.z}</b><span>${esc(k.l)}</span></div>`).join('')}
      </div>

      ${offen.length ? `
      <section class="vz-block">
        <h2>${esc(t('continue'))}</h2>
        <p class="vz-block-note">${esc(t('continueNote'))}</p>
        <div class="vz-weiter">${offen.map(id => `
          <a class="vz-weiter-zeile" href="#/t/${esc(id)}">
            <span class="vz-weiter-punkt" aria-hidden="true"></span>
            <b>${esc(TEMPLATES[id].title)}</b>
            <i>${esc((bereichVon(id) || {}).title || '')}</i>
            <em aria-hidden="true">→</em>
          </a>`).join('')}
        </div>
      </section>` : ''}

      ${angeheftet.length ? `
      <section class="vz-block">
        <h2>${esc(t('favorites'))}</h2>
        <div class="vz-cards vz-cards--klein">${angeheftet.map(karte).join('')}</div>
      </section>` : ''}

      <section class="vz-block">
        <h2>${esc(t('areas'))}</h2>
        <p class="vz-block-note">${esc(t('areasNote'))}</p>
        <div class="vz-kacheln">${kacheln}</div>
      </section>

      ${zuletzt.length ? `
      <section class="vz-block">
        <h2>${esc(t('recent'))}</h2>
        <div class="vz-cards vz-cards--klein">${zuletzt.map(karte).join('')}</div>
      </section>` : ''}

      <div class="vz-schriftwarnung" id="vz-schrift" hidden></div>

      <section class="vz-block">
        <h2>${esc(t('help'))}</h2>
        <ol class="vz-schritte">
          <li><b>${esc(t('step1'))}</b><span>${esc(t('step1sub'))}</span></li>
          <li><b>${esc(t('step2'))}</b><span>${esc(t('step2sub'))}</span></li>
          <li><b>${esc(t('step3'))}</b><span>${esc(t('step3sub'))}</span></li>
        </ol>
        <p class="vz-hilfe-fuss"><a class="vz-textlink" href="#/s/hilfe">${esc(t('helpMore'))}</a></p>
      </section>`
  });

  zeigeSchrift();
}

/* Der Schrifthinweis kann erst beurteilt werden, wenn der Browser mit dem
   Laden fertig ist — vorher misst der Vergleich immer daneben. */
function zeigeSchrift(){
  const kasten = document.getElementById('vz-schrift');
  if (!kasten) return;
  const sage = () => {
    const text = schriftHinweis();
    if (!text) return;
    kasten.hidden = false;
    kasten.innerHTML = `<b>${esc(t('fontSub'))}</b> ${esc(text)} `
      + `<a class="vz-textlink" href="#/s/marke">${esc(t('fontWhere'))}</a>`;
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sage);
  else sage();
}

/* ---------- Ein Arbeitsbereich -------------------------------------------- */
function renderBereich(id){
  setPageSize('a4');
  const b = bereich(id);
  if (!b){ renderStart(); return; }

  const werkzeug = (b.seiten || []).map(sid => {
    const s = SEITEN[sid];
    return s ? `
      <a class="vz-werkzeug" href="#/s/${esc(s.id)}">
        <span class="vz-werkzeug-ico">${icon(s.icon, 20)}</span>
        <b>${esc(s.title)}</b><i>${esc(s.sub)}</i>
      </a>` : '';
  }).join('');

  seite({
    nav: 'b:' + b.id,
    krumenTeile: [[t('startPage'), '#/'], [b.title, null]],
    eyebrow: t('areaEyebrow'),
    titel: b.title,
    lede: b.lede,
    inhalt: `
      <div class="vz-cards">${b.ids.map(karte).join('')}</div>
      ${werkzeug ? `
      <section class="vz-block">
        <h2>${esc(t('tools'))}</h2>
        <div class="vz-werkzeuge">${werkzeug}</div>
      </section>` : ''}`
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
      /* `options` darf eine Funktion sein — dann wird die Liste bei jedem
         Zeichnen neu geholt. Gebraucht fuer die eigenen Textbausteine, die
         waehrend der Arbeit dazukommen koennen. */
      return `<div class="vz-field">${lbl}
        <select id="${id}" data-path="${esc(path)}">${wahlListe(optionen(f), v)}</select>${hint}</div>`;
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
          optionen(f).filter(o => o && o.gruppe == null).map(o => {
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

/**
 * Die Eintraege eines Auswahlfeldes als HTML.
 * Ein Eintrag mit `gruppe` statt `v` beginnt eine neue Gruppe — bei
 * sechsundachtzig Piktogrammen ist eine flache Liste nicht mehr zu
 * ueberblicken, und <optgroup> kostet nichts.
 */
function wahlListe(liste, wert){
  let html = '';
  let offen = false;
  for (const o of liste){
    if (o && o.gruppe != null){
      if (offen) html += '</optgroup>';
      html += `<optgroup label="${esc(o.gruppe)}">`;
      offen = true;
      continue;
    }
    html += `<option value="${esc(o.v)}"${String(o.v) === String(wert) ? ' selected' : ''}>${esc(o.t)}</option>`;
  }
  return html + (offen ? '</optgroup>' : '');
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
  if (!tpl){ view().innerHTML = `<div class="vz-seite"><p class="vz-leer">${esc(t('notFound'))}</p></div>`;
    markiereNav('start'); return; }
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

  const gruppe = bereichVon(tpl.id);
  merken(tpl.id);
  markiereNav(gruppe ? 'b:' + gruppe.id : 'start');

  view().innerHTML = `
    <div class="vz-editor">
      <aside class="vz-panel no-print">
        <nav class="vz-krumen" aria-label="Pfad">
          <a href="#/">${esc(t('startPage'))}</a><span aria-hidden="true">\u203a</span>
          ${gruppe ? `<a href="#/b/${esc(gruppe.id)}">${esc(gruppe.title)}</a><span aria-hidden="true">\u203a</span>` : ''}
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
          <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-stand">${esc(t('standSave'))}</button>
          <select class="vz-staende" id="vz-staende" title="${esc(t('standNone'))}"></select>
          <button class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-stand-del" hidden>${esc(t('standDel'))}</button>
          <input type="file" id="vz-json-file" accept="application/json" hidden>
        </div>
        <div class="vz-objekthinweis" id="vz-objekthinweis" hidden></div>
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
    sheet.className = `sheet sheet--${page} ${istMehrseitig(tpl, state) ? 'sheet--multi ' : ''}${tpl.root}` +
      (store.load('schnittmarken', '') === 'ja' ? ' sheet--marken' : '');
    setPageSize(page);
    sheet.innerHTML = tpl.render(state);
    /* Raster-Overlay (nur Vorschau): ein echtes Element je Blatt, damit es
       sich vor dem PNG-Export sauber entfernen laesst. */
    if (store.load('raster', '') === 'ja'){
      const ziele = sheet.querySelectorAll('[data-page]');
      (ziele.length ? Array.from(ziele) : [sheet]).forEach(el =>
        el.insertAdjacentHTML('beforeend', '<i class="vz-raster" aria-hidden="true"></i>'));
    }
    if (typeof tpl.mount === 'function'){
      activeUnmount = tpl.mount({
        sheet,
        panel: document.getElementById('vz-extra'),
        state,
        /* Nur sichern — ohne Neuzeichnen, damit das Ziehen fluessig bleibt. */
        save: () => saveState(tpl, state),
        /* Alles neu zeichnen, z. B. nach einem Formatwechsel. */
        repaint: () => { saveState(tpl, state); paint(); },
        /* Auch das Formular neu aufbauen — wenn eine Vorlagen-Funktion den
           Zustand asynchron ändert (z. B. ein geladener Karten-Ausschnitt). */
        rebuild: () => { saveState(tpl, state); paint(); rebuild(); }
      }) || null;
    }
    fitScaler();
    checkFit();
    checkFern();
    checkKontrast();
    zeigeObjektHinweis();
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
        <button type="button" class="vz-mini${store.load('schnittmarken', '') === 'ja' ? ' is-an' : ''}"
          data-schalter="schnittmarken" title="${esc(t('leisteMarken'))}">&#9986;</button>
        <button type="button" class="vz-mini${store.load('raster', '') === 'ja' ? ' is-an' : ''}"
          data-schalter="raster" title="${esc(t('leisteRaster'))}">&#8862;</button>
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
      const w = ev.target.closest('[data-schalter]');
      if (w){
        const k = w.dataset.schalter;
        store.save(k, store.load(k, '') === 'ja' ? 'nein' : 'ja');
        paint(); zeichneLeiste();
        return;
      }
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

  /* Laeuft die Vorlage auf einer anderen Liegenschaft als der aktiven, wird
     das gesagt — mit einem Knopf daneben. Stillschweigend umstellen waere
     schlimmer: dann aendert sich ein fertiger Aushang beim blossen Oeffnen. */
  function zeigeObjektHinweis(){
    const kasten = document.getElementById('vz-objekthinweis');
    if (!kasten) return;
    const aktiv = aktivesObjektId();
    if (!aktiv || !Object.hasOwn(state, 'objekt') || state.objekt === aktiv){
      kasten.hidden = true; kasten.innerHTML = ''; return;
    }
    kasten.hidden = false;
    kasten.innerHTML = `
      <span>${esc(t('propertyDiffers')
        .replace('%1', objekt(state.objekt).name)
        .replace('%2', objekt(aktiv).name))}</span>
      <button type="button" class="vz-btn vz-btn--sm" id="vz-objekt-um">${esc(t('propertySwitchTo'))}</button>`;
    document.getElementById('vz-objekt-um').onclick = () => {
      if (setzeObjektImZustand(state, aktiv)){ commit(); rebuild(); }
    };
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

  /* Bilder beim Ablegen verkleinern: ein Handy-Foto hat 8 MB — der
     Browser-Speicher (und der Teilen-Link) verträgt das nicht. Alles über
     2200 px Kante oder 1.5 MB wird auf 2200 px verkleinert und als JPEG
     gespeichert; kleine PNG (Logos, Transparenz) bleiben unangetastet. */
  function readImage(file, path){
    const fr = new FileReader();
    fr.onload = () => {
      const roh = fr.result;
      const gross = file.size > 1.5 * 1024 * 1024;
      const img = new Image();
      img.onload = () => {
        const kante = Math.max(img.width, img.height);
        if (!gross && kante <= 2200){ setPath(state, path, roh); commit(); rebuild(); return; }
        const s = Math.min(1, 2200 / kante);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const klein = file.type === 'image/png' && !gross
          ? c.toDataURL('image/png')
          : c.toDataURL('image/jpeg', 0.85);
        setPath(state, path, klein.length < roh.length ? klein : roh);
        commit(); rebuild();
      };
      img.onerror = () => { setPath(state, path, roh); commit(); rebuild(); };
      img.src = roh;
    };
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
      sheet.querySelectorAll('.vz-raster').forEach(el => el.remove());
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
    }finally{ btn.disabled = false; btn.textContent = old; paint(); }
  };
  document.getElementById('vz-reset').onclick = () => {
    if (!confirm(t('resetAsk'))) return;
    store.remove(draftKey(tpl.id));
    renderEditor(tpl.id);
  };

  /* Benannte Stände: mehrere Fassungen je Vorlage — «Placa I16»,
     «Sommerfest», eine Idee für später. Liegen im Browser und damit
     automatisch auch in der Sicherungsdatei. */
  const standWahl = document.getElementById('vz-staende');
  const standDel  = document.getElementById('vz-stand-del');
  function standListe(){
    const a = staende(tpl.id);
    standWahl.innerHTML = `<option value="">${esc(t('standNone'))}</option>`
      + a.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('');
    standWahl.hidden = !a.length;
    standDel.hidden = true;
  }
  standListe();
  document.getElementById('vz-stand').onclick = () => {
    const name = prompt(t('standAsk'), standWahl.value || '');
    if (name == null) return;
    if (standSpeichern(tpl.id, name, state)){
      standListe();
      standWahl.value = String(name).trim().slice(0, 60);
      standDel.hidden = !standWahl.value;
      toast(t('standDone'));
    }
  };
  standWahl.onchange = () => {
    const name = standWahl.value;
    standDel.hidden = !name;
    if (!name) return;
    const s = stand(tpl.id, name);
    if (!s) return;
    if (!confirm(t('standLoadAsk'))){ standWahl.value = ''; standDel.hidden = true; return; }
    Object.keys(state).forEach(k => { delete state[k]; });
    Object.assign(state, JSON.parse(JSON.stringify(s.zustand)));
    commit(); rebuild();
    toast(t('standLoaded'));
    standWahl.value = name;
    standDel.hidden = false;
  };
  standDel.onclick = () => {
    const name = standWahl.value;
    if (!name || !confirm(t('standDelAsk').replace('%s', name))) return;
    standLoeschen(tpl.id, name);
    standListe();
    toast(t('standDeleted'));
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

/* ---------- Werkzeugseiten ------------------------------------------------ */
/* Seiten ohne Druckvorlage. Sie erklären, verwalten oder zeigen den Stand —
   und gehören darum nicht in den Editor einer einzelnen Vorlage. */

function renderSeite(id){
  setPageSize('a4');
  if (id === 'hilfe')  return seiteHilfe();
  if (id === 'eigene') return seiteEigene();
  if (id === 'marke')  return seiteMarke();
  if (id === 'schrift') return seiteSchrift();
  if (id === 'piktogramme') return seitePiktogramme();
  if (id === 'liegenschaften') return seiteLiegenschaften();
  renderStart();
}

/* --- Anleitung ------------------------------------------------------------ */
function seiteHilfe(){
  const s = SEITEN.hilfe;
  seite({
    nav: 's:hilfe',
    krumenTeile: [[t('startPage'), '#/'], [s.title, null]],
    eyebrow: t('toolEyebrow'),
    titel: s.title,
    lede: s.sub,
    inhalt: `
      <section class="vz-block">
        <h2>${esc(t('helpFlow'))}</h2>
        <ol class="vz-fluss">
          ${[
            { ico:'lupe',    b:t('step1'), s:t('step1sub') },
            { ico:'stift',   b:t('step2'), s:t('step2sub') },
            { ico:'printer', b:t('step3'), s:t('step3sub') }
          ].map(x => `<li>
            <span class="vz-fluss-ico">${icon(x.ico, 26)}</span>
            <b>${esc(x.b)}</b><span>${esc(x.s)}</span>
          </li>`).join('')}
        </ol>
      </section>

      <section class="vz-block">
        <h2>${esc(t('helpMap'))}</h2>
        <p class="vz-block-note">${esc(t('helpMapSub'))}</p>
        <div class="vz-hilfe-chips">
          ${BEREICHE.map(b => `<a class="vz-hilfe-chip" href="#/b/${esc(b.id)}">
            ${icon(b.icon, 18)}<b>${esc(b.kurz)}</b><em>${bereichZahl(b)}</em>
          </a>`).join('')}
        </div>
        <p class="vz-block-note" style="margin:14px 0 10px">${esc(t('helpToolPages'))}</p>
        <div class="vz-hilfe-chips">
          ${Object.values(SEITEN).filter(s => s.id !== 'hilfe').map(s => `
            <a class="vz-hilfe-chip vz-hilfe-chip--werkzeug" href="#/s/${esc(s.id)}">
              ${icon(s.icon, 18)}<b>${esc(s.title)}</b>
            </a>`).join('')}
        </div>
      </section>

      <section class="vz-block">
        <h2>${esc(t('helpTips'))}</h2>
        <ul class="vz-tipps">
          ${[
            { ico:'lupe',    txt:t('tipSearch') },
            { ico:'stern',   txt:t('tipStar') },
            { ico:'stift',   txt:t('tipDraft') },
            { ico:'globe',   txt:t('tipLang') },
            { ico:'door',    txt:t('tipHouse') },
            { ico:'photo',   txt:t('tipImage') },
            { ico:'printer', txt:t('tipPdf') }
          ].map(x => `<li><span class="vz-tipp-ico">${icon(x.ico, 18)}</span><span>${x.txt}</span></li>`).join('')}
        </ul>
      </section>

      <section class="vz-block">
        <h2>${esc(t('helpPrint'))}</h2>
        <p class="vz-hilfe-fuss">${t('helpFoot')}</p>
      </section>

      <section class="vz-block">
        <h2>${esc(t('helpKeys'))}</h2>
        <dl class="vz-tasten">
          <dt><kbd>/</kbd></dt><dd>${esc(t('keySearch'))}</dd>
          <dt><kbd>Esc</kbd></dt><dd>${esc(t('keyEsc'))}</dd>
          <dt><kbd>Tab</kbd></dt><dd>${esc(t('keyTab'))}</dd>
        </dl>
      </section>

      <section class="vz-block">
        <h2>${esc(t('backupTitle'))}</h2>
        <p class="vz-hilfe-fuss">${esc(t('backupText'))}</p>
        <div class="vz-block-btns" style="margin-top:12px">
          <button type="button" class="vz-btn vz-btn--sm" id="vz-sig-export">${esc(t('backupSave'))}</button>
          <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-sig-import">${esc(t('backupLoad'))}</button>
          <input type="file" id="vz-sig-datei" accept="application/json" hidden>
        </div>
      </section>

      <section class="vz-block">
        <h2>${esc(t('helpOffline'))}</h2>
        <p class="vz-hilfe-fuss">${t('helpOfflineText')}</p>
      </section>`
  });

  document.getElementById('vz-sig-export').onclick = () => {
    downloadBlob(new Blob([sicherungAlsDatei()], { type:'application/json' }),
                 'ns-hotel-zentrale-sicherung.json');
  };
  const sigDatei = document.getElementById('vz-sig-datei');
  document.getElementById('vz-sig-import').onclick = () => {
    if (confirm(t('backupAsk'))) sigDatei.click();
  };
  sigDatei.onchange = () => {
    const f = sigDatei.files && sigDatei.files[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try{
        sicherungLaden(fr.result);
        toast(t('backupDone'));
        setTimeout(() => location.reload(), 900);
      }catch(_){ toast(t('backupBad')); }
    };
    fr.readAsText(f);
    sigDatei.value = '';
  };
}

/* --- Eigene Textbausteine -------------------------------------------------- */
/* Bisher steckte die Verwaltung im Editor des Hinweis-Aushangs — man musste
   also erst einen Aushang öffnen, um einen Satz zu löschen, der mit diesem
   Aushang nichts zu tun hatte. Hier steht sie für sich. */
function seiteEigene(){
  const s = SEITEN.eigene;
  const liste = eigeneBausteine();

  const zeilen = liste.length ? liste.map(p => `
    <div class="vz-baustein" data-baustein="${esc(p.id)}">
      <div class="vz-baustein-kopf">
        <span class="vz-baustein-ico">${icon(p.icon || 'info', 20)}</span>
        <b>${esc(p.label)}</b>
        <span class="vz-baustein-ton vz-baustein-ton--${esc(p.ton || 'info')}">${esc(p.ton || 'info')}</span>
      </div>
      <p class="vz-baustein-text">${esc(p.titel && p.titel.de || '')}${
        p.text && p.text.de ? ' — ' + esc(p.text.de) : ''}</p>
      <div class="vz-baustein-btns">
        <a class="vz-btn vz-btn--sm" href="#/t/hinweis?w=${encodeURIComponent(p.id)}">${esc(t('blockOpen'))}</a>
        <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost"
                data-loeschen="${esc(p.id)}">${esc(t('blockDelete'))}</button>
      </div>
    </div>`).join('')
    : `<p class="vz-leer">${esc(t('blockNone'))}</p>`;

  seite({
    nav: 's:eigene',
    krumenTeile: [[t('startPage'), '#/'], [s.title, null]],
    eyebrow: t('toolEyebrow'),
    titel: s.title,
    lede: s.sub,
    inhalt: `
      <section class="vz-block">
        <div class="vz-block-kopf">
          <h2>${esc(t('blockYours'))} <em>${liste.length}</em></h2>
          <div class="vz-block-btns">
            <a class="vz-btn vz-btn--sm vz-btn--navy" href="#/t/hinweis">${esc(t('blockNew'))}</a>
            <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-eigen-export"
              ${liste.length ? '' : 'disabled'}>${esc(t('blockExport'))}</button>
            <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-eigen-import">${esc(t('blockImport'))}</button>
            <input type="file" id="vz-eigen-datei" accept="application/json" hidden>
          </div>
        </div>
        <p class="vz-block-note">${esc(t('blockNote'))}</p>
        <div class="vz-bausteine">${zeilen}</div>
      </section>`
  });

  const wurzel = view();
  wurzel.addEventListener('click', ev => {
    const del = ev.target.closest('[data-loeschen]');
    if (!del) return;
    if (!confirm(t('blockDeleteAsk'))) return;
    bausteinLoeschen(del.dataset.loeschen);
    seiteEigene();
    toast(t('blockDeleted'));
  });

  document.getElementById('vz-eigen-export').onclick = () => {
    const blob = new Blob([sammlungAlsDatei()], { type:'application/json' });
    downloadBlob(blob, 'ns-hotel-bausteine.json');
    toast(t('saved'));
  };
  const datei = document.getElementById('vz-eigen-datei');
  document.getElementById('vz-eigen-import').onclick = () => datei.click();
  datei.onchange = () => {
    const f = datei.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try{
        const { dazu, ersetzt } = sammlungLaden(fr.result);
        seiteEigene();
        toast(`${t('blockLoaded')} · +${dazu} / ~${ersetzt}`);
      }catch(err){ alert(t('blockBadFile')); }
    };
    fr.readAsText(f);
  };
}

/* --- Marke und Schrift ----------------------------------------------------- */
/* Ein Aushang in der Ersatzschrift sieht nicht falsch aus — er sieht nur nach
   einem anderen Haus aus. Damit das nicht unbemerkt bleibt, steht der Stand
   hier schwarz auf weiss. */
function seiteMarke(){
  const s = SEITEN.marke;
  const farben = [
    ['--navy',  'Navy',        'Text, Fusszeilen, N’s-Pin'],
    ['--cyan',  'Cyan',        'Markenakzent, Handschrift-Zeile'],
    ['--green', 'Grün',        'Grünzonen und Fusswege'],
    ['--red',   'Rot',         'Notfall und Verbot'],
    ['--ink-soft', 'Grauton',  'Nebentexte'],
    ['--line',  'Linie',       'Trennlinien und Rahmen']
  ];

  seite({
    nav: 's:marke',
    krumenTeile: [[t('startPage'), '#/'], [s.title, null]],
    eyebrow: t('toolEyebrow'),
    titel: s.title,
    lede: s.sub,
    inhalt: `
      <section class="vz-block">
        <h2>${esc(t('brandFonts'))}</h2>
        <div class="vz-schriftstand" id="vz-schriftstand"></div>
        <p class="vz-block-note">${t('fontHow')}</p>
      </section>

      <section class="vz-block">
        <h2>${esc(t('brandColours'))}</h2>
        <div class="vz-farben">${farben.map(([v, name, wofuer]) => `
          <div class="vz-farbe">
            <span class="vz-farbe-feld" style="background:var(${v})"></span>
            <b>${esc(name)}</b>
            <code data-token="${esc(v)}">${esc(v)}</code>
            <i>${esc(wofuer)}</i>
          </div>`).join('')}
        </div>
        <p class="vz-block-note">${esc(t('brandColoursNote'))}</p>
      </section>`
  });

  /* Die tatsächlichen Werte aus den Tokens nachtragen — so steht hier immer,
     was wirklich gilt, und nicht eine abgeschriebene Kopie davon. */
  const stil = getComputedStyle(document.documentElement);
  view().querySelectorAll('[data-token]').forEach(el => {
    const wert = stil.getPropertyValue(el.dataset.token).trim();
    if (wert) el.textContent = wert;
  });

  const kasten = document.getElementById('vz-schriftstand');
  const zeige = () => {
    const b = schriftBefund();
    kasten.innerHTML = MARKEN_SCHRIFTEN.map(f => {
      const da = b.vorhanden.some(x => x.id === f.id);
      return `
        <div class="vz-schriftzeile vz-schriftzeile--${da ? 'ok' : 'ersatz'}">
          <span class="vz-schriftzeile-punkt" aria-hidden="true"></span>
          <b style="font-family:${da ? `'${f.familie}', ` : ''}var(--font-body)">${esc(f.familie)}</b>
          <i>${esc(f.wofuer)}</i>
          <em>${da ? esc(t('fontLive')) : esc(t('fontFallback')) + ': ' + esc(f.ersatz)}</em>
        </div>`;
    }).join('');
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(zeige);
  else zeige();
}

/* --- Schriften waehlen ------------------------------------------------------ */
/* Die gekaufte Schrift steht immer vorn: gewaehlt wird der Ersatz, nicht die
   Marke. Wer Gotham auf dem Rechner hat, sieht weiterhin Gotham. */
function seiteSchrift(){
  const s = SEITEN.schrift;
  const gewaehlt = wahl();
  const eigen = eigeneSchrift();

  const bloecke = ROLLEN.map(r => {
    const kandidaten = familienFuer(r.id).slice();
    if (eigen) kandidaten.push({ id:EIGEN_FAMILIE, grund:r.grund, rollen:[r.id],
                                 urteil:`Selbst hochgeladen: ${eigen.datei || eigen.name}` });
    const karten = kandidaten.map(f => {
      const an = gewaehlt[r.id] === f.id;
      /* Die Probe steht in der Groesse, in der die Rolle wirklich arbeitet:
         ein Titel gross, ein Fliesstext klein. `skala` gleicht dabei die
         unterschiedlichen x-Hoehen aus — sonst vergliche man die Skalierung
         statt der Form. */
      const stil = `font-family:'${f.id}', ${f.grund};font-weight:${f.gewicht || 400};`
                 + `font-size:${Math.round((r.probeGroesse || 26) * (f.skala || 1))}px`;
      return `
        <button type="button" class="vz-schriftkarte${an ? ' is-an' : ''}"
                data-rolle="${esc(r.id)}" data-familie="${esc(f.id)}"
                aria-pressed="${an}">
          <span class="vz-schriftkarte-kopf">
            <b>${esc(f.id)}</b>
            ${an ? `<em>${esc(t('fontInUse'))}</em>` : ''}
          </span>
          <span class="vz-schriftkarte-probe" style="${stil}">${esc(r.probe)}</span>
          <span class="vz-schriftkarte-urteil">${esc(f.urteil)}</span>
        </button>`;
    }).join('');

    return `
      <section class="vz-block">
        <div class="vz-block-kopf">
          <h2>${esc(r.titel)}</h2>
          <span class="vz-rolle-jetzt">${esc(t('fontChosen'))}: <b>${esc(gewaehlt[r.id])}</b></span>
        </div>
        <p class="vz-block-note">${esc(r.was)}${
          r.marke ? ` ${esc(t('fontBrandFirst').replaceAll('%s', r.marke))}` : ''}</p>
        <div class="vz-schriftkarten">${karten}</div>
      </section>`;
  }).join('');

  seite({
    nav: 's:schrift',
    krumenTeile: [[t('startPage'), '#/'], [s.title, null]],
    eyebrow: t('toolEyebrow'),
    titel: s.title,
    lede: s.sub,
    inhalt: `
      <div class="vz-hinweiskasten">
        <b>${esc(t('fontScopeTitle'))}</b>
        <span>${esc(t('fontScopeText'))}</span>
      </div>

      ${bloecke}

      <section class="vz-block">
        <div class="vz-block-kopf">
          <h2>${esc(t('fontOwn'))}</h2>
          <div class="vz-block-btns">
            <button type="button" class="vz-btn vz-btn--sm vz-btn--navy" id="vz-schrift-laden">${esc(t('fontOwnAdd'))}</button>
            ${eigen ? `<button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-schrift-weg">${esc(t('fontOwnRemove'))}</button>` : ''}
            <input type="file" id="vz-schrift-datei" accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf" hidden>
          </div>
        </div>
        <p class="vz-block-note">${esc(t('fontOwnNote'))}</p>
        ${eigen ? `
        <div class="vz-schriftzeile vz-schriftzeile--ok">
          <span class="vz-schriftzeile-punkt" aria-hidden="true"></span>
          <b style="font-family:'${EIGEN_FAMILIE}', sans-serif">${esc(eigen.datei || eigen.name)}</b>
          <i>${esc(t('fontOwnLive'))}</i>
        </div>` : `<p class="vz-leer">${esc(t('fontOwnNone'))}</p>`}
      </section>

      <section class="vz-block">
        <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-schrift-reset"
                ${istVoreinstellung() ? 'disabled' : ''}>${esc(t('fontReset'))}</button>
      </section>`
  });

  view().addEventListener('click', ev => {
    const karte = ev.target.closest('[data-familie]');
    if (!karte) return;
    setzeWahl(karte.dataset.rolle, karte.dataset.familie);
    seiteSchrift();
    toast(t('fontSaved'));
  });

  const datei = document.getElementById('vz-schrift-datei');
  document.getElementById('vz-schrift-laden').onclick = () => datei.click();
  datei.onchange = () => {
    const f = datei.files[0]; if (!f) return;
    /* Der Browser-Speicher fasst ungefähr fünf Megabyte, und als Data-URI
       wächst eine Datei um ein Drittel. Über ein Megabyte lohnt der Versuch
       nicht mehr. */
    if (f.size > 1024 * 1024){ alert(t('fontOwnTooBig')); return; }
    const fr = new FileReader();
    fr.onload = () => {
      const ok = eigeneSchriftSichern({ name:f.name.replace(/\.[^.]+$/, ''), datei:f.name, datenUri:fr.result });
      if (!ok){ alert(t('fontOwnTooBig')); return; }
      seiteSchrift();
      toast(t('fontOwnDone'));
    };
    fr.readAsDataURL(f);
  };

  const weg = document.getElementById('vz-schrift-weg');
  if (weg) weg.onclick = () => {
    if (!confirm(t('fontOwnRemoveAsk'))) return;
    eigeneSchriftLoeschen();
    seiteSchrift();
    toast(t('fontOwnGone'));
  };

  document.getElementById('vz-schrift-reset').onclick = () => {
    wahlZuruecksetzen();
    seiteSchrift();
    toast(t('fontReset'));
  };
}

/* --- Piktogramme ------------------------------------------------------------ */
/* Sechsundachtzig Zeichen sind zu viele für ein Auswahlfeld allein. Hier
   liegen sie ausgebreitet: suchen, ansehen, den Namen mitnehmen. */
function seitePiktogramme(){
  const s = SEITEN.piktogramme;
  const alle = iconListe();

  seite({
    nav: 's:piktogramme',
    krumenTeile: [[t('startPage'), '#/'], [s.title, null]],
    eyebrow: t('toolEyebrow'),
    titel: s.title,
    lede: s.sub,
    inhalt: `
      <div class="vz-piktoleiste">
        <label for="vz-pikto-suche">${esc(t('search'))}</label>
        <input id="vz-pikto-suche" type="search" autocomplete="off"
               placeholder="${esc(t('pictoSearch'))}">
        <span class="vz-pikto-zahl" id="vz-pikto-zahl">${alle.length}</span>
      </div>
      <div id="vz-pikto-liste"></div>
      <p class="vz-block-note" style="margin-top:22px">${t('pictoNote')}</p>`
  });

  const liste = document.getElementById('vz-pikto-liste');
  const feld = document.getElementById('vz-pikto-suche');
  const zahl = document.getElementById('vz-pikto-zahl');

  function zeichne(){
    const frage = normal(feld.value);
    const treffer = frage
      ? alle.filter(p => normal(p.label + ' ' + p.id + ' ' + p.gruppeTitel).includes(frage))
      : alle;
    zahl.textContent = String(treffer.length);

    if (!treffer.length){
      liste.innerHTML = `<p class="vz-leer">${esc(t('pictoNone'))}</p>`;
      return;
    }
    liste.innerHTML = GRUPPEN.map(g => {
      const drin = treffer.filter(p => p.gruppe === g.id);
      if (!drin.length) return '';
      return `
        <section class="vz-block">
          <h2>${esc(g.titel)} <em>${drin.length}</em></h2>
          <div class="vz-piktos">${drin.map(p => `
            <button type="button" class="vz-pikto" data-pikto="${esc(p.id)}"
                    title="${esc(t('pictoCopy'))}">
              <span class="vz-pikto-bild">${icon(p.id, 30, 1.7)}</span>
              <b>${esc(p.label)}</b>
              <code>${esc(p.id)}</code>
            </button>`).join('')}
          </div>
        </section>`;
    }).join('');
  }

  feld.addEventListener('input', zeichne);
  liste.addEventListener('click', async ev => {
    const p = ev.target.closest('[data-pikto]');
    if (!p) return;
    const name = p.dataset.pikto;
    try{
      await navigator.clipboard.writeText(name);
      toast(`${t('pictoCopied')}: ${name}`);
    }catch(_){
      /* Ohne Zwischenablage — etwa als lokale Datei — bleibt der Name
         wenigstens sichtbar zum Abschreiben. */
      window.prompt(t('pictoCopy'), name);
    }
  });
  zeichne();
}

/* --- Liegenschaften und Firmen --------------------------------------------- */
/* Die feste Liste ist der Bestand aus dem Laufwerk. Sie reicht nicht: es
   kommen Häuser dazu, und niemand kann warten, bis jemand eine Datei ändert.
   Hier legt man eigene an — sie bleiben im Browser und stehen danach in jeder
   Vorlage zur Wahl. */

/* Welcher Eintrag gerade im Formular liegt. Leer = neu anlegen. */
let objektFormular = null;      // { art:'objekt'|'absender', daten:{} } | null

function seiteLiegenschaften(){
  const s = SEITEN.liegenschaften;
  const aktiv = aktivesObjektId();
  const eigeneO = eigeneObjekte();
  const eigeneA = eigeneAbsender();

  const objektZeile = (o) => `
    <div class="vz-objektzeile${o.id === aktiv ? ' is-aktiv' : ''}">
      <span class="vz-objektzeile-code">${esc(o.code || '—')}</span>
      <span class="vz-objektzeile-txt">
        <b>${esc(o.name)}</b>
        <i>${esc(objektAdresse(o.id) || t('propertyNoAddress'))}</i>
      </span>
      <span class="vz-objektzeile-firma">${esc(firmenName(o.absender))}</span>
      <span class="vz-objektzeile-btns">
        ${o.id === aktiv
          ? `<span class="vz-marke-aktiv">${esc(t('propertyIsActive'))}</span>`
          : `<button type="button" class="vz-btn vz-btn--sm" data-aktiv="${esc(o.id)}">${esc(t('propertyUse'))}</button>`}
        ${o.eigen ? `
          <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" data-bearbeiten="${esc(o.id)}">${esc(t('edit'))}</button>
          <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" data-objweg="${esc(o.id)}">${esc(t('blockDelete'))}</button>` : ''}
      </span>
    </div>`;

  const firmaZeile = (a) => `
    <div class="vz-objektzeile">
      <span class="vz-objektzeile-code">${esc(a.eigen ? '·' : '★')}</span>
      <span class="vz-objektzeile-txt">
        <b>${esc(a.name)}</b>
        <i>${esc([a.street, [a.zip, a.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
                 || t('propertyNoAddress'))}</i>
      </span>
      <span class="vz-objektzeile-firma">${esc(a.contact || '')}</span>
      <span class="vz-objektzeile-btns">
        ${a.eigen ? `
          <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" data-firmabearbeiten="${esc(a.id)}">${esc(t('edit'))}</button>
          <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" data-firmaweg="${esc(a.id)}">${esc(t('blockDelete'))}</button>` : ''}
      </span>
    </div>`;

  seite({
    nav: 's:liegenschaften',
    krumenTeile: [[t('startPage'), '#/'], [s.title, null]],
    eyebrow: t('toolEyebrow'),
    titel: s.title,
    lede: s.sub,
    inhalt: `
      <div class="vz-hinweiskasten">
        <b>${esc(t('propertyScopeTitle'))}</b>
        <span>${esc(t('propertyScopeText'))}</span>
      </div>

      ${objektFormular ? objektFormularHtml() : ''}

      <section class="vz-block">
        <div class="vz-block-kopf">
          <h2>${esc(t('properties'))} <em>${alleObjekte().filter(o => o.code).length}</em></h2>
          <div class="vz-block-btns">
            <button type="button" class="vz-btn vz-btn--sm vz-btn--navy" id="vz-obj-neu">${esc(t('propertyNew'))}</button>
            <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-obj-export"
              ${eigeneO.length || eigeneA.length ? '' : 'disabled'}>${esc(t('blockExport'))}</button>
            <button type="button" class="vz-btn vz-btn--sm vz-btn--ghost" id="vz-obj-import">${esc(t('blockImport'))}</button>
            <input type="file" id="vz-obj-datei" accept="application/json" hidden>
          </div>
        </div>
        <p class="vz-block-note">${esc(t('propertyFixedNote'))}</p>
        <div class="vz-objektliste">${alleObjekte().filter(o => o.code).map(objektZeile).join('')}</div>
      </section>

      <section class="vz-block">
        <div class="vz-block-kopf">
          <h2>${esc(t('companies'))} <em>${alleAbsender().length}</em></h2>
          <div class="vz-block-btns">
            <button type="button" class="vz-btn vz-btn--sm" id="vz-firma-neu">${esc(t('companyNew'))}</button>
          </div>
        </div>
        <p class="vz-block-note">${esc(t('companyNote'))}</p>
        <div class="vz-objektliste">${alleAbsender().map(firmaZeile).join('')}</div>
      </section>`
  });

  const wurzel = view();

  wurzel.addEventListener('click', ev => {
    const zu = (knopf, tu) => { const el = ev.target.closest(knopf); if (el) tu(el); return Boolean(el); };

    if (zu('[data-aktiv]', el => {
      setzeAktivesObjekt(el.dataset.aktiv);
      mountRahmen();
      seiteLiegenschaften();
      toast(`${t('propertySwitched')}: ${objekt(el.dataset.aktiv).name}`);
    })) return;

    if (zu('[data-bearbeiten]', el => {
      objektFormular = { art:'objekt', daten:{ ...objekt(el.dataset.bearbeiten) } };
      seiteLiegenschaften();
    })) return;

    if (zu('[data-objweg]', el => {
      if (!confirm(t('propertyDeleteAsk'))) return;
      objektLoeschen(el.dataset.objweg);
      objektFormular = null;
      mountRahmen();
      seiteLiegenschaften();
      toast(t('propertyDeleted'));
    })) return;

    if (zu('[data-firmabearbeiten]', el => {
      const a = alleAbsender().find(x => x.id === el.dataset.firmabearbeiten);
      objektFormular = { art:'absender', daten:{ ...a } };
      seiteLiegenschaften();
    })) return;

    if (zu('[data-firmaweg]', el => {
      if (!confirm(t('companyDeleteAsk'))) return;
      absenderLoeschen(el.dataset.firmaweg);
      objektFormular = null;
      seiteLiegenschaften();
      toast(t('companyDeleted'));
    })) return;
  });

  document.getElementById('vz-obj-neu').onclick = () => {
    objektFormular = { art:'objekt', daten:{ absender:'immobilien' } };
    seiteLiegenschaften();
    document.getElementById('vz-of-code')?.focus();
  };
  document.getElementById('vz-firma-neu').onclick = () => {
    objektFormular = { art:'absender', daten:{} };
    seiteLiegenschaften();
    document.getElementById('vz-of-name')?.focus();
  };

  document.getElementById('vz-obj-export').onclick = () => {
    downloadBlob(new Blob([bestandAlsDatei()], { type:'application/json' }),
                 'ns-hotel-liegenschaften.json');
    toast(t('saved'));
  };
  const datei = document.getElementById('vz-obj-datei');
  document.getElementById('vz-obj-import').onclick = () => datei.click();
  datei.onchange = () => {
    const f = datei.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try{
        const { objekte, absender } = bestandLaden(fr.result);
        mountRahmen();
        seiteLiegenschaften();
        toast(`${t('blockLoaded')} · ${objekte} + ${absender}`);
      }catch(err){ alert(t('propertyBadFile')); }
    };
    fr.readAsText(f);
  };

  if (objektFormular) formularBinden();
}

/** Name einer Firma zum Anzeigen — auch wenn es sie nicht mehr gibt. */
function firmenName(id){
  const a = alleAbsender().find(x => x.id === id);
  return a ? a.name : '';
}

/* Das Formular. Bewusst dieselben Feldnamen wie in objekte.js, damit man
   beim Lesen nicht übersetzen muss. */
function objektFormularHtml(){
  const { art, daten } = objektFormular;
  const feld = (k, label, hinweis) => `
    <div class="vz-field">
      <label for="vz-of-${k}">${esc(label)}</label>
      <input id="vz-of-${k}" type="text" data-of="${k}" value="${esc(daten[k] || '')}">
      ${hinweis ? `<span class="vz-hint">${esc(hinweis)}</span>` : ''}
    </div>`;

  const neu = !daten.id;
  const inhalt = art === 'objekt' ? `
    ${feld('code', t('propertyCode'), t('propertyCodeHint'))}
    ${feld('name', t('propertyName'), t('propertyNameHint'))}
    ${feld('street', t('propertyStreet'))}
    ${feld('zip', t('propertyZip'))}
    ${feld('city', t('propertyCity'))}
    <div class="vz-field">
      <label for="vz-of-absender">${esc(t('propertyCompany'))}</label>
      <select id="vz-of-absender" data-of="absender">
        ${alleAbsender().map(a =>
          `<option value="${esc(a.id)}"${a.id === daten.absender ? ' selected' : ''}>${esc(a.name)}</option>`).join('')}
      </select>
      <span class="vz-hint">${esc(t('propertyCompanyHint'))}</span>
    </div>` : `
    ${feld('name', t('companyName'), t('companyNameHint'))}
    ${feld('legal', t('companyLegal'))}
    ${feld('street', t('propertyStreet'))}
    ${feld('zip', t('propertyZip'))}
    ${feld('city', t('propertyCity'))}
    ${feld('contact', t('companyContact'), t('companyContactHint'))}
    ${feld('foot', t('companyFoot'), t('companyFootHint'))}`;

  return `
    <section class="vz-block vz-objektform" id="vz-objektform">
      <div class="vz-block-kopf">
        <h2>${esc(neu
          ? (art === 'objekt' ? t('propertyNew') : t('companyNew'))
          : (art === 'objekt' ? t('propertyEdit') : t('companyEdit')))}</h2>
      </div>
      <div class="vz-objektfelder">${inhalt}</div>
      <div class="vz-block-btns" style="margin-top:14px">
        <button type="button" class="vz-btn vz-btn--navy" id="vz-of-sichern">${esc(t('propertySave'))}</button>
        <button type="button" class="vz-btn vz-btn--ghost" id="vz-of-abbruch">${esc(t('cancel'))}</button>
      </div>
    </section>`;
}

function formularBinden(){
  const kasten = document.getElementById('vz-objektform');
  if (!kasten) return;

  kasten.addEventListener('input', ev => {
    const el = ev.target.closest('[data-of]');
    if (el) objektFormular.daten[el.dataset.of] = el.value;
  });
  kasten.addEventListener('change', ev => {
    const el = ev.target.closest('[data-of]');
    if (el) objektFormular.daten[el.dataset.of] = el.value;
  });

  document.getElementById('vz-of-abbruch').onclick = () => {
    objektFormular = null;
    seiteLiegenschaften();
  };

  document.getElementById('vz-of-sichern').onclick = () => {
    const { art, daten } = objektFormular;

    if (art === 'objekt'){
      /* Ohne Kürzel taucht die Liegenschaft weder im Umschalter noch in einer
         Serie auf — das Kürzel ist das, woran sie erkannt wird. */
      if (!String(daten.code || '').trim()){ alert(t('propertyCodeMissing')); return; }
      const id = objektSichern(daten);
      if (!id){ alert(t('propertySaveFailed')); return; }
      objektFormular = null;
      mountRahmen();
      seiteLiegenschaften();
      toast(t('propertySaved'));
      return;
    }

    if (!String(daten.name || '').trim()){ alert(t('companyNameMissing')); return; }
    if (!absenderSichern(daten)){ alert(t('propertySaveFailed')); return; }
    objektFormular = null;
    seiteLiegenschaften();
    toast(t('companySaved'));
  };
}

/* ---------- Router -------------------------------------------------------- */
/* Die alten Kapitel-Adressen (#/k/...) stecken in verschickten Links und in
   ausgedruckten Anleitungen. Sie fuehren weiter — auf den Arbeitsbereich,
   in dem die Vorlagen von damals heute stehen. */
const ALTE_KAPITEL = {
  hausordnung:'hausordnung', sicherheit:'sicherheit', parken:'ankommen',
  abfall:'unterhalt', waesche:'unterhalt', hotel:'zimmer',
  wegweiser:'ankommen', etiketten:'unterhalt', hilfe:'team', plaene:'ankommen'
};

function route(){
  unmountActive();
  const hash = location.hash || '#/';
  window.scrollTo(0, 0);
  schubladeZeigen(false);
  /* Im Editor schrumpft die Seitenleiste zur Schiene aus Icons. Die Vorschau
     ist dort das Wichtigste auf dem Schirm; die Navigation muss nur noch
     erreichbar bleiben, nicht lesbar. */
  document.body.classList.toggle('vz-im-editor', /^#\/t\//.test(hash));

  /* #/b/<bereich> — ein Arbeitsbereich */
  const b = /^#\/b\/([\w-]+)/.exec(hash);
  if (b){ renderBereich(b[1]); return; }

  /* #/s/<seite> — Anleitung, eigene Bausteine, Marke */
  const w = /^#\/s\/([\w-]+)/.exec(hash);
  if (w){ renderSeite(w[1]); return; }

  /* #/k/<kapitel> — alte Adresse, umgeleitet */
  const k = /^#\/k\/([\w-]+)/.exec(hash);
  if (k){ location.replace('#/b/' + (ALTE_KAPITEL[k[1]] || 'ankommen')); return; }

  /* #/t/<vorlage> — der Editor. Optional:
       ?d=<Nutzlast>  ein geteilter Entwurf
       ?w=<Wert>      ein Treffer aus der Suche (Baustein, Zeichen, Fraktion) */
  const m = /^#\/t\/([\w-]+)(?:\?(?:d=([A-Za-z0-9\-_]+)|w=([^&]*)))?/.exec(hash);
  if (m){
    renderEditor(m[1], m[2] || null, m[3] ? decodeURIComponent(m[3]) : null);
    return;
  }
  renderStart();
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

/* Stern auf einer Karte: anheften/lösen ohne die Karte zu öffnen. Der Knopf
   steht neben dem Link, nicht darin — darum genügt es, neu zu zeichnen und
   die Scrollposition zu halten. */
document.addEventListener('click', ev => {
  const knopf = ev.target.closest('[data-fav]');
  if (!knopf) return;
  ev.preventDefault();
  const y = window.scrollY;
  favoritToggle(knopf.getAttribute('data-fav'));
  route();
  window.scrollTo(0, y);
});

window.addEventListener('hashchange', route);
document.documentElement.lang = getLang();
/* Die gewaehlten Schriften stehen, bevor das erste Blatt gezeichnet wird —
   sonst blitzt kurz die Voreinstellung auf und die Hoehenpruefung misst
   das falsche Blatt. */
schriftAnwenden();
mountRahmen();
route();

/* Für Tests/Automatisierung erreichbar machen. */
window.VZ = { TEMPLATES, ORDER, BEREICHE, SEITEN, ROLLEN, FAMILIEN, ICON_KEYS,
              alleObjekte, alleAbsender, bestandAlsDatei, route, PAGE_MAX_H,
              favoriten, istFavorit, favoritToggle,
              sicherungAlsDatei, sicherungLaden };
