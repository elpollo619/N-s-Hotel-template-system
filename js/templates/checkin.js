/* Self-Check-in · A4 hoch
   --------------------------------------------------------------------------
   N's Hotel kommt ohne Rezeption aus. Damit steht und fällt der Aufenthalt
   mit diesem einen Blatt: Wer nachts um elf vor der Tür steht und den Code
   nicht findet, kommt nicht ins Zimmer.

   Darum ist der Code das Grösste auf der Seite — grösser als der Titel.
   Alles andere ist Beiwerk.

   Zwei Verwendungen, darum zwei Anordnungen:
     zusammen  alle Sprachen auf einem Blatt — zum Aushängen an der Tür
     einzeln   eine Seite je Sprache — zum Mitgeben oder Mailen
*/
import { esc, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { icon } from '../lib/icons.js';
import { thumb, lines } from '../lib/thumbs.js';
import { qrSvg } from '../lib/qr.js';
import { sprachOptions, sprachSetOptions, sprachSet, sprachListe, sprachObjekte } from '../lib/sprachen.js';
import { absender, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

/* Die vier Schritte in allen sechs Sprachen. Deutsch ist das Original; die
   übrigen sind Übersetzungen und dürfen überschrieben werden. */
const CHECKIN_SCHRITTE = [
  { icon:'door',
    de:{ t:'Haustür öffnen',       s:'Code auf dem Tastenfeld eingeben, dann die Taste mit dem Schlüssel drücken.' },
    en:{ t:'Open the front door',  s:'Enter the code on the keypad, then press the key button.' },
    fr:{ t:'Ouvrir la porte',      s:'Saisissez le code sur le clavier, puis appuyez sur la touche clé.' },
    it:{ t:'Aprire il portone',    s:'Digitate il codice sulla tastiera, poi premete il tasto con la chiave.' },
    pt:{ t:'Abrir a porta',        s:'Introduza o código no teclado e prima a tecla com a chave.' },
    es:{ t:'Abrir la puerta',      s:'Introduzca el código en el teclado y pulse la tecla de la llave.' } },

  { icon:'stairs',
    de:{ t:'In den ersten Stock',  s:'Treppe hoch. Ihr Zimmer ist angeschrieben.' },
    en:{ t:'Up to the first floor',s:'Take the stairs. Your room is labelled.' },
    fr:{ t:'Monter au premier',    s:'Prenez l’escalier. Votre chambre est indiquée.' },
    it:{ t:'Salire al primo piano',s:'Salite le scale. La vostra camera è segnalata.' },
    pt:{ t:'Subir ao primeiro andar', s:'Suba as escadas. O seu quarto está identificado.' },
    es:{ t:'Suba al primer piso',  s:'Suba las escaleras. Su habitación está señalizada.' } },

  { icon:'key',
    de:{ t:'Zimmer öffnen',        s:'Der Schlüssel steckt im Schlüsselkasten neben der Zimmertür.' },
    en:{ t:'Open your room',       s:'The key is in the key box next to the room door.' },
    fr:{ t:'Ouvrir la chambre',    s:'La clé se trouve dans le boîtier à côté de la porte.' },
    it:{ t:'Aprire la camera',     s:'La chiave è nella cassetta accanto alla porta.' },
    pt:{ t:'Abrir o quarto',       s:'A chave está na caixa ao lado da porta do quarto.' },
    es:{ t:'Abrir la habitación',  s:'La llave está en la caja junto a la puerta.' } },

  { icon:'wifi',
    de:{ t:'Ankommen',             s:'WLAN, Frühstück und alles Weitere stehen in der Mappe im Zimmer.' },
    en:{ t:'Settle in',            s:'Wi-Fi, breakfast and everything else are in the folder in your room.' },
    fr:{ t:'Vous installer',       s:'Wi-Fi, petit-déjeuner et le reste: dans le dossier de la chambre.' },
    it:{ t:'Sistemarsi',           s:'Wi-Fi, colazione e tutto il resto sono nella cartella in camera.' },
    pt:{ t:'Instalar-se',          s:'Wi-Fi, pequeno-almoço e o resto estão na pasta do quarto.' },
    es:{ t:'Instalarse',           s:'Wi-Fi, desayuno y lo demás están en la carpeta de la habitación.' } }
];

const CHECKIN_KOPF = {
  de:{ eyebrow:'Herzlich willkommen', titel:'So kommen Sie herein',
       code:'Ihr Zutrittscode', hilfe:'Klappt etwas nicht? Rufen Sie uns an:' },
  en:{ eyebrow:'Welcome',             titel:'How to get in',
       code:'Your access code',       hilfe:'Something not working? Give us a call:' },
  fr:{ eyebrow:'Bienvenue',           titel:'Comment entrer',
       code:'Votre code d’accès',     hilfe:'Un problème? Appelez-nous:' },
  it:{ eyebrow:'Benvenuti',           titel:'Come entrare',
       code:'Il vostro codice',       hilfe:'Qualcosa non funziona? Chiamateci:' },
  pt:{ eyebrow:'Bem-vindo',           titel:'Como entrar',
       code:'O seu código de acesso', hilfe:'Algo não funciona? Ligue-nos:' },
  es:{ eyebrow:'Bienvenido',          titel:'Cómo entrar',
       code:'Su código de acceso',    hilfe:'¿Algo no funciona? Llámenos:' }
};

/** Ein überschriebener Schritt-Text, sonst der hinterlegte. */
function checkinText(d, i, sp, feld){
  const eigen = d[`s${i + 1}${feld}${sp.toUpperCase()}`];
  if (has(eigen)) return eigen;
  const s = CHECKIN_SCHRITTE[i][sp] || CHECKIN_SCHRITTE[i].de;
  return feld === 'T' ? s.t : s.s;
}

function checkinBlock(d, sp, einzeln){
  const k = CHECKIN_KOPF[sp] || CHECKIN_KOPF.de;
  const schritte = CHECKIN_SCHRITTE.map((s, i) => `
    <li class="t-checkin-schritt">
      <span class="t-checkin-nr">${i + 1}</span>
      <span class="t-checkin-ico">${icon(s.icon, 26, 1.9)}</span>
      <span class="t-checkin-txt">
        <b>${esc(checkinText(d, i, sp, 'T'))}</b>
        <i>${esc(checkinText(d, i, sp, 'S'))}</i>
      </span>
    </li>`).join('');

  return `
    <section class="t-checkin-block${einzeln ? ' is-einzeln' : ''}" lang="${sp}">
      ${einzeln ? '' : `<h2 class="t-checkin-sprache">${esc(k.titel)}</h2>`}
      <ol class="t-checkin-liste">${schritte}</ol>
      ${has(d.telefon) ? `<p class="t-checkin-hilfe">${esc(k.hilfe)} <b>${esc(d.telefon)}</b></p>` : ''}
    </section>`;
}

export default {
  id:'checkin',
  title:'Self-Check-in',
  sub:'Zutrittscode und vier Schritte · A4 hoch · sechs Sprachen',
  badge:'Ankunft',
  badgeCyan:true,
  root:'t-checkin',
  page:'a4',
  multipage(d){ return d && d.anordnung === 'einzeln' && sprachListe(d.sprachen).length > 1; },

  thumb: thumb(`
    <rect x="0" y="0" width="210" height="64" fill="#2A3350"/>
    <rect x="18" y="18" width="86" height="9" rx="4" fill="#01B1E2"/>
    <rect x="18" y="34" width="132" height="14" rx="5" fill="#fff" opacity=".95"/>
    <rect x="18" y="78" width="174" height="46" rx="8" fill="#E7F7FC" stroke="#01B1E2" stroke-width="2"/>
    <rect x="40" y="94" width="130" height="16" rx="5" fill="#2A3350"/>
    ${[0, 1, 2, 3].map(i => `
      <circle cx="27" cy="${146 + i * 30}" r="8" fill="#01B1E2"/>
      <rect x="42" y="${141 + i * 30}" width="${96 - i * 8}" height="7" rx="3.5" fill="#2A3350" opacity=".8"/>
      <rect x="42" y="${152 + i * 30}" width="${140 - i * 12}" height="5" rx="2.5" fill="#C9CFDA"/>`).join('')}
    ${lines(18, 274, 120, 1)}`),

  fields:[
    { t:'group', label:'Zutritt' },
    { k:'code', label:'Zutrittscode', type:'text',
      hint:'Das Grösste auf dem Blatt. Wer nachts vor der Tür steht, findet sonst nichts anderes.' },
    { k:'codeHinweis', label:'Zusatz zum Code', type:'text',
      hint:'Zum Beispiel «gültig ab 15:00» oder «gilt für Haustür und Zimmer».' },
    { k:'telefon', label:'Telefon für den Notfall', type:'text' },

    { t:'group', label:'Anordnung und Sprachen' },
    { k:'anordnung', label:'Anordnung', type:'select', options:[
      { v:'zusammen', t:'alle Sprachen auf einem Blatt — zum Aushängen' },
      { v:'einzeln',  t:'eine Seite je Sprache — zum Mitgeben' }
    ] },
    { k:'sprachen', label:'Sprachen', type:'checks', options:sprachOptions() },
    { k:'sprachSet', label:'Fertige Zusammenstellung', type:'select', options:sprachSetOptions() },

    { t:'group', label:'QR-Code' },
    { k:'qrText', label:'Adresse für den QR-Code', type:'text',
      hint:'Leer lassen: kein Code. Sonst z. B. die Anfahrtsseite oder die Gästemappe.' },
    { k:'qrLabel', label:'Beschriftung am Code', type:'text' },

    { t:'group', label:'Objekt und Absender' },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions },

    { t:'group', label:'Schritte überschreiben' },
    { t:'note',  label:'Leer lassen heisst: der hinterlegte Text gilt. Überschrieben wird nur, was hier steht — und nur auf Deutsch. Die anderen Sprachen bleiben, wie sie sind.' },
    ...CHECKIN_SCHRITTE.map((s, i) => ({
      k:`s${i + 1}TDE`, label:`Schritt ${i + 1} — Titel`, type:'text'
    })),
    ...CHECKIN_SCHRITTE.map((s, i) => ({
      k:`s${i + 1}SDE`, label:`Schritt ${i + 1} — Text`, type:'textarea', rows:2
    }))
  ],

  defaults:{
    code:'1 4 7 2',
    codeHinweis:'Gilt für die Haustür, rund um die Uhr',
    telefon:'+41 31 951 85 54',
    anordnung:'zusammen',
    sprachen:['de','en'],
    sprachSet:'',
    qrText:'',
    qrLabel:'Gästemappe',
    objekt:'A14',
    absender:'hotel'
  },

  actions:{
    setSprachen(d){
      const ids = sprachSet(d.sprachSet);
      return ids ? { ...d, sprachen:ids } : d;
    }
  },

  render(d){
    const abs = absender(d.absender, 'hotel');
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const sprachen = sprachObjekte(d.sprachen);
    const einzeln = d.anordnung === 'einzeln' && sprachen.length > 1;

    const qr = has(d.qrText)
      ? `<div class="t-checkin-qr">${qrSvg(d.qrText, { stufe:'M', groesse:'22mm' })}
           ${has(d.qrLabel) ? `<span>${esc(d.qrLabel)}</span>` : ''}</div>`
      : '';

    const kopf = (sp) => {
      const k = CHECKIN_KOPF[sp] || CHECKIN_KOPF.de;
      return `
        <header class="t-checkin-kopf">
          <p class="eyebrow">${esc(k.eyebrow)}</p>
          <h1>${esc(k.titel)}</h1>
          ${(obj.code || adr) ? `<p class="t-checkin-obj">${esc([obj.name, adr].filter(Boolean).join(' · '))}</p>` : ''}
        </header>

        <div class="t-checkin-code">
          <span class="t-checkin-code-label">${esc(k.code)}</span>
          <strong>${esc(d.code || '––––')}</strong>
          ${has(d.codeHinweis) ? `<span class="t-checkin-code-zusatz">${esc(d.codeHinweis)}</span>` : ''}
        </div>`;
    };

    const fuss = `
      <footer class="t-checkin-fuss">
        <span class="t-checkin-mark">${istHotel(d.absender) ? logo('color', 26) : ''}</span>
        <span>${esc(abs.foot)}</span>
        ${qr}
      </footer>`;

    /* Eine Seite je Sprache — für den Ausdruck, den man dem Gast mitgibt. */
    if (einzeln){
      return sprachen.map(sp => `
        <article data-page class="t-checkin-page">
          ${kopf(sp.id)}
          ${checkinBlock(d, sp.id, true)}
          ${fuss}
        </article>`).join('');
    }

    /* Alles auf einem Blatt — für die Tür. Der Kopf steht in der ersten
       gewählten Sprache, die Schritte stehen darunter in allen. */
    return `
      ${kopf(sprachen[0].id)}
      <div class="t-checkin-spalten" data-spalten="${sprachen.length}">
        ${sprachen.map(sp => checkinBlock(d, sp.id, false)).join('')}
      </div>
      ${fuss}`;
  }
};
