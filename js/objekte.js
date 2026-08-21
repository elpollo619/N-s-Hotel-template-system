/* ==========================================================================
   Liegenschaften und Absender
   --------------------------------------------------------------------------
   Abgebildet ist die Ordnerstruktur aus J:\Immobilien — jeder Ordner dort
   ist hier ein Objekt mit demselben Kürzel (A14, B4, H8 …).

   WICHTIG zu den Adressen
   Eingetragen ist nur, was in den Unterlagen im Laufwerk wirklich belegt ist:

     A4    "Besucher PP A4.docx"      → Allmendstrasse 4/4a
     A14   Gästemappe N's Hotel        → Allmendstrasse 14, 3210 Kerzers
     B4    Briefkopf HANS AMONN AG     → Blümlisalpstrasse 4, 3074 Muri b. Bern
     B22   "Information gebrauch Waschmaschine B22.docx"
           → Bernstrasse 22, 3053 Münchenbuchsee
     H8    Ordner Dossier Liegenschaften → Höheweg 8 (und 8a)

   Offen bleiben A12, A12a, B7, I16, S17 und Casa Reto — dort steht die
   Adresse bewusst leer. Ein falscher
   Strassenname auf einem Aushang wäre schlimmer als gar keiner. Sobald die
   Adresse bekannt ist, hier eintragen — alle Vorlagen ziehen automatisch nach.
   ========================================================================== */

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

/** Alle Liegenschaften. `street` leer = Adresse noch nicht belegt. */
export const OBJEKTE = [
  { id:'-',        code:'',      name:'Ohne Objekt',      street:'',                    zip:'',     city:'',            absender:'immobilien' },
  { id:'A4',       code:'A4',    name:'Allmendstrasse 4', street:'Allmendstrasse 4/4a', zip:'',     city:'',            absender:'architektur' },
  { id:'A12',      code:'A12',   name:'A12',              street:'',                    zip:'',     city:'',            absender:'immobilien' },
  { id:'A12a',     code:'A12a',  name:'A12a',             street:'',                    zip:'',     city:'',            absender:'immobilien' },
  { id:'A14',      code:'A14',   name:"N's Hotel",        street:'Allmendstrasse 14',   zip:'3210', city:'Kerzers',     absender:'hotel' },
  { id:'B4',       code:'B4',    name:'Blümlisalpstr. 4', street:'Blümlisalpstrasse 4', zip:'3074', city:'Muri b. Bern',absender:'architektur' },
  { id:'B7',       code:'B7',    name:'B7',               street:'',                    zip:'',     city:'',            absender:'immobilien' },
  { id:'B22',      code:'B22',   name:'Bernstrasse 22',   street:'Bernstrasse 22',      zip:'3053', city:'Münchenbuchsee',absender:'immobilien' },
  { id:'H8',       code:'H8',    name:'Höheweg 8',        street:'Höheweg 8',           zip:'',     city:'',            absender:'immobilien' },
  { id:'I16',      code:'I16',   name:'I16',              street:'',                    zip:'',     city:'',            absender:'immobilien' },
  { id:'S17',      code:'S17',   name:'S17',              street:'',                    zip:'',     city:'',            absender:'immobilien' },
  { id:'CasaReto', code:'CR',    name:'Casa Reto',        street:'',                    zip:'',     city:'',            absender:'immobilien' }
];

/** Objekt nach id. Fällt auf "Ohne Objekt" zurück. */
export function objekt(id){
  return OBJEKTE.find(o => o.id === id) || OBJEKTE[0];
}

/** Auswahlliste für Formularfelder vom Typ `select`. */
export function objektOptions(){
  return OBJEKTE.map(o => ({
    v:o.id,
    t:o.code ? `${o.code} — ${o.name}` : o.name
  }));
}

export function absenderOptions(){
  return Object.values(ABSENDER).map(a => ({ v:a.id, t:a.name }));
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

/* Bildmarke des Absenders.
   Nur N's Hotel hat eine eigene Wortmarke im Repository. Für die beiden
   Amonn-Firmen liegt kein Logo vor — dort erscheint nichts, statt fälschlich
   das Hotel-Logo unter einen Immobilienaushang zu setzen. */
export function istHotel(absId){
  return absId === 'hotel';
}
