/* ==========================================================================
   Karten-Ausschnitte von swisstopo
   --------------------------------------------------------------------------
   Wer in map.geo.admin.ch den richtigen Ort eingestellt hat, kopiert einfach
   den Link aus der Adresszeile und setzt ihn in der Vorlage ein. Der
   Ausschnitt wird dann EINMAL im Editor geladen und als fertiges Bild in den
   Zustand gebacken — das Blatt bleibt offline, im Standalone stecken keine
   Live-Kacheln, und die Quellenangabe «© swisstopo» steht mit im Bild.

   Die Kacheln kommen von wmts.geo.admin.ch (offene Geodaten des Bundes,
   CORS erlaubt). Es gibt zwei Stile: das Luftbild und die farbige
   Landeskarte.
   ========================================================================== */

export const KARTEN_STILE = [
  { v:'luftbild', t:'Luftbild',    layer:'ch.swisstopo.swissimage' },
  { v:'karte',    t:'Landeskarte', layer:'ch.swisstopo.pixelkarte-farbe' }
];

export const KARTEN_ZOOM = [
  { v:'nah',    t:'Nah — Strassen und Häuser', z:17 },
  { v:'mittel', t:'Mittel — das Quartier',     z:16 },
  { v:'weit',   t:'Weit — das ganze Dorf',     z:15 }
];

/* ---------- LV95 → WGS84 ----------
   Die Näherungsformeln von swisstopo («Näherungslösungen für die direkte
   Transformation»), gut auf etwa einen Meter — mehr braucht ein Aushang
   nicht. E/N sind Landeskoordinaten wie im map.geo.admin.ch-Link. */
function lv95NachWgs84(e, n){
  const y = (e - 2600000) / 1000000;
  const x = (n - 1200000) / 1000000;
  const l = 2.6779094 + 4.728982 * y + 0.791484 * y * x + 0.1306 * y * x * x - 0.0436 * y * y * y;
  const p = 16.9023892 + 3.238272 * x - 0.270978 * y * y - 0.002528 * x * x - 0.0447 * y * y * x - 0.0140 * x * x * x;
  return { lat: p * 100 / 36, lon: l * 100 / 36 };
}

/**
 * Einen map.geo.admin.ch-Link (oder blanke E/N-Koordinaten) lesen.
 * Verstanden werden:
 *   …#/map?center=2604566.51,1197171.32&…   (aktueller Viewer)
 *   …?E=2604566&N=1197171&…                 (älterer Viewer)
 *   «2604566.51, 1197171.32»                (nur die Zahlen)
 * Gibt { lat, lon } zurück — oder null, wenn nichts Brauchbares drinsteht.
 */
export function kartenLink(text){
  const s = String(text || '');
  let m = s.match(/[?&#]center=([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)/);
  if (!m){
    const e = s.match(/[?&]E=([0-9]+(?:\.[0-9]+)?)/i);
    const n = s.match(/[?&]N=([0-9]+(?:\.[0-9]+)?)/);
    if (e && n) m = [null, e[1], n[1]];
  }
  if (!m) m = s.match(/\b(2[4-8][0-9]{5}(?:\.[0-9]+)?)\s*[,/ ]\s*(1[0-3][0-9]{5}(?:\.[0-9]+)?)\b/);
  if (!m) return null;
  const e = Number(m[1]), n = Number(m[2]);
  if (!(e >= 2450000 && e <= 2850000 && n >= 1050000 && n <= 1320000)) return null;
  return lv95NachWgs84(e, n);
}

/** Link auf map.geo.admin.ch — zentriert, wenn Koordinaten bekannt sind. */
export function kartenAdresse(latlon){
  if (!latlon) return 'https://map.geo.admin.ch/';
  /* WGS84 → LV95, grob (Umkehrung derselben Näherung reicht fürs Zentrieren
     nicht exakt — der Viewer versteht auch swisssearch mit Breite/Länge). */
  return 'https://map.geo.admin.ch/#/map?swisssearch=' + latlon.lat.toFixed(6) + ',' + latlon.lon.toFixed(6);
}

/* ---------- Web-Mercator-Rechnung (wie im Parkplatz-Kit) ---------- */
function wx(lon, ws){ return (lon + 180) / 360 * ws; }
function wy(lat, ws){
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * ws;
}

/**
 * Einen Ausschnitt laden und als Bild backen.
 * @param {{lat:number,lon:number}} mitte   Zentrum (WGS84)
 * @param {string} stil   'luftbild' | 'karte'
 * @param {string} zoom   'nah' | 'mittel' | 'weit'
 * @param {number} breite Bildbreite in px (Standard 1520)
 * @param {number} hoehe  Bildhöhe in px (Standard 768)
 * @returns {Promise<string>} JPEG-Data-URI mit «© swisstopo» im Bild
 */
export async function kartenAusschnitt(mitte, stil, zoom, breite, hoehe){
  const layer = (KARTEN_STILE.find(s => s.v === stil) || KARTEN_STILE[0]).layer;
  const z = (KARTEN_ZOOM.find(s => s.v === zoom) || KARTEN_ZOOM[1]).z;
  const W = breite || 1520, H = hoehe || 768;
  const ws = 256 * Math.pow(2, z);
  const ox = wx(mitte.lon, ws) - W / 2;
  const oy = wy(mitte.lat, ws) - H / 2;

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#E8EDE7'; ctx.fillRect(0, 0, W, H);

  const c0 = Math.floor(ox / 256), c1 = Math.floor((ox + W) / 256);
  const r0 = Math.floor(oy / 256), r1 = Math.floor((oy + H) / 256);
  const jobs = [];
  for (let c = c0; c <= c1; c++){
    for (let r = r0; r <= r1; r++){
      const url = 'https://wmts.geo.admin.ch/1.0.0/' + layer + '/default/current/3857/' + z + '/' + c + '/' + r + '.jpeg';
      jobs.push(
        fetch(url)
          .then(res => { if (!res.ok) throw new Error(String(res.status)); return res.blob(); })
          .then(blob => createImageBitmap(blob))
          .then(bild => ({ bild, x: c * 256 - ox, y: r * 256 - oy }))
          .catch(() => null) /* Kachel ausserhalb der Abdeckung: Fläche bleibt grün */
      );
    }
  }
  const kacheln = (await Promise.all(jobs)).filter(Boolean);
  if (!kacheln.length) throw new Error('Keine Kacheln geladen — Internet nötig, um den Ausschnitt zu holen.');
  for (const k of kacheln) ctx.drawImage(k.bild, k.x, k.y);

  /* Quellenangabe direkt ins Bild — so bleibt sie auch im PDF und PNG. */
  ctx.font = '600 20px Montserrat, sans-serif';
  const txt = '© swisstopo';
  const tb = ctx.measureText(txt).width;
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.beginPath();
  ctx.roundRect(W - tb - 26, H - 36, tb + 18, 28, 8);
  ctx.fill();
  ctx.fillStyle = '#3d4356';
  ctx.fillText(txt, W - tb - 17, H - 15);

  return canvas.toDataURL('image/jpeg', 0.9);
}
