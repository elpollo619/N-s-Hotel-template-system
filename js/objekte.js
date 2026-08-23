/* ==========================================================================
   Liegenschaften und Absender
   --------------------------------------------------------------------------
   Abgebildet ist die Ordnerstruktur aus J:\Immobilien — jeder Ordner dort
   ist hier ein Objekt mit demselben Kürzel (A14, B4, H8 …).

   Adressen
   Alle Adressen der fest hinterlegten Objekte stammen von Cris (21.08.2026).
   Belegt sind sie zusätzlich in den Unterlagen im Laufwerk:

     A4    "Besucher PP A4.docx"        → Allmendstrasse 4/4a
     A14   Gästemappe N's Hotel          → Allmendstrasse 14, 3210 Kerzers
     B4    Briefkopf HANS AMONN AG       → Blümlisalpstrasse 4, 3074 Muri
     B22   "Information Waschmaschine B22.docx" → Bernstrasse 22, Münchenbuchsee
     H8    Ordner Dossier Liegenschaften → Höheweg 8

   Offen bleibt nur I16 — dafür liegt noch keine Adresse vor. Das Feld bleibt
   leer, statt geraten zu werden; der Editor weist darauf hin, ohne dass es
   mitgedruckt wird.

   --------------------------------------------------------------------------
   Dazukommen und wechseln

   Die feste Liste oben ist der Bestand, wie er im Laufwerk steht. Sie reicht
   nicht: es kommen Liegenschaften dazu, und wer eine neue verwaltet, kann
   nicht jedes Mal warten, bis jemand eine Datei ändert. Darum lassen sich
   eigene Objekte und eigene Absender anlegen — sie liegen im Browser und
   stehen danach in jeder Vorlage zur Wahl.

   Dazu kommt die AKTIVE Liegenschaft: das Haus, an dem gerade gearbeitet
   wird. Sie steht im Kopf der Zentrale und ist die Voreinstellung für jede
   Vorlage, die man öffnet. Ohne sie müsste man in jedem einzelnen Aushang
   von Neuem dieselbe Liegenschaft einstellen.

   Was im Browser liegt, ist nur im Browser. Zum Weitergeben an die anderen
   im Haus gibt es Sichern und Einlesen als Datei — derselbe Weg wie bei den
   eigenen Textbausteinen.
   ========================================================================== */
import { load, save, remove } from './lib/storage.js';

const OBJEKT_SCHLUESSEL   = 'objekte';
const ABSENDER_SCHLUESSEL = 'absender';
const AKTIV_SCHLUESSEL    = 'aktives-objekt';

/** Kennungen selbst angelegter Einträge beginnen so. */
export const EIGEN_OBJEKT   = 'obj-';
export const EIGEN_ABSENDER = 'abs-';

/* ---------- Fester Bestand ------------------------------------------------ */

/** Die drei Absender des Hauses. Alle am selben Sitz in Muri b. Bern. */
export const ABSENDER = {
  hotel: {
    id:'hotel',
    name:"N's Hotel",
    legal:"N's Hotel",
    street:'Allmendstrasse 14',
    zip:'3210', city:'Kerzers',
    contact:'+41 31 951 85 54 · info@ns-hotel.ch · ns-hotel.ch',
    foot:"N's Hotel · Allmendstrasse 14 · 3210 Kerzers · +41 31 951 85 54 · ns-hotel.ch"
  },
  immobilien: {
    id:'immobilien',
    name:'HANS AMONN IMMOBILIEN',
    legal:'Hans Amonn Immobilien AG',
    street:'Blümlisalpstrasse 4',
    zip:'3074', city:'Muri b. Bern',
    contact:'T +41 31 951 85 54 · office@reto-amonn.ch',
    foot:'HANS AMONN IMMOBILIEN AG, Blümlisalpstrasse 4, 3074 Muri, T +41 31 951 85 54, office@reto-amonn.ch  UID: CHE-343.271.483'
  },
  architektur: {
    id:'architektur',
    name:'AMONN ARCHITEKTUR',
    legal:'Hans Amonn AG Architektur',
    street:'Blümlisalpstrasse 4',
    zip:'3074', city:'Muri b. Bern',
    contact:'T +41 31 951 85 54 · www.reto-amonn.ch',
    foot:'HANS AMONN AG Architektur, Blümlisalpstrasse 4, 3074 Muri b. Bern, T +41 31 951 85 54, www.reto-amonn.ch  MWST: CHE-106.957.227'
  }
};

