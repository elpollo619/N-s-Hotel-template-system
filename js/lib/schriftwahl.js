/* ==========================================================================
   Schriftwahl
   --------------------------------------------------------------------------
   Die Hausschriften sind Gotham (Titel) und Caflisch Script Pro (die
   handgeschriebene Zeile). Beide sind gekauft und duerfen nicht im
   oeffentlichen Repository liegen — wer sie hat, legt sie lokal ab, und dann
   laufen sie. Wer sie nicht hat, sieht einen Ersatz.

   Bisher stand fest, welcher Ersatz das ist. Jetzt kann man ihn waehlen:
   siebzehn freie Familien, alle im Projekt, keine davon wird nachgeladen.

   Zwei Regeln, die nicht verhandelbar sind:

   1. Die gekaufte Schrift steht IMMER an erster Stelle. Die Wahl ersetzt
      den Ersatz, nicht die Marke. Sobald Gotham auf einem Rechner liegt,
      sieht dieser Rechner wieder Gotham — ganz gleich, was hier gewaehlt ist.
   2. Die Wahl gilt nur in diesem Browser. Sie steckt nicht im Teilen-Link
      und nicht im Entwurf; ein Aushang sieht auf einem anderen Rechner also
      anders aus, wenn dort etwas anderes gewaehlt ist. Darum ist der Weg
      zum Weitergeben das PDF, nicht der Link.
   ========================================================================== */
import { load, save, remove } from './storage.js';

const WAHL_SCHLUESSEL = 'schriftwahl';
const EIGEN_SCHRIFT_SCHLUESSEL = 'eigene-schrift';

/** Der Name, unter dem eine selbst hochgeladene Datei laeuft. */
export const EIGEN_FAMILIE = 'Eigene Schrift';

/* ---------- Die drei Rollen ---------------------------------------------- */
/* `marke` ist die gekaufte Schrift, die immer vorn steht. `grund` ist die
   Notbremse, falls gar nichts geladen werden kann. */
export const ROLLEN = [
  { id:'display', token:'--font-display', titel:'Titel und Auszeichnungen',
    was:'Die grossen Zeilen: Überschrift des Aushangs, Kartentitel, Zahlen.',
    marke:'Gotham', grund:'system-ui, sans-serif', probe:'Frühstück 07:30 – 10:00', probeGroesse:26,
    voreinstellung:'Montserrat' },

  { id:'body', token:'--font-body', titel:'Fliesstext',
    was:'Alles, was gelesen und nicht nur erkannt wird — Absätze, Formulare, Fusszeilen.',
    marke:null, grund:'system-ui, sans-serif',
    probe:'Bitte achten Sie darauf, die Türe stets geschlossen zu halten.', probeGroesse:15,
    voreinstellung:'Montserrat' },

  { id:'script', token:'--font-script', titel:'Handschrift-Zeile',
    was:'Die Zeile in Cyan über jedem Titel — «Guten Morgen», «So finden Sie uns».',
    marke:'Caflisch Script Pro', grund:'cursive', probe:'Guten Morgen', probeGroesse:28,
    voreinstellung:'Parisienne' }
];

/* ---------- Die waehlbaren Familien --------------------------------------- */
/* `skala` gleicht die x-Höhe in der Vorschau aus. Ohne Ausgleich wirken die
   einen gross und die anderen klein, obwohl dieselbe Punktzahl eingestellt
   ist — verglichen würde dann die Skalierung statt der Form. */
