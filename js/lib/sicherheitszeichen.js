/* ==========================================================================
   Sicherheitszeichen
   --------------------------------------------------------------------------
   Form- und Farbsystem nach ISO 3864-1 / ISO 7010:

     Verbot     weisser Kreis, roter Ring und Schrägbalken, Symbol schwarz
     Warnung    gelbes Dreieck mit schwarzem Rand, Symbol schwarz
     Gebot      blauer Kreis, Symbol weiss
     Rettung    grünes Quadrat, Symbol weiss
     Brandschutz rotes Quadrat, Symbol weiss

   Die Massverhältnisse sind übernommen: der rote Ring und der Balken sind
   je 0,08 des Durchmessers breit, der Balken läuft von links oben nach
   rechts unten und liegt ÜBER dem Symbol.

   WICHTIG — ehrlich gesagt: die Piktogramme hier sind eigene Zeichnungen im
   Stil der Norm, nicht die amtlichen Symbole. Für zertifizierte
   Sicherheitskennzeichnung (Fluchtwege, Brandschutz nach Vorgabe der
   Feuerpolizei) gehören geprüfte Schilder an die Wand. Für den Hausgebrauch
   — Rauchverbot im Treppenhaus, Hinweis an der Waschküchentür — ist ein
   selbst gedrucktes Schild in der gewohnten Formensprache richtig.

   Jedes Zeichen trägt seinen Text in sechs Sprachen (DE EN FR IT PT ES).
   Ein Sicherheitszeichen wirkt zwar auch ohne Wort — das ist der Sinn der
   Norm —, aber "Fluchtweg freihalten" versteht sich nicht von selbst.

   Farben: Annäherung der Sicherheitsfarben für den Bürodrucker.
   ========================================================================== */

export const SZ_FARBEN = {
  rot:   '#C8102E',
  gelb:  '#F9A800',
  blau:  '#005387',
  gruen: '#00843D',
  schwarz:'#1A1A1A',
  weiss: '#FFFFFF'
};

/* --------------------------------------------------------------------------
   Piktogramme — alle im Koordinatenfeld 0…100, Farbe über currentColor.
   -------------------------------------------------------------------------- */
