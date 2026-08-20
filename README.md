# N's Hotel · Vorlagen-Zentrale

Ein Web-Portal, mit dem das ganze Team von **N's Hotel** (Hans Amonn AG, Kerzers)
Aushänge, Aufkleber und Karten selber erstellt — immer in der gleichen Marke,
ohne Grafikprogramm. Texte anpassen, fertig drucken.

Kein Login, keine Datenbank, kein Server: die App läuft vollständig im Browser.

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
  der Aushänge ist immer zweisprachig DE/EN, teils zusätzlich FR/IT.

---

## Vorlagen

| Vorlage | Format | Wofür |
|---|---|---|
| **Notruf-Aushang (Telefon)** | A4 hoch | Tastenbelegung am Check-in-Telefon, mit Telefon-Zeichnung und Notrufnummern |
| **Pfeil-Aufkleber Rezeption** | A4 Druckvorlage | Wegweiser in Originalgrösse, dunkel / hell / cyan, vier Pfeilrichtungen |
| **Aufkleber-Druckbogen** | A4 hoch | Runde Aufkleber in Originalgrösse inkl. Massstab-Kontrolle |
| **Gäste-Info (universell)** | A4 hoch | WLAN, Frühstück, Öffnungszeiten … beliebig viele Infozeilen mit Symbol |
| **Parkplatz-Info** | A4 hoch | Lageplan plus Text in vier Sprachen |
| **Orientierungskarte** | A4 quer | Anfahrtswege und gezeichneter Plan nebeneinander |
| **Luftbild mit Pins** | A4 quer | Eigenes Luftbild hochladen, Pins frei platzieren |
| **TV-Anleitung (Zattoo)** | A4 hoch | Fernsehen im Zimmer, Schritt für Schritt |

Noch offen (Phase 3 des Briefings): interaktiver **Plan-Editor**,
**Gästemappe** und **Reels** (9 × 16).

---

## Marke

Farben und Schriften kommen unverändert aus `parking.css` beziehungsweise dem
Handbuch und stehen in `assets/brand-tokens.css`:

* Navy `#2A3350` · Cyan `#01B1E2` · Grün `#1F9D57` · Fussweg `#12A150`
* Gebäude `#B7D900` · Parkplatz aussen `#E5387E` · öffentliches Parking `#8E44EF`
* Notfall `#E23A2E` · Leinwand `#EEF0F4`
* Schriften: **Gotham** (Titel), **Montserrat** (Fliesstext),
  **Caflisch Script Pro** (handschriftliche Eyebrow-Zeile)

Schweizer Schreibweise ist eingebaut: aus einem getippten «ß» wird beim
Ausgeben automatisch «ss».

### Echte Schriften und Logos nachrüsten

Gotham und Caflisch Script Pro sind lizenzpflichtig und deshalb **nicht** im
Repository. Ausgeliefert wird der im Handbuch vorgesehene Fallback
(Montserrat und Dancing Script), lokal eingebunden — ohne CDN, damit die App
auch offline funktioniert.

```bash
# 1. Dateien ablegen
#    assets/fonts/Gotham-Bold.otf
#    assets/fonts/CaflischScriptPro-Regular.otf
#    assets/brand/logo.png · logo-white.png · favicon.png
#    assets/img/aerial-site.png · phone-yealink.jpg

# 2. eintragen lassen
npm run fonts     # schreibt assets/brand-fonts.css
npm run assets    # trägt die Bildpfade in js/brand-config.js ein

# 3. Einzeldatei neu bauen
npm run build
```

Solange die Dateien fehlen, zeichnet die App eine saubere Platzhalter-Wortmarke
— es entstehen **keine** Fehler in der Konsole.

Stammdaten (Adresse, Telefon, Web) stehen zentral in `js/brand-config.js`;
alle Vorlagen greifen darauf zu.

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
* **`tests/print.mjs`** — der Druck ergibt **genau eine** Seite im richtigen
  Papierformat, ohne Bedienleiste und ohne Formular
* **`tests/export.mjs`** — PNG-Export erzeugt eine echte Bilddatei
* **`tests/interaction.mjs`** — Live-Vorschau ohne Fokusverlust, wiederholbare
  Zeilen, Speicherung, Zurücksetzen, Sprachumschaltung
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
* **Las fuentes Gotham/Caflisch y los logos reales no estaban en este entorno**
  (viven en `H:\Meine Ablage\...`). Van como "drop-in": copia los ficheros a
  `assets/fonts/` y `assets/brand/`, ejecuta `npm run fonts` y `npm run assets`,
  y toda la app cambia sola. Mientras tanto usa el respaldo previsto en el
  manual (Montserrat + Dancing Script) y una marca dibujada en SVG.
* Igual pasa con el **SVG exacto del teléfono v6** y la **foto aérea**: el
  teléfono está redibujado en el mismo estilo, y el luftbild acepta la foto
  subiéndola desde el editor.
* Falta la **Fase 3** del brief (Plan-Editor interactivo, Gästemappe, Reels).
  Necesita los ficheros originales `mapeditor.js` y las plantillas HTML.
