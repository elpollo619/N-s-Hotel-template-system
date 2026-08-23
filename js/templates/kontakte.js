/* Kontakt-Tafel · A4 hoch
   --------------------------------------------------------------------------
   «Wer ist wofuer da» — die Tafel im Treppenhaus. Nicht zu verwechseln mit
   dem Notruf-Aushang: der nennt die drei Notrufnummern am Telefon, diese
   Tafel nennt die Menschen, die im Alltag zustaendig sind.

   Die Nummer steht rechts und gross. Wer im Treppenhaus steht und den
   Hauswart sucht, tippt sie ab — er liest nicht.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { absender, objektFusszeile, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'kontakte',
  title:'Kontakt-Tafel',
  sub:'Wer ist wofür da — Hauswart, Verwaltung, Notfall · A4 hoch',
  badge:'Kontakt',
  root:'t-kontakt',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="24" y="28" width="86" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="48" width="150" height="17" rx="6" fill="#2A3350"/>
    ${[0,1,2,3,4].map(i => `
      <rect x="24" y="${94 + i * 42}" width="162" height="32" rx="5" fill="#fff" stroke="#E5E8ED" stroke-width="1.6"/>
      <circle cx="42" cy="${110 + i * 42}" r="8" fill="${i === 0 ? '#E23A2E' : '#01B1E2'}"/>
      <rect x="58" y="${102 + i * 42}" width="${58 - i * 4}" height="7" rx="3.5" fill="#2A3350" opacity=".85"/>
      <rect x="58" y="${113 + i * 42}" width="${44 - i * 3}" height="5" rx="2.5" fill="#C9CFDA"/>
      <rect x="${132}" y="${106 + i * 42}" width="46" height="9" rx="4.5" fill="#2A3350"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'unter',   label:'Untertitel', type:'text' },

    { t:'group', label:'Kontakte' },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Kontakt', max:10,
      defaultItem:{ icon:'phone', rolle:'', name:'', nummer:'', zeiten:'', dringend:'nein' },
      item:[
        { k:'icon',     label:'Symbol',  type:'select', options:iconOptions },
        { k:'rolle',    label:'Wofür',   type:'text' },
        { k:'name',     label:'Wer',     type:'text' },
        { k:'nummer',   label:'Nummer',  type:'text' },
        { k:'zeiten',   label:'Erreichbar', type:'text' },
        { k:'dringend', label:'Notfall hervorheben', type:'select',
          options:[{ v:'nein', t:'nein' }, { v:'ja', t:'ja — rot' }] }
      ] },

    { t:'group', label:'QR-Code' },
    { k:'qrText',  label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code. Sonst z. B. das Störungsformular der Verwaltung.' },
    { k:'qrLabel', label:'Beschriftung am Code', type:'text' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Wer ist wofür da',
    titel:'Kontakte',
    unter:'Bitte in dieser Reihenfolge anrufen.',
    zeilen:[
      { icon:'warn',      rolle:'Notfall — Feuer, Unfall, Wasser', name:'Polizei · Feuerwehr · Sanität',
        nummer:'112', zeiten:'rund um die Uhr', dringend:'ja' },
      { icon:'reception', rolle:'Hauswart', name:'', nummer:'', zeiten:'Mo–Fr 08:00–17:00', dringend:'nein' },
      { icon:'mail',      rolle:'Verwaltung', name:'Hans Amonn Immobilien',
        nummer:'+41 31 951 85 54', zeiten:'Mo–Fr 09:00–12:00', dringend:'nein' },
      { icon:'bolt',      rolle:'Strom und Heizung', name:'', nummer:'', zeiten:'', dringend:'nein' },
      { icon:'lift',      rolle:'Lift steckt', name:'', nummer:'', zeiten:'rund um die Uhr', dringend:'nein' }
    ],
    qrText:'',
    qrLabel:'Störung melden',
    objekt:'-',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');

    const zeilen = (d.zeilen || []).filter(z => has(z.rolle) || has(z.nummer)).map(z => `
      <li class="t-kontakt-zeile${z.dringend === 'ja' ? ' is-dringend' : ''}">
        <span class="t-kontakt-ico">${icon(z.icon || 'phone', 24, 1.9)}</span>
        <span class="t-kontakt-txt">
          <b>${esc(z.rolle)}</b>
          ${has(z.name) ? `<i>${esc(z.name)}</i>` : ''}
          ${has(z.zeiten) ? `<em>${esc(z.zeiten)}</em>` : ''}
        </span>
        <span class="t-kontakt-nr">${esc(z.nummer)}</span>
      </li>`).join('');

    return `
      <header class="t-kontakt-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel || '')}</h1>
        ${has(d.unter) ? `<p class="t-kontakt-unter">${esc(d.unter)}</p>` : ''}
      </header>

      <ul class="t-kontakt-liste">${zeilen}</ul>

      ${has(d.qrText) ? `
      <div class="t-kontakt-qr">
        ${qrSvg(d.qrText, { stufe:'M', groesse:'28mm' })}
        ${has(d.qrLabel) ? `<span>${esc(d.qrLabel)}</span>` : ''}
      </div>` : ''}

      <footer class="t-kontakt-fuss">
        <span class="t-kontakt-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
        <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
      </footer>`;
  }
};
