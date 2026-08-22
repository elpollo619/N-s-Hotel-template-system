/* ==========================================================================
   Welche Schrift ist gerade aktiv?
   --------------------------------------------------------------------------
   Die Marke schreibt Gotham (Titel) und Caflisch Script Pro (Handschrift-
   Zeile) vor. Beide sind lizenzpflichtig und dürfen nicht im öffentlichen
   Repository liegen — die App liefert deshalb Montserrat und Parisienne als
   Ersatz mit.

   Das Problem daran: man sieht es nicht. Ein Aushang in Montserrat sieht
   ordentlich aus, ist aber nicht die Marke. Wer ihn druckt und aufhängt,
   merkt es womöglich nie. Darum sagt die Zentrale von sich aus, womit sie
   gerade setzt.

   Geprüft wird durch Messen, nicht mit document.fonts.check(): das meldet
   für eine unbekannte Familie in den meisten Browsern `true`, weil ohnehin
   auf den nächsten Eintrag zurückgefallen wird. Verlässlich ist nur der
   Vergleich — derselbe Text einmal mit «Gotham, monospace» und einmal mit
   «monospace» ausmessen. Sind die Breiten gleich, gibt es kein Gotham.
   ========================================================================== */

export const MARKEN_SCHRIFTEN = [
  { id:'display', familie:'Gotham',
    ersatz:'Montserrat', wofuer:'Titel und Auszeichnungen' },
  { id:'script',  familie:'Caflisch Script Pro',
    ersatz:'Parisienne', wofuer:'die Handschrift-Zeile' }
];

/* Ein Text mit vielen unterschiedlich breiten Zeichen — je grösser der
   Unterschied zwischen zwei Schriften, desto sicherer die Messung. */
const PROBE_TEXT = 'MWmwiIl1080@ÄÖÜ Handschrift';

let messwerkzeug = null;
function messe(familie){
  if (!messwerkzeug){
    const c = document.createElement('canvas');
    messwerkzeug = c.getContext && c.getContext('2d');
  }
  if (!messwerkzeug) return null;
  messwerkzeug.font = `72px ${familie}`;
  return messwerkzeug.measureText(PROBE_TEXT).width;
}

/**
 * Ist eine Schriftfamilie tatsächlich verfügbar?
 * Gemessen gegen drei Grundschriften: stimmt die Breite mit allen dreien
 * überein, wurde zurückgefallen — die Familie gibt es also nicht.
 */
export function schriftDa(familie){
  const grund = ['monospace', 'serif', 'sans-serif'];
  for (const g of grund){
    const mitFamilie = messe(`"${familie}", ${g}`);
    const nurGrund   = messe(g);
    if (mitFamilie == null || nurGrund == null) return false;
    if (Math.abs(mitFamilie - nurGrund) > 0.5) return true;
  }
  return false;
}

/**
 * Steht die echte Markenschrift zur Verfügung?
 * @returns {{alle:boolean, fehlend:Array, vorhanden:Array}}
 */
export function schriftBefund(){
  const da = [];
  const weg = [];
  for (const s of MARKEN_SCHRIFTEN){
    (schriftDa(s.familie) ? da : weg).push(s);
  }
  return { alle:weg.length === 0, fehlend:weg, vorhanden:da };
}

/** Ein Satz für die Oberfläche — oder '' wenn alles stimmt. */
export function schriftHinweis(){
  const b = schriftBefund();
  if (b.alle) return '';
  const namen = b.fehlend.map(s => `${s.familie} (${s.wofuer})`).join(' und ');
  const ersatz = b.fehlend.map(s => s.ersatz).join(' und ');
  return `Ersatzschrift aktiv: ${ersatz} statt ${namen}. `
       + `Die Aushänge sind brauchbar, aber nicht in der Hausschrift.`;
}
