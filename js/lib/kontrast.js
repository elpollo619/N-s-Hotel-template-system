/* ==========================================================================
   Kontrastprüfung
   --------------------------------------------------------------------------
   Ein Schild kann gross genug sein und trotzdem unlesbar, wenn Schrift und
   Grund zu nahe beieinander liegen — cyan auf weiss ist das klassische
   Beispiel. Geprüft wird nach der Kontrastformel der WCAG: das Verhältnis
   der relativen Helligkeiten, von 1:1 (gleich) bis 21:1 (schwarz auf weiss).

   Die Schwellen sind die der WCAG in Stufe AA:

     grosse Schrift (ab 18 pt bzw. 14 pt fett)   3.0 : 1
     alles andere                                4.5 : 1

   Für gedruckte Aushänge sind sie eher grosszügig als streng — Papier hat
   weniger Kontrast als ein Bildschirm, und im Treppenhaus ist es dunkler
   als im Büro. Wer knapp über der Schwelle liegt, sollte trotzdem dunkler
   setzen.

   Der Grund wird nach oben gesucht: das nächste Element, das nicht
   durchsichtig ist. Verläufe und Bilder kann die Prüfung nicht beurteilen —
   dort wird nichts gemeldet, statt etwas Falsches zu melden.

   Geprüft wird nur die Schrift, die das Blatt trägt — ab 14 pt. Das
   Kleingedruckte in Grau (Fusszeile, Sprachkürzel, Massangaben) ist als
   Nebeninformation gesetzt und liesse sich im Editor ohnehin nicht ändern;
   eine Warnung darüber wäre Rauschen und keine Hilfe.

   Ebenfalls aussen vor bleibt die Handschrift-Zeile (.eyebrow). Sie ist ein
   Zierelement der Marke in Cyan auf Weiss — rund 2,5:1, also unter der
   Schwelle. Das ist bekannt und beabsichtigt: die Zeile wiederholt, was
   direkt darunter gross und dunkel noch einmal steht. Wer sie ändern
   wollte, müsste die Markenfarbe ändern, und die steht nicht zur Debatte.
   Eine Dauerwarnung, die niemand abstellen kann, macht die Anzeige wertlos.
   ========================================================================== */

const K_MIN_GROSS = 3.0;
const K_AB_PT     = 14;   // kleinere Schrift wird nicht gemeldet
const K_MIN_NORM  = 4.5;

/** "rgb(42, 51, 80)" → [42,51,80]. Alles andere: null. */
function kFarbe(wert){
  const m = /^rgba?\(([^)]+)\)/.exec(String(wert || ''));
  if (!m) return null;
  const teile = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (teile.length < 3 || teile.some(isNaN)) return null;
  const alpha = teile.length > 3 ? teile[3] : 1;
  return { r:teile[0], g:teile[1], b:teile[2], a:alpha };
}

/** Relative Helligkeit nach WCAG. */
export function helligkeit(c){
  const f = v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}

/** Kontrastverhältnis zweier Farben, 1 … 21. */
export function verhaeltnis(a, b){
  const l1 = helligkeit(a), l2 = helligkeit(b);
  const hell = Math.max(l1, l2), dunkel = Math.min(l1, l2);
  return (hell + 0.05) / (dunkel + 0.05);
}

/** Zwei Farben übereinanderlegen (Vordergrund mit Alpha auf Grund). */
function mischen(vorn, hinten){
  const a = vorn.a;
  return { r: vorn.r * a + hinten.r * (1 - a),
           g: vorn.g * a + hinten.g * (1 - a),
           b: vorn.b * a + hinten.b * (1 - a), a:1 };
}

/**
 * Den tatsächlichen Grund eines Elements suchen: nach oben, bis etwas
 * nicht mehr durchsichtig ist. Gibt null zurück, wenn unterwegs ein Bild
 * oder ein Verlauf liegt — dann lässt sich nichts Verlässliches sagen.
 */
function grundFarbe(el){
  let n = el, gestapelt = [];
  while (n && n.nodeType === 1){
    const cs = getComputedStyle(n);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
    const c = kFarbe(cs.backgroundColor);
    if (c && c.a > 0){
      if (c.a >= 1){
        return gestapelt.reduce((unten, oben) => mischen(oben, unten), c);
      }
      gestapelt.push(c);
    }
    n = n.parentElement;
  }
  return gestapelt.length
    ? gestapelt.reduce((unten, oben) => mischen(oben, unten), { r:255, g:255, b:255, a:1 })
    : { r:255, g:255, b:255, a:1 };
}

/** Schwelle für eine Schriftgrösse (px) und ein Gewicht. */
export function schwelle(px, gewicht){
  const pt = px * 72 / 96;
  const fett = Number(gewicht) >= 700;
  return (pt >= 18 || (fett && pt >= 14)) ? K_MIN_GROSS : K_MIN_NORM;
}

/**
 * Das Blatt durchgehen und den schlechtesten Textkontrast melden.
 * @returns {{wert:number, noetig:number, ok:boolean, text:string, wo:string}|null}
 */
export function kontrastBefund(root, abPt = K_AB_PT){
  if (!root) return null;
  let schlimmster = null;

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
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const deck = Number(cs.opacity);
    if (deck === 0) continue;

    const px = parseFloat(cs.fontSize);
    if (!(px * 72 / 96 >= abPt)) continue;
    if (el.closest('.eyebrow')) continue;

    const vorn = kFarbe(cs.color);
    if (!vorn) continue;
    const hinten = grundFarbe(el);
    if (!hinten) continue;

    /* Deckkraft des Elements wirkt wie ein Alpha auf die Schriftfarbe. */
    const wirklich = mischen({ ...vorn, a:Math.min(1, vorn.a * (isNaN(deck) ? 1 : deck)) }, hinten);
    const wert = verhaeltnis(wirklich, hinten);
    const noetig = schwelle(px, cs.fontWeight);
    const abstand = wert - noetig;

    if (!schlimmster || abstand < schlimmster.abstand){
      schlimmster = { wert, noetig, abstand, text:n.nodeValue.trim().slice(0, 40) };
    }
  }

  if (!schlimmster) return null;
  return {
    wert: Math.round(schlimmster.wert * 10) / 10,
    noetig: schlimmster.noetig,
    ok: schlimmster.abstand >= 0,
    text: schlimmster.text
  };
}
