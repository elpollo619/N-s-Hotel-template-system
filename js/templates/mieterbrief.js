/* Mieterbrief · A4 hoch.
   Für die Schreiben, die im Laufwerk als Word-Dateien liegen und keinen
   Aushang, sondern einen Brief mit Briefkopf brauchen — "Wichtiger Hinweis
   zur Hauseingangstür", "Lieber Parkplatz-Benutzer", "Manipulation an
   Brand- und Rauchmelder".

   Aufbau nach der bestehenden Korrespondenz: Absenderzeile oben, Anrede,
   Fliesstext, Grussformel, Rechtszeile unten. */
import { esc, fmt, has } from '../lib/dom.js';
import { logo } from '../lib/brand.js';
import { thumb, lines } from '../lib/thumbs.js';
import { ABSENDER, objekt, objektAdresse, istHotel, objektOptions, absenderOptions } from '../objekte.js';

const BRIEFE = {
  frei: {
    label:'Frei — eigener Text', betreff:'', text:''
  },
  hauseingang: {
    label:'Hauseingangstür schliessen',
    betreff:'Wichtiger Hinweis zur Hauseingangstür',
    text:'aus aktuellem Anlass möchten wir Sie daran erinnern, dass die Hauseingangstür stets geschlossen zu halten ist. Bitte achten Sie beim Betreten und Verlassen des Gebäudes darauf, dass die Tür richtig ins Schloss fällt und nicht offensteht.\n\nDer Schutz Ihrer Sicherheit und die der anderen Hausbewohner hat höchste Priorität. Nur berechtigte Personen — also ausschliesslich Mieterinnen und Mieter sowie deren Gäste — sollen Zugang zum Haus haben. Unbefugten ist der Zutritt zu verwehren.\n\nVielen Dank für Ihr Verständnis und Ihre Mithilfe!'
  },
  besucherpp: {
    label:'Besucherparkplatz',
    betreff:'Lieber Parkplatz-Benutzer',
    text:'Sie parken Ihr Fahrzeug auf einem privaten Parkplatz, der für Besucher reserviert ist. Falls Sie kein Besucher der {{adresse}} sind, bitten wir Sie, Ihr Fahrzeug umgehend umzustellen.\n\nDieser Parkplatz ist ausschliesslich für Besucher vorgesehen.\n\nVielen Dank für Ihr Verständnis.'
  },
  brandmelder: {
    label:'Manipulation am Brandmelder',
    betreff:'Manipulation an Brand- und Rauchmelder in Ihrem Zimmer',
    text:'wie Sie den beiliegenden Unterlagen entnehmen können, löste die Brandmeldeanlage eine Störungsmeldung aus. Die Sirene bei der Brandmeldeanlage störte den Schlaf der Mitbewohner, wir mussten extra ausrücken und die Störung quittieren. Zudem musste der Techniker der Brandmeldeanlage vor Ort die Störung beheben.\n\nDer Grund für die Störungsmeldung war, dass Sie den Brandmelder manipuliert haben. Aus diesem Grund verrechnen wir Ihnen gem. beiliegender Rechnung unseren Aufwand.\n\nJede Manipulation an der Brandmeldeanlage hat zur Folge, dass im Brandfall die Alarmierung der Feuerwehr nicht funktioniert und dass Ihr und das Leben Ihrer Mitbewohner auf dem Spiel steht. Im Extremfall wird gegen Sie eine Strafuntersuchung wegen Gefährdung von Leib und Leben eingeleitet.\n\nWir weisen Sie nochmals darauf hin, dass das Rauchen im Zimmer auch bei geöffnetem Fenster strengstens untersagt ist.\n\nDer Einsatz der Feuerwehr bei einem Fehlalarm wird mit CHF 1ʼ500.– geahndet und wird dem Verursacher in Rechnung gestellt.'
  }
};

