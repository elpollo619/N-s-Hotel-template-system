/* ==========================================================================
   Eigener PDF-Schreiber — ohne Fremdbibliothek.
   --------------------------------------------------------------------------
   Ein PDF ist am Ende eine Liste nummerierter Objekte mit einer
   Querverweistabelle (xref), in der die BYTE-Position jedes Objekts steht.
   Wer die Positionen falsch zählt, bekommt ein «beschädigtes» PDF — darum
   wird hier ausschliesslich in Byte-Stücken gearbeitet (TextEncoder), nie
   mit string.length.

   Der Schreiber kann genau das, was die Zentrale braucht: fertige
   JPEG-Bilder (aus dem Canvas-Export) als je eine Seite einbetten
   (/Filter /DCTDecode — das JPEG bleibt unangetastet, keine Neukompression).
   Text, Schriften, Formen: bewusst nicht — die stecken schon im Bild.
   ========================================================================== */

const PDF_ENC = new TextEncoder();
const MM_ZU_PT = 72 / 25.4;

/**
 * PDF aus fertigen JPEG-Seiten bauen.
 * @param {Array<{jpeg:Uint8Array, wmm:number, hmm:number}>} seiten
 * @returns {Blob} application/pdf
 */
export function pdfAusJpegSeiten(seiten){
  const teile = [];
  let lage = 0;
  const positionen = [];   /* Objekt-Nr. -> Byte-Position */

  const roh = bytes => { teile.push(bytes); lage += bytes.length; };
  const txt = s => roh(PDF_ENC.encode(s));
  const objekt = (nr, kopf, stream) => {
    positionen[nr] = lage;
    txt(`${nr} 0 obj\n${kopf}\n`);
    if (stream){ txt('stream\n'); roh(stream); txt('\nendstream\n'); }
    txt('endobj\n');
  };

  /* Kopf: Version plus vier Bytes über 0x7F, damit nichts das PDF für
     eine Textdatei hält. */
  txt('%PDF-1.4\n');
  roh(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));

  /* Objekt-Nummern: 1 Katalog, 2 Seitenbaum, danach je Seite drei Objekte
     (Seite, Inhalt, Bild). */
  const seitenNr = seiten.map((_, i) => 3 + i * 3);
  objekt(1, '<< /Type /Catalog /Pages 2 0 R >>');
  objekt(2, `<< /Type /Pages /Kids [${seitenNr.map(n => n + ' 0 R').join(' ')}] /Count ${seiten.length} >>`);

  seiten.forEach((s, i) => {
    const nr = seitenNr[i];
    const w = (s.wmm * MM_ZU_PT).toFixed(2);
    const h = (s.hmm * MM_ZU_PT).toFixed(2);
    /* Das Bild füllt die ganze Seite: Skalierungsmatrix auf Seitengrösse. */
    const inhalt = PDF_ENC.encode(`q ${w} 0 0 ${h} 0 0 cm /Im${i} Do Q`);
    objekt(nr,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] ` +
      `/Resources << /XObject << /Im${i} ${nr + 2} 0 R >> >> /Contents ${nr + 1} 0 R >>`);
    objekt(nr + 1, `<< /Length ${inhalt.length} >>`, inhalt);
    objekt(nr + 2,
      `<< /Type /XObject /Subtype /Image /Width ${s.wpx} /Height ${s.hpx} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${s.jpeg.length} >>`,
      s.jpeg);
  });

  /* Querverweistabelle: jede Zeile exakt 20 Bytes. */
  const xrefLage = lage;
  const anzahl = 2 + seiten.length * 3;
  txt(`xref\n0 ${anzahl + 1}\n0000000000 65535 f \n`);
  for (let nr = 1; nr <= anzahl; nr++){
    txt(String(positionen[nr]).padStart(10, '0') + ' 00000 n \n');
  }
  txt(`trailer\n<< /Size ${anzahl + 1} /Root 1 0 R >>\nstartxref\n${xrefLage}\n%%EOF\n`);

  return new Blob(teile, { type:'application/pdf' });
}

/** JPEG-Data-URL in rohe Bytes samt Pixelmass. */
export function jpegBytes(dataUrl, wpx, hpx){
  const b64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { jpeg: bytes, wpx, hpx };
}
