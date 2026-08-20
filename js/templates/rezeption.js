/* Rezeption · Pfeil-Aufkleber — Druckvorlage in Originalgrösse, A4 hoch.
   Portiert aus "Rezeption Pfeil-Aufkleber v4.html". */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';

const ROT = { rechts:0, links:180, oben:-90, unten:90 };

function arrow(dir){
  return `<svg class="t-rez-arrow" viewBox="0 0 100 60" aria-hidden="true">
    <g transform="rotate(${ROT[dir] ?? 0} 50 30)">
      <path d="M4 22 H56 V4 L97 30 L56 56 V38 H4 Z"/>
    </g></svg>`;
}

export default {
  id:'rezeption',
  title:'Pfeil-Aufkleber Rezeption',
  sub:'Wegweiser in Originalgrösse · A4 Druckvorlage',
  badge:'Aufkleber',
  badgeCyan:true,
  page:'a4',
  root:'t-rezeption',
  thumb: thumb(`
    <rect x="16" y="14" width="60" height="7" rx="3.5" fill="#C9CFDA"/>
    <rect x="16" y="58" width="178" height="62" rx="7" fill="#2A3350"/>
    <path d="M32 82 h30 v-11 l24 16 -24 16 v-11 h-30 z" fill="#01B1E2"/>
    <rect x="96" y="76" width="76" height="11" rx="5.5" fill="#fff"/>
    <rect x="96" y="93" width="56" height="8" rx="4" fill="#8B8F99"/>
    <rect x="12" y="54" width="186" height="70" rx="9" fill="none" stroke="#01B1E2" stroke-width="1.4" stroke-dasharray="5 4"/>
    <rect x="16" y="150" width="178" height="62" rx="7" fill="#fff" stroke="#E5E8ED" stroke-width="1.6"/>
    <path d="M32 174 h30 v-11 l24 16 -24 16 v-11 h-30 z" fill="#01B1E2"/>
    <rect x="96" y="168" width="76" height="11" rx="5.5" fill="#2A3350"/>
    <rect x="96" y="185" width="56" height="8" rx="4" fill="#8B8F99"/>
    <rect x="12" y="146" width="186" height="70" rx="9" fill="none" stroke="#01B1E2" stroke-width="1.4" stroke-dasharray="5 4"/>
    <rect x="16" y="248" width="120" height="6" rx="3" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Gestaltung' },
    { k:'variant', label:'Variante', type:'select', options:[
      { v:'dark', t:'Dunkel (Navy)' }, { v:'light', t:'Hell (weiss)' }, { v:'cyan', t:'Cyan' } ] },
    { k:'dir', label:'Pfeilrichtung', type:'select', options:[
      { v:'rechts', t:'nach rechts' }, { v:'links', t:'nach links' },
      { v:'oben', t:'nach oben' }, { v:'unten', t:'nach unten' } ] },
    { k:'showArrow', label:'Pfeil zeigen', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein — nur Text' } ] },

    { t:'group', label:'Text' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text', hint:'leer lassen, wenn nicht gewünscht' },
    { k:'lineDe', label:'Zeile DE', type:'text' },
    { k:'lineEn', label:'Zeile EN', type:'text' },
    { k:'subtext', label:'Zusatz (klein)', type:'text' },

    { t:'group', label:'Format' },
    { k:'breite', label:'Breite in mm', type:'number', min:40, max:190, step:1 },
    { k:'hoehe',  label:'Höhe in mm',   type:'number', min:20, max:120, step:1 },
    { k:'anzahl', label:'Aufkleber pro Blatt', type:'number', min:1, max:4, step:1 },
    { k:'marken', label:'Schnittkante zeigen', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein' } ] },
    { k:'hinweis', label:'Hinweis unten', type:'text' }
  ],

  defaults:{
    variant:'dark', dir:'rechts', showArrow:'ja',
    eyebrow:'', lineDe:'Rezeption', lineEn:'Reception',
    subtext:'Hans Amonn AG · 1. Stock',
    breite:180, hoehe:60, anzahl:2, marken:'ja',
    hinweis:'Auf selbstklebende Folie drucken · Randlos, Skalierung 100 %, danach der Schnittkante entlang schneiden.'
  },

  render(d){
    const n = Math.max(1, Math.min(Number(d.anzahl) || 1, 4));
    const w = Math.max(40, Math.min(Number(d.breite) || 180, 190));
    const h = Math.max(20, Math.min(Number(d.hoehe) || 60, 120));
    const marks = d.marken !== 'nein';

    const one = `
      <div class="t-rez-cut${marks ? ' is-marked' : ''}">
        <div class="t-rez-sticker t-rez--${esc(d.variant)}" style="width:${w}mm;height:${h}mm">
          ${d.showArrow !== 'nein' ? arrow(d.dir) : ''}
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
    <div class="t-rez-head">
      <div>
        <p class="t-rez-kicker">Druckvorlage · Aufkleber</p>
        <h1>${esc(d.lineDe)}${has(d.lineEn) ? ' · ' + esc(d.lineEn) : ''}</h1>
      </div>
      ${logo('color', 34)}
    </div>
    <div class="t-rez-stack">${Array.from({ length:n }, () => one).join('')}</div>
    ${has(d.hinweis) ? `<p class="t-rez-hint">${esc(d.hinweis)}</p>` : ''}`;
  }
};
