// Taalonafhankelijke bedrijfsgegevens. Footer, privacypagina en structured data lezen allemaal hieruit.
export const site = {
  name: 'Forgeline Optimizations',
  url: 'https://forgelineoptimizations.nl',
  email: 'info@forgelineoptimizations.nl',
  personalEmail: 'nales@forgelineoptimizations.nl',
  address: { street: 'Krammerstraat 23e', postalCode: '1078 KG', city: 'Amsterdam', country: 'NL' },
  kvk: '42183249',
  vat: 'NL005563350B62',
  web3formsAccessKey: 'WEB3FORMS_ACCESS_KEY', // publiek per ontwerp (ADR-003); vervangen door de echte key
  formRedirect: 'https://forgelineoptimizations.nl/request-received',
  plausibleScriptSrc: '', // uit Plausible → Site Installation; leeg = geen analytics (ADR-007)
} as const;
