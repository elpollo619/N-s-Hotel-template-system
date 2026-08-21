/* ==========================================================================
   Zentrale Stammdaten + Pfade zu den echten Marken-Assets.
   Nur diese Datei anpassen — alle Vorlagen greifen darauf zu.
   --------------------------------------------------------------------------
   Solange ein Pfad `null` ist, zeichnet die App eine saubere Platzhalter-Marke
   (Inline-SVG). Sobald die echten Dateien in assets/brand/ liegen, hier den
   Pfad eintragen — oder `node tools/install-brand-assets.mjs` ausführen.
   ========================================================================== */
export const BRAND = {
  logo:      null,   // "assets/brand/logo.png"        — farbig auf hell
  logoWhite: null,   // "assets/brand/logo-white.png"  — weiss auf dunkel/cyan
  favicon:   null,   // "assets/brand/favicon.png"     — der N's-"Mark" im Pin
  aerial:    "assets/img/aerial-site.jpg",   // Luftbild swisstopo (swissimage, 10 cm)
  phonePhoto:null,   // "assets/img/phone-yealink.jpg" — Foto des Tischtelefons

  // Pflichtangabe der Quelle beim Luftbild (Open Government Data des Bundes).
  aerialCredit: "© swisstopo",

  name:    "N's Hotel",
  company: "Hans Amonn AG",
  street:  "Allmendstrasse 14",
  zip:     "3210",
  city:    "Kerzers",
  country: "Schweiz",

  // Echte Angaben, übernommen aus der bestehenden Gästemappe des Hauses.
  phone:    "+41 31 951 85 54",
  mobile:   "+41 77 535 06 68",   // aus "Infos.docx" im Ordner A14/Plakate
  whatsapp: "+41 31 951 85 53",
  mail:     "info@ns-hotel.ch",
  web:      "ns-hotel.ch",
  youtube:  "youtube.com/@NsHotel-Self-Check-in"
};

/** Einzeilige Adresse für Fusszeilen. */
export function addressLine(){
  return `${BRAND.name} · ${BRAND.street} · ${BRAND.zip} ${BRAND.city}`;
}

/** Adresse plus die Kontaktangaben, die wirklich hinterlegt sind. */
export function contactLine(){
  return [addressLine(), BRAND.phone, BRAND.mail, BRAND.web]
    .filter(x => x && String(x).trim())
    .join(' · ');
}
