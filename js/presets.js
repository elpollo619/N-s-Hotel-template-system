/* ==========================================================================
   Textbausteine der bestehenden Aushänge
   --------------------------------------------------------------------------
   Übernommen aus J:\Immobilien\Plakate — die Wortlaute stammen eins zu eins
   aus den Word-Dateien, die im Haus seit Jahren im Einsatz sind. Nichts
   umformuliert, nichts erfunden; nur Schweizer Schreibweise (ss statt ß)
   und die Umlaute wurden geprüft.

   Jeder Baustein füllt die Vorlage "Hinweis" aus. Wer etwas anderes braucht,
   wählt "Frei" und schreibt selbst.
   ========================================================================== */

export const KATEGORIEN = [
  { id:'hausordnung', label:'Hausordnung und Verbote' },
  { id:'abfall',      label:'Abfall und Recycling' },
  { id:'parken',      label:'Parkieren' },
  { id:'kueche',      label:'Küche und Bad' },
  { id:'waesche',     label:'Waschen und Trocknen' },
  { id:'vermietung',  label:'Vermietung' },
  { id:'hotel',       label:'Hotel und Gäste' },
  { id:'technik',     label:'Technik und Unterhalt' }
];

/* ton: 'info' | 'warnung' | 'verbot' — steuert die Farbe des Kopfbalkens. */
export const PRESETS = [
  /* ── Hausordnung und Verbote ─────────────────────────────────────────── */
  {
    id:'frei', cat:'hausordnung', ton:'info', icon:'info',
    label:'Frei — eigener Text',
    title:'Titel eingeben', de:'', en:'', it:''
  },
  {
    id:'rauchverbot', cat:'hausordnung', ton:'verbot', icon:'smoke',
    label:'Rauchverbot im gesamten Gebäude',
    title:'Rauchverbot im gesamten Gebäude',
    de:'Stellen wir fest, dass an der Brandmeldeanlage manipuliert worden ist, wird das Mietverhältnis per sofort wegen Gefährdung von Leib und Leben aufgelöst.',
    en:'No smoking anywhere in the building.',
    it:''
  },
  {
    id:'substanzen', cat:'hausordnung', ton:'verbot', icon:'warn',
    label:'Verbotene Substanzen',
    title:'Verbotene Substanzen',
    de:'Das Konsumieren von verbotenen Substanzen ist untersagt. Bei Missbrauch wird sofort die Polizei informiert.',
    en:'The consumption of prohibited substances is forbidden. In case of abuse, the police will be informed immediately.',
    it:'È vietato il consumo di sostanze proibite. In caso di abuso, la polizia sarà immediatamente informata.'
  },
  {
    id:'cannabis', cat:'hausordnung', ton:'warnung', icon:'warn',
    label:'Cannabis und Betäubungsmittel',
    title:'Betäubungsmittel',
    de:'Bei uns sind von Mitbewohnern Reklamationen wegen Cannabis-Gestank eingegangen. Wir weisen Sie darauf hin, dass wir den Konsum von Cannabis, wie auch sonstigen Betäubungsmittel in und um unser Gebäude nicht dulden. Im Wiederholungsfall werden wir die Polizei einschalten.',
    en:'', it:''
  },
  {
    id:'video', cat:'hausordnung', ton:'warnung', icon:'warn',
    label:'Videoüberwachung',
    title:'Dieser Bereich wird videoüberwacht!',
    de:'', en:'This area is under video surveillance!', it:''
  },
  {
    id:'tuere', cat:'hausordnung', ton:'info', icon:'door',
    label:'Bitte Türe schliessen',
    title:'Bitte Türe schliessen!',
    de:'', en:'Please close the door!', it:''
  },
  {
    id:'abstellflaeche', cat:'hausordnung', ton:'verbot', icon:'warn',
    label:'Hier ist keine Abstellfläche',
    title:'Hier ist keine Abstellfläche!',
    de:'Bitte entfernen Sie sämtliche persönliche Gegenstände. Wir werden alles wegräumen.\nVelos und Trottis dürfen Sie in die Einstellhalle parkieren.',
    en:'', it:''
  },

  {
    id:'schluessel', cat:'hausordnung', ton:'info', icon:'key',
    label:'Schlüssel nicht stecken lassen',
    title:'Bitte Schlüssel nicht stecken lassen',
    de:'', en:'Please remove the key', fr:'', it:'', pt:''
  },
  {
    id:'ruhezeit', cat:'hausordnung', ton:'info', icon:'clock',
    label:'Ruhezeiten',
    title:'Ruhezeit',
    de:'22:00 – 07:00 Uhr sowie am Sonntag den ganzen Tag. Bitte Rücksicht auf die Mitbewohner nehmen.',
    en:'Quiet hours 22:00 – 07:00 and all day on Sunday.', fr:'', it:'', pt:''
  },
  {
    id:'leise', cat:'hausordnung', ton:'info', icon:'info',
    label:'Bitte leise',
    title:'Bitte leise',
    de:'Im Treppenhaus und auf den Gängen bitte leise sprechen. Die Wände sind dünner, als sie aussehen.',
    en:'Please keep it quiet in the stairwell and hallways.', fr:'', it:'', pt:''
  },
  {
    id:'fenster', cat:'hausordnung', ton:'info', icon:'info',
    label:'Fenster geschlossen halten',
    title:'Bitte Fenster geschlossen halten',
    de:'Sämtliche Zimmer verfügen über eine mechanische Belüftung, welche das gesamte Raumvolumen pro Tag rund 15 Mal wechselt. Aus diesem Grund sollten die Fenster geschlossen bleiben. Die dreifach verglasten Scheiben halten zudem den Aussenlärm ab, damit Sie ruhig schlafen können.',
    en:'All rooms have mechanical ventilation that exchanges the entire room volume about 15 times a day, so the windows should stay closed. The triple glazing also keeps out street noise so you can sleep peacefully.',
    fr:'', it:'', pt:''
  },
  {
    id:'besucher', cat:'hausordnung', ton:'info', icon:'door',
    label:'Besucher anmelden',
    title:'Besuch',
    de:'Besucherinnen und Besucher sind willkommen. Bitte begleiten Sie Ihren Besuch beim Betreten und Verlassen des Hauses und melden Sie Übernachtungen vorher an.',
    en:'', fr:'', it:'', pt:''
  },

  /* ── Abfall und Recycling ────────────────────────────────────────────── */
  {
    id:'saecke', cat:'abfall', ton:'info', icon:'trash',
    label:'Abfall nur in Säcken',
    title:'Abfall nur in Säcken',
    de:'', en:'Waste in official bags only', it:''
  },
  {
    id:'nurpet', cat:'abfall', ton:'info', icon:'bottle',
    label:'Nur PET',
    title:'Nur PET',
    de:'Bitte hier ausschliesslich PET-Getränkeflaschen einwerfen. Übriger Abfall gehört in den Kehrichtsack.',
    en:'PET drink bottles only', it:''
  },
  {
    id:'petluft', cat:'abfall', ton:'info', icon:'bottle',
    label:'PET — Luft rauslassen',
    title:'Bitte die Luft rauslassen',
    de:'Flasche zusammendrücken, Deckel wieder aufschrauben. So passt dreimal mehr in den Sack.',
    en:'Please squeeze the bottle and screw the cap back on.', it:''
  },
  {
    id:'sammelstelle', cat:'abfall', ton:'info', icon:'trash',
    label:'Sammelstelle — Beschriftung',
    title:'Sammelstelle',
    de:'Karton · Altpapier · Altglas · Metall · Nespresso · PET · Kompost · Kehricht',
    en:'', it:''
  },

  {
    id:'papierkarton', cat:'abfall', ton:'info', icon:'trash',
    label:'Sauberes Papier und Karton',
    title:'Sauberes Papier + Karton',
    de:'Kein beschichtetes Papier, keine Verbundverpackungen.',
    en:'Clean paper and cardboard only', fr:'', it:'', pt:''
  },

  /* ── Parkieren ───────────────────────────────────────────────────────── */
  {
    id:'privatpp', cat:'parken', ton:'verbot', icon:'car',
    label:'Privater Parkplatz',
    title:'Privat',
    de:'Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt.',
    en:'Private parking — vehicles parked illegally will be towed at the ownerʼs expense.',
    it:''
  },
  {
    id:'besucherpp', cat:'parken', ton:'info', icon:'car',
    label:'Besucherparkplatz',
    title:'Lieber Parkplatz-Benutzer',
    de:'Sie parken Ihr Fahrzeug auf einem privaten Parkplatz, der für Besucher reserviert ist. Falls Sie kein Besucher der {{adresse}} sind, bitten wir Sie, Ihr Fahrzeug umgehend umzustellen.\n\nDieser Parkplatz ist ausschliesslich für Besucher vorgesehen.\n\nVielen Dank für Ihr Verständnis.',
    en:'', it:''
  },
  {
    id:'parkverbot', cat:'parken', ton:'verbot', icon:'car',
    label:'Parkverbot',
    title:'Parkverbot',
    de:'Auf dem gesamten Areal gilt Parkverbot. Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt.',
    en:'No parking. Vehicles parked illegally will be towed at the ownerʼs expense.',
    it:''
  },

  {
    id:'fahrzeug', cat:'parken', ton:'warnung', icon:'car',
    label:'Fahrzeug unberechtigt abgestellt (DE/FR/PT)',
    title:'Unberechtigt abgestelltes Fahrzeug',
    de:'Dieses Fahrzeug steht in der Zufahrt zu bzw. auf einem unberechtigten Platz unserer Liegenschaft {{adresse}}!\n\nFalls Sie Besucher eines Bewohners dieser Liegenschaft sind, erkundigen Sie sich bei dem betreffenden Bewohner, wo das Fahrzeug berechtigterweise abgestellt werden kann.\n\nWird das Fahrzeug erneut unberechtigt abgestellt, werden wir Anzeige bei der Polizei erstatten!',
    en:'',
    fr:'Ce véhicule est parqué dans une zone interdite de notre bien foncier {{adresse}}! Si vous êtes visiteur de ce bien foncier, nous vous prions de vous renseigner sur un lieu autorisé pour parquer votre véhicule. Si le véhicule est à nouveau garé sans autorisation, nous le signalons à la police!',
    it:'',
    pt:'Este veículo está estacionado em uma área proibida, qual pertence à propriedade {{adresse}}! Se você for um visitante desse endereço, solicitamos que informe-se sobre um local autorizado para estacionar seu veículo. Se o veículo for estacionado novamente sem autorização, será denunciado à polícia!'
  },

  /* ── Küche und Bad ───────────────────────────────────────────────────── */
  {
    id:'kuechesauber', cat:'kueche', ton:'info', icon:'cup',
    label:'Küche sauber hinterlassen',
    title:'Bitte Küche sauber hinterlassen!',
    de:'Bitte Küche, Geräte, Küchenutensilien und Geschirr nach Gebrauch reinigen.',
    en:'Please keep the kitchen clean!', it:''
  },
  {
    id:'kuehlschrank', cat:'kueche', ton:'info', icon:'info',
    label:'Kühlschrank in Ordnung halten',
    title:'Kühlschrank',
    de:'Abgelaufene Lebensmittel im Kühlschrank sind zu entsorgen. Der Kühlschrank ist sauber zu halten. Danke.',
    en:'Expired food in the fridge must be disposed of. The fridge must be kept clean. Thank you.',
    it:'Gli alimenti scaduti nel frigorifero devono essere smaltiti. Il frigorifero deve essere mantenuto pulito. Grazie.'
  },
  {
    id:'haendewaschen', cat:'kueche', ton:'info', icon:'info',
    label:'Bitte Hände waschen',
    title:'Bitte Hände waschen',
    de:'', en:'Please wash your hands', it:''
  },
  {
    id:'duschen', cat:'kueche', ton:'info', icon:'info',
    label:'Duschen statt baden',
    title:'Bitte kurz duschen',
    de:'Diese Dusche steht nur den Bewohnern des EGʼs zur Verfügung.\nEs darf nur kurz geduscht werden, damit genügend Warmwasser für alle Bewohner zur Verfügung steht.',
    en:'', it:''
  },

  {
    id:'backofen', cat:'kueche', ton:'info', icon:'cup',
    label:'Backofen nur mit Backpapier',
    title:'Bitte Backofen nur mit Backtrennpapier benützen',
    de:'Das Papier ist mehrmals benutzbar.',
    en:'Please use the oven only with baking paper.', fr:'', it:'', pt:''
  },
  {
    id:'geschirr', cat:'kueche', ton:'verbot', icon:'cup',
    label:'Kein Geschirr entfernen',
    title:'Kein Geschirr, Gläser, Pfannen und Küchengeräte aus diesem Raum entfernen',
    de:'', en:'', fr:'', it:'', pt:''
  },

  /* ── Waschen und Trocknen ────────────────────────────────────────────── */
  {
    id:'waschmaschine', cat:'waesche', ton:'info', icon:'info',
    label:'Gebrauch der Waschmaschine',
    title:'Waschmaschine',
    de:'Bitte nach jedem Waschgang das Flusensieb reinigen und die Trommel offen stehen lassen. Waschmittel sparsam dosieren.',
    en:'', it:''
  },
  {
    id:'waeschehaengen', cat:'waesche', ton:'info', icon:'info',
    label:'Wäsche aufhängen',
    title:'Wäsche bitte im Trocknungsraum aufhängen',
    de:'Im Zimmer aufgehängte Wäsche führt zu Feuchtigkeit und Schimmel. Bitte den Trocknungsraum benutzen.',
    en:'Please hang your laundry in the drying room, not in your room.', fr:'', it:'', pt:''
  },
  {
    id:'waeschehaenge', cat:'waesche', ton:'info', icon:'info',
    label:'Trockene Wäsche abnehmen (DE/EN/FR)',
    title:'Wäschehänge',
    de:'Bitte nimm deine trockene Kleidung sofort von der Wäschehänge. Wenn du Kleidung aufhängen möchtest und keinen freien Platz findest, darfst du trockene Kleidung anderer Gäste vorsichtig von der Wäschehänge nehmen, ordentlich in den Korb legen und die Wäschehänge benutzen.',
    en:'Please remove your dried clothes from the drying rack as soon as they are dry. If you would like to hang up clothes and there is no free space available, you may carefully remove dry clothes belonging to other guests from the drying rack, place them neatly in the basket, and use the rack.',
    fr:'Merci de retirer tes vêtements de lʼétendoir dès quʼils sont secs. Si tu souhaites étendre des vêtements et quʼil nʼy a plus de place disponible, tu peux retirer soigneusement les vêtements secs des autres invités de lʼétendoir, les placer correctement dans le panier et utiliser lʼétendoir.',
    it:'', pt:''
  },

  /* ── Vermietung ──────────────────────────────────────────────────────── */
  {
    id:'zuvermieten', cat:'vermietung', ton:'info', icon:'key',
    label:'Zu vermieten',
    title:'Zu vermieten',
    de:'Wohnung an ruhiger Lage, bezugsbereit. Anfragen über den QR-Code oder telefonisch.',
    en:'Apartment for rent — scan the QR code or call us.', it:''
  },
  {
    id:'reserviert', cat:'vermietung', ton:'info', icon:'key',
    label:'Reserviert',
    title:'RESERVIERT',
    de:'Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt.',
    en:'', it:''
  },

  /* ── Hotel und Gäste ─────────────────────────────────────────────────── */
  {
    id:'checkin', cat:'hotel', ton:'info', icon:'key',
    label:'Check-in Anleitung',
    title:'Check-in',
    de:'Ihren Zimmercode erhalten Sie per E-Mail und SMS. Am Eingang den Code eingeben und bestätigen.',
    en:'You receive your room code by e-mail and SMS. Enter the code at the entrance and confirm.', it:''
  },
  {
    id:'checkout', cat:'hotel', ton:'info', icon:'clock',
    label:'Express Check-out',
    title:'Express Check-out',
    de:'Zimmerschlüssel in die Box legen und abreisen. Die Rechnung kommt per E-Mail.',
    en:'Drop the key in the box and leave. The invoice follows by e-mail.', it:''
  },
  {
    id:'fruehstueck', cat:'hotel', ton:'info', icon:'cup',
    label:'Frühstück',
    title:'Frühstück',
    de:'Frühstück 07:30 – 10:00 im Aufenthaltsraum.',
    en:'Breakfast 07:30 – 10:00 in the lounge.', it:''
  },
  {
    id:'storage', cat:'hotel', ton:'info', icon:'info',
    label:'Gepäckraum',
    title:'Gepäckraum · Storage',
    de:'Gepäck kann vor dem Check-in und nach dem Check-out hier abgestellt werden. Keine Haftung für Wertsachen.',
    en:'Luggage may be left here before check-in and after check-out. No liability for valuables.', it:''
  },

  {
    id:'rauchhotel', cat:'hotel', ton:'verbot', icon:'smoke',
    label:'Rauchverbot im Zimmer (mit Kostenfolge)',
    title:'Rauchverbot',
    de:'In sämtlichen Räumen ist das Rauchen strengstens untersagt. Das gesamte Gebäude ist zu Ihrer Sicherheit mit Rauchmeldern ausgestattet, welche bei der geringsten Rauchentwicklung Alarm auslösen. Der Alarm geht direkt zur örtlichen Feuerwehr. Ein Fehlalarm zieht automatisch hohe Kosten (über CHF 1ʼ800.–) nach sich, welche dem fehlbaren Gast weiterverrechnet werden.\n\nGästen, welche sich nicht an diese Weisung halten, wird eine Reinigungspauschale von CHF 300.– in Rechnung gestellt.',
    en:'Smoking is strictly prohibited in all rooms. The entire building is equipped with smoke detectors that trigger an alarm at the slightest smoke. The alarm goes directly to the local fire department. A false alarm automatically incurs high costs (over CHF 1ʼ800), which will be charged to the responsible guest. Guests who do not comply will be charged a cleaning fee of CHF 300.–',
    fr:'', it:'', pt:''
  },
  {
    id:'checkoutkarte', cat:'hotel', ton:'info', icon:'key',
    label:'Check-out mit Zimmerkarte',
    title:'Check-out',
    de:'Beim Verlassen des Zimmers lassen Sie bitte die physische Zimmerkarte auf dem Schreibtisch und senden uns eine Kurzmitteilung «check-out erfolgt». Besten Dank und einen angenehmen Aufenthalt.',
    en:'When leaving the room, please leave the physical room card on the desk and send us a short message saying “check-out completed”. Thank you and have a pleasant stay.',
    fr:'', it:'', pt:''
  },
  {
    id:'wlan', cat:'hotel', ton:'info', icon:'wifi',
    label:'WLAN',
    title:'welcome to Nʼs HOTEL',
    de:'WLAN: Gast\nPasswort: · · · · · · · ·\n\nDas Passwort im Editor eintragen — es bleibt in diesem Browser und wird nie mitveröffentlicht.',
    en:'', fr:'', it:'', pt:''
  },

  /* ── Technik und Unterhalt ───────────────────────────────────────────── */
  {
    id:'brandmelder', cat:'technik', ton:'warnung', icon:'warn',
    label:'Brand- und Rauchmelder',
    title:'Manipulation an Brand- und Rauchmeldern',
    de:'Jede Manipulation an der Brandmeldeanlage hat zur Folge, dass im Brandfall die Alarmierung der Feuerwehr nicht funktioniert und dass Ihr und das Leben Ihrer Mitbewohner auf dem Spiel steht.\n\nDer Einsatz der Feuerwehr bei einem Fehlalarm wird mit CHF 1ʼ500.– geahndet und wird dem Verursacher in Rechnung gestellt.',
    en:'', it:''
  },
  {
    id:'kontrolle', cat:'technik', ton:'warnung', icon:'warn',
    label:'Kontrolle angekündigt',
    title:'ACHTUNG',
    de:'Am {{datum}} findet eine Kontrolle in allen Zimmern statt.\nBitte alle Steckdosen freihalten!',
    en:'On {{datum}} all rooms will be checked.\nPlease keep all plug sockets free!', it:''
  },
  {
    id:'hauseingang', cat:'technik', ton:'info', icon:'door',
    label:'Hauseingangstüre schliessen',
    title:'Wichtiger Hinweis zur Hauseingangstür',
    de:'Bitte achten Sie beim Betreten und Verlassen des Gebäudes darauf, dass die Tür richtig ins Schloss fällt und nicht offensteht.\n\nNur berechtigte Personen — also ausschliesslich Mieterinnen und Mieter sowie deren Gäste — sollen Zugang zum Haus haben.',
    en:'', it:''
  }
];

/** Alle Bausteine einer Kategorie. */
export function presetsOf(cat){
  return PRESETS.filter(p => p.cat === cat);
}

/** Auswahlliste, nach Kategorie gruppiert beschriftet. */
export function presetOptions(){
  return KATEGORIEN.flatMap(k =>
    presetsOf(k.id).map(p => ({ v:p.id, t:`${k.label} · ${p.label}` }))
  );
}

export function preset(id){
  return PRESETS.find(p => p.id === id) || PRESETS[0];
}
