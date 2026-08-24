/* Öffentlicher Parkplatz in der Nähe · A4 hoch, eine Seite je Sprache.
   --------------------------------------------------------------------------
   Portiert aus dem Kit "Öffentlicher Parkplatz - Kit" (Drive). Der Aushang
   weist Gäste zum grossen öffentlichen Parkplatz gleich neben dem Haus und
   erklärt in einem Zug: Weg (Lageplan), Tarif und Zeiten, wie man an der
   Parkuhr bezahlt und — das Wichtigste — dass man das Kennzeichen eingeben
   muss, sonst gibt es eine Busse.

   Der Lageplan ist eine eigene, gezeichnete Vektor-Karte (kein swisstopo-
   Kachelbild), damit das Blatt auch offline und im Standalone funktioniert.

   Die sechs Sprachfassungen stehen fest hinterlegt; gewählt wird über die
   Kästchen. Ort, Weg-Minuten, Stundentarif und Kontakt sind Felder — für
   einen neuen Standort ändert man nur diese, der Rest bleibt gleich. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { sprachObjekte, sprachOptions } from '../lib/sprachen.js';
import { KARTEN_STILE, KARTEN_ZOOM, kartenLink, kartenAdresse, kartenAusschnitt } from '../lib/geokarte.js';

/* ---------- Piktogramme des Aushangs (aus dem Kit übernommen) ---------- */
const OPP_IC = {
  map:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 9.5h19"/></svg>',
  coins:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 15v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.5-2-2.7-4.7-2.95"/></svg>',
  qr:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-7"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
  plate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6.5" width="19" height="11" rx="2"/><path d="M6.5 10v4M9.5 10v4M13.5 10h2M13.5 14h2M18 10v4"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6 22 20.2H2L12 3.6Z"/><path d="M12 10v4.2"/><path d="M12 17.4h.01"/></svg>'
};

/* ---------- gezeichnete Bäume für den Lageplan ---------- */
function oppTree(x, y, r){
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<ellipse cx="0" cy="' + (r * 0.7) + '" rx="' + (r * 0.9) + '" ry="' + (r * 0.32) + '" fill="#000" opacity=".07"/>' +
    '<circle cx="0" cy="0" r="' + r + '" fill="#A9CE97"/>' +
    '<circle cx="' + (-r * 0.3) + '" cy="' + (-r * 0.3) + '" r="' + (r * 0.6) + '" fill="#BFDDB0"/>' +
    '</g>';
}
function oppTreeSet(){
  return '<g>' +
    oppTree(46, 64, 9) + oppTree(104, 40, 7) + oppTree(168, 78, 8) + oppTree(258, 50, 7) +
    oppTree(566, 44, 8) + oppTree(626, 26, 7) + oppTree(700, 74, 9) +
    oppTree(40, 338, 8) + oppTree(196, 358, 7) + oppTree(712, 322, 9) + oppTree(636, 360, 7) +
    '</g>';
}

/* ---------- Lageplan: eigene Vektor-Karte (offline) ----------
   Schematischer Wegweiser Hotel → öffentlicher Parkplatz mit Strassen,
   Bahnviadukt, Parkfeld, Fussweg und den beiden Marken-Pins.
   `uid` macht die Verlauf-IDs je Seite eindeutig (mehrseitiges Blatt). */
