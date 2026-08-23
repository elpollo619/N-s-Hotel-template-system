/* Ruhezeiten · A4 hoch
   --------------------------------------------------------------------------
   Der freundliche Aushang im Treppenhaus: wann Ruhe gilt. Nacht-, Mittags-
   und Sonntagsruhe, gross und in mehreren Sprachen — denn Rücksicht scheitert
   oft nur an der Sprache. Kein erhobener Zeigefinger: ein Bild von Ruhe, das
   die Zeiten klar nennt und mit einem Dank endet.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const RUHE_WORT = {
  de:{ titel:'Ruhezeiten', dank:'Danke für Ihre Rücksicht.' },
  en:{ titel:'Quiet hours', dank:'Thank you for your consideration.' },
  fr:{ titel:'Heures de repos', dank:'Merci de votre égard.' },
  it:{ titel:'Orari di quiete', dank:'Grazie per il rispetto.' },
  pt:{ titel:'Horário de silêncio', dank:'Obrigado pela sua consideração.' },
  es:{ titel:'Horas de silencio', dank:'Gracias por su consideración.' }
};

export default {
  id:'ruhezeiten',
  title:'Ruhezeiten',
  sub:'Nacht-, Mittags- und Sonntagsruhe · mehrsprachig · A4 hoch',
  badge:'Ruhe',
  root:'t-ruhe',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <circle cx="105" cy="70" r="34" fill="none" stroke="#01B1E2" stroke-width="4"/>
    <path d="M118 58a15 15 0 1 1-16-9 12 12 0 0 0 16 9z" fill="#2A3350"/>
    <rect x="60" y="122" width="90" height="14" rx="5" fill="#2A3350"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${158 + i*34}" width="162" height="26" rx="5" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="1.4"/>
      <rect x="36" y="${167 + i*34}" width="60" height="8" rx="4" fill="#2A3350" opacity=".8"/>
      <rect x="130" y="${167 + i*34}" width="44" height="8" rx="4" fill="#01B1E2"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Ruhezeiten» in der ersten gewählten Sprache.' },

    { t:'group', label:'Zeiten' },
    { k:'zeilen', label:'Zeiten', type:'list', itemLabel:'Zeile', max:6,
      defaultItem:{ icon:'quiet', was:'', zeit:'' },
      item:[
        { k:'icon', label:'Symbol', type:'select', options:[
          { v:'quiet', t:'Ruhe' }, { v:'clock', t:'Uhr' }, { v:'bed', t:'Nacht' },
          { v:'cup', t:'Mittag' }, { v:'sonne', t:'Sonntag' }, { v:'info', t:'anderes' } ] },
        { k:'was',  label:'Bezeichnung', type:'text' },
        { k:'zeit', label:'Zeit', type:'text' }
      ] },

    { t:'group', label:'Hinweis' },
    { k:'hinweis', label:'Hinweis', type:'textarea', rows:2 },

    { t:'group', label:'Sprachen' },
    { t:'note', label:'Die Sprachen betreffen Titel und Dank. Die Zeiten sind Zahlen — die versteht jede Sprache.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Bitte um Rücksicht',
    titel:'',
    zeilen:[
      { icon:'bed',   was:'Nachtruhe', zeit:'22:00 – 07:00' },
      { icon:'cup',   was:'Mittagsruhe', zeit:'12:00 – 13:00' },
      { icon:'sonne', was:'Sonn- und Feiertage', zeit:'ganztags' }
    ],
    hinweis:'Waschen, Staubsaugen, Bohren und laute Musik bitte ausserhalb dieser Zeiten. Bei Festen die Nachbarn kurz vorinformieren.',
    sprachen:['de','en','fr'],
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
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');
    const sprachen = sprachObjekte(d.sprachen);
    const w = RUHE_WORT[sprachen[0].id] || RUHE_WORT.de;
    const weitere = sprachen.slice(1).map(sp => RUHE_WORT[sp.id] || RUHE_WORT.de);
    const titel = has(d.titel) ? d.titel : w.titel;

    const zeilen = (d.zeilen || []).filter(z => has(z.was) || has(z.zeit)).map(z => `
      <li>
        <span class="t-ruhe-ico">${icon(z.icon || 'quiet', 24, 1.9)}</span>
        <span class="t-ruhe-was">${esc(z.was)}</span>
        <span class="t-ruhe-zeit">${esc(z.zeit)}</span>
      </li>`).join('');

    return `
      <header class="t-ruhe-kopf">
        <span class="t-ruhe-symbol">${icon('quiet', 46, 1.7)}</span>
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
        ${weitere.length ? `<p class="t-ruhe-sprachen">${esc(weitere.map(m => m.titel).join(' · '))}</p>` : ''}
      </header>

      <ul class="t-ruhe-liste">${zeilen}</ul>

      ${has(d.hinweis) ? `<p class="t-ruhe-hinweis">${esc(d.hinweis)}</p>` : ''}
      <p class="t-ruhe-dank">${esc([w.dank].concat(weitere.map(m => m.dank)).join(' · '))}</p>

      <footer class="t-ruhe-fuss">
        <span class="t-ruhe-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([ort, abs.foot].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
