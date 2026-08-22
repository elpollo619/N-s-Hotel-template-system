/* ==========================================================================
   QR-Code — eigener Erzeuger, ohne fremde Bibliothek
   --------------------------------------------------------------------------
   Warum selbst geschrieben? Die Vorlagen-Zentrale darf nichts nachladen:
   sie läuft auf GitHub Pages, aber auch als standalone.html per Doppelklick
   ohne Netz. Ein QR-Dienst im Internet fiele damit aus — und er bekäme
   nebenbei jedes WLAN-Passwort zu sehen, das jemand eintippt. Hier verlässt
   nichts den eigenen Rechner.

   Umfang: Byte-Modus (UTF-8), Versionen 1 bis 12, alle vier Fehlerkorrektur-
   stufen. Das reicht für Adressen, WLAN-Zugänge und Telefonnummern — bis
   rund 460 Zeichen. Wer mehr braucht, bekommt eine klare Fehlermeldung
   statt eines stillen Fehldrucks.

   Aufbau nach ISO/IEC 18004. Die Zahlentafeln stehen unten; jede einzelne
   Kombination aus Version und Stufe wird in tests/qr.mjs erzeugt und mit
   einem echten Lesegerät (OpenCV) wieder eingelesen — eine falsche Zahl in
   einer Tafel fällt damit auf, statt im Aushang zu landen.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Galois-Feld GF(256) — die Rechengrundlage der Reed-Solomon-Korrektur.
   -------------------------------------------------------------------------- */
const QR_EXP = new Uint8Array(512);
const QR_LOG = new Uint8Array(256);
(function qrFeldAufbauen(){
  let x = 1;
  for (let i = 0; i < 255; i++){
    QR_EXP[i] = x;
    QR_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11D;          // Generatorpolynom x^8+x^4+x^3+x^2+1
  }
  for (let i = 255; i < 512; i++) QR_EXP[i] = QR_EXP[i - 255];
})();

function qrMal(a, b){
  return (a === 0 || b === 0) ? 0 : QR_EXP[QR_LOG[a] + QR_LOG[b]];
}

/** Generatorpolynom für n Korrekturzeichen.
    Zurückgegeben mit dem führenden Koeffizienten (immer 1) an Position 0 —
    so wie die Divisionsschleife in qrKorrektur() es erwartet. */
function qrGenerator(n){
  let poly = [1];
  for (let i = 0; i < n; i++){
    const naechste = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++){
      naechste[j]     ^= qrMal(poly[j], QR_EXP[i]);
      naechste[j + 1] ^= poly[j];
    }
    poly = naechste;
  }
  return poly.reverse();
}

/** Korrekturzeichen zu einem Datenblock. */
function qrKorrektur(daten, anzahl){
  const gen = qrGenerator(anzahl);
  const rest = new Array(anzahl).fill(0);
  for (const wert of daten){
    const faktor = wert ^ rest[0];
    rest.shift();
    rest.push(0);
    if (faktor !== 0){
      for (let i = 0; i < anzahl; i++) rest[i] ^= qrMal(gen[i + 1], faktor);
    }
  }
  return rest;
}

/* --------------------------------------------------------------------------
   Zahlentafeln aus der Norm.
   Je Version und Stufe: [Korrekturzeichen je Block,
                          Blöcke Gruppe 1, Datenzeichen je Block Gruppe 1,
                          Blöcke Gruppe 2, Datenzeichen je Block Gruppe 2]
   -------------------------------------------------------------------------- */
const QR_STUFEN = { L:0, M:1, Q:2, H:3 };

