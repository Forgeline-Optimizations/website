# Digitale visitekaart — gebruiksnotities

De kaart zelf: `/visitekaart` (code in `src/pages/visitekaart.astro`, plan in `.claude/docs/visitekaart-implementation-plan.md`). Deze pagina staat **nergens** gelinkt vanaf de site, de nav of de footer, en krijgt `noindex, nofollow`: hij is alleen bereikbaar via de directe link.

## Links

- **NFC** (HCE-emulator app op de telefoon): `https://forgelineoptimizations.nl/visitekaart?ref=nfc`
- **QR**: `https://forgelineoptimizations.nl/visitekaart?ref=qr`

De `ref`-parameter wordt door Plausible automatisch als bron herkend; `nfc` en `qr` zijn dus zonder extra instellingen apart terug te zien onder **Sources**.

## QR opnieuw genereren

```
npm run qr:visitekaart
```

Schrijft `visitekaart-qr.svg` en `visitekaart-qr.png` (1024px) naar deze map. Kleuren zijn smeedzwart op werkplaatswit (huisstijl, hoog contrast) — verander dat niet naar iets met minder contrast; lage-contrast "merk"-QR's scannen onbetrouwbaar.

## Telefoon instellen (NFC)

1. NFC aanzetten in de instellingen.
2. Als de telefoon erom vraagt: de HCE-emulator app instellen als standaard betaal-/NFC-service.
3. Scherm ontgrendeld houden tijdens het tikken.
4. Tik met de achterkant van de telefoon (waar de NFC-antenne zit) tegen de andere telefoon.
5. Android-naar-Android werkt doorgaans direct. Android-naar-iPhone kan weigeren of niets doen — dan is de QR de fallback (iPhones lezen HCE-emulatie niet betrouwbaar).

## Beheer

- **vCard** (`public/sander-forgeline.vcf`): naam, rol en telefoonnummer staan hard gecodeerd in dat bestand én in `src/data/visitekaart.ts`. Wijzig ze op **beide** plekken.
- **Plausible-doelen**: moeten los in het Plausible-dashboard worden aangemaakt (custom events), de code zelf regelt dat niet. Zie `.claude/docs/visitekaart-implementation-plan.md` → stap 9 voor de exacte namen (`Contact Opslaan`, `Bellen`, `Mailen`, `Website Bekijken`).
