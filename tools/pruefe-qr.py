#!/usr/bin/env python3
"""Prüft den eigenen QR-Erzeuger gegen ein echtes Lesegerät.

    pip install opencv-python-headless segno numpy
    python3 tools/pruefe-qr.py

Jede Matrix wird als Bild gerendert und mit OpenCV wieder eingelesen. Kommt
derselbe Text zurück, stimmt die ganze Kette: Kodierung, Reed-Solomon,
Verschränkung, Platzierung, Maske und Formatangabe.

Nicht geprüft wird Feld für Feld gegen segno. Zwei normgerechte Erzeuger
dürfen sich in der Füllung nach dem Abschlusszeichen und damit in der
gewählten Maske unterscheiden — verglichen wird deshalb, was herauskommt,
nicht wie es aussieht.

Geprüft werden alle Versionen 1 bis 12 in allen vier Stufen, jeweils mit
einem Text, der die Version gerade ausfüllt — dort fallen Fehler in den
Blocktafeln am ehesten auf.
"""
import json
import pathlib
import subprocess
import sys

try:
    import cv2
    import numpy as np
    import segno
except ImportError as e:
    sys.exit(f'Fehlt: {e.name} — pip install opencv-python-headless segno numpy')

WURZEL = pathlib.Path(__file__).resolve().parent.parent
MODUL = 8          # Pixel je Modul im Prüfbild
# Ruhezonen, mit denen geprüft wird. Mehrere, weil der Sucher von OpenCV bei
# einzelnen Symbolen ausgerechnet bei Ruhezone 4 danebengreift, dieselbe
# Matrix bei 2 oder 6 aber anstandslos liest. Das ist eine Eigenheit des
# Lesegeräts, kein Fehler im Code: gilt eine Matrix als gelesen, wenn
# irgendeine Ruhezone sie liefert, prüfen wir weiterhin den Inhalt.
RAENDER = (4, 6, 2)


def matrizen(faelle):
    """node aufrufen und die Matrizen als JSON zurückbekommen."""
    skript = '''
import { qrMatrix } from './js/lib/qr.js';
const faelle = JSON.parse(process.argv[1]);
const aus = faelle.map(f => {
  try {
    const m = qrMatrix(f.text, f.stufe);
    return { ok:true, feld:m.feld, n:m.n, version:m.version };
  } catch (err) {
    return { ok:false, fehler:String(err.message) };
  }
});
process.stdout.write(JSON.stringify(aus));
'''
    p = subprocess.run(
        ['node', '--input-type=module', '-e', skript, json.dumps(faelle)],
        cwd=WURZEL, capture_output=True, text=True)
    if p.returncode != 0:
        sys.exit('node meldet einen Fehler:\n' + p.stderr)
    return json.loads(p.stdout)


def bild(feld, n, rand):
    kante = (n + rand * 2) * MODUL
    bild = np.full((kante, kante), 255, dtype=np.uint8)
    for y in range(n):
        for x in range(n):
            if feld[y][x]:
                oy, ox = (y + rand) * MODUL, (x + rand) * MODUL
                bild[oy:oy + MODUL, ox:ox + MODUL] = 0
    return bild


def lies(leser, feld, n):
    """Mit mehreren Ruhezonen versuchen; der erste Treffer zählt."""
    zuletzt = ''
    for rand in RAENDER:
        gelesen, *_ = leser.detectAndDecode(bild(feld, n, rand))
        if gelesen:
            return gelesen
        zuletzt = gelesen
    return zuletzt


def segno_groesse(text, stufe):
    """Wie gross eine unabhängige Umsetzung dasselbe kodieren würde."""
    q = segno.make(text, error=stufe.lower(), micro=False, mode='byte',
                   boost_error=False)
    return len(q.matrix)