const QR_BLOECKE = {
   1:{ L:[ 7,1, 19,0,  0], M:[10,1, 16,0,  0], Q:[13,1, 13,0,  0], H:[17,1,  9,0,  0] },
   2:{ L:[10,1, 34,0,  0], M:[16,1, 28,0,  0], Q:[22,1, 22,0,  0], H:[28,1, 16,0,  0] },
   3:{ L:[15,1, 55,0,  0], M:[26,1, 44,0,  0], Q:[18,2, 17,0,  0], H:[22,2, 13,0,  0] },
   4:{ L:[20,1, 80,0,  0], M:[18,2, 32,0,  0], Q:[26,2, 24,0,  0], H:[16,4,  9,0,  0] },
   5:{ L:[26,1,108,0,  0], M:[24,2, 43,0,  0], Q:[18,2, 15,2, 16], H:[22,2, 11,2, 12] },
   6:{ L:[18,2, 68,0,  0], M:[16,4, 27,0,  0], Q:[24,4, 19,0,  0], H:[28,4, 15,0,  0] },
   7:{ L:[20,2, 78,0,  0], M:[18,4, 31,0,  0], Q:[18,2, 14,4, 15], H:[26,4, 13,1, 14] },
   8:{ L:[24,2, 97,0,  0], M:[22,2, 38,2, 39], Q:[22,4, 18,2, 19], H:[26,4, 14,2, 15] },
   9:{ L:[30,2,116,0,  0], M:[22,3, 36,2, 37], Q:[20,4, 16,4, 17], H:[24,4, 12,4, 13] },
  10:{ L:[18,2, 68,2, 69], M:[26,4, 43,1, 44], Q:[24,6, 19,2, 20], H:[28,6, 15,2, 16] },
  11:{ L:[20,4, 81,0,  0], M:[30,1, 50,4, 51], Q:[28,4, 22,4, 23], H:[24,3, 12,8, 13] },
  12:{ L:[24,2, 92,2, 93], M:[22,6, 36,2, 37], Q:[26,4, 20,6, 21], H:[28,7, 14,4, 15] }
};

/** Mittelpunkte der Ausrichtungsmuster je Version. */
const QR_AUSRICHTUNG = {
   1:[], 2:[6,18], 3:[6,22], 4:[6,26], 5:[6,30], 6:[6,34],
   7:[6,22,38], 8:[6,24,42], 9:[6,26,46], 10:[6,28,50], 11:[6,30,54], 12:[6,32,58]
};

export const QR_MAX_VERSION = 12;

/** Datenzeichen, die in eine Version bei einer Stufe passen. */
function qrKapazitaet(version, stufe){
  const [, b1, d1, b2, d2] = QR_BLOECKE[version][stufe];
  return b1 * d1 + b2 * d2;
}

/* --------------------------------------------------------------------------
   Bitfolge aus dem Text
   -------------------------------------------------------------------------- */
function qrBits(bytes, version, stufe){
  const kapazitaet = qrKapazitaet(version, stufe);
  const laengenBits = version <= 9 ? 8 : 16;
  const bits = [];
  const schreibe = (wert, anzahl) => {
    for (let i = anzahl - 1; i >= 0; i--) bits.push((wert >> i) & 1);
  };

  schreibe(0b0100, 4);                    // Byte-Modus
  schreibe(bytes.length, laengenBits);
  for (const b of bytes) schreibe(b, 8);

  /* Abschluss: bis zu vier Nullen, dann auf volle Zeichen auffüllen. */
  const maxBits = kapazitaet * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const zeichen = [];
  for (let i = 0; i < bits.length; i += 8){
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    zeichen.push(byte);
  }
  /* Auffüllzeichen im Wechsel, wie die Norm es vorschreibt. */
  const fueller = [0xEC, 0x11];
  for (let i = 0; zeichen.length < kapazitaet; i++) zeichen.push(fueller[i % 2]);
  return zeichen;
}

/** Daten- und Korrekturzeichen verschränken. */
function qrVerschraenken(zeichen, version, stufe){
  const [ec, b1, d1, b2, d2] = QR_BLOECKE[version][stufe];
  const bloecke = [];
  let pos = 0;
  for (let i = 0; i < b1; i++){ bloecke.push(zeichen.slice(pos, pos + d1)); pos += d1; }
  for (let i = 0; i < b2; i++){ bloecke.push(zeichen.slice(pos, pos + d2)); pos += d2; }

  const korrektur = bloecke.map(b => qrKorrektur(b, ec));
  const aus = [];
  const maxDaten = Math.max(d1, d2);
  for (let i = 0; i < maxDaten; i++){
    for (const b of bloecke) if (i < b.length) aus.push(b[i]);
  }
  for (let i = 0; i < ec; i++){
    for (const k of korrektur) aus.push(k[i]);
  }
  return aus;
}

/* --------------------------------------------------------------------------
   Muster ins Raster setzen
   -------------------------------------------------------------------------- */
function qrLeeresRaster(groesse){
  return { feld: Array.from({ length:groesse }, () => new Array(groesse).fill(null)),
           belegt: Array.from({ length:groesse }, () => new Array(groesse).fill(false)),
           n: groesse };
}

