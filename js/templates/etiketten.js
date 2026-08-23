/* Etikettenbogen · A4 mit Klebeetiketten.
   Für alles, was beschriftet werden muss und nicht die Grösse eines Aushangs
   hat: Schlüsselanhänger, Schränke, Putzmittel, Vorratsdosen, Namensschilder
   an der Bürotür, Inventar.

   Die Raster folgen den gängigen Avery-Zweckform-Bögen. Die Etikettengrössen
   und die Anzahl je Bogen stammen vom Hersteller; die Randmasse sind daraus
   mittig berechnet — bei Avery sitzt das Raster zentriert auf dem A4-Blatt.
   Vor dem ersten Bogen einen Probedruck auf normales Papier machen und
   gegen den Etikettenbogen halten. Drucker verschieben gerne um ein bis zwei
   Millimeter; dafür gibt es unten die Feinverschiebung.

   Beim Drucken zwingend: Ränder "keine" und Skalierung 100 %. Sobald der
   Browser das Blatt einpasst, stimmt kein Etikett mehr. */
import { esc, has } from '../lib/dom.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { objekt, objektOptions } from '../objekte.js';

/* Alle Masse in Millimetern. rand* = Abstand zur Blattkante oben/links. */
export const ETIKETT_RASTER = {
  'l7160': { name:'Avery L7160 · 63,5 × 38,1 mm · 21 Stück',
             spalten:3, zeilen:7,  b:63.5, h:38.1, randL:7.25,  randO:15.15, lueckeX:2.5, lueckeY:0 },
  'l7163': { name:'Avery L7163 · 99,1 × 38,1 mm · 14 Stück',
             spalten:2, zeilen:7,  b:99.1, h:38.1, randL:4.65,  randO:15.15, lueckeX:2.5, lueckeY:0 },
  'l7165': { name:'Avery L7165 · 99,1 × 67,7 mm · 8 Stück',
             spalten:2, zeilen:4,  b:99.1, h:67.7, randL:4.65,  randO:13.10, lueckeX:2.5, lueckeY:0 },
  'l7651': { name:'Avery L7651 · 38,1 × 21,2 mm · 65 Stück',
             spalten:5, zeilen:13, b:38.1, h:21.2, randL:4.75,  randO:10.70, lueckeX:2.5, lueckeY:0 },
  'frei':  { name:'Freies Raster — Masse selber setzen',
             spalten:3, zeilen:8,  b:60,   h:32,   randL:9,     randO:10,    lueckeX:4,   lueckeY:2 }
};

export function etikettRaster(d){
  const basis = ETIKETT_RASTER[d && d.raster] || ETIKETT_RASTER.l7160;
  if ((d && d.raster) !== 'frei') return basis;
  const z = (v, f) => (v === '' || v == null || isNaN(Number(v))) ? f : Number(v);
  return { ...basis,
    spalten:Math.max(1, z(d.spalten, basis.spalten)),
    zeilen: Math.max(1, z(d.zeilen,  basis.zeilen)),
    b:z(d.breite, basis.b), h:z(d.hoehe, basis.h),
    randL:z(d.randL, basis.randL), randO:z(d.randO, basis.randO),
    lueckeX:z(d.lueckeX, basis.lueckeX), lueckeY:z(d.lueckeY, basis.lueckeY) };
}

