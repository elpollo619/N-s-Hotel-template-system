/* Prüft den Serienbrief: je Empfänger eine Seite, Platzhalter ersetzt,
   «Liste einfügen» erweitert die Serie. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const problems = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));

await page.goto(BASE + '/index.html#/t/serienbrief', { waitUntil:'networkidle' });
await page.waitForSelector('[data-page]');

const start = await page.$$eval('[data-page]', a => a.length);
if (start !== 2) problems.push(`Start: ${start} Seiten statt 2`);

/* Platzhalter {{name}} in der Anrede der ersten Seite ersetzt? */
const anrede1 = await page.$eval('[data-page] .t-mieterbrief-anrede', e => e.textContent.trim());
if (!/Hans Muster/.test(anrede1)) problems.push(`Anrede ohne Namen: «${anrede1}»`);
console.log(`Start: ${start} Seiten · Anrede 1: «${anrede1}»`);

/* Liste einfügen: drei weitere Empfänger. */
await page.click('#vz-alle-kap');
await page.click('[data-paste="leute"]');
await page.waitForSelector('.vz-dialog textarea');
await page.fill('.vz-dialog textarea', 'Herr A\tWeg 1, 3000 Bern\nFrau B\tWeg 2, 3000 Bern\nFirma C\tWeg 3, 3000 Bern');
await page.click('.vz-dialog [data-ok]');
await page.waitForTimeout(300);
const nachher = await page.$$eval('[data-page]', a => a.length);
if (nachher !== 5) problems.push(`Nach Liste einfügen: ${nachher} Seiten statt 5`);
const letzteAnrede = await page.$$eval('[data-page] .t-mieterbrief-anrede', a => a[a.length - 1].textContent);
if (!/Firma C/.test(letzteAnrede)) problems.push(`Letzte Anrede ohne Namen: «${letzteAnrede}»`);
console.log(`Nach Liste: ${nachher} Seiten · letzte Anrede «${letzteAnrede.trim()}»`);

await browser.close();
if (problems.length){ problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nSerienbrief in Ordnung.');
