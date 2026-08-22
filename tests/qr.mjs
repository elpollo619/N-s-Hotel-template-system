/* Prüft den eigenen QR-Erzeuger — ohne Fremdbibliothek, in reinem Node.
   Aufruf:  node tests/qr.mjs [http://127.0.0.1:8099]

   Der Kern ist ein LESER, der hier eigenständig geschrieben ist: er nimmt
   die fertige Matrix, holt die Formatangabe heraus, nimmt die Maske weg,
   liest die Module im Zickzack und setzt die Nutzdaten wieder zusammen.
   Kommt der Ausgangstext heraus, hat der Erzeuger die ganze Kette richtig
   gemacht — Kodierung, Verschränkung, Platzierung, Maske und Format.

   Zusätzlich prüft tools/pruefe-qr.py denselben Code gegen ein echtes
   Lesegerät (OpenCV). Das braucht Python und läuft deshalb nicht in
   `npm test`, sondern von Hand. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const fehler = [];
function pruefe(name, ok, dazu){
  console.log(`${ok ? '✓' : '✗'} ${name}${dazu ? '  — ' + dazu : ''}`);
  if (!ok) fehler.push(name + (dazu ? ': ' + dazu : ''));
}

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', err => fehler.push('JS-FEHLER: ' + err.message));
await page.goto(BASE + '/index.html', { waitUntil:'networkidle' });

/* ---------- Der Leser, im Browser neben dem Erzeuger ------------------- */
const LESER = `
const MASKEN = [
  (y,x)=>(y+x)%2===0, (y,x)=>y%2===0, (y,x)=>x%3===0, (y,x)=>(y+x)%3===0,
  (y,x)=>(Math.floor(y/2)+Math.floor(x/3))%2===0,
  (y,x)=>((y*x)%2)+((y*x)%3)===0,
  (y,x)=>(((y*x)%2)+((y*x)%3))%2===0,
  (y,x)=>(((y+x)%2)+((y*x)%3))%2===0
];
const AUSRICHTUNG = { 1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],
  7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50],11:[6,30,54],12:[6,32,58] };
const BLOECKE = {
  1:{L:[7,1,19,0,0],M:[10,1,16,0,0],Q:[13,1,13,0,0],H:[17,1,9,0,0]},
  2:{L:[10,1,34,0,0],M:[16,1,28,0,0],Q:[22,1,22,0,0],H:[28,1,16,0,0]},
  3:{L:[15,1,55,0,0],M:[26,1,44,0,0],Q:[18,2,17,0,0],H:[22,2,13,0,0]},
  4:{L:[20,1,80,0,0],M:[18,2,32,0,0],Q:[26,2,24,0,0],H:[16,4,9,0,0]},
  5:{L:[26,1,108,0,0],M:[24,2,43,0,0],Q:[18,2,15,2,16],H:[22,2,11,2,12]},
  6:{L:[18,2,68,0,0],M:[16,4,27,0,0],Q:[24,4,19,0,0],H:[28,4,15,0,0]},
  7:{L:[20,2,78,0,0],M:[18,4,31,0,0],Q:[18,2,14,4,15],H:[26,4,13,1,14]},
  8:{L:[24,2,97,0,0],M:[22,2,38,2,39],Q:[22,4,18,2,19],H:[26,4,14,2,15]},
  9:{L:[30,2,116,0,0],M:[22,3,36,2,37],Q:[20,4,16,4,17],H:[24,4,12,4,13]},
  10:{L:[18,2,68,2,69],M:[26,4,43,1,44],Q:[24,6,19,2,20],H:[28,6,15,2,16]},
  11:{L:[20,4,81,0,0],M:[30,1,50,4,51],Q:[28,4,22,4,23],H:[24,3,12,8,13]},
  12:{L:[24,2,92,2,93],M:[22,6,36,2,37],Q:[26,4,20,6,21],H:[28,7,14,4,15]}
};

/* Welche Module gehören zu den festen Mustern und tragen keine Daten? */
function funktionsKarte(n, version){
  const k = Array.from({length:n}, () => new Array(n).fill(false));
  const block = (y0,x0,h,w) => { for (let y=y0;y<y0+h;y++) for (let x=x0;x<x0+w;x++)
    if (y>=0&&x>=0&&y<n&&x<n) k[y][x] = true; };
  block(0,0,9,9); block(0,n-8,9,8); block(n-8,0,8,9);
  for (let i=0;i<n;i++){ k[6][i] = true; k[i][6] = true; }
  const mitten = AUSRICHTUNG[version] || [];
  for (const my of mitten) for (const mx of mitten){
    if ((my<=8&&mx<=8)||(my<=8&&mx>=n-9)||(my>=n-9&&mx<=8)) continue;
    block(my-2, mx-2, 5, 5);
  }
  if (version >= 7){ block(0,n-11,6,3); block(n-11,0,3,6); }
  return k;
}

/* Formatangabe der ersten Kopie lesen und prüfen. */
function formatLesen(f, n){
  const bit = [];
  for (let i=0;i<=5;i++) bit[i] = f[i][8];
  bit[6] = f[7][8]; bit[7] = f[8][8]; bit[8] = f[8][7];
  for (let i=9;i<=14;i++) bit[i] = f[8][14-i];
  let wert = 0;
  for (let i=0;i<15;i++) wert |= bit[i] << i;
  const roh = wert ^ 0b101010000010010;
  let rest = roh;
  for (let i=14;i>=10;i--) if ((rest>>i)&1) rest ^= 0b10100110111 << (i-10);
  const daten = roh >> 10;
  return { stufe:{1:'L',0:'M',3:'Q',2:'H'}[daten>>3], maske:daten & 7, bchOk:rest === 0 };
}

/* Die Matrix zurück in den Ausgangstext verwandeln. */
function lies(m){
  const { feld:f, n } = m;
  const version = (n - 17) / 4;
  const fmt = formatLesen(f, n);
  const karte = funktionsKarte(n, version);
  const maske = MASKEN[fmt.maske];

  const bits = [];
  let auf = true;
  for (let rechts = n-1; rechts >= 1; rechts -= 2){
    if (rechts === 6) rechts = 5;
    for (let s = 0; s < n; s++){
      const y = auf ? n-1-s : s;
      for (const x of [rechts, rechts-1]){
        if (karte[y][x]) continue;
        bits.push(maske(y,x) ? f[y][x] ^ 1 : f[y][x]);
      }
    }
    auf = !auf;
  }
  const strom = [];
  for (let i = 0; i + 8 <= bits.length; i += 8){
    let b = 0; for (let j=0;j<8;j++) b = (b<<1) | bits[i+j];
    strom.push(b);
  }

  /* Verschränkung rückgängig machen — nur die Datenzeichen zählen. */
  const [ec, b1, d1, b2, d2] = BLOECKE[version][fmt.stufe];
  const groessen = [];
  for (let i=0;i<b1;i++) groessen.push(d1);
  for (let i=0;i<b2;i++) groessen.push(d2);
  const bloecke = groessen.map(g => new Array(g));
  let p = 0;
  for (let i = 0; i < Math.max(d1, d2); i++){
    for (let b = 0; b < bloecke.length; b++){
      if (i < groessen[b]) bloecke[b][i] = strom[p++];
    }
  }
  const daten = [].concat(...bloecke);

  /* Kopfzeile auswerten: Byte-Modus, Länge, dann die Nutzbytes. */
  let bi = 0;
  const nimm = anzahl => {
    let v = 0;
    for (let i=0;i<anzahl;i++){
      v = (v<<1) | ((daten[bi>>3] >> (7-(bi&7))) & 1);
      bi++;
    }
    return v;
  };
  const modus = nimm(4);
  const laenge = nimm(version <= 9 ? 8 : 16);
  const bytes = [];
  for (let i=0;i<laenge;i++) bytes.push(nimm(8));
  return { modus, laenge, text:new TextDecoder().decode(new Uint8Array(bytes)),
           stufe:fmt.stufe, maske:fmt.maske, bchOk:fmt.bchOk, version };
}
`;

