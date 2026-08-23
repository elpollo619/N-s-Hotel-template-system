/* Zeiten-Tafel · A4 hoch
   --------------------------------------------------------------------------
   Öffnungszeiten, Frühstückszeiten, Waschküchenzeiten — dieselbe Form für
   alles, was zu bestimmten Stunden gilt.

   Zwei Spalten wären hübscher, sind aber falsch: eine Zeitentafel wird
   ueberflogen, nicht gelesen. Eine Kolonne, links die Bezeichnung, rechts
   die Zeit, dazwischen eine Punktlinie — so findet das Auge die Zeile.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objektFusszeile, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const ZEITEN_TITEL = {
  de:'Öffnungszeiten', en:'Opening hours',  fr:'Heures d’ouverture',
  it:'Orari d’apertura', pt:'Horário',      es:'Horario'
};

export default {
  id:'zeiten',
  title:'Zeiten-Tafel',
  sub:'Öffnungs-, Frühstücks- und Waschzeiten · A4 hoch',
  badge:'Zeiten',
  root:'t-zeiten',
  page:'a4',
  fern:true,

  thumb: thumb(`
    <rect x="24" y="30" width="98" height="10" rx="5" fill="#01B1E2"/>
    <rect x="24" y="52" width="152" height="18" rx="6" fill="#2A3350"/>
    ${[0,1,2,3,4,5].map(i => `
      <rect x="24" y="${104 + i * 30}" width="${64 - (i % 3) * 8}" height="9" rx="4.5" fill="#2A3350" opacity=".82"/>
      <rect x="${96 - (i % 3) * 8}" y="${107 + i * 30}" width="${52 + (i % 3) * 8}" height="3" rx="1.5" fill="#E5E8ED"/>
      <rect x="152" y="${104 + i * 30}" width="34" height="9" rx="4.5" fill="#01B1E2"/>`).join('')}
    <rect x="24" y="288" width="120" height="6" rx="3" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Öffnungszeiten» in der ersten gewählten Sprache.' },
    { k:'unter',   label:'Untertitel', type:'text' },

    { t:'group', label:'Zeilen' },
    { k:'zeilen', label:'Zeiten', type:'list', itemLabel:'Zeile', max:14,
      defaultItem:{ icon:'clock', was:'', zeit:'', zusatz:'' },
      item:[
        { k:'icon',   label:'Symbol',      type:'select', options:iconOptions },
        { k:'was',    label:'Bezeichnung', type:'text' },
        { k:'zeit',   label:'Zeit',        type:'text' },
        { k:'zusatz', label:'Zusatz',      type:'text' }
      ] },

    { t:'group', label:'Hinweis unten' },
    { k:'hinweis', label:'Hinweis', type:'textarea', rows:2 },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen nur den Titel. Die Zeiten selbst sind Zahlen — die versteht jede Sprache.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Wann was offen ist',
    titel:'',
    unter:'',
    zeilen:[
      { icon:'cup',     was:'Frühstück',    zeit:'07:30 – 10:00', zusatz:'Aufenthaltsraum, Erdgeschoss' },
      { icon:'key',     was:'Check-in',     zeit:'ab 15:00',      zusatz:'jederzeit mit dem Zutrittscode' },
      { icon:'clock',   was:'Check-out',    zeit:'bis 11:00',     zusatz:'' },
      { icon:'waesche', was:'Waschküche',   zeit:'08:00 – 20:00', zusatz:'sonntags geschlossen' },
      { icon:'trash',   was:'Sammelstelle', zeit:'07:00 – 20:00', zusatz:'' }
    ],
    hinweis:'Ausserhalb dieser Zeiten bitten wir um Ruhe im ganzen Haus.',
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

    const titel = has(d.titel) ? d.titel : (ZEITEN_TITEL[sprachen[0].id] || ZEITEN_TITEL.de);
    const weitere = sprachen.slice(1).map(sp => ZEITEN_TITEL[sp.id]).filter(Boolean);

    const zeilen = (d.zeilen || []).filter(z => has(z.was) || has(z.zeit)).map(z => `
      <li class="t-zeiten-zeile">
        <span class="t-zeiten-ico">${icon(z.icon || 'clock', 22, 1.9)}</span>
        <span class="t-zeiten-was">
          <b>${esc(z.was)}</b>
          ${has(z.zusatz) ? `<i>${esc(z.zusatz)}</i>` : ''}
        </span>
        <span class="t-zeiten-punkte"></span>
        <span class="t-zeiten-zeit">${esc(z.zeit)}</span>
      </li>`).join('');

    return `
      <header class="t-zeiten-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
        ${weitere.length ? `<p class="t-zeiten-sprachen">${esc(weitere.join(' · '))}</p>` : ''}
        ${has(d.unter) ? `<p class="t-zeiten-unter">${esc(d.unter)}</p>` : ''}
      </header>

      <ul class="t-zeiten-liste">${zeilen}</ul>

      ${has(d.hinweis) ? `<p class="t-zeiten-hinweis">${esc(d.hinweis)}</p>` : ''}

      <footer class="t-zeiten-fuss">
        <span class="t-zeiten-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
        <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
      </footer>`;
  }
};