const SZ_PIKTO = {
  /* Filter links, Glut rechts, Rauch darueber — wie im gewohnten Zeichen. */
  rauchen:
    '<rect x="10" y="58" width="14" height="13" rx="1.5"/>' +
    '<rect x="27" y="58" width="53" height="13" rx="1.5"/>' +
    '<path d="M58 50c9-6 1-13 7-20" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>' +
    '<path d="M74 50c9-6 1-13 7-20" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>',

  feuer:
    /* Aussenflamme mit Einbuchtung links, dazu ein heller Kern — sonst
       liest sich die Form wie ein Wassertropfen. */
    '<path fill-rule="evenodd" d="M55 4c3 18 19 26 19 46a24 24 0 0 1-48 0'
    + 'c0-12 5-19 11-26 -1 10 3 15 8 17 3-13-1-25 10-37Z'
    + 'M50 48c5 8 9 12 9 18a9 9 0 0 1-18 0c0-6 4-10 9-18Z"/>',

  person:
    '<circle cx="50" cy="17" r="10"/>' +
    '<path d="M38 31h24a6 6 0 0 1 6 6v22a5 5 0 0 1-10 0V45h-2v47a6 6 0 0 1-12 0V66h-2v26a6 6 0 0 1-12 0V45h-2v14a5 5 0 0 1-10 0V37a6 6 0 0 1 6-6Z"/>',

  handy:
    '<rect x="32" y="10" width="36" height="80" rx="7"/>' +
    '<rect x="38" y="22" width="24" height="46" rx="2" fill="#fff"/>' +
    '<rect x="43" y="15" width="14" height="3" rx="1.5" fill="#fff"/>' +
    '<circle cx="50" cy="79" r="4.5" fill="#fff"/>',

  pfote:
    '<ellipse cx="50" cy="70" rx="22" ry="18"/>' +
    '<ellipse cx="25" cy="45" rx="9" ry="12"/>' +
    '<ellipse cx="42" cy="32" rx="9" ry="13"/>' +
    '<ellipse cx="60" cy="32" rx="9" ry="13"/>' +
    '<ellipse cx="76" cy="45" rx="9" ry="12"/>',

  trinkwasser:
    '<path d="M30 26h40l-5 62a6 6 0 0 1-6 5.5H41a6 6 0 0 1-6-5.5Z"/>' +
    '<rect x="26" y="16" width="48" height="8" rx="3"/>' +
    '<path d="M50 34c7 10 11 15 11 21a11 11 0 0 1-22 0c0-6 4-11 11-21Z" fill="#fff"/>',

  kiste:
    '<path d="M14 34h72v52H14Z"/>' +
    '<path d="M14 34 26 16h48l12 18" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>' +
    '<rect x="42" y="44" width="16" height="8" rx="2" fill="#fff"/>',

  ausruf:
    '<path d="M43 20h14l-2.6 44h-8.8Z"/>' +
    '<circle cx="50" cy="77" r="7.5"/>',

  blitz:
    '<path d="M58 6 24 56h20l-8 40 38-52H52Z"/>',

  rutsch:
    '<circle cx="26" cy="16" r="9"/>' +
    '<g fill="none" stroke="currentColor" stroke-linecap="round">' +
    '<path d="M31 29 55 50" stroke-width="10"/>' +
    '<path d="M31 29 14 19" stroke-width="8"/>' +
    '<path d="M55 50 84 44" stroke-width="8"/>' +
    '<path d="M55 50 58 72" stroke-width="8"/>' +
    '<path d="M6 88c8-6 14-6 22 0s14 6 22 0 14-6 22 0 14 6 22 0" stroke-width="6"/>' +
    '</g>',

  fluchtweg:
    '<path d="M56 10h28a4 4 0 0 1 4 4v72a4 4 0 0 1-4 4H56v-9h23V19H56Z"/>' +
    '<circle cx="30" cy="17" r="8.5"/>' +
    '<path d="M24 29c6-2 11 1 14 6l7 12 11 4-4 10-15-6-3-5-5 15 13 12-7 9-18-17 7-24-8 6-6 12-9-4 8-17Z"/>',

  kreuz:
    '<path d="M38 12h24v26h26v24H62v26H38V62H12V38h26Z"/>',

  sammelplatz:
    '<circle cx="34" cy="30" r="8"/><path d="M24 42h20l4 20h-7l-1 24h-12l-1-24h-7Z"/>' +
    '<circle cx="62" cy="30" r="8"/><path d="M52 42h20l4 20h-7l-1 24H56l-1-24h-7Z"/>' +
    '<path d="M6 8h18v6H12v10H6ZM94 8H76v6h12v10h6ZM6 92h18v-6H12V76H6ZM94 92H76v-6h12V76h6Z"/>',

  loescher:
    '<rect x="28" y="28" width="32" height="60" rx="8"/>' +
    '<rect x="36" y="16" width="16" height="12" rx="3"/>' +
    '<rect x="30" y="12" width="28" height="6" rx="3"/>' +
    '<path d="M58 22h14a6 6 0 0 1 6 6v18" fill="none" stroke="currentColor"'
    + ' stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M70 46h16l-6 8h-4Z"/>' +
    '<rect x="34" y="44" width="20" height="24" rx="2" fill="#fff"/>',

  /* Offene Hand mit Wassertropfen darueber. */
  haende:
    '<path d="M36 6c3 6 6 8 6 11a6 6 0 0 1-12 0c0-3 3-5 6-11Z"/>' +
    '<path d="M53 4c3 6 6 8 6 11a6 6 0 0 1-12 0c0-3 3-5 6-11Z"/>' +
    '<path d="M70 6c3 6 6 8 6 11a6 6 0 0 1-12 0c0-3 3-5 6-11Z"/>' +
    '<rect x="31" y="34" width="9" height="30" rx="4.5"/>' +
    '<rect x="43" y="30" width="9" height="34" rx="4.5"/>' +
    '<rect x="55" y="32" width="9" height="32" rx="4.5"/>' +
    '<rect x="67" y="38" width="9" height="26" rx="4.5"/>' +
    '<path d="M29 56h49v10a24.5 24.5 0 0 1-49 0Z"/>' +
    '<path d="M31 64 19 76a5.5 5.5 0 0 0 8 8l10-10Z"/>',

  tuer:
    '<path d="M24 8h52v84H24Z" fill="none" stroke="currentColor" stroke-width="8"/>' +
    '<circle cx="64" cy="52" r="5"/>'
};

