/* Termin-Aushang · A4 hoch
   --------------------------------------------------------------------------
   Heizungswartung, Liftkontrolle, Kaminfeger, Ablesung: jemand kommt ins
   Haus, und alle muessen es wissen. Das Datum ist darum das Groesste auf
   dem Blatt — wichtiger als der Anlass.

   Der Kasten «Was zu tun ist» ist der eigentliche Zweck. Ein Aushang, der
   nur einen Termin nennt, laesst die Frage offen, ob man zu Hause sein muss.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objektFusszeile, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/* Kopfzeilen in sechs Sprachen. Der Anlass selbst wird eingetippt — die
   Anlaesse sind zu verschieden, um sie zu hinterlegen. */
const TERMIN_WORT = {
  de:{ eyebrow:'Bitte beachten', wann:'Wann',   was:'Was zu tun ist', frage:'Fragen?' },
  en:{ eyebrow:'Please note',    wann:'When',   was:'What to do',     frage:'Questions?' },
  fr:{ eyebrow:'À noter',        wann:'Quand',  was:'À faire',        frage:'Questions?' },
  it:{ eyebrow:'Da notare',      wann:'Quando', was:'Cosa fare',      frage:'Domande?' },
  pt:{ eyebrow:'Atenção',        wann:'Quando', was:'O que fazer',    frage:'Dúvidas?' },
  es:{ eyebrow:'Atención',       wann:'Cuándo', was:'Qué hacer',      frage:'¿Preguntas?' }
};

export default {
  id:'termin',
  title:'Termin-Aushang',
  sub:'Wartung, Kontrolle, Ablesung · Datum gross · A4 hoch',
  badge:'Termin',
  root:'t-termin',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="24" y="28" width="80" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="48" width="158" height="17" rx="6" fill="#2A3350"/>
    <rect x="24" y="86" width="162" height="62" rx="8" fill="#2A3350"/>
    <rect x="40" y="102" width="46" height="7" rx="3.5" fill="#01B1E2"/>
    <rect x="40" y="116" width="118" height="18" rx="5" fill="#fff" opacity=".95"/>
    <rect x="24" y="168" width="162" height="66" rx="8" fill="#E7F7FC" stroke="#01B1E2" stroke-width="2"/>
    ${lines(38, 186, 130, 3, 14)}
    ${lines(24, 254, 150, 2, 12)}`),

  fields:[
    { t:'group', label:'Anlass' },
    { k:'anlass', label:'Was',   type:'text' },
    { k:'wer',    label:'Wer kommt', type:'text' },
    { k:'icon',   label:'Symbol', type:'select', options:iconOptions },

    { t:'group', label:'Datum und Zeit' },
    { k:'datum',  label:'Datum', type:'text',
      hint:'Frei geschrieben, damit «Montag, 8. September» genauso geht wie «8.–9. September».' },
    { k:'zeit',   label:'Zeit',  type:'text' },

    { t:'group', label:'Was zu tun ist' },
    { k:'punkte', label:'Punkte', type:'list', itemLabel:'Punkt', max:6,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Punkt', type:'textarea', rows:2 }] },

    { t:'group', label:'Rückfragen' },
    { k:'kontakt', label:'Wer Auskunft gibt', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen die Beschriftungen — «Wann», «Was zu tun ist». Anlass und Punkte stehen so da, wie du sie schreibst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    anlass:'Heizungswartung',
    wer:'Sanitär Meier AG',
    icon:'heating',
    datum:'Dienstag, 8. September',
    zeit:'08:00 – 12:00',
    punkte:[
      { text:'Bitte halten Sie den Zugang zum Heizungsraum frei.' },
      { text:'Wir betreten die Wohnungen nicht. Sie müssen nicht zu Hause sein.' },
      { text:'Während der Arbeiten kann das Warmwasser kurz ausfallen.' }
    ],
    kontakt:'Hans Amonn Immobilien',
    telefon:'+41 31 951 85 54',
    sprachen:['de','en'],
    sprachSet:'',
    objekt:'-',
    absender:'immobilien'
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const sprachen = sprachObjekte(d.sprachen);
    const w = TERMIN_WORT[sprachen[0].id] || TERMIN_WORT.de;
    const marken = sprachen.slice(1).map(sp => TERMIN_WORT[sp.id] || TERMIN_WORT.de);

    const punkte = (d.punkte || []).filter(p => has(p.text)).map(p => `
      <li>${esc(p.text)}</li>`).join('');

    return `
      <header class="t-termin-kopf">
        <div>
          <p class="eyebrow">${esc(w.eyebrow)}</p>
          <h1>${esc(d.anlass || '')}</h1>
          ${has(d.wer) ? `<p class="t-termin-wer">${esc(d.wer)}</p>` : ''}
        </div>
        <span class="t-termin-ico">${icon(d.icon || 'clock', 62, 1.8)}</span>
      </header>

      <div class="t-termin-wann">
        <span class="t-termin-label">${esc([w.wann].concat(marken.map(m => m.wann)).join(' · '))}</span>
        <strong>${esc(d.datum || '')}</strong>
        ${has(d.zeit) ? `<span class="t-termin-zeit">${esc(d.zeit)}</span>` : ''}
      </div>

      ${punkte ? `
      <section class="t-termin-tun">
        <h2>${esc([w.was].concat(marken.map(m => m.was)).join(' · '))}</h2>
        <ul>${punkte}</ul>
      </section>` : ''}

      ${(has(d.kontakt) || has(d.telefon)) ? `
      <p class="t-termin-frage">
        <b>${esc(w.frage)}</b>
        ${esc([d.kontakt, d.telefon].filter(Boolean).join(' · '))}
      </p>` : ''}

      <footer class="t-termin-fuss">
        <span class="t-termin-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
        <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
      </footer>`;
  }
};
