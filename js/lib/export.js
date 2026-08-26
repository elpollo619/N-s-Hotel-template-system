/* ==========================================================================
   Export: "Drucken / PDF" (vektoriell, über den Browser) und PNG.
   PNG entsteht ohne Fremdbibliothek: das Blatt wird als SVG-foreignObject
   serialisiert (mit eingebetteten Schriften) und auf ein Canvas gezeichnet.
   Vorteil gegenüber html2canvas: kein CDN nötig, läuft auch offline.
   ========================================================================== */

import { pdfAusJpegSeiten, jpegBytes } from './pdf.js';

/* Papiermasse in Millimetern — fuer den PDF-Export. */
const PAGE_MM = {
  'a4':[210,297], 'a4-land':[297,210], 'a5':[148,210], 'a5-land':[210,148],
  'a3':[297,420], 'a3-land':[420,297], 'letter':[216,279], 'letter-land':[279,216],
  'a2':[420,594], 'a2-land':[594,420], 'a1':[594,841], 'a1-land':[841,594],
  'a0':[841,1189], 'a0-land':[1189,841]
};

const PAGE_CSS = {
  'a4':      '@page{size:A4;margin:0}',
  'a4-land': '@page{size:A4 landscape;margin:0}',
  'a5':      '@page{size:A5;margin:0}',
  'a5-land': '@page{size:A5 landscape;margin:0}',
  'a3':      '@page{size:A3;margin:0}',
  'a3-land': '@page{size:A3 landscape;margin:0}',
  'letter':      '@page{size:Letter;margin:0}',
  'letter-land': '@page{size:Letter landscape;margin:0}',
  'a2':      '@page{size:420mm 594mm;margin:0}',
  'a2-land': '@page{size:594mm 420mm;margin:0}',
  'a1':      '@page{size:594mm 841mm;margin:0}',
  'a1-land': '@page{size:841mm 594mm;margin:0}',
  'a0':      '@page{size:841mm 1189mm;margin:0}',
  'a0-land': '@page{size:1189mm 841mm;margin:0}'
};

/** Papierformat für den Druck setzen. */
export function setPageSize(page){
  const tag = document.getElementById('vz-page-size');
  if (tag) tag.textContent = PAGE_CSS[page] || PAGE_CSS['a4'];
}

export async function printSheet(){
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  window.print();
}

/* ---------- PNG --------------------------------------------------------- */

const COPY_PROPS = (
  'display position top right bottom left width height min-width min-height max-width max-height ' +
  'margin-top margin-right margin-bottom margin-left ' +
  'padding-top padding-right padding-bottom padding-left ' +
  'box-sizing overflow overflow-x overflow-y z-index float clear vertical-align aspect-ratio ' +
  'flex-direction flex-wrap flex-grow flex-shrink flex-basis justify-content align-items align-self ' +
  'align-content gap row-gap column-gap order ' +
  'grid-template-columns grid-template-rows grid-column grid-row grid-auto-flow grid-auto-rows place-items ' +
  'font-family font-size font-weight font-style font-variant font-feature-settings line-height ' +
  'letter-spacing word-spacing text-align text-transform text-decoration text-indent white-space ' +
  'word-break overflow-wrap color direction ' +
  'background-color background-image background-size background-position background-repeat background-clip ' +
  'border-top-width border-right-width border-bottom-width border-left-width ' +
  'border-top-style border-right-style border-bottom-style border-left-style ' +
  'border-top-color border-right-color border-bottom-color border-left-color ' +
  'border-top-left-radius border-top-right-radius border-bottom-right-radius border-bottom-left-radius ' +
  'box-shadow opacity visibility transform transform-origin filter mix-blend-mode ' +
  'object-fit object-position list-style ' +
  'fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray stroke-dashoffset ' +
  'stroke-opacity fill-opacity paint-order dominant-baseline text-anchor marker-end marker-start'
).split(' ');

function inlineStyles(src, dst){
  const cs = getComputedStyle(src);
  let css = '';
  for (const p of COPY_PROPS){
    const v = cs.getPropertyValue(p);
    if (!v) continue;
    if (v.includes('url(') && !v.includes('data:')) continue; // externe Bilder überspringen
    css += p + ':' + v + ';';
  }
  dst.setAttribute('style', css);
  const sk = src.children, dk = dst.children;
  for (let i = 0; i < sk.length; i++){
    if (dk[i]) inlineStyles(sk[i], dk[i]);
  }
}

