/* ==========================================================================
   Sprachen der Aushänge
   --------------------------------------------------------------------------
   Nicht zu verwechseln mit js/lib/i18n.js — das ist die Sprache der
   BEDIENOBERFLÄCHE. Hier geht es um die Sprachen, die auf dem gedruckten
   Blatt stehen.

   Sechs Sprachen, in dieser Reihenfolge. Deutsch steht immer zuoberst: es
   ist die Amtssprache am Ort und die Fassung, die im Zweifel gilt. Die
   anderen folgen in der Reihenfolge, in der sie im Haus gebraucht werden.

   Warum eine feste Reihenfolge? Damit zwei Aushänge nebeneinander gleich
   aussehen. Wer die Reihenfolge selbst bestimmen will, schreibt die Texte
   von Hand.
   ========================================================================== */

export const SPRACHEN = [
  { id:'de', kurz:'DE', name:'Deutsch',       eigen:'Deutsch'    },
  { id:'en', kurz:'EN', name:'Englisch',      eigen:'English'    },
  { id:'fr', kurz:'FR', name:'Französisch',   eigen:'Français'   },
  { id:'it', kurz:'IT', name:'Italienisch',   eigen:'Italiano'   },
  { id:'pt', kurz:'PT', name:'Portugiesisch', eigen:'Português'  },
  { id:'es', kurz:'ES', name:'Spanisch',      eigen:'Español'    }
];

export const SPRACH_IDS = SPRACHEN.map(s => s.id);

export function sprache(id){
  return SPRACHEN.find(s => s.id === id) || SPRACHEN[0];
}

/** Auswahlkästchen für das Formular. */
export function sprachOptions(){
  return SPRACHEN.map(s => ({ v:s.id, t:`${s.kurz} · ${s.eigen}` }));
}

/**
 * Auswahl bereinigen: nur bekannte Sprachen, immer in fester Reihenfolge,
 * nie leer. Ein Aushang ohne Sprache wäre ein leeres Blatt.
 */
export function sprachListe(auswahl){
  const gewaehlt = Array.isArray(auswahl) ? auswahl : [auswahl].filter(Boolean);
  const rein = SPRACH_IDS.filter(id => gewaehlt.includes(id));
  return rein.length ? rein : ['de'];
}

/** Die Sprachen als Objekte, in Reihenfolge. */
export function sprachObjekte(auswahl){
  return sprachListe(auswahl).map(sprache);
}

/* --------------------------------------------------------------------------
   Fertige Zusammenstellungen — was im Haus wirklich vorkommt.
   -------------------------------------------------------------------------- */
export const SPRACH_SETS = [
  { id:'de',     label:'Nur Deutsch',                       ids:['de'] },
  { id:'de-en',  label:'Deutsch + Englisch',                ids:['de','en'] },
  { id:'ch',     label:'Schweiz — DE/FR/IT',                ids:['de','fr','it'] },
  { id:'gaeste', label:'Gäste international — DE/EN/FR/IT', ids:['de','en','fr','it'] },
  { id:'bau',    label:'Handwerk und Reinigung — DE/PT/ES', ids:['de','pt','es'] },
  { id:'alle',   label:'Alle sechs',                        ids:SPRACH_IDS.slice() }
];

export function sprachSetOptions(){
  return [{ v:'', t:'— auswählen —' }]
    .concat(SPRACH_SETS.map(s => ({ v:s.id, t:s.label })));
}

export function sprachSet(id){
  const s = SPRACH_SETS.find(x => x.id === id);
  return s ? s.ids.slice() : null;
}
