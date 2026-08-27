/* Infoscreen · Lobby-Bildschirm 16:9 (oder 9:16 hochkant)
   --------------------------------------------------------------------------
   Kein Aushang auf Papier, sondern ein Bild für den Fernseher/Screen in der
   Lobby: grosse Begrüssung, ein paar Infozeilen (Frühstück, Check-out, WLAN)
   und optional ein WLAN-QR. Ausgabe als PNG in 1920×1080 (bzw. 1080×1920) —
   das Bild auf den USB-Stick des Screens, in die Digital-Signage-Software
   oder per Zattoo-Bildschirmschoner einspielen.

   Gerechnet wird in Bildschirm-Pixeln, nicht in Millimetern — «Als PNG»
   liefert genau die richtige Auflösung. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumbLand } from '../lib/thumbs.js';
import { qrWlan, qrSvg } from '../lib/qr.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const INFO_FORMAT = { quer:'bildschirm', hoch:'bildschirm-hoch' };

export default {
  id:'infoscreen',
  title:'Infoscreen · Lobby-TV',
  sub:'Bildschirm 16:9 für die Lobby — als PNG einspielen',
  badge:'Bildschirm',
  badgeCyan:true,
  root:'t-info',
  page:'bildschirm',
  cat:'zimmer',
  pageOf(d){ return INFO_FORMAT[d && d.format] || 'bildschirm'; },

  thumb: thumbLand(`
    <rect x="0" y="0" width="297" height="171" fill="#1B2036"/>
    <rect x="26" y="28" width="70" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="26" y="48" width="150" height="20" rx="4" fill="#fff"/>
    <rect x="26" y="92" width="130" height="7" rx="3.5" fill="#8B93A7"/>
    <rect x="26" y="108" width="110" height="7" rx="3.5" fill="#8B93A7"/>
    <rect x="26" y="124" width="140" height="7" rx="3.5" fill="#8B93A7"/>
    <rect x="214" y="86" width="58" height="58" rx="6" fill="#fff"/>
    ${[0,1,2,3,4].map(r=>[0,1,2,3,4].map(c=>((r*3+c*2+r*c)%3<2)?`<rect x="${220+c*10}" y="${92+r*10}" width="8" height="8" fill="#1B2036"/>`:'').join('')).join('')}`),

  fields:[
    { t:'group', label:'Format' },
    { k:'format', label:'Bildschirm', type:'select', options:[
      { v:'quer', t:'16:9 quer (üblicher Fernseher)' },
      { v:'hoch', t:'9:16 hochkant (Stele)' } ] },
    { k:'stil', label:'Farbe', type:'select', options:[
      { v:'navy',  t:'Navy (dunkelblau)' },
      { v:'nacht', t:'Nacht (fast schwarz)' },
      { v:'cyan',  t:'Cyan (hell, für helle Räume)' } ] },
    { k:'bild', label:'Hintergrundbild (freiwillig)', type:'image',
      hint:'Wird abgedunkelt hinterlegt. Leer lassen für Farbfläche.' },

    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Kleine Zeile oben', type:'text' },
    { k:'titel',   label:'Grosse Begrüssung', type:'text' },
    { k:'unter',   label:'Untertitel', type:'text', hint:'**fett** möglich' },

    { t:'group', label:'Infozeilen' },
    { k:'zeilen', label:'Zeilen', type:'list', itemLabel:'Zeile', max:8,
      defaultItem:{ label:'', wert:'' },
      item:[
        { k:'label', label:'Bezeichnung', type:'text' },
        { k:'wert',  label:'Angabe', type:'text' }
      ] },

    { t:'group', label:'WLAN-QR (freiwillig)' },
    { k:'wlan', label:'WLAN-QR zeigen', type:'select',
      options:[{v:'nein',t:'nein'},{v:'ja',t:'ja — QR unten rechts'}] },
    { k:'netz', label:'WLAN-Name (SSID)', type:'text' },
    { k:'pass', label:'WLAN-Passwort', type:'text',
      hint:'Steht im QR-Code. Bleibt in diesem Browser; das PNG nicht öffentlich streamen, wenn das Passwort geheim sein soll.' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions }
  ],

  defaults:{
    format:'quer',
    stil:'navy',
    bild:'',
    eyebrow:'Herzlich willkommen',
    titel:'Guten Tag im N’s Hotel',
    unter:'Wir wünschen Ihnen einen angenehmen Aufenthalt.',
    zeilen:[
      { label:'Frühstück', wert:'07:30 – 10:00' },
      { label:'Check-out', wert:'bis 11:00 Uhr' },
      { label:'Rezeption', wert:'+41 31 951 85 54' }
    ],
    wlan:'ja',
    netz:'Gast',
    pass:'',
    objekt:'A14',
    absender:'hotel'
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const stil = ['navy', 'nacht', 'cyan'].includes(d.stil) ? d.stil : 'navy';
    const hell = stil === 'cyan';

    const bild = has(d.bild)
      ? `<img class="t-info-bg" src="${esc(d.bild)}" alt="">` : '';

    const zeilen = (d.zeilen || []).filter(z => has(z.label) || has(z.wert))
      .map(z => `<li><span class="t-info-l">${esc(z.label)}</span><span class="t-info-w">${esc(z.wert)}</span></li>`)
      .join('');

    let qr = '';
    if (d.wlan === 'ja' && has(d.netz)){
      try {
        qr = `<div class="t-info-qr">
                ${qrSvg(qrWlan(d.netz, d.pass || '', 'WPA'), { stufe:'M', groesse:'260px', farbe:'#12203A' })}
                <span>WLAN · ${esc(d.netz)}</span>
              </div>`;
      } catch (_){ qr = ''; }
    }

    return `
    <div class="t-info-flaeche is-${stil}">
      ${bild}
      <div class="t-info-inhalt">
        <header class="t-info-kopf">
          <div>
            ${has(d.eyebrow) ? `<p class="t-info-eyebrow">${esc(d.eyebrow)}</p>` : ''}
            ${has(d.titel) ? `<h1 class="t-info-titel">${esc(d.titel)}</h1>` : ''}
            ${has(d.unter) ? `<p class="t-info-unter">${fmt(d.unter)}</p>` : ''}
          </div>
          <div class="t-info-logo">${istHotel(d.absender) ? logo(hell ? 'color' : 'white', 64) : esc(abs.name)}</div>
        </header>

        <div class="t-info-body">
          ${zeilen ? `<ul class="t-info-zeilen">${zeilen}</ul>` : '<span></span>'}
          ${qr}
        </div>

        <footer class="t-info-foot">
          <span>${istHotel(d.absender) ? esc(abs.name) : esc(abs.legal)}</span>
          <span>${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
        </footer>
      </div>
    </div>`;
  }
};
