/* Grossflächenplakat · aus mehreren A4-Blättern zusammengesetzt.
   Für das, was auf ein A4 nicht wirkt: SAMMELPLATZ auf dem Parkplatz,
   ein Hinweis über einer Baustellenabschrankung, ein Wegweiser im
   Treppenhaus, der aus zwanzig Metern lesbar sein muss.

   Gedruckt wird auf dem gewöhnlichen Bürodrucker. Jedes Blatt zeigt einen
   Ausschnitt des grossen Plakats; die Blätter überlappen sich um wenige
   Millimeter, damit sie sich sauber überkleben lassen. Die gestrichelte
   Linie markiert, wo das nächste Blatt beginnt.

   Erste Seite ist eine Bauanleitung: das ganze Plakat verkleinert, mit
   numerierten Feldern. Ohne sie liegen nachher zwölf gleich aussehende
   Blätter auf dem Tisch. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { szSvg, szZeichen, szOptions } from '../lib/sicherheitszeichen.js';
import { sprachOptions, sprachObjekte } from '../lib/sprachen.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/* A4 hoch in Millimetern — das Papier, auf dem gedruckt wird. */
const BLATT_B = 210, BLATT_H = 297;

/* Mittlere Zeichenbreite im Verhältnis zur Schrifthöhe, für Grossbuchstaben
   in einer fetten Geometrischen (Gotham, ersatzweise Montserrat). Gemessen
   statt geraten: reicht, um ein zu langes Wort auf die Plakatbreite
   einzupassen, statt es abzuschneiden. */
const ZEICHEN_BREITE = 0.70;

/** Grösste Schrifthöhe in mm, bei der ein Wort noch auf die Breite passt. */
export function passendeGroesse(wort, breiteMm, gewuenschtMm){
  const zeichen = String(wort || '').length;
  if (!zeichen) return gewuenschtMm;
  /* 12 % Rand links und rechts wie im Layout. */
  const platz = breiteMm * 0.88;
  return Math.min(gewuenschtMm, platz / (zeichen * ZEICHEN_BREITE));
}

/** Die Masse eines Plakats aus n × m Blättern mit Überlappung. */
export function plakatMass(spalten, zeilen, ueberlappung){
  const s = Math.max(1, Math.min(4, Number(spalten) || 1));
  const z = Math.max(1, Math.min(4, Number(zeilen) || 1));
  const ue = Math.max(0, Math.min(20, Number(ueberlappung) || 0));
  return {
    spalten:s, zeilen:z, ue,
    schrittX:BLATT_B - ue, schrittY:BLATT_H - ue,
    breite:s * (BLATT_B - ue) + ue,
    hoehe: z * (BLATT_H - ue) + ue
  };
}

