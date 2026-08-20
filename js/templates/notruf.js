/* Notruf-Aushang · Tastenbelegung am Check-in-Telefon · A4 hoch
   Portiert aus "Telefon Tastenbelegung - Notruf-Aushang v6.html". */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb, lines } from '../lib/thumbs.js';
import { BRAND, addressLine } from '../brand-config.js';

/* ---- Telefon-Illustration (Yealink-Tischtelefon, Frontansicht) ---------- */
function phoneSvg(keyCount){
  const pad = [];
  const digits = ['1','2','3','4','5','6','7','8','9','*','0','#'];
  for (let i = 0; i < 12; i++){
    const c = i % 3, r = (i / 3) | 0;
    const x = 96 + c * 46, y = 176 + r * 27;
    pad.push(`<rect x="${x}" y="${y}" width="38" height="20" rx="6" class="pk"/>
      <text x="${x + 19}" y="${y + 14.5}" text-anchor="middle" class="pd">${digits[i]}</text>`);
  }
  const lineKeys = [];
  for (let i = 0; i < keyCount; i++){
    const y = 44 + i * 21;
    lineKeys.push(`<rect x="228" y="${y}" width="64" height="15" rx="4" class="lk"/>
      <circle cx="238" cy="${y + 7.5}" r="5.4" class="lkdot"/>
      <text x="238" y="${y + 10.2}" text-anchor="middle" class="lknum">${i + 1}</text>
      <rect x="248" y="${y + 5}" width="36" height="5" rx="2.5" class="lkbar"/>`);
  }
  return `<svg class="t-notruf-phone" viewBox="0 0 320 300" role="img"
      aria-label="Tischtelefon mit vier programmierten Tasten">
    <!-- Hörer -->
    <rect x="12" y="52" width="38" height="196" rx="19" class="ph-hs"/>
    <rect x="4"  y="52" width="54" height="46" rx="16" class="ph-hs"/>
    <rect x="4"  y="202" width="54" height="46" rx="16" class="ph-hs"/>
    <!-- Korpus -->
    <rect x="66" y="18" width="240" height="264" rx="20" class="ph-body"/>
    <rect x="66" y="18" width="240" height="264" rx="20" class="ph-edge"/>
    <!-- Display -->
    <rect x="84" y="36" width="132" height="76" rx="7" class="ph-screen"/>
    <rect x="94" y="48" width="60" height="7" rx="3.5" class="ph-scr-a"/>
    <rect x="94" y="64" width="94" height="6" rx="3" class="ph-scr-b"/>
    <rect x="94" y="78" width="72" height="6" rx="3" class="ph-scr-b"/>
    <rect x="94" y="94" width="52" height="6" rx="3" class="ph-scr-b"/>
    <!-- programmierte Tasten -->
    ${lineKeys.join('')}
    <!-- Navigationskreis -->
    <circle cx="150" cy="146" r="27" class="ph-nav"/>
    <circle cx="150" cy="146" r="12" class="ph-ok"/>
    <text x="150" y="150" text-anchor="middle" class="ph-oktxt">OK</text>
    <rect x="196" y="128" width="34" height="16" rx="8" class="pk"/>
    <rect x="196" y="150" width="34" height="16" rx="8" class="pk"/>
    <rect x="70"  y="128" width="34" height="16" rx="8" class="pk"/>
    <rect x="70"  y="150" width="34" height="16" rx="8" class="pk"/>
    <!-- Wähltastatur -->
    ${pad.join('')}
  </svg>`;
}

