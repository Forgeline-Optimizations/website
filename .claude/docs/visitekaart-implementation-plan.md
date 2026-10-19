# Implementation plan — Digitale visitekaart (`/visitekaart`)

> Location in repo: `.claude/docs/visitekaart-implementation-plan.md`
> Status: ready for Claude Code
> Date: 2026-10-19

## 0. Anchor

- **What this adds:** one standalone, Dutch-only page at `forgelineoptimizations.nl/visitekaart` that works as a digital business card. It is opened by tapping Sander's phone (Android HCE NFC emulator app sending the URL) or by scanning a QR code.
- **Key design decision:** the page is a hidden, self-contained route. It uses its own minimal layout (no navigation, no forge-line scroll, no GSAP) and is reachable **only via the direct link**. No button, nav item or footer link on the main site points to it, and it is excluded from search engines.
- **Out of scope:** the ongoing site-shortening work (new "how I work" chapter) is a separate plan and is not touched here. No English version. No backend; the vCard is a static file.

### Acceptance criteria

1. `https://forgelineoptimizations.nl/visitekaart` loads a mobile-first card in the Forgeline huisstijl (darkish, professional, not terminal-like).
2. Nothing on the main site links to `/visitekaart`; it is not in `sitemap-index.xml` / `sitemap-0.xml`; it carries `noindex, nofollow`.
3. The page shows: logo, name, role, a one-line description of Forgeline, and buttons for **Contact opslaan**, **Bellen**, **Mailen**, **Website bekijken** (and optionally **LinkedIn**).
4. **Contact opslaan** downloads a `.vcf` that imports correctly on Android and iPhone.
5. Visits from `?ref=nfc` and `?ref=qr` are distinguishable in Plausible, and button clicks are tracked as goals.
6. Lighthouse (mobile) scores 95+ in all four categories — except SEO, which may drop because of `noindex`; that is expected and accepted.
7. All visible text is Dutch.

### Open values to fill in before building

| Placeholder | Meaning |
|---|---|
| `{{FULL_NAME}}` | Sander's full name as it should appear on the card |
| `{{ROLE}}` | e.g. "Oprichter & automatiseringsconsultant" |
| `{{PHONE_E164}}` | phone in international format, e.g. `+316XXXXXXXX` |
| `{{PHONE_DISPLAY}}` | phone as shown to people, e.g. `06 XX XX XX XX` |
| `{{LINKEDIN_URL}}` | optional; remove the button if not used |

Email is `info@forgelineoptimizations.nl`; website is `https://forgelineoptimizations.nl`.

---

## 1. Steps

### Step 1 — Audit existing setup

**Why:** the plan below assumes standard Astro conventions. Before writing files, Claude Code must confirm the real names and config so the new page plugs in without breaking the main site.

**Check and note:**
- Name/location of the existing base layout(s) in `src/layouts/` and how the huisstijl tokens are exposed (Tailwind theme in `tailwind.config.*`, CSS variables in a global stylesheet, or both).
- Whether `@astrojs/sitemap` is installed and configured in `astro.config.mjs`.
- How Plausible is loaded (which script variant: plain `script.js`, or one with `tagged-events` / `outbound-links`), and in which layout.
- Where the logo lives (`src/assets/` or `public/`) and whether an SVG version exists.
- `public/robots.txt` contents.

No code changes in this step.

---

### Step 2 — Create `src/layouts/CardLayout.astro`

**Why:** the main layout loads the navigation, the forge-line scroll and GSAP. None of that belongs on a card that must load instantly on a phone someone just tapped. A dedicated minimal layout keeps the page fast and keeps the hidden route fully decoupled from the main site's structure.

**What changes:** new layout with only the essentials: `<html lang="nl">`, meta viewport, `noindex`, the global stylesheet / Tailwind base, fonts from the huisstijl, and the Plausible script (same variant as the main site, see Step 1).

