/* Prüft die Liegenschaften: wählen, neu anlegen, gespeichert bleiben.

   Das ist die Stelle, an der ein Aushang seine Adresse und seine Firma
   herbekommt. Geht hier etwas schief, steht eine falsche Adresse auf einem
   Blatt, das jahrelang an der Wand hängt.

   Aufruf:  node tests/liegenschaften.mjs [http://127.0.0.1:8099]  */
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
const hin = async (hash) => {
  const ziel = `${BASE}/index.html${hash}`;
  if (page.url() === ziel) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(ziel, { waitUntil:'networkidle' });
  await page.waitForTimeout(280);
};

/* ---------- 1. Der Umschalter im Kopf ------------------------------------- */
await hin('#/');
const kopf = await page.evaluate(() => {
  const w = document.getElementById('vz-objektwahl');
  return w ? { da:true, wert:w.value, zahl:w.options.length } : { da:false };
});
pruefe('Der Umschalter steht im Kopf, auf jeder Seite',
  kopf.da && kopf.zahl > 5, `${kopf.zahl} Einträge`);
pruefe('Ohne Wahl steht er auf «keine»', kopf.wert === '', `«${kopf.wert}»`);

/* ---------- 2. Eine eigene Liegenschaft anlegen --------------------------- */
await hin('#/s/liegenschaften');
const vorher = await page.evaluate(() => document.querySelectorAll('.vz-objektzeile').length);

await page.click('#vz-obj-neu');
await page.waitForTimeout(220);
pruefe('Das Formular geht auf',
  await page.evaluate(() => Boolean(document.getElementById('vz-objektform'))));

