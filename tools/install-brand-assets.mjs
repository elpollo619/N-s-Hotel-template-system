/* ==========================================================================
   Trägt die echten Marken-Bilder in js/brand-config.js ein.
   Erwartete Ablage:
     assets/brand/logo.png · logo-white.png · favicon.png
     assets/img/aerial-site.png · phone-yealink.jpg
   Aufruf:  node tools/install-brand-assets.mjs
   ========================================================================== */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const EXT = ['.png', '.svg', '.jpg', '.jpeg', '.webp'];

const WANTED = [
  { key:'logo',       dir:'assets/brand', stem:'logo' },
  { key:'logoWhite',  dir:'assets/brand', stem:'logo-white' },
  { key:'favicon',    dir:'assets/brand', stem:'favicon' },
  { key:'aerial',     dir:'assets/img',   stem:'aerial-site' },
  { key:'phonePhoto', dir:'assets/img',   stem:'phone-yealink' }
];

async function find(dir, stem){
  let files = [];
  try{ files = await fs.readdir(path.join(ROOT, dir)); }catch(_){ return null; }
  // "logo-white" darf nicht von "logo" gefunden werden — exakter Stamm zuerst
  const hit = files.find(f => EXT.includes(path.extname(f).toLowerCase()) &&
                              path.basename(f, path.extname(f)).toLowerCase() === stem);
  return hit ? `${dir}/${hit}` : null;
}

const cfgPath = path.join(ROOT, 'js', 'brand-config.js');
let cfg = await fs.readFile(cfgPath, 'utf8');
let found = 0;

for (const w of WANTED){
  const rel = await find(w.dir, w.stem);
  const value = rel ? `"${rel}"` : 'null';
  const re = new RegExp(`(\\b${w.key}\\s*:\\s*)(null|"[^"]*")`);
  if (!re.test(cfg)){ console.warn(`· Schlüssel ${w.key} steht nicht in brand-config.js`); continue; }
  cfg = cfg.replace(re, `$1${value}`);
  console.log(rel ? `✓ ${w.key} → ${rel}` : `· ${w.key}: keine Datei gefunden (bleibt Platzhalter)`);
  if (rel) found++;
}

await fs.writeFile(cfgPath, cfg);
console.log(`\n${found} von ${WANTED.length} Marken-Dateien eingetragen.`);
if (found) console.log('Danach "npm run build" ausführen, damit standalone.html mitzieht.');
