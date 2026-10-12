# ADR-002: Domein en DNS blijven bij TransIP

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
forgelineoptimizations.nl is geregistreerd bij TransIP. Zakelijke mail (info@ en nales@) draait op hetzelfde domein.

## Beslissing
Domein en DNS blijven bij TransIP. Voor GitHub Pages worden alleen records toegevoegd:
- `@` → vier A-records naar GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), plus de vier AAAA-records uit de GitHub-docs.
- `www` → CNAME naar `<github-gebruikersnaam>.github.io.`
Controleer de IP-adressen in de actuele GitHub Pages-documentatie op het moment van instellen.

## Onderbouwing
Geen nameserververhuizing betekent geen risico voor de mail. GitHub Pages ondersteunt een apex-domein via A-records.

## Overwogen alternatieven
- **Nameservers naar Cloudflare:** nodig voor Cloudflare Pages op het kale domein; extra bewegend onderdeel en risico voor MX/SPF/DKIM/DMARC.
- **Hosting bij TransIP:** betaald, FTP-uploads, geen CI-deploy.

## Gevolgen
- MX-, SPF-, DKIM- en DMARC-records nooit aanraken bij het instellen.
- Domein verifiëren in GitHub (account → Pages → verified domains) tegen domain takeover.
- "Enforce HTTPS" pas aanzetten als het certificaat is uitgegeven.
