# DESIGN.md — N's Hotel · Vorlagen-Zentrale

Dieses Dokument beschreibt, **wie die Zentrale aussehen und sich anfühlen
soll**. Es ist die Ergänzung zur README, die beschreibt, wie sie gebaut ist.

Wer hier etwas dazubaut — Mensch oder Maschine — liest zuerst diese Datei.
Sie ist bewusst kurz genug, um ganz gelesen zu werden.

---

## Zwei getrennte Welten

Das Wichtigste zuerst, weil hier die meisten Fehler passieren:

| | Die Oberfläche | Das Blatt |
|---|---|---|
| Was | Die Zentrale selbst: Seitenleiste, Formulare, Knöpfe | Der Aushang, der aus dem Drucker kommt |
| Klassen | `.vz-*` | `.t-<vorlage>-*` |
| Regeln | Dieses Dokument | Das Markenhandbuch, unveränderlich |
| Darf sich ändern | ja | nur mit Rücksprache |

Die Marken-Tokens in `assets/brand-tokens.css` stammen **verbatim aus
`parking.css` der Hans Amonn AG**. Sie werden gelesen, nie überschrieben.
Die Oberfläche bedient sich derselben Tokens, damit das Werkzeug nach
demselben Haus aussieht wie sein Erzeugnis — aber sie definiert keine neuen
Markenfarben.

---

## Farben

Alles kommt aus `assets/brand-tokens.css`. Keine Hex-Werte im Anwendungs-CSS,
mit einer Ausnahme: der Aushang-Ausschnitt auf der Marke-Seite, der bewusst
zeigt, was auf weissem Papier passiert.

| Token | Wofür in der Oberfläche |
|---|---|
| `--navy` `#2A3350` | Kopfzeile, Titel, aktive Navigationszeile |
| `--cyan` `#01B1E2` | Der einzige Akzent: Fokus, Hover, Zähler, Links |
| `--ink-soft` | Nebentexte, Beschreibungen |
| `--muted` | Etikettenschrift, Zähler ohne Betonung |
| `--line` / `--line-2` | Haarlinien, Kartenränder |
| `--bg-2` `#F6F7FA` | Ruhige Flächen in Karten |
| `--canvas` `#EEF0F4` | Der Grund, auf dem die Karten liegen |
| `--green` / `--red` | **Nur Zustand**, nie Dekoration: passt / passt nicht |

Ein Akzent, an einer Stelle. Wenn eine Seite bunt wirkt, ist etwas falsch
eingefärbt, nicht zu wenig Farbe da.

---

## Schrift

| Rolle | Familie | Ersatz |
|---|---|---|
| Titel, Kartennamen, Zahlen | `--font-display` — Gotham | Montserrat |
| Fliesstext, Formulare | `--font-body` — Montserrat | System |
| Die Handschrift-Zeile (`.eyebrow`) | `--font-script` — Caflisch Script Pro | Parisienne |

Die beiden gekauften Schriften **dürfen nicht im Repository liegen** (siehe
README, «Dieses Repository ist öffentlich»). Läuft ein Ersatz, sagt die
Zentrale das selbst — auf der Startseite und auf `#/s/marke`. Ein Aushang in
der falschen Schrift sieht nicht kaputt aus, sondern nach einem anderen Haus;
darum muss es sichtbar sein.

**Welcher Ersatz läuft, ist wählbar** (`#/s/schrift`, siebzehn freie
Familien, alle im Projekt). Zwei Regeln dabei: die gekaufte Schrift steht
immer an erster Stelle in der Familienliste — gewählt wird der Ersatz, nicht
die Marke; und die Wahl gilt nur im eigenen Browser, steckt also nicht im
Teilen-Link. Wer eine neue Familie aufnimmt, trägt sie in `KATALOG` in
`tools/hole-schriften.mjs` **und** in `FAMILIEN` in `js/lib/schriftwahl.js`
ein — sonst steht sie zur Wahl, ohne dass es sie gibt. Der Test
`tests/schrift-piktogramme.mjs` misst genau das.

Grössen in der Oberfläche: 33 px Seitentitel · 15 px Kartentitel ·
13–14.5 px Fliesstext · 12 px Nebentext · 10–11 px Etiketten in Versalien
mit `letter-spacing:.07em`. Zahlenkolonnen bekommen
`font-variant-numeric: tabular-nums`.

---

## Aufbau

```
┌──────────────────────────────────────────────┐
│ Kopfzeile: Marke · Suche · Datum · Sprache   │  62 px, navy, klebt oben
├──────────┬───────────────────────────────────┤
│ Seiten-  │                                   │
│ leiste   │  Inhalt                           │
│ 232 px   │                                   │
└──────────┴───────────────────────────────────┘
```

Die Seitenleiste steht auf **jeder** Seite, auch im Editor. Sie beantwortet
«wo bin ich» und spart den Umweg über die Startseite.

Drei Breiten:

* **ab 1181 px** — volle Seitenleiste mit Namen und Zählern.
* **901–1180 px** und **immer im Editor** — Schiene aus Icons, 64 px.
  Im Editor ist die Vorschau das Wichtigste auf dem Schirm.
* **bis 900 px** — Schublade von links, mit Schleier dahinter.

---

## Gliederung: Arbeitsbereiche, nicht Dokumentarten

Die Zentrale ist nach **Arbeitsbereichen** geteilt — nach dem, was jemand am
Stück erledigt. Nicht nach Papierformat und nicht nach Dokumentart.

