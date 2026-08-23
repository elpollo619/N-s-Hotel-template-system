/* ==========================================================================
   Piktogramme
   --------------------------------------------------------------------------
   Strichzeichnungen, 24×24, immer in currentColor. Bewusst schlicht:
   gleichmässige Strichstärke, runde Enden, keine Flächen. Schweizer
   Sachlichkeit — ein Piktogramm soll aus fünf Metern lesbar sein, nicht
   hübsch aus fünfzig Zentimetern.

   Warum eigene und keine Icon-Bibliothek? Die Zentrale lädt nichts nach:
   sie muss als einzelne Datei per Doppelklick laufen. Und die
   Sicherheitszeichen nach ISO 7010 stehen ohnehin getrennt in
   `sicherheitszeichen.js` — die sind genormt und dürfen nicht frei
   gezeichnet werden. Alles hier ist Hausgebrauch: Wegweiser, Zimmer,
   Technik, Abfall.

   Wer ein neues braucht: Pfad in die passende Gruppe eintragen, Namen in
   `LABEL` dazu. Die Auswahlfelder in den Vorlagen und die Übersicht unter
   #/s/piktogramme aktualisieren sich von selbst.
   ========================================================================== */

/* ---------- Wegweiser und Orientierung ----------------------------------- */
const WEG = {
  arrowR:  '<path d="M4 12h15.4"/><path d="m13.6 6.2 5.8 5.8-5.8 5.8"/>',
  arrowL:  '<path d="M20 12H4.6"/><path d="m10.4 6.2-5.8 5.8 5.8 5.8"/>',
  arrowU:  '<path d="M12 20V4.6"/><path d="m6.2 10.4 5.8-5.8 5.8 5.8"/>',
  arrowD:  '<path d="M12 4v15.4"/><path d="m6.2 13.6 5.8 5.8 5.8-5.8"/>',
  door:    '<path d="M5.4 21V4.2A1.2 1.2 0 0 1 6.6 3h9.6a1.2 1.2 0 0 1 1.2 1.2V21"/><path d="M3.6 21h16.8"/><circle cx="14.2" cy="12.3" r="1"/>',
  stairs:  '<path d="M3.4 20.6h4v-4h4v-4h4v-4h4.8"/>',
  lift:    '<rect x="4.6" y="3.2" width="14.8" height="17.6" rx="2"/><path d="M9.6 9.6 12 6.8l2.4 2.8"/><path d="M9.6 14.4 12 17.2l2.4-2.8"/>',
  walk:    '<circle cx="13.2" cy="4.4" r="1.7"/><path d="M11.4 21.2l1.9-5.1-2.2-2.2.9-4.4 3.3 1.5 1.6 2.6"/><path d="M12 9.5 8.6 11l-1 3"/><path d="M13.3 16.1l2.4 5.1"/>',
  reception:'<path d="M4 18h16"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M12 8V6"/><path d="M10 6h4"/>',
  flag:    '<path d="M6 21V3.6"/><path d="M6 4.4h11.4l-2.2 3.6 2.2 3.6H6"/>',
  wheelchair:'<circle cx="14.4" cy="4.2" r="1.9"/><path d="M11.6 7.8v5h4.6"/><path d="m16.2 12.8 2.4 6.2h2.2"/><path d="M16.4 14.8a5.6 5.6 0 1 1-4.8-2.6"/>',
  luggage: '<rect x="4.6" y="7.4" width="14.8" height="12.4" rx="2.2"/><path d="M9 7.4V5.2a1.4 1.4 0 0 1 1.4-1.4h3.2A1.4 1.4 0 0 1 15 5.2v2.2"/><path d="M12 10.6v6"/>'
};

