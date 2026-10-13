import { describe, expect, it } from 'vitest';
import { site } from '../../src/data/site';
import { readLegal } from '../support/legal';

// De juridische teksten zijn van Sander en noemen de bedrijfsgegevens letterlijk. Verandert site.ts (verhuizing,
// nieuw e-mailadres), dan moet de tekst mee; deze test laat dat niet vergeten.
describe('legal texts', () => {
  const privacy = readLegal('privacy');
  const terms = readLegal('voorwaarden');

  it('match the company data in site.ts', () => {
    const address = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
    for (const value of [address, site.kvk, site.vat, site.email]) expect(privacy.body).toContain(value);
    for (const value of [address, site.kvk]) expect(terms.body).toContain(value);
  });

  it('have no open placeholders left', () => {
    // Markdown-links ([tekst](url)) mogen; losse [HOOFDLETTERS] of [TEKST VOLGT] niet.
    for (const { body } of [privacy, terms]) expect(body).not.toMatch(/\[[^\]]*\](?!\()/);
  });

  it('carry a date (and the terms a version)', () => {
    expect(privacy.meta.updated).toMatch(/^\d{1,2} \p{L}+ \d{4}$/u);
    expect(terms.meta.updated).toMatch(/^\d{1,2} \p{L}+ \d{4}$/u);
    expect(terms.meta.version).toMatch(/^\d+\.\d+$/);
  });

  it('name every processor the site actually uses', () => {
    for (const name of ['Web3Forms', 'GitHub', 'Plausible']) expect(privacy.body).toContain(name);
  });
});
