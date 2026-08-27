/* Prüft die didaktische Schicht: geführter Einstieg auf der Startseite
   und die «So gehtʼs»-Schritte im Editor. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const problems = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1400, height:1100 } });
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));

/* Startseite: geführter Einstieg */
await page.goto(BASE + '/index.html#/', { waitUntil:'networkidle' });
await page.waitForSelector('.vz-ziele');
const ziele = await page.$$eval('.vz-ziel', a => a.length);
if (ziele !== 7) problems.push(`Ziele: ${ziele} statt 7`);
/* Erstes Ziel öffnen -> Karten sichtbar */
await page.click('.vz-ziel:first-child > summary');
await page.waitForTimeout(200);
const karten = await page.$$eval('.vz-ziel[open] .vz-card, .vz-ziel[open] a', a => a.length);
if (karten < 2) problems.push(`Nach Öffnen zu wenige Karten: ${karten}`);
console.log(`Startseite: ${ziele} Ziele, erstes Ziel zeigt ${karten} Vorlagen`);

/* Editor: «So gehtʼs» mit drei Schritten (generischer Fall) */
await page.goto(BASE + '/index.html#/t/hinweis', { waitUntil:'networkidle' });
await page.waitForSelector('.vz-sogehts');
const schritte = await page.$$eval('.vz-sogehts li', a => a.length);
if (schritte !== 3) problems.push(`So-gehtʼs-Schritte: ${schritte} statt 3`);
console.log(`Editor hinweis: ${schritte} Schritte`);

await browser.close();
if (problems.length){ problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nDidaktische Schicht in Ordnung.');
