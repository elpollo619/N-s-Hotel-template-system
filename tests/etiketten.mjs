/* Der Etikettenbogen muss auf den Millimeter sitzen — sonst klebt die Schrift
   halb neben dem Etikett. Geprüft wird gegen die Herstellermasse.
   Aufruf:  node tests/etiketten.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const PX = 96 / 25.4;                 // CSS-Pixel je Millimeter
const TOL = 0.35;                     // erlaubte Abweichung in mm (Rundung im Browser)

const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1100 } });
const fehler = [];
page.on('pageerror', err => fehler.push('JS-FEHLER: ' + err.message));

function pruefe(name, ok, dazu){
  console.log(`${ok ? '✓' : '✗'} ${name}${dazu ? '  — ' + dazu : ''}`);
  if (!ok) fehler.push(name + (dazu ? ': ' + dazu : ''));
}
const nahe = (a, b) => Math.abs(a - b) <= TOL;

/* Bogen mit genau einem Etikett je Feld füllen und alles ausmessen. */
async function messen(zustand){
  await page.evaluate(z => {
    localStorage.setItem('nsvz:draft:etiketten', JSON.stringify(z));
  }, zustand);
  /* Bei gleicher Adresse macht goto() keine neue Seite — dann neu laden,
     sonst bliebe der eben gesetzte Zustand unbeachtet. */
  if (page.url().includes('#/t/etiketten')) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(`${BASE}/index.html#/t/etiketten`, { waitUntil:'networkidle' });
  await page.waitForSelector('.t-etikett-feld');
  return page.evaluate(px => {
    const seiten = Array.from(document.querySelectorAll('[data-page]'));
    const felder = Array.from(seiten[0].querySelectorAll('.t-etikett-feld')).map(el => ({
      x:el.offsetLeft / px, y:el.offsetTop / px,
      b:el.offsetWidth / px, h:el.offsetHeight / px
    }));
    return { seiten:seiten.length, felder,
             blattB:seiten[0].offsetWidth / px, blattH:seiten[0].offsetHeight / px };
  }, PX);
}

await page.goto(`${BASE}/index.html`, { waitUntil:'networkidle' });

/* ---------- Avery L7160: 3 x 7, 63,5 x 38,1 mm -------------------------- */
const voll = { raster:'l7160', hilfslinien:'nein', schiebX:0, schiebY:0,
               objekt:'-', kuerzel:'nein', balken:'links',
               rows:[{ titel:'X', unter:'', anzahl:21, farbe:'#2A3350', ico:'key' }] };
const a = await messen(voll);

pruefe('Blatt ist A4', nahe(a.blattB, 210) && nahe(a.blattH, 297),
  `${a.blattB.toFixed(1)} x ${a.blattH.toFixed(1)} mm`);
pruefe('21 Etiketten auf einem Bogen', a.felder.length === 21, String(a.felder.length));
pruefe('Etikettengrösse 63,5 x 38,1 mm',
  nahe(a.felder[0].b, 63.5) && nahe(a.felder[0].h, 38.1),
  `${a.felder[0].b.toFixed(2)} x ${a.felder[0].h.toFixed(2)} mm`);
pruefe('Erstes Etikett bei 7,25 / 15,15 mm',
  nahe(a.felder[0].x, 7.25) && nahe(a.felder[0].y, 15.15),
  `${a.felder[0].x.toFixed(2)} / ${a.felder[0].y.toFixed(2)} mm`);
pruefe('Spaltenabstand 66,0 mm', nahe(a.felder[1].x - a.felder[0].x, 66),
  (a.felder[1].x - a.felder[0].x).toFixed(2));
pruefe('Zeilenabstand 38,1 mm', nahe(a.felder[3].y - a.felder[0].y, 38.1),
  (a.felder[3].y - a.felder[0].y).toFixed(2));

const letzte = a.felder[20];
pruefe('Letztes Etikett bleibt auf dem Blatt',
  letzte.x + letzte.b <= 210 + TOL && letzte.y + letzte.h <= 297 + TOL,
  `rechts ${(letzte.x + letzte.b).toFixed(1)} mm, unten ${(letzte.y + letzte.h).toFixed(1)} mm`);
pruefe('Raster sitzt mittig',
  nahe(a.felder[0].x, 210 - (letzte.x + letzte.b)) &&
  nahe(a.felder[0].y, 297 - (letzte.y + letzte.h)),
  `Rand unten ${(297 - letzte.y - letzte.h).toFixed(2)} mm`);

/* ---------- Zweiter Bogen bei Überlauf ---------------------------------- */
const b = await messen({ ...voll,
  rows:[{ titel:'X', unter:'', anzahl:22, farbe:'#2A3350', ico:'' }] });
pruefe('22 Etiketten ergeben zwei Bogen', b.seiten === 2, String(b.seiten));

/* ---------- Feinverschiebung -------------------------------------------- */
const c = await messen({ ...voll, schiebX:2, schiebY:-1.5 });
pruefe('Feinverschiebung greift',
  nahe(c.felder[0].x, 9.25) && nahe(c.felder[0].y, 13.65),
  `${c.felder[0].x.toFixed(2)} / ${c.felder[0].y.toFixed(2)} mm`);

/* ---------- Freies Raster ----------------------------------------------- */
const d = await messen({ ...voll, raster:'frei', spalten:2, zeilen:3,
  breite:80, hoehe:50, randL:20, randO:25, lueckeX:6, lueckeY:8,
  rows:[{ titel:'X', unter:'', anzahl:6, farbe:'#2A3350', ico:'' }] });
pruefe('Freies Raster: 6 Felder', d.felder.length === 6, String(d.felder.length));
pruefe('Freies Raster: Masse und Lücken',
  nahe(d.felder[0].x, 20) && nahe(d.felder[0].y, 25) &&
  nahe(d.felder[0].b, 80) && nahe(d.felder[0].h, 50) &&
  nahe(d.felder[1].x, 106) && nahe(d.felder[2].y, 83),
  `${d.felder[1].x.toFixed(1)} / ${d.felder[2].y.toFixed(1)} mm`);

/* ---------- Hilfslinien nur auf Wunsch ---------------------------------- */
const mitLinien = await page.evaluate(() =>
  document.querySelectorAll('.t-etikett-feld.is-hilfe').length);
pruefe('Hilfslinien sind aus', mitLinien === 0);

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nEtikettenbogen sitzt millimetergenau.');
