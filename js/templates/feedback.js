/* Feedback-Aushang · A4 hoch
   --------------------------------------------------------------------------
   Ein Haus ohne Rezeption hoert nie, was schiefging — es sei denn, es fragt
   danach. Dieses Blatt fragt: gross, freundlich, mit einem Code, den man vom
   Bett aus scannt.

   Der Code ist das Wichtigste. Eine Bitte um Rueckmeldung ohne Weg dorthin
   ist eine Bitte ins Leere.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objektFusszeile, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const FEEDBACK_TEXT = {
  de:{ eyebrow:'Sagen Sie es uns',  titel:'Wie war es bei uns?',
       text:'Zwei Minuten, die uns weiterhelfen. Was gut war — und was nicht.',
       scan:'Code scannen' },
  en:{ eyebrow:'Tell us',           titel:'How was your stay?',
       text:'Two minutes that help us. What was good — and what was not.',
       scan:'Scan the code' },
  fr:{ eyebrow:'Dites-le-nous',     titel:'Comment était votre séjour?',
       text:'Deux minutes qui nous aident. Ce qui était bien — et ce qui ne l’était pas.',
       scan:'Scannez le code' },
  it:{ eyebrow:'Ditecelo',          titel:'Com’è andata da noi?',
       text:'Due minuti che ci aiutano. Che cosa è andato bene — e che cosa no.',
       scan:'Scansionate il codice' },
  pt:{ eyebrow:'Diga-nos',          titel:'Como foi a sua estadia?',
       text:'Dois minutos que nos ajudam. O que correu bem — e o que não correu.',
       scan:'Leia o código' },
  es:{ eyebrow:'Cuéntenos',         titel:'¿Qué tal su estancia?',
       text:'Dos minutos que nos ayudan. Lo que estuvo bien — y lo que no.',
       scan:'Escanee el código' }
};

/* Fuenf Sterne, gezeichnet statt als Zeichen gesetzt: so sehen sie in jeder
   Schrift gleich aus und ueberstehen den PNG-Export. */
function feedbackSterne(){
  return `<span class="t-fb-sterne">${
    [0,1,2,3,4].map(() => icon('stern', 34, 1.6)).join('')}</span>`;
}

export default {
  id:'feedback',
  title:'Feedback-Aushang',
  sub:'Rückmeldung erbitten, mit QR-Code · A4 hoch',
  badge:'Gäste',
  root:'t-fb',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="297" fill="#fff"/>
    <rect x="24" y="34" width="96" height="10" rx="5" fill="#01B1E2"/>
    <rect x="24" y="56" width="162" height="18" rx="6" fill="#2A3350"/>
    <rect x="24" y="84" width="140" height="7" rx="3.5" fill="#C9CFDA"/>
    ${[0,1,2,3,4].map(i => `<path d="M${34 + i * 30} 122l5 10 11 1.6-8 7.8 2 11-10-5.2-10 5.2 2-11-8-7.8 11-1.6z" fill="#01B1E2"/>`).join('')}
    <rect x="52" y="160" width="106" height="106" rx="6" fill="#2A3350"/>
    <rect x="66" y="174" width="78" height="78" rx="3" fill="#fff"/>`),

  fields:[
    { t:'group', label:'Wohin' },
    { k:'qrText', label:'Adresse für den QR-Code', type:'text',
      hint:'Die Seite, auf der die Rückmeldung landet — Bewertungsportal, Formular oder Mail.' },
    { k:'qrLabel', label:'Beschriftung am Code', type:'text',
      hint:'Leer lassen: nimmt «Code scannen» in der ersten Sprache.' },
    { k:'sterne', label:'Sterne zeigen', type:'select',
      options:[{ v:'ja', t:'ja' }, { v:'nein', t:'nein' }] },

    { t:'group', label:'Text' },
    { k:'eyebrow', label:'Handschrift-Zeile — überschreiben', type:'text' },
    { k:'titel',   label:'Titel — überschreiben',             type:'text' },
    { k:'text',    label:'Text — überschreiben', type:'textarea', rows:3,
      hint:'Leer lassen: der hinterlegte Satz gilt, in jeder gewählten Sprache.' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    qrText:'https://www.google.com/search?q=N%27s+Hotel+Kerzers',
    qrLabel:'',
    sterne:'ja',
    eyebrow:'',
    titel:'',
    text:'',
    sprachen:['de','en'],
    sprachSet:'',
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
    const sprachen = sprachObjekte(d.sprachen);
    const erste = FEEDBACK_TEXT[sprachen[0].id] || FEEDBACK_TEXT.de;

    const weitere = sprachen.slice(1).map(sp => {
      const f = FEEDBACK_TEXT[sp.id] || FEEDBACK_TEXT.de;
      return `<li lang="${sp.id}"><b>${esc(f.titel)}</b> ${esc(has(d.text) ? d.text : f.text)}</li>`;
    }).join('');

    return `
      <header class="t-fb-kopf">
        <p class="eyebrow">${esc(has(d.eyebrow) ? d.eyebrow : erste.eyebrow)}</p>
        <h1>${esc(has(d.titel) ? d.titel : erste.titel)}</h1>
        <p class="t-fb-lede">${esc(has(d.text) ? d.text : erste.text)}</p>
      </header>

      ${d.sterne === 'ja' ? feedbackSterne() : ''}

      ${has(d.qrText) ? `
      <div class="t-fb-code">
        ${qrSvg(d.qrText, { stufe:'Q', groesse:'62mm' })}
        <p>${esc(has(d.qrLabel) ? d.qrLabel : erste.scan)}</p>
      </div>` : ''}

      ${weitere ? `<ul class="t-fb-weitere">${weitere}</ul>` : ''}

      <footer class="t-fb-fuss">
        <span class="t-fb-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
        <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
      </footer>`;
  }
};
