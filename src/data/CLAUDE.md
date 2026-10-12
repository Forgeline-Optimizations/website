# Module: data

**Verantwoordelijkheid:** taalonafhankelijke gegevens en configuratie.
**Fase:** 2 — ✓

## Bestanden
- `site.ts` — bedrijfsgegevens en externe diensten:
  ```ts
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
  ```
- `verdicts.ts` — `{ id, verdict: 'go' | 'wait' | 'no' }[]` in volgorde; teksten via `t(locale).oordeel.items[id]`.
- `verdicts.ts` exporteert ook `verdictsMobile` (welke vier mobiel zichtbaar zijn) en `defaultVerdict`.
- `hero-chaos.ts` — posities, rotaties en curvepaden van het chaos-veld uit `Main.dc.html` (`chaosNodes`, `chaosWires`, doos 600 × 580) en `MobielHero.dc.html` (`chaosNodesMobile`, doos 334 × 200). Elke node verwijst met `node` naar de index in `t().hero.nodes`.

## Regel
Wijzig bedrijfsgegevens alleen hier. Footer, privacypagina en structured data lezen allemaal uit `site.ts`.
