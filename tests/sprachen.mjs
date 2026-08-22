/* Prüft die Mehrsprachigkeit der Aushänge und die Kontrastprüfung.
   Aufruf:  node tests/sprachen.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const SPRACHEN = ['de', 'en', 'fr', 'it', 'pt', 'es'];

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

/* ---------- 1. Datenbestand ---------------------------------------------- */
const daten = await page.evaluate(async langs => {
  const P = await import('./js/presets.js');
  const S = await import('./js/lib/sicherheitszeichen.js');
  const F = await import('./js/templates/sammelstelle.js');
  const luecken = [];

  for (const p of P.PRESETS){
    for (const l of langs){
      if (!p.titel || !String(p.titel[l] || '').trim()) luecken.push(`Baustein ${p.id} · Titel ${l}`);
      if (!p.text  || typeof p.text[l] !== 'string')    luecken.push(`Baustein ${p.id} · Text ${l}`);
    }
  }
  for (const z of S.SZ_ZEICHEN){
    for (const l of langs){
      if (!String(z.text[l] || '').trim()) luecken.push(`Zeichen ${z.id} · ${l}`);
    }
  }
  for (const fr of F.FRAKTIONEN){
    for (const l of langs){
      for (const feld of ['wort', 'ja', 'nein']){
        if (!String(fr[feld][l] || '').trim()) luecken.push(`Fraktion ${fr.id} · ${feld} ${l}`);
      }
    }
  }
  return { bausteine:P.PRESETS.length, zeichen:S.SZ_ZEICHEN.length,
           fraktionen:F.FRAKTIONEN.length, luecken };
}, SPRACHEN);

pruefe(`${daten.bausteine} Textbausteine in sechs Sprachen`, true);
pruefe(`${daten.zeichen} Sicherheitszeichen in sechs Sprachen`, true);
pruefe(`${daten.fraktionen} Abfallfraktionen in sechs Sprachen`, true);
pruefe('Keine Lücke im Sprachbestand', daten.luecken.length === 0,
  daten.luecken.slice(0, 6).join(' · ') || 'vollständig');

/* ---------- 2. Reihenfolge und Bereinigung ------------------------------- */
const ordnung = await page.evaluate(async () => {
  const m = await import('./js/lib/sprachen.js');
  return {
    durcheinander: m.sprachListe(['es', 'de', 'fr']),
    unbekannt:     m.sprachListe(['de', 'kl', 'es']),
    leer:          m.sprachListe([]),
    kaputt:        m.sprachListe(null),
    set:           m.sprachSet('bau')
  };
});
pruefe('Reihenfolge ist fest, nicht die des Anklickens',
  JSON.stringify(ordnung.durcheinander) === JSON.stringify(['de','fr','es']),
  ordnung.durcheinander.join(','));
pruefe('Unbekannte Sprache fällt weg',
  JSON.stringify(ordnung.unbekannt) === JSON.stringify(['de','es']), ordnung.unbekannt.join(','));
pruefe('Leere Auswahl fällt auf Deutsch zurück',
  JSON.stringify(ordnung.leer) === JSON.stringify(['de']) &&
  JSON.stringify(ordnung.kaputt) === JSON.stringify(['de']));
pruefe('Zusammenstellung «Handwerk und Reinigung» ist DE/PT/ES',
  JSON.stringify(ordnung.set) === JSON.stringify(['de','pt','es']), ordnung.set.join(','));

/* ---------- 3. Hinweis: Kästchen anhaken --------------------------------- */
async function hinweisMit(zustand){
  await page.evaluate(z => localStorage.setItem('nsvz:draft:hinweis', JSON.stringify(z)), zustand);
  if (page.url().includes('#/t/hinweis')) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(`${BASE}/index.html#/t/hinweis`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await alleKapitelOeffnen();
  await page.waitForTimeout(150);
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('.t-hinweis-block')).map(b => b.getAttribute('lang')));
}

const basis = await page.evaluate(async () => {
  const m = await import('./js/templates/hinweis.js');
  return structuredClone(m.default.defaults);
});