/** Alle fest hinterlegten Liegenschaften. `street` leer = noch nicht belegt. */
export const OBJEKTE = [
  { id:'-',        code:'',      name:'Ohne Objekt',       street:'',                     zip:'',     city:'',              absender:'immobilien' },
  { id:'A4',       code:'A4',    name:'Allmendstrasse 4',  street:'Allmendstrasse 4/4a',  zip:'3210', city:'Kerzers',       absender:'architektur' },
  { id:'A12',      code:'A12',   name:'Allmendstrasse 12', street:'Allmendstrasse 12',    zip:'3210', city:'Kerzers',       absender:'immobilien' },
  { id:'A12a',     code:'A12a',  name:'Allmendstrasse 12a',street:'Allmendstrasse 12a',   zip:'3210', city:'Kerzers',       absender:'immobilien' },
  { id:'A14',      code:'A14',   name:"N's Hotel",         street:'Allmendstrasse 14',    zip:'3210', city:'Kerzers',       absender:'hotel' },
  { id:'B4',       code:'B4',    name:'Blümlisalpstr. 4',  street:'Blümlisalpstrasse 4',  zip:'3074', city:'Muri bei Bern', absender:'architektur' },
  { id:'B7',       code:'B7',    name:'Burgstatt 7',       street:'Burgstatt 7',          zip:'3210', city:'Kerzers',       absender:'immobilien' },
  { id:'B22',      code:'B22',   name:'Bernstrasse 22',    street:'Bernstrasse 22',       zip:'3053', city:'Münchenbuchsee',absender:'immobilien' },
  { id:'H8',       code:'H8',    name:'Höheweg 8',         street:'Höheweg 8',            zip:'3074', city:'Muri bei Bern', absender:'immobilien' },
  { id:'I16',      code:'I16',   name:'I16',               street:'',                     zip:'',     city:'',              absender:'immobilien' },
  { id:'S17',      code:'S17',   name:'Sahlistrasse 17',   street:'Sahlistrasse 17',      zip:'3012', city:'Bern',          absender:'immobilien' },
  { id:'CasaReto', code:'CR',    name:'Casa Reto',         street:'Via Loco Coste 51',    zip:'6596', city:'Gordola',       absender:'immobilien' }
];

/* ---------- Eigene Einträge ------------------------------------------------ */

const text = (v) => String(v ?? '').trim();

/** Ein gespeichertes Objekt auf die Form bringen, die die Vorlagen erwarten. */
function objektSauber(o){
  if (!o || !text(o.id)) return null;
  return {
    id:       text(o.id),
    code:     text(o.code),
    name:     text(o.name) || text(o.code) || text(o.id),
    street:   text(o.street),
    zip:      text(o.zip),
    city:     text(o.city),
    absender: text(o.absender) || 'immobilien',
    eigen:    true
  };
}

function absenderSauber(a){
  if (!a || !text(a.id)) return null;
  return {
    id:      text(a.id),
    name:    text(a.name) || text(a.id),
    legal:   text(a.legal) || text(a.name),
    street:  text(a.street),
    zip:     text(a.zip),
    city:    text(a.city),
    contact: text(a.contact),
    /* Die Fusszeile trägt die Firma unter jedem Aushang. Wer keine angibt,
       bekommt eine aus den Feldern gebaut — lieber knapp als leer. */
    foot:    text(a.foot) || [text(a.legal) || text(a.name), text(a.street),
                              [text(a.zip), text(a.city)].filter(Boolean).join(' '),
                              text(a.contact)].filter(Boolean).join(' · '),
    eigen:   true
  };
}

/** Selbst angelegte Liegenschaften. */
export function eigeneObjekte(){
  const roh = load(OBJEKT_SCHLUESSEL, []);
  return (Array.isArray(roh) ? roh : []).map(objektSauber).filter(Boolean);
}

/** Selbst angelegte Absender. */
export function eigeneAbsender(){
  const roh = load(ABSENDER_SCHLUESSEL, []);
  return (Array.isArray(roh) ? roh : []).map(absenderSauber).filter(Boolean);
}

export function istEigenesObjekt(id){ return text(id).startsWith(EIGEN_OBJEKT); }
export function istEigenerAbsender(id){ return text(id).startsWith(EIGEN_ABSENDER); }