export default {
  id:'grossplakat',
  title:'Grossflächenplakat',
  sub:'Ein grosses Plakat aus mehreren A4-Blättern · zum Zusammenkleben',
  badge:'Gross',
  root:'t-gross',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'sicherheit',
  page:'a4',
  multipage:true,

  thumb: thumb(`
    <rect x="14" y="16" width="182" height="128" rx="4" fill="#F6F7FA" stroke="#C9CFDA" stroke-width="2"/>
    <path d="M105 16v128M14 80h182" stroke="#C9CFDA" stroke-width="1.6" stroke-dasharray="5 4"/>
    <text x="105" y="72" font-family="sans-serif" font-size="30" font-weight="700"
          text-anchor="middle" fill="#2A3350">A2</text>
    <rect x="14" y="164" width="86" height="118" rx="4" fill="#2A3350"/>
    <rect x="110" y="164" width="86" height="118" rx="4" fill="#2A3350" opacity=".35"/>
    <rect x="26" y="200" width="62" height="20" rx="4" fill="#fff" opacity=".9"/>
    <rect x="26" y="228" width="40" height="12" rx="4" fill="#01B1E2"/>
    <text x="153" y="232" font-family="sans-serif" font-size="26" font-weight="700"
          text-anchor="middle" fill="#fff" opacity=".55">2</text>`),

  fields:[
    { t:'group', label:'Grösse' },
    { t:'note', label:'Zwei mal zwei Blätter ergeben rund A2, drei mal drei rund A1. Die genauen Masse stehen über der Vorschau.' },
    { k:'spalten', label:'Blätter nebeneinander', type:'number', min:1, max:4, step:1 },
    { k:'zeilen',  label:'Blätter untereinander', type:'number', min:1, max:4, step:1 },
    { k:'ueberlappung', label:'Überlappung in mm', type:'number', min:0, max:20, step:1,
      hint:'Damit sich die Blätter überkleben lassen. 10 mm sind bequem; 0 heisst auf Stoss schneiden.' },
    { k:'plan', label:'Bauanleitung als erste Seite', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },

    { t:'group', label:'Inhalt' },
    { k:'wort',  label:'Grosses Wort', type:'text' },
    { k:'wortMm',label:'Schrifthöhe in mm', type:'number', min:20, max:400, step:5,
      hint:'Faustregel: aus 20 m Abstand braucht es rund 50 mm x-Höhe — die Anzeige links rechnet mit. Passt das Wort nicht auf die Breite, wird die Höhe automatisch verkleinert; mehr Blätter nebeneinander schaffen wieder Platz.' },
    { k:'unter', label:'Zeile darunter', type:'text' },
    { k:'unterMm', label:'Schrifthöhe darunter in mm', type:'number', min:8, max:120, step:2 },

    { t:'group', label:'Zeichen' },
    { k:'zeichen', label:'Sicherheitszeichen', type:'select',
      options:[{v:'',t:'kein Zeichen'}].concat(szOptions()) },
    { k:'zeichenMm', label:'Zeichengrösse in mm', type:'number', min:30, max:400, step:10 },

    { t:'group', label:'Farben' },
    { k:'grund', label:'Hintergrund', type:'color' },
    { k:'schrift', label:'Schrift', type:'color' },

    { t:'group', label:'Sprachen' },
    { k:'sprachen', label:'Zusatzzeilen', type:'checks', options:sprachOptions() },
    { k:'de', label:'Deutsch',   type:'text' },
    { k:'en', label:'English',   type:'text' },
    { k:'fr', label:'Français',  type:'text' },
    { k:'it', label:'Italiano',  type:'text' },
    { k:'pt', label:'Português', type:'text' },
    { k:'es', label:'Español',   type:'text' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() }
  ],

  defaults:{
    spalten:2, zeilen:2, ueberlappung:10, plan:'ja',
    wort:'SAMMELPLATZ',
    wortMm:70,
    unter:'Assembly point · Point de rassemblement',
    unterMm:20,
    zeichen:'sammelplatz',
    zeichenMm:150,
    grund:'#00843D',
    schrift:'#FFFFFF',
    sprachen:['de','en'],
    de:'Hier sammeln sich alle im Notfall.',
    en:'In an emergency, everyone gathers here.',
    fr:'En cas dʼurgence, tout le monde se rassemble ici.',
    it:'In caso di emergenza ci si raduna qui.',
    pt:'Em caso de emergência, todos se reúnem aqui.',
    es:'En caso de emergencia, todos se reúnen aquí.',
    objekt:'A14',
    absender:'hotel'
  },

  render(d){
    const m = plakatMass(d.spalten, d.zeilen, d.ueberlappung);
    const abs = ABSENDER[d.absender] || ABSENDER.hotel;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const zahl = (v, min, max, weich) =>
      Math.max(min, Math.min(max, Number(v) || weich));

    const wortMm    = passendeGroesse(d.wort, m.breite, zahl(d.wortMm, 20, 400, 70));
    const unterMm   = passendeGroesse(d.unter, m.breite, zahl(d.unterMm, 8, 120, 20));
    const zeichenMm = zahl(d.zeichenMm, 30, 400, 150);
    const z = has(d.zeichen) ? szZeichen(d.zeichen) : null;

    const zeilen = sprachObjekte(d.sprachen)
      .map(sp => has(d[sp.id])
        ? `<li lang="${sp.id}">${esc(d[sp.id])}</li>` : '').join('');

    /* Das ganze Plakat einmal — jedes Blatt zeigt einen Ausschnitt davon. */
    const welt = `
      <div class="t-gross-welt" style="width:${m.breite}mm;height:${m.hoehe}mm;
           background:${esc(d.grund)};color:${esc(d.schrift)}">
        ${z ? `<div class="t-gross-zeichen">${szSvg(z.art, z.pikto, zeichenMm)}</div>` : ''}
        ${has(d.wort) ? `<h1 style="font-size:${wortMm.toFixed(1)}mm">${esc(d.wort)}</h1>` : ''}
        ${has(d.unter) ? `<p class="t-gross-unter" style="font-size:${unterMm.toFixed(1)}mm">${esc(d.unter)}</p>` : ''}
        ${zeilen ? `<ul class="t-gross-sprachen" style="font-size:${Math.max(5, unterMm * 0.45)}mm">${zeilen}</ul>` : ''}
        <footer class="t-gross-foot" style="font-size:${Math.max(3.5, unterMm * 0.3)}mm">
          <span>${istHotel(d.absender) ? esc(abs.name) : esc(abs.legal)}</span>
          <span>${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
        </footer>
      </div>`;

    const seiten = [];

    /* Bauanleitung: das Plakat verkleinert, mit numerierten Feldern. */
    if (d.plan !== 'nein' && m.spalten * m.zeilen > 1){
      const passt = Math.min(150 / m.breite, 170 / m.hoehe);
      const felder = [];
      for (let r = 0; r < m.zeilen; r++){
        for (let c = 0; c < m.spalten; c++){
          felder.push(`<span class="t-gross-feld" style="
            left:${c * m.schrittX * passt}mm; top:${r * m.schrittY * passt}mm;
            width:${BLATT_B * passt}mm; height:${BLATT_H * passt}mm">${r * m.spalten + c + 1}</span>`);
        }
      }
      seiten.push(`
      <article data-page class="t-gross-plan">
        <h2>Bauanleitung</h2>
        <p class="t-gross-mass">
          ${m.spalten} × ${m.zeilen} Blätter A4 · fertiges Plakat
          <b>${Math.round(m.breite)} × ${Math.round(m.hoehe)} mm</b>
          ${m.ue ? ` · ${m.ue} mm Überlappung` : ' · auf Stoss'}
        </p>
        <div class="t-gross-vorschau" style="width:${m.breite * passt}mm;height:${m.hoehe * passt}mm">
          <div class="t-gross-mini" style="transform:scale(${passt})">${welt}</div>
          ${felder.join('')}
        </div>
        <ol class="t-gross-schritte">
          <li>Alle ${m.spalten * m.zeilen} Blätter drucken — <b>Ränder: keine</b>, <b>Skalierung: 100 %</b>.
              Wird verkleinert, passen die Blätter nicht zusammen.</li>
          ${m.ue
            ? `<li>Bei jedem Blatt den Rand <b>rechts und unten</b> an der gestrichelten Linie abschneiden — dort liegt das nächste Blatt darüber.</li>
               <li>Reihe für Reihe überlappend zusammenkleben, den Nummern nach.</li>`
            : `<li>Alle Blätter an den gestrichelten Linien beschneiden.</li>
               <li>Auf Stoss aneinanderlegen und von hinten zusammenkleben, den Nummern nach.</li>`}
          <li>Von hinten mit Klebeband verstärken; für draussen einlaminieren.</li>
        </ol>
      </article>`);
    }

    for (let r = 0; r < m.zeilen; r++){
      for (let c = 0; c < m.spalten; c++){
        const nr = r * m.spalten + c + 1;
        seiten.push(`
        <article data-page class="t-gross-blatt">
          <div class="t-gross-fenster" style="left:${-c * m.schrittX}mm;top:${-r * m.schrittY}mm">
            ${welt}
          </div>
          ${m.ue ? `
            ${c < m.spalten - 1 ? `<i class="t-gross-kante is-rechts" style="right:${m.ue}mm"></i>` : ''}
            ${r < m.zeilen - 1 ? `<i class="t-gross-kante is-unten" style="bottom:${m.ue}mm"></i>` : ''}` : ''}
          <span class="t-gross-nr">${nr} / ${m.spalten * m.zeilen}
            <em>Reihe ${r + 1}, Spalte ${c + 1}</em></span>
        </article>`);
      }
    }
    return seiten.join('');
  }
};
