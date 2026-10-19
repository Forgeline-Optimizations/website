// Logt een Plausible-doel per knop op de digitale visitekaart. De knoppen zelf zijn gewone links
// (tel:/mailto:/download/href); dit voegt alleen het tellen toe, zonder dat te vereisen.
export {};
declare global {
  interface Window {
    plausible?: (...args: unknown[]) => void;
  }
}

document.querySelectorAll<HTMLElement>('[data-plausible-goal]').forEach((el) => {
  el.addEventListener('click', () => window.plausible?.(el.dataset.plausibleGoal!));
});
