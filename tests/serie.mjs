/* Prüft die Serie über mehrere Liegenschaften und den Schneidebogen.
   Aufruf:  node tests/serie.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1500, height:1100 } });
const fehler = [];
page.on('pageerror', err => fehler.push('JS-FEHLER: ' + err.message));
page.on('console', m => { if (m.type() === 'error') fehler.push('KONSOLE: ' + m.text()); });

function pruefe(name, ok, dazu){
  console.log(`${ok ? '✓' : '✗'} ${name}${dazu ? '  — ' + dazu : ''}`);
  if (!ok) fehler.push(name + (dazu ? ': ' + dazu : ''));
}

/* Das Formular ist in aufklappbare Kapitel geteilt; zugeklappte Felder sind
   für Playwright unsichtbar. Vor dem Bedienen also alles aufklappen. */
async function alleKapitelOeffnen(){
  const knopf = page.locator('#vz-alle-kap');
  if (!(await knopf.count())) return;
  if ((await knopf.textContent())?.includes('aufklappen')) await knopf.click();
  await page.waitForTimeout(120);
}

await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });

async function zeichne(id, teil){
  await page.evaluate(async ([k, t]) => {
    const m = await import(`./js/templates/${k}.js`);
    localStorage.setItem('nsvz:draft:' + k,
      JSON.stringify(Object.assign({}, structuredClone(m.default.defaults), t)));
  }, [id, teil]);
  if (page.url().includes('#/t/' + id)) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(`${BASE}/index.html#/t/${id}`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await alleKapitelOeffnen();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  return page.evaluate(() => {
    const s = document.getElementById('vz-sheet');
    const pg = Array.from(s.querySelectorAll('[data-page]'));
    return {
      multi: s.className.includes('sheet--multi'),
      format: (s.className.match(/sheet--(a\d[\w-]*)/) || [])[1],
      seiten: pg.length,
      hoehen: [...new Set(pg.map(e => e.offsetHeight))],
      breiten: [...new Set(pg.map(e => e.offsetWidth))],
      zellen: pg.map(e => e.querySelectorAll('.t-sicher-zelle').length),
      leerZellen: pg.map(e => e.querySelectorAll('.t-sicher-zelle.is-leer').length),
      objekte: pg.map(e => (e.querySelector('.t-hinweis-obj')?.textContent || '').split(' ·')[0]),
      absender: pg.map(e => e.querySelector('.t-hinweis-abs')?.textContent || ''),
      fit: document.getElementById('vz-fit').textContent.trim()
    };
  });
}

/* ---------- Serie im Hinweis-Aushang ------------------------------------ */
const aus = await zeichne('hinweis', { serie:'nein' });
pruefe('Ohne Serie bleibt es ein einzelnes Blatt', !aus.multi && aus.seiten === 0);

const eins = await zeichne('hinweis', { serie:'auswahl', serieObjekte:['A14'] });
pruefe('Eine einzige Liegenschaft ergibt kein Mehrseiten-Blatt',
  !eins.multi && eins.seiten === 0);

const sechs = await zeichne('hinweis', {
  serie:'auswahl', serieObjekte:['S17','A4','A14','B4','B7','A12'], serieAbsender:'objekt' });
pruefe('Sechs Liegenschaften ergeben sechs Seiten',
  sechs.multi && sechs.seiten === 6, String(sechs.seiten));
pruefe('Jede Seite ist ein volles A4',
  sechs.hoehen.length === 1 && sechs.hoehen[0] === 1123 && sechs.breiten[0] === 794,
  `${sechs.breiten[0]}x${sechs.hoehen[0]} px`);
pruefe('Die Reihenfolge folgt der Objektliste, nicht dem Anklicken',
  JSON.stringify(sechs.objekte) === JSON.stringify(['A4','A12','A14','B4','B7','S17']),
  sechs.objekte.join(','));
pruefe('Jede Seite trägt den Absender ihrer Liegenschaft',
  sechs.absender[0] === 'AMONN ARCHITEKTUR' &&
  sechs.absender[1] === 'HANS AMONN IMMOBILIEN' &&
  sechs.absender[2] === "N's Hotel",
  sechs.absender.slice(0, 3).join(' / '));
pruefe('Die Höhenkontrolle prüft die einzelne Seite, nicht den Stapel',
  sechs.fit.startsWith('✓'), sechs.fit);

const fest = await zeichne('hinweis', {
  serie:'auswahl', serieObjekte:['A4','A14','B7'],
  serieAbsender:'fest', absender:'immobilien' });
pruefe('«Für alle derselbe Absender» greift',
  fest.absender.every(a => a === 'HANS AMONN IMMOBILIEN'), fest.absender.join(' / '));

const unsinn = await zeichne('hinweis', {
  serie:'auswahl', serieObjekte:['A14','gibtsnicht','-','B7'] });
pruefe('Unbekannte Kürzel und «Ohne Objekt» fallen weg',
  unsinn.seiten === 2 && JSON.stringify(unsinn.objekte) === JSON.stringify(['A14','B7']),
  unsinn.objekte.join(','));

/* Der Knopf "Alle anhaken". */
await zeichne('hinweis', { serie:'nein', serieObjekte:[] });
await page.click('[data-action="serieAlle"]');
await page.waitForTimeout(300);
const alle = await page.evaluate(() => {
  const d = JSON.parse(localStorage.getItem('nsvz:draft:hinweis'));
  return { serie:d.serie, anzahl:d.serieObjekte.length,
           seiten:document.querySelectorAll('#vz-sheet [data-page]').length };
});
pruefe('«Alle anhaken» schaltet die Serie ein und wählt jede Liegenschaft',
  alle.serie === 'auswahl' && alle.anzahl === 11 && alle.seiten === 11,
  `${alle.anzahl} Liegenschaften, ${alle.seiten} Seiten`);

/* ---------- Schneidebogen bei den Sicherheitszeichen -------------------- */
const fuenf = [
  { zeichen:'rauchen-verboten', de:'', zusatz:'Gilt im ganzen Treppenhaus' },
  { zeichen:'gebot-tuer', de:'', zusatz:'' },
  { zeichen:'warnung-rutsch', de:'', zusatz:'' },
  { zeichen:'fluchtweg', de:'', zusatz:'' },
  { zeichen:'feuerloescher', de:'', zusatz:'' }
];

const einzeln = await zeichne('sicherheit', { bogen:'einzeln', format:'a5-land', rows:fuenf });
pruefe('Ohne Bogen: ein Schild je Blatt',
  einzeln.seiten === 5 && einzeln.format === 'a5-land', `${einzeln.seiten} Seiten, ${einzeln.format}`);

const zwei = await zeichne('sicherheit', { bogen:'2', format:'a5-land', rows:fuenf });
pruefe('Zwei auf A4: drei Bogen', zwei.seiten === 3, String(zwei.seiten));
pruefe('Der Bogen ist A4 hoch, egal was beim Papier steht',
  zwei.format === 'a4' && zwei.hoehen[0] === 1123 && zwei.breiten[0] === 794,
  `${zwei.format} ${zwei.breiten[0]}x${zwei.hoehen[0]}`);
pruefe('Je Bogen zwei Felder',
  JSON.stringify(zwei.zellen) === JSON.stringify([2,2,2]), zwei.zellen.join(','));
pruefe('Der letzte Bogen füllt mit einem leeren Feld auf',
  JSON.stringify(zwei.leerZellen) === JSON.stringify([0,0,1]), zwei.leerZellen.join(','));

const vier = await zeichne('sicherheit', { bogen:'4', format:'a4', rows:fuenf });
pruefe('Vier auf A4: zwei Bogen', vier.seiten === 2, String(vier.seiten));
pruefe('Je Bogen vier Felder',
  JSON.stringify(vier.zellen) === JSON.stringify([4,4]), vier.zellen.join(','));
pruefe('Der zweite Bogen trägt ein Schild und drei leere Felder',
  JSON.stringify(vier.leerZellen) === JSON.stringify([0,3]), vier.leerZellen.join(','));
pruefe('Auch der Viererbogen passt auf eine Seite', vier.fit.startsWith('✓'), vier.fit);

const schnittlinien = await page.evaluate(() => {
  const z = document.querySelector('.t-sicher-zelle');
  const cs = getComputedStyle(z);
  return { stil:cs.outlineStyle, breite:cs.outlineWidth };
});
pruefe('Die Schnittkanten sind gestrichelt und werden mitgedruckt',
  schnittlinien.stil === 'dashed' && parseFloat(schnittlinien.breite) > 0,
  `${schnittlinien.stil} ${schnittlinien.breite}`);

/* ---------- Der Druck liefert die richtigen Seiten ---------------------- */
/* Seiten und Papierformat direkt aus dem erzeugten PDF lesen — wie in
   tests/print.mjs, denn der Bildschirm sagt nichts über den Ausdruck. */
async function druck(){
  await page.emulateMedia({ media:'print' });
  const buf = await page.pdf({ printBackground:true, preferCSSPageSize:true });
  await page.emulateMedia({ media:'screen' });
  const roh = buf.toString('latin1');
  const box = /MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/.exec(roh);
  return { seiten:(roh.match(/\/Type\s*\/Page[^s]/g) || []).length,
           b:box ? Math.round(+box[1]) : 0, h:box ? Math.round(+box[2]) : 0 };
}

await zeichne('sicherheit', { bogen:'4', rows:fuenf });
const d4 = await druck();
pruefe('Gedruckt: der Viererbogen ergibt zwei A4-Seiten',
  d4.seiten === 2 && d4.b === 595 && d4.h === 842, `${d4.seiten} Seiten, ${d4.b}x${d4.h} pt`);

await zeichne('hinweis', { serie:'auswahl', serieObjekte:['A4','A14','B7','S17'] });
const dS = await druck();
pruefe('Gedruckt: die Serie ergibt vier A4-Seiten',
  dS.seiten === 4 && dS.b === 595 && dS.h === 842, `${dS.seiten} Seiten, ${dS.b}x${dS.h} pt`);

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nSerie und Schneidebogen: alles sauber.');
