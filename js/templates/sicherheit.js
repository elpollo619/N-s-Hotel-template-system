/* Sicherheitszeichen · eine Seite je Schild.
   Verbot, Warnung, Gebot, Rettung und Brandschutz in der Formensprache von
   ISO 3864-1 / ISO 7010 — siehe js/lib/sicherheitszeichen.js, dort steht auch,
   warum das keine zertifizierten Schilder sind.

   Gedacht für das, was im Haus täglich gebraucht wird: Rauchverbot im
   Treppenhaus, "Tür geschlossen halten" an der Waschküche, Rutschgefahr nach
   dem Putzen. Das Zeichen ist bewusst gross — es soll aus dem Gang wirken,
   nicht erst aus zwei Schritten Abstand. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { szSvg, szZeichen, szOptions, SZ_FARBEN } from '../lib/sicherheitszeichen.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const SICHER_PAGES = { a5:'a5', 'a5-land':'a5-land', a4:'a4', 'a4-land':'a4-land' };
/* Zeichengrösse je Papier — so gross wie möglich, ohne den Text zu verdrängen. */
const SICHER_MASS = { 'a5-land':62, a5:78, a4:118, 'a4-land':92 };
/* Schneidebogen: mehrere kleine Schilder auf ein A4, zum Ausschneiden. */
const SICHER_BOGEN = { '2':{ proSeite:2, mass:52 }, '4':{ proSeite:4, mass:34 } };

