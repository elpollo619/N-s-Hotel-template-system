/* Parkplatz-Info · mehrsprachig mit Lageplan, A4 hoch.
   Portiert aus "Parkplatz-Info - Mehrsprachig.html". */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { siteMap } from '../lib/sitemap.js';
import { thumb } from '../lib/thumbs.js';
import { BRAND, addressLine } from '../brand-config.js';

export default {
  id:'parkplatz',
  title:'Parkplatz-Info',
  sub:'Lageplan und Text in vier Sprachen · A4 hoch',
  badge:'Anfahrt',
  badgeCyan:true,
  page:'a4',
  root:'t-parkplatz',
  thumb: thumb(`
    <rect x="18" y="16" width="86" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="18" y="32" width="150" height="14" rx="4" fill="#2A3350"/>
    <rect x="18" y="58" width="174" height="112" rx="7" fill="#EEF0F4"/>
    <rect x="18" y="140" width="174" height="16" fill="#DCE1EA"/>
    <rect x="62" y="58" width="14" height="98" fill="#DCE1EA"/>
    <rect x="86" y="76" width="62" height="42" rx="3" fill="#B7D900" stroke="#8FA800" stroke-width="1.4"/>
    <rect x="152" y="86" width="34" height="30" rx="3" fill="#FCE7F0" stroke="#E5387E" stroke-width="1.4"/>
    <path d="M110 128 c-14 12 -26 8 -34 2" stroke="#12A150" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 6" fill="none"/>
    <circle cx="118" cy="120" r="7" fill="#2A3350"/><circle cx="168" cy="118" r="7" fill="#01B1E2"/>
    <rect x="18" y="182" width="52" height="14" rx="7" fill="#E7F7FC"/>
    <rect x="76" y="182" width="52" height="14" rx="7" fill="#E7F6EE"/>
    ${[0,1].map(r => [0,1].map(c => `<rect x="${18 + c * 90}" y="${210 + r * 34}" width="84" height="28" rx="4" fill="#F6F7FA"/>
      <rect x="${24 + c * 90}" y="${216 + r * 34}" width="26" height="5" rx="2.5" fill="#01B1E2"/>
      <rect x="${24 + c * 90}" y="${226 + r * 34}" width="66" height="4" rx="2" fill="#C9CFDA"/>`).join('')).join('')}
    <rect x="18" y="284" width="174" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },
    { k:'bare',    label:'Ansicht', type:'select', options:[
      { v:'nein', t:'Komplettes Blatt' }, { v:'ja', t:'Nur der Lageplan' } ],
      hint:'"Nur der Lageplan" eignet sich zum Einbetten oder als Bild.' },

    { t:'group', label:'Lageplan' },
    { k:'strasseH', label:'Strasse waagrecht', type:'text' },
    { k:'strasseV', label:'Strasse senkrecht', type:'text' },
    { k:'hotel',    label:'Beschriftung Gebäude', type:'text' },
    { k:'parkplatz',label:'Beschriftung Gästeparkplatz', type:'text' },
    { k:'publik',   label:'Beschriftung öffentliches Parking', type:'text' },
    { k:'showPublik', label:'Öffentliches Parking zeigen', type:'select',
      options:[{ v:'ja', t:'ja' }, { v:'nein', t:'nein' }] },

    { t:'group', label:'Wege und Zeiten' },
    { k:'carMin',  label:'Anfahrt mit dem Auto', type:'text' },
    { k:'walkMin', label:'Fussweg Parkplatz — Eingang', type:'text' },
    { k:'adresse', label:'Adresse für das Navi', type:'text' },

    { t:'group', label:'Texte in vier Sprachen' },
    { k:'textDe', label:'Deutsch', type:'textarea', rows:3 },
    { k:'textEn', label:'English', type:'textarea', rows:3 },
    { k:'textFr', label:'Français', type:'textarea', rows:3 },
    { k:'textIt', label:'Italiano', type:'textarea', rows:3 },

    { t:'group', label:'Fusszeile' },
    { k:'footer', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    eyebrow:'So finden Sie uns',
    title:'Parkieren beim N’s Hotel',
    sub:'Gästeparkplatz direkt beim Haus · Guest parking right next to the building',
    bare:'nein',
    strasseH:'Bahnhofstrasse', strasseV:'Seelandstrasse',
    hotel:"N's Hotel", parkplatz:'Gästeparkplatz', publik:'Öffentliches Parking',
    showPublik:'ja',
    carMin:'2 Minuten ab Dorfeingang',
    walkMin:'1 Minute zu Fuss zum Eingang',
    adresse: BRAND.street + ', ' + BRAND.zip + ' ' + BRAND.city,
    textDe:'Unsere Gästeparkplätze sind rosa markiert und stehen Ihnen während des ganzen Aufenthalts kostenlos zur Verfügung. Legen Sie bitte die Parkkarte der Rezeption gut sichtbar hinter die Frontscheibe.',
    textEn:'Our guest parking spaces are marked in pink and are free of charge throughout your stay. Please place the parking card from reception clearly visible behind your windscreen.',
    textFr:'Nos places pour les hôtes sont marquées en rose et sont gratuites pendant tout votre séjour. Merci de placer la carte de parking de la réception derrière le pare-brise.',
    textIt:'I nostri posteggi per gli ospiti sono segnati in rosa e sono gratuiti per tutto il soggiorno. Vi preghiamo di esporre la carta di parcheggio della reception dietro il parabrezza.',
    footer: addressLine() + ' · ' + BRAND.phone
  },

  render(d){
    const map = siteMap({
      strasseH:d.strasseH, strasseV:d.strasseV, hotel:d.hotel,
      parkplatz:d.parkplatz, publik:d.publik,
      showPublik:d.showPublik !== 'nein'
    });

    if (d.bare === 'ja'){
      return `<div class="t-park-bare">${map}</div>`;
    }

    const langs = [
      { code:'DE', name:'Deutsch',   text:d.textDe },
      { code:'EN', name:'English',   text:d.textEn },
      { code:'FR', name:'Français',  text:d.textFr },
      { code:'IT', name:'Italiano',  text:d.textIt }
    ].filter(l => has(l.text));

    return `
    <div class="t-park-mast">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-park-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-park-sub">${esc(d.sub)}</p>` : ''}
      </div>
      <div class="t-park-logo">${logo('color', 38)}</div>
    </div>

    <div class="t-park-map">${map}</div>

    <div class="t-park-legend">
      <span class="t-park-key"><i class="k-lime"></i>${esc(d.hotel)}</span>
      <span class="t-park-key"><i class="k-pink"></i>${esc(d.parkplatz)}</span>
      ${d.showPublik !== 'nein' ? `<span class="t-park-key"><i class="k-purple"></i>${esc(d.publik)}</span>` : ''}
      <span class="t-park-key"><i class="k-walk"></i>Fussweg · on foot</span>
      <span class="t-park-key"><i class="k-car"></i>Zufahrt · by car</span>
    </div>

    <div class="t-park-chips">
      ${has(d.carMin)  ? `<span class="t-park-chip">${icon('car', 18)}${esc(d.carMin)}</span>` : ''}
      ${has(d.walkMin) ? `<span class="t-park-chip t-park-chip--green">${icon('walk', 18)}${esc(d.walkMin)}</span>` : ''}
      ${has(d.adresse) ? `<span class="t-park-chip t-park-chip--navy">${icon('flag', 18)}${esc(d.adresse)}</span>` : ''}
    </div>

    <div class="t-park-langs">
      ${langs.map(l => `<div class="t-park-lang">
        <span class="t-park-code">${esc(l.code)}<em>${esc(l.name)}</em></span>
        <p>${fmt(l.text)}</p>
      </div>`).join('')}
    </div>

    ${has(d.footer) ? `<p class="t-park-addr">${esc(d.footer)}</p>` : ''}`;
  }
};
