/* Sammelstelle · Beschriftung der Behälter, mehrseitig.
   Ersetzt die Serie BeschriftungPET / -Altglas / -Altpapier / -Metall /
   -Nespresso / -Kehricht / -Kompost / -Sperrmüll und die Liste aus
   "A14 Recycling.docx" (Papier, Plastik-Gebinde, PET, Clean Plastik, Glas,
   Alumetall).

   Ein grosses Wort, ein Piktogramm, eine Zeile was hinein darf und eine was
   nicht — aus zwei Metern Abstand lesbar. Angekreuzte Fraktionen ergeben je
   eine Seite. */
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb } from '../lib/thumbs.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachObjekte } from '../lib/sprachen.js';

const SAMMEL_PAGES = { a5:'a5', 'a5-land':'a5-land', a4:'a4', 'a4-land':'a4-land' };

/* Die Fraktionen, wie sie im Haus wirklich beschriftet sind — je in sechs
   Sprachen. Beim Abfall lohnt sich das besonders: wer die Fraktion nicht
   versteht, wirft im Zweifel alles in den Kehricht. */
export const FRAKTIONEN = [
  { id:'papier', icon:'trash', farbe:'#2A3350',
    wort:{ de:'Papier', en:'Paper', fr:'Papier', it:'Carta', pt:'Papel', es:'Papel' },
    ja:{ de:'Sauberes Papier und Karton', en:'Clean paper and cardboard',
         fr:'Papier et carton propres', it:'Carta e cartone puliti',
         pt:'Papel e cartão limpos', es:'Papel y cartón limpios' },
    nein:{ de:'Kein beschichtetes Papier, keine Verbundverpackungen',
           en:'No coated paper, no composite packaging',
           fr:'Pas de papier couché ni dʼemballages composites',
           it:'Niente carta patinata né imballaggi accoppiati',
           pt:'Sem papel plastificado nem embalagens compostas',
           es:'Sin papel plastificado ni envases compuestos' } },

  { id:'karton', icon:'trash', farbe:'#2A3350',
    wort:{ de:'Karton', en:'Cardboard', fr:'Carton', it:'Cartone', pt:'Cartão', es:'Cartón' },
    ja:{ de:'Flach gefaltet', en:'Folded flat', fr:'Plié à plat',
         it:'Piegato piatto', pt:'Dobrado ao meio', es:'Plegado en plano' },
    nein:{ de:'Kein verschmutzter Karton', en:'No soiled cardboard',
           fr:'Pas de carton souillé', it:'Niente cartone sporco',
           pt:'Sem cartão sujo', es:'Sin cartón sucio' } },

  { id:'pet', icon:'bottle', farbe:'#0B7A3B',
    wort:{ de:'PET', en:'PET bottles', fr:'PET', it:'PET', pt:'PET', es:'PET' },
    ja:{ de:'Nur PET-Getränkeflaschen — Luft rauslassen, Deckel wieder aufschrauben',
         en:'PET drink bottles only — squeeze out the air, screw the cap back on',
         fr:'Uniquement bouteilles à boisson en PET — chasser lʼair, revisser le bouchon',
         it:'Solo bottiglie per bevande in PET — far uscire lʼaria, riavvitare il tappo',
         pt:'Apenas garrafas de bebidas em PET — esprema o ar, volte a enroscar a tampa',
         es:'Solo botellas de bebida de PET — saque el aire y enrosque el tapón' },
    nein:{ de:'Keine Milchflaschen, keine Shampooflaschen',
           en:'No milk or shampoo bottles', fr:'Ni bouteilles de lait ni flacons de shampooing',
           it:'Né bottiglie del latte né flaconi di shampoo',
           pt:'Sem garrafas de leite nem frascos de champô',
           es:'Ni botellas de leche ni frascos de champú' } },

  { id:'plastik', icon:'bottle', farbe:'#0B7A3B',
    wort:{ de:'Clean Plastik', en:'Clean plastic', fr:'Plastique propre',
           it:'Plastica pulita', pt:'Plástico limpo', es:'Plástico limpio' },
    ja:{ de:'Saubere Kunststoffverpackungen', en:'Clean plastic packaging',
         fr:'Emballages plastiques propres', it:'Imballaggi in plastica puliti',
         pt:'Embalagens de plástico limpas', es:'Envases de plástico limpios' },
    nein:{ de:'Keine verschmutzten Verpackungen', en:'No soiled packaging',
           fr:'Pas dʼemballages souillés', it:'Niente imballaggi sporchi',
           pt:'Sem embalagens sujas', es:'Sin envases sucios' } },

  { id:'gebinde', icon:'bottle', farbe:'#0B7A3B',
    wort:{ de:'Plastik-Gebinde', en:'Plastic bottles', fr:'Flacons en plastique',
           it:'Flaconi in plastica', pt:'Frascos de plástico', es:'Envases de plástico' },
    ja:{ de:'Shampoo-, Wasch- und Putzmittelflaschen',
         en:'Shampoo, detergent and cleaning-product bottles',
         fr:'Flacons de shampooing, de lessive et de produits de nettoyage',
         it:'Flaconi di shampoo, detersivo e detergenti',
         pt:'Frascos de champô, detergente e produtos de limpeza',
         es:'Frascos de champú, detergente y productos de limpieza' },
    nein:{ de:'Kein PET', en:'No PET', fr:'Pas de PET',
           it:'Niente PET', pt:'Sem PET', es:'Sin PET' } },

  { id:'glas', icon:'bottle', farbe:'#0E6E5E',
    wort:{ de:'Glas', en:'Glass', fr:'Verre', it:'Vetro', pt:'Vidro', es:'Vidrio' },
    ja:{ de:'Flaschen und Gläser, ohne Deckel', en:'Bottles and jars, without lids',
         fr:'Bouteilles et bocaux, sans couvercle', it:'Bottiglie e vasetti, senza coperchio',
         pt:'Garrafas e frascos, sem tampa', es:'Botellas y tarros, sin tapa' },
    nein:{ de:'Kein Fensterglas, keine Keramik', en:'No window glass, no ceramics',
           fr:'Ni vitrage ni céramique', it:'Niente vetro da finestra né ceramica',
           pt:'Sem vidro de janela nem cerâmica', es:'Ni vidrio de ventana ni cerámica' } },

  { id:'metall', icon:'trash', farbe:'#5A6474',
    wort:{ de:'Alumetall', en:'Metal', fr:'Métal', it:'Metallo', pt:'Metal', es:'Metal' },
    ja:{ de:'Dosen, Alu, Tuben', en:'Cans, aluminium, tubes', fr:'Boîtes, alu, tubes',
         it:'Lattine, alluminio, tubetti', pt:'Latas, alumínio, bisnagas',
         es:'Latas, aluminio, tubos' },
    nein:{ de:'Keine Spraydosen mit Restinhalt', en:'No aerosol cans with contents left',
           fr:'Pas dʼaérosols encore pleins', it:'Niente bombolette ancora piene',
           pt:'Sem latas de spray com resto', es:'Sin aerosoles con contenido' } },

  { id:'nespresso', icon:'cup', farbe:'#8A5A2B',
    wort:{ de:'Nespresso', en:'Coffee capsules', fr:'Capsules à café',
           it:'Capsule da caffè', pt:'Cápsulas de café', es:'Cápsulas de café' },
    ja:{ de:'Nur Aluminium-Kapseln', en:'Aluminium capsules only',
         fr:'Capsules en aluminium uniquement', it:'Solo capsule in alluminio',
         pt:'Apenas cápsulas de alumínio', es:'Solo cápsulas de aluminio' },
    nein:{ de:'Keine Kunststoff-Kapseln', en:'No plastic capsules',
           fr:'Pas de capsules en plastique', it:'Niente capsule in plastica',
           pt:'Sem cápsulas de plástico', es:'Sin cápsulas de plástico' } },

  { id:'kompost', icon:'trash', farbe:'#6B7A2B',
    wort:{ de:'Kompost', en:'Organic waste', fr:'Compost',
           it:'Compost', pt:'Compostagem', es:'Compost' },
    ja:{ de:'Rüstabfälle, Kaffeesatz, Eierschalen',
         en:'Vegetable peelings, coffee grounds, eggshells',
         fr:'Épluchures, marc de café, coquilles dʼœufs',
         it:'Scarti di verdura, fondi di caffè, gusci dʼuovo',
         pt:'Cascas de legumes, borras de café, cascas de ovo',
         es:'Restos de verdura, posos de café, cáscaras de huevo' },
    nein:{ de:'Keine Knochen, keine Plastiksäcke', en:'No bones, no plastic bags',
           fr:'Ni os ni sacs plastique', it:'Niente ossa né sacchetti di plastica',
           pt:'Sem ossos nem sacos de plástico', es:'Ni huesos ni bolsas de plástico' } },

  { id:'kehricht', icon:'trash', farbe:'#C0271F',
    wort:{ de:'Kehricht', en:'General waste', fr:'Ordures ménagères',
           it:'Rifiuti', pt:'Lixo comum', es:'Basura' },
    ja:{ de:'Nur im offiziellen Gebührensack', en:'Only in the official charged bag',
         fr:'Uniquement dans le sac taxé officiel', it:'Solo nel sacco ufficiale a pagamento',
         pt:'Apenas no saco oficial taxado', es:'Solo en la bolsa oficial de pago' },
    nein:{ de:'Nichts Recycelbares', en:'Nothing recyclable', fr:'Rien de recyclable',
           it:'Niente di riciclabile', pt:'Nada reciclável', es:'Nada reciclable' } },

  { id:'sperrmuell', icon:'trash', farbe:'#C0271F',
    wort:{ de:'Sperrmüll', en:'Bulky waste', fr:'Encombrants',
           it:'Rifiuti ingombranti', pt:'Volumosos', es:'Voluminosos' },
    ja:{ de:'Nach Absprache mit der Verwaltung', en:'By arrangement with the management',
         fr:'Sur entente avec la gérance', it:'Previo accordo con lʼamministrazione',
         pt:'Mediante acordo com a administração', es:'Previo acuerdo con la administración' },
    nein:{ de:'Nicht einfach abstellen', en:'Do not simply leave it here',
           fr:'Ne pas déposer sans autorisation', it:'Non depositare senza accordo',
           pt:'Não deixe aqui sem aviso', es:'No lo deje aquí sin avisar' } }
];

