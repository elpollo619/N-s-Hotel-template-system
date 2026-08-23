/* Tischaufsteller · A4 quer, in der Mitte gefalzt
   --------------------------------------------------------------------------
   Das Zelt, das auf dem Tisch im Zimmer oder im Frühstücksraum steht. Ein
   Blatt A4 quer, quer durch die Mitte gefalzt — zwei Flächen von 297 × 105 mm,
   die sich gegenüberstehen.

   Die obere Fläche steht auf dem Kopf. Das ist kein Fehler: nach dem Falzen
   zeigt sie nach vorn, die untere nach hinten. Wer den Bogen umdreht, liest
   beide Seiten aufrecht.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { absender, objekt, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'tischaufsteller',
  title:'Tischaufsteller',
  sub:'Zelt für Tisch und Theke · A4 quer, in der Mitte gefalzt',
  badge:'Zimmer',
  root:'t-tisch',
  page:'a4-land',

  thumb: thumbLand(`
    <rect x="0" y="0" width="297" height="105" fill="#F6F7FA"/>
    <g transform="rotate(180 148 52)">
      <rect x="30" y="24" width="70" height="8" rx="4" fill="#01B1E2"/>
      <rect x="30" y="40" width="150" height="16" rx="5" fill="#2A3350"/>
      <rect x="30" y="64" width="120" height="6" rx="3" fill="#C9CFDA"/>
      <rect x="215" y="26" width="46" height="46" rx="4" fill="#2A3350" opacity=".85"/>
    </g>
    <path d="M0 105h297" stroke="#01B1E2" stroke-width="2" stroke-dasharray="8 6"/>
    <rect x="30" y="130" width="70" height="8" rx="4" fill="#01B1E2"/>
    <rect x="30" y="146" width="150" height="16" rx="5" fill="#2A3350"/>
    ${[0, 1, 2].map(i => `
      <circle cx="36" cy="${180 + i * 16}" r="5" fill="#01B1E2"/>
      <rect x="48" y="${176 + i * 16}" width="${120 - i * 14}" height="6" rx="3" fill="#2A3350" opacity=".7"/>`).join('')}
    <rect x="215" y="132" width="46" height="46" rx="4" fill="#2A3350" opacity=".85"/>`),

  fields:[
    { t:'group', label:'Vorderseite' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel',             type:'text' },
    { k:'unter',   label:'Untertitel',        type:'text' },

    { t:'group', label:'Rückseite' },
    { k:'eyebrow2', label:'Handschrift-Zeile', type:'text' },
    { k:'titel2',   label:'Titel',             type:'text' },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Zeile', max:6,
      defaultItem:{ icon:'info', text:'', wert:'' },
      item:[
        { k:'icon', label:'Symbol', type:'select', options:iconOptions },
        { k:'text', label:'Bezeichnung', type:'text' },
        { k:'wert', label:'Angabe',      type:'text' }
      ] },

    { t:'group', label:'QR-Code' },
    { k:'qrText',  label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code. Steht auf beiden Seiten.' },
    { k:'qrLabel', label:'Beschriftung am Code', type:'text' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Schön, dass Sie da sind',
    titel:'Willkommen',
    unter:'Alles Wichtige finden Sie auf der Rückseite.',
    eyebrow2:'Gut zu wissen',
    titel2:'Auf einen Blick',
    zeilen:[
      { icon:'wifi', text:'WLAN',      wert:'Gast · Passwort im Zimmer' },
      { icon:'cup',  text:'Frühstück', wert:'07:30 – 10:00' },
      { icon:'clock',text:'Check-out', wert:'bis 11:00' },
      { icon:'phone',text:'Wir sind da', wert:'+41 31 951 85 54' }
    ],
    qrText:'',
    qrLabel:'Mehr erfahren',
    objekt:'A14',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);

    const qr = has(d.qrText)
      ? `<div class="t-tisch-qr">${qrSvg(d.qrText, { stufe:'M', groesse:'26mm' })}
           ${has(d.qrLabel) ? `<span>${esc(d.qrLabel)}</span>` : ''}</div>`
      : '';

    const marke = `<span class="t-tisch-marke">${
      istHotel(d.absender) ? logo('color', 22) : esc(abs.name)}</span>`;

    const zeilen = (d.zeilen || []).filter(z => has(z.text) || has(z.wert)).map(z => `
      <li>
        <span class="t-tisch-ico">${icon(z.icon || 'info', 20, 1.9)}</span>
        <b>${esc(z.text)}</b>
        <i>${esc(z.wert)}</i>
      </li>`).join('');

    return `
      <div class="t-tisch-bogen">
        <section class="t-tisch-flaeche is-vorne">
          <div class="t-tisch-inhalt">
            <div class="t-tisch-text">
              ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
              <h1>${esc(d.titel || '')}</h1>
              ${has(d.unter) ? `<p class="t-tisch-unter">${esc(d.unter)}</p>` : ''}
              ${obj.name && obj.code ? `<p class="t-tisch-obj">${esc(obj.name)}</p>` : ''}
            </div>
            ${qr}
          </div>
          <footer class="t-tisch-fuss">${marke}<span>${esc(abs.foot)}</span></footer>
        </section>

        <div class="t-tisch-falz"><span>Hier falzen</span></div>

        <section class="t-tisch-flaeche is-hinten">
          <div class="t-tisch-inhalt">
            <div class="t-tisch-text">
              ${has(d.eyebrow2) ? `<p class="eyebrow">${esc(d.eyebrow2)}</p>` : ''}
              <h2>${esc(d.titel2 || '')}</h2>
              ${zeilen ? `<ul class="t-tisch-zeilen">${zeilen}</ul>` : ''}
            </div>
            ${qr}
          </div>
          <footer class="t-tisch-fuss">${marke}<span>${esc(abs.foot)}</span></footer>
        </section>
      </div>`;
  }
};
