/* Reservationsblatt · A4 hoch
   --------------------------------------------------------------------------
   Die Liste zum Eintragen: Waschküche, Gemeinschaftsraum, Grillplatz,
   Gästezimmer. Wer wann reserviert, trägt sich mit Name und Zeit ein. Anders
   als der Turnusplan (der teilt zu) ist hier alles leer — die Bewohner füllen
   es selbst. Eine Tabelle mit Datum, Zeit, Name, viele Zeilen.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'reservationsblatt',
  title:'Reservationsblatt',
  sub:'Waschküche, Gemeinschaftsraum, Grill — zum Eintragen · A4 hoch',
  badge:'Reservation',
  root:'t-resv',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="120" height="14" rx="5" fill="#2A3350"/>
    <rect x="24" y="60" width="162" height="18" rx="4" fill="#01B1E2" opacity=".16"/>
    ${[0,1,2,3,4,5,6,7].map(i => `
      <rect x="24" y="${86 + i*22}" width="162" height="18" rx="3" fill="${i%2?'#F6F7FA':'#fff'}" stroke="#E5E8ED" stroke-width="1"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel', label:'Titel', type:'text' },
    { k:'icon',  label:'Symbol', type:'select', options:[
      { v:'waesche', t:'Waschküche' }, { v:'besteck', t:'Gemeinschaftsraum' },
      { v:'baum', t:'Grillplatz / Garten' }, { v:'bed', t:'Gästezimmer' },
      { v:'car', t:'Parkplatz' }, { v:'info', t:'anderes' } ] },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'lede', label:'Hinweis oben', type:'textarea', rows:2 },

    { t:'group', label:'Spalten' },
    { k:'spalten', label:'Spaltenköpfe', type:'text',
      hint:'Kommagetrennt. Die erste Spalte ist etwas breiter.' },

    { t:'group', label:'Zeilen' },
    { k:'zeilen', label:'Anzahl leere Zeilen', type:'number', min:5, max:24, step:1 },

    { t:'group', label:'Regeln' },
    { k:'regeln', label:'Regeln unten', type:'textarea', rows:2 },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Bitte eintragen',
    titel:'Waschküche — Reservation',
    icon:'waesche',
    objekt:'-',
    lede:'Bitte gut leserlich eintragen. Eine Reservation gilt erst, wenn sie hier steht.',
    spalten:'Datum, Zeit von–bis, Wohnung / Name',
    zeilen:14,
    regeln:'Bitte die reservierte Zeit einhalten und den Raum sauber hinterlassen. Nicht genutzte Reservationen bitte streichen.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const spalten = String(d.spalten || '').split(',').map(s => s.trim()).filter(Boolean);
    const kopf = spalten.map((s, i) => `<span class="t-resv-z${i === 0 ? ' is-erste' : ''}">${esc(s)}</span>`).join('');
    const anzahl = Math.min(24, Math.max(5, Number(d.zeilen) || 14));
    const leer = Array.from({ length:anzahl }, () => `
      <li>${spalten.map((_, i) => `<span class="t-resv-z${i === 0 ? ' is-erste' : ''}"></span>`).join('')}</li>`).join('');

    return `
      <header class="t-resv-kopf">
        <span class="t-resv-ico">${icon(d.icon || 'info', 30, 1.8)}</span>
        <div>
          ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
          <h1>${esc(d.titel || '')}</h1>
          ${ort ? `<p class="t-resv-ort">${esc(ort)}</p>` : ''}
        </div>
      </header>

      ${has(d.lede) ? `<p class="t-resv-lede">${esc(d.lede)}</p>` : ''}

      <ul class="t-resv-tab">
        <li class="t-resv-titel">${kopf}</li>
        ${leer}
      </ul>

      ${has(d.regeln) ? `<p class="t-resv-regeln">${esc(d.regeln)}</p>` : ''}

      <footer class="t-resv-fuss">
        <span class="t-resv-mark">${istHotel(d.absender) ? logo('color', 22) : ''}</span>
        <span>${esc(abs.foot)}</span>
      </footer>`;
  }
};
