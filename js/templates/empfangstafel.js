/* Empfang-Tafel · A4 quer
   --------------------------------------------------------------------------
   Die Tafel an der Rezeption oder beim Eingang, die täglich wechselt: ein
   grosses «Willkommen», das Datum, und die drei, vier Dinge, die heute
   gelten — Frühstückszeit, WLAN, ein Anlass, ein Hinweis. Zum Ausdrucken und
   in den Rahmen stellen, oder mit Folienstift direkt beschreiben.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { absender, objekt, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'empfangstafel',
  title:'Empfang-Tafel',
  sub:'Willkommenstafel mit den Infos des Tages · A4 quer',
  badge:'Empfang',
  root:'t-emp',
  page:'a4-land',

  thumb: thumbLand(`
    <rect x="0" y="0" width="297" height="210" fill="#2A3350"/>
    <rect x="26" y="30" width="70" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="26" y="48" width="150" height="30" rx="6" fill="#fff"/>
    <rect x="26" y="88" width="90" height="8" rx="4" fill="#fff" opacity=".5"/>
    ${[0,1,2].map(i => `
      <rect x="${26 + i*84}" y="120" width="76" height="64" rx="6" fill="#fff" opacity=".1"/>
      <circle cx="${44 + i*84}" cy="140" r="9" fill="#01B1E2"/>
      <rect x="${60 + i*84}" y="135" width="30" height="8" rx="4" fill="#fff" opacity=".8"/>
      <rect x="${38 + i*84}" y="158" width="52" height="7" rx="3.5" fill="#fff" opacity=".5"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'datum',   label:'Datum / Zeile darunter', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Kacheln des Tages' },
    { k:'kacheln', label:'Kacheln', type:'list', itemLabel:'Kachel', max:4,
      defaultItem:{ icon:'cup', titel:'', text:'' },
      item:[
        { k:'icon',  label:'Symbol', type:'select', options:iconOptions },
        { k:'titel', label:'Titel',  type:'text' },
        { k:'text',  label:'Text',   type:'text' }
      ] },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Schön, dass Sie da sind',
    titel:'Willkommen',
    datum:'',
    objekt:'A14',
    kacheln:[
      { icon:'cup',   titel:'Frühstück', text:'07:30 – 10:00, Aufenthaltsraum' },
      { icon:'wifi',  titel:'WLAN', text:'Netz «Gast» · Code an der Rezeption' },
      { icon:'key',   titel:'Check-out', text:'bis 11:00' }
    ],
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);

    const kacheln = (d.kacheln || []).filter(k => has(k.titel) || has(k.text)).map(k => `
      <div class="t-emp-kachel">
        <span class="t-emp-ico">${icon(k.icon || 'info', 30, 1.8)}</span>
        <b>${esc(k.titel)}</b>
        ${has(k.text) ? `<span>${esc(k.text)}</span>` : ''}
      </div>`).join('');

    return `
      <div class="t-emp-tafel">
        <header class="t-emp-kopf">
          ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
          <h1>${esc(d.titel || '')}</h1>
          ${(has(d.datum) || (obj.name && obj.code)) ? `<p class="t-emp-datum">${
            esc([d.datum, obj.code && obj.name].filter(Boolean).join(' · '))}</p>` : ''}
        </header>
        <div class="t-emp-grid">${kacheln}</div>
        <footer class="t-emp-fuss">${
          istHotel(d.absender) ? logo('white', 22) : esc(abs.name)}</footer>
      </div>`;
  }
};
