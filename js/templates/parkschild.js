/* Parkplatz-Schild · A5 quer, mehrseitig.
   Bildet die Serie aus "RESERVIERT.docx" ab: dasselbe Schild für Platz 1,
   2, 3 … Statt sechs Seiten von Hand zu kopieren, gibt man den Bereich an
   und bekommt pro Platz eine Seite.

   Wortlaut aus dem Original:
     RESERVIERT · Platz Nr. n
     Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const PARK_PAGES = { a5:'a5', 'a5-land':'a5-land', a4:'a4', 'a4-land':'a4-land' };

const ART = {
  reserviert: { title:'RESERVIERT', ton:'#2A3350' },
  privat:     { title:'PRIVAT',     ton:'#C0271F' },
  besucher:   { title:'BESUCHER',   ton:'#01B1E2' }
};

export default {
  id:'parkschild',
  title:'Parkplatz-Schild',
  sub:'Reserviert / Privat / Besucher · eine Seite je Platz',
  badge:'Parkieren',
  root:'t-parkschild',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'parken',
  multipage:true,
  pageOf(d){ return PARK_PAGES[d && d.format] || 'a5-land'; },

  thumb: thumb(`
    <rect x="10" y="30" width="190" height="105" rx="8" fill="#2A3350"/>
    <rect x="26" y="50" width="120" height="16" rx="5" fill="#fff" opacity=".95"/>
    <rect x="26" y="76" width="74" height="10" rx="5" fill="#01B1E2"/>
    <circle cx="172" cy="70" r="20" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
    <path d="M165 80V60h8a6 6 0 0 1 0 12h-8" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>
    <rect x="26" y="100" width="150" height="6" rx="3" fill="#fff" opacity=".45"/>
    <rect x="26" y="112" width="110" height="6" rx="3" fill="#fff" opacity=".45"/>
    <rect x="10" y="160" width="190" height="105" rx="8" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="26" y="180" width="120" height="16" rx="5" fill="#C9CFDA"/>
    <rect x="26" y="206" width="74" height="10" rx="5" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Art und Format' },
    { k:'art', label:'Art', type:'select', options:[
      { v:'reserviert', t:'Reserviert (navy)' },
      { v:'privat',     t:'Privat (rot)' },
      { v:'besucher',   t:'Besucher (cyan)' }
    ] },
    { k:'format', label:'Papier', type:'select', options:[
      { v:'a5-land', t:'A5 quer' }, { v:'a5', t:'A5 hoch' },
      { v:'a4-land', t:'A4 quer' }, { v:'a4', t:'A4 hoch' }
    ] },

    { t:'group', label:'Plätze' },
    { k:'von', label:'von Platz Nr.', type:'number', min:1,  max:99, step:1 },
    { k:'bis', label:'bis Platz Nr.', type:'number', min:1,  max:99, step:1,
      hint:'Ergibt eine Seite je Platz. Gleiche Zahl = ein einzelnes Schild.' },
    { k:'ohneNummer', label:'ohne Nummer', type:'select',
      options:[{v:'nein',t:'nein'},{v:'ja',t:'ja — nur ein Schild ohne Platznummer'}] },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },

    { t:'group', label:'Text' },
    { k:'titel',  label:'Titelzeile', type:'text',
      hint:'Leer lassen: nimmt automatisch RESERVIERT / PRIVAT / BESUCHER.' },
    { k:'label',  label:'Bezeichnung', type:'text' },
    { k:'warnDe', label:'Warnhinweis DE', type:'textarea' },
    { k:'warnEn', label:'Warnhinweis EN', type:'textarea' }
  ],

  defaults:{
    art:'reserviert',
    format:'a5-land',
    von:1, bis:6,
    ohneNummer:'nein',
    objekt:'-',
    absender:'immobilien',
    titel:'',
    label:'Platz Nr.',
    warnDe:'Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt',
    warnEn:'Vehicles parked illegally will be towed at the ownerʼs expense'
  },

  render(d){
    const art = ART[d.art] || ART.reserviert;
    const abs = ABSENDER[d.absender] || ABSENDER.immobilien;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const titel = has(d.titel) ? d.titel : art.title;

    const von = Math.max(1, Number(d.von) || 1);
    const bis = Math.max(von, Number(d.bis) || von);
    const nummern = d.ohneNummer === 'ja' ? [null] : [];
    if (d.ohneNummer !== 'ja') for (let n = von; n <= bis; n++) nummern.push(n);

    return nummern.map(n => `
      <article data-page class="t-parkschild-page" style="--ton:${art.ton}">
        <div class="t-parkschild-frame">
          <header class="t-parkschild-head">
            <div>
              <h1>${esc(titel)}</h1>
              ${n != null ? `<p class="t-parkschild-nr">${esc(d.label || 'Platz Nr.')} ${n}</p>` : ''}
            </div>
            <span class="t-parkschild-ico">${icon('car', 78, 2)}</span>
          </header>

          ${(obj.code || adr) ? `<p class="t-parkschild-obj">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</p>` : ''}

          <div class="t-parkschild-warn">
            ${has(d.warnDe) ? `<p lang="de">${esc(d.warnDe)}</p>` : ''}
            ${has(d.warnEn) ? `<p lang="en">${esc(d.warnEn)}</p>` : ''}
          </div>

          <footer class="t-parkschild-foot">
            <span class="t-parkschild-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
            <span class="t-parkschild-abs">${esc(abs.legal)} · ${esc(abs.contact)}</span>
          </footer>
        </div>
      </article>`).join('');
  }
};