export default {
  id:'sicherheit',
  title:'Sicherheitszeichen',
  sub:'Verbot, Warnung, Gebot, Rettung · eine Seite je Schild',
  badge:'Sicherheit',
  root:'t-sicher',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'sicherheit',
  multipage:true,
  pageOf(d){
    /* Der Schneidebogen ist immer A4 hoch — darauf sitzen die Schilder. */
    if (d && SICHER_BOGEN[d.bogen]) return 'a4';
    return SICHER_PAGES[d && d.format] || 'a5-land';
  },

  thumb: thumb(`
    <rect x="12" y="22" width="186" height="112" rx="10" fill="#fff" stroke="#E5E8ED" stroke-width="2"/>
    <circle cx="66" cy="70" r="34" fill="#fff"/>
    <circle cx="66" cy="70" r="31" fill="none" stroke="#C8102E" stroke-width="5.5"/>
    <path d="M44 48 88 92" stroke="#C8102E" stroke-width="5.5"/>
    <rect x="50" y="66" width="26" height="7" rx="2" fill="#1A1A1A"/>
    <rect x="112" y="56" width="70" height="12" rx="4" fill="#2A3350"/>
    <rect x="112" y="76" width="52" height="8" rx="4" fill="#C9CFDA"/>
    <rect x="12" y="150" width="186" height="112" rx="10" fill="#fff" stroke="#E5E8ED" stroke-width="2"/>
    <path d="M66 168 96 220H36Z" fill="#F9A800" stroke="#1A1A1A" stroke-width="4" stroke-linejoin="round"/>
    <rect x="63" y="188" width="6" height="16" rx="3" fill="#1A1A1A"/>
    <circle cx="66" cy="210" r="3.5" fill="#1A1A1A"/>
    <rect x="112" y="184" width="70" height="12" rx="4" fill="#2A3350"/>
    <rect x="112" y="204" width="44" height="8" rx="4" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Format' },
    { k:'bogen', label:'Anordnung', type:'select', options:[
      { v:'einzeln', t:'ein Schild je Blatt' },
      { v:'2', t:'Schneidebogen — 2 Schilder auf A4' },
      { v:'4', t:'Schneidebogen — 4 Schilder auf A4' }
    ], hint:'Der Schneidebogen spart Papier. Die gestrichelten Linien sind die Schnittkanten und werden mitgedruckt.' },
    { k:'format', label:'Papier (nur bei «ein Schild je Blatt»)', type:'select', options:[
      { v:'a5-land', t:'A5 quer' }, { v:'a5', t:'A5 hoch' },
      { v:'a4', t:'A4 hoch' }, { v:'a4-land', t:'A4 quer' }
    ] },

    { t:'group', label:'Sprachen' },
    { k:'sprachen', label:'Sprachen auf dem Schild', type:'checks', options:sprachOptions(),
      hint:'Die erste Sprache steht gross, die weiteren kleiner darunter.' },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },
    { k:'setzeSprachen', label:'Zusammenstellung übernehmen', type:'action' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },

    { t:'group', label:'Schilder' },
    { t:'note', label:'Jede Zeile ergibt eine Druckseite. Der Text darf überschrieben werden — das Zeichen bleibt.' },
    { k:'rows', label:'Schilder', type:'list', itemLabel:'Schild', max:16,
      defaultItem:{ zeichen:'rauchen-verboten', de:'', zusatz:'' },
      item:[
        { k:'zeichen', label:'Zeichen', type:'select', options:szOptions() },
        { k:'de',      label:'Text überschreiben (Hauptsprache)', type:'text',
          hint:'Leer lassen: der Normtext in allen gewählten Sprachen.' },
        { k:'zusatz',  label:'Zusatzzeile', type:'text',
          hint:'z. B. «gilt im ganzen Treppenhaus» oder eine Bussenhöhe' }
      ] },

    { t:'group', label:'Fusszeile' },
    { k:'fussnote', label:'Hinweis klein', type:'text' }
  ],

  defaults:{
    format:'a5-land',
    bogen:'einzeln',
    sprachen:['de','en'],
    sprachSet:'',
    objekt:'-',
    absender:'immobilien',
    rows:[
      { zeichen:'rauchen-verboten', de:'', zusatz:'Gilt im ganzen Treppenhaus' },
      { zeichen:'abstellen-verboten', de:'', zusatz:'' }
    ],
    fussnote:'Danke für Ihr Verständnis.'
  },

  actions:{
    setzeSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs  = ABSENDER[d.absender] || ABSENDER.immobilien;
    const obj  = objekt(d.objekt);
    const adr  = objektAdresse(d.objekt);
    const sprachen = sprachObjekte(d.sprachen);
    const bogen = SICHER_BOGEN[d.bogen] || null;
    const page = bogen ? 'a4' : (SICHER_PAGES[d.format] || 'a5-land');
    const mass = bogen ? bogen.mass : (SICHER_MASS[page] || 62);
    const quer = !bogen && page.endsWith('-land');

    const zelle = r => {
      const z = szZeichen(r.zeichen);
      /* Ist ein eigener Text gesetzt, ersetzt er die Hauptsprache; die
         übrigen Sprachen bleiben beim Normtext. */
      const zeile = (sp, i) => (i === 0 && has(r.de)) ? r.de : (z.text[sp.id] || '');
      const akzent = z.art === 'rettung' ? SZ_FARBEN.gruen
                   : z.art === 'gebot'   ? SZ_FARBEN.blau
                   : z.art === 'warnung' ? SZ_FARBEN.gelb : SZ_FARBEN.rot;
      return `
        <div class="t-sicher-body">
          <div class="t-sicher-mark">${szSvg(z.art, z.pikto, mass)}</div>
          <div class="t-sicher-txt">
            <h1 lang="${sprachen[0].id}">${esc(zeile(sprachen[0], 0))}</h1>
            ${sprachen.slice(1).map((sp, i) => has(zeile(sp, i + 1))
              ? `<p class="t-sicher-mehr" lang="${sp.id}">${esc(zeile(sp, i + 1))}</p>` : '').join('')}
            ${has(r.zusatz) ? `<p class="t-sicher-zusatz">${esc(r.zusatz)}</p>` : ''}
          </div>
        </div>
        <footer class="t-sicher-foot">
          <span class="t-sicher-abs">${istHotel(d.absender) ? logo('color', bogen ? 16 : 22) : esc(abs.legal)}</span>
          <span class="t-sicher-ort">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
          ${has(d.fussnote) ? `<span class="t-sicher-note">${esc(d.fussnote)}</span>` : ''}
        </footer>`;
      };

    const zeilen = (d.rows || []).map(r => ({ r, akzentZ:szZeichen(r.zeichen) }));

    if (!bogen){
      return zeilen.map(({ r, akzentZ }) => `
      <article data-page class="t-sicher-page${quer ? ' is-quer' : ''}"
               style="--sz-akzent:${akzentZ.art === 'rettung' ? SZ_FARBEN.gruen
                                   : akzentZ.art === 'gebot' ? SZ_FARBEN.blau
                                   : akzentZ.art === 'warnung' ? SZ_FARBEN.gelb : SZ_FARBEN.rot}">
        ${zelle(r)}
      </article>`).join('');
    }

    /* Schneidebogen: je Seite so viele Schilder wie eingestellt. Leere
       Plätze bleiben leer — geschnitten wird trotzdem an der Linie. */
    const seiten = [];
    for (let i = 0; i < zeilen.length; i += bogen.proSeite){
      const teil = zeilen.slice(i, i + bogen.proSeite);
      const felder = teil.map(({ r, akzentZ }) => `
        <div class="t-sicher-zelle"
             style="--sz-akzent:${akzentZ.art === 'rettung' ? SZ_FARBEN.gruen
                                 : akzentZ.art === 'gebot' ? SZ_FARBEN.blau
                                 : akzentZ.art === 'warnung' ? SZ_FARBEN.gelb : SZ_FARBEN.rot}">
          ${zelle(r)}
        </div>`).join('');
      const leer = Array.from({ length:bogen.proSeite - teil.length },
        () => '<div class="t-sicher-zelle is-leer"></div>').join('');
      seiten.push(`<article data-page class="t-sicher-bogen is-${bogen.proSeite}">${felder}${leer}</article>`);
    }
    return seiten.join('');
  }
};