/** Aus einem Namen eine Kennung machen, die sich nicht mit einer festen beisst. */
function neueKennung(praefix, name, vergeben){
  const kern = text(name).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '').slice(0, 24) || 'neu';
  let id = praefix + kern;
  let n = 2;
  while (vergeben.includes(id)) id = `${praefix}${kern}-${n++}`;
  return id;
}

/**
 * Eine eigene Liegenschaft sichern. Ohne `id` wird eine neue angelegt.
 * @returns {string|null} die Kennung, oder null wenn nichts gespeichert wurde
 */
export function objektSichern(daten){
  const meine = eigeneObjekte();
  const vorhanden = daten.id && istEigenesObjekt(daten.id)
    ? meine.findIndex(o => o.id === daten.id) : -1;

  const id = vorhanden >= 0 ? daten.id
    : neueKennung(EIGEN_OBJEKT, daten.code || daten.name,
                  alleObjekte().map(o => o.id));

  const eintrag = objektSauber({ ...daten, id });
  if (!eintrag) return null;

  if (vorhanden >= 0) meine[vorhanden] = eintrag; else meine.push(eintrag);
  return save(OBJEKT_SCHLUESSEL, meine) ? id : null;
}

export function objektLoeschen(id){
  const meine = eigeneObjekte().filter(o => o.id !== id);
  save(OBJEKT_SCHLUESSEL, meine);
  /* War es die aktive Liegenschaft, steht danach keine mehr da. */
  if (aktivesObjektId() === id) remove(AKTIV_SCHLUESSEL);
}

export function absenderSichern(daten){
  const meine = eigeneAbsender();
  const vorhanden = daten.id && istEigenerAbsender(daten.id)
    ? meine.findIndex(a => a.id === daten.id) : -1;

  const id = vorhanden >= 0 ? daten.id
    : neueKennung(EIGEN_ABSENDER, daten.name,
                  alleAbsender().map(a => a.id));

  const eintrag = absenderSauber({ ...daten, id });
  if (!eintrag) return null;

  if (vorhanden >= 0) meine[vorhanden] = eintrag; else meine.push(eintrag);
  return save(ABSENDER_SCHLUESSEL, meine) ? id : null;
}

export function absenderLoeschen(id){
  save(ABSENDER_SCHLUESSEL, eigeneAbsender().filter(a => a.id !== id));
}

/* ---------- Der gemeinsame Bestand ---------------------------------------- */

/** Feste und eigene Liegenschaften, feste zuerst. */
export function alleObjekte(){
  return OBJEKTE.concat(eigeneObjekte());
}

/** Feste und eigene Absender, feste zuerst. */
export function alleAbsender(){
  return Object.values(ABSENDER).concat(eigeneAbsender());
}

/** Objekt nach id. Fällt auf "Ohne Objekt" zurück. */
export function objekt(id){
  return alleObjekte().find(o => o.id === id) || OBJEKTE[0];
}

/** Absender nach id. `ersatz` greift, wenn es die Kennung nicht (mehr) gibt. */
export function absender(id, ersatz = 'immobilien'){
  return alleAbsender().find(a => a.id === id)
      || ABSENDER[ersatz] || ABSENDER.immobilien;
}

/** Auswahlliste für Formularfelder vom Typ `select`.
    Als Funktion übergeben, nicht als fertiges Array — eine Liegenschaft, die
    während der Arbeit dazukommt, soll ohne Neuladen erscheinen. */
export function objektOptions(){
  const eigen = eigeneObjekte();
  const zeile = o => ({ v:o.id, t:o.code ? `${o.code} — ${o.name}` : o.name });
  if (!eigen.length) return OBJEKTE.map(zeile);
  return [{ gruppe:'Liegenschaften' }].concat(OBJEKTE.map(zeile),
         [{ gruppe:'Eigene' }],       eigen.map(zeile));
}

export function absenderOptions(){
  const eigen = eigeneAbsender();
  const zeile = a => ({ v:a.id, t:a.name });
  if (!eigen.length) return Object.values(ABSENDER).map(zeile);
  return [{ gruppe:'Firmen' }].concat(Object.values(ABSENDER).map(zeile),
         [{ gruppe:'Eigene' }],  eigen.map(zeile));
}

/** Adresszeile eines Objekts. Leere Teile fallen weg, nichts wird erfunden. */
export function objektAdresse(id){
  const o = objekt(id);
  return [o.street, [o.zip, o.city].filter(Boolean).join(' ')]
    .filter(x => x && x.trim()).join(', ');
}

