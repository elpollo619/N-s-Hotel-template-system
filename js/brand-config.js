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
  aerial:    null,   // "assets/img/aerial-site.png"   — Luftbild swisstopo
  phonePhoto:null,   // "assets/img/phone-yealink.jpg" — Foto des Tischtelefons

  name:    "N's Hotel",
  company: "Hans Amonn AG",
  street:  "Bahnhofstrasse 20",
  zip:     "3210",
  city:    "Kerzers",
  country: "Schweiz",
  phone:   "+41 31 750 50 50",
  mail:    "info@ns-hotel.ch",
  web:     "www.ns-hotel.ch"
};

/** Einzeilige Adresse für Fusszeilen. */
export function addressLine(){
  return `${BRAND.name} · ${BRAND.street} · ${BRAND.zip} ${BRAND.city}`;
}