function oppMap(t, uid){
  const gPark = 'oppPark-' + uid, gHotel = 'oppHotel-' + uid,
        gDeck = 'oppDeck-' + uid, ties = 'oppTies-' + uid;
  return (
'<svg viewBox="0 0 760 384" role="img" aria-label="' + esc(t.mapTitle) + '">' +
  '<defs>' +
    '<linearGradient id="' + gPark + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#36c8ef"/><stop offset="1" stop-color="#01B1E2"/></linearGradient>' +
    '<linearGradient id="' + gHotel + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c486b"/><stop offset="1" stop-color="#2A3350"/></linearGradient>' +
    '<linearGradient id="' + gDeck + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D2D7E0"/><stop offset="1" stop-color="#C2C8D4"/></linearGradient>' +
    '<pattern id="' + ties + '" width="11" height="11" patternTransform="rotate(57)" patternUnits="userSpaceOnUse">' +
      '<rect width="11" height="11" fill="none"/><line x1="5.5" y1="0" x2="5.5" y2="11" stroke="#AEB5C3" stroke-width="3"/>' +
    '</pattern>' +
  '</defs>' +
  '<rect width="760" height="384" fill="#E8EDE7"/>' +
  '<g fill="#D3E5C9">' +
    '<path d="M0 0 H320 C 240 86, 150 122, 0 142 Z"/>' +
    '<path d="M486 0 H760 V128 C 650 92, 548 56, 486 0 Z"/>' +
    '<path d="M0 296 H214 L300 384 H0 Z"/>' +
    '<path d="M566 384 H760 V250 C 666 296, 604 348, 566 384 Z"/>' +
  '</g>' +
  '<rect x="34" y="206" width="200" height="96" rx="7" fill="#DFE3EA" stroke="#CBD1DC"/>' +
  '<g stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round">' +
    '<line x1="58" y1="214" x2="58" y2="248"/><line x1="84" y1="214" x2="84" y2="248"/><line x1="110" y1="214" x2="110" y2="248"/><line x1="136" y1="214" x2="136" y2="248"/><line x1="162" y1="214" x2="162" y2="248"/><line x1="188" y1="214" x2="188" y2="248"/><line x1="214" y1="214" x2="214" y2="248"/>' +
    '<line x1="46" y1="260" x2="46" y2="294"/><line x1="72" y1="260" x2="72" y2="294"/><line x1="98" y1="260" x2="98" y2="294"/><line x1="124" y1="260" x2="124" y2="294"/><line x1="176" y1="260" x2="176" y2="294"/><line x1="202" y1="260" x2="202" y2="294"/>' +
  '</g>' +
  '<g>' +
    '<rect x="60" y="218" width="20" height="27" rx="3" fill="#9aa3b4"/>' +
    '<rect x="113" y="218" width="20" height="27" rx="3" fill="#b6bdc9"/>' +
    '<rect x="100" y="263" width="20" height="27" rx="3" fill="#a7afbe"/>' +
  '</g>' +
  '<g stroke="#B7BFCD" stroke-width="1">' +
    '<rect x="524" y="116" width="88" height="50" rx="3" fill="#D6DBE3"/>' +
    '<rect x="628" y="118" width="112" height="46" rx="3" fill="#C8D0DD"/>' +
    '<rect x="540" y="180" width="84" height="54" rx="3" fill="#D6DBE3"/>' +
    '<rect x="636" y="182" width="104" height="54" rx="3" fill="#D6DBE3"/>' +
  '</g>' +
  oppTreeSet() +
  '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M760 246 C 632 246, 540 256, 440 258 C 332 260, 214 260, 30 252" stroke="#C2C9D6" stroke-width="38"/>' +
    '<path d="M414 258 C 374 198, 336 110, 304 14" stroke="#C2C9D6" stroke-width="32"/>' +
    '<path d="M760 246 C 632 246, 540 256, 440 258 C 332 260, 214 260, 30 252" stroke="#FFFFFF" stroke-width="30"/>' +
    '<path d="M414 258 C 374 198, 336 110, 304 14" stroke="#FFFFFF" stroke-width="24"/>' +
  '</g>' +
  '<path d="M760 246 C 632 246, 540 256, 440 258 C 332 260, 214 260, 30 252" fill="none" stroke="#DADEE6" stroke-width="2.4" stroke-dasharray="11 11" stroke-linecap="round"/>' +
  '<path d="M268 -12 L592 396 L546 396 L222 -12 Z" fill="#2A3350" opacity=".09"/>' +
  '<g>' +
    '<path d="M252 -12 L562 396 L520 396 L210 -12 Z" fill="url(#' + gDeck + ')"/>' +
    '<path d="M252 -12 L562 396 L520 396 L210 -12 Z" fill="url(#' + ties + ')"/>' +
    '<line x1="231" y1="-12" x2="541" y2="396" stroke="#AAB2C0" stroke-width="3"/>' +
    '<line x1="252" y1="-12" x2="562" y2="396" stroke="#9098a7" stroke-width="2"/>' +
    '<line x1="210" y1="-12" x2="520" y2="396" stroke="#9098a7" stroke-width="2"/>' +
    '<line x1="240" y1="-12" x2="550" y2="396" stroke="#EDEFF3" stroke-width="2" opacity=".8"/>' +
    '<line x1="222" y1="-12" x2="532" y2="396" stroke="#EDEFF3" stroke-width="2" opacity=".8"/>' +
    '<g fill="#AEB5C3" stroke="#9098a7" stroke-width="1">' +
      '<ellipse cx="320" cy="92" rx="13" ry="5" fill="#2A3350" stroke="none" opacity=".12"/><rect x="312" y="74" width="14" height="18" rx="2"/>' +
      '<ellipse cx="470" cy="290" rx="13" ry="5" fill="#2A3350" stroke="none" opacity=".12"/><rect x="462" y="272" width="14" height="18" rx="2"/>' +
    '</g>' +
  '</g>' +
  '<g font-family="Montserrat,sans-serif" font-weight="700" fill="#7A8090" letter-spacing=".04em">' +
    '<text x="556" y="240" font-size="12.5">' + esc(t.strasseHotel) + '</text>' +
    '<text x="372" y="150" font-size="12.5" transform="rotate(-66 372 150)">' + esc(t.strassePark) + '</text>' +
  '</g>' +
  '<g fill="none" stroke-linecap="round">' +
    '<path d="M610 176 C 610 214, 588 244, 540 250 C 466 258, 360 260, 250 259 C 212 259, 176 258, 150 256" stroke="#FFFFFF" stroke-width="12"/>' +
    '<path d="M610 176 C 610 214, 588 244, 540 250 C 466 258, 360 260, 250 259 C 212 259, 176 258, 150 256" stroke="#1F9D57" stroke-width="6" stroke-dasharray="0.5 11"/>' +
  '</g>' +
  '<g transform="translate(140 250)">' +
    '<ellipse cx="0" cy="4" rx="14" ry="4.5" fill="#000" opacity=".18"/>' +
    '<path d="M0 0 C 19 -16, 19 -40, 0 -40 C -19 -40, -19 -16, 0 0 Z" fill="url(#' + gPark + ')" stroke="#0e9ec9" stroke-width="1"/>' +
    '<circle cx="0" cy="-26" r="12.5" fill="#fff"/>' +
    '<text x="0" y="-20.5" text-anchor="middle" font-family="var(--font-display),Montserrat,sans-serif" font-size="18" font-weight="700" fill="#01B1E2">P</text>' +
  '</g>' +
  '<g font-family="var(--font-display),Montserrat,sans-serif" text-anchor="middle">' +
    '<text x="140" y="324" font-size="13" font-weight="700" fill="#2A3350">' + esc(t.mapPark) + '</text>' +
    '<text x="140" y="340" font-size="11" font-weight="600" fill="#8B8F99" font-family="Montserrat,sans-serif">' + esc(t.mapParkSub) + '</text>' +
  '</g>' +
  '<g transform="translate(610 150)">' +
    '<ellipse cx="0" cy="4" rx="14" ry="4.5" fill="#000" opacity=".18"/>' +
    '<path d="M0 0 C 19 -16, 19 -40, 0 -40 C -19 -40, -19 -16, 0 0 Z" fill="url(#' + gHotel + ')" stroke="#1c2238" stroke-width="1"/>' +
    '<rect x="-8.5" y="-34" width="17" height="16.5" rx="2" fill="#fff"/>' +
    '<rect x="-2" y="-28" width="5.5" height="10.5" fill="#2A3350"/>' +
    '<rect x="-8.5" y="-37" width="13" height="3.4" fill="#01B1E2"/>' +
  '</g>' +
  '<g font-family="var(--font-display),Montserrat,sans-serif" text-anchor="middle">' +
    '<text x="610" y="92" font-size="11" font-weight="600" fill="#8B8F99" font-family="Montserrat,sans-serif">' + esc(t.mapHotelSub) + '</text>' +
    '<text x="610" y="108" font-size="14" font-weight="700" fill="#2A3350">N’s Hotel</text>' +
  '</g>' +
  '<g transform="translate(24 30)" font-family="Montserrat,sans-serif">' +
    '<rect x="-8" y="-13" width="86" height="26" rx="6" fill="rgba(255,255,255,.85)"/>' +
    '<line x1="2" y1="4" x2="58" y2="4" stroke="#2A3350" stroke-width="2.5"/>' +
    '<line x1="2" y1="0" x2="2" y2="8" stroke="#2A3350" stroke-width="2.5"/>' +
    '<line x1="58" y1="0" x2="58" y2="8" stroke="#2A3350" stroke-width="2.5"/>' +
    '<text x="30" y="-2" text-anchor="middle" font-size="9" font-weight="700" fill="#2A3350">100 m</text>' +
  '</g>' +
  '<g transform="translate(718 40)">' +
    '<circle r="18" fill="rgba(255,255,255,.92)" stroke="#E0E4EB"/>' +
    '<path d="M0 -11 L6 1 L0 -2 Z" fill="#E2574C"/>' +
    '<path d="M0 -2 L6 1 L0 9 L-6 1 Z" fill="#8B92A1"/>' +
    '<path d="M0 -11 L-6 1 L0 -2 Z" fill="#C13B30"/>' +
    '<text x="0" y="-13.5" text-anchor="middle" font-family="var(--font-display),sans-serif" font-size="8.5" font-weight="700" fill="#2A3350">N</text>' +
  '</g>' +
'</svg>'
  );
}

