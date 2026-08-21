/* Rezeption-Aufkleber · Druckbogen mit runden Aufklebern in Originalgrösse.
   Portiert aus "Rezeption Aufkleber - Druckbogen A4.html". */
import { esc, has } from '../lib/dom.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';

export default {
  id:'rezeption-sticker',
  title:'Aufkleber-Druckbogen',
  sub:'Runde Aufkleber in Originalgrösse · A4 hoch',
  badge:'Aufkleber',
  badgeCyan:true,
  page:'a4',
  root:'t-sticker',
  fern:true,   /* Schild — Leseabstand anzeigen */
  thumb: thumb(`
    <rect x="18" y="14" width="70" height="7" rx="3.5" fill="#C9CFDA"/>
    ${[0,1,2].map(r => [0,1,2].map(c => `
      <circle cx="${44 + c * 62}" cy="${58 + r * 66}" r="26" fill="#2A3350"/>
      <circle cx="${44 + c * 62}" cy="${58 + r * 66}" r="30" fill="none" stroke="#01B1E2" stroke-width="1.2" stroke-dasharray="4 3"/>
      <circle cx="${44 + c * 62}" cy="${50 + r * 66}" r="7" fill="#01B1E2"/>
      <rect x="${30 + c * 62}" y="${62 + r * 66}" width="28" height="5" rx="2.5" fill="#fff"/>
      <rect x="${34 + c * 62}" y="${71 + r * 66}" width="20" height="4" rx="2" fill="#8B8F99"/>`).join('')).join('')}
    <rect x="18" y="258" width="120" height="34" rx="4" fill="none" stroke="#E5E8ED" stroke-width="1.6"/>
    <rect x="18" y="276" width="174" height="5" rx="2.5" fill="#E5E8ED" opacity="0"/>`),

  fields:[
    { t:'group', label:'Aufkleber' },
    { k:'variant', label:'Variante', type:'select', options:[
      { v:'dark', t:'Dunkel (Navy)' }, { v:'cyan', t:'Cyan' }, { v:'light', t:'Hell (weiss)' } ] },
    { k:'symbol', label:'Symbol', type:'select', options:iconOptions() },
    { k:'textDe', label:'Text DE', type:'text' },
    { k:'textEn', label:'Text EN', type:'text' },
    { k:'klein',  label:'Zusatz (klein)', type:'text' },

    { t:'group', label:'Bogen' },
    { k:'durchmesser', label:'Durchmesser in mm', type:'number', min:25, max:90, step:1 },
    { k:'anzahl', label:'Anzahl Aufkleber', type:'number', min:1, max:24, step:1 },
    { k:'marken', label:'Schnittkante zeigen', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein' } ] },
    { k:'massstab', label:'Massstab-Kontrolle drucken', type:'select', options:[
      { v:'ja', t:'ja' }, { v:'nein', t:'nein' } ],
      hint:'Druckt ein Rechteck von 95 × 54 mm zum Nachmessen.' },
    { k:'hinweis', label:'Hinweis unten', type:'text' }
  ],

  defaults:{
    variant:'dark', symbol:'arrowR',
    textDe:'Rezeption', textEn:'Reception', klein:'1. Stock',
    durchmesser:60, anzahl:9, marken:'ja', massstab:'ja',
    hinweis:'Randlos und mit Skalierung 100 % drucken, danach ausschneiden.'
  },

  render(d){
    const dm = Math.max(25, Math.min(Number(d.durchmesser) || 60, 90));
    const n  = Math.max(1, Math.min(Number(d.anzahl) || 9, 24));
    const marks = d.marken !== 'nein';

    const one = `
      <div class="t-sticker-cell" style="width:${dm}mm;height:${dm}mm">
        <div class="t-sticker-dot t-sticker--${esc(d.variant)}${marks ? ' is-marked' : ''}">
          <span class="t-sticker-ico">${icon(d.symbol || 'arrowR', 24, 2.1)}</span>
          ${has(d.textDe) ? `<b>${esc(d.textDe)}</b>` : ''}
          ${has(d.textEn) ? `<i>${esc(d.textEn)}</i>` : ''}
          ${has(d.klein)  ? `<small>${esc(d.klein)}</small>` : ''}
        </div>
      </div>`;

    return `
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
    </div>`;
  }
};
