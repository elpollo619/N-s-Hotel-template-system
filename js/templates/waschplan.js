/* Waschplan · A4 hoch.
   Nachbau von "Waschplan.docx": Montag bis Samstag, Zeitfenster von 07:00
   bis 22:00, eine Spalte je Tag, freie Zeilen zum Eintragen des Namens.
   Zeitraster und Tage sind einstellbar, weil nicht jedes Haus gleich wäscht. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb, lines } from '../lib/thumbs.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const TAGE = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];

/* "07:00-08:30, 08:30-10:00, …" → Liste. Trennzeichen: Komma oder Zeilenumbruch. */
function slots(text){
  return String(text || '')
    .split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
}

export default {
  id:'waschplan',
  title:'Waschplan',
  sub:'Wochenraster zum Eintragen · A4 hoch',
  badge:'Wäsche',
  page:'a4',
  root:'t-waschplan',
  cat:'waesche',

  thumb: thumb(`
    <rect x="18" y="18" width="120" height="13" rx="4" fill="#2A3350"/>
    <rect x="18" y="38" width="70" height="7" rx="3.5" fill="#01B1E2"/>
    ${[0,1,2].map(c => `<rect x="${18 + c * 59}" y="60" width="55" height="16" rx="4" fill="#2A3350"/>`).join('')}
    ${[0,1,2,3,4,5,6,7,8].map(r => [0,1,2].map(c =>
      `<rect x="${18 + c * 59}" y="${82 + r * 20}" width="55" height="16" rx="3"
         fill="${r % 2 ? '#F6F7FA' : '#fff'}" stroke="#E5E8ED" stroke-width="1"/>`).join('')).join('')}
    ${lines(18, 268, 174, 1, 8, '#E5E8ED')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'title', label:'Titel', type:'text' },
    { k:'sub',   label:'Untertitel', type:'text' },
    { k:'woche', label:'Woche / Monat', type:'text' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },

    { t:'group', label:'Raster' },
    { k:'tage', label:'Tage', type:'number', min:1, max:7, step:1,
      hint:'1 = nur Montag, 6 = Montag bis Samstag.' },
    { k:'zeiten', label:'Zeitfenster', type:'textarea',
      hint:'Eines pro Zeile oder mit Komma getrennt.' },

    { t:'group', label:'Fusszeile' },
    { k:'note',   label:'Hinweis', type:'textarea' },
    { k:'footer', label:'Absenderzeile', type:'text',
      hint:'Leer lassen: nimmt die Zeile des gewählten Absenders.' }
  ],

  defaults:{
    title:'Waschplan',
    sub:'Bitte Namen und Zimmernummer eintragen',
    woche:'Woche ______',
    objekt:'-',
    absender:'immobilien',
    tage:6,
    zeiten:'07:00 – 08:30\n08:30 – 10:00\n10:00 – 12:00\n13:00 – 14:30\n14:30 – 16:00\n16:00 – 17:30\n17:30 – 19:00\n19:00 – 20:30\n20:30 – 22:00',
    note:'Nicht genutzte Zeitfenster bitte wieder streichen, damit andere waschen können. Waschmittel selbst mitbringen.',
    footer:''
  },

  render(d){
    const abs = ABSENDER[d.absender] || ABSENDER.immobilien;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const tage = TAGE.slice(0, Math.min(7, Math.max(1, Number(d.tage) || 6)));
    const zeit = slots(d.zeiten);

    const head = tage.map(t => `<th>${esc(t)}</th>`).join('');
    const body = zeit.map(z => `
      <tr>
        <th class="t-waschplan-time">${esc(z)}</th>
        ${tage.map(() => '<td></td>').join('')}
      </tr>`).join('');

    return `
    <header class="t-waschplan-head">
      <div>
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-waschplan-sub">${esc(d.sub)}</p>` : ''}
        ${(obj.code || adr) ? `<p class="t-waschplan-obj">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</p>` : ''}
      </div>
      <div class="t-waschplan-right">
        ${has(d.woche) ? `<p class="t-waschplan-woche">${esc(d.woche)}</p>` : ''}
        ${istHotel(d.absender) ? logo('color', 32) : ''}
      </div>
    </header>

    <table class="t-waschplan-grid">
      <thead><tr><th class="t-waschplan-corner">Zeit</th>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>

    <footer class="t-waschplan-foot">
      ${has(d.note) ? `<p class="t-waschplan-note">${esc(d.note)}</p>` : ''}
      <p class="t-waschplan-addr">${esc(has(d.footer) ? d.footer : abs.foot)}</p>
    </footer>`;
  }
};