/* ---------- Platzhalter füllen ---------- */
function oppFill(s, d){
  return String(s == null ? '' : s)
    .replace(/\{parkName\}/g, esc(d.parkName))
    .replace(/\{parkAdr\}/g,  esc(d.parkAdr))
    .replace(/\{walkMin\}/g,  esc(d.walkMin))
    .replace(/\{carMin\}/g,   esc(d.carMin))
    .replace(/\{walkM\}/g,    esc(d.walkM))
    .replace(/\{tarif\}/g,    esc(d.stundentarif));
}

/* ---------- ein Blatt je Sprache ---------- */
function oppSheet(t, d, uid){
  const rows = t.tariff.map(function(r){
    const val = r.free
      ? '<span class="opp-free">' + oppFill(r.v, d) + '</span>'
      : '<span class="opp-price">' + oppFill(r.v, d) + '</span>';
    return '<div class="opp-trow' + (r.free ? '' : ' paid') + '"><div class="opp-l">' + esc(r.l) +
      (r.s ? '<small>' + esc(r.s) + '</small>' : '') + '</div><div class="opp-v">' + val + '</div></div>';
  }).join('');

  const pays = t.pay.map(function(p){
    const b = p.kind === 'coins' ? ['#E7F7FC', '#2A3350', OPP_IC.coins]
            : p.kind === 'twint' ? ['#000000', '#ffffff', OPP_IC.qr]
            : /EasyPark/.test(p.name) ? ['#E6007E', '#ffffff', OPP_IC.phone]
            : ['#0E76BC', '#ffffff', OPP_IC.phone];
    return '<div class="opp-pitem">' +
      '<span class="opp-pic" style="background:' + b[0] + ';color:' + b[1] + '">' + b[2] + '</span>' +
      '<div><h4>' + esc(p.name) + (p.code ? ' <span class="opp-code">' + esc(p.code) + '</span>' : '') + '</h4>' +
      '<p>' + esc(p.desc) + '</p></div></div>';
  }).join('');

  return '<article data-page class="t-opp-page" lang="' + esc(t.lang) + '">' +
    '<div class="opp-band"></div>' +
    '<div class="opp-inner">' +
      '<div class="opp-head">' +
        '<span class="opp-logo">' + logo('color', 40) + '</span>' +
        '<div class="opp-tag">' + esc(t.tagTop) + '<b>' + esc(d.adresse) + '</b></div>' +
      '</div>' +
      '<div class="opp-hero">' +
        '<div class="opp-eyebrow">' + esc(t.eyebrow) + '</div>' +
        '<h1>' + esc(t.h1) + '<span class="opp-script">' + esc(t.script) + '</span></h1>' +
        '<p class="opp-lede">' + oppFill(t.lede, d) + '</p>' +
        '<div class="opp-rule"></div>' +
      '</div>' +
      '<div class="opp-map-wrap">' +
        '<div class="opp-sec"><span class="opp-ic">' + OPP_IC.map + '</span>' + esc(t.mapTitle) + '</div>' +
        oppPlan(t, d, uid) +
        '<div class="opp-map-cap">' + oppFill(t.mapCap, d) + '</div>' +
      '</div>' +
      '<div class="opp-cols">' +
        '<div>' +
          '<div class="opp-sec"><span class="opp-ic">' + OPP_IC.clock + '</span>' + esc(t.tariffTitle) + '</div>' +
          '<div class="opp-card">' +
            '<div class="opp-card-h"><span class="opp-t">' + esc(t.tariffHead) + '</span><span class="opp-clock">07:00 – 19:00</span></div>' +
            rows +
            '<div class="opp-trow note"><div class="opp-l">' + esc(t.tariffNote) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="opp-sec"><span class="opp-ic">' + OPP_IC.card + '</span>' + esc(t.payTitle) + '</div>' +
          '<div class="opp-pay">' + pays + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="opp-important">' +
        '<span class="opp-ic">' + OPP_IC.warn + '</span>' +
        '<div><b>' + esc(t.importantTitle) + '</b><p>' + oppFill(t.importantText, d) + '</p></div>' +
      '</div>' +
      '<div class="opp-plate"><span>' + OPP_IC.plate + '</span><div>' + oppFill(t.plate, d) + '</div></div>' +
      '<div class="opp-foot">' +
        '<div><div class="opp-brand">N’s Hotel — Self-Check-in</div><div class="opp-tagline">' + esc(t.tagline) + '</div></div>' +
        '<div class="opp-meta"><b>' + esc(d.adresse) + '</b>' +
          (has(d.kontakt) ? '<br>' + esc(d.kontakt) : '') + '</div>' +
      '</div>' +
    '</div>' +
  '</article>';
}

