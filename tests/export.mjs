/* Prüft den PNG-Export im echten Browser: Datei da? Gross genug? Nicht leer? */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT  = 'tests/out/png';
await fs.mkdir(OUT, { recursive:true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
const problems = [];
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));

await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });
const ids = await page.evaluate(() => window.VZ.ORDER);

for (const id of ids){
  await page.goto(`${BASE}/index.html#/t/${id}`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-png');
  await page.evaluate(() => document.fonts.ready);

  /* Mehrseitige Vorlagen liefern eine Datei je Seite — alle einsammeln. */
  const erwartet = await page.evaluate(() =>
    Math.max(1, document.querySelectorAll('#vz-sheet [data-page]').length));
  const downloads = [];
  page.on('download', d => downloads.push(d));
  await page.click('#vz-png');
  /* Warten, bis alle erwarteten Dateien da sind — nicht auf den Knopf, der
     erst einen Tick spaeter deaktiviert wird. */
  const frist = Date.now() + 120000;
  while (downloads.length < erwartet && Date.now() < frist) await page.waitForTimeout(200);
  await page.waitForTimeout(400);   // eine ueberzaehlige Datei wuerde so auffallen
  page.removeAllListeners('download');

  if (downloads.length !== erwartet){
    problems.push(`PNG ${id}: ${downloads.length} Dateien statt ${erwartet}`);
    console.log(`✗ ${id.padEnd(18)} ${downloads.length}/${erwartet} Dateien`);
    continue;
  }
  let gesamt = 0, alleOk = true;
  for (let i = 0; i < downloads.length; i++){
    const file = erwartet > 1 ? `${OUT}/${id}-${String(i + 1).padStart(2, '0')}.png` : `${OUT}/${id}.png`;
    await downloads[i].saveAs(file);
    const { size } = await fs.stat(file);
    const head = (await fs.readFile(file)).subarray(1, 4).toString();
    if (!(head === 'PNG' && size > 20000)){
      problems.push(`PNG ${id} Seite ${i + 1}: ${size} Bytes — sieht leer aus`);
      alleOk = false;
    }
    gesamt += size;
  }
  console.log(`${alleOk ? '✓' : '✗'} ${id.padEnd(18)} ${(gesamt / 1024).toFixed(0)} KB  →  ${erwartet} Datei(en), z. B. ${downloads[0].suggestedFilename()}`);
}
await browser.close();
if (problems.length){ problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nPNG-Export in Ordnung.');
