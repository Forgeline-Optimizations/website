/**
 * Koppelt de stapknoppen aan de panelen van één verdict-blok.
 * Contract met de markup (Werkwijze.astro, stap "advies"): [data-verdict-root] > [data-verdict-step=id] + [data-verdict-panel=id].
 * Zichtbaarheid via data-active: CSS toont met JS alleen het actieve paneel (`hidden` werkt niet, want
 * .fl-verdict__panel heeft display: flex). Zonder JS staan alle panelen open.
 */
export function initVerdict(root: HTMLElement): void {
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-verdict-step]')];
  const panels = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-verdict-panel]')].map((p) => [p.dataset.verdictPanel!, p]),
  );
  if (!steps.length) return;

  const select = (id: string, focus = false) => {
    steps.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.verdictStep === id)));
    panels.forEach((p, key) => p.toggleAttribute('data-active', key === id));
    if (focus) steps.find((b) => b.dataset.verdictStep === id)?.focus();
  };

  // Na de eerste keuze van de bezoeker vervaagt elk nieuw paneel in (CSS); bij het laden niet.
  const choose = (id: string, focus = false) => {
    root.setAttribute('data-switched', '');
    select(id, focus);
  };

  steps.forEach((b) => {
    b.addEventListener('click', () => choose(b.dataset.verdictStep!));
    // Pijltjes verplaatsen binnen de lijst; Tab verlaat hem (gewone knoppen, geen roving tabindex nodig).
    b.addEventListener('keydown', (e) => {
      const next =
        e.key === 'ArrowDown' || e.key === 'ArrowRight'
          ? 1
          : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
            ? -1
            : 0;
      if (!next) return;
      e.preventDefault();
      const visible = steps.filter((s) => s.offsetParent !== null); // overslaat verborgen knoppen, als die er zijn
      const at = visible.indexOf(b);
      const target = visible[(at + next + visible.length) % visible.length];
      choose(target.dataset.verdictStep!, true);
    });
  });

  const initial = steps.find((b) => b.getAttribute('aria-pressed') === 'true') ?? steps[0];
  select(initial.dataset.verdictStep!);
}

document.querySelectorAll<HTMLElement>('[data-verdict-root]').forEach(initVerdict);
