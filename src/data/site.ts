// Taalonafhankelijke bedrijfsgegevens. Footer, privacypagina en structured data lezen allemaal hieruit.
export const site = {
  name: 'Forgeline Optimizations',
  url: 'https://forgelineoptimizations.nl',
  email: 'info@forgelineoptimizations.nl',
  personalEmail: 'nales@forgelineoptimizations.nl',
  address: { street: 'Krammerstraat 23e', postalCode: '1078 KG', city: 'Amsterdam', country: 'NL' },
  kvk: '42183249',
  vat: 'NL005563350B62',
  web3formsAccessKey: '88823e03-f8b2-4b12-98f1-5af70b4938fa', // publiek per ontwerp (ADR-003); domein vastzetten in Web3Forms
  formRedirect: 'https://forgelineoptimizations.nl/request-received',
  plausibleScriptSrc: 'https://plausible.io/js/pa-qOkW4Q7YmqS_TxFriGXH8.js', // Plausible → Site Installation; leeg = geen analytics (ADR-007)
} as const;
