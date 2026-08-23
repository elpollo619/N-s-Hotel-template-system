/* Turnusplan · A4 hoch
   --------------------------------------------------------------------------
   Wer ist diese Woche dran? Treppenhausreinigung, Winterdienst, Kehricht
   raus- und reinstellen — all das läuft im Turnus. Eine Tabelle: links die
   Woche oder das Datum, rechts die Partei. Wer seinen Namen sucht, findet
   die Zeile; wer die Woche sucht, findet die Partei.

   Ein Plan für viele Dienste: Titel und die Spaltenköpfe sind frei, die
   Zeilen ebenso. Damit deckt dieselbe Vorlage Putzen wie Schneeräumen ab.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'turnus',
  title:'Turnusplan',
  sub:'Treppenhaus, Winterdienst, Kehricht — wer wann dran ist · A4 hoch',
  badge:'Turnus',
  root:'t-turn',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="120" height="14" rx="5" fill="#2A3350"/>
    <rect x="24" y="54" width="60" height="8" rx="4" fill="#01B1E2"/>
    <rect x="24" y="80" width="162" height="20" rx="4" fill="#01B1E2" opacity=".16"/>
    ${[0,1,2,3,4,5].map(i => `
      <rect x="24" y="${108 + i*24}" width="162" height="18" rx="3" fill="${i%2? '#F6F7FA':'#fff'}" stroke="#E5E8ED" stroke-width="1"/>
      <rect x="32" y="${114 + i*24}" width="40" height="7" rx="3.5" fill="#2A3350" opacity=".75"/>
      <rect x="110" y="${114 + i*24}" width="${64 - (i%3)*10}" height="7" rx="3.5" fill="#2A3350" opacity=".55"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Spalten' },
    { k:'spalteA', label:'Linke Spalte', type:'text' },
    { k:'spalteB', label:'Rechte Spalte', type:'text' },

    { t:'group', label:'Zeilen' },
    { t:'note', label:'Lass die rechte Spalte leer, wenn die Parteien von Hand eingetragen werden sollen.' },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Zeile', max:26,
      defaultItem:{ a:'', b:'' },
      item:[
        { k:'a', label:'Woche / Datum', type:'text' },
        { k:'b', label:'Partei / Name', type:'text' }
      ] },

    { t:'group', label:'Aufgaben' },
    { k:'aufgaben', label:'Was dazugehört', type:'list', itemLabel:'Aufgabe', max:8,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Aufgabe', type:'text' }] },

    { t:'group', label:'Hinweis' },
    { k:'hinweis', label:'Fusshinweis', type:'textarea', rows:2 },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Wer wann dran ist',
    titel:'Treppenhausreinigung',
    objekt:'-',
    spalteA:'Woche',
    spalteB:'Partei',
    zeilen:[
      { a:'KW 1 · 30.12.–05.01.', b:'EG links' },
      { a:'KW 2 · 06.–12.01.', b:'EG rechts' },
      { a:'KW 3 · 13.–19.01.', b:'1. OG links' },
      { a:'KW 4 · 20.–26.01.', b:'1. OG rechts' },
      { a:'KW 5 · 27.01.–02.02.', b:'2. OG links' },
      { a:'KW 6 · 03.–09.02.', b:'2. OG rechts' }
    ],
    aufgaben:[
      { text:'Treppe und Podeste feucht aufnehmen' },
      { text:'Eingang, Briefkastenanlage und Lift abwischen' },
      { text:'Kehricht- und Altpapierraum kontrollieren' }
    ],
    hinweis:'Wer verhindert ist, tauscht mit einer anderen Partei und informiert die Verwaltung. Material steht im Putzraum.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const zeilen = (d.zeilen || []).filter(z => has(z.a) || has(z.b)).map(z => `
      <li><span class="t-turn-a">${esc(z.a)}</span><span class="t-turn-b">${esc(z.b)}</span></li>`).join('');

    const aufgaben = (d.aufgaben || []).filter(a => has(a.text)).map(a => `
      <li><span>${icon('check', 15, 2.2)}</span>${esc(a.text)}</li>`).join('');

    return `
      <header class="t-turn-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel || '')}</h1>
        ${ort ? `<p class="t-turn-ort">${esc(ort)}</p>` : ''}
      </header>

      <ul class="t-turn-tab">
        <li class="t-turn-titel"><span class="t-turn-a">${esc(d.spalteA || 'Woche')}</span>
          <span class="t-turn-b">${esc(d.spalteB || 'Partei')}</span></li>
        ${zeilen}
      </ul>

      ${aufgaben ? `
      <section class="t-turn-auf">
        <h2>Was dazugehört</h2>
        <ul>${aufgaben}</ul>
      </section>` : ''}

      ${has(d.hinweis) ? `<p class="t-turn-hinweis">${esc(d.hinweis)}</p>` : ''}

      <footer class="t-turn-fuss">
        <span class="t-turn-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc(abs.foot)}</span>
      </footer>`;
  }
};
