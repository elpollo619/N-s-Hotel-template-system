/* ==========================================================================
   Aktiviert die echten Markenschriften.
   1. Gotham-Bold.otf und CaflischScriptPro-Regular.otf nach assets/fonts/ kopieren
   2. node tools/install-brand-fonts.mjs
   Schreibt assets/brand-fonts.css mit den passenden @font-face-Regeln.
   Ohne die Dateien bleibt der Fallback (Montserrat / Dancing Script) aktiv.
   ========================================================================== */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FONTS = path.join(ROOT, 'assets', 'fonts');

const WANTED = [
  { family:'Gotham', weight:700, stems:['Gotham-Bold'] },
  { family:'Caflisch Script Pro', weight:400, stems:['CaflischScriptPro-Regular', 'CaflischScriptPro'] }
];
const FORMAT = { '.woff2':'woff2', '.woff':'woff', '.otf':'opentype', '.ttf':'truetype' };

let files = [];
try{ files = await fs.readdir(FONTS); }
catch(_){ console.error('assets/fonts/ nicht gefunden.'); process.exit(1); }

const blocks = [];
const missing = [];
for (const w of WANTED){
  const hit = files.find(f => w.stems.some(s => f.toLowerCase().startsWith(s.toLowerCase())) && FORMAT[path.extname(f).toLowerCase()]);
  if (!hit){ missing.push(w.stems[0]); continue; }
  blocks.push(`@font-face{
  font-family:"${w.family}";
  src:url("fonts/${hit}") format("${FORMAT[path.extname(hit).toLowerCase()]}");
  font-weight:${w.weight}; font-style:normal; font-display:swap;
}`);
  console.log(`✓ ${w.family} → assets/fonts/${hit}`);
}

const head = `/* ==========================================================================
   N's Hotel · echte Markenschriften — erzeugt von tools/install-brand-fonts.mjs
   Nicht von Hand bearbeiten: der Befehl überschreibt diese Datei.
   ========================================================================== */\n`;

if (!blocks.length){
  console.log('Keine Markenschriften gefunden — der Fallback bleibt aktiv.');
  console.log('Erwartet werden: ' + missing.join(', '));
  process.exit(0);
}
if (missing.length) console.log('· noch nicht vorhanden: ' + missing.join(', '));

await fs.writeFile(path.join(ROOT, 'assets', 'brand-fonts.css'), head + blocks.join('\n') + '\n');
console.log('assets/brand-fonts.css geschrieben. Danach "npm run build" für standalone.html.');
