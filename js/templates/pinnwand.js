/* Pinnwand-Karte · A4 hoch, vier Karten zum Ausschneiden
   --------------------------------------------------------------------------
   Das kleine Kärtchen fürs Schwarze Brett: «Zu verschenken», «Gesucht»,
   «Biete», «Gefunden». Vier auf ein Blatt, mit Abreiss-Fransen unten für die
   Telefonnummer. Wer im Haus ein Sofa loswerden oder einen Handwerker
   empfehlen will, füllt eines aus und hängt es an.
*/
import { esc, has } from '../lib/dom.js';
import { thumb } from '../lib/thumbs.js';

const PIN_ARTEN = {
  verschenken:{ wort:'Zu verschenken', ton:'#1F9D57' },
  gesucht:    { wort:'Gesucht',        ton:'#01B1E2' },
  biete:      { wort:'Biete an',       ton:'#8E44EF' },
  gefunden:   { wort:'Gefunden',       ton:'#E8A93B' },
  info:       { wort:'Mitteilung',     ton:'#2A3350' }
};

export default {
  id:'pinnwand',
  title:'Pinnwand-Karte',
  sub:'Zu verschenken, Gesucht, Biete — vier zum Ausschneiden · A4 hoch',
  badge:'Schwarzes Brett',
  root:'t-pin',
  page:'a4',

  thumb: thumb(`
    ${[0,1].flatMap(r => [0,1].map(c => {
      const x = 22 + c*88, y = 30 + r*128;
      return `<rect x="${x}" y="${y}" width="80" height="112" rx="5" fill="#fff" stroke="#C9CFDA" stroke-width="1.4" stroke-dasharray="4 3"/>
              <rect x="${x+10}" y="${y+12}" width="46" height="10" rx="3" fill="#01B1E2"/>
              <rect x="${x+10}" y="${y+30}" width="60" height="6" rx="3" fill="#2A3350" opacity=".6"/>
              <rect x="${x+10}" y="${y+42}" width="52" height="6" rx="3" fill="#2A3350" opacity=".4"/>
              ${[0,1,2,3,4].map(k => `<rect x="${x+8+k*14}" y="${y+80}" width="10" height="26" rx="2" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="1"/>`).join('')}`;
    })).join('')}`),

  fields:[
    { t:'group', label:'Karte' },
    { k:'art', label:'Art', type:'select',
      options:Object.entries(PIN_ARTEN).map(([v, a]) => ({ v, t:a.wort })) },
    { k:'titel', label:'Eigener Titel', type:'text',
      hint:'Leer lassen: nimmt das Wort der gewählten Art.' },
    { k:'text', label:'Text', type:'textarea', rows:3 },
    { k:'kontaktLabel', label:'Abreiss-Text', type:'text',
      hint:'Steht auf jeder Abreiss-Franse — meist die Telefonnummer.' },

    { t:'group', label:'Bogen' },
    { k:'anzahl', label:'Anzahl Karten', type:'number', min:1, max:4, step:1 },
    { k:'fransen', label:'Abreiss-Fransen', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },
    { k:'schnitt', label:'Schnittlinien', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] }
  ],

  defaults:{
    art:'verschenken',
    titel:'',
    text:'Gut erhaltenes Sofa, 3-plätzig, dunkelgrau. Abzuholen im 2. OG.',
    kontaktLabel:'Tel. …………………',
    anzahl:4,
    fransen:'ja',
    schnitt:'ja'
  },

  render(d){
    const a = PIN_ARTEN[d.art] || PIN_ARTEN.info;
    const titel = has(d.titel) ? d.titel : a.wort;
    const anzahl = Math.min(4, Math.max(1, Number(d.anzahl) || 4));

    const fransen = d.fransen === 'ja'
      ? `<div class="t-pin-fransen">${Array.from({ length:7 }, () =>
          `<span>${esc(d.kontaktLabel || '')}</span>`).join('')}</div>`
      : '';

    const karte = `
      <div class="t-pin-karte" style="--ton:${a.ton}">
        <p class="t-pin-titel">${esc(titel)}</p>
        ${has(d.text) ? `<p class="t-pin-text">${esc(d.text)}</p>` : ''}
        ${fransen}
      </div>`;

    return `
      <div class="t-pin-bogen${d.schnitt === 'ja' ? ' is-schnitt' : ''}">
        ${Array.from({ length:anzahl }, () => karte).join('')}
      </div>`;
  }
};
