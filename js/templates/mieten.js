/* Wohnung zu vermieten · A4 hoch
   --------------------------------------------------------------------------
   Der Aushang am Schwarzen Brett und im Schaukasten: freie Wohnung, die
   Eckdaten, ein Foto, wen man anruft. Was der Interessent in fünf Sekunden
   wissen will — Zimmer, Fläche, Miete, ab wann — steht als Kachelreihe oben,
   nicht in einem Fliesstext versteckt.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'mieten',
  title:'Wohnung zu vermieten',
  sub:'Vermietungs-Aushang mit Foto und Eckdaten · A4 hoch',
  badge:'Vermietung',
  root:'t-miet',
  page:'a4',

  thumb: thumb(`
    <rect x="20" y="24" width="170" height="86" rx="6" fill="#2A3350" opacity=".12"/>
    <path d="M20 96 66 62l34 24 26-18 44 32v10H20z" fill="#2A3350" opacity=".5"/>
    <circle cx="150" cy="52" r="10" fill="#01B1E2"/>
    <rect x="20" y="122" width="120" height="14" rx="5" fill="#2A3350"/>
    ${[0,1,2].map(i => `
      <rect x="${20 + i*58}" y="150" width="52" height="34" rx="5" fill="#01B1E2" opacity=".14"/>
      <rect x="${28 + i*58}" y="158" width="24" height="10" rx="3" fill="#2A3350"/>
      <rect x="${28 + i*58}" y="172" width="34" height="6" rx="3" fill="#2A3350" opacity=".5"/>`).join('')}
    <rect x="20" y="198" width="130" height="6" rx="3" fill="#2A3350" opacity=".4"/>
    <rect x="20" y="212" width="110" height="6" rx="3" fill="#2A3350" opacity=".4"/>
    <rect x="150" y="240" width="40" height="40" rx="4" fill="#2A3350" opacity=".8"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'lage',    label:'Lage / Stockwerk', type:'text' },

    { t:'group', label:'Foto' },
    { k:'bild', label:'Foto', type:'image',
      hint:'Wird oben als Bild gezeigt. Quer aufgenommen wirkt am besten.' },

    { t:'group', label:'Eckdaten' },
    { k:'eck', label:'Kacheln', type:'list', itemLabel:'Kachel', max:6,
      defaultItem:{ icon:'bed', wert:'', label:'' },
      item:[
        { k:'icon',  label:'Symbol', type:'select', options:[
          { v:'bed', t:'Zimmer' }, { v:'safe', t:'Fläche' }, { v:'key', t:'Miete' },
          { v:'calendar', t:'ab' }, { v:'car', t:'Parkplatz' }, { v:'lift', t:'Lift' },
          { v:'info', t:'anderes' } ] },
        { k:'wert',  label:'Wert',  type:'text' },
        { k:'label', label:'Bezeichnung', type:'text' }
      ] },

    { t:'group', label:'Beschreibung' },
    { k:'text', label:'Beschreibung', type:'textarea', rows:3 },
    { k:'punkte', label:'Ausstattung', type:'list', itemLabel:'Punkt', max:8,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Punkt', type:'text' }] },

    { t:'group', label:'Kontakt' },
    { k:'kontakt', label:'Ansprechperson', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },
    { k:'mail',    label:'E-Mail', type:'text' },
    { k:'qrText',  label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code. Sonst das Bewerbungsformular oder das Inserat.' },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Zu vermieten',
    titel:'Helle 3.5-Zimmer-Wohnung',
    objekt:'-',
    lage:'2. Obergeschoss',
    bild:'',
    eck:[
      { icon:'bed', wert:'3.5', label:'Zimmer' },
      { icon:'safe', wert:'86 m²', label:'Wohnfläche' },
      { icon:'key', wert:'CHF 1’680', label:'inkl. NK / Monat' },
      { icon:'calendar', wert:'1. Januar', label:'verfügbar ab' }
    ],
    text:'Renovierte Wohnung an ruhiger Lage, wenige Gehminuten zum Bahnhof. Einbauküche, Balkon nach Süden, eigener Kellerraum.',
    punkte:[
      { text:'Neue Küche mit Geschirrspüler' },
      { text:'Balkon nach Süden' },
      { text:'Keller und Estrichabteil' },
      { text:'Waschküche mit eigenem Turnus' }
    ],
    kontakt:'Hans Amonn Immobilien',
    telefon:'+41 31 951 85 54',
    mail:'',
    qrText:'',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr, d.lage].filter(Boolean).join(' · ');

    const bild = has(d.bild)
      ? `<img class="t-miet-bild" src="${esc(d.bild)}" alt="">`
      : `<div class="t-miet-platzhalter"><span>${icon('photo', 40, 1.6)}</span>Foto hier einsetzen</div>`;

    const eck = (d.eck || []).filter(e => has(e.wert)).map(e => `
      <div class="t-miet-eck">
        <span class="t-miet-eico">${icon(e.icon || 'info', 22, 1.9)}</span>
        <b>${esc(e.wert)}</b>
        ${has(e.label) ? `<i>${esc(e.label)}</i>` : ''}
      </div>`).join('');

    const punkte = (d.punkte || []).filter(p => has(p.text)).map(p => `
      <li><span>${icon('check', 16, 2.2)}</span>${esc(p.text)}</li>`).join('');

    const qr = has(d.qrText)
      ? `<div class="t-miet-qr">${qrSvg(d.qrText, { stufe:'M', groesse:'26mm' })}</div>` : '';

    return `
      <div class="t-miet-foto">${bild}</div>

      <header class="t-miet-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel || '')}</h1>
        ${ort ? `<p class="t-miet-ort">${esc(ort)}</p>` : ''}
      </header>

      ${eck ? `<div class="t-miet-eckreihe">${eck}</div>` : ''}

      <div class="t-miet-body">
        ${has(d.text) ? `<p class="t-miet-text">${esc(d.text)}</p>` : ''}
        ${punkte ? `<ul class="t-miet-punkte">${punkte}</ul>` : ''}
      </div>

      <footer class="t-miet-fuss">
        ${qr}
        <div class="t-miet-kontakt">
          <p class="t-miet-klabel">Interesse? Melden Sie sich:</p>
          <p class="t-miet-kwer">${esc([d.kontakt, d.telefon, d.mail].filter(Boolean).join(' · '))}</p>
          <p class="t-miet-abs"><span class="t-miet-mark">${
            istHotel(d.absender) ? logo('color', 22) : ''}</span>${esc(abs.foot)}</p>
        </div>
      </footer>`;
  }
};
