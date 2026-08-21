/* Sammelstelle · Beschriftung der Behälter, mehrseitig.
   Ersetzt die Serie BeschriftungPET / -Altglas / -Altpapier / -Metall /
   -Nespresso / -Kehricht / -Kompost / -Sperrmüll und die Liste aus
   "A14 Recycling.docx" (Papier, Plastik-Gebinde, PET, Clean Plastik, Glas,
   Alumetall).

   Ein grosses Wort, ein Piktogramm, eine Zeile was hinein darf und eine was
   nicht — aus zwei Metern Abstand lesbar. Angekreuzte Fraktionen ergeben je
   eine Seite. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const SAMMEL_PAGES = { a5:'a5', 'a5-land':'a5-land', a4:'a4', 'a4-land':'a4-land' };

/* Die Fraktionen, wie sie im Haus wirklich beschriftet sind. */
export const FRAKTIONEN = [
  { id:'papier',   wort:'Papier',        en:'Paper',        icon:'trash',  farbe:'#2A3350',
    ja:'Sauberes Papier und Karton', nein:'Kein beschichtetes Papier, keine Verbundverpackungen' },
  { id:'karton',   wort:'Karton',        en:'Cardboard',    icon:'trash',  farbe:'#2A3350',
    ja:'Flach gefaltet', nein:'Kein verschmutzter Karton' },
  { id:'pet',      wort:'PET',           en:'PET bottles',  icon:'bottle', farbe:'#0B7A3B',
    ja:'Nur PET-Getränkeflaschen — Luft rauslassen, Deckel wieder aufschrauben', nein:'Keine Milchflaschen, keine Shampooflaschen' },
  { id:'plastik',  wort:'Clean Plastik', en:'Clean plastic',icon:'bottle', farbe:'#0B7A3B',
    ja:'Saubere Kunststoffverpackungen', nein:'Keine verschmutzten Verpackungen' },
  { id:'gebinde',  wort:'Plastik-Gebinde', en:'Plastic bottles', icon:'bottle', farbe:'#0B7A3B',
    ja:'Shampoo-, Wasch- und Putzmittelflaschen', nein:'Kein PET' },
  { id:'glas',     wort:'Glas',          en:'Glass',        icon:'bottle', farbe:'#0E6E5E',
    ja:'Flaschen und Gläser, ohne Deckel', nein:'Kein Fensterglas, keine Keramik' },
  { id:'metall',   wort:'Alumetall',     en:'Metal',        icon:'trash',  farbe:'#5A6474',
    ja:'Dosen, Alu, Tuben', nein:'Keine Spraydosen mit Restinhalt' },
  { id:'nespresso',wort:'Nespresso',     en:'Coffee capsules', icon:'cup', farbe:'#8A5A2B',
    ja:'Nur Aluminium-Kapseln', nein:'Keine Kunststoff-Kapseln' },
  { id:'kompost',  wort:'Kompost',       en:'Organic waste',icon:'trash',  farbe:'#6B7A2B',
    ja:'Rüstabfälle, Kaffeesatz, Eierschalen', nein:'Keine Knochen, keine Plastiksäcke' },
  { id:'kehricht', wort:'Kehricht',      en:'General waste',icon:'trash',  farbe:'#C0271F',
    ja:'Nur im offiziellen Gebührensack', nein:'Nichts Recycelbares' },
  { id:'sperrmuell',wort:'Sperrmüll',    en:'Bulky waste',  icon:'trash',  farbe:'#C0271F',
    ja:'Nach Absprache mit der Verwaltung', nein:'Nicht einfach abstellen' }
];

