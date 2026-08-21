# N's Hotel · Vorlagen-Zentrale

Ein Web-Portal, mit dem das ganze Team von **N's Hotel** (Hans Amonn AG, Kerzers)
Aushänge, Aufkleber und Karten selber erstellt — immer in der gleichen Marke,
ohne Grafikprogramm. Texte anpassen, fertig drucken.

Kein Login, keine Datenbank, kein Server: die App läuft vollständig im Browser.

---

## Wo finde ich die Vorlagen-Zentrale?

**Der Link:** https://elpollo619.github.io/N-s-Hotel-template-system/

Er funktioniert auf jedem Gerät — Büro-PC, Handy, Tablet — und zeigt immer den
aktuellen Stand. Am besten einmal als Lesezeichen speichern; am Handy über
«Zum Startbildschirm hinzufügen», dann liegt sie wie eine App auf dem Display.

> **Einmalig einschalten:** Repository → **Settings → Pages** → unter
> *Build and deployment* die Quelle auf **«GitHub Actions»** stellen. Die
> Auswahl gilt sofort. Danach veröffentlicht `.github/workflows/pages.yml`
> bei jedem Push auf `main` von selbst.
>
> Der Schalter lässt sich nicht aus dem Workflow heraus umlegen: das Anlegen
> einer Pages-Seite verlangt Administrationsrechte am Repository, die der
> `GITHUB_TOKEN` eines Workflows nicht besitzt
> (`Create Pages site failed. Resource not accessible by integration`).

**Ohne Internet:** die Datei `standalone.html` herunterladen und doppelklicken.
Sie enthält alles in einer einzigen Datei und läuft ohne Server. Nachteil: eine
heruntergeladene Kopie veraltet — für den täglichen Gebrauch ist der Link besser.

---

## Für das Team — so geht's

1. Den Link öffnen (oder `standalone.html` doppelklicken).
2. Eine Vorlage anklicken.
3. Links die Texte anpassen — die Vorschau rechts ändert sich sofort mit.
4. **Drucken / PDF** wählen. Im Druckdialog:
   * **Ränder: keine**
   * **Hintergrundgrafiken: einschalten**
   * **Skalierung: 100 %**
5. Fertig. Wer lieber ein Bild braucht: **PNG speichern**.

Nützlich zu wissen:

* Der grüne Balken oben links zeigt, ob das Blatt noch **auf eine Seite passt**.
  Wird er orange, sind die Texte zu lang.
* Änderungen bleiben im Browser gespeichert — bei jeder Person am eigenen Gerät.
  **Zurücksetzen** stellt das Original wieder her.
* **Entwurf sichern** legt eine kleine Datei ab, die eine Kollegin mit
  **Entwurf laden** wieder öffnen kann.
* Die Oberfläche gibt es auf Deutsch und Englisch (oben rechts). Der **Inhalt**
  der Aushänge ist immer zweisprachig DE/EN, je nach Baustein zusätzlich
  FR, IT oder PT.
* Beim **Hinweis** zuerst den fertigen Textbaustein wählen und
  **Baustein übernehmen** drücken — danach ist alles frei überschreibbar.
  Dann die **Liegenschaft** wählen: Kürzel und Adresse setzen sich von selbst.

### Ankündigung fürs Team

Zum Kopieren, wenn die Zentrale im Haus bekannt gemacht wird:

> **Neu: die Vorlagen-Zentrale**
>
> Aushänge, Parkplatzschilder, Waschpläne und die Beschriftung der
> Sammelstelle machen wir ab sofort selber — ohne Word, ohne Grafiker, immer
> im gleichen Auftritt.
>
> 👉 https://elpollo619.github.io/N-s-Hotel-template-system/
>
> Vorlage anklicken, links die Texte anpassen, «Drucken / PDF». Im Druckdialog
> **Ränder: keine** und **Hintergrundgrafiken: ein**.
>
> Die gewohnten Texte sind schon drin — Rauchverbot, Parkverbot, Küche sauber
> halten, Check-in und rund vierzig weitere. Baustein wählen, Liegenschaft
> wählen, drucken.
>
> Fragen an Cris.

---

## Vorlagen

