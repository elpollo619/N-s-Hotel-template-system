/* Kurzanleitung · A4 hoch — der Aushang für die eigene Bürowand.
   Beantwortet die zwei Fragen, die im Haus wirklich gestellt werden:
   wo finde ich das Ding, und wie drucke ich damit etwas aus.

   Der QR-Code ist fest eingebettet (js/lib/qr-vorlagen.js, erzeugt von
   tools/make-qr.py). Kein QR-Dienst im Internet, kein Nachladen — so
   erscheint er auch in standalone.html, das per file:// nichts nachladen
   dürfte. Wenn sich die Adresse ändert: Skript neu laufen lassen. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { QR_VORLAGEN } from '../lib/qr-vorlagen.js';

export default {
  id:'kurzanleitung',
  title:'Kurzanleitung',
  sub:'Wo finde ich die Zentrale, wie drucke ich · A4 hoch',
  badge:'Anleitung',
  page:'a4',
  root:'t-kurz',
  cat:'hilfe',

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="74" fill="#2A3350"/>
    <rect x="18" y="20" width="110" height="14" rx="4" fill="#fff" opacity=".92"/>
    <rect x="18" y="42" width="76" height="8" rx="4" fill="#01B1E2"/>
    <rect x="150" y="16" width="42" height="42" rx="4" fill="#fff"/>
    ${[0,1,2,3,4,5].map(r => [0,1,2,3,4,5].map(c =>
      ((r * 7 + c * 3) % 4 < 2)
        ? `<rect x="${154 + c * 6}" y="${20 + r * 6}" width="4" height="4" fill="#2A3350"/>` : '').join('')).join('')}
    ${[0,1,2].map(i => `
      <circle cx="30" cy="${104 + i * 46}" r="11" fill="#01B1E2"/>
      <rect x="50" y="${96 + i * 46}" width="120" height="9" rx="4" fill="#2A3350"/>
      <rect x="50" y="${110 + i * 46}" width="84" height="6" rx="3" fill="#C9CFDA"/>`).join('')}
    <rect x="18" y="244" width="174" height="34" rx="6" fill="#F6F7FA"/>
    ${lines(28, 254, 150, 2)}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'title',   label:'Titel', type:'text' },
    { k:'sub',     label:'Untertitel', type:'text' },

    { t:'group', label:'Adresse' },
    { k:'url',     label:'Adresse zum Abtippen', type:'text',
      hint:'Der QR-Code daneben zeigt immer die in tools/make-qr.py hinterlegte Adresse. Beide müssen zusammenpassen.' },
    { k:'zeigeQr', label:'QR-Code zeigen', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },

    { t:'group', label:'Schritte' },
    { k:'steps', label:'Schritte', type:'list', itemLabel:'Schritt', max:5,
      defaultItem:{ titel:'', text:'' },
      item:[
        { k:'titel', label:'Überschrift', type:'text' },
        { k:'text',  label:'Text', type:'textarea' }
      ] },

    { t:'group', label:'Druckeinstellungen' },
    { k:'druckTitel', label:'Überschrift', type:'text' },
    { k:'druckText',  label:'Text', type:'textarea', hint:'**fett** möglich' },

    { t:'group', label:'Fusszeile' },
    { k:'hinweis', label:'Hinweis', type:'textarea' },
    { k:'kontakt', label:'Ansprechperson', type:'text' }
  ],

  defaults:{
    eyebrow:'Selber machen',
    title:'Vorlagen-Zentrale',
    sub:'Aushänge, Schilder und Pläne — immer im gleichen Auftritt',
    url:'elpollo619.github.io/N-s-Hotel-template-system',
    zeigeQr:'ja',
    steps:[
      { titel:'Öffnen',
        text:'Den QR-Code scannen oder die Adresse eintippen. Am Handy über «Zum Startbildschirm hinzufügen» — dann liegt sie wie eine App auf dem Display.' },
      { titel:'Vorlage wählen und Texte anpassen',
        text:'Beim Hinweis zuerst den fertigen Textbaustein wählen und «Baustein übernehmen» drücken. Danach die Liegenschaft wählen — Kürzel und Adresse setzen sich von selbst.' },
      { titel:'Drucken',
        text:'«Drucken / PDF» wählen. Wer lieber ein Bild braucht: «Als PNG».' },
      { titel:'Weitergeben',
        text:'«Link teilen» kopiert den fertigen Aushang als Adresse — wer sie anklickt, sieht dasselbe Blatt.' }
    ],
    druckTitel:'Im Druckdialog einstellen',
    druckText:'Ränder: **keine** · Hintergrundgrafiken: **einschalten** · Skalierung: **100 %**',
    hinweis:'Der grüne Balken links zeigt, ob das Blatt noch auf eine Seite passt; bei Schildern steht darunter der Leseabstand. Änderungen bleiben im eigenen Browser; «Zurücksetzen» stellt das Original her.',
    kontakt:'Fragen an Cris'
  },

  render(d){
    const steps = (d.steps || []).filter(s => has(s.titel) || has(s.text));
    const liste = steps.map((s, i) => `
      <li class="t-kurz-step">
        <span class="t-kurz-num">${i + 1}</span>
        <div>
          ${has(s.titel) ? `<h3>${esc(s.titel)}</h3>` : ''}
          ${has(s.text) ? `<p>${fmt(s.text)}</p>` : ''}
        </div>
      </li>`).join('');

    const qrBlock = d.zeigeQr === 'nein' ? ''
      : `<div class="t-kurz-qr">${QR_VORLAGEN}</div>`;

    return `
    <header class="t-kurz-head">
      <div class="t-kurz-headtxt">
        ${has(d.eyebrow) ? `<p class="eyebrow t-kurz-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.title)}</h1>
        ${has(d.sub) ? `<p class="t-kurz-sub">${esc(d.sub)}</p>` : ''}
        ${has(d.url) ? `<p class="t-kurz-url">${esc(d.url)}</p>` : ''}
      </div>
      ${qrBlock}
    </header>

    <div class="t-kurz-body">
      <ol class="t-kurz-steps">${liste}</ol>

      ${(has(d.druckTitel) || has(d.druckText)) ? `
      <section class="t-kurz-druck">
        <span class="t-kurz-druck-ico">${icon('check', 26, 2)}</span>
        <div>
          ${has(d.druckTitel) ? `<h3>${esc(d.druckTitel)}</h3>` : ''}
          ${has(d.druckText) ? `<p>${fmt(d.druckText)}</p>` : ''}
        </div>
      </section>` : ''}
    </div>

    <footer class="t-kurz-foot">
      ${has(d.hinweis) ? `<p class="t-kurz-hinweis">${fmt(d.hinweis)}</p>` : ''}
      <div class="t-kurz-foot-zeile">
        ${logo('color', 30)}
        ${has(d.kontakt) ? `<span class="t-kurz-kontakt">${esc(d.kontakt)}</span>` : ''}
      </div>
    </footer>`;
  }
};
