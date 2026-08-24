/* Monatskalender · A4 hoch — oder das ganze Jahr.
   --------------------------------------------------------------------------
   Das eine Blatt, das jedes Haus jeden Monat aufhängt: Abfuhrdaten,
   Reinigungstage, Anlässe, Zählerablesung. Der Monat baut sich selbst:
   Wochen ab Montag, Kalenderwochen, Sonntage markiert, auf Wunsch die
   gesamtschweizerischen Feiertage (Ostern nach Gauss gerechnet).

   Drei Zeiträume:
     monat   ein Monat, ein Blatt (A4 hoch)
     jahr    zwölf Monate, je Blatt einer (A4 hoch, mehrseitig)
     planer  der Jahresplaner — alle 365 Tage auf EINEM Blatt (A4 quer),
             wie der klassische Wandplaner im Büro

   Die Einträge sind eine Liste: Monat + Tag + Text + Farbe. «Jeden Monat»
   wiederholt den Eintrag — Kehricht am 3. steht dann in jedem Monat. Was
   es im Monat nicht gibt (30. Februar), wird still ignoriert. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb } from '../lib/thumbs.js';
import { contactLine } from '../brand-config.js';

const KAL_MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const KAL_KURZ = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const KAL_TAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const KAL_TOENE = {
  cyan:  { bg:'var(--cyan-tint)',  fg:'#0a6f8c' },
  gruen: { bg:'var(--green-tint)', fg:'#146c3c' },
  navy:  { bg:'#E8EAF2',           fg:'var(--navy)' },
  pink:  { bg:'#FCE7F0',           fg:'#B02458' }
};

/* Ostersonntag nach Gauss — reicht für die beweglichen Feiertage. */
function kalOstern(jahr){
  const a = jahr % 19, b = Math.floor(jahr / 100), c = jahr % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31);
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(jahr, monat - 1, tag);
}

/* Die Feiertage, die (fast) überall in der Schweiz gelten. Kantonales —
   Berchtoldstag, Fronleichnam und Co. — trägt man als Eintrag nach. */
function kalFeiertage(jahr){
  const o = kalOstern(jahr);
  const ab = tage => { const d = new Date(o); d.setDate(o.getDate() + tage); return d; };
  const liste = [
    { d:new Date(jahr, 0, 1),   name:'Neujahr' },
    { d:ab(-2),                 name:'Karfreitag' },
    { d:ab(1),                  name:'Ostermontag' },
    { d:ab(39),                 name:'Auffahrt' },
    { d:ab(50),                 name:'Pfingstmontag' },
    { d:new Date(jahr, 7, 1),   name:'Bundesfeier' },
    { d:new Date(jahr, 11, 25), name:'Weihnachten' },
    { d:new Date(jahr, 11, 26), name:'Stephanstag' }
  ];
  const map = {};
  for (const f of liste) map[f.d.getMonth() + '-' + f.d.getDate()] = f.name;
  return map;
}

/* Kalenderwoche nach ISO 8601. */
function kalKw(d){
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const wt = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - wt + 3);
  const erster = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((t - erster) / 86400000 - 3 + ((erster.getUTCDay() + 6) % 7)) / 7);
}

/* Einträge eines Monats: «jeden Monat» plus die des konkreten Monats.
   Ältere Entwürfe ohne Monatsfeld zählen als «jeden Monat». */
function kalEintraege(d, monat, anzahl){
  const proTag = {};
  for (const e of (Array.isArray(d.eintraege) ? d.eintraege : [])){
    const em = e.monat == null || e.monat === '' || e.monat === 'alle' ? 'alle' : String(e.monat);
    if (em !== 'alle' && Number(em) !== monat) continue;
    const t = Number(e.tag);
    if (t >= 1 && t <= anzahl && has(e.text)) (proTag[t] = proTag[t] || []).push(e);
  }
  return proTag;
}

