/* ==========================================================================
   Benannte Stände
   --------------------------------------------------------------------------
   Der Entwurf einer Vorlage speichert sich von selbst — aber es gibt nur
   EINEN je Vorlage. Wer mehrere Fassungen braucht («Placa I16», «Sommerfest»,
   eine Idee für später), legt sie hier unter einem Namen ab und holt sie
   wieder hervor. Gespeichert wird im Browser (nsvz:staende:*) — und damit
   automatisch auch in der Sicherungsdatei («Sichern und übertragen»).
   ========================================================================== */
import { load, save } from './storage.js';

const STAENDE_MAX = 24;
const standKey = tplId => 'staende:' + tplId;

/** Alle gespeicherten Stände einer Vorlage, neuste zuerst. */
export function staende(tplId){
  const a = load(standKey(tplId), []);
  return Array.isArray(a) ? a : [];
}

/** Zustand unter einem Namen ablegen; gleicher Name überschreibt. */
export function standSpeichern(tplId, name, zustand){
  const sauber = String(name || '').trim().slice(0, 60);
  if (!sauber) return false;
  const a = staende(tplId).filter(s => s.name !== sauber);
  a.unshift({ name: sauber, zeit: Date.now(), zustand: JSON.parse(JSON.stringify(zustand)) });
  save(standKey(tplId), a.slice(0, STAENDE_MAX));
  return true;
}

/** Einen Stand nach Namen holen — oder null. */
export function stand(tplId, name){
  return staende(tplId).find(s => s.name === name) || null;
}

/** Einen Stand löschen. */
export function standLoeschen(tplId, name){
  save(standKey(tplId), staende(tplId).filter(s => s.name !== name));
}
