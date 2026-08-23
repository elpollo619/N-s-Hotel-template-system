/* Fundgegenstände · A4 hoch
   --------------------------------------------------------------------------
   Der Aushang am Schwarzen Brett: was gefunden wurde und wo man es abholt.
   Zwei Teile — oben, wo Verlorenes abzuholen ist (der feste Text, der immer
   gilt), unten eine Liste der aktuellen Fundstücke (die wechselt).

   Wer etwas vermisst, liest zuerst die Liste. Steht es nicht da, weiss er
   dank dem oberen Teil trotzdem, wo er fragen kann.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, objektFusszeile, objektOptions, absenderOptions } from '../objekte.js';

const FUND_WORT = {
  de:{ titel:'Fundgegenstände', liste:'Aktuell gefunden' },
  en:{ titel:'Lost & found',    liste:'Currently found' },
  fr:{ titel:'Objets trouvés',  liste:'Trouvés récemment' },
  it:{ titel:'Oggetti smarriti', liste:'Trovati di recente' },
  pt:{ titel:'Achados e perdidos', liste:'Encontrados' },
  es:{ titel:'Objetos perdidos', liste:'Encontrados' }
};

export default {
  id:'fundgegenstaende',
  title:'Fundgegenstände',
  sub:'Was gefunden wurde und wo man es abholt · A4 hoch',
  badge:'Fund',
  root:'t-fund',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="28" width="86" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="48" width="150" height="17" rx="6" fill="#2A3350"/>
    <circle cx="150" cy="112" r="20" fill="none" stroke="#01B1E2" stroke-width="4"/>
    <path d="M164 126l14 14" stroke="#01B1E2" stroke-width="4"/>
    <rect x="24" y="96" width="96" height="8" rx="4" fill="#2A3350" opacity=".8"/>
    <rect x="24" y="112" width="80" height="8" rx="4" fill="#2A3350" opacity=".5"/>
    <rect x="24" y="164" width="70" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${186 + i * 26}" width="162" height="18" rx="4" fill="#fff" stroke="#E5E8ED" stroke-width="1.5"/>
      <rect x="34" y="${192 + i * 26}" width="${86 - i*8}" height="7" rx="3.5" fill="#2A3350" opacity=".8"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Fundgegenstände» in der ersten Sprache.' },

    { t:'group', label:'Wo abholen' },
    { k:'wo',     label:'Abzuholen bei', type:'text' },
    { k:'zeiten', label:'Zu diesen Zeiten', type:'text' },
    { k:'text',   label:'Hinweis', type:'textarea', rows:2 },

    { t:'group', label:'Aktuelle Fundstücke' },
    { k:'listeAn', label:'Liste zeigen', type:'select', options:[
      { v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen — nur der obere Teil' } ] },
    { k:'stuecke', label:'Fundstücke', type:'list', itemLabel:'Fundstück', max:12,
      defaultItem:{ was:'', wo:'', wann:'' },
      item:[
        { k:'was',  label:'Was',       type:'text' },
        { k:'wo',   label:'Gefunden wo', type:'text' },
        { k:'wann', label:'Wann',      type:'text' }
      ] },

    { t:'group', label:'Rückfragen' },
    { k:'kontakt', label:'Kontakt', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen die Beschriftungen. Die Fundstücke schreiben Sie selbst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Etwas verloren?',
    titel:'',
    wo:'an der Rezeption',
    zeiten:'täglich 08:00 – 20:00',
    text:'Nicht abgeholte Fundstücke geben wir nach drei Monaten an eine gemeinnützige Sammelstelle.',
    listeAn:'ja',
    stuecke:[
      { was:'Regenschirm, dunkelblau', wo:'Aufenthaltsraum', wann:'12.08.' },
      { was:'Schlüsselbund mit rotem Anhänger', wo:'Parkplatz', wann:'15.08.' },
      { was:'Kinderjacke, Grösse 116', wo:'Garten', wann:'18.08.' }
    ],
    kontakt:'',
    telefon:'',
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
    const w = FUND_WORT[sprachen[0].id] || FUND_WORT.de;
    const weitere = sprachen.slice(1).map(sp => FUND_WORT[sp.id] || FUND_WORT.de);
    const titel = has(d.titel) ? d.titel : w.titel;
    const titelWeitere = weitere.map(m => m.titel);

    const stuecke = d.listeAn === 'ja'
      ? (d.stuecke || []).filter(s => has(s.was)).map(s => `
        <li>
          <span class="t-fund-ico">${icon('check', 18, 2)}</span>
          <span class="t-fund-txt">
            <b>${esc(s.was)}</b>
            ${(has(s.wo) || has(s.wann)) ? `<i>${esc([s.wo, s.wann].filter(Boolean).join(' · '))}</i>` : ''}
          </span>
        </li>`).join('')
      : '';

    return `
      <header class="t-fund-kopf">
        <div class="t-fund-titel">
          ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
          <h1>${esc(titel)}</h1>
          ${titelWeitere.length ? `<p class="t-fund-sprachen">${esc(titelWeitere.join(' · '))}</p>` : ''}
        </div>
        <span class="t-fund-lupe">${icon('lupe', 40, 1.8)}</span>
      </header>

      <div class="t-fund-wo">
        <p>${esc([w.titel, 'abzuholen', d.wo].filter(Boolean).join(' '))}${
          has(d.zeiten) ? ` · ${esc(d.zeiten)}` : ''}</p>
        ${has(d.text) ? `<p class="t-fund-hinweis">${esc(d.text)}</p>` : ''}
      </div>

      ${stuecke ? `
      <section class="t-fund-liste">
        <h2>${esc([w.liste].concat(weitere.map(m => m.liste)).join(' · '))}</h2>
        <ul>${stuecke}</ul>
      </section>` : ''}

      <footer class="t-fund-fuss">
        <span class="t-fund-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([d.kontakt, d.telefon, objektFusszeile(d.objekt, abs.foot)].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