function qrSetze(r, y, x, wert, funktion){
  if (y < 0 || x < 0 || y >= r.n || x >= r.n) return;
  r.feld[y][x] = wert ? 1 : 0;
  if (funktion) r.belegt[y][x] = true;
}

function qrSucher(r, y0, x0){
  for (let y = -1; y <= 7; y++){
    for (let x = -1; x <= 7; x++){
      const innen = y >= 0 && y <= 6 && x >= 0 && x <= 6;
      const rand  = y === 0 || y === 6 || x === 0 || x === 6;
      const kern  = y >= 2 && y <= 4 && x >= 2 && x <= 4;
      qrSetze(r, y0 + y, x0 + x, innen && (rand || kern), true);
    }
  }
}

function qrAusrichtung(r, version){
  const mitten = QR_AUSRICHTUNG[version];
  for (const my of mitten){
    for (const mx of mitten){
      /* Nicht über die Suchermuster legen. */
      const beiSucher = (my <= 8 && mx <= 8)
        || (my <= 8 && mx >= r.n - 9) || (my >= r.n - 9 && mx <= 8);
      if (beiSucher) continue;
      for (let y = -2; y <= 2; y++){
        for (let x = -2; x <= 2; x++){
          const an = Math.max(Math.abs(y), Math.abs(x)) !== 1;
          qrSetze(r, my + y, mx + x, an, true);
        }
      }
    }
  }
}

function qrTakt(r){
  for (let i = 8; i < r.n - 8; i++){
    const an = i % 2 === 0;
    qrSetze(r, 6, i, an, true);
    qrSetze(r, i, 6, an, true);
  }
}

/** Die 15 Bits der Formatangabe, BCH-gesichert. */
function qrFormatBits(stufe, maske){
  const stufenBits = { L:0b01, M:0b00, Q:0b11, H:0b10 }[stufe];
  let daten = (stufenBits << 3) | maske;
  let rest = daten << 10;
  for (let i = 14; i >= 10; i--){
    if ((rest >> i) & 1) rest ^= 0b10100110111 << (i - 10);
  }
  return ((daten << 10) | rest) ^ 0b101010000010010;
}

function qrFormatSetzen(r, stufe, maske){
  const bits = qrFormatBits(stufe, maske);
  const b = i => (bits >> i) & 1;

  /* Erste Kopie: senkrecht neben dem linken oberen Sucher, dann waagrecht
     darunter. Zeile und Spalte nicht vertauschen — genau daran scheitert
     sonst jedes Lesegerät, ohne dass das Muster falsch aussieht. */
  for (let i = 0; i <= 5; i++) qrSetze(r, i, 8, b(i), true);
  qrSetze(r, 7, 8, b(6), true);
  qrSetze(r, 8, 8, b(7), true);
  qrSetze(r, 8, 7, b(8), true);
  for (let i = 9; i <= 14; i++) qrSetze(r, 8, 14 - i, b(i), true);

  /* Zweite Kopie: waagrecht am rechten Rand, senkrecht unten links. */
  for (let i = 0; i <= 7; i++)  qrSetze(r, 8, r.n - 1 - i, b(i), true);
  for (let i = 8; i <= 14; i++) qrSetze(r, r.n - 15 + i, 8, b(i), true);
  qrSetze(r, r.n - 8, 8, 1, true);            // immer dunkles Feld
}

/** Ab Version 7 zusätzlich die Versionsangabe. */
function qrVersionSetzen(r, version){
  if (version < 7) return;
  let rest = version << 12;
  for (let i = 17; i >= 12; i--){
    if ((rest >> i) & 1) rest ^= 0b1111100100101 << (i - 12);
  }
  const bits = (version << 12) | rest;
  for (let i = 0; i < 18; i++){
    const an = (bits >> i) & 1;
    const y = Math.floor(i / 3), x = i % 3;
    qrSetze(r, y, r.n - 11 + x, an, true);
    qrSetze(r, r.n - 11 + x, y, an, true);
  }
}

const QR_MASKEN = [
  (y, x) => (y + x) % 2 === 0,
  (y, x) => y % 2 === 0,
  (y, x) => x % 3 === 0,
  (y, x) => (y + x) % 3 === 0,
  (y, x) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  (y, x) => ((y * x) % 2) + ((y * x) % 3) === 0,
  (y, x) => (((y * x) % 2) + ((y * x) % 3)) % 2 === 0,
  (y, x) => (((y + x) % 2) + ((y * x) % 3)) % 2 === 0
];

