/* ==========================================================================
   Schematischer Lageplan (gezeichnet, ohne Foto).
   Wird von "parkplatz" und "anfahrt-karte" genutzt. Farben und Formen folgen
   dem Handbuch: Gebäude limette, Parkplatz aussen pink, öffentliches Parking
   violett, Fussweg grün gepunktet, Autoroute cyan.
   Zeichenfläche: 600 × 400 Einheiten.
   ========================================================================== */
import { esc } from './dom.js';
import { pin, walkRoute, carRoute, arrowDefs } from './brand.js';

export function siteMap(o = {}){
  const s = Object.assign({
    strasseH:'Bahnhofstrasse',
    strasseV:'Seelandstrasse',
    hotel:"N's Hotel",
    parkplatz:'Gästeparkplatz',
    publik:'Öffentliches Parking',
    showWalk:true,
    showCar:true,
    showPublik:true,
    nord:true
  }, o);

  return `<svg class="ns-map" viewBox="0 0 600 400" role="img" aria-label="Lageplan">
  ${arrowDefs('#01B1E2')}
  <rect x="0" y="0" width="600" height="400" rx="10" style="fill:#EEF0F4"/>

  <!-- Grünflächen -->
  <path d="M0 0 H150 V96 H0 Z" style="fill:#E7F6EE"/>
  <ellipse cx="72" cy="372" rx="86" ry="42" style="fill:#E7F6EE"/>
  <ellipse cx="556" cy="60" rx="70" ry="46" style="fill:#E7F6EE"/>

  <!-- Strassen -->
  <rect x="0" y="300" width="600" height="46" style="fill:#DCE1EA"/>
  <rect x="150" y="0" width="42" height="346" style="fill:#DCE1EA"/>
  <path d="M0 323 H600" style="fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-dasharray:14 12"/>
  <path d="M171 0 V300" style="fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-dasharray:14 12"/>

  <!-- Gebäude -->
  <rect x="212" y="108" width="196" height="132" rx="6" style="fill:#B7D900;stroke:#8FA800;stroke-width:3"/>
  <text x="310" y="142" text-anchor="middle"
    style="fill:#2A3350;font-family:var(--font-display);font-weight:700;font-size:21px">${esc(s.hotel)}</text>
  <rect x="288" y="228" width="44" height="12" rx="3" style="fill:#2A3350"/>
  <text x="276" y="256" text-anchor="end"
    style="fill:#5A6480;font-family:var(--font-body);font-weight:600;font-size:12px;letter-spacing:.06em">Eingang</text>

  <!-- Gästeparkplatz -->
  <rect x="440" y="150" width="126" height="96" rx="6"
    style="fill:#FCE7F0;stroke:#E5387E;stroke-width:2.6;stroke-dasharray:9 6"/>
  ${[0,1,2,3].map(i => `<path d="M${456 + i * 28} 158 V238" style="fill:none;stroke:#E5387E;stroke-width:1.6;opacity:.55"/>`).join('')}
  <text x="503" y="174" text-anchor="middle"
    style="fill:#E5387E;font-family:var(--font-display);font-weight:700;font-size:14px">${esc(s.parkplatz)}</text>

  ${s.showPublik ? `<rect x="36" y="128" width="96" height="86" rx="6"
    style="fill:#F3EAFD;stroke:#8E44EF;stroke-width:2.4;stroke-dasharray:9 6"/>
  <text x="84" y="234" text-anchor="middle"
    style="fill:#8E44EF;font-family:var(--font-display);font-weight:700;font-size:13px">${esc(s.publik)}</text>` : ''}

  <!-- Routen -->
  ${s.showCar ? carRoute('M8 334 H452 C486 334 498 318 500 292', '#01B1E2', 7, true) : ''}
  ${s.showWalk ? walkRoute('M470 250 C 424 288 372 272 322 250', '#12A150', 7) : ''}

  <!-- Strassennamen -->
  <text x="24" y="291" style="fill:#5A6480;font-family:var(--font-body);font-weight:700;font-size:14px;letter-spacing:.1em">${esc(s.strasseH).toUpperCase()}</text>
  <text x="0" y="0" transform="translate(140,40) rotate(-90)" text-anchor="end"
    style="fill:#5A6480;font-family:var(--font-body);font-weight:700;font-size:14px;letter-spacing:.1em">${esc(s.strasseV).toUpperCase()}</text>

  <!-- Pins -->
  ${pin('ns', 310, 236, 0.62)}
  ${pin('p', 503, 240, 0.52)}

  ${s.nord ? `<g transform="translate(566,352)">
    <circle cx="0" cy="0" r="20" style="fill:#FFFFFF;opacity:.9"/>
    <path d="M0 -13 L7 7 L0 2 L-7 7 Z" style="fill:#2A3350"/>
    <text x="0" y="-16" text-anchor="middle"
      style="fill:#2A3350;font-family:var(--font-display);font-weight:700;font-size:11px">N</text>
  </g>` : ''}
</svg>`;
}

/** Legende passend zum Plan. */
export function mapLegend(items){
  return `<div class="ns-legend">${items.map(i => `
    <span class="ns-legend-item">
      <span class="ns-legend-dot" style="background:${i.color};${i.dashed ? 'border-radius:2px;' : ''}"></span>
      ${esc(i.label)}
    </span>`).join('')}</div>`;
}