def main():
    # Je Version ein Text, der sie gerade ausfüllt, plus die echten Inhalte.
    faelle = []
    for version in range(1, 13):
        for stufe in 'LMQH':
            faelle.append({'text': None, 'stufe': stufe, 'version': version})

    # Kapazitäten aus dem Modul holen, damit die Texte exakt passen.
    kap_skript = '''
import { qrMatrix } from './js/lib/qr.js';
const aus = [];
for (let v = 1; v <= 12; v++){
  for (const s of ['L','M','Q','H']){
    let laenge = 0;
    for (let l = 1; l <= 600; l++){
      try { if (qrMatrix('a'.repeat(l), s).version <= v) laenge = l; else break; }
      catch (_) { break; }
    }
    aus.push({ version:v, stufe:s, laenge });
  }
}
process.stdout.write(JSON.stringify(aus));
'''
    p = subprocess.run(['node', '--input-type=module', '-e', kap_skript],
                       cwd=WURZEL, capture_output=True, text=True)
    if p.returncode != 0:
        sys.exit('node meldet einen Fehler:\n' + p.stderr)
    kapazitaeten = {(k['version'], k['stufe']): k['laenge'] for k in json.loads(p.stdout)}

    faelle = []
    for (version, stufe), laenge in sorted(kapazitaeten.items()):
        if not laenge:
            continue
        text = ('V%02d%s-' % (version, stufe)) + 'x' * max(0, laenge - 6)
        faelle.append({'text': text[:laenge], 'stufe': stufe,
                       'erwartet': version, 'was': f'Version {version} Stufe {stufe} randvoll'})

    echte = [
        ('https://elpollo619.github.io/N-s-Hotel-template-system/', 'M', 'Adresse der Zentrale'),
        ('WIFI:T:WPA;S:Gast;P:Sonne2026!;;', 'M', 'WLAN-Zugang'),
        ('WIFI:T:WPA;S:N\'s Hotel Gast;P:ab\;cd\\,ef\\:gh;;', 'Q', 'WLAN mit Sonderzeichen'),
        ('tel:+41319518554', 'H', 'Telefonnummer'),
        ('mailto:info@ns-hotel.ch?subject=Anfrage', 'M', 'E-Mail'),
        ('geo:0,0?q=Allmendstrasse%2014%2C%203210%20Kerzers', 'M', 'Adresse in der Karte'),
        ('Grüezi — Umlaute, Akzente: éàüöä ç ñ ß→ss', 'M', 'UTF-8'),
        ('a', 'H', 'ein einziges Zeichen'),
    ]
    for text, stufe, was in echte:
        faelle.append({'text': text, 'stufe': stufe, 'erwartet': None, 'was': was})

    ergebnisse = matrizen([{'text': f['text'], 'stufe': f['stufe']} for f in faelle])
    leser = cv2.QRCodeDetector()

    fehler = []
    for fall, erg in zip(faelle, ergebnisse):
        name = fall['was']
        if not erg['ok']:
            fehler.append(f'{name}: {erg["fehler"]}')
            print(f'✗ {name} — {erg["fehler"]}')
            continue

        if fall['erwartet'] and erg['version'] != fall['erwartet']:
            fehler.append(f'{name}: Version {erg["version"]} statt {fall["erwartet"]}')

        # 1. wieder einlesen
        gelesen = lies(leser, erg['feld'], erg['n'])
        if gelesen != fall['text']:
            fehler.append(f'{name}: gelesen «{gelesen[:40]}» statt «{fall["text"][:40]}»')
            print(f'✗ {name} — Lesegerät liefert anderen Text')
            continue

        # 2. gleiche Grösse wie eine unabhängige Umsetzung
        s_n = segno_groesse(fall['text'], fall['stufe'])
        if s_n != erg['n']:
            fehler.append(f'{name}: Grösse {erg["n"]} statt {s_n} (segno)')
            print(f'✗ {name} — Grösse weicht ab: {erg["n"]} statt {s_n}')
            continue

        print(f'✓ {name}  — Version {erg["version"]}, {erg["n"]}x{erg["n"]}, wieder eingelesen')

    # Zu langer Text muss eine klare Meldung geben, keinen Fehldruck.
    zu_lang = matrizen([{'text': 'x' * 900, 'stufe': 'H'}])[0]
    if zu_lang['ok']:
        fehler.append('Zu langer Text wird angenommen statt abgelehnt')
        print('✗ Zu langer Text wird angenommen')
    else:
        print(f'✓ Zu langer Text wird abgelehnt  — «{zu_lang["fehler"][:60]}…»')

    print()
    if fehler:
        print('Fehler:\n · ' + '\n · '.join(fehler))
        sys.exit(1)
    print(f'{len(faelle) + 1} Prüfungen: der QR-Erzeuger ist normgerecht.')


if __name__ == '__main__':
    main()
