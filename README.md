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
2. Vorlage suchen — **oben ins Suchfeld tippen** oder links ein **Kapitel**
   anklicken.
3. Links die Texte anpassen, Kapitel für Kapitel. Die Vorschau rechts ändert
   sich sofort mit.
4. **Drucken / PDF** wählen. Im Druckdialog:
   * **Ränder: keine**
   * **Hintergrundgrafiken: einschalten**
   * **Skalierung: 100 %**
5. Fertig. Wer lieber ein Bild braucht: **PNG speichern**. Wer es
   weitergeben will: **Link teilen**.

Nützlich zu wissen:

* Die **Suche** geht quer durch alles: Vorlagen, die 42 Textbausteine, die
  16 Sicherheitszeichen und die Abfallfraktionen — und durch alle sechs
  Aushangsprachen. «no smoking» findet das Rauchverbot ebenso wie «Rauchen».
  Ein Treffer auf einen Baustein öffnet die Vorlage **mit genau diesem
  Baustein**; man muss ihn nicht noch einmal suchen.
* Mit **`/`** springt der Cursor ins Suchfeld, mit **Esc** geht es aus dem
  Editor zurück.
* Das Formular ist in **Kapitel** geteilt. Offen ist zu Beginn nur das erste;
  **Alle aufklappen** zeigt alles. Welche Kapitel offen sind, merkt sich die
  Vorlage.
* Über der Vorschau stehen **Papierformat**, bei mehrseitigen Vorlagen ein
  **Seitenzähler** und rechts der **Massstab** (Einpassen, 50 %, 100 %, 200 %).
  Auch der Massstab bleibt je Vorlage gemerkt.
* Der grüne Balken links zeigt, ob das Blatt noch **auf eine Seite passt**.
  Wird er orange, sind die Texte zu lang.
* Auf der Startseite stehen die **zuletzt benutzten** Vorlagen zuoberst.
* Änderungen bleiben im Browser gespeichert — bei jeder Person am eigenen Gerät.
  **Zurücksetzen** stellt das Original wieder her.
* **Entwurf sichern** legt eine kleine Datei ab, die eine Kollegin mit
  **Entwurf laden** wieder öffnen kann.
