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
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout:45000 }),
    page.click('#vz-png')
  ]);
  const file = `${OUT}/${id}.png`;
  await download.saveAs(file);
  const { size } = await fs.stat(file);
  const head = (await fs.readFile(file)).subarray(1, 4).toString();
  const ok = head === 'PNG' && size > 20000;
  if (!ok) problems.push(`PNG ${id}: ${size} Bytes — sieht leer aus`);
  console.log(`${ok ? '✓' : '✗'} ${id.padEnd(18)} ${(size / 1024).toFixed(0)} KB  →  ${download.suggestedFilename()}`);
}
await browser.close();
if (problems.length){ problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nPNG-Export in Ordnung.');
