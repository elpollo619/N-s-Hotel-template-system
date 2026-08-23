/* Hausordnung · A4 hoch
   --------------------------------------------------------------------------
   Die Hausordnung als eigener Aushang — nicht der Baustein-Zettel für einen
   einzelnen Hinweis, sondern das ganze Regelwerk, nummeriert, zum Aushängen
   im Treppenhaus. Kurz gehalten: eine Hausordnung, die niemand liest, weil
   sie zwei Seiten hat, wirkt nicht. Eine Seite, klare Punkte, ein
   freundlicher Schluss.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const HO_WORT = {
  de:{ titel:'Hausordnung', schluss:'Danke, dass wir aufeinander Rücksicht nehmen.' },
  en:{ titel:'House rules', schluss:'Thank you for your consideration.' },
  fr:{ titel:'Règlement de la maison', schluss:'Merci de votre égard mutuel.' },
  it:{ titel:'Regolamento della casa', schluss:'Grazie per il rispetto reciproco.' },
  pt:{ titel:'Regras da casa', schluss:'Obrigado pela consideração mútua.' },
  es:{ titel:'Normas de la casa', schluss:'Gracias por el respeto mutuo.' }
};

export default {
  id:'hausordnung',
  title:'Hausordnung',
  sub:'Das ganze Regelwerk als Aushang, nummeriert · A4 hoch',
  badge:'Hausordnung',
  root:'t-ho',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="110" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="52" width="80" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2,3,4,5,6].map(i => `
      <circle cx="30" cy="${92 + i*24}" r="7" fill="#01B1E2" opacity=".16"/>
      <rect x="44" y="${88 + i*24}" width="${144 - (i%4)*16}" height="7" rx="3.5" fill="#2A3350" opacity=".7"/>`).join('')}
    <rect x="24" y="272" width="130" height="6" rx="3" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Hausordnung» in der ersten gewählten Sprache.' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'lede',    label:'Einleitung', type:'textarea', rows:2 },

    { t:'group', label:'Regeln' },
    { k:'regeln', label:'Regeln', type:'list', itemLabel:'Regel', max:16,
      defaultItem:{ titel:'', text:'' },
      item:[
        { k:'titel', label:'Stichwort', type:'text' },
        { k:'text',  label:'Regel', type:'text' }
      ] },

    { t:'group', label:'Schluss' },
    { k:'schluss', label:'Schlusssatz', type:'text',
      hint:'Leer lassen: nimmt den freundlichen Standardsatz in den gewählten Sprachen.' },

    { t:'group', label:'Sprachen' },
    { t:'note', label:'Die Sprachen betreffen Titel und Schlusssatz. Die Regeln schreiben Sie selbst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Damit sich alle wohlfühlen',
    titel:'',
    objekt:'-',
    lede:'Diese Hausordnung gilt für alle Bewohnerinnen, Bewohner und Gäste. Sie ergänzt den Mietvertrag.',
    regeln:[
      { titel:'Ruhezeiten', text:'22:00 – 07:00 und 12:00 – 13:00 sowie sonntags: bitte Lärm vermeiden.' },
      { titel:'Treppenhaus', text:'Fluchtwege frei halten. Keine Schuhe, Kinderwagen oder Möbel im Gang.' },
      { titel:'Waschküche', text:'Nach Turnusplan benutzen und sauber hinterlassen.' },
      { titel:'Abfall', text:'Nur zu den Abfuhrtagen bereitstellen, korrekt getrennt zur Sammelstelle.' },
      { titel:'Parkieren', text:'Nur auf dem eigenen Platz. Besucher auf den Besucherplätzen.' },
      { titel:'Rauchen', text:'In Treppenhaus, Lift und gemeinsamen Räumen nicht gestattet.' },
      { titel:'Haustiere', text:'Erlaubt, solange niemand gestört wird. Verschmutzungen sofort entfernen.' },
      { titel:'Sicherheit', text:'Haustür geschlossen halten. Fremde nicht ins Haus lassen.' }
    ],
    schluss:'',
    sprachen:['de','en'],
    sprachSet:'',
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
    const w = HO_WORT[sprachen[0].id] || HO_WORT.de;
    const weitere = sprachen.slice(1).map(sp => HO_WORT[sp.id] || HO_WORT.de);
    const titel = has(d.titel) ? d.titel : w.titel;
    const schluss = has(d.schluss) ? d.schluss
      : [w.schluss].concat(weitere.map(m => m.schluss)).join(' · ');

    const regeln = (d.regeln || []).filter(r => has(r.text) || has(r.titel)).map((r, i) => `
      <li>
        <span class="t-ho-nr">${i + 1}</span>
        <span class="t-ho-txt">${has(r.titel) ? `<b>${esc(r.titel)}</b> ` : ''}${esc(r.text)}</span>
      </li>`).join('');

    return `
      <header class="t-ho-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
        ${weitere.length ? `<p class="t-ho-sprachen">${esc(weitere.map(m => m.titel).join(' · '))}</p>` : ''}
        ${ort ? `<p class="t-ho-ort">${esc(ort)}</p>` : ''}
        ${has(d.lede) ? `<p class="t-ho-lede">${esc(d.lede)}</p>` : ''}
      </header>

      <ol class="t-ho-liste">${regeln}</ol>

      ${schluss ? `<p class="t-ho-schluss">${esc(schluss)}</p>` : ''}

      <footer class="t-ho-fuss">
        <span class="t-ho-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc(abs.foot)}</span>
      </footer>`;
  }
};