```
#/            Startseite   Stand, offene Entwürfe, die Bereiche
#/b/<id>      Arbeitsbereich mit seinen Vorlagen
#/t/<id>      Editor
#/s/<id>      Werkzeug: Anleitung, eigene Bausteine, Marke
```

Die Bereiche stehen in `js/bereiche.js`. **Eine Vorlage gehört in genau einen
Bereich** — steht sie in zweien, sucht man wieder überall.

Eine neue Vorlage wird in `js/templates/index.js` registriert **und** in
`js/bereiche.js` einem Bereich zugeteilt. Der Test `tests/navigation.mjs`
schlägt fehl, wenn eine Vorlage keinem Bereich zugeteilt ist.

---

## Die aktive Liegenschaft

Der Umschalter im Kopf ist Kontext, keine Einstellung: er sagt, an welchem
Haus gerade gearbeitet wird, und faerbt jede Vorlage ein, die man oeffnet.
Drei Regeln, damit er nicht gefaehrlich wird:

1. **Ohne Entwurf** startet eine Vorlage bei der aktiven Liegenschaft.
2. **Mit offenem Editor** stellt der Umschalter die Vorlage gleich mit um —
   sichtbar, im selben Moment.
3. **Ein vorhandener Entwurf** wird nie ueberfahren. Laeuft er auf einer
   anderen Liegenschaft, sagt der Editor das und bietet einen Knopf an.

Regel 3 ist die wichtige. Ein Aushang, der beim blossen Oeffnen seine Adresse
wechselt, ist schlimmer als einer, der die alte behaelt.

## Piktogramme

Sechsundachtzig Strichzeichnungen in `js/lib/icons.js`, acht Gruppen,
Übersicht unter `#/s/piktogramme`. Regeln:

* 24 × 24, `fill="none"`, `stroke="currentColor"`, Strichstärke 1.8,
  runde Enden. Keine Flächen, keine zweite Farbe.
* Lesbar aus fünf Metern, nicht hübsch aus fünfzig Zentimetern. Wenn ein
  Zeichen bei 44 px nicht auf Anhieb erkannt wird, ist es falsch gezeichnet —
  ein Kreis auf einem Stiel ist ein Ballon, keine Baumkrone.
* Kein Zeichen zweimal denselben Pfad. Zwei Namen auf ein Bild ist immer ein
  Versehen beim Kopieren; der Test bricht darauf ab.
* Die **ISO-7010-Sicherheitszeichen** gehören nicht hierher. Die sind genormt
  und stehen in `js/lib/sicherheitszeichen.js`.

## Bauteile

| Klasse | Wofür |
|---|---|
| `.vz-zahl` | Zahlenkachel der Startseite — grosse Zahl, Etikett in Versalien |
| `.vz-weiter-zeile` | Offener Entwurf: Punkt, Name, Bereich, Pfeil |
| `.vz-kachel` | Arbeitsbereich: Icon rechts oben, Titel, Satz, Zähler |
| `.vz-card` | Vorlage: Vorschaubild, Etikett, Titel, Untertitel |
| `.vz-werkzeug` | Werkzeugseite als Karte |
| `.vz-kap` | Aufklappbares Kapitel im Formular |
| `.vz-leer` | Leerer Zustand — erklärt, was zu tun ist, nie nur «keine Daten» |

Karten heben sich beim Überfahren um 2 px und wechseln den Rand auf Cyan.
Mehr Bewegung gibt es nicht; `prefers-reduced-motion` schaltet auch das ab.

---

## Bedienbarkeit

Nach den Web Interface Guidelines. Diese fünf sind Pflicht:

1. **Alles per Tastatur.** `/` in die Suche, `Esc` heraus, `Tab` durch alles.
   Ein Sprunglink `.vz-skip` führt an den Inhalt.
2. **Fokus immer sichtbar.** `:focus-visible` mit 2 px Cyan und 2 px Abstand;
   in der navy Kopfzeile weiss. Nie `outline:none` ohne Ersatz.
3. **Trefferflächen** mindestens 24 px, bei `pointer:coarse` 44 px.
4. **Eingabefelder ab 16 px** unter 640 px Breite — sonst zoomt iOS Safari
   beim Antippen von allein hinein.
5. **Zoom und Einfügen nie sperren.** Keine `user-scalable=no`, kein
   abgefangenes `paste`.

---

## Sprache

Die Oberfläche spricht **Deutsch** (Schweizer Rechtschreibung: *ss* statt *ß*,
*Grösse*, *Strasse*). Englisch ist umschaltbar. Die Aushänge selbst können
sechs Sprachen: DE EN FR IT PT ES.

Beschriftungen sagen, was passiert, nicht wie es gebaut ist: «Drucken / PDF»,
nicht «Export». Fehlermeldungen sagen, was schiefging **und was zu tun ist**.
Kein «Ups», keine Entschuldigungen.

Codekommentare sind Deutsch und erklären **warum**, nicht was.

---

## Was hier nicht hingehört

* Keine Bibliothek von aussen, kein CDN. Die Zentrale läuft als einzelne
  Datei per Doppelklick — alles, was nachgeladen wird, bricht das.
* Keine zweite Akzentfarbe.
* Keine Icons als Emoji.
* Keine Schatten grösser als `0 12px 28px rgba(42,51,80,.13)`.
* Kein Text, der behauptet, etwas sei fertig, wenn es das nicht ist.
