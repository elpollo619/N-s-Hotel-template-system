/* Hinweis · A4 — die Arbeitsvorlage für die bestehenden Aushänge.
   Statt für jeden der rund dreissig Zettel aus J:\Immobilien\Plakate eine
   eigene Vorlage zu bauen, gibt es eine Vorlage und eine Liste fertiger
   Textbausteine. Baustein wählen, Objekt wählen, drucken.

   Der Kopfbalken färbt sich nach Ton: Info navy, Warnung cyan, Verbot rot. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { PRESETS, preset, presetOptions } from '../presets.js';
import { ABSENDER, objekt, objektAdresse, adresseFehlt, istHotel,
         objektOptions, absenderOptions } from '../objekte.js';

const TONE = {
  info:    { bg:'var(--navy)',  fg:'#fff' },
  warnung: { bg:'var(--cyan)',  fg:'#fff' },
  verbot:  { bg:'#C0271F',      fg:'#fff' }
};

/* Platzhalter, die der Baustein mitbringt: {{adresse}}, {{objekt}}, {{datum}} */
function fill(text, d){
  return String(text || '')
    .replace(/\{\{adresse\}\}/g, objektAdresse(d.objekt) || objekt(d.objekt).name)
    .replace(/\{\{objekt\}\}/g, objekt(d.objekt).name)
    .replace(/\{\{datum\}\}/g, d.datum || '');
}

export default {
  id:'hinweis',
  title:'Hinweis / Aushang',
  sub:'Rund 30 fertige Textbausteine aus dem Hausgebrauch · A4',
  badge:'Hinweis',
  page:'a4',
  root:'t-hinweis',
  cat:'hausordnung',
  thumb: thumb(`
    <rect x="0" y="0" width="210" height="60" fill="#2A3350"/>
    <rect x="18" y="20" width="120" height="12" rx="4" fill="#fff" opacity=".92"/>
    <rect x="18" y="38" width="70" height="7" rx="3.5" fill="#01B1E2"/>
    <circle cx="176" cy="30" r="15" fill="none" stroke="#fff" stroke-width="2.6" opacity=".8"/>
    <path d="M176 23v9M176 35.4h.01" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>
    <rect x="18" y="80" width="174" height="30" rx="6" fill="#F6F7FA"/>
    ${lines(26, 90, 150, 2)}
    ${lines(18, 128, 174, 4)}
    ${lines(18, 176, 120, 3, 9, '#E5E8ED')}
    <rect x="18" y="262" width="174" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Baustein' },
    { k:'presetId', label:'Fertiger Text', type:'select', options:presetOptions(),
      hint:'Wählt Titel und Text. Danach beliebig überschreibbar.' },
    { k:'apply', label:'Baustein übernehmen', type:'action',
      hint:'Überschreibt Titel und Texte mit dem gewählten Baustein.' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },
    { k:'zeigeAdresse', label:'Adresse im Kopf zeigen', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },

    { t:'group', label:'Kopf' },
    { k:'ton',   label:'Ton', type:'select',
      options:[{v:'info',t:'Info (navy)'},{v:'warnung',t:'Warnung (cyan)'},{v:'verbot',t:'Verbot (rot)'}] },
    { k:'icon',  label:'Symbol', type:'select', options:iconOptions() },
    { k:'title', label:'Titel', type:'text' },
    { k:'datum', label:'Datum (für {{datum}})', type:'text' },

    { t:'group', label:'Text' },
    { k:'de', label:'Deutsch',  type:'textarea', hint:'**fett** möglich' },
    { k:'en', label:'English',  type:'textarea' },
    { k:'it', label:'Italiano', type:'textarea' },

    { t:'group', label:'Fusszeile' },
    { k:'gruss',  label:'Grussformel', type:'text' },
    { k:'footer', label:'Absenderzeile', type:'text',
      hint:'Leer lassen: nimmt automatisch die Zeile des gewählten Absenders.' }
  ],

  defaults:{
    presetId:'rauchverbot',
    objekt:'-',
    absender:'immobilien',
    zeigeAdresse:'ja',
    ton:'verbot',
    icon:'smoke',
    title:'Rauchverbot im gesamten Gebäude',
    datum:'',
    de:'Stellen wir fest, dass an der Brandmeldeanlage manipuliert worden ist, wird das Mietverhältnis per sofort wegen Gefährdung von Leib und Leben aufgelöst.',
    en:'No smoking anywhere in the building.',
    it:'',
    gruss:'Die Verwaltung',
    footer:''
  },

  /* Der Knopf "Baustein übernehmen" im Formular. */
  actions:{
    apply(d){
      const p = preset(d.presetId);
      return { ...d, ton:p.ton, icon:p.icon, title:p.title, de:p.de, en:p.en, it:p.it };
    }
  },

  render(d){
    const t = TONE[d.ton] || TONE.info;
    const abs = ABSENDER[d.absender] || ABSENDER.immobilien;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);

    const kopfAdresse = (d.zeigeAdresse !== 'nein' && obj.code)
      ? `<p class="t-hinweis-obj">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</p>` : '';

    const warnung = adresseFehlt(d.objekt)
      ? `<p class="t-hinweis-todo no-print">Für ${esc(obj.code)} ist noch keine Adresse hinterlegt —
         in <code>js/objekte.js</code> ergänzen. Auf dem Druck erscheint sie nicht.</p>` : '';

    const block = (lang, text) => has(text)
      ? `<p class="t-hinweis-p" lang="${lang}">${fmt(fill(text, d))}</p>` : '';

    return `
    ${warnung}
    <header class="t-hinweis-head" style="background:${t.bg};color:${t.fg}">
      <div class="t-hinweis-headtxt">
        <p class="t-hinweis-abs">${esc(abs.name)}</p>
        <h1>${esc(fill(d.title, d))}</h1>
        ${kopfAdresse}
      </div>
      <div class="t-hinweis-ico">${icon(d.icon || 'info', 64, 2.2)}</div>
    </header>

    <section class="t-hinweis-body">
      ${block('de', d.de)}
      ${block('en', d.en)}
      ${block('it', d.it)}
    </section>

    <footer class="t-hinweis-foot">
      ${has(d.gruss) ? `<p class="t-hinweis-gruss">${esc(d.gruss)}</p>` : ''}
      ${istHotel(d.absender) ? `<div class="t-hinweis-mark">${logo('color', 30)}</div>` : ''}
      <p class="t-hinweis-addr">${esc(has(d.footer) ? d.footer : abs.foot)}</p>
    </footer>`;
  }
};

/* Damit der Hub weiss, wie viele Bausteine dahinterstehen. */
export const PRESET_COUNT = PRESETS.length - 1;
