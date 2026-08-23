/* Notfallblatt · A4 hoch
   --------------------------------------------------------------------------
   Das Blatt neben dem Telefon und im Treppenhaus: die Notrufnummern gross,
   darunter das Verhalten im Brand- und im Unfallfall in nummerierten
   Schritten. Im Notfall liest niemand Fliesstext — man springt zur Nummer
   und zur ersten Handlung. Mehrsprachig, denn eine Panik kennt keine
   Fremdsprache.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const NOT_WORT = {
  de:{ titel:'Im Notfall', ruf:'Notrufnummern', brand:'Im Brandfall', unfall:'Bei Unfall oder Krankheit', ort:'Standort dieser Adresse' },
  en:{ titel:'In an emergency', ruf:'Emergency numbers', brand:'In case of fire', unfall:'Accident or illness', ort:'Address of this location' },
  fr:{ titel:'En cas d’urgence', ruf:'Numéros d’urgence', brand:'En cas d’incendie', unfall:'Accident ou maladie', ort:'Adresse de ce lieu' },
  it:{ titel:'In caso d’emergenza', ruf:'Numeri d’emergenza', brand:'In caso d’incendio', unfall:'Infortunio o malattia', ort:'Indirizzo di questo luogo' },
  pt:{ titel:'Em emergência', ruf:'Números de emergência', brand:'Em caso de incêndio', unfall:'Acidente ou doença', ort:'Endereço deste local' },
  es:{ titel:'En una emergencia', ruf:'Números de emergencia', brand:'En caso de incendio', unfall:'Accidente o enfermedad', ort:'Dirección de este lugar' }
};

export default {
  id:'notfallblatt',
  title:'Notfallblatt',
  sub:'Notrufnummern und Verhalten im Notfall · mehrsprachig · A4 hoch',
  badge:'Notfall',
  root:'t-notf',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="16" y="22" width="178" height="12" rx="5" fill="#C0271F"/>
    ${[0,1,2].map(i => `
      <rect x="${16 + i*60}" y="44" width="54" height="40" rx="5" fill="#C0271F" opacity=".12"/>
      <rect x="${26 + i*60}" y="52" width="20" height="14" rx="3" fill="#C0271F"/>
      <rect x="${26 + i*60}" y="72" width="34" height="6" rx="3" fill="#2A3350" opacity=".6"/>`).join('')}
    <rect x="16" y="100" width="60" height="8" rx="4" fill="#C0271F"/>
    ${[0,1,2].map(i => `
      <circle cx="22" cy="${124 + i*20}" r="6" fill="none" stroke="#2A3350" stroke-width="1.6"/>
      <rect x="34" y="${120 + i*20}" width="${150 - i*14}" height="7" rx="3.5" fill="#2A3350" opacity=".6"/>`).join('')}
    <rect x="16" y="196" width="60" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <circle cx="22" cy="${220 + i*20}" r="6" fill="none" stroke="#2A3350" stroke-width="1.6"/>
      <rect x="34" y="${216 + i*20}" width="${150 - i*20}" height="7" rx="3.5" fill="#2A3350" opacity=".6"/>`).join('')}`),

  fields:[
    { t:'group', label:'Notrufnummern' },
    { k:'nummern', label:'Nummern', type:'list', itemLabel:'Nummer', max:5,
      defaultItem:{ nr:'', was:'' },
      item:[
        { k:'nr',  label:'Nummer', type:'text' },
        { k:'was', label:'Wofür',  type:'text' }
      ] },

    { t:'group', label:'Im Brandfall' },
    { k:'brand', label:'Schritte', type:'list', itemLabel:'Schritt', max:6,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Schritt', type:'text' }] },

    { t:'group', label:'Bei Unfall oder Krankheit' },
    { k:'unfall', label:'Schritte', type:'list', itemLabel:'Schritt', max:6,
      defaultItem:{ text:'' },
      item:[{ k:'text', label:'Schritt', type:'text' }] },

    { t:'group', label:'Standort' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'sammelplatz', label:'Sammelplatz', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note', label:'Die Sprachen betreffen Titel und Überschriften. Nummern und Schritte schreiben Sie selbst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    nummern:[
      { nr:'118', was:'Feuerwehr' },
      { nr:'144', was:'Sanität' },
      { nr:'117', was:'Polizei' },
      { nr:'112', was:'Europa-Notruf' }
    ],
    brand:[
      { text:'Ruhe bewahren, andere warnen, Fluchtweg nehmen.' },
      { text:'Gebäude verlassen, keinen Lift benutzen.' },
      { text:'Feuerwehr 118 rufen, dann am Sammelplatz melden.' }
    ],
    unfall:[
      { text:'Sichern, nicht selbst in Gefahr bringen.' },
      { text:'Sanität 144 rufen: wo, was, wie viele Betroffene.' },
      { text:'Bei der verletzten Person bleiben, Anweisungen befolgen.' }
    ],
    objekt:'-',
    sammelplatz:'',
    sprachen:['de','en','fr'],
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
    const w = NOT_WORT[sprachen[0].id] || NOT_WORT.de;
    const weitere = sprachen.slice(1).map(sp => NOT_WORT[sp.id] || NOT_WORT.de);
    const alle = (feld) => esc([w[feld]].concat(weitere.map(m => m[feld])).join(' · '));

    const nummern = (d.nummern || []).filter(n => has(n.nr)).map(n => `
      <div class="t-notf-nr"><b>${esc(n.nr)}</b><span>${esc(n.was)}</span></div>`).join('');

    const schritte = (liste) => (liste || []).filter(s => has(s.text))
      .map(s => `<li>${esc(s.text)}</li>`).join('');

    return `
      <header class="t-notf-kopf">
        <span class="t-notf-ico">${icon('warn', 30, 2)}</span>
        <h1>${esc(w.titel)}</h1>
        ${weitere.length ? `<p class="t-notf-sprachen">${esc(weitere.map(m => m.titel).join(' · '))}</p>` : ''}
      </header>

      <section class="t-notf-nummern">
        <h2>${alle('ruf')}</h2>
        <div class="t-notf-nreihe">${nummern}</div>
      </section>

      <div class="t-notf-zwei">
        <section class="t-notf-block is-brand">
          <h3>${alle('brand')}</h3>
          <ol>${schritte(d.brand)}</ol>
        </section>
        <section class="t-notf-block">
          <h3>${alle('unfall')}</h3>
          <ol>${schritte(d.unfall)}</ol>
        </section>
      </div>

      <footer class="t-notf-fuss">
        <span class="t-notf-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([ort && (alle('ort') + ': ' + ort),
                     has(d.sammelplatz) && ('Sammelplatz: ' + d.sammelplatz),
                     abs.foot].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
