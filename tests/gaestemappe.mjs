/* Prüft die mehrseitige Gästemappe: Seitenzahl, Höhe jeder einzelnen Seite,
   das Ab- und Zuschalten von Kapiteln und die durchlaufende Nummerierung. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const A4 = 1123;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1600, height:1050 } });
const problems = [];
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));
page.on('console', m => { if (m.type() === 'error') problems.push('KONSOLE: ' + m.text()); });
const check = (ok, was) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) problems.push(was); };

// Mit sauberem Zustand starten, sonst haengt das Ergebnis vom letzten Lauf ab.
await page.goto(BASE + '/index.html', { waitUntil:'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.goto(BASE + '/index.html#/t/gaestemappe', { waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet [data-page]');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const seiten = () => page.locator('#vz-sheet [data-page]').count();

/* 1 · Alle Kapitel an: acht Seiten */
check(await seiten() === 8, `Acht Seiten (${await seiten()})`);

/* 2 · Jede Seite fuer sich passt auf A4 — nicht nur der Stapel im Mittel */
const hoehen = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#vz-sheet [data-page]')).map(el => el.offsetHeight));
check(hoehen.every(h => h <= A4 + 1), `Jede Seite passt auf A4 (max ${Math.max(...hoehen)} px)`);
check(hoehen.every(h => h >= A4 - 1), 'Keine Seite bleibt kürzer als das Blatt');

/* 3 · Das Blatt selbst wird nicht als Rahmen mitgedruckt */
const stapel = await page.evaluate(() => {
  const cs = getComputedStyle(document.getElementById('vz-sheet'));
  return { schatten:cs.boxShadow, grund:cs.backgroundColor };
});
check(stapel.schatten === 'none' && /rgba\(0, 0, 0, 0\)|transparent/.test(stapel.grund),
      'Der Stapel selbst ist unsichtbar — nur die Seiten tragen Papier');

/* 4 · Kapitel abschalten entfernt genau eine Seite */
const wahl = async (feld, wert) => {
  await page.selectOption(`select[data-path="${feld}"]`, wert);
  await page.waitForTimeout(250);
};
await wahl('pgFood', 'nein');
check(await seiten() === 7, `Ohne "Essen und Trinken" sieben Seiten (${await seiten()})`);
await wahl('pgTrips', 'nein');
check(await seiten() === 6, `Ohne "Natur und Ausflüge" sechs Seiten (${await seiten()})`);

/* 5 · Die Nummerierung schliesst die Luecke — im Inhalt wie im Kapitelkopf */
const nummern = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#vz-sheet .gm-toc .gm-tn')).map(n => n.textContent.trim()));
check(nummern.join(',') === '01,02,03,04',
      `Inhaltsverzeichnis zaehlt lueckenlos (${nummern.join(',')})`);
const letzte = await page.evaluate(() => {
  const p = document.querySelectorAll('#vz-sheet [data-page]');
  return p[p.length - 1].querySelector('.gm-num').textContent.trim();
});
check(letzte === '04', `Letztes Kapitel traegt die passende Nummer (${letzte})`);

/* 6 · Fusszeilen zaehlen die tatsaechlich gedruckten Seiten */
const fuss = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#vz-sheet .gm-foot span:last-child')).map(n => n.textContent.trim()));
check(fuss.join(',') === '02,03,04,05,06', `Seitenzahlen laufen durch (${fuss.join(',')})`);

/* 7 · Alles uebersteht das Neuladen */
await page.reload({ waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet [data-page]');
await page.waitForTimeout(250);
check(await seiten() === 6, 'Auswahl bleibt nach dem Neuladen erhalten');

/* 8 · Bearbeitungsflaechen erscheinen nicht im Druck */
await page.emulateMedia({ media:'print' });
const gedruckt = await page.evaluate(() => {
  const zeigt = sel => { const n = document.querySelector(sel); return !!n && getComputedStyle(n).display !== 'none'; };
  return zeigt('.vz-topbar') || zeigt('.vz-panel');
});
await page.emulateMedia({ media:'screen' });
check(!gedruckt, 'Bedienleiste und Formular bleiben ungedruckt');

await browser.close();
if (problems.length){ console.log('\nPROBLEME:'); problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nGästemappe in Ordnung.');
