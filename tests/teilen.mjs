/* Prüft den Teilen-Link und die Leseabstand-Anzeige.
   Aufruf:  node tests/teilen.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const ctx = await browser.newContext({ permissions:['clipboard-read','clipboard-write'] });
const page = await ctx.newPage();

const fehler = [];
page.on('pageerror', err => fehler.push('JS-FEHLER: ' + err.message));
page.on('console', m => { if (m.type() === 'error') fehler.push('KONSOLE: ' + m.text()); });

function pruefe(name, ok, dazu){
  console.log(`${ok ? '✓' : '✗'} ${name}${dazu ? '  — ' + dazu : ''}`);
  if (!ok) fehler.push(name + (dazu ? ': ' + dazu : ''));
}

/* ---------- 1. Zustand ändern und Link erzeugen ------------------------ */
await page.goto(`${BASE}/index.html#/t/hinweis`, { waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet');

const MARKE = 'Prüftext ÄÖÜ « » 42';
await page.fill('#f-title', MARKE);
await page.waitForTimeout(150);

const link = await page.evaluate(async () => {
  const m = await import('./js/lib/teilen.js');
  const roh = JSON.parse(localStorage.getItem('nsvz:draft:hinweis'));
  const { payload } = await m.teilenKodieren(roh);
  return m.teilenAdresse('hinweis', payload);
});
pruefe('Link entsteht', link.includes('#/t/hinweis?d='), `${link.length} Zeichen`);
pruefe('Link bleibt handlich', link.length < 7000, `${link.length} Zeichen`);

/* ---------- 2. Link in einem frischen Browser öffnen ------------------- */
const ctx2 = await browser.newContext();
const page2 = await ctx2.newPage();
page2.on('pageerror', err => fehler.push('JS-FEHLER (Empfänger): ' + err.message));
await page2.goto(link, { waitUntil:'networkidle' });
await page2.waitForSelector('#vz-sheet');
await page2.waitForTimeout(300);

const beim = await page2.evaluate(() => ({
  titel: document.getElementById('f-title')?.value || '',
  blatt: document.getElementById('vz-sheet').textContent,
  hash: location.hash
}));
pruefe('Text kommt an', beim.titel === MARKE, JSON.stringify(beim.titel));
pruefe('Text steht auf dem Blatt', beim.blatt.includes('Prüftext'));
pruefe('Adresse ist wieder sauber', beim.hash === '#/t/hinweis', beim.hash);

/* Neu laden darf den Entwurf nicht wieder überschreiben, sondern behalten. */
await page2.reload({ waitUntil:'networkidle' });
await page2.waitForSelector('#f-title');
const nachher = await page2.inputValue('#f-title');
pruefe('Nach dem Neuladen unverändert', nachher === MARKE, nachher);

/* ---------- 3. Kaputter Link ------------------------------------------- */
const ctx3 = await browser.newContext();
const page3 = await ctx3.newPage();
await page3.goto(`${BASE}/index.html#/t/hinweis?d=zKAPUTT`, { waitUntil:'networkidle' });
await page3.waitForSelector('#vz-sheet');
await page3.waitForTimeout(300);
const heil = await page3.evaluate(() =>
  Boolean(document.getElementById('vz-sheet').textContent.trim()) && location.hash === '#/t/hinweis');
pruefe('Kaputter Link zeigt das Original', heil);

/* ---------- 4. Bilder bleiben draussen --------------------------------- */
const ohneBild = await page.evaluate(async () => {
  const m = await import('./js/lib/teilen.js');
  const { rein, bilder } = m.teilenOhneBilder({ a:'x', foto:'data:image/png;base64,AAAA',
                                                tief:[{ b:'data:image/jpeg;base64,BBBB' }] });
  return { bilder, foto:rein.foto, tief:rein.tief[0].b, a:rein.a };
});
pruefe('Bilder werden entfernt',
  ohneBild.bilder === 2 && ohneBild.foto === '' && ohneBild.tief === '' && ohneBild.a === 'x',
  JSON.stringify(ohneBild));

/* ---------- 5. Leseabstand --------------------------------------------- */
await page.goto(`${BASE}/index.html#/t/parkschild`, { waitUntil:'networkidle' });
await page.waitForSelector('#vz-fern');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const fern = await page.textContent('#vz-fern');
pruefe('Parkschild zeigt einen Leseabstand', /\d/.test(fern), fern.trim());

/* Ein Brief ist kein Schild — dort darf die Anzeige gar nicht erscheinen. */
await page.goto(`${BASE}/index.html#/t/mieterbrief`, { waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet');
const keinFern = await page.evaluate(() => !document.getElementById('vz-fern'));
pruefe('Mieterbrief ohne Leseabstand', keinFern);

/* Rechenprobe: 100 pt Schrift ≈ 35,3 mm; x-Höhe 18,3 mm; 18,3 / 2,5 ≈ 7,3 m. */
const rechnung = await page.evaluate(async () => {
  const m = await import('./js/lib/lesbarkeit.js');
  return { gross:m.abstandM(133.33), klein:m.abstandM(12) };  // 100 pt bzw. 9 pt
});
pruefe('Rechnung 100 pt ≈ 7 m', Math.abs(rechnung.gross - 7.34) < 0.2, rechnung.gross.toFixed(2));
pruefe('Rechnung 9 pt < 1 m', rechnung.klein < 1, rechnung.klein.toFixed(2));

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nTeilen-Link und Leseabstand: alles sauber.');