```astro
---
// src/layouts/CardLayout.astro
// Minimal layout for hidden standalone pages (currently only /visitekaart).
// NOTE: deliberately does NOT import the site header/nav, ForgeLine, or GSAP.
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <!-- Hidden page: reachable only via direct link (NFC/QR) -->
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="/* huisstijl background token */" />
    <link rel="icon" href="/favicon.svg" />
    <!-- Reuse the exact same global CSS import and Plausible snippet as the main layout -->
    <!-- ... -->
  </head>
  <body class="min-h-dvh bg-[--forge-bg] text-[--forge-fg] antialiased">
    <slot />
  </body>
</html>
```

> Replace the `--forge-*` names with the real tokens found in Step 1.

---

### Step 3 — Create `public/sander-forgeline.vcf`

**Why:** the "Contact opslaan" button needs a file that phones open as "add contact". A static vCard 3.0 file is the most widely supported format on both Android and iOS and needs no backend.

**What changes:** new file. Use **CRLF line endings** (vCard spec) and UTF-8.

```text
BEGIN:VCARD
VERSION:3.0
N:{{LAST_NAME}};{{FIRST_NAME}};;;
FN:{{FULL_NAME}}
ORG:Forgeline Optimizations
TITLE:{{ROLE}}
TEL;TYPE=CELL,VOICE:{{PHONE_E164}}
EMAIL;TYPE=INTERNET,WORK:info@forgelineoptimizations.nl
URL:https://forgelineoptimizations.nl
NOTE:Procesoptimalisatie\, automatisering en eerlijk AI-advies.
END:VCARD
```

Notes:
- Escape commas in `NOTE` with `\,` as shown.
- A `PHOTO` (base64 logo) is optional. Leave it out in v1; it bloats the file and some Android contact apps handle it poorly.
- GitHub Pages serves `.vcf` with a vCard MIME type; verify in Step 8.

---

### Step 4 — Create `src/pages/visitekaart.astro`

**Why:** this is the card itself. Astro turns `src/pages/visitekaart.astro` into the `/visitekaart` route automatically, and because no other page links to it, it stays reachable only via the direct link.

**What changes:** new page using `CardLayout`. Single centred card, mobile first, large tap targets (min 48px height), Dutch copy.

```astro
---
// src/pages/visitekaart.astro
// Hidden digital business card. Shared via NFC tap (?ref=nfc) or QR (?ref=qr).
// NOTE: must never be linked from the main site, nav, footer or sitemap.
import CardLayout from '../layouts/CardLayout.astro';
import logo from '../assets/logo.svg'; // adjust to real path from Step 1

const contact = {
  name: '{{FULL_NAME}}',
  role: '{{ROLE}}',
  tagline: 'Ik help bedrijven van 10 tot 100 mensen slimmer werken, met eerlijk advies over wat wél en níet geautomatiseerd moet worden.',
  phoneE164: '{{PHONE_E164}}',
  phoneDisplay: '{{PHONE_DISPLAY}}',
  email: 'info@forgelineoptimizations.nl',
  website: 'https://forgelineoptimizations.nl',
  linkedin: '{{LINKEDIN_URL}}', // set to '' to hide the button
};
---
<CardLayout
  title={`${contact.name} · Forgeline Optimizations`}
  description="Digitale visitekaart van Forgeline Optimizations."
>
  <main class="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-10">
    <img src={logo.src} alt="Forgeline Optimizations" class="mb-8 h-10 w-auto" />

    <h1 class="text-3xl font-semibold">{contact.name}</h1>
    <p class="mt-1 opacity-80">{contact.role}</p>
    <p class="mt-4 leading-relaxed">{contact.tagline}</p>

    <nav class="mt-8 flex flex-col gap-3" aria-label="Contactopties">
      <!-- Primary action: most valuable conversion -->
      <a href="/sander-forgeline.vcf" download
         class="btn-primary plausible-event-name=Contact+Opslaan">
        Contact opslaan
      </a>
      <a href={`tel:${contact.phoneE164}`}
         class="btn-secondary plausible-event-name=Bellen">
        Bellen · {contact.phoneDisplay}
      </a>
      <a href={`mailto:${contact.email}`}
         class="btn-secondary plausible-event-name=Mailen">
        Mailen
      </a>
      <a href={`${contact.website}/?ref=visitekaart`}
         class="btn-secondary plausible-event-name=Website+Bekijken">
        Website bekijken
      </a>
      {contact.linkedin && (
        <a href={contact.linkedin} target="_blank" rel="noopener"
           class="btn-secondary plausible-event-name=LinkedIn">
          LinkedIn
        </a>
      )}
    </nav>
  </main>
</CardLayout>
```