export default {
  id:'sammelstelle',
  title:'Sammelstelle beschriften',
  sub:'Papier, PET, Glas, Kehricht … · eine Seite je Behälter',
  badge:'Abfall',
  root:'t-sammel',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'abfall',
  multipage:true,
  pageOf(d){ return SAMMEL_PAGES[d && d.format] || 'a5-land'; },

  thumb: thumb(`
    <rect x="12" y="26" width="186" height="106" rx="10" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="12" y="26" width="186" height="20" rx="10" fill="#0B7A3B"/>
    <rect x="12" y="36" width="186" height="10" fill="#0B7A3B"/>
    <rect x="30" y="62" width="70" height="22" rx="5" fill="#2A3350"/>
    <rect x="30" y="94" width="110" height="7" rx="3.5" fill="#C9CFDA"/>
    <rect x="30" y="108" width="86" height="7" rx="3.5" fill="#E5E8ED"/>
    <circle cx="164" cy="86" r="22" fill="#fff" stroke="#0B7A3B" stroke-width="3"/>
    <rect x="12" y="158" width="186" height="106" rx="10" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="12" y="158" width="186" height="20" rx="10" fill="#C0271F"/>
    <rect x="12" y="168" width="186" height="10" fill="#C0271F"/>
    <rect x="30" y="194" width="90" height="22" rx="5" fill="#2A3350"/>
    <rect x="30" y="226" width="110" height="7" rx="3.5" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Format' },
    { k:'format', label:'Papier', type:'select', options:[
      { v:'a5-land', t:'A5 quer' }, { v:'a5', t:'A5 hoch' },
      { v:'a4-land', t:'A4 quer' }, { v:'a4', t:'A4 hoch' }
    ] },
    { k:'zweisprachig', label:'Englisch mitdrucken', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },

    { t:'group', label:'Behälter' },
    { t:'note', label:'Jede Zeile ergibt eine Druckseite. Nicht benötigte Zeilen löschen.' },
    { k:'rows', label:'Fraktionen', type:'list', itemLabel:'Behälter', max:12,
      defaultItem:{ art:'papier', wort:'', ja:'', nein:'' },
      item:[
        { k:'art',  label:'Fraktion', type:'select',
          options:FRAKTIONEN.map(f => ({ v:f.id, t:f.wort })) },
        { k:'wort', label:'Wort (überschreibt)', type:'text' },
        { k:'ja',   label:'Das gehört hinein', type:'text' },
        { k:'nein', label:'Das gehört nicht hinein', type:'text' }
      ] }
  ],

  defaults:{
    format:'a5-land',
    zweisprachig:'ja',
    objekt:'-',
    absender:'immobilien',
    /* Die sechs Fraktionen aus "A14 Recycling.docx". */
    rows:[
      { art:'papier',  wort:'', ja:'', nein:'' },
      { art:'gebinde', wort:'', ja:'', nein:'' },
      { art:'pet',     wort:'', ja:'', nein:'' },
      { art:'plastik', wort:'', ja:'', nein:'' },
      { art:'glas',    wort:'', ja:'', nein:'' },
      { art:'metall',  wort:'', ja:'', nein:'' }
    ]
  },

  render(d){
    const abs = ABSENDER[d.absender] || ABSENDER.immobilien;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const en  = d.zweisprachig !== 'nein';

    return (d.rows || []).map(r => {
      const f = FRAKTIONEN.find(x => x.id === r.art) || FRAKTIONEN[0];
      const wort = has(r.wort) ? r.wort : f.wort;
      const ja   = has(r.ja)   ? r.ja   : f.ja;
      const nein = has(r.nein) ? r.nein : f.nein;

      return `
      <article data-page class="t-sammel-page" style="--ton:${f.farbe}">
        <div class="t-sammel-band"></div>
        <div class="t-sammel-body">
          <div class="t-sammel-txt">
            <h1>${esc(wort)}</h1>
            ${en && f.en ? `<p class="t-sammel-en">${esc(f.en)}</p>` : ''}
            ${has(ja)   ? `<p class="t-sammel-ja"><span>✓</span>${esc(ja)}</p>` : ''}
            ${has(nein) ? `<p class="t-sammel-nein"><span>×</span>${esc(nein)}</p>` : ''}
          </div>
          <div class="t-sammel-ico">${icon(f.icon, 120, 1.6)}</div>
        </div>
        <footer class="t-sammel-foot">
          <span>${istHotel(d.absender) ? logo('color', 22) : esc(abs.legal)}</span>
          <span>${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
        </footer>
      </article>`;
    }).join('');
  }
};
