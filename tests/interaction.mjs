/* Prüft die Bedienung im Editor: Live-Vorschau ohne Fokusverlust,
   wiederholbare Zeilen, Speicherung und Zurücksetzen. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
const problems = [];
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));
const check = (ok, was) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) problems.push(was); };

await page.goto(BASE + '/index.html#/t/notruf', { waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet');

/* 1 · Tippen aktualisiert die Vorschau und der Fokus bleibt im Feld */
const titel = page.locator('#f-title');
await titel.click();
await titel.fill('');
await titel.type('Notfallnummern');
check(await page.locator('#vz-sheet h1').innerText() === 'Notfallnummern', 'Vorschau folgt der Eingabe');
check(await page.evaluate(() => document.activeElement.id) === 'f-title', 'Fokus bleibt im Feld');

/* 2 · Entwurf übersteht das Neuladen */
await page.reload({ waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet h1');
check(await page.locator('#vz-sheet h1').innerText() === 'Notfallnummern', 'Entwurf bleibt gespeichert');

/* 3 · Wiederholbare Zeilen: hinzufügen und löschen */
const vorher = await page.locator('.t-notruf-key').count();
await page.click('[data-add="keys"]');
await page.locator('#f-keys-4-de').fill('Taxi Kerzers');
check(await page.locator('.t-notruf-key').count() === vorher + 1, 'Zeile hinzugefügt');
check((await page.locator('#vz-sheet').innerText()).includes('Taxi Kerzers'), 'Neue Zeile erscheint im Blatt');
await page.locator('[data-list="keys"] .vz-item').last().locator('[data-del]').click();
check(await page.locator('.t-notruf-key').count() === vorher, 'Zeile gelöscht');

/* 4 · Seitenkontrolle meldet Überlauf */
await page.locator('#f-ledeDe').fill('Sehr langer Text. '.repeat(120));
await page.waitForTimeout(150);
check(await page.locator('#vz-fit.vz-fit--warn').count() === 1, 'Überlauf wird gemeldet');

/* 5 · Zurücksetzen stellt das Original wieder her */
page.on('dialog', d => d.accept());
await page.click('#vz-reset');
await page.waitForTimeout(250);
check(await page.locator('#vz-sheet h1').innerText() === 'Welche Taste wofür?', 'Zurücksetzen stellt das Original her');
check(await page.locator('#vz-fit.vz-fit--ok').count() === 1, 'Blatt passt wieder auf eine Seite');

/* 6 · Entwurf als Datei sichern */
const [dl] = await Promise.all([
  page.waitForEvent('download', { timeout:15000 }),
  page.click('#vz-json-save')
]);
check(dl.suggestedFilename() === 'ns-hotel-notruf-entwurf.json', 'Entwurf lässt sich sichern');

/* 7 · Oberfläche auf Englisch */
await page.click('.vz-lang button[data-lang="en"]');
await page.waitForTimeout(150);
check((await page.locator('.vz-actions').innerText()).includes('Print'), 'Oberfläche wechselt auf Englisch');

await browser.close();
if (problems.length){ console.log('\nPROBLEME:'); problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nBedienung in Ordnung.');
