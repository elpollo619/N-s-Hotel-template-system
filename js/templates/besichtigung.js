/* Besichtigung · A4 hoch
   --------------------------------------------------------------------------
   Der Aushang zur Wohnungsbesichtigung: welche Wohnung, an welchen Terminen,
   wo man sich trifft, wen man fragt. Gehört neben «Wohnung zu vermieten» —
   das eine weckt Interesse, das andere sagt, wann man kommen kann.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'besichtigung',
  title:'Besichtigung',
  sub:'Termine für die Wohnungsbesichtigung · A4 hoch',
  badge:'Besichtigung',
  root:'t-bes',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="24" y="26" width="86" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="44" width="150" height="18" rx="6" fill="#2A3350"/>
    <rect x="24" y="84" width="60" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${104 + i*30}" width="162" height="24" rx="5" fill="#fff" stroke="#E5E8ED" stroke-width="1.4"/>
      <rect x="34" y="${112 + i*30}" width="10" height="10" rx="2" fill="#01B1E2"/>
      <rect x="52" y="${113 + i*30}" width="70" height="8" rx="4" fill="#2A3350" opacity=".75"/>
      <rect x="140" y="${113 + i*30}" width="36" height="8" rx="4" fill="#2A3350" opacity=".55"/>`).join('')}
    <rect x="150" y="212" width="36" height="36" rx="4" fill="#2A3350" opacity=".8"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'was',     label:'Was zu besichtigen ist', type:'text' },

    { t:'group', label:'Termine' },
    { k:'termine', label:'Termine', type:'list', itemLabel:'Termin', max:10,
      defaultItem:{ datum:'', zeit:'' },
      item:[
        { k:'datum', label:'Datum', type:'text' },
        { k:'zeit',  label:'Zeit',  type:'text' }
      ] },
    { k:'treffpunkt', label:'Treffpunkt', type:'text' },

    { t:'group', label:'Anmeldung' },
    { k:'anmeldung', label:'Hinweis zur Anmeldung', type:'textarea', rows:2 },
    { k:'kontakt', label:'Kontakt', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },
    { k:'qrText',  label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code. Sonst das Anmeldeformular.' },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Wohnungsbesichtigung',
    titel:'Besichtigung',
    objekt:'-',
    was:'3.5-Zimmer-Wohnung, 2. OG',
    termine:[
      { datum:'Samstag, 11. Januar', zeit:'10:00 – 10:30' },
      { datum:'Mittwoch, 15. Januar', zeit:'18:00 – 18:30' }
    ],
    treffpunkt:'beim Hauseingang',
    anmeldung:'Ohne Anmeldung. Kommen Sie einfach zu einem der Termine vorbei; bringen Sie einen Ausweis mit.',
    kontakt:'Hans Amonn Immobilien',
    telefon:'+41 31 951 85 54',
    qrText:'',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const termine = (d.termine || []).filter(t => has(t.datum)).map(t => `
      <li>
        <span class="t-bes-ico">${icon('calendar', 22, 1.9)}</span>
        <span class="t-bes-datum">${esc(t.datum)}</span>
        <span class="t-bes-zeit">${esc(t.zeit)}</span>
      </li>`).join('');

    const qr = has(d.qrText)
      ? `<div class="t-bes-qr">${qrSvg(d.qrText, { stufe:'M', groesse:'26mm' })}</div>` : '';

    return `
      <header class="t-bes-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel || '')}</h1>
        ${has(d.was) ? `<p class="t-bes-was">${esc(d.was)}</p>` : ''}
        ${ort ? `<p class="t-bes-ort">${esc(ort)}</p>` : ''}
      </header>

      ${termine ? `<ul class="t-bes-termine">${termine}</ul>` : ''}
      ${has(d.treffpunkt) ? `<p class="t-bes-treff">
        <span class="t-bes-ico">${icon('flag', 20, 1.9)}</span>Treffpunkt: ${esc(d.treffpunkt)}</p>` : ''}

      <footer class="t-bes-fuss">
        ${qr}
        <div class="t-bes-ftext">
          ${has(d.anmeldung) ? `<p class="t-bes-anm">${esc(d.anmeldung)}</p>` : ''}
          <p class="t-bes-kontakt">${esc([d.kontakt, d.telefon].filter(Boolean).join(' · '))}</p>
          <p class="t-bes-abs"><span class="t-bes-mark">${
            istHotel(d.absender) ? logo('color', 22) : ''}</span>${esc(abs.foot)}</p>
        </div>
      </footer>`;
  }
};
