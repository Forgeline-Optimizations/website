# ADR-001: Astro als statische site, gehost op GitHub Pages

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
De site is een one-pager met scroll-animatie, een interactief onderdeel en een formulier. Er is geen server-logica nodig. Sander wil gratis, onderhoudsarm hosten, met elke `git push` als deploy.

## Beslissing
Astro met `output: 'static'`, TypeScript strict, gebouwd en gedeployd door GitHub Actions (`withastro/action` + `actions/deploy-pages`) naar GitHub Pages. Custom domain via `public/CNAME`; `site: 'https://forgelineoptimizations.nl'`, geen `base`.

## Onderbouwing
Astro levert standaard nul JavaScript, behalve waar je het toevoegt; dat maakt Lighthouse 95+ haalbaar ondanks GSAP. Statische output past één-op-één op GitHub Pages. Case studies kunnen later als Markdown-content collection.

## Overwogen alternatieven
- **Next.js / React-app:** te veel runtime voor een one-pager.
- **Website builder (Framer, Webflow):** abonnement, minder controle, past niet bij het "ik bouw het zelf, production-grade"-verhaal.
- **Netlify / Vercel / Cloudflare Pages:** prima, maar extra account; Cloudflare Pages wil voor het kale domein de nameservers verhuizen (zie ADR-002). Overstappen kan later zonder codewijziging.

## Gevolgen
- Geen server: formulier via externe dienst (ADR-003).
- Repo moet publiek zijn op een gratis GitHub-plan (Pages op private repo vereist betaald plan). Er staan geen geheimen in de repo.
- Lockfile committen: de action detecteert er de package manager mee.
