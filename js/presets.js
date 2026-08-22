/* ==========================================================================
   Textbausteine der bestehenden Aushänge — sechssprachig
   --------------------------------------------------------------------------
   Übernommen aus J:\Immobilien\Plakate. Die DEUTSCHEN Wortlaute stammen eins
   zu eins aus den Word-Dateien, die im Haus seit Jahren im Einsatz sind:
   nichts umformuliert, nichts erfunden; nur Schweizer Schreibweise (ss statt
   ß) und die Umlaute wurden geprüft. Ebenso verbatim übernommen sind die
   französische und die portugiesische Fassung von "Fahrzeug unberechtigt
   abgestellt" und die französische von "Wäschehänge" — die lagen im
   Laufwerk bereits vor.

   Alle übrigen Fassungen in EN, FR, IT, PT und ES sind hier neu erstellt.
   Sie sind sorgfältig gemacht und sinngetreu, aber sie sind Übersetzungen:
   Wo ein Aushang Rechtsfolgen androht — Kündigung, Anzeige, Kostenfolge —,
   gilt im Zweifel die deutsche Fassung. Wer ganz sicher gehen will, lässt
   den betreffenden Text von einer muttersprachlichen Person gegenlesen.

   Aufbau eines Bausteins:

     titel: { de, en, fr, it, pt, es }   die Überschrift je Sprache
     text:  { de, en, fr, it, pt, es }   der Fliesstext je Sprache

   Ein leerer Text ist Absicht: manche Aushänge bestehen nur aus der
   Überschrift, und die wirkt grösser, wenn nichts darunter steht.

   Platzhalter: {{adresse}} {{objekt}} {{datum}} — die Vorlage setzt sie ein.
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

const LEER = { de:'', en:'', fr:'', it:'', pt:'', es:'' };

/* ton: 'info' | 'warnung' | 'verbot' — steuert die Farbe des Kopfbalkens. */
export const PRESETS = [
  /* ── Hausordnung und Verbote ─────────────────────────────────────────── */
  {
    id:'frei', cat:'hausordnung', ton:'info', icon:'info',
    label:'Frei — eigener Text',
    titel:{ de:'Titel eingeben', en:'Enter a title', fr:'Saisir un titre',
            it:'Inserire un titolo', pt:'Introduzir um título', es:'Escriba un título' },
    text:{ ...LEER }
  },
  {
    id:'rauchverbot', cat:'hausordnung', ton:'verbot', icon:'smoke',
    label:'Rauchverbot im gesamten Gebäude',
    titel:{
      de:'Rauchverbot im gesamten Gebäude',
      en:'No smoking anywhere in the building',
      fr:'Interdiction de fumer dans tout le bâtiment',
      it:'Divieto di fumare in tutto lʼedificio',
      pt:'Proibido fumar em todo o edifício',
      es:'Prohibido fumar en todo el edificio' },
    text:{
      de:'Stellen wir fest, dass an der Brandmeldeanlage manipuliert worden ist, wird das Mietverhältnis per sofort wegen Gefährdung von Leib und Leben aufgelöst.',
      en:'If we find that the fire alarm system has been tampered with, the tenancy will be terminated with immediate effect for endangering life and limb.',
      fr:'Si nous constatons que le système de détection dʼincendie a été manipulé, le bail sera résilié avec effet immédiat pour mise en danger de la vie dʼautrui.',
      it:'Se accertiamo che lʼimpianto di rilevazione incendi è stato manomesso, il contratto di locazione verrà risolto con effetto immediato per messa in pericolo dellʼincolumità delle persone.',
      pt:'Se constatarmos que o sistema de deteção de incêndio foi manipulado, o contrato de arrendamento será rescindido de imediato por colocar vidas em perigo.',
      es:'Si comprobamos que se ha manipulado el sistema de detección de incendios, el contrato de arrendamiento se rescindirá de inmediato por poner en peligro la vida de las personas.' }
  },
  {
    id:'substanzen', cat:'hausordnung', ton:'verbot', icon:'warn',
    label:'Verbotene Substanzen',
    titel:{
      de:'Verbotene Substanzen', en:'Prohibited substances', fr:'Substances interdites',
      it:'Sostanze proibite', pt:'Substâncias proibidas', es:'Sustancias prohibidas' },
    text:{
      de:'Das Konsumieren von verbotenen Substanzen ist untersagt. Bei Missbrauch wird sofort die Polizei informiert.',
      en:'The consumption of prohibited substances is forbidden. In case of abuse, the police will be informed immediately.',
      fr:'La consommation de substances interdites est prohibée. En cas dʼabus, la police sera immédiatement informée.',
      it:'È vietato il consumo di sostanze proibite. In caso di abuso, la polizia sarà immediatamente informata.',
      pt:'É proibido o consumo de substâncias ilícitas. Em caso de abuso, a polícia será imediatamente informada.',
      es:'Está prohibido el consumo de sustancias ilegales. En caso de infracción se avisará de inmediato a la policía.' }
  },
  {
    id:'cannabis', cat:'hausordnung', ton:'warnung', icon:'warn',
    label:'Cannabis und Betäubungsmittel',
    titel:{
      de:'Betäubungsmittel', en:'Narcotics', fr:'Stupéfiants',
      it:'Stupefacenti', pt:'Estupefacientes', es:'Estupefacientes' },
    text:{
      de:'Bei uns sind von Mitbewohnern Reklamationen wegen Cannabis-Gestank eingegangen. Wir weisen Sie darauf hin, dass wir den Konsum von Cannabis, wie auch sonstigen Betäubungsmittel in und um unser Gebäude nicht dulden. Im Wiederholungsfall werden wir die Polizei einschalten.',
      en:'We have received complaints from other residents about the smell of cannabis. Please note that we do not tolerate the consumption of cannabis or any other narcotics in or around our building. If it happens again, we will involve the police.',
      fr:'Des habitants se sont plaints dʼodeurs de cannabis. Nous vous rendons attentifs au fait que nous ne tolérons ni la consommation de cannabis ni celle dʼautres stupéfiants dans et autour de notre bâtiment. En cas de récidive, nous ferons appel à la police.',
      it:'Abbiamo ricevuto reclami da altri inquilini per lʼodore di cannabis. Vi informiamo che non tolleriamo il consumo di cannabis né di altri stupefacenti dentro e attorno al nostro edificio. In caso di recidiva ci rivolgeremo alla polizia.',
      pt:'Recebemos queixas de outros moradores por causa do cheiro a canábis. Informamos que não toleramos o consumo de canábis nem de outros estupefacientes dentro e à volta do nosso edifício. Em caso de reincidência, chamaremos a polícia.',
      es:'Hemos recibido quejas de otros residentes por el olor a cannabis. Le informamos de que no toleramos el consumo de cannabis ni de otros estupefacientes dentro ni alrededor de nuestro edificio. Si se repite, avisaremos a la policía.' }
  },
  {
    id:'video', cat:'hausordnung', ton:'warnung', icon:'warn',
    label:'Videoüberwachung',
    titel:{
      de:'Dieser Bereich wird videoüberwacht!',
      en:'This area is under video surveillance!',
      fr:'Cette zone est sous vidéosurveillance !',
      it:'Questʼarea è sorvegliata da videocamere!',
      pt:'Esta área está sob videovigilância!',
      es:'¡Esta zona está videovigilada!' },
    text:{ ...LEER }
  },
  {
    id:'tuere', cat:'hausordnung', ton:'info', icon:'door',
    label:'Bitte Türe schliessen',
    titel:{
      de:'Bitte Türe schliessen!', en:'Please close the door!',
      fr:'Merci de fermer la porte !', it:'Si prega di chiudere la porta!',
      pt:'Por favor, feche a porta!', es:'¡Cierre la puerta, por favor!' },
    text:{ ...LEER }
  },
  {
    id:'abstellflaeche', cat:'hausordnung', ton:'verbot', icon:'warn',
    label:'Hier ist keine Abstellfläche',
    titel:{
      de:'Hier ist keine Abstellfläche!', en:'This is not a storage area!',
      fr:'Cet espace nʼest pas une zone de dépôt !', it:'Questo non è un deposito!',
      pt:'Este espaço não é uma zona de arrumação!', es:'¡Esto no es una zona de almacenaje!' },
    text:{
      de:'Bitte entfernen Sie sämtliche persönliche Gegenstände. Wir werden alles wegräumen.\nVelos und Trottis dürfen Sie in die Einstellhalle parkieren.',
      en:'Please remove all personal belongings. Anything left behind will be cleared away.\nBicycles and scooters may be parked in the underground garage.',
      fr:'Merci de retirer tous vos objets personnels. Tout ce qui reste sera évacué.\nLes vélos et les trottinettes peuvent être garés dans le garage souterrain.',
      it:'Vi preghiamo di rimuovere tutti gli oggetti personali. Tutto ciò che resta verrà sgomberato.\nBiciclette e monopattini possono essere posteggiati nellʼautorimessa.',
      pt:'Retire todos os objetos pessoais. Tudo o que ficar será removido.\nBicicletas e trotinetes podem ser estacionados na garagem.',
      es:'Retire todos sus objetos personales. Todo lo que quede será retirado.\nLas bicicletas y los patinetes pueden aparcarse en el garaje.' }
  },
  {
    id:'schluessel', cat:'hausordnung', ton:'info', icon:'key',
    label:'Schlüssel nicht stecken lassen',
    titel:{
      de:'Bitte Schlüssel nicht stecken lassen', en:'Please do not leave the key in the lock',
      fr:'Merci de ne pas laisser la clé sur la porte', it:'Non lasciare la chiave nella serratura',
      pt:'Não deixe a chave na fechadura', es:'No deje la llave puesta' },
    text:{ ...LEER }
  },
  {
    id:'ruhezeit', cat:'hausordnung', ton:'info', icon:'clock',
    label:'Ruhezeiten',
    titel:{
      de:'Ruhezeit', en:'Quiet hours', fr:'Heures de repos',
      it:'Ore di silenzio', pt:'Horário de silêncio', es:'Horario de silencio' },
    text:{
      de:'22:00 – 07:00 Uhr sowie am Sonntag den ganzen Tag. Bitte Rücksicht auf die Mitbewohner nehmen.',
      en:'22:00 – 07:00 and all day on Sunday. Please be considerate of the other residents.',
      fr:'De 22h00 à 07h00 ainsi que toute la journée du dimanche. Merci dʼavoir des égards pour les autres habitants.',
      it:'Dalle 22:00 alle 07:00 e tutta la domenica. Vi preghiamo di avere riguardo per gli altri inquilini.',
      pt:'Das 22:00 às 07:00 e todo o domingo. Tenha consideração pelos outros moradores.',
      es:'De 22:00 a 07:00 y todo el domingo. Tenga consideración con los demás residentes.' }
  },
  {
    id:'leise', cat:'hausordnung', ton:'info', icon:'info',
    label:'Bitte leise',
    titel:{
      de:'Bitte leise', en:'Please keep it quiet', fr:'Merci de rester discret',
      it:'Si prega di fare silenzio', pt:'Por favor, silêncio', es:'Por favor, silencio' },
    text:{
      de:'Im Treppenhaus und auf den Gängen bitte leise sprechen. Die Wände sind dünner, als sie aussehen.',
      en:'Please speak quietly in the stairwell and the hallways. The walls are thinner than they look.',
      fr:'Merci de parler à voix basse dans la cage dʼescalier et les couloirs. Les murs sont plus fins quʼils nʼen ont lʼair.',
      it:'Nel vano scale e nei corridoi parlate a bassa voce. Le pareti sono più sottili di quanto sembri.',
      pt:'Fale baixo na escadaria e nos corredores. As paredes são mais finas do que parecem.',
      es:'Hable en voz baja en la escalera y los pasillos. Las paredes son más finas de lo que parecen.' }
  },
  {
    id:'fenster', cat:'hausordnung', ton:'info', icon:'info',
    label:'Fenster geschlossen halten',
    titel:{
      de:'Bitte Fenster geschlossen halten', en:'Please keep the windows closed',
      fr:'Merci de garder les fenêtres fermées', it:'Tenere le finestre chiuse',
      pt:'Mantenha as janelas fechadas', es:'Mantenga las ventanas cerradas' },
    text:{
      de:'Sämtliche Zimmer verfügen über eine mechanische Belüftung, welche das gesamte Raumvolumen pro Tag rund 15 Mal wechselt. Aus diesem Grund sollten die Fenster geschlossen bleiben. Die dreifach verglasten Scheiben halten zudem den Aussenlärm ab, damit Sie ruhig schlafen können.',
      en:'All rooms have mechanical ventilation that exchanges the entire room volume about 15 times a day, so the windows should stay closed. The triple glazing also keeps out street noise so you can sleep peacefully.',
      fr:'Toutes les chambres disposent dʼune ventilation mécanique qui renouvelle environ 15 fois par jour tout le volume dʼair. Les fenêtres devraient donc rester fermées. Le triple vitrage retient en outre le bruit de la rue, pour que vous dormiez tranquillement.',
      it:'Tutte le camere dispongono di una ventilazione meccanica che ricambia lʼintero volume dʼaria circa 15 volte al giorno. Per questo le finestre dovrebbero restare chiuse. I vetri tripli tengono inoltre lontano il rumore esterno, così potete dormire tranquilli.',
      pt:'Todos os quartos têm ventilação mecânica que renova cerca de 15 vezes por dia todo o volume de ar. Por isso, as janelas devem permanecer fechadas. Os vidros triplos travam ainda o ruído da rua, para que possa dormir descansado.',
      es:'Todas las habitaciones cuentan con ventilación mecánica que renueva unas 15 veces al día todo el volumen de aire. Por eso las ventanas deben permanecer cerradas. El triple acristalamiento además aísla del ruido de la calle para que pueda dormir tranquilo.' }
  },
  {
    id:'besucher', cat:'hausordnung', ton:'info', icon:'door',
    label:'Besucher anmelden',
    titel:{
      de:'Besuch', en:'Visitors', fr:'Visites', it:'Visite', pt:'Visitas', es:'Visitas' },
    text:{
      de:'Besucherinnen und Besucher sind willkommen. Bitte begleiten Sie Ihren Besuch beim Betreten und Verlassen des Hauses und melden Sie Übernachtungen vorher an.',
      en:'Visitors are welcome. Please accompany your guests when they enter and leave the building, and register overnight stays in advance.',
      fr:'Les visiteurs sont les bienvenus. Merci dʼaccompagner vos invités à lʼentrée et à la sortie de lʼimmeuble et dʼannoncer les nuitées à lʼavance.',
      it:'Le visite sono benvenute. Vi preghiamo di accompagnare i vostri ospiti allʼingresso e allʼuscita dallo stabile e di annunciare in anticipo i pernottamenti.',
      pt:'As visitas são bem-vindas. Acompanhe os seus convidados à entrada e à saída do edifício e comunique antecipadamente as dormidas.',
      es:'Las visitas son bienvenidas. Acompañe a sus invitados al entrar y salir del edificio y comunique con antelación las pernoctaciones.' }
  },

  /* ── Abfall und Recycling ────────────────────────────────────────────── */
  {
    id:'saecke', cat:'abfall', ton:'info', icon:'trash',
    label:'Abfall nur in Säcken',
    titel:{
      de:'Abfall nur in Säcken', en:'Waste in official bags only',
      fr:'Déchets uniquement en sacs officiels', it:'Rifiuti solo nei sacchi ufficiali',
      pt:'Lixo apenas em sacos oficiais', es:'Basura solo en bolsas oficiales' },
    text:{ ...LEER }
  },
  {
    id:'nurpet', cat:'abfall', ton:'info', icon:'bottle',
    label:'Nur PET',
    titel:{ de:'Nur PET', en:'PET only', fr:'PET uniquement',
            it:'Solo PET', pt:'Apenas PET', es:'Solo PET' },
    text:{
      de:'Bitte hier ausschliesslich PET-Getränkeflaschen einwerfen. Übriger Abfall gehört in den Kehrichtsack.',
      en:'Please put PET drink bottles in here only. All other waste belongs in the rubbish bag.',
      fr:'Merci de ne déposer ici que des bouteilles à boisson en PET. Les autres déchets vont dans le sac à ordures.',
      it:'Inserite qui soltanto bottiglie per bevande in PET. Gli altri rifiuti vanno nel sacco della spazzatura.',
      pt:'Coloque aqui apenas garrafas de bebidas em PET. Os restantes resíduos vão para o saco do lixo.',
      es:'Deposite aquí únicamente botellas de bebida de PET. El resto de la basura va en la bolsa oficial.' }
  },
  {
    id:'petluft', cat:'abfall', ton:'info', icon:'bottle',
    label:'PET — Luft rauslassen',
    titel:{
      de:'Bitte die Luft rauslassen', en:'Please squeeze the air out',
      fr:'Merci de chasser lʼair', it:'Fate uscire lʼaria',
      pt:'Deixe sair o ar', es:'Saque el aire' },
    text:{
      de:'Flasche zusammendrücken, Deckel wieder aufschrauben. So passt dreimal mehr in den Sack.',
      en:'Squeeze the bottle and screw the cap back on. Three times as much fits in the bag.',
      fr:'Écrasez la bouteille et revissez le bouchon. Il en tient trois fois plus dans le sac.',
      it:'Schiacciate la bottiglia e riavvitate il tappo. Nel sacco ci sta tre volte di più.',
      pt:'Esprema a garrafa e volte a enroscar a tampa. Assim cabe três vezes mais no saco.',
      es:'Aplaste la botella y vuelva a enroscar el tapón. Así cabe tres veces más en la bolsa.' }
  },
  {
    id:'sammelstelle', cat:'abfall', ton:'info', icon:'trash',
    label:'Sammelstelle — Beschriftung',
    titel:{
      de:'Sammelstelle', en:'Recycling point', fr:'Point de collecte',
      it:'Punto di raccolta', pt:'Ponto de recolha', es:'Punto de recogida' },
    text:{
      de:'Karton · Altpapier · Altglas · Metall · Nespresso · PET · Kompost · Kehricht',
      en:'Cardboard · Paper · Glass · Metal · Nespresso · PET · Compost · General waste',
      fr:'Carton · Papier · Verre · Métal · Nespresso · PET · Compost · Ordures ménagères',
      it:'Cartone · Carta · Vetro · Metallo · Nespresso · PET · Compost · Rifiuti',
      pt:'Cartão · Papel · Vidro · Metal · Nespresso · PET · Compostagem · Lixo comum',
      es:'Cartón · Papel · Vidrio · Metal · Nespresso · PET · Compost · Basura' }
  },
  {
    id:'papierkarton', cat:'abfall', ton:'info', icon:'trash',
    label:'Sauberes Papier und Karton',
    titel:{
      de:'Sauberes Papier + Karton', en:'Clean paper and cardboard',
      fr:'Papier et carton propres', it:'Carta e cartone puliti',
      pt:'Papel e cartão limpos', es:'Papel y cartón limpios' },
    text:{
      de:'Kein beschichtetes Papier, keine Verbundverpackungen.',
      en:'No coated paper, no composite packaging.',
      fr:'Pas de papier couché, pas dʼemballages composites.',
      it:'Niente carta patinata, niente imballaggi accoppiati.',
      pt:'Sem papel plastificado nem embalagens compostas.',
      es:'Sin papel plastificado ni envases compuestos.' }
  },

  /* ── Parkieren ───────────────────────────────────────────────────────── */
  {
    id:'privatpp', cat:'parken', ton:'verbot', icon:'car',
    label:'Privater Parkplatz',
    titel:{ de:'Privat', en:'Private', fr:'Privé', it:'Privato', pt:'Privado', es:'Privado' },
    text:{
      de:'Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt.',
      en:'Vehicles parked without authorisation will be towed at the ownerʼs expense.',
      fr:'Les véhicules parqués sans autorisation seront enlevés aux frais du propriétaire.',
      it:'I veicoli posteggiati abusivamente verranno rimossi a spese del proprietario.',
      pt:'Os veículos estacionados indevidamente serão rebocados a expensas do proprietário.',
      es:'Los vehículos estacionados sin autorización serán retirados a costa del propietario.' }
  },
  {
    id:'besucherpp', cat:'parken', ton:'info', icon:'car',
    label:'Besucherparkplatz',
    titel:{
      de:'Lieber Parkplatz-Benutzer', en:'Dear parking user',
      fr:'Cher utilisateur du parking', it:'Gentile utente del posteggio',
      pt:'Caro utilizador do estacionamento', es:'Estimado usuario del aparcamiento' },
    text:{
      de:'Sie parken Ihr Fahrzeug auf einem privaten Parkplatz, der für Besucher reserviert ist. Falls Sie kein Besucher der {{adresse}} sind, bitten wir Sie, Ihr Fahrzeug umgehend umzustellen.\n\nDieser Parkplatz ist ausschliesslich für Besucher vorgesehen.\n\nVielen Dank für Ihr Verständnis.',
      en:'You have parked your vehicle in a private car park reserved for visitors. If you are not visiting {{adresse}}, we kindly ask you to move your vehicle immediately.\n\nThis car park is intended for visitors only.\n\nThank you for your understanding.',
      fr:'Vous avez garé votre véhicule sur un parking privé réservé aux visiteurs. Si vous nʼêtes pas un visiteur du {{adresse}}, nous vous prions de déplacer votre véhicule immédiatement.\n\nCe parking est exclusivement réservé aux visiteurs.\n\nMerci de votre compréhension.',
      it:'Avete posteggiato il vostro veicolo in un posteggio privato riservato ai visitatori. Se non siete visitatori di {{adresse}}, vi preghiamo di spostare subito il veicolo.\n\nQuesto posteggio è riservato esclusivamente ai visitatori.\n\nGrazie per la comprensione.',
      pt:'Estacionou o seu veículo num parque privado reservado a visitantes. Se não é visitante de {{adresse}}, pedimos que retire o veículo de imediato.\n\nEste parque destina-se exclusivamente a visitantes.\n\nObrigado pela sua compreensão.',
      es:'Ha estacionado su vehículo en un aparcamiento privado reservado a las visitas. Si no es usted visitante de {{adresse}}, le rogamos que retire el vehículo de inmediato.\n\nEste aparcamiento está reservado exclusivamente a las visitas.\n\nGracias por su comprensión.' }
  },
  {
    id:'parkverbot', cat:'parken', ton:'verbot', icon:'car',
    label:'Parkverbot',
    titel:{
      de:'Parkverbot', en:'No parking', fr:'Interdiction de parquer',
      it:'Divieto di posteggio', pt:'Proibido estacionar', es:'Prohibido aparcar' },
    text:{
      de:'Auf dem gesamten Areal gilt Parkverbot. Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt.',
      en:'Parking is prohibited on the entire site. Vehicles parked without authorisation will be towed at the ownerʼs expense.',
      fr:'Le parcage est interdit sur lʼensemble du site. Les véhicules parqués sans autorisation seront enlevés aux frais du propriétaire.',
      it:'Su tutta lʼarea vige il divieto di posteggio. I veicoli posteggiati abusivamente verranno rimossi a spese del proprietario.',
      pt:'É proibido estacionar em toda a área. Os veículos estacionados indevidamente serão rebocados a expensas do proprietário.',
      es:'Está prohibido aparcar en todo el recinto. Los vehículos estacionados sin autorización serán retirados a costa del propietario.' }
  },
  {
    id:'fahrzeug', cat:'parken', ton:'warnung', icon:'car',
    label:'Fahrzeug unberechtigt abgestellt',
    titel:{
      de:'Unberechtigt abgestelltes Fahrzeug', en:'Vehicle parked without authorisation',
      fr:'Véhicule parqué sans autorisation', it:'Veicolo posteggiato abusivamente',
      pt:'Veículo estacionado sem autorização', es:'Vehículo estacionado sin autorización' },
    text:{
      de:'Dieses Fahrzeug steht in der Zufahrt zu bzw. auf einem unberechtigten Platz unserer Liegenschaft {{adresse}}!\n\nFalls Sie Besucher eines Bewohners dieser Liegenschaft sind, erkundigen Sie sich bei dem betreffenden Bewohner, wo das Fahrzeug berechtigterweise abgestellt werden kann.\n\nWird das Fahrzeug erneut unberechtigt abgestellt, werden wir Anzeige bei der Polizei erstatten!',
      en:'This vehicle is parked in the access lane or in an unauthorised space on our property {{adresse}}.\n\nIf you are visiting a resident of this property, please ask them where the vehicle may legitimately be parked.\n\nIf the vehicle is parked here again without authorisation, we will report it to the police.',
      /* Wortlaut aus dem Laufwerk, unverändert übernommen. */
      fr:'Ce véhicule est parqué dans une zone interdite de notre bien foncier {{adresse}}! Si vous êtes visiteur de ce bien foncier, nous vous prions de vous renseigner sur un lieu autorisé pour parquer votre véhicule. Si le véhicule est à nouveau garé sans autorisation, nous le signalons à la police!',
      it:'Questo veicolo è posteggiato nellʼaccesso o su un posto non autorizzato del nostro stabile {{adresse}}!\n\nSe siete ospiti di un inquilino di questo stabile, chiedetegli dove il veicolo può essere posteggiato legittimamente.\n\nSe il veicolo verrà nuovamente posteggiato senza autorizzazione, sporgeremo denuncia alla polizia!',
      /* Wortlaut aus dem Laufwerk, unverändert übernommen. */
      pt:'Este veículo está estacionado em uma área proibida, qual pertence à propriedade {{adresse}}! Se você for um visitante desse endereço, solicitamos que informe-se sobre um local autorizado para estacionar seu veículo. Se o veículo for estacionado novamente sem autorização, será denunciado à polícia!',
      es:'Este vehículo está estacionado en el acceso o en una plaza no autorizada de nuestra propiedad {{adresse}}.\n\nSi es usted visitante de un residente de este inmueble, pregúntele dónde puede estacionar legítimamente.\n\nSi el vehículo vuelve a estacionarse sin autorización, lo denunciaremos a la policía.' }
  },

  /* ── Küche und Bad ───────────────────────────────────────────────────── */
  {
    id:'kuechesauber', cat:'kueche', ton:'info', icon:'cup',
    label:'Küche sauber hinterlassen',
    titel:{
      de:'Bitte Küche sauber hinterlassen!', en:'Please leave the kitchen clean!',
      fr:'Merci de laisser la cuisine propre !', it:'Lasciate la cucina pulita!',
      pt:'Deixe a cozinha limpa!', es:'¡Deje la cocina limpia!' },
    text:{
      de:'Bitte Küche, Geräte, Küchenutensilien und Geschirr nach Gebrauch reinigen.',
      en:'Please clean the kitchen, appliances, utensils and dishes after use.',
      fr:'Merci de nettoyer la cuisine, les appareils, les ustensiles et la vaisselle après usage.',
      it:'Pulite cucina, apparecchi, utensili e stoviglie dopo lʼuso.',
      pt:'Limpe a cozinha, os aparelhos, os utensílios e a loiça depois de usar.',
      es:'Limpie la cocina, los aparatos, los utensilios y la vajilla después de usarlos.' }
  },
  {
    id:'kuehlschrank', cat:'kueche', ton:'info', icon:'info',
    label:'Kühlschrank in Ordnung halten',
    titel:{
      de:'Kühlschrank', en:'Fridge', fr:'Réfrigérateur',
      it:'Frigorifero', pt:'Frigorífico', es:'Nevera' },
    text:{
      de:'Abgelaufene Lebensmittel im Kühlschrank sind zu entsorgen. Der Kühlschrank ist sauber zu halten. Danke.',
      en:'Expired food in the fridge must be disposed of. The fridge must be kept clean. Thank you.',
      fr:'Les aliments périmés doivent être jetés. Le réfrigérateur doit rester propre. Merci.',
      it:'Gli alimenti scaduti nel frigorifero devono essere smaltiti. Il frigorifero deve essere mantenuto pulito. Grazie.',
      pt:'Os alimentos fora do prazo devem ser deitados fora. O frigorífico deve manter-se limpo. Obrigado.',
      es:'Los alimentos caducados deben tirarse. La nevera debe mantenerse limpia. Gracias.' }
  },
  {
    id:'haendewaschen', cat:'kueche', ton:'info', icon:'info',
    label:'Bitte Hände waschen',
    titel:{
      de:'Bitte Hände waschen', en:'Please wash your hands',
      fr:'Merci de vous laver les mains', it:'Lavatevi le mani',
      pt:'Lave as mãos', es:'Lávese las manos' },
    text:{ ...LEER }
  },
  {
    id:'duschen', cat:'kueche', ton:'info', icon:'info',
    label:'Duschen statt baden',
    titel:{
      de:'Bitte kurz duschen', en:'Please shower briefly',
      fr:'Merci de prendre une douche courte', it:'Fate una doccia breve',
      pt:'Tome um duche curto', es:'Dúchese brevemente' },
    text:{
      de:'Diese Dusche steht nur den Bewohnern des EGʼs zur Verfügung.\nEs darf nur kurz geduscht werden, damit genügend Warmwasser für alle Bewohner zur Verfügung steht.',
      en:'This shower is available only to residents of the ground floor.\nPlease shower briefly so that there is enough hot water for everyone.',
      fr:'Cette douche est réservée aux habitants du rez-de-chaussée.\nMerci de ne prendre que de courtes douches afin quʼil reste assez dʼeau chaude pour tous.',
      it:'Questa doccia è riservata agli inquilini del pianterreno.\nFate docce brevi, affinché ci sia acqua calda a sufficienza per tutti.',
      pt:'Este duche destina-se apenas aos moradores do rés do chão.\nTome duches curtos para que haja água quente suficiente para todos.',
      es:'Esta ducha está reservada a los residentes de la planta baja.\nDúchese brevemente para que haya agua caliente suficiente para todos.' }
  },
  {
    id:'backofen', cat:'kueche', ton:'info', icon:'cup',
    label:'Backofen nur mit Backpapier',
    titel:{
      de:'Bitte Backofen nur mit Backtrennpapier benützen',
      en:'Please use the oven only with baking paper',
      fr:'Merci dʼutiliser le four uniquement avec du papier cuisson',
      it:'Usate il forno solo con la carta da forno',
      pt:'Use o forno apenas com papel vegetal',
      es:'Use el horno solo con papel de hornear' },
    text:{
      de:'Das Papier ist mehrmals benutzbar.',
      en:'The paper can be used several times.',
      fr:'Le papier peut servir plusieurs fois.',
      it:'La carta si può riutilizzare più volte.',
      pt:'O papel pode ser reutilizado várias vezes.',
      es:'El papel se puede reutilizar varias veces.' }
  },
  {
    id:'geschirr', cat:'kueche', ton:'verbot', icon:'cup',
    label:'Kein Geschirr entfernen',
    titel:{
      de:'Kein Geschirr, Gläser, Pfannen und Küchengeräte aus diesem Raum entfernen',
      en:'Do not remove dishes, glasses, pans or kitchen appliances from this room',
      fr:'Ne pas sortir de cette pièce la vaisselle, les verres, les casseroles ni les appareils de cuisine',
      it:'Non portare fuori da questo locale stoviglie, bicchieri, pentole e apparecchi da cucina',
      pt:'Não retire desta sala loiça, copos, panelas nem aparelhos de cozinha',
      es:'No saque de esta sala vajilla, vasos, sartenes ni aparatos de cocina' },
    text:{ ...LEER }
  },

  /* ── Waschen und Trocknen ────────────────────────────────────────────── */
  {
    id:'waschmaschine', cat:'waesche', ton:'info', icon:'info',
    label:'Gebrauch der Waschmaschine',
    titel:{
      de:'Waschmaschine', en:'Washing machine', fr:'Machine à laver',
      it:'Lavatrice', pt:'Máquina de lavar', es:'Lavadora' },
    text:{
      de:'Bitte nach jedem Waschgang das Flusensieb reinigen und die Trommel offen stehen lassen. Waschmittel sparsam dosieren.',
      en:'Please clean the lint filter after every wash and leave the drum open. Use detergent sparingly.',
      fr:'Merci de nettoyer le filtre à peluches après chaque lavage et de laisser le tambour ouvert. Dosez la lessive avec parcimonie.',
      it:'Dopo ogni lavaggio pulite il filtro e lasciate il cestello aperto. Dosate il detersivo con parsimonia.',
      pt:'Limpe o filtro de cotão depois de cada lavagem e deixe o tambor aberto. Doseie o detergente com moderação.',
      es:'Limpie el filtro de pelusa después de cada lavado y deje el tambor abierto. Dosifique el detergente con moderación.' }
  },
  {
    id:'waeschehaengen', cat:'waesche', ton:'info', icon:'info',
    label:'Wäsche aufhängen',
    titel:{
      de:'Wäsche bitte im Trocknungsraum aufhängen',
      en:'Please hang laundry in the drying room',
      fr:'Merci dʼétendre le linge dans le local de séchage',
      it:'Stendete il bucato nel locale asciugatura',
      pt:'Estenda a roupa na sala de secagem',
      es:'Tienda la ropa en el cuarto de secado' },
    text:{
      de:'Im Zimmer aufgehängte Wäsche führt zu Feuchtigkeit und Schimmel. Bitte den Trocknungsraum benutzen.',
      en:'Laundry hung up in the room causes damp and mould. Please use the drying room.',
      fr:'Le linge étendu dans la chambre provoque humidité et moisissures. Merci dʼutiliser le local de séchage.',
      it:'Il bucato steso in camera provoca umidità e muffa. Utilizzate il locale asciugatura.',
      pt:'A roupa estendida no quarto provoca humidade e bolor. Utilize a sala de secagem.',
      es:'La ropa tendida en la habitación provoca humedad y moho. Utilice el cuarto de secado.' }
  },
  {
    id:'waeschehaenge', cat:'waesche', ton:'info', icon:'info',
    label:'Trockene Wäsche abnehmen',
    titel:{
      de:'Wäschehänge', en:'Drying rack', fr:'Étendoir',
      it:'Stendibiancheria', pt:'Estendal', es:'Tendedero' },
    text:{
      de:'Bitte nimm deine trockene Kleidung sofort von der Wäschehänge. Wenn du Kleidung aufhängen möchtest und keinen freien Platz findest, darfst du trockene Kleidung anderer Gäste vorsichtig von der Wäschehänge nehmen, ordentlich in den Korb legen und die Wäschehänge benutzen.',
      en:'Please remove your dried clothes from the drying rack as soon as they are dry. If you would like to hang up clothes and there is no free space available, you may carefully remove dry clothes belonging to other guests from the drying rack, place them neatly in the basket, and use the rack.',
      /* Wortlaut aus dem Laufwerk, unverändert übernommen. */
      fr:'Merci de retirer tes vêtements de lʼétendoir dès quʼils sont secs. Si tu souhaites étendre des vêtements et quʼil nʼy a plus de place disponible, tu peux retirer soigneusement les vêtements secs des autres invités de lʼétendoir, les placer correctement dans le panier et utiliser lʼétendoir.',
      it:'Per favore togli i tuoi vestiti dallo stendibiancheria non appena sono asciutti. Se vuoi stendere dei capi e non trovi posto libero, puoi togliere con cura i vestiti asciutti degli altri ospiti, riporli ordinatamente nel cesto e usare lo stendibiancheria.',
      pt:'Retira a tua roupa do estendal assim que estiver seca. Se quiseres estender roupa e não houver espaço livre, podes retirar com cuidado a roupa seca de outros hóspedes, colocá-la arrumada no cesto e usar o estendal.',
      es:'Retira tu ropa del tendedero en cuanto esté seca. Si quieres tender ropa y no hay sitio libre, puedes retirar con cuidado la ropa seca de otros huéspedes, dejarla ordenada en el cesto y usar el tendedero.' }
  },

  /* ── Vermietung ──────────────────────────────────────────────────────── */
  {
    id:'zuvermieten', cat:'vermietung', ton:'info', icon:'key',
    label:'Zu vermieten',
    titel:{
      de:'Zu vermieten', en:'For rent', fr:'À louer',
      it:'Da affittare', pt:'Para arrendar', es:'Se alquila' },
    text:{
      de:'Wohnung an ruhiger Lage, bezugsbereit. Anfragen über den QR-Code oder telefonisch.',
      en:'Apartment in a quiet location, ready to move in. Enquiries via the QR code or by telephone.',
      fr:'Appartement au calme, libre de suite. Renseignements par le code QR ou par téléphone.',
      it:'Appartamento in posizione tranquilla, libero subito. Informazioni tramite il codice QR o per telefono.',
      pt:'Apartamento em zona tranquila, pronto a habitar. Informações através do código QR ou por telefone.',
      es:'Piso en zona tranquila, listo para entrar a vivir. Información mediante el código QR o por teléfono.' }
  },
  {
    id:'reserviert', cat:'vermietung', ton:'info', icon:'key',
    label:'Reserviert',
    titel:{
      de:'RESERVIERT', en:'RESERVED', fr:'RÉSERVÉ',
      it:'RISERVATO', pt:'RESERVADO', es:'RESERVADO' },
    text:{
      de:'Widerrechtlich abgestellte Fahrzeuge werden kostenpflichtig abgeschleppt.',
      en:'Vehicles parked without authorisation will be towed at the ownerʼs expense.',
      fr:'Les véhicules parqués sans autorisation seront enlevés aux frais du propriétaire.',
      it:'I veicoli posteggiati abusivamente verranno rimossi a spese del proprietario.',
      pt:'Os veículos estacionados indevidamente serão rebocados a expensas do proprietário.',
      es:'Los vehículos estacionados sin autorización serán retirados a costa del propietario.' }
  },

  /* ── Hotel und Gäste ─────────────────────────────────────────────────── */
  {
    id:'checkin', cat:'hotel', ton:'info', icon:'key',
    label:'Check-in Anleitung',
    titel:{ de:'Check-in', en:'Check-in', fr:'Check-in · Arrivée',
            it:'Check-in', pt:'Check-in', es:'Check-in · Entrada' },
    text:{
      de:'Ihren Zimmercode erhalten Sie per E-Mail und SMS. Am Eingang den Code eingeben und bestätigen.',
      en:'You receive your room code by e-mail and SMS. Enter the code at the entrance and confirm.',
      fr:'Vous recevez le code de votre chambre par e-mail et par SMS. Saisissez le code à lʼentrée et confirmez.',
      it:'Il codice della camera vi arriva per e-mail e SMS. Digitate il codice allʼingresso e confermate.',
      pt:'Recebe o código do quarto por e-mail e SMS. Introduza o código à entrada e confirme.',
      es:'Recibirá el código de su habitación por correo electrónico y SMS. Introdúzcalo en la entrada y confirme.' }
  },
  {
    id:'checkout', cat:'hotel', ton:'info', icon:'clock',
    label:'Express Check-out',
    titel:{ de:'Express Check-out', en:'Express check-out', fr:'Check-out express',
            it:'Check-out express', pt:'Check-out expresso', es:'Check-out exprés' },
    text:{
      de:'Zimmerschlüssel in die Box legen und abreisen. Die Rechnung kommt per E-Mail.',
      en:'Drop the key in the box and leave. The invoice follows by e-mail.',
      fr:'Déposez la clé de la chambre dans la boîte et partez. La facture suit par e-mail.',
      it:'Lasciate la chiave nella cassetta e partite. La fattura arriva per e-mail.',
      pt:'Deixe a chave do quarto na caixa e parta. A fatura segue por e-mail.',
      es:'Deje la llave de la habitación en la caja y márchese. La factura llegará por correo electrónico.' }
  },
  {
    id:'fruehstueck', cat:'hotel', ton:'info', icon:'cup',
    label:'Frühstück',
    titel:{ de:'Frühstück', en:'Breakfast', fr:'Petit-déjeuner',
            it:'Colazione', pt:'Pequeno-almoço', es:'Desayuno' },
    text:{
      de:'Frühstück 07:30 – 10:00 im Aufenthaltsraum.',
      en:'Breakfast 07:30 – 10:00 in the lounge.',
      fr:'Petit-déjeuner de 07h30 à 10h00 dans lʼespace commun.',
      it:'Colazione dalle 07:30 alle 10:00 nella sala comune.',
      pt:'Pequeno-almoço das 07:30 às 10:00 na sala comum.',
      es:'Desayuno de 07:30 a 10:00 en la sala común.' }
  },
  {
    id:'storage', cat:'hotel', ton:'info', icon:'info',
    label:'Gepäckraum',
    titel:{ de:'Gepäckraum', en:'Luggage room', fr:'Local à bagages',
            it:'Deposito bagagli', pt:'Sala de bagagens', es:'Consigna de equipaje' },
    text:{
      de:'Gepäck kann vor dem Check-in und nach dem Check-out hier abgestellt werden. Keine Haftung für Wertsachen.',
      en:'Luggage may be left here before check-in and after check-out. No liability for valuables.',
      fr:'Les bagages peuvent être déposés ici avant lʼarrivée et après le départ. Aucune responsabilité pour les objets de valeur.',
      it:'I bagagli possono essere depositati qui prima del check-in e dopo il check-out. Nessuna responsabilità per gli oggetti di valore.',
      pt:'A bagagem pode ficar aqui antes do check-in e depois do check-out. Não nos responsabilizamos por objetos de valor.',
      es:'El equipaje puede dejarse aquí antes del check-in y después del check-out. No nos hacemos responsables de los objetos de valor.' }
  },
  {
    id:'rauchhotel', cat:'hotel', ton:'verbot', icon:'smoke',
    label:'Rauchverbot im Zimmer (mit Kostenfolge)',
    titel:{
      de:'Rauchverbot', en:'No smoking', fr:'Interdiction de fumer',
      it:'Divieto di fumare', pt:'Proibido fumar', es:'Prohibido fumar' },
    text:{
      de:'In sämtlichen Räumen ist das Rauchen strengstens untersagt. Das gesamte Gebäude ist zu Ihrer Sicherheit mit Rauchmeldern ausgestattet, welche bei der geringsten Rauchentwicklung Alarm auslösen. Der Alarm geht direkt zur örtlichen Feuerwehr. Ein Fehlalarm zieht automatisch hohe Kosten (über CHF 1ʼ800.–) nach sich, welche dem fehlbaren Gast weiterverrechnet werden.\n\nGästen, welche sich nicht an diese Weisung halten, wird eine Reinigungspauschale von CHF 300.– in Rechnung gestellt.',
      en:'Smoking is strictly prohibited in all rooms. For your safety the entire building is equipped with smoke detectors that trigger an alarm at the slightest smoke. The alarm goes directly to the local fire brigade. A false alarm automatically incurs high costs (over CHF 1ʼ800.–), which are charged to the guest responsible.\n\nGuests who do not comply are charged a cleaning fee of CHF 300.–.',
      fr:'Il est strictement interdit de fumer dans tous les locaux. Pour votre sécurité, tout le bâtiment est équipé de détecteurs de fumée qui déclenchent lʼalarme à la moindre fumée. Lʼalarme est transmise directement aux pompiers. Une fausse alarme entraîne automatiquement des frais élevés (plus de CHF 1ʼ800.–) qui sont facturés à lʼhôte responsable.\n\nLes hôtes qui ne respectent pas cette consigne se voient facturer un forfait de nettoyage de CHF 300.–.',
      it:'In tutti i locali è severamente vietato fumare. Per la vostra sicurezza lʼintero edificio è dotato di rilevatori di fumo che fanno scattare lʼallarme al minimo fumo. Lʼallarme viene trasmesso direttamente ai pompieri. Un falso allarme comporta automaticamente costi elevati (oltre CHF 1ʼ800.–) che vengono addebitati allʼospite responsabile.\n\nAgli ospiti che non rispettano questa disposizione viene fatturato un forfait di pulizia di CHF 300.–.',
      pt:'É estritamente proibido fumar em todos os espaços. Para sua segurança, todo o edifício está equipado com detetores de fumo que disparam o alarme ao menor sinal de fumo. O alarme vai diretamente para os bombeiros locais. Um alarme falso implica automaticamente custos elevados (mais de CHF 1ʼ800.–), que são faturados ao hóspede responsável.\n\nAos hóspedes que não cumpram esta indicação é cobrada uma taxa de limpeza de CHF 300.–.',
      es:'Está terminantemente prohibido fumar en todas las estancias. Por su seguridad, todo el edificio cuenta con detectores de humo que activan la alarma ante el menor humo. La alarma se transmite directamente a los bomberos locales. Una falsa alarma conlleva automáticamente costes elevados (más de CHF 1ʼ800.–) que se facturan al huésped responsable.\n\nA los huéspedes que no respeten esta indicación se les facturará una tarifa de limpieza de CHF 300.–.' }
  },
  {
    id:'checkoutkarte', cat:'hotel', ton:'info', icon:'key',
    label:'Check-out mit Zimmerkarte',
    titel:{ de:'Check-out', en:'Check-out', fr:'Check-out · Départ',
            it:'Check-out', pt:'Check-out', es:'Check-out · Salida' },
    text:{
      de:'Beim Verlassen des Zimmers lassen Sie bitte die physische Zimmerkarte auf dem Schreibtisch und senden uns eine Kurzmitteilung «check-out erfolgt». Besten Dank und einen angenehmen Aufenthalt.',
      en:'When leaving the room, please leave the physical room card on the desk and send us a short message saying “check-out completed”. Thank you and have a pleasant stay.',
      fr:'En quittant la chambre, merci de laisser la carte de chambre physique sur le bureau et de nous envoyer un court message « check-out effectué ». Merci beaucoup et bon séjour.',
      it:'Lasciando la camera, vi preghiamo di posare la tessera fisica sulla scrivania e di inviarci un breve messaggio «check-out effettuato». Grazie mille e buon soggiorno.',
      pt:'Ao sair do quarto, deixe o cartão físico na secretária e envie-nos uma mensagem curta «check-out efetuado». Muito obrigado e boa estadia.',
      es:'Al salir de la habitación, deje la tarjeta física sobre el escritorio y envíenos un mensaje breve «check-out realizado». Muchas gracias y feliz estancia.' }
  },
  {
    id:'wlan', cat:'hotel', ton:'info', icon:'wifi',
    label:'WLAN',
    titel:{
      de:'welcome to Nʼs HOTEL', en:'welcome to Nʼs HOTEL', fr:'welcome to Nʼs HOTEL',
      it:'welcome to Nʼs HOTEL', pt:'welcome to Nʼs HOTEL', es:'welcome to Nʼs HOTEL' },
    text:{
      de:'WLAN: Gast\nPasswort: · · · · · · · ·',
      en:'Wi-Fi: Gast\nPassword: · · · · · · · ·',
      fr:'Wi-Fi : Gast\nMot de passe : · · · · · · · ·',
      it:'Wi-Fi: Gast\nPassword: · · · · · · · ·',
      pt:'Wi-Fi: Gast\nPalavra-passe: · · · · · · · ·',
      es:'Wi-Fi: Gast\nContraseña: · · · · · · · ·' }
  },

  /* ── Technik und Unterhalt ───────────────────────────────────────────── */
  {
    id:'brandmelder', cat:'technik', ton:'warnung', icon:'warn',
    label:'Brand- und Rauchmelder',
    titel:{
      de:'Manipulation an Brand- und Rauchmeldern',
      en:'Tampering with fire and smoke detectors',
      fr:'Manipulation des détecteurs dʼincendie et de fumée',
      it:'Manomissione dei rilevatori dʼincendio e di fumo',
      pt:'Manipulação dos detetores de incêndio e de fumo',
      es:'Manipulación de los detectores de incendios y humo' },
    text:{
      de:'Jede Manipulation an der Brandmeldeanlage hat zur Folge, dass im Brandfall die Alarmierung der Feuerwehr nicht funktioniert und dass Ihr und das Leben Ihrer Mitbewohner auf dem Spiel steht.\n\nDer Einsatz der Feuerwehr bei einem Fehlalarm wird mit CHF 1ʼ500.– geahndet und wird dem Verursacher in Rechnung gestellt.',
      en:'Any tampering with the fire alarm system means that in the event of a fire the fire brigade will not be alerted — putting your life and the lives of the other residents at risk.\n\nA fire brigade call-out for a false alarm is penalised with CHF 1ʼ500.– and billed to whoever caused it.',
      fr:'Toute manipulation du système de détection dʼincendie a pour conséquence quʼen cas dʼincendie les pompiers ne seront pas alertés — votre vie et celle des autres habitants sont en jeu.\n\nUne intervention des pompiers pour une fausse alarme est sanctionnée par CHF 1ʼ500.– facturés à son auteur.',
      it:'Ogni manomissione dellʼimpianto di rilevazione incendi comporta che in caso dʼincendio i pompieri non vengano allertati — la vostra vita e quella degli altri inquilini sono in gioco.\n\nUn intervento dei pompieri per falso allarme viene sanzionato con CHF 1ʼ500.– e addebitato a chi lo ha causato.',
      pt:'Qualquer manipulação do sistema de deteção de incêndio faz com que, em caso de incêndio, os bombeiros não sejam alertados — a sua vida e a dos outros moradores ficam em risco.\n\nUma saída dos bombeiros por alarme falso é sancionada com CHF 1ʼ500.–, faturados a quem lhe deu causa.',
      es:'Cualquier manipulación del sistema de detección de incendios provoca que, en caso de incendio, no se avise a los bomberos: su vida y la de los demás residentes están en juego.\n\nUna salida de bomberos por falsa alarma se sanciona con CHF 1ʼ500.–, que se facturan a quien la causó.' }
  },
  {
    id:'kontrolle', cat:'technik', ton:'warnung', icon:'warn',
    label:'Kontrolle angekündigt',
    titel:{
      de:'ACHTUNG', en:'ATTENTION', fr:'ATTENTION',
      it:'ATTENZIONE', pt:'ATENÇÃO', es:'ATENCIÓN' },
    text:{
      de:'Am {{datum}} findet eine Kontrolle in allen Zimmern statt.\nBitte alle Steckdosen freihalten!',
      en:'On {{datum}} all rooms will be inspected.\nPlease keep all sockets clear!',
      fr:'Le {{datum}}, un contrôle aura lieu dans toutes les chambres.\nMerci de dégager toutes les prises !',
      it:'Il {{datum}} avrà luogo un controllo in tutte le camere.\nTenete libere tutte le prese!',
      pt:'No dia {{datum}} haverá uma inspeção em todos os quartos.\nMantenha todas as tomadas desimpedidas!',
      es:'El {{datum}} se realizará una inspección en todas las habitaciones.\n¡Mantenga libres todos los enchufes!' }
  },
  {
    id:'hauseingang', cat:'technik', ton:'info', icon:'door',
    label:'Hauseingangstüre schliessen',
    titel:{
      de:'Wichtiger Hinweis zur Hauseingangstür',
      en:'Important notice about the front door',
      fr:'Information importante concernant la porte dʼentrée',
      it:'Avviso importante sulla porta dʼentrata',
      pt:'Aviso importante sobre a porta de entrada',
      es:'Aviso importante sobre la puerta de entrada' },
    text:{
      de:'Bitte achten Sie beim Betreten und Verlassen des Gebäudes darauf, dass die Tür richtig ins Schloss fällt und nicht offensteht.\n\nNur berechtigte Personen — also ausschliesslich Mieterinnen und Mieter sowie deren Gäste — sollen Zugang zum Haus haben.',
      en:'When entering and leaving the building, please make sure the door closes properly and is not left ajar.\n\nOnly authorised people — tenants and their guests — should have access to the building.',
      fr:'En entrant et en sortant de lʼimmeuble, veillez à ce que la porte se referme correctement et ne reste pas ouverte.\n\nSeules les personnes autorisées — les locataires et leurs invités — doivent avoir accès à lʼimmeuble.',
      it:'Entrando e uscendo dallo stabile, assicuratevi che la porta si chiuda correttamente e non resti aperta.\n\nSolo le persone autorizzate — inquilini e loro ospiti — devono avere accesso allo stabile.',
      pt:'Ao entrar e sair do edifício, certifique-se de que a porta fecha bem e não fica encostada.\n\nApenas as pessoas autorizadas — inquilinos e os seus convidados — devem ter acesso ao edifício.',
      es:'Al entrar y salir del edificio, asegúrese de que la puerta cierre bien y no quede entornada.\n\nSolo las personas autorizadas —inquilinos y sus invitados— deben tener acceso al edificio.' }
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
