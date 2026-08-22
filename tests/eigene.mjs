/* Prüft die eigenen Textbausteine: anlegen, wiederfinden, überschreiben,
   löschen, als Datei sichern und wieder laden.
   Aufruf:  node tests/eigene.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1000 } });
const fehler = [];
page.on('pageerror', err => fehler.push('JS-FEHLER: ' + err.message));
page.on('console', m => { if (m.type() === 'error') fehler.push('KONSOLE: ' + m.text()); });
function pruefe(name, ok, dazu){
  console.log(`${ok ? '✓' : '✗'} ${name}${dazu ? '  — ' + dazu : ''}`);
  if (!ok) fehler.push(name + (dazu ? ': ' + dazu : ''));
}

async function alleKapitelOeffnen(){
  const knopf = page.locator('#vz-alle-kap');
  if (!(await knopf.count())) return;
  if ((await knopf.textContent())?.includes('aufklappen')) await knopf.click();
  await page.waitForTimeout(120);
}
async function zumHinweis(){
  if (page.url().includes('#/t/hinweis')) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(`${BASE}/index.html#/t/hinweis`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await alleKapitelOeffnen();
}

await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });
await page.evaluate(() => localStorage.removeItem('nsvz:eigene'));

/* ---------- 1. Modul für sich ------------------------------------------- */
const modul = await page.evaluate(async () => {
  const m = await import('./js/lib/eigene.js');
  const id1 = m.bausteinSichern({ name:'Baustellen-Hinweis', ton:'warnung', icon:'warn',
    titel:{ de:'Baustelle', en:'Building site' },
    text:{ de:'Bitte den Absperrungen folgen.', en:'Please follow the barriers.' } });
  const id2 = m.bausteinSichern({ name:'Baustellen-Hinweis',
    titel:{ de:'Zweiter' }, text:{ de:'x' } });
  const alle = m.eigeneBausteine();
  const einer = alle.find(p => p.id === id1);
  return {
    id1, id2, anzahl:alle.length,
    eigen:m.istEigener(id1), fremd:m.istEigener('rauchverbot'),
    sechsSprachen:['de','en','fr','it','pt','es'].every(s => s in einer.titel && s in einer.text),
    ton:einer.ton, icon:einer.icon, label:einer.label
  };
});
pruefe('Ein eigener Baustein bekommt ein lesbares Kürzel',
  modul.id1 === 'eigen-baustellen-hinweis', modul.id1);
pruefe('Gleicher Name zweimal ergibt zwei Bausteine',
  modul.id2 === 'eigen-baustellen-hinweis-2' && modul.anzahl === 2, modul.id2);
pruefe('Eigene sind als solche erkennbar', modul.eigen && !modul.fremd);
pruefe('Fehlende Sprachen werden leer angelegt', modul.sechsSprachen);
pruefe('Ton und Symbol bleiben erhalten',
  modul.ton === 'warnung' && modul.icon === 'warn', `${modul.ton}/${modul.icon}`);

/* ---------- 2. In der Auswahlliste und im Aushang ------------------------ */
await zumHinweis();
const inListe = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#f-presetId option')).map(o => o.value));
pruefe('Die eigenen stehen in der Auswahlliste',
  inListe.includes('eigen-baustellen-hinweis'), `${inListe.length} Einträge`);
pruefe('… und zwar hinter den mitgelieferten',
  inListe.indexOf('eigen-baustellen-hinweis') > inListe.indexOf('rauchverbot'));

await page.selectOption('#f-presetId', 'eigen-baustellen-hinweis');
await page.waitForTimeout(120);
await page.click('[data-action="apply"]');
await page.waitForTimeout(300);
const uebernommen = await page.evaluate(() => ({
  blatt: document.getElementById('vz-sheet').textContent,
  entwurf: JSON.parse(localStorage.getItem('nsvz:draft:hinweis'))
}));
pruefe('«Baustein übernehmen» holt auch einen eigenen',
  /Absperrungen/.test(uebernommen.blatt) && uebernommen.entwurf.title === 'Baustelle',
  uebernommen.entwurf.title);
pruefe('Der Ton kommt mit', uebernommen.entwurf.ton === 'warnung', uebernommen.entwurf.ton);

/* ---------- 3. Aus dem Editor heraus anlegen ----------------------------- */
await zumHinweis();
await page.selectOption('#f-presetId', 'ruhezeit');
await page.click('[data-action="apply"]');
await page.waitForTimeout(250);
await alleKapitelOeffnen();
await page.fill('#f-title', 'Ruhezeit im Sommer');
await page.fill('#f-eigenName', 'Ruhezeit Sommer');
await page.waitForTimeout(150);
await page.click('[data-action="eigenSichern"]');
await page.waitForTimeout(350);
const angelegt = await page.evaluate(() => {
  const liste = JSON.parse(localStorage.getItem('nsvz:eigene') || '[]');
  const d = JSON.parse(localStorage.getItem('nsvz:draft:hinweis'));
  const neu = liste.find(p => p.id === 'eigen-ruhezeit-sommer');
  return { anzahl:liste.length, gewaehlt:d.presetId,
           titelDe:neu && neu.titel.de, textFr:neu && neu.text.fr };
});
pruefe('Aus dem Editor lässt sich ein eigener Baustein anlegen',
  angelegt.anzahl === 3 && angelegt.gewaehlt === 'eigen-ruhezeit-sommer',
  angelegt.gewaehlt);