/** Datenbits im Zickzack von rechts unten nach links oben einsetzen. */
function qrDatenSetzen(r, zeichen, maske){
  const maskeFn = QR_MASKEN[maske];
  let bitIndex = 0;
  const naechstesBit = () => {
    if (bitIndex >= zeichen.length * 8) return 0;
    const bit = (zeichen[bitIndex >> 3] >> (7 - (bitIndex & 7))) & 1;
    bitIndex++;
    return bit;
  };

  let aufwaerts = true;
  for (let rechts = r.n - 1; rechts >= 1; rechts -= 2){
    if (rechts === 6) rechts = 5;             // die Taktspalte überspringen
    for (let schritt = 0; schritt < r.n; schritt++){
      const y = aufwaerts ? r.n - 1 - schritt : schritt;
      for (const x of [rechts, rechts - 1]){
        if (r.belegt[y][x]) continue;
        const bit = naechstesBit();
        r.feld[y][x] = maskeFn(y, x) ? bit ^ 1 : bit;
      }
    }
    aufwaerts = !aufwaerts;
  }
}

/* --------------------------------------------------------------------------
   Maskenbewertung — die Norm nennt vier Strafregeln.
   -------------------------------------------------------------------------- */
function qrStrafe(r){
  const n = r.n, f = r.feld;
  let strafe = 0;

  /* 1. Reihen aus fünf und mehr gleichen Feldern. */
  const reihe = (holen) => {
    for (let a = 0; a < n; a++){
      let lauf = 1;
      for (let b = 1; b < n; b++){
        if (holen(a, b) === holen(a, b - 1)) lauf++;
        else { if (lauf >= 5) strafe += 3 + (lauf - 5); lauf = 1; }
      }
      if (lauf >= 5) strafe += 3 + (lauf - 5);
    }
  };
  reihe((a, b) => f[a][b]);
  reihe((a, b) => f[b][a]);

  /* 2. Gleichfarbige Zweierblöcke. */
  for (let y = 0; y < n - 1; y++){
    for (let x = 0; x < n - 1; x++){
      const v = f[y][x];
      if (v === f[y][x + 1] && v === f[y + 1][x] && v === f[y + 1][x + 1]) strafe += 3;
    }
  }

  /* 3. Sucher-ähnliche Folgen. */
  const muster1 = [1,0,1,1,1,0,1,0,0,0,0];
  const muster2 = [0,0,0,0,1,0,1,1,1,0,1];
  const passt = (holen, a, b, muster) => {
    for (let i = 0; i < 11; i++) if (holen(a, b + i) !== muster[i]) return false;
    return true;
  };
  for (let a = 0; a < n; a++){
    for (let b = 0; b <= n - 11; b++){
      if (passt((p, q) => f[p][q], a, b, muster1)) strafe += 40;
      if (passt((p, q) => f[p][q], a, b, muster2)) strafe += 40;
      if (passt((p, q) => f[q][p], a, b, muster1)) strafe += 40;
      if (passt((p, q) => f[q][p], a, b, muster2)) strafe += 40;
    }
  }

  /* 4. Abweichung von der Hälfte dunkler Felder. */
  let dunkel = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (f[y][x]) dunkel++;
  const anteil = (dunkel * 100) / (n * n);
  strafe += Math.floor(Math.abs(anteil - 50) / 5) * 10;

  return strafe;
}

/* --------------------------------------------------------------------------
   Öffentlich
   -------------------------------------------------------------------------- */

/**
 * QR-Code als Matrix aus 0 und 1 erzeugen.
 * @param {string} text     der Inhalt (wird als UTF-8 kodiert)
 * @param {string} stufe    'L' | 'M' | 'Q' | 'H' — Fehlerkorrektur
 * @returns {{feld:number[][], n:number, version:number, stufe:string}}
 */
