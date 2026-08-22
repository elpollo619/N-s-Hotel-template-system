/* QR-Aushang · A4 hoch — ein grosser Code und eine kurze Anleitung.
   Für alles, was sonst abgetippt werden muss: WLAN-Zugang, Gästemappe,
   Wohnungsinserat, Telefonnummer, Adresse fürs Navi.

   Der Code wird im Browser gerechnet (js/lib/qr.js). Es wird kein Dienst im
   Internet gefragt — das ist beim WLAN-Passwort keine Kleinigkeit: es bleibt
   im eigenen Browser und geht nirgendwohin. Gespeichert wird es wie jeder
   andere Entwurf im localStorage dieses Geräts; wer das nicht will, tippt es
   vor dem Drucken ein und drückt danach «Zurücksetzen».

   ACHTUNG beim Verschicken: der Teilen-Link trägt den ganzen Entwurf in der
   Adresse — also auch das Passwort. Für einen WLAN-Aushang lieber das
   fertige PDF weitergeben. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { qrSvg, qrWlan, qrTelefon, qrMail, qrOrt } from '../lib/qr.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/** Aus dem Formular die Zeile bauen, die im Code steckt. */
export function qrInhalt(d){
  switch (d.art){
    case 'wlan':
      return has(d.wlanNetz) ? qrWlan(d.wlanNetz, d.wlanPass || '', d.wlanArt || 'WPA') : '';
    case 'telefon':
      return has(d.telefon) ? qrTelefon(d.telefon) : '';
    case 'mail':
      return has(d.mail) ? qrMail(d.mail, d.mailBetreff) : '';
    case 'ort':
      return has(d.ort) ? qrOrt(d.ort) : '';
    case 'text':
      return String(d.freitext || '');
    default: {
      if (!has(d.url)) return '';
      return /^[a-z]+:\/\//i.test(d.url) ? d.url : 'https://' + d.url;
    }
  }
}

/** Was unter dem Code zum Abtippen steht — nie das Passwort. */
function qrKlartext(d){
  switch (d.art){
    case 'wlan':    return has(d.wlanNetz) ? 'WLAN: ' + d.wlanNetz : '';
    case 'telefon': return d.telefon || '';
    case 'mail':    return d.mail || '';
    case 'ort':     return d.ort || '';
    case 'text':    return '';
    default:        return d.url || '';
  }
}