/* ---------- Pin für das eigene Kartenbild ----------
   Fester Massstab (verzerrt nicht mit dem Bild), Spitze exakt im Punkt. */
function oppPinAt(x, y, kind){
  const isP = kind === 'p';
  const body = isP
    ? '<path d="M0 0 C 18 -15, 18 -39, 0 -39 C -18 -39, -18 -15, 0 0 Z" fill="#01B1E2" stroke="#0e9ec9" stroke-width="1"/>' +
      '<circle cx="0" cy="-25" r="11.5" fill="#fff"/>' +
      '<text x="0" y="-19.6" text-anchor="middle" font-family="var(--font-display),Montserrat,sans-serif" font-size="16" font-weight="700" fill="#01B1E2">P</text>'
    : '<path d="M0 0 C 18 -15, 18 -39, 0 -39 C -18 -39, -18 -15, 0 0 Z" fill="#2A3350" stroke="#1c2238" stroke-width="1"/>' +
      '<rect x="-8.5" y="-33" width="17" height="16.5" rx="2" fill="#fff"/>' +
      '<rect x="-2" y="-27" width="5.5" height="10.5" fill="#2A3350"/>' +
      '<rect x="-8.5" y="-36" width="13" height="3.4" fill="#01B1E2"/>';
  return '<span class="opp-pin" style="left:' + x + '%;top:' + y + '%">' +
    '<svg viewBox="-20 -42 40 42" width="30" height="31.5" aria-hidden="true">' + body + '</svg></span>';
}

/* ---------- Lageplan: gezeichnete Karte ODER eigenes Bild ---------- */
function oppPlan(t, d, uid){
  const useImg = d.plan === 'bild' && has(d.planBild);
  if (useImg){
    const zahl = n => Math.max(0, Math.min(100, Number(n) || 0));
    const hx = zahl(d.hotelX), hy = zahl(d.hotelY), px = zahl(d.parkX), py = zahl(d.parkY);
    const pins = d.planPins !== 'aus';
    const linie = 'M' + px + ' ' + py + ' L' + hx + ' ' + hy;
    return '<div class="opp-map opp-map--img">' +
      '<img src="' + esc(d.planBild) + '" alt="' + esc(t.mapTitle) + '">' +
      (pins
        ? '<svg class="opp-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
            '<path d="' + linie + '" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
            '<path d="' + linie + '" fill="none" stroke="#1F9D57" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0.1 8" vector-effect="non-scaling-stroke"/>' +
          '</svg>' +
          oppPinAt(px, py, 'p') + oppPinAt(hx, hy, 'hotel')
        : '') +
    '</div>';
  }
  return '<div class="opp-map">' + oppMap({
    mapTitle: t.mapTitle, mapPark: t.mapPark, mapParkSub: oppFill(t.mapParkSub, d),
    mapHotelSub: d.adresseKurz, strasseHotel: t.strasseHotel, strassePark: t.strassePark
  }, uid) + '</div>';
}

/* ---------- Texte in sechs Sprachen ----------
   Variabel über Platzhalter: {parkName} {parkAdr} {walkMin} {carMin} {walkM}
   {tarif}. Alles andere ist feste Fassung — Deutsch gilt im Zweifel. */
