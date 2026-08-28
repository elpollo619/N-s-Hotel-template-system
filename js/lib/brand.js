/* Logo, Pins und Routen — die visuellen Konstanten der Marke (§3.3). */
import { BRAND } from '../brand-config.js';
import { esc } from './dom.js';

/** Teardrop-Pfad aus dem Handbuch — unverändert wiederverwenden. */
export const PIN_PATH = 'M0 0 C -18 -30 -36 -42 -36 -64 A 36 36 0 1 1 36 -64 C 36 -42 18 -30 0 0 Z';

/**
 * Marken-Logo. variant: "color" | "white".
 * Nutzt die echte Bilddatei, sobald sie in brand-config.js eingetragen ist,
 * sonst eine markentreue Inline-Wortmarke (kein 404 in der Konsole).
 */
export function logo(variant = 'color', height = 34){
  const src = variant === 'white' ? BRAND.logoWhite : BRAND.logo;
  if (src) return `<img class="ns-logo" src="${esc(src)}" alt="${esc(BRAND.name)}" style="height:${height}px;width:auto;display:block">`;
  return wordmark(variant, height);
}

/**
 * Marke der Zentrale = die verwaltende Firma (Hans Amonn AG), nicht das Hotel.
 * Nutzt das echte Firmenlogo, sobald es in brand-config.js steht; solange nicht,
 * ein schlichtes «HA»-Monogramm als sichtbarer Platzhalter (kein erfundenes
 * Logo, nur die Initialen der Firma auf ihrem eigenen Werkzeug).
 */
export function firmenLogo(variant = 'color', height = 34){
  const src = variant === 'white' ? BRAND.companyLogoWhite : BRAND.companyLogo;
  if (src) return `<img class="ns-logo" src="${esc(src)}" alt="${esc(BRAND.company)}" style="height:${height}px;width:auto;display:block">`;
  return firmenMonogramm(variant, height);
}

/** Platzhalter-Monogramm «HA» — bis das echte Firmenlogo hinterlegt ist. */
function firmenMonogramm(variant = 'color', size = 34){
  const hell = variant === 'white';
  const feld = hell ? 'rgba(255,255,255,.16)' : '#2A3350';
  const rand = hell ? 'rgba(255,255,255,.34)' : 'transparent';
  return `<svg class="ns-logo" viewBox="0 0 40 40" height="${size}" role="img"
      aria-label="${esc(BRAND.company)}" style="display:block;width:auto">
    <rect x="1" y="1" width="38" height="38" rx="9" style="fill:${feld};stroke:${rand};stroke-width:1.5"/>
    <text x="20" y="27" text-anchor="middle"
      style="fill:#fff;font-family:var(--font-display);font-weight:800;font-size:18px;letter-spacing:.02em">HA</text>
  </svg>`;
}

/**
 * Inline-Wortmarke als Fallback — übernommen aus der Referenz-Umsetzung:
 * Teardrop-Pin mit dem N's-Mark, daneben "N's" in Navy und "Hotel" in Cyan.
 */
export function wordmark(variant = 'color', height = 34){
  const navy = variant === 'white' ? '#FFFFFF' : '#2A3350';
  const cyan = variant === 'white' ? '#FFFFFF' : '#01B1E2';
  return `<svg class="ns-logo" viewBox="0 0 300 92" height="${height}" role="img"
      aria-label="${esc(BRAND.name)}" style="display:block;width:auto">
    <g transform="translate(42,80) scale(0.78)">
      <path d="${PIN_PATH}" style="fill:${navy}"/>
      <circle cx="0" cy="-64" r="23" style="fill:#ffffff"/>
      <text x="0" y="-54" text-anchor="middle"
        style="fill:${navy};font-family:var(--font-display);font-weight:800;font-size:30px">N</text>
    </g>
    <text x="92" y="47"
      style="fill:${navy};font-family:var(--font-display);font-weight:800;font-size:35px">N&#8217;s</text>
    <text x="153" y="47"
      style="fill:${cyan};font-family:var(--font-display);font-weight:600;font-size:35px">Hotel</text>
  </svg>`;
}

/** Der N's-"Mark" für den Pin: echtes favicon.png oder weisses Kästchen. */
function markInner(size){
  if (BRAND.favicon){
    return `<image href="${esc(BRAND.favicon)}" x="${-size/2}" y="${-size/2}" width="${size}" height="${size}"
       preserveAspectRatio="xMidYMid meet"/>`;
  }
  return `<text x="0" y="${size*0.33}" text-anchor="middle"
     style="fill:var(--navy);font-family:var(--font-display);font-weight:700;font-size:${size*0.66}px">N's</text>`;
}

/**
 * Pin (Teardrop) als SVG-Gruppe.
 * kind: "ns" (navy + Mark) | "p" (cyan + P) | "plain"
 * Der Pfad ist 100 Einheiten hoch; scale skaliert vom Spitzenpunkt aus.
 */
export function pin(kind = 'ns', x = 0, y = 0, scale = 0.5, label = ''){
  const isP = kind === 'p';
  const fill = isP ? 'var(--cyan)' : (kind === 'plain' ? 'var(--muted)' : 'var(--navy)');
  let inner;
  if (isP){
    inner = `<text x="0" y="-52" text-anchor="middle"
       style="fill:#fff;font-family:var(--font-display);font-weight:700;font-size:40px">P</text>`;
  } else if (kind === 'plain'){
    inner = `<circle cx="0" cy="-64" r="13" style="fill:#fff"/>`;
  } else {
    inner = `<g transform="translate(0,-64)"><rect x="-19" y="-19" width="38" height="38" rx="7" style="fill:#fff"/>
      ${markInner(30)}</g>`;
  }
  const cap = label
    ? `<text x="0" y="17" text-anchor="middle"
         style="fill:var(--navy);font-family:var(--font-display);font-weight:700;font-size:22px">${esc(label)}</text>`
    : '';
  return `<g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="4" rx="20" ry="6" style="fill:rgba(42,51,80,.18)"/>
    <path d="${PIN_PATH}" style="fill:${fill}"/>${inner}${cap}</g>`;
}

/** Fussweg: grüne runde Punkte, keine Pfeilspitze (§3.3). */
export function walkRoute(d, color = 'var(--walk)', w = 5){
  return `<path d="${d}" style="fill:none;stroke:${color};stroke-width:${w};stroke-linecap:round;stroke-dasharray:0.1 ${w * 2.2}"/>`;
}

/** Autoroute: durchgezogene Cyan-Linie, optional mit Pfeil. */
export function carRoute(d, color = 'var(--cyan)', w = 6, arrow = true){
  return `<path d="${d}" style="fill:none;stroke:${color};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round${arrow ? ';marker-end:url(#ns-arrow)' : ''}"/>`;
}

/** Pfeil-Marker (einmal pro SVG in <defs> einbinden). */
export function arrowDefs(color = 'var(--cyan)'){
  return `<defs><marker id="ns-arrow" viewBox="0 0 10 10" refX="7.5" refY="5"
    markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M0 1 L9 5 L0 9 z" style="fill:${color}"/></marker></defs>`;
}
