/* ==========================================================================
   Plan-Editor — portiert aus src/mapeditor.js des Originals.
   Alles auf dem Plan ist frei verschiebbar: Zonen, Wege, Pins, Piktogramme
   und Beschriftungen. Zonen und Wege haben blaue Punkte zum Umformen,
   Doppelklick auf einen Punkt entfernt ihn.

   Unterschied zum Original: der Zustand gehoert der Vorlage (state.plan) und
   wird von der App gesichert, statt einen eigenen localStorage-Schluessel zu
   fuehren. Bedienelemente sitzen im linken Panel der Vorlagen-Zentrale.
   ========================================================================== */
import { BRAND } from '../brand-config.js';
import { esc } from './dom.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Farbfelder wie im Original */
export const SWATCHES = ['#1F9D57','#B7D900','#E5387E','#8E44EF','#01B1E2',
                         '#E23A2E','#F5A623','#2A3350','#FFFFFF'];

/* Piktogramme in lokalen Koordinaten um (0,0) — unveraendert uebernommen. */
const ICONS = {
  walk:'<circle cx="0" cy="-9" r="3.4"/><path d="M-0.5 -6 L-0.5 3 M-0.5 -3 L-6 -0.5 M-0.5 -3 L5.5 -1 M-0.5 3 L-4.5 11 M-0.5 3 L4 10.5" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  car:'<rect x="-11" y="-5" width="22" height="10" rx="3"/><path d="M-7 -5 L-4 -10 L4 -10 L7 -5 Z"/><circle cx="-6" cy="6" r="2.6" fill="#20263a"/><circle cx="6" cy="6" r="2.6" fill="#20263a"/>',
  door:'<rect x="-7" y="-11" width="14" height="22" rx="1.5" fill="none" stroke-width="2.4"/><circle cx="3.5" cy="0" r="1.6"/>',
  bed:'<path d="M-11 -2 L-11 8 M-11 2 L11 2 L11 8 M11 4 L11 8 M-11 2 L-11 -4 L-2 -4 A3 3 0 0 1 1 -1 L1 2" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  info:'<circle cx="0" cy="0" r="11" fill="none" stroke-width="2.4"/><circle cx="0" cy="-4.5" r="1.6" stroke="none"/><path d="M0 -1 L0 6" stroke-width="2.6" stroke-linecap="round"/>',
  key:'<circle cx="-5" cy="0" r="5" fill="none" stroke-width="2.4"/><path d="M0 0 L11 0 M8 0 L8 4 M4 0 L4 5" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  stairs:'<path d="M-10 8 L-10 3 L-3 3 L-3 -2 L4 -2 L4 -7 L11 -7" fill="none" stroke-width="2.4" stroke-linejoin="round"/>',
  lift:'<rect x="-8" y="-11" width="16" height="22" rx="2" fill="none" stroke-width="2.2"/><path d="M-3 -3 L0 -7 L3 -3 Z M-3 3 L0 7 L3 3 Z" stroke="none"/>',
  p:'<path d="M-4 8 L-4 -8 L2 -8 A5 5 0 0 1 2 2 L-4 2" fill="none" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>',
  flag:'<path d="M-7 11 L-7 -11 L8 -8 L2 -3 L8 2 L-7 4" fill="currentfill" stroke-width="2" stroke-linejoin="round"/>'
};
export const ICON_LIST = [['walk','zu Fuss'],['car','Auto'],['door','Eingang'],['bed','Zimmer'],
  ['info','Info'],['key','Check-in'],['stairs','Treppe'],['lift','Lift'],['p','Parkplatz'],['flag','Ziel']];

/* Ausgangsplan, ausgerichtet auf das hinterlegte Luftbild (swisstopo,
   zentriert auf Allmendstrasse 14). Die Flächen sind eine erste Näherung —
   wer den Ort kennt, zieht sie in Sekunden an die richtige Stelle. */