export const SZ_PIKTO_KEYS = Object.keys(SZ_PIKTO);

/* --------------------------------------------------------------------------
   Fertige Zeichen — was im Haus wirklich gebraucht wird.
   -------------------------------------------------------------------------- */
export const SZ_ZEICHEN = [
  { id:'rauchen-verboten', art:'verbot', pikto:'rauchen', text:{
    de:'Rauchen verboten', en:'No smoking', fr:'Interdiction de fumer',
    it:'Vietato fumare', pt:'Proibido fumar', es:'Prohibido fumar' } },

  { id:'feuer-verboten', art:'verbot', pikto:'feuer', text:{
    de:'Feuer, offenes Licht und Rauchen verboten', en:'No open flame, fire or smoking',
    fr:'Feu, flamme nue et cigarette interdits', it:'Vietati fuoco, fiamme libere e sigarette',
    pt:'Proibido fogo, chama aberta e fumar', es:'Prohibido fuego, llama abierta y fumar' } },

  { id:'zutritt-verboten', art:'verbot', pikto:'person', text:{
    de:'Zutritt für Unbefugte verboten', en:'No access for unauthorised persons',
    fr:'Accès interdit aux personnes non autorisées', it:'Vietato lʼaccesso ai non autorizzati',
    pt:'Proibida a entrada a pessoas não autorizadas', es:'Prohibida la entrada a personas no autorizadas' } },

  { id:'handy-verboten', art:'verbot', pikto:'handy', text:{
    de:'Mobiltelefone verboten', en:'No mobile phones', fr:'Téléphones portables interdits',
    it:'Vietato lʼuso di telefoni cellulari', pt:'Proibido o uso de telemóveis',
    es:'Prohibido el uso de móviles' } },

  { id:'hunde-verboten', art:'verbot', pikto:'pfote', text:{
    de:'Hunde verboten', en:'No dogs', fr:'Chiens interdits',
    it:'Vietato lʼingresso ai cani', pt:'Proibida a entrada de cães',
    es:'Prohibida la entrada de perros' } },

  { id:'kein-trinkwasser', art:'verbot', pikto:'trinkwasser', text:{
    de:'Kein Trinkwasser', en:'Not drinking water', fr:'Eau non potable',
    it:'Acqua non potabile', pt:'Água não potável', es:'Agua no potable' } },

  { id:'abstellen-verboten', art:'verbot', pikto:'kiste', text:{
    de:'Abstellen verboten — Fluchtweg freihalten', en:'Do not obstruct — keep escape route clear',
    fr:'Ne rien déposer — dégager la voie de fuite', it:'Non depositare — tenere libera la via di fuga',
    pt:'Não obstruir — mantenha livre a via de evacuação',
    es:'No obstruir — mantenga libre la vía de evacuación' } },

  { id:'warnung-allgemein', art:'warnung', pikto:'ausruf', text:{
    de:'Achtung', en:'Warning', fr:'Attention',
    it:'Attenzione', pt:'Atenção', es:'Atención' } },

  { id:'warnung-strom', art:'warnung', pikto:'blitz', text:{
    de:'Warnung vor elektrischer Spannung', en:'Electricity hazard', fr:'Danger électrique',
    it:'Pericolo di tensione elettrica', pt:'Perigo elétrico', es:'Peligro eléctrico' } },

  { id:'warnung-rutsch', art:'warnung', pikto:'rutsch', text:{
    de:'Rutschgefahr', en:'Slippery surface', fr:'Sol glissant',
    it:'Pericolo di scivolamento', pt:'Piso escorregadio', es:'Suelo resbaladizo' } },

  { id:'gebot-haende', art:'gebot', pikto:'haende', text:{
    de:'Hände waschen', en:'Wash your hands', fr:'Se laver les mains',
    it:'Lavarsi le mani', pt:'Lave as mãos', es:'Lávese las manos' } },

  { id:'gebot-tuer', art:'gebot', pikto:'tuer', text:{
    de:'Tür geschlossen halten', en:'Keep door closed', fr:'Garder la porte fermée',
    it:'Tenere la porta chiusa', pt:'Manter a porta fechada', es:'Mantener la puerta cerrada' } },

  { id:'fluchtweg', art:'rettung', pikto:'fluchtweg', text:{
    de:'Notausgang', en:'Emergency exit', fr:'Sortie de secours',
    it:'Uscita di emergenza', pt:'Saída de emergência', es:'Salida de emergencia' } },

  { id:'erste-hilfe', art:'rettung', pikto:'kreuz', text:{
    de:'Erste Hilfe', en:'First aid', fr:'Premiers secours',
    it:'Pronto soccorso', pt:'Primeiros socorros', es:'Primeros auxilios' } },

  { id:'sammelplatz', art:'rettung', pikto:'sammelplatz', text:{
    de:'Sammelplatz', en:'Assembly point', fr:'Point de rassemblement',
    it:'Punto di raccolta', pt:'Ponto de encontro', es:'Punto de reunión' } },

  { id:'feuerloescher', art:'brand', pikto:'loescher', text:{
    de:'Feuerlöscher', en:'Fire extinguisher', fr:'Extincteur',
    it:'Estintore', pt:'Extintor', es:'Extintor' } }
];

