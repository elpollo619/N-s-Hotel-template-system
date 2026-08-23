/* Kündigungsbestätigung · A4 hoch
   --------------------------------------------------------------------------
   Der Brief, der eine eingegangene Kündigung bestätigt: wir haben Ihre
   Kündigung erhalten, das Mietverhältnis endet am … Ein Brief mit Briefkopf,
   nicht ein Aushang — darum die klassische Briefform mit Adressfeld,
   Betreff und Grussformel. Alle konkreten Angaben bleiben Schreiblinien.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'kuendigung',
  title:'Kündigungsbestätigung',
  sub:'Brief: Kündigung erhalten, Mietende bestätigt · A4 hoch',
  badge:'Brief',
  root:'t-kb',
  page:'a4',

  thumb: thumb(`
    <rect x="128" y="24" width="58" height="20" rx="4" fill="#2A3350" opacity=".85"/>
    <rect x="24" y="70" width="90" height="7" rx="3.5" fill="#2A3350" opacity=".5"/>
    <rect x="24" y="84" width="70" height="7" rx="3.5" fill="#2A3350" opacity=".5"/>
    <rect x="24" y="120" width="120" height="9" rx="4.5" fill="#2A3350"/>
    ${[0,1,2,3,4].map(i => `<rect x="24" y="${146 + i*16}" width="${162 - (i%3)*20}" height="6" rx="3" fill="#2A3350" opacity=".4"/>`).join('')}
    <rect x="24" y="250" width="70" height="6" rx="3" fill="#2A3350" opacity=".4"/>`),

  fields:[
    { t:'group', label:'Empfänger' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'anrede', label:'Anrede', type:'text' },

    { t:'group', label:'Betreff und Ort/Datum' },
    { k:'ortDatum', label:'Ort und Datum', type:'text' },
    { k:'betreff', label:'Betreff', type:'text' },

    { t:'group', label:'Text' },
    { k:'text', label:'Brieftext', type:'textarea', rows:6,
      hint:'Konkrete Daten (Kündigungsdatum, Mietende) besser als Lücke lassen und von Hand oder pro Fall eintragen.' },

    { t:'group', label:'Eckdaten (Schreiblinien)' },
    { k:'eck', label:'Zeilen', type:'text',
      hint:'Kommagetrennt — je eine Schreiblinie (Wohnung, Kündigung eingegangen am, Mietverhältnis endet am …).' },

    { t:'group', label:'Gruss' },
    { k:'gruss', label:'Grussformel', type:'text' },
    { k:'unterschrift', label:'Unterschrift-Zeile', type:'text' },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    objekt:'-',
    anrede:'Sehr geehrte Mieterin, sehr geehrter Mieter',
    ortDatum:'',
    betreff:'Bestätigung Ihrer Kündigung',
    text:'Wir bestätigen Ihnen den Eingang Ihrer Kündigung und danken für die Mitteilung. Das Mietverhältnis endet zum unten genannten Datum.\n\nFür die Wohnungsübergabe melden wir uns rechtzeitig, um einen Termin zu vereinbaren. Bitte geben Sie sämtliche Schlüssel vollständig zurück und lesen Sie die Zähler ab; wir bringen das Übergabeprotokoll mit.',
    eck:'Wohnung, Kündigung eingegangen am, Mietverhältnis endet am, Wohnungsübergabe',
    gruss:'Freundliche Grüsse',
    unterschrift:'Hans Amonn Immobilien',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const eck = String(d.eck || '').split(',').map(s => s.trim()).filter(Boolean).map(e => `
      <div class="t-kb-eck"><span>${esc(e)}</span><i></i></div>`).join('');

    const absaetze = String(d.text || '').split('\n').filter(z => z.trim()).map(z => `<p>${esc(z)}</p>`).join('');

    return `
      <header class="t-kb-kopf">
        <span class="t-kb-mark">${istHotel(d.absender) ? logo('color', 28) : `<b>${esc(abs.name)}</b>`}</span>
      </header>

      <div class="t-kb-adress">
        <div class="t-kb-empf">
          <p class="t-kb-lab">An</p>
          <div class="t-kb-linien"><i></i><i></i><i></i></div>
          ${ort ? `<p class="t-kb-ort">${esc(ort)}</p>` : ''}
        </div>
        <p class="t-kb-datum">${esc(d.ortDatum || '')}</p>
      </div>

      ${has(d.betreff) ? `<p class="t-kb-betreff">${esc(d.betreff)}</p>` : ''}
      ${has(d.anrede) ? `<p class="t-kb-anrede">${esc(d.anrede)}</p>` : ''}

      <div class="t-kb-text">${absaetze}</div>

      ${eck ? `<div class="t-kb-eckblock">${eck}</div>` : ''}

      <div class="t-kb-gruss">
        ${has(d.gruss) ? `<p>${esc(d.gruss)}</p>` : ''}
        <div class="t-kb-usig"></div>
        ${has(d.unterschrift) ? `<p class="t-kb-uname">${esc(d.unterschrift)}</p>` : ''}
      </div>

      <p class="t-kb-abs">${esc(abs.foot)}</p>`;
  }
};
