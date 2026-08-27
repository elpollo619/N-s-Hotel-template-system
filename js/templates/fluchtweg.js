/* Fluchtwegplan · A4 quer (Format wählbar).
   Ein Grundriss des Stockwerks mit dem grünen Fluchtweg, den Notausgängen,
   Feuerlöschern, Erste-Hilfe und dem Sammelplatz — plus «Sie sind hier».
   Baut auf demselben Plan-Editor wie der Lageplan: Grundriss als Bild
   hochladen, dann Pfeil und Zeichen an die richtige Stelle ziehen.

   Die Symbole folgen der ISO 7010 (Rettungszeichen grün, Brandschutz rot).
   Ein Fluchtwegplan mit Rechtswirkung gehört von einer Fachperson geprüft;
   diese Vorlage hilft beim Zeichnen, ersetzt die Prüfung nicht. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumbLand } from '../lib/thumbs.js';
import { mountPlanEditor } from '../lib/planeditor.js';
import { szZeichen, szSvg } from '../lib/sicherheitszeichen.js';
import { contactLine } from '../brand-config.js';

const FLUCHT_PAGES = {
  'A4-quer':'a4-land', 'A4-hoch':'a4',
  'A3-quer':'a3-land', 'A3-hoch':'a3',
  'A2-quer':'a2-land', 'A2-hoch':'a2'
};

/* Die vier Zeichen der Legende, in fester Reihenfolge. */
const LEGENDE = ['fluchtweg', 'sammelplatz', 'feuerloescher', 'erste-hilfe'];

function seedFluchtweg(){
  let n = 0;
  const id = () => 'f' + (++n);
  const els = [
    /* Grüner Fluchtweg mit Pfeilen */
    { id:id(), type:'route', pts:[[560,1240],[860,1040],[1280,920],[1720,700]],
      stroke:'#12A150', sw:16, dash:false, arrow:true },
    /* Notausgänge (grün) */
    { id:id(), type:'icon', kind:'exit', x:1770, y:660, color:'#1F9D57', scale:2.4 },
    { id:id(), type:'icon', kind:'exit', x:560,  y:1270, color:'#1F9D57', scale:2.2 },
    /* Feuerlöscher (rot) */
    { id:id(), type:'icon', kind:'extinguisher', x:1080, y:1000, color:'#D02B2B', scale:1.9 },
    /* Erste Hilfe (grün) */
    { id:id(), type:'icon', kind:'firstaid', x:840, y:1120, color:'#1F9D57', scale:1.9 },
    /* Sammelplatz (grün), ausserhalb */
    { id:id(), type:'icon', kind:'assembly', x:2020, y:520, color:'#1F9D57', scale:2.2 },
    /* Standort «Sie sind hier» */
    { id:id(), type:'pin', variant:'ns', x:560, y:1240, color:'#D02B2B', scale:1.5 },
    { id:id(), type:'label', x:250, y:1180, ax:560, ay:1240, de:'Sie sind hier', en:'You are here',
      tcolor:'#D02B2B', bg:'#ffffff', sw:2.6 },
    { id:id(), type:'label', x:1820, y:560, ax:2020, ay:520, de:'Sammelplatz', en:'Assembly point',
      tcolor:'#1F9D57', bg:'#ffffff', sw:2.6 },
    { id:id(), type:'label', x:1560, y:760, ax:1770, ay:660, de:'Notausgang', en:'Emergency exit',
      tcolor:'#1F9D57', bg:'#ffffff', sw:2.6 }
  ];
  return { seq:n + 1, sel:null, els };
}

