/* Notruf-Aushang · Tastenbelegung am Check-in-Telefon · A4 hoch
   Portiert aus "Telefon Tastenbelegung - Notruf-Aushang v6.html".
   Die Telefon-Zeichnung ist das Original-SVG aus v6 (Referenz-Umsetzung);
   nur die vier Bildschirm-Beschriftungen sind an die Felder gebunden,
   damit Umbenennungen im Editor auch auf dem Display erscheinen. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { contactLine } from '../brand-config.js';

/* ---- Original-Telefon-SVG aus dem Notruf-Aushang v6 -------------------- */
function phoneSvg(k){
  const scr = i => esc((k[i] && (k[i].screen || k[i].de)) || '');
  return `<svg class="t-notruf-phone" viewBox="0 0 620 320" role="img"
      aria-label="Telefon-Schema mit Tastenbelegung">
<defs>
<linearGradient id="ns-scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCF3FB"/><stop offset="1" stop-color="#B6E4F5"/></linearGradient>
<linearGradient id="ns-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34383f"/><stop offset="1" stop-color="#1b1e22"/></linearGradient>
<linearGradient id="ns-key" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c515a"/><stop offset="1" stop-color="#33373d"/></linearGradient>
<linearGradient id="ns-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="ns-scrClip"><rect x="212" y="34" width="196" height="118" rx="6"/></clipPath>
<filter id="ns-glowC" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#01B1E2" flood-opacity=".85"/></filter>
<filter id="ns-glowR" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#E23A2E" flood-opacity=".8"/></filter>
</defs>
<rect x="148" y="12" width="324" height="296" rx="22" fill="url(#ns-body)"/>
<rect x="149" y="13" width="322" height="294" rx="21" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>
<rect x="156" y="19" width="308" height="3" rx="1.5" fill="#fff" fill-opacity=".08"/>
<rect x="150" y="290" width="320" height="18" rx="9" fill="#9aa0a8"/>
<rect x="150" y="290" width="320" height="9" fill="#1b1e22"/>
<rect x="212" y="34" width="196" height="118" rx="6" fill="url(#ns-scr)" stroke="#0a2230" stroke-opacity=".18"/>
<rect x="212" y="34" width="196" height="20" rx="6" fill="#0E7FB0" fill-opacity=".16"/>
<circle cx="402" cy="44" r="3" fill="#1FA463"/>
<path d="M212 34 H392 L232 152 H212 Z" fill="url(#ns-glass)" clip-path="url(#ns-scrClip)"/>
<text x="222" y="48" font-family="Montserrat" font-size="10" font-weight="700" fill="#0B4763">Check-in</text>
<text x="310" y="108" text-anchor="middle" font-family="Montserrat" font-size="30" font-weight="800" fill="#0B4763">&#9742;</text>
<text x="222" y="62" font-family="Montserrat" font-size="10.5" font-weight="700" fill="#0B4763">${scr(0)}</text>
<text x="398" y="62" text-anchor="end" font-family="Montserrat" font-size="10.5" font-weight="700" fill="#B0271C">${scr(1)}</text>
<text x="398" y="84" text-anchor="end" font-family="Montserrat" font-size="10.5" font-weight="700" fill="#B0271C">${scr(2)}</text>
<text x="398" y="106" text-anchor="end" font-family="Montserrat" font-size="10.5" font-weight="700" fill="#B0271C">${scr(3)}</text>
<g fill="#0E7FB0" fill-opacity=".14"><rect x="217" y="137" width="41" height="11" rx="3"/><rect x="263" y="137" width="41" height="11" rx="3"/><rect x="309" y="137" width="41" height="11" rx="3"/><rect x="355" y="137" width="41" height="11" rx="3"/></g>
<g fill="#3a3e44"><rect x="168" y="52" width="34" height="12" rx="4"/><rect x="168" y="74" width="34" height="12" rx="4"/><rect x="168" y="96" width="34" height="12" rx="4"/><rect x="168" y="118" width="34" height="12" rx="4"/><rect x="168" y="140" width="34" height="12" rx="4"/></g>
<g fill="#3a3e44"><rect x="418" y="52" width="34" height="12" rx="4"/><rect x="418" y="74" width="34" height="12" rx="4"/><rect x="418" y="96" width="34" height="12" rx="4"/><rect x="418" y="118" width="34" height="12" rx="4"/><rect x="418" y="140" width="34" height="12" rx="4"/></g>
<circle cx="228" cy="216" r="36" fill="url(#ns-key)"/>
<circle cx="228" cy="216" r="36" fill="none" stroke="#000" stroke-opacity=".25"/>
<circle cx="228" cy="216" r="16" fill="#2b2f35"/>
<text x="228" y="220" text-anchor="middle" font-family="Montserrat" font-size="9" font-weight="700" fill="#cfd3d9">OK</text>
<g fill="#cfd3d9"><path d="M228 187 l5 8 h-10 Z"/><path d="M228 245 l5 -8 h-10 Z"/><path d="M199 216 l8 5 v-10 Z"/><path d="M257 216 l-8 5 v-10 Z"/></g>
<g font-family="Montserrat" font-weight="700" font-size="12" fill="#e7e9ec" text-anchor="middle">
<rect x="292" y="173" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="307" y="188">1</text>
<rect x="329" y="173" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="344" y="188">2</text>
<rect x="366" y="173" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="381" y="188">3</text>
<rect x="292" y="199" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="307" y="214">4</text>
<rect x="329" y="199" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="344" y="214">5</text>
<rect x="366" y="199" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="381" y="214">6</text>
<rect x="292" y="225" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="307" y="240">7</text>
<rect x="329" y="225" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="344" y="240">8</text>
<rect x="366" y="225" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="381" y="240">9</text>
<rect x="292" y="251" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="307" y="266">*</text>
<rect x="329" y="251" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="344" y="266">0</text>
<rect x="366" y="251" width="30" height="21" rx="5" fill="url(#ns-key)"/><text x="381" y="266">#</text>
</g>
<g fill="url(#ns-key)"><circle cx="436" cy="180" r="9"/><circle cx="436" cy="206" r="9"/><circle cx="436" cy="232" r="9"/><circle cx="436" cy="258" r="9"/></g>
<rect x="164" y="48" width="42" height="20" rx="7" fill="none" stroke="#01B1E2" stroke-width="3" filter="url(#ns-glowC)"/>
<rect x="414" y="48" width="42" height="20" rx="7" fill="none" stroke="#E23A2E" stroke-width="3" filter="url(#ns-glowR)"/>
<rect x="414" y="70" width="42" height="20" rx="7" fill="none" stroke="#E23A2E" stroke-width="3" filter="url(#ns-glowR)"/>
<rect x="414" y="92" width="42" height="20" rx="7" fill="none" stroke="#E23A2E" stroke-width="3" filter="url(#ns-glowR)"/>
<line x1="164" y1="58" x2="96" y2="58" stroke="#01B1E2" stroke-width="2.5"/>
<circle cx="78" cy="58" r="18" fill="#01B1E2"/>
<text x="78" y="64" text-anchor="middle" font-family="Montserrat" font-size="18" font-weight="700" fill="#fff">1</text>
<line x1="456" y1="58" x2="524" y2="40" stroke="#E23A2E" stroke-width="2.5"/>
<circle cx="542" cy="40" r="18" fill="#E23A2E"/>
<text x="542" y="46" text-anchor="middle" font-family="Montserrat" font-size="18" font-weight="700" fill="#fff">2</text>
<line x1="456" y1="80" x2="524" y2="80" stroke="#E23A2E" stroke-width="2.5"/>
<circle cx="542" cy="80" r="18" fill="#E23A2E"/>
<text x="542" y="86" text-anchor="middle" font-family="Montserrat" font-size="18" font-weight="700" fill="#fff">3</text>
<line x1="456" y1="102" x2="524" y2="120" stroke="#E23A2E" stroke-width="2.5"/>
<circle cx="542" cy="120" r="18" fill="#E23A2E"/>
<text x="542" y="126" text-anchor="middle" font-family="Montserrat" font-size="18" font-weight="700" fill="#fff">4</text>
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
    ${lines(18, 58, 78, 3)}${lines(114, 58, 78, 3)}
    <rect x="18" y="92" width="174" height="90" rx="7" fill="#F6F7FA" stroke="#E5E8ED"/>
    <rect x="76" y="102" width="58" height="70" rx="7" fill="#2A3350"/>
    <rect x="86" y="110" width="38" height="24" rx="3" fill="#B6E4F5"/>
    <rect x="66" y="114" width="10" height="5" rx="2" fill="#01B1E2"/>
    <g fill="#E23A2E"><rect x="134" y="114" width="10" height="5" rx="2"/><rect x="134" y="123" width="10" height="5" rx="2"/><rect x="134" y="132" width="10" height="5" rx="2"/></g>
    <circle cx="42" cy="116" r="7" fill="#01B1E2"/>
    <circle cx="172" cy="112" r="7" fill="#E23A2E"/>
    ${[0,1].map(r => [0,1].map(c => `<rect x="${18 + c * 90}" y="${192 + r * 28}" width="84" height="23" rx="5" fill="#fff" stroke="#E5E8ED"/>
      <rect x="24" y="0" width="0" height="0"/>
      <circle cx="${29 + c * 90}" cy="${203 + r * 28}" r="6" fill="${r === 0 && c === 0 ? '#01B1E2' : '#E23A2E'}"/>
      <rect x="${40 + c * 90}" y="${199 + r * 28}" width="42" height="5" rx="2.5" fill="#2A3350"/>
      <rect x="${40 + c * 90}" y="${207 + r * 28}" width="30" height="4" rx="2" fill="#C9CFDA"/>`).join('')).join('')}
    <rect x="18" y="252" width="174" height="22" rx="6" fill="#E23A2E"/>
    ${lines(18, 284, 174, 1, 8, '#E5E8ED')}
  `),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'masttag', label:'Kennung (rechts oben)', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },
    { k:'ledeDe',  label:'Einleitung DE', type:'textarea', hint:'**fett** und Zeilenumbrüche möglich' },
    { k:'ledeEn',  label:'Einleitung EN', type:'textarea' },

    { t:'group', label:'Tastenbelegung' },
    { t:'note',  label:'Die erste Taste ist die Rezeption (cyan), die weiteren sind Notrufe (rot). Die Nummern 1 bis 4 zeigen auf die Tasten am Telefon.' },
    { k:'keys', label:'Tasten', type:'list', itemLabel:'Taste', max:4,
      defaultItem:{ icon:'info', de:'', en:'', nr:'', screen:'' },
      item:[
        { k:'icon',   label:'Symbol', type:'select', options:iconOptions() },
        { k:'de',     label:'Beschriftung DE', type:'text' },
        { k:'en',     label:'Beschriftung EN', type:'text' },
        { k:'nr',     label:'Nummer / Kurzwahl', type:'text' },
        { k:'screen', label:'Anzeige im Display', type:'text', hint:'leer = Beschriftung DE' }
      ] },

    { t:'group', label:'Fusszeile' },
    { k:'footDe', label:'Hinweis DE', type:'textarea' },
    { k:'footEn', label:'Hinweis EN', type:'textarea' },
    { k:'euNo',   label:'EU-Nummer', type:'text' },
    { k:'euText', label:'EU-Text', type:'textarea', rows:2 },
    { k:'footer', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    masttag:'Check-in-Telefon · Check-in phone',
    title:'Welche Taste wofür?',
    sub:'Which button does what? · Notruf und Rezeption',
    ledeDe:'Das Telefon beim **Check-in** hat vier vorprogrammierte Tasten. Einfach die passende Taste drücken — Sie werden sofort verbunden, ohne eine Nummer zu wählen.',
    ledeEn:'The phone at **check-in** has four preset buttons. Just press the one you need — you are connected instantly, no dialling.',
    keys:[
      { icon:'reception', de:'Rezeption', en:'Reception · wir helfen Ihnen gern', nr:'☎',  screen:'Rezeption' },
      { icon:'shield',    de:'Polizei',   en:'Police',        nr:'117', screen:'Police' },
      { icon:'fire',      de:'Feuerwehr', en:'Fire brigade',  nr:'118', screen:'Fire' },
      { icon:'ambulance', de:'Ambulanz · Sanität', en:'Ambulance', nr:'144', screen:'Ambulanz' }
    ],
    footDe:'**Im Notfall** genügt ein Tastendruck — Sie sind sofort verbunden, keine Nummer nötig.',
    footEn:'**In an emergency**, one press connects you — no number to dial.',
    euNo:'112',
    euText:'Europäischer Notruf\nEuropean emergency',
    footer: contactLine()
  },

  render(d){
    const keys = (d.keys || []).filter(k => has(k.de) || has(k.en) || has(k.nr));
    const cards = keys.map((k, i) => `
      <div class="t-notruf-key${i === 0 ? '' : ' is-notfall'}">
        <span class="t-notruf-num">${i + 1}</span>
        <span class="t-notruf-ico">${icon(k.icon || 'info', 22, 2)}</span>
        <span class="t-notruf-txt">
          <b>${esc(k.de)}</b>
          ${has(k.en) ? `<i>${esc(k.en)}</i>` : ''}
        </span>
        ${has(k.nr) ? `<span class="t-notruf-nr">${esc(k.nr)}</span>` : ''}
      </div>`).join('');

    return `
    <div class="t-notruf-mast">
      <div class="t-notruf-mast-top">
        ${logo('color', 40)}
        ${has(d.masttag) ? `<span class="t-notruf-tag">${fmt(d.masttag)}</span>` : ''}
      </div>
      <h1>${esc(d.title)}</h1>
      ${has(d.sub) ? `<p class="t-notruf-sub">${esc(d.sub)}</p>` : ''}
      <div class="t-notruf-lede">
        <p lang="de">${fmt(d.ledeDe)}</p>
        <p lang="en">${fmt(d.ledeEn)}</p>
      </div>
    </div>

    <div class="t-notruf-diagram">${phoneSvg(keys)}</div>

    <div class="t-notruf-keys">${cards}</div>

    <div class="t-notruf-foot">
      <div class="t-notruf-note">
        <p lang="de">${fmt(d.footDe)}</p>
        <p lang="en">${fmt(d.footEn)}</p>
      </div>
      ${has(d.euNo) ? `<div class="t-notruf-eu">
        <span class="t-notruf-eunr">${esc(d.euNo)}</span>
        <span class="t-notruf-eutxt">${fmt(d.euText)}</span>
      </div>` : ''}
    </div>
    ${has(d.footer) ? `<p class="t-notruf-addr">${esc(d.footer)}</p>` : ''}`;
  }
};
