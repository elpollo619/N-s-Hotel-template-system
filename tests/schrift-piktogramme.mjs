/* Prüft die Schriftwahl und die Piktogramme.

   Die beiden gehören zusammen: es sind die zwei Stellen, an denen das
   Aussehen eines Aushangs geändert wird, ohne einen Text anzufassen.

   Aufruf:  node tests/schrift-piktogramme.mjs [http://127.0.0.1:8099]  */
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
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(260);
};

/* ---------- 1. Alle Schriften sind wirklich da ---------------------------- */
/* Die Zentrale laedt nichts nach. Steht eine Familie in der Liste, muss ihre
   Datei im Projekt liegen — sonst waehlt jemand etwas, das still auf die
   Systemschrift zurueckfaellt.

   Zwei Tore, weil jedes allein luegen kann: document.fonts.load() sagt, ob
   es ueberhaupt eine @font-face-Regel gibt und ob die Datei geladen werden
   konnte; die Breitenmessung sagt, ob wirklich etwas anderes gezeichnet wird
   als die Grundschrift. (Ein blosses fonts.check() taugt nicht — das meldet
   fuer unbekannte Familien in den meisten Browsern true.)

   Wichtig: erst laden, dann messen. document.fonts.ready wartet nur auf die
   Schnitte, die die Seite gerade benutzt — ein Schnitt, den nur eine andere
   Vorlage braucht, waere sonst noch gar nicht geholt. */
await hin('#/s/schrift');
const schriftstand = await page.evaluate(async () => {
  const c = document.createElement('canvas').getContext('2d');
  const probe = 'MWmwiIl1080@ÄÖÜ Handschrift';
  const breite = (fam) => { c.font = `72px ${fam}`; return c.measureText(probe).width; };
  const aus = [];
  for (const f of window.VZ.FAMILIEN){
    let geladen = 0;
    try{ geladen = (await document.fonts.load(`72px "${f.id}"`)).length; }catch(_){}
    const grund = ['monospace', 'serif', 'sans-serif'];
    const anders = grund.some(g => Math.abs(breite(`"${f.id}", ${g}`) - breite(g)) > 0.5);
    aus.push({ id:f.id, da:geladen > 0 && anders, geladen, anders });
  }
  return aus;
});
const fehlend = schriftstand.filter(f => !f.da)
  .map(f => `${f.id} (${f.geladen} Schnitte, ${f.anders ? 'zeichnet' : 'zeichnet nicht'})`);
pruefe('Jede waehlbare Schrift liegt im Projekt',
  fehlend.length === 0, fehlend.length ? fehlend.join(', ') : `${schriftstand.length} Familien`);

/* ---------- 2. Jede Rolle bietet nur passende Familien -------------------- */
const rollen = await page.evaluate(() => window.VZ.ROLLEN.map(r => r.id));
for (const r of rollen){
  const n = await page.evaluate(rolle =>
    document.querySelectorAll(`[data-rolle="${rolle}"]`).length, r);
  pruefe(`Rolle «${r}» hat Kandidaten`, n >= 3, `${n} Karten`);
}

/* ---------- 3. Waehlen wirkt bis aufs Blatt ------------------------------- */
await page.click('[data-rolle="script"][data-familie="Caveat"]');
await page.waitForTimeout(320);
const token = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--font-script').trim());
pruefe('Die gekaufte Schrift steht weiter an erster Stelle',
  /^"Caflisch Script Pro"/.test(token), token);
pruefe('Die Wahl steht dahinter', /"Caveat"/.test(token), token);

await hin('#/t/foto');
const amBlatt = await page.evaluate(() => {
  const e = document.querySelector('#vz-sheet .eyebrow');
  return e ? getComputedStyle(e).fontFamily : '';
});
pruefe('Der Aushang übernimmt die gewählte Schrift',
  /Caveat/.test(amBlatt), amBlatt);

/* Die Wahl überlebt das Neuladen — sie liegt im Browser, nicht im Entwurf. */
await hin('#/t/foto');
pruefe('Die Wahl überlebt das Neuladen',
  /Caveat/.test(await page.evaluate(() =>
    getComputedStyle(document.querySelector('#vz-sheet .eyebrow')).fontFamily)));

