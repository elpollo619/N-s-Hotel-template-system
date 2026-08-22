/* Prüft die Gliederung der Oberfläche: Startseite, Kapitelseiten, Suche,
   Kapitel im Editor, Massstab und Seitenzähler.
   Aufruf:  node tests/navigation.mjs [http://127.0.0.1:8099]  */
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
  await page.goto(`${BASE}/index.html${hash}`, { waitUntil:'networkidle' });
  await page.waitForTimeout(220);
};

/* ---------- 1. Startseite ------------------------------------------------ */
await hin('#/');
const start = await page.evaluate(() => ({
  kapitelSpalte: document.querySelectorAll('.vz-nav .vz-nav-zeile').length,
  kacheln: document.querySelectorAll('.vz-kachel').length,
  karten: document.querySelectorAll('.vz-inhalt .vz-card').length,
  schritte: document.querySelectorAll('.vz-schritte li').length,
  suchfeld: Boolean(document.getElementById('vz-suchfeld'))
}));
const kapZahl = await page.evaluate(() => window.VZ.GROUPS.length);
pruefe('Die Startseite zeigt jedes Kapitel als Kachel',
  start.kacheln === kapZahl, `${start.kacheln} von ${kapZahl}`);
pruefe('Die Kapitelspalte führt Startseite plus alle Kapitel',
  start.kapitelSpalte === kapZahl + 1, String(start.kapitelSpalte));
pruefe('Die Startseite ist keine Wand aus Vorlagen mehr',
  start.karten === 0, `${start.karten} Karten`);
pruefe('Drei Schritte als Einstieg', start.schritte === 3);
pruefe('Das Suchfeld steht im Kopf', start.suchfeld);

/* ---------- 2. Kapitelseite ---------------------------------------------- */
const gruppen = await page.evaluate(() =>
  window.VZ.GROUPS.map(g => ({ id:g.id, titel:g.title,
    n:g.ids.filter(i => window.VZ.TEMPLATES[i]).length })));

for (const g of gruppen){
  await hin('#/k/' + g.id);
  const k = await page.evaluate(() => ({
    karten: document.querySelectorAll('.vz-inhalt .vz-card').length,
    titel: document.querySelector('.vz-kap-kopf h1')?.textContent || '',
    aktiv: document.querySelector('.vz-nav-zeile.is-aktiv span')?.textContent || '',
    krumen: Array.from(document.querySelectorAll('.vz-krumen a, .vz-krumen b'))
      .map(e => e.textContent)
  }));
  const ok = k.karten === g.n && k.titel === g.titel &&
             k.aktiv === g.titel && k.krumen[0] === 'Startseite';
  pruefe(`Kapitel «${g.titel}»`, ok, `${k.karten} Vorlagen, Pfad ${k.krumen.join(' › ')}`);
}

await hin('#/k/gibtsnicht');
pruefe('Ein unbekanntes Kapitel führt zurück auf die Startseite',
  await page.evaluate(() => document.querySelectorAll('.vz-kachel').length > 0));

/* ---------- 3. Suche ------------------------------------------------------ */
await hin('#/');
async function suchen(wort){
  await page.fill('#vz-suchfeld', wort);
  await page.waitForTimeout(180);
  return page.evaluate(() => Array.from(document.querySelectorAll('.vz-treffer-zeile'))
    .map(z => ({ art:z.querySelector('.vz-treffer-art').textContent,
                 titel:z.querySelector('b').textContent,
                 ziel:z.getAttribute('href') })));
}
const tRauch = await suchen('rauchen');
pruefe('Die Suche findet quer durch Vorlagen, Bausteine und Zeichen',
  tRauch.length >= 3 && new Set(tRauch.map(t => t.art)).size >= 2,
  tRauch.slice(0, 2).map(t => `${t.art}: ${t.titel}`).join(' · '));

const tEn = await suchen('no smoking');
pruefe('Die Suche greift auch auf Englisch',
  tEn.some(t => /Rauch/.test(t.titel)), tEn[0] ? tEn[0].titel : '—');

const tPt = await suchen('estacionar');
pruefe('… und auf Portugiesisch',
  tPt.length > 0, tPt[0] ? tPt[0].titel : '—');

const tNichts = await suchen('xyzqvw');
pruefe('Ohne Treffer erscheint ein Hinweis statt einer leeren Liste',
  tNichts.length === 0 &&
  await page.evaluate(() => Boolean(document.querySelector('.vz-treffer-leer'))));

/* Ein Baustein-Treffer öffnet die Vorlage mit genau diesem Baustein. */
await suchen('betäubungsmittel');
const ziel = await page.evaluate(() =>
  document.querySelector('.vz-treffer-zeile')?.getAttribute('href'));
