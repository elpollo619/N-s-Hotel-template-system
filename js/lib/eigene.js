/* ==========================================================================
   Eigene Textbausteine
   --------------------------------------------------------------------------
   Die 42 mitgelieferten Bausteine sind die Wortlaute, die im Haus seit
   Jahren hängen. Was neu dazukommt — ein Aushang zur Baustelle, eine
   Regelung für den Sommer — soll niemand ins Repository schreiben müssen.

   Eigene Bausteine liegen im Browser der Person, die sie angelegt hat.
   Damit sie trotzdem herumkommen, lässt sich die ganze Sammlung als Datei
   sichern und bei den anderen wieder laden. Kein Server, keine Anmeldung —
   dieselbe Logik wie beim Entwurf.

   Gespeichert wird in derselben Form wie die mitgelieferten Bausteine, damit
   die Vorlage nicht zwischen zwei Sorten unterscheiden muss.
   ========================================================================== */
import { load, save } from './storage.js';
import { SPRACH_IDS } from './sprachen.js';

const EIGEN_SCHLUESSEL = 'eigene';
export const EIGEN_PRAEFIX = 'eigen-';

function leer(){ const o = {}; for (const s of SPRACH_IDS) o[s] = ''; return o; }

/** Alles, was diese Person selbst angelegt hat. */
export function eigeneBausteine(){
  const roh = load(EIGEN_SCHLUESSEL, []);
  if (!Array.isArray(roh)) return [];
  return roh.filter(p => p && typeof p.id === 'string' && p.titel && p.text)
            .map(p => ({
              id:p.id, cat:'eigene', ton:p.ton || 'info', icon:p.icon || 'info',
              label:p.label || p.titel.de || p.id,
              titel:{ ...leer(), ...p.titel },
              text: { ...leer(), ...p.text }
            }));
}

function sichere(liste){ save(EIGEN_SCHLUESSEL, liste); }

/** Aus einem Kürzel und einem Namen eine eindeutige id machen. */
function neueId(name, vorhanden){
  const stamm = EIGEN_PRAEFIX + (String(name || 'baustein')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'baustein');
  let id = stamm, n = 2;
  while (vorhanden.some(p => p.id === id)) id = `${stamm}-${n++}`;
  return id;
}

/**
 * Einen Baustein anlegen oder überschreiben.
 * @returns {string} die id des gespeicherten Bausteins
 */
export function bausteinSichern({ name, ton, icon, titel, text, id }){
  const liste = eigeneBausteine();
  const treffer = id ? liste.findIndex(p => p.id === id) : -1;
  const eintrag = {
    id: treffer >= 0 ? id : neueId(name, liste),
    label: String(name || '').trim() || (titel && titel.de) || 'Eigener Baustein',
    ton: ton || 'info',
    icon: icon || 'info',
    titel:{ ...leer(), ...(titel || {}) },
    text: { ...leer(), ...(text  || {}) }
  };
  if (treffer >= 0) liste[treffer] = eintrag; else liste.push(eintrag);
  sichere(liste);
  return eintrag.id;
}

export function bausteinLoeschen(id){
  sichere(eigeneBausteine().filter(p => p.id !== id));
}

export function istEigener(id){ return String(id || '').startsWith(EIGEN_PRAEFIX); }

/** Die Sammlung als Datei-Inhalt. */
export function sammlungAlsDatei(){
  return JSON.stringify({ art:'nsvz-bausteine', version:1,
                          bausteine:eigeneBausteine() }, null, 2);
}

/**
 * Eine Sammlung einlesen. Vorhandene mit gleicher id werden ersetzt, die
 * uebrigen kommen dazu — so kann jede Person ihre eigenen behalten.
 * @returns {{dazu:number, ersetzt:number}}
 */
export function sammlungLaden(text){
  const daten = JSON.parse(text);
  const liste = Array.isArray(daten) ? daten
              : (daten && Array.isArray(daten.bausteine) ? daten.bausteine : null);
  if (!liste) throw new Error('Diese Datei enthält keine Bausteine.');

  const meine = eigeneBausteine();
  let dazu = 0, ersetzt = 0;
  for (const p of liste){
    if (!p || !p.id || !p.titel || !p.text) continue;
    const i = meine.findIndex(x => x.id === p.id);
    const eintrag = {
      id:p.id, cat:'eigene', ton:p.ton || 'info', icon:p.icon || 'info',
      label:p.label || p.titel.de || p.id,
      titel:{ ...leer(), ...p.titel }, text:{ ...leer(), ...p.text }
    };
    if (i >= 0){ meine[i] = eintrag; ersetzt++; } else { meine.push(eintrag); dazu++; }
  }
  sichere(meine);
  return { dazu, ersetzt };
}
