/* Plan-Editor · Lageplan frei bearbeiten, A4 quer (Format wählbar).
   Portiert aus "Anfahrt & Parken - Plan-Editor.html" und src/mapeditor.js.
   Interaktive Vorlage: render() zeichnet das Blatt, mount() hängt den
   Editor an (Ziehen, Punkte, Eigenschaften-Panel). */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumbLand } from '../lib/thumbs.js';
import { mountPlanEditor, seedPlan } from '../lib/planeditor.js';
import { kartenWerkzeug, kartenFelder } from '../lib/geokarte.js';
import { BRAND, contactLine } from '../brand-config.js';

const PAGES = {
  'A4-quer':'a4-land', 'A4-hoch':'a4',
  'A3-quer':'a3-land', 'A3-hoch':'a3',
  'A2-quer':'a2-land', 'A2-hoch':'a2',
  'A1-quer':'a1-land', 'A1-hoch':'a1',
  'A0-quer':'a0-land', 'A0-hoch':'a0',
  'A5-quer':'a5-land', 'A5-hoch':'a5',
  'Letter-quer':'letter-land', 'Letter-hoch':'letter'
};

export default {
  id:'plan-editor',
  title:'Plan-Editor',
  sub:'Lageplan frei bearbeiten · Format wählbar',
  badge:'Anfahrt',
  badgeCyan:true,
  page:'a4-land',
  root:'t-plan',
  pageOf(d){ return PAGES[d && d.format] || 'a4-land'; },

  thumb: thumbLand(`
    <rect x="14" y="14" width="269" height="128" rx="7" fill="#DDE3D8"/>
    <path d="M14 92 h269 v16 h-269 z" fill="#C9D0C4"/>
    <path d="M92 44 l60 -14 40 46 -60 16 z" fill="#B7D900" fill-opacity=".5" stroke="#8FA800" stroke-width="1.6"/>
    <path d="M180 34 l44 -10 20 26 -44 12 z" fill="#E5387E" fill-opacity=".35" stroke="#E5387E" stroke-width="1.6"/>
    <path d="M126 60 c14 14 22 20 26 34" stroke="#12A150" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 6" fill="none"/>
    <circle cx="152" cy="96" r="8" fill="#2A3350"/><circle cx="206" cy="46" r="7" fill="#01B1E2"/>
    <circle cx="126" cy="60" r="4.5" fill="#fff" stroke="#01B1E2" stroke-width="2"/>
    <circle cx="152" cy="94" r="4.5" fill="#fff" stroke="#01B1E2" stroke-width="2"/>
    <rect x="228" y="60" width="52" height="20" rx="5" fill="#fff" stroke="#2A3350" stroke-width="1.4"/>
    <rect x="234" y="66" width="30" height="4" rx="2" fill="#2A3350"/>
    <rect x="14" y="154" width="120" height="8" rx="4" fill="#2A3350"/>
    <rect x="14" y="172" width="200" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Zusatz im Titel', type:'text' },

    { t:'group', label:'Hintergrundbild' },
    { k:'img', label:'Luftbild', type:'image',
      hint:'Leer lassen für das hinterlegte Bild (swisstopo).' },
    ...kartenFelder(),

    { t:'group', label:'Seite' },
    { k:'format', label:'Format', type:'select',
      options:Object.keys(PAGES).map(v => ({ v, t:v.replace('-', ' · ') })) },

    { t:'group', label:'Legende' },
    { k:'legend', label:'Einträge', type:'list', itemLabel:'Eintrag', max:8,
      defaultItem:{ color:'#01B1E2', label:'' },
      item:[
        { k:'color', label:'Farbe', type:'color' },
        { k:'label', label:'Text', type:'text' }
      ] },

    { t:'group', label:'Fusszeile' },
    { k:'footer', label:'Adresszeile', type:'text' },
    { k:'credit', label:'Bildquelle', type:'text' }
  ],

  defaults:{
    eyebrow:'So finden Sie uns',
    title:'Anfahrt und Parkplätze',
    sub:'Arrival and parking',
    img:'',
    mapLink:'', mapStil:'luftbild', mapZoom:'mittel',
    format:'A4-quer',
    legend:[
      { color:'#1F9D57', label:'Garten' },
      { color:'#B7D900', label:'Check-in-Gebäude' },
      { color:'#E5387E', label:'Aussen-Parkplatz' },
      { color:'#2A3350', label:'Self Check-in' },
      { color:'#12A150', label:'Weg zu Fuss' }
    ],
    footer: contactLine(),
    credit: BRAND.aerialCredit || '',
    plan: seedPlan(),
    view:{ rot:0, zoom:1, cx:null, cy:null }
  },

  render(d){
    const src = has(d.img) ? d.img : (BRAND.aerial || '');
    return `
    <div class="t-plan-head">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-plan-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}${has(d.sub) ? ` <span>· ${esc(d.sub)}</span>` : ''}</h1>
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
                : `<rect data-plan-bg x="0" y="0" width="2414" height="1654" fill="#E7ECE4"/>`}
        </g>
      </svg>
      ${has(d.credit) ? `<span class="t-plan-credit">${esc(d.credit)}</span>` : ''}
    </div>

    <div class="t-plan-legend">
      ${(d.legend || []).filter(l => has(l.label)).map(l => `
        <span class="t-plan-key"><i style="background:${esc(l.color)}"></i>${esc(l.label)}</span>`).join('')}
    </div>

    ${has(d.footer) ? `<p class="t-plan-addr">${esc(d.footer)}</p>` : ''}`;
  },

  mount(ctx){
    /* Zwei Mieter im Panel: oben der swisstopo-Lader, darunter der
       Plan-Editor mit seinem eigenen, sich selbst neu zeichnenden Bereich. */
    const editorDiv = document.createElement('div');
    ctx.panel.append(editorDiv);
    const wegKarte  = kartenWerkzeug(ctx, {
      ziel:'img', breite:1920, hoehe:1316,   /* Proportion des Plan-Lienzos (2414:1654) */
      nachher(d){ if (!d.credit) d.credit = '© swisstopo'; }
    });
    const wegEditor = mountPlanEditor({ ...ctx, panel: editorDiv });
    return () => {
      if (typeof wegKarte === 'function') wegKarte();
      if (typeof wegEditor === 'function') wegEditor();
      editorDiv.remove();
    };
  }
};