| Vorlage | Format | Wofür |
|---|---|---|
| **Hinweis / Aushang** | A4 hoch | Die Arbeitsvorlage für die bestehenden Zettel aus `J:\Immobilien\Plakate` — rund 30 fertige Textbausteine, Kopfbalken navy / cyan / rot je nach Ton |
| **Sicherheitszeichen** | A5/A4, mehrseitig | Verbot, Warnung, Gebot, Rettung und Brandschutz in der Formensprache von ISO 3864-1 / ISO 7010 — 16 fertige Zeichen, eine Seite je Schild |
| **Etikettenbogen** | A4 hoch, mehrseitig | Klebeetiketten auf Avery-Bogen (L7160, L7163, L7165, L7651) oder freiem Raster — Schlüssel, Schränke, Vorräte |
| **Mieterbrief** | A4 hoch | Schreiben mit Briefkopf: Hauseingangstür, Besucherparkplatz, Brandmelder |
| **Parkplatz-Schild** | A5/A4, mehrseitig | Reserviert / Privat / Besucher — eine Seite je Platznummer |
| **Waschplan** | A4 hoch | Wochenraster zum Eintragen, Tage und Zeitfenster einstellbar |
| **Sammelstelle beschriften** | A5/A4, mehrseitig | Papier, PET, Glas, Kehricht … — eine Seite je Behälter, mit «gehört hinein / gehört nicht hinein» |
| **Kurzanleitung** | A4 hoch | Zum Aufhängen neben dem Drucker: QR-Code auf die Zentrale, die drei Schritte, die Druckeinstellungen |
| **Notruf-Aushang (Telefon)** | A4 hoch | Tastenbelegung am Check-in-Telefon mit dem Original-Telefonschema aus v6 und den Notrufnummern |
| **Pfeil-Aufkleber Rezeption** | A4 Druckvorlage | Wegweiser in Originalgrösse, dunkel / hell / cyan, vier Pfeilrichtungen |
| **Aufkleber-Druckbogen** | A4 hoch | Runde Aufkleber in Originalgrösse inkl. Massstab-Kontrolle |
| **Gäste-Info (universell)** | A4 hoch | WLAN, Frühstück, Öffnungszeiten … beliebig viele Infozeilen mit Symbol |
| **Parkplatz-Info** | A4 hoch | Lageplan plus Text in vier Sprachen |
| **Orientierungskarte** | A4 quer | Anfahrtswege und gezeichneter Plan nebeneinander |
| **Luftbild mit Pins** | A4 quer | Eigenes Luftbild hochladen, Pins frei platzieren |
| **TV-Anleitung (Zattoo)** | A4 hoch | Fernsehen im Zimmer, Schritt für Schritt |
| **Plan-Editor** | A4/A3/A5/Letter | Lageplan auf dem Luftbild frei bearbeiten — Zonen, Wege, Pins, Piktogramme und Beschriftungen ziehen |
| **Gästemappe** | A4 hoch, mehrseitig | Achtseitige Mappe fürs Zimmer: Willkommen, das Wichtigste, Parken und Einkaufen, Zug und Bus, Ausflüge, Essen, Notfall und Kontakt |

**So funktioniert der Plan-Editor:** ein Element anklicken und ziehen. Bei
Zonen und Wegen erscheinen blaue Punkte zum Umformen — Doppelklick auf einen
Punkt entfernt ihn. Links stehen Farbe, Deckkraft, Liniendicke und Grösse.
Neue Elemente kommen über die Knöpfe oben links dazu, `↻ Alles drehen` dreht
die Szene um 90°, und mit dem Zoom lässt sich der Hintergrund verschieben.
Papierformat und Ausrichtung stellt man im Formular ein.

**So funktioniert die Gästemappe:** sie ist die einzige mehrseitige Vorlage.
Jedes Kapitel ist eine echte Druckseite; „Drucken / PDF" liefert die acht
Seiten am Stück, „Als PNG" eine Bilddatei je Seite
(`ns-hotel-gaestemappe-01.png` …). Der Browser fragt dabei einmal nach, ob er
mehrere Dateien laden darf. Kapitel, die ein Haus nicht braucht, lassen sich
im Formular auf „Nein" stellen — Inhaltsverzeichnis, Kapitelnummern und
Seitenzahlen rücken automatisch nach. Die Höhenkontrolle links prüft jede
Seite einzeln und nennt bei Überlauf die Seitennummer.