export function qrMatrix(text, stufe = 'M'){
  if (!(stufe in QR_STUFEN)) throw new Error(`Unbekannte Fehlerkorrekturstufe: ${stufe}`);
  const bytes = Array.from(new TextEncoder().encode(String(text ?? '')));
  if (!bytes.length) throw new Error('Der QR-Code braucht einen Inhalt.');

  let version = 0;
  for (let v = 1; v <= QR_MAX_VERSION; v++){
    const laengenBits = v <= 9 ? 8 : 16;
    const noetig = Math.ceil((4 + laengenBits + bytes.length * 8) / 8);
    if (noetig <= qrKapazitaet(v, stufe)){ version = v; break; }
  }
  if (!version){
    throw new Error(`Der Text ist zu lang für einen QR-Code dieser Stufe `
      + `(${bytes.length} Zeichen, möglich sind rund ${qrKapazitaet(QR_MAX_VERSION, stufe)}). `
      + `Kürzer fassen oder eine niedrigere Fehlerkorrektur wählen.`);
  }

  const zeichen = qrVerschraenken(qrBits(bytes, version, stufe), version, stufe);
  const groesse = version * 4 + 17;

  /* Alle acht Masken durchrechnen und die ruhigste behalten. */
  let beste = null;
  for (let maske = 0; maske < 8; maske++){
    const r = qrLeeresRaster(groesse);
    qrSucher(r, 0, 0);
    qrSucher(r, 0, groesse - 7);
    qrSucher(r, groesse - 7, 0);
    qrAusrichtung(r, version);
    qrTakt(r);
    qrFormatSetzen(r, stufe, maske);
    qrVersionSetzen(r, version);
    qrDatenSetzen(r, zeichen, maske);
    const strafe = qrStrafe(r);
    if (!beste || strafe < beste.strafe) beste = { r, strafe };
  }

  return { feld:beste.r.feld, n:groesse, version, stufe };
}

/**
 * QR-Code als SVG-Zeichenkette.
 * @param {string} text
 * @param {object} opt  {stufe, groesse (CSS-Mass), farbe, rand (Module)}
 */
export function qrSvg(text, opt = {}){
  const { stufe = 'M', groesse = '30mm', farbe = '#1A1A1A', rand = 4 } = opt;
  const m = qrMatrix(text, stufe);
  const kante = m.n + rand * 2;

  /* Zusammenhängende dunkle Felder je Zeile zu einem Rechteck verbinden —
     das spart im Ausdruck und in standalone.html eine Menge Zeichen. */
  let pfad = '';
  for (let y = 0; y < m.n; y++){
    let x = 0;
    while (x < m.n){
      if (!m.feld[y][x]){ x++; continue; }
      let breite = 1;
      while (x + breite < m.n && m.feld[y][x + breite]) breite++;
      pfad += `M${x + rand} ${y + rand}h${breite}v1h-${breite}z`;
      x += breite;
    }
  }

  return `<svg class="qr" viewBox="0 0 ${kante} ${kante}" width="${groesse}" height="${groesse}"
    xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">`
    + `<rect width="${kante}" height="${kante}" fill="#fff"/>`
    + `<path d="${pfad}" fill="${farbe}"/></svg>`;
}

/* --------------------------------------------------------------------------
   Fertige Inhalte
   -------------------------------------------------------------------------- */

/** Sonderzeichen im WLAN-Format maskieren: \ ; , : " */
function qrWlanEscape(s){
  return String(s ?? '').replace(/([\;,:"])/g, '\\$1');
}

/**
 * WLAN-Zugang. Handys verbinden sich damit ohne Abtippen.
 * @param {string} netz    SSID
 * @param {string} pass    Passwort ('' bei offenem Netz)
 * @param {string} art     'WPA' | 'WEP' | 'nopass'
 * @param {boolean} versteckt
 */
export function qrWlan(netz, pass, art = 'WPA', versteckt = false){
  const typ = pass ? art : 'nopass';
  return `WIFI:T:${typ};S:${qrWlanEscape(netz)};`
    + (pass ? `P:${qrWlanEscape(pass)};` : '')
    + (versteckt ? 'H:true;' : '') + ';';
}

/** Telefonnummer zum Antippen. */
export function qrTelefon(nummer){
  return 'tel:' + String(nummer ?? '').replace(/[^\d+]/g, '');
}

/** E-Mail-Adresse. */
export function qrMail(adresse, betreff){
  const a = 'mailto:' + String(adresse ?? '').trim();
  return betreff ? a + '?subject=' + encodeURIComponent(betreff) : a;
}

/** Adresse in der Karten-App. */
export function qrOrt(adresse){
  return 'geo:0,0?q=' + encodeURIComponent(String(adresse ?? '').trim());
}
