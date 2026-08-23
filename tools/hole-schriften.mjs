/* ==========================================================================
   Schriften holen und lokal ablegen
   --------------------------------------------------------------------------
   Die Zentrale laedt nichts nach: sie muss als einzelne Datei per
   Doppelklick laufen, auf einem Rechner ohne Netz. Also liegen alle
   waehlbaren Schriften im Projekt.

   Dieses Werkzeug holt sie einmalig von Google Fonts, legt die woff2-Dateien
   nach assets/fonts/ und schreibt assets/fonts.css neu. Danach braucht
   niemand mehr eine Verbindung.

   Alle hier gefuehrten Familien stehen unter der SIL Open Font License 1.1
   (Bebas Neue, Inter und Source Sans 3 ebenso). Die erlaubt ausdruecklich
   Weitergabe und Einbettung — anders als Gotham und Caflisch Script Pro,
   die gekauft sind und darum NICHT im Repository liegen duerfen.

   Aufruf:  node tools/hole-schriften.mjs
   ========================================================================== */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FONTDIR = path.join(ROOT, 'assets', 'fonts');

/* Warum nur «latin» bei den meisten?
   Die Aushaenge sprechen DE EN FR IT PT ES. Deren Sonderzeichen — ä ö ü ß
   é à ç ñ ã õ — stecken alle im Latin-1-Bereich, also im Subset «latin».
   «latin-ext» braeuchte man erst fuer Polnisch oder Tschechisch. Es bei
   allen mitzunehmen wuerde die Einzeldatei ohne Gegenwert verdoppeln.
   Die drei Ersatzschriften der Marke fuehren es trotzdem mit: sie stehen
   in jedem Aushang und sollen nie eine Luecke zeigen. */
const KATALOG = [
  /* --- Marken-Ersatz: stehen ueberall, darum voller Zeichenvorrat -------- */
  { familie:'Montserrat',      gewichte:[400,500,600,700,800], subsets:['latin','latin-ext'] },
  { familie:'Parisienne',      gewichte:[400],                 subsets:['latin','latin-ext'] },
  { familie:'Dancing Script',  gewichte:[400,600,700],         subsets:['latin','latin-ext'] },

  /* --- Titel ------------------------------------------------------------- */
  { familie:'Oswald',          gewichte:[400,600],  subsets:['latin'] },
  { familie:'Archivo',         gewichte:[400,700],  subsets:['latin'] },
  { familie:'Playfair Display',gewichte:[400,700],  subsets:['latin'] },
  { familie:'Bebas Neue',      gewichte:[400],      subsets:['latin'] },

  /* --- Fliesstext -------------------------------------------------------- */
  { familie:'Source Sans 3',   gewichte:[400,600],  subsets:['latin'] },
  { familie:'Lora',            gewichte:[400,600],  subsets:['latin'] },
  { familie:'Inter',           gewichte:[400,600],  subsets:['latin'] },
  { familie:'Atkinson Hyperlegible', gewichte:[400,700], subsets:['latin'] },

  /* --- Handschrift ------------------------------------------------------- */
  { familie:'Caveat',              gewichte:[400,600], subsets:['latin'] },
  { familie:'Marck Script',        gewichte:[400],     subsets:['latin'] },
  { familie:'Bad Script',          gewichte:[400],     subsets:['latin'] },
  { familie:'Sacramento',          gewichte:[400],     subsets:['latin'] },
  { familie:'Cedarville Cursive',  gewichte:[400],     subsets:['latin'] },
  { familie:'Petit Formal Script', gewichte:[400],     subsets:['latin'] }
];

/* Google liefert je nach User-Agent andere Formate. Mit einer modernen
   Browserkennung kommt woff2 — das kleinste und ueberall unterstuetzte. */
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const slug = f => f.toLowerCase().replace(/\s+/g, '-');