Inhaltlich übernimmt sie die bestehende Gästemappe des Hauses — dieselben
Adressen, Zeiten und Nummern —, aber ohne Leaflet-Karte, Wetter- und
Fahrplanabfrage. Die brauchen ein Netz und einen fremden Server; die
Vorlagen-Zentrale soll offline und aus einer einzelnen Datei laufen. Wer die
Live-Fassung fürs Handy will, behält die bisherige HTML-Mappe daneben.

Nicht übernommen: die **Reels** (9 × 16). Sie sind keine Druckvorlage, sondern
zeitgesteuerte Videoszenen auf React und Babel aus dem CDN — beides steht im
Widerspruch zu „kein Framework, kein CDN, läuft offline". Sie funktionieren
als eigenständige Dateien bereits gut und bleiben deshalb, wo sie sind.

**So funktionieren die Sicherheitszeichen:** Form und Farbe folgen
ISO 3864-1 — roter Ring und Schrägbalken je 0,08 des Durchmessers, Balken über
dem Symbol, gelbes Dreieck mit schwarzem Rand, blauer Kreis für Gebote, grünes
Quadrat für Rettungszeichen. **Die Piktogramme sind eigene Zeichnungen im Stil
der Norm, nicht die amtlichen Symbole.** Für zertifizierte Kennzeichnung —
Fluchtwege und Brandschutz nach Vorgabe der Feuerpolizei — gehören geprüfte
Schilder an die Wand. Für den Hausgebrauch (Rauchverbot im Treppenhaus,
«Tür geschlossen halten» an der Waschküche) ist der eigene Druck richtig.

**So funktioniert der Etikettenbogen:** die Raster stammen von Avery Zweckform;
die Etikettengrösse und die Anzahl je Bogen sind Herstellerangaben, die
Randmasse daraus mittig berechnet. Vor dem ersten echten Bogen einmal auf
normales Papier drucken, gegen den Etikettenbogen halten und bei Bedarf die
Feinverschiebung setzen — Drucker versetzen gerne um ein bis zwei Millimeter.
Im Druckdialog zwingend **Ränder: keine** und **Skalierung: 100 %**; sobald der
Browser das Blatt einpasst, stimmt kein Etikett mehr.

---

## Aushang teilen — der Link

Neben «Entwurf sichern» steht **«Link teilen»**. Er legt den ganzen Aushang in
die Adresse und kopiert sie in die Zwischenablage:

```
https://elpollo619.github.io/N-s-Hotel-template-system/#/t/hinweis?d=zXQAAA…
```

Wer den Link anklickt, sieht denselben Aushang und kann ihn drucken. Es geht
nichts an einen Server — die Daten stehen in der Adresse selbst.

* Bilder bleiben draussen. Ein Foto sprengt jede Adresszeile; dafür gibt es
  weiterhin «Entwurf sichern» und die Entwurfsdatei.
* Wird der Entwurf zu lang, sagt das Werkzeug es und schlägt die Datei vor.
* Beim Empfänger wird gefragt, bevor ein eigener Entwurf ersetzt wird.
* Aus `standalone.html` heraus zeigt der Link auf die Datei auf **diesem**
  Rechner. Zum Verschicken die Adresse im Internet nehmen.

---

## Lesbar aus wie weit?

Bei den Schildern steht links unter der Höhenkontrolle, aus welcher
Entfernung die grösste Schrift noch sicher lesbar ist. Gerechnet wird mit der
Faustregel aus der Beschilderungspraxis:

```
nötige x-Höhe in mm  =  Leseabstand in m  ×  2,5
```

Die x-Höhe ist die Höhe des kleinen «x», nicht die Schriftgrösse — sie
entscheidet über die Lesbarkeit, nicht die Punktzahl. Die Anzeige ist eine
Orientierung: schlechtes Licht, schräger Blick und schwacher Kontrast
verkürzen den Abstand zusätzlich. Wird die Zeile orange, ist das Blatt eher
ein Merkblatt als ein Schild.