export const FAMILIEN = [
  /* --- Titel und Fliesstext ---------------------------------------------- */
  { id:'Montserrat', grund:'sans-serif', rollen:['display','body'],
    urteil:'Die Voreinstellung. Geometrisch, breit, freundlich — kommt Gotham von allen am nächsten.' },
  { id:'Oswald', grund:'sans-serif', rollen:['display'], skala:1.02,
    urteil:'Schmal und hoch. Auf ein Schild passt fast doppelt so viel Text, ohne kleiner zu werden.' },
  { id:'Archivo', grund:'sans-serif', rollen:['display','body'],
    urteil:'Nüchterne Grotesk, etwas enger als Montserrat. Wirkt amtlicher, weniger warm.' },
  { id:'Playfair Display', grund:'serif', rollen:['display'], skala:1.02,
    urteil:'Serifen mit starkem Strichkontrast. Festlich — passt zur Gästemappe, nicht zum Parkverbot.' },
  { id:'Bebas Neue', grund:'sans-serif', rollen:['display'], skala:.9, nurVersalien:true,
    urteil:'Nur Grossbuchstaben, sehr schmal. Für kurze, laute Zeilen; für Sätze unbrauchbar.' },
  { id:'Atkinson Hyperlegible', grund:'sans-serif', rollen:['display','body'],
    urteil:'Für schwaches Sehen entworfen: jeder Buchstabe absichtlich anders geformt. Die sicherste Wahl, wenn ein Aushang wirklich gelesen werden muss.' },
  { id:'Source Sans 3', grund:'sans-serif', rollen:['body'],
    urteil:'Ruhige Arbeitsschrift, schmaler als Montserrat. Bringt mehr Text auf die Seite.' },
  { id:'Inter', grund:'sans-serif', rollen:['body'],
    urteil:'Für Bildschirme gezeichnet, sehr grosse x-Höhe. Auch klein gedruckt noch klar.' },
  { id:'Lora', grund:'serif', rollen:['body'], skala:1.02,
    urteil:'Serifen mit weichem Strich. Für längere Texte angenehmer als jede Grotesk — die Gästemappe.' },

  /* --- Handschrift -------------------------------------------------------- */
  { id:'Parisienne', grund:'cursive', rollen:['script'], skala:1.1,
    urteil:'Die bisherige Voreinstellung. Zierlich, starker Kontrast, ausgestellte Schwünge — schön, aber klingt nach Einladungskarte statt nach der Handschrift eines Hauses.' },
  { id:'Caveat', grund:'cursive', rollen:['script'], gewicht:600,
    urteil:'Kommt dem Gedanken am nächsten: eine echte Handschrift, warm und ungezwungen, mit grosser x-Höhe. Der Strich ist gleichmässiger als bei Caflisch — eher Kugelschreiber als Breitfeder.' },
  { id:'Marck Script', grund:'cursive', rollen:['script'], skala:1.06,
    urteil:'Fliessend und durchgehend verbunden, mit sichtbarem Federstrich. Trifft die Anmutung gut; die Neigung ist etwas stärker und die x-Höhe kleiner.' },
  { id:'Bad Script', grund:'cursive', rollen:['script'], skala:1.02,
    urteil:'Der deutlichste Strichkontrast von allen — am nächsten an der Breitfeder. Etwas unruhiger im Wortbild.' },
  { id:'Sacramento', grund:'cursive', rollen:['script'], skala:1.12,
    urteil:'Fein und durchgehend verbunden. Sehr leicht — auf einem Aushang aus fünf Metern kaum noch da.' },
  { id:'Cedarville Cursive', grund:'cursive', rollen:['script'], skala:1.14,
    urteil:'Wirkt wie mit dem Kugelschreiber geschrieben. Persönlich, aber klein und dünn.' },
  { id:'Petit Formal Script', grund:'cursive', rollen:['script'], skala:1.08,
    urteil:'Mit der Feder geschrieben und formal gehalten. Der Strichkontrast stimmt am ehesten von allen — die Formen sind aber deutlich zu förmlich, fast Urkunde.' },
  { id:'Dancing Script', grund:'cursive', rollen:['script'], gewicht:600,
    urteil:'Kräftig und gut lesbar, aber die Grundlinie hüpft sichtbar — das macht sie fröhlich und nimmt ihr die Ruhe.' }
];

/** Alle Familien, die für eine Rolle in Frage kommen. */
export function familienFuer(rolle){
  return FAMILIEN.filter(f => f.rollen.includes(rolle));
}

/** Eine Familie nachschlagen. */
export function familie(id){
  return FAMILIEN.find(f => f.id === id) || null;
}

/* ---------- Die getroffene Wahl ------------------------------------------- */
function voreinstellung(){
  const aus = {};
  for (const r of ROLLEN) aus[r.id] = r.voreinstellung;
  return aus;
}

/** Was ist gerade gewählt? Unbekannte Namen fallen auf die Voreinstellung. */
export function wahl(){
  const gespeichert = load(WAHL_SCHLUESSEL, null) || {};
  const aus = voreinstellung();
  for (const r of ROLLEN){
    const w = gespeichert[r.id];
    if (w === EIGEN_FAMILIE && eigeneSchrift()) aus[r.id] = w;
    else if (familie(w) && familie(w).rollen.includes(r.id)) aus[r.id] = w;
  }
  return aus;
}

