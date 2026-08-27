/* Prüft die P-touch-Endlosband-Vorlage im echten Browser:
   Band rendert, «Liste einfügen» macht Serien, PDF hat je Etikett eine Seite
   in Bandgrösse, PNG je Etikett kommt heraus. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT  = 'tests/out';
await fs.mkdir(OUT, { recursive:true });

const problems = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));

await page.goto(BASE + '/index.html#/t/ptouch', { waitUntil:'networkidle' });
await page.waitForSelector('.t-pt-band');
await page.evaluate(() => document.fonts.ready);

/* Voreinstellung: 3 Bänder, 12 mm. Höhe eines Bandes ~ 12 mm in px. */
const bandInfo = await page.evaluate(() => {
  const b = document.querySelector('.t-pt-band');
  return { anzahl: document.querySelectorAll('.t-pt-band').length,
           hpx: b.offsetHeight, wpx: b.offsetWidth };
});
const hmm = +(bandInfo.hpx * 25.4 / 96).toFixed(1);
if (bandInfo.anzahl !== 3) problems.push(`Bänder: ${bandInfo.anzahl} statt 3`);
if (Math.abs(hmm - 12) > 0.6) problems.push(`Bandhöhe ${hmm} mm statt ~12`);
console.log(`Start: ${bandInfo.anzahl} Bänder · Höhe ${hmm} mm (soll 12)`);

/* 24-mm-Kassette wählen -> Band wird höher. */
await page.click('#vz-alle-kap');
await page.selectOption('[data-path="band"]', '24');
await page.waitForTimeout(250);
const h24 = await page.$eval('.t-pt-band', b => b.offsetHeight);
const h24mm = +(h24 * 25.4 / 96).toFixed(1);
if (Math.abs(h24mm - 24) > 1) problems.push(`24-mm-Band misst ${h24mm} mm`);
console.log(`24-mm-Kassette: Band ${h24mm} mm`);

/* Liste einfügen: drei Zeilen -> 3 zusätzliche Bänder. */
await page.click('[data-paste="labels"]');
await page.waitForSelector('.vz-dialog textarea');
await page.fill('.vz-dialog textarea', 'Küche\nBüro\nLager');
await page.click('.vz-dialog [data-ok]');
await page.waitForTimeout(300);
const nachPaste = await page.$$eval('.t-pt-band', a => a.length);
if (nachPaste !== 6) problems.push(`Nach Liste einfügen: ${nachPaste} Bänder statt 6`);
console.log(`Liste einfügen: ${nachPaste} Bänder`);

/* PDF (Bandgrösse): je Etikett eine Seite -> /Count 6. */
const dl = page.waitForEvent('download', { timeout:120000 });
await page.click('[data-pt="pdf"]');
const datei = await dl;
const pfad = OUT + '/ptouch.pdf';
await datei.saveAs(pfad);
const txt = (await fs.readFile(pfad)).toString('latin1');
const okPdf = txt.startsWith('%PDF-1.4') && txt.includes('/Count 6') && txt.includes('%%EOF');
if (!okPdf) problems.push('P-touch-PDF beschädigt oder falsche Seitenzahl (soll /Count 6)');
console.log(`PDF: ${datei.suggestedFilename()} · 6 Seiten: ${okPdf}`);

/* PNG je Etikett: 6 Downloads. */
const pngs = [];
page.on('download', d => pngs.push(d));
await page.click('[data-pt="png"]');
const frist = Date.now() + 60000;
while (pngs.length < 6 && Date.now() < frist) await page.waitForTimeout(200);
page.removeAllListeners('download');
if (pngs.length !== 6) problems.push(`PNG je Etikett: ${pngs.length} Dateien statt 6`);
console.log(`PNG je Etikett: ${pngs.length} Dateien`);

await browser.close();
if (problems.length){ problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nP-touch-Etiketten in Ordnung.');
