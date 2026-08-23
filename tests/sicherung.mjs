/* Prüft die Sicherung: alles exportieren, leeren, wieder laden.

   Aufruf:  node tests/sicherung.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1300, height:1000 } });
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
  await page.waitForTimeout(220);
};

/* Etwas Zustand anlegen. */
await hin('#/');
await page.evaluate(() => {
  localStorage.setItem('nsvz:favoriten', JSON.stringify(['waschplan','gutschein']));
  localStorage.setItem('nsvz:draft:hinweis', JSON.stringify({ title:'Testentwurf', objekt:'A14' }));
});

/* ---------- 1. Sichern liefert gültiges JSON mit allem ------------------- */
const datei = await page.evaluate(() => window.VZ.sicherungAlsDatei());
let obj = null; try{ obj = JSON.parse(datei); }catch(_){}
pruefe('Die Sicherung ist gültiges JSON', Boolean(obj) && obj.typ === 'nsvz-sicherung');
pruefe('Sie enthält die Favoriten und den Entwurf',
  obj && obj.daten && Array.isArray(obj.daten['favoriten']) &&
  obj.daten['favoriten'].includes('gutschein') && obj.daten['draft:hinweis'],
  obj ? Object.keys(obj.daten).join(', ') : '');

/* ---------- 2. Leeren, dann laden — alles wieder da ---------------------- */
await page.evaluate((text) => {
  localStorage.clear();
  window.VZ.sicherungLaden(text);
}, datei);
const nach = await page.evaluate(() => ({
  fav: JSON.parse(localStorage.getItem('nsvz:favoriten') || '[]'),
  draft: JSON.parse(localStorage.getItem('nsvz:draft:hinweis') || 'null')
}));
pruefe('Nach dem Laden sind die Favoriten zurück',
  nach.fav.includes('waschplan') && nach.fav.includes('gutschein'), nach.fav.join());
pruefe('Nach dem Laden ist der Entwurf zurück',
  nach.draft && nach.draft.title === 'Testentwurf', JSON.stringify(nach.draft));

/* ---------- 3. Kaputte Datei wird abgewiesen ---------------------------- */
const abgewiesen = await page.evaluate(() => {
  try{ window.VZ.sicherungLaden('{"typ":"falsch"}'); return false; }catch(_){ return true; }
});
pruefe('Eine ungültige Datei wird abgewiesen', abgewiesen);

/* ---------- 4. Die Knöpfe stehen auf der Anleitung ---------------------- */
await hin('#/s/hilfe');
pruefe('Auf der Anleitung stehen die Sicherungs-Knöpfe',
  await page.evaluate(() => Boolean(document.getElementById('vz-sig-export') &&
                                   document.getElementById('vz-sig-import'))));

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nSicherung: exportieren, leeren, wieder laden läuft.');
