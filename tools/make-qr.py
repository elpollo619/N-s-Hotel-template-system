#!/usr/bin/env python3
"""Erzeugt den QR-Code der Vorlagen-Zentrale.

    pip install segno
    python3 tools/make-qr.py

Geschrieben werden zwei Dateien:

  assets/brand/qr-vorlagen.svg   zum Weiterverwenden in anderen Programmen
  js/lib/qr-vorlagen.js          als ES-Modul, das die Vorlage "Kurzanleitung"
                                 einbettet

Warum zusätzlich ein Modul? Weil standalone.html per Doppelklick geöffnet wird
und eine Datei mit `file://`-Adresse keine Nachbardateien nachladen darf. Ein
`fetch` auf das SVG bliebe dort leer. Als Modul wandert der Code beim Bauen
mit in die Einzeldatei.

Es wird kein QR-Dienst im Internet angefragt — die Adresse verlässt den
eigenen Rechner nicht.

Wer die Adresse ändert: URL unten anpassen und das Skript neu aufrufen.
"""
import io
import pathlib
import sys

try:
    import segno
except ImportError:
    sys.exit('Fehlt: pip install segno')

URL = 'https://elpollo619.github.io/N-s-Hotel-template-system/'

ROOT = pathlib.Path(__file__).resolve().parent.parent
SVG_DATEI = ROOT / 'assets' / 'brand' / 'qr-vorlagen.svg'
JS_DATEI = ROOT / 'js' / 'lib' / 'qr-vorlagen.js'

# Fehlerkorrektur M vertraegt rund 15 % Verschmutzung — genug fuer einen
# Aushang, ohne das Muster unnoetig fein zu machen.
qr = segno.make(URL, error='m')

buf = io.BytesIO()
qr.save(buf, kind='svg', xmldecl=False, svgns=True, omitsize=True,
        dark='#2A3350', light=None, border=0)
svg = buf.getvalue().decode('utf-8').strip()

if '`' in svg or '\\' in svg:
    sys.exit('Unerwartetes Zeichen im SVG — das Template-Literal waere kaputt.')

SVG_DATEI.parent.mkdir(parents=True, exist_ok=True)
SVG_DATEI.write_text(svg + '\n', encoding='utf-8')

JS_DATEI.parent.mkdir(parents=True, exist_ok=True)
JS_DATEI.write_text(
    '/* Erzeugt von tools/make-qr.py — nicht von Hand aendern.\n'
    f'   Inhalt: {URL} */\n'
    f'export const QR_VORLAGEN = `{svg}`;\n',
    encoding='utf-8')

kante = qr.symbol_size(border=0)[0]
print(f'assets/brand/qr-vorlagen.svg — Version {qr.version}, '
      f'{kante}x{kante} Module, {SVG_DATEI.stat().st_size} Bytes')
print(f'js/lib/qr-vorlagen.js        — {JS_DATEI.stat().st_size} Bytes')
print(f'Inhalt: {URL}')
