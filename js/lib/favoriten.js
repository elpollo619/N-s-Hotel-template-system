/* ==========================================================================
   Favoriten
   --------------------------------------------------------------------------
   Bei sechzig Vorlagen braucht das Team seine fünf, sechs täglichen nicht
   jedes Mal zu suchen. Ein Stern auf der Karte heftet sie an; angeheftete
   stehen zuoberst auf der Startseite. Gespeichert werden nur die Kürzel, im
   Browser der jeweiligen Person — wie schon beim Verlauf.
   ========================================================================== */
import { load, save } from './storage.js';

const FAV_SCHLUESSEL = 'favoriten';

export function favoriten(){
  const roh = load(FAV_SCHLUESSEL, []);
  return Array.isArray(roh) ? roh.filter(x => typeof x === 'string') : [];
}

export function istFavorit(id){
  return favoriten().includes(id);
}

/** Heftet an oder löst — gibt den neuen Zustand zurück (true = angeheftet). */
export function favoritToggle(id){
  if (!id) return false;
  const jetzt = favoriten();
  if (jetzt.includes(id)){
    save(FAV_SCHLUESSEL, jetzt.filter(x => x !== id));
    return false;
  }
  save(FAV_SCHLUESSEL, [...jetzt, id]);
  return true;
}