export default {
  id:'qrplakat',
  title:'QR-Aushang',
  sub:'WLAN, Link, Telefon oder Adresse als grosser Code · A4 hoch',
  badge:'QR-Code',
  badgeCyan:true,
  page:'a4',
  root:'t-qrp',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'hilfe',

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="62" fill="#2A3350"/>
    <rect x="18" y="18" width="118" height="14" rx="4" fill="#fff" opacity=".92"/>
    <rect x="18" y="40" width="76" height="8" rx="4" fill="#01B1E2"/>
    <rect x="43" y="86" width="124" height="124" rx="6" fill="#fff" stroke="#E5E8ED" stroke-width="2"/>
    ${[0,1,2,3,4,5,6,7,8,9].map(r => [0,1,2,3,4,5,6,7,8,9].map(c =>
      ((r * 5 + c * 3 + (r * c) % 4) % 3 < 2)
        ? `<rect x="${51 + c * 11}" y="${94 + r * 11}" width="9" height="9" fill="#2A3350"/>` : '').join('')).join('')}
    <rect x="51" y="94" width="31" height="31" fill="#fff"/>
    <rect x="51" y="94" width="31" height="31" fill="none" stroke="#2A3350" stroke-width="7"/>
    <rect x="128" y="94" width="31" height="31" fill="#fff"/>
    <rect x="128" y="94" width="31" height="31" fill="none" stroke="#2A3350" stroke-width="7"/>
    <rect x="51" y="171" width="31" height="31" fill="#fff"/>
    <rect x="51" y="171" width="31" height="31" fill="none" stroke="#2A3350" stroke-width="7"/>
    <rect x="55" y="226" width="100" height="9" rx="4.5" fill="#2A3350"/>
    <rect x="40" y="248" width="130" height="6" rx="3" fill="#C9CFDA"/>
    <rect x="58" y="262" width="94" height="6" rx="3" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Was steckt im Code' },
    { k:'art', label:'Art', type:'select', options:[
      { v:'adresse', t:'Internetadresse' },
      { v:'wlan',    t:'WLAN-Zugang' },
      { v:'telefon', t:'Telefonnummer' },
      { v:'mail',    t:'E-Mail-Adresse' },
      { v:'ort',     t:'Adresse für die Karten-App' },
      { v:'text',    t:'Freier Text' }
    ] },
    { t:'note', label:'Nur die Felder der gewählten Art werden verwendet — die übrigen dürfen stehen bleiben.' },

    { k:'url', label:'Internetadresse', type:'text',
      hint:'Ohne «https://» geht auch; es wird ergänzt.' },

    { k:'wlanNetz', label:'WLAN-Name (SSID)', type:'text' },
    { k:'wlanPass', label:'WLAN-Passwort', type:'text',
      hint:'Bleibt in diesem Browser und geht an keinen Dienst. Es steht aber im gedruckten Code und im Teilen-Link — den Aushang deshalb als PDF weitergeben, nicht als Link.' },
    { k:'wlanArt', label:'Verschlüsselung', type:'select',
      options:[{v:'WPA',t:'WPA / WPA2 / WPA3'},{v:'WEP',t:'WEP'},{v:'nopass',t:'offen'}] },

    { k:'telefon',    label:'Telefonnummer', type:'text' },
    { k:'mail',       label:'E-Mail-Adresse', type:'text' },
    { k:'mailBetreff',label:'Betreff (freiwillig)', type:'text' },
    { k:'ort',        label:'Adresse', type:'text' },
    { k:'freitext',   label:'Freier Text', type:'textarea' },

    { t:'group', label:'Code' },
    { k:'stufe', label:'Fehlerkorrektur', type:'select', options:[
      { v:'L', t:'L — klein, wenig Reserve' },
      { v:'M', t:'M — normal' },
      { v:'Q', t:'Q — robust (empfohlen für Aushänge)' },
      { v:'H', t:'H — sehr robust, grösstes Muster' }
    ], hint:'Höhere Stufe verzeiht Knicke und Fingerabdrücke, macht das Muster aber feiner.' },
    { k:'qrMass', label:'Kantenlänge in mm', type:'number', min:20, max:150, step:5 },
    { k:'zeigeText', label:'Zeile zum Abtippen zeigen', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },

    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'unter',   label:'Untertitel', type:'text' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen', label:'Sprachen der Anleitung', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },
    { k:'setzeSprachen', label:'Zusammenstellung übernehmen', type:'action' },
    { k:'de', label:'Anleitung Deutsch',   type:'text' },
    { k:'en', label:'Anleitung English',   type:'text' },
    { k:'fr', label:'Anleitung Français',  type:'text' },
    { k:'it', label:'Anleitung Italiano',  type:'text' },
    { k:'pt', label:'Anleitung Português', type:'text' },
    { k:'es', label:'Anleitung Español',   type:'text' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() }
  ],

  defaults:{
    art:'wlan',
    url:'elpollo619.github.io/N-s-Hotel-template-system',
    wlanNetz:'Gast',
    wlanPass:'',
    wlanArt:'WPA',
    telefon:'+41 31 951 85 54',
    mail:'info@ns-hotel.ch',
    mailBetreff:'',
    ort:'Allmendstrasse 14, 3210 Kerzers',
    freitext:'',
    stufe:'Q',
    qrMass:88,
    zeigeText:'ja',
    eyebrow:'Einfach scannen',
    titel:'WLAN',
    unter:'Kamera auf den Code halten — das Handy verbindet sich von selbst.',
    sprachen:['de','en','fr','it'],
    sprachSet:'',
    de:'Kamera öffnen, auf den Code halten, auf die Meldung tippen.',
    en:'Open the camera, point it at the code, tap the message.',
    fr:'Ouvrez lʼappareil photo, visez le code, touchez le message.',
    it:'Aprite la fotocamera, inquadrate il codice, toccate il messaggio.',
    pt:'Abra a câmara, aponte para o código, toque na mensagem.',
    es:'Abra la cámara, apunte al código y toque el mensaje.',
    objekt:'A14',
    absender:'hotel'
  },

  actions:{
    setzeSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = ABSENDER[d.absender] || ABSENDER.hotel;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const inhalt = qrInhalt(d);
    const mass = Math.max(20, Math.min(150, Number(d.qrMass) || 88));

    let code = '';
    let warnung = '';
    if (!inhalt){
      warnung = 'Für diese Art fehlt noch die Angabe — der Code bleibt leer.';
    } else {
      try {
        code = qrSvg(inhalt, { stufe:d.stufe || 'Q', groesse:mass + 'mm', farbe:'#1A1A1A' });
      } catch (err){
        warnung = err.message;
      }
    }

    const klartext = d.zeigeText !== 'nein' ? qrKlartext(d) : '';
    const zeilen = sprachObjekte(d.sprachen)
      .map(sp => has(d[sp.id])
        ? `<li lang="${sp.id}"><span>${esc(sp.kurz)}</span>${esc(d[sp.id])}</li>` : '')
      .join('');

    return `
    ${warnung ? `<p class="t-qrp-todo no-print">${esc(warnung)}</p>` : ''}
    <header class="t-qrp-head">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-qrp-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(d.titel)}</h1>
        ${has(d.unter) ? `<p class="t-qrp-unter">${fmt(d.unter)}</p>` : ''}
      </div>
      ${istHotel(d.absender) ? `<div class="t-qrp-logo">${logo('white', 34)}</div>` : ''}
    </header>

    <div class="t-qrp-mitte">
      <div class="t-qrp-code">${code}</div>
      ${has(klartext) ? `<p class="t-qrp-klar">${esc(klartext)}</p>` : ''}
    </div>

    ${zeilen ? `<ul class="t-qrp-sprachen">${zeilen}</ul>` : ''}

    <footer class="t-qrp-foot">
      <span>${istHotel(d.absender) ? esc(abs.name) : esc(abs.legal)}</span>
      <span>${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
    </footer>`;
  }
};
