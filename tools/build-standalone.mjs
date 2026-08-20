/* ==========================================================================
   Baut standalone.html: die ganze Vorlagen-Zentrale in EINER Datei.
   Damit läuft die App auch ohne Server — einfach doppelklicken (file://),
   auf einen USB-Stick kopieren oder per Mail verschicken.

   Aufruf:  node tools/build-standalone.mjs
   ========================================================================== */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const p = (...x) => path.join(ROOT, ...x);

/* Reihenfolge: Abhängigkeiten zuerst. */
const MODULES = [
  'js/brand-config.js',
  'js/lib/dom.js',
  'js/lib/icons.js',
  'js/lib/thumbs.js',
  'js/lib/storage.js',
  'js/lib/i18n.js',
  'js/lib/brand.js',
  'js/lib/sitemap.js',
  'js/lib/export.js',
  'js/lib/planeditor.js',
  'js/templates/notruf.js',
  'js/templates/rezeption.js',
  'js/templates/sticker.js',
  'js/templates/aushang.js',
  'js/templates/parkplatz.js',
  'js/templates/anfahrt.js',
  'js/templates/luftbild.js',
  'js/templates/zattoo.js',
  'js/templates/planeditor.js',
  'js/templates/gaestemappe.js',
  'js/templates/index.js',
  'js/app.js'
];

const MIME = { '.woff2':'font/woff2', '.woff':'font/woff', '.otf':'font/otf',
               '.ttf':'font/ttf', '.png':'image/png', '.jpg':'image/jpeg',
               '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp' };

async function dataUri(file){
  const buf = await fs.readFile(file);
  const mime = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

/** url(...) in CSS durch Data-URIs ersetzen (relativ zur CSS-Datei). */
async function inlineCssUrls(css, cssFile){
  const dir = path.dirname(cssFile);
  const scan = css.replace(/\/\*[\s\S]*?\*\//g, '');   // Kommentare ignorieren
  const urls = [...scan.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)]
    .map(m => m[1]).filter(u => !u.startsWith('data:') && !/^https?:/.test(u));
  for (const u of new Set(urls)){
    const file = path.join(dir, u);
    try{
      const uri = await dataUri(file);
      css = css.split(`url('${u}')`).join(`url(${uri})`)
               .split(`url("${u}")`).join(`url(${uri})`)
               .split(`url(${u})`).join(`url(${uri})`);
    }catch(_){
      console.warn(`  · übersprungen (nicht gefunden): ${u}`);
    }
  }
  return css;
}

/** ES-Module zu einem klassischen Skript zusammenfügen. */
async function bundle(){
  const exportsOf = new Map();   // Datei -> [Namen]
  const declared  = new Map();   // Name -> Datei (Kollisionspruefung)
  const clashes   = [];
  const parts = [];

  for (const rel of MODULES){
    let src = await fs.readFile(p(rel), 'utf8');
    const names = [];

    // Was exportiert dieses Modul?
    for (const m of src.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)){
      names.push(m[1]);
    }
    exportsOf.set(rel, names);

    // Namensraum-Importe (import * as x from './y.js') auflösen
    const nsImports = [...src.matchAll(/^import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"];?\s*$/gm)];

    // Importe entfernen, export-Schlüsselwörter abstreifen
    src = src.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
             .replace(/^export\s+default\s+/m, `const ${path.basename(rel, '.js').replace(/-/g, '_')} = `)
             .replace(/^export\s+/gm, '');

    // Namensraum-Objekte nachbilden
    let ns = '';
    for (const [, alias, target] of nsImports){
      const targetRel = path.join(path.dirname(rel), target).replace(/\\/g, '/');
      const targetNames = exportsOf.get(targetRel) || [];
      ns += `const ${alias} = { ${targetNames.map(n => `${n}: ${n}`).join(', ')} };\n`;
    }

    // Doppelte Namen auf oberster Ebene sammeln — beim Zusammenfuehren teilen
    // sich alle Module einen Geltungsbereich, ein Name darf nur einmal fallen.
    for (const m of src.matchAll(/^(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)){
      const name = m[1];
      if (declared.has(name)) clashes.push(`${name}  (${declared.get(name)} und ${rel})`);
      else declared.set(name, rel);
    }

    parts.push(`/* ===== ${rel} ===== */\n${ns}${src.trim()}\n`);
  }

  if (clashes.length){
    console.error('\nAbbruch: dieselben Namen kommen in mehreren Modulen vor.');
    console.error('Beim Zusammenfuehren teilen sie sich einen Geltungsbereich:');
    clashes.forEach(c => console.error('  · ' + c));
    console.error('Bitte umbenennen oder importieren statt neu deklarieren.\n');
    process.exit(1);
  }
  return parts.join('\n');
}

/* ---------- Bauen ---------------------------------------------------------- */
console.log('Vorlagen-Zentrale — standalone.html wird gebaut …');
let html = await fs.readFile(p('index.html'), 'utf8');

// Stylesheets einbetten
const links = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">\s*/g)];
let styles = '';
for (const [, href] of links){
  const file = p(href);
  const css = await inlineCssUrls(await fs.readFile(file, 'utf8'), file);
  styles += `/* ===== ${href} ===== */\n${css}\n`;
}
html = html.replace(/<link rel="stylesheet" href="[^"]+">\s*/g, '');
html = html.replace('<style id="vz-page-size">', `<style>\n${styles}</style>\n<style id="vz-page-size">`);

// Service-Worker-Registrierung entfernen: als Einzeldatei gibt es keinen.
// Muss VOR dem Einbetten passieren, sonst trifft der Ausdruck das Bundle.
html = html.replace(/\s*<script>[^<]*serviceWorker[\s\S]*?<\/script>/g, '');
html = html.replace(/\s*<link rel="manifest"[^>]*>/g, '');

// JavaScript einbetten
const js = await bundle();
html = html.replace(/<script type="module" src="[^"]+"><\/script>/,
  `<script>\n"use strict";\n(function(){\n${js}\n})();\n</script>`);

await fs.writeFile(p('standalone.html'), html);
const { size } = await fs.stat(p('standalone.html'));
console.log(`Fertig: standalone.html (${(size / 1024 / 1024).toFixed(2)} MB) — läuft per Doppelklick.`);
