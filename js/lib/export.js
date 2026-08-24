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

export function downloadBlob(blob, filename){
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}
