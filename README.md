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
| **Notruf-Aushang (Telefon)** | A4 hoch | Tastenbelegung am Check-in-Telefon mit dem Original-Telefonschema aus v6 und den Notrufnummern |
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
* **Echte Zugangsdaten.** Das WLAN-Passwort in der Gäste-Info ist ein
  Platzhalter (`· · · · · · · ·`). Es wird im Editor eingetragen und bleibt im
  Browser der jeweiligen Person — es wandert nie ins Repository.

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
* Falta la **Fase 3** del brief (Plan-Editor interactivo, Gästemappe, Reels).
  Necesita los ficheros originales `mapeditor.js` y las plantillas HTML.
