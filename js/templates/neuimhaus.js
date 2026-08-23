/* Neu im Haus · A4 hoch
   --------------------------------------------------------------------------
   Das Blatt, das dem neuen Mieter am ersten Tag in die Hand gedrückt wird:
   Kehrichttag, Waschküche, Ruhezeiten, wer bei was hilft. Alles, was man in
   den ersten Wochen dreimal fragt, auf einem Blatt — nach Themen in Kacheln,
   damit man es an den Kühlschrank hängt und nachschaut.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'neuimhaus',
  title:'Neu im Haus',
  sub:'Willkommensblatt für neue Mieter · A4 hoch',
  badge:'Willkommen',
  root:'t-neu',
  page:'a4',

  thumb: thumb(`
    <rect x="24" y="26" width="90" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="24" y="44" width="150" height="18" rx="6" fill="#2A3350"/>
    ${[0,1,2,3].map(i => {
      const x = 24 + (i%2)*84, y = 88 + Math.floor(i/2)*70;
      return `<rect x="${x}" y="${y}" width="78" height="60" rx="6" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="1.4"/>
              <circle cx="${x+16}" cy="${y+16}" r="8" fill="#01B1E2" opacity=".7"/>
              <rect x="${x+30}" y="${y+12}" width="36" height="7" rx="3.5" fill="#2A3350" opacity=".8"/>
              <rect x="${x+12}" y="${y+34}" width="54" height="6" rx="3" fill="#2A3350" opacity=".4"/>
              <rect x="${x+12}" y="${y+46}" width="40" height="6" rx="3" fill="#2A3350" opacity=".4"/>`;
    }).join('')}`),

  fields:[
    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'objekt',  label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'lede',    label:'Einleitung', type:'textarea', rows:2 },

    { t:'group', label:'Themen-Kacheln' },
    { k:'kacheln', label:'Kacheln', type:'list', itemLabel:'Kachel', max:8,
      defaultItem:{ icon:'info', titel:'', text:'' },
      item:[
        { k:'icon',  label:'Symbol', type:'select', options:iconOptions },
        { k:'titel', label:'Titel',  type:'text' },
        { k:'text',  label:'Text',   type:'textarea', rows:2 }
      ] },

    { t:'group', label:'Kontakt' },
    { k:'kontakt', label:'Fusszeile Kontakt', type:'text' },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    eyebrow:'Herzlich willkommen',
    titel:'Neu im Haus',
    objekt:'-',
    lede:'Schön, dass Sie da sind. Damit Sie sich rasch zurechtfinden, hier das Wichtigste auf einen Blick.',
    kacheln:[
      { icon:'trash',   titel:'Abfall', text:'Kehricht: Dienstag und Freitag ab 07:00 vor die Tür. Karton gebündelt am ersten Montag im Monat. Übriges zur Sammelstelle.' },
      { icon:'waesche', titel:'Waschküche', text:'Im Untergeschoss, nach Turnusplan am Anschlagbrett. Waschmarken bei der Verwaltung.' },
      { icon:'quiet',   titel:'Ruhezeiten', text:'22:00 – 07:00 Nachtruhe, 12:00 – 13:00 Mittagsruhe, sonntags ganztags. Bitte Rücksicht nehmen.' },
      { icon:'car',     titel:'Parkieren', text:'Nur auf dem zugeteilten Platz. Besucher auf den markierten Besucherplätzen, max. 24 Std.' },
      { icon:'paket',   titel:'Post und Pakete', text:'Briefkasten beschriften lassen bei der Verwaltung. Pakete siehe Aushang «Paketablage» im Eingang.' },
      { icon:'reception', titel:'Wer hilft', text:'Hauswart für Alltägliches, Verwaltung für Vertrag und Abrechnung. Nummern unten.' }
    ],
    kontakt:'Hauswart und Verwaltung: siehe Kontakt-Tafel im Eingang',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');

    const kacheln = (d.kacheln || []).filter(k => has(k.titel) || has(k.text)).map(k => `
      <div class="t-neu-kachel">
        <div class="t-neu-kh"><span class="t-neu-ico">${icon(k.icon || 'info', 22, 1.9)}</span>
          <b>${esc(k.titel)}</b></div>
        ${has(k.text) ? `<p>${esc(k.text)}</p>` : ''}
      </div>`).join('');

    return `
      <header class="t-neu-kopf">
        ${has(d.eyebrow) ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel || '')}</h1>
        ${ort ? `<p class="t-neu-ort">${esc(ort)}</p>` : ''}
        ${has(d.lede) ? `<p class="t-neu-lede">${esc(d.lede)}</p>` : ''}
      </header>

      <div class="t-neu-grid">${kacheln}</div>

      <footer class="t-neu-fuss">
        <span class="t-neu-mark">${istHotel(d.absender) ? logo('color', 24) : ''}</span>
        <span>${esc([d.kontakt, abs.foot].filter(Boolean).join(' · '))}</span>
      </footer>`;
  }
};
