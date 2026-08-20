/* Miniaturen für den Hub — bewusst abstrakt, aber im Markenbild. */
export function thumb(inner, bg = '#fff'){
  return `<svg viewBox="0 0 210 297" preserveAspectRatio="xMidYMid meet">
    <rect width="210" height="297" fill="${bg}"/>${inner}</svg>`;
}
export function thumbLand(inner, bg = '#fff'){
  return `<svg viewBox="0 0 297 210" preserveAspectRatio="xMidYMid meet">
    <rect width="297" height="210" fill="${bg}"/>${inner}</svg>`;
}
/** Textzeilen andeuten. */
export function lines(x, y, w, n, gap = 7, col = '#C9CFDA', h = 3.4){
  let out = '';
  for (let i = 0; i < n; i++){
    const ww = i === n - 1 ? w * 0.62 : w;
    out += `<rect x="${x}" y="${y + i * gap}" width="${ww}" height="${h}" rx="${h / 2}" fill="${col}"/>`;
  }
  return out;
}
