/* Sprache der OBERFLAECHE (nicht des Aushang-Inhalts — der ist immer DE/EN). */
import { load, save } from './storage.js';

const DICT = {
  de:{
    tagline:'Vorlagen-Zentrale',
    heroEyebrow:'Immer in unserer Handschrift',
    heroTitle:'Vorlagen-Zentrale',
    heroLede:'Aushänge, Aufkleber und Karten für N’s Hotel — Texte anpassen, fertig drucken. Immer in der gleichen Marke, ohne Grafikprogramm.',
    back:'Alle Vorlagen',
    print:'Drucken / PDF',
    png:'PNG speichern',
    reset:'Zurücksetzen',
    share:'Link teilen',
    shareCopied:'Link kopiert — jetzt einfügen und verschicken',
    shareNoImg:'Bilder sind nicht im Link',
    shareLocal:'Link kopiert. Achtung: er zeigt auf diese Datei auf diesem Rechner.',
    shareLong:'Dieser Entwurf ist zu lang für einen Link. Bitte "Entwurf sichern" nehmen und die Datei verschicken.',
    shareManual:'Kopieren geht in diesem Browser nicht automatisch. Link von Hand kopieren:',
    shareFail:'Link konnte nicht erstellt werden',
    shareGot:'Geteilter Entwurf übernommen',
    shareBad:'Dieser Link ist unvollständig — das Original zeigt weiter',
    shareAsk:'Der geteilte Entwurf ersetzt den eigenen für diese Vorlage. Fortfahren?',
    saveJson:'Entwurf sichern',
    loadJson:'Entwurf laden',
    resetAsk:'Alle Aenderungen dieser Vorlage verwerfen und zum Original zurück?',
    fitOk:'Passt auf eine Seite',
    fitWarn:'Zu lang für eine Seite — Texte kürzen',
    pageWord:'Seite',
    imgDrop:'Bild hierher ziehen oder klicken',
    imgChange:'Bild ersetzen · klicken',
    imgRemove:'Bild entfernen',
    add:'Zeile hinzufügen',
    soon:'in Arbeit',
    saved:'Gespeichert',
    loaded:'Entwurf geladen',
    pngDone:'PNG gespeichert',
    pngFail:'PNG fehlgeschlagen — bitte "Drucken / PDF" nutzen',
    notFound:'Diese Vorlage gibt es nicht.',
    row:'Zeile',
    help:'Hilfe'
  },
  en:{
    tagline:'Template Centre',
    heroEyebrow:'Always in our handwriting',
    heroTitle:'Template Centre',
    heroLede:'Notices, stickers and maps for N’s Hotel — edit the text, print it out. Always on brand, no design software needed.',
    back:'All templates',
    print:'Print / PDF',
    png:'Save PNG',
    reset:'Reset',
    share:'Copy share link',
    shareCopied:'Link copied — paste it into a message',
    shareNoImg:'images are not part of the link',
    shareLocal:'Link copied. Careful: it points at this file on this computer.',
    shareLong:'This draft is too long for a link. Use "Save draft" and send the file instead.',
    shareManual:'This browser cannot copy automatically. Please copy the link by hand:',
    shareFail:'Could not build the link',
    shareGot:'Shared draft loaded',
    shareBad:'This link is incomplete — the original is still shown',
    shareAsk:'The shared draft will replace your own for this template. Continue?',
    saveJson:'Save draft',
    loadJson:'Load draft',
    resetAsk:'Discard all changes to this template and restore the original?',
    fitOk:'Fits on one page',
    fitWarn:'Too long for one page — shorten the text',
    pageWord:'page',
    imgDrop:'Drop an image here or click',
    imgChange:'Replace image · click',
    imgRemove:'Remove image',
    add:'Add row',
    soon:'in progress',
    saved:'Saved',
    loaded:'Draft loaded',
    pngDone:'PNG saved',
    pngFail:'PNG failed — please use "Print / PDF"',
    notFound:'This template does not exist.',
    row:'Row',
    help:'Help'
  }
};

let lang = load('ui-lang', 'de');
if (!DICT[lang]) lang = 'de';

export function t(key){ return (DICT[lang] && DICT[lang][key]) || DICT.de[key] || key; }
export function getLang(){ return lang; }
export function setLang(l){
  if (!DICT[l]) return;
  lang = l;
  save('ui-lang', l);
  document.documentElement.lang = l;
}