/* ---------- Zimmer und Bad ------------------------------------------------ */
const ZIMMER = {
  bed:     '<path d="M3 19v-9"/><path d="M3 13h18v6"/><path d="M21 19v-4"/><path d="M6.6 10.2h3.2a1.6 1.6 0 0 1 1.6 1.6V13H5v-1.2a1.6 1.6 0 0 1 1.6-1.6Z"/>',
  shower:  '<path d="M12 2.8v3.6"/><path d="M5.6 10.4a6.4 6.4 0 0 1 12.8 0Z"/><path d="M8 14.2v.6M12 14.2v.6M16 14.2v.6M9.6 18v.6M14.4 18v.6M12 20.8v.6"/>',
  bath:    '<path d="M3.2 12.6h17.6v2.4a4.2 4.2 0 0 1-4.2 4.2H7.4a4.2 4.2 0 0 1-4.2-4.2Z"/><path d="M6.6 12.6V5.6a2 2 0 0 1 3.6-1.2"/><path d="M6.6 21.4l1-2M17.4 21.4l-1-2"/>',
  toilet:  '<path d="M6.2 3.4h3.6v8.2H6.2z"/><path d="M6.2 11.6h12.2a5.8 5.8 0 0 1-5.8 5.8h-1.2a5.8 5.8 0 0 1-5.8-5.8"/><path d="M12 17.4v3.2M8.8 20.6h6.4"/>',
  towel:   '<rect x="5" y="3.6" width="14" height="16.8" rx="2"/><path d="M9.2 3.6v16.8"/><path d="M12 7.6h4M12 11h4"/>',
  hanger:  '<path d="M12 7.6a2.2 2.2 0 1 1 2.2-2.2"/><path d="M12 7.6v1.8l7.4 5.4a2.3 2.3 0 0 1-1.4 4.2H6a2.3 2.3 0 0 1-1.4-4.2L12 9.4"/>',
  safe:    '<rect x="3.2" y="4.4" width="17.6" height="15.2" rx="2.2"/><circle cx="10.4" cy="12" r="3.2"/><path d="M10.4 8.8v-1M10.4 16.2v1M13.6 12h1M6.2 12h1"/><path d="M17.4 9.4v5.2"/>',
  nodisturb:'<path d="M8.4 2.8h7.2a2 2 0 0 1 2 2v14.4a2 2 0 0 1-2 2H8.4a2 2 0 0 1-2-2V4.8a2 2 0 0 1 2-2Z"/><circle cx="12" cy="6.6" r="1.7"/><path d="M9 12.8h6"/>',
  tv:      '<rect x="2.8" y="4.2" width="18.4" height="12.6" rx="2"/><path d="M8.4 20.4h7.2"/><path d="M12 16.8v3.6"/>',
  remote:  '<rect x="7.4" y="2.6" width="9.2" height="18.8" rx="2.6"/><circle cx="12" cy="7.2" r="1.3"/><path d="M9.8 12h4.4M9.8 15.2h4.4M9.8 18.2h4.4"/>',
  key:     '<circle cx="8" cy="12" r="3.4"/><path d="M11.4 12H21"/><path d="M17.6 12v3.1"/><path d="M20.2 12v2.2"/>',
  lock:    '<rect x="4.6" y="10" width="14.8" height="10.6" rx="2.2"/><path d="M8.2 10V7.4a3.8 3.8 0 0 1 7.6 0V10"/><path d="M12 14.2v2.6"/>'
};

