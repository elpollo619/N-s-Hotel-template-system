/* Zattoo TV · Anleitung fürs Zimmer, mehrsprachig, A4 hoch.
   Portiert aus "Zattoo TV Anleitung - Mehrsprachig.html". */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { BRAND, addressLine } from '../brand-config.js';

function tvSvg(){
  return `<svg class="t-zattoo-tv" viewBox="0 0 360 220" role="img" aria-label="Fernseher mit Fernbedienung">
    <rect x="8" y="8" width="268" height="158" rx="10" style="fill:#2A3350"/>
    <rect x="20" y="20" width="244" height="134" rx="5" style="fill:#20294a"/>
    <circle cx="142" cy="87" r="30" style="fill:#01B1E2"/>
    <path d="M133 73 L160 87 L133 101 Z" style="fill:#fff"/>
    <rect x="118" y="176" width="48" height="8" rx="4" style="fill:#C7CEDA"/>
    <rect x="86" y="184" width="112" height="9" rx="4.5" style="fill:#DFE4EC"/>
    <rect x="296" y="24" width="52" height="172" rx="14" style="fill:#EEF1F6;stroke:#C7CEDA;stroke-width:2"/>
    <circle cx="322" cy="52" r="10" style="fill:#E23A2E"/>
    <rect x="308" y="76" width="28" height="9" rx="4.5" style="fill:#C7CEDA"/>
    <rect x="308" y="92" width="28" height="9" rx="4.5" style="fill:#C7CEDA"/>
    ${[0,1,2,3].map(r => [0,1,2].map(c =>
      `<circle cx="${312 + c * 10}" cy="${118 + r * 17}" r="3.6" style="fill:#C7CEDA"/>`).join('')).join('')}
  </svg>`;
}

export default {
  id:'zattoo',
  title:'TV-Anleitung (Zattoo)',
  sub:'Fernsehen im Zimmer, mehrsprachig · A4 hoch',
  badge:'TV',
  page:'a4',
  root:'t-zattoo',
  thumb: thumb(`
    <rect x="18" y="16" width="76" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="18" y="32" width="120" height="14" rx="4" fill="#2A3350"/>
    <rect x="46" y="60" width="118" height="70" rx="6" fill="#2A3350"/>
    <circle cx="105" cy="95" r="15" fill="#01B1E2"/>
    <path d="M100 88 l12 7 -12 7 z" fill="#fff"/>
    <rect x="88" y="134" width="34" height="5" rx="2.5" fill="#C9CFDA"/>
    ${[0,1,2,3].map(i => `<rect x="18" y="${152 + i * 28}" width="174" height="22" rx="5" fill="#F6F7FA"/>
      <circle cx="31" cy="${163 + i * 28}" r="7" fill="#01B1E2"/>
      <rect x="44" y="${158 + i * 28}" width="80" height="6" rx="3" fill="#2A3350"/>
      <rect x="44" y="${168 + i * 28}" width="56" height="4" rx="2" fill="#C9CFDA"/>`).join('')}
    ${lines(18, 272, 174, 1, 8, '#E5E8ED')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },

    { t:'group', label:'Schritte' },
    { k:'steps', label:'Schritte', type:'list', itemLabel:'Schritt', max:6,
      defaultItem:{ de:'', en:'' },
      item:[
        { k:'de', label:'Text DE', type:'text' },
        { k:'en', label:'Text EN', type:'text' }
      ] },

    { t:'group', label:'Hinweise' },
    { k:'tippDe', label:'Tipp DE', type:'textarea' },
    { k:'tippEn', label:'Tipp EN', type:'textarea' },
    { k:'sprachen', label:'Sprachen der Sender', type:'text' },
    { k:'hilfe', label:'Hilfe-Zeile', type:'text' },
    { k:'footer', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    eyebrow:'Fernsehen im Zimmer',
    title:'TV mit Zattoo',
    sub:'In vier Schritten zum Programm · Four steps to your programme',
    steps:[
      { de:'Fernseher mit der roten Taste der Fernbedienung einschalten.', en:'Switch the television on with the red button on the remote.' },
      { de:'Im Startbild «Zattoo» auswählen und mit OK bestätigen.', en:'Select “Zattoo” on the start screen and confirm with OK.' },
      { de:'Mit den Pfeiltasten durch die Senderliste blättern.', en:'Browse the channel list with the arrow keys.' },
      { de:'Sender mit OK öffnen — fertig. Gutes Schauen!', en:'Open a channel with OK — that is it. Enjoy!' }
    ],
    tippDe:'Der Fernseher startet immer beim zuletzt gewählten Sender. Falls das Bild schwarz bleibt, den Fernseher kurz aus- und wieder einschalten.',
    tippEn:'The television always starts on the channel you watched last. If the screen stays black, switch the set off and on again.',
    sprachen:'Sender in Deutsch, Französisch, Italienisch und Englisch',
    hilfe:'Fragen? Die Rezeption hilft gerne weiter · Questions? Reception is happy to help',
    footer: addressLine() + ' · ' + BRAND.phone
  },

  render(d){
    const steps = (d.steps || []).filter(s => has(s.de) || has(s.en));
    return `
    <div class="t-zattoo-mast">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-zattoo-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-zattoo-sub">${esc(d.sub)}</p>` : ''}
      </div>
      <div class="t-zattoo-logo">${logo('color', 38)}</div>
    </div>

    <div class="t-zattoo-hero">${tvSvg()}</div>

    <div class="t-zattoo-steps">
      ${steps.map((s, i) => `<div class="t-zattoo-step">
        <span class="t-zattoo-num">${i + 1}</span>
        <span class="t-zattoo-txt">
          ${has(s.de) ? `<b>${esc(s.de)}</b>` : ''}
          ${has(s.en) ? `<i>${esc(s.en)}</i>` : ''}
        </span>
      </div>`).join('')}
    </div>

    ${has(d.sprachen) ? `<div class="t-zattoo-langs">${icon('globe', 18)}<span>${esc(d.sprachen)}</span></div>` : ''}

    <div class="t-zattoo-foot">
      ${(has(d.tippDe) || has(d.tippEn)) ? `<div class="t-zattoo-tipp">
        ${has(d.tippDe) ? `<p lang="de">${fmt(d.tippDe)}</p>` : ''}
        ${has(d.tippEn) ? `<p lang="en">${fmt(d.tippEn)}</p>` : ''}
      </div>` : ''}
      ${has(d.hilfe) ? `<p class="t-zattoo-hilfe">${esc(d.hilfe)}</p>` : ''}
      ${has(d.footer) ? `<p class="t-zattoo-addr">${esc(d.footer)}</p>` : ''}
    </div>`;
  }
};
