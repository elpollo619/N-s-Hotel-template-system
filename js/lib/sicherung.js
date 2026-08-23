/* ==========================================================================
   Sicherung — die ganze Zentrale von einem Rechner auf den anderen
   --------------------------------------------------------------------------
   Die Zentrale speichert alles im Browser: Entwürfe, Favoriten, eigene
   Textbausteine, Liegenschaften, die Schriftwahl. Das ist gut fürs
   Datenschützen und schlecht fürs Übertragen — wer am Bürorechner alles
   eingerichtet hat, steht am Empfangsrechner wieder vor dem leeren Tool.

   Diese Sicherung nimmt jeden `nsvz:`-Schlüssel und legt ihn in eine Datei;
   das Laden schreibt sie zurück. Eine Datei, ein Doppelklick — und der zweite
   Rechner kennt dieselben Vorlagen, Bausteine und Häuser.
   ========================================================================== */
import { keys, load, save } from './storage.js';

const TYP = 'nsvz-sicherung';

/** Alle gespeicherten Daten als JSON-Text. */
export function sicherungAlsDatei(){
  const daten = {};
  for (const k of keys()){
    const wert = load(k, undefined);
    if (wert !== undefined) daten[k] = wert;
  }
  return JSON.stringify({ typ:TYP, version:1, daten }, null, 2);
}

/** Zählt, was drin ist — für den Hinweis vor dem Laden. */
export function sicherungZaehlen(){
  return keys().length;
}

/**
 * Schreibt eine Sicherung zurück. Bestehende Schlüssel werden überschrieben,
 * nicht gelöschte bleiben — so geht beim Zusammenführen nichts verloren.
 * Gibt die Anzahl übernommener Einträge zurück.
 */
export function sicherungLaden(text){
  const obj = JSON.parse(text);
  if (!obj || obj.typ !== TYP || typeof obj.daten !== 'object' || obj.daten === null){
    throw new Error('kein gültiges Sicherungsformat');
  }
  let n = 0;
  for (const [k, v] of Object.entries(obj.daten)){
    if (v !== undefined){ save(k, v); n++; }
  }
  return n;
}