const ergebnis = await page.evaluate(async leserQuelle => {
  const qr = await import('./js/lib/qr.js');
  const lies = new Function('m', leserQuelle + '; return lies(m);');

  const texte = [
    'a',
    'HALLO',
    'https://elpollo619.github.io/N-s-Hotel-template-system/',
    qr.qrWlan('Gast', 'Sonne2026!', 'WPA'),
    qr.qrWlan("N's Hotel Gast", 'ab;cd,ef:gh"ij', 'WPA'),
    qr.qrTelefon('+41 31 951 85 54'),
    qr.qrMail('info@ns-hotel.ch', 'Anfrage'),
    qr.qrOrt('Allmendstrasse 14, 3210 Kerzers'),
    'Grüezi — Umlaute und Akzente: éàüöä ç ñ',
    /* 140 Zeichen — passt auch in der strengsten Stufe noch in Version 12. */
    'x'.repeat(140)
  ];

  const rund = [];
  for (const t of texte){
    for (const stufe of ['L', 'M', 'Q', 'H']){
      let m;
      try { m = qr.qrMatrix(t, stufe); }
      catch (err){ rund.push({ t, stufe, fehler:err.message }); continue; }
      const g = lies(m);
      rund.push({ t, stufe, version:m.version, n:m.n, gelesen:g.text,
                  modus:g.modus, stufeGelesen:g.stufe, bchOk:g.bchOk,
                  ok:g.text === t && g.stufe === stufe && g.modus === 4 && g.bchOk });
    }
  }

  /* Alle Versionen und Stufen randvoll füllen. */
  const grenzen = [];
  for (let v = 1; v <= qr.QR_MAX_VERSION; v++){
    for (const stufe of ['L','M','Q','H']){
      let laenge = 0;
      for (let l = 1; l <= 700; l++){
        try { if (qr.qrMatrix('a'.repeat(l), stufe).version <= v) laenge = l; else break; }
        catch (_){ break; }
      }
      if (!laenge) continue;
      const text = ('V' + v + stufe + '-').padEnd(laenge, 'x').slice(0, laenge);
      const m = qr.qrMatrix(text, stufe);
      const g = lies(m);
      grenzen.push({ v, stufe, laenge, version:m.version, ok:g.text === text && m.version === v });
    }
  }

  /* Bauteile der Matrix. */
  const m = qr.qrMatrix('Prüfung', 'M');
  const f = m.feld, n = m.n;
  const sucher = (y0, x0) =>
    f[y0][x0] === 1 && f[y0+1][x0+1] === 0 && f[y0+3][x0+3] === 1 && f[y0+6][x0+6] === 1;
  const takt = [];
  for (let i = 8; i < n - 8; i++) takt.push(f[6][i] === (i % 2 === 0 ? 1 : 0));

  let zuLang = null;
  try { qr.qrMatrix('x'.repeat(900), 'H'); } catch (err){ zuLang = err.message; }
  let leer = null;
  try { qr.qrMatrix('', 'M'); } catch (err){ leer = err.message; }
  let falscheStufe = null;
  try { qr.qrMatrix('x', 'Z'); } catch (err){ falscheStufe = err.message; }

  const svg = qr.qrSvg('https://ns-hotel.ch', { stufe:'Q', groesse:'30mm' });

  return { rund, grenzen,
    sucher:[sucher(0,0), sucher(0,n-7), sucher(n-7,0)],
    taktOk:takt.every(Boolean),
    dunkelOk:f[n-8][8] === 1,
    zuLang, leer, falscheStufe,
    svgOk: svg.startsWith('<svg') && /<path d="M/.test(svg) && svg.includes('width="30mm"'),
    wlan: qr.qrWlan('Gast', 'ab;cd', 'WPA'),
    wlanOffen: qr.qrWlan('Gast', '', 'WPA'),
    telefon: qr.qrTelefon('+41 31 951 85 54')
  };
}, LESER);