/* ---------- ein Monat als Blatt (A4 hoch) ---------- */
function kalMonatsBlatt(d, monat, jahr, feier, titelFrei){
  const erster = new Date(jahr, monat, 1);
  const anzahl = new Date(jahr, monat + 1, 0).getDate();
  const start = (erster.getDay() + 6) % 7;   /* Montag = 0 */
  const proTag = kalEintraege(d, monat, anzahl);

  const wochen = [];
  let zelle = [];
  for (let i = 0; i < start; i++) zelle.push(null);
  for (let t = 1; t <= anzahl; t++){
    zelle.push(t);
    if (zelle.length === 7){ wochen.push(zelle); zelle = []; }
  }
  if (zelle.length){ while (zelle.length < 7) zelle.push(null); wochen.push(zelle); }

  const koerper = wochen.map(w => {
    const ersterTag = w.find(t => t != null);
    const kw = kalKw(new Date(jahr, monat, ersterTag));
    return `<div class="t-kal-woche">
      <span class="t-kal-kw">${kw}</span>
      ${w.map((t, i) => {
        if (t == null) return '<span class="t-kal-zelle t-kal-zelle--leer"></span>';
        const fname = feier[monat + '-' + t];
        const sonn = i === 6;
        return `<span class="t-kal-zelle${sonn ? ' is-sonntag' : ''}${fname ? ' is-feiertag' : ''}">
          <b>${t}</b>
          ${fname ? `<em>${esc(fname)}</em>` : ''}
          ${(proTag[t] || []).map(e => {
            const ton = KAL_TOENE[e.ton] || KAL_TOENE.cyan;
            return `<i style="background:${ton.bg};color:${ton.fg}">${esc(e.text)}</i>`;
          }).join('')}
        </span>`;
      }).join('')}
    </div>`;
  }).join('');

  const titel = has(titelFrei) ? titelFrei : `${KAL_MONATE[monat]} ${jahr}`;

  return `<article data-page class="t-kal-blatt">
    <div class="t-kal-kopf">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-kal-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
        ${has(d.sub) ? `<p class="t-kal-sub">${esc(d.sub)}</p>` : ''}
      </div>
      <div class="t-kal-logo">${logo('color', 36)}</div>
    </div>

    <div class="t-kal-tage">
      <span class="t-kal-kw-kopf">KW</span>
      ${KAL_TAGE.map((t, i) => `<span${i === 6 ? ' class="is-sonntag"' : ''}>${t}</span>`).join('')}
    </div>

    <div class="t-kal-gitter">${koerper}</div>

    ${has(d.fuss) ? `<p class="t-kal-fuss">${esc(d.fuss)}</p>` : ''}
  </article>`;
}

/* ---------- der Jahresplaner: alles auf einem Blatt (A4 quer) ---------- */
function kalPlanerBlatt(d, jahr, feier){
  const anzahl = [];
  for (let m = 0; m < 12; m++) anzahl.push(new Date(jahr, m + 1, 0).getDate());
  const proMonat = [];
  for (let m = 0; m < 12; m++) proMonat.push(kalEintraege(d, m, anzahl[m]));

  let zeilen = '';
  for (let t = 1; t <= 31; t++){
    zeilen += `<span class="t-kal-p-rand">${t}</span>`;
    for (let m = 0; m < 12; m++){
      if (t > anzahl[m]){ zeilen += '<span class="t-kal-p-zelle t-kal-p-zelle--leer"></span>'; continue; }
      const wt = (new Date(jahr, m, t).getDay() + 6) % 7;
      const fname = feier[m + '-' + t];
      const eintraege = proMonat[m][t] || [];
      zeilen += `<span class="t-kal-p-zelle${wt === 6 ? ' is-sonntag' : ''}${wt === 5 ? ' is-samstag' : ''}${fname ? ' is-feiertag' : ''}">
        <em>${KAL_TAGE[wt][0]}</em>
        ${fname ? `<u>${esc(fname)}</u>` : eintraege.map(e => {
          const ton = KAL_TOENE[e.ton] || KAL_TOENE.cyan;
          return `<i style="background:${ton.bg};color:${ton.fg}">${esc(e.text)}</i>`;
        }).join('')}
      </span>`;
    }
  }

  const titel = has(d.titel) ? d.titel : `Jahresplaner ${jahr}`;

  return `<article data-page class="t-kal-planer">
    <div class="t-kal-kopf t-kal-kopf--planer">
      <div>
        ${has(d.eyebrow) ? `<p class="eyebrow t-kal-eyebrow">${esc(d.eyebrow)}</p>` : ''}
        <h1>${esc(titel)}</h1>
      </div>
      <div class="t-kal-logo">${logo('color', 32)}</div>
    </div>
    <div class="t-kal-p-gitter">
      <span class="t-kal-p-rand"></span>
      ${KAL_KURZ.map(m => `<span class="t-kal-p-monat">${m}</span>`).join('')}
      ${zeilen}
    </div>
    ${has(d.fuss) ? `<p class="t-kal-fuss">${esc(d.fuss)}</p>` : ''}
  </article>`;
}