/* ---------- Haus und Technik --------------------------------------------- */
const TECHNIK = {
  wifi:    '<path d="M3.6 9.2a13 13 0 0 1 16.8 0"/><path d="M6.7 12.6a8.4 8.4 0 0 1 10.6 0"/><path d="M9.8 16a4 4 0 0 1 4.4 0"/><path d="M12 19.3h.01"/>',
  plug:    '<path d="M9 3.4v4.2M15 3.4v4.2"/><path d="M6.6 7.6h10.8v3.2a5.4 5.4 0 0 1-5.4 5.4 5.4 5.4 0 0 1-5.4-5.4Z"/><path d="M12 16.2v4.4"/>',
  light:   '<path d="M9.4 18.4h5.2"/><path d="M10.4 21h3.2"/><path d="M12 3a6 6 0 0 1 3.6 10.8c-.7.5-1.1 1.1-1.1 1.8v.8H9.5v-.8c0-.7-.4-1.3-1.1-1.8A6 6 0 0 1 12 3Z"/>',
  heating: '<rect x="4.4" y="6.6" width="15.2" height="11.4" rx="1.8"/><path d="M8.2 6.6v11.4M12 6.6v11.4M15.8 6.6v11.4"/><path d="M6.6 18v2.4M17.4 18v2.4"/>',
  aircon:  '<rect x="3" y="4.6" width="18" height="7.4" rx="2"/><path d="M6.2 8.6h11.6"/><path d="M7.6 15.4a2.2 2.2 0 0 0 2.2 2.2 2.2 2.2 0 0 1 2.2 2.2"/><path d="M16.4 15.4a2.2 2.2 0 0 1-2.2 2.2"/>',
  battery: '<rect x="2.6" y="7.4" width="16.4" height="9.2" rx="2.2"/><path d="M21.4 10.8v2.4"/><path d="M6.2 10.8h5.4"/>',
  bolt:    '<path d="m13.4 2.6-8 11.2h5.6L10.6 21.4l8-11.4h-5.8z"/>',
  printer: '<path d="M7 9.2V4.4h10v4.8"/><rect x="3.4" y="9.2" width="17.2" height="7.2" rx="2"/><path d="M7 13.4h10v6.2H7z"/><path d="M17.4 12h.6"/>',
  phone:   '<rect x="6.5" y="2.6" width="11" height="18.8" rx="2.4"/><path d="M10.4 5.4h3.2"/><path d="M12 18.1h.01"/>',
  photo:   '<rect x="2.8" y="6.4" width="18.4" height="13.2" rx="2.6"/><circle cx="12" cy="13" r="3.8"/><path d="m8.6 6.4 1.4-2.6h4l1.4 2.6"/>',
  cctv:    '<path d="M3.4 7.6h10.6v5H3.4z"/><path d="m14 8.8 6.6-2.6v8.2L14 11.8"/><path d="M6.2 12.6v4.2a1.8 1.8 0 0 0 1.8 1.8h.8"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
  calendar:'<rect x="3.4" y="5" width="17.2" height="15.6" rx="2.2"/><path d="M3.4 9.6h17.2"/><path d="M8 3.4v3.2M16 3.4v3.2"/><path d="M7.6 13h1.6M11.2 13h1.6M14.8 13h1.6M7.6 16.6h1.6M11.2 16.6h1.6"/>'
};

/* ---------- Essen und Trinken --------------------------------------------- */
const ESSEN = {
  cup:     '<path d="M4.5 8.5h12v5.2a4.4 4.4 0 0 1-4.4 4.4H8.9a4.4 4.4 0 0 1-4.4-4.4Z"/><path d="M16.5 10h1.6a2.2 2.2 0 0 1 0 4.4h-1.6"/><path d="M4.5 20.8h12"/><path d="M8.4 3.4v2.3M12.6 3.4v2.3"/>',
  besteck: '<path d="M7 2.8v8.4a2 2 0 0 0 4 0V2.8"/><path d="M9 13.2v8"/><path d="M16.6 2.8c-1.6 0-2.6 1.9-2.6 4.4 0 2 .8 3.3 2 3.7v10.3"/>',
  glas:    '<path d="M4.6 3.8h14.8l-6 7.4v8.4"/><path d="M8.6 19.6h6.8"/>',
  wasser:  '<path d="M12 3s6 6.7 6 10.4a6 6 0 0 1-12 0C6 9.7 12 3 12 3Z"/>',
  fridge:  '<rect x="5.4" y="2.6" width="13.2" height="18.8" rx="2.2"/><path d="M5.4 9.4h13.2"/><path d="M8.4 6v1.6M8.4 12.2v2.6"/>',
  microwave:'<rect x="2.6" y="5.4" width="18.8" height="13.2" rx="2.2"/><path d="M15.4 5.4v13.2"/><path d="M17.6 9h1.8M17.6 12h1.8"/><path d="M5.6 8.8h6.6M5.6 11.8h6.6"/>'
};

