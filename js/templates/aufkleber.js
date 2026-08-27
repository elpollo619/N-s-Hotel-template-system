/* Aufkleber · Druckvorlagen in Originalgrösse, A4 hoch.
   --------------------------------------------------------------------------
   Zusammengelegt aus zwei früheren Vorlagen — «Pfeil-Aufkleber Rezeption»
   und «Aufkleber-Druckbogen». Beide machten dasselbe: Aufkleber in echter
   Grösse zum Ausdrucken und Ausschneiden. Jetzt eine Vorlage mit der Wahl
   der Form:
     · eckig mit Pfeil — Wegweiser (bis 4 pro Blatt, Breite/Höhe frei)
     · rund — Punkt mit Symbol und Text (bis 24 pro Bogen, Durchmesser frei)

   Es wirken jeweils nur die Felder der gewählten Form. Randlos und mit
   Skalierung 100 % drucken; die Massstab-Kontrolle hilft beim Prüfen. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';

const AUF_ROT = { rechts:0, links:180, oben:-90, unten:90 };

function pfeil(dir){
  return `<svg class="t-rez-arrow" viewBox="0 0 100 60" aria-hidden="true">
    <g transform="rotate(${AUF_ROT[dir] ?? 0} 50 30)">
      <path d="M4 22 H56 V4 L97 30 L56 56 V38 H4 Z"/>
    </g></svg>`;
}

/* ---- Form «eckig mit Pfeil» (früher: rezeption) ------------------------- */
function eckig(d){
  const n = Math.max(1, Math.min(Number(d.anzahl) || 1, 4));
  const w = Math.max(40, Math.min(Number(d.breite) || 180, 190));
  const h = Math.max(20, Math.min(Number(d.hoehe) || 60, 120));
  const marks = d.marken !== 'nein';

  const one = `
    <div class="t-rez-cut${marks ? ' is-marked' : ''}">
      <div class="t-rez-sticker t-rez--${esc(d.variant)}" style="width:${w}mm;height:${h}mm">
        ${d.showArrow !== 'nein' ? pfeil(d.dir) : ''}
        <div class="t-rez-txt">
          ${has(d.eyebrow) ? `<span class="eyebrow t-rez-eyebrow">${esc(d.eyebrow)}</span>` : ''}
          <b>${esc(d.lineDe)}</b>
          ${has(d.lineEn) ? `<i>${esc(d.lineEn)}</i>` : ''}
          ${has(d.subtext) ? `<span class="t-rez-sub">${esc(d.subtext)}</span>` : ''}
        </div>
      </div>
      ${marks ? `<span class="t-rez-mass">${w} × ${h} mm</span>` : ''}
    </div>`;

  return `
    <div class="t-rezeption">
      <div class="t-rez-head">
        <div>
          <p class="t-rez-kicker">Druckvorlage · Aufkleber</p>
          <h1>${esc(d.lineDe)}${has(d.lineEn) ? ' · ' + esc(d.lineEn) : ''}</h1>
        </div>
        ${logo('color', 34)}
      </div>
      <div class="t-rez-stack">${Array.from({ length:n }, () => one).join('')}</div>
      ${has(d.hinweis) ? `<p class="t-rez-hint">${esc(d.hinweis)}</p>` : ''}
    </div>`;
}

/* ---- Form «rund» (früher: rezeption-sticker) ---------------------------- */
function rund(d){
  const dm = Math.max(25, Math.min(Number(d.durchmesser) || 60, 90));
  const n  = Math.max(1, Math.min(Number(d.anzahl) || 9, 24));
  const marks = d.marken !== 'nein';

  const one = `
    <div class="t-sticker-cell" style="width:${dm}mm;height:${dm}mm">
      <div class="t-sticker-dot t-sticker--${esc(d.variant)}${marks ? ' is-marked' : ''}">
        <span class="t-sticker-ico">${icon(d.symbol || 'arrowR', 24, 2.1)}</span>
        ${has(d.lineDe) ? `<b>${esc(d.lineDe)}</b>` : ''}
        ${has(d.lineEn) ? `<i>${esc(d.lineEn)}</i>` : ''}
        ${has(d.subtext) ? `<small>${esc(d.subtext)}</small>` : ''}
      </div>
    </div>`;

  return `
    <div class="t-sticker">
      <div class="t-sticker-head">
        <p class="t-sticker-kicker">Druckbogen · ${n} Aufkleber · ⌀ ${dm} mm</p>
      </div>
      <div class="t-sticker-grid" style="--dm:${dm}mm">
        ${Array.from({ length:n }, () => one).join('')}
      </div>
      <div class="t-sticker-foot">
        ${d.massstab !== 'nein' ? `<div class="t-sticker-ruler">
          <div class="t-sticker-ref"></div>
          <p>Massstab-Kontrolle: Dieser Streifen muss genau <b>100 mm</b> lang sein
            (Teilstriche alle 10 mm). Stimmt das nicht, im Druckdialog die Skalierung auf 100 % stellen.</p>
        </div>` : ''}
        ${has(d.hinweis) ? `<p class="t-sticker-hint">${esc(d.hinweis)}</p>` : ''}
      </div>
    </div>`;
}

