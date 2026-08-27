/* Zimmerschild · A5 quer, eine Seite je Zimmer
   --------------------------------------------------------------------------
   Die Nummer an der Tür. Aus einem Bereich — «1 bis 8» — wird eine Seite je
   Zimmer, wie beim Parkplatz-Schild. Wer eigene Namen statt Nummern will,
   schreibt sie in die Liste; dann gilt die Liste und der Bereich wird
   ignoriert.

   Die Nummer ist gross, weil sie aus dem Gang erkannt werden muss. Der Name
   darunter ist die Zugabe.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { absender, objekt, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const ZIMMER_PAGES = { 'a5-land':'a5-land', a5:'a5', 'a4-land':'a4-land', a4:'a4' };

export default {
  id:'zimmerschild',
  title:'Zimmerschild',
  sub:'Hotelzimmer in Serie — je Zimmer eine Seite. Für einen einzelnen Raum das Türschild',
  badge:'Zimmer',
  root:'t-zimmer',
  fern:true,
  multipage:true,
  pageOf(d){ return ZIMMER_PAGES[d && d.format] || 'a5-land'; },

  thumb: thumbLand(`
    <rect x="14" y="14" width="269" height="177" rx="10" fill="#fff" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="14" y="14" width="269" height="14" rx="7" fill="#01B1E2"/>
    <text x="52" y="130" font-family="sans-serif" font-size="86" font-weight="700" fill="#2A3350">12</text>
    <rect x="150" y="72" width="96" height="12" rx="6" fill="#2A3350" opacity=".8"/>
    <rect x="150" y="94" width="72" height="8" rx="4" fill="#C9CFDA"/>
    <circle cx="198" cy="140" r="22" fill="none" stroke="#01B1E2" stroke-width="3"/>`),

  fields:[
    { t:'group', label:'Zimmer' },
    { k:'von', label:'von Nr.', type:'number', min:1, max:199, step:1 },
    { k:'bis', label:'bis Nr.', type:'number', min:1, max:199, step:1,
      hint:'Ergibt eine Seite je Zimmer. Gleiche Zahl = ein einzelnes Schild.' },
    { k:'liste', label:'Statt Nummern: eigene Zimmer', type:'list', itemLabel:'Zimmer', max:24,
      defaultItem:{ nr:'', name:'' },
      item:[
        { k:'nr',   label:'Nummer oder Kürzel', type:'text' },
        { k:'name', label:'Name',               type:'text' }
      ],
      hint:'Sobald hier eine Zeile steht, gilt die Liste — der Bereich oben wird nicht mehr verwendet.' },

    { t:'group', label:'Aussehen' },
    { k:'format', label:'Papier', type:'select', options:[
      { v:'a5-land', t:'A5 quer' }, { v:'a5', t:'A5 hoch' },
      { v:'a4-land', t:'A4 quer' }, { v:'a4', t:'A4 hoch' }
    ] },
    { k:'ton', label:'Farbe', type:'select', options:[
      { v:'navy',  t:'Navy auf Weiss' },
      { v:'cyan',  t:'Cyan auf Weiss' },
      { v:'voll',  t:'Weiss auf Navy' }
    ] },
    { k:'icon', label:'Symbol', type:'select', options:iconOptions },
    { k:'zusatz', label:'Zeile unter der Nummer', type:'text',
      hint:'Gilt für alle Schilder — zum Beispiel «1. Stock» oder «Nichtraucher».' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    von:1, bis:8,
    liste:[],
    format:'a5-land',
    ton:'navy',
    icon:'bed',
    zusatz:'',
    objekt:'A14',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);

    const eigene = (d.liste || []).filter(z => has(z.nr) || has(z.name));
    let zimmer;
    if (eigene.length){
      zimmer = eigene.map(z => ({ nr:z.nr, name:z.name }));
    } else {
      const von = Math.max(1, Number(d.von) || 1);
      const bis = Math.max(von, Number(d.bis) || von);
      zimmer = [];
      for (let n = von; n <= bis; n++) zimmer.push({ nr:String(n), name:'' });
    }

    return zimmer.map(z => `
      <article data-page class="t-zimmer-page is-${esc(d.ton || 'navy')}">
        <div class="t-zimmer-rahmen">
          <div class="t-zimmer-mitte">
            <p class="t-zimmer-nr">${esc(z.nr)}</p>
            <div class="t-zimmer-rechts">
              ${has(z.name) ? `<p class="t-zimmer-name">${esc(z.name)}</p>` : ''}
              ${has(d.zusatz) ? `<p class="t-zimmer-zusatz">${esc(d.zusatz)}</p>` : ''}
              <span class="t-zimmer-ico">${icon(d.icon || 'bed', 46, 1.7)}</span>
            </div>
          </div>
          <footer class="t-zimmer-fuss">
            <span class="t-zimmer-mark">${istHotel(d.absender) ? logo(d.ton === 'voll' ? 'white' : 'color', 20) : ''}</span>
            <span>${esc([obj.code && obj.name, abs.name].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(' · '))}</span>
          </footer>
        </div>
      </article>`).join('');
  }
};
