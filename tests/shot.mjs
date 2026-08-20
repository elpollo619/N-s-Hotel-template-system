/* Sichtprüfung + Höhenkontrolle aller Vorlagen (headless Chromium).
   Aufruf:  node tests/shot.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT  = 'tests/out';
const MAXH = { 'a4':1123, 'a4-land':794, 'a5':794, 'a5-land':559 };

await fs.mkdir(OUT, { recursive:true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1100 }, deviceScaleFactor:2 });

const problems = [];
page.on('console', m => { if (m.type() === 'error') problems.push('KONSOLE: ' + m.text()); });
page.on('pageerror', err => problems.push('JS-FEHLER: ' + err.message));

await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });
await page.waitForFunction(() => window.VZ && window.VZ.ORDER.length > 0);
const ids = await page.evaluate(() => window.VZ.ORDER);
await page.screenshot({ path:`${OUT}/00-hub.png`, fullPage:true });

const rows = [];
for (const id of ids){
  await page.goto(`${BASE}/index.html#/t/${id}`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(260);
  const info = await page.evaluate(() => {
    const s = document.getElementById('vz-sheet');
    /* Mehrseitige Vorlagen: die hoechste Einzelseite zaehlt, nicht der Stapel. */
    const pgs = Array.from(s.querySelectorAll('[data-page]'));
    const hs = (pgs.length ? pgs : [s]).map(el => el.offsetHeight);
    return { h:Math.max(...hs), seiten:hs.length, w:s.offsetWidth,
             page:(s.className.match(/sheet--([\w-]+)/)||[])[1],
             fit:document.getElementById('vz-fit').textContent.trim() };
  });
  const max = MAXH[info.page] || 1123;
  const ok = info.h <= max + 1;
  if (!ok) problems.push(`ÜBERLAUF ${id}: ${info.h}px > ${max}px`);
  rows.push({ id, ...info, max, ok });

  // Blatt in Originalgrösse aufnehmen: Skalierung neutralisieren, Oberfläche ausblenden
  await page.evaluate(() => {
    document.getElementById('vz-scaler').style.transform = 'none';
    document.querySelector('.vz-topbar').style.display = 'none';   // Überlappung vermeiden
  });
  await page.locator('#vz-sheet').screenshot({ path:`${OUT}/${id}.png` });
}

console.table(rows.map(r => ({ Vorlage:r.id, Format:r.page, Seiten:r.seiten, Höhe:r.h, Max:r.max, OK:r.ok ? '✓' : '✗' })));
if (problems.length){ console.log('\nPROBLEME:'); problems.forEach(p => console.log(' · ' + p)); }
else console.log('\nAlles sauber: keine Konsolenfehler, alle Blätter passen auf eine Seite.');
await browser.close();
process.exit(problems.length ? 1 : 0);
