/* Gäste-Info · universeller Aushang, A4 hoch.
   Für alles, wofür es keine eigene Vorlage gibt: WLAN, Frühstück,
   Hausordnung, Öffnungszeiten … immer zweisprachig DE/EN. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { BRAND, addressLine } from '../brand-config.js';

export default {
  id:'aushang',
  title:'Gäste-Info (universell)',
  sub:'Beliebiger Aushang mit Infozeilen · A4 hoch',
  badge:'Aushang',
  page:'a4',
  root:'t-aushang',
  thumb: thumb(`
    <rect x="18" y="16" width="80" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="18" y="32" width="140" height="14" rx="4" fill="#2A3350"/>
    <rect x="18" y="56" width="174" height="46" rx="6" fill="#CFEFFA"/>
    <path d="M18 90 l32 -22 26 18 20 -13 40 27 v2 h-118 z" fill="#01B1E2" opacity=".55"/>
    <circle cx="150" cy="72" r="8" fill="#fff" opacity=".85"/>
    ${lines(18, 112, 78, 3)}${lines(114, 112, 78, 3)}
    ${[0,1,2,3].map(i => `<rect x="18" y="${146 + i * 26}" width="174" height="20" rx="5" fill="#F6F7FA"/>
      <circle cx="30" cy="${156 + i * 26}" r="6" fill="#01B1E2"/>
      <rect x="42" y="${152 + i * 26}" width="70" height="6" rx="3" fill="#2A3350"/>
      <rect x="42" y="${161 + i * 26}" width="48" height="4" rx="2" fill="#C9CFDA"/>
      <rect x="150" y="${153 + i * 26}" width="34" height="7" rx="3.5" fill="#2A3350"/>`).join('')}
    ${lines(18, 262, 174, 1, 8, '#E5E8ED')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },

    { t:'group', label:'Bild' },
    { k:'img', label:'Bild (optional)', type:'image',
      hint:'Querformat wirkt am besten. Wird auf die volle Breite zugeschnitten.' },
    { k:'imgHoehe', label:'Bildhöhe in mm', type:'number', min:0, max:110, step:2 },

    { t:'group', label:'Einleitung' },
    { k:'introDe', label:'Text DE', type:'textarea', hint:'**fett** möglich' },
    { k:'introEn', label:'Text EN', type:'textarea' },

    { t:'group', label:'Infozeilen' },
    { k:'rows', label:'Zeilen', type:'list', itemLabel:'Zeile', max:9,
      defaultItem:{ icon:'info', de:'', en:'', val:'' },
      item:[
        { k:'icon', label:'Symbol', type:'select', options:iconOptions() },
        { k:'de',   label:'Text DE', type:'text' },
        { k:'en',   label:'Text EN', type:'text' },
        { k:'val',  label:'Wert rechts', type:'text' }
      ] },

    { t:'group', label:'Fusszeile' },
    { k:'noteDe', label:'Hinweis DE', type:'textarea' },
    { k:'noteEn', label:'Hinweis EN', type:'textarea' },
    { k:'footer', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    eyebrow:'Schön, sind Sie da',
    title:'Gut zu wissen',
    sub:'Das Wichtigste für Ihren Aufenthalt · Good to know during your stay',
    img:'', imgHoehe:0,
    introDe:'Damit Sie sich rundum wohlfühlen, haben wir das Wichtigste kurz zusammengefasst. Bei Fragen ist die Rezeption jederzeit für Sie da.',
    introEn:'To help you settle in, here is everything you need at a glance. If anything is unclear, reception is always happy to help.',
    rows:[
      { icon:'wifi',  de:'WLAN · Netzwerk', en:'Wi-Fi network', val:'NsHotel-Gast' },
      { icon:'key',   de:'WLAN · Passwort', en:'Wi-Fi password', val:'kerzers2024' },
      { icon:'cup',   de:'Frühstück im Restaurant', en:'Breakfast in the restaurant', val:'07.00 – 10.00' },
      { icon:'clock', de:'Check-out', en:'Check-out', val:'bis 11.00' },
      { icon:'phone', de:'Rezeption vom Zimmer aus', en:'Reception from your room', val:'Taste 1' },
      { icon:'smoke', de:'Rauchen nur im Aussenbereich', en:'Smoking outside only', val:'' }
    ],
    noteDe:'Wir wünschen Ihnen einen angenehmen Aufenthalt.',
    noteEn:'We wish you a pleasant stay.',
    footer: addressLine() + ' · ' + BRAND.phone + ' · ' + BRAND.web
  },

  render(d){
    const rows = (d.rows || []).filter(r => has(r.de) || has(r.en) || has(r.val));
    const list = rows.map(r => `
      <div class="t-aushang-row">
        <span class="t-aushang-ico">${icon(r.icon || 'info', 22, 1.9)}</span>
        <span class="t-aushang-lbl">
          ${has(r.de) ? `<b>${esc(r.de)}</b>` : ''}
          ${has(r.en) ? `<i>${esc(r.en)}</i>` : ''}
        </span>
        ${has(r.val) ? `<span class="t-aushang-val">${esc(r.val)}</span>` : ''}
      </div>`).join('');

    const imgH = Number(d.imgHoehe) || 0;
    const image = (has(d.img) && imgH > 0)
      ? `<div class="t-aushang-img" style="height:${imgH}mm"><img src="${esc(d.img)}" alt=""></div>` : '';

    return `
    <div class="t-aushang-mast">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-aushang-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-aushang-sub">${esc(d.sub)}</p>` : ''}
      </div>
      <div class="t-aushang-logo">${logo('color', 38)}</div>
    </div>
    ${image}
    ${(has(d.introDe) || has(d.introEn)) ? `<div class="t-aushang-intro">
      ${has(d.introDe) ? `<p lang="de">${fmt(d.introDe)}</p>` : ''}
      ${has(d.introEn) ? `<p lang="en">${fmt(d.introEn)}</p>` : ''}
    </div>` : ''}
    <div class="t-aushang-list">${list}</div>
    <div class="t-aushang-foot">
      ${(has(d.noteDe) || has(d.noteEn)) ? `<div class="t-aushang-note">
        ${has(d.noteDe) ? `<p lang="de">${fmt(d.noteDe)}</p>` : ''}
        ${has(d.noteEn) ? `<p lang="en">${fmt(d.noteEn)}</p>` : ''}
      </div>` : ''}
      ${has(d.footer) ? `<p class="t-aushang-addr">${esc(d.footer)}</p>` : ''}
    </div>`;
  }
};
