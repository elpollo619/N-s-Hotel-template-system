/* Kleine Helfer — von allen Vorlagen genutzt. */

/**
 * HTML-sicher escapen. Immer für Nutzertext verwenden.
 * Setzt nebenbei die Schweizer Schreibweise durch: aus "ß" wird immer "ss"
 * (§3.4 des Handbuchs) — auch wenn jemand mit deutscher Tastatur tippt.
 */
export function esc(s){
  return String(s ?? '').replace(/ß/g, 'ss').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

/** Wie esc(), zusätzlich **fett** -> <b> und Zeilenumbruch -> <br>. */
export function fmt(s){
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\r?\n/g, '<br>');
}

/** Leere Werte herausfiltern (für optionale Zeilen/Blöcke). */
export function has(v){ return v != null && String(v).trim() !== ''; }

export function qs(sel, root){ return (root || document).querySelector(sel); }
export function qsa(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }

/** Element bauen: e('div', {class:'x'}, 'Text' | Node | [..]) */
export function e(tag, attrs, kids){
  const n = document.createElement(tag);
  for (const k in (attrs || {})){
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of [].concat(kids == null ? [] : kids)){
    n.appendChild(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return n;
}

/** Schweizer Schreibweise auch ausserhalb von esc() erzwingen. */
export function swiss(s){
  return String(s ?? '').replace(/ß/g, 'ss');
}
