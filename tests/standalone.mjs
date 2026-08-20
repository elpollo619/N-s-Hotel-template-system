/* Prüft standalone.html direkt per file:// — so, wie es auf einem
   Rechner ohne Server geöffnet wird. */
import { chromium } from 'playwright';
import path from 'node:path';

const file = 'file://' + path.resolve('standalone.html');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
const problems = [];
page.on('console', m => { if (m.type() === 'error') problems.push('KONSOLE: ' + m.text()); });
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));

await page.goto(file);
await page.waitForFunction(() => window.VZ && window.VZ.ORDER.length > 0, { timeout:15000 });
const ids = await page.evaluate(() => window.VZ.ORDER);
console.log(`Hub geladen · ${ids.length} Vorlagen`);

for (const id of ids){
  await page.goto(file + '#/t/' + id);
  await page.waitForSelector('#vz-sheet');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const h = await page.evaluate(() => document.getElementById('vz-sheet').offsetHeight);
  const script = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.eyebrow') || document.body).fontFamily);
  console.log(`  ${id.padEnd(18)} ${h} px`);
  if (!h) problems.push(`${id}: Blatt ist leer`);
  if (!script) problems.push(`${id}: keine Schrift`);
}

// PNG-Export auch offline prüfen
await page.goto(file + '#/t/notruf');
await page.waitForSelector('#vz-png');
const [dl] = await Promise.all([
  page.waitForEvent('download', { timeout:45000 }),
  page.click('#vz-png')
]);
console.log('  PNG-Export offline: ' + dl.suggestedFilename());

await browser.close();
if (problems.length){ console.log('\nPROBLEME:'); problems.forEach(x => console.log(' · ' + x)); process.exit(1); }
console.log('\nstandalone.html läuft sauber per file://.');
