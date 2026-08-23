/* Foto-Aushang · A4 — ein Bild, ein Satz.
   Ersetzt die Zettel aus dem Laufwerk, die aus einem Foto und einer
   aufgeklebten Zeile bestehen ("A14 breakfast foto mit info", die
   Regel-Bilder). Statt Bild in Word ziehen und Textfeld darüberlegen:
   Bild hochladen, Zeile schreiben, drucken.

   Das Bild bleibt im Browser. Es wird als Data-URI im Entwurf gespeichert
   und beim Drucken direkt gezeichnet — es geht an keinen Dienst.

   Schnittmarken und Beschnitt: nur für den Fall, dass ein Aushang einmal
   in eine richtige Druckerei geht. Auf dem Bürodrucker bleibt beides aus. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const FOTO_PAGES = { a4:'a4', 'a4-land':'a4-land', a5:'a5', 'a5-land':'a5-land' };

/* Wie viel Platz das Bild bekommt. */
const FOTO_ANTEIL = { klein:'42%', halb:'55%', gross:'68%', voll:'100%' };

export default {
  id:'foto',
  title:'Foto-Aushang',
  sub:'Ein Bild, ein Satz — Frühstück, Hausregeln, Hinweise · A4',
  badge:'Foto',
  badgeCyan:true,
  root:'t-foto',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'hotel',
  pageOf(d){ return FOTO_PAGES[d && d.format] || 'a4'; },

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="172" fill="#C9CFDA"/>
    <circle cx="66" cy="52" r="20" fill="#EDF0F4"/>
    <path d="M0 172 62 104l40 34 34-28 74 62Z" fill="#8B8F99"/>
    <rect x="0" y="172" width="210" height="125" fill="#fff"/>
    <rect x="18" y="192" width="80" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="18" y="212" width="150" height="16" rx="5" fill="#2A3350"/>
    <rect x="18" y="238" width="120" height="16" rx="5" fill="#2A3350"/>
    <rect x="18" y="266" width="100" height="6" rx="3" fill="#C9CFDA"/>
    <rect x="18" y="278" width="86" height="6" rx="3" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Bild' },
    { k:'bild', label:'Foto', type:'image',
      hint:'Bleibt in diesem Browser. Für A4 reicht ein Bild mit rund 1600 Pixel Breite — grössere machen den Entwurf nur schwer.' },
    { k:'anteil', label:'Bildanteil', type:'select', options:[
      { v:'klein', t:'klein — viel Platz für Text' },
      { v:'halb',  t:'gut die Hälfte' },
      { v:'gross', t:'gross' },
      { v:'voll',  t:'ganzes Blatt, Text darüber' }
    ] },
    { k:'lage', label:'Bildausschnitt', type:'select', options:[
      { v:'center', t:'Mitte' }, { v:'top', t:'oben' }, { v:'bottom', t:'unten' },
      { v:'left', t:'links' }, { v:'right', t:'rechts' }
    ], hint:'Welcher Teil des Bildes sichtbar bleibt, wenn es nicht genau passt.' },
    { k:'dunkel', label:'Abdunkeln (für Text auf dem Bild)', type:'select', options:[
      { v:'nein', t:'nicht abdunkeln' }, { v:'wenig', t:'leicht' }, { v:'viel', t:'stark' }
    ] },

    { t:'group', label:'Format' },
    { k:'format', label:'Papier', type:'select', options:[
      { v:'a4', t:'A4 hoch' }, { v:'a4-land', t:'A4 quer' },
      { v:'a5', t:'A5 hoch' }, { v:'a5-land', t:'A5 quer' }
    ] },

    { t:'group', label:'Text' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text' },
    { k:'unter',   label:'Untertitel', type:'textarea', hint:'**fett** möglich' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen', label:'Sprachen der Zusatzzeile', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },
    { k:'setzeSprachen', label:'Zusammenstellung übernehmen', type:'action' },
    { k:'de', label:'Deutsch',   type:'text' },
    { k:'en', label:'English',   type:'text' },
    { k:'fr', label:'Français',  type:'text' },
    { k:'it', label:'Italiano',  type:'text' },
    { k:'pt', label:'Português', type:'text' },
    { k:'es', label:'Español',   type:'text' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions },

    { t:'group', label:'Für die Druckerei' },
    { t:'note', label:'Nur nötig, wenn der Aushang extern gedruckt wird. Auf dem Bürodrucker beides ausgeschaltet lassen — sonst stehen die Marken mit auf dem Blatt.' },
    { k:'marken', label:'Schnittmarken', type:'select',
      options:[{v:'nein',t:'aus'},{v:'ja',t:'ein'}] },
    { k:'beschnitt', label:'Beschnitt in mm', type:'number', min:0, max:10, step:1,
      hint:'Das Bild läuft um diesen Rand über das Blatt hinaus, damit nach dem Schneiden keine weisse Kante bleibt. Üblich sind 3 mm.' }
  ],

  defaults:{
    bild:'',
    anteil:'halb',
    lage:'center',
    dunkel:'nein',
    format:'a4',
    eyebrow:'Guten Morgen',
    titel:'Frühstück 07:30 – 10:00',
    unter:'Im Aufenthaltsraum im Erdgeschoss. **Bitte das Geschirr zurückbringen.**',
    sprachen:['de','en','fr'],
    sprachSet:'',
    de:'Frühstück von 07:30 bis 10:00 im Aufenthaltsraum.',
    en:'Breakfast from 07:30 to 10:00 in the lounge.',
    fr:'Petit-déjeuner de 07h30 à 10h00 dans lʼespace commun.',
    it:'Colazione dalle 07:30 alle 10:00 nella sala comune.',
    pt:'Pequeno-almoço das 07:30 às 10:00 na sala comum.',
    es:'Desayuno de 07:30 a 10:00 en la sala común.',
    objekt:'A14',
    absender:'hotel',
    marken:'nein',
    beschnitt:0
  },

  actions:{
    setzeSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const voll = d.anteil === 'voll';
    const anteil = FOTO_ANTEIL[d.anteil] || FOTO_ANTEIL.halb;
    const beschnitt = Math.max(0, Math.min(10, Number(d.beschnitt) || 0));
    const marken = d.marken === 'ja';

    const bild = has(d.bild)
      ? `<img class="t-foto-bild" src="${esc(d.bild)}" alt=""
             style="object-position:${esc(d.lage || 'center')}">`
      : `<div class="t-foto-leer">Hier ein Foto einsetzen</div>`;

    const schleier = d.dunkel === 'viel' ? ' is-dunkel-viel'
                   : d.dunkel === 'wenig' ? ' is-dunkel-wenig' : '';

    const zeilen = sprachObjekte(d.sprachen)
      .map(sp => has(d[sp.id])
        ? `<li lang="${sp.id}"><span>${esc(sp.kurz)}</span>${esc(d[sp.id])}</li>` : '')
      .join('');

    const text = `
      <div class="t-foto-txt">
        ${has(d.eyebrow) ? `<p class="eyebrow t-foto-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        ${has(d.titel) ? `<h1>${esc(d.titel)}</h1>` : ''}
        ${has(d.unter) ? `<p class="t-foto-unter">${fmt(d.unter)}</p>` : ''}
        ${zeilen ? `<ul class="t-foto-sprachen">${zeilen}</ul>` : ''}
      </div>`;

    /* Schnittmarken sitzen in den Ecken, ausserhalb des Beschnitts. Sie
       zeigen der Druckerei, wo das Blatt beschnitten wird. */
    const schnitt = marken ? `
      <div class="t-foto-marken" style="--bs:${beschnitt}mm">
        ${['lo','ro','lu','ru'].map(e => `<i class="m-${e}"></i>`).join('')}
      </div>` : '';

    return `
    <div class="t-foto-blatt${voll ? ' is-voll' : ''}${schleier}"
         style="--anteil:${anteil};--bs:${beschnitt}mm">
      <div class="t-foto-rahmen">${bild}</div>
      ${voll ? `<div class="t-foto-ueber">${text}</div>` : text}
      <footer class="t-foto-foot">
        <span>${istHotel(d.absender) ? logo(voll ? 'white' : 'color', 24) : esc(abs.legal)}</span>
        <span>${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
      </footer>
    </div>
    ${schnitt}`;
  }
};