export function seedPlan(){
  let n = 0;
  const id = () => 'e' + (++n);
  const els = [
      // Gebäude (Check-in) — der Baukörper in der Bildmitte
      { id:id(), type:'poly', pts:[[905,700],[1075,610],[1345,860],[1175,950]], fill:'#B7D900', fillOp:.30, stroke:'#8FA800', sw:7, text:'' },
      // Garten östlich des Hauses
      { id:id(), type:'poly', pts:[[1365,600],[1525,540],[1605,700],[1445,762]], fill:'#1F9D57', fillOp:.26, stroke:'#1F9D57', sw:7, text:'' },
      // Aussen-Parkplatz, die befestigte Fläche südlich
      { id:id(), type:'poly', pts:[[1010,1090],[1270,1052],[1292,1200],[1032,1238]], fill:'#E5387E', fillOp:.28, stroke:'#E5387E', sw:7, text:'' },
      // Fussweg vom Parkplatz zum Eingang
      { id:id(), type:'route', pts:[[1140,1075],[1180,990],[1207,918]], stroke:'#12A150', sw:11, dash:true, arrow:false },
      { id:id(), type:'pin', variant:'ns', x:1207, y:912, color:'#2A3350', scale:1.4 },
      { id:id(), type:'pin', variant:'p',  x:1140, y:1085, color:'#01B1E2', scale:1.2 },
      { id:id(), type:'icon', kind:'car', x:1330, y:1010, color:'#01B1E2', scale:1.6 },
      { id:id(), type:'label', x:700,  y:170,  ax:1120, ay:1090, de:'Aussen-Parkplatz', en:'Outside parking', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 },
      { id:id(), type:'label', x:1760, y:430,  ax:1490, ay:650,  de:'Garten', en:'Garden', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 },
      { id:id(), type:'label', x:1760, y:600,  ax:1240, ay:880,  de:'Eingang', en:'Entrance', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 },
      { id:id(), type:'label', x:1760, y:770,  ax:1370, ay:800,  de:'Terrassen-Türe', en:'Terrace door', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 },
      { id:id(), type:'label', x:250,  y:770,  ax:1160, ay:880,  de:"N's Hotel — Self Check-in", en:'', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 },
      { id:id(), type:'label', x:1760, y:990,  ax:1330, ay:1010, de:'Einstellhalle', en:'Garage / by car', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 },
      { id:id(), type:'label', x:250,  y:1010, ax:1100, ay:960,  de:'Eingang', en:'Entrance', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 }
  ];
  // seq muss hinter der letzten vergebenen Nummer stehen, sonst bekommt das
  // erste neue Element die id des letzten Saat-Elements.
  return { seq: n + 1, sel: null, els };
}

/* ---------- kleine SVG-Helfer ------------------------------------------- */
function mk(name, attrs){
  const e = document.createElementNS(SVG_NS, name);
  for (const k in (attrs || {})) e.setAttribute(k, attrs[k]);
  return e;
}
function txt(x, y, s, attrs){
  const t = mk('text', attrs);
  t.setAttribute('x', x); t.setAttribute('y', y);
  t.textContent = s;
  return t;
}
function routeD(pts){ return pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' '); }
function centroid(pts){
  let x = 0, y = 0;
  pts.forEach(p => { x += p[0]; y += p[1]; });
  return { x:x / pts.length, y:y / pts.length };
}
function labelSize(el){
  const w = Math.max((el.de || '').length * 16.5, (el.en || '').length * 11.5) + 40;
  return { w:Math.max(w, 120), h:el.en ? 70 : 46 };
}
function segDist(p, a, b){
  const A = p.x - a[0], B = p.y - a[1], C = b[0] - a[0], D = b[1] - a[1];
  const dot = A * C + B * D, len = C * C + D * D;
  const t = len ? Math.max(0, Math.min(1, dot / len)) : 0;
  return Math.hypot(p.x - (a[0] + t * C), p.y - (a[1] + t * D));
}
function toHex(c){
  if (!c) return '#000000';
  if (c[0] === '#' && c.length === 7) return c;
  const m = document.createElement('canvas').getContext('2d');
  m.fillStyle = c;
  return m.fillStyle;
}

/**
 * Haengt den Editor an ein bereits gezeichnetes Blatt.
 * @returns {Function} Aufraeum-Funktion
 */
