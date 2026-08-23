/* Umzugsanzeige · A4 hoch
   --------------------------------------------------------------------------
   «Am Samstag ziehe ich ein — der Lift ist zwischen 8 und 12 belegt, bitte
   entschuldigt den Lärm.» Der kurze Aushang im Treppenhaus, der aus einem
   Ärgernis eine angekündigte Sache macht. Freundlich, mehrsprachig, mit dem
   einen Satz, der zählt: wann der Lift oder der Hausgang belegt ist.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const UMZ_WORT = {
  de:{ ein:'Wir ziehen ein', aus:'Wir ziehen aus', wann:'Wann', was:'Was das bedeutet', sorry:'Bitte entschuldigen Sie den Lärm und die Umtriebe.' },
  en:{ ein:'We are moving in', aus:'We are moving out', wann:'When', was:'What this means', sorry:'Please excuse the noise and inconvenience.' },
  fr:{ ein:'Nous emménageons', aus:'Nous déménageons', wann:'Quand', was:'Ce que cela implique', sorry:'Merci d’excuser le bruit et le dérangement.' },
  it:{ ein:'Trasloco in arrivo', aus:'Trasloco in uscita', wann:'Quando', was:'Cosa comporta', sorry:'Vi preghiamo di scusare il rumore e il disturbo.' },
  pt:{ ein:'Vamos mudar para cá', aus:'Vamos mudar-nos', wann:'Quando', was:'O que isso significa', sorry:'Desculpe o barulho e o incómodo.' },
  es:{ ein:'Nos mudamos aquí', aus:'Nos mudamos', wann:'Cuándo', was:'Qué significa', sorry:'Disculpe las molestias y el ruido.' }
};

export default {
  id:'umzug',
  title:'Umzugsanzeige',
  sub:'Ein- oder Auszug ankündigen · Lift belegt · A4 hoch',
  badge:'Umzug',
  root:'t-umz',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="28" width="80" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="46" width="158" height="18" rx="6" fill="#2A3350"/>
    <path d="M150 96 128 108v26l22 12 22-12v-26z" fill="none" stroke="#01B1E2" stroke-width="3"/>
    <path d="M128 108 150 120l22-12M150 120v22" stroke="#01B1E2" stroke-width="3" fill="none"/>
    <rect x="24" y="96" width="86" height="52" rx="6" fill="#2A3350"/>
    <rect x="36" y="108" width="40" height="7" rx="3.5" fill="#01B1E2"/>
    <rect x="36" y="122" width="60" height="14" rx="4" fill="#fff" opacity=".9"/>
    <rect x="24" y="176" width="70" height="8" rx="4" fill="#01B1E2"/>
    <rect x="24" y="198" width="160" height="6" rx="3" fill="#2A3350" opacity=".6"/>
    <rect x="24" y="212" width="140" height="6" rx="3" fill="#2A3350" opacity=".6"/>`),

  fields:[
    { t:'group', label:'Art' },
    { k:'richtung', label:'Richtung', type:'select', options:[
      { v:'ein', t:'Einzug' }, { v:'aus', t:'Auszug' } ] },
    { k:'wer',  label:'Wer', type:'text', hint:'z. B. «Familie Muster, 3. OG» — oder leer lassen.' },

    { t:'group', label:'Wann' },
    { k:'datum', label:'Datum', type:'text' },
    { k:'zeit',  label:'Zeit',  type:'text' },

    { t:'group', label:'Was das bedeutet' },
    { k:'punkte', label:'Punkte', type:'list', itemLabel:'Punkt', max:6,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Punkt', type:'text' }] },

    { t:'group', label:'Kontakt' },
    { k:'kontakt', label:'Ansprechperson', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note', label:'Die Sprachen betreffen Titel, Beschriftungen und die Entschuldigung. Wer und Punkte stehen so da, wie du sie schreibst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    richtung:'ein',
    wer:'Familie Muster, 3. OG',
    datum:'Samstag, 4. Oktober',
    zeit:'08:00 – 13:00',
    punkte:[
      { text:'Der Lift ist in dieser Zeit für den Umzug belegt.' },
      { text:'Im Treppenhaus kann es kurz eng werden.' },
      { text:'Wir stellen alles wieder sauber hin.' }
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
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');
    const sprachen = sprachObjekte(d.sprachen);
    const w = UMZ_WORT[sprachen[0].id] || UMZ_WORT.de;
    const weitere = sprachen.slice(1).map(sp => UMZ_WORT[sp.id] || UMZ_WORT.de);
    const titelFeld = d.richtung === 'aus' ? 'aus' : 'ein';
    const alle = (feld) => esc([w[feld]].concat(weitere.map(m => m[feld])).join(' · '));

    const punkte = (d.punkte || []).filter(p => has(p.text)).map(p => `
      <li>${esc(p.text)}</li>`).join('');

    return `
      <header class="t-umz-kopf">
        <div>
          <p class="eyebrow">${esc(w[titelFeld])}</p>
          <h1>${esc(has(d.wer) ? d.wer : 'Umzug im Haus')}</h1>
          ${weitere.length ? `<p class="t-umz-sprachen">${esc(weitere.map(m => m[titelFeld]).join(' · '))}</p>` : ''}
        </div>
        <span class="t-umz-ico">${icon('paket', 40, 1.7)}</span>
      </header>

      <div class="t-umz-wann">
        <span class="t-umz-lab">${alle('wann')}</span>
        <strong>${esc(d.datum || '')}</strong>
        ${has(d.zeit) ? `<span class="t-umz-zeit">${esc(d.zeit)}</span>` : ''}
      </div>

      ${punkte ? `
      <section class="t-umz-was">
        <h2>${alle('was')}</h2>
        <ul>${punkte}</ul>
      </section>` : ''}

      <p class="t-umz-sorry">${esc(w.sorry)}</p>
      ${weitere.length ? `<ul class="t-umz-weitere">${
        weitere.map((m, i) => `<li lang="${sprachen[i + 1].id}">${esc(m.sorry)}</li>`).join('')}</ul>` : ''}

      ${(has(d.kontakt) || has(d.telefon)) ? `
      <p class="t-umz-kontakt">${esc([d.kontakt, d.telefon].filter(Boolean).join(' · '))}</p>` : ''}

      <footer class="t-umz-fuss">
        <span class="t-umz-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([ort, abs.foot].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
