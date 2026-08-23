/* Veranstaltungsplakat · A4 hoch
   --------------------------------------------------------------------------
   Apéro auf der Terrasse, Weihnachtsmarkt im Hof, Sommerfest für die
   Mieterschaft. Ein Plakat, das aus dem Vorbeigehen wirkt: der Anlass gross,
   das Datum als Block, der Ort darunter — und Platz für ein Programm.

   Das Datum steht im farbigen Block, damit es auch aus fünf Metern zu
   erkennen ist. Wer näher kommt, liest das Programm.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, objektFusszeile, objektOptions, absenderOptions } from '../objekte.js';

/* Der Einladungsgruss oben, sechssprachig. Der Anlass selbst wird getippt. */
const EVENT_WORT = {
  de:{ ein:'Herzlich willkommen', wann:'Wann', wo:'Wo',   prog:'Programm' },
  en:{ ein:'You are invited',      wann:'When', wo:'Where', prog:'Programme' },
  fr:{ ein:'Bienvenue',            wann:'Quand', wo:'Où',   prog:'Programme' },
  it:{ ein:'Benvenuti',            wann:'Quando', wo:'Dove', prog:'Programma' },
  pt:{ ein:'Bem-vindos',           wann:'Quando', wo:'Onde', prog:'Programa' },
  es:{ ein:'Bienvenidos',          wann:'Cuándo', wo:'Dónde', prog:'Programa' }
};

export default {
  id:'veranstaltung',
  title:'Veranstaltungsplakat',
  sub:'Apéro, Fest, Markt · Datum als Block · A4 hoch',
  badge:'Anlass',
  root:'t-event',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="24" y="26" width="86" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="46" width="150" height="20" rx="6" fill="#2A3350"/>
    <rect x="24" y="70" width="120" height="20" rx="6" fill="#2A3350"/>
    <rect x="24" y="110" width="80" height="70" rx="8" fill="#01B1E2"/>
    <rect x="38" y="126" width="52" height="10" rx="5" fill="#fff"/>
    <rect x="38" y="146" width="34" height="20" rx="4" fill="#fff"/>
    <rect x="116" y="118" width="70" height="8" rx="4" fill="#2A3350" opacity=".8"/>
    <rect x="116" y="134" width="58" height="6" rx="3" fill="#C9CFDA"/>
    ${lines(24, 200, 150, 3, 16)}`),

  fields:[
    { t:'group', label:'Anlass' },
    { k:'gruss',  label:'Handschrift-Zeile', type:'text',
      hint:'Leer lassen: nimmt «Herzlich willkommen» in der ersten Sprache.' },
    { k:'titel',  label:'Name des Anlasses', type:'text' },
    { k:'unter',  label:'Untertitel', type:'text' },

    { t:'group', label:'Wann und wo' },
    { k:'datum',  label:'Datum', type:'text' },
    { k:'zeit',   label:'Zeit',  type:'text' },
    { k:'ort',    label:'Ort',   type:'text' },

    { t:'group', label:'Programm' },
    { k:'punkte', label:'Punkte', type:'list', itemLabel:'Punkt', max:8,
      defaultItem:{ zeit:'', text:'' },
      item:[
        { k:'zeit', label:'Zeit', type:'text' },
        { k:'text', label:'Was',  type:'text' }
      ] },
    { k:'text', label:'Fliesstext statt Programm', type:'textarea', rows:3 },

    { t:'group', label:'Anmeldung' },
    { k:'anmeldung', label:'Hinweis zur Anmeldung', type:'text' },
    { k:'qrText',    label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code.' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen Gruss und Beschriftungen. Anlass und Programm stehen so da, wie du sie schreibst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    gruss:'',
    titel:'Sommer-Apéro',
    unter:'Wir stossen mit Ihnen auf den Sommer an.',
    datum:'Freitag, 27. Juni',
    zeit:'ab 18:00',
    ort:'auf der Terrasse',
    punkte:[
      { zeit:'18:00', text:'Apéro und Begrüssung' },
      { zeit:'19:00', text:'Grill vom Hof' },
      { zeit:'21:00', text:'Musik' }
    ],
    text:'',
    anmeldung:'Keine Anmeldung nötig — kommen Sie einfach vorbei.',
    qrText:'',
    sprachen:['de','en'],
    sprachSet:'',
    objekt:'A14',
    absender:'hotel'
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const sprachen = sprachObjekte(d.sprachen);
    const w = EVENT_WORT[sprachen[0].id] || EVENT_WORT.de;
    const gruss = has(d.gruss) ? d.gruss : w.ein;

    const punkte = (d.punkte || []).filter(p => has(p.text)).map(p => `
      <li>
        ${has(p.zeit) ? `<span class="t-event-pz">${esc(p.zeit)}</span>` : '<span class="t-event-pz"></span>'}
        <span class="t-event-pt">${esc(p.text)}</span>
      </li>`).join('');

    const qr = has(d.qrText)
      ? `<div class="t-event-qr">${qrSvg(d.qrText, { stufe:'M', groesse:'24mm' })}</div>`
      : '';

    return `
      <header class="t-event-kopf">
        <p class="eyebrow">${esc(gruss)}</p>
        <h1>${esc(d.titel || '')}</h1>
        ${has(d.unter) ? `<p class="t-event-unter">${esc(d.unter)}</p>` : ''}
      </header>

      <div class="t-event-fakten">
        <div class="t-event-datum">
          <span>${esc(w.wann)}</span>
          <strong>${esc(d.datum || '')}</strong>
          ${has(d.zeit) ? `<em>${esc(d.zeit)}</em>` : ''}
        </div>
        ${has(d.ort) ? `<p class="t-event-ort">
          <span class="t-event-ico">${icon('flag', 22, 1.9)}</span>
          <span><i>${esc(w.wo)}</i> ${esc(d.ort)}</span></p>` : ''}
      </div>

      ${punkte ? `
      <section class="t-event-prog">
        <h2>${esc(w.prog)}</h2>
        <ul>${punkte}</ul>
      </section>` : ''}
      ${has(d.text) ? `<p class="t-event-text">${esc(d.text)}</p>` : ''}

      <footer class="t-event-fuss">
        ${qr}
        <div class="t-event-fusstext">
          ${has(d.anmeldung) ? `<p class="t-event-anm">${esc(d.anmeldung)}</p>` : ''}
          <p class="t-event-abs">
            <span class="t-event-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
            <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
          </p>
        </div>
      </footer>`;
  }
};