/* ---------- Sicherheit und Notfall ---------------------------------------- */
const SICHER = {
  exit:    '<path d="M14.4 3.6H5.4a1.8 1.8 0 0 0-1.8 1.8v13.2a1.8 1.8 0 0 0 1.8 1.8h9"/><path d="M10.4 12h9.8"/><path d="m16.4 8.2 3.8 3.8-3.8 3.8"/>',
  firstaid:'<rect x="3" y="5.6" width="18" height="13.4" rx="2.4"/><path d="M12 9.6v5.8M9.1 12.5h5.8"/><path d="M9 5.6V4.2a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 4.2v1.4"/>',
  extinguisher:'<path d="M8.4 8h5a2 2 0 0 1 2 2v9.4a1.6 1.6 0 0 1-1.6 1.6H8a1.6 1.6 0 0 1-1.6-1.6V10a2 2 0 0 1 2-2Z"/><path d="M9.4 8V5.6h3.2V8"/><path d="M12.6 6.4h3.6a1.4 1.4 0 0 1 1.4 1.4v2.6"/><path d="M7 12.4h7.4"/>',
  defib:   '<path d="M12 20.4S3.6 15 3.6 9.6a4.6 4.6 0 0 1 8.4-2.6 4.6 4.6 0 0 1 8.4 2.6c0 5.4-8.4 10.8-8.4 10.8Z"/><path d="m13 8.6-2.4 3.6h3l-2.4 3.6"/>',
  sammelplatz:'<path d="M12 3.4 20.6 12 12 20.6 3.4 12Z"/><circle cx="12" cy="10.2" r="1.8"/><path d="M8.6 16.4a3.4 3.4 0 0 1 6.8 0"/>',
  shield:  '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/>',
  fire:    '<path d="M12 2c1 3-1 5-1 5s3 1 3 5a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 4 2 4c2 0 2-2 1-4 2 1 4 4 4 7a6 6 0 0 1-12 0C5 12 12 8 12 2Z"/>',
  ambulance:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M12 9v5M9.5 11.5h5"/>',
  warn:    '<path d="M12 3.6 21.4 20H2.6Z"/><path d="M12 10v4.4M12 17.4h.01"/>',
  smoke:   '<path d="M3.4 15.4h13.2v3.4H3.4z"/><path d="M18.6 15.4h2v3.4h-2z"/><path d="M14.4 12.6c1.8-.9 1.8-2.6.6-3.6-1.2-1-1.2-2.6.2-3.6"/>',
  quiet:   '<circle cx="8" cy="18.2" r="2.4"/><path d="M10.4 18.2V6.2l8-2v10.6"/><circle cx="16.2" cy="14.8" r="2.4"/><path d="m3.4 3.4 17.2 17.2"/>',
  noparking:'<circle cx="12" cy="12" r="9"/><path d="M9.6 17V7h3.2a2.9 2.9 0 0 1 0 5.8H9.6"/><path d="m5.6 5.6 12.8 12.8"/>'
};

/* ---------- Abfall und Recycling ------------------------------------------ */
const ABFALL = {
  trash:   '<path d="M4.4 6.6h15.2"/><path d="M9.4 6.6V4.8a1.2 1.2 0 0 1 1.2-1.2h2.8a1.2 1.2 0 0 1 1.2 1.2v1.8"/><path d="M6.4 6.6 7.3 19a1.4 1.4 0 0 0 1.4 1.3h6.6a1.4 1.4 0 0 0 1.4-1.3l.9-12.4"/><path d="M10.4 10v6.4M13.6 10v6.4"/>',
  bottle:  '<path d="M10.2 2.8h3.6v2.4l1.5 2.2a4 4 0 0 1 .7 2.3v9.1a2.4 2.4 0 0 1-2.4 2.4h-3.2a2.4 2.4 0 0 1-2.4-2.4v-9.1a4 4 0 0 1 .7-2.3l1.5-2.2Z"/><path d="M8.4 12.6h7.2"/>',
  papier:  '<path d="M6 3.4h8.4L19 8v12.6H6z"/><path d="M14.4 3.4V8H19"/><path d="M8.8 12.4h7.4M8.8 15.8h7.4"/>',
  dose:    '<rect x="7" y="3.6" width="10" height="16.8" rx="2.6"/><path d="M7 7.6h10M7 16.4h10"/>',
  bio:     '<path d="M12 20.6c0-6.3 3.4-10.2 8.3-11-.4 6.7-3.6 10.2-8.3 11Z"/><path d="M12 20.6C12 14.7 9.1 11.2 4.6 10.4c.4 6.3 3.2 9.6 7.4 10.2Z"/><path d="M12 20.6v-3.4"/>'
};

