/* Preisliste · A4 hoch
   --------------------------------------------------------------------------
   Was etwas kostet: Parkplatz im Monat, ein Waschmarken-Bund, das zweite
   Frühstück, der verlorene Schlüssel. Bisher stand das in drei verschiedenen
   Word-Dateien und in keiner gleich.

   Zwei Sorten Zeilen: Abschnitte gliedern (Parkieren, Waschen, Diverses),
   Posten nennen Preise. Der Preis steht rechts, mit Tabellenziffern
   untereinander — sonst tanzen die Rappen und man vergleicht schlecht.

   Die Sprachen betreffen Titel und Fusshinweis. Die Posten selbst schreibt,
   wer die Liste macht — ein «Waschmarken-Bund à 10 Stück» lässt sich nicht
   sinnvoll automatisch übersetzen.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objektFusszeile, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/* Titel und der Satz unten. Der Hinweis ist der, der rechtlich zaehlt:
   Preise inkl. MwSt., Aenderungen vorbehalten. */
const PREIS_WORT = {
  de:{ titel:'Preisliste', hinweis:'Alle Preise in %W%, inklusive MwSt. Änderungen vorbehalten.' },
  en:{ titel:'Price list', hinweis:'All prices in %W%, VAT included. Subject to change.' },
  fr:{ titel:'Tarifs',     hinweis:'Tous les prix en %W%, TVA comprise. Sous réserve de modification.' },
  it:{ titel:'Listino prezzi', hinweis:'Tutti i prezzi in %W%, IVA inclusa. Con riserva di modifiche.' },
  pt:{ titel:'Tabela de preços', hinweis:'Todos os preços em %W%, IVA incluído. Sujeito a alterações.' },
  es:{ titel:'Lista de precios', hinweis:'Todos los precios en %W%, IVA incluido. Sujeto a cambios.' }
};

function preisWort(id){ return PREIS_WORT[id] || PREIS_WORT.de; }

/* Die Zeilenart entscheidet, ob eine Zeile gliedert oder etwas kostet. */
function preisArtOptions(){
  return [
    { v:'posten',    t:'Posten — mit Preis' },
    { v:'abschnitt', t:'Abschnitt — Zwischentitel' }
  ];
}

