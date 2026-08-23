/* Inventarliste · A4 hoch
   --------------------------------------------------------------------------
   Was gehört zur Wohnung? Bei möblierten Wohnungen und beim Hotel-Apartment
   die Liste dessen, was beim Einzug da war und beim Auszug wieder da sein
   muss: Möbel, Geräte, Geschirr. Je Zeile ein Gegenstand, Anzahl, Zustand.
   Gehört zum Übergabeprotokoll wie das Salz zur Suppe.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'inventar',
  title:'Inventarliste',
  sub:'Was zur Wohnung gehört — Möbel, Geräte, Geschirr · A4 hoch',
  badge:'Inventar',
  root:'t-inv',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="110" height="14" rx="5" fill="#2A3350"/>
    <rect x="24" y="56" width="162" height="18" rx="4" fill="#01B1E2" opacity=".16"/>
    ${[0,1,2,3,4,5,6].map(i => `
      <rect x="24" y="${84 + i*24}" width="162" height="20" rx="3" fill="${i%2?'#F6F7FA':'#fff'}" stroke="#E5E8ED" stroke-width="1"/>
      <rect x="32" y="${91 + i*24}" width="${70 - (i%3)*10}" height="7" rx="3.5" fill="#2A3350" opacity=".7"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'titel', label:'Titel', type:'text' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'wohnung', label:'Wohnung / Lage', type:'text' },
    { k:'stand', label:'Stand / Datum', type:'text' },

    { t:'group', label:'Gegenstände' },
    { t:'note', label:'Nach Räumen gruppieren mit einer «Abschnitt»-Zeile. Anzahl und Zustand werden bei der Übergabe eingetragen.' },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Zeile', max:40,
      defaultItem:{ art:'posten', text:'', anzahl:'' },
      item:[
        { k:'art',    label:'Art', type:'select', options:[
          { v:'posten', t:'Gegenstand' }, { v:'abschnitt', t:'Raum / Abschnitt' } ] },
        { k:'text',   label:'Bezeichnung', type:'text' },
        { k:'anzahl', label:'Anzahl (Vorgabe)', type:'text' }
      ] },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Inventarliste',
    objekt:'-',
    wohnung:'',
    stand:'',
    zeilen:[
      { art:'abschnitt', text:'Küche', anzahl:'' },
      { art:'posten', text:'Kühlschrank', anzahl:'1' },
      { art:'posten', text:'Backofen / Herd', anzahl:'1' },
      { art:'posten', text:'Geschirrspüler', anzahl:'1' },
      { art:'posten', text:'Geschirr-Set (Teller, Gläser, Besteck)', anzahl:'' },
      { art:'abschnitt', text:'Wohnen', anzahl:'' },
      { art:'posten', text:'Sofa', anzahl:'1' },
      { art:'posten', text:'Esstisch mit Stühlen', anzahl:'1' },
      { art:'abschnitt', text:'Schlafen', anzahl:'' },
      { art:'posten', text:'Bett mit Matratze', anzahl:'' },
      { art:'posten', text:'Schrank', anzahl:'1' }
    ],
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr, d.wohnung].filter(Boolean).join(' · ');

    const zeilen = (d.zeilen || []).filter(z => has(z.text)).map(z => {
      if (z.art === 'abschnitt') return `
        <li class="t-inv-abschnitt"><span>${esc(z.text)}</span></li>`;
      return `
        <li class="t-inv-zeile">
          <span class="t-inv-was">${esc(z.text)}</span>
          <span class="t-inv-anz">${esc(z.anzahl || '')}</span>
          <span class="t-inv-zst"></span>
        </li>`;
    }).join('');

    return `
      <header class="t-inv-kopf">
        <div>
          <h1>${esc(d.titel || 'Inventarliste')}</h1>
          ${ort ? `<p class="t-inv-ort">${esc(ort)}</p>` : ''}
          ${has(d.stand) ? `<p class="t-inv-stand">${esc(d.stand)}</p>` : ''}
        </div>
        <span class="t-inv-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
      </header>

      <ul class="t-inv-liste">
        <li class="t-inv-titel"><span class="t-inv-was">Gegenstand</span>
          <span class="t-inv-anz">Anzahl</span><span class="t-inv-zst">Zustand</span></li>
        ${zeilen}
      </ul>

      <footer class="t-inv-fuss">
        <div class="t-inv-sig"><span></span><i>Übergeber</i></div>
        <div class="t-inv-sig"><span></span><i>Übernehmer</i></div>
      </footer>
      <p class="t-inv-abs">${esc(abs.foot)}</p>`;
  }
};