/* ---------- Draussen und Umgebung ----------------------------------------- */
const DRAUSSEN = {
  car:     '<path d="M4 15.6h16"/><path d="M5.4 15.6V18a.9.9 0 0 1-.9.9H4a.9.9 0 0 1-.9-.9v-2.4"/><path d="M20.9 15.6V18a.9.9 0 0 1-.9.9h-.5a.9.9 0 0 1-.9-.9v-2.4"/><path d="M3.6 15.6v-3.2l2-4.6a1.6 1.6 0 0 1 1.5-1h9.8a1.6 1.6 0 0 1 1.5 1l2 4.6v3.2Z"/><path d="M6.6 12.6h1.2M16.2 12.6h1.2"/>',
  parking: '<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3.4"/><path d="M9.4 17V7.6h3.2a2.9 2.9 0 0 1 0 5.8H9.4"/>',
  velo:    '<circle cx="5.8" cy="16.8" r="3.4"/><circle cx="18.2" cy="16.8" r="3.4"/><path d="M8.6 16.8 12 8.6h4"/><path d="m10.2 8.6 5.6 8.2"/><path d="M9.4 8.6h5"/><path d="M14.6 5.8h2.2"/>',
  bus:     '<rect x="3.6" y="3.6" width="16.8" height="13.4" rx="2.4"/><path d="M3.6 10.4h16.8"/><path d="M6.4 13.8h.6M17 13.8h.6"/><circle cx="7.4" cy="19.4" r="1.6"/><circle cx="16.6" cy="19.4" r="1.6"/>',
  zug:     '<rect x="5" y="3.4" width="14" height="13.2" rx="3"/><path d="M5 10h14"/><path d="M8.6 13.4h.6M14.8 13.4h.6"/><path d="m7.8 16.6-2.4 4.2M16.2 16.6l2.4 4.2"/><path d="M8.6 20.4h6.8"/>',
  baum:    '<path d="M12 2.6 7.2 9.8h3L6 15.8h4.8v5.6h2.4v-5.6H18L13.8 9.8h3z"/>',
  sonne:   '<circle cx="12" cy="12" r="4.3"/><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5 7 7M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5"/>',
  schnee:  '<path d="M12 2.8v18.4M4.1 7.4l15.8 9.2M19.9 7.4 4.1 16.6"/><path d="m9.6 4.6 2.4 2 2.4-2M9.6 19.4l2.4-2 2.4 2"/>',
  hund:    '<circle cx="6.8" cy="9" r="2"/><circle cx="11.8" cy="6.8" r="2"/><circle cx="16.8" cy="9" r="2"/><path d="M11.8 11.6c3 0 5 2.4 5 4.7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3c0-2.3 2-4.7 5-4.7Z"/>'
};