---

## Liegenschaften und Absender

Die Vorlagen kennen die Häuser aus `J:\Immobilien` — dieselben Kürzel wie die
Ordner dort: **A4, A12, A12a, A14, B4, B7, B22, H8, I16, S17, Casa Reto**. Im
Formular wählt man das Objekt, und Kürzel plus Adresse erscheinen auf dem Blatt.

Dazu gibt es drei Absender, weil das Haus unter drei Namen schreibt:

| Absender | Verwendung |
|---|---|
| **N's Hotel** | alles rund um Gäste und Zimmer |
| **HANS AMONN IMMOBILIEN** | Vermietung, Hausordnung, Mieterkorrespondenz |
| **AMONN ARCHITEKTUR** | Schreiben, die unter der Architektur-Firma laufen |

Die Wortmarke mit dem Pin erscheint **nur** beim Absender N's Hotel. Für die
beiden Amonn-Firmen liegt kein Logo im Repository; dort steht der Firmenname
in der Display-Schrift. Ein Hotel-Logo unter einem Immobilienaushang wäre
schlicht falsch.

### Adressen

Alle Liegenschaften sind hinterlegt:

| Kürzel | Adresse |
|---|---|
| A4 | Allmendstrasse 4/4a, 3210 Kerzers |
| A12 | Allmendstrasse 12, 3210 Kerzers |
| A12a | Allmendstrasse 12a, 3210 Kerzers |
| A14 | Allmendstrasse 14, 3210 Kerzers — N's Hotel |
| B4 | Blümlisalpstrasse 4, 3074 Muri bei Bern — Sitz der Firma |
| B7 | Burgstatt 7, 3210 Kerzers |
| B22 | Bernstrasse 22, 3053 Münchenbuchsee |
| H8 | Höheweg 8, 3074 Muri bei Bern |
| S17 | Sahlistrasse 17, 3012 Bern |
| Casa Reto | Via Loco Coste 51, 6596 Gordola |

Offen ist nur **I16**. Dort bleibt das Feld leer, statt geraten zu werden — ein
falscher Strassenname auf einem Aushang wäre schlimmer als gar keiner. Der
Editor weist darauf hin; auf dem Druck erscheint der Hinweis nicht. Sobald die
Adresse bekannt ist, in `js/objekte.js` eintragen — alle Vorlagen ziehen
automatisch nach.

Casa Reto liegt im Tessin: dort ist Italienisch die naheliegende zweite
Sprache, das Feld dafür ist im Hinweis vorhanden.

---|---|---|
| A4 | Allmendstrasse 4/4a | `02 Vermietung/Besucher PP A4.docx` |
| A14 | Allmendstrasse 14, 3210 Kerzers | Gästemappe N's Hotel |
| B4 | Blümlisalpstrasse 4, 3074 Muri b. Bern | Briefkopf HANS AMONN AG |
| B22 | Bernstrasse 22, 3053 Münchenbuchsee | `Information gebrauch Waschmaschine B22.docx` |
| H8 | Höheweg 8 | Ordner `Dossier Liegenschaften` |

Bei **A12, A12a, B7, B22, I16, S17 und Casa Reto** steht die Adresse bewusst
leer. Ein falscher Strassenname auf einem Aushang wäre schlimmer als gar
keiner. Sobald sie bekannt sind, in `js/objekte.js` eintragen — alle Vorlagen
ziehen automatisch nach. Solange etwas fehlt, zeigt der Editor einen Hinweis,
der **nicht** mitgedruckt wird.

---

## Textbausteine

`js/presets.js` enthält die Wortlaute der bestehenden Aushänge, eins zu eins
aus den Word-Dateien übernommen — Rauchverbot, Betäubungsmittel,
Videoüberwachung, Abfall nur in Säcken, Nur PET, Küche sauber hinterlassen,
Kühlschrank, Parkverbot, Check-in, Express Check-out und weitere. Sie sind
nach Kategorie sortiert:

Hausordnung und Verbote · Abfall und Recycling · Parkieren · Küche und Bad ·
Waschen und Trocknen · Vermietung · Hotel und Gäste · Technik und Unterhalt