* Die Oberfläche gibt es auf Deutsch und Englisch (oben rechts). Der **Inhalt**
  der Aushänge lässt sich in sechs Sprachen setzen — siehe
  [Sprachen auf dem Aushang](#sprachen-auf-dem-aushang).
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
> Oben ins Suchfeld tippen, was du brauchst — «Rauchverbot», «PET»,
> «Notausgang» — oder links ein Kapitel anklicken. Dann links die Texte
> anpassen und «Drucken / PDF». Im Druckdialog **Ränder: keine** und
> **Hintergrundgrafiken: ein**.
>
> Die gewohnten Texte sind schon drin — Rauchverbot, Parkverbot, Küche sauber
> halten, Check-in und 42 weitere, jeder in sechs Sprachen.
>
> Fragen an Cris.

---

## Vorlagen

| Vorlage | Format | Wofür |
|---|---|---|
| **Hinweis / Aushang** | A4 hoch | Die Arbeitsvorlage für die bestehenden Zettel aus `J:\Immobilien\Plakate` — 42 fertige Textbausteine in sechs Sprachen, Kopfbalken navy / cyan / rot je nach Ton |
| **Sicherheitszeichen** | A5/A4, mehrseitig | Verbot, Warnung, Gebot, Rettung und Brandschutz in der Formensprache von ISO 3864-1 / ISO 7010 — 16 fertige Zeichen in sechs Sprachen, eine Seite je Schild |
| **Etikettenbogen** | A4 hoch, mehrseitig | Klebeetiketten auf Avery-Bogen (L7160, L7163, L7165, L7651) oder freiem Raster — Schlüssel, Schränke, Vorräte |
| **Mieterbrief** | A4 hoch | Schreiben mit Briefkopf: Hauseingangstür, Besucherparkplatz, Brandmelder |
| **Parkplatz-Schild** | A5/A4, mehrseitig | Reserviert / Privat / Besucher — eine Seite je Platznummer |
| **Waschplan** | A4 hoch | Wochenraster zum Eintragen, Tage und Zeitfenster einstellbar |
| **Sammelstelle beschriften** | A5/A4, mehrseitig | Papier, PET, Glas, Kehricht … — eine Seite je Behälter, mit «gehört hinein / gehört nicht hinein» |
| **Foto-Aushang** | A4/A5 | Ein Bild und ein Satz — Frühstück, Hausregeln, Hinweise. Wahlweise randabfallend mit Text darüber; für die Druckerei mit Schnittmarken und Beschnitt |
| **Grossflächenplakat** | mehrere A4 | Ein grosses Plakat aus 2 × 2 bis 4 × 4 A4-Blättern zum Zusammenkleben — mit Bauanleitung als erster Seite |
| **QR-Aushang** | A4 hoch | WLAN-Zugang, Link, Telefonnummer oder Adresse als grosser Code — mit Anleitung in bis zu sechs Sprachen |
| **Kurzanleitung** | A4 hoch | Zum Aufhängen neben dem Drucker: QR-Code auf die Zentrale, die vier Schritte, die Druckeinstellungen |
| **Notruf-Aushang (Telefon)** | A4 hoch | Tastenbelegung am Check-in-Telefon mit dem Original-Telefonschema aus v6 und den Notrufnummern |
| **Pfeil-Aufkleber Rezeption** | A4 Druckvorlage | Wegweiser in Originalgrösse, dunkel / hell / cyan, vier Pfeilrichtungen |
| **Aufkleber-Druckbogen** | A4 hoch | Runde Aufkleber in Originalgrösse inkl. Massstab-Kontrolle |
| **Gäste-Info (universell)** | A4 hoch | WLAN, Frühstück, Öffnungszeiten … beliebig viele Infozeilen mit Symbol |
| **Parkplatz-Info** | A4 hoch | Lageplan plus Text in bis zu sechs Sprachen |
| **Orientierungskarte** | A4 quer | Anfahrtswege und gezeichneter Plan nebeneinander |
| **Luftbild mit Pins** | A4 quer | Eigenes Luftbild hochladen, Pins frei platzieren |
| **TV-Anleitung (Zattoo)** | A4 hoch | Fernsehen im Zimmer, Schritt für Schritt |
| **Plan-Editor** | A4/A3/A5/Letter | Lageplan auf dem Luftbild frei bearbeiten — Zonen, Wege, Pins, Piktogramme und Beschriftungen ziehen |
| **Gästemappe** | A4 hoch, mehrseitig | Achtseitige Mappe fürs Zimmer: Willkommen, das Wichtigste, Parken und Einkaufen, Zug und Bus, Ausflüge, Essen, Notfall und Kontakt |
| **Self-Check-in** | A4 hoch | Die vier Schritte zum Zimmer, Zutrittscode gross — in bis zu sechs Sprachen, wahlweise eine Seite je Sprache |
| **Türhänger** | A4 hoch | «Bitte nicht stören», «Zimmer bitte reinigen», «Zimmer ist frei», «Bitte nicht wecken» — zwei Stück von 90 × 220 mm auf ein Blatt, Loch für die Klinke |
| **Tischaufsteller** | A4 quer | Zelt für Tisch und Theke: vorne der Gruss, hinten das Wichtigste, in der Mitte gefalzt |
| **Zimmerschild** | A5 quer, mehrseitig | Nummernschilder für die Zimmertüren — Bereich von/bis oder eigene Liste, drei Tonlagen |
| **Willkommenskarte** | A5 hoch | Die Karte auf dem Kissen, in bis zu sechs Sprachen |
| **Feedback-Aushang** | A4 hoch | Fünf Sterne, grosser QR-Code auf die Bewertungsseite |
| **Zeiten-Tafel** | A4 hoch | Öffnungs-, Frühstücks- und Waschzeiten in einer Kolonne mit Punktlinie |
| **Termin-Aushang** | A4 hoch | Heizungswartung, Liftkontrolle, Ablesung: Datum gross, dazu «Was zu tun ist» |
| **Umbau und Baustelle** | A4 hoch | Von wann bis wann, was betroffen ist, welche Folgen — mit Entschuldigung in allen gewählten Sprachen |
| **Kontakt-Tafel** | A4 hoch | Wer ist wofür da — Hauswart, Verwaltung, Notfall; die Nummer rechts und gross |
| **Preisliste** | A4 hoch | Parkplatz, Waschmarken, Extras — nach Abschnitten geordnet, Beträge mit Tabellenziffern |
| **Klingel- und Briefkastenschilder** | A4 hoch | Namensschilder in vier Handelsgrössen oder freiem Mass, als Bogen zum Ausschneiden |
| **Gutschein** | A5 quer | Wertgutschein fürs Haus — Betrag im Cyanfeld, Code und Gültigkeit; sechs Sprachen |
| **Speisekarte** | A4 hoch | Frühstücks- und Getränkekarte nach Abschnitten, Preis rechts |
| **Veranstaltungsplakat** | A4 hoch | Apéro, Fest, Markt — Datum als farbiger Block, dazu ein Programm |
| **Ausser Betrieb** | A4 hoch | Lift, Maschine, Anlage steht — «Ausser Betrieb» in vier Sprachen, dazu was stattdessen gilt |
| **Fundgegenstände** | A4 hoch | Wo Verlorenes abzuholen ist, dazu die Liste der aktuellen Fundstücke |
| **Paketablage** | A4 hoch | Wo Pakete abgegeben und abgeholt werden — ein Teil für den Boten, einer für die Bewohnerschaft |
| **Übergabeprotokoll** | A4 hoch | Wohnungsübergabe: Zustand je Raum, Zählerstände, Schlüssel, zwei Unterschriften |
| **Schlüsselquittung** | A4 hoch | Wer welche Schlüssel bekommt — Art, Nummer, Anzahl, Unterschrift |
| **Zählerstände** | A4 hoch | Ableseformular für Strom, Wasser, Wärme — eine Zeile je Zähler |
| **Mängelmeldung** | A4 hoch | Was ist kaputt: der Mieter füllt oben aus, der graue Kasten bleibt der Verwaltung |
| **Hausversammlung** | A4 hoch | Einladung mit nummerierter Traktandenliste |
| **Umzugsanzeige** | A4 hoch | Ein- oder Auszug ankündigen — Lift belegt, Entschuldigung in mehreren Sprachen |
| **Wohnung zu vermieten** | A4 hoch | Vermietungs-Aushang mit Foto, Eckdaten-Kacheln, Ausstattung und Kontakt |
| **Besichtigung** | A4 hoch | Termine für die Wohnungsbesichtigung, Treffpunkt, Anmeldung |
| **Neu im Haus** | A4 hoch | Willkommensblatt für neue Mieter: Abfall, Waschküche, Ruhezeiten, Kontakte |
| **Turnusplan** | A4 hoch | Treppenhausreinigung, Winterdienst, Kehricht — wer wann dran ist |
| **WLAN-Kärtchen** | A4 hoch | Bis zehn kleine Karten mit Netz, Passwort und QR zum Ausschneiden |
| **Ruhezeiten** | A4 hoch | Nacht-, Mittags- und Sonntagsruhe, mehrsprachig |
| **Notfallblatt** | A4 hoch | Notrufnummern gross, Verhalten im Brand- und Unfallfall, mehrsprachig |
| **Standort-Schild** | A4 quer | Notausgang, Erste Hilfe, Sammelplatz … mit grossem Symbol und Pfeil |
| **Wegweiser** | A4 hoch | Orientierungstafel mit mehreren Zielen und Pfeilen |
| **Empfang-Tafel** | A4 quer | Willkommenstafel mit den Infos des Tages |
| **Hausordnung** | A4 hoch | Das ganze Regelwerk als Aushang, nummeriert, mehrsprachig |
| **Frühstück-Türkarte** | A5 hoch | Zum Ankreuzen und an die Klinke hängen |
| **Vollmacht** | A4 hoch | Vertretung an der Versammlung — Vollmachtgeber, Bevollmächtigte, Unterschrift |
| **Protokoll** | A4 hoch | Sitzungs- und Versammlungsprotokoll: Kopf, je Traktandum ein Beschlussfeld |
| **Kündigungsbestätigung** | A4 hoch | Brief mit Briefkopf: Kündigung erhalten, Mietende und Übergabe |
| **Reservationsblatt** | A4 hoch | Waschküche, Gemeinschaftsraum, Grill — leere Tabelle zum Eintragen |
| **Besucher-Parkkarte** | A4 hoch | Sechs Karten für die Windschutzscheibe zum Ausschneiden |
| **Wichtige Mitteilung** | A4 hoch | Die eine Nachricht, gross, mit Datum und Frist — Ton wählbar, mehrsprachig |
| **Inventarliste** | A4 hoch | Was zur Wohnung gehört — nach Räumen, Anzahl und Zustand, zwei Unterschriften |
| **Türschild** | A5 quer | Einzelnes Raumschild: Büro, Sitzungszimmer, WC — Symbol und Wort |
| **Pinnwand-Karte** | A4 hoch | «Zu verschenken», «Gesucht» … vier Karten mit Abreiss-Fransen |

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

**So funktioniert die Serie:** beim Hinweis-Aushang lassen sich mehrere
Liegenschaften anhaken — dann wird aus einem Blatt eine Seite je Liegenschaft,
jede mit ihrem Kürzel, ihrer Adresse und wahlweise ihrem eigenen Absender
(A4 und B4 gehören zur Architektur, A14 zum Hotel, der Rest zur Immobilien AG).
«Alle anhaken» nimmt alle elf auf einmal. Die Reihenfolge folgt `js/objekte.js`,
nicht dem Anklicken. Für die Hauseingangstür oder eine angekündigte Kontrolle
ist das ein Klick statt elf Durchgängen.

**So funktioniert der Schneidebogen:** bei den Sicherheitszeichen lassen sich
statt einem Schild je Blatt auch **2 oder 4 Schilder auf ein A4** setzen. Die
gestrichelten Linien sind die Schnittkanten und werden mitgedruckt. Nicht
gefüllte Plätze bleiben leer — geschnitten wird trotzdem an der Linie. Das ist
nicht dasselbe wie «2 Seiten pro Blatt» im Druckertreiber: der verkleinert das
ganze Blatt samt Rändern, hier ist jedes Feld von Anfang an für seine Grösse
gesetzt.

**So funktioniert der Foto-Aushang:** Bild hochladen, Zeile schreiben,
drucken. Das Bild bleibt im Browser — es wird als Data-URI im Entwurf
gespeichert und geht an keinen Dienst. Vier Bildanteile von «klein» bis
«ganzes Blatt»; beim ganzen Blatt liegt der Text auf dem Bild, mit
einstellbarer Abdunklung darunter. **Schnittmarken und Beschnitt** sind nur
für den Fall gedacht, dass ein Aushang einmal in eine richtige Druckerei
geht — auf dem Bürodrucker bleiben beide aus, sonst stehen die Marken mit
auf dem Blatt.

**So funktioniert das Grossflächenplakat:** 2 × 2 Blätter ergeben rund A2,
3 × 3 rund A1. Jedes Blatt zeigt einen Ausschnitt; die Blätter überlappen
sich (Vorgabe 10 mm), damit sie sich sauber überkleben lassen. Die
gestrichelte Linie markiert, wo das nächste Blatt beginnt, und jedes Blatt
trägt seine Nummer samt Reihe und Spalte. Die **erste Seite ist eine
Bauanleitung**: das ganze Plakat verkleinert, mit numerierten Feldern —
ohne sie liegen nachher zwölf gleich aussehende Blätter auf dem Tisch. Ist
das grosse Wort zu lang für die Breite, wird die Schrifthöhe automatisch
eingepasst statt abgeschnitten; mehr Blätter nebeneinander schaffen wieder
Platz.

---

## Eigene Textbausteine

Die 42 mitgelieferten Bausteine sind die Wortlaute, die im Haus seit Jahren
hängen. Was neu dazukommt — ein Aushang zur Baustelle, eine Regelung für den
Sommer — soll niemand ins Repository schreiben müssen.

Im Hinweis-Aushang gibt es dafür das Kapitel **Eigene Bausteine**:

* **Aktuellen Text als eigenen Baustein sichern** nimmt Titel, alle sechs
  Sprachen, Ton und Symbol so, wie sie gerade eingestellt sind. Ist bereits
  ein eigener Baustein gewählt, wird er überschrieben — sonst entsteht ein
  neuer.
* Eigene stehen in der Auswahlliste **hinter** den mitgelieferten und sind
  dort als «Eigene Bausteine · …» erkennbar. Die **Suche findet sie
  ebenfalls**.
* **Sammlung sichern** legt alles in eine Datei; **Sammlung laden** holt sie
  bei den anderen wieder herein. Bausteine mit gleichem Kürzel werden
  ersetzt, die übrigen kommen dazu — jede Person behält also ihre eigenen.
* Mitgelieferte Bausteine lassen sich nicht löschen; sie liegen im Code.

Alles liegt im Browser der jeweiligen Person (`nsvz:eigene`). Es gibt keinen
Server, der die Sammlung verteilt — dafür ist die Datei da.

---

## Sprachen auf dem Aushang

Nicht zu verwechseln mit der Sprache der Bedienoberfläche (DE/EN oben rechts).
Hier geht es um die Sprachen, die auf dem **gedruckten Blatt** stehen.

Sechs Sprachen sind hinterlegt:

| | | |
|---|---|---|
| **DE** Deutsch | **EN** English | **FR** Français |
| **IT** Italiano | **PT** Português | **ES** Español |

Vollständig sechssprachig sind:

* die **42 Textbausteine** des Hinweis-Aushangs — Überschrift *und* Text
* die **16 Sicherheitszeichen**
* die **11 Abfallfraktionen** der Sammelstelle — Wort, «gehört hinein»
  und «gehört nicht hinein»
* die **Parkplatz-Info** (dort werden leere Sprachfelder einfach weggelassen)

Im Formular wird angehakt, was aufs Blatt soll. **Die Reihenfolge ist fest** —
DE, EN, FR, IT, PT, ES — und nicht die des Anklickens, damit zwei Aushänge
nebeneinander gleich aussehen. Die **erste** gewählte Sprache ist die
Hauptsprache: ihre Überschrift steht gross im Kopfbalken, die übrigen
erscheinen kleiner darunter, jede mit ihrem Kürzel.

Fertige Zusammenstellungen sparen das Anhaken:

| Zusammenstellung | Sprachen | Wofür |
|---|---|---|
| Nur Deutsch | DE | der Normalfall im Haus |
| Deutsch + Englisch | DE EN | Hotelgäste |
| Schweiz | DE FR IT | Amtssprachen |
| Gäste international | DE EN FR IT | Aushänge im Hotelbereich |
| Handwerk und Reinigung | DE PT ES | Baustelle, Reinigung, Unterhalt |
| Alle sechs | DE EN FR IT PT ES | wenn es niemand übersehen darf |

Sechs Sprachen passen auf eine A4-Seite — die Vorlage setzt ab vier Sprachen
automatisch enger, und der grüne Balken links sagt weiterhin, wenn es doch zu
lang wird.

### Woher die Übersetzungen stammen

Die **deutschen** Wortlaute sind unverändert die aus `J:\Immobilien\Plakate`.
Ebenfalls unverändert übernommen sind drei Fassungen, die dort schon vorlagen:
Französisch und Portugiesisch bei «Fahrzeug unberechtigt abgestellt» und
Französisch bei «Wäschehänge».

**Alle übrigen Fassungen sind hier neu erstellt.** Sie sind sorgfältig gemacht
und sinngetreu — aber es sind Übersetzungen. Wo ein Aushang Rechtsfolgen
androht (Kündigung, Anzeige, Kostenfolge), **gilt im Zweifel die deutsche
Fassung**. Bei diesen Texten lohnt sich ein Gegenlesen durch eine
muttersprachliche Person, bevor der Aushang jahrelang hängt.

---

## Kontrastprüfung

Bei den Schildern prüft der Editor still mit, ob Schrift und Grund weit genug
auseinanderliegen — nach der Kontrastformel der WCAG, Stufe AA: 3:1 für grosse
Schrift, 4.5:1 für den Rest. Gemeldet wird nur, was **darunter** liegt; solange
alles passt, bleibt die Zeile leer.

Zwei Dinge sind bewusst ausgenommen:

* **Schrift unter 14 pt.** Fusszeilen, Sprachkürzel und Massangaben sind als
  Nebeninformation in Grau gesetzt. Sie liessen sich im Editor gar nicht
  ändern — eine Dauerwarnung darüber wäre Rauschen.
* **Die Handschrift-Zeile** (Cyan auf Weiss, rund 2,5:1). Sie ist ein
  Zierelement der Marke und wiederholt, was direkt darunter gross und dunkel
  noch einmal steht. Wer sie ändern wollte, müsste die Markenfarbe ändern.

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

**42 Bausteine**, unter anderem: Rauchverbot (Haus und Hotel-Fassung mit
Kostenfolge), Betäubungsmittel, Videoüberwachung, Ruhezeit, Fenster
geschlossen halten, Schlüssel nicht stecken lassen, Abfall nur in Säcken, Nur
PET, sauberes Papier und Karton, Privatparkplatz, unberechtigt abgestelltes
Fahrzeug, Küche sauber hinterlassen, Kühlschrank, Backofen nur mit
Backpapier, kein Geschirr entfernen, Wäschehänge, Check-in, Check-out mit
Zimmerkarte, WLAN, Brandmelder und angekündigte Kontrollen.

Im Editor Baustein wählen, **Baustein übernehmen** drücken, fertig. Danach ist
jedes Feld frei überschreibbar. Drei Platzhalter werden beim Zeichnen ersetzt:
`{{adresse}}`, `{{objekt}}` und `{{datum}}`.

Jeder Baustein liegt vollständig in **sechs Sprachen** vor — Überschrift und
Text: DE, EN, FR, IT, PT, ES. Welche davon aufs Blatt kommen, wird im Formular
angehakt; siehe [Sprachen auf dem Aushang](#sprachen-auf-dem-aushang). Die
Originale waren uneinheitlich mehrsprachig (`Verbotene Substanzen.docx` DE/IT/EN,
`Hinweis Parkverbot Kerzers.docx` DE/FR/PT, `Wäschehänge.docx` DE/EN/FR) — die
Lücken sind jetzt geschlossen, die vorhandenen Fassungen unverändert.

**Nicht übernommen wurden zwei WLAN-Passwörter**, die in
`Videoüberwachung.docx` und `Wifi.docx` im Klartext stehen. Das Repository ist
öffentlich; solche Angaben gehören nicht hinein. Die Netznamen sind drin, das
Passwort ist überall ein Platzhalter — wer es braucht, trägt es im Editor ein,
und es bleibt im Browser der jeweiligen Person.

---

## QR-Codes

`js/lib/qr.js` erzeugt QR-Codes **im Browser**, beim Zeichnen des Blattes.
Eigener Code, keine fremde Bibliothek. Byte-Modus, Versionen 1 bis 12, alle
vier Fehlerkorrekturstufen — bis rund 460 Zeichen. Wird es mehr, kommt eine
klare Meldung statt eines stillen Fehldrucks.

Drei Entscheide dahinter:

* **Kein QR-Dienst im Internet.** Beim WLAN-Aushang ist das keine
  Kleinigkeit: das Passwort bliebe sonst bei einem fremden Server liegen.
  Hier verlässt es den eigenen Browser nicht.
* **Nichts nachladen.** `standalone.html` wird per Doppelklick geöffnet, und
  eine Datei mit `file://`-Adresse darf keine Nachbardateien holen. Gerechnet
  wird deshalb zur Laufzeit.
* **Keine erzeugten Dateien mehr.** Früher lag der Code als Datei daneben und
  musste von Hand nachgeführt werden, wenn sich die Adresse änderte. Jetzt
  entsteht er aus genau dem Feld, das im Formular steht — auseinanderlaufen
  können die beiden nicht mehr.

Fertige Inhalte gibt es für WLAN (`WIFI:…`, Sonderzeichen maskiert),
Telefon (`tel:`), E-Mail (`mailto:`) und Adresse für die Karten-App (`geo:`).

### Wie das geprüft wird

Ein QR-Code, der falsch aussieht, fällt niemandem auf — er fällt erst auf,
wenn hundert Gäste ihn nicht scannen können. Deshalb doppelt:

* **`tests/qr.mjs`** (Teil von `npm test`, reines Node) enthält einen
  eigenständig geschriebenen **Leser**: er nimmt die fertige Matrix, holt die
  Formatangabe heraus, entfernt die Maske, liest im Zickzack und setzt die
  Nutzdaten zusammen. Kommt der Ausgangstext zurück, stimmt die ganze Kette.
  Geprüft werden zehn Texte in vier Stufen und zusätzlich **alle 48
  Kombinationen** aus Version 1–12 und Stufe, jeweils randvoll — dort fällt
  eine falsche Zahl in den Blocktafeln der Norm am ehesten auf.
* **`tools/pruefe-qr.py`** (von Hand, braucht Python) rendert dieselben
  Matrizen als Bild und liest sie mit einem **echten Lesegerät** (OpenCV)
  wieder ein.

```bash
pip install opencv-python-headless segno numpy
python3 tools/pruefe-qr.py
```

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

### Schriften wählen

`#/s/schrift`. Für jede der drei Rollen — Titel, Fliesstext, Handschrift-Zeile
— stehen freie Familien zur Wahl, siebzehn insgesamt. Jede Karte zeigt die
Schrift in sich selbst, mit einer echten Zeile aus einem Aushang.

Zwei Regeln, die nicht verhandelbar sind:

1. **Die gekaufte Schrift steht immer an erster Stelle.** Gewählt wird der
   Ersatz, nicht die Marke. Sobald Gotham auf einem Rechner liegt, sieht
   dieser Rechner wieder Gotham — ganz gleich, was hier gewählt ist. Im CSS
   heisst das `"Gotham", "<Wahl>", system-ui, sans-serif`.
2. **Die Wahl gilt nur im eigenen Browser.** Sie steckt nicht im Teilen-Link
   und nicht im Entwurf. Derselbe Aushang kann auf einem anderen Rechner also
   anders aussehen — zum Weitergeben darum das PDF nehmen, nicht den Link.

| Rolle | Zur Wahl |
|---|---|
| Titel | Montserrat · Oswald · Archivo · Playfair Display · Bebas Neue · Atkinson Hyperlegible |
| Fliesstext | Montserrat · Archivo · Atkinson Hyperlegible · Source Sans 3 · Inter · Lora |
| Handschrift | Parisienne · Caveat · Marck Script · Bad Script · Sacramento · Cedarville Cursive · Petit Formal Script · Dancing Script |

Alle stehen unter der **SIL Open Font License 1.1** — Weitergabe und
Einbettung sind ausdrücklich erlaubt. Sie liegen im Projekt und werden **nie
nachgeladen**: die Zentrale muss als einzelne Datei ohne Netz laufen.

Nachgeführt wird der Bestand mit

```bash
npm run schriften        # tools/hole-schriften.mjs
```

Das Werkzeug holt die woff2-Dateien einmalig von Google Fonts, legt sie nach
`assets/fonts/` und schreibt `assets/fonts.css` neu. Wer eine Familie ergänzen
oder streichen will, ändert die Liste `KATALOG` in
`tools/hole-schriften.mjs` und lässt es erneut laufen; was nicht mehr im
Katalog steht, wird gelöscht.

Die meisten Familien kommen nur mit dem Subset **latin**. Die Aushänge
sprechen DE EN FR IT PT ES, und deren Sonderzeichen — ä ö ü ß é à ç ñ ã õ —
stecken alle darin. `latin-ext` bräuchte man erst für Polnisch oder
Tschechisch; es überall mitzunehmen würde die Einzeldatei ohne Gegenwert
verdoppeln. Die drei Marken-Ersatzschriften führen es trotzdem mit, weil sie
in jedem Aushang stehen.

#### Eine eigene Schriftdatei

Auf derselben Seite. Wer bei Google Fonts oder anderswo etwas findet, das
nicht in der Liste steht, lädt die Datei hoch — `.woff2`, `.woff`, `.ttf`
oder `.otf`, höchstens 1 MB. Sie landet im Browser-Speicher, wird beim Start
als `FontFace` angemeldet und steht danach in allen drei Rollen zur Wahl.
Sie wird **nie** irgendwohin hochgeladen und liegt nicht im Repository.

Damit ist auch der Weg offen für die gekauften Schriften auf einem einzelnen
Rechner, ohne `npm run fonts` — die Datei bleibt dann im Browser dieser einen
Person. Für alle im Haus ist der Weg unten der richtige.

---

## Liegenschaften

Die feste Liste in `js/objekte.js` bildet die Ordnerstruktur aus
`J:\Immobilien` ab — A4, A12, A14, B4, B7, B22, H8, I16, S17, Casa Reto.
Sie reicht nicht: es kommen Häuser dazu, und wer eines neu verwaltet, kann
nicht warten, bis jemand eine Datei ändert.

### Die aktive Liegenschaft

Im Kopf der Zentrale steht ein Umschalter — auf schmalen Geräten oben in der
Schublade. Er hält fest, an **welchem Haus gerade gearbeitet wird**, und das
gilt für alles:

* Eine Vorlage, die noch keinen Entwurf hat, **startet bei der aktiven
  Liegenschaft** — Adresse und Firma sind gesetzt, bevor man das erste Wort
  tippt.
* Wird der Umschalter betätigt, **während ein Editor offen ist**, stellt sich
  die offene Vorlage gleich mit um. Wer oben umschaltet, während ein Aushang
  vor ihm liegt, will genau das sehen.
* Eine Vorlage, an der schon gearbeitet wurde, wird **nicht** überfahren.
  Stattdessen sagt der Editor: «Diese Vorlage steht auf A14, aktiv ist B22» —
  mit einem Knopf daneben. Stillschweigend umstellen wäre schlimmer: dann
  änderte sich ein fertiger Aushang beim blossen Öffnen.

Die Firma kommt beim Wechseln mit, weil jede Liegenschaft weiss, unter
welcher sie läuft.

### Eigene anlegen

Auf der Seite `#/s/liegenschaften`. Kürzel, Name, Adresse, Firma — mehr
braucht es nicht. Das Kürzel ist Pflicht: daran wird die Liegenschaft im
Umschalter, auf dem Aushang und in einer Serie erkannt.

Ebenso lassen sich **eigene Firmen** anlegen, für den Fall, dass ein Haus
unter einer anderen Verwaltung läuft. Bleibt die Fusszeile leer, wird sie
aus Name, Adresse und Kontakt gebaut — lieber knapp als leer.

Eigene Einträge liegen im **Browser** (`nsvz:objekte`, `nsvz:absender`,
`nsvz:aktives-objekt`), nicht im Repository. Sie überleben das Schliessen,
aber nur auf diesem Gerät. Zum Weitergeben gibt es «Als Datei sichern» und
«Datei einlesen» — derselbe Weg wie bei den eigenen Textbausteinen.

Gelöschte Liegenschaften reissen nichts mit: ein Aushang, der noch auf ihr
stand, behält seinen Text und fällt auf «Ohne Objekt» zurück. Der Test
`tests/liegenschaften.mjs` prüft genau das.

---

## Piktogramme

`#/s/piktogramme`. Sechsundachtzig Strichzeichnungen, 24 × 24, immer in
`currentColor`, in acht Gruppen:

| Gruppe | Beispiele |
|---|---|
| Wegweiser und Orientierung | Pfeile, Tür, Treppe, Lift, Rollstuhl, Rezeption |
| Zimmer und Bad | Bett, Dusche, Badewanne, WC, Tresor, Bitte nicht stören |
| Haus und Technik | WLAN, Steckdose, Heizung, Klima, Videoüberwachung, Kalender |
| Essen und Trinken | Frühstück, Besteck, Bar, Wasser, Kühlschrank |
| Sicherheit und Notfall | Notausgang, Erste Hilfe, Feuerlöscher, Defibrillator, Sammelplatz |
| Abfall und Recycling | Kehricht, PET, Papier, Dose, Grünabfall |
| Draussen und Umgebung | Auto, Velo, Bus, Zug, Baum, Hund |
| Allgemein | Info, Haken, Kreuz, Person, Familie, Waschmaschine, Bügeln |

Sie stehen in jedem Auswahlfeld **«Symbol»** — im Hinweis-Aushang, in der
Gäste-Info, auf den Etiketten, in der Orientierungskarte und in der
Gästemappe. Das Feld ist nach denselben Gruppen geordnet; eine flache Liste
mit 89 Einträgen wäre nicht mehr zu überblicken.

**Nicht zu verwechseln mit den Sicherheitszeichen.** Die nach ISO 7010
genormten Zeichen stehen getrennt in `js/lib/sicherheitszeichen.js` und
gehören zur Vorlage «Sicherheitszeichen». Sie sind genormt und dürfen nicht
frei gezeichnet werden. Alles unter «Piktogramme» ist Hausgebrauch.

Ein neues Zeichen: Pfad in die passende Gruppe in `js/lib/icons.js`
eintragen, Namen in `LABEL` dazu. Auswahlfelder und Übersicht führen es
danach von selbst. `tests/schrift-piktogramme.mjs` prüft, dass keines leer
und keines doppelt gezeichnet ist.

---

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

#### Woran man sieht, welche Schrift läuft

Ein Aushang in Montserrat sieht ordentlich aus, ist aber nicht die Marke. Wer
ihn druckt und aufhängt, merkt es womöglich nie. Deshalb sagt die Zentrale es
von sich aus: läuft die Ersatzschrift, steht auf der Startseite ein Hinweis
mit den Namen der fehlenden Schriften. Sind die echten da, verschwindet er.

Geprüft wird durch **Messen**, nicht mit `document.fonts.check()` — das meldet
für eine unbekannte Familie in den meisten Browsern `true`, weil ohnehin auf
den nächsten Eintrag zurückgefallen wird. Verlässlich ist nur der Vergleich:
derselbe Text einmal mit «Gotham, monospace» und einmal mit «monospace»
ausgemessen. Gleiche Breite heisst: es gibt kein Gotham. Steht in
`js/lib/schrift.js`.

#### Warum die Schriften nicht einfach mitgeliefert werden

Das ist keine technische, sondern eine rechtliche Grenze. Gotham (Hoefler &
Co) und Caflisch Script Pro (Adobe) sind gekaufte Schriften; ihre Lizenzen
verbieten die Weitergabe. Dieses Repository ist **öffentlich**, und GitHub
Pages liefert alles aus, was darin liegt — die Schriftdateien gingen also an
jeden Besucher. Das wäre Weitergabe.

Damit bleiben drei ehrliche Wege:

1. **Lokal einrichten** (kostet nichts, geht heute). Die beiden Dateien nach
   `assets/fonts/`, `npm run fonts`, `npm run build`. Auf diesem Rechner und
   in der so gebauten `standalone.html` steht dann die echte Hausschrift.
   Diese eine Datei lässt sich intern weitergeben — ob das die Lizenz deckt,
   steht in der Lizenz und sollte einmal nachgelesen werden.
2. **Webfont-Lizenz kaufen.** Typography.com verkauft Gotham als Webfont;
   Adobe Fonts erlaubt Caflisch Script Pro im Web über die eigene
   Einbindung. Damit dürfte die öffentliche Seite die echte Schrift zeigen.
   Adobe Fonts lädt allerdings von einem fremden Server — das widerspricht
   dem Grundsatz «läuft offline», also nur für die Webseite, nicht für
   `standalone.html`.
3. **Beim Ersatz bleiben.** Montserrat kommt Gotham nahe genug, dass es im
   Alltag niemandem auffällt. Bei der Handschrift-Zeile ist der Abstand
   grösser — dort liesse sich eine andere freie Schrift wählen, wenn
   Parisienne nicht gefällt.

Stammdaten stehen zentral in `js/brand-config.js`; alle Vorlagen greifen darauf zu.
Die Adresse ist hinterlegt (Allmendstrasse 14, 3210 Kerzers), **Telefon, Mail und
Web sind absichtlich leer** — erfundene Kontaktdaten gehören nicht auf einen
Aushang. Sobald die echten Angaben dort eingetragen sind, erscheinen sie
automatisch in allen Fusszeilen.

---

## Aufbau der Oberfläche

Die Zentrale ist ein Werkzeug mit mehreren Seiten, nicht eine lange Seite.
Geteilt wird nach **Arbeitsbereichen** — nach dem, was jemand am Stück
erledigt, nicht nach der Art des Dokuments:

```
#/              Startseite — Stand, offene Entwürfe, die Arbeitsbereiche
#/b/<bereich>   ein Arbeitsbereich mit seinen Vorlagen
#/t/<vorlage>   der Editor
#/s/<seite>     Werkzeug: Anleitung · Eigene Textbausteine · Marke und Schrift
```

Auf jeder dieser Seiten steht dieselbe **Seitenleiste**. Sie beantwortet «wo
bin ich» und spart den Umweg über die Startseite: von jeder Vorlage direkt in
jeden anderen Bereich. Ab Tablet-Breite und im Editor schrumpft sie zur
Schiene aus Icons, auf dem Telefon wird sie zur Schublade.

### Die sieben Arbeitsbereiche

| Bereich | Was darin steckt |
|---|---|
| **Ankommen und Parkieren** | Orientierungskarte, Luftbild, Plan-Editor, Parkplatz-Info, Parkplatz-Schild, Rezeption-Pfeil, Aufkleberbogen, Wegweiser, Empfang-Tafel, Besucher-Parkkarte |
| **Zimmer und Gäste** | Self-Check-in, Gästemappe, Willkommenskarte, Zimmerschild, Türhänger, Tischaufsteller, Foto-Aushang, Gäste-Info, QR-Aushang, Feedback, Zattoo, Notruf, Gutschein, Speisekarte, Veranstaltungsplakat, WLAN-Kärtchen, Frühstück-Türkarte |
| **Hausordnung** | Hinweis / Aushang, Mieterbrief, Termin-Aushang, Umbau/Baustelle, Kontakt-Tafel, Fundgegenstände, Paketablage, Hausversammlung, Umzugsanzeige, Ruhezeiten, Hausordnung, Wichtige Mitteilung, Pinnwand-Karte |
| **Sicherheit** | Sicherheitszeichen, Grossflächenplakat, Notfallblatt, Standort-Schild |
| **Unterhalt und Ordnung** | Waschplan, Sammelstelle, Etikettenbogen, Zeiten-Tafel, Preisliste, Klingelschilder, Ausser Betrieb, Turnusplan, Reservationsblatt, Türschild |
| **Verwaltung und Übergabe** | Übergabeprotokoll, Schlüsselquittung, Zählerstände, Mängelmeldung, Wohnung zu vermieten, Besichtigung, Neu im Haus, Vollmacht, Protokoll, Kündigungsbestätigung, Inventarliste |
| **Team und Werkzeug** | Kurzanleitung — dazu die sechs Werkzeugseiten |

Die Einteilung steht in `js/bereiche.js`. **Eine Vorlage gehört in genau einen
Bereich**; steht sie in zweien, sucht man wieder überall. Der Test
`tests/navigation.mjs` schlägt fehl, wenn eine Vorlage keinem Bereich
zugeteilt ist.

Alte Adressen der Form `#/k/<kapitel>` — sie stecken in verschickten Links —
leiten automatisch auf den passenden Bereich um.

### Warum überhaupt teilen?

Sechsundsechzig Vorlagen auf einer Seite sind eine Wand. Wer den Waschplan
sucht, will nicht an Sicherheitszeichen und Etikettenbogen vorbeiscrollen.
Dieselbe Überlegung im Editor: das Formular ist in aufklappbare Kapitel
geteilt, statt in einer Kolonne von vierzig Feldern zu enden. Die Suche ist
die Abkürzung für alle, die schon wissen, was sie wollen.

### Die Startseite

Sie sagt zuerst, wie gross die Zentrale ist (Vorlagen, Bereiche, Sprachen,
Textbausteine), dann **woran zuletzt gearbeitet wurde** — jede Vorlage mit
gespeichertem Entwurf steht unter «Weiterarbeiten». Das ist fast immer der
Grund, warum jemand die Seite überhaupt öffnet. Erst danach kommen die
Bereiche.

Wer eine Vorlage oft braucht, heftet sie mit dem **Stern** auf der Karte an;
angeheftete stehen auf der Startseite zuoberst unter «Angeheftet». Der Stern
speichert nur das Kürzel, im Browser der jeweiligen Person.

Unter **Anleitung → «Sichern und übertragen»** lässt sich der ganze Stand des
Browsers — Entwürfe, Favoriten, eigene Textbausteine, Liegenschaften und die
Schriftwahl — in eine Datei sichern und auf einem anderen Rechner wieder
laden. So ist die Zentrale einmal eingerichtet und überall gleich.

### Die sechs Werkzeugseiten

* **Anleitung** (`#/s/hilfe`) — der Ablauf in drei Schritten, die Einstellungen
  im Druckdialog, die Tastaturkürzel, der Weg ohne Internet.
* **Eigene Textbausteine** (`#/s/eigene`) — die Sätze des Hauses ansehen,
  löschen, als Datei sichern und einlesen. Vorher steckte das im Editor des
  Hinweis-Aushangs: man musste einen Aushang öffnen, um einen Satz zu löschen,
  der mit diesem Aushang nichts zu tun hatte.
* **Liegenschaften** (`#/s/liegenschaften`) — siehe unten.
* **Schriften wählen** (`#/s/schrift`) — siehe unten.
* **Piktogramme** (`#/s/piktogramme`) — alle 89 Zeichen des Hauses, nach Thema
  geordnet und durchsuchbar. Ein Klick kopiert den Namen.
* **Marke und Schrift** (`#/s/marke`) — welche Hausschrift wirklich läuft und
  welche gerade durch einen freien Ersatz vertreten wird, dazu die Farben mit
  ihren echten Token-Werten.

Wie die Oberfläche auszusehen hat, steht in **[DESIGN.md](DESIGN.md)** —
Farben, Schriftgrössen, Bauteile und die Regeln zur Bedienbarkeit.

Der Suchbestand steht in `js/lib/suche.js` und wird aus den vorhandenen Daten
gebaut — Vorlagen, Textbausteine, Sicherheitszeichen, Abfallfraktionen. Es
gibt keine zweite Liste, die man nachführen müsste: eine neue Vorlage ist
automatisch auffindbar.

---

## Aufbau

```
index.html                 Rahmen: Kopfzeile, Seitenleiste, Inhalt
DESIGN.md                  wie die Oberfläche auszusehen hat
standalone.html            alles in einer Datei (offline, per Doppelklick)
manifest.webmanifest, sw.js  installierbar und offline-fähig
assets/
  brand-tokens.css         Farben, Schriftfamilien, Eyebrow-Regel
  brand-fonts.css          echte Markenschriften (erzeugt)
  fonts.css, fonts/        lokaler Fallback (Montserrat, Dancing Script)
  app.css                  Oberfläche — alle Klassen mit .vz- vorangestellt
  templates.css            Vorlagen-Styles, je unter .t-<id> gekapselt
js/
  app.js                   Router, Rahmen, Seiten, Formular-Erzeugung, Vorschau
  bereiche.js              die sieben Arbeitsbereiche und die Werkzeugseiten
  objekte.js               Liegenschaften und Firmen, fest und selbst angelegt
  lib/icons.js             89 Piktogramme in acht Gruppen
  lib/schriftwahl.js       die waehlbaren Schriften und die getroffene Wahl
  brand-config.js          Stammdaten und Pfade zu den Marken-Assets
  lib/                     dom · icons · brand · sitemap · export · storage · i18n · thumbs
  templates/               eine Datei pro Vorlage + index.js (Registrierung)
tools/                     standalone-Bau, Schriften holen, Marken-Assets eintragen
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
* **`tests/eigene.mjs`** — eigene Bausteine anlegen, wiederfinden,
  überschreiben, löschen, als Datei sichern und laden; kaputter
  Speicherinhalt wirft die App nicht um
* **`tests/navigation.mjs`** — Startseite, jede Kapitelseite, die Suche
  (quer durch alle Arten und Sprachen, Sprung mit übernommenem Baustein),
  Kapitel im Editor, Massstab, Seitenzähler, Tastatur und Verlauf
* **`tests/serie.mjs`** — Serie über mehrere Liegenschaften (Seitenzahl,
  Reihenfolge, Absender je Objekt, unbekannte Kürzel) und Schneidebogen
  (Felder je Bogen, leere Plätze, Schnittkanten, Papierformat im Ausdruck)
* **`tests/qr.mjs`** — ein eigenständiger Leser liest jede erzeugte Matrix
  wieder ein; alle 48 Kombinationen aus Version und Fehlerkorrekturstufe
  randvoll; Grenzfälle (leer, zu lang, unbekannte Stufe); der QR-Aushang im
  Browser
* **`tests/sprachen.mjs`** — kein Loch im sechssprachigen Bestand
  (Bausteine, Sicherheitszeichen, Abfallfraktionen), feste Reihenfolge,
  Kästchen und fertige Zusammenstellungen, dazu die Kontrastprüfung
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

* La app está terminada y probada: **21 plantillas**, más de 250 comprobaciones
  automáticas.
* **La herramienta está dividida en páginas por áreas de trabajo**, no por tipo
  de documento. A la izquierda hay una barra fija con siete áreas — Ankommen,
  Zimmer, Hausordnung, Sicherheit, Unterhalt, Verwaltung, Team — y seis páginas de
  herramienta: Anleitung, Eigene Textbausteine, Marke und Schrift. La página de
  inicio dice cuántas plantillas hay y, sobre todo, **en qué estabas
  trabajando**. En el editor la barra se encoge a una franja de iconos para que
  la vista previa mande. En el móvil se convierte en un cajón.
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
* **Puedes elegir la propiedad arriba en la cabecera** y crear las tuyas en
  `#/s/liegenschaften`: código, nombre, dirección y empresa. Se guardan en el
  navegador y aparecen al instante en todas las plantillas. La plantilla que
  abras sin borrador empieza ya con esa propiedad; si una plantilla vieja está
  en otra, el editor te avisa y te deja cambiarla con un clic — nunca te la
  cambia solo. Para pasárselas al resto del equipo: «Als Datei sichern» y
  mandar el archivo.
* **Puedes elegir la tipografía dentro de la herramienta** (`#/s/schrift`):
  diecisiete familias libres para los tres papeles — título, texto y la línea
  manuscrita — con vista previa sobre un cartel real. La comprada siempre va
  primero: si algún día instalas Gotham, ese ordenador vuelve a Gotham solo.
  También puedes **subir tu propio archivo** de fuente (.woff2/.ttf/.otf) si
  encuentras algo en Google Fonts que no esté en la lista; se queda en tu
  navegador y no se sube a ninguna parte.
* **Hay 89 pictogramas** (`#/s/piktogramme`), agrupados por tema y buscables.
  Salen en todos los desplegables «Symbol» de las plantillas. Ojo: las señales
  de seguridad ISO 7010 son otra cosa y viven en su propia plantilla.
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
* **Seis idiomas en los carteles**: DE, EN, FR, IT, PT, ES. Están completos los
  42 bloques de texto, las 16 señales de seguridad y las 11 fracciones de
  residuos. En el formulario se marca con casillas qué idiomas se imprimen; el
  orden es fijo para que dos carteles se parezcan. Hay combinaciones hechas
  (solo alemán · DE+EN · Suiza DE/FR/IT · internacional DE/EN/FR/IT · obra y
  limpieza DE/PT/ES · los seis).
  **Los textos en alemán son los originales de la empresa.** Las traducciones
  al FR y PT de dos carteles también venían del Drive. **El resto las hice
  yo**: son fieles, pero son traducciones. Donde el cartel amenaza con
  consecuencias legales (rescisión, denuncia, coste), manda la versión
  alemana — y conviene que alguien nativo lea el texto antes de colgarlo
  durante años. El español lo puedes revisar tú mismo.
