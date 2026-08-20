/* Gästemappe · mehrseitige Mappe fürs Zimmer, A4 hoch.
   Ersetzt die bisherige HTML-Mappe des Hauses als druckbare Fassung:
   ohne Leaflet, ohne CDN, ohne Live-Abfragen — dafür überall lauffähig
   und wörtlich zweisprachig DE/EN (§3.4).
   Jede <section data-page> ist eine echte Druckseite (siehe .sheet--multi). */
import { esc, fmt, has } from '../lib/dom.js';
import { logo, PIN_PATH } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { BRAND, addressLine } from '../brand-config.js';

const JN = [{ v:'ja', t:'Ja' }, { v:'nein', t:'Nein' }];
const on = v => String(v ?? 'ja') !== 'nein';

/* Kopf- und Fusszeile jeder Innenseite. */
function frame(kicker, nr, inner){
  return `<section data-page class="gm-pg">
    <header class="gm-head">
      <span class="gm-hl">${logo('color', 20)}<em>Gästemappe</em></span>
      <span class="gm-hr">${esc(kicker)}</span>
    </header>
    <div class="gm-pad">${inner}</div>
    <footer class="gm-foot"><span>${esc(BRAND.name)} · ${esc(BRAND.city)}</span><span>${String(nr).padStart(2, '0')}</span></footer>
  </section>`;
}

/* Kapitelkopf: Nummer, Handschrift, Titel, Lead DE/EN. */
function opener(num, kick, titleDe, titleEn, leadDe, leadEn){
  return `<div class="gm-open">
    ${num ? `<span class="gm-num">${esc(num)}</span>` : ''}
    <div>
      ${has(kick) ? `<p class="eyebrow gm-kick">${esc(kick)}</p>` : ''}
      <h2>${esc(titleDe)}</h2>
      ${has(titleEn) ? `<p class="gm-h2en">${esc(titleEn)}</p>` : ''}
      ${has(leadDe) ? `<p class="gm-lead" lang="de">${fmt(leadDe)}</p>` : ''}
      ${has(leadEn) ? `<p class="gm-lead gm-en" lang="en">${fmt(leadEn)}</p>` : ''}
    </div>
  </div>`;
}

const sub = s => `<p class="gm-sub">${esc(s)}</p>`;

/* Eintrag mit Kategorie-Fähnchen — Läden, Restaurants, Gesundheit. */
function rowList(items){
  return `<div class="gm-rows">${(items || []).filter(r => has(r.name)).map(r => `
    <div class="gm-row">
      ${has(r.tag) ? `<span class="gm-tag">${esc(r.tag)}</span>` : '<span class="gm-tag"></span>'}
      <div>
        <p class="gm-rn">${esc(r.name)}</p>
        ${has(r.meta) ? `<p class="gm-rm">${esc(r.meta)}</p>` : ''}
        ${has(r.note) ? `<p class="gm-rd">${fmt(r.note)}</p>` : ''}
      </div>
    </div>`).join('')}</div>`;
}

