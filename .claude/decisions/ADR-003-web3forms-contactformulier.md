# ADR-003: Contactformulier via Web3Forms

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
GitHub Pages heeft geen backend. Sander heeft een Web3Forms-formulier aangemaakt dat naar info@forgelineoptimizations.nl stuurt, met redirect naar `https://forgelineoptimizations.nl/request-received`.

## Beslissing
Het formulier staat in sectie `#contact` en post naar `https://api.web3forms.com/submit` met: `access_key`, `redirect`, `subject`, `from_name`, de velden naam, bedrijf, e-mail, telefoon (optioneel), bericht, een verplichte privacy-checkbox en de honeypot `botcheck`. Zonder JS werkt het als gewone POST met redirect. Met JS: client-side validatie met Nederlandse foutmeldingen, verzenden via `fetch`, en bij succes doorsturen naar `/request-received`.

## Onderbouwing
Geen eigen server of serverless functie nodig. Werkt zonder JavaScript. Gratis volume past ruim bij het verwachte aantal aanvragen.

## Overwogen alternatieven
- **Formspree:** vergelijkbaar; Web3Forms was al ingericht.
- **Alleen `mailto:`:** drempel hoger, geen bevestigingspagina, geen conversiemeting.
- **Eigen serverless functie:** extra infrastructuur zonder winst.

## Gevolgen
- De access key staat publiek in de HTML (zo bedoeld). In Web3Forms het domein vastzetten.
- De key staat in `src/data/site.ts` (`web3formsAccessKey`), niet verspreid door componenten.
- `/request-received` moet bestaan en is het Plausible-conversiedoel (ADR-007).
- Privacyverklaring moet Web3Forms als verwerker noemen.
