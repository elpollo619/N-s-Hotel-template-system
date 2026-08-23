/* Besucher-Parkkarte · A4 hoch, Bogen zum Ausschneiden
   --------------------------------------------------------------------------
   Die Karte hinter die Windschutzscheibe: «Besucher — Wohnung …, gültig
   bis …». Sechs Karten auf ein Blatt, zum Ausschneiden und Auslegen. So weiss
   der Nachbar, dass das fremde Auto angemeldet ist, und die Verwaltung sieht,
   zu wem es gehört.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

export default {
  id:'besucherkarte',
  title:'Besucher-Parkkarte',
  sub:'Sechs Karten für die Windschutzscheibe · A4 hoch',
  badge:'Parkieren',
  root:'t-bpk',
  page:'a4',

  thumb: thumb(`
    ${[0,1,2].flatMap(r => [0,1].map(c => {
      const x = 22 + c*88, y = 30 + r*82;
      return `<rect x="${x}" y="${y}" width="80" height="70" rx="5" fill="#fff" stroke="#C9CFDA" stroke-width="1.4" stroke-dasharray="4 3"/>
              <rect x="${x}" y="${y}" width="80" height="18" rx="5" fill="#01B1E2"/>
              <rect x="${x+10}" y="${y+7}" width="46" height="6" rx="3" fill="#fff"/>
              <rect x="${x+10}" y="${y+30}" width="40" height="6" rx="3" fill="#2A3350" opacity=".6"/>
              <rect x="${x+10}" y="${y+44}" width="56" height="6" rx="3" fill="#2A3350" opacity=".4"/>`;
    })).join('')}`),

  fields:[
    { t:'group', label:'Karte' },
    { k:'titel', label:'Titel', type:'text' },
    { k:'objekt', label:'Liegenschaft', type:'select', options:objektOptions },

    { t:'group', label:'Zeilen zum Ausfüllen' },
    { k:'felder', label:'Zeilen', type:'text',
      hint:'Kommagetrennt — je eine Schreiblinie auf jeder Karte.' },
    { k:'hinweis', label:'Kleiner Hinweis', type:'text' },

    { t:'group', label:'Bogen' },
    { k:'anzahl', label:'Anzahl Karten', type:'number', min:1, max:6, step:1 },
    { k:'schnitt', label:'Schnittlinien', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    titel:'Besucher',
    objekt:'-',
    felder:'Zu Besuch bei (Wohnung), Datum, Gültig bis, Kennzeichen',
    hinweis:'Gut sichtbar hinter die Windschutzscheibe legen.',
    anzahl:6,
    schnitt:'ja',
    absender:'immobilien'
  },

  render(d){
    const abs = absender(d.absender, 'immobilien');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const ort = [obj.code && obj.name, adr].filter(Boolean).join(' · ');
    const felder = String(d.felder || '').split(',').map(s => s.trim()).filter(Boolean);
    const anzahl = Math.min(6, Math.max(1, Number(d.anzahl) || 6));

    const karte = `
      <div class="t-bpk-karte">
        <div class="t-bpk-kopf">
          <span class="t-bpk-ico">${icon('car', 18, 1.9)}</span>
          <b>${esc(d.titel || 'Besucher')}</b>
          <span class="t-bpk-mark">${istHotel(d.absender) ? logo('white', 14) : ''}</span>
        </div>
        <div class="t-bpk-body">
          ${felder.map(f => `<div class="t-bpk-feld"><span>${esc(f)}</span><i></i></div>`).join('')}
          ${has(d.hinweis) ? `<p class="t-bpk-hint">${esc(d.hinweis)}</p>` : ''}
          ${ort ? `<p class="t-bpk-ort">${esc(ort)}</p>` : ''}
        </div>
      </div>`;

    return `
      <div class="t-bpk-bogen${d.schnitt === 'ja' ? ' is-schnitt' : ''}">
        ${Array.from({ length:anzahl }, () => karte).join('')}
      </div>`;
  }
};