export default {
  id:'etiketten',
  title:'Etikettenbogen',
  sub:'Klebeetiketten auf A4 — Schlüssel, Schränke, Vorräte',
  badge:'Etiketten',
  root:'t-etikett',
  cat:'etiketten',
  multipage:true,
  page:'a4',

  thumb: thumb(`
    <rect x="10" y="10" width="190" height="270" rx="6" fill="#fff" stroke="#E5E8ED" stroke-width="2"/>
    ${[0,1,2,3,4,5].map(r => [0,1,2].map(c => `
      <rect x="${20 + c * 60}" y="${26 + r * 42}" width="54" height="36" rx="4"
            fill="#F6F7FA" stroke="#C9CFDA" stroke-width="1.4" stroke-dasharray="3 3"/>
      <rect x="${20 + c * 60}" y="${26 + r * 42}" width="4" height="36" fill="${r % 2 ? '#01B1E2' : '#2A3350'}"/>
      <rect x="${30 + c * 60}" y="${36 + r * 42}" width="34" height="7" rx="3.5" fill="#2A3350"/>
      <rect x="${30 + c * 60}" y="${48 + r * 42}" width="24" height="5" rx="2.5" fill="#C9CFDA"/>`).join('')).join('')}`),

  fields:[
    { t:'group', label:'Bogen' },
    { k:'raster', label:'Etikettenbogen', type:'select',
      options:Object.entries(ETIKETT_RASTER).map(([v, r]) => ({ v, t:r.name })),
      hint:'Die Nummer steht auf der Packung. Passt keine: «Freies Raster» nehmen und ausmessen.' },
    { k:'hilfslinien', label:'Hilfslinien zeigen', type:'select',
      options:[{v:'nein',t:'nein'},{v:'ja',t:'ja — nur zum Ausprobieren'}],
      hint:'Gestrichelte Ränder für den Probedruck auf normalem Papier. Auf dem echten Bogen ausschalten.' },

    { t:'group', label:'Feinverschiebung' },
    { t:'note', label:'Wenn beim Probedruck alles um ein paar Millimeter daneben sitzt: hier gegensteuern. Plus verschiebt nach rechts bzw. nach unten.' },
    { k:'schiebX', label:'links / rechts (mm)', type:'number', step:0.5, min:-10, max:10 },
    { k:'schiebY', label:'oben / unten (mm)',  type:'number', step:0.5, min:-10, max:10 },

    { t:'group', label:'Freies Raster', },
    { t:'note', label:'Nur wirksam, wenn oben «Freies Raster» gewählt ist.' },
    { k:'spalten', label:'Spalten', type:'number', min:1, max:12 },
    { k:'zeilen',  label:'Zeilen',  type:'number', min:1, max:20 },
    { k:'breite',  label:'Etikett breit (mm)', type:'number', step:0.1 },
    { k:'hoehe',   label:'Etikett hoch (mm)',  type:'number', step:0.1 },
    { k:'randL',   label:'Rand links (mm)', type:'number', step:0.1 },
    { k:'randO',   label:'Rand oben (mm)',  type:'number', step:0.1 },
    { k:'lueckeX', label:'Lücke waagrecht (mm)', type:'number', step:0.1 },
    { k:'lueckeY', label:'Lücke senkrecht (mm)', type:'number', step:0.1 },

    { t:'group', label:'Aussehen' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions,
      hint:'Setzt das Kürzel als kleine Zeile auf jedes Etikett.' },
    { k:'kuerzel', label:'Kürzel mitdrucken', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },
    { k:'balken', label:'Farbbalken', type:'select',
      options:[{v:'links',t:'links'},{v:'oben',t:'oben'},{v:'nein',t:'kein Balken'}] },

    { t:'group', label:'Etiketten' },
    { t:'note', label:'«Anzahl» wiederholt dasselbe Etikett. Ein voller Bogen entsteht, wenn die Summe dem Bogen entspricht — der Rest bleibt leer.' },
    { k:'rows', label:'Etiketten', type:'list', itemLabel:'Etikett', max:40,
      defaultItem:{ titel:'', unter:'', anzahl:1, farbe:'#2A3350', ico:'key' },
      item:[
        { k:'titel',  label:'Grosse Zeile', type:'text' },
        { k:'unter',  label:'Kleine Zeile', type:'text' },
        { k:'anzahl', label:'Anzahl', type:'number', min:1, max:200 },
        { k:'farbe',  label:'Farbe', type:'color' },
        { k:'ico',    label:'Symbol', type:'select',
          options:[{v:'',t:'kein Symbol'}].concat(iconOptions()) }
      ] }
  ],

  defaults:{
    raster:'l7160',
    hilfslinien:'nein',
    schiebX:0, schiebY:0,
    spalten:3, zeilen:8, breite:60, hoehe:32,
    randL:9, randO:10, lueckeX:4, lueckeY:2,
    objekt:'-',
    kuerzel:'nein',
    balken:'links',
    rows:[
      { titel:'Zimmer 1', unter:'Hauptschlüssel', anzahl:2, farbe:'#2A3350', ico:'key' },
      { titel:'Waschküche', unter:'Untergeschoss', anzahl:2, farbe:'#01B1E2', ico:'key' },
      { titel:'Putzmittel', unter:'nicht in Griffhöhe lagern', anzahl:4, farbe:'#C0271F', ico:'warn' }
    ]
  },

  render(d){
    const r   = etikettRaster(d);
    const obj = objekt(d.objekt);
    const proBogen = r.spalten * r.zeilen;
    const dx = Number(d.schiebX) || 0;
    const dy = Number(d.schiebY) || 0;

    /* Liste zu Einzeletiketten aufblasen (Anzahl je Zeile). */
    const alle = [];
    for (const row of (d.rows || [])){
      const n = Math.max(1, Math.min(200, Number(row.anzahl) || 1));
      for (let i = 0; i < n; i++) alle.push(row);
    }
    if (!alle.length) return '';

    const bogen = Math.ceil(alle.length / proBogen);
    const seiten = [];

    for (let s = 0; s < bogen; s++){
      const stueck = alle.slice(s * proBogen, (s + 1) * proBogen);
      const felder = stueck.map((row, i) => {
        const sp = i % r.spalten, ze = Math.floor(i / r.spalten);
        const x = r.randL + sp * (r.b + r.lueckeX) + dx;
        const y = r.randO + ze * (r.h + r.lueckeY) + dy;
        const farbe = row.farbe || '#2A3350';
        return `
        <div class="t-etikett-feld${d.hilfslinien === 'ja' ? ' is-hilfe' : ''} is-${esc(d.balken || 'links')}"
             style="left:${x}mm;top:${y}mm;width:${r.b}mm;height:${r.h}mm;--farbe:${esc(farbe)}">
          ${d.balken === 'nein' ? '' : '<span class="t-etikett-balken"></span>'}
          <div class="t-etikett-inhalt">
            ${row.ico ? `<span class="t-etikett-ico">${icon(row.ico, 20, 1.8)}</span>` : ''}
            <div class="t-etikett-txt">
              ${has(row.titel) ? `<b>${esc(row.titel)}</b>` : ''}
              ${has(row.unter) ? `<i>${esc(row.unter)}</i>` : ''}
              ${d.kuerzel === 'ja' && obj.code ? `<u>${esc(obj.code)}</u>` : ''}
            </div>
          </div>
        </div>`;
      }).join('');

      seiten.push(`<article data-page class="t-etikett-page">${felder}</article>`);
    }
    return seiten.join('');
  }
};