/* ---------- Allgemein ----------------------------------------------------- */
const ALLGEMEIN = {
  info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6v.6"/>',
  check:   '<path d="m4.6 12.6 4.8 4.8L19.4 7.4"/>',
  cross:   '<path d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4"/>',
  mail:    '<rect x="2.8" y="5" width="18.4" height="14" rx="2.2"/><path d="m3.4 6.6 8.6 6 8.6-6"/>',
  globe:   '<circle cx="12" cy="12" r="9"/><path d="M3.2 12h17.6"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  person:  '<circle cx="12" cy="7" r="3.4"/><path d="M4.8 20.6v-1.2a7.2 7.2 0 0 1 14.4 0v1.2"/>',
  familie: '<circle cx="8" cy="6.4" r="2.4"/><circle cx="16.8" cy="7.4" r="1.9"/><path d="M3.6 20.4v-3.8a4.4 4.4 0 0 1 8.8 0v3.8"/><path d="M14.2 20.4v-3.2a3.3 3.3 0 0 1 6.6 0v3.2"/>',
  baby:    '<path d="M8.8 8.6h6.4v10.2a2.6 2.6 0 0 1-2.6 2.6h-1.2a2.6 2.6 0 0 1-2.6-2.6Z"/><path d="M8.4 8.6h7.2"/><path d="M10.2 8.6V7a1.8 1.8 0 0 1 3.6 0v1.6"/><path d="M12 5.2V3.2"/><path d="M12.6 12h2M12.6 15h2"/>',
  herz:    '<path d="M12 20.4S3.6 15 3.6 9.6a4.6 4.6 0 0 1 8.4-2.6 4.6 4.6 0 0 1 8.4 2.6c0 5.4-8.4 10.8-8.4 10.8Z"/>',
  stern:   '<path d="m12 3.2 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.7l6.1-.9z"/>',
  stift:   '<path d="M4 20h4L18.6 9.4a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m14.6 5.4 4 4"/>',
  buch:    '<path d="M4.4 4.6a2 2 0 0 1 2-2H19v16.2H6.4a2 2 0 0 0-2 2z"/><path d="M4.4 18.8a2 2 0 0 1 2-2H19v4.6H6.4a2 2 0 0 1-2-2z"/>',
  waesche: '<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2.4"/><circle cx="12" cy="14" r="4.4"/><path d="M7.4 6.4h.6M10.4 6.4h.6"/><path d="M4.2 9.6h15.6"/>',
  trockner:'<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2.4"/><circle cx="12" cy="14" r="4.4"/><path d="M9.8 13.2a2.2 2.2 0 0 1 2.2 1.6 2.2 2.2 0 0 0 2.2 1.6"/><path d="M7.4 6.4h.6M10.4 6.4h.6"/><path d="M4.2 9.6h15.6"/>',
  buegeln: '<path d="M3.4 17.4h17.2"/><path d="M4.8 17.4v-2.6a6.4 6.4 0 0 1 6.4-6.4h4.4a5 5 0 0 1 5 5v4"/><path d="M11.2 8.4V6.8a1.8 1.8 0 0 1 1.8-1.8h4"/>',
  foehn:   '<circle cx="8.2" cy="10" r="5.4"/><path d="M13.4 7.4h4.8l1.4 5.2h-6.2"/><path d="m7 15.2-1.2 6.2h3.4l1.2-5.6"/>',
  putzen:  '<path d="M9 8.2h5.4a2 2 0 0 1 2 2v9.2a1.6 1.6 0 0 1-1.6 1.6H8.6A1.6 1.6 0 0 1 7 19.4v-9.2a2 2 0 0 1 2-2Z"/><path d="M10 8.2V4.8h3.4v3.4"/><path d="M13.4 5.6h3M16.4 3.6l1.8-1M16.4 7.6l1.8 1"/>'
};

/* ---------- Gruppen zusammenführen ---------------------------------------- */
export const GRUPPEN = [
  { id:'weg',      titel:'Wegweiser und Orientierung', pfade:WEG },
  { id:'zimmer',   titel:'Zimmer und Bad',             pfade:ZIMMER },
  { id:'technik',  titel:'Haus und Technik',           pfade:TECHNIK },
  { id:'essen',    titel:'Essen und Trinken',          pfade:ESSEN },
  { id:'sicher',   titel:'Sicherheit und Notfall',     pfade:SICHER },
  { id:'abfall',   titel:'Abfall und Recycling',       pfade:ABFALL },
  { id:'draussen', titel:'Draussen und Umgebung',      pfade:DRAUSSEN },
  { id:'allg',     titel:'Allgemein',                  pfade:ALLGEMEIN }
];

const P = Object.assign({}, WEG, ZIMMER, TECHNIK, ESSEN, SICHER, ABFALL, DRAUSSEN, ALLGEMEIN);

export const ICON_KEYS = Object.keys(P);

/* Namen in der Oberflaeche. Deutsch, weil die Zentrale deutsch spricht; wo
   ein zweites Wort beim Suchen hilft, steht es dahinter. */
