/* Protokoll · A4 hoch
   --------------------------------------------------------------------------
   Das Sitzungsprotokoll: was besprochen und beschlossen wurde. Gehört zur
   Hausversammlung wie die Traktandenliste — ohne Protokoll gilt ein Beschluss
   später als nicht gefasst. Kopf mit Datum, Ort, Anwesenden; dann je
   Traktandum ein Feld für Beschluss und Verantwortliche.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'protokoll',
  title:'Protokoll',
  sub:'Sitzungs- und Versammlungsprotokoll · A4 hoch',
  badge:'Protokoll',
  root:'t-prot',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="110" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="54" width="162" height="22" rx="4" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="1.4"/>
    ${[0,1,2,3].map(i => `
      <rect x="24" y="${92 + i*40}" width="36" height="7" rx="3.5" fill="#01B1E2"/>
      <rect x="24" y="${106 + i*40}" width="162" height="22" rx="4" fill="#fff" stroke="#E5E8ED" stroke-width="1.4"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'titel', label:'Titel', type:'text' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Rahmen' },
    { k:'kopf', label:'Kopfzeilen', type:'text',
      hint:'Kommagetrennt — je eine Schreiblinie (Datum, Ort, Vorsitz, Protokoll, Anwesende …).' },

    { t:'group', label:'Traktanden' },
    { t:'note', label:'Für jedes Traktandum bleibt ein Feld für Beschluss und Verantwortliche frei.' },
    { k:'traktanden', label:'Traktanden', type:'list', itemLabel:'Traktandum', max:10,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Traktandum', type:'text' }] },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Protokoll',
    objekt:'-',
    kopf:'Datum, Ort, Vorsitz, Protokollführung, Anwesend / vertreten',
    traktanden:[
      { text:'Begrüssung und Beschlussfähigkeit' },
      { text:'Jahresrechnung und Revisionsbericht' },
      { text:'Budget und Erneuerungsfonds' },
      { text:'Anstehende Arbeiten' },
      { text:'Wahlen' },
      { text:'Verschiedenes' }
    ],
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const kopf = String(d.kopf || '').split(',').map(s => s.trim()).filter(Boolean).map(k => `
      <div class="t-prot-kz"><span>${esc(k)}</span><i></i></div>`).join('');

    const traktanden = (d.traktanden || []).filter(t => has(t.text)).map((t, i) => `
      <section class="t-prot-trakt">
        <h2><span class="t-prot-nr">${i + 1}</span>${esc(t.text)}</h2>
        <div class="t-prot-feld"></div>
      </section>`).join('');

    return `
      <header class="t-prot-kopf">
        <div>
          <h1>${esc(d.titel || 'Protokoll')}</h1>
          ${ort ? `<p class="t-prot-ort">${esc(ort)}</p>` : ''}
        </div>
        <span class="t-prot-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
      </header>

      ${kopf ? `<div class="t-prot-rahmen">${kopf}</div>` : ''}

      ${traktanden}

      <footer class="t-prot-fuss">
        <div class="t-prot-sig"><span></span><i>Vorsitz</i></div>
        <div class="t-prot-sig"><span></span><i>Protokollführung</i></div>
      </footer>
      <p class="t-prot-abs">${esc(abs.foot)}</p>`;
  }
};