pruefe('Ein Baustein-Treffer zeigt auf den Hinweis-Aushang',
  /^#\/t\/hinweis\?w=/.test(ziel || ''), ziel);
await page.goto(`${BASE}/index.html${ziel}`, { waitUntil:'networkidle' });
await page.waitForTimeout(350);
const nachSprung = await page.evaluate(() => ({
  hash: location.hash,
  entwurf: JSON.parse(localStorage.getItem('nsvz:draft:hinweis') || '{}'),
  blatt: document.getElementById('vz-sheet').textContent
}));
pruefe('Der Baustein ist übernommen',
  nachSprung.entwurf.presetId === 'cannabis' && /Cannabis/.test(nachSprung.blatt),
  nachSprung.entwurf.title);
pruefe('Die Adresse ist danach aufgeräumt',
  nachSprung.hash === '#/t/hinweis', nachSprung.hash);

/* Ein Zeichen-Treffer landet bei den Sicherheitszeichen. */
await hin('#/');
await suchen('notausgang');
const zZiel = await page.evaluate(() =>
  document.querySelector('.vz-treffer-zeile')?.getAttribute('href'));
await page.goto(`${BASE}/index.html${zZiel}`, { waitUntil:'networkidle' });
await page.waitForTimeout(300);
pruefe('Ein Zeichen-Treffer öffnet genau dieses Zeichen',
  await page.evaluate(() =>
    document.querySelector('.t-sicher-txt h1')?.textContent === 'Notausgang'),
  zZiel);

/* ---------- 4. Kapitel im Editor ----------------------------------------- */
await hin('#/t/hinweis');
const kapStart = await page.evaluate(() => ({
  anzahl: document.querySelectorAll('.vz-kap').length,
  offen: document.querySelectorAll('.vz-kap.is-offen').length,
  ersterName: document.querySelector('.vz-kap-name')?.textContent
}));
pruefe('Das Formular ist in Kapitel geteilt',
  kapStart.anzahl >= 6, `${kapStart.anzahl} Kapitel`);
pruefe('Nur das erste Kapitel ist offen',
  kapStart.offen === 1, `${kapStart.offen} offen`);

await page.click('.vz-kap[data-kap="2"] .vz-kap-kopfzeile');
await page.waitForTimeout(150);
pruefe('Ein Kapitel lässt sich aufklappen',
  await page.evaluate(() => document.querySelectorAll('.vz-kap.is-offen').length === 2));

await page.click('#vz-alle-kap');
await page.waitForTimeout(150);
const alleAuf = await page.evaluate(() => ({
  offen: document.querySelectorAll('.vz-kap.is-offen').length,
  alle: document.querySelectorAll('.vz-kap').length,
  knopf: document.getElementById('vz-alle-kap').textContent
}));
pruefe('«Alle aufklappen» öffnet jedes Kapitel',
  alleAuf.offen === alleAuf.alle, `${alleAuf.offen}/${alleAuf.alle}`);
pruefe('Danach heisst der Knopf «Alle zuklappen»',
  alleAuf.knopf === 'Alle zuklappen', alleAuf.knopf);

await hin('#/t/hinweis');
pruefe('Die geöffneten Kapitel überstehen das Neuladen',
  await page.evaluate(() => document.querySelectorAll('.vz-kap.is-offen').length ===
                            document.querySelectorAll('.vz-kap').length));

/* ---------- 5. Massstab und Seitenzähler --------------------------------- */
await hin('#/t/gaestemappe');
const leiste = await page.evaluate(() => ({
  papier: document.querySelector('.vz-papier')?.textContent || '',
  seiten: document.querySelectorAll('#vz-seitenwahl option').length,
  zoom: document.getElementById('vz-zoomwahl')?.value
}));
pruefe('Die Leiste nennt das Papierformat',
  /A4 hoch/.test(leiste.papier), leiste.papier);
pruefe('Der Seitenzähler kennt alle acht Seiten',
  leiste.seiten === 8, String(leiste.seiten));
pruefe('Der Massstab steht auf «Einpassen»', leiste.zoom === 'fit', leiste.zoom);

await page.selectOption('#vz-zoomwahl', '1');
await page.waitForTimeout(220);
const nach100 = await page.evaluate(() => ({
  transform: document.getElementById('vz-scaler').style.transform,
  gespeichert: JSON.parse(localStorage.getItem('nsvz:zoom:gaestemappe') || 'null')
}));
pruefe('100 % zeichnet unskaliert',
  nach100.transform === 'scale(1)', nach100.transform);
pruefe('Der Massstab bleibt für diese Vorlage gemerkt',
  nach100.gespeichert === 1, String(nach100.gespeichert));

await hin('#/t/hinweis');
const einseitig = await page.evaluate(() => ({
  seitenwahl: Boolean(document.getElementById('vz-seitenwahl')),
  papier: document.querySelector('.vz-papier')?.textContent || ''
}));
pruefe('Bei einer einzigen Seite entfällt der Seitenzähler',
  !einseitig.seitenwahl, einseitig.papier);

/* ---------- 6. Tastatur und Verlauf -------------------------------------- */
await hin('#/');
await page.keyboard.press('/');
await page.waitForTimeout(120);
pruefe('«/» springt in die Suche',
  await page.evaluate(() => document.activeElement?.id === 'vz-suchfeld'));

await hin('#/t/waschplan');
await page.keyboard.press('Escape');
await page.waitForTimeout(250);
pruefe('Escape führt aus dem Editor zurück',
  await page.evaluate(() => location.hash === '#/'));

const zuletzt = await page.evaluate(() => ({
  gespeichert: JSON.parse(localStorage.getItem('nsvz:verlauf') || '[]'),
  gezeigt: Array.from(document.querySelectorAll('.vz-inhalt .vz-card h3')).map(h => h.textContent)
}));
pruefe('Zuletzt benutzte Vorlagen stehen auf der Startseite',
  zuletzt.gespeichert[0] === 'waschplan' && zuletzt.gezeigt.includes('Waschplan'),
  zuletzt.gespeichert.slice(0, 3).join(', '));

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nGliederung, Suche und Editor-Kapitel: alles sauber.');
