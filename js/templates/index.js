/* Registrierung aller Vorlagen.
   Wie sie auf der Oberflaeche gruppiert werden, steht in ../bereiche.js —
   nach Arbeitsbereich, nicht nach Dokumentart. Diese Datei kennt nur die
   Vorlagen selbst. */
import notruf from './notruf.js';

import aufkleber from './aufkleber.js';
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
import mieten from './mieten.js';
import turnus from './turnus.js';
import neuimhaus from './neuimhaus.js';
import wlankarten from './wlankarten.js';
import besichtigung from './besichtigung.js';
import ruhezeiten from './ruhezeiten.js';
import notfallblatt from './notfallblatt.js';
import standortschild from './standortschild.js';
import wegweiser from './wegweiser.js';
import empfangstafel from './empfangstafel.js';
import hausordnung from './hausordnung.js';
import fruehstuecktuer from './fruehstuecktuer.js';
import vollmacht from './vollmacht.js';
import protokoll from './protokoll.js';
import kuendigung from './kuendigung.js';
import reservationsblatt from './reservationsblatt.js';
import besucherkarte from './besucherkarte.js';
import mitteilung from './mitteilung.js';
import inventar from './inventar.js';
import tuerschild from './tuerschild.js';
import pinnwand from './pinnwand.js';
import parkplatznah from './parkplatznah.js';
import kalender from './kalender.js';
import checkliste from './checkliste.js';
import ptouch from './ptouch.js';
import serienbrief from './serienbrief.js';
import infoscreen from './infoscreen.js';
import fluchtweg from './fluchtweg.js';

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
  aufkleber,
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
  umzug,
  mieten,
  turnus,
  neuimhaus,
  wlankarten,
  besichtigung,
  ruhezeiten,
  notfallblatt,
  standortschild,
  wegweiser,
  empfangstafel,
  hausordnung,
  fruehstuecktuer,
  vollmacht,
  protokoll,
  kuendigung,
  reservationsblatt,
  besucherkarte,
  mitteilung,
  inventar,
  tuerschild,
  pinnwand,
  parkplatznah,
  kalender,
  checkliste,
  ptouch,
  serienbrief,
  infoscreen,
  fluchtweg
};

export const ORDER = [
  'hinweis', 'sicherheit', 'mieterbrief', 'parkschild', 'waschplan', 'sammelstelle',
  'etiketten', 'qrplakat', 'kurzanleitung',
  'foto', 'grossplakat',
  'notruf', 'aufkleber', 'aushang',
  'parkplatz', 'anfahrt-karte', 'anfahrt-luftbild', 'plan-editor', 'zattoo', 'gaestemappe',
  'checkin', 'tuerhaenger', 'tischaufsteller', 'zimmerschild', 'willkommen', 'feedback',
  'zeiten', 'termin', 'klingelschild', 'kontakte', 'bauarbeiten', 'preisliste',
  'gutschein', 'speisekarte', 'veranstaltung', 'ausserbetrieb', 'fundgegenstaende', 'paket',
  'uebergabe', 'schluesselquittung', 'zaehlerstaende', 'maengelmeldung', 'hausversammlung', 'umzug',
  'mieten', 'turnus', 'neuimhaus', 'wlankarten', 'besichtigung', 'ruhezeiten',
  'notfallblatt', 'standortschild', 'wegweiser', 'empfangstafel', 'hausordnung', 'fruehstuecktuer',
  'vollmacht', 'protokoll', 'kuendigung', 'reservationsblatt', 'besucherkarte', 'mitteilung',
  'inventar', 'tuerschild', 'pinnwand', 'parkplatznah', 'kalender', 'checkliste'
];
