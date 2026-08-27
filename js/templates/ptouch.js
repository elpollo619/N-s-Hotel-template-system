/* Etikettendruck · Brother P-touch (Endlosband)
   --------------------------------------------------------------------------
   Für die TZe-Endlosbänder der P-touch: ein schmales Band in der Breite der
   Kassette (9, 12, 18, 24 oder 36 mm) und beliebiger Länge. Anders als der
   Avery-Bogen (ganze A4-Seite mit Stanzetiketten) ist hier jedes Etikett ein
   eigenes Band.

   Ausgabe für den P-touch-Editor am Rechner: «PNG je Etikett» liefert ein
   Bild in exakter Bandhöhe — im Editor importieren, der schneidet auf Länge.
   «PDF (Bandgrösse)» legt je Etikett eine Seite in genauer mm-Grösse an, zum
   Drucken über den Druckertreiber (Bandkassette als Papiergrösse wählen).

   Eine Liste macht Serien in einem Rutsch: Zimmernummern, Ordnerrücken,
   Schrankfächer — «Liste einfügen» aus Excel, und jede Zeile wird ein Band. */
import { esc, has } from '../lib/dom.js';
import { thumbLand } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { elementeZuPdfBlob, elementZuPngBlob, downloadBlob } from '../lib/export.js';

/* Bandbreiten der TZe-Kassetten in Millimetern. Die bedruckbare Höhe ist
   etwas kleiner als die Kassette; die gängigen Näherungswerte reichen für
   den Import in den P-touch-Editor, der ohnehin zentriert. */
export const PT_BAENDER = {
  '9':  { mm:9,  label:'9 mm' },
  '12': { mm:12, label:'12 mm' },
  '18': { mm:18, label:'18 mm' },
  '24': { mm:24, label:'24 mm' },
  '36': { mm:36, label:'36 mm' }
};

const PT_MM_PRO_PX = 25.4 / 96;   /* CSS-Pixel -> Millimeter */

function bandBreite(d){
  return (PT_BAENDER[String(d.band)] || PT_BAENDER['12']).mm;
}

/* Schriftgrössen in mm, abgeleitet aus der Bandhöhe. Zwei Zeilen teilen sich
   die Höhe; eine Zeile darf grösser werden. */
function schriftMasse(tape, d, zweizeilig){
  const stufe = d.schrift === 'klein' ? 0.86 : d.schrift === 'gross' ? 1.16 : 1;
  const gross = tape * (zweizeilig ? 0.46 : 0.6) * stufe;
  const klein = tape * 0.26 * stufe;
  return { gross:+gross.toFixed(2), klein:+klein.toFixed(2) };
}

/* Ein einzelnes Band als HTML. `laenge` ist 'auto' (Breite = Inhalt) oder
   eine feste mm-Zahl. */
function bandHtml(d, eintrag, i){
  const tape = bandBreite(d);
  const zwei = has(eintrag.klein);
  const s = schriftMasse(tape, d, zwei);
  const auto = (d.laenge || 'auto') === 'auto';
  const festeLaenge = Math.max(15, Math.min(300, Number(d.laengeMm) || 60));
  const breiteCss = auto ? 'width:max-content' : `width:${festeLaenge}mm`;
  const mitte = d.ausrichtung === 'zentriert';
  const fett = d.fett === 'ja' ? '700' : '600';

  const qr = has(eintrag.qr)
    ? `<div class="t-pt-qr" style="width:${(tape - 3).toFixed(1)}mm;height:${(tape - 3).toFixed(1)}mm">
         ${qrSvg(eintrag.qr, { stufe:'M', groesse:(tape - 3).toFixed(1) + 'mm', farbe:'#000' })}
       </div>` : '';

  const text = `
    <div class="t-pt-text" style="text-align:${mitte ? 'center' : 'left'}">
      ${has(eintrag.gross) ? `<span class="t-pt-gross" style="font-size:${s.gross}mm;font-weight:${fett}">${esc(eintrag.gross)}</span>` : ''}
      ${zwei ? `<span class="t-pt-klein" style="font-size:${s.klein}mm">${esc(eintrag.klein)}</span>` : ''}
    </div>`;

  return `
    <div class="t-pt-band${d.rahmen === 'ja' ? ' is-rahmen' : ''}${mitte ? ' is-mitte' : ''}"
         data-page data-band="${i}"
         style="height:${tape}mm;${breiteCss}">
      ${qr}${text}
    </div>`;
}