export default {
  id:'fluchtweg',
  title:'Fluchtwegplan',
  sub:'Grundriss mit Fluchtweg, Notausgang und Sammelplatz · Format wählbar',
  badge:'Flucht',
  page:'a4-land',
  root:'t-plan',
  pageOf(d){ return FLUCHT_PAGES[d && d.format] || 'a4-land'; },

  thumb: thumbLand(`
    <rect x="14" y="14" width="269" height="128" rx="7" fill="#F1F4EF"/>
    <rect x="30" y="30" width="150" height="96" rx="3" fill="#fff" stroke="#C9D0C4" stroke-width="2"/>
    <path d="M60 108 C90 96 140 96 176 66" stroke="#12A150" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M176 66 l-9 -1 6 7 z" fill="#12A150"/>
    <rect x="168" y="52" width="20" height="20" rx="3" fill="#1F9D57"/>
    <rect x="52" y="100" width="20" height="20" rx="3" fill="#1F9D57"/>
    <rect x="104" y="86" width="18" height="18" rx="3" fill="#D02B2B"/>
    <rect x="196" y="40" width="20" height="20" rx="3" fill="#1F9D57"/>
    <rect x="14" y="154" width="120" height="8" rx="4" fill="#2A3350"/>
    <rect x="14" y="172" width="200" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Zusatz im Titel', type:'text' },
    { k:'etage',   label:'Stockwerk / Bereich', type:'text' },

    { t:'group', label:'Grundriss' },
    { k:'img', label:'Grundriss (Bild)', type:'image',
      hint:'Foto oder Scan des Stockwerk-Grundrisses. Leer lassen für eine helle Fläche zum Skizzieren.' },

    { t:'group', label:'Seite' },
    { k:'format', label:'Format', type:'select',
      options:Object.keys(FLUCHT_PAGES).map(v => ({ v, t:v.replace('-', ' · ') })) },

    { t:'group', label:'Fusszeile' },
    { k:'footer', label:'Adresszeile', type:'text' },
    { k:'hinweis', label:'Hinweis', type:'text' }
  ],

  defaults:{
    eyebrow:'Im Notfall',
    title:'Fluchtweg- und Rettungsplan',
    sub:'Escape and rescue plan',
    etage:'Erdgeschoss',
    img:'',
    format:'A4-quer',
    footer: contactLine(),
    hinweis:'Ruhe bewahren · gekennzeichnetem Fluchtweg folgen · Aufzug nicht benutzen · zum Sammelplatz gehen',
    plan: seedFluchtweg(),
    view:{ rot:0, zoom:1, cx:null, cy:null }
  },

  render(d){
    const src = has(d.img) ? d.img : '';
    const legende = LEGENDE.map(idz => {
      const z = szZeichen(idz);
      if (!z) return '';
      return `<span class="t-flucht-leg">
        <span class="t-flucht-leg-sym">${szSvg(z.art, z.pikto, 10)}</span>
        <span>${esc(z.text.de)}</span></span>`;
    }).join('');

    return `
    <div class="t-plan-head">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-plan-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}${has(d.sub) ? ` <span>· ${esc(d.sub)}</span>` : ''}</h1>
        ${has(d.etage) ? `<p class="t-flucht-etage">${esc(d.etage)}</p>` : ''}
      </div>
      <div class="t-plan-logo">${logo('color', 40)}</div>
    </div>

    <div class="t-plan-map" data-plan-map>
      <svg data-plan-svg viewBox="0 0 2414 1654" preserveAspectRatio="xMidYMid slice">
        <defs>
          <marker id="ns-plan-arrow" viewBox="0 0 10 10" refX="7" refY="5"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#12A150"/>
          </marker>
        </defs>
        <g data-plan-scene>
          ${src ? `<image data-plan-bg href="${esc(src)}" x="0" y="0" width="2414" height="1654"
                     preserveAspectRatio="xMidYMid slice"/>`
                : `<rect data-plan-bg x="0" y="0" width="2414" height="1654" fill="#F1F4EF"/>`}
        </g>
      </svg>
    </div>

    <div class="t-flucht-legende">${legende}</div>

    ${has(d.hinweis) ? `<p class="t-flucht-hinweis">${esc(d.hinweis)}</p>` : ''}
    ${has(d.footer) ? `<p class="t-plan-addr">${esc(d.footer)}</p>` : ''}`;
  },

  mount(ctx){
    return mountPlanEditor(ctx);
  }
};