export default {
  id:'aufkleber',
  title:'Aufkleber',
  sub:'Wegweiser-Pfeil oder runder Punkt · Originalgrösse · A4',
  badge:'Aufkleber',
  badgeCyan:true,
  page:'a4',
  root:'t-auf',
  fern:true,

  thumb: thumb(`
    <rect x="16" y="14" width="60" height="7" rx="3.5" fill="#C9CFDA"/>
    <rect x="16" y="42" width="178" height="56" rx="7" fill="#2A3350"/>
    <path d="M32 62 h30 v-10 l22 15 -22 15 v-10 h-30 z" fill="#01B1E2"/>
    <rect x="96" y="58" width="76" height="10" rx="5" fill="#fff"/>
    <rect x="96" y="74" width="52" height="7" rx="3.5" fill="#8B8F99"/>
    <rect x="12" y="38" width="186" height="64" rx="9" fill="none" stroke="#01B1E2" stroke-width="1.4" stroke-dasharray="5 4"/>
    ${[0,1,2].map(c => `
      <circle cx="${44 + c * 62}" cy="${160}" r="26" fill="#2A3350"/>
      <circle cx="${44 + c * 62}" cy="${160}" r="30" fill="none" stroke="#01B1E2" stroke-width="1.2" stroke-dasharray="4 3"/>
      <circle cx="${44 + c * 62}" cy="${152}" r="7" fill="#01B1E2"/>
      <rect x="${30 + c * 62}" y="${164}" width="28" height="5" rx="2.5" fill="#fff"/>`).join('')}
    <rect x="18" y="252" width="120" height="6" rx="3" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Form' },
    { k:'form', label:'Form', type:'select', options:[
      { v:'pfeil', t:'eckig mit Pfeil — Wegweiser' },
      { v:'rund',  t:'rund — Punkt mit Symbol' } ] },
    { t:'note', label:'Es wirken nur die Felder der gewählten Form.' },

    { t:'group', label:'Text' },
    { k:'lineDe', label:'Zeile DE', type:'text' },
    { k:'lineEn', label:'Zeile EN', type:'text' },
    { k:'subtext', label:'Zusatz (klein)', type:'text' },
    { k:'eyebrow', label:'Handschrift-Zeile (nur Pfeil)', type:'text' },

    { t:'group', label:'Aussehen' },
    { k:'variant', label:'Variante', type:'select', options:[
      { v:'dark', t:'Dunkel (Navy)' }, { v:'cyan', t:'Cyan' }, { v:'light', t:'Hell (weiss)' } ] },
    { k:'symbol', label:'Symbol (nur rund)', type:'select', options:iconOptions() },
    { k:'dir', label:'Pfeilrichtung (nur Pfeil)', type:'select', options:[
      { v:'rechts', t:'nach rechts' }, { v:'links', t:'nach links' },
      { v:'oben', t:'nach oben' }, { v:'unten', t:'nach unten' } ] },
    { k:'showArrow', label:'Pfeil zeigen (nur Pfeil)', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein — nur Text' } ] },

    { t:'group', label:'Format' },
    { k:'breite', label:'Breite in mm (Pfeil)', type:'number', min:40, max:190, step:1 },
    { k:'hoehe',  label:'Höhe in mm (Pfeil)', type:'number', min:20, max:120, step:1 },
    { k:'durchmesser', label:'Durchmesser in mm (rund)', type:'number', min:25, max:90, step:1 },
    { k:'anzahl', label:'Anzahl pro Blatt', type:'number', min:1, max:24, step:1 },
    { k:'marken', label:'Schnittkante zeigen', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein' } ] },
    { k:'massstab', label:'Massstab-Kontrolle drucken (rund)', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein' } ] },
    { k:'hinweis', label:'Hinweis unten', type:'text' }
  ],

  defaults:{
    form:'pfeil',
    lineDe:'Rezeption', lineEn:'Reception', subtext:'Hans Amonn AG · 1. Stock',
    eyebrow:'',
    variant:'dark', symbol:'arrowR', dir:'rechts', showArrow:'ja',
    breite:180, hoehe:60, durchmesser:60, anzahl:2, marken:'ja', massstab:'ja',
    hinweis:'Auf selbstklebende Folie drucken · randlos, Skalierung 100 %, danach der Schnittkante entlang schneiden.'
  },

  render(d){
    return d.form === 'rund' ? rund(d) : eckig(d);
  }
};
