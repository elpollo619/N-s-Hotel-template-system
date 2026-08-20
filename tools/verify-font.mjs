/* ==========================================================================
   Prueft eine OTF/TTF-Datei auf Unversehrtheit: Signatur, Tabellenverzeichnis,
   Pruefsummen je Tabelle und die Gesamtpruefsumme im head-Eintrag.
   Aufruf:  node tools/verify-font.mjs assets/fonts/Gotham-Bold.otf
   ========================================================================== */
import fs from 'node:fs';

const file = process.argv[2];
if (!file){ console.error('Bitte eine Schriftdatei angeben.'); process.exit(2); }
const b = fs.readFileSync(file);

const u32 = o => b.readUInt32BE(o);
const tag = o => b.toString('latin1', o, o + 4);

function sum(start, len){
  let s = 0;
  const end = start + ((len + 3) & ~3);
  for (let i = start; i < end; i += 4){
    let v = 0;
    for (let j = 0; j < 4; j++) v = (v * 256) + (i + j < b.length ? b[i + j] : 0);
    s = (s + v) % 4294967296;
  }
  return s >>> 0;
}

const sig = u32(0);
const known = { 0x00010000:'TrueType', 0x4F54544F:'CFF (OpenType)', 0x74727565:'TrueType (true)' };
if (!known[sig]){ console.error('FEHLER: keine gueltige Schriftdatei, Signatur 0x' + sig.toString(16)); process.exit(1); }

const num = b.readUInt16BE(4);
console.log(file);
console.log('  Format: ' + known[sig] + ' | ' + num + ' Tabellen | ' + b.length + ' Bytes');

let bad = 0, headOff = -1;
for (let i = 0; i < num; i++){
  const o = 12 + i * 16;
  const t = tag(o), cks = u32(o + 4), off = u32(o + 8), len = u32(o + 12);
  if (off + len > b.length){ console.log('  FEHLER ' + t + ': reicht ueber das Dateiende hinaus'); bad++; continue; }
  let calc = sum(off, len);
  if (t === 'head'){ headOff = off; calc = (calc - u32(off + 8)) >>> 0; }
  if (calc !== cks){ console.log('  FEHLER ' + t + ': Pruefsumme ' + calc.toString(16) + ' statt ' + cks.toString(16)); bad++; }
}

if (headOff >= 0){
  const stored = u32(headOff + 8);
  const whole = (sum(0, b.length) - stored) >>> 0;
  const expect = (0xB1B0AFBA - whole) >>> 0;
  if (expect !== stored){ console.log('  FEHLER Gesamtpruefsumme: ' + stored.toString(16) + ' statt ' + expect.toString(16)); bad++; }
  else console.log('  OK Gesamtpruefsumme stimmt');
  console.log('  unitsPerEm: ' + b.readUInt16BE(headOff + 18));
}

for (let i = 0; i < num; i++){
  const o = 12 + i * 16;
  if (tag(o) !== 'name') continue;
  const off = u32(o + 8);
  const count = b.readUInt16BE(off + 2), strOff = off + b.readUInt16BE(off + 4);
  for (let r = 0; r < count; r++){
    const ro = off + 6 + r * 12;
    if (b.readUInt16BE(ro + 6) !== 1) continue;
    const len = b.readUInt16BE(ro + 8), so = strOff + b.readUInt16BE(ro + 10);
    console.log('  Familienname: ' + b.toString('latin1', so, so + len).replace(/\\0/g, ''));
    break;
  }
  break;
}

console.log(bad === 0 ? 'OK: Datei ist unversehrt.' : 'FEHLER: ' + bad + ' Probleme, Datei ist beschaedigt.');
process.exit(bad === 0 ? 0 : 1);
