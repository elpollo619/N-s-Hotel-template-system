/* ==========================================================================
   Lesbarkeit auf Distanz
   --------------------------------------------------------------------------
   Ein Schild nützt nichts, wenn man erst davorstehen muss, um es zu lesen.
   Die Faustregel aus der Beschilderungspraxis rechnet mit der x-Höhe —
   der Höhe des kleinen "x", nicht der Schriftgrösse:

       nötige x-Höhe in mm  =  Leseabstand in m  ×  2.5

   Umgekehrt gelesen ergibt die grösste Schrift auf dem Blatt den Abstand,
   aus dem sie noch sicher lesbar ist. Genau das zeigt der Editor an, damit
   niemand ein Parkschild in 12 pt ausdruckt.

   Die x-Höhe wird aus der Schriftgrösse geschätzt (Faktor 0.52 — der Wert
   passt für Gotham und die hinterlegten Ersatzschriften). Es ist eine
   Orientierung, keine Messung: schlechtes Licht, Blickwinkel und schwacher
   Kontrast verkürzen den Abstand zusätzlich.
   ========================================================================== */

const MM_PRO_PX = 25.4 / 96;      // CSS-Pixel sind 1/96 Zoll
const X_ANTEIL  = 0.52;           // x-Höhe im Verhältnis zur Schriftgrösse
const MM_PRO_M  = 2.5;            // Faustregel

/** Grösste tatsächlich sichtbare Schriftgrösse (px) in einem Element. */
export function groessteSchrift(root){
  if (!root) return 0;
  let max = 0;
  const lauf = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n){
      return n.nodeValue && n.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  for (let n = lauf.nextNode(); n; n = lauf.nextNode()){
    const el = n.parentElement;
    if (!el) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const px = parseFloat(cs.fontSize);
    if (px > max) max = px;
  }
  return max;
}

/** Leseabstand in Metern für eine Schriftgrösse in px. */
export function abstandM(fontPx){
  const xMm = fontPx * MM_PRO_PX * X_ANTEIL;
  return xMm / MM_PRO_M;
}

/** Auf handliche Stufen runden: 0.5 / 1 / 1.5 … bzw. ganze Meter ab 5 m. */
export function rundeAbstand(m){
  if (m >= 5) return Math.round(m);
  return Math.round(m * 2) / 2;
}

/**
 * Fertiger Befund für die Anzeige.
 * @returns {{px:number, m:number, text:string, stufe:'ok'|'nah'|'leer'}}
 */
export function lesbarkeit(root){
  const px = groessteSchrift(root);
  if (!px) return { px:0, m:0, text:'Noch kein Text auf dem Blatt', stufe:'leer' };
  const m = rundeAbstand(abstandM(px));
  const zahl = m < 1 ? m.toFixed(1).replace('.', ',') : String(m).replace('.', ',');
  return {
    px, m,
    text: `Grösste Schrift aus ca. ${zahl} m lesbar`,
    /* Unter zwei Metern ist es kein Schild mehr, sondern ein Merkblatt. */
    stufe: m >= 2 ? 'ok' : 'nah'
  };
}