Styling notes:
- Define `btn-primary` / `btn-secondary` with the huisstijl accent colour and existing button styles, either as Tailwind `@apply` classes or by reusing the site's existing button component if one exists (Step 1).
- Optional subtle touch: a thin animated accent line referencing the forge line, done in pure CSS (no GSAP), and respecting `prefers-reduced-motion`.
- The `plausible-event-name=…` classes only work with Plausible's **tagged-events** script variant. If the site uses the plain script, either switch both layouts to the tagged-events variant or call `window.plausible('Contact Opslaan')` in a small inline click handler instead. Pick whichever matches Step 1.

---

### Step 5 — Edit `astro.config.mjs` (sitemap exclusion)

**Why:** `@astrojs/sitemap` includes every page by default. Without a filter, `/visitekaart` would be listed and discoverable, which breaks the "only via direct link" requirement.

```js
// astro.config.mjs
// BEFORE
sitemap(),

// AFTER
sitemap({
  // Hidden pages: reachable only via direct link (NFC/QR), never listed
  filter: (page) => !page.includes('/visitekaart'),
}),
```

If the sitemap integration is not installed (Step 1), skip this step and note it.

---

### Step 6 — Audit `public/robots.txt`

**Why:** it is tempting to add `Disallow: /visitekaart`, but that would stop crawlers from seeing the `noindex` tag, and the URL could still be indexed from external links. `noindex` in the page itself is the correct mechanism.

**What changes:** make sure `/visitekaart` is **not** disallowed. No other change.

---

### Step 7 — Create `scripts/generate-visitekaart-qr.mjs`

**Why:** the QR code is the fallback for phones that can't read the NFC emulator (often iPhones). Generating it from a script keeps the URL and brand colours in the repo and makes it reproducible.

