/* Zählerstände · A4 hoch
   --------------------------------------------------------------------------
   Das Ableseformular: einmal im Jahr geht jemand durchs Haus und trägt ein,
   was auf den Zählern steht. Strom, Wasser, Gas, Wärme. Danach rechnet die
   Verwaltung ab. Ein Formular mit einer Zeile je Zähler und breiten Feldern
   zum Eintragen — mehr braucht es nicht, aber das sauber.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'zaehlerstaende',
  title:'Zählerstände',
  sub:'Ableseformular für Strom, Wasser, Wärme · A4 hoch',
  badge:'Ablesen',
  root:'t-zael',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="110" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="60" width="162" height="7" rx="3.5" fill="#2A3350" opacity=".7"/>
    <rect x="24" y="88" width="162" height="18" rx="4" fill="#01B1E2" opacity=".16"/>
    ${[0,1,2,3,4].map(i => `
      <rect x="24" y="${114 + i * 24}" width="162" height="18" rx="4" fill="#fff" stroke="#E5E8ED" stroke-width="1.4"/>
      <circle cx="34" cy="${123 + i * 24}" r="4" fill="#01B1E2"/>
      <rect x="44" y="${119 + i * 24}" width="${50 - i*4}" height="6" rx="3" fill="#2A3350" opacity=".7"/>
      <rect x="120" y="${120 + i * 24}" width="58" height="10" rx="2" fill="#F6F7FA" stroke="#C9CFDA" stroke-width="1"/>`).join('')}`),

  fields:[
    { t:'group', label:'Objekt und Datum' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'wohnung', label:'Wohnung / Lage', type:'text' },
    { k:'datum',  label:'Ablesedatum', type:'text' },
    { k:'abgelesen', label:'Abgelesen durch', type:'text' },

    { t:'group', label:'Zähler' },
    { t:'note', label:'Für jeden Zähler eine Zeile. Der Stand wird beim Ablesen von Hand eingetragen.' },
    { k:'zeilen', label:'Zähler', type:'list', itemLabel:'Zähler', max:16,
      defaultItem:{ icon:'bolt', name:'', nr:'', einheit:'' },
      item:[
        { k:'icon',    label:'Symbol', type:'select', options:[
          { v:'bolt',   t:'Strom' }, { v:'wasser', t:'Wasser' },
          { v:'heating',t:'Wärme · Heizung' }, { v:'fire', t:'Gas' },
          { v:'info',   t:'anderes' } ] },
        { k:'name',    label:'Bezeichnung', type:'text' },
        { k:'nr',      label:'Zähler-Nr.',  type:'text' },
        { k:'einheit', label:'Einheit',     type:'text' }
      ] },

    { t:'group', label:'Hinweis' },
    { k:'hinweis', label:'Fusshinweis', type:'textarea', rows:2 },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    objekt:'-',
    wohnung:'',
    datum:'',
    abgelesen:'',
    zeilen:[
      { icon:'bolt',   name:'Strom Haushalt', nr:'', einheit:'kWh' },
      { icon:'bolt',   name:'Strom Wärmepumpe', nr:'', einheit:'kWh' },
      { icon:'wasser', name:'Wasser kalt', nr:'', einheit:'m³' },
      { icon:'wasser', name:'Wasser warm', nr:'', einheit:'m³' },
      { icon:'heating',name:'Wärme / Heizung', nr:'', einheit:'kWh' }
    ],
    hinweis:'Bitte den Zählerstand vollständig ablesen, auch die Nachkommastellen. Bei Unklarheiten die Verwaltung anrufen.',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const feld = (label, wert) => `
      <div class="t-zael-feld"><span>${esc(label)}</span><b>${wert ? esc(wert) : ''}</b></div>`;

    const zeilen = (d.zeilen || []).filter(z => has(z.name)).map(z => `
      <li>
        <span class="t-zael-ico">${icon(z.icon || 'info', 20, 1.9)}</span>
        <span class="t-zael-name">${esc(z.name)}${has(z.nr) ? ` <i>Nr. ${esc(z.nr)}</i>` : ''}</span>
        <span class="t-zael-wert"></span>
        <span class="t-zael-einheit">${has(z.einheit) ? esc(z.einheit) : ''}</span>
      </li>`).join('');

    return `
      <header class="t-zael-kopf">
        <div>
          <h1>Zählerstände</h1>
          <p class="t-zael-unter">Ableseprotokoll</p>
        </div>
        <span class="t-zael-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
      </header>

      <div class="t-zael-oben">
        ${feld('Liegenschaft', ort)}
        ${feld('Wohnung / Lage', d.wohnung)}
        ${feld('Ablesedatum', d.datum)}
        ${feld('Abgelesen durch', d.abgelesen)}
      </div>

      <ul class="t-zael-liste">
        <li class="t-zael-titel"><span></span><span class="t-zael-name">Zähler</span>
          <span class="t-zael-wert">Stand</span><span class="t-zael-einheit"></span></li>
        ${zeilen}
      </ul>

      ${has(d.hinweis) ? `<p class="t-zael-hinweis">${esc(d.hinweis)}</p>` : ''}

      <footer class="t-zael-fuss">
        <div class="t-zael-sig"><span></span><i>Unterschrift Ablesung</i></div>
        <div class="t-zael-sig"><span></span><i>Unterschrift Mieter</i></div>
      </footer>
      <p class="t-zael-abs">${esc(abs.foot)}</p>`;
  }
};