export default {
  id:'mieterbrief',
  title:'Mieterbrief',
  sub:'Schreiben mit Briefkopf · A4 hoch',
  badge:'Brief',
  page:'a4',
  root:'t-mieterbrief',
  cat:'hausordnung',

  thumb: thumb(`
    <rect x="18" y="18" width="60" height="10" rx="3" fill="#2A3350"/>
    <rect x="18" y="70" width="90" height="6" rx="3" fill="#C9CFDA"/>
    ${lines(18, 84, 70, 2, 9, '#E5E8ED')}
    <rect x="18" y="120" width="120" height="10" rx="3" fill="#2A3350"/>
    ${lines(18, 146, 174, 3)}
    ${lines(18, 190, 174, 3)}
    ${lines(18, 234, 100, 2)}
    <rect x="18" y="268" width="90" height="6" rx="3" fill="#2A3350"/>
    <rect x="18" y="286" width="174" height="4" rx="2" fill="#E5E8ED"/>`),

  fields:[
    { t:'group', label:'Vorlage' },
    { k:'briefId', label:'Fertiger Brief', type:'select',
      options:Object.entries(BRIEFE).map(([v, b]) => ({ v, t:b.label })) },
    { k:'apply', label:'Brief übernehmen', type:'action',
      hint:'Überschreibt Betreff und Text.' },

    { t:'group', label:'Absender und Objekt' },
    { k:'absender', label:'Absender',     type:'select', options:absenderOptions() },
    { k:'objekt',   label:'Liegenschaft', type:'select', options:objektOptions() },

    { t:'group', label:'Empfänger' },
    { k:'empfaenger', label:'Anschrift', type:'textarea',
      hint:'Leer lassen, wenn der Brief als Aushang im Treppenhaus hängt.' },
    { k:'ort',    label:'Ort und Datum', type:'text' },

    { t:'group', label:'Inhalt' },
    { k:'betreff', label:'Betreff', type:'text' },
    { k:'anrede',  label:'Anrede',  type:'text' },
    { k:'text',    label:'Text',    type:'textarea', hint:'**fett** möglich' },
    { k:'gruss',   label:'Grussformel', type:'text' },
    { k:'signatur',label:'Unterschrift', type:'text' }
  ],

  defaults:{
    briefId:'hauseingang',
    absender:'architektur',
    objekt:'-',
    empfaenger:'',
    ort:'Muri b. Bern, ',
    betreff:'Wichtiger Hinweis zur Hauseingangstür',
    anrede:'Liebe Mieterinnen und Mieter,',
    text:BRIEFE.hauseingang.text,
    gruss:'Freundliche Grüsse',
    signatur:'Die Verwaltung'
  },

  actions:{
    apply(d){
      const b = BRIEFE[d.briefId] || BRIEFE.frei;
      return { ...d, betreff:b.betreff, text:b.text };
    }
  },

  render(d){
    const abs = ABSENDER[d.absender] || ABSENDER.architektur;
    const obj = objekt(d.objekt);
    const adr = objektAdresse(d.objekt);
    const body = String(d.text || '')
      .replace(/\{\{adresse\}\}/g, adr || obj.name)
      .replace(/\{\{objekt\}\}/g, obj.name);

    return `
    <header class="t-mieterbrief-head">
      <p class="t-mieterbrief-abs">${esc(abs.name)}</p>
      <span class="t-mieterbrief-mark">${istHotel(d.absender) ? logo('color', 30) : ''}</span>
    </header>

    <div class="t-mieterbrief-meta">
      <div class="t-mieterbrief-to">
        ${has(d.empfaenger) ? esc(d.empfaenger).replace(/\n/g, '<br>') : ''}
      </div>
      <p class="t-mieterbrief-date">${esc(d.ort || '')}</p>
    </div>

    ${(obj.code || adr) ? `<p class="t-mieterbrief-obj">${esc(obj.code)}${adr ? ' · ' + esc(adr) : ''}</p>` : ''}

    <h1 class="t-mieterbrief-betreff">${esc(d.betreff)}</h1>
    ${has(d.anrede) ? `<p class="t-mieterbrief-anrede">${esc(d.anrede)}</p>` : ''}
    <div class="t-mieterbrief-text">${fmt(body)}</div>

    <div class="t-mieterbrief-sign">
      ${has(d.gruss) ? `<p>${esc(d.gruss)}</p>` : ''}
      ${has(d.signatur) ? `<p class="t-mieterbrief-name">${esc(d.signatur)}</p>` : ''}
      <p class="t-mieterbrief-legal">${esc(abs.legal)}</p>
    </div>

    <footer class="t-mieterbrief-foot">${esc(abs.foot)}</footer>`;
  }
};