async function hole(url){
  const antwort = await fetch(url, { headers:{ 'User-Agent':UA } });
  if (!antwort.ok) throw new Error(`${antwort.status} ${antwort.statusText} — ${url}`);
  return antwort;
}

/** Die CSS-Antwort von Google in Bloecke je Subset zerlegen. */
function bloecke(css){
  const aus = [];
  const teile = css.split('/*').slice(1);
  for (const teil of teile){
    const subset = teil.slice(0, teil.indexOf('*/')).trim();
    const rest = teil.slice(teil.indexOf('*/') + 2);
    const src = /src:\s*url\(([^)]+)\)/.exec(rest);
    const gewicht = /font-weight:\s*(\d+)/.exec(rest);
    const bereich = /unicode-range:\s*([^;]+);/.exec(rest);
    if (src && gewicht && bereich){
      aus.push({ subset, url:src[1], gewicht:Number(gewicht[1]), bereich:bereich[1].trim() });
    }
  }
  return aus;
}

console.log('Schriften holen …');
await fs.mkdir(FONTDIR, { recursive:true });

const regeln = [];
const behalten = new Set();
let geholt = 0, bytes = 0;

for (const eintrag of KATALOG){
  const url = 'https://fonts.googleapis.com/css2?family='
            + encodeURIComponent(eintrag.familie).replace(/%20/g, '+')
            + ':wght@' + eintrag.gewichte.join(';')
            + '&display=swap';
  const css = await (await hole(url)).text();

  const passend = bloecke(css).filter(b =>
    eintrag.subsets.includes(b.subset) && eintrag.gewichte.includes(b.gewicht));

  if (!passend.length){
    console.error(`  ! ${eintrag.familie}: keine passenden Bloecke gefunden`);
    process.exitCode = 1;
    continue;
  }

  for (const b of passend){
    const kuerzel = b.subset === 'latin-ext' ? '-ext' : '';
    const datei = `${slug(eintrag.familie)}-${b.gewicht}${kuerzel}.woff2`;
    const ziel = path.join(FONTDIR, datei);
    const daten = Buffer.from(await (await hole(b.url)).arrayBuffer());
    await fs.writeFile(ziel, daten);
    behalten.add(datei);
    geholt++; bytes += daten.length;

    regeln.push(`@font-face{font-family:'${eintrag.familie}';font-style:normal;`
      + `font-weight:${b.gewicht};font-display:swap;`
      + `src:url('fonts/${datei}') format('woff2');`
      + `unicode-range:${b.bereich}}`);
  }
  console.log(`  · ${eintrag.familie.padEnd(22)} ${passend.length} Datei(en)`);
}

/* Was nicht mehr im Katalog steht, fliegt raus — sonst schleppt die
   Einzeldatei Schriften mit, die niemand mehr waehlen kann. */
for (const datei of await fs.readdir(FONTDIR)){
  if (datei.endsWith('.woff2') && !behalten.has(datei)){
    await fs.unlink(path.join(FONTDIR, datei));
    console.log(`  – entfernt: ${datei}`);
  }
}

const kopf = `/* ==========================================================================
   N's Hotel · Waehlbare Schriften — lokal, kein CDN
   --------------------------------------------------------------------------
   ERZEUGT von tools/hole-schriften.mjs. Nicht von Hand aendern:
   beim naechsten Lauf wird die Datei ueberschrieben.

   Alle Familien stehen unter der SIL Open Font License 1.1. Weitergabe und
   Einbettung sind ausdruecklich erlaubt.

   Die gekauften Markenschriften (Gotham, Caflisch Script Pro) stehen NICHT
   hier, sondern in brand-fonts.css — und ihre Dateien bleiben lokal.
   ========================================================================== */
`;

await fs.writeFile(path.join(ROOT, 'assets', 'fonts.css'), kopf + regeln.join('\n') + '\n');

console.log(`\nFertig: ${geholt} Dateien, ${(bytes / 1024).toFixed(0)} KB in assets/fonts/`);
console.log('assets/fonts.css neu geschrieben.');
