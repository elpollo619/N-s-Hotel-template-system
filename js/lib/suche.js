/* ==========================================================================
   Suche
   --------------------------------------------------------------------------
   Achtzehn Vorlagen, 42 Textbausteine, 16 Sicherheitszeichen und elf
   Abfallfraktionen — das sind zu viele Dinge, um sie durch Scrollen zu
   finden. Die Suche geht quer durch alles und führt direkt dorthin, wo
   gearbeitet wird: ein Treffer auf einen Baustein öffnet den Hinweis-Aushang
   mit genau diesem Baustein, ein Treffer auf ein Zeichen die Sicherheits-
   vorlage mit genau diesem Zeichen.

   Gesucht wird über alle sechs Aushangsprachen. Wer «no smoking» eintippt,
   findet das Rauchverbot ebenso wie unter «Rauchen».

   Bewusst schlicht: Wortanfänge zählen mehr als Treffer mitten im Wort, und
   alle eingegebenen Wörter müssen vorkommen. Keine Fehlertoleranz — bei
   dieser Menge lohnt der Aufwand nicht, und ein falscher Treffer ist
   ärgerlicher als keiner.
   ========================================================================== */
import { TEMPLATES, ORDER } from '../templates/index.js';
import { bereichVon } from '../bereiche.js';
import { PRESETS, KATEGORIEN } from '../presets.js';
import { SZ_ZEICHEN } from './sicherheitszeichen.js';
import { FRAKTIONEN } from '../templates/sammelstelle.js';
import { SPRACH_IDS } from './sprachen.js';
import { eigeneBausteine } from './eigene.js';

/** Klein schreiben und Umlaute/Akzente abstreifen — «Grösse» findet «grosse». */
export function normal(s){
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Der Arbeitsbereich einer Vorlage fliesst in den Suchschluessel ein: wer
   «parkieren» tippt, findet auch das Parkplatz-Schild, dessen Titel das Wort
   gar nicht enthaelt. */

function eintrag(art, id, titel, unter, ziel, wert, extra){
  return { art, id, titel, unter, ziel, wert,
           schluessel:normal([titel, unter, extra].filter(Boolean).join(' ')) };
}

/** Der Suchbestand. Einmal gebaut, danach nur noch gefiltert. */
export const BESTAND = (() => {
  const aus = [];

  for (const id of ORDER){
    const tpl = TEMPLATES[id];
    if (!tpl) continue;
    const g = bereichVon(id);
    aus.push(eintrag('vorlage', id, tpl.title, tpl.sub || '', id, null,
      [tpl.badge, g && g.title, g && g.lede].filter(Boolean).join(' ')));
  }

  const katName = {};
  for (const k of KATEGORIEN) katName[k.id] = k.label;
  for (const p of PRESETS){
    if (p.id === 'frei') continue;
    const alleSprachen = SPRACH_IDS.map(s => `${p.titel[s]} ${p.text[s]}`).join(' ');
    aus.push(eintrag('baustein', p.id, p.titel.de, katName[p.cat] || '',
      'hinweis', p.id, `${p.label} ${alleSprachen}`));
  }

  for (const z of SZ_ZEICHEN){
    const art = { verbot:'Verbot', warnung:'Warnung', gebot:'Gebot',
                  rettung:'Rettung', brand:'Brandschutz' }[z.art];
    aus.push(eintrag('zeichen', z.id, z.text.de, `Sicherheitszeichen · ${art}`,
      'sicherheit', z.id, SPRACH_IDS.map(s => z.text[s]).join(' ')));
  }

  for (const f of FRAKTIONEN){
    aus.push(eintrag('abfall', f.id, f.wort.de, 'Sammelstelle beschriften',
      'sammelstelle', f.id,
      SPRACH_IDS.map(s => `${f.wort[s]} ${f.ja[s]}`).join(' ')));
  }

  return aus;
})();

/* Selbst angelegte Bausteine kommen und gehen waehrend der Arbeit — sie
   werden deshalb bei jeder Suche frisch dazugenommen, nicht einmal beim
   Laden eingebacken. Es sind wenige; das faellt nicht ins Gewicht. */
function eigeneEintraege(){
  return eigeneBausteine().map(p => eintrag('baustein', p.id, p.titel.de || p.label,
    'Eigener Baustein', 'hinweis', p.id,
    `${p.label} ` + SPRACH_IDS.map(s => `${p.titel[s]} ${p.text[s]}`).join(' ')));
}

/* Vorlagen zuerst, dann Bausteine, dann Zeichen, dann Abfall. */
const ART_RANG = { vorlage:0, baustein:1, zeichen:2, abfall:3 };

/**
 * Suchen. Alle eingegebenen Wörter müssen vorkommen.
 * @param {string} frage
 * @param {number} max
 */
export function suche(frage, max = 12){
  const woerter = normal(frage).split(' ').filter(Boolean);
  if (!woerter.length) return [];

  const treffer = [];
  for (const e of BESTAND.concat(eigeneEintraege())){
    let punkte = 0;
    let alle = true;
    for (const w of woerter){
      const pos = e.schluessel.indexOf(w);
      if (pos < 0){ alle = false; break; }
      /* Wortanfang zählt mehr als irgendwo mitten im Wort. */
      const amAnfang = pos === 0 || e.schluessel[pos - 1] === ' ';
      punkte += amAnfang ? 10 : 3;
      if (normal(e.titel).startsWith(w)) punkte += 8;
    }
    if (alle) treffer.push({ ...e, punkte });
  }

  treffer.sort((a, b) =>
    (b.punkte - a.punkte) ||
    (ART_RANG[a.art] - ART_RANG[b.art]) ||
    a.titel.localeCompare(b.titel, 'de'));
  return treffer.slice(0, max);
}

/** Die Adresse, die ein Treffer öffnet. */
export function trefferZiel(t){
  return t.wert ? `#/t/${t.ziel}?w=${encodeURIComponent(t.wert)}` : `#/t/${t.ziel}`;
}

export const ART_LABEL = {
  vorlage:'Vorlage', baustein:'Textbaustein',
  zeichen:'Sicherheitszeichen', abfall:'Abfallfraktion'
};
