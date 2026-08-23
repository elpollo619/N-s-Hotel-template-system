/* Standort-Schild · A4 quer
   --------------------------------------------------------------------------
   Das Wegweiser-Schild für Sicherheit und Orientierung: ein grosses Symbol,
   ein grosser Pfeil, ein Wort. «Notausgang →», «← Erste Hilfe», «Sammelplatz
   ↑». Sicherheitsgrün für Rettungszeichen, Rot für Brandschutz — die
   Farbwelt der Norm, ohne sie eins zu eins zu kopieren.

   A4 quer, damit das Schild breit über einer Tür oder an einer Wand hängt.
*/
import { esc, has } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';

/* Zielarten: Symbol, Ton (grün = Rettung, rot = Brandschutz, navy = neutral)
   und der Text in sechs Sprachen. */
const ZIELE = {
  notausgang: { icon:'exit',        ton:'#1F9D57',
    de:'Notausgang', en:'Emergency exit', fr:'Sortie de secours', it:'Uscita di emergenza', pt:'Saída de emergência', es:'Salida de emergencia' },
  ersthilfe:  { icon:'firstaid',    ton:'#1F9D57',
    de:'Erste Hilfe', en:'First aid', fr:'Premiers secours', it:'Pronto soccorso', pt:'Primeiros socorros', es:'Primeros auxilios' },
  defi:       { icon:'defib',       ton:'#1F9D57',
    de:'Defibrillator', en:'Defibrillator', fr:'Défibrillateur', it:'Defibrillatore', pt:'Desfibrilhador', es:'Desfibrilador' },
  sammelplatz:{ icon:'sammelplatz', ton:'#1F9D57',
    de:'Sammelplatz', en:'Assembly point', fr:'Point de rassemblement', it:'Punto di raccolta', pt:'Ponto de encontro', es:'Punto de encuentro' },
  loescher:   { icon:'extinguisher',ton:'#C0271F',
    de:'Feuerlöscher', en:'Fire extinguisher', fr:'Extincteur', it:'Estintore', pt:'Extintor', es:'Extintor' },
  rezeption:  { icon:'reception',   ton:'#2A3350',
    de:'Rezeption', en:'Reception', fr:'Réception', it:'Reception', pt:'Receção', es:'Recepción' }
};

const STAND_PFEILE = { rechts:'arrowR', links:'arrowL', hoch:'arrowU', runter:'arrowD', kein:'' };

function zielOptions(){
  return Object.entries(ZIELE).map(([v, z]) => ({ v, t:z.de }));
}

export default {
  id:'standortschild',
  title:'Standort-Schild',
  sub:'Notausgang, Erste Hilfe, Sammelplatz … mit Pfeil · A4 quer',
  badge:'Wegweiser',
  root:'t-stand',
  page:'a4-land',
  fern:true,

  thumb: thumbLand(`
    <rect x="0" y="0" width="297" height="210" fill="#1F9D57"/>
    <rect x="30" y="60" width="70" height="90" rx="8" fill="#fff" opacity=".22"/>
    <path d="M50 105h40M78 90l14 15-14 15" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="130" y="80" width="120" height="20" rx="6" fill="#fff"/>
    <path d="M200 150h50M232 134l18 16-18 16" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),

  fields:[
    { t:'group', label:'Ziel' },
    { k:'ziel', label:'Was', type:'select', options:zielOptions() },
    { k:'eigenText', label:'Eigener Text', type:'text',
      hint:'Leer lassen: nimmt die Bezeichnung in der ersten gewählten Sprache.' },
    { k:'pfeil', label:'Pfeil', type:'select', options:[
      { v:'rechts', t:'nach rechts →' }, { v:'links', t:'nach links ←' },
      { v:'hoch', t:'geradeaus / hoch ↑' }, { v:'runter', t:'nach unten ↓' },
      { v:'kein', t:'kein Pfeil' } ] },
    { k:'pfeilSeite', label:'Pfeil steht', type:'select', options:[
      { v:'rechts', t:'rechts' }, { v:'links', t:'links' } ] },

    { t:'group', label:'Zusatz' },
    { k:'zusatz', label:'Zusatz', type:'text',
      hint:'z. B. «2. Stock», «hinter dem Lift», «beim Parkplatz».' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() }
  ],

  defaults:{
    ziel:'notausgang',
    eigenText:'',
    pfeil:'rechts',
    pfeilSeite:'rechts',
    zusatz:'',
    sprachen:['de','en'],
    sprachSet:''
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const z = ZIELE[d.ziel] || ZIELE.notausgang;
    const sprachen = sprachObjekte(d.sprachen);
    const haupt = has(d.eigenText) ? d.eigenText : (z[sprachen[0].id] || z.de);
    const weitere = has(d.eigenText) ? [] : sprachen.slice(1).map(sp => z[sp.id]).filter(Boolean);
    const pfeil = STAND_PFEILE[d.pfeil] || '';
    const pfeilEl = pfeil ? `<span class="t-stand-pfeil">${icon(pfeil, 150, 2.2)}</span>` : '';
    const seiteLinks = d.pfeilSeite === 'links';

    return `
      <div class="t-stand-schild${seiteLinks ? ' is-links' : ''}" style="--ton:${z.ton}">
        ${seiteLinks ? pfeilEl : ''}
        <div class="t-stand-mitte">
          <span class="t-stand-ico">${icon(z.icon, 120, 1.9)}</span>
          <div class="t-stand-text">
            <p class="t-stand-haupt">${esc(haupt)}</p>
            ${weitere.length ? `<p class="t-stand-weitere">${esc(weitere.join(' · '))}</p>` : ''}
            ${has(d.zusatz) ? `<p class="t-stand-zusatz">${esc(d.zusatz)}</p>` : ''}
          </div>
        </div>
        ${!seiteLinks ? pfeilEl : ''}
      </div>`;
  }
};
