// Alle zichtbare tekst van de site. Tekst aanpassen = alleen dit bestand.
export const nl = {
  meta: {
    title: 'Forgeline Optimizations · Procesautomatisering & AI voor het mkb',
    description:
      'Ik breng de processen van je bedrijf in kaart en automatiseer alleen wat zich terugverdient. Voor productie, handel en dienstverlening met 10 tot 100 mensen.',
  },
  nav: {
    label: 'Hoofdnavigatie',
    skip: 'Ga naar de inhoud',
    cta: 'Kennismaken',
    chapters: [
      { id: 'chaos', label: 'Chaos' },
      { id: 'inzicht', label: 'Inzicht' },
      { id: 'standaard', label: 'Standaard' },
      { id: 'automatisch', label: 'Automatisch' },
      { id: 'oordeel', label: 'Oordeel' },
      { id: 'aanbod', label: 'Aanbod' },
    ],
  },
  common: {
    example: 'Voorbeeld',
    scrollCue: 'Scroll · volg de lijn',
  },

  // 01 · Chaos (hero)
  hero: {
    kicker: 'Procesautomatisering & AI voor het mkb',
    kickerShort: 'Procesautomatisering & AI',
    title: 'Automatiseer wat het waard is. Ik help te vinden wat dat is.',
    lead: 'Voor productie-, handels- en dienstverlenende bedrijven met 10 tot 100 mensen. Eerst je processen in kaart, dan pas de software.',
    ctaPrimary: 'Plan een kennismaking',
    ctaSecondary: 'Hoe ik werk',
    nodeIndex: 'Stap ?',
    // Volgorde hoort bij de posities in src/data/hero-chaos.ts.
    nodes: [
      'Order uit e-mail',
      'Offerte in Word',
      'Planning in Excel',
      'Overtypen in ERP',
      'Voorraad nabellen',
      'Factuur handmatig',
      'Welke versie klopt?',
    ],
  },

  // 02 · Inzicht
  inzicht: {
    kicker: 'Hoofdstuk 02 · Inzicht',
    title: 'Eerst de kaart, dan de machine',
    lead: 'Ik loop mee met de mensen die het werk doen. Zo zie ik waar informatie wordt overgetypt, blijft liggen of kwijtraakt, en hoeveel tijd dat kost.',
    // `painpoint` staat boven de verbinding ná deze stap; leeg = geen knelpunt.
    steps: [
      { index: 'Stap 01', name: 'Order uit e-mail', painpoint: 'Overgetypt 2×' },
      { index: 'Stap 02', name: 'Overtypen in ERP', painpoint: 'Wacht ± 2 dagen' },
      { index: 'Stap 03', name: 'Offerte in Word', painpoint: '' },
      { index: 'Stap 04', name: 'Planning in Excel', painpoint: 'Kwijt in de mailbox' },
      { index: 'Stap 05', name: 'Factuur handmatig', painpoint: '' },
    ],
    method: [
      { label: 'Meelopen', text: 'Ik kijk mee op de werkvloer, niet alleen vanaf het organogram.' },
      { label: 'Meten', text: 'Per stap: hoe vaak, hoe lang, in welk systeem.' },
      { label: 'Vastleggen', text: 'Eén proceskaart waar je hele team zich in herkent.' },
    ],
  },

  // 03 · Standaardiseren
  standaard: {
    kicker: 'Hoofdstuk 03 · Standaardiseren',
    title: 'Geen standaard, geen automatisering',
    lead: 'Doen drie mensen hetzelfde werk op drie manieren, dan automatiseer je de chaos. Eerst spreken we één werkwijze af. Pas daarna komt er software.',
    lanes: [
      { label: 'Planner 1', chips: ['Order lezen', 'Excel bijwerken', 'Mail werkplaats'] },
      { label: 'Planner 2', chips: ['Order lezen', 'Werkplaats bellen', 'Excel bijwerken'] },
      { label: 'Planner 3', chips: ['Briefje op bureau', 'Excel bijwerken', 'Order lezen'] },
    ],
    standardLabel: 'Eén werkwijze',
    standard: [
      { index: 'Stap 01', name: 'Order vastleggen' },
      { index: 'Stap 02', name: 'Capaciteit checken' },
      { index: 'Stap 03', name: 'Inplannen + melden' },
    ],
  },

  // 04 · Automatiseren
  automatisch: {
    kicker: 'Hoofdstuk 04 · Automatiseren',
    title: 'Dan gaat de lijn aan',
    lead: 'Ik bouw de oplossing, test hem en documenteer hem. Geen demo die na een maand stilvalt, maar iets dat in productie blijft draaien.',
    exampleLabel: 'Voorbeeld · orderverwerking',
    // `automated: false` = blijft mensenwerk (andere nodestijl).
    steps: [
      { index: 'Stap 01 · Automatisch', name: 'Order inlezen', result: '25 → 4 min', automated: true },
      {
        index: 'Stap 02 · Automatisch',
        name: 'Offerte opstellen',
        result: '2× overtypen → 0×',
        automated: true,
      },
      {
        index: 'Stap 03 · Automatisch',
        name: 'Inplannen',
        result: '± 2 dagen → zelfde dag',
        automated: true,
      },
      { index: 'Stap 04 · Mens', name: 'Controle planner', result: 'Blijft mensenwerk', automated: false },
    ],
    promises: [
      {
        label: 'Getest',
        text: 'Elke automatisering draait eerst op een testomgeving, met echte voorbeelden uit jouw bedrijf.',
      },
      {
        label: 'Gedocumenteerd',
        text: 'Je krijgt een handleiding en een draaiboek voor als er iets misgaat.',
      },
      { label: 'Overgedragen', text: 'Een overdrachtssessie met je team, en 30 dagen garantie.' },
    ],
  },

  // 05 · Eerlijk oordeel
  oordeel: {
    kicker: 'Hoofdstuk 05 · Eerlijk oordeel',
    title: 'Niet alles moet automatisch',
    lead: 'Klik op een processtap en zie mijn oordeel. Het lijstje met wat je níet moet automatiseren is net zo belangrijk als de rest van het rapport.',
    exampleLabel: 'Voorbeeld · fictief productiebedrijf, 28 medewerkers',
    stepsLabel: 'Processtappen',
    verdictLabels: { go: 'Automatiseren', wait: 'Eerst standaardiseren', no: 'Niet automatiseren' },
    // Welke stap welk oordeel krijgt staat in src/data/verdicts.ts.
    items: {
      offerte: {
        title: 'Offerte opstellen',
        shortTitle: 'Offerte opstellen',
        meta: '± 40× per week · 25 min per offerte · 2 systemen',
        reason:
          'Elke week dezelfde stappen en de gegevens staan al in het ERP. Een sjabloon dat zichzelf vult scheelt ± 13 uur per week.',
      },
      factuur: {
        title: 'Factuur naar boekhouding',
        shortTitle: 'Facturen',
        meta: '± 60× per maand · 10 min per factuur · gegevens al in ERP',
        reason:
          'Pure overdracht tussen twee systemen. Goed te automatiseren, met een controle op afwijkende bedragen.',
      },
      planning: {
        title: 'Productieplanning',
        shortTitle: 'Planning',
        meta: 'Dagelijks · drie planners · in Excel',
        reason:
          'Iedere planner doet het anders. Eerst één werkwijze vastleggen; pas daarna loont automatiseren.',
      },
      klacht: {
        title: 'Klachten afhandelen',
        shortTitle: 'Klachten',
        meta: '± 6× per week · veel maatwerk',
        reason:
          'Weinig volume, veel uitzonderingen, en de klant wil een mens spreken. Hier verdient automatiseren zich niet terug.',
      },
      inkoop: {
        title: 'Leverancier kiezen',
        shortTitle: 'Leverancier',
        meta: 'Paar keer per maand · relatie en prijs',
        reason: 'Dit is een afweging, geen proces. Ik maak de cijfers inzichtelijk; de keuze blijft bij jou.',
      },
    },
  },

  // 06 · Aanbod (licht)
  aanbod: {
    kicker: 'Hoofdstuk 06 · Aanbod',
    title: 'Drie stappen, één richting',
    lead: 'Je begint klein met een audit. Wat daaruit komt, bouw ik. Wat ik bouw, houd ik draaiend.',
    services: [
      {
        num: '01',
        kicker: 'Instap',
        title: 'Automation Audit',
        text: 'Een week, een eerlijk rapport: waar je tijd weglekt en wat automatiseren oplevert.',
        items: [
          'Proceskaart van je kernprocessen',
          '3 tot 5 kansen met kosten en baten',
          'De lijst met wat je níet moet automatiseren',
        ],
        meta: '± 1 week · vaste prijs',
      },
      {
        num: '02',
        kicker: 'Bouwen',
        title: 'Implementatie',
        text: 'Ik bouw de beste kans uit de audit, test hem en draag hem over.',
        items: ['Plan, bouw en tests', 'Documentatie en overdracht', '30 dagen garantie'],
        meta: 'Vaste scope · vaste prijs',
      },
      {
        num: '03',
        kicker: 'Onderhoud',
        title: 'Care & Development',
        text: 'Ik houd het draaiend en verbeter het, maand na maand.',
        items: ['Monitoring en fixes', 'Kleine verbeteringen', 'Elk kwartaal een procescheck'],
        meta: 'Maandelijks',
      },
    ],
    note: 'Prijzen bespreek ik in een eerste gesprek. Afhankelijk van je regio en sector is een deel van het adviesdeel vaak subsidiabel; ik wijs je de weg.',
    noteMobile: 'Prijzen bespreek ik in een eerste gesprek.',
    cta: 'Vraag een audit aan',
  },

  // 07 · Over mij
  overMij: {
    kicker: 'Hoofdstuk 07 · Wie ik ben',
    title: 'Eén aanspreekpunt, van kaart tot code',
    name: 'Sander Nales',
    role: 'Oprichter · procesautomatisering & AI',
    p1: 'Ik ben opgeleid als werktuigbouwkundige en software-engineer. Daardoor kijk ik eerst naar het proces op de werkvloer en pas daarna naar de software.',
    p2: 'Je hebt één aanspreekpunt: ik doe de audit, bouw de oplossing en onderhoud hem. Wat ik bouw, test en documenteer ik, zodat het blijft werken als ik de deur uit ben.',
    facts: [
      { label: 'Achtergrond', value: 'Werktuigbouwkunde' },
      { label: 'Studie', value: 'CSE · TU Delft' },
      { label: 'Werkwijze', value: 'Vaste prijs, vaste scope' },
    ],
    photoAlt: 'Sander Nales, oprichter van Forgeline Optimizations',
  },

  // 08 · Contact (formulierdeel licht)
  contact: {
    kicker: 'Hoofdstuk 08 · Contact',
    title: 'Welk proces kost jou te veel tijd?',
    lead: 'Vertel het in een paar zinnen.',
    fields: {
      name: 'Naam',
      company: 'Bedrijf',
      email: 'E-mailadres',
      phone: 'Telefoon',
      optional: '(optioneel)',
      message: 'Welk proces kost je te veel tijd?',
      messagePlaceholder: 'Bijvoorbeeld: we typen elke order over van de mail naar het ERP.',
      honeypot: 'Laat dit veld leeg',
    },
    privacy: {
      before: 'Ik ga akkoord met de verwerking van mijn gegevens volgens de ',
      linkText: 'privacyverklaring',
      after: '.',
    },
    submit: 'Verstuur aanvraag',
    sending: 'Versturen…',
    errors: {
      required: 'Vul dit veld in.',
      email: 'Vul een volledig e-mailadres in.',
      privacy: 'Vink aan dat je akkoord gaat met de privacyverklaring.',
      send: 'Versturen lukte niet. Probeer het opnieuw of mail naar info@forgelineoptimizations.nl.',
    },
    subject: 'Nieuwe aanvraag via forgelineoptimizations.nl',
    next: {
      title: 'Wat er daarna gebeurt',
      steps: [
        'Ik reageer binnen twee werkdagen.',
        'We hebben een kennismaking van 20 minuten.',
        'Je krijgt een voorstel voor een audit, met vaste prijs.',
      ],
    },
  },

  // /request-received
  received: {
    metaTitle: 'Aanvraag ontvangen · Forgeline Optimizations',
    metaDescription: 'Je aanvraag is binnen. Ik reageer binnen twee werkdagen.',
    title: 'Bedankt, je aanvraag is binnen',
    lead: 'Ik lees je bericht persoonlijk en reageer binnen twee werkdagen.',
    back: 'Terug naar de site',
  },

  // 404
  notFound: {
    metaTitle: 'Pagina niet gevonden · Forgeline Optimizations',
    metaDescription: 'Deze pagina bestaat niet.',
    title: 'Deze pagina bestaat niet',
    lead: 'De lijn loopt hier dood. Ga terug naar het begin.',
    back: 'Naar de homepage',
  },

  // /privacy en /voorwaarden: alleen titels en labels. De juridische tekst zelf (van Sander) staat in i18n/legal/*.md.
  legal: {
    updated: 'Laatst bijgewerkt',
    version: 'Versie',
    privacy: {
      metaTitle: 'Privacyverklaring · Forgeline Optimizations',
      metaDescription: 'Hoe Forgeline Optimizations omgaat met de gegevens die je via de site deelt.',
      title: 'Privacyverklaring',
    },
    terms: {
      metaTitle: 'Algemene voorwaarden · Forgeline Optimizations',
      metaDescription: 'De algemene voorwaarden van Forgeline Optimizations.',
      title: 'Algemene voorwaarden',
    },
  },

  footer: {
    tagline: 'Procesautomatisering & AI voor het mkb.',
    contactTitle: 'Contact',
    contactCta: 'Plan een kennismaking',
    companyTitle: 'Bedrijfsgegevens',
    kvk: 'KvK',
    vat: 'Btw',
    legalTitle: 'Juridisch',
    privacy: 'Privacyverklaring',
    terms: 'Algemene voorwaarden',
    copyright: '© {year} Forgeline Optimizations',
    analytics: 'Cookieloze statistieken via Plausible',
  },
} as const;