export default {
  id:'ptouch',
  title:'Etikettendruck · P-touch',
  sub:'Endlosband 9–36 mm — Serien aus einer Liste · für P-touch Editor',
  badge:'Etikett',
  root:'t-pt',
  page:'a4',
  cat:'unterhalt',

  thumb: thumbLand(`
    <rect x="14" y="14" width="269" height="128" rx="8" fill="#EEF1F5"/>
    <rect x="34" y="52" width="230" height="52" rx="6" fill="#fff" stroke="#C9CFDA" stroke-width="2"/>
    <rect x="44" y="62" width="32" height="32" rx="3" fill="#2A3350"/>
    ${[0,1,2,3,4].map(r=>[0,1,2,3,4].map(c=> ((r*3+c*2+r*c)%3<2)?`<rect x="${47+c*6}" y="${65+r*6}" width="5" height="5" fill="#fff"/>`:'').join('')).join('')}
    <rect x="90" y="66" width="150" height="12" rx="3" fill="#2A3350"/>
    <rect x="90" y="86" width="96" height="7" rx="3" fill="#01B1E2"/>
    <rect x="14" y="154" width="150" height="8" rx="4" fill="#2A3350"/>
    <rect x="14" y="172" width="240" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Band' },
    { k:'band', label:'Bandbreite (Kassette)', type:'select',
      options:Object.keys(PT_BAENDER).map(k => ({ v:k, t:PT_BAENDER[k].label })),
      hint:'Die Breite der eingelegten TZe-Kassette. 12 mm ist im Büro am häufigsten.' },
    { k:'laenge', label:'Länge', type:'select', options:[
      { v:'auto', t:'automatisch — so lang wie der Text' },
      { v:'fest', t:'feste Länge in mm' } ] },
    { k:'laengeMm', label:'Feste Länge in mm', type:'number', min:15, max:300, step:5,
      hint:'Nur bei fester Länge. Für gleich breite Etiketten (Ordnerrücken).' },

    { t:'group', label:'Etiketten' },
    { t:'note', label:'Je Zeile ein Etikett. «Liste einfügen» übernimmt eine ganze Aufstellung aus Excel — z. B. alle Zimmernummern auf einmal.' },
    { k:'labels', label:'Etiketten', type:'list', itemLabel:'Etikett', max:60,
      defaultItem:{ gross:'', klein:'', qr:'' },
      item:[
        { k:'gross', label:'Grosse Zeile', type:'text' },
        { k:'klein', label:'Kleine Zeile (freiwillig)', type:'text' },
        { k:'qr',    label:'QR-Inhalt (freiwillig)', type:'text',
          hint:'Link oder Text; erscheint als kleiner Code links. Leer lassen für kein QR.' }
      ] },

    { t:'group', label:'Gestaltung' },
    { k:'schrift', label:'Schriftgrösse', type:'select', options:[
      { v:'klein', t:'klein' }, { v:'mittel', t:'mittel' }, { v:'gross', t:'gross' } ] },
    { k:'fett', label:'Fett', type:'select', options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },
    { k:'ausrichtung', label:'Ausrichtung', type:'select',
      options:[{v:'links',t:'links'},{v:'zentriert',t:'zentriert'}] },
    { k:'rahmen', label:'Schneidelinie zeigen', type:'select',
      options:[{v:'nein',t:'aus'},{v:'ja',t:'ein — dünner Rahmen ums Band'}] }
  ],

  defaults:{
    band:'12',
    laenge:'auto',
    laengeMm:60,
    labels:[
      { gross:'Zimmer 101', klein:'', qr:'' },
      { gross:'Zimmer 102', klein:'', qr:'' },
      { gross:'Putzmittel', klein:'nur Bad', qr:'' }
    ],
    schrift:'mittel',
    fett:'ja',
    ausrichtung:'links',
    rahmen:'nein'
  },

  render(d){
    const liste = (d.labels || []).filter(e => has(e.gross) || has(e.klein) || has(e.qr));
    const tape = bandBreite(d);
    const baender = liste.length
      ? liste.map((e, i) => bandHtml(d, e, i)).join('')
      : `<p class="t-pt-leer">Noch keine Etiketten — links eine grosse Zeile eintippen.</p>`;

    return `
      <div class="t-pt-kopf no-print">
        <span class="t-pt-mass">${PT_BAENDER[String(d.band)] ? PT_BAENDER[String(d.band)].label : tape + ' mm'} · ${liste.length} Etikett${liste.length === 1 ? '' : 'en'}</span>
        <span class="t-pt-tipp">Ausgabe über die Knöpfe unten: «PNG je Etikett» oder «PDF (Bandgrösse)».</span>
      </div>
      <div class="t-pt-matte">${baender}</div>`;
  },

  /* Eigene Ausgabe: die Standard-Knöpfe würden das ganze A4-Blatt exportieren.
     Hier je Etikett ein Band in exakter mm-Grösse. */
  mount(ctx){
    const box = document.createElement('div');
    box.className = 'vz-pt-export';
    box.innerHTML = `
      <button type="button" class="vz-btn vz-btn--navy" data-pt="png">PNG je Etikett</button>
      <button type="button" class="vz-btn" data-pt="pdf">PDF (Bandgrösse)</button>
      <p class="vz-hint">Im P-touch Editor das PNG importieren — er schneidet auf Länge. Oder das PDF über den Druckertreiber drucken und die Bandkassette als Papiergrösse wählen.</p>`;
    ctx.panel.append(box);

    function baender(){
      return Array.from(ctx.sheet.querySelectorAll('.t-pt-band'));
    }
    /* mm-Masse je Band: Höhe = Bandbreite; Breite aus der gemessenen Pixelbreite. */
    function masse(el){
      return { wmm:+(el.offsetWidth * PT_MM_PRO_PX).toFixed(1),
               hmm:+(el.offsetHeight * PT_MM_PRO_PX).toFixed(1) };
    }
    async function mitKnopf(btn, fn){
      const alt = btn.textContent; btn.disabled = true; btn.textContent = '…';
      try { await fn(); } catch (err){ console.warn(err); alert('Export fehlgeschlagen — bitte «Drucken / PDF» nutzen.'); }
      finally { btn.disabled = false; btn.textContent = alt; }
    }

    box.addEventListener('click', ev => {
      const btn = ev.target.closest('[data-pt]');
      if (!btn) return;
      const els = baender();
      if (!els.length){ alert('Noch keine Etiketten.'); return; }
      if (btn.dataset.pt === 'pdf'){
        mitKnopf(btn, async () => {
          const blob = await elementeZuPdfBlob(els, els.map(masse));
          downloadBlob(blob, 'ns-hotel-ptouch.pdf');
        });
      } else {
        mitKnopf(btn, async () => {
          for (let i = 0; i < els.length; i++){
            const blob = await elementZuPngBlob(els[i]);
            downloadBlob(blob, `ns-hotel-ptouch-${String(i + 1).padStart(2, '0')}.png`);
          }
        });
      }
    });

    return () => box.remove();
  }
};