export const LABEL = {
  /* Wegweiser */
  arrowR:'Pfeil rechts', arrowL:'Pfeil links', arrowU:'Pfeil hoch', arrowD:'Pfeil runter',
  door:'Tür', stairs:'Treppe', lift:'Lift · Aufzug', walk:'zu Fuss',
  reception:'Rezeption · Empfang', flag:'Fahne · Ziel', wheelchair:'Rollstuhl · barrierefrei',
  luggage:'Gepäck · Koffer',
  /* Zimmer */
  bed:'Bett · Zimmer', shower:'Dusche', bath:'Badewanne', toilet:'WC · Toilette',
  towel:'Handtuch', hanger:'Kleiderbügel · Garderobe', safe:'Tresor · Safe',
  nodisturb:'Bitte nicht stören', tv:'Fernseher', remote:'Fernbedienung',
  key:'Schlüssel', lock:'Schloss · abgeschlossen',
  /* Technik */
  wifi:'WLAN', plug:'Steckdose', light:'Licht · Lampe', heating:'Heizung',
  aircon:'Klimagerät · Lüftung', battery:'Batterie', bolt:'Strom · Blitz',
  printer:'Drucker', phone:'Telefon', photo:'Foto · Kamera',
  cctv:'Videoüberwachung', clock:'Uhr · Zeit', calendar:'Kalender · Datum',
  /* Essen */
  cup:'Frühstück · Kaffee', besteck:'Restaurant · Besteck', glas:'Bar · Glas',
  wasser:'Wasser', fridge:'Kühlschrank', microwave:'Mikrowelle',
  /* Sicherheit */
  exit:'Notausgang', firstaid:'Erste Hilfe', extinguisher:'Feuerlöscher',
  defib:'Defibrillator', sammelplatz:'Sammelplatz', shield:'Polizei',
  fire:'Feuerwehr', ambulance:'Ambulanz', warn:'Achtung · Warnung',
  smoke:'Rauchen', quiet:'Ruhe · leise', noparking:'Parkverbot',
  /* Abfall */
  trash:'Kehricht · Abfall', bottle:'PET-Flasche', papier:'Papier · Karton',
  dose:'Dose · Metall', bio:'Grünabfall · Kompost',
  /* Draussen */
  car:'Auto', parking:'Parkplatz', velo:'Velo · Fahrrad', bus:'Bus',
  zug:'Zug · Bahn', baum:'Baum · Garten', sonne:'Sonne · Sommer',
  schnee:'Schnee · Winter', hund:'Hund · Tiere',
  /* Allgemein */
  info:'Info', check:'Haken · erledigt', cross:'Kreuz · nein', mail:'Post · Mail',
  globe:'Sprache · Welt', person:'Person', familie:'Familie', baby:'Baby · Schoppen',
  herz:'Herz', stern:'Stern', stift:'Stift · schreiben', buch:'Mappe · Buch',
  waesche:'Waschmaschine', trockner:'Tumbler · Trockner', buegeln:'Bügeln',
  foehn:'Föhn', putzen:'Reinigung · Putzen'
};

/** Icon als SVG-String. size in px, stroke folgt currentColor. */
export function icon(name, size = 24, sw = 1.8){
  const d = P[name] || P.info;
  return `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${d}</svg>`;
}

/** Gibt es dieses Piktogramm? */
export function iconDa(name){ return Object.hasOwn(P, name); }

/** Name fürs Anzeigen. */
export function iconLabel(name){ return LABEL[name] || name; }

/**
 * Optionen für <select>-Felder — nach Gruppen geordnet.
 * Das Auswahlfeld baut daraus <optgroup>; bei neunzig Piktogrammen ist eine
 * flache Liste nicht mehr zu überblicken.
 */
export function iconOptions(){
  const aus = [];
  for (const g of GRUPPEN){
    aus.push({ gruppe:g.titel });
    for (const k of Object.keys(g.pfade)) aus.push({ v:k, t:LABEL[k] || k });
  }
  return aus;
}

/** Flache Liste ohne Gruppenmarken — für Suche und Übersicht. */
export function iconListe(){
  return GRUPPEN.flatMap(g =>
    Object.keys(g.pfade).map(k => ({ id:k, gruppe:g.id, gruppeTitel:g.titel, label:LABEL[k] || k })));
}
