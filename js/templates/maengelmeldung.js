/* Mängelmeldung · A4 hoch
   --------------------------------------------------------------------------
   Das Formular, das der Mieter ausfüllt, wenn etwas kaputt ist: was, wo,
   seit wann, wann man in die Wohnung darf. Bisher rief man an, niemand nahm
   ab, und der tropfende Hahn tropfte weiter. Ein Formular am Schwarzen Brett
   und im Briefkasten der Verwaltung macht daraus einen nachvollziehbaren
   Vorgang.

   Zwei Teile: oben füllt der Mieter aus, der graue Kasten unten bleibt der
   Verwaltung. So sieht man auf einen Blick, was schon erledigt ist.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'maengelmeldung',
  title:'Mängelmeldung',
  sub:'Was ist kaputt — das Formular für Mieter · A4 hoch',
  badge:'Reparatur',
  root:'t-maeng',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="120" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="58" width="60" height="7" rx="3.5" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${82 + i*20}" width="44" height="6" rx="3" fill="#2A3350" opacity=".7"/>
      <path d="M78 ${88 + i*20}h108" stroke="#C9CFDA" stroke-width="1.5" stroke-dasharray="3 3"/>`).join('')}
    <rect x="24" y="152" width="162" height="46" rx="5" fill="#2A3350" opacity=".9"/>
    <rect x="34" y="162" width="50" height="6" rx="3" fill="#01B1E2"/>
    <rect x="34" y="178" width="120" height="5" rx="2.5" fill="#fff" opacity=".4"/>
    <path d="M24 236h70M116 236h70" stroke="#2A3350" stroke-width="1.5"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'titel', label:'Titel', type:'text' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Wer meldet (füllt der Mieter aus)' },
    { t:'note', label:'Diese Zeilen sind Schreiblinien — das Formular wird ausgedruckt und von Hand ausgefüllt.' },
    { k:'felder', label:'Zeilen', type:'list', itemLabel:'Zeile', max:10,
      defaultItem:{ label:'' },
      item:[{ k:'label', label:'Beschriftung', type:'text' }] },

    { t:'group', label:'Was ist das Problem' },
    { k:'dringend', label:'Dringlichkeit ankreuzbar', type:'select',
      options:[{ v:'ja', t:'zeigen — normal / dringend / Notfall' }, { v:'nein', t:'weglassen' }] },

    { t:'group', label:'Kasten für die Verwaltung' },
    { k:'verwaltung', label:'Feld für die Verwaltung', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },

    { t:'group', label:'Rückgabe' },
    { k:'abgabe', label:'Wo abgeben', type:'textarea', rows:2 },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Mängel- und Reparaturmeldung',
    objekt:'-',
    felder:[
      { label:'Name' }, { label:'Wohnung / Lage' }, { label:'Telefon' },
      { label:'Erreichbar am besten' }, { label:'Zutritt möglich ab' }
    ],
    dringend:'ja',
    verwaltung:'ja',
    abgabe:'Bitte ausgefüllt in den Briefkasten der Verwaltung werfen oder an office@… mailen. Bei Notfällen (Wasser, Strom, Heizung) zuerst anrufen.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const felder = (d.felder || []).filter(f => has(f.label)).map(f => `
      <div class="t-maeng-feld"><span>${esc(f.label)}</span><span class="t-maeng-linie"></span></div>`).join('');

    const dringend = d.dringend === 'ja' ? `
      <div class="t-maeng-dring">
        <span>Dringlichkeit</span>
        <label><i></i> normal</label>
        <label><i></i> dringend</label>
        <label><i></i> Notfall</label>
      </div>` : '';

    return `
      <header class="t-maeng-kopf">
        <div>
          <h1>${esc(d.titel || 'Mängelmeldung')}</h1>
          ${ort ? `<p class="t-maeng-ort">${esc(ort)}</p>` : ''}
        </div>
        <span class="t-maeng-ico">${icon('warn', 32, 1.9)}</span>
      </header>

      ${felder ? `<div class="t-maeng-oben">${felder}</div>` : ''}
      ${dringend}

      <section class="t-maeng-was">
        <h2>Was ist das Problem? Wo genau? Seit wann?</h2>
        <div class="t-maeng-schreib"></div>
      </section>

      ${d.verwaltung === 'ja' ? `
      <section class="t-maeng-verw">
        <h3>Von der Verwaltung auszufüllen</h3>
        <div class="t-maeng-vzeilen">
          <div><span>Eingegangen am</span><i></i></div>
          <div><span>Auftrag an</span><i></i></div>
          <div><span>Erledigt am</span><i></i></div>
        </div>
      </section>` : ''}

      ${has(d.abgabe) ? `<p class="t-maeng-abgabe">${esc(d.abgabe)}</p>` : ''}

      <footer class="t-maeng-fuss">
        <div class="t-maeng-sig"><span></span><i>Datum, Unterschrift Mieter</i></div>
        <span class="t-maeng-mark">${istHotel(d.absender) ? logo('color', 22) : esc(abs.foot)}</span>
      </footer>`;
  }
};