export default {
  id:'kalender',
  title:'Monatskalender',
  sub:'Ein Monat, zwölf Monate oder der Jahresplaner — der Kalender baut sich selbst',
  badge:'Aushang',
  root:'t-kal',
  multipage:true,
  pageOf(d){ return d && d.zeitraum === 'planer' ? 'a4-land' : 'a4'; },

  thumb: thumb(`
    <rect x="18" y="16" width="110" height="13" rx="4" fill="#2A3350"/>
    <rect x="150" y="16" width="42" height="13" rx="4" fill="#01B1E2"/>
    ${[0,1,2,3,4].map(r => [0,1,2,3,4,5,6].map(c => `
      <rect x="${18 + c * 25.4}" y="${42 + r * 46}" width="23" height="42" rx="3"
        fill="${c === 6 ? '#FDECEA' : '#F6F7FA'}" stroke="#E5E8ED" stroke-width="1"/>
      <text x="${21 + c * 25.4}" y="${52 + r * 46}" font-size="7" fill="#8B8F99">${r * 7 + c + 1 <= 31 ? r * 7 + c + 1 : ''}</text>`
    ).join('')).join('')}
    <rect x="46" y="100" width="17" height="6" rx="3" fill="#01B1E2"/>
    <rect x="97" y="146" width="17" height="6" rx="3" fill="#B7E4C7"/>
    <rect x="122" y="192" width="17" height="6" rx="3" fill="#FCE7F0"/>
    <rect x="18" y="278" width="174" height="6" rx="3" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Zeitraum' },
    { k:'zeitraum', label:'Was wird gedruckt', type:'select', options:[
      { v:'monat',  t:'Ein Monat — ein Blatt (A4 hoch)' },
      { v:'jahr',   t:'Zwölf Monate — je Blatt ein Monat' },
      { v:'planer', t:'Jahresplaner — alles auf einem Blatt (A4 quer)' } ] },
    { k:'monat', label:'Monat', type:'select',
      options:KAL_MONATE.map((m, i) => ({ v:String(i), t:m })),
      hint:'Gilt nur für «Ein Monat».' },
    { k:'jahr', label:'Jahr', type:'number', min:2024, max:2040, step:1 },
    { k:'feiertage', label:'Feiertage zeigen', type:'select', options:[
      { v:'ja', t:'ja — die gesamtschweizerischen' }, { v:'nein', t:'nein' } ],
      hint:'Neujahr, Karfreitag, Ostermontag, Auffahrt, Pfingstmontag, Bundesfeier, Weihnachten, Stephanstag. Kantonales als Eintrag nachtragen.' },

    { t:'group', label:'Kopf' },
    { k:'eyebrow', label:'Handschrift-Zeile', type:'text' },
    { k:'titel',   label:'Titel', type:'text',
      hint:'Leer lassen: nimmt automatisch Monat und Jahr.' },
    { k:'sub',     label:'Untertitel', type:'text' },

    { t:'group', label:'Einträge' },
    { t:'note', label:'«Jeden Monat» wiederholt den Eintrag in allen zwölf Monaten — für Kehricht und Co. Tag ausserhalb des Monats? Wird still ignoriert.' },
    { k:'eintraege', label:'Einträge', type:'list', itemLabel:'Eintrag', max:24,
      defaultItem:{ monat:'alle', tag:1, text:'', ton:'cyan' },
      item:[
        { k:'monat', label:'Monat', type:'select', options:[
          { v:'alle', t:'jeden Monat' },
          ...KAL_MONATE.map((m, i) => ({ v:String(i), t:m })) ] },
        { k:'tag',  label:'Tag', type:'number', min:1, max:31, step:1 },
        { k:'text', label:'Text', type:'text' },
        { k:'ton',  label:'Farbe', type:'select', options:[
          { v:'cyan', t:'Cyan' }, { v:'gruen', t:'Grün' },
          { v:'navy', t:'Navy' }, { v:'pink', t:'Pink' } ] }
      ] },

    { t:'group', label:'Fusszeile' },
    { k:'fuss', label:'Adresszeile', type:'text' }
  ],

  defaults:{
    zeitraum:'monat',
    monat:String(new Date().getMonth()),
    jahr:new Date().getFullYear(),
    feiertage:'ja',
    eyebrow:'Gut zu wissen',
    titel:'',
    sub:'Abfuhr, Reinigung und Termine des Hauses auf einen Blick',
    eintraege:[
      { monat:'alle', tag:3,  text:'Kehricht', ton:'cyan' },
      { monat:'alle', tag:17, text:'Kehricht', ton:'cyan' },
      { monat:'alle', tag:10, text:'Papier und Karton', ton:'gruen' },
      { monat:'alle', tag:24, text:'Grünabfuhr', ton:'gruen' }
    ],
    fuss: contactLine()
  },

  render(d){
    const jahr = Math.max(2024, Math.min(2040, Number(d.jahr) || new Date().getFullYear()));
    const feier = d.feiertage !== 'nein' ? kalFeiertage(jahr) : {};

    if (d.zeitraum === 'planer') return kalPlanerBlatt(d, jahr, feier);
    if (d.zeitraum === 'jahr'){
      let s = '';
      for (let m = 0; m < 12; m++) s += kalMonatsBlatt(d, m, jahr, feier, '');
      return s;
    }
    const monat = Math.max(0, Math.min(11, Number(d.monat) || 0));
    return kalMonatsBlatt(d, monat, jahr, feier, d.titel);
  }
};
