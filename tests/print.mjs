/* Prüft den Druckweg: jede Vorlage muss GENAU EINE Seite im richtigen
   Format ergeben — ohne Bedienleiste und ohne Formular. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = 'tests/out/pdf';
await fs.mkdir(OUT, { recursive:true });

/* A4 in PostScript-Punkten (1 mm = 2.8346 pt) */
const ERWARTET = {
  'a4':      { b:595, h:842 },
  'a4-land': { b:842, h:595 },
  'a5':      { b:420, h:595 }
};

const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];

await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });
const ids = await page.evaluate(() => window.VZ.ORDER);

for (const id of ids){
  await page.goto(`${BASE}/index.html#/t/${id}`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media:'print' });

  // Was wäre im Druck sichtbar?
  const sichtbar = await page.evaluate(() => {
    const zeigt = sel => {
      const n = document.querySelector(sel);
      return !!n && getComputedStyle(n).display !== 'none';
    };
    return { leiste:zeigt('.vz-topbar'), panel:zeigt('.vz-panel'),
             seite:(document.getElementById('vz-sheet').className.match(/sheet--([\w-]+)/) || [])[1] };
  });
  if (sichtbar.leiste) problems.push(`${id}: Bedienleiste wäre mitgedruckt`);
  if (sichtbar.panel)  problems.push(`${id}: Formular wäre mitgedruckt`);

  const file = `${OUT}/${id}.pdf`;
  await page.pdf({ path:file, preferCSSPageSize:true, printBackground:true });
  await page.emulateMedia({ media:'screen' });

  const buf = await fs.readFile(file);
  const seiten = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const box = /MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/.exec(buf.toString('latin1'));
  const b = box ? Math.round(+box[1]) : 0, h = box ? Math.round(+box[2]) : 0;
  const soll = ERWARTET[sichtbar.seite] || ERWARTET['a4'];
  const formatOk = Math.abs(b - soll.b) <= 2 && Math.abs(h - soll.h) <= 2;

  if (seiten !== 1) problems.push(`${id}: ${seiten} Seiten statt 1`);
  if (!formatOk)    problems.push(`${id}: ${b}×${h} pt statt ${soll.b}×${soll.h} pt`);
  console.log(`${seiten === 1 && formatOk ? '✓' : '✗'} ${id.padEnd(18)} ${seiten} Seite · ${b}×${h} pt · ${(buf.length / 1024).toFixed(0)} KB`);
}

await browser.close();
if (problems.length){ console.log('\nPROBLEME:'); problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nDruckweg in Ordnung: je eine saubere Seite im richtigen Format.');
