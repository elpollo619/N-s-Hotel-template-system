/* Paketablage · A4 hoch
   --------------------------------------------------------------------------
   Wohin mit den Paketen? Der Bote klingelt, niemand ist da, das Paket steht
   im Weg oder verschwindet. Ein Schild an der Haustür regelt es: wo der Bote
   abgibt, wo der Empfänger abholt, was für Kühl- und Wertsachen gilt.

   Zwei Adressaten auf einem Blatt — der Bote (oben, kurz) und die
   Bewohnerschaft (unten, die Regeln). Darum sind es zwei getrennte Blöcke.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, objektFusszeile, objektOptions, absenderOptions } from '../objekte.js';

const PAKET_WORT = {
  de:{ titel:'Paketablage', bote:'Für die Zustellung', regeln:'Für die Abholung' },
  en:{ titel:'Parcel drop', bote:'For delivery',        regeln:'For pickup' },
  fr:{ titel:'Dépôt de colis', bote:'Pour la livraison', regeln:'Pour le retrait' },
  it:{ titel:'Deposito pacchi', bote:'Per la consegna',  regeln:'Per il ritiro' },
  pt:{ titel:'Entrega de encomendas', bote:'Para entrega', regeln:'Para recolha' },
  es:{ titel:'Depósito de paquetes', bote:'Para la entrega', regeln:'Para la recogida' }
};

export default {
  id:'paket',
  title:'Paketablage',
  sub:'Wo Pakete abgegeben und abgeholt werden · A4 hoch',
  badge:'Paket',
  root:'t-paket',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="28" width="86" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="48" width="150" height="17" rx="6" fill="#2A3350"/>
    <path d="M150 96 128 108v26l22 12 22-12v-26z" fill="none" stroke="#01B1E2" stroke-width="3"/>
    <path d="M128 108 150 120l22-12M150 120v22" stroke="#01B1E2" stroke-width="3" fill="none"/>
    <rect x="24" y="96" width="70" height="8" rx="4" fill="#2A3350" opacity=".8"/>
    <rect x="24" y="112" width="86" height="8" rx="4" fill="#2A3350" opacity=".5"/>
    <rect x="24" y="164" width="70" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <circle cx="30" cy="${192 + i * 24}" r="4" fill="#01B1E2"/>
      <rect x="42" y="${188 + i * 24}" width="${140 - i*12}" height="7" rx="3.5" fill="#2A3350" opacity=".7"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Paketablage» in der ersten Sprache.' },

    { t:'group', label:'Für die Zustellung' },
    { k:'bote',   label:'Wo abgeben', type:'textarea', rows:2,
      hint:'Der kurze Teil für den Boten.' },

    { t:'group', label:'Für die Abholung' },
    { k:'regeln', label:'Regeln', type:'list', itemLabel:'Regel', max:8,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Regel', type:'textarea', rows:2 }] },

    { t:'group', label:'Rückfragen' },
    { k:'kontakt', label:'Kontakt', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen Titel und Beschriftungen. Regeln und Ablage schreiben Sie selbst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Liebe Botin, lieber Bote',
    titel:'',
    bote:'Bitte Pakete beim Hauswartbüro im Erdgeschoss abgeben. Ist niemand da, im überdachten Windfang links neben der Haustür abstellen.',
    regeln:[
      { text:'Ihr Paket wartet im Windfang oder beim Hauswart — bitte am selben Tag holen.' },
      { text:'Kühl- und Wertsendungen werden nicht angenommen; diese bitte direkt an sich adressieren lassen.' },
      { text:'Die Ablage erfolgt auf eigenes Risiko. Wir übernehmen keine Haftung.' }
    ],
    kontakt:'Hauswart',
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
    const w = PAKET_WORT[sprachen[0].id] || PAKET_WORT.de;
    const weitere = sprachen.slice(1).map(sp => PAKET_WORT[sp.id] || PAKET_WORT.de);
    const titel = has(d.titel) ? d.titel : w.titel;
    const titelWeitere = weitere.map(m => m.titel);
    const alle = (feld) => esc([w[feld]].concat(weitere.map(m => m[feld])).join(' · '));

    const regeln = (d.regeln || []).filter(r => has(r.text)).map(r => `
      <li>${esc(r.text)}</li>`).join('');

    return `
      <header class="t-paket-kopf">
        <div class="t-paket-titel">
          ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
          <h1>${esc(titel)}</h1>
          ${titelWeitere.length ? `<p class="t-paket-sprachen">${esc(titelWeitere.join(' · '))}</p>` : ''}
        </div>
        <span class="t-paket-ico">${icon('paket', 40, 1.7)}</span>
      </header>

      ${has(d.bote) ? `
      <section class="t-paket-bote">
        <h2>${alle('bote')}</h2>
        <p>${esc(d.bote)}</p>
      </section>` : ''}

      ${regeln ? `
      <section class="t-paket-regeln">
        <h2>${alle('regeln')}</h2>
        <ul>${regeln}</ul>
      </section>` : ''}

      <footer class="t-paket-fuss">
        <span class="t-paket-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([d.kontakt, d.telefon, objektFusszeile(d.objekt, abs.foot)].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
