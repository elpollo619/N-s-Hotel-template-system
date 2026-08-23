/* WLAN-Kärtchen · A4 hoch, Bogen zum Ausschneiden
   --------------------------------------------------------------------------
   Kein grosses Plakat, sondern zehn kleine Karten auf einem Blatt: WLAN-Name,
   Passwort, QR-Code. Zum Ausschneiden und aufs Nachttischchen, an die
   Pinnwand, in die Gästemappe. Der QR verbindet ohne Abtippen — man scannt
   ihn mit der Kamera, das Telefon fragt nur noch «verbinden?».

   Achtung: Der QR-Code enthält das Passwort im Klartext. Diese Karten sind
   dafür gemacht — sie bleiben im Haus. Nicht als Bilddatei verschicken.
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { qrWlan, qrSvg } from '../lib/qr.js';
import { absender, istHotel, absenderOptions } from '../objekte.js';

export default {
  id:'wlankarten',
  title:'WLAN-Kärtchen',
  sub:'Zehn kleine Karten mit QR zum Ausschneiden · A4 hoch',
  badge:'WLAN',
  root:'t-wlan',
  page:'a4',

  thumb: thumb(`
    ${[0,1,2,3,4].flatMap(r => [0,1].map(c => {
      const x = 24 + c*84, y = 26 + r*50;
      return `<rect x="${x}" y="${y}" width="78" height="44" rx="4" fill="#fff" stroke="#C9CFDA" stroke-width="1.4" stroke-dasharray="4 3"/>
              <rect x="${x+10}" y="${y+10}" width="30" height="6" rx="3" fill="#2A3350"/>
              <rect x="${x+10}" y="${y+22}" width="34" height="5" rx="2.5" fill="#01B1E2"/>
              <rect x="${x+10}" y="${y+31}" width="26" height="5" rx="2.5" fill="#2A3350" opacity=".5"/>
              <rect x="${x+52}" y="${y+12}" width="20" height="20" rx="2" fill="#2A3350" opacity=".85"/>`;
    })).join('')}`),

  fields:[
    { t:'group', label:'WLAN' },
    { k:'netz', label:'WLAN-Name (SSID)', type:'text' },
    { k:'pass', label:'Passwort', type:'text',
      hint:'Steht als Text auf der Karte und im QR-Code. Bleibt in deinem Browser.' },
    { k:'art',  label:'Verschlüsselung', type:'select', options:[
      { v:'WPA', t:'WPA / WPA2 / WPA3 (üblich)' },
      { v:'WEP', t:'WEP (alt)' },
      { v:'nopass', t:'offen — ohne Passwort' } ] },

    { t:'group', label:'Beschriftung' },
    { k:'titel', label:'Titel auf der Karte', type:'text' },
    { k:'hinweis', label:'Kleiner Hinweis', type:'text' },

    { t:'group', label:'Bogen' },
    { k:'anzahl', label:'Anzahl Karten', type:'number', min:1, max:10, step:1,
      hint:'Bis zehn Karten auf dem Blatt. Alle gleich.' },
    { k:'schnitt', label:'Schnittlinien', type:'select',
      options:[{ v:'ja', t:'zeigen' }, { v:'nein', t:'weglassen' }] },

    { t:'group', label:'Absender' },
    { k:'absender', label:'Absender', type:'select', options:absenderOptions }
  ],

  defaults:{
    netz:'Gast',
    pass:'',
    art:'WPA',
    titel:'WLAN',
    hinweis:'QR mit der Kamera scannen — fertig.',
    anzahl:10,
    schnitt:'ja',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const anzahl = Math.min(10, Math.max(1, Number(d.anzahl) || 10));
    const code = has(d.netz)
      ? qrWlan(d.netz, d.art === 'nopass' ? '' : (d.pass || ''), d.art || 'WPA')
      : '';

    const karte = `
      <div class="t-wlan-karte">
        <div class="t-wlan-txt">
          <span class="t-wlan-mark">${istHotel(d.absender) ? logo('color', 16) : esc(abs.name)}</span>
          ${has(d.titel) ? `<b class="t-wlan-titel">${esc(d.titel)}</b>` : ''}
          <dl>
            <div><dt>Netz</dt><dd>${esc(d.netz || '')}</dd></div>
            ${d.art !== 'nopass' ? `<div><dt>Passwort</dt><dd>${esc(d.pass || '')}</dd></div>` : ''}
          </dl>
          ${has(d.hinweis) ? `<p class="t-wlan-hint">${esc(d.hinweis)}</p>` : ''}
        </div>
        <div class="t-wlan-qr">${code ? qrSvg(code, { stufe:'M', groesse:'23mm', rand:0 }) : ''}</div>
      </div>`;

    return `
      <div class="t-wlan-bogen${d.schnitt === 'ja' ? ' is-schnitt' : ''}">
        ${Array.from({ length:anzahl }, () => karte).join('')}
      </div>`;
  }
};
