/* Bauarbeiten-Aushang · A4 hoch
   --------------------------------------------------------------------------
   Umbau, Sanierung, Gerüst, Malerarbeiten. Anders als der Termin-Aushang
   geht es hier nicht um eine Stunde, sondern um einen Zeitraum — und darum,
   dass es laut wird.

   Drei Dinge muessen drauf, sonst ruft die halbe Liegenschaft an:
   von wann bis wann, was genau, und wer es zu verantworten hat.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objektFusszeile, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const BAU_WORT = {
  de:{ eyebrow:'Bitte um Verständnis', von:'Von', bis:'Bis', betrifft:'Betroffen ist',
       sorry:'Wir halten den Lärm so kurz wie möglich und danken für Ihr Verständnis.' },
  en:{ eyebrow:'Please bear with us',  von:'From', bis:'Until', betrifft:'Affected',
       sorry:'We keep the noise as short as we can and thank you for your patience.' },
  fr:{ eyebrow:'Merci de votre compréhension', von:'Du', bis:'Au', betrifft:'Concerne',
       sorry:'Nous limitons le bruit autant que possible et vous remercions de votre patience.' },
  it:{ eyebrow:'Grazie per la comprensione', von:'Dal', bis:'Al', betrifft:'Riguarda',
       sorry:'Cerchiamo di limitare il rumore e vi ringraziamo per la pazienza.' },
  pt:{ eyebrow:'Agradecemos a compreensão', von:'De', bis:'Até', betrifft:'Afeta',
       sorry:'Vamos limitar o ruído ao mínimo e agradecemos a sua paciência.' },
  es:{ eyebrow:'Gracias por su comprensión', von:'Del', bis:'Al', betrifft:'Afecta a',
       sorry:'Limitaremos el ruido al mínimo y les agradecemos la paciencia.' }
};

export default {
  id:'bauarbeiten',
  title:'Bauarbeiten-Aushang',
  sub:'Umbau, Sanierung, Gerüst — von wann bis wann · A4 hoch',
  badge:'Bau',
  root:'t-bau',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="10" fill="#E8A93B"/>
    <rect x="24" y="34" width="94" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="54" width="156" height="18" rx="6" fill="#2A3350"/>
    <rect x="24" y="94" width="78" height="54" rx="7" fill="#2A3350"/>
    <rect x="108" y="94" width="78" height="54" rx="7" fill="#2A3350"/>
    <rect x="36" y="108" width="26" height="6" rx="3" fill="#01B1E2"/>
    <rect x="36" y="122" width="54" height="13" rx="4" fill="#fff" opacity=".95"/>
    <rect x="120" y="108" width="26" height="6" rx="3" fill="#01B1E2"/>
    <rect x="120" y="122" width="54" height="13" rx="4" fill="#fff" opacity=".95"/>
    <rect x="24" y="166" width="162" height="48" rx="7" fill="#FFF9E8" stroke="#F0E2B5" stroke-width="2"/>
    ${lines(38, 182, 128, 2, 14)}
    ${lines(24, 236, 150, 3, 13)}`),

  fields:[
    { t:'group', label:'Was und wann' },
    { k:'titel', label:'Was',  type:'text' },
    { k:'von',   label:'Von',  type:'text' },
    { k:'bis',   label:'Bis',  type:'text' },
    { k:'zeit',  label:'Arbeitszeiten', type:'text',
      hint:'Zum Beispiel «Mo–Fr 07:30 – 17:00, samstags keine lauten Arbeiten».' },

    { t:'group', label:'Betroffen und Folgen' },
    { k:'betrifft', label:'Betroffen ist', type:'text' },
    { k:'folgen', label:'Was das bedeutet', type:'list', itemLabel:'Punkt', max:6,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Punkt', type:'textarea', rows:2 }] },

    { t:'group', label:'Wer' },
    { k:'firma',   label:'Ausführende Firma', type:'text' },
    { k:'kontakt', label:'Auskunft bei',      type:'text' },
    { k:'telefon', label:'Telefon',           type:'text' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Sanierung der Fassade',
    von:'Montag, 15. September',
    bis:'Freitag, 24. Oktober',
    zeit:'Mo – Fr 07:30 – 17:00 · samstags keine lauten Arbeiten',
    betrifft:'Ostfassade und Balkone',
    folgen:[
      { text:'Ein Gerüst steht während der ganzen Zeit an der Fassade.' },
      { text:'Bitte halten Sie die Fenster an Arbeitstagen geschlossen.' },
      { text:'Die Balkone sind vorübergehend nicht benutzbar.' }
    ],
    firma:'',
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
    const w = BAU_WORT[sprachen[0].id] || BAU_WORT.de;
    const weitere = sprachen.slice(1).map(sp => BAU_WORT[sp.id] || BAU_WORT.de);

    const folgen = (d.folgen || []).filter(f => has(f.text))
      .map(f => `<li>${esc(f.text)}</li>`).join('');

    const zweisprachig = (feld) =>
      esc([w[feld]].concat(weitere.map(m => m[feld])).join(' · '));

    return `
      <div class="t-bau-band"></div>

      <header class="t-bau-kopf">
        <div>
          <p class="eyebrow">${esc(w.eyebrow)}</p>
          <h1>${esc(d.titel || '')}</h1>
          ${has(d.betrifft) ? `<p class="t-bau-betrifft">
            <span>${zweisprachig('betrifft')}</span> ${esc(d.betrifft)}</p>` : ''}
        </div>
        <span class="t-bau-ico">${icon('warn', 58, 1.8)}</span>
      </header>

      <div class="t-bau-zeitraum">
        <div class="t-bau-datum">
          <span>${zweisprachig('von')}</span>
          <strong>${esc(d.von || '')}</strong>
        </div>
        <div class="t-bau-datum">
          <span>${zweisprachig('bis')}</span>
          <strong>${esc(d.bis || '')}</strong>
        </div>
      </div>
      ${has(d.zeit) ? `<p class="t-bau-zeit">${esc(d.zeit)}</p>` : ''}

      ${folgen ? `<ul class="t-bau-folgen">${folgen}</ul>` : ''}

      <p class="t-bau-sorry">${esc(w.sorry)}</p>
      ${weitere.length ? `<ul class="t-bau-weitere">${
        weitere.map((m, i) => `<li lang="${sprachen[i + 1].id}">${esc(m.sorry)}</li>`).join('')}</ul>` : ''}

      ${(has(d.firma) || has(d.kontakt) || has(d.telefon)) ? `
      <p class="t-bau-wer">${esc([d.firma, d.kontakt, d.telefon].filter(Boolean).join(' · '))}</p>` : ''}

      <footer class="t-bau-fuss">
        <span class="t-bau-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
        <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
      </footer>`;
  }
};
