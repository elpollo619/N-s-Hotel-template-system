/* Anfahrt und Parken · Orientierungskarte, A4 quer.
   Portiert aus "Anfahrt & Parken - Orientierungskarte.html". */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { siteMap } from '../lib/sitemap.js';
import { thumbLand } from '../lib/thumbs.js';
import { BRAND, contactLine } from '../brand-config.js';

export default {
  id:'anfahrt-karte',
  title:'Orientierungskarte',
  sub:'Schneller Start mit fertig gezeichnetem Plan — ohne eigenes Bild · A4 quer',
  badge:'Anfahrt',
  badgeCyan:true,
  page:'a4-land',
  root:'t-anfahrt',
  thumb: thumbLand(`
    <rect x="14" y="14" width="104" height="8" rx="4" fill="#01B1E2"/>
    <rect x="14" y="30" width="96" height="12" rx="4" fill="#2A3350"/>
    ${[0,1,2].map(i => `<rect x="14" y="${58 + i * 26}" width="104" height="20" rx="5" fill="#F6F7FA"/>
      <circle cx="26" cy="${68 + i * 26}" r="6" fill="#01B1E2"/>
      <rect x="38" y="${64 + i * 26}" width="56" height="5" rx="2.5" fill="#2A3350"/>
      <rect x="38" y="${72 + i * 26}" width="40" height="4" rx="2" fill="#C9CFDA"/>`).join('')}
    <rect x="14" y="146" width="104" height="16" rx="8" fill="#2A3350"/>
    <rect x="132" y="14" width="151" height="148" rx="7" fill="#EEF0F4"/>
    <rect x="132" y="128" width="151" height="18" fill="#DCE1EA"/>
    <rect x="176" y="14" width="14" height="132" fill="#DCE1EA"/>
    <rect x="200" y="48" width="54" height="40" rx="3" fill="#B7D900" stroke="#8FA800" stroke-width="1.4"/>
    <rect x="256" y="60" width="24" height="30" rx="3" fill="#FCE7F0" stroke="#E5387E" stroke-width="1.4"/>
    <circle cx="226" cy="96" r="7" fill="#2A3350"/><circle cx="268" cy="76" r="7" fill="#01B1E2"/>
    <rect x="14" y="176" width="269" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },
    { k:'adresse', label:'Adresse für das Navi', type:'text' },

    { t:'group', label:'Anfahrtswege' },
    { k:'routes', label:'Wege', type:'list', itemLabel:'Weg', max:6,
      defaultItem:{ icon:'car', de:'', en:'' },
      item:[
        { k:'icon', label:'Symbol', type:'select', options:iconOptions() },
        { k:'de',   label:'Text DE', type:'text' },
        { k:'en',   label:'Text EN', type:'text' }
      ] },

    { t:'group', label:'Lageplan' },
    { k:'strasseH', label:'Strasse waagrecht', type:'text' },
    { k:'strasseV', label:'Strasse senkrecht', type:'text' },
    { k:'hotel',    label:'Beschriftung Gebäude', type:'text' },
    { k:'parkplatz',label:'Beschriftung Gästeparkplatz', type:'text' },
    { k:'publik',   label:'Beschriftung öffentliches Parking', type:'text' },
    { k:'showPublik', label:'Öffentliches Parking zeigen', type:'select',
      options:[{ v:'ja', t:'ja' }, { v:'nein', t:'nein' }] },

    { t:'group', label:'Fusszeile' },
    { k:'footer', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    eyebrow:'So finden Sie uns',
    title:'Anfahrt und Parken',
    sub:'Getting here and parking',
    adresse: BRAND.street + ', ' + BRAND.zip + ' ' + BRAND.city,
    routes:[
      { icon:'car',     de:'Von Bern über die A1, Ausfahrt Kerzers — danach der Bahnhofstrasse folgen.', en:'From Bern via the A1, exit Kerzers, then follow Bahnhofstrasse.' },
      { icon:'car',     de:'Von Murten und Fribourg der Hauptstrasse bis ins Dorfzentrum folgen.', en:'From Murten and Fribourg follow the main road into the village centre.' },
      { icon:'luggage', de:'Mit dem Zug bis Bahnhof Kerzers, danach 5 Minuten zu Fuss.', en:'By train to Kerzers station, then a 5 minute walk.' },
      { icon:'parking', de:'Gästeparkplätze sind rosa markiert und kostenlos.', en:'Guest parking spaces are marked in pink and free of charge.' }
    ],
    strasseH:'Bahnhofstrasse', strasseV:'Seelandstrasse',
    hotel:"N's Hotel", parkplatz:'Gästeparkplatz', publik:'Öffentliches Parking',
    showPublik:'ja',
    footer: contactLine()
  },

  render(d){
    const routes = (d.routes || []).filter(r => has(r.de) || has(r.en));
    return `
    <div class="t-anfahrt-grid">
      <div class="t-anfahrt-col">
        <div class="t-anfahrt-mast">
          ${has(d.eyebrow) ? `<p class="eyebrow t-anfahrt-eyebrow">${esc(d.eyebrow)}</p>` : ''}
          <h1>${esc(d.title)}</h1>
          ${has(d.sub) ? `<p class="t-anfahrt-sub">${esc(d.sub)}</p>` : ''}
        </div>
        <div class="t-anfahrt-routes">
          ${routes.map(r => `<div class="t-anfahrt-route">
            <span class="t-anfahrt-ico">${icon(r.icon || 'car', 20, 1.9)}</span>
            <span>
              ${has(r.de) ? `<b>${esc(r.de)}</b>` : ''}
              ${has(r.en) ? `<i>${esc(r.en)}</i>` : ''}
            </span>
          </div>`).join('')}
        </div>
        ${has(d.adresse) ? `<div class="t-anfahrt-nav">${icon('flag', 18)}<span>${esc(d.adresse)}</span></div>` : ''}
        <div class="t-anfahrt-logo">${logo('color', 34)}</div>
      </div>

      <div class="t-anfahrt-mapcol">
        <div class="t-anfahrt-map">${siteMap({
          strasseH:d.strasseH, strasseV:d.strasseV, hotel:d.hotel,
          parkplatz:d.parkplatz, publik:d.publik,
          showPublik:d.showPublik !== 'nein'
        })}</div>
        <div class="t-park-legend">
          <span class="t-park-key"><i class="k-lime"></i>${esc(d.hotel)}</span>
          <span class="t-park-key"><i class="k-pink"></i>${esc(d.parkplatz)}</span>
          ${d.showPublik !== 'nein' ? `<span class="t-park-key"><i class="k-purple"></i>${esc(d.publik)}</span>` : ''}
          <span class="t-park-key"><i class="k-walk"></i>Fussweg · on foot</span>
          <span class="t-park-key"><i class="k-car"></i>Zufahrt · by car</span>
        </div>
      </div>
    </div>
    ${has(d.footer) ? `<p class="t-anfahrt-addr">${esc(d.footer)}</p>` : ''}`;
  }
};
