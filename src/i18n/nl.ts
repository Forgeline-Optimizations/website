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
    home: 'Naar het begin',
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
  // Fase 2 vult de rest van de hero aan; de kop staat er al zodat index.astro geen tekst bevat.
  hero: {
    title: 'Automatiseer wat het waard is. Ik help te vinden wat dat is.',
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
