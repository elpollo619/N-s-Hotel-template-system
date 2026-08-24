/* Checkliste · A4 hoch.
   --------------------------------------------------------------------------
   Das meistgedruckte Blatt der Branche: Zimmer-Reinigung, Rundgang,
   Wochenkontrolle. Abschnitte gliedern die Arbeit, jede Zeile im Textfeld
   wird ein Punkt mit Kästchen. Drei Spaltenarten:

     kaestchen   ein Kästchen je Punkt — die klassische Abhak-Liste
     bemerkung   Kästchen + Linie für eine Notiz
     woche       sieben Kästchen Mo–So — die Wochenkontrolle

   Ausgefüllt wird von Hand, am Brett oder auf dem Klemmbrett. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { contactLine } from '../brand-config.js';
import { objekt, objektAdresse, objektOptions } from '../objekte.js';

const CHK_TAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function chkZeilen(text){
  return String(text || '').split('\n').map(z => z.trim()).filter(Boolean);
}

export default {
  id:'checkliste',
  title:'Checkliste',
  sub:'Abhak-Liste für Reinigung, Rundgang und Kontrolle · A4 hoch',
  badge:'Formular',
  page:'a4',
  root:'t-chk',

  thumb: thumb(`
    <rect x="18" y="16" width="120" height="13" rx="4" fill="#2A3350"/>
    <rect x="18" y="36" width="90" height="6" rx="3" fill="#C9CFDA"/>
    <rect x="18" y="56" width="174" height="12" rx="4" fill="#E7F7FC"/>
    ${[0,1,2,3].map(i => `
      <rect x="22" y="${78 + i * 20}" width="10" height="10" rx="2" fill="#fff" stroke="#8B8F99" stroke-width="1.4"/>
      <rect x="40" y="${80 + i * 20}" width="${120 - i * 14}" height="6" rx="3" fill="#C9CFDA"/>`).join('')}
    <rect x="18" y="162" width="174" height="12" rx="4" fill="#E7F6EE"/>
    ${[0,1,2].map(i => `
      <rect x="22" y="${184 + i * 20}" width="10" height="10" rx="2" fill="#fff" stroke="#8B8F99" stroke-width="1.4"/>
      <rect x="40" y="${186 + i * 20}" width="${132 - i * 20}" height="6" rx="3" fill="#C9CFDA"/>`).join('')}
    <rect x="18" y="252" width="80" height="6" rx="3" fill="#E5E8ED"/>
    <rect x="112" y="252" width="80" height="6" rx="3" fill="#E5E8ED"/>
    <rect x="18" y="280" width="174" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Spalten' },
    { k:'spalten', label:'Art der Liste', type:'select', options:[
      { v:'kaestchen', t:'Kästchen — einmal abhaken' },
      { v:'bemerkung', t:'Kästchen + Bemerkung' },
      { v:'woche',     t:'Wochenkontrolle — Mo bis So' } ] },
    { k:'meta', label:'Zeile für Datum und Visum', type:'select',
      options:[{ v:'ja', t:'ja' }, { v:'nein', t:'nein' }] },

    { t:'group', label:'Abschnitte' },
    { t:'note', label:'Jede Zeile im Textfeld wird ein Punkt mit Kästchen.' },
    { k:'abschnitte', label:'Abschnitte', type:'list', itemLabel:'Abschnitt', max:8,
      defaultItem:{ titel:'', punkte:'' },
      item:[
        { k:'titel',  label:'Überschrift', type:'text' },
        { k:'punkte', label:'Punkte — je Zeile einer', type:'textarea', rows:4 }
      ] },

    { t:'group', label:'Fusszeile' },
    { k:'fuss', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    eyebrow:'Alles bereit?',
    titel:'Zimmer-Reinigung',
    sub:'Je Zimmer eine Liste — abhaken, was erledigt ist',
    objekt:'-',
    spalten:'kaestchen',
    meta:'ja',
    abschnitte:[
      { titel:'Zimmer', punkte:'Betten frisch beziehen\nFlächen und Möbel abstauben\nBoden saugen und feucht wischen\nAbfall leeren, Beutel ersetzen\nWasser und Gläser auffüllen' },
      { titel:'Bad', punkte:'Lavabo, Dusche und WC reinigen\nSpiegel und Armaturen polieren\nFrottierwäsche wechseln\nSeife und WC-Papier auffüllen' },
      { titel:'Endkontrolle', punkte:'Fenster und Storen prüfen\nHeizung auf Grundstellung\nLicht aus, Türe abschliessen' }
    ],
    fuss: contactLine()
  },

  render(d){
    const art = ['kaestchen', 'bemerkung', 'woche'].includes(d.spalten) ? d.spalten : 'kaestchen';
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);

    const kopfRechts = art === 'woche'
      ? `<span class="t-chk-wtage">${CHK_TAGE.map(t => `<em>${t}</em>`).join('')}</span>`
      : '';

    const abschnitte = (Array.isArray(d.abschnitte) ? d.abschnitte : [])
      .filter(a => has(a.titel) || chkZeilen(a.punkte).length)
      .map(a => `
        <section class="t-chk-teil">
          ${has(a.titel) ? `<h2>${esc(a.titel)}${kopfRechts}</h2>` : ''}
          ${chkZeilen(a.punkte).map(z => `
            <div class="t-chk-zeile t-chk-zeile--${art}">
              ${art === 'woche'
                ? `<span class="t-chk-text">${esc(z)}</span>
                   <span class="t-chk-boxen">${CHK_TAGE.map(() => '<i></i>').join('')}</span>`
                : `<i class="t-chk-box"></i>
                   <span class="t-chk-text">${esc(z)}</span>
                   ${art === 'bemerkung' ? '<span class="t-chk-linie"></span>' : ''}`}
            </div>`).join('')}
        </section>`).join('');

    return `
    <div class="t-chk-kopf">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-chk-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel)}</h1>
        ${has(d.sub) ? `<p class="t-chk-sub">${esc(d.sub)}</p>` : ''}
        ${(obj.code || adr) ? `<p class="t-chk-obj">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</p>` : ''}
      </div>
      <div class="t-chk-logo">${logo('color', 36)}</div>
    </div>

    ${d.meta !== 'nein' ? `
    <div class="t-chk-meta">
      <span>Datum<i></i></span>
      <span>Name<i></i></span>
      <span>Visum<i></i></span>
    </div>` : ''}

    <div class="t-chk-teile">${abschnitte}</div>

    ${has(d.fuss) ? `<p class="t-chk-fuss">${esc(d.fuss)}</p>` : ''}`;
  }
};
