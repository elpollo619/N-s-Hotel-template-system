/* Hinweis · A4 — die Arbeitsvorlage für die bestehenden Aushänge.
   Statt für jeden der rund dreissig Zettel aus J:\Immobilien\Plakate eine
   eigene Vorlage zu bauen, gibt es eine Vorlage und eine Liste fertiger
   Textbausteine. Baustein wählen, Objekt wählen, drucken.

   Der Kopfbalken färbt sich nach Ton: Info navy, Warnung cyan, Verbot rot.

   Serie: derselbe Aushang für mehrere Liegenschaften auf einmal. Jede
   bekommt eine eigene Seite mit ihrem Kürzel, ihrer Adresse und — wenn
   gewünscht — ihrem eigenen Absender. Aus einem Blatt werden elf, ohne
   elfmal dasselbe zu tippen.

   Sprachen: jeder Baustein liegt in sechs Sprachen vor (DE EN FR IT PT ES).
   Im Formular wird angehakt, welche davon aufs Blatt sollen — die Reihenfolge
   ist fest, damit zwei Aushänge nebeneinander gleich aussehen. Die erste
   gewählte Sprache ist die Hauptsprache: ihre Überschrift steht gross im
   Kopfbalken, die übrigen erscheinen klein über ihrem Absatz. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon, iconOptions } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { PRESETS, preset, presetOptions } from '../presets.js';
import { qrSvg } from '../lib/qr.js';
import { eigeneBausteine, bausteinSichern, bausteinLoeschen, istEigener,
         sammlungAlsDatei, sammlungLaden } from '../lib/eigene.js';
import { downloadBlob } from '../lib/export.js';
import { SPRACHEN, sprachOptions, sprachSetOptions, sprachSet,
         sprachObjekte, sprachListe } from '../lib/sprachen.js';
import { ABSENDER, objekt, objektAdresse, adresseFehlt, istHotel,
         objektOptions, absenderOptions, objektCheckOptions, objektListe } from '../objekte.js';

const TONE = {
  info:    { bg:'var(--navy)',  fg:'#fff' },
  warnung: { bg:'var(--cyan)',  fg:'#fff' },
  verbot:  { bg:'#C0271F',      fg:'#fff' }
};

/** Ein Baustein — mitgeliefert oder selbst angelegt. */
function baustein(id){
  if (istEigener(id)){
    const eigen = eigeneBausteine().find(p => p.id === id);
    if (eigen) return eigen;
  }
  return preset(id);
}

/** Auswahlliste: die mitgelieferten Bausteine, danach die eigenen. */
function bausteinOptions(){
  const eigen = eigeneBausteine();
  return presetOptions().concat(
    eigen.map(p => ({ v:p.id, t:`Eigene Bausteine · ${p.label}` })));
}

/** Die sechs Sprachfelder als Objekt einsammeln bzw. verteilen. */
function sprachFelder(d, feld){
  const o = {};
  for (const sp of SPRACHEN){
    const K = 'titel' + sp.id[0].toUpperCase() + sp.id[1];
    o[sp.id] = feld === 'titel' ? (d[K] || '') : (d[sp.id] || '');
  }
  return o;
}

/** Die Liegenschaften der Serie — leer, wenn keine Serie gewählt ist. */
function serieObjekte(d){
  return (d && d.serie === 'auswahl') ? objektListe(d.serieObjekte) : [];
}

/* Platzhalter, die der Baustein mitbringt: {{adresse}}, {{objekt}}, {{datum}} */
function fill(text, d){
  return String(text || '')
    .replace(/\{\{adresse\}\}/g, objektAdresse(d.objekt) || objekt(d.objekt).name)
    .replace(/\{\{objekt\}\}/g, objekt(d.objekt).name)
    .replace(/\{\{datum\}\}/g, d.datum || '');
}