export default {
  id:'sammelstelle',
  title:'Sammelstelle beschriften',
  sub:'Papier, PET, Glas, Kehricht … · eine Seite je Behälter',
  badge:'Abfall',
  root:'t-sammel',
  fern:true,   /* Schild — Leseabstand anzeigen */
  cat:'abfall',
  multipage:true,
  pageOf(d){ return SAMMEL_PAGES[d && d.format] || 'a5-land'; },

  thumb: thumb(`
    <rect x="12" y="26" width="186" height="106" rx="10" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="12" y="26" width="186" height="20" rx="10" fill="#0B7A3B"/>
    <rect x="12" y="36" width="186" height="10" fill="#0B7A3B"/>
    <rect x="30" y="62" width="70" height="22" rx="5" fill="#2A3350"/>
    <rect x="30" y="94" width="110" height="7" rx="3.5" fill="#C9CFDA"/>
    <rect x="30" y="108" width="86" height="7" rx="3.5" fill="#E5E8ED"/>
    <circle cx="164" cy="86" r="22" fill="#fff" stroke="#0B7A3B" stroke-width="3"/>
    <rect x="12" y="158" width="186" height="106" rx="10" fill="#F6F7FA" stroke="#E5E8ED" stroke-width="2"/>
    <rect x="12" y="158" width="186" height="20" rx="10" fill="#C0271F"/>
    <rect x="12" y="168" width="186" height="10" fill="#C0271F"/>
    <rect x="30" y="194" width="90" height="22" rx="5" fill="#2A3350"/>
    <rect x="30" y="226" width="110" height="7" rx="3.5" fill="#C9CFDA"/>`),

  fields:[
    { t:'group', label:'Format' },
    { k:'format', label:'Papier', type:'select', options:[
      { v:'a5-land', t:'A5 quer' }, { v:'a5', t:'A5 hoch' },
      { v:'a4-land', t:'A4 quer' }, { v:'a4', t:'A4 hoch' }
    ] },

    { t:'group', label:'Sprachen' },
    { k:'sprachen', label:'Sprachen auf dem Schild', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },
    { k:'setzeSprachen', label:'Zusammenstellung übernehmen', type:'action' },

    { t:'group', label:'Objekt' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },

    { t:'group', label:'Behälter' },
    { t:'note', label:'Jede Zeile ergibt eine Druckseite. Nicht benötigte Zeilen löschen.' },
    { k:'rows', label:'Fraktionen', type:'list', itemLabel:'Behälter', max:12,
      defaultItem:{ art:'papier', wort:'', ja:'', nein:'' },
      item:[
        { k:'art',  label:'Fraktion', type:'select',
          options:FRAKTIONEN.map(f => ({ v:f.id, t:f.wort.de })) },
        { k:'wort', label:'Wort (überschreibt)', type:'text' },
        { k:'ja',   label:'Das gehört hinein', type:'text' },
        { k:'nein', label:'Das gehört nicht hinein', type:'text' }
      ] }
  ],

  defaults:{
    format:'a5-land',
    sprachen:['de','en'],
    sprachSet:'',
    objekt:'-',
    absender:'immobilien',
    /* Die sechs Fraktionen aus "A14 Recycling.docx". */
    rows:[
      { art:'papier',  wort:'', ja:'', nein:'' },
      { art:'gebinde', wort:'', ja:'', nein:'' },
      { art:'pet',     wort:'', ja:'', nein:'' },
      { art:'plastik', wort:'', ja:'', nein:'' },
      { art:'glas',    wort:'', ja:'', nein:'' },
      { art:'metall',  wort:'', ja:'', nein:'' }
    ]
  },

  /* Aus der Suche: die gefundene Fraktion als einzige Zeile setzen. */
  ausSuche(d, wert){
    return FRAKTIONEN.some(f => f.id === wert)
      ? { ...d, rows:[{ art:wert, wort:'', ja:'', nein:'' }] } : d;
  },

  actions:{
    setzeSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = ABSENDER[d.absender] || ABSENDER.immobilien;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const sprachen = sprachObjekte(d.sprachen);

    return (d.rows || []).map(r => {
      const f = FRAKTIONEN.find(x => x.id === r.art) || FRAKTIONEN[0];
      const haupt = sprachen[0].id;
      /* Eigene Eingaben überschreiben die Hauptsprache; die weiteren
         Sprachen bleiben beim hinterlegten Wortlaut. */
      const wort = has(r.wort) ? r.wort : (f.wort[haupt] || f.wort.de);
      const ja   = has(r.ja)   ? r.ja   : (f.ja[haupt]   || f.ja.de);
      const nein = has(r.nein) ? r.nein : (f.nein[haupt] || f.nein.de);
      const weitere = sprachen.slice(1);

      return `
      <article data-page class="t-sammel-page" style="--ton:${f.farbe}">
        <div class="t-sammel-band"></div>
        <div class="t-sammel-body">
          <div class="t-sammel-txt">
            <h1 lang="${haupt}">${esc(wort)}</h1>
            ${weitere.length ? `<p class="t-sammel-en">${
              weitere.map(sp => esc(f.wort[sp.id] || '')).filter(Boolean).join(' · ')}</p>` : ''}
            ${has(ja)   ? `<p class="t-sammel-ja"><span>✓</span>${esc(ja)}</p>` : ''}
            ${has(nein) ? `<p class="t-sammel-nein"><span>×</span>${esc(nein)}</p>` : ''}
            ${weitere.map(sp => `<p class="t-sammel-mehr" lang="${sp.id}">
              <b>${esc(sp.kurz)}</b> ${esc(f.ja[sp.id] || '')}</p>`).join('')}
          </div>
          <div class="t-sammel-ico">${icon(f.icon, 120, 1.6)}</div>
        </div>
        <footer class="t-sammel-foot">
          <span>${istHotel(d.absender) ? logo('color', 22) : esc(abs.legal)}</span>
          <span>${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</span>
        </footer>
      </article>`;
    }).join('');
  }
};