/* ---------- Auswertung --------------------------------------------------- */
const schlecht = ergebnis.rund.filter(r => !r.ok);
pruefe(`${ergebnis.rund.length} Hin- und Rückwege (10 Texte x 4 Stufen)`,
  schlecht.length === 0,
  schlecht.length ? schlecht.slice(0, 3).map(r => `${r.stufe}: ${r.fehler || r.gelesen}`).join(' · ')
                  : 'jeder Text kommt unverändert zurück');

const grenzSchlecht = ergebnis.grenzen.filter(g => !g.ok);
pruefe(`${ergebnis.grenzen.length} randvolle Symbole (Version 1–12, alle vier Stufen)`,
  grenzSchlecht.length === 0,
  grenzSchlecht.length ? grenzSchlecht.slice(0, 3).map(g => `v${g.v}${g.stufe}`).join(' · ')
                       : 'jede Blocktafel stimmt');

pruefe('Drei Suchermuster an den Ecken', ergebnis.sucher.every(Boolean));
pruefe('Taktspur wechselt sauber', ergebnis.taktOk);
pruefe('Das immer dunkle Feld sitzt richtig', ergebnis.dunkelOk);
pruefe('Formatangabe hält der BCH-Prüfung stand',
  ergebnis.rund.every(r => r.fehler || r.bchOk));