export default {
  id:'hinweis',
  title:'Hinweis / Aushang',
  sub:'42 fertige Textbausteine in sechs Sprachen · A4',
  badge:'Hinweis',
  page:'a4',
  root:'t-hinweis',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'hausordnung',
  /* Erst mehrseitig, wenn wirklich mehr als eine Liegenschaft gewählt ist. */
  multipage(d){ return serieObjekte(d).length > 1; },
  thumb: thumb(`
    <rect x="0" y="0" width="210" height="60" fill="#2A3350"/>
    <rect x="18" y="20" width="120" height="12" rx="4" fill="#fff" opacity=".92"/>
    <rect x="18" y="38" width="70" height="7" rx="3.5" fill="#01B1E2"/>
    <circle cx="176" cy="30" r="15" fill="none" stroke="#fff" stroke-width="2.6" opacity=".8"/>
    <path d="M176 23v9M176 35.4h.01" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>
    <rect x="18" y="80" width="174" height="30" rx="6" fill="#F6F7FA"/>
    ${lines(26, 90, 150, 2)}
    ${lines(18, 128, 174, 4)}
    ${lines(18, 176, 120, 3, 9, '#E5E8ED')}
    <rect x="18" y="262" width="174" height="5" rx="2.5" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Baustein' },
    { k:'presetId', label:'Fertiger Text', type:'select', options:bausteinOptions,
      hint:'Wählt Titel und Text. Danach beliebig überschreibbar. Ganz unten stehen die selbst angelegten.' },
    { k:'apply', label:'Baustein übernehmen', type:'action',
      hint:'Überschreibt Titel und Texte mit dem gewählten Baustein.' },

    { t:'group', label:'Eigene Bausteine' },
    { t:'note', label:'Was hier steht, liegt im eigenen Browser. Mit «Sammlung sichern» wird daraus eine Datei, die die anderen mit «Sammlung laden» übernehmen können.' },
    { k:'eigenName', label:'Name des Bausteins', type:'text',
      hint:'Nur für die Auswahlliste — auf dem Aushang erscheint er nicht.' },
    { k:'eigenSichern', label:'Aktuellen Text als eigenen Baustein sichern', type:'action' },
    { k:'eigenLoeschen', label:'Gewählten eigenen Baustein löschen', type:'action' },
    { k:'eigenExport', label:'Sammlung sichern (Datei)', type:'action' },
    { k:'eigenImport', label:'Sammlung laden (Datei)', type:'action' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },
    { k:'zeigeAdresse', label:'Adresse im Kopf zeigen', type:'select',
      options:[{v:'ja',t:'ja'},{v:'nein',t:'nein'}] },

    { t:'group', label:'Serie über mehrere Liegenschaften' },
    { t:'note', label:'Aus einem Blatt werden mehrere — je Liegenschaft eine Seite mit ihrem Kürzel und ihrer Adresse.' },
    { k:'serie', label:'Serie drucken', type:'select', options:[
      { v:'nein', t:'nein — nur die Liegenschaft oben' },
      { v:'auswahl', t:'ja — die angehakten Liegenschaften' }
    ] },
    { k:'serieObjekte', label:'Liegenschaften', type:'checks', options:objektCheckOptions() },
    { k:'serieAlle', label:'Alle anhaken', type:'action' },
    { k:'serieAbsender', label:'Absender je Seite', type:'select', options:[
      { v:'objekt', t:'der zur Liegenschaft gehörende' },
      { v:'fest',   t:'für alle derselbe (oben gewählt)' }
    ] },

    { t:'group', label:'Kopf' },
    { k:'ton',   label:'Ton', type:'select',
      options:[{v:'info',t:'Info (navy)'},{v:'warnung',t:'Warnung (cyan)'},{v:'verbot',t:'Verbot (rot)'}] },
    { k:'icon',  label:'Symbol', type:'select', options:iconOptions() },
    { k:'title', label:'Titel im Kopfbalken', type:'text',
      hint:'Setzt sich beim Übernehmen aus der Hauptsprache. Frei überschreibbar.' },
    { k:'datum', label:'Datum (für {{datum}})', type:'text' },

    { t:'group', label:'Sprachen' },
    { t:'note', label:'Was hier angehakt ist, steht auf dem Blatt — in dieser Reihenfolge. Die erste Sprache ist die Hauptsprache und steht gross im Kopf.' },
    { k:'sprachen', label:'Sprachen auf dem Aushang', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },
    { k:'setzeSprachen', label:'Zusammenstellung übernehmen', type:'action' },
    { k:'sprachTags', label:'Sprachkürzel zeigen', type:'select',
      options:[{v:'ja',t:'ja — DE, FR, PT …'},{v:'nein',t:'nein'}],
      hint:'Hilft Lesenden, ihren Absatz sofort zu finden.' },

    { t:'group', label:'Deutsch' },
    { k:'titelDe', label:'Überschrift Deutsch', type:'text' },
    { k:'de', label:'Text Deutsch', type:'textarea', hint:'**fett** möglich' },
    { t:'group', label:'English' },
    { k:'titelEn', label:'Überschrift English', type:'text' },
    { k:'en', label:'Text English', type:'textarea' },
    { t:'group', label:'Français' },
    { k:'titelFr', label:'Überschrift Français', type:'text' },
    { k:'fr', label:'Text Français', type:'textarea' },
    { t:'group', label:'Italiano' },
    { k:'titelIt', label:'Überschrift Italiano', type:'text' },
    { k:'it', label:'Text Italiano', type:'textarea' },
    { t:'group', label:'Português' },
    { k:'titelPt', label:'Überschrift Português', type:'text' },
    { k:'pt', label:'Text Português', type:'textarea' },
    { t:'group', label:'Español' },
    { k:'titelEs', label:'Überschrift Español', type:'text' },
    { k:'es', label:'Text Español', type:'textarea' },

    { t:'group', label:'QR-Code (freiwillig)' },
    { t:'note', label:'Zum Beispiel beim Baustein «Zu vermieten»: die Adresse des Inserats. Leer lassen heisst kein Code.' },
    { k:'qrZiel',   label:'Adresse oder Text im Code', type:'text' },
    { k:'qrMass',   label:'Kantenlänge in mm', type:'number', min:15, max:60, step:1 },
    { k:'qrLegende',label:'Zeile unter dem Code', type:'text' },

    { t:'group', label:'Fusszeile' },
    { k:'gruss',  label:'Grussformel', type:'text' },
    { k:'footer', label:'Absenderzeile', type:'text',
      hint:'Leer lassen: nimmt automatisch die Zeile des gewählten Absenders.' }
  ],

  defaults:{
    presetId:'rauchverbot',
    eigenName:'',
    objekt:'-',
    absender:'immobilien',
    zeigeAdresse:'ja',
    serie:'nein',
    serieObjekte:[],
    serieAbsender:'objekt',
    ton:'verbot',
    icon:'smoke',
    title:'Rauchverbot im gesamten Gebäude',
    datum:'',
    sprachen:['de','en'],
    sprachSet:'',
    sprachTags:'ja',
    titelDe:'Rauchverbot im gesamten Gebäude',
    titelEn:'No smoking anywhere in the building',
    titelFr:'Interdiction de fumer dans tout le bâtiment',
    titelIt:'Divieto di fumare in tutto lʼedificio',
    titelPt:'Proibido fumar em todo o edifício',
    titelEs:'Prohibido fumar en todo el edificio',
    de:'Stellen wir fest, dass an der Brandmeldeanlage manipuliert worden ist, wird das Mietverhältnis per sofort wegen Gefährdung von Leib und Leben aufgelöst.',
    en:'If we find that the fire alarm system has been tampered with, the tenancy will be terminated with immediate effect for endangering life and limb.',
    fr:'Si nous constatons que le système de détection dʼincendie a été manipulé, le bail sera résilié avec effet immédiat pour mise en danger de la vie dʼautrui.',
    it:'Se accertiamo che lʼimpianto di rilevazione incendi è stato manomesso, il contratto di locazione verrà risolto con effetto immediato per messa in pericolo dellʼincolumità delle persone.',
    pt:'Se constatarmos que o sistema de deteção de incêndio foi manipulado, o contrato de arrendamento será rescindido de imediato por colocar vidas em perigo.',
    es:'Si comprobamos que se ha manipulado el sistema de detección de incendios, el contrato de arrendamiento se rescindirá de inmediato por poner en peligro la vida de las personas.',
    qrZiel:'',
    qrMass:26,
    qrLegende:'',
    gruss:'Die Verwaltung',
    footer:''
  },

  /* Aus der Suche: den gefundenen Baustein gleich übernehmen. */
  ausSuche(d, wert){
    const p = baustein(wert);
    return p.id === wert ? this.actions.apply({ ...d, presetId:wert }) : d;
  },

  /* Die beiden Knöpfe im Formular. */
  actions:{
    /* "Baustein übernehmen" — holt alle sechs Sprachen auf einmal.
       Der Kopftitel folgt der ersten gewählten Sprache; ist keine gewählt,
       ist es Deutsch. */
    apply(d){
      const p = baustein(d.presetId);
      const erste = sprachListe(d.sprachen)[0];
      const next = { ...d, ton:p.ton, icon:p.icon, title:p.titel[erste] || p.titel.de };
      for (const sp of SPRACHEN){
        next['titel' + sp.id[0].toUpperCase() + sp.id[1]] = p.titel[sp.id] || '';
        next[sp.id] = p.text[sp.id] || '';
      }
      return next;
    },

    /* Den aktuellen Stand als eigenen Baustein ablegen. Ist bereits ein
       eigener gewählt, wird er überschrieben — sonst entsteht ein neuer. */
    eigenSichern(d){
      const name = String(d.eigenName || '').trim() || d.title || 'Eigener Baustein';
      const id = bausteinSichern({
        name, ton:d.ton, icon:d.icon,
        /* Der Kopfbalken traegt die deutsche Ueberschrift — das Feld
           «Ueberschrift Deutsch» bleibt im Normalfall leer, weil es sie
           sonst doppelt gaebe. Also gilt der Kopftitel. */
        titel:{ ...sprachFelder(d, 'titel'), de:d.title || d.titelDe || '' },
        text:sprachFelder(d, 'text'),
        id:istEigener(d.presetId) ? d.presetId : null
      });
      return { ...d, presetId:id, eigenName:name };
    },

    eigenLoeschen(d){
      if (!istEigener(d.presetId)) return d;
      bausteinLoeschen(d.presetId);
      return { ...d, presetId:'frei', eigenName:'' };
    },

    eigenExport(d){
      const blob = new Blob([sammlungAlsDatei()], { type:'application/json' });
      downloadBlob(blob, 'ns-hotel-eigene-bausteine.json');
      return d;
    },

    eigenImport(d){
      const feld = document.createElement('input');
      feld.type = 'file';
      feld.accept = 'application/json';
      feld.onchange = () => {
        const datei = feld.files && feld.files[0];
        if (!datei) return;
        const leser = new FileReader();
        leser.onload = () => {
          try {
            const { dazu, ersetzt } = sammlungLaden(leser.result);
            alert(`${dazu} Baustein(e) dazugekommen, ${ersetzt} ersetzt.`);
            location.reload();
          } catch (err){
            alert('Diese Datei enthält keine Bausteine: ' + err.message);
          }
        };
        leser.readAsText(datei);
      };
      feld.click();
      return d;
    },

    /* "Alle anhaken" — spart elf Klicks. */
    serieAlle(d){
      return { ...d, serie:'auswahl',
               serieObjekte:objektCheckOptions().map(o => o.v) };
    },

    /* "Zusammenstellung übernehmen" — DE/FR/IT, DE/PT/ES und so weiter. */
    setzeSprachen(d){
      const ids = sprachSet(d.sprachSet);
      if (!ids) return d;
      const p = baustein(d.presetId);
      /* Kopftitel auf die neue Hauptsprache umstellen, sofern er noch der
         alten entspricht — von Hand Geschriebenes bleibt stehen. */
      const alt = sprachListe(d.sprachen)[0];
      const titelWarAuto = d.title === (p.titel[alt] || '');
      return { ...d, sprachen:ids,
               title: titelWarAuto ? (p.titel[ids[0]] || d.title) : d.title };
    }
  },

  render(d){
    const serie = serieObjekte(d);
    if (serie.length < 2) return blatt(d);

    /* Eine Seite je Liegenschaft. Kürzel, Adresse und — sofern gewünscht —
       der Absender werden je Seite gesetzt; alles andere bleibt gleich. */
    return serie.map(o => `<article data-page class="t-hinweis-page">${
      blatt({ ...d,
              objekt:o.id,
              absender:d.serieAbsender === 'fest' ? d.absender : o.absender })
    }</article>`).join('');
  }
};

/* --------------------------------------------------------------------------
   Ein einzelnes Blatt. Einseitig ist das der ganze Aushang; in der Serie
   wird es je Liegenschaft einmal erzeugt.
   -------------------------------------------------------------------------- */
function blatt(d){
  const t = TONE[d.ton] || TONE.info;
  const abs = ABSENDER[d.absender] || ABSENDER.immobilien;
  const obj = objekt(d.objekt);
  const adr = objektAdresse(d.objekt);

  const kopfAdresse = (d.zeigeAdresse !== 'nein' && obj.code)
    ? `<p class="t-hinweis-obj">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</p>` : '';

  const warnung = adresseFehlt(d.objekt)
    ? `<p class="t-hinweis-todo no-print">Für ${esc(obj.code)} ist noch keine Adresse hinterlegt —
       in <code>js/objekte.js</code> ergänzen. Auf dem Druck erscheint sie nicht.</p>` : '';

  const tags = d.sprachTags !== 'nein';
  const gewaehlt = sprachObjekte(d.sprachen);

  const bloecke = gewaehlt.map(sp => {
    const K = 'titel' + sp.id[0].toUpperCase() + sp.id[1];
    const text = fill(d[sp.id], d);
    const kopf = fill(d[K] || '', d);
    /* Die Überschrift der Hauptsprache steht schon im Kopfbalken — hier
       nicht noch einmal. */
    const zeigeKopf = has(kopf) && kopf.trim() !== String(d.title || '').trim();
    if (!has(text) && !zeigeKopf) return '';
    return `
    <article class="t-hinweis-block" lang="${sp.id}">
      ${tags ? `<span class="t-hinweis-tag" title="${esc(sp.eigen)}">${esc(sp.kurz)}</span>` : ''}
      <div class="t-hinweis-blocktxt">
        ${zeigeKopf ? `<h2>${esc(kopf)}</h2>` : ''}
        ${has(text) ? `<p class="t-hinweis-p">${fmt(text)}</p>` : ''}
      </div>
    </article>`;
  }).join('');

  /* Freiwilliger QR-Code in der Fusszeile. Stufe Q, weil ein Aushang
     Fingerabdrücke und Knicke abbekommt. Schlägt die Erzeugung fehl,
     bleibt die Stelle leer statt das Blatt zu zerschiessen. */
  let qrBlock = '';
  if (has(d.qrZiel)){
    const ziel = /^[a-z]+:/i.test(d.qrZiel) || !/\./.test(d.qrZiel)
      ? d.qrZiel : 'https://' + d.qrZiel;
    const mass = Math.max(15, Math.min(60, Number(d.qrMass) || 26));
    try {
      qrBlock = `<div class="t-hinweis-qr">
        ${qrSvg(ziel, { stufe:'Q', groesse:mass + 'mm', farbe:'#2A3350' })}
        ${has(d.qrLegende) ? `<span>${esc(d.qrLegende)}</span>` : ''}
      </div>`;
    } catch (err){ console.warn('[Hinweis] QR-Code:', err.message); }
  }

  return `
  ${warnung}
  <header class="t-hinweis-head" style="background:${t.bg};color:${t.fg}">
    <div class="t-hinweis-headtxt">
      <p class="t-hinweis-abs">${esc(abs.name)}</p>
      <h1>${esc(fill(d.title, d))}</h1>
      ${kopfAdresse}
    </div>
    <div class="t-hinweis-ico">${icon(d.icon || 'info', 64, 2.2)}</div>
  </header>

  <section class="t-hinweis-body${gewaehlt.length > 3 ? ' is-eng' : ''}">
    ${bloecke}
  </section>

  <footer class="t-hinweis-foot${qrBlock ? ' has-qr' : ''}">
    ${qrBlock}
    ${has(d.gruss) ? `<p class="t-hinweis-gruss">${esc(d.gruss)}</p>` : ''}
    ${istHotel(d.absender) ? `<div class="t-hinweis-mark">${logo('color', 30)}</div>` : ''}
    <p class="t-hinweis-addr">${esc(has(d.footer) ? d.footer : abs.foot)}</p>
  </footer>`;
}

/* Damit der Hub weiss, wie viele Bausteine dahinterstehen. */
export const PRESET_COUNT = PRESETS.length - 1;