Rund **40 Bausteine**, unter anderem: Rauchverbot (Haus und Hotel-Fassung mit
Kostenfolge), Betäubungsmittel, Videoüberwachung, Ruhezeit, Fenster
geschlossen halten, Schlüssel nicht stecken lassen, Abfall nur in Säcken, Nur
PET, sauberes Papier und Karton, Privatparkplatz, unberechtigt abgestelltes
Fahrzeug, Küche sauber hinterlassen, Kühlschrank, Backofen nur mit
Backpapier, kein Geschirr entfernen, Wäschehänge, Check-in, Check-out mit
Zimmerkarte, WLAN, Brandmelder und angekündigte Kontrollen.

Im Editor Baustein wählen, **Baustein übernehmen** drücken, fertig. Danach ist
jedes Feld frei überschreibbar. Drei Platzhalter werden beim Zeichnen ersetzt:
`{{adresse}}`, `{{objekt}}` und `{{datum}}`.

Mehrsprachig: **DE, EN, FR, IT und PT**. Deutsch steht immer oben, die
übrigen Sprachen erscheinen nur, wenn etwas drinsteht. Das entspricht den
Originalen — `Verbotene Substanzen.docx` ist DE/IT/EN, `Hinweis Parkverbot
Kerzers.docx` DE/FR/PT, `Wäschehänge.docx` DE/EN/FR.

**Nicht übernommen wurden zwei WLAN-Passwörter**, die in
`Videoüberwachung.docx` und `Wifi.docx` im Klartext stehen. Das Repository ist
öffentlich; solche Angaben gehören nicht hinein. Die Netznamen sind drin, das
Passwort ist überall ein Platzhalter — wer es braucht, trägt es im Editor ein,
und es bleibt im Browser der jeweiligen Person.

---

## QR-Code

`tools/make-qr.py` erzeugt den QR-Code auf die Zentrale — einmal als SVG
(`assets/brand/qr-vorlagen.svg`) und einmal als ES-Modul
(`js/lib/qr-vorlagen.js`), das die Kurzanleitung fest einbettet.

```bash
pip install segno
python3 tools/make-qr.py
```

Zwei Entscheide dahinter:

* **Kein QR-Dienst im Internet.** Die Adresse verlässt den eigenen Rechner
  nicht, und die App fragt beim Zeichnen nichts nach draussen.
* **Eingebettet statt nachgeladen.** `standalone.html` wird per Doppelklick
  geöffnet; eine Datei mit `file://`-Adresse darf keine Nachbardateien
  nachladen. Als Modul wandert der Code beim Bauen mit in die Einzeldatei.

Wer die Adresse ändert: `URL` im Skript anpassen, Skript laufen lassen, und im
Editor die Zeile zum Abtippen nachziehen — beide müssen zusammenpassen.

---

## Marke

Farben und Schriften kommen unverändert aus `parking.css` und stehen in
`assets/brand-tokens.css`. Alle fünfzehn Farbwerte und die drei Schriftfamilien
wurden gegen die echte Datei aus dem Google-Drive-Ordner
«carteles Ns Hotel» abgeglichen — sie stimmen zeichengenau überein:

* Navy `#2A3350` · Cyan `#01B1E2` · Grün `#1F9D57` · Fussweg `#12A150`
* Gebäude `#B7D900` · Parkplatz aussen `#E5387E` · öffentliches Parking `#8E44EF`
* Notfall `#E23A2E` · Leinwand `#EEF0F4`
* Schriften: **Gotham** (Titel), **Montserrat** (Fliesstext),
  **Caflisch Script Pro** (handschriftliche Eyebrow-Zeile)

Schweizer Schreibweise ist eingebaut: aus einem getippten «ß» wird beim
Ausgeben automatisch «ss».

### Wichtig: dieses Repository ist öffentlich

Zwei Dinge gehören deshalb **nicht** hinein und sind bewusst ausgeschlossen:

