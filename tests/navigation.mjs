/* Prüft die Gliederung der Oberfläche: Startseite, Arbeitsbereiche,
   Werkzeugseiten, Suche, Kapitel im Editor, Massstab und Seitenzähler.
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
/* page.goto auf eine Adresse, die schon offen ist, laedt nicht neu: der
   Zustand der vorigen Pruefung — Fokus, aufgeklappte Kapitel — stuende noch
   da. Darum in dem Fall ausdruecklich neu laden. */
const hin = async (hash) => {
  const ziel = `${BASE}/index.html${hash}`;
  if (page.url() === ziel) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(ziel, { waitUntil:'networkidle' });
  await page.waitForTimeout(220);
};

/* ---------- 1. Startseite ------------------------------------------------ */
await hin('#/');
const start = await page.evaluate(() => ({
  navZeilen: document.querySelectorAll('#vz-seitenleiste .vz-nav-zeile').length,
  kacheln: document.querySelectorAll('.vz-kachel').length,
  karten: document.querySelectorAll('.vz-seite .vz-card').length,
  zahlen: Array.from(document.querySelectorAll('.vz-zahl b')).map(b => Number(b.textContent)),
  schritte: document.querySelectorAll('.vz-schritte li').length,
  suchfeld: Boolean(document.getElementById('vz-suchfeld')),
  datum: document.querySelector('.vz-heute')?.textContent || ''
}));
const [bZahl, sZahl, vZahl] = await page.evaluate(() =>
  [window.VZ.BEREICHE.length, Object.keys(window.VZ.SEITEN).length,
   window.VZ.BEREICHE.flatMap(b => b.ids).filter(i => window.VZ.TEMPLATES[i]).length]);

pruefe('Die Startseite zeigt jeden Arbeitsbereich als Kachel',
  start.kacheln === bZahl, `${start.kacheln} von ${bZahl}`);
pruefe('Die Seitenleiste führt Startseite, alle Bereiche und alle Werkzeuge',
  start.navZeilen === 1 + bZahl + sZahl, String(start.navZeilen));
pruefe('Die Startseite ist keine Wand aus Vorlagen',
  start.karten === 0, `${start.karten} Karten`);
pruefe('Die Zahlenreihe nennt alle Vorlagen',
  start.zahlen[0] === vZahl, `${start.zahlen[0]} von ${vZahl}`);
pruefe('Jede Vorlage steht in genau einem Bereich',
  vZahl === await page.evaluate(() => Object.keys(window.VZ.TEMPLATES).length),
  `${vZahl} zugeteilt`);
pruefe('Drei Schritte als Einstieg', start.schritte === 3);
pruefe('Das Suchfeld steht im Kopf', start.suchfeld);
pruefe('Das heutige Datum steht im Kopf',
  /\d{4}/.test(start.datum), start.datum);

/* ---------- 2. Arbeitsbereiche ------------------------------------------- */
const bereiche = await page.evaluate(() =>
  window.VZ.BEREICHE.map(b => ({ id:b.id, titel:b.title, kurz:b.kurz,
    n:b.ids.filter(i => window.VZ.TEMPLATES[i]).length })));

for (const b of bereiche){
  await hin('#/b/' + b.id);
  const k = await page.evaluate(() => ({
    karten: document.querySelectorAll('.vz-seite .vz-card').length,
    titel: document.querySelector('.vz-seitenkopf h1')?.textContent || '',
    aktiv: document.querySelector('.vz-nav-zeile.is-aktiv .vz-nav-txt')?.textContent || '',
    krumen: Array.from(document.querySelectorAll('.vz-krumen a, .vz-krumen b'))
      .map(e => e.textContent)
  }));
  const ok = k.karten === b.n && k.titel === b.titel &&
             k.aktiv === b.kurz && k.krumen[0] === 'Startseite';
  pruefe(`Bereich «${b.titel}»`, ok, `${k.karten} Vorlagen, Pfad ${k.krumen.join(' › ')}`);
}

await hin('#/b/gibtsnicht');
pruefe('Ein unbekannter Bereich führt zurück auf die Startseite',
  await page.evaluate(() => document.querySelectorAll('.vz-kachel').length > 0));

/* Alte Kapitel-Adressen stecken in verschickten Links — sie müssen weiter
   irgendwo landen, statt ins Leere zu laufen. */
await hin('#/k/parken');
pruefe('Eine alte Kapitel-Adresse leitet auf den passenden Bereich um',
  await page.evaluate(() => location.hash === '#/b/ankommen'),
  await page.evaluate(() => location.hash));

/* ---------- 2b. Werkzeugseiten ------------------------------------------- */
for (const [id, titel] of [['hilfe','Anleitung'], ['eigene','Eigene Textbausteine'],
                           ['marke','Marke und Schrift']]){
  await hin('#/s/' + id);
  const w = await page.evaluate(() => ({
    titel: document.querySelector('.vz-seitenkopf h1')?.textContent || '',
    aktiv: document.querySelector('.vz-nav-zeile.is-aktiv')?.dataset.nav || ''
  }));
  pruefe(`Werkzeugseite «${titel}»`,
    w.titel === titel && w.aktiv === 's:' + id, `${w.titel} / ${w.aktiv}`);
}
pruefe('Die Marke-Seite nennt beide Hausschriften',
  await page.evaluate(() => document.querySelectorAll('.vz-schriftzeile').length === 2));
