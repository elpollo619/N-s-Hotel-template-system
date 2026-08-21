/* Strich-Icons (24x24, currentColor). Bewusst schlicht — Schweizer Sachlichkeit. */
const P = {
  info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6v.6"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
  phone:   '<rect x="6.5" y="2.6" width="11" height="18.8" rx="2.4"/><path d="M10.4 5.4h3.2"/><path d="M12 18.1h.01"/>',
  wifi:    '<path d="M3.6 9.2a13 13 0 0 1 16.8 0"/><path d="M6.7 12.6a8.4 8.4 0 0 1 10.6 0"/><path d="M9.8 16a4 4 0 0 1 4.4 0"/><path d="M12 19.3h.01"/>',
  key:     '<circle cx="8" cy="12" r="3.4"/><path d="M11.4 12H21"/><path d="M17.6 12v3.1"/><path d="M20.2 12v2.2"/>',
  bed:     '<path d="M3 19v-9"/><path d="M3 13h18v6"/><path d="M21 19v-4"/><path d="M6.6 10.2h3.2a1.6 1.6 0 0 1 1.6 1.6V13H5v-1.2a1.6 1.6 0 0 1 1.6-1.6Z"/>',
  cup:     '<path d="M4.5 8.5h12v5.2a4.4 4.4 0 0 1-4.4 4.4H8.9a4.4 4.4 0 0 1-4.4-4.4Z"/><path d="M16.5 10h1.6a2.2 2.2 0 0 1 0 4.4h-1.6"/><path d="M4.5 20.8h12"/><path d="M8.4 3.4v2.3M12.6 3.4v2.3"/>',
  car:     '<path d="M4 15.6h16"/><path d="M5.4 15.6V18a.9.9 0 0 1-.9.9H4a.9.9 0 0 1-.9-.9v-2.4"/><path d="M20.9 15.6V18a.9.9 0 0 1-.9.9h-.5a.9.9 0 0 1-.9-.9v-2.4"/><path d="M3.6 15.6v-3.2l2-4.6a1.6 1.6 0 0 1 1.5-1h9.8a1.6 1.6 0 0 1 1.5 1l2 4.6v3.2Z"/><path d="M6.6 12.6h1.2M16.2 12.6h1.2"/>',
  walk:    '<circle cx="13.2" cy="4.4" r="1.7"/><path d="M11.4 21.2l1.9-5.1-2.2-2.2.9-4.4 3.3 1.5 1.6 2.6"/><path d="M12 9.5 8.6 11l-1 3"/><path d="M13.3 16.1l2.4 5.1"/>',
  door:    '<path d="M5.4 21V4.2A1.2 1.2 0 0 1 6.6 3h9.6a1.2 1.2 0 0 1 1.2 1.2V21"/><path d="M3.6 21h16.8"/><circle cx="14.2" cy="12.3" r="1"/>',
  stairs:  '<path d="M3.4 20.6h4v-4h4v-4h4v-4h4.8"/>',
  lift:    '<rect x="4.6" y="3.2" width="14.8" height="17.6" rx="2"/><path d="M9.6 9.6 12 6.8l2.4 2.8"/><path d="M9.6 14.4 12 17.2l2.4-2.8"/>',
  parking: '<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3.4"/><path d="M9.4 17V7.6h3.2a2.9 2.9 0 0 1 0 5.8H9.4"/>',
  flag:    '<path d="M6 21V3.6"/><path d="M6 4.4h11.4l-2.2 3.6 2.2 3.6H6"/>',
  tv:      '<rect x="2.8" y="4.2" width="18.4" height="12.6" rx="2"/><path d="M8.4 20.4h7.2"/><path d="M12 16.8v3.6"/>',
  remote:  '<rect x="7.4" y="2.6" width="9.2" height="18.8" rx="2.6"/><circle cx="12" cy="7.2" r="1.3"/><path d="M9.8 12h4.4M9.8 15.2h4.4M9.8 18.2h4.4"/>',
  plug:    '<path d="M9 3.4v4.2M15 3.4v4.2"/><path d="M6.6 7.6h10.8v3.2a5.4 5.4 0 0 1-5.4 5.4 5.4 5.4 0 0 1-5.4-5.4Z"/><path d="M12 16.2v4.4"/>',
  luggage: '<rect x="4.6" y="7.4" width="14.8" height="12.4" rx="2.2"/><path d="M9 7.4V5.2a1.4 1.4 0 0 1 1.4-1.4h3.2A1.4 1.4 0 0 1 15 5.2v2.2"/><path d="M12 10.6v6"/>',
  mail:    '<rect x="2.8" y="5" width="18.4" height="14" rx="2.2"/><path d="m3.4 6.6 8.6 6 8.6-6"/>',
  smoke:   '<path d="M3.4 15.4h13.2v3.4H3.4z"/><path d="M18.6 15.4h2v3.4h-2z"/><path d="M14.4 12.6c1.8-.9 1.8-2.6.6-3.6-1.2-1-1.2-2.6.2-3.6"/>',
  arrowR:  '<path d="M4 12h15.4"/><path d="m13.6 6.2 5.8 5.8-5.8 5.8"/>',
  check:   '<path d="m4.6 12.6 4.8 4.8L19.4 7.4"/>',
  warn:    '<path d="M12 3.6 21.4 20H2.6Z"/><path d="M12 10v4.4M12 17.4h.01"/>',
  globe:   '<circle cx="12" cy="12" r="9"/><path d="M3.2 12h17.6"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  // Aus der Referenz-Umsetzung übernommen (Notruf-Aushang v6)
  reception:'<path d="M4 18h16"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M12 8V6"/><path d="M10 6h4"/>',
  shield:   '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/>',
  fire:     '<path d="M12 2c1 3-1 5-1 5s3 1 3 5a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 4 2 4c2 0 2-2 1-4 2 1 4 4 4 7a6 6 0 0 1-12 0C5 12 12 8 12 2Z"/>',
  ambulance:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M12 9v5M9.5 11.5h5"/>',
  trash:    '<path d="M4.4 6.6h15.2"/><path d="M9.4 6.6V4.8a1.2 1.2 0 0 1 1.2-1.2h2.8a1.2 1.2 0 0 1 1.2 1.2v1.8"/><path d="M6.4 6.6 7.3 19a1.4 1.4 0 0 0 1.4 1.3h6.6a1.4 1.4 0 0 0 1.4-1.3l.9-12.4"/><path d="M10.4 10v6.4M13.6 10v6.4"/>',
  bottle:   '<path d="M10.2 2.8h3.6v2.4l1.5 2.2a4 4 0 0 1 .7 2.3v9.1a2.4 2.4 0 0 1-2.4 2.4h-3.2a2.4 2.4 0 0 1-2.4-2.4v-9.1a4 4 0 0 1 .7-2.3l1.5-2.2Z"/><path d="M8.4 12.6h7.2"/>'
};

export const ICON_KEYS = Object.keys(P);

/** Icon als SVG-String. size in px, stroke folgt currentColor. */
export function icon(name, size = 24, sw = 1.8){
  const d = P[name] || P.info;
  return `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${d}</svg>`;
}

/** Optionen für <select>-Felder. */
export function iconOptions(){
  const label = {
    info:'Info', clock:'Uhr', phone:'Telefon', wifi:'WLAN', key:'Schlüssel', bed:'Bett',
    cup:'Frühstück', car:'Auto', walk:'zu Fuss', door:'Tür', stairs:'Treppe', lift:'Lift',
    parking:'Parkplatz', flag:'Fahne', tv:'TV', remote:'Fernbedienung', plug:'Steckdose',
    luggage:'Gepäck', mail:'Post', smoke:'Rauchen', arrowR:'Pfeil', check:'Haken',
    warn:'Achtung', globe:'Sprache', reception:'Rezeption', shield:'Polizei',
    fire:'Feuerwehr', ambulance:'Ambulanz', trash:'Abfall', bottle:'PET-Flasche'
  };
  return ICON_KEYS.map(k => ({ v:k, t:label[k] || k }));
}