* **Die Markenschriften.** Gotham (Hoefler & Co) und Caflisch Script Pro (Adobe)
  sind lizenzpflichtig; ihre Lizenzen verbieten die Weitergabe. `.gitignore`
  sperrt `assets/fonts/*.otf`. Jede Arbeitsstation legt die Dateien selbst ab.
* **Echte Zugangsdaten.** Das WLAN-Passwort in der Gäste-Info und in der
  Gästemappe ist ein Platzhalter (`· · · · · · · ·`). Es wird im Editor
  eingetragen und bleibt im Browser der jeweiligen Person — es wandert nie ins
  Repository.

Telefon, WhatsApp, E-Mail und Web in `js/brand-config.js` sind dagegen die
öffentlichen Kontaktangaben des Hauses; sie stehen ohnehin auf jedem Aushang
und in der bestehenden Gästemappe.

### Ersatzschriften

Gotham und Caflisch Script Pro sind lizenzpflichtig und dürfen nicht in einem
öffentlichen Repository liegen. Solange sie fehlen, rendert die App mit den
nächstliegenden frei lizenzierten Schriften — beide liegen lokal im Projekt,
es wird kein CDN angefragt:

| Marke | Ersatz | Warum |
|---|---|---|
| Gotham-Bold | **Montserrat** | geometrische Grotesk mit grosser x-Höhe, der gängige freie Gotham-Ersatz |
| Caflisch Script Pro | **Parisienne** | verbundene, leicht geneigte Schreibschrift mit Federduktus — deutlich näher an Caflisch als Dancing Script, das runder und verspielter läuft |

Dancing Script bleibt als zweiter Fallback in der Kette, falls Parisienne
einmal fehlt. Sobald die echten Schriften im Ordner liegen, gewinnen sie
automatisch — an den Vorlagen ändert sich nichts.

### Echte Schriften und Logos nachrüsten

Gotham und Caflisch Script Pro sind lizenzpflichtig und deshalb **nicht** im
Repository. Ausgeliefert wird der im Handbuch vorgesehene Fallback
(Montserrat und Dancing Script), lokal eingebunden — ohne CDN, damit die App
auch offline funktioniert.

Die Dateien liegen im Google-Drive-Ordner unter `assets/fonts` und
`assets/brand`. Sie müssen von Hand in den lokalen Klon kopiert werden — die
Schriften dürfen aus Lizenzgründen nicht über das Repository verteilt werden.

```bash
# 1. Dateien ablegen
#    assets/fonts/Gotham-Bold.otf              (bleibt lokal, nicht versioniert)
#    assets/fonts/CaflischScriptPro-Regular.otf (bleibt lokal, nicht versioniert)
#    assets/brand/logo.png · logo-white.png · favicon.png

# 2. eintragen lassen
npm run fonts     # schreibt assets/brand-fonts.css
npm run assets    # trägt die Bildpfade in js/brand-config.js ein

# 3. Einzeldatei neu bauen
npm run build
```

Solange die Dateien fehlen, zeichnet die App eine saubere Platzhalter-Wortmarke
— es entstehen **keine** Fehler in der Konsole.

Stammdaten stehen zentral in `js/brand-config.js`; alle Vorlagen greifen darauf zu.
Die Adresse ist hinterlegt (Allmendstrasse 14, 3210 Kerzers), **Telefon, Mail und
Web sind absichtlich leer** — erfundene Kontaktdaten gehören nicht auf einen
Aushang. Sobald die echten Angaben dort eingetragen sind, erscheinen sie
automatisch in allen Fusszeilen.

---

## Aufbau

```
index.html                 Hub und Editor-Hülle
standalone.html            alles in einer Datei (offline, per Doppelklick)
manifest.webmanifest, sw.js  installierbar und offline-fähig
assets/
  brand-tokens.css         Farben, Schriftfamilien, Eyebrow-Regel
  brand-fonts.css          echte Markenschriften (erzeugt)
  fonts.css, fonts/        lokaler Fallback (Montserrat, Dancing Script)
  app.css                  Oberfläche — alle Klassen mit .vz- vorangestellt
  templates.css            Vorlagen-Styles, je unter .t-<id> gekapselt
js/
  app.js                   Router, Formular-Erzeugung, Vorschau, Aktionen
  brand-config.js          Stammdaten und Pfade zu den Marken-Assets
  lib/                     dom · icons · brand · sitemap · export · storage · i18n · thumbs
  templates/               eine Datei pro Vorlage + index.js (Reihenfolge, Gruppen)
tools/                     standalone-Bau, Schriften/Assets eintragen
tests/                     Playwright-Prüfungen
```

