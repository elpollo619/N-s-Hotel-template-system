/* Registrierung aller Vorlagen.
   Der Hub gruppiert nach Kategorie — dieselbe Einteilung, nach der die
   Aushänge im Laufwerk sortiert sind. */
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

export const TEMPLATES = {
  hinweis,
  mieterbrief,
  parkschild,
  waschplan,
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
  'hinweis', 'mieterbrief', 'parkschild', 'waschplan',
  'notruf', 'rezeption', 'rezeption-sticker', 'aushang',
  'parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor', 'zattoo', 'gaestemappe'
];

export const GROUPS = [
  { id:'hausordnung', title:'Hausordnung und Verbote',
    note:'Rauchverbot, Betäubungsmittel, Videoüberwachung, Türen — als Aushang oder als Brief.',
    ids:['hinweis', 'mieterbrief'] },

  { id:'parken', title:'Parkieren',
    note:'Reservierte Plätze, Besucherparkplätze, Parkverbot.',
    ids:['parkschild', 'parkplatz'] },

  { id:'waesche', title:'Waschen und Trocknen',
    note:'Waschplan zum Aushängen.',
    ids:['waschplan'] },

  { id:'hotel', title:'Hotel und Gäste',
    note:'Alles rund um Check-in, Zimmer und Aufenthalt.',
    ids:['notruf', 'aushang', 'gaestemappe', 'zattoo'] },

  { id:'wegweiser', title:'Wegweiser und Aufkleber',
    note:'Pfeile und runde Aufkleber in Originalgrösse.',
    ids:['rezeption', 'rezeption-sticker'] },

  { id:'plaene', title:'Karten und Pläne',
    note:'Anfahrt, Luftbild und der interaktive Lageplan.',
    ids:['anfahrt-karte', 'anfahrt-luftbild', 'plan-editor'] }
];
