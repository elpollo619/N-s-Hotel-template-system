/* Wichtige Mitteilung · A4 hoch
   --------------------------------------------------------------------------
   Der Aushang, der auffallen muss: eine einzelne wichtige Nachricht, gross,
   mit Datum und — wenn nötig — einer Frist. Anders als der Textbaustein-
   Hinweis ist das keine Sammlung kleiner Regeln, sondern die eine Sache, die
   heute alle sehen sollen: «Wasser am Dienstag abgestellt», «Bitte Velos
   entfernen bis Freitag».
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const MIT_WORT = {
  de:{ eyebrow:'Wichtige Mitteilung', frist:'Bitte bis', frage:'Fragen?' },
  en:{ eyebrow:'Important notice', frist:'Please by', frage:'Questions?' },
  fr:{ eyebrow:'Information importante', frist:'Merci avant le', frage:'Questions?' },
  it:{ eyebrow:'Avviso importante', frist:'Entro il', frage:'Domande?' },
  pt:{ eyebrow:'Aviso importante', frist:'Até', frage:'Dúvidas?' },
  es:{ eyebrow:'Aviso importante', frist:'Antes del', frage:'¿Preguntas?' }
};

const MIT_TONE = { navy:'#2A3350', cyan:'#01B1E2', rot:'#C0271F', gelb:'#E8A93B' };

export default {
  id:'mitteilung',
  title:'Wichtige Mitteilung',
  sub:'Die eine Nachricht, die heute alle sehen sollen · A4 hoch',
  badge:'Mitteilung',
  root:'t-mit',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="70" fill="#C0271F"/>
    <rect x="24" y="24" width="120" height="10" rx="5" fill="#fff" opacity=".8"/>
    <rect x="24" y="42" width="90" height="14" rx="5" fill="#fff"/>
    <rect x="24" y="96" width="162" height="12" rx="5" fill="#2A3350"/>
    <rect x="24" y="118" width="140" height="12" rx="5" fill="#2A3350"/>
    ${[0,1,2].map(i => `<rect x="24" y="${150 + i*16}" width="${160 - i*20}" height="6" rx="3" fill="#2A3350" opacity=".4"/>`).join('')}
    <rect x="24" y="220" width="162" height="30" rx="6" fill="#E7F7FC" stroke="#01B1E2" stroke-width="2"/>`),

  fields:[
    { t:'group', label:'Ton' },
    { k:'ton', label:'Farbe des Kopfs', type:'select', options:[
      { v:'rot', t:'Rot — dringend' }, { v:'navy', t:'Navy — neutral' },
      { v:'cyan', t:'Cyan — freundlich' }, { v:'gelb', t:'Gelb — Achtung' } ] },

    { t:'group', label:'Nachricht' },
    { k:'eyebrow', label:'Kopfzeile', type:'text',
      hint:'Leer lassen: nimmt «Wichtige Mitteilung» in der ersten Sprache.' },
    { k:'titel', label:'Die Nachricht', type:'text' },
    { k:'datum', label:'Datum / gilt am', type:'text' },
    { k:'text', label:'Erläuterung', type:'textarea', rows:4 },

    { t:'group', label:'Frist' },
    { k:'frist', label:'Frist / bis wann', type:'text' },

    { t:'group', label:'Rückfragen' },
    { k:'kontakt', label:'Kontakt', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },

    { t:'group', label:'Objekt' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Sprachen' },
    { t:'note', label:'Die Sprachen betreffen Kopfzeile und Beschriftungen. Die Nachricht selbst schreiben Sie.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    ton:'rot',
    eyebrow:'',
    titel:'Wasser wird abgestellt',
    datum:'Dienstag, 9. September, 08:00 – 12:00',
    text:'Wegen einer Reparatur an der Steigleitung wird das Wasser im ganzen Haus vorübergehend abgestellt. Bitte drehen Sie danach den Hahn erst langsam wieder auf.',
    frist:'',
    kontakt:'Hans Amonn Immobilien',
    telefon:'+41 31 951 85 54',
    objekt:'-',
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
    const ton = MIT_TONE[d.ton] || MIT_TONE.rot;
    const hell = d.ton === 'gelb' ? '#2A3350' : '#fff';
    const sprachen = sprachObjekte(d.sprachen);
    const w = MIT_WORT[sprachen[0].id] || MIT_WORT.de;
    const weitere = sprachen.slice(1).map(sp => MIT_WORT[sp.id] || MIT_WORT.de);
    const eyebrow = has(d.eyebrow) ? d.eyebrow : w.eyebrow;
    const eyebrowW = has(d.eyebrow) ? [] : weitere.map(m => m.eyebrow);

    return `
      <div class="t-mit-band" style="--ton:${ton};--hell:${hell}">
        <span class="t-mit-ico">${icon('warn', 26, 2.1)}</span>
        <p class="t-mit-eyebrow">${esc(eyebrow)}${eyebrowW.length ? ` · ${esc(eyebrowW.join(' · '))}` : ''}</p>
      </div>

      <div class="t-mit-inhalt">
        <h1 class="t-mit-titel">${esc(d.titel || '')}</h1>
        ${has(d.datum) ? `<p class="t-mit-datum">${esc(d.datum)}</p>` : ''}
        ${has(d.text) ? `<p class="t-mit-text">${esc(d.text)}</p>` : ''}

        ${has(d.frist) ? `
        <div class="t-mit-frist">
          <span>${esc([w.frist].concat(weitere.map(m => m.frist)).join(' · '))}</span>
          <strong>${esc(d.frist)}</strong>
        </div>` : ''}

        ${(has(d.kontakt) || has(d.telefon)) ? `
        <p class="t-mit-frage"><b>${esc([w.frage].concat(weitere.map(m => m.frage)).join(' · '))}</b>
          ${esc([d.kontakt, d.telefon].filter(Boolean).join(' · '))}</p>` : ''}
      </div>

      <footer class="t-mit-fuss">
        <span class="t-mit-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([ort, abs.foot].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