function blobToDataUrl(blob){
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

let fontCssCache = null;
async function embeddedFontCss(){
  if (fontCssCache != null) return fontCssCache;
  let out = '';
  for (const sheet of Array.from(document.styleSheets)){
    let rules;
    try{ rules = sheet.cssRules; }catch(_){ continue; }  // fremde Herkunft
    if (!rules) continue;
    for (const rule of Array.from(rules)){
      if (rule.type !== 5 /* CSSRule.FONT_FACE_RULE */) continue;
      let text = rule.cssText;
      const m = /url\(\s*(['"]?)([^'")]+)\1\s*\)/.exec(text);
      if (m && !m[2].startsWith('data:')){
        try{
          const url = new URL(m[2], sheet.href || location.href);
          const blob = await (await fetch(url)).blob();
          text = text.replace(m[0], 'url(' + await blobToDataUrl(blob) + ')');
        }catch(_){ continue; }  // Schrift nicht ladbar -> Fallback im PNG
      }
      out += text + '\n';
    }
  }
  fontCssCache = out;
  return out;
}

/** Externe <img>-Quellen in Data-URLs wandeln, damit sie im PNG erscheinen. */
async function inlineImages(root){
  const imgs = Array.from(root.querySelectorAll('img'))
    .concat(Array.from(root.querySelectorAll('image')));
  for (const img of imgs){
    const attr = img.tagName.toLowerCase() === 'img' ? 'src' : 'href';
    const val = img.getAttribute(attr) || img.getAttribute('xlink:href') || '';
    if (!val || val.startsWith('data:')) continue;
    try{
      const blob = await (await fetch(new URL(val, location.href))).blob();
      img.setAttribute(attr, await blobToDataUrl(blob));
    }catch(_){ img.removeAttribute(attr); }
  }
}

/**
 * Blatt als PNG herunterladen.
 * @param {HTMLElement} sheet  das .sheet-Element
 * @param {string} filename    z. B. "ns-hotel-notruf.png"
 * @param {number} scale       Standard 3 (druckfeine Auflösung)
 */
async function elementToCanvas(el, scale){
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  const w = el.offsetWidth;
  const h = el.offsetHeight;
  /* Grossformate (A0 hat 14 Mio. Pixel) wuerden mit Faktor 3 jedes Canvas
     sprengen — die Flaeche wird auf ~22 Mio. Pixel gedeckelt. */
  const s = Math.min(scale, Math.sqrt(22e6 / Math.max(1, w * h)));

  const clone = el.cloneNode(true);
  inlineStyles(el, clone);
  await inlineImages(clone);
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';

  const fontCss = await embeddedFontCss();
  const xhtml = new XMLSerializer().serializeToString(clone);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<style>${fontCss}</style>` +
    `<foreignObject x="0" y="0" width="${w}" height="${h}">${xhtml}</foreignObject></svg>`;

  // Wichtig: als Data-URL laden. Ein blob:-Link würde das Canvas "verunreinigen"
  // (tainted canvas) und toBlob() wäre danach gesperrt.
  const url = await blobToDataUrl(new Blob([svg], { type:'image/svg+xml;charset=utf-8' }));
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error('SVG konnte nicht gerendert werden'));
    i.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width  = Math.round(w * s);
  canvas.height = Math.round(h * s);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export async function sheetToPng(sheet, filename, scale = 3){
  const canvas = await elementToCanvas(sheet, scale);
  const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
  if (!blob) throw new Error('Canvas leer');
  downloadBlob(blob, filename);
}

/**
 * Blatt (ein- oder mehrseitig) als echtes PDF — eigener Schreiber, das
 * JPEG jeder Seite wird unveraendert eingebettet.
 * @param {HTMLElement} sheet  das .sheet-Element
 * @param {string} page        Format-Kennung, z. B. 'a4' oder 'a0-land'
 * @param {number} scale       Ziel-Aufloesung (wird bei Grossformaten gedeckelt)
 * @returns {Promise<Blob>}
 */
export async function sheetToPdfBlob(sheet, page, scale = 2.5){
  const [wmm, hmm] = PAGE_MM[page] || PAGE_MM['a4'];
  const einzeln = Array.from(sheet.querySelectorAll('[data-page]'));
  const elemente = einzeln.length ? einzeln : [sheet];
  const seiten = [];
  for (const el of elemente){
    const canvas = await elementToCanvas(el, scale);
    const uri = canvas.toDataURL('image/jpeg', 0.92);
    seiten.push({ ...jpegBytes(uri, canvas.width, canvas.height), wmm, hmm });
  }
  return pdfAusJpegSeiten(seiten);
}

/* ---------- Kacheldruck: Grossformat auf A4-Blaetter verteilen ------------ */
/* Nach dem Vorbild von PosteRazor: das Plakat wird in A4-Kacheln zerlegt,
   die jeder Buerodrucker schafft. Jede Kachel traegt 10 mm Ueberlappung zum
   Nachbarblatt (gestrichelte Klebelinie), dazu kommt ein Uebersichtsblatt
   mit Klebeplan und einer 100-mm-Kontrolllinie — misst sie nicht genau
   100 mm, hat der Druckdialog skaliert. */

const K_RAND = 10;    /* weisser Rand je Blatt — Buerodrucker drucken nicht randlos */
const K_UEBER = 10;   /* Ueberlappung zum Nachbarblatt */
const K_PPM = 6;      /* Pixel je Millimeter der Kachel-Seiten (≈152 dpi) */

function kachelRaster(wmm, hmm){
  const kw = 210 - 2 * K_RAND, kh = 297 - 2 * K_RAND;
  const schrittW = kw - K_UEBER, schrittH = kh - K_UEBER;
  return {
    kw, kh, schrittW, schrittH,
    spalten: Math.max(1, Math.ceil((wmm - K_UEBER) / schrittW)),
    reihen:  Math.max(1, Math.ceil((hmm - K_UEBER) / schrittH))
  };
}

function a4Canvas(){
  const c = document.createElement('canvas');
  c.width = 210 * K_PPM; c.height = 297 * K_PPM;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  return { c, ctx };
}

function alsSeite(c){
  return { ...jpegBytes(c.toDataURL('image/jpeg', 0.92), c.width, c.height), wmm:210, hmm:297 };
}

function kachelName(spalte, reihe){
  return String.fromCharCode(65 + spalte) + (reihe + 1);
}

function kachelSchrift(ctx, mm, fett){
  ctx.font = `${fett ? '700 ' : ''}${Math.round(mm * K_PPM)}px "Kumbh Sans", Arial, sans-serif`;
}

/** Uebersichtsblatt: Klebeplan, Anleitung, Kontrolllinie. */
function uebersichtsSeite(quelle, wmm, hmm, raster){
  const { c, ctx } = a4Canvas();
  const mm = v => v * K_PPM;

  ctx.fillStyle = '#2A3350';
  kachelSchrift(ctx, 7, true);
  ctx.fillText(`Kacheldruck: ${raster.spalten} × ${raster.reihen} Blätter A4`, mm(20), mm(28));
  ctx.fillStyle = '#5B6474';
  kachelSchrift(ctx, 4);
  ctx.fillText(`Plakat ${wmm} × ${hmm} mm · ${raster.spalten * raster.reihen} Kacheln · 10 mm Überlappung`, mm(20), mm(36));

  /* Klebeplan: das Plakat verkleinert, darueber das Kachelgitter. */
  const boxW = 170, boxH = 130;
  const s = Math.min(boxW / wmm, boxH / hmm);
  const pw = wmm * s, ph = hmm * s;
  const px = 20 + (boxW - pw) / 2, py = 46;
  ctx.drawImage(quelle, mm(px), mm(py), mm(pw), mm(ph));
  ctx.strokeStyle = '#2A3350'; ctx.lineWidth = 2;
  ctx.strokeRect(mm(px), mm(py), mm(pw), mm(ph));
  ctx.strokeStyle = '#01B1E2'; ctx.lineWidth = 1.5;
  ctx.fillStyle = '#01B1E2';
  kachelSchrift(ctx, 3.6, true);
  for (let r = 0; r < raster.reihen; r++){
    for (let sp = 0; sp < raster.spalten; sp++){
      const x = px + sp * raster.schrittW * s, y = py + r * raster.schrittH * s;
      const w = Math.min(raster.kw, wmm - sp * raster.schrittW) * s;
      const h = Math.min(raster.kh, hmm - r * raster.schrittH) * s;
      ctx.strokeRect(mm(x), mm(y), mm(w), mm(h));
      ctx.fillText(kachelName(sp, r), mm(x + 2), mm(y + 5));
    }
  }

  /* Anleitung. */
  ctx.fillStyle = '#2A3350';
  kachelSchrift(ctx, 4);
  const zeilen = [
    '1.  Alle Blätter auf A4 drucken — Skalierung 100 % («Tatsächliche Grösse»).',
    '2.  Kontrolllinie unten nachmessen: genau 100 mm — sonst skaliert der Drucker.',
    '3.  Weisse Ränder bis zum grauen Rahmen abschneiden (Rahmen = 190 × 277 mm).',
    '4.  Blätter Reihe für Reihe kleben: das nächste Blatt bis zur blauen',
    '     gestrichelten Linie über das vorige legen (10 mm Überlappung).'
  ];
  zeilen.forEach((z, i) => ctx.fillText(z, mm(20), mm(192 + i * 8)));

  /* Kontrolllinie: exakt 100 mm mit Zehner-Marken. */
  const ly = 250;
  ctx.strokeStyle = '#2A3350'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mm(20), mm(ly)); ctx.lineTo(mm(120), mm(ly));
  for (let i = 0; i <= 10; i++){
    ctx.moveTo(mm(20 + i * 10), mm(ly)); ctx.lineTo(mm(20 + i * 10), mm(ly - (i % 5 ? 2.5 : 4)));
  }
  ctx.stroke();
  kachelSchrift(ctx, 3.5);
  ctx.fillText('Kontrolllinie — muss gedruckt genau 100 mm messen', mm(20), mm(ly + 7));

  return alsSeite(c);
}

/** Eine Kachel: Bildausschnitt, grauer Schneide-Rahmen, blaue Klebelinien. */
function kachelSeite(quelle, wmm, hmm, raster, spalte, reihe){
  const { c, ctx } = a4Canvas();
  const mm = v => v * K_PPM;
  const qx = quelle.width / wmm, qy = quelle.height / hmm;

  const sx = spalte * raster.schrittW, sy = reihe * raster.schrittH;
  const sw = Math.min(raster.kw, wmm - sx), sh = Math.min(raster.kh, hmm - sy);
  ctx.drawImage(quelle, sx * qx, sy * qy, sw * qx, sh * qy,
                mm(K_RAND), mm(K_RAND), mm(sw), mm(sh));

  /* Schneide-Rahmen (hellgrau) um den bedruckten Bereich. */
  ctx.strokeStyle = '#B9C0CC'; ctx.lineWidth = 1.5;
  ctx.strokeRect(mm(K_RAND), mm(K_RAND), mm(sw), mm(sh));

  /* Klebelinien: dort endet das naechste Blatt nach dem Aufkleben. */
  ctx.strokeStyle = '#01B1E2'; ctx.lineWidth = 2;
  ctx.setLineDash([mm(2), mm(1.6)]);
  ctx.beginPath();
  if (spalte < raster.spalten - 1){
    ctx.moveTo(mm(K_RAND + sw - K_UEBER), mm(K_RAND));
    ctx.lineTo(mm(K_RAND + sw - K_UEBER), mm(K_RAND + sh));
  }
  if (reihe < raster.reihen - 1){
    ctx.moveTo(mm(K_RAND), mm(K_RAND + sh - K_UEBER));
    ctx.lineTo(mm(K_RAND + sw), mm(K_RAND + sh - K_UEBER));
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#5B6474';
  kachelSchrift(ctx, 3.5, true);
  ctx.fillText(`Blatt ${kachelName(spalte, reihe)}`, mm(K_RAND), mm(7));
  kachelSchrift(ctx, 3.2);
  ctx.fillText(`Reihe ${reihe + 1}/${raster.reihen} · Spalte ${spalte + 1}/${raster.spalten} · Skalierung 100 %`,
               mm(K_RAND + 22), mm(7));

  return alsSeite(c);
}

/**
 * Grossformat als A4-Kachel-PDF: Uebersichtsblatt + eine Kachel je Seite.
 * Bei mehrseitigen Vorlagen wird das erste Blatt gekachelt.
 * @param {HTMLElement} sheet  das .sheet-Element
 * @param {string} page        Format-Kennung, z. B. 'a0'
 * @returns {Promise<Blob>}
 */
export async function sheetToKachelPdf(sheet, page){
  const [wmm, hmm] = PAGE_MM[page] || PAGE_MM['a4'];
  const raster = kachelRaster(wmm, hmm);
  const erste = sheet.querySelector('[data-page]') || sheet;
  const quelle = await elementToCanvas(erste, 4);

  const seiten = [uebersichtsSeite(quelle, wmm, hmm, raster)];
  for (let r = 0; r < raster.reihen; r++){
    for (let s = 0; s < raster.spalten; s++){
      seiten.push(kachelSeite(quelle, wmm, hmm, raster, s, r));
    }
  }
  return pdfAusJpegSeiten(seiten);
}

/** Lohnt sich Kacheln fuer dieses Format? (groesser als ein A4-Blatt) */
export function kachelbar(page){
  const [wmm, hmm] = PAGE_MM[page] || PAGE_MM['a4'];
  return wmm * hmm > 210 * 297 + 1;
}

export function downloadBlob(blob, filename){
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}
