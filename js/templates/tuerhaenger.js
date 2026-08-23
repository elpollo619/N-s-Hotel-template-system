/* Türhänger · A4 hoch, zwei Stück nebeneinander
   --------------------------------------------------------------------------
   Der Klassiker an der Zimmertür: vorne «Bitte nicht stören», hinten «Zimmer
   bitte reinigen». Gedruckt wird beides nebeneinander auf ein Blatt — wer
   doppelseitig drucken kann, nimmt zwei Blätter; wer nicht, schneidet aus,
   klebt Rücken an Rücken und hat dasselbe.

   Die Masse sind echt: 90 × 220 mm, Loch 30 mm Durchmesser, 22 mm von oben.
   Damit passt der Hänger über jede gewöhnliche Türklinke.
*/
import { esc, has } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, absenderOptions } from '../objekte.js';
import { logo } from '../lib/brand.js';

/* Zwei Seiten, jede mit einem eigenen Ton. Die Texte stehen in allen sechs
   Sprachen; die deutsche Zeile ist die grosse, die übrigen stehen darunter. */
const HAENGER_SEITEN = {
  ruhe: {
    ton:'#2A3350', hell:'#fff', icon:'nodisturb',
    de:'Bitte nicht stören', en:'Do not disturb', fr:'Ne pas déranger',
    it:'Non disturbare',     pt:'Não incomodar',  es:'No molestar'
  },
  /* Weiss auf Cyan kommt nur auf 2.5:1 — die Kontrastpruefung der Zentrale
     meldet das zu Recht. Navy auf Cyan sind 5.5:1 und aus fuenf Metern
     deutlich besser zu lesen. */
  reinigen: {
    ton:'#01B1E2', hell:'#2A3350', icon:'putzen',
    de:'Zimmer bitte reinigen', en:'Please make up the room', fr:'Chambre à faire',
    it:'Rifare la camera',      pt:'Arrumar o quarto',        es:'Arreglar la habitación'
  },
  frei: {
    ton:'#1F9D57', hell:'#fff', icon:'check',
    de:'Zimmer ist frei', en:'Room is free', fr:'Chambre libre',
    it:'Camera libera',   pt:'Quarto livre', es:'Habitación libre'
  },
  wecken: {
    ton:'#E8A93B', hell:'#2A3350', icon:'clock',
    de:'Bitte nicht wecken', en:'Do not wake', fr:'Ne pas réveiller',
    it:'Non svegliare',      pt:'Não acordar', es:'No despertar'
  }
};

function haengerOptions(){
  return [
    { v:'ruhe',     t:'Bitte nicht stören (navy)' },
    { v:'reinigen', t:'Zimmer bitte reinigen (cyan)' },
    { v:'frei',     t:'Zimmer ist frei (grün)' },
    { v:'wecken',   t:'Bitte nicht wecken (gelb)' }
  ];
}

function haenger(d, art, eigenerText){
  const s = HAENGER_SEITEN[art] || HAENGER_SEITEN.ruhe;
  const sprachen = sprachObjekte(d.sprachen);
  const haupt = has(eigenerText) ? eigenerText : (s[sprachen[0].id] || s.de);
  const weitere = sprachen.slice(1).map(sp => s[sp.id]).filter(Boolean);

  return `
    <div class="t-tuer-karte" style="--ton:${s.ton};--hell:${s.hell}">
      <div class="t-tuer-loch"></div>
      <div class="t-tuer-inhalt">
        <span class="t-tuer-ico">${icon(s.icon, 64, 1.7)}</span>
        <p class="t-tuer-haupt">${esc(haupt)}</p>
        ${weitere.length ? `<ul class="t-tuer-weitere">${
          weitere.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
      </div>
      ${d.markeAn === 'ja' ? `<div class="t-tuer-fuss">${
        istHotel(d.absender) ? logo(s.hell === '#fff' ? 'white' : 'color', 20)
                             : esc(absender(d.absender, 'hotel').name)}</div>` : ''}
    </div>`;
}

export default {
  id:'tuerhaenger',
  title:'Türhänger',
  sub:'Bitte nicht stören · zwei Stück auf A4 zum Ausschneiden',
  badge:'Zimmer',
  root:'t-tuer',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="16" y="20" width="82" height="260" rx="8" fill="#2A3350"/>
    <circle cx="57" cy="52" r="15" fill="#fff"/>
    <circle cx="57" cy="150" r="22" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
    <rect x="26" y="192" width="62" height="9" rx="4.5" fill="#fff" opacity=".95"/>
    <rect x="32" y="208" width="50" height="6" rx="3" fill="#fff" opacity=".5"/>
    <rect x="32" y="220" width="50" height="6" rx="3" fill="#fff" opacity=".5"/>
    <rect x="112" y="20" width="82" height="260" rx="8" fill="#01B1E2"/>
    <circle cx="153" cy="52" r="15" fill="#fff"/>
    <circle cx="153" cy="150" r="22" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
    <rect x="122" y="192" width="62" height="9" rx="4.5" fill="#fff" opacity=".95"/>
    <rect x="128" y="208" width="50" height="6" rx="3" fill="#fff" opacity=".5"/>`),

  fields:[
    { t:'group', label:'Die beiden Seiten' },
    { k:'links',  label:'Linker Hänger',  type:'select', options:haengerOptions() },
    { k:'rechts', label:'Rechter Hänger', type:'select', options:haengerOptions() },
    { k:'textLinks',  label:'Linker Text — überschreiben', type:'text',
      hint:'Leer lassen: der hinterlegte Satz gilt, in der ersten gewählten Sprache.' },
    { k:'textRechts', label:'Rechter Text — überschreiben', type:'text' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen', label:'Sprachen', type:'checks', options:sprachOptions(),
      hint:'Die erste steht gross, die übrigen darunter. Mehr als vier wird auf dem schmalen Hänger eng.' },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Marke' },
    { k:'markeAn',  label:'Marke unten', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions },
    { k:'schneiden', label:'Schnittlinien', type:'select',
      options:[{ v:'ja', t:'zeigen — Hilfslinien zum Ausschneiden' }, { v:'nein', t:'weglassen' }] }
  ],

  defaults:{
    links:'ruhe',
    rechts:'reinigen',
    textLinks:'',
    textRechts:'',
    sprachen:['de','en','fr'],
    sprachSet:'',
    markeAn:'ja',
    absender:'hotel',
    schneiden:'ja'
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    return `
      <div class="t-tuer-bogen${d.schneiden === 'ja' ? ' is-schneiden' : ''}">
        ${haenger(d, d.links,  d.textLinks)}
        ${haenger(d, d.rechts, d.textRechts)}
      </div>
      <p class="t-tuer-hinweis">
        90 × 220 mm · Loch 30 mm — ausschneiden, Rücken an Rücken kleben, über die Klinke hängen.
      </p>`;
  }
};
