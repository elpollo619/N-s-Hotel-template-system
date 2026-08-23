/* Vollmacht · A4 hoch
   --------------------------------------------------------------------------
   Wer nicht an die Eigentümer- oder Mieterversammlung kommt, lässt sich
   vertreten. Diese Vollmacht liegt der Einladung bei: wer wen bevollmächtigt,
   für welche Versammlung, mit Unterschrift. Bewusst kurz — eine Vollmacht ist
   kein Vertrag, sie muss nur eindeutig sein.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'vollmacht',
  title:'Vollmacht',
  sub:'Vertretung an der Versammlung · A4 hoch',
  badge:'Vollmacht',
  root:'t-vm',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="110" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="60" width="150" height="7" rx="3.5" fill="#2A3350" opacity=".55"/>
    ${[0,1,2,3].map(i => `
      <rect x="24" y="${92 + i*22}" width="40" height="7" rx="3.5" fill="#2A3350" opacity=".8"/>
      <path d="M74 ${99 + i*22}h112" stroke="#C9CFDA" stroke-width="1.5" stroke-dasharray="3 3"/>`).join('')}
    <rect x="24" y="196" width="162" height="40" rx="5" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="1.4"/>
    <path d="M24 262h80" stroke="#2A3350" stroke-width="1.5"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'titel', label:'Titel', type:'text' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'anlass', label:'Für welche Versammlung', type:'text' },
    { k:'datum',  label:'Datum der Versammlung', type:'text' },

    { t:'group', label:'Text' },
    { k:'einleitung', label:'Einleitung', type:'textarea', rows:2 },
    { t:'note', label:'Die Zeilen «Ich» und «bevollmächtige» sind Schreiblinien — von Hand auszufüllen.' },
    { k:'schluss', label:'Schlusssatz', type:'textarea', rows:2 },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Vollmacht',
    objekt:'-',
    anlass:'Ordentliche Eigentümerversammlung',
    datum:'',
    einleitung:'Für die untenstehende Versammlung erteile ich, sofern ich nicht persönlich teilnehmen kann, folgende Vollmacht:',
    schluss:'Die bevollmächtigte Person ist berechtigt, in meinem Namen an der Versammlung teilzunehmen, das Wort zu ergreifen und abzustimmen.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const linie = (label) => `
      <div class="t-vm-zeile"><span>${esc(label)}</span><i></i></div>`;

    return `
      <header class="t-vm-kopf">
        <div>
          <h1>${esc(d.titel || 'Vollmacht')}</h1>
          <p class="t-vm-anlass">${esc([d.anlass, d.datum].filter(Boolean).join(' · '))}</p>
          ${ort ? `<p class="t-vm-ort">${esc(ort)}</p>` : ''}
        </div>
        <span class="t-vm-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
      </header>

      ${has(d.einleitung) ? `<p class="t-vm-text">${esc(d.einleitung)}</p>` : ''}

      <div class="t-vm-block">
        ${linie('Ich (Name, Wohnung)')}
        ${linie('bevollmächtige (Name)')}
      </div>

      ${has(d.schluss) ? `<p class="t-vm-text">${esc(d.schluss)}</p>` : ''}

      <div class="t-vm-mitteilung"></div>

      <footer class="t-vm-fuss">
        <div class="t-vm-sig"><span></span><i>Ort, Datum</i></div>
        <div class="t-vm-sig"><span></span><i>Unterschrift Vollmachtgeber/in</i></div>
      </footer>
      <p class="t-vm-abs">${esc(abs.foot)}</p>`;
  }
};
