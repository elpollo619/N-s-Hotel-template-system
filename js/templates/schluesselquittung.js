/* Schlüsselquittung · A4 hoch
   --------------------------------------------------------------------------
   Wer hat welche Schlüssel? Ein Blatt, das den Übergang festhält: so viele
   Schlüssel welcher Art, an wen, wann zurück. Unterschrift drunter, fertig.
   Der Klassiker beim Handwerker, beim neuen Mieter, bei der Reinigungsfirma.

   Zwei Exemplare drucken: eines behält die Verwaltung, eines der Empfänger.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'schluesselquittung',
  title:'Schlüsselquittung',
  sub:'Wer welche Schlüssel bekommt — mit Unterschrift · A4 hoch',
  badge:'Schlüssel',
  root:'t-quit',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="120" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="60" width="162" height="7" rx="3.5" fill="#2A3350" opacity=".7"/>
    <rect x="24" y="92" width="162" height="24" rx="4" fill="#01B1E2" opacity=".14"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${128 + i * 22}" width="162" height="17" rx="4" fill="#fff" stroke="#E5E8ED" stroke-width="1.4"/>
      <circle cx="34" cy="${136 + i * 22}" r="4" fill="#01B1E2"/>
      <rect x="44" y="${132 + i * 22}" width="${90 - i*8}" height="6" rx="3" fill="#2A3350" opacity=".7"/>
      <rect x="164" y="${133 + i * 22}" width="14" height="6" rx="3" fill="#2A3350"/>`).join('')}
    <path d="M24 232h70M116 232h70" stroke="#2A3350" stroke-width="1.5"/>`),

  fields:[
    { t:'group', label:'Objekt und Datum' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'wohnung', label:'Wohnung / Lage', type:'text' },
    { k:'datum',  label:'Datum', type:'text' },

    { t:'group', label:'Übergeben an' },
    { k:'empfaenger', label:'Name', type:'text' },
    { k:'rolle',      label:'Funktion', type:'text',
      hint:'z. B. «Mieter», «Sanitär Meier AG», «Reinigung».' },

    { t:'group', label:'Schlüssel' },
    { t:'note', label:'Anzahl und Nummer werden vor Ort eingetragen, wenn du sie hier frei lässt.' },
    { k:'zeilen', label:'Schlüssel', type:'list', itemLabel:'Schlüssel', max:12,
      defaultItem:{ art:'', anzahl:'', nr:'' },
      item:[
        { k:'art',    label:'Art',    type:'text' },
        { k:'anzahl', label:'Anzahl', type:'text' },
        { k:'nr',     label:'Nummer', type:'text' }
      ] },

    { t:'group', label:'Rückgabe' },
    { k:'rueckgabe', label:'Vereinbarung', type:'textarea', rows:2 },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    objekt:'-',
    wohnung:'',
    datum:'',
    empfaenger:'',
    rolle:'',
    zeilen:[
      { art:'Wohnungsschlüssel', anzahl:'', nr:'' },
      { art:'Haustürschlüssel',  anzahl:'', nr:'' },
      { art:'Briefkastenschlüssel', anzahl:'', nr:'' },
      { art:'Keller / Estrich',  anzahl:'', nr:'' }
    ],
    rueckgabe:'Die Schlüssel bleiben Eigentum der Verwaltung und sind bei Auszug vollständig zurückzugeben. Verlorene Schlüssel werden nach Aufwand verrechnet.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const feld = (label, wert) => `
      <div class="t-quit-feld"><span>${esc(label)}</span><b>${wert ? esc(wert) : ''}</b></div>`;

    const zeilen = (d.zeilen || []).filter(z => has(z.art)).map(z => `
      <li>
        <span class="t-quit-ico">${icon('key', 20, 1.9)}</span>
        <span class="t-quit-art">${esc(z.art)}</span>
        <span class="t-quit-nr">${has(z.nr) ? 'Nr. ' + esc(z.nr) : ''}</span>
        <span class="t-quit-anz">${has(z.anzahl) ? esc(z.anzahl) : ''}</span>
      </li>`).join('');

    return `
      <header class="t-quit-kopf">
        <div>
          <h1>Schlüsselquittung</h1>
          <p class="t-quit-unter">Bestätigung über ausgehändigte Schlüssel</p>
        </div>
        <span class="t-quit-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
      </header>

      <div class="t-quit-oben">
        ${feld('Liegenschaft', ort)}
        ${feld('Wohnung / Lage', d.wohnung)}
        ${feld('Übergeben an', [d.empfaenger, d.rolle].filter(Boolean).join(', '))}
        ${feld('Datum', d.datum)}
      </div>

      <ul class="t-quit-liste">
        <li class="t-quit-titel"><span></span><span class="t-quit-art">Art</span>
          <span class="t-quit-nr">Nummer</span><span class="t-quit-anz">Anzahl</span></li>
        ${zeilen}
      </ul>

      ${has(d.rueckgabe) ? `<p class="t-quit-rueck">${esc(d.rueckgabe)}</p>` : ''}

      <footer class="t-quit-fuss">
        <div class="t-quit-sig"><span></span><i>Verwaltung</i></div>
        <div class="t-quit-sig"><span></span><i>Empfänger — mit dem Erhalt einverstanden</i></div>
      </footer>
      <p class="t-quit-abs">${esc(abs.foot)}</p>`;
  }
};
