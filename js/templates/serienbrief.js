/* Serienbrief · A4 hoch, mehrseitig.
   Ein Brief, viele Empfänger: die Anschriftenliste einmal einfügen (aus
   Excel: Name in die erste, Adresse in die zweite Spalte), Text einmal
   schreiben — und für jede Person entsteht eine eigene Briefseite. Statt
   dreissig Word-Dateien von Hand anzupassen.

   Platzhalter im Text: {{name}} und {{adresse}} werden je Empfänger ersetzt.
   Layout und Briefkopf sind dieselben wie beim Mieterbrief (gleiche CSS). */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb, lines } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const SERIE_MAX = 100;   /* Sicherheitsdeckel: mehr als hundert Seiten baut niemand von Hand. */

function ersetze(text, name, adr, obj){
  return String(text || '')
    .replace(/\{\{name\}\}/g, name || '')
    .replace(/\{\{adresse\}\}/g, adr || '')
    .replace(/\{\{objekt\}\}/g, obj || '');
}

export default {
  id:'serienbrief',
  title:'Serienbrief',
  sub:'Ein Brief an viele — Empfängerliste einfügen · A4 hoch',
  badge:'Brief',
  page:'a4',
  root:'t-serienbrief',
  cat:'hausordnung',
  multipage:true,
  pageOf(){ return 'a4'; },

  thumb: thumb(`
    <rect x="26" y="26" width="150" height="230" rx="4" fill="#fff" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="40" y="44" width="54" height="9" rx="3" fill="#2A3350"/>
    ${lines(40, 96, 118, 3)}
    <rect x="40" y="150" width="100" height="9" rx="3" fill="#2A3350"/>
    ${lines(40, 174, 118, 3)}
    <rect x="40" y="226" width="70" height="6" rx="3" fill="#2A3350"/>
    <rect x="54" y="52" width="150" height="230" rx="4" fill="#F4F6F9" stroke="#C9CFDA" stroke-width="2"/>
    <rect x="84" y="70" width="150" height="230" rx="4" fill="#fff" stroke="#01B1E2" stroke-width="2.5"/>
    <rect x="98" y="88" width="54" height="9" rx="3" fill="#01B1E2"/>
    ${lines(98, 140, 118, 3)}
    ${lines(98, 200, 118, 3)}`),

  fields:[
    { t:'group', label:'Absender und Objekt' },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'ort',      label:'Ort und Datum', type:'text' },

    { t:'group', label:'Empfänger' },
    { t:'note', label:'Je Zeile ein Empfänger. «Liste einfügen» übernimmt eine ganze Liste aus Excel — Name in die erste Spalte (Tab), Adresse in die zweite.' },
    { k:'leute', label:'Empfängerliste', type:'list', itemLabel:'Empfänger', max:SERIE_MAX,
      defaultItem:{ name:'', adresse:'' },
      item:[
        { k:'name',    label:'Name / Anrede-Zeile', type:'text' },
        { k:'adresse', label:'Adresse', type:'textarea' }
      ] },

    { t:'group', label:'Inhalt (für alle gleich)' },
    { k:'betreff', label:'Betreff', type:'text', hint:'{{name}} und {{adresse}} möglich' },
    { k:'anrede',  label:'Anrede',  type:'text', hint:'{{name}} einsetzen, z. B. «Guten Tag {{name}},»' },
    { k:'text',    label:'Text',    type:'textarea', hint:'**fett**, {{name}} und {{adresse}} möglich' },
    { k:'gruss',   label:'Grussformel', type:'text' },
    { k:'signatur',label:'Unterschrift', type:'text' }
  ],

  defaults:{
    absender:'architektur',
    objekt:'-',
    ort:'Muri b. Bern, ',
    leute:[
      { name:'Herr Hans Muster', adresse:'Musterstrasse 1\n3000 Bern' },
      { name:'Frau Anna Beispiel', adresse:'Beispielweg 12\n3210 Kerzers' }
    ],
    betreff:'Wichtige Information',
    anrede:'Guten Tag {{name}},',
    text:'wir möchten Sie über Folgendes informieren …\n\nBei Fragen stehen wir Ihnen gerne zur Verfügung.',
    gruss:'Freundliche Grüsse',
    signatur:'Die Verwaltung'
  },

  render(d){
    const abs = absender(d.absender, 'architektur');
    const obj = objekt(d.objekt);
    const adrObj = objektAdresse(d.objekt);
    const leute = (d.leute || []).filter(p => has(p.name) || has(p.adresse)).slice(0, SERIE_MAX);
    const liste = leute.length ? leute : [{ name:'', adresse:'' }];

    return liste.map(p => {
      const name = p.name || '';
      const adr  = p.adresse || '';
      const betreff = ersetze(d.betreff, name, adr, obj.name);
      const anrede  = ersetze(d.anrede, name, adr, obj.name);
      const body    = ersetze(d.text, name, adr, obj.name);

      return `
      <article data-page class="t-mieterbrief">
        <header class="t-mieterbrief-head">
          <p class="t-mieterbrief-abs">${esc(abs.name)}</p>
          <span class="t-mieterbrief-mark">${istHotel(d.absender) ? logo('color', 30) : ''}</span>
        </header>

        <div class="t-mieterbrief-meta">
          <div class="t-mieterbrief-to">
            ${has(name) ? `${esc(name)}<br>` : ''}${has(adr) ? esc(adr).replace(/\n/g, '<br>') : ''}
          </div>
          <p class="t-mieterbrief-date">${esc(d.ort || '')}</p>
        </div>

        ${(obj.code || adrObj) ? `<p class="t-mieterbrief-obj">${esc(obj.code)}${adrObj ? ' · ' + esc(adrObj) : ''}</p>` : ''}

        ${has(betreff) ? `<h1 class="t-mieterbrief-betreff">${esc(betreff)}</h1>` : ''}
        ${has(anrede) ? `<p class="t-mieterbrief-anrede">${esc(anrede)}</p>` : ''}
        <div class="t-mieterbrief-text">${fmt(body)}</div>

        <div class="t-mieterbrief-sign">
          ${has(d.gruss) ? `<p>${esc(d.gruss)}</p>` : ''}
          ${has(d.signatur) ? `<p class="t-mieterbrief-name">${esc(d.signatur)}</p>` : ''}
          <p class="t-mieterbrief-legal">${esc(abs.legal)}</p>
        </div>

        <footer class="t-mieterbrief-foot">${esc(abs.foot)}</footer>
      </article>`;
    }).join('');
  }
};
