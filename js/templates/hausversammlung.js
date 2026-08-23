/* Hausversammlung · A4 hoch
   --------------------------------------------------------------------------
   Die Einladung zur Eigentümer- oder Mieterversammlung: wann, wo, und vor
   allem die Traktandenliste. Eine Versammlung ohne Traktanden ist rechtlich
   angreifbar — über nicht angekündigte Geschäfte darf nicht beschlossen
   werden. Darum steht die Liste im Zentrum, nummeriert.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'hausversammlung',
  title:'Hausversammlung',
  sub:'Einladung mit Traktandenliste · A4 hoch',
  badge:'Versammlung',
  root:'t-hv',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="80" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="44" width="150" height="18" rx="6" fill="#2A3350"/>
    <rect x="24" y="84" width="162" height="34" rx="6" fill="#2A3350"/>
    <rect x="38" y="96" width="40" height="7" rx="3.5" fill="#01B1E2"/>
    <rect x="38" y="107" width="90" height="6" rx="3" fill="#fff" opacity=".85"/>
    <rect x="24" y="138" width="70" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2,3].map(i => `
      <circle cx="30" cy="${166 + i * 22}" r="6" fill="none" stroke="#2A3350" stroke-width="1.6"/>
      <rect x="44" y="${162 + i * 22}" width="${132 - i*10}" height="7" rx="3.5" fill="#2A3350" opacity=".7"/>`).join('')}`),

  fields:[
    { t:'group', label:'Art und Kopf' },
    { k:'art', label:'Versammlung', type:'select', options:[
      { v:'Ordentliche Eigentümerversammlung', t:'Eigentümerversammlung (ordentlich)' },
      { v:'Ausserordentliche Eigentümerversammlung', t:'Eigentümerversammlung (ausserordentlich)' },
      { v:'Mieterversammlung', t:'Mieterversammlung' },
      { v:'Informationsveranstaltung', t:'Informationsveranstaltung' } ] },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Wann und wo' },
    { k:'datum', label:'Datum', type:'text' },
    { k:'zeit',  label:'Zeit',  type:'text' },
    { k:'ort',   label:'Ort',   type:'text' },

    { t:'group', label:'Traktanden' },
    { k:'traktanden', label:'Traktandenliste', type:'list', itemLabel:'Traktandum', max:16,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Traktandum', type:'text' }] },

    { t:'group', label:'Hinweise' },
    { k:'vollmacht', label:'Text zur Vertretung / Vollmacht', type:'textarea', rows:2 },
    { k:'anmeldung', label:'Anmeldung / Rückfragen', type:'text' },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    art:'Ordentliche Eigentümerversammlung',
    eyebrow:'Einladung',
    objekt:'-',
    datum:'Donnerstag, 20. November',
    zeit:'19:00 Uhr',
    ort:'Restaurant Bahnhof, Kerzers',
    traktanden:[
      { text:'Begrüssung und Feststellung der Beschlussfähigkeit' },
      { text:'Protokoll der letzten Versammlung' },
      { text:'Jahresrechnung und Revisionsbericht' },
      { text:'Budget und Erneuerungsfonds' },
      { text:'Anstehende Arbeiten am Gebäude' },
      { text:'Wahlen' },
      { text:'Verschiedenes' }
    ],
    vollmacht:'Wer nicht teilnehmen kann, lässt sich schriftlich vertreten. Eine Vollmacht liegt dieser Einladung bei bzw. ist bei der Verwaltung erhältlich.',
    anmeldung:'Anträge zuhanden der Versammlung bitte bis zehn Tage vorher schriftlich an die Verwaltung.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const traktanden = (d.traktanden || []).filter(t => has(t.text)).map((t, i) => `
      <li><span class="t-hv-nr">${i + 1}</span><span>${esc(t.text)}</span></li>`).join('');

    return `
      <header class="t-hv-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.art || '')}</h1>
        ${ort ? `<p class="t-hv-ort">${esc(ort)}</p>` : ''}
      </header>

      <div class="t-hv-wann">
        <div><span class="t-hv-ico">${icon('calendar', 22, 1.9)}</span>
          <span><i>Datum</i>${esc(d.datum || '')}${has(d.zeit) ? ` · ${esc(d.zeit)}` : ''}</span></div>
        ${has(d.ort) ? `<div><span class="t-hv-ico">${icon('flag', 22, 1.9)}</span>
          <span><i>Ort</i>${esc(d.ort)}</span></div>` : ''}
      </div>

      ${traktanden ? `
      <section class="t-hv-trakt">
        <h2>Traktanden</h2>
        <ol>${traktanden}</ol>
      </section>` : ''}

      ${has(d.vollmacht) ? `<p class="t-hv-text">${esc(d.vollmacht)}</p>` : ''}
      ${has(d.anmeldung) ? `<p class="t-hv-text">${esc(d.anmeldung)}</p>` : ''}

      <footer class="t-hv-fuss">
        <span class="t-hv-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc(abs.foot)}</span>
      </footer>`;
  }
};
