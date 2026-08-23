/* Übergabeprotokoll · A4 hoch
   --------------------------------------------------------------------------
   Das Blatt, das bei jedem Ein- und Auszug ausgefüllt wird: in welchem
   Zustand die Wohnung übergeben wurde, welche Zähler wie hoch standen,
   wie viele Schlüssel den Besitzer wechselten. Ohne dieses Blatt streiten
   sich Vermieter und Mieter später über den Kaffeefleck auf dem Parkett.

   Es ist ein Formular, kein Aushang: Die Zentrale druckt den Rahmen, die
   Zeilen werden vor Ort von Hand ausgefüllt. Darum steht überall eine
   Schreiblinie statt eines fertigen Werts.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'uebergabe',
  title:'Übergabeprotokoll',
  sub:'Wohnungsübergabe: Zustand, Zähler, Schlüssel · A4 hoch',
  badge:'Übergabe',
  root:'t-ueb',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="120" height="16" rx="5" fill="#2A3350"/>
    <rect x="24" y="54" width="162" height="26" rx="4" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="1.5"/>
    ${[0,1,2,3].map(i => `
      <rect x="24" y="${96 + i * 20}" width="${44}" height="7" rx="3.5" fill="#2A3350" opacity=".8"/>
      <path d="M76 ${103 + i * 20}h110" stroke="#C9CFDA" stroke-width="1.5" stroke-dasharray="3 3"/>`).join('')}
    <rect x="24" y="192" width="70" height="7" rx="3.5" fill="#01B1E2"/>
    ${[0,1].map(i => `
      <rect x="${24 + i*84}" y="240" width="70" height="7" rx="3.5" fill="#2A3350" opacity=".6"/>
      <path d="M${24 + i*84} 258h70" stroke="#2A3350" stroke-width="1.5"/>`).join('')}`),

  fields:[
    { t:'group', label:'Art und Objekt' },
    { k:'art', label:'Anlass', type:'select', options:[
      { v:'Einzug — Übergabe an Mieter', t:'Einzug — Übergabe an Mieter' },
      { v:'Auszug — Rückgabe durch Mieter', t:'Auszug — Rückgabe durch Mieter' },
      { v:'Zwischenabnahme', t:'Zwischenabnahme' } ] },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'wohnung', label:'Wohnung / Lage', type:'text', hint:'z. B. «2. OG rechts, 3.5 Zimmer».' },
    { k:'datum',   label:'Datum', type:'text' },

    { t:'group', label:'Beteiligte' },
    { k:'uebergeber', label:'Übergeber', type:'text' },
    { k:'uebernehmer', label:'Übernehmer', type:'text' },

    { t:'group', label:'Räume und Zustand' },
    { t:'note', label:'Jede Zeile bekommt eine Schreiblinie für den Zustand. Vor Ort ausgefüllt.' },
    { k:'raeume', label:'Räume', type:'list', itemLabel:'Raum', max:14,
      defaultItem:{ name:'' },
      item:[{ k:'name', label:'Raum', type:'text' }] },

    { t:'group', label:'Zählerstände' },
    { k:'zaehler', label:'Zähler', type:'list', itemLabel:'Zähler', max:8,
      defaultItem:{ name:'', nr:'' },
      item:[
        { k:'name', label:'Zähler', type:'text' },
        { k:'nr',   label:'Zähler-Nr.', type:'text' }
      ] },

    { t:'group', label:'Schlüssel' },
    { k:'schluessel', label:'Schlüssel', type:'list', itemLabel:'Art', max:8,
      defaultItem:{ name:'' },
      item:[{ k:'name', label:'Art', type:'text' }] },

    { t:'group', label:'Bemerkungen' },
    { k:'bemerkung', label:'Feld für Bemerkungen', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    art:'Auszug — Rückgabe durch Mieter',
    objekt:'-',
    wohnung:'',
    datum:'',
    uebergeber:'',
    uebernehmer:'',
    raeume:[
      { name:'Wohnzimmer' }, { name:'Küche' }, { name:'Bad / WC' },
      { name:'Schlafzimmer' }, { name:'Zimmer' }, { name:'Balkon / Reduit' }
    ],
    zaehler:[
      { name:'Strom', nr:'' }, { name:'Wasser kalt', nr:'' }, { name:'Wasser warm', nr:'' }
    ],
    schluessel:[
      { name:'Wohnungsschlüssel' }, { name:'Haustürschlüssel' },
      { name:'Briefkasten' }, { name:'Keller / Estrich' }
    ],
    bemerkung:'ja',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const feld = (label, wert) => `
      <div class="t-ueb-feld">
        <span class="t-ueb-lab">${esc(label)}</span>
        <span class="t-ueb-linie">${wert ? esc(wert) : ''}</span>
      </div>`;

    const raeume = (d.raeume || []).filter(r => has(r.name)).map(r => `
      <li><span class="t-ueb-rname">${esc(r.name)}</span><span class="t-ueb-rlinie"></span></li>`).join('');

    const zaehler = (d.zaehler || []).filter(z => has(z.name)).map(z => `
      <li>
        <span class="t-ueb-zname">${esc(z.name)}${has(z.nr) ? ` <i>Nr. ${esc(z.nr)}</i>` : ''}</span>
        <span class="t-ueb-zwert"></span>
      </li>`).join('');

    const schluessel = (d.schluessel || []).filter(s => has(s.name)).map(s => `
      <li><span class="t-ueb-sname">${esc(s.name)}</span><span class="t-ueb-sanz"></span></li>`).join('');

    return `
      <header class="t-ueb-kopf">
        <div>
          <h1>Übergabeprotokoll</h1>
          <p class="t-ueb-art">${esc(d.art || '')}</p>
        </div>
        <span class="t-ueb-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
      </header>

      <div class="t-ueb-oben">
        ${feld('Liegenschaft', ort)}
        ${feld('Wohnung / Lage', d.wohnung)}
        ${feld('Datum', d.datum)}
        ${feld('Übergeber', d.uebergeber)}
        ${feld('Übernehmer', d.uebernehmer)}
      </div>

      ${raeume ? `
      <section class="t-ueb-block">
        <h2>Räume und Zustand</h2>
        <ul class="t-ueb-raeume">${raeume}</ul>
      </section>` : ''}

      <div class="t-ueb-zwei">
        ${zaehler ? `
        <section class="t-ueb-block">
          <h2>Zählerstände</h2>
          <ul class="t-ueb-zaehler">${zaehler}</ul>
        </section>` : ''}
        ${schluessel ? `
        <section class="t-ueb-block">
          <h2>Schlüssel <span>Anzahl</span></h2>
          <ul class="t-ueb-schluessel">${schluessel}</ul>
        </section>` : ''}
      </div>

      ${d.bemerkung === 'ja' ? `
      <section class="t-ueb-block">
        <h2>Bemerkungen</h2>
        <div class="t-ueb-bem"></div>
      </section>` : ''}

      <footer class="t-ueb-fuss">
        <div class="t-ueb-sig"><span></span><i>Ort, Datum · Übergeber</i></div>
        <div class="t-ueb-sig"><span></span><i>Ort, Datum · Übernehmer</i></div>
      </footer>
      <p class="t-ueb-abs">${esc(abs.foot)}</p>`;
  }
};
