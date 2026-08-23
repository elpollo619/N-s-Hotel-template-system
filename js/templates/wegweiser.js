/* Wegweiser · A4 hoch
   --------------------------------------------------------------------------
   Die Orientierungstafel im Eingang: mehrere Ziele mit Pfeil und Symbol
   untereinander. Rezeption →, Lift ←, Frühstück ↑, WC ↓. Ein Blick, und man
   weiss, wohin. Dunkler Grund wie eine Flughafentafel, damit die weissen
   Pfeile aus der Distanz tragen.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, istHotel, absenderOptions } from '../objekte.js';

const WEG_PFEILE = { rechts:'arrowR', links:'arrowL', hoch:'arrowU', runter:'arrowD', kein:'' };

export default {
  id:'wegweiser',
  title:'Wegweiser',
  sub:'Orientierungstafel mit mehreren Zielen und Pfeilen · A4 hoch',
  badge:'Wegweiser',
  root:'t-weg',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="297" fill="#2A3350"/>
    <rect x="24" y="28" width="120" height="14" rx="5" fill="#01B1E2"/>
    ${[0,1,2,3,4].map(i => `
      <circle cx="40" cy="${84 + i*40}" r="12" fill="none" stroke="#fff" stroke-width="2.4" opacity=".85"/>
      <rect x="62" y="${77 + i*40}" width="${90 - (i%3)*14}" height="12" rx="5" fill="#fff" opacity=".92"/>
      <path d="M176 ${84 + i*40}h14M184 ${77 + i*40}l8 7-8 7" stroke="#01B1E2" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'titel', label:'Titel', type:'text' },

    { t:'group', label:'Ziele' },
    { k:'ziele', label:'Ziele', type:'list', itemLabel:'Ziel', max:10,
      defaultItem:{ icon:'reception', text:'', pfeil:'rechts' },
      item:[
        { k:'icon',  label:'Symbol', type:'select', options:[
          { v:'reception', t:'Rezeption' }, { v:'lift', t:'Lift' }, { v:'stairs', t:'Treppe' },
          { v:'cup', t:'Frühstück' }, { v:'toilet', t:'WC' }, { v:'car', t:'Parkplatz' },
          { v:'luggage', t:'Gepäck' }, { v:'waesche', t:'Waschküche' }, { v:'exit', t:'Ausgang' },
          { v:'bed', t:'Zimmer' }, { v:'info', t:'Info' } ] },
        { k:'text',  label:'Ziel', type:'text' },
        { k:'pfeil', label:'Pfeil', type:'select', options:[
          { v:'rechts', t:'→' }, { v:'links', t:'←' }, { v:'hoch', t:'↑' },
          { v:'runter', t:'↓' }, { v:'kein', t:'kein' } ] }
      ] },

    { t:'group', label:'Absender' },
    { k:'markeAn', label:'Marke unten', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Willkommen',
    ziele:[
      { icon:'reception', text:'Rezeption', pfeil:'hoch' },
      { icon:'lift', text:'Lift und Zimmer', pfeil:'rechts' },
      { icon:'cup', text:'Frühstück', pfeil:'rechts' },
      { icon:'toilet', text:'WC', pfeil:'links' },
      { icon:'car', text:'Parkplatz', pfeil:'runter' }
    ],
    markeAn:'ja',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const ziele = (d.ziele || []).filter(z => has(z.text)).map(z => {
      const pf = WEG_PFEILE[z.pfeil] || '';
      return `
      <li>
        <span class="t-weg-ico">${icon(z.icon || 'info', 34, 1.8)}</span>
        <span class="t-weg-text">${esc(z.text)}</span>
        <span class="t-weg-pfeil">${pf ? icon(pf, 40, 2.4) : ''}</span>
      </li>`;
    }).join('');

    return `
      <div class="t-weg-tafel">
        ${has(d.titel) ? `<h1 class="t-weg-titel">${esc(d.titel)}</h1>` : ''}
        <ul class="t-weg-liste">${ziele}</ul>
        ${d.markeAn === 'ja' ? `<div class="t-weg-fuss">${
          istHotel(d.absender) ? logo('white', 24) : esc(abs.name)}</div>` : ''}
      </div>`;
  }
};
