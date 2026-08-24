/* Gutschein · A5 quer
   --------------------------------------------------------------------------
   Der Gutschein fürs Hotel: eine Übernachtung, ein Betrag, ein Abendessen.
   Bisher hat das Haus dafür eine Word-Vorlage von 2014 benutzt, in der der
   Betrag von Hand mit dem Kugelschreiber eingetragen wurde.

   Ein Gutschein ist Papier, das Geld wert ist. Darum steht der Wert gross
   und rechts in einem eigenen Feld, und darunter Code und Gültigkeit — die
   drei Dinge, die an der Kasse zählen.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumbLand } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/* «Gutschein» in sechs Sprachen — die erste steht gross, die übrigen als
   feine Zeile darunter. Ein Gutschein wird oft verschenkt, auch über die
   Grenze. */
const GUT_WORT = {
  de:'Gutschein', en:'Voucher', fr:'Bon cadeau',
  it:'Buono',      pt:'Vale',    es:'Vale regalo'
};

export default {
  id:'gutschein',
  title:'Gutschein',
  sub:'Wertgutschein fürs Haus · A5 quer, zum Verschenken',
  badge:'Empfang',
  root:'t-gut',
  page:'a5-land',
  multipage:true,
  pageOf(){ return 'a5-land'; },

  thumb: thumbLand(`
    <rect x="0" y="0" width="297" height="210" fill="#2A3350"/>
    <rect x="24" y="28" width="70" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="48" width="150" height="26" rx="6" fill="#fff"/>
    <rect x="24" y="92" width="120" height="7" rx="3.5" fill="#fff" opacity=".55"/>
    <rect x="24" y="150" width="70" height="7" rx="3.5" fill="#fff" opacity=".55"/>
    <rect x="24" y="164" width="96" height="7" rx="3.5" fill="#fff" opacity=".8"/>
    <rect x="196" y="40" width="78" height="128" rx="8" fill="#01B1E2"/>
    <rect x="210" y="86" width="50" height="20" rx="4" fill="#fff"/>
    <rect x="212" y="116" width="46" height="6" rx="3" fill="#2A3350" opacity=".7"/>`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt «Gutschein» in der ersten gewählten Sprache.' },

    { t:'group', label:'Wert' },
    { k:'wert',    label:'Wert', type:'text',
      hint:'Ein Betrag (CHF 100) oder eine Leistung («Eine Übernachtung für zwei»).' },
    { k:'wertZusatz', label:'Zusatz unter dem Wert', type:'text' },

    { t:'group', label:'Für wen' },
    { k:'fuer', label:'Für', type:'text' },
    { k:'von',  label:'Von', type:'text' },
    { k:'gruss', label:'Widmung', type:'textarea', rows:2 },

    { t:'group', label:'Einlösung' },
    { k:'code',    label:'Gutschein-Nr.', type:'text' },
    { k:'gueltig', label:'Gültig bis', type:'text' },
    { k:'bedingungen', label:'Bedingungen', type:'textarea', rows:2 },

    { t:'group', label:'QR-Code' },
    { k:'qrText',  label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code. Sonst die Buchungsseite.' },

    { t:'group', label:'Serie' },
    { t:'note', label:'Ein Blatt je Gutschein, fortlaufend nummeriert — für den Stapel am Empfang. Die Nummer ersetzt das Feld «Gutschein-Nr.».' },
    { k:'serie', label:'Serie drucken', type:'select', options:[
      { v:'nein', t:'nein — ein einzelner Gutschein' },
      { v:'ja',   t:'ja — nummerierte Blätter' } ] },
    { k:'serieVon', label:'von Nr.', type:'number', min:1, max:999, step:1 },
    { k:'serieBis', label:'bis Nr.', type:'number', min:1, max:999, step:1,
      hint:'Höchstens 60 Blätter aufs Mal — sonst wird der Browser zäh.' },

    { t:'group', label:'Sprachen' },
    { t:'note',  label:'Die Sprachen betreffen das Wort «Gutschein». Wert und Widmung stehen so da, wie du sie schreibst.' },
    { k:'sprachen',  label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Ein Geschenk für Sie',
    titel:'',
    wert:'CHF 100',
    wertZusatz:'einzulösen im Haus',
    fuer:'',
    von:'',
    gruss:'',
    code:'',
    gueltig:'gültig zwei Jahre ab Ausstellung',
    bedingungen:'Nicht in bar auszahlbar. Restguthaben bleibt bestehen. Bitte bei der Buchung angeben.',
    qrText:'',
    serie:'nein', serieVon:1, serieBis:20,
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
    const titel = has(d.titel) ? d.titel : (GUT_WORT[sprachen[0].id] || GUT_WORT.de);
    const weitere = sprachen.slice(1).map(sp => GUT_WORT[sp.id]).filter(Boolean);

    const qr = has(d.qrText)
      ? `<div class="t-gut-qr">${qrSvg(d.qrText, { stufe:'M', groesse:'22mm', farbe:'#fff', rand:0 })}</div>`
      : '';

    /* Serie: je Blatt ein Gutschein mit fortlaufender Nummer. */
    if (d.serie === 'ja'){
      const von = Math.max(1, Math.min(999, Number(d.serieVon) || 1));
      const bis = Math.min(von + 59, Math.max(von, Math.min(999, Number(d.serieBis) || von)));
      let seiten = '';
      for (let n = von; n <= bis; n++) seiten += blatt(String(n).padStart(3, '0'));
      return seiten;
    }
    return blatt(d.code);

    function blatt(code){
      return `<article data-page class="t-gut-seite">
      <div class="t-gut-karte">
        <section class="t-gut-links">
          <header class="t-gut-kopf">
            ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
            <h1>${esc(titel)}</h1>
            ${weitere.length ? `<p class="t-gut-sprachen">${esc(weitere.join(' · '))}</p>` : ''}
          </header>

          <div class="t-gut-mitte">
            ${(has(d.fuer) || has(d.von)) ? `
            <dl class="t-gut-namen">
              ${has(d.fuer) ? `<div><dt>Für</dt><dd>${esc(d.fuer)}</dd></div>` : ''}
              ${has(d.von)  ? `<div><dt>Von</dt><dd>${esc(d.von)}</dd></div>` : ''}
            </dl>` : ''}
            ${has(d.gruss) ? `<p class="t-gut-gruss">${esc(d.gruss)}</p>` : ''}
          </div>

          <footer class="t-gut-fuss">
            <span class="t-gut-mark">${istHotel(d.absender) ? logo('white', 24) : esc(abs.name)}</span>
            ${(has(code) || has(d.gueltig)) ? `<span class="t-gut-meta">${
              esc([code && ('Nr. ' + code), d.gueltig].filter(Boolean).join(' · '))}</span>` : ''}
          </footer>
        </section>

        <aside class="t-gut-rechts">
          <span class="t-gut-ico">${icon('geschenk', 30, 1.6)}</span>
          <p class="t-gut-wert">${esc(d.wert || '')}</p>
          ${has(d.wertZusatz) ? `<p class="t-gut-wertzusatz">${esc(d.wertZusatz)}</p>` : ''}
          ${qr}
        </aside>
      </div>
      ${has(d.bedingungen) ? `<p class="t-gut-bed">${esc(d.bedingungen)} · ${esc(abs.foot)}</p>` : ''}
      </article>`;
    }
  }
};