/** true, wenn zum Objekt noch keine Strasse hinterlegt ist. */
export function adresseFehlt(id){
  const o = objekt(id);
  return Boolean(o.code) && !o.street;
}

/** Auswahlkästchen für eine Serie — ohne den Eintrag "Ohne Objekt". */
export function objektCheckOptions(){
  return alleObjekte().filter(o => o.code).map(o => ({ v:o.id, t:`${o.code} — ${o.name}` }));
}

/**
 * Die Objekte einer Serie, in der Reihenfolge dieser Datei.
 * Unbekannte Kürzel fallen weg; "Ohne Objekt" gehört nie in eine Serie.
 */
export function objektListe(ids){
  const gewaehlt = Array.isArray(ids) ? ids : [];
  return alleObjekte().filter(o => o.code && gewaehlt.includes(o.id));
}

/* ---------- Die aktive Liegenschaft ---------------------------------------- */
/* Das Haus, an dem gerade gearbeitet wird. Steht im Kopf der Zentrale und
   ist die Voreinstellung jeder Vorlage, die man öffnet. */

/** Kennung der aktiven Liegenschaft, oder '' wenn keine gewählt ist. */
export function aktivesObjektId(){
  const id = load(AKTIV_SCHLUESSEL, '');
  return alleObjekte().some(o => o.id === id) ? id : '';
}

/** Die aktive Liegenschaft, oder null. */
export function aktivesObjekt(){
  const id = aktivesObjektId();
  return id ? objekt(id) : null;
}

/** Die aktive Liegenschaft setzen. Leerer Wert hebt sie auf. */
export function setzeAktivesObjekt(id){
  if (id && alleObjekte().some(o => o.id === id)) save(AKTIV_SCHLUESSEL, id);
  else remove(AKTIV_SCHLUESSEL);
}

/**
 * Der Wert, mit dem eine Vorlage starten soll.
 * Ist eine Liegenschaft aktiv, gilt sie; sonst bleibt es bei dem, was die
 * Vorlage selbst als Voreinstellung mitbringt.
 */
export function objektVorgabe(voreinstellung){
  return aktivesObjektId() || voreinstellung;
}

/* ---------- Weitergeben ----------------------------------------------------- */

/** Eigene Liegenschaften und Firmen als Datei. */
export function bestandAlsDatei(){
  return JSON.stringify({ art:'nsvz-liegenschaften', version:1,
                          objekte:eigeneObjekte(), absender:eigeneAbsender() }, null, 2);
}

/**
 * Eine Datei einlesen. Vorhandene mit gleicher Kennung werden ersetzt, die
 * übrigen kommen dazu.
 * @returns {{objekte:number, absender:number}}
 */
export function bestandLaden(inhalt){
  const daten = JSON.parse(inhalt);
  const o = Array.isArray(daten && daten.objekte) ? daten.objekte : [];
  const a = Array.isArray(daten && daten.absender) ? daten.absender : [];
  if (!o.length && !a.length) throw new Error('Diese Datei enthält keine Liegenschaften.');

  const meineO = eigeneObjekte();
  let zahlO = 0;
  for (const roh of o){
    const eintrag = objektSauber(roh);
    if (!eintrag || !istEigenesObjekt(eintrag.id)) continue;
    const i = meineO.findIndex(x => x.id === eintrag.id);
    if (i >= 0) meineO[i] = eintrag; else meineO.push(eintrag);
    zahlO++;
  }
  save(OBJEKT_SCHLUESSEL, meineO);

  const meineA = eigeneAbsender();
  let zahlA = 0;
  for (const roh of a){
    const eintrag = absenderSauber(roh);
    if (!eintrag || !istEigenerAbsender(eintrag.id)) continue;
    const i = meineA.findIndex(x => x.id === eintrag.id);
    if (i >= 0) meineA[i] = eintrag; else meineA.push(eintrag);
    zahlA++;
  }
  save(ABSENDER_SCHLUESSEL, meineA);

  return { objekte:zahlO, absender:zahlA };
}

/* Bildmarke des Absenders.
   Nur N's Hotel hat eine eigene Wortmarke im Repository. Für die beiden
   Amonn-Firmen liegt kein Logo vor — dort erscheint nichts, statt fälschlich
   das Hotel-Logo unter einen Immobilienaushang zu setzen. Selbst angelegte
   Firmen bekommen aus demselben Grund keines. */
export function istHotel(absId){
  return absId === 'hotel';
}
