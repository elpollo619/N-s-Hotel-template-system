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
  street:  "Allmendstrasse 14",
  zip:     "3210",
  city:    "Kerzers",
  country: "Schweiz",

  // Bewusst leer: erfundene Kontaktdaten dürfen nicht auf einen Aushang.
  // Hier die echten Angaben eintragen — sie erscheinen dann in allen Fusszeilen.
  phone:   "",
  mail:    "",
  web:     ""
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