export function mountPlanEditor({ sheet, panel, state, save, repaint }){
  const svg   = sheet.querySelector('[data-plan-svg]');
  const mapEl = sheet.querySelector('[data-plan-map]');
  const bgimg = sheet.querySelector('[data-plan-bg]');
  const scene = sheet.querySelector('[data-plan-scene]');
  if (!svg || !scene) return null;

  if (!state.plan || !state.plan.els) state.plan = seedPlan();
  if (!state.view) state.view = { rot:0, zoom:1, cx:null, cy:null };
  const plan = state.plan;
  const view = state.view;

  const elLayer = mk('g');
  const hdLayer = mk('g', { class:'om-handles' });
  scene.appendChild(elLayer);
  scene.appendChild(hdLayer);

  let imgW = Number(state.imgW) || 2414;
  let imgH = Number(state.imgH) || 1654;
  let drag = null, addPointMode = false;

  const find = i => plan.els.find(e => e.id === i) || null;
  // Vergibt eine wirklich freie id — auch wenn ein alter Entwurf einen zu
  // kleinen Zähler mitbringt.
  const nextId = () => {
    let i;
    do { i = 'e' + (plan.seq++); } while (plan.els.some(e => e.id === i));
    return i;
  };

  /* ---------- Zeichnen ---------------------------------------------------- */
  function draw(){
    elLayer.innerHTML = ''; hdLayer.innerHTML = '';
    plan.els.forEach(drawEl);
    if (plan.sel){ const el = find(plan.sel); if (el) drawHandles(el); }
  }

  function drawEl(el){
    const g = mk('g', { 'data-id':el.id, style:'cursor:move' });

    if (el.type === 'poly'){
      const pts = el.pts.map(p => p[0] + ',' + p[1]).join(' ');
      g.appendChild(mk('polygon', { points:pts, fill:el.fill, 'fill-opacity':el.fillOp,
        stroke:el.stroke, 'stroke-width':el.sw, 'stroke-linejoin':'round' }));
      if (el.text){
        const c = centroid(el.pts);
        g.appendChild(txt(c.x, c.y + 18, el.text, { 'font-size':56, 'font-weight':800, fill:'#fff',
          stroke:el.stroke, 'stroke-width':2, 'paint-order':'stroke', 'text-anchor':'middle' }));
      }
    } else if (el.type === 'route'){
      const d = routeD(el.pts);
      g.appendChild(mk('path', { d, fill:'none', stroke:'#fff', 'stroke-width':el.sw + 5,
        'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-opacity':.55 }));
      const attrs = { d, fill:'none', stroke:el.stroke, 'stroke-width':el.sw,
        'stroke-linecap':'round', 'stroke-linejoin':'round' };
      if (el.dash)  attrs['stroke-dasharray'] = '0.1 ' + (el.sw * 1.9);
      if (el.arrow) attrs['marker-end'] = 'url(#ns-plan-arrow)';
      g.appendChild(mk('path', attrs));
      const head = svg.querySelector('#ns-plan-arrow path');
      if (head) head.setAttribute('fill', el.stroke);
      // breite unsichtbare Trefferflaeche
      g.appendChild(mk('path', { d, fill:'none', stroke:'#000', 'stroke-opacity':0,
        'stroke-width':Math.max(el.sw + 22, 26) }));
    } else if (el.type === 'pin'){
      const s = el.scale || 1;
      const variant = el.variant || 'ns';
      const col = el.color || (variant === 'p' ? '#01B1E2' : '#2A3350');
      const gg = mk('g', { transform:`translate(${el.x} ${el.y}) scale(${s})` });
      gg.appendChild(mk('path', { d:'M0 0 C -18 -30 -36 -42 -36 -64 A 36 36 0 1 1 36 -64 C 36 -42 18 -30 0 0 Z',
        fill:col, stroke:'#fff', 'stroke-width':5, 'stroke-linejoin':'round' }));
      if (variant === 'ns'){
        gg.appendChild(mk('rect', { x:-28, y:-92, width:56, height:56, rx:12, fill:'#fff' }));
        if (BRAND.favicon){
          const im = mk('image', { x:-22, y:-86, width:44, height:44, preserveAspectRatio:'xMidYMid meet' });
          im.setAttribute('href', BRAND.favicon);
          gg.appendChild(im);
        } else {
          gg.appendChild(txt(0, -54, "N's", { 'font-size':26, 'font-weight':800, fill:col, 'text-anchor':'middle' }));
        }
      } else if (variant === 'p'){
        gg.appendChild(txt(0, -48, 'P', { 'font-size':54, 'font-weight':800, fill:'#fff', 'text-anchor':'middle' }));
      } else {
        gg.appendChild(mk('circle', { cx:0, cy:-64, r:13, fill:'#fff' }));
      }
      g.appendChild(gg);
    } else if (el.type === 'icon'){
      const sc = el.scale || 1.4, r = 15 * sc;
      const gi = mk('g', { transform:`translate(${el.x} ${el.y})` });
      gi.appendChild(mk('circle', { cx:0, cy:0, r, fill:el.color, stroke:'#fff', 'stroke-width':3 }));
      const glyph = mk('g', { transform:`scale(${sc * 0.95})`, fill:'#fff', stroke:'#fff' });
      glyph.innerHTML = (ICONS[el.kind] || ICONS.info).replace(/currentfill/g, '#fff');
      gi.appendChild(glyph);
      g.appendChild(gi);
    } else if (el.type === 'label'){
      const sz = labelSize(el);
      // Fuehrungslinie zum naechsten Kastenrand
      const epx = (el.ax > el.x + sz.w) ? el.x + sz.w : (el.ax < el.x ? el.x : el.ax);
      const epy = (el.ay > el.y + sz.h) ? el.y + sz.h : (el.ay < el.y ? el.y : el.ay);
      g.appendChild(mk('line', { x1:el.ax, y1:el.ay, x2:epx, y2:epy, stroke:'#fff', 'stroke-width':6, 'stroke-linecap':'round' }));
      g.appendChild(mk('line', { x1:el.ax, y1:el.ay, x2:epx, y2:epy, stroke:el.tcolor, 'stroke-width':el.sw }));
      g.appendChild(mk('circle', { cx:el.ax, cy:el.ay, r:8, fill:el.tcolor, stroke:'#fff', 'stroke-width':3 }));
      g.appendChild(mk('rect', { x:el.x, y:el.y, width:sz.w, height:sz.h, rx:12,
        fill:el.bg, stroke:el.tcolor, 'stroke-width':el.sw }));
      g.appendChild(txt(el.x + 20, el.y + (el.en ? 34 : 31), el.de, { 'font-size':31, 'font-weight':800, fill:el.tcolor }));
      if (el.en) g.appendChild(txt(el.x + 20, el.y + 58, el.en, { 'font-size':21, 'font-weight':600, fill:'#8B8F99' }));
    }

    g.addEventListener('pointerdown', ev => startBody(ev, el));
    elLayer.appendChild(g);
  }

  function drawHandles(el){
    if (el.type === 'poly' || el.type === 'route'){
      if (el.type === 'poly'){
        const pts = el.pts.map(p => p[0] + ',' + p[1]).join(' ');
        hdLayer.appendChild(mk('polygon', { points:pts, fill:'none', stroke:'#01B1E2',
          'stroke-width':2, 'stroke-dasharray':'6 6' }));
      }
      el.pts.forEach((p, i) => {
        const h = mk('circle', { cx:p[0], cy:p[1], r:13, fill:'#fff', stroke:'#01B1E2',
          'stroke-width':4, style:'cursor:grab' });
        h.addEventListener('pointerdown', ev => startVertex(ev, el, i));
        h.addEventListener('dblclick', ev => { ev.stopPropagation(); removeVertex(el, i); });
        hdLayer.appendChild(h);
      });
    } else if (el.type === 'label'){
      const sz = labelSize(el);
      hdLayer.appendChild(mk('rect', { x:el.x - 3, y:el.y - 3, width:sz.w + 6, height:sz.h + 6, rx:13,
        fill:'none', stroke:'#01B1E2', 'stroke-width':2, 'stroke-dasharray':'6 6' }));
      const a = mk('circle', { cx:el.ax, cy:el.ay, r:13, fill:'#fff', stroke:'#E23A2E',
        'stroke-width':4, style:'cursor:grab' });
      a.addEventListener('pointerdown', ev => startAnchor(ev, el));
      hdLayer.appendChild(a);
    } else {
      const rr = el.type === 'pin' ? 48 : 26;
      hdLayer.appendChild(mk('circle', { cx:el.x, cy:el.y - (el.type === 'pin' ? 64 : 0), r:rr,
        fill:'none', stroke:'#01B1E2', 'stroke-width':2, 'stroke-dasharray':'6 6' }));
    }
  }

  /* ---------- Ziehen ------------------------------------------------------ */
  function toSVG(evt){
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const p = pt.matrixTransform(scene.getScreenCTM().inverse());
    return { x:p.x, y:p.y };
  }
  function startBody(ev, el){
    ev.stopPropagation();
    select(el.id);
    if (addPointMode && el.type === 'route'){ insertVertex(el, toSVG(ev)); return; }
    drag = { mode:'move', el, last:toSVG(ev) };
    try{ svg.setPointerCapture(ev.pointerId); }catch(_){}
  }
  function startVertex(ev, el, i){
    ev.stopPropagation(); select(el.id);
    drag = { mode:'vertex', el, vi:i, last:toSVG(ev) };
    try{ svg.setPointerCapture(ev.pointerId); }catch(_){}
  }
  function startAnchor(ev, el){
    ev.stopPropagation(); select(el.id);
    drag = { mode:'anchor', el, last:toSVG(ev) };
    try{ svg.setPointerCapture(ev.pointerId); }catch(_){}
  }

  function onMove(ev){
    if (drag && drag.mode === 'pan'){
      const rect = mapEl.getBoundingClientRect();
      const r = (((view.rot || 0) % 360) + 360) % 360;
      const bw = (r === 90 || r === 270) ? imgH : imgW;
      const bh = (r === 90 || r === 270) ? imgW : imgH;
      const z = view.zoom || 1;
      view.cx -= (ev.clientX - drag.last.cx) / rect.width * (bw / z);
      view.cy -= (ev.clientY - drag.last.cy) / rect.height * (bh / z);
      drag.last = { cx:ev.clientX, cy:ev.clientY };
      applyView();
      return;
    }
    if (!drag) return;
    const p = toSVG(ev), dx = p.x - drag.last.x, dy = p.y - drag.last.y;
    drag.last = p;
    const el = drag.el;
    if (drag.mode === 'move'){
      if (el.pts) el.pts.forEach(q => { q[0] += dx; q[1] += dy; });
      if (el.type === 'label'){ el.x += dx; el.y += dy; el.ax += dx; el.ay += dy; }
      if (el.type === 'pin' || el.type === 'icon'){ el.x += dx; el.y += dy; }
    } else if (drag.mode === 'vertex'){
      el.pts[drag.vi][0] += dx; el.pts[drag.vi][1] += dy;
    } else if (drag.mode === 'anchor'){
      el.ax += dx; el.ay += dy;
    }
    draw();
  }
  function onUp(){ if (drag){ drag = null; save(); } }
  function onDown(ev){
    if (ev.target === svg || ev.target === bgimg){
      if ((view.zoom || 1) > 1){
        drag = { mode:'pan', last:{ cx:ev.clientX, cy:ev.clientY } };
        try{ svg.setPointerCapture(ev.pointerId); }catch(_){}
      } else select(null);
    }
  }

  function insertVertex(el, p){
    let best = el.pts.length, bd = 1e9;
    for (let i = 0; i < el.pts.length - 1; i++){
      const d = segDist(p, el.pts[i], el.pts[i + 1]);
      if (d < bd){ bd = d; best = i + 1; }
    }
    el.pts.splice(best, 0, [p.x, p.y]);
    draw(); save();
  }
  function removeVertex(el, i){
    const min = el.type === 'poly' ? 3 : 2;
    if (el.pts.length <= min) return;
    el.pts.splice(i, 1); draw(); save();
  }

  /* ---------- Auswahl und Eigenschaften ----------------------------------- */
  function select(i){ plan.sel = i; draw(); renderPanel(); save(); }

  const TYPE_NAME = { poly:'Zone / Gebäude', route:'Weg', pin:'Pin', icon:'Piktogramm', label:'Beschriftung' };

  function colorRow(lbl, val, key){
    const sw = SWATCHES.map(c => `<button class="vz-sw" data-c="${c}" style="background:${c}"></button>`).join('');
    return `<div class="vz-prop"><label>${lbl}</label>
      <div class="vz-sws" data-key="${key}">${sw}<input type="color" value="${toHex(val)}" data-key="${key}"></div></div>`;
  }
  const rangeRow = (lbl, val, mn, mx, st, key) =>
    `<div class="vz-prop"><label>${lbl} <span>${(+val).toFixed(st < 1 ? 2 : 0)}</span></label>
      <input type="range" min="${mn}" max="${mx}" step="${st}" value="${val}" data-key="${key}"></div>`;
  const toggleRow = (lbl, val, key) =>
    `<div class="vz-prop is-inline"><label>${lbl}</label>
      <input type="checkbox" ${val ? 'checked' : ''} data-key="${key}"></div>`;
  const textRow = (lbl, val, key) =>
    `<div class="vz-prop"><label>${lbl}</label>
      <input type="text" value="${esc(val || '')}" data-key="${key}"></div>`;
  const selectRow = (lbl, val, opts, key) =>
    `<div class="vz-prop"><label>${lbl}</label><select data-key="${key}">${
      opts.map(o => `<option value="${o[0]}"${o[0] === val ? ' selected' : ''}>${esc(o[1])}</option>`).join('')
    }</select></div>`;

  function renderPanel(){
    const tools = `
      <div class="vz-tools">
        <button class="vz-tool" data-add="poly">＋ Zone</button>
        <button class="vz-tool" data-add="route">＋ Weg</button>
        <button class="vz-tool" data-add="pin">＋ Pin</button>
        <button class="vz-tool" data-add="label">＋ Text</button>
      </div>
      <div class="vz-tools">
        <button class="vz-tool" data-add="icon">＋ Piktogramm</button>
        <select data-icon-kind>${ICON_LIST.map(p => `<option value="${p[0]}">${p[1]}</option>`).join('')}</select>
      </div>
      <div class="vz-tools">
        <button class="vz-tool" data-rotate>↻ Alles drehen</button>
        <button class="vz-tool" data-zoomreset>⤢ Zoom zurück</button>
        <button class="vz-tool" data-planreset>Plan zurücksetzen</button>
      </div>
      <div class="vz-prop"><label>Zoom Bild <span>${(view.zoom || 1).toFixed(1)}×</span></label>
        <input type="range" min="1" max="4" step="0.1" value="${view.zoom || 1}" data-zoom></div>`;

    const el = plan.sel ? find(plan.sel) : null;
    let h = tools;

    if (!el){
      h += `<p class="vz-tip">Ein Element auf dem Plan anklicken, um es zu bearbeiten. Zum Verschieben
        ziehen. Bei Zonen und Wegen die blauen Punkte ziehen; Doppelklick auf einen Punkt entfernt ihn.
        Ist das Bild gezoomt, lässt sich der Hintergrund verschieben.</p>`;
    } else {
      h += `<div class="vz-prop"><b>${TYPE_NAME[el.type]}</b></div>`;
      if (el.type === 'poly'){
        h += colorRow('Füllung', el.fill, 'fill');
        h += rangeRow('Deckkraft', el.fillOp, 0, .85, .01, 'fillOp');
        h += colorRow('Rand', el.stroke, 'stroke');
        h += rangeRow('Liniendicke', el.sw, 0, 24, 1, 'sw');
        h += textRow('Symbol (z. B. P)', el.text, 'text');
      } else if (el.type === 'route'){
        h += colorRow('Farbe', el.stroke, 'stroke');
        h += rangeRow('Liniendicke', el.sw, 2, 26, 1, 'sw');
        h += toggleRow('Gestrichelt', el.dash, 'dash');
        h += toggleRow('Pfeil am Ende', el.arrow, 'arrow');
        h += `<button class="vz-tool${addPointMode ? ' is-on' : ''}" data-addpt>＋ Punkt-Modus${addPointMode ? ' (an)' : ''}</button>`;
      } else if (el.type === 'pin'){
        h += selectRow('Typ', el.variant || 'ns', [['ns',"N's Hotel"],['p','Parkplatz P'],['plain','Einfach']], 'variant');
        h += colorRow('Farbe', el.color, 'color');
        h += rangeRow('Grösse', el.scale, .6, 2.6, .05, 'scale');
      } else if (el.type === 'icon'){
        h += selectRow('Symbol', el.kind, ICON_LIST, 'kind');
        h += colorRow('Farbe', el.color, 'color');
        h += rangeRow('Grösse', el.scale, .8, 3, .1, 'scale');
      } else if (el.type === 'label'){
        h += textRow('Text (DE)', el.de, 'de');
        h += textRow('Text (EN)', el.en, 'en');
        h += colorRow('Textfarbe', el.tcolor, 'tcolor');
        h += colorRow('Hintergrund', el.bg, 'bg');
        h += rangeRow('Liniendicke', el.sw, 1, 6, .2, 'sw');
      }
      h += `<div class="vz-prop-btns">
        <button class="vz-tool" data-dup style="flex:1">Duplizieren</button>
        <button class="vz-tool" data-front style="flex:1">Nach vorne</button></div>
        <button class="vz-del" data-del>Löschen</button>`;
    }
    panel.innerHTML = h;
    wirePanel(el);
  }

  function wirePanel(el){
    panel.querySelectorAll('[data-add]').forEach(b => {
      b.onclick = () => addElement(b.dataset.add, panel.querySelector('[data-icon-kind]')?.value);
    });
    const rot = panel.querySelector('[data-rotate]');
    if (rot) rot.onclick = () => { view.rot = (((view.rot || 0) + 90) % 360); view.cx = null; view.cy = null; applyView(); save(); };
    const zr = panel.querySelector('[data-zoomreset]');
    if (zr) zr.onclick = () => { view.zoom = 1; view.cx = null; view.cy = null; applyView(); renderPanel(); save(); };
    const pr = panel.querySelector('[data-planreset]');
    if (pr) pr.onclick = () => {
      if (!confirm('Alle Änderungen am Plan verwerfen und den Standard laden?')) return;
      state.plan = seedPlan();
      repaint();
    };
    const zs = panel.querySelector('[data-zoom]');
    if (zs) zs.oninput = () => {
      view.zoom = parseFloat(zs.value);
      zs.previousElementSibling.querySelector('span').textContent = view.zoom.toFixed(1) + '×';
      applyView(); save();
    };
    if (!el) return;

    panel.querySelectorAll('input[type=range][data-key],input[type=text][data-key],select[data-key]').forEach(inp => {
      inp.addEventListener('input', () => {
        el[inp.dataset.key] = inp.type === 'range' ? parseFloat(inp.value) : inp.value;
        if (inp.type === 'range'){
          const lab = inp.parentNode.querySelector('label span');
          if (lab) lab.textContent = (+inp.value).toFixed(parseFloat(inp.step) < 1 ? 2 : 0);
        }
        draw(); save();
      });
    });
    panel.querySelectorAll('input[type=checkbox][data-key]').forEach(inp => {
      inp.addEventListener('change', () => { el[inp.dataset.key] = inp.checked; draw(); save(); });
    });
    panel.querySelectorAll('input[type=color][data-key]').forEach(inp => {
      inp.addEventListener('input', () => { el[inp.dataset.key] = inp.value; draw(); save(); });
    });
    panel.querySelectorAll('.vz-sw').forEach(b => {
      b.onclick = () => { el[b.parentNode.dataset.key] = b.dataset.c; draw(); save(); renderPanel(); };
    });
    const ap = panel.querySelector('[data-addpt]');
    if (ap) ap.onclick = () => { addPointMode = !addPointMode; renderPanel(); };
    const del = panel.querySelector('[data-del]');
    if (del) del.onclick = () => { plan.els = plan.els.filter(e => e.id !== el.id); select(null); };
    const dup = panel.querySelector('[data-dup]');
    if (dup) dup.onclick = () => {
      const c = JSON.parse(JSON.stringify(el));
      c.id = nextId();
      if (c.pts) c.pts = c.pts.map(p => [p[0] + 40, p[1] + 40]);
      if (c.x != null){ c.x += 40; c.y += 40; }
      if (c.ax != null){ c.ax += 40; c.ay += 40; }
      plan.els.push(c); select(c.id);
    };
    const front = panel.querySelector('[data-front]');
    if (front) front.onclick = () => {
      plan.els = plan.els.filter(e => e.id !== el.id);
      plan.els.push(el); draw(); save();
    };
  }

  function addElement(type, kind){
    const cx = 1200, cy = 830;
    let e;
    if (type === 'poly') e = { id:nextId(), type:'poly', pts:[[cx-120,cy-90],[cx+120,cy-90],[cx+120,cy+90],[cx-120,cy+90]], fill:'#01B1E2', fillOp:.28, stroke:'#01B1E2', sw:7, text:'' };
    else if (type === 'route') e = { id:nextId(), type:'route', pts:[[cx-160,cy],[cx+160,cy]], stroke:'#12A150', sw:11, dash:true, arrow:false };
    else if (type === 'pin')   e = { id:nextId(), type:'pin', variant:'ns', x:cx, y:cy, color:'#2A3350', scale:1.5 };
    else if (type === 'icon')  e = { id:nextId(), type:'icon', kind:kind || 'info', x:cx, y:cy, color:'#2A3350', scale:1.7 };
    else if (type === 'label') e = { id:nextId(), type:'label', x:cx-80, y:cy-140, ax:cx, ay:cy, de:'Neuer Text', en:'', tcolor:'#2A3350', bg:'#ffffff', sw:2.6 };
    plan.els.push(e); select(e.id);
  }

  /* ---------- Drehen und Zoomen ------------------------------------------- */
  function applyView(){
    const r = (((view.rot || 0) % 360) + 360) % 360;
    const bw = (r === 90 || r === 270) ? imgH : imgW;
    const bh = (r === 90 || r === 270) ? imgW : imgH;
    const z = view.zoom || 1;
    const vw = bw / z, vh = bh / z;
    if (view.cx == null) view.cx = bw / 2;
    if (view.cy == null) view.cy = bh / 2;
    const x = Math.max(0, Math.min(bw - vw, view.cx - vw / 2));
    const y = Math.max(0, Math.min(bh - vh, view.cy - vh / 2));
    svg.setAttribute('viewBox', `${x} ${y} ${vw} ${vh}`);
    let t = '';
    if (r === 90)       t = `translate(${imgH} 0) rotate(90)`;
    else if (r === 180) t = `translate(${imgW} ${imgH}) rotate(180)`;
    else if (r === 270) t = `translate(0 ${imgW}) rotate(270)`;
    scene.setAttribute('transform', t);
  }

  /* ---------- Tastatur ----------------------------------------------------- */
  function onKey(e){
    if ((e.key !== 'Delete' && e.key !== 'Backspace') || !plan.sel) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const el = find(plan.sel);
    if (!el) return;
    plan.els = plan.els.filter(x => x.id !== el.id);
    select(null);
    e.preventDefault();
  }

  /* ---------- Start -------------------------------------------------------- */
  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('pointerup', onUp);
  svg.addEventListener('pointercancel', onUp);
  svg.addEventListener('pointerdown', onDown);
  window.addEventListener('keydown', onKey);

  applyView();
  draw();
  renderPanel();

  return function unmount(){
    window.removeEventListener('keydown', onKey);
    if (panel) panel.innerHTML = '';
  };
}
