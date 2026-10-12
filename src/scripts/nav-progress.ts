// Nav-status volgt de sectie die het midden van het scherm kruist (ook zonder GSAP):
// huidig hoofdstuk = aria-current="step", gepasseerd = .is-done, en de nav neemt het thema van die
// sectie over. Mobiel: de 2px-balk onder de nav toont de scrollvoortgang via --progress.

export function initNavProgress(doc: Document = document): void {
  const nav = doc.querySelector<HTMLElement>('.fl-nav');
  const sections = [...doc.querySelectorAll<HTMLElement>('main > section[id]')];
  if (!nav || sections.length === 0) return;

  const order = sections.map((s) => s.id);
  const links = new Map(
    [...nav.querySelectorAll<HTMLAnchorElement>('[data-nav-chapter]')].map((a) => [a.dataset.navChapter!, a]),
  );

  function setActive(id: string) {
    const idx = order.indexOf(id);
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
      // Over mij en Contact hebben geen label: dan staan alle zes op is-done.
      a.classList.toggle('is-done', order.indexOf(key) < idx);
    });
    nav!.setAttribute('data-theme', doc.getElementById(id)?.dataset.theme ?? 'dark');
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).id)),
    { rootMargin: '-50% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  let queued = false;
  const update = () => {
    queued = false;
    const max = doc.documentElement.scrollHeight - innerHeight;
    nav.style.setProperty('--progress', String(max > 0 ? Math.min(1, scrollY / max) : 0));
  };
  addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
