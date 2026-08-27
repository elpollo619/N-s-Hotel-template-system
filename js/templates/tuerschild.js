/* Türschild · A5 quer
   --------------------------------------------------------------------------
   Das einzelne Schild an der Zimmertür im Büro oder Betrieb: «Büro»,
   «Sitzungszimmer», «Lager», «WC», «Privat». Ein Symbol, ein Wort, ruhig und
   gross. Nicht zu verwechseln mit dem Zimmerschild (Hotelzimmer-Nummern in
   Serie) oder den Klingelschildern (Namen am Eingang).
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { absender, istHotel, absenderOptions } from '../objekte.js';

const TUERSCHILD_TON = { navy:'#2A3350', cyan:'#01B1E2', weiss:'#FFFFFF' };

export default {
  id:'tuerschild',
  title:'Türschild',
  sub:'Ein einzelner Raum — Büro, WC, Lager. Für Hotelzimmer in Serie das Zimmerschild · A5 quer',
  badge:'Beschriften',
  root:'t-tsc',
  page:'a5-land',
  fern:true,

  thumb: thumbLand(`
    <rect x="0" y="0" width="297" height="210" fill="#2A3350"/>
    <circle cx="90" cy="105" r="40" fill="none" stroke="#01B1E2" stroke-width="4"/>
    <rect x="150" y="86" width="110" height="24" rx="6" fill="#fff"/>
    <rect x="150" y="120" width="70" height="10" rx="5" fill="#01B1E2"/>`),

  fields:[
    { t:'group', label:'Schild' },
    { k:'text', label:'Beschriftung', type:'text' },
    { k:'unter', label:'Untertitel', type:'text' },
    { k:'icon', label:'Symbol', type:'select', options:iconOptions },

    { t:'group', label:'Aussehen' },
    { k:'ton', label:'Farbe', type:'select', options:[
      { v:'navy', t:'Navy — dunkel' }, { v:'cyan', t:'Cyan' }, { v:'weiss', t:'Weiss — dezent' } ] },
    { k:'ausrichtung', label:'Ausrichtung', type:'select', options:[
      { v:'mitte', t:'zentriert' }, { v:'links', t:'linksbündig' } ] },
    { k:'symbolAn', label:'Symbol zeigen', type:'select', options:[
      { v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen — nur Text' } ] },

    { t:'group', label:'Marke' },
    { k:'markeAn', label:'Marke unten', type:'select', options:[
      { v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' } ] },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    text:'Büro',
    unter:'',
    icon:'stift',
    ton:'navy',
    ausrichtung:'mitte',
    symbolAn:'ja',
    markeAn:'ja',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const ton = TUERSCHILD_TON[d.ton] || TUERSCHILD_TON.navy;
    const hell = d.ton === 'weiss';
    const vordergrund = hell ? '#2A3350' : '#fff';
    const akzent = hell ? '#01B1E2' : '#01B1E2';

    return `
      <div class="t-tsc-schild is-${esc(d.ausrichtung || 'mitte')}${hell ? ' is-hell' : ''}"
        style="--ton:${ton};--vg:${vordergrund};--akz:${akzent}">
        ${d.symbolAn !== 'nein' ? `<span class="t-tsc-ico">${icon(d.icon || 'info', 96, 1.7)}</span>` : ''}
        <div class="t-tsc-text">
          <p class="t-tsc-haupt">${esc(d.text || '')}</p>
          ${has(d.unter) ? `<p class="t-tsc-unter">${esc(d.unter)}</p>` : ''}
        </div>
        ${d.markeAn === 'ja' ? `<div class="t-tsc-marke">${
          istHotel(d.absender) ? logo(hell ? 'color' : 'white', 20) : esc(abs.name)}</div>` : ''}
      </div>`;
  }
};
