/* Ausser Betrieb · A4 hoch
   --------------------------------------------------------------------------
   Der Lift steht, die Waschmaschine Nr. 2 ist defekt, die Sauna bleibt heute
   kalt. Ein Schild, das sofort verstanden werden muss — darum steht «AUSSER
   BETRIEB» ganz oben und in vier Sprachen, bevor überhaupt steht, was gemeint
   ist.

   Der zweite Teil ist der wichtige: was stattdessen gilt. Ein Schild, das nur
   «kaputt» sagt, lässt die Leute ratlos davor stehen.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, objektFusszeile, objektOptions, absenderOptions } from '../objekte.js';

const OOB_WORT = {
  de:{ titel:'Ausser Betrieb', seit:'Seit', bis:'Voraussichtlich bis', statt:'Bitte benutzen Sie' },
  en:{ titel:'Out of order',   seit:'Since', bis:'Expected until',      statt:'Please use' },
  fr:{ titel:'Hors service',   seit:'Depuis', bis:'Jusqu’à',            statt:'Veuillez utiliser' },
  it:{ titel:'Fuori servizio', seit:'Dal',   bis:'Fino a',             statt:'Si prega di usare' },
  pt:{ titel:'Fora de serviço', seit:'Desde', bis:'Previsto até',       statt:'Utilize por favor' },
  es:{ titel:'Fuera de servicio', seit:'Desde', bis:'Hasta',           statt:'Utilice por favor' }
};

export default {
  id:'ausserbetrieb',
  title:'Ausser Betrieb',
  sub:'Lift, Maschine, Anlage steht · vier Sprachen · A4 hoch',
  badge:'Störung',
  root:'t-oob',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="16" y="24" width="178" height="120" rx="10" fill="#C0271F"/>
    <circle cx="105" cy="60" r="18" fill="none" stroke="#fff" stroke-width="4"/>
    <path d="M99 54 111 66M111 54 99 66" stroke="#fff" stroke-width="4"/>
    <rect x="46" y="92" width="118" height="16" rx="5" fill="#fff"/>
    <rect x="64" y="118" width="82" height="9" rx="4.5" fill="#fff" opacity=".7"/>
    <rect x="16" y="164" width="178" height="96" rx="10" fill="#E7F7FC" stroke="#01B1E2" stroke-width="2"/>
    <rect x="34" y="182" width="60" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="34" y="202" width="140" height="8" rx="4" fill="#2A3350" opacity=".7"/>
    <rect x="34" y="218" width="120" height="8" rx="4" fill="#2A3350" opacity=".7"/>`),

  fields:[
    { t:'group', label:'Was steht still' },
    { k:'was',   label:'Was', type:'text',
      hint:'Zum Beispiel «Der Lift», «Waschmaschine Nr. 2», «Die Sauna».' },
    { k:'grund', label:'Grund', type:'text',
      hint:'Freiwillig. «wegen einer Reparatur», «wegen Wartung».' },

    { t:'group', label:'Wie lange' },
    { k:'seit', label:'Seit', type:'text' },
    { k:'bis',  label:'Voraussichtlich bis', type:'text' },

    { t:'group', label:'Was stattdessen gilt' },
    { k:'statt', label:'Bitte benutzen Sie', type:'text',
      hint:'Der wichtigste Teil. «die Treppe», «Waschmaschine Nr. 1».' },
    { k:'zusatz', label:'Zusatz', type:'textarea', rows:2 },

    { t:'group', label:'Rückfragen' },
    { k:'kontakt', label:'Wer Auskunft gibt', type:'text' },
    { k:'telefon', label:'Telefon', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen «Ausser Betrieb» und die Beschriftungen. Was und Grund stehen so da, wie du sie schreibst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    was:'Der Lift',
    grund:'wegen einer Reparatur',
    seit:'Montag, 8. September',
    bis:'voraussichtlich Mittwoch',
    statt:'die Treppe',
    zusatz:'Wir bitten um Ihr Verständnis und arbeiten an einer raschen Behebung.',
    kontakt:'Hans Amonn Immobilien',
    telefon:'+41 31 951 85 54',
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
    const sprachen = sprachObjekte(d.sprachen);
    const w = OOB_WORT[sprachen[0].id] || OOB_WORT.de;
    const weitere = sprachen.slice(1).map(sp => OOB_WORT[sp.id] || OOB_WORT.de);
    const alle = (feld) => esc([w[feld]].concat(weitere.map(m => m[feld])).join(' · '));

    return `
      <div class="t-oob-schild">
        <span class="t-oob-ico">${icon('cross', 46, 2.4)}</span>
        <p class="t-oob-titel">${esc(w.titel)}</p>
        ${weitere.length ? `<p class="t-oob-titel2">${esc(weitere.map(m => m.titel).join(' · '))}</p>` : ''}
        <p class="t-oob-was">${esc(d.was || '')}${has(d.grund) ? ` <span>${esc(d.grund)}</span>` : ''}</p>
      </div>

      ${(has(d.seit) || has(d.bis)) ? `
      <div class="t-oob-zeit">
        ${has(d.seit) ? `<div><span>${alle('seit')}</span><strong>${esc(d.seit)}</strong></div>` : ''}
        ${has(d.bis)  ? `<div><span>${alle('bis')}</span><strong>${esc(d.bis)}</strong></div>` : ''}
      </div>` : ''}

      ${has(d.statt) ? `
      <div class="t-oob-statt">
        <span class="t-oob-ico2">${icon('info', 26, 1.9)}</span>
        <p><i>${alle('statt')}</i> <b>${esc(d.statt)}</b></p>
      </div>` : ''}
      ${has(d.zusatz) ? `<p class="t-oob-zusatz">${esc(d.zusatz)}</p>` : ''}

      ${(has(d.kontakt) || has(d.telefon)) ? `
      <p class="t-oob-kontakt">${esc([d.kontakt, d.telefon].filter(Boolean).join(' · '))}</p>` : ''}

      <footer class="t-oob-fuss">
        <span class="t-oob-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
      </footer>`;
  }
};
