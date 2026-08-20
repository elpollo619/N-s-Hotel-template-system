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

/** Inline-Wortmarke als Fallback: Mark + "N's Hotel". */
export function wordmark(variant = 'color', height = 34){
  const ink  = variant === 'white' ? '#FFFFFF' : 'var(--navy)';
  const acc  = variant === 'white' ? '#FFFFFF' : 'var(--cyan)';
  const chip = variant === 'white' ? 'rgba(255,255,255,.16)' : 'var(--navy)';
  const chipTxt = variant === 'white' ? '#FFFFFF' : '#FFFFFF';
  return `<svg class="ns-logo" viewBox="0 0 210 48" height="${height}" role="img"
      aria-label="${esc(BRAND.name)}" style="display:block;width:auto">
    <rect x="0" y="2" width="44" height="44" rx="11" style="fill:${chip}"/>
    <text x="22" y="33" text-anchor="middle"
      style="fill:${chipTxt};font-family:var(--font-display);font-weight:700;font-size:19px">N's</text>
    <text x="55" y="27"
      style="fill:${ink};font-family:var(--font-display);font-weight:700;font-size:20px;letter-spacing:.01em">N's Hotel</text>
    <text x="56" y="41"
      style="fill:${acc};font-family:var(--font-body);font-weight:600;font-size:10px;letter-spacing:.16em">KERZERS</text>
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
