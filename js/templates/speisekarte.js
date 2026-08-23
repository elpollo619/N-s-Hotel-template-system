/* Speisekarte · A4 hoch
   --------------------------------------------------------------------------
   Die Frühstückskarte im Aufenthaltsraum, die Getränkeliste an der kleinen
   Bar. Verwandt mit der Preisliste, aber anders gebaut: eine Karte wird
   gelesen, nicht verglichen. Darum steht die Bezeichnung mittig und gross,
   die Beschreibung fein darunter, der Preis rechts — ruhig, nicht als
   Tabelle mit Punktlinien.

   Zeilenart «Abschnitt» gliedert (Frühstück, Warme Getränke), «Posten»
   nennt ein Gericht mit Preis. Sprachen betreffen den Titel; die Gerichte
   schreibt, wer die Karte macht.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, objektFusszeile, objektOptions, absenderOptions } from '../objekte.js';

const MENU_TITEL = {
  de:'Frühstückskarte', en:'Breakfast menu', fr:'Carte petit-déjeuner',
  it:'Menu colazione',  pt:'Menu de café',   es:'Carta de desayuno'
};

function menuArtOptions(){
  return [
    { v:'posten',    t:'Gericht — mit Preis' },
    { v:'abschnitt', t:'Abschnitt — Zwischentitel' }
  ];
}

export default {
  id:'speisekarte',
  title:'Speisekarte',
  sub:'Frühstück, Getränke, kleine Karte · A4 hoch',
  badge:'Gastro',
  root:'t-menu',
  page:'a4',

  thumb: thumb(`
    <rect x="52" y="28" width="96" height="10" rx="5" fill="#01B1E2"/>
    <rect x="40" y="50" width="120" height="18" rx="6" fill="#2A3350"/>
    <rect x="70" y="96" width="60" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="${44 + (i%2)*6}" y="${120 + i * 26}" width="${96 - i*8}" height="8" rx="4" fill="#2A3350" opacity=".82"/>
      <rect x="164" y="${120 + i * 26}" width="28" height="8" rx="4" fill="#2A3350"/>`).join('')}
    <rect x="70" y="206" width="60" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="${44 + (i%2)*6}" y="${230 + i * 26}" width="${92 - i*10}" height="8" rx="4" fill="#2A3350" opacity=".82"/>
      <rect x="164" y="${230 + i * 26}" width="28" height="8" rx="4" fill="#2A3350"/>`).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Frühstückskarte» in der ersten gewählten Sprache.' },
    { k:'unter',   label:'Untertitel', type:'text' },

    { t:'group', label:'Karte' },
    { k:'waehrung', label:'Währung', type:'select', options:[
      { v:'CHF', t:'CHF' }, { v:'EUR', t:'EUR' }, { v:'', t:'ohne' } ] },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Zeile', max:26,
      defaultItem:{ art:'posten', icon:'cup', name:'', dazu:'', preis:'' },
      item:[
        { k:'art',   label:'Art',         type:'select', options:menuArtOptions() },
        { k:'icon',  label:'Symbol',      type:'select', options:iconOptions },
        { k:'name',  label:'Bezeichnung', type:'text' },
        { k:'dazu',  label:'Beschreibung', type:'text' },
        { k:'preis', label:'Preis',       type:'text' }
      ] },

    { t:'group', label:'Fuss' },
    { k:'hinweis', label:'Hinweis', type:'textarea', rows:2,
      hint:'Zum Beispiel Allergene, Herkunft, «Preise inkl. MwSt.».' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen den Titel. Die Gerichte schreiben Sie selbst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Guten Morgen',
    titel:'',
    unter:'Serviert im Aufenthaltsraum, 07:30 – 10:00',
    waehrung:'CHF',
    zeilen:[
      { art:'abschnitt', icon:'cup',     name:'Warme Getränke', dazu:'', preis:'' },
      { art:'posten', icon:'cup',   name:'Kaffee, Cappuccino, Tee', dazu:'so viel Sie mögen', preis:'inkl.' },
      { art:'posten', icon:'glas',  name:'Frisch gepresster Orangensaft', dazu:'', preis:'4.50' },
      { art:'abschnitt', icon:'besteck', name:'Vom Buffet', dazu:'', preis:'' },
      { art:'posten', icon:'besteck', name:'Brot, Butter, Konfitüre', dazu:'aus der Bäckerei im Dorf', preis:'inkl.' },
      { art:'posten', icon:'besteck', name:'Käse und Aufschnitt', dazu:'regional', preis:'inkl.' },
      { art:'posten', icon:'besteck', name:'Joghurt, Müesli, Früchte', dazu:'', preis:'inkl.' },
      { art:'posten', icon:'besteck', name:'Gekochtes Ei', dazu:'auf Wunsch', preis:'inkl.' }
    ],
    hinweis:'Fragen Sie uns nach Allergenen. Preise in CHF, inklusive MwSt.',
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
    const waehrung = has(d.waehrung) ? d.waehrung : '';
    const titel = has(d.titel) ? d.titel : (MENU_TITEL[sprachen[0].id] || MENU_TITEL.de);
    const weitere = sprachen.slice(1).map(sp => MENU_TITEL[sp.id]).filter(Boolean);

    const preisText = (p) => {
      if (!has(p)) return '';
      return /\d/.test(p) && waehrung ? `${waehrung} ${p}` : p;
    };

    const zeilen = (d.zeilen || []).filter(z => has(z.name)).map(z => {
      if (z.art === 'abschnitt') return `
        <li class="t-menu-abschnitt">
          <span class="t-menu-ico">${icon(z.icon || 'besteck', 20, 1.9)}</span>
          <b>${esc(z.name)}</b>
        </li>`;
      return `
        <li class="t-menu-zeile">
          <div class="t-menu-was">
            <b>${esc(z.name)}</b>
            ${has(z.dazu) ? `<i>${esc(z.dazu)}</i>` : ''}
          </div>
          ${has(z.preis) ? `<span class="t-menu-preis">${esc(preisText(z.preis))}</span>` : ''}
        </li>`;
    }).join('');

    return `
      <header class="t-menu-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
        ${weitere.length ? `<p class="t-menu-sprachen">${esc(weitere.join(' · '))}</p>` : ''}
        ${has(d.unter) ? `<p class="t-menu-unter">${esc(d.unter)}</p>` : ''}
      </header>

      <ul class="t-menu-liste">${zeilen}</ul>

      <footer class="t-menu-fuss">
        ${has(d.hinweis) ? `<p class="t-menu-hinweis">${esc(d.hinweis)}</p>` : ''}
        <p class="t-menu-abs">
          <span class="t-menu-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
          <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
        </p>
      </footer>`;
  }
};