export function szZeichen(id){
  return SZ_ZEICHEN.find(z => z.id === id) || SZ_ZEICHEN[0];
}
export function szOptions(){
  const gruppe = { verbot:'Verbot', warnung:'Warnung', gebot:'Gebot',
                   rettung:'Rettung', brand:'Brandschutz' };
  return SZ_ZEICHEN.map(z => ({ v:z.id, t:`${gruppe[z.art]} · ${z.text.de}` }));
}

/* --------------------------------------------------------------------------
   Zeichnung
   -------------------------------------------------------------------------- */
function szSymbol(pikto, farbe, box){
  const d = SZ_PIKTO[pikto] || SZ_PIKTO.ausruf;
  const s = box.s;
  return `<g transform="translate(${box.x} ${box.y}) scale(${s})" fill="${farbe}" color="${farbe}">${d}</g>`;
}

/**
 * Ein Sicherheitszeichen als SVG.
 * @param {string} art    verbot | warnung | gebot | rettung | brand
 * @param {string} pikto  Schlüssel aus SZ_PIKTO
 * @param {number} size   Kantenlänge in mm (wird als width/height gesetzt)
 */
export function szSvg(art, pikto, size){
  const mm = `${size}mm`;
  const wrap = (vb, inner) =>
    `<svg class="sz" viewBox="${vb}" width="${mm}" height="${mm}"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  if (art === 'warnung'){
    /* Gleichseitiges Dreieck mit gerundeten Ecken, Rand 0,04 der Seite. */
    return wrap('0 0 100 92', `
      <path d="M50 5 95 87H5Z" fill="${SZ_FARBEN.gelb}" stroke="${SZ_FARBEN.schwarz}"
        stroke-width="7" stroke-linejoin="round"/>
      ${szSymbol(pikto, SZ_FARBEN.schwarz, { x:27, y:30, s:0.46 })}`);
  }

  if (art === 'gebot'){
    return wrap('0 0 100 100', `
      <circle cx="50" cy="50" r="50" fill="${SZ_FARBEN.blau}"/>
      ${szSymbol(pikto, SZ_FARBEN.weiss, { x:22, y:22, s:0.56 })}`);
  }

  if (art === 'rettung' || art === 'brand'){
    const bg = art === 'rettung' ? SZ_FARBEN.gruen : SZ_FARBEN.rot;
    return wrap('0 0 100 100', `
      <rect x="0" y="0" width="100" height="100" rx="4" fill="${bg}"/>
      ${szSymbol(pikto, SZ_FARBEN.weiss, { x:19, y:19, s:0.62 })}`);
  }

  /* Verbot — Ring 0,08 d, Balken 0,08 d, Balken über dem Symbol. */
  return wrap('0 0 100 100', `
    <circle cx="50" cy="50" r="50" fill="${SZ_FARBEN.weiss}"/>
    ${szSymbol(pikto, SZ_FARBEN.schwarz, { x:25, y:25, s:0.50 })}
    <circle cx="50" cy="50" r="46" fill="none" stroke="${SZ_FARBEN.rot}" stroke-width="8"/>
    <path d="M17.5 17.5 82.5 82.5" stroke="${SZ_FARBEN.rot}" stroke-width="8"/>`);
}
