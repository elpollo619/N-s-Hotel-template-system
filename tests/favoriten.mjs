/* Prüft die Favoriten: anheften, auf der Startseite oben, bleibt nach dem
   Neuladen. Der Stern darf die Karte nicht öffnen.

   Aufruf:  node tests/favoriten.mjs [http://127.0.0.1:8099]  */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1400, height:1000 } });
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

/* Sauber starten. */
await hin('#/');
await page.evaluate(() => localStorage.removeItem('nsvz:favoriten'));

/* ---------- 1. Der Stern steht auf jeder Karte ---------------------------- */
await hin('#/b/unterhalt');
const sterne = await page.evaluate(() => document.querySelectorAll('.vz-card-wrap .vz-fav').length);
const karten = await page.evaluate(() => document.querySelectorAll('.vz-card').length);
pruefe('Jede Karte hat einen Stern', sterne === karten && sterne > 0, `${sterne} von ${karten}`);

/* ---------- 2. Anheften öffnet die Karte nicht --------------------------- */
const vorherHash = await page.evaluate(() => location.hash);
await page.click('.vz-card-wrap .vz-fav');
await page.waitForTimeout(200);
pruefe('Ein Klick auf den Stern öffnet die Vorlage nicht',
  await page.evaluate(() => location.hash) === vorherHash,
  await page.evaluate(() => location.hash));
pruefe('Der Stern ist danach angeheftet',
  await page.evaluate(() => document.querySelector('.vz-card-wrap .vz-fav').getAttribute('aria-pressed') === 'true'));
pruefe('Es liegt genau eine Liegenschaft… pardon, ein Favorit im Speicher',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:favoriten') || '[]').length === 1),
  await page.evaluate(() => localStorage.getItem('nsvz:favoriten')));

const gemerkt = await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:favoriten'))[0]);

/* ---------- 3. Auf der Startseite steht der Favorit oben ------------------ */
await hin('#/');
const aufStart = await page.evaluate((id) => {
  const bloecke = [...document.querySelectorAll('.vz-block h2')].map(h => h.textContent);
  const favBlock = [...document.querySelectorAll('.vz-block')]
    .find(b => /Angeheftet|Pinned/.test(b.querySelector('h2')?.textContent || ''));
  const drin = favBlock ? [...favBlock.querySelectorAll('.vz-card [href], .vz-card')]
    .some(a => (a.getAttribute('href') || '').includes(id)) : false;
  return { hatBlock: Boolean(favBlock), drin, bloecke };
}, gemerkt);
pruefe('Die Startseite zeigt einen Block «Angeheftet»', aufStart.hatBlock, aufStart.bloecke.join(' · '));
pruefe('Der angeheftete Favorit steht darin', aufStart.drin, gemerkt);

/* ---------- 4. Übersteht das Neuladen ------------------------------------ */
await hin('#/');
pruefe('Nach dem Neuladen ist der Favorit noch angeheftet',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:favoriten') || '[]').length === 1));

/* ---------- 5. Wieder lösen ---------------------------------------------- */
await hin('#/b/unterhalt');
await page.click('.vz-card-wrap .vz-fav.is-on, .vz-card-wrap .vz-fav[aria-pressed="true"]');
await page.waitForTimeout(200);
pruefe('Nochmals klicken löst den Favorit',
  await page.evaluate(() => JSON.parse(localStorage.getItem('nsvz:favoriten') || '[]').length === 0));

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nFavoriten: anheften, oben zeigen, gespeichert bleiben läuft.');
