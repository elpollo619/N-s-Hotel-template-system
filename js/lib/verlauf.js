/* ==========================================================================
   Zuletzt benutzt
   --------------------------------------------------------------------------
   Wer den Waschplan jede Woche druckt, soll ihn nicht jede Woche suchen.
   Gespeichert wird nur die Reihenfolge der Vorlagen-Kürzel, im Browser der
   jeweiligen Person — keine Inhalte, keine Namen.
   ========================================================================== */
import { load, save } from './storage.js';

const SCHLUESSEL = 'verlauf';
const MAX = 8;

export function verlauf(){
  const roh = load(SCHLUESSEL, []);
  return Array.isArray(roh) ? roh.filter(x => typeof x === 'string') : [];
}

export function merken(id){
  if (!id) return;
  const ohne = verlauf().filter(x => x !== id);
  save(SCHLUESSEL, [id, ...ohne].slice(0, MAX));
}

export function verlaufLeeren(){ save(SCHLUESSEL, []); }
