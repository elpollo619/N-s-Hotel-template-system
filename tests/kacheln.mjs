/* Prüft die Werkzeuge dieser Runde im echten Browser:
   Kacheldruck (A4-Kacheln samt Klebeplan), Rückgängig (Ctrl+Z),
   Zeile kopieren, Liste einfügen, Stand kopieren. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT  = 'tests/out';
await fs.mkdir(OUT, { recursive:true });

const problems = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));

/* --- Kacheldruck: bei A4 versteckt, bei A3 sichtbar, PDF = 5 Seiten ------- */
await page.goto(BASE + '/index.html#/t/foto', { waitUntil:'networkidle' });
await page.waitForSelector('#vz-kacheln', { state:'attached' });
if (!(await page.$eval('#vz-kacheln', el => el.hidden)))
  problems.push('Kacheln-Knopf schon bei A4 sichtbar');

await page.click('#vz-alle-kap');
await page.selectOption('[data-path="format"]', 'a3');
await page.waitForTimeout(250);
if (await page.$eval('#vz-kacheln', el => el.hidden))
  problems.push('Kacheln-Knopf bei A3 versteckt');

/* A3 (297 × 420 mm) zerfällt in 2 × 2 Kacheln + Klebeplan = 5 Seiten. */
const dl = page.waitForEvent('download', { timeout:120000 });
await page.click('#vz-kacheln');
const datei = await dl;
const pfad = OUT + '/kacheln-foto-a3.pdf';
await datei.saveAs(pfad);
const bytes = await fs.readFile(pfad);
const text = bytes.toString('latin1');
const okPdf = text.startsWith('%PDF-1.4') && text.includes('/Count 5') && text.includes('%%EOF');
if (!okPdf) problems.push('Kachel-PDF beschädigt oder falsche Seitenzahl (soll /Count 5)');
console.log(`Kacheln foto/A3: ${datei.suggestedFilename()} ${(bytes.length / 1024).toFixed(0)} KB, 5 Seiten: ${okPdf}`);

/* --- Rückgängig: Kästchen abwählen, Ctrl+Z holt es zurück ----------------- */
const frBox = '[data-checks="sprachen"] input[value="fr"]';
await page.waitForSelector(frBox);
const vorher = await page.$eval(frBox, el => el.checked);
await page.click(frBox);
await page.waitForTimeout(900);           /* Verlauf bündelt nach 600 ms Ruhe */
const mitte = await page.$eval(frBox, el => el.checked);
await page.keyboard.press('Control+z');
await page.waitForTimeout(300);
const zurueck = await page.$eval(frBox, el => el.checked);
await page.keyboard.press('Control+y');
await page.waitForTimeout(300);
const wieder = await page.$eval(frBox, el => el.checked);
if (!(mitte === !vorher && zurueck === vorher && wieder === mitte))
  problems.push(`Undo/Redo: ${vorher} → ${mitte} → Ctrl+Z ${zurueck} → Ctrl+Y ${wieder}`);
console.log(`Undo/Redo Kästchen «fr»: ${vorher} → ${mitte} → ${zurueck} → ${wieder}`);

/* --- Zeile kopieren & Liste einfügen (Plan-Editor-Legende) ---------------- */
await page.goto(BASE + '/index.html#/t/plan-editor', { waitUntil:'networkidle' });
await page.waitForSelector('#vz-alle-kap');
await page.click('#vz-alle-kap');
await page.waitForSelector('[data-list="legend"] .vz-item');
const n0 = await page.$$eval('[data-list="legend"] .vz-item', a => a.length);
const l0 = await page.$eval('input[data-path="legend.0.label"]', el => el.value);
await page.click('[data-list="legend"] .vz-item[data-item="0"] [data-dup]');
await page.waitForTimeout(250);
const n1 = await page.$$eval('[data-list="legend"] .vz-item', a => a.length);
const l1 = await page.$eval('input[data-path="legend.1.label"]', el => el.value);
if (!(n1 === n0 + 1 && l1 === l0))
  problems.push(`Zeile kopieren: ${n0} → ${n1}, «${l0}» → «${l1}»`);
console.log(`Zeile kopieren: ${n0} → ${n1} Einträge, Kopie «${l1}»`);

/* Liste einfügen: drei Zeilen, aber nur zwei passen noch (max 8). */
await page.click('[data-paste="legend"]');
await page.waitForSelector('.vz-dialog textarea');
await page.fill('.vz-dialog textarea', 'Neu Eins\nNeu Zwei\nNeu Drei');
await page.click('.vz-dialog [data-ok]');
await page.waitForTimeout(250);
const n2 = await page.$$eval('[data-list="legend"] .vz-item', a => a.length);
const neu = await page.$eval(`input[data-path="legend.${n1}.label"]`, el => el.value);
if (!(n2 === 8 && neu === 'Neu Eins'))
  problems.push(`Liste einfügen: ${n1} → ${n2} (soll 8), erster neuer Eintrag «${neu}»`);
console.log(`Liste einfügen: ${n1} → ${n2} Einträge (max 8), zuerst «${neu}»`);

/* --- Stand kopieren ------------------------------------------------------- */
/* Stände liegen jetzt unter «Mehr» — vor dem Klick aufklappen. */
await page.evaluate(() => { const d = document.querySelector('.vz-mehr'); if (d) d.open = true; });
await page.evaluate(() => { window.prompt = () => 'Prueba'; });
await page.click('#vz-stand');
await page.waitForTimeout(200);
if (await page.$eval('#vz-stand-dup', el => el.hidden))
  problems.push('Kopie-Knopf nach dem Speichern versteckt');
await page.evaluate(() => { window.prompt = () => 'Prueba 2'; });
await page.click('#vz-stand-dup');
await page.waitForTimeout(200);
const namen = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('nsvz:staende:plan-editor') || '[]').map(s => s.name));
if (!(namen.length === 2 && namen.includes('Prueba') && namen.includes('Prueba 2')))
  problems.push('Stand kopieren: ' + JSON.stringify(namen));
console.log('Stand kopieren: ' + namen.join(' · '));

await browser.close();
if (problems.length){ problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nKacheldruck, Undo und Duplizieren in Ordnung.');
