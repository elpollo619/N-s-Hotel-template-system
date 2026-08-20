/* Anfahrt und Parken · Luftbild mit gesetzten Pins, A4 quer.
   Portiert aus "Anfahrt & Parken - Luftbild.html".
   Das Luftbild (swisstopo) wird hochgeladen oder in brand-config.js hinterlegt. */
import { esc, has } from '../lib/dom.js';
import { logo, pin } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { BRAND, contactLine } from '../brand-config.js';

function marker(kind, x, y, label){
  return `<div class="t-luft-pin" style="left:${x}%;top:${y}%">
    <svg viewBox="-60 -110 120 130">${pin(kind, 0, 0, 0.9)}</svg>
    ${has(label) ? `<span class="t-luft-plabel">${esc(label)}</span>` : ''}
  </div>`;
}

export default {
  id:'anfahrt-luftbild',
  title:'Luftbild mit Pins',
  sub:'Eigenes Luftbild, Pins frei platzierbar · A4 quer',
  badge:'Anfahrt',
  badgeCyan:true,
  page:'a4-land',
  root:'t-luftbild',
  thumb: thumbLand(`
    <rect x="14" y="14" width="269" height="140" rx="7" fill="#DDE3D8"/>
    <path d="M14 96 h269 v18 h-269 z" fill="#C9D0C4"/>
    <rect x="80" y="44" width="72" height="40" rx="3" fill="#B9C3B2"/>
    <rect x="176" y="52" width="46" height="32" rx="3" fill="#C4CCBE"/>
    <circle cx="116" cy="88" r="9" fill="#2A3350"/><circle cx="200" cy="80" r="9" fill="#01B1E2"/>
    <rect x="14" y="166" width="120" height="8" rx="4" fill="#2A3350"/>
    <rect x="14" y="182" width="180" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Luftbild' },
    { k:'img', label:'Bild', type:'image',
      hint:'Querformat, z. B. der Ausschnitt aus swisstopo. Wird auf das Blatt zugeschnitten.' },

    { t:'group', label:'Pin N’s Hotel' },
    { k:'nsX', label:'Position von links in %', type:'number', min:0, max:100, step:1 },
    { k:'nsY', label:'Position von oben in %',  type:'number', min:0, max:100, step:1 },
    { k:'nsLabel', label:'Beschriftung', type:'text' },

    { t:'group', label:'Pin Parkplatz' },
    { k:'pX', label:'Position von links in %', type:'number', min:0, max:100, step:1 },
    { k:'pY', label:'Position von oben in %',  type:'number', min:0, max:100, step:1 },
    { k:'pLabel', label:'Beschriftung', type:'text' },
    { k:'showP', label:'Parkplatz-Pin zeigen', type:'select',
      options:[{ v:'ja', t:'ja' }, { v:'nein', t:'nein' }] },

    { t:'group', label:'Text' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },
    { k:'adresse', label:'Adresse für das Navi', type:'text' },
    { k:'footer',  label:'Adresszeile', type:'text' }
  ],

  defaults:{
    img: BRAND.aerial || '',
    nsX:42, nsY:56, nsLabel:"N's Hotel",
    pX:64, pY:48, pLabel:'Gästeparkplatz', showP:'ja',
    eyebrow:'So finden Sie uns',
    title:'Anfahrt und Parken',
    sub:'Luftbild mit Eingang und Gästeparkplatz · Aerial view with entrance and guest parking',
    adresse: BRAND.street + ', ' + BRAND.zip + ' ' + BRAND.city,
    footer: contactLine()
  },

  render(d){
    const img = has(d.img)
      ? `<img class="t-luft-img" src="${esc(d.img)}" alt="">`
      : `<div class="t-luft-empty">
           <b>Noch kein Luftbild</b>
           <span>Links im Feld «Bild» eine Aufnahme hochladen — zum Beispiel den
           Ausschnitt aus swisstopo (assets/img/aerial-site.png).</span>
         </div>`;

    // Ohne Bild keine Pins — sonst schweben sie über dem Hinweistext.
    const pins = has(d.img)
      ? marker('ns', Number(d.nsX) || 0, Number(d.nsY) || 0, d.nsLabel) +
        (d.showP !== 'nein' ? marker('p', Number(d.pX) || 0, Number(d.pY) || 0, d.pLabel) : '')
      : '';

    return `
    <div class="t-luft-canvas">
      ${img}
      ${pins}
      <div class="t-luft-card">
        ${has(d.eyebrow) ? `<p class="eyebrow t-luft-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-luft-sub">${esc(d.sub)}</p>` : ''}
        ${has(d.adresse) ? `<div class="t-luft-nav">${icon('flag', 18)}<span>${esc(d.adresse)}</span></div>` : ''}
        <div class="t-luft-logo">${logo('color', 32)}</div>
      </div>
      ${has(d.footer) ? `<p class="t-luft-addr">${esc(d.footer)}</p>` : ''}
    </div>`;
  }
};