/** Eine Rolle auf eine Familie setzen. Gibt die neue Wahl zurück. */
export function setzeWahl(rolle, familieId){
  const jetzt = wahl();
  jetzt[rolle] = familieId;
  save(WAHL_SCHLUESSEL, jetzt);
  schriftAnwenden();
  return jetzt;
}

/** Alles zurück auf die Voreinstellung. */
export function wahlZuruecksetzen(){
  remove(WAHL_SCHLUESSEL);
  schriftAnwenden();
}

/** Steht die Wahl noch auf der Voreinstellung? */
export function istVoreinstellung(){
  const v = voreinstellung(), w = wahl();
  return ROLLEN.every(r => v[r.id] === w[r.id]);
}

/* ---------- Eigene Schriftdatei -------------------------------------------- */
/* Wer bei Google Fonts oder anderswo etwas findet, das hier nicht steht, lädt
   die Datei einfach hoch. Sie landet als Data-URI im Browser-Speicher und
   wird beim Start als FontFace angemeldet — auch das ohne Netz. */

/** @returns {{name:string, datei:string, datenUri:string}|null} */
export function eigeneSchrift(){
  const e = load(EIGEN_SCHRIFT_SCHLUESSEL, null);
  return (e && e.datenUri) ? e : null;
}

export function eigeneSchriftSichern({ name, datei, datenUri }){
  const ok = save(EIGEN_SCHRIFT_SCHLUESSEL, { name:String(name || datei || 'Eigene Schrift'), datei, datenUri });
  if (ok) anmelden();
  return ok;
}

export function eigeneSchriftLoeschen(){
  remove(EIGEN_SCHRIFT_SCHLUESSEL);
  /* Die Familie bleibt im Browser angemeldet, bis die Seite neu geladen wird.
     Damit kein Aushang auf eine Schrift zeigt, die es nicht mehr gibt, fallen
     die Rollen, die sie benutzt haben, auf die Voreinstellung zurück. */
  const jetzt = load(WAHL_SCHLUESSEL, null) || {};
  let geaendert = false;
  for (const r of ROLLEN){
    if (jetzt[r.id] === EIGEN_FAMILIE){ delete jetzt[r.id]; geaendert = true; }
  }
  if (geaendert) save(WAHL_SCHLUESSEL, jetzt);
  schriftAnwenden();
}

let angemeldet = false;
/** Die eigene Schriftdatei im Browser anmelden. */
function anmelden(){
  const e = eigeneSchrift();
  if (!e || angemeldet || typeof FontFace !== 'function') return;
  try{
    const face = new FontFace(EIGEN_FAMILIE, `url(${e.datenUri})`);
    face.load().then(f => document.fonts.add(f)).catch(err => console.warn('[Schrift]', err));
    angemeldet = true;
  }catch(err){ console.warn('[Schrift]', err); }
}

/* ---------- Anwenden ------------------------------------------------------- */
/** Die CSS-Familie einer Rolle, so wie sie im Dokument stehen soll. */
export function familienListe(rolleId, gewaehlt){
  const r = ROLLEN.find(x => x.id === rolleId);
  if (!r) return '';
  const f = gewaehlt === EIGEN_FAMILIE ? { id:EIGEN_FAMILIE, grund:r.grund } : familie(gewaehlt);
  const teile = [];
  if (r.marke) teile.push(`"${r.marke}"`);          // die gekaufte Schrift zuerst
  if (f) teile.push(`"${f.id}"`);
  teile.push(r.grund);
  return teile.join(', ');
}

/**
 * Die Wahl auf das Dokument schreiben. Als Inline-Eigenschaften auf <html>,
 * damit sie die Tokens aus brand-tokens.css überschreiben, ohne dass dort
 * etwas geändert werden müsste — die Datei ist verbatim aus dem Handbuch und
 * bleibt es.
 */
export function schriftAnwenden(){
  if (typeof document === 'undefined') return;
  anmelden();
  const w = wahl();
  for (const r of ROLLEN){
    document.documentElement.style.setProperty(r.token, familienListe(r.id, w[r.id]));
  }
}
