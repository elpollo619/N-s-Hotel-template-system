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
import checkin from './checkin.js';
import tuerhaenger from './tuerhaenger.js';
import tischaufsteller from './tischaufsteller.js';
import zimmerschild from './zimmerschild.js';
import willkommen from './willkommen.js';
import feedback from './feedback.js';
import zeiten from './zeiten.js';
import termin from './termin.js';
import klingelschild from './klingelschild.js';
import kontakte from './kontakte.js';
import bauarbeiten from './bauarbeiten.js';
import preisliste from './preisliste.js';
import gutschein from './gutschein.js';
import speisekarte from './speisekarte.js';
import veranstaltung from './veranstaltung.js';
import ausserbetrieb from './ausserbetrieb.js';
import fundgegenstaende from './fundgegenstaende.js';
import paket from './paket.js';
import uebergabe from './uebergabe.js';
import schluesselquittung from './schluesselquittung.js';
import zaehlerstaende from './zaehlerstaende.js';
import maengelmeldung from './maengelmeldung.js';
import hausversammlung from './hausversammlung.js';
import umzug from './umzug.js';

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
  gaestemappe,
  checkin,
  tuerhaenger,
  tischaufsteller,
  zimmerschild,
  willkommen,
  feedback,
  zeiten,
  termin,
  klingelschild,
  kontakte,
  bauarbeiten,
  preisliste,
  gutschein,
  speisekarte,
  veranstaltung,
  ausserbetrieb,
  fundgegenstaende,
  paket,
  uebergabe,
  schluesselquittung,
  zaehlerstaende,
  maengelmeldung,
  hausversammlung,
  umzug
};

export const ORDER = [
  'hinweis', 'sicherheit', 'mieterbrief', 'parkschild', 'waschplan', 'sammelstelle',
  'etiketten', 'qrplakat', 'kurzanleitung',
  'foto', 'grossplakat',
  'notruf', 'rezeption', 'rezeption-sticker', 'aushang',
  'parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor', 'zattoo', 'gaestemappe',
  'checkin', 'tuerhaenger', 'tischaufsteller', 'zimmerschild', 'willkommen', 'feedback',
  'zeiten', 'termin', 'klingelschild', 'kontakte', 'bauarbeiten', 'preisliste',
  'gutschein', 'speisekarte', 'veranstaltung', 'ausserbetrieb', 'fundgegenstaende', 'paket',
  'uebergabe', 'schluesselquittung', 'zaehlerstaende', 'maengelmeldung', 'hausversammlung', 'umzug'
];