pruefe('Die Marke-Seite zeigt die echten Token-Werte',
  await page.evaluate(() =>
    document.querySelector('[data-token="--navy"]')?.textContent.trim() === '#2A3350'),
  await page.evaluate(() => document.querySelector('[data-token="--navy"]')?.textContent));
await hin('#/s/eigene');
pruefe('Ohne eigene Bausteine steht ein Hinweis statt einer leeren Liste',
  await page.evaluate(() => Boolean(document.querySelector('.vz-leer'))));

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
  gezeigt: Array.from(document.querySelectorAll('.vz-seite .vz-card h3')).map(h => h.textContent)
}));
pruefe('Zuletzt benutzte Vorlagen stehen auf der Startseite',
  zuletzt.gespeichert[0] === 'waschplan' && zuletzt.gezeigt.includes('Waschplan'),
  zuletzt.gespeichert.slice(0, 3).join(', '));

/* ---------- 7. Weiterarbeiten -------------------------------------------- */
/* Wer einen Entwurf offen hat, soll ihn auf der Startseite wiederfinden,
   ohne den Bereich zu kennen, in dem die Vorlage steht. */
await hin('#/');
const weiter = await page.evaluate(() => Array.from(
  document.querySelectorAll('.vz-weiter-zeile')).map(z => ({
    titel: z.querySelector('b').textContent,
    bereich: z.querySelector('i').textContent,
    ziel: z.getAttribute('href')
  })));
pruefe('Offene Entwürfe stehen auf der Startseite',
  weiter.some(w => w.ziel === '#/t/hinweis'),
  weiter.map(w => w.titel).join(', ') || '—');
pruefe('Jeder offene Entwurf nennt seinen Arbeitsbereich',
  weiter.length > 0 && weiter.every(w => w.bereich.length > 0),
  weiter[0] ? weiter[0].bereich : '—');

/* ---------- 8. Bedienbarkeit --------------------------------------------- */
/* Nach den Web Interface Guidelines. Nicht erschoepfend, aber die vier
   Regeln, die beim Umbauen am ehesten verloren gehen. */
await hin('#/');
pruefe('Ein Sprunglink führt an den Inhalt',
  await page.evaluate(() => document.querySelector('.vz-skip')?.getAttribute('href') === '#vz-view'));

await page.keyboard.press('Tab');
const ersterFokus = await page.evaluate(() => {
  const el = document.activeElement;
  const s = getComputedStyle(el);
  return { was: `${el.tagName}.${el.className || '-'}#${el.id || '-'}`,
           skip: el.matches?.('.vz-skip') || false,
           umriss: s.outlineStyle, breite: s.outlineWidth };
});
pruefe('Der erste Tabstopp ist der Sprunglink und zeigt einen Fokusring',
  ersterFokus.skip && ersterFokus.umriss !== 'none',
  `${ersterFokus.was} · ${ersterFokus.umriss} ${ersterFokus.breite}`);

const klein = await page.evaluate(() => {
  const zuKlein = [];
  for (const el of document.querySelectorAll('a[href], button, select, input')){
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;              // versteckt
    /* Links mitten im Fliesstext sind keine Bedienelemente: sie erben die
       Zeilenhoehe des Satzes. Sie 24 px hoch zu machen hiesse, den Absatz
       auseinanderzureissen. Die Regel gilt fuer Knoepfe und fuer Ziele, die
       man als solche ansteuert. */
    if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
    if (r.height < 24) zuKlein.push(`${el.className || el.tagName} ${Math.round(r.height)}px`);
  }
  return zuKlein;
});
pruefe('Keine Trefferfläche unter 24 px hoch', klein.length === 0, klein.slice(0, 3).join(' · '));

pruefe('Der Browser-Zoom ist nicht gesperrt',
  await page.evaluate(() =>
    !/user-scalable\s*=\s*no|maximum-scale/.test(
      document.querySelector('meta[name=viewport]')?.content || '')));

/* Die Schublade auf schmalen Geräten. */
const handy = await browser.newPage({ viewport:{ width:420, height:820 } });
await handy.goto(`${BASE}/index.html#/`, { waitUntil:'networkidle' });
await handy.waitForTimeout(260);
const zu = await handy.evaluate(() =>
  Math.round(document.getElementById('vz-seitenleiste').getBoundingClientRect().right));
await handy.click('#vz-burger');
await handy.waitForTimeout(340);
const auf = await handy.evaluate(() => ({
  links: Math.round(document.getElementById('vz-seitenleiste').getBoundingClientRect().x),
  schleier: !document.getElementById('vz-schleier').hidden,
  gross: getComputedStyle(document.querySelector('#vz-suchfeld')).fontSize
}));
pruefe('Schmal ist die Seitenleiste eine Schublade', zu <= 0, `rechter Rand ${zu}px`);
pruefe('Der Griff zieht sie auf', auf.links === 0 && auf.schleier, JSON.stringify(auf));
pruefe('Eingabefelder sind auf dem Telefon mindestens 16 px',
  parseFloat(auf.gross) >= 16, auf.gross);
await handy.close();

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nGliederung, Suche und Editor-Kapitel: alles sauber.');