pruefe('Voreinstellung zeigt DE und EN',
  JSON.stringify(await hinweisMit(basis)) === JSON.stringify(['de','en']));

const alleSechs = await hinweisMit({ ...basis, sprachen:SPRACHEN.slice() });
pruefe('Alle sechs Sprachen erscheinen in fester Reihenfolge',
  JSON.stringify(alleSechs) === JSON.stringify(SPRACHEN), alleSechs.join(','));

const nurEs = await hinweisMit({ ...basis, sprachen:['es'] });
pruefe('Nur Spanisch geht auch', JSON.stringify(nurEs) === JSON.stringify(['es']), nurEs.join(','));

const spanischerText = await page.evaluate(() =>
  document.querySelector('.t-hinweis-block[lang="es"] .t-hinweis-p')?.textContent || '');
pruefe('Der spanische Text steht wirklich auf dem Blatt',
  spanischerText.includes('detección de incendios'), spanischerText.slice(0, 48));

/* Kästchen im Formular anklicken statt den Zustand zu setzen. */
await hinweisMit({ ...basis, sprachen:['de'] });
await page.click('.vz-checks[data-checks="sprachen"] input[value="pt"]');
await page.waitForTimeout(200);
const nachKlick = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.t-hinweis-block')).map(b => b.getAttribute('lang')));
pruefe('Kästchen anhaken fügt die Sprache hinzu',
  JSON.stringify(nachKlick) === JSON.stringify(['de','pt']), nachKlick.join(','));

/* ---------- 4. Fertige Zusammenstellung ---------------------------------- */
await page.selectOption('#f-sprachSet', 'ch');
await page.waitForTimeout(120);
await page.click('[data-action="setzeSprachen"]');
await page.waitForTimeout(250);
const nachSet = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.t-hinweis-block')).map(b => b.getAttribute('lang')));
pruefe('«Schweiz» setzt DE/FR/IT',
  JSON.stringify(nachSet) === JSON.stringify(['de','fr','it']), nachSet.join(','));

/* ---------- 5. Baustein übernehmen füllt alle Sprachen ------------------- */
await page.selectOption('#f-presetId', 'ruhezeit');
await page.waitForTimeout(120);
await page.click('[data-action="apply"]');
await page.waitForTimeout(250);
const uebernommen = await page.evaluate(() => {
  const d = JSON.parse(localStorage.getItem('nsvz:draft:hinweis'));
  return { de:d.de, fr:d.fr, es:d.es, titelIt:d.titelIt, kopf:d.title };
});
pruefe('Baustein füllt Deutsch', /22:00/.test(uebernommen.de), uebernommen.de.slice(0, 30));
pruefe('Baustein füllt Französisch', /22h00/.test(uebernommen.fr), uebernommen.fr.slice(0, 30));
pruefe('Baustein füllt Spanisch', /domingo/.test(uebernommen.es), uebernommen.es.slice(0, 30));
pruefe('Baustein füllt die italienische Überschrift',
  uebernommen.titelIt === 'Ore di silenzio', uebernommen.titelIt);
pruefe('Kopftitel folgt der Hauptsprache (DE)',
  uebernommen.kopf === 'Ruhezeit', uebernommen.kopf);