### Eine neue Vorlage bauen

Jede Vorlage ist ein Modul mit immer derselben Form. Das Formular im Editor
wird **automatisch** aus `fields` erzeugt.

```js
export default {
  id:'zimmer', title:'Zimmer-Aushang', sub:'… · A4 hoch',
  badge:'Aushang', page:'a4',      // a4 | a4-land | a5
  root:'t-zimmer',                 // CSS-Klasse des Blattes
  thumb: thumb(`<rect …>`),        // Miniatur für den Hub

  fields:[
    { t:'group', label:'Kopf' },                       // Zwischenüberschrift
    { k:'title', label:'Titel', type:'text' },
    { k:'text',  label:'Text DE', type:'textarea' },
    { k:'bild',  label:'Bild', type:'image' },
    { k:'zeilen', label:'Zeilen', type:'list',         // wiederholbare Zeilen
      defaultItem:{ de:'', en:'' },
      item:[{ k:'de', label:'DE', type:'text' },
            { k:'en', label:'EN', type:'text' }] }
  ],

  defaults:{ title:'…', text:'…', zeilen:[] },

  render(d){ return `<h1>${esc(d.title)}</h1>…`; }   // innerHTML des Blattes
};
```

Feldtypen: `text` · `textarea` · `number` · `select` · `color` · `image` ·
`list` · `group` · `note`.

**Interaktive Vorlagen** (wie der Plan-Editor) ergänzen zwei Haken:

```js
pageOf(d){ return 'a4-land'; },          // Papierformat aus dem Zustand
mount({ sheet, panel, state, save, repaint }){
  // nach jedem Zeichnen aufgerufen; gibt eine Aufräum-Funktion zurück
}
```

`save()` sichert nur (ohne Neuzeichnen — wichtig, damit das Ziehen flüssig
bleibt), `repaint()` zeichnet das ganze Blatt neu.

**Mehrseitige Vorlagen** (wie die Gästemappe) setzen `multipage:true` und
geben in `render()` je Druckseite ein `<section data-page>` aus. Das Blatt
selbst wird dann unsichtbar und ist nur noch der Stapel; Papier, Rand und
Seitenumbruch trägt jede `[data-page]`. Höhenkontrolle, Druck und PNG-Export
richten sich automatisch danach — geprüft wird jede Seite einzeln, und der
PNG-Knopf legt eine Datei je Seite an.

`esc()` schützt vor HTML im Nutzertext, `fmt()` kann zusätzlich `**fett**` und
Zeilenumbrüche. Danach in `js/templates/index.js` eintragen (`TEMPLATES`,
`ORDER`, `GROUPS`) und die Styles unter `.t-<id>` in `assets/templates.css`
ergänzen.

---

## Entwickeln und prüfen

```bash
npm start          # Server auf http://127.0.0.1:8099
npm run build      # standalone.html neu bauen
npm test           # alle Prüfungen (baut standalone.html vorher neu)
```

Die Prüfungen laufen headless in Chromium und decken ab:

* **`tests/shot.mjs`** — jedes Blatt passt auf eine Seite (`offsetHeight`),
  keine Konsolenfehler, Screenshot je Vorlage nach `tests/out/`
* **`tests/print.mjs`** — der Druck ergibt **genau so viele** Seiten, wie die
  Vorlage anlegt (einseitig eine, Gästemappe acht), im richtigen Papierformat,
  ohne Bedienleiste und ohne Formular
* **`tests/export.mjs`** — PNG-Export erzeugt echte Bilddateien, bei
  mehrseitigen Vorlagen eine je Seite
* **`tests/interaction.mjs`** — Live-Vorschau ohne Fokusverlust, wiederholbare
  Zeilen, Speicherung, Zurücksetzen, Sprachumschaltung
