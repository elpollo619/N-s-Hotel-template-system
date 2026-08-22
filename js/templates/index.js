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
import sammelstelle from './sammelstelle.js';
import kurzanleitung from './kurzanleitung.js';
import sicherheit from './sicherheit.js';
import etiketten from './etiketten.js';
import qrplakat from './qrplakat.js';

export const TEMPLATES = {
  hinweis,
  mieterbrief,
  parkschild,
  waschplan,
  sammelstelle,
  sicherheit,
  etiketten,
  qrplakat,
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
  'notruf', 'rezeption', 'rezeption-sticker', 'aushang',
  'parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor', 'zattoo', 'gaestemappe'
];

export const GROUPS = [
  { id:'hausordnung', title:'Hausordnung und Verbote',
    note:'Rauchverbot, Betäubungsmittel, Videoüberwachung, Türen — als Aushang oder als Brief.',
    ids:['hinweis', 'mieterbrief'] },

  { id:'sicherheit', title:'Sicherheitszeichen',
    note:'Verbot, Warnung, Gebot, Rettung und Brandschutz — in der Formensprache von ISO 7010, selber gedruckt.',
    ids:['sicherheit'] },

  { id:'parken', title:'Parkieren',
    note:'Reservierte Plätze, Besucherparkplätze, Parkverbot.',
    ids:['parkschild', 'parkplatz'] },

  { id:'abfall', title:'Abfall und Recycling',
    note:'Behälter beschriften — Papier, PET, Glas, Kehricht und die anderen Fraktionen.',
    ids:['sammelstelle'] },

  { id:'waesche', title:'Waschen und Trocknen',
    note:'Waschplan zum Aushängen.',
    ids:['waschplan'] },

  { id:'hotel', title:'Hotel und Gäste',
    note:'Alles rund um Check-in, Zimmer und Aufenthalt.',
    ids:['notruf', 'aushang', 'gaestemappe', 'zattoo'] },

  { id:'wegweiser', title:'Wegweiser und Aufkleber',
    note:'Pfeile und runde Aufkleber in Originalgrösse.',
    ids:['rezeption', 'rezeption-sticker'] },

  { id:'etiketten', title:'Etiketten und Beschriftung',
    note:'Klebeetiketten auf A4 — Schlüssel, Schränke, Vorräte, Namensschilder.',
    ids:['etiketten'] },

  { id:'hilfe', title:'QR-Codes und Anleitung',
    note:'WLAN, Links und Telefonnummern als Code zum Scannen — und die Kurzanleitung fürs Team.',
    ids:['qrplakat', 'kurzanleitung'] },

  { id:'plaene', title:'Karten und Pläne',
    note:'Anfahrt, Luftbild und der interaktive Lageplan.',
    ids:['anfahrt-karte', 'anfahrt-luftbild', 'plan-editor'] }
];