/* ---------- 4. Zurücksetzen ----------------------------------------------- */
await hin('#/s/schrift');
await page.click('#vz-schrift-reset');
await page.waitForTimeout(300);
pruefe('Zurücksetzen stellt die Voreinstellung her',
  /Parisienne/.test(await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--font-script'))),
  await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-script').trim()));

/* ---------- 5. Piktogramme ------------------------------------------------ */
await hin('#/s/piktogramme');
const pikto = await page.evaluate(() => ({
  gezeigt: document.querySelectorAll('.vz-pikto').length,
  bekannt: window.VZ.ICON_KEYS.length,
  gruppen: document.querySelectorAll('#vz-pikto-liste .vz-block').length,
  leer: [...document.querySelectorAll('.vz-pikto svg')].filter(s => !s.innerHTML.trim()).length
}));
pruefe('Jedes bekannte Piktogramm steht auf der Seite',
  pikto.gezeigt === pikto.bekannt, `${pikto.gezeigt} von ${pikto.bekannt}`);
pruefe('Sie stehen in Gruppen', pikto.gruppen >= 6, `${pikto.gruppen} Gruppen`);
pruefe('Keines ist leer gezeichnet', pikto.leer === 0, `${pikto.leer} leer`);

/* Kein Piktogramm darf zweimal denselben Pfad haben — dann waeren zwei Namen
   dasselbe Bild, und eines davon ein Versehen beim Kopieren. */
const doppelt = await page.evaluate(() => {
  const gesehen = new Map(), treffer = [];
  for (const el of document.querySelectorAll('.vz-pikto')){
    const d = el.querySelector('svg').innerHTML.trim();
    const name = el.dataset.pikto;
    if (gesehen.has(d)) treffer.push(`${gesehen.get(d)} = ${name}`);
    else gesehen.set(d, name);
  }
  return treffer;
});
pruefe('Kein Piktogramm doppelt gezeichnet', doppelt.length === 0, doppelt.join(' · '));

await page.fill('#vz-pikto-suche', 'dusche');
await page.waitForTimeout(200);
const gesucht = await page.evaluate(() => ({
  n: Number(document.getElementById('vz-pikto-zahl').textContent),
  erstes: document.querySelector('.vz-pikto')?.dataset.pikto
}));
pruefe('Die Suche findet ein Zeichen', gesucht.n >= 1 && gesucht.erstes === 'shower',
  `${gesucht.n} Treffer, erstes ${gesucht.erstes}`);

await page.fill('#vz-pikto-suche', 'qqqq');
await page.waitForTimeout(200);
pruefe('Ohne Treffer erscheint ein Hinweis',
  await page.evaluate(() => Boolean(document.querySelector('#vz-pikto-liste .vz-leer'))));

/* ---------- 6. Die Auswahlfelder in den Vorlagen -------------------------- */
await hin('#/t/hinweis');
await page.evaluate(() => document.querySelectorAll('.vz-kap').forEach(k => k.classList.add('is-offen')));
await page.waitForTimeout(160);
const feld = await page.evaluate(() => {
  const sel = [...document.querySelectorAll('#vz-form select')].find(s => s.id.includes('icon'));
  if (!sel) return null;
  return { gruppen:sel.querySelectorAll('optgroup').length, optionen:sel.options.length };
});
pruefe('Das Symbolfeld ist nach Gruppen geordnet',
  feld && feld.gruppen >= 6, feld ? `${feld.gruppen} Gruppen, ${feld.optionen} Zeichen` : 'kein Feld');

await page.evaluate(() => {
  const sel = [...document.querySelectorAll('#vz-form select')].find(s => s.id.includes('icon'));
  sel.value = 'extinguisher';
  sel.dispatchEvent(new Event('change', { bubbles:true }));
});
await page.waitForTimeout(320);
pruefe('Ein gewähltes Zeichen erscheint auf dem Blatt',
  await page.evaluate(() => Boolean(document.querySelector('#vz-sheet .t-hinweis-ico svg'))));

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nSchriftwahl und Piktogramme: alles sauber.');
