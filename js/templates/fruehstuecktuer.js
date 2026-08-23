/* Frühstück-Türkarte · A5 hoch
   --------------------------------------------------------------------------
   Die Karte, die der Gast am Abend ankreuzt und an die Türklinke hängt: was
   er zum Frühstück möchte und zu welcher Zeit. Am Morgen weiss das Haus
   Bescheid, ohne dass jemand klopfen muss. Zwei Spalten Kästchen, damit das
   Ankreuzen im Halbdunkel gelingt.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, istHotel, absenderOptions } from '../objekte.js';

export default {
  id:'fruehstuecktuer',
  title:'Frühstück-Türkarte',
  sub:'Zum Ankreuzen und an die Klinke hängen · A5 hoch',
  badge:'Frühstück',
  root:'t-frut',
  page:'a5',

  thumb: thumb(`
    <circle cx="105" cy="40" r="16" fill="none" stroke="#01B1E2" stroke-width="4"/>
    <rect x="30" y="72" width="120" height="14" rx="5" fill="#2A3350"/>
    ${[0,1,2,3,4].map(i => `
      <rect x="30" y="${104 + i*26}" width="12" height="12" rx="2" fill="none" stroke="#2A3350" stroke-width="2"/>
      <rect x="50" y="${107 + i*26}" width="${120 - (i%3)*16}" height="7" rx="3.5" fill="#2A3350" opacity=".6"/>`).join('')}
    <rect x="30" y="250" width="60" height="8" rx="4" fill="#01B1E2"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'unter',   label:'Untertitel', type:'text' },

    { t:'group', label:'Zum Ankreuzen' },
    { k:'posten', label:'Posten', type:'list', itemLabel:'Posten', max:14,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Posten', type:'text' }] },

    { t:'group', label:'Zeit' },
    { k:'zeiten', label:'Zeitfenster', type:'text',
      hint:'Kommagetrennt, jedes wird ein ankreuzbares Kästchen.' },

    { t:'group', label:'Angaben des Gastes' },
    { k:'felder', label:'Zeilen', type:'text',
      hint:'Kommagetrennt — je eine Schreiblinie.' },

    { t:'group', label:'Hinweis' },
    { k:'hinweis', label:'Hinweis', type:'text' },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Guten Morgen im Voraus',
    titel:'Frühstück',
    unter:'Ankreuzen und heute Abend an die Türklinke hängen.',
    posten:[
      { text:'Kaffee' }, { text:'Tee' }, { text:'Milch' }, { text:'Orangensaft' },
      { text:'Gipfeli' }, { text:'Brot' }, { text:'Butter und Konfitüre' },
      { text:'Käse und Aufschnitt' }, { text:'Joghurt' }, { text:'Ei' }, { text:'Früchte' }
    ],
    zeiten:'07:00 – 07:30, 07:30 – 08:00, 08:00 – 08:30, 08:30 – 09:00',
    felder:'Zimmer-Nr., Anzahl Personen, Name',
    hinweis:'Bitte bis 22:00 aushängen. Änderungen gerne an der Rezeption.',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const posten = (d.posten || []).filter(p => has(p.text)).map(p => `
      <li><span class="t-frut-box"></span>${esc(p.text)}</li>`).join('');

    const zeiten = String(d.zeiten || '').split(',').map(s => s.trim()).filter(Boolean).map(z => `
      <li><span class="t-frut-box"></span>${esc(z)}</li>`).join('');

    const felder = String(d.felder || '').split(',').map(s => s.trim()).filter(Boolean).map(f => `
      <div class="t-frut-feld"><span>${esc(f)}</span><i></i></div>`).join('');

    return `
      <div class="t-frut-loch"></div>
      <header class="t-frut-kopf">
        <span class="t-frut-ico">${icon('cup', 34, 1.7)}</span>
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel || '')}</h1>
        ${has(d.unter) ? `<p class="t-frut-unter">${esc(d.unter)}</p>` : ''}
      </header>

      ${posten ? `<ul class="t-frut-posten">${posten}</ul>` : ''}

      ${zeiten ? `<div class="t-frut-zeit"><h2>Zeit</h2><ul>${zeiten}</ul></div>` : ''}

      ${felder ? `<div class="t-frut-felder">${felder}</div>` : ''}

      <footer class="t-frut-fuss">
        <span class="t-frut-mark">${istHotel(d.absender) ? logo('color', 20) : esc(abs.name)}</span>
        ${has(d.hinweis) ? `<span>${esc(d.hinweis)}</span>` : ''}
      </footer>`;
  }
};
