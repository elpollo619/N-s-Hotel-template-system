/* Registrierung aller Vorlagen — Reihenfolge und Gruppen im Hub. */
import notruf from './notruf.js';
import rezeption from './rezeption.js';
import sticker from './sticker.js';
import aushang from './aushang.js';
import parkplatz from './parkplatz.js';
import anfahrt from './anfahrt.js';
import luftbild from './luftbild.js';
import zattoo from './zattoo.js';
import planeditor from './planeditor.js';

export const TEMPLATES = {
  notruf,
  rezeption,
  'rezeption-sticker': sticker,
  aushang,
  parkplatz,
  'anfahrt-karte': anfahrt,
  'anfahrt-luftbild': luftbild,
  zattoo,
  'plan-editor': planeditor
};

export const ORDER = [
  'notruf', 'rezeption', 'rezeption-sticker', 'aushang',
  'parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor', 'zattoo'
];

export const GROUPS = [
  { title:'Aushänge und Telefon', ids:['notruf'] },
  { title:'Aufkleber',            ids:['rezeption', 'rezeption-sticker'] },
  { title:'Gäste-Infos',          ids:['aushang'] },
  { title:'Anfahrt und Parken',   ids:['parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor'] },
  { title:'TV und Medien',        ids:['zattoo'] }
];
