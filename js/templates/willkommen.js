/* Willkommenskarte · A5 hoch
   --------------------------------------------------------------------------
   Die Karte, die auf dem Bett oder auf dem Tisch liegt, wenn jemand ankommt.
   Sie erklärt nichts — dafür gibt es die Mappe. Sie sagt nur: wir haben an
   Sie gedacht.

   Darum steht der Name des Gastes gross und die Handschrift-Zeile darüber.
   Alles andere ist klein.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/* Symbolliste mit einem leeren Eintrag davor — die Hinweiszeile darf auch
   ohne Zeichen stehen. */
function willkIconOptions(){
  return [{ v:'', t:'kein Symbol' }].concat(iconOptions());
}

/* Der Grusstext in sechs Sprachen. %s wird durch den Namen ersetzt; steht
   kein Name da, faellt die Anrede weg. */
const WILLKOMMEN = {
  de:{ gruss:'Herzlich willkommen',  anrede:'Liebe Gäste',
       text:'Schön, dass Sie da sind. Wir wünschen Ihnen einen guten Aufenthalt — und wenn etwas fehlt, sagen Sie es uns einfach.' },
  en:{ gruss:'A warm welcome',       anrede:'Dear guests',
       text:'We are glad you are here. Have a good stay — and if anything is missing, just tell us.' },
  fr:{ gruss:'Bienvenue',            anrede:'Chers hôtes',
       text:'Nous sommes heureux de vous accueillir. Bon séjour — et s’il vous manque quelque chose, dites-le-nous.' },
  it:{ gruss:'Benvenuti',            anrede:'Cari ospiti',
       text:'Siamo lieti di avervi qui. Buon soggiorno — e se manca qualcosa, ditecelo pure.' },
  pt:{ gruss:'Bem-vindos',           anrede:'Caros hóspedes',
       text:'Ficamos contentes por vos receber. Boa estadia — e se faltar alguma coisa, é só dizer.' },
  es:{ gruss:'Bienvenidos',          anrede:'Estimados huéspedes',
       text:'Nos alegra tenerles aquí. Que disfruten de su estancia — y si falta algo, dígannoslo.' }
};

export default {
  id:'willkommen',
  title:'Willkommenskarte',
  sub:'Gruss aufs Zimmer · A5 hoch · sechs Sprachen',
  badge:'Zimmer',
  badgeCyan:true,
  root:'t-willk',
  page:'a5',

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="297" fill="#fff"/>
    <rect x="0" y="0" width="210" height="6" fill="#01B1E2"/>
    <rect x="26" y="46" width="104" height="12" rx="6" fill="#01B1E2" opacity=".85"/>
    <rect x="26" y="72" width="150" height="20" rx="6" fill="#2A3350"/>
    ${lines(26, 116, 158, 4, 12)}
    <rect x="26" y="188" width="90" height="7" rx="3.5" fill="#C9CFDA"/>
    <circle cx="105" cy="238" r="20" fill="none" stroke="#01B1E2" stroke-width="2.4"/>
    <path d="M96 238l7 7 14-14" stroke="#01B1E2" stroke-width="2.8" fill="none"/>
    ${lines(26, 274, 120, 1)}`),

  fields:[
    { t:'group', label:'Gruss' },
    { k:'name',   label:'Name der Gäste', type:'text',
      hint:'Leer lassen: es steht die allgemeine Anrede da («Liebe Gäste»).' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text',
      hint:'Leer lassen: nimmt den hinterlegten Gruss der ersten Sprache.' },
    { k:'text',    label:'Text — überschreiben', type:'textarea', rows:4,
      hint:'Leer lassen: der hinterlegte Text gilt, in jeder gewählten Sprache.' },
    { k:'unterschrift', label:'Unterschrift', type:'text' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Hinweiszeile unten' },
    { k:'hinweisIcon', label:'Symbol', type:'select', options:willkIconOptions },
    { k:'hinweis',     label:'Zeile',  type:'text',
      hint:'Zum Beispiel «Frühstück 07:30 – 10:00» oder «WLAN: Gast».' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    name:'',
    eyebrow:'',
    text:'',
    unterschrift:'Ihr Team von N’s Hotel',
    sprachen:['de','en'],
    sprachSet:'',
    hinweisIcon:'cup',
    hinweis:'Frühstück 07:30 – 10:00 im Aufenthaltsraum',
    objekt:'A14',
    absender:'hotel'
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);
    const sprachen = sprachObjekte(d.sprachen);
    const erste = WILLKOMMEN[sprachen[0].id] || WILLKOMMEN.de;

    const bloecke = sprachen.map((sp, i) => {
      const w = WILLKOMMEN[sp.id] || WILLKOMMEN.de;
      const text = has(d.text) ? d.text : w.text;
      return `
        <div class="t-willk-block${i === 0 ? ' is-erste' : ''}" lang="${sp.id}">
          <p class="t-willk-anrede">${esc(has(d.name) ? d.name : w.anrede)}</p>
          <p class="t-willk-text">${esc(text)}</p>
        </div>`;
    }).join('');

    return `
      <div class="t-willk-band"></div>
      <header class="t-willk-kopf">
        <p class="eyebrow">${esc(has(d.eyebrow) ? d.eyebrow : erste.gruss)}</p>
        ${obj.code ? `<p class="t-willk-obj">${esc(obj.name)}</p>` : ''}
      </header>

      <div class="t-willk-mitte">${bloecke}</div>

      ${has(d.unterschrift) ? `<p class="t-willk-sig">${esc(d.unterschrift)}</p>` : ''}

      ${has(d.hinweis) ? `
      <p class="t-willk-hinweis">
        <span>${icon(d.hinweisIcon || 'cup', 20, 1.9)}</span>${esc(d.hinweis)}
      </p>` : ''}

      <footer class="t-willk-fuss">
        <span class="t-willk-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc(abs.foot)}</span>
      </footer>`;
  }
};