**What changes:** add `qrcode` as a dev dependency (`npm i -D qrcode`) and a small script that writes SVG and PNG into `docs/visitekaart/` (not `public/`, since the QR doesn't belong on the site).

```js
// scripts/generate-visitekaart-qr.mjs
// Generates the QR fallback for the digital business card.
// Output goes to docs/ on purpose: the QR is shared from the phone, not shown on the site.
import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';

const URL = 'https://forgelineoptimizations.nl/visitekaart?ref=qr';
const colors = { dark: '#______', light: '#______' }; // huisstijl tokens, high contrast!
const outDir = 'docs/visitekaart';

await mkdir(outDir, { recursive: true });
await QRCode.toFile(`${outDir}/visitekaart-qr.svg`, URL, { type: 'svg', margin: 2, color: colors, errorCorrectionLevel: 'M' });
await QRCode.toFile(`${outDir}/visitekaart-qr.png`, URL, { width: 1024, margin: 2, color: colors, errorCorrectionLevel: 'M' });
console.log('QR written to', outDir);
```

Add to `package.json` scripts: `"qr:visitekaart": "node scripts/generate-visitekaart-qr.mjs"`.

> Keep the dark module colour much darker than the background colour; low-contrast "brand" QR codes often fail to scan. A dark-on-light QR is the safest.

---

### Step 8 — Edit `docs/` (usage notes for Sander)

**Why:** the links for NFC and QR need to be written down somewhere outside the code so they aren't retyped wrongly later.

**What changes:** create `docs/visitekaart/README.md` with:
- NFC link for the HCE emulator app: `https://forgelineoptimizations.nl/visitekaart?ref=nfc`
- QR link: `https://forgelineoptimizations.nl/visitekaart?ref=qr`
- How to regenerate the QR (`npm run qr:visitekaart`).
- Phone setup: NFC on, emulator app set as default payment/HCE service if asked, screen unlocked when tapping, tap near the back camera.

Note for Plausible: the `ref` query parameter is picked up automatically as the traffic source, so `nfc` and `qr` show up under **Sources** without extra configuration.

---

### Step 9 — Plausible goals (dashboard, no code)

**Why:** the tagged clicks from Step 4 only show up in reports once matching custom-event goals exist.

**What changes:** in the Plausible dashboard, add custom-event goals: `Contact Opslaan`, `Bellen`, `Mailen`, `Website Bekijken`, `LinkedIn` (if used). Names must match the event names exactly (`+` in the class becomes a space).

---

## 2. Tests

### 2a. Build checks (automated / local)

| Check | Proves |
|---|---|
| `npm run build` succeeds | new layout/page compile; no broken imports |
| `dist/visitekaart/index.html` exists | route is generated |
| `grep -r "visitekaart" dist/sitemap-*.xml` returns nothing | sitemap exclusion works |
| `grep -rl "/visitekaart" dist --include=*.html` returns **only** `dist/visitekaart/index.html` | no page on the main site links to the card |
| `dist/visitekaart/index.html` contains `noindex, nofollow` | page is hidden from search |
| `dist/visitekaart/index.html` contains no GSAP / ForgeLine bundle | layout stays minimal |
| `dist/sander-forgeline.vcf` exists and uses CRLF | vCard deployed and spec-compliant |

The "only links from itself" check is the most important one: it is the acceptance criterion most likely to break silently during future site changes.

### 2b. Manual device tests (after deploy)

| Test | Pass when |
|---|---|
| NFC tap: Galaxy S26 → another Android | browser opens `/visitekaart?ref=nfc` |
| NFC tap: Galaxy S26 → iPhone | opens, or fails gracefully (then QR is the fallback) |
| QR scan with Android and iPhone camera | opens `/visitekaart?ref=qr` |
| "Contact opslaan" on Android | contact app opens with all fields filled |
| "Contact opslaan" on iPhone (Safari) | "Maak nieuw contact" sheet appears with correct fields |
| Bellen / Mailen | dialer / mail app opens with correct number / address |
| Plausible realtime | visit shows `nfc` or `qr` as source; button clicks appear as goals |
| Lighthouse mobile on `/visitekaart` | Performance, Accessibility, Best Practices ≥ 95 (SEO lower due to `noindex` is expected) |
| `curl -I https://forgelineoptimizations.nl/sander-forgeline.vcf` | `Content-Type` is a vCard type (`text/vcard` or `text/x-vcard`) |

---

## 3. Summary

| File | Action | What changes |
|---|---|---|
| — | **Audit** | Layout names, design tokens, sitemap config, Plausible variant, logo path |
| `src/layouts/CardLayout.astro` | **Create** | Minimal `noindex` layout without nav/GSAP |
| `public/sander-forgeline.vcf` | **Create** | Static vCard 3.0 for "Contact opslaan" |
| `src/pages/visitekaart.astro` | **Create** | The Dutch-only card page with tracked buttons |
| `astro.config.mjs` | **Edit** | Exclude `/visitekaart` from sitemap |
| `public/robots.txt` | **Audit** | Ensure `/visitekaart` is not disallowed |
| `scripts/generate-visitekaart-qr.mjs` | **Create** | QR generator for `?ref=qr` link |
| `package.json` | **Edit** | Add `qrcode` dev dependency and `qr:visitekaart` script |
| `docs/visitekaart/README.md` | **Create** | NFC/QR links, phone setup, regeneration steps |
| Plausible dashboard | **Configure** | Custom-event goals for each button |

Out of scope: the site-shortening plan, English version, dynamic/editable card content, and an Apple/Google Wallet pass.