const OPP_DATA = {
  de: {
    lang:'de', tagTop:'Parkplatz-Information',
    eyebrow:'Parkplatz · Gästeinformation',
    h1:'Öffentlicher Parkplatz in unmittelbarer Nähe',
    script:'Erste 30 Minuten und 19.00–07.00 Uhr gratis.',
    lede:'Bei der <b>{parkName}</b> ({parkAdr}) befindet sich ein grosser, <b>öffentlicher Parkplatz</b> – nur <b>{walkMin} Gehminuten</b> ({carMin} Min. mit dem Auto) vom Hotel entfernt.',
    mapTitle:'So finden Sie den Parkplatz',
    mapPark:'Öffentlicher Parkplatz', mapParkSub:'{parkName}',
    mapCap:'Vom Hotel zum öffentlichen Parkplatz {parkName} · {parkAdr}',
    strasseHotel:'Allmendstrasse', strassePark:'Industriestrasse',
    tariffTitle:'Tarif & Zeiten', tariffHead:'Gebührenpflichtig',
    tariff:[
      { l:'Erste 30 Minuten', s:'Parkuhr trotzdem bedienen', v:'Gratis', free:true },
      { l:'Jede weitere Stunde', v:'{tarif}' },
      { l:'Von 19:00 bis 07:00 Uhr', v:'Gratis', free:true }
    ],
    tariffNote:'Nachzahlen nicht möglich · kein Retourgeld',
    payTitle:'So bezahlen Sie',
    pay:[
      { kind:'coins', name:'Münzen', desc:'CHF 5 · 2 · 1 · –.50 · –.20 · –.10 — kein Retourgeld' },
      { kind:'twint', name:'TWINT', desc:'QR-Code «Kein Münz?» an der Parkuhr scannen' },
      { kind:'app', name:'EasyPark', code:'Zone 32101', desc:'In der App starten, stoppen, verlängern' },
      { kind:'app', name:'Parkingpay', code:'PLZ 3210 · Zone 1', desc:'Bezahlen direkt per App' }
    ],
    importantTitle:'Wichtig – so vermeiden Sie eine Busse',
    importantText:'Bedienen Sie die Parkuhr <b>immer</b> – auch während der 30 Gratis-Minuten und in der kostenlosen Zeit. Geben Sie Ihr <b>Kennzeichen</b> ein, sonst riskieren Sie eine Busse.',
    plate:'An der Parkuhr geben Sie nur Ihr <b>Fahrzeug-Kennzeichen</b> ein – es wird <b>kein Ticket</b> ausgegeben und nicht im Auto hinterlegt.',
    tagline:'Gute Fahrt & schönen Aufenthalt.'
  },
  en: {
    lang:'en', tagTop:'Parking information',
    eyebrow:'Parking · Guest information',
    h1:'Public car park right nearby',
    script:'First 30 minutes and 19:00–07:00 free.',
    lede:'At the <b>{parkName}</b> ({parkAdr}) you’ll find a large <b>public car park</b> – just a <b>{walkMin}-minute walk</b> ({carMin} min by car) from the hotel.',
    mapTitle:'How to find the car park',
    mapPark:'Public car park', mapParkSub:'{parkName}',
    mapCap:'From the hotel to the public car park {parkName} · {parkAdr}',
    strasseHotel:'Allmendstrasse', strassePark:'Industriestrasse',
    tariffTitle:'Tariff & hours', tariffHead:'Chargeable',
    tariff:[
      { l:'First 30 minutes', s:'Still operate the meter', v:'Free', free:true },
      { l:'Each additional hour', v:'{tarif}' },
      { l:'From 19:00 to 07:00', v:'Free', free:true }
    ],
    tariffNote:'No top-up payment · no change given',
    payTitle:'How to pay',
    pay:[
      { kind:'coins', name:'Coins', desc:'CHF 5 · 2 · 1 · –.50 · –.20 · –.10 — no change given' },
      { kind:'twint', name:'TWINT', desc:'Scan the “Kein Münz?” QR code on the meter' },
      { kind:'app', name:'EasyPark', code:'Zone 32101', desc:'Start, stop and extend in the app' },
      { kind:'app', name:'Parkingpay', code:'Postcode 3210 · Zone 1', desc:'Pay directly via the app' }
    ],
    importantTitle:'Important – how to avoid a fine',
    importantText:'<b>Always</b> operate the meter – even during the free 30 minutes and the free hours. Enter your <b>licence plate</b>, otherwise you risk a fine.',
    plate:'At the meter you only enter your <b>licence plate</b> – <b>no ticket is issued</b> or needs to be placed in the car.',
    tagline:'Safe travels & enjoy your stay.'
  },
  fr: {
    lang:'fr', tagTop:'Information parking',
    eyebrow:'Parking · Information clients',
    h1:'Parking public à proximité immédiate',
    script:'30 premières minutes et 19h00–07h00 gratuites.',
    lede:'À la <b>{parkName}</b> ({parkAdr}) se trouve un grand <b>parking public</b> – à seulement <b>{walkMin} minutes à pied</b> ({carMin} min en voiture) de l’hôtel.',
    mapTitle:'Comment trouver le parking',
    mapPark:'Parking public', mapParkSub:'{parkName}',
    mapCap:'De l’hôtel au parking public {parkName} · {parkAdr}',
    strasseHotel:'Allmendstrasse', strassePark:'Industriestrasse',
    tariffTitle:'Tarif & horaires', tariffHead:'Payant',
    tariff:[
      { l:'Les 30 premières minutes', s:'Utilisez quand même l’horodateur', v:'Gratuit', free:true },
      { l:'Chaque heure suivante', v:'{tarif}' },
      { l:'De 19h00 à 07h00', v:'Gratuit', free:true }
    ],
    tariffNote:'Pas de paiement complémentaire · pas de monnaie rendue',
    payTitle:'Comment payer',
    pay:[
      { kind:'coins', name:'Pièces', desc:'CHF 5 · 2 · 1 · –.50 · –.20 · –.10 — pas de monnaie rendue' },
      { kind:'twint', name:'TWINT', desc:'Scannez le QR-code « Kein Münz ? » sur l’horodateur' },
      { kind:'app', name:'EasyPark', code:'Zone 32101', desc:'Démarrer, arrêter, prolonger dans l’app' },
      { kind:'app', name:'Parkingpay', code:'NPA 3210 · Zone 1', desc:'Paiement directement via l’app' }
    ],
    importantTitle:'Important – pour éviter une amende',
    importantText:'Utilisez <b>toujours</b> l’horodateur – même pendant les 30 minutes gratuites et durant la gratuité. Saisissez votre <b>plaque d’immatriculation</b>, sinon vous risquez une amende.',
    plate:'À l’horodateur, saisissez uniquement votre <b>plaque d’immatriculation</b> – <b>aucun ticket</b> n’est délivré ni à déposer dans la voiture.',
    tagline:'Bonne route & beau séjour.'
  },
  it: {
    lang:'it', tagTop:'Informazioni parcheggio',
    eyebrow:'Parcheggio · Informazioni per gli ospiti',
    h1:'Parcheggio pubblico nelle immediate vicinanze',
    script:'Primi 30 minuti e 19:00–07:00 gratis.',
    lede:'Presso la <b>{parkName}</b> ({parkAdr}) si trova un grande <b>parcheggio pubblico</b> – a soli <b>{walkMin} minuti a piedi</b> ({carMin} min in auto) dall’hotel.',
    mapTitle:'Come trovare il parcheggio',
    mapPark:'Parcheggio pubblico', mapParkSub:'{parkName}',
    mapCap:'Dall’hotel al parcheggio pubblico {parkName} · {parkAdr}',
    strasseHotel:'Allmendstrasse', strassePark:'Industriestrasse',
    tariffTitle:'Tariffa & orari', tariffHead:'A pagamento',
    tariff:[
      { l:'Primi 30 minuti', s:'Usate comunque il parchimetro', v:'Gratis', free:true },
      { l:'Ogni ora successiva', v:'{tarif}' },
      { l:'Dalle 19:00 alle 07:00', v:'Gratis', free:true }
    ],
    tariffNote:'Nessun pagamento posticipato · nessun resto',
    payTitle:'Come pagare',
    pay:[
      { kind:'coins', name:'Monete', desc:'CHF 5 · 2 · 1 · –.50 · –.20 · –.10 — nessun resto' },
      { kind:'twint', name:'TWINT', desc:'Scansionate il QR-code « Kein Münz? » sul parchimetro' },
      { kind:'app', name:'EasyPark', code:'Zona 32101', desc:'Avviare, fermare, prolungare nell’app' },
      { kind:'app', name:'Parkingpay', code:'NPA 3210 · Zona 1', desc:'Pagamento direttamente con l’app' }
    ],
    importantTitle:'Importante – per evitare una multa',
    importantText:'Usate <b>sempre</b> il parchimetro – anche durante i 30 minuti gratuiti e nelle ore gratuite. Inserite la vostra <b>targa</b>, altrimenti rischiate una multa.',
    plate:'Al parchimetro inserite solo la vostra <b>targa</b> – <b>non viene emesso alcun biglietto</b> da lasciare in auto.',
    tagline:'Buon viaggio & buon soggiorno.'
  },
  pt: {
    lang:'pt', tagTop:'Informação de estacionamento',
    eyebrow:'Estacionamento · Informação para hóspedes',
    h1:'Parque público nas imediações',
    script:'Primeiros 30 minutos e 19:00–07:00 grátis.',
    lede:'Junto à <b>{parkName}</b> ({parkAdr}) há um grande <b>parque público</b> – a apenas <b>{walkMin} minutos a pé</b> ({carMin} min de carro) do hotel.',
    mapTitle:'Como encontrar o parque',
    mapPark:'Parque público', mapParkSub:'{parkName}',
    mapCap:'Do hotel ao parque público {parkName} · {parkAdr}',
    strasseHotel:'Allmendstrasse', strassePark:'Industriestrasse',
    tariffTitle:'Tarifa & horário', tariffHead:'Pago',
    tariff:[
      { l:'Primeiros 30 minutos', s:'Use o parquímetro mesmo assim', v:'Grátis', free:true },
      { l:'Cada hora adicional', v:'{tarif}' },
      { l:'Das 19:00 às 07:00', v:'Grátis', free:true }
    ],
    tariffNote:'Sem pagamento posterior · sem troco',
    payTitle:'Como pagar',
    pay:[
      { kind:'coins', name:'Moedas', desc:'CHF 5 · 2 · 1 · –.50 · –.20 · –.10 — sem troco' },
      { kind:'twint', name:'TWINT', desc:'Leia o QR-code « Kein Münz? » no parquímetro' },
      { kind:'app', name:'EasyPark', code:'Zona 32101', desc:'Iniciar, parar e prolongar na app' },
      { kind:'app', name:'Parkingpay', code:'Cód. 3210 · Zona 1', desc:'Pague diretamente pela app' }
    ],
    importantTitle:'Importante – para evitar uma multa',
    importantText:'Use <b>sempre</b> o parquímetro – mesmo durante os 30 minutos grátis e nas horas gratuitas. Introduza a sua <b>matrícula</b>, caso contrário arrisca uma multa.',
    plate:'No parquímetro introduz apenas a sua <b>matrícula</b> – <b>não é emitido nenhum bilhete</b> para deixar no carro.',
    tagline:'Boa viagem & boa estadia.'
  },
  es: {
    lang:'es', tagTop:'Información de aparcamiento',
    eyebrow:'Aparcamiento · Información para huéspedes',
    h1:'Aparcamiento público muy cerca del hotel',
    script:'Primeros 30 minutos y de 19:00 a 07:00 gratis.',
    lede:'Junto a la <b>{parkName}</b> ({parkAdr}) hay un gran <b>aparcamiento público</b>, a solo <b>{walkMin} minutos a pie</b> ({carMin} min en coche) del hotel.',
    mapTitle:'Cómo llegar al aparcamiento',
    mapPark:'Aparcamiento público', mapParkSub:'{parkName}',
    mapCap:'Del hotel al aparcamiento público {parkName} · {parkAdr}',
    strasseHotel:'Allmendstrasse', strassePark:'Industriestrasse',
    tariffTitle:'Tarifa y horario', tariffHead:'De pago',
    tariff:[
      { l:'Primeros 30 minutos', s:'Use igualmente el parquímetro', v:'Gratis', free:true },
      { l:'Cada hora adicional', v:'{tarif}' },
      { l:'De 19:00 a 07:00', v:'Gratis', free:true }
    ],
    tariffNote:'Sin pago posterior · no se da cambio',
    payTitle:'Cómo pagar',
    pay:[
      { kind:'coins', name:'Monedas', desc:'CHF 5 · 2 · 1 · –.50 · –.20 · –.10 — no se da cambio' },
      { kind:'twint', name:'TWINT', desc:'Escanee el código QR « Kein Münz? » del parquímetro' },
      { kind:'app', name:'EasyPark', code:'Zona 32101', desc:'Iniciar, parar y ampliar desde la app' },
      { kind:'app', name:'Parkingpay', code:'CP 3210 · Zona 1', desc:'Pague directamente con la app' }
    ],
    importantTitle:'Importante – cómo evitar una multa',
    importantText:'Use <b>siempre</b> el parquímetro, incluso durante los 30 minutos gratis y en las horas gratuitas. Introduzca su <b>matrícula</b>; de lo contrario, se arriesga a una multa.',
    plate:'En el parquímetro solo introduce su <b>matrícula</b>: <b>no se emite ningún tique</b> que dejar en el coche.',
    tagline:'Buen viaje y feliz estancia.'
  }
};