export default {
  id:'gaestemappe',
  title:'Gästemappe',
  sub:'Mehrseitige Mappe fürs Zimmer · A4 hoch · DE/EN',
  badge:'Mappe',
  page:'a4',
  root:'t-gm',
  multipage:true,

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="150" fill="#2A3350"/>
    <rect x="0" y="0" width="210" height="96" fill="#8FA0B4"/>
    <path d="M0 62 l44 -30 34 24 28 -18 54 36 50 -22 v44 h-210 z" fill="#6F8298"/>
    <circle cx="150" cy="30" r="12" fill="#A9BACB"/>
    <text x="20" y="126" font-family="Dancing Script, cursive" font-size="30" fill="#01B1E2">willkommen</text>
    <rect x="20" y="134" width="52" height="4" rx="2" fill="#01B1E2"/>
    ${[0,1,2].map(i => `
      <rect x="${16 + i * 62}" y="166" width="54" height="76" rx="4" fill="#F6F7FA" stroke="#E5E8ED"/>
      <rect x="${22 + i * 62}" y="174" width="24" height="5" rx="2.5" fill="#01B1E2"/>
      ${lines(22 + i * 62, 186, 42, 6, 6)}`).join('')}
    ${lines(16, 256, 178, 3, 8, '#C9CFDA')}`),

  fields:[
    { t:'group', label:'Titelseite' },
    { k:'coverKick',  label:'Handschrift-Wort', type:'text' },
    { k:'coverTitle', label:'Titel', type:'text' },
    { k:'coverSub',   label:'Untertitel', type:'text' },
    { k:'coverImg',   label:'Foto (optional)', type:'image',
      hint:'Aussenaufnahme im Querformat. Ohne Foto bleibt die Seite ruhig navy.' },

    { t:'group', label:'Seite 2 · Willkommen' },
    { k:'welcomeDe', label:'Begrüssung DE', type:'textarea', hint:'**fett** möglich' },
    { k:'welcomeEn', label:'Begrüssung EN', type:'textarea' },
    { k:'welcomeNote', label:'Sprachzeile', type:'text' },

    { t:'group', label:'Seite 3 · Das Wichtigste' },
    { t:'note', label:'Das WLAN-Passwort steht als Platzhalter drin. Tragen Sie es hier ein — der Wert bleibt nur in diesem Browser.' },
    { k:'facts', label:'Zeilen', type:'list', itemLabel:'Zeile', max:10,
      defaultItem:{ icon:'info', de:'', en:'', val:'' },
      item:[
        { k:'icon', label:'Symbol', type:'select', options:iconOptions() },
        { k:'de',   label:'Text DE', type:'text' },
        { k:'en',   label:'Text EN', type:'text' },
        { k:'val',  label:'Wert rechts', type:'text' }
      ] },
    { k:'pullNum',  label:'Grosse Zahl', type:'text' },
    { k:'pullLbl',  label:'Zeile darunter', type:'text' },
    { k:'pullDe',   label:'Text DE', type:'textarea' },
    { k:'pullEn',   label:'Text EN', type:'textarea' },
    { k:'amen',     label:'Im Haus (mit Komma trennen)', type:'text' },

    { t:'group', label:'Seite 4 · Parken und Einkaufen' },
    { k:'pgPark',   label:'Seite drucken', type:'select', options:JN },
    { k:'parkDe',   label:'Parken DE', type:'textarea' },
    { k:'parkEn',   label:'Parken EN', type:'textarea' },
    { k:'shops',    label:'Einkaufen', type:'list', itemLabel:'Adresse', max:6,
      defaultItem:{ tag:'', name:'', meta:'', note:'' },
      item:[
        { k:'tag',  label:'Kategorie', type:'text' },
        { k:'name', label:'Name', type:'text' },
        { k:'meta', label:'Adresse · Telefon', type:'text' },
        { k:'note', label:'Hinweis', type:'text' }
      ] },
    { k:'shopNote', label:'Fusshinweis', type:'textarea' },

    { t:'group', label:'Seite 5 · Zug und Bus' },
    { k:'pgTrain',  label:'Seite drucken', type:'select', options:JN },
    { k:'trainDe',  label:'Text DE', type:'textarea' },
    { k:'trainEn',  label:'Text EN', type:'textarea' },
    { k:'dests',    label:'Ziele', type:'list', itemLabel:'Ziel', max:8,
      defaultItem:{ name:'', line:'', time:'' },
      item:[
        { k:'name', label:'Ziel', type:'text' },
        { k:'line', label:'Linie', type:'text' },
        { k:'time', label:'Dauer', type:'text' }
      ] },
    { k:'trainNote', label:'Hinweis', type:'text' },

    { t:'group', label:'Seite 6 · Natur und Ausflüge' },
    { k:'pgTrips',  label:'Seite drucken', type:'select', options:JN },
    { k:'tripsDe',  label:'Text DE', type:'textarea' },
    { k:'tripsEn',  label:'Text EN', type:'textarea' },
    { k:'trips',    label:'Ziele', type:'list', itemLabel:'Ziel', max:10,
      defaultItem:{ time:'', name:'', note:'' },
      item:[
        { k:'time', label:'Entfernung', type:'text' },
        { k:'name', label:'Name', type:'text' },
        { k:'note', label:'Beschreibung', type:'text' }
      ] },

    { t:'group', label:'Seite 7 · Essen und Trinken' },
    { k:'pgFood',   label:'Seite drucken', type:'select', options:JN },
    { k:'topName',  label:'Empfehlung · Name', type:'text' },
    { k:'topMeta',  label:'Empfehlung · Adresse', type:'text' },
    { k:'topNote',  label:'Empfehlung · Text', type:'textarea' },
    { k:'food',     label:'Weitere Adressen', type:'list', itemLabel:'Adresse', max:7,
      defaultItem:{ tag:'', name:'', meta:'', note:'' },
      item:[
        { k:'tag',  label:'Kategorie', type:'text' },
        { k:'name', label:'Name', type:'text' },
        { k:'meta', label:'Adresse · Telefon', type:'text' },
        { k:'note', label:'Hinweis', type:'text' }
      ] },

    { t:'group', label:'Seite 8 · Notfall und Kontakt' },
    { k:'emergency', label:'Notrufnummern', type:'list', itemLabel:'Nummer', max:6,
      defaultItem:{ num:'', de:'', en:'' },
      item:[
        { k:'num', label:'Nummer', type:'text' },
        { k:'de',  label:'Bezeichnung DE', type:'text' },
        { k:'en',  label:'Bezeichnung EN', type:'text' }
      ] },
    { k:'hospital', label:'Hinweis Spital', type:'textarea' },
    { k:'health',   label:'Gesundheit im Dorf', type:'list', itemLabel:'Adresse', max:4,
      defaultItem:{ tag:'', name:'', meta:'' },
      item:[
        { k:'tag',  label:'Kategorie', type:'text' },
        { k:'name', label:'Name', type:'text' },
        { k:'meta', label:'Adresse · Telefon', type:'text' }
      ] },
    { k:'tips', label:'Gut zu wissen', type:'list', itemLabel:'Hinweis', max:6,
      defaultItem:{ tag:'', de:'', en:'' },
      item:[
        { k:'tag', label:'Stichwort', type:'text' },
        { k:'de',  label:'Text DE', type:'text' },
        { k:'en',  label:'Text EN', type:'text' }
      ] }
  ],

  defaults:{
    coverKick:'willkommen',
    coverTitle:'Ihre Gästemappe',
    coverSub:'Alles für Ihren Aufenthalt in Kerzers · Everything for your stay',
    coverImg:'',

    welcomeDe:'Unser Hotel kommt ohne Rezeption aus — dafür finden Sie hier alles, was Sie brauchen. Diese Mappe führt Sie durch Ihren Aufenthalt und durch Kerzers: Einkaufen, Zug und Bus, Spaziergänge und Ausflüge in der Region.',
    welcomeEn:'Our hotel works without a reception desk — instead you will find everything you need right here. This guide takes you through your stay and through Kerzers: shopping, trains and buses, walks and day trips.',
    welcomeNote:'Welcome · Bienvenue · Benvenuti — bei Fragen schreiben Sie uns jederzeit auf WhatsApp.',

    facts:[
      { icon:'wifi',  de:'WLAN-Netz', en:'Wi-Fi network', val:'Gast' },
      // Platzhalter: das echte Passwort gehoert nicht in ein oeffentliches
      // Repository. Es wird im Editor eingetragen und bleibt im Browser.
      { icon:'key',   de:'Passwort', en:'Password', val:'· · · · · · · ·' },
      { icon:'clock', de:'Check-in', en:'Check-in from', val:'ab 15:00' },
      { icon:'clock', de:'Check-out', en:'Check-out until', val:'bis 11:00' },
      { icon:'door',  de:'Zugang rund um die Uhr', en:'Self check-in 24/7', val:'Code' },
      { icon:'cup',   de:'Frühstück im Korb — bei der Reservation bestellen', en:'Breakfast basket — order with your booking', val:'' },
      { icon:'bed',   de:'Nachtruhe', en:'Quiet hours', val:'22:00 – 06:00' },
      { icon:'smoke', de:'Das ganze Haus ist rauchfrei', en:'The entire house is non-smoking', val:'' }
    ],
    pullNum:'24/7',
    pullLbl:'für Sie da',
    pullDe:'Es gibt keine Rezeption — aber uns gibt es immer. **Schreiben Sie uns jederzeit** auf WhatsApp: Deutsch, English, Français oder Italiano.',
    pullEn:'There is no reception desk — but we are always here. **Message us any time** on WhatsApp.',
    amen:'Lounge, Kitchen, Coolbox, Beautybox, Waschküche, Garage, Barrierefrei',

    pgPark:'ja',
    parkDe:'Am Hotel stehen Parkplätze zur Verfügung — bitte vorab reservieren. Sind sie belegt, parken Sie beim grossen öffentlichen Parkplatz der Schützenhütte (Industriestrasse 8), nur drei Gehminuten entfernt. Die ersten 30 Minuten und die erste Nacht von 19:00 bis 07:00 sind gratis.',
    parkEn:'Parking is available at the hotel — please reserve in advance. If it is full, use the large public car park at the Schützenhütte (Industriestrasse 8), a three-minute walk away. The first 30 minutes and the first night from 19:00 to 07:00 are free.',
    shops:[
      { tag:'Supermarkt', name:'Migros', meta:'Murtenstrasse 15 · 058 573 04 00', note:'Mo–Sa ca. 8–19 Uhr, Sa bis 17 Uhr · So geschlossen' },
      { tag:'Supermarkt', name:'Coop', meta:'Gerbeackerstrasse 6 · 031 750 16 16', note:'Mo–Sa ca. 8–19 Uhr, Sa bis 17 Uhr · So geschlossen' },
      { tag:'Discounter', name:'Denner', meta:'im Dorfzentrum', note:'Für den schnellen Einkauf.' },
      { tag:'Bäckerei',   name:'Bäckerei Krähenbühl', meta:'Vordere Gasse 20 · 031 755 53 52', note:'Frisches Brot, Gipfeli und Süsses.' },
      { tag:'Regional',   name:'Milchkanne und Hofläden', meta:'Vordere Gasse 15 · Moser Gemüse', note:'Käse, Milchprodukte und Gemüse ab Hof.' }
    ],
    shopNote:'In der Nähe ausserdem: **Apotheke (Amavita), Post und Bankomat (Raiffeisen / UBS)** — alle im Dorfzentrum, wenige Schritte voneinander entfernt.\nAlso nearby: pharmacy, post office and cash machines in the village centre.',

    pgTrain:'ja',
    trainDe:'Der Bahnhof Kerzers ist eine Besonderheit: Hier kreuzen sich zwei Normalspur-Strecken — die einzige echte Kreuzung dieser Art in der Schweiz. Nach Bern und Murten fahren tagsüber halbstündlich Züge, meist umsteigefrei. Linien S5 (Bern · Neuchâtel · Murten) und S52 (Bern · Ins · Murten).',
    trainEn:'Kerzers station is unusual: two standard-gauge lines cross here — the only crossing of its kind in Switzerland. Trains to Bern and Murten run every half hour during the day, mostly direct. Lines S5 and S52.',
    dests:[
      { name:'Ins',              line:'S52',    time:'ca. 8 Min' },
      { name:'Murten / Morat',   line:'S5 / S52', time:'ca. 10 Min' },
      { name:'Lyss',             line:'RE / S', time:'ca. 12 Min' },
      { name:'Avenches',         line:'S5',     time:'ca. 20 Min' },
      { name:'Bern Hauptbahnhof',line:'S52',    time:'ca. 25 Min' },
      { name:'Neuchâtel',        line:'S5',     time:'ca. 30 Min' }
    ],
    trainNote:'Fahrzeiten sind Richtwerte · Times are approximate — bitte den aktuellen Fahrplan prüfen (sbb.ch).',

    pgTrips:'ja',
    tripsDe:'Kerzers liegt mitten im Grossen Moos, dem Gemüsegarten der Schweiz — flaches Land, weite Wege, viel Himmel. Perfekt für einen Spaziergang oder eine Velotour direkt ab der Haustür. Vom Hotel aus liegt zudem das ganze Drei-Seen-Land in Reichweite.',
    tripsEn:'Kerzers sits in the Grosses Moos, the vegetable garden of Switzerland — flat land, wide paths, a lot of sky. Ideal for a walk or a bike ride straight from the door, and the Three-Lakes region is within easy reach.',
    trips:[
      { time:'2 Min',   name:'Papiliorama', note:'Tropischer Garten mit tausenden Schmetterlingen, Nocturama und Jungle Trek — ideal bei jedem Wetter.' },
      { time:'ab Tür',  name:'Grosses Moos · Feldwege', note:'Flache Wege durch Gemüsefelder und Kanäle. Ruhig, eben und weit — zu Fuss oder mit dem Velo.' },
      { time:'8 Min',   name:'Murtensee-Promenade', note:'Seeufer, Baden, Stand-up-Paddle und die Drei-Seen-Schifffahrt.' },
      { time:'5 Min',   name:'Murten / Morat', note:'Begehbare Ringmauer, Altstadtgassen und Seepromenade.' },
      { time:'15 Min',  name:'Mont Vully', note:'Rebberge mit Rundblick auf drei Seen, Jura und Alpen.' },
      { time:'20 Min',  name:'Avenches', note:'Das besterhaltene römische Amphitheater der Schweiz.' },
      { time:'18 Min',  name:'Bernaqua', note:'Erlebnisbad, Wellness und Spa im Westside Bern-Brünnen.' },
      { time:'20 Min',  name:'Bern', note:'UNESCO-Altstadt, Bärenpark und Bundeshaus.' }
    ],

    pgFood:'ja',
    topName:'Restaurant Hippel Krone',
    topMeta:'Bernstrasse 2a · 031 750 18 18 · hotel-hippel-krone.ch',
    topNote:'Unser Lieblingsrestaurant in Kerzers: Schweizer und französische Küche sowie feine Thai-Spezialitäten. Terrasse, Take-away und Catering — beim Mittagessen oder zum Dinner bei Kerzenlicht.',
    food:[
      { tag:'Pizzeria',  name:'Restaurant Clubcafé Kerzers', meta:'Bahnhofplatz 16', note:'Ristorante und Pizzeria seit 1874 — Holzofenpizza, hausgemachte Pasta und Fleischgerichte.' },
      { tag:'Restaurant',name:'Hotel Restaurant Jura', meta:'Bahnhofplatz 6 · 031 756 06 06', note:'Bürgerliche Küche mitten im Dorf, gleich beim Bahnhof.' },
      { tag:'Pizzeria',  name:'Avanti Pizza', meta:'Murtenstrasse 3 · 031 755 48 63', note:'Holzofenpizza und über 90 Gerichte. Am Wochenende bis 23 Uhr, mit Lieferdienst.' },
      { tag:'Imbiss',    name:'Nargale Kebab und Imbiss', meta:'Murtenstrasse 10 · täglich 10–22 Uhr', note:'Döner, Kebab und Schnelles — direkt beim Bahnhof, zum Mitnehmen.' },
      { tag:'Take-away', name:'Tasty Food · Pizza und Döner', meta:'Mo–So · Abholung und Lieferung', note:'Handgemachte Pizza und Pasta, Kebab und Salate.' }
    ],

    emergency:[
      { num:'112',  de:'Notruf allgemein', en:'General emergency' },
      { num:'144',  de:'Sanität', en:'Ambulance' },
      { num:'117',  de:'Polizei', en:'Police' },
      { num:'118',  de:'Feuerwehr', en:'Fire brigade' },
      { num:'145',  de:'Vergiftungen', en:'Poison control' },
      { num:'1414', de:'Rega', en:'Air rescue' }
    ],
    hospital:'Nächstes Spital: **HFR Meyriez-Murten**, rund 10 Minuten mit dem Auto. Im Notfall immer zuerst **144** anrufen.\nNearest hospital: HFR Meyriez-Murten, about 10 minutes by car. In an emergency always call 144 first.',
    health:[
      { tag:'Apotheke', name:'Amavita Apotheke', meta:'Murtenstrasse 13 · 058 878 17 80' },
      { tag:'Arzt',     name:'Gruppenpraxis Kerzers', meta:'Murtenstrasse 15 · im Notfall 144' },
      { tag:'Zahnarzt', name:'Zahnarztpraxis Kerzers', meta:'Gerbeackerstrasse 8' }
    ],
    tips:[
      { tag:'Abfall',  de:'Bitte Glas, PET und Karton trennen. Behälter im Eingangsbereich.', en:'Please separate glass, PET and cardboard. Bins at the entrance.' },
      { tag:'Heizung', de:'Das Thermostat im Zimmer regelt Ihre Wunschtemperatur.', en:'The thermostat in your room sets the temperature.' },
      { tag:'Abreise', de:'Beim Auschecken Fenster schliessen und Licht löschen — den Code behalten Sie.', en:'When checking out please close the windows and switch off the lights.' },
      { tag:'Sonntag', de:'In der Schweiz haben die meisten Läden sonntags zu — Einkäufe am Samstag planen.', en:'Most shops in Switzerland are closed on Sundays — plan your shopping for Saturday.' }
    ]
  },

  render(d){
    let nr = 1;
    const out = [];

    /* ---- 1 · Titelseite ------------------------------------------------- */
    out.push(`<section data-page class="gm-pg gm-cover">
      <div class="gm-cv-photo">
        ${has(d.coverImg) ? `<img src="${esc(d.coverImg)}" alt="">` : `<svg class="gm-cv-empty" viewBox="-90 -150 180 180" aria-hidden="true"><path d="${PIN_PATH}" transform="translate(0 -14) scale(1.15)"/></svg>`}
        <span class="gm-cv-logo">${logo('white', 46)}</span>
      </div>
      <div class="gm-cv-body">
        ${has(d.coverKick) ? `<p class="eyebrow gm-cv-kick">${esc(d.coverKick)}</p>` : ''}
        <h1>${esc(d.coverTitle)}</h1>
        <span class="gm-cv-rule"></span>
        ${has(d.coverSub) ? `<p class="gm-cv-sub">${esc(d.coverSub)}</p>` : ''}
        <p class="gm-cv-addr">${esc(addressLine())}${BRAND.web ? ` · ${esc(BRAND.web)}` : ''}</p>
      </div>
    </section>`);

    /* Inhalt erst sammeln, dann nummerieren — abgewählte Seiten fehlen sonst. */
    const chapters = [];
    if (on(d.pgPark))  chapters.push(['Parken und Einkaufen', 'Parking and shopping']);
    if (on(d.pgTrain)) chapters.push(['Zug und Bus', 'Trains and buses']);
    if (on(d.pgTrips)) chapters.push(['Natur und Ausflüge', 'Walks and day trips']);
    if (on(d.pgFood))  chapters.push(['Essen und Trinken', 'Food and drink']);
    chapters.push(['Notfall und Kontakt', 'Emergency and contact']);
    const num = title => String(chapters.findIndex(c => c[0] === title) + 2).padStart(2, '0');

    /* ---- 2 · Willkommen und Inhalt -------------------------------------- */
    nr++;
    out.push(frame('Willkommen', nr, `
      ${opener('', 'schön, sind Sie da', 'Herzlich willkommen', 'Welcome', d.welcomeDe, d.welcomeEn)}
      ${has(d.welcomeNote) ? `<p class="gm-note">${fmt(d.welcomeNote)}</p>` : ''}
      ${sub('Inhalt · Contents')}
      <div class="gm-toc">
        <div class="gm-ti"><span class="gm-tn">01</span><span class="gm-tt">Das Wichtigste</span><span class="gm-td">The essentials</span></div>
        ${chapters.map(c => `<div class="gm-ti"><span class="gm-tn">${num(c[0])}</span><span class="gm-tt">${esc(c[0])}</span><span class="gm-td">${esc(c[1])}</span></div>`).join('')}
      </div>`));

    /* ---- 3 · Das Wichtigste --------------------------------------------- */
    const facts = (d.facts || []).filter(r => has(r.de) || has(r.en) || has(r.val));
    const amen = String(d.amen || '').split(',').map(s => s.trim()).filter(Boolean);
    nr++;
    out.push(frame('Das Wichtigste', nr, `
      ${opener('01', 'das Wichtigste', 'Auf einen Blick', 'The essentials', '', '')}
      <div class="gm-facts">${facts.map(r => `
        <div class="gm-fact">
          <span class="gm-fi">${icon(r.icon || 'info', 22, 1.9)}</span>
          <span class="gm-fl">
            ${has(r.de) ? `<b>${esc(r.de)}</b>` : ''}
            ${has(r.en) ? `<i>${esc(r.en)}</i>` : ''}
          </span>
          ${has(r.val) ? `<span class="gm-fv">${esc(r.val)}</span>` : ''}
        </div>`).join('')}</div>
      ${(has(d.pullDe) || has(d.pullEn)) ? `<div class="gm-pull">
        <div class="gm-pn"><b>${esc(d.pullNum || '')}</b><i>${esc(d.pullLbl || '')}</i></div>
        <div class="gm-pt">
          ${has(d.pullDe) ? `<p lang="de">${fmt(d.pullDe)}</p>` : ''}
          ${has(d.pullEn) ? `<p class="gm-en" lang="en">${fmt(d.pullEn)}</p>` : ''}
        </div>
      </div>` : ''}
      ${amen.length ? `${sub('Im Haus · In the house')}
        <div class="gm-chips">${amen.map(a => `<span>${esc(a)}</span>`).join('')}</div>` : ''}`));

    /* ---- 4 · Parken und Einkaufen --------------------------------------- */
    if (on(d.pgPark)){
      nr++;
      out.push(frame('Parken und Einkaufen', nr, `
        ${opener(num('Parken und Einkaufen'), 'Parken', 'Parkplätze am Hotel', 'Parking at the hotel', d.parkDe, d.parkEn)}
        ${sub('Einkaufen in Kerzers · Shopping')}
        ${rowList(d.shops)}
        ${has(d.shopNote) ? `<p class="gm-note">${fmt(d.shopNote)}</p>` : ''}`));
    }

    /* ---- 5 · Zug und Bus ------------------------------------------------ */
    if (on(d.pgTrain)){
      const dests = (d.dests || []).filter(x => has(x.name));
      nr++;
      out.push(frame('Zug und Bus', nr, `
        ${opener(num('Zug und Bus'), 'mit dem Zug', 'Ab Bahnhof Kerzers', 'From Kerzers station', d.trainDe, d.trainEn)}
        ${sub('Beliebte Ziele · Popular destinations')}
        <div class="gm-dests">${dests.map(x => `
          <div class="gm-dest">
            <span class="gm-dn">${esc(x.name)}</span>
            <span class="gm-dl">${esc(x.line || '')}</span>
            <span class="gm-dt">${esc(x.time || '')}</span>
          </div>`).join('')}</div>
        ${has(d.trainNote) ? `<p class="gm-fine">${esc(d.trainNote)}</p>` : ''}`));
    }

    /* ---- 6 · Natur und Ausflüge ----------------------------------------- */
    if (on(d.pgTrips)){
      const trips = (d.trips || []).filter(x => has(x.name));
      nr++;
      out.push(frame('Natur und Ausflüge', nr, `
        ${opener(num('Natur und Ausflüge'), 'draussen', 'Natur vor der Tür', 'Right on the doorstep', d.tripsDe, d.tripsEn)}
        <div class="gm-trips">${trips.map(x => `
          <div class="gm-trip">
            <span class="gm-tw">${esc(x.time || '')}</span>
            <div>
              <p class="gm-rn">${esc(x.name)}</p>
              ${has(x.note) ? `<p class="gm-rd">${esc(x.note)}</p>` : ''}
            </div>
          </div>`).join('')}</div>`));
    }

    /* ---- 7 · Essen und Trinken ------------------------------------------ */
    if (on(d.pgFood)){
      nr++;
      out.push(frame('Essen und Trinken', nr, `
        ${opener(num('Essen und Trinken'), 'guten Appetit', 'In Kerzers essen', 'Eating in Kerzers', '', '')}
        ${has(d.topName) ? `<div class="gm-top">
          <p class="gm-topk">★ Unsere Empfehlung · Our recommendation</p>
          <p class="gm-topn">${esc(d.topName)}</p>
          ${has(d.topMeta) ? `<p class="gm-topm">${esc(d.topMeta)}</p>` : ''}
          ${has(d.topNote) ? `<p class="gm-topd">${fmt(d.topNote)}</p>` : ''}
        </div>` : ''}
        ${rowList(d.food)}`));
    }

    /* ---- 8 · Notfall und Kontakt ---------------------------------------- */
    const em = (d.emergency || []).filter(x => has(x.num));
    const tips = (d.tips || []).filter(x => has(x.de) || has(x.en));
    const contact = [
      BRAND.phone    && ['Telefon',  BRAND.phone],
      BRAND.whatsapp && ['WhatsApp', BRAND.whatsapp],
      BRAND.mail     && ['E-Mail',   BRAND.mail],
      BRAND.web      && ['Web',      BRAND.web]
    ].filter(Boolean);
    nr++;
    out.push(frame('Notfall und Kontakt', nr, `
      ${opener(num('Notfall und Kontakt'), 'Notfall', 'Wichtige Nummern', 'Emergency numbers', '', '')}
      <div class="gm-em">${em.map(x => `
        <div class="gm-emi">
          <b>${esc(x.num)}</b>
          <span>${esc(x.de || '')}</span>
          <i>${esc(x.en || '')}</i>
        </div>`).join('')}</div>
      ${has(d.hospital) ? `<p class="gm-note">${fmt(d.hospital)}</p>` : ''}
      ${sub('Gesundheit im Dorf · Health services')}
      ${rowList((d.health || []).map(x => ({ tag:x.tag, name:x.name, meta:x.meta })))}
      ${contact.length ? `<div class="gm-contact">
        <span class="gm-cl">${logo('white', 30)}</span>
        <div class="gm-cg">${contact.map(c => `<div><i>${esc(c[0])}</i><b>${esc(c[1])}</b></div>`).join('')}</div>
      </div>` : ''}
      ${tips.length ? `${sub('Gut zu wissen · Good to know')}
        <div class="gm-tips">${tips.map(x => `
          <div class="gm-tip">
            <span class="gm-tg">${esc(x.tag || '')}</span>
            <div>
              ${has(x.de) ? `<p>${esc(x.de)}</p>` : ''}
              ${has(x.en) ? `<p class="gm-en">${esc(x.en)}</p>` : ''}
            </div>
          </div>`).join('')}</div>` : ''}`));

    return out.join('');
  }
};