/* ---------- 6. Schilder in mehreren Sprachen ----------------------------- */
async function schild(id, zustand, sel){
  await page.evaluate(([k, z]) => localStorage.setItem('nsvz:draft:' + k, JSON.stringify(z)), [id, zustand]);
  if (page.url().includes('#/t/' + id)) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(`${BASE}/index.html#/t/${id}`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await alleKapitelOeffnen();
  await page.waitForTimeout(150);
  return page.evaluate(s => Array.from(document.querySelectorAll(s)).map(e => e.textContent.trim()), sel);
}

const sBasis = await page.evaluate(async () => {
  const m = await import('./js/templates/sicherheit.js');
  return structuredClone(m.default.defaults);
});
const zeichenTexte = await schild('sicherheit',
  { ...sBasis, sprachen:['de','fr','pt'], rows:[{ zeichen:'fluchtweg', de:'', zusatz:'' }] },
  '.t-sicher-txt h1, .t-sicher-mehr');
pruefe('Sicherheitszeichen dreisprachig',
  JSON.stringify(zeichenTexte) === JSON.stringify(['Notausgang','Sortie de secours','Saída de emergência']),
  zeichenTexte.join(' / '));

const eigenerText = await schild('sicherheit',
  { ...sBasis, sprachen:['de','es'], rows:[{ zeichen:'fluchtweg', de:'Notausgang Süd', zusatz:'' }] },
  '.t-sicher-txt h1, .t-sicher-mehr');
pruefe('Eigener Text ersetzt nur die Hauptsprache',
  JSON.stringify(eigenerText) === JSON.stringify(['Notausgang Süd','Salida de emergencia']),
  eigenerText.join(' / '));

const abBasis = await page.evaluate(async () => {
  const m = await import('./js/templates/sammelstelle.js');
  return structuredClone(m.default.defaults);
});
const fraktion = await schild('sammelstelle',
  { ...abBasis, sprachen:['de','it','es'], rows:[{ art:'glas', wort:'', ja:'', nein:'' }] },
  '.t-sammel-txt h1, .t-sammel-en');
pruefe('Sammelstelle nennt das Wort in allen gewählten Sprachen',
  fraktion[0] === 'Glas' && fraktion[1] === 'Vetro · Vidrio', fraktion.join(' / '));

/* ---------- 7. Kontrastprüfung ------------------------------------------- */
const k = await page.evaluate(async () => {
  const m = await import('./js/lib/kontrast.js');
  const w = { r:255, g:255, b:255 }, s = { r:0, g:0, b:0 };
  const bau = (farbe, grund, groesse) => {
    const d = document.createElement('div');
    d.style.cssText = `background:${grund};color:${farbe};font-size:${groesse}`;
    d.textContent = 'Prüftext';
    document.body.appendChild(d);
    const r = m.kontrastBefund(d);
    d.remove();
    return r;
  };
  return {
    maximal: Math.round(m.verhaeltnis(w, s)),
    gleich:  Math.round(m.verhaeltnis(w, w)),
    schwach: bau('#9FD9F0', '#ffffff', '20pt'),
    stark:   bau('#2A3350', '#ffffff', '20pt'),
    klein:   bau('#9FD9F0', '#ffffff', '8pt'),
    schwelleGross: m.schwelle(30, '400'),
    schwelleKlein: m.schwelle(14, '400')
  };
});
pruefe('Schwarz auf Weiss ergibt 21:1', k.maximal === 21, String(k.maximal));
pruefe('Gleiche Farben ergeben 1:1', k.gleich === 1, String(k.gleich));
pruefe('Blasses Cyan auf Weiss wird beanstandet',
  k.schwach && !k.schwach.ok, k.schwach ? `${k.schwach.wert}:1` : 'kein Befund');
pruefe('Navy auf Weiss ist in Ordnung', k.stark && k.stark.ok,
  k.stark ? `${k.stark.wert}:1` : 'kein Befund');
pruefe('Kleingedrucktes wird nicht gemeldet', k.klein === null);
pruefe('Schwellen 3:1 gross / 4.5:1 normal',
  k.schwelleGross === 3 && k.schwelleKlein === 4.5);

/* ---------- 8. Teilen-Link trägt alle Sprachen --------------------------- */
const rund = await page.evaluate(async langs => {
  const t = await import('./js/lib/teilen.js');
  const zustand = { sprachen:langs.slice(), es:'Está prohibido fumar', titelPt:'Proibido fumar' };
  const { payload } = await t.teilenKodieren(zustand);
  const zurueck = await t.teilenLesen(payload);
  return { laenge:payload.length, gleich:JSON.stringify(zurueck) === JSON.stringify(zustand) };
}, SPRACHEN);
pruefe('Sprachauswahl übersteht den Teilen-Link', rund.gleich, `${rund.laenge} Zeichen`);

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nMehrsprachigkeit und Kontrastprüfung: alles sauber.');