export default {
  id:'preisliste',
  title:'Preisliste',
  sub:'Parkplatz, Waschmarken, Extras · A4 hoch',
  badge:'Preise',
  root:'t-preis',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="30" width="76" height="10" rx="5" fill="#01B1E2"/>
    <rect x="24" y="52" width="140" height="18" rx="6" fill="#2A3350"/>
    <rect x="24" y="98" width="60" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${118 + i * 24}" width="${86 - i * 10}" height="8" rx="4" fill="#2A3350" opacity=".8"/>
      <rect x="150" y="${118 + i * 24}" width="36" height="8" rx="4" fill="#2A3350"/>`).join('')}
    <rect x="24" y="200" width="60" height="8" rx="4" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="24" y="${220 + i * 24}" width="${92 - i * 12}" height="8" rx="4" fill="#2A3350" opacity=".8"/>
      <rect x="150" y="${220 + i * 24}" width="36" height="8" rx="4" fill="#2A3350"/>`).join('')}
    <rect x="24" y="298" width="150" height="5" rx="2.5" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Preisliste» in der ersten gewählten Sprache.' },
    { k:'unter',   label:'Untertitel', type:'text' },
    { k:'stand',   label:'Gültig ab', type:'text',
      hint:'Steht klein neben dem Titel. Eine Preisliste ohne Datum ist wertlos.' },

    { t:'group', label:'Posten' },
    { k:'waehrung', label:'Währung', type:'select', options:[
      { v:'CHF', t:'CHF — Schweizer Franken' },
      { v:'EUR', t:'EUR — Euro' },
      { v:'',    t:'ohne — die Währung steht schon beim Preis' }
    ] },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Zeile', max:22,
      defaultItem:{ art:'posten', icon:'info', was:'', dazu:'', preis:'', einheit:'' },
      item:[
        { k:'art',     label:'Art',         type:'select', options:preisArtOptions() },
        { k:'icon',    label:'Symbol',      type:'select', options:iconOptions },
        { k:'was',     label:'Bezeichnung', type:'text' },
        { k:'dazu',    label:'Erläuterung', type:'text' },
        { k:'preis',   label:'Preis',       type:'text' },
        { k:'einheit', label:'je',          type:'text' }
      ] },

    { t:'group', label:'Fuss' },
    { k:'hinweisAn', label:'Preishinweis', type:'select', options:[
      { v:'ja',   t:'zeigen — MwSt. und Änderungsvorbehalt' },
      { v:'nein', t:'weglassen' }
    ] },
    { k:'hinweis', label:'Eigener Hinweis', type:'textarea', rows:2,
      hint:'Leer lassen: der hinterlegte Satz gilt, in allen gewählten Sprachen.' },
    { k:'zahlung', label:'Zahlung', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen Titel und Fusshinweis. Die Posten schreiben Sie selbst — die kann niemand automatisch übersetzen.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Was was kostet',
    titel:'',
    unter:'',
    stand:'gültig ab 01.01.2026',
    waehrung:'CHF',
    zeilen:[
      { art:'abschnitt', icon:'car', was:'Parkieren', dazu:'', preis:'', einheit:'' },
      { art:'posten', icon:'car',  was:'Aussenparkplatz', dazu:'fest zugeteilt', preis:'60.–', einheit:'Monat' },
      { art:'posten', icon:'car',  was:'Einstellhallenplatz', dazu:'fest zugeteilt', preis:'120.–', einheit:'Monat' },
      { art:'posten', icon:'car',  was:'Besucherparkplatz', dazu:'mit Parkkarte, max. 24 Std.', preis:'ohne Kosten', einheit:'' },

      { art:'abschnitt', icon:'waesche', was:'Waschen und Trocknen', dazu:'', preis:'', einheit:'' },
      { art:'posten', icon:'waesche', was:'Waschmarke', dazu:'ein Waschgang', preis:'4.–', einheit:'Stück' },
      { art:'posten', icon:'waesche', was:'Marken-Bund', dazu:'10 Stück, bei der Verwaltung', preis:'38.–', einheit:'Bund' },
      { art:'posten', icon:'waesche', was:'Tumbler', dazu:'ein Durchgang', preis:'3.–', einheit:'Stück' },

      { art:'abschnitt', icon:'key', was:'Diverses', dazu:'', preis:'', einheit:'' },
      { art:'posten', icon:'key',  was:'Ersatzschlüssel', dazu:'Bestellung über die Verwaltung', preis:'45.–', einheit:'Stück' },
      { art:'posten', icon:'key',  was:'Türöffnung ausserhalb der Bürozeiten', dazu:'', preis:'80.–', einheit:'Einsatz' },
      { art:'posten', icon:'trash',was:'Entsorgung zurückgelassener Gegenstände', dazu:'nach Aufwand', preis:'ab 120.–', einheit:'Stunde' }
    ],
    hinweisAn:'ja',
    hinweis:'',
    zahlung:'Zahlbar bei der Verwaltung oder per Rechnung.',
    sprachen:['de','en'],
    sprachSet:'',
    objekt:'-',
    absender:'immobilien'
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const sprachen = sprachObjekte(d.sprachen);
    const waehrung = has(d.waehrung) ? d.waehrung : '';

    const titel = has(d.titel) ? d.titel : preisWort(sprachen[0].id).titel;
    const weitere = sprachen.slice(1).map(sp => preisWort(sp.id).titel).filter(Boolean);

    const zeilen = (d.zeilen || []).filter(z => has(z.was) || has(z.preis)).map(z => {
      if (z.art === 'abschnitt') return `
        <li class="t-preis-abschnitt">
          <span class="t-preis-ico">${icon(z.icon || 'info', 20, 1.9)}</span>
          <b>${esc(z.was)}</b>
          ${has(z.dazu) ? `<i>${esc(z.dazu)}</i>` : ''}
        </li>`;

      return `
        <li class="t-preis-zeile">
          <span class="t-preis-was">
            <b>${esc(z.was)}</b>
            ${has(z.dazu) ? `<i>${esc(z.dazu)}</i>` : ''}
          </span>
          <span class="t-preis-punkte"></span>
          <span class="t-preis-betrag">
            <b>${esc([/\d/.test(z.preis || '') ? waehrung : '', z.preis].filter(has).join(' '))}</b>
            ${has(z.einheit) ? `<i>je ${esc(z.einheit)}</i>` : ''}
          </span>
        </li>`;
    }).join('');

    /* Der Standardhinweis steht in jeder gewaehlten Sprache — eine Zeile je
       Sprache, damit auch der portugiesische Mieter den Vorbehalt liest. */
    const hinweise = has(d.hinweis)
      ? [d.hinweis]
      : (d.hinweisAn === 'ja'
          ? sprachen.map(sp => preisWort(sp.id).hinweis.replace('%W%', waehrung || 'CHF'))
          : []);

    return `
      <header class="t-preis-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <div class="t-preis-titelzeile">
          <h1>${esc(titel)}</h1>
          ${has(d.stand) ? `<span class="t-preis-stand">${esc(d.stand)}</span>` : ''}
        </div>
        ${weitere.length ? `<p class="t-preis-sprachen">${esc(weitere.join(' · '))}</p>` : ''}
        ${has(d.unter) ? `<p class="t-preis-unter">${esc(d.unter)}</p>` : ''}
      </header>

      <ul class="t-preis-liste">${zeilen}</ul>

      <footer class="t-preis-fuss">
        ${has(d.zahlung) ? `<p class="t-preis-zahlung">${esc(d.zahlung)}</p>` : ''}
        ${hinweise.length ? `<ul class="t-preis-hinweis">${
          hinweise.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
        <p class="t-preis-abs">
          <span class="t-preis-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
          <span>${esc(objektFusszeile(d.objekt, abs.foot))}</span>
        </p>
      </footer>`;
  }
};
