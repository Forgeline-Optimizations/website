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
      { id: 'werkwijze', label: 'Werkwijze' },
      { id: 'aanbod', label: 'Aanbod' },
      { id: 'over-mij', label: 'Over mij' },
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
      'Handmatige stap',
      'Kopiëren en plakken',
      'Welke versie klopt?',
      'Overtypen',
      'Wachten op antwoord',
      'Losse lijstjes',
      'Dubbel werk',
    ],
    // Mobiel: drie labels, in de volgorde van src/data/hero-chaos.ts → chaosNodesMobile.
    nodesMobile: ['Handmatige stap', 'Overtypen', 'Welke versie klopt?'],
  },

  // 02 · Werkwijze — vervangt Inzicht, Standaard, Automatisch en Oordeel (ADR-015).
  werkwijze: {
    kicker: 'Hoofdstuk 02 · Werkwijze',
    title: 'Van losse stappen naar een proces dat loopt',
    lead: 'Veel processen zijn gegroeid in plaats van ontworpen. Ik maak ze zichtbaar, maak ze eenduidig, en automatiseer alleen wat dat waard is.',
    steps: [
      {
        id: 'kaart',
        num: '01',
        label: 'In kaart',
        title: 'Eerst kijken, dan bouwen',
        text: 'Ik loop mee met de mensen die het werk doen en breng elke stap in kaart: wat er gebeurt, hoe vaak, hoe lang en in welk systeem.',
        nodes: ['Binnenkomst', 'Verwerken', 'Controleren', 'Vastleggen', 'Afronden'],
        tags: ['Dubbel werk', 'Wachttijd', 'Zoekwerk'],
      },
      {
        id: 'standaard',
        num: '02',
        label: 'Standaardiseren',
        title: 'Eén werkwijze',
        text: 'Doet iedereen het op zijn eigen manier, dan automatiseer je de chaos. Eerst spreken we samen één werkwijze af.',
        lanes: [
          { who: 'Collega A', chips: ['Binnenkomst', 'Verwerken', 'Vastleggen'] },
          { who: 'Collega B', chips: ['Verwerken', 'Binnenkomst', 'Nabellen'] },
          { who: 'Collega C', chips: ['Briefje', 'Vastleggen', 'Verwerken'] },
        ],
        standardLabel: 'Eén werkwijze',
        standard: ['Binnenkomst', 'Verwerken', 'Vastleggen'],
      },
      {
        id: 'automatisch',
        num: '03',
        label: 'Automatiseren',
        title: 'Dan gaat de lijn aan',
        text: 'Ik bouw wat zich terugverdient: getest, gedocumenteerd en overgedragen aan je team. Geen demo, maar iets dat blijft draaien.',
        nodes: [
          { name: 'Binnenkomst', mode: 'auto' },
          { name: 'Verwerken', mode: 'auto' },
          { name: 'Controleren', mode: 'human' },
          { name: 'Vastleggen', mode: 'auto' },
        ],
        modeLabels: { auto: 'Automatisch', human: 'Mens' },
      },
      {
        id: 'advies',
        num: '04',
        label: 'Eerlijk advies',
        title: 'Niet alles moet automatisch. En niet alles heeft AI nodig.',
        text: 'Je krijgt een rapport met per stap mijn advies: automatiseren, eerst standaardiseren, of gewoon mensenwerk laten. Klik op een soort werk en zie hoe ik het beoordeel.',
      },
    ],
    verdict: {
      stepsLabel: 'Soorten werk',
      labels: {
        rules: 'Automatiseren · zonder AI',
        ai: 'Automatiseren · met AI',
        wait: 'Eerst standaardiseren',
        no: 'Niet automatiseren',
      },
      items: {
        overtypen: {
          title: 'Gegevens overtypen tussen systemen',
          shortTitle: 'Overtypen',
          reason:
            'Vaste stappen en vaste regels. Een eenvoudige koppeling doet dit foutloos; AI zou hier alleen kosten en onzekerheid toevoegen.',
        },
        rommelig: {
          title: 'Een proces dat iedereen anders doet',
          shortTitle: 'Rommelig proces',
          reason:
            'Eerst samen één werkwijze afspreken. Wie chaos automatiseert, krijgt alleen snellere chaos.',
        },
        documenten: {
          title: 'Wisselende documenten en e-mails lezen',
          shortTitle: 'Documenten lezen',
          reason:
            'Hier helpt AI echt: informatie uit tekst halen die steeds anders is opgebouwd. Altijd met een moment waarop een mens meekijkt.',
        },
        persoonlijk: {
          title: 'Persoonlijk contact en afwegingen',
          shortTitle: 'Persoonlijk contact',
          reason:
            'Klanten willen een mens spreken, en afwegingen horen bij jou. Ik maak de informatie overzichtelijk; de beslissing blijft van jou.',
        },
      },
    },
  },

  // 03 · Aanbod (licht)
  aanbod: {
    kicker: 'Hoofdstuk 03 · Aanbod',
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

  // 04 · Over mij
  overMij: {
    kicker: 'Hoofdstuk 04 · Wie ik ben',
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

  // 05 · Contact (formulierdeel licht)
  contact: {
    kicker: 'Hoofdstuk 05 · Contact',
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