pruefe('Er merkt sich alle sechs Sprachen',
  /22h00/.test(angelegt.textFr || ''), (angelegt.textFr || '').slice(0, 30));
pruefe('Der Kopftitel wird als deutscher Titel gesichert',
  angelegt.titelDe === 'Ruhezeit im Sommer', angelegt.titelDe);

/* Erneutes Sichern überschreibt, statt einen zweiten anzulegen. */
await page.fill('#f-title', 'Ruhezeit im Hochsommer');
await page.waitForTimeout(150);
await page.click('[data-action="eigenSichern"]');
await page.waitForTimeout(300);
const nochmal = await page.evaluate(() => {
  const liste = JSON.parse(localStorage.getItem('nsvz:eigene') || '[]');
  return { anzahl:liste.length,
           titel:liste.find(p => p.id === 'eigen-ruhezeit-sommer')?.titel.de };
});
pruefe('Erneutes Sichern überschreibt den gewählten eigenen Baustein',
  nochmal.anzahl === 3 && nochmal.titel === 'Ruhezeit im Hochsommer',
  `${nochmal.anzahl} Stück, «${nochmal.titel}»`);

/* ---------- 4. Die Suche findet ihn -------------------------------------- */
await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });
await page.fill('#vz-suchfeld', 'hochsommer');
await page.waitForTimeout(220);
const gefunden = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.vz-treffer-zeile')).map(z => ({
    titel:z.querySelector('b').textContent, unter:z.querySelector('i')?.textContent })));
pruefe('Die Suche findet eigene Bausteine',
  gefunden.some(t => /Hochsommer/.test(t.titel) && t.unter === 'Eigener Baustein'),
  gefunden.map(t => t.titel).join(', ') || '—');

/* ---------- 5. Löschen ---------------------------------------------------- */
await zumHinweis();
await page.selectOption('#f-presetId', 'eigen-baustellen-hinweis-2');
await page.waitForTimeout(150);
await page.click('[data-action="eigenLoeschen"]');
await page.waitForTimeout(300);
const nachLoeschen = await page.evaluate(() => {
  const liste = JSON.parse(localStorage.getItem('nsvz:eigene') || '[]');
  return { anzahl:liste.length, ids:liste.map(p => p.id),
           gewaehlt:JSON.parse(localStorage.getItem('nsvz:draft:hinweis')).presetId };
});
pruefe('Löschen entfernt genau einen', nachLoeschen.anzahl === 2, nachLoeschen.ids.join(', '));
pruefe('Danach steht die Auswahl auf «Frei»',
  nachLoeschen.gewaehlt === 'frei', nachLoeschen.gewaehlt);

const mitgeliefert = await page.evaluate(async () => {
  const m = await import('./js/lib/eigene.js');
  const vorher = m.eigeneBausteine().length;
  m.bausteinLoeschen('rauchverbot');
  return { vorher, nachher:m.eigeneBausteine().length };
});
pruefe('Ein mitgelieferter Baustein lässt sich nicht wegwerfen',
  mitgeliefert.vorher === mitgeliefert.nachher, `${mitgeliefert.nachher} eigene`);

/* ---------- 6. Sammlung als Datei ---------------------------------------- */
const rund = await page.evaluate(async () => {
  const m = await import('./js/lib/eigene.js');
  const datei = m.sammlungAlsDatei();
  localStorage.removeItem('nsvz:eigene');
  const leer = m.eigeneBausteine().length;
  const erste = m.sammlungLaden(datei);
  const nachErster = m.eigeneBausteine().length;
  const zweite = m.sammlungLaden(datei);        // dieselbe Datei nochmals
  let fehlermeldung = '';
  try { m.sammlungLaden('{"art":"etwas anderes"}'); }
  catch (err){ fehlermeldung = err.message; }
  return { datei:JSON.parse(datei), leer, erste, nachErster, zweite,
           amEnde:m.eigeneBausteine().length, fehlermeldung };
});
pruefe('Die Sammlung ist eine erkennbare Datei',
  rund.datei.art === 'nsvz-bausteine' && rund.datei.bausteine.length === 2,
  `${rund.datei.bausteine.length} Bausteine`);
pruefe('Sie lässt sich wieder einlesen',
  rund.leer === 0 && rund.nachErster === 2 && rund.erste.dazu === 2,
  `${rund.erste.dazu} dazu`);
pruefe('Zweimal laden ersetzt, statt zu verdoppeln',
  rund.zweite.ersetzt === 2 && rund.zweite.dazu === 0 && rund.amEnde === 2,
  `${rund.zweite.ersetzt} ersetzt, ${rund.amEnde} insgesamt`);
pruefe('Eine fremde Datei wird abgelehnt',
  /keine Bausteine/.test(rund.fehlermeldung), rund.fehlermeldung);

/* ---------- 7. Kaputter Speicher wirft die App nicht um ------------------ */
const robust = await page.evaluate(async () => {
  const m = await import('./js/lib/eigene.js');
  localStorage.setItem('nsvz:eigene', '"kein Array"');
  const a = m.eigeneBausteine().length;
  localStorage.setItem('nsvz:eigene', '[{"id":"eigen-x"},{"kaputt":true}]');
  const b = m.eigeneBausteine().length;
  localStorage.removeItem('nsvz:eigene');
  return { a, b };
});
pruefe('Unbrauchbarer Speicherinhalt wird still übergangen',
  robust.a === 0 && robust.b === 0, `${robust.a}/${robust.b}`);

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nEigene Textbausteine: alles sauber.');
