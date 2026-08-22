/* Prüft den Plan-Editor: Auswählen, Ziehen, Punkte, Eigenschaften,
   Hinzufügen, Löschen, Drehen — und dass alles gespeichert bleibt. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1600, height:1050 } });
const problems = [];
page.on('pageerror', e => problems.push('JS-FEHLER: ' + e.message));
page.on('console', m => { if (m.type() === 'error') problems.push('KONSOLE: ' + m.text()); });
const check = (ok, was) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) problems.push(was); };

/* Das Formular ist in aufklappbare Kapitel geteilt; zugeklappte Felder sind
   für Playwright unsichtbar. Vor dem Bedienen also alles aufklappen. */
async function alleKapitelOeffnen(){
  const knopf = page.locator('#vz-alle-kap');
  if (!(await knopf.count())) return;
  if ((await knopf.textContent())?.includes('aufklappen')) await knopf.click();
  await page.waitForTimeout(120);
}

const draft = () => page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:draft:plan-editor') || '{}'));
const box = async sel => (await page.locator(sel).boundingBox());

// Mit sauberem Zustand starten, sonst hängt das Ergebnis vom letzten Lauf ab.
await page.goto(BASE + '/index.html', { waitUntil:'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.goto(BASE + '/index.html#/t/plan-editor', { waitUntil:'networkidle' });
await page.waitForSelector('[data-plan-svg] g[data-id]');
await page.waitForTimeout(300);

const anzahl = await page.locator('[data-plan-svg] g[data-id]').count();
check(anzahl === 14, `Ausgangsplan gezeichnet (${anzahl} Elemente)`);

/* 1 · Element auswählen zeigt seine Eigenschaften */
const pin = page.locator('[data-plan-svg] g[data-id]').nth(4);   // N's-Pin
await pin.click({ position:{ x:2, y:2 }, force:true });
await page.waitForTimeout(150);
check((await page.locator('#vz-extra').innerText()).includes('Pin'), 'Auswahl öffnet die Eigenschaften');

/* 2 · Ziehen verschiebt das Element und wird gesichert */
const vorher = (await draft()).plan.els[4];
const b = await box('[data-plan-svg]');
await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.55);
await page.mouse.down();
await page.mouse.move(b.x + b.width * 0.5 + 60, b.y + b.height * 0.55 + 40, { steps:8 });
await page.mouse.up();
await page.waitForTimeout(200);
const nachher = (await draft()).plan.els[4];
check(Math.abs(nachher.x - vorher.x) > 20, `Ziehen verschiebt (x ${Math.round(vorher.x)} → ${Math.round(nachher.x)})`);

/* 3 · Eigenschaft ändern wirkt sofort */
await page.locator('#vz-extra input[type=range][data-key="scale"]').fill('2.2');
await page.waitForTimeout(150);
check((await draft()).plan.els[4].scale === 2.2, 'Regler ändert die Grösse');

/* 4 · Farbfeld setzt die Farbe */
await page.locator('#vz-extra .vz-sw[data-c="#E23A2E"]').first().click();
await page.waitForTimeout(150);
check((await draft()).plan.els[4].color === '#E23A2E', 'Farbfeld setzt die Farbe');

/* 5 · Element hinzufügen */
await page.click('#vz-extra [data-add="label"]');
await page.waitForTimeout(200);
check((await draft()).plan.els.length === 15, 'Neues Element hinzugefügt');
check((await page.locator('#vz-extra').innerText()).includes('Beschriftung'), 'Neues Element ist ausgewählt');

/* 6 · Duplizieren und Löschen */
await page.click('#vz-extra [data-dup]');
await page.waitForTimeout(150);
check((await draft()).plan.els.length === 16, 'Duplizieren');
await page.click('#vz-extra [data-del]');
await page.waitForTimeout(150);
check((await draft()).plan.els.length === 15, 'Löschen entfernt das Element');
check(!(await page.locator('#vz-extra').innerText()).includes('Löschen'),
  'Nach dem Löschen ist nichts mehr ausgewählt');
// zweites Element wieder auswählen und ebenfalls entfernen
// (auf den Kasten der Beschriftung klicken, nicht auf die Ecke des Rahmens)
await page.locator('[data-plan-svg] g[data-id]').last().locator('rect').first().click({ force:true });
await page.waitForTimeout(150);
await page.click('#vz-extra [data-del]');
await page.waitForTimeout(150);
const endLen = (await draft()).plan.els.length;
check(endLen === 14, `Ausgangszustand wiederhergestellt (${endLen} Elemente)`);

/* 7 · Zone umformen: blauer Punkt lässt sich ziehen */
// direkt auf die Fläche klicken — die Ecke des Rahmens liegt bei einer
// schrägen Zone ausserhalb der Form
await page.locator('[data-plan-svg] g[data-id] polygon').first().click({ force:true });
await page.waitForTimeout(150);
const punkte = await page.locator('[data-plan-svg] .om-handles circle').count();
check(punkte >= 4, `Zone zeigt ${punkte} Punkte zum Umformen`);

/* 7b · Alle ids müssen eindeutig sein (sonst löscht "Löschen" zwei Elemente) */
const ids = (await draft()).plan.els.map(e => e.id);
check(ids.length === new Set(ids).size, 'Alle Elemente haben eine eigene id');

/* 8 · Drehen der ganzen Szene */
await page.click('#vz-extra [data-rotate]');
await page.waitForTimeout(200);
check((await draft()).view.rot === 90, 'Alles drehen ändert die Ansicht');
await page.click('#vz-extra [data-rotate]');
await page.click('#vz-extra [data-rotate]');
await page.click('#vz-extra [data-rotate]');
await page.waitForTimeout(200);
check((await draft()).view.rot === 0, 'Viermal drehen ergibt wieder den Anfang');

/* 9 · Format wechselt das Papier */
await alleKapitelOeffnen();
await page.selectOption('#f-format', 'A3-quer');
await page.waitForTimeout(300);
check(await page.locator('#vz-sheet.sheet--a3-land').count() === 1, 'Format A3 quer greift');
check((await page.evaluate(() => document.getElementById('vz-page-size').textContent)).includes('A3'),
  '@page folgt dem gewählten Format');
await page.selectOption('#f-format', 'A4-quer');
await page.waitForTimeout(250);

/* 10 · Neuladen behält den Plan */
const vorReload = (await draft()).plan.els.length;
await page.reload({ waitUntil:'networkidle' });
await page.waitForSelector('[data-plan-svg] g[data-id]');
check(await page.locator('[data-plan-svg] g[data-id]').count() === vorReload, 'Plan übersteht das Neuladen');

/* 11 · Im Druck verschwinden die Bearbeitungspunkte */
await page.locator('[data-plan-svg] g[data-id] polygon').first().click({ force:true });
await page.waitForTimeout(150);
await page.emulateMedia({ media:'print' });
const sichtbar = await page.evaluate(() =>
  getComputedStyle(document.querySelector('[data-plan-svg] .om-handles')).display);
check(sichtbar === 'none', 'Bearbeitungspunkte werden nicht mitgedruckt');
await page.emulateMedia({ media:'screen' });

await browser.close();
if (problems.length){ console.log('\nPROBLEME:'); problems.forEach(p => console.log(' · ' + p)); process.exit(1); }
console.log('\nPlan-Editor in Ordnung.');