/* Ohne Kuerzel darf nichts gespeichert werden — daran wird sie erkannt. */
page.once('dialog', d => d.accept());
await page.fill('#vz-of-name', 'Ohne Kürzel');
await page.click('#vz-of-sichern');
await page.waitForTimeout(260);
pruefe('Ohne Kürzel wird nichts gespeichert',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:objekte') || '[]').length === 0));

await page.fill('#vz-of-code', 'K9');
await page.fill('#vz-of-name', 'Kirchgasse 9');
await page.fill('#vz-of-street', 'Kirchgasse 9');
await page.fill('#vz-of-zip', '3210');
await page.fill('#vz-of-city', 'Kerzers');
await page.click('#vz-of-sichern');
await page.waitForTimeout(360);

const nachher = await page.evaluate(() => ({
  zeilen: document.querySelectorAll('.vz-objektzeile').length,
  gespeichert: JSON.parse(localStorage.getItem('nsvz:objekte') || '[]'),
  imKopf: [...document.getElementById('vz-objektwahl').options].map(o => o.text)
}));
pruefe('Die neue Liegenschaft steht in der Liste',
  nachher.zeilen === vorher + 1, `${vorher} → ${nachher.zeilen}`);
pruefe('Sie liegt gespeichert im Browser',
  nachher.gespeichert.length === 1 && nachher.gespeichert[0].code === 'K9',
  JSON.stringify(nachher.gespeichert.map(o => o.id)));
pruefe('Sie steht sofort im Umschalter',
  nachher.imKopf.some(t => t.includes('K9')), nachher.imKopf.filter(t => t.includes('K9')).join());

/* ---------- 3. Sie überlebt das Neuladen ---------------------------------- */
await hin('#/s/liegenschaften');
pruefe('Nach dem Neuladen ist sie noch da',
  await page.evaluate(() => Boolean(document.querySelector('[data-aktiv="obj-k9"], [data-objweg="obj-k9"]'))));

/* ---------- 4. Aktiv setzen wirkt auf die Vorlagen ------------------------ */
await page.click('[data-aktiv="obj-k9"]');
await page.waitForTimeout(340);
pruefe('Aktiv setzen wird gespeichert',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:aktives-objekt') || 'null') === 'obj-k9'));

await hin('#/t/parkschild');
const amBlatt = await page.evaluate(() => document.getElementById('vz-sheet').textContent);
pruefe('Eine frische Vorlage startet bei der aktiven Liegenschaft',
  /Kirchgasse 9/.test(amBlatt), amBlatt.slice(0, 90).replace(/\s+/g, ' '));

/* Die Firma kommt mit — jede Liegenschaft weiss, unter wem sie laeuft. */
await hin('#/s/liegenschaften');
await page.click('[data-aktiv="A4"]');           // A4 läuft unter «Amonn Architektur»
await page.waitForTimeout(320);
await hin('#/t/parkschild');
pruefe('Beim Wechsel kommt die Firma der Liegenschaft mit',
  /Architektur/i.test(await page.evaluate(() => document.getElementById('vz-sheet').textContent)));

/* ---------- 5. Ein vorhandener Entwurf wird nicht überfahren -------------- */
await page.evaluate(() => localStorage.setItem('nsvz:draft:hinweis',
  JSON.stringify({ objekt:'A14', absender:'hotel', title:'Bestehender Entwurf' })));
await hin('#/t/hinweis');
const hinweis = await page.evaluate(() => {
  const k = document.getElementById('vz-objekthinweis');
  return {
    objekt: JSON.parse(localStorage.getItem('nsvz:draft:hinweis')).objekt,
    sichtbar: !k.hidden,
    text: k.textContent.replace(/\s+/g, ' ').trim()
  };
});
pruefe('Ein bestehender Entwurf behält seine Liegenschaft',
  hinweis.objekt === 'A14', hinweis.objekt);
pruefe('Stattdessen wird auf den Unterschied hingewiesen',
  hinweis.sichtbar && /A4|Allmendstrasse 4/.test(hinweis.text), hinweis.text);

await page.click('#vz-objekt-um');
await page.waitForTimeout(420);
const umgestellt = await page.evaluate(() => ({
  objekt: JSON.parse(localStorage.getItem('nsvz:draft:hinweis')).objekt,
  weg: document.getElementById('vz-objekthinweis').hidden
}));
pruefe('Ein Klick stellt sie um', umgestellt.objekt === 'A4' && umgestellt.weg,
  umgestellt.objekt);

/* ---------- 6. Umschalten mitten im Editor -------------------------------- */
await page.selectOption('#vz-objektwahl', 'B22');
await page.waitForTimeout(460);
pruefe('Umschalten im Kopf stellt die offene Vorlage gleich mit um',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:draft:hinweis')).objekt === 'B22'),
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:draft:hinweis')).objekt));
pruefe('Und das Blatt zeigt die neue Adresse',
  /Bernstrasse 22/.test(await page.evaluate(() => document.getElementById('vz-sheet').textContent)));

/* ---------- 7. Eigene Firma ----------------------------------------------- */
await hin('#/s/liegenschaften');
await page.click('#vz-firma-neu');
await page.waitForTimeout(220);
await page.fill('#vz-of-name', 'MUSTER VERWALTUNG');
await page.fill('#vz-of-street', 'Musterweg 1');
await page.fill('#vz-of-city', 'Bern');
await page.click('#vz-of-sichern');
await page.waitForTimeout(340);
pruefe('Eine eigene Firma lässt sich anlegen',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:absender') || '[]').length === 1));
pruefe('Ohne eigene Fusszeile wird eine gebaut, statt leer zu bleiben',
  await page.evaluate(() => {
    const a = JSON.parse(localStorage.getItem('nsvz:absender') || '[]')[0];
    return Boolean(a && a.foot && a.foot.includes('Musterweg 1'));
  }));

await hin('#/t/hinweis');
pruefe('Sie steht in der Absender-Auswahl der Vorlagen',
  await page.evaluate(() => {
    const sel = [...document.querySelectorAll('#vz-form select')]
      .find(s => s.id.includes('absender'));
    return sel ? [...sel.options].some(o => o.text === 'MUSTER VERWALTUNG') : false;
  }));

/* ---------- 8. Weitergeben und löschen ------------------------------------ */
await hin('#/s/liegenschaften');
const datei = await page.evaluate(() => {
  const t = document.createElement('textarea');   // nur den Inhalt prüfen
  return window.VZ.bestandAlsDatei ? window.VZ.bestandAlsDatei() : null;
});
if (datei){
  const inhalt = JSON.parse(datei);
  pruefe('Die Datei enthält eigene Liegenschaften und Firmen',
    inhalt.objekte.length === 1 && inhalt.absender.length === 1,
    `${inhalt.objekte.length} + ${inhalt.absender.length}`);
}

page.once('dialog', d => d.accept());
await page.click('[data-objweg="obj-k9"]');
await page.waitForTimeout(340);
pruefe('Löschen entfernt sie aus dem Speicher',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:objekte') || '[]').length === 0));

/* Ein Aushang, der noch auf ihr stand, darf nicht kaputtgehen. */
await page.evaluate(() => localStorage.setItem('nsvz:draft:waschplan',
  JSON.stringify({ objekt:'obj-k9', absender:'immobilien' })));
await hin('#/t/waschplan');
pruefe('Ein Aushang auf einer gelöschten Liegenschaft bleibt druckbar',
  await page.evaluate(() => document.getElementById('vz-sheet').offsetHeight > 200));

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nLiegenschaften: wählen, anlegen und speichern läuft.');