pruefe('Zu langer Text wird abgelehnt', Boolean(ergebnis.zuLang),
  (ergebnis.zuLang || '').slice(0, 54));
pruefe('Leerer Inhalt wird abgelehnt', Boolean(ergebnis.leer));
pruefe('Unbekannte Stufe wird abgelehnt', Boolean(ergebnis.falscheStufe));

pruefe('SVG hat Kopf, Pfad und Kantenlänge', ergebnis.svgOk);
pruefe('WLAN-Zeichenkette maskiert Sonderzeichen',
  ergebnis.wlan === String.raw`WIFI:T:WPA;S:Gast;P:ab\;cd;;`, ergebnis.wlan);
pruefe('Offenes Netz ohne Passwort',
  ergebnis.wlanOffen === 'WIFI:T:nopass;S:Gast;;', ergebnis.wlanOffen);
pruefe('Telefonnummer wird auf Ziffern gekürzt',
  ergebnis.telefon === 'tel:+41319518554', ergebnis.telefon);

/* ---------- Im Aushang ---------------------------------------------------- */
async function plakat(teil){
  await page.evaluate(async t => {
    const m = await import('./js/templates/qrplakat.js');
    localStorage.setItem('nsvz:draft:qrplakat',
      JSON.stringify(Object.assign({}, structuredClone(m.default.defaults), t)));
  }, teil);
  if (page.url().includes('#/t/qrplakat')) await page.reload({ waitUntil:'networkidle' });
  else await page.goto(`${BASE}/index.html#/t/qrplakat`, { waitUntil:'networkidle' });
  await page.waitForSelector('#vz-sheet');
  await page.waitForTimeout(150);
  return page.evaluate(() => {
    const svg = document.querySelector('.t-qrp-code svg');
    return { hatCode:Boolean(svg),
             module:svg ? Number(svg.getAttribute('viewBox').split(' ')[2]) : 0,
             klartext:document.querySelector('.t-qrp-klar')?.textContent.trim() || '',
             warnung:document.querySelector('.t-qrp-todo')?.textContent.trim() || '' };
  });
}

const wlanPlakat = await plakat({ art:'wlan', wlanNetz:'Gast', wlanPass:'Sonne2026!' });
pruefe('WLAN-Aushang zeigt einen Code', wlanPlakat.hatCode && wlanPlakat.module > 20,
  `${wlanPlakat.module} Module`);
pruefe('Das Passwort steht nicht in der Klartextzeile',
  !wlanPlakat.klartext.includes('Sonne2026'), wlanPlakat.klartext);

const linkPlakat = await plakat({ art:'adresse', url:'ns-hotel.ch/mappe' });
pruefe('Adresse ohne https wird ergänzt', linkPlakat.hatCode);
pruefe('Die Zeile zum Abtippen erscheint',
  linkPlakat.klartext === 'ns-hotel.ch/mappe', linkPlakat.klartext);

const leerPlakat = await plakat({ art:'wlan', wlanNetz:'', wlanPass:'' });
pruefe('Ohne Angabe bleibt der Code weg und der Editor sagt es',
  !leerPlakat.hatCode && leerPlakat.warnung.length > 0, leerPlakat.warnung);

/* Die Kurzanleitung erzeugt ihren Code jetzt aus dem Adressfeld. */
await page.goto(`${BASE}/index.html#/t/kurzanleitung`, { waitUntil:'networkidle' });
await page.waitForSelector('#vz-sheet');
await page.waitForTimeout(150);
const kurz = await page.evaluate(() => Boolean(document.querySelector('.t-kurz-qr svg')));
pruefe('Die Kurzanleitung trägt ihren QR-Code', kurz);

await browser.close();
if (fehler.length){ console.error('\nFehler:\n · ' + fehler.join('\n · ')); process.exit(1); }
console.log('\nQR-Erzeuger: alles sauber.');