export default {
  id:'notruf',
  title:'Notruf-Aushang (Telefon)',
  sub:'Tastenbelegung am Check-in-Telefon · A4 hoch',
  badge:'Aushang',
  page:'a4',
  root:'t-notruf',
  thumb: thumb(`
    <rect x="18" y="16" width="96" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="18" y="32" width="150" height="15" rx="4" fill="#2A3350"/>
    ${lines(18, 56, 78, 3)}${lines(114, 56, 78, 3)}
    <rect x="18" y="92" width="80" height="104" rx="9" fill="#F6F7FA" stroke="#D8DDE6"/>
    <rect x="28" y="102" width="46" height="26" rx="4" fill="#2A3350"/>
    <rect x="80" y="104" width="22" height="8" rx="3" fill="#01B1E2"/>
    <rect x="80" y="116" width="22" height="8" rx="3" fill="#01B1E2"/>
    <rect x="80" y="128" width="22" height="8" rx="3" fill="#01B1E2"/>
    ${[0,1,2,3].map(i => `<rect x="112" y="${92 + i * 27}" width="80" height="21" rx="5" fill="#F6F7FA" stroke="#E5E8ED"/>
      <rect x="117" y="${97 + i * 27}" width="11" height="11" rx="3" fill="#01B1E2"/>
      <rect x="133" y="${99 + i * 27}" width="42" height="6" rx="3" fill="#C9CFDA"/>`).join('')}
    <rect x="18" y="212" width="174" height="34" rx="8" fill="#E23A2E"/>
    <rect x="30" y="224" width="34" height="12" rx="4" fill="#fff"/>
    ${lines(18, 260, 174, 2, 8, '#E5E8ED')}
  `),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },
    { k:'ledeDe',  label:'Einleitung DE', type:'textarea', hint:'**fett** und Zeilenumbrüche möglich' },
    { k:'ledeEn',  label:'Einleitung EN', type:'textarea' },

    { t:'group', label:'Tastenbelegung' },
    { k:'keys', label:'Tasten', type:'list', itemLabel:'Taste', max:6,
      defaultItem:{ de:'', en:'', nr:'' },
      item:[
        { k:'de', label:'Beschriftung DE', type:'text' },
        { k:'en', label:'Beschriftung EN', type:'text' },
        { k:'nr', label:'Nummer / Kurzwahl', type:'text' }
      ] },

    { k:'capDe', label:'Bildunterschrift DE', type:'text' },
    { k:'capEn', label:'Bildunterschrift EN', type:'text' },

    { t:'group', label:'Europäischer Notruf' },
    { k:'euNr', label:'Nummer', type:'text' },
    { k:'euDe', label:'Text DE', type:'text' },
    { k:'euEn', label:'Text EN', type:'text' },

    { t:'group', label:'Fusszeile' },
    { k:'noteDe', label:'Hinweis DE', type:'textarea' },
    { k:'noteEn', label:'Hinweis EN', type:'textarea' },
    { k:'footer', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    eyebrow:'Im Notfall',
    title:'Welche Taste wofür?',
    sub:'Tastenbelegung am Telefon beim Check-in',
    ledeDe:'Das Telefon beim Check-in hat vier programmierte Tasten. Drücken Sie einfach die passende Taste — die Verbindung wird sofort aufgebaut.',
    ledeEn:'The phone at the check-in desk has four programmed keys. Simply press the key you need and you will be connected right away.',
    keys:[
      { de:'Rezeption · Hans Amonn AG', en:'Reception', nr:'0' },
      { de:'Sanität · Notfall',         en:'Ambulance · emergency', nr:'144' },
      { de:'Polizei',                   en:'Police', nr:'117' },
      { de:'Feuerwehr',                 en:'Fire brigade', nr:'118' }
    ],
    capDe:'Die Tasten 1 bis 4 sind fest programmiert — einmal drücken genügt.',
    capEn:'Keys 1 to 4 are pre-programmed — one press is enough.',
    euNr:'112',
    euDe:'Europäischer Notruf — funktioniert von jedem Telefon',
    euEn:'European emergency number — works from any phone',
    noteDe:'Bei einem Notfall zuerst die Notrufnummer wählen, danach bitte die Rezeption informieren.',
    noteEn:'In an emergency call the emergency number first, then please inform reception.',
    footer: addressLine() + ' · ' + BRAND.phone
  },

  render(d){
    const keys = (d.keys || []).filter(k => has(k.de) || has(k.en) || has(k.nr));
    const cards = keys.map((k, i) => `
      <div class="t-notruf-key">
        <span class="t-notruf-badge">${i + 1}</span>
        <span class="t-notruf-txt">
          <b>${esc(k.de)}</b>
          <i>${esc(k.en)}</i>
        </span>
        ${has(k.nr) ? `<span class="t-notruf-nr">${esc(k.nr)}</span>` : ''}
      </div>`).join('');

    return `
    <div class="t-notruf-mast">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-notruf-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-notruf-sub">${esc(d.sub)}</p>` : ''}
      </div>
      <div class="t-notruf-logo">${logo('color', 40)}</div>
    </div>

    <div class="t-notruf-lede">
      <p lang="de">${fmt(d.ledeDe)}</p>
      <p lang="en">${fmt(d.ledeEn)}</p>
    </div>

    <div class="t-notruf-main">
      <div class="t-notruf-phonebox">
        <div class="t-notruf-phonewrap">${phoneSvg(Math.max(1, Math.min(keys.length, 6)))}</div>
        ${has(d.capDe) || has(d.capEn) ? `<div class="t-notruf-cap">
          ${has(d.capDe) ? `<b lang="de">${esc(d.capDe)}</b>` : ''}
          ${has(d.capEn) ? `<i lang="en">${esc(d.capEn)}</i>` : ''}
        </div>` : ''}
      </div>
      <div class="t-notruf-keys">${cards}</div>
    </div>

    <div class="t-notruf-eu">
      <span class="t-notruf-eunr">${esc(d.euNr)}</span>
      <span class="t-notruf-eutxt">
        <b>${esc(d.euDe)}</b>
        <i>${esc(d.euEn)}</i>
      </span>
    </div>

    <div class="t-notruf-foot">
      <div class="t-notruf-note">
        <p lang="de">${fmt(d.noteDe)}</p>
        <p lang="en">${fmt(d.noteEn)}</p>
      </div>
      <p class="t-notruf-addr">${esc(d.footer)}</p>
    </div>`;
  }
};
