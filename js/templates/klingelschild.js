/* Klingel- und Briefkastenschilder · A4 hoch, Bogen zum Ausschneiden
   --------------------------------------------------------------------------
   Namensschilder fuer Klingel und Briefkasten. Es gibt keine Norm dafuer —
   jedes Haus hat andere Rahmen. Darum ist die Groesse frei einstellbar, und
   die Schilder liegen so eng nebeneinander, wie es die Groesse zulaesst.

   Schnittlinien statt Schnittmarken: bei kleinen Schildern liegen die Marken
   naeher beieinander als die Schere breit ist.
*/
import { esc, has } from '../lib/dom.js';
import { thumb } from '../lib/thumbs.js';
import { objekt, objektOptions } from '../objekte.js';

/* Uebliche Groessen aus dem Handel, plus «frei». Die Werte sind Millimeter. */
const KLINGEL_MASSE = {
  klein:  { b:50,  h:12, label:'50 × 12 mm — Klingel schmal' },
  mittel: { b:60,  h:15, label:'60 × 15 mm — Klingel' },
  gross:  { b:75,  h:20, label:'75 × 20 mm — Klingel breit' },
  brief:  { b:90,  h:25, label:'90 × 25 mm — Briefkasten' },
  frei:   { b:0,   h:0,  label:'frei — Masse selbst angeben' }
};

export default {
  id:'klingelschild',
  title:'Klingel- und Briefkastenschilder',
  sub:'Namensschilder auf A4 · Grösse frei · zum Ausschneiden',
  badge:'Beschriften',
  root:'t-kling',
  page:'a4',

  thumb: thumb(`
    ${[0,1,2,3,4,5,6,7].map(i => {
      const x = 22 + (i % 2) * 88, y = 34 + Math.floor(i / 2) * 62;
      return `<rect x="${x}" y="${y}" width="80" height="42" rx="3" fill="#fff" stroke="#C9CFDA" stroke-width="1.6" stroke-dasharray="4 3"/>
              <rect x="${x + 12}" y="${y + 14}" width="${52 - (i % 3) * 8}" height="9" rx="4.5" fill="#2A3350" opacity=".85"/>
              <rect x="${x + 12}" y="${y + 27}" width="${34 - (i % 2) * 6}" height="5" rx="2.5" fill="#C9CFDA"/>`;
    }).join('')}`),

  fields:[
    { t:'group', label:'Grösse' },
    { k:'mass', label:'Format', type:'select',
      options:Object.entries(KLINGEL_MASSE).map(([v, m]) => ({ v, t:m.label })) },
    { k:'breite', label:'Breite in mm', type:'number', min:20, max:190, step:1,
      hint:'Gilt nur bei «frei».' },
    { k:'hoehe',  label:'Höhe in mm',   type:'number', min:8,  max:60,  step:1 },

    { t:'group', label:'Aussehen' },
    { k:'ausrichtung', label:'Ausrichtung', type:'select',
      options:[{ v:'links', t:'linksbündig' }, { v:'mitte', t:'zentriert' }] },
    { k:'rahmen', label:'Rahmen', type:'select',
      options:[{ v:'linie', t:'dünne Linie — als Schnitthilfe' },
               { v:'ohne',  t:'ohne — nur Text' }] },
    { k:'grossbuchstaben', label:'Grossbuchstaben', type:'select',
      options:[{ v:'nein', t:'nein' }, { v:'ja', t:'ja' }] },

    { t:'group', label:'Namen' },
    { k:'namen', label:'Schilder', type:'list', itemLabel:'Schild', max:60,
      defaultItem:{ name:'', zusatz:'' },
      item:[
        { k:'name',   label:'Name',   type:'text' },
        { k:'zusatz', label:'Zusatz', type:'text' }
      ],
      hint:'Jede Zeile wird ein Schild. Für mehrere gleiche einfach mehrmals eintragen.' },

    { t:'group', label:'Objekt' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions }
  ],

  defaults:{
    mass:'mittel',
    breite:60, hoehe:15,
    ausrichtung:'links',
    rahmen:'linie',
    grossbuchstaben:'nein',
    namen:[
      { name:'Muster',     zusatz:'EG links' },
      { name:'Beispiel',   zusatz:'EG rechts' },
      { name:'Muster',     zusatz:'1. OG links' },
      { name:'Beispiel',   zusatz:'1. OG rechts' },
      { name:'Muster',     zusatz:'2. OG links' },
      { name:'Beispiel',   zusatz:'2. OG rechts' },
      { name:'Hauswart',   zusatz:'' },
      { name:'Verwaltung', zusatz:'Hans Amonn Immobilien' }
    ],
    objekt:'-'
  },

  render(d){
    const m = KLINGEL_MASSE[d.mass] || KLINGEL_MASSE.mittel;
    const b = m.b || Math.max(20, Number(d.breite) || 60);
    const h = m.h || Math.max(8,  Number(d.hoehe)  || 15);
    const obj = objekt(d.objekt);

    const schilder = (d.namen || []).filter(n => has(n.name) || has(n.zusatz)).map(n => `
      <div class="t-kling-schild" style="width:${b}mm;height:${h}mm">
        <span class="t-kling-name">${esc(n.name)}</span>
        ${has(n.zusatz) ? `<span class="t-kling-zusatz">${esc(n.zusatz)}</span>` : ''}
      </div>`).join('');

    return `
      <div class="t-kling-bogen is-${esc(d.ausrichtung || 'links')} is-rahmen-${esc(d.rahmen || 'linie')}${
        d.grossbuchstaben === 'ja' ? ' is-versal' : ''}"
        style="--kling-h:${h}mm">
        ${schilder}
      </div>
      <p class="t-kling-fuss">
        ${esc(b)} × ${esc(h)} mm${obj.code ? ' · ' + esc(obj.name) : ''}
        — auf festes Papier drucken, ausschneiden, einschieben.
      </p>`;
  }
};
