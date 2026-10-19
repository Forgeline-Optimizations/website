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
- `verdicts.ts` — `{ id, verdict: 'rules' | 'ai' | 'wait' | 'no' }[]` in volgorde; teksten via `t(locale).werkwijze.verdict.items[id]`. Ook `defaultVerdict`. Mobiel toont alle vier (geen `verdictsMobile` meer, ADR-015).
- `hero-chaos.ts` — posities, rotaties en curvepaden van het chaos-veld uit `Main.dc.html` (`chaosNodes`, `chaosWires`, doos 600 × 580) en `MobielHero.dc.html` (`chaosNodesMobile`, doos 334 × 200). `chaosNodes.node` verwijst naar de index in `t().hero.nodes`; `chaosNodesMobile.node` naar de index in `t().hero.nodesMobile` (apart, kortere lijst).
- `visitekaart.ts` — persoonlijke contactgegevens voor `/visitekaart` (`card.name`, `role`, `phoneE164`, `phoneDisplay`). Los van `site.ts`: dat zijn bedrijfsgegevens, dit is persoonlijk. E-mail en website van de kaart komen wél uit `site.ts`. **Let op:** naam/rol/telefoon staan ook los in `public/sander-forgeline.vcf`; bij een wijziging hier ook dat bestand bijwerken (geen gedeelde bron, de vCard is statisch).

## Regel
Wijzig bedrijfsgegevens alleen hier. Footer, privacypagina en structured data lezen allemaal uit `site.ts`.