export default {
  id:'parkplatznah',
  title:'Öffentlicher Parkplatz',
  sub:'Wegweiser zum öffentlichen Parkplatz nebenan · eine Seite je Sprache',
  badge:'Anfahrt',
  badgeCyan:true,
  page:'a4',
  root:'t-opp',
  multipage:true,
  pageOf(){ return 'a4'; },

  thumb: thumb(`
    <rect x="18" y="14" width="70" height="9" rx="4.5" fill="#01B1E2"/>
    <rect x="18" y="30" width="150" height="13" rx="4" fill="#2A3350"/>
    <rect x="18" y="48" width="120" height="6" rx="3" fill="#C9CFDA"/>
    <rect x="18" y="66" width="174" height="80" rx="7" fill="#E8EDE7"/>
    <path d="M18 120 H192" stroke="#C2C9D6" stroke-width="7" fill="none"/>
    <path d="M120 66 L150 146" stroke="#D2D7E0" stroke-width="10" fill="none"/>
    <rect x="30" y="104" width="46" height="26" rx="3" fill="#DFE3EA" stroke="#CBD1DC"/>
    <circle cx="52" cy="118" r="9" fill="#01B1E2"/><text x="52" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">P</text>
    <rect x="150" y="86" width="18" height="16" rx="3" fill="#2A3350"/>
    <rect x="18" y="158" width="84" height="44" rx="5" fill="#F6F7FA"/>
    <rect x="108" y="158" width="84" height="44" rx="5" fill="#F6F7FA"/>
    <rect x="26" y="166" width="40" height="5" rx="2.5" fill="#01B1E2"/>
    <rect x="116" y="166" width="40" height="5" rx="2.5" fill="#01B1E2"/>
    <rect x="18" y="212" width="174" height="26" rx="5" fill="#FDECEC"/>
    <rect x="28" y="221" width="150" height="4" rx="2" fill="#E2574C"/>
    <rect x="28" y="229" width="120" height="4" rx="2" fill="#EBA9A2"/>
    <rect x="18" y="250" width="174" height="22" rx="5" fill="#EEF3FF"/>`),

  fields:[
    { t:'group', label:'Sprachen' },
    { t:'note', label:'Je Sprache entsteht eine eigene A4-Seite. Deutsch steht zuoberst.' },
    { k:'sprachen', label:'Sprachen', type:'checks', options:sprachOptions() },

    { t:'group', label:'Lageplan' },
    { k:'plan', label:'Kartenbild', type:'select', options:[
      { v:'gezeichnet', t:'Gezeichneter Plan (offline)' },
      { v:'bild', t:'Eigenes Bild / Karten-Ausschnitt' } ],
      hint:'Der gezeichnete Plan braucht kein Netz. «Eigenes Bild» zeigt stattdessen einen swisstopo-Ausschnitt oder dein Foto.' },
    { t:'note', label:'Am einfachsten: in map.geo.admin.ch den Ort einstellen, den Link aus der Adresszeile kopieren, unten einsetzen und oben «Karten-Ausschnitt laden» drücken. Der Ausschnitt wird ins Blatt gebacken und läuft danach offline.' },
    { k:'mapLink', label:'Link von map.geo.admin.ch', type:'text',
      hint:'Der ganze Link aus der Adresszeile — oder nur die Koordinaten «2604566, 1197171».' },
    { k:'mapStil', label:'Kartenstil', type:'select', options:KARTEN_STILE.map(s => ({ v:s.v, t:s.t })) },
    { k:'mapZoom', label:'Nähe', type:'select', options:KARTEN_ZOOM.map(s => ({ v:s.v, t:s.t })) },
    { k:'planBild', label:'Oder Bild hochladen', type:'image',
      hint:'Eigenes Foto oder ein selbst exportierter Karten-Ausschnitt. Wird ins Blatt eingebettet und läuft offline.' },
    { k:'planPins', label:'Marken-Pins und Weg aufs Bild', type:'select', options:[
      { v:'ein', t:'ja — Hotel + P und Fussweg zeigen' },
      { v:'aus', t:'nein — Bild unverändert lassen' } ] },
    { t:'note', label:'Pins nur beim eigenen Bild. Position in Prozent: 0 = links bzw. oben, 100 = rechts bzw. unten.' },
    { k:'parkX', label:'Parkplatz-Pin — von links %', type:'number', min:0, max:100, step:1 },
    { k:'parkY', label:'Parkplatz-Pin — von oben %', type:'number', min:0, max:100, step:1 },
    { k:'hotelX', label:'Hotel-Pin — von links %', type:'number', min:0, max:100, step:1 },
    { k:'hotelY', label:'Hotel-Pin — von oben %', type:'number', min:0, max:100, step:1 },

    { t:'group', label:'Standort und Weg' },
    { k:'adresse',   label:'Adresse Hotel (Kopf und Fuss)', type:'text' },
    { k:'adresseKurz', label:'Kurzform Hotel (Pin)', type:'text',
      hint:'Steht klein beim Hotel-Pin auf dem Plan.' },
    { k:'parkName',  label:'Name des Parkplatzes', type:'text' },
    { k:'parkAdr',   label:'Adresse des Parkplatzes', type:'text' },
    { k:'walkMin',   label:'Gehminuten', type:'text' },
    { k:'walkM',     label:'Entfernung in Metern', type:'text' },
    { k:'carMin',    label:'Fahrminuten', type:'text' },

    { t:'group', label:'Tarif' },
    { k:'stundentarif', label:'Preis je weitere Stunde', type:'text' },

    { t:'group', label:'Fusszeile' },
    { k:'kontakt', label:'Kontaktzeile', type:'text',
      hint:'Telefon und Web fürs Blatt — z. B. «031 951 85 54 · my.ns-hotel.ch».' }
  ],

  defaults:{
    sprachen:['de','en','fr','it','pt','es'],
    plan:'gezeichnet', planBild:'', planPins:'ein',
    mapLink:'', mapStil:'luftbild', mapZoom:'mittel',
    parkX:22, parkY:72, hotelX:78, hotelY:40,
    adresse:'Allmendstrasse 14 · 3210 Kerzers',
    adresseKurz:'Allmendstrasse 14',
    parkName:'Chutzenhütte',
    parkAdr:'Industriestrasse 3, 3210 Kerzers',
    walkMin:'5', walkM:'400', carMin:'2',
    stundentarif:'CHF 1.00',
    kontakt:'031 951 85 54 · my.ns-hotel.ch'
  },

  render(d){
    const langs = sprachObjekte(d.sprachen);
    return langs.map(function(l, i){
      const t = OPP_DATA[l.id] || OPP_DATA.de;
      return oppSheet(t, d, l.id + '-' + i);
    }).join('');
  },

  /* Werkzeugleiste über dem Formular: den swisstopo-Ausschnitt mit einem
     Klick laden. Der Link kommt aus dem Feld «Link von map.geo.admin.ch»;
     das fertige Bild wird in den Zustand gebacken (planBild) — danach
     braucht das Blatt kein Netz mehr. */
  mount({ panel, state, rebuild }){
    panel.innerHTML = `
      <div class="vz-tools">
        <button type="button" class="vz-btn vz-btn--sm" data-opp="laden">Karten-Ausschnitt laden</button>
        <a class="vz-btn vz-btn--sm vz-btn--ghost" data-opp="offen" target="_blank" rel="noopener"
           href="${esc(kartenAdresse(kartenLink(state.mapLink)))}">map.geo.admin.ch öffnen</a>
        <span class="vz-tools-status" data-opp="status"></span>
      </div>`;

    const status = panel.querySelector('[data-opp="status"]');
    const knopf  = panel.querySelector('[data-opp="laden"]');
    const offen  = panel.querySelector('[data-opp="offen"]');

    const klick = async () => {
      const ort = kartenLink(state.mapLink);
      if (!ort){
        status.textContent = 'Zuerst unten den Link von map.geo.admin.ch einsetzen (Feld «Link von map.geo.admin.ch»).';
        return;
      }
      knopf.disabled = true;
      status.textContent = 'Karten-Ausschnitt wird geladen …';
      try{
        const bild = await kartenAusschnitt(ort, state.mapStil, state.mapZoom);
        state.planBild = bild;
        state.plan = 'bild';
        rebuild();
        /* rebuild zeichnet das Panel neu — kein Status nötig, das Blatt zeigt das Bild. */
      }catch(err){
        status.textContent = String(err && err.message || err);
        knopf.disabled = false;
      }
    };
    knopf.addEventListener('click', klick);

    /* Der Öffnen-Link folgt dem Feld: sobald ein gültiger Link drinsteht,
       zentriert er den Viewer auf denselben Ort. */
    const folge = () => { offen.href = kartenAdresse(kartenLink(state.mapLink)); };
    document.addEventListener('input', folge);

    return () => {
      knopf.removeEventListener('click', klick);
      document.removeEventListener('input', folge);
      panel.innerHTML = '';
    };
  }
};