* **`tests/planeditor.mjs`** — Auswählen, Ziehen, Umformen, Drehen, Formatwechsel
* **`tests/gaestemappe.mjs`** — Seitenzahl, Höhe jeder einzelnen Seite,
  Kapitel ab- und zuschalten, durchlaufende Nummerierung
* **`tests/teilen.mjs`** — der Teilen-Link kommt in einem fremden Browser an,
  räumt die Adresse auf, übersteht das Neuladen, lässt Bilder draussen; dazu
  die Rechnung hinter der Leseabstand-Anzeige
* **`tests/etiketten.mjs`** — der Etikettenbogen sitzt millimetergenau auf den
  Herstellermassen, Feinverschiebung und freies Raster greifen, ein voller
  Bogen läuft auf die zweite Seite
* **`tests/standalone.mjs`** — `standalone.html` läuft per `file://`, inklusive
  PNG-Export ohne Netz

Für Playwright einmalig `npm install` ausführen.

---

## Veröffentlichen

Es ist eine rein statische Seite — sie läuft auf **Vercel**, **Netlify**,
**GitHub Pages** oder jedem Webspace. Einfach den Ordner hochladen, kein
Build-Schritt nötig.

Über HTTPS meldet sich ein Service-Worker an: die Seite ist danach
installierbar und funktioniert auch ohne Netz. Wer gar keinen Server will,
nimmt **`standalone.html`** — eine einzige Datei mit allem darin, die per
Doppelklick startet und sich per Mail oder USB-Stick weitergeben lässt.

---

## Technische Entscheide

* **Kein Framework, kein Build-Zwang.** Reines HTML, CSS und ES-Module. Damit
  ist die App in fünf Jahren noch wartbar und läuft auf jedem Webspace.
* **Kein CDN.** Schriften liegen lokal, damit auch offline alles stimmt.
* **PNG ohne html2canvas.** Das Blatt wird als SVG mit `foreignObject`
  serialisiert (Schriften als Data-URI eingebettet) und auf ein Canvas
  gezeichnet — dreifache Auflösung, keine Fremdbibliothek.
* **Eine Seite, garantiert.** Nach jedem Tastendruck wird die Blatthöhe gegen
  das Papierformat geprüft; der Test in `tests/print.mjs` misst zusätzlich das
  echte PDF.

---

## Para Cris (resumen en español)

* La app está terminada y probada: **8 plantillas** (Fase 1 y Fase 2 del brief).
* El equipo entra por un enlace, edita textos y exporta **PDF** o **PNG**.
  Sin login, sin backend; los borradores se guardan en el navegador de cada uno.
* Desde tu carpeta de Drive «carteles Ns Hotel» ya se incorporaron: el **SVG
  exacto del teléfono v6**, los **tokens verificados** contra el `parking.css`
  real, la **dirección correcta** (Allmendstrasse 14) y la **marca dibujada**
  (pin teardrop + N's Hotel) de la implementación de referencia.
* El **luftbild ya está**: lo generé desde swisstopo (swissimage, 10 cm/píxel)
  para Allmendstrasse 14 y lleva la atribución «© swisstopo» que exige la
  licencia. Está en `assets/img/aerial-site.jpg`.
* La **marca de Zattoo** original está incrustada en la plantilla de TV.
* **Las fuentes y los logos siguen pendientes.** Están en tu Drive, pero son
  binarios y no pueden pasar por este canal sin riesgo de corromperse. Además,
  este repositorio es **público**: Gotham y Caflisch son de pago y no pueden
  publicarse aquí. Cópialos a mano en tu clon local y ejecuta `npm run fonts`
  y `npm run assets`.
* **Teléfono, mail y web están vacíos** a propósito en `js/brand-config.js`.
  Rellénalos y aparecen solos en todos los pies de página.
* La **Fase 3** está hecha: Plan-Editor interactivo y Gästemappe de ocho
  páginas. Los **Reels** (9 × 16) se quedan fuera a propósito: son vídeo con
  React y Babel desde un CDN, justo lo que esta app no puede llevar (sin
  framework, sin CDN, funcionando sin internet). Ya funcionan solos.
  Necesita los ficheros originales `mapeditor.js` y las plantillas HTML.
