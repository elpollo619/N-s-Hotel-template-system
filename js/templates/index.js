/* Registrierung aller Vorlagen.
   Wie sie auf der Oberflaeche gruppiert werden, steht in ../bereiche.js —
   nach Arbeitsbereich, nicht nach Dokumentart. Diese Datei kennt nur die
   Vorlagen selbst. */
import notruf from './notruf.js';
import rezeption from './rezeption.js';
import sticker from './sticker.js';
import aushang from './aushang.js';
import parkplatz from './parkplatz.js';
import anfahrt from './anfahrt.js';
import luftbild from './luftbild.js';
import zattoo from './zattoo.js';
import planeditor from './planeditor.js';
import gaestemappe from './gaestemappe.js';
import hinweis from './hinweis.js';
import parkschild from './parkschild.js';
import waschplan from './waschplan.js';
import mieterbrief from './mieterbrief.js';
import sammelstelle from './sammelstelle.js';
import kurzanleitung from './kurzanleitung.js';
import sicherheit from './sicherheit.js';
import etiketten from './etiketten.js';
import qrplakat from './qrplakat.js';
import foto from './foto.js';
import grossplakat from './grossplakat.js';

export const TEMPLATES = {
  hinweis,
  mieterbrief,
  parkschild,
  waschplan,
  sammelstelle,
  sicherheit,
  etiketten,
  qrplakat,
  foto,
  grossplakat,
  kurzanleitung,
  notruf,
  rezeption,
  'rezeption-sticker': sticker,
  aushang,
  parkplatz,
  'anfahrt-karte': anfahrt,
  'anfahrt-luftbild': luftbild,
  zattoo,
  'plan-editor': planeditor,
  gaestemappe
};

export const ORDER = [
  'hinweis', 'sicherheit', 'mieterbrief', 'parkschild', 'waschplan', 'sammelstelle',
  'etiketten', 'qrplakat', 'kurzanleitung',
  'foto', 'grossplakat',
  'notruf', 'rezeption', 'rezeption-sticker', 'aushang',
  'parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor', 'zattoo', 'gaestemappe'
];
