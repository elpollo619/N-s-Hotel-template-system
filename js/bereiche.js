/* ==========================================================================
   Arbeitsbereiche
   --------------------------------------------------------------------------
   Die Zentrale war lange nach Dokumentart sortiert: Aushänge zu Aushängen,
   Schilder zu Schildern, Etiketten zu Etiketten. Das ist die Ordnung eines
   Archivs, nicht die einer Arbeit. Niemand im Haus denkt «ich brauche einen
   Aushang» — gedacht wird «ich richte ein Zimmer her» oder «der Waschraum
   muss angeschrieben werden».

   Darum ist die Zentrale jetzt nach Arbeitsbereichen geteilt. Jeder Bereich
   ist ein Stück Arbeit, das jemand am Stück erledigt, und bekommt eine
   eigene Seite. Eine Vorlage kann in genau einem Bereich stehen — sonst
   sucht man wieder überall.

   `ids`     Vorlagen des Bereichs, in der Reihenfolge der Seite.
   `seiten`  Werkzeugseiten ohne Druckvorlage (Anleitung, Bausteine, Marke).
   ========================================================================== */

export const BEREICHE = [
  {
    id: 'ankommen',
    icon: 'car',
    title: 'Ankommen und Parkieren',
    kurz: 'Ankommen',
    lede: 'Alles, was jemand sieht, bevor er im Haus ist: den Weg hierher, den Platz fürs Auto, die Tür zur Rezeption.',
    ids: ['anfahrt-karte', 'anfahrt-luftbild', 'plan-editor',
          'parkplatz', 'parkschild', 'rezeption', 'rezeption-sticker',
          'wegweiser', 'empfangstafel']
  },
  {
    id: 'zimmer',
    icon: 'bed',
    title: 'Zimmer und Gäste',
    kurz: 'Zimmer',
    lede: 'Was im Zimmer liegt und an der Wand hängt — von der Mappe auf dem Tisch bis zum WLAN-Code neben dem Bett.',
    ids: ['checkin', 'gaestemappe', 'willkommen', 'zimmerschild', 'tuerhaenger',
          'tischaufsteller', 'foto', 'aushang', 'qrplakat', 'feedback', 'zattoo', 'notruf',
          'gutschein', 'speisekarte', 'veranstaltung', 'wlankarten', 'fruehstuecktuer']
  },
  {
    id: 'hausordnung',
    icon: 'door',
    title: 'Hausordnung',
    kurz: 'Hausordnung',
    lede: 'Was im Haus gilt und wer wofür da ist — als Aushang an der Wand oder als Brief an die Mieterschaft. 42 fertige Bausteine in sechs Sprachen.',
    ids: ['hinweis', 'mieterbrief', 'termin', 'bauarbeiten', 'kontakte', 'fundgegenstaende', 'paket',
          'hausversammlung', 'umzug', 'ruhezeiten', 'hausordnung']
  },
  {
    id: 'sicherheit',
    icon: 'shield',
    title: 'Sicherheit',
    kurz: 'Sicherheit',
    lede: 'Verbot, Warnung, Gebot, Rettung und Brandschutz in der Formensprache von ISO 7010 — und dasselbe gross genug für den Hof.',
    ids: ['sicherheit', 'grossplakat', 'notfallblatt', 'standortschild']
  },
  {
    id: 'unterhalt',
    icon: 'trash',
    title: 'Unterhalt und Ordnung',
    kurz: 'Unterhalt',
    lede: 'Waschküche, Sammelstelle, Schränke und Schlüssel — alles, was angeschrieben sein muss, damit es von allein läuft. Dazu Zeiten und Preise.',
    ids: ['waschplan', 'sammelstelle', 'etiketten', 'zeiten', 'preisliste', 'klingelschild', 'ausserbetrieb', 'turnus']
  },
  {
    id: 'verwaltung',
    icon: 'buch',
    title: 'Verwaltung und Übergabe',
    kurz: 'Verwaltung',
    lede: 'Die Formulare, die den Papierweg sauber halten: Wohnungsübergabe, Schlüssel, Zählerstände, Mängelmeldung. Ausgedruckt und vor Ort von Hand ausgefüllt.',
    ids: ['uebergabe', 'schluesselquittung', 'zaehlerstaende', 'maengelmeldung',
          'mieten', 'besichtigung', 'neuimhaus']
  },
  {
    id: 'team',
    icon: 'reception',
    title: 'Team und Werkzeug',
    kurz: 'Team',
    lede: 'Die Anleitung fürs Schwarze Brett, die eigenen Textbausteine, die Schriftwahl, alle Piktogramme und der Stand der Marke.',
    ids: ['kurzanleitung'],
    seiten: ['liegenschaften', 'eigene', 'schrift', 'piktogramme', 'marke', 'hilfe']
  }
];

/* ---------- Werkzeugseiten ------------------------------------------------ */
/* Seiten ohne Druckvorlage. Sie stehen im Bereich «Team und Werkzeug» und
   sind zugleich über die Seitenleiste direkt erreichbar. */
export const SEITEN = {
  liegenschaften:{ id:'liegenschaften', icon:'door', title:'Liegenschaften',
            sub:'Die Häuser des Hauses — wählen, neue anlegen, weitergeben.' },
  hilfe:  { id:'hilfe',  icon:'info',  title:'Anleitung',
            sub:'Wie die Zentrale bedient wird — in drei Schritten.' },
  eigene: { id:'eigene', icon:'mail',  title:'Eigene Textbausteine',
            sub:'Sätze des Hauses sichern, ändern, weitergeben.' },
  marke:  { id:'marke',  icon:'check', title:'Marke und Schrift',
            sub:'Farben, Schriften und was davon gerade wirklich läuft.' },
  schrift:{ id:'schrift', icon:'stift', title:'Schriften wählen',
            sub:'Siebzehn freie Schriften als Ersatz für die gekauften — live am echten Aushang.' },
  piktogramme:{ id:'piktogramme', icon:'stern', title:'Piktogramme',
            sub:'Alle 86 Zeichen des Hauses, nach Thema geordnet und durchsuchbar.' }
};

/* ---------- Nachschlagen -------------------------------------------------- */
const BEREICH_VON = {};
for (const b of BEREICHE) for (const id of b.ids) BEREICH_VON[id] = b;

/** Zu welchem Arbeitsbereich gehört eine Vorlage? */
export function bereichVon(id){ return BEREICH_VON[id] || null; }

/** Ein Bereich nach seiner Kennung. */
export function bereich(id){ return BEREICHE.find(b => b.id === id) || null; }

/** Alle Vorlagen-Kennungen in Bereichsreihenfolge — die Reihenfolge der
    Startseite und der Suche. */
export const BEREICH_ORDER = BEREICHE.flatMap(b => b.ids);
