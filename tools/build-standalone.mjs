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
  'js/lib/sprachen.js',
  'js/objekte.js',
  'js/bereiche.js',
  'js/presets.js',
  'js/lib/dom.js',
  'js/lib/icons.js',
  'js/lib/thumbs.js',
  'js/lib/qr.js',
  'js/lib/sicherheitszeichen.js',
  'js/lib/storage.js',
  'js/lib/schriftwahl.js',
  'js/lib/teilen.js',
  'js/lib/lesbarkeit.js',
  'js/lib/kontrast.js',
  'js/lib/verlauf.js',
  'js/lib/favoriten.js',
  'js/lib/sicherung.js',
  'js/lib/geokarte.js',
  'js/lib/staende.js',
  'js/lib/schrift.js',
  'js/lib/eigene.js',
  'js/lib/i18n.js',
  'js/lib/brand.js',
  'js/lib/sitemap.js',
  'js/lib/pdf.js',
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
  'js/templates/hinweis.js',
  'js/templates/parkschild.js',
  'js/templates/waschplan.js',
  'js/templates/mieterbrief.js',
  'js/templates/sammelstelle.js',
  'js/templates/sicherheit.js',
  'js/templates/etiketten.js',
  'js/templates/qrplakat.js',
  'js/templates/foto.js',
  'js/templates/grossplakat.js',
  'js/templates/kurzanleitung.js',
  'js/templates/checkin.js',
  'js/templates/tuerhaenger.js',
  'js/templates/tischaufsteller.js',
  'js/templates/zimmerschild.js',
  'js/templates/willkommen.js',
  'js/templates/feedback.js',
  'js/templates/zeiten.js',
  'js/templates/termin.js',
  'js/templates/klingelschild.js',
  'js/templates/kontakte.js',
  'js/templates/bauarbeiten.js',
  'js/templates/preisliste.js',
  'js/templates/gutschein.js',
  'js/templates/speisekarte.js',
  'js/templates/veranstaltung.js',
  'js/templates/ausserbetrieb.js',
  'js/templates/fundgegenstaende.js',
  'js/templates/paket.js',
  'js/templates/uebergabe.js',
  'js/templates/schluesselquittung.js',
  'js/templates/zaehlerstaende.js',
  'js/templates/maengelmeldung.js',
  'js/templates/hausversammlung.js',
  'js/templates/umzug.js',
  'js/templates/mieten.js',
  'js/templates/turnus.js',
  'js/templates/neuimhaus.js',
  'js/templates/wlankarten.js',
  'js/templates/besichtigung.js',
  'js/templates/ruhezeiten.js',
  'js/templates/notfallblatt.js',
  'js/templates/standortschild.js',
  'js/templates/wegweiser.js',
  'js/templates/empfangstafel.js',
  'js/templates/hausordnung.js',
  'js/templates/fruehstuecktuer.js',
  'js/templates/vollmacht.js',
  'js/templates/protokoll.js',
  'js/templates/kuendigung.js',
  'js/templates/reservationsblatt.js',
  'js/templates/besucherkarte.js',
  'js/templates/mitteilung.js',
  'js/templates/inventar.js',
  'js/templates/tuerschild.js',
  'js/templates/pinnwand.js',
  'js/templates/parkplatznah.js',
  'js/templates/kalender.js',
  'js/templates/checkliste.js',
  'js/templates/ptouch.js',
  'js/templates/serienbrief.js',
  'js/templates/infoscreen.js',
  'js/templates/fluchtweg.js',
  'js/templates/index.js',
  'js/lib/suche.js',
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
    /* Lizenzschutz: OTF/TTF (die gekauften Markenschriften) duerfen NIE in
       die oeffentliche Einzeldatei wandern — auch nicht, wenn jemand die
       brand-fonts.css lokal aktiviert hat und dann baut. */
    if (/\.(otf|ttf)(\?|$)/i.test(u)){
      console.warn(`  · NICHT eingebettet (Lizenzschrift): ${u}`);
      continue;
    }
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

  /* Jede lokal importierte Datei muss auch in MODULES stehen — sonst fehlt
     sie im Buendel und die Einzeldatei bricht erst im Browser, mit einem
     nackten «x is not defined». Lieber hier abbrechen. */
  const fehlend = [];
  for (const rel of MODULES){
    const src = await fs.readFile(p(rel), 'utf8');
    for (const m of src.matchAll(/^import[\s\S]*?from\s+['"](\.[^'"]+)['"];?\s*$/gm)){
      const ziel = path.join(path.dirname(rel), m[1]).replace(/\\/g, '/');
      if (!MODULES.includes(ziel)) fehlend.push(`${ziel}  (gebraucht von ${rel})`);
    }
  }
  if (fehlend.length){
    console.error('\nAbbruch: diese Module fehlen in der Liste MODULES:');
    [...new Set(fehlend)].forEach(f => console.error('  · ' + f));
    console.error('Bitte in tools/build-standalone.mjs eintragen — Abhaengigkeiten zuerst.\n');
    process.exit(1);
  }

  /* Umbenennende Importe (`import { a as b }`) ueberleben das Buendeln nicht:
     die Importzeilen fallen weg, und im gemeinsamen Geltungsbereich heisst
     die Funktion weiter `a`. In der Einzeldatei gaebe das ein nacktes
     «b is not defined» — erst im Browser, nicht hier. Also hier abbrechen. */
  const aliasse = [];
  for (const rel of MODULES){
    const src = await fs.readFile(p(rel), 'utf8');
    for (const m of src.matchAll(/^import\s*\{([^}]*)\}\s*from\s*['"][^'"]+['"];?\s*$/gm)){
      for (const teil of m[1].split(',')){
        const um = /([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)/.exec(teil);
        if (um) aliasse.push(`${um[1]} as ${um[2]}  (in ${rel})`);
      }
    }
  }
  if (aliasse.length){
    console.error('\nAbbruch: umbenennende Importe funktionieren im Buendel nicht:');
    [...new Set(aliasse)].forEach(a => console.error('  · ' + a));
    console.error('Bitte die Funktion selbst eindeutig benennen und ohne «as» importieren.\n');
    process.exit(1);
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
let js = await bundle();

// Marken-Bilder aus brand-config.js als Data-URI einbetten, damit die
// Einzeldatei per file:// keine 404/Fetch-Fehler wirft (Logo im Kopf, in
// den Fusszeilen und beim PNG-Export). Das Luftbild bleibt aussen vor: es
// ist gross und nur im interaktiven Plan-Editor nötig.
for (const rel of ['assets/brand/logo.png', 'assets/brand/logo-white.png', 'assets/brand/favicon.png']){
  try{
    const uri = await dataUri(p(rel));
    js = js.split(`"${rel}"`).join(`"${uri}"`).split(`'${rel}'`).join(`'${uri}'`);
  }catch(_){ console.warn(`  · Marken-Bild fehlt: ${rel}`); }
}
html = html.replace(/<script type="module" src="[^"]+"><\/script>/,
  `<script>\n"use strict";\n(function(){\n${js}\n})();\n</script>`);

await fs.writeFile(p('standalone.html'), html);
const { size } = await fs.stat(p('standalone.html'));
console.log(`Fertig: standalone.html (${(size / 1024 / 1024).toFixed(2)} MB) — läuft per Doppelklick.`);
