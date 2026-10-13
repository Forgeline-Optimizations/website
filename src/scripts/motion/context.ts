// Gedeelde types en token-helper voor de motion-modules. Los van index.ts, zodat hoofdstukmodules dit
// kunnen importeren zonder een kringverwijzing naar index.ts.

export type Tokens = {
  /** Seconden, uit --dur-fast / --dur-base / --dur-slow. */
  durFast: number;
  durBase: number;
  durSlow: number;
  /** Waarde van --glow-forge (box-shadow). */
  glow: string;
};

export type MotionContext = { desktop: boolean; mobile: boolean; tokens: Tokens };

/** Een hoofdstuk zet zijn beweging op; de teruggegeven functie herstelt wat GSAP niet zelf terugzet. */
export type Setup = (c: MotionContext) => void | (() => void);

export function readTokens(): Tokens {
  const css = getComputedStyle(document.documentElement);
  const seconds = (name: string) => parseFloat(css.getPropertyValue(name)) / 1000 || 0.3;
  return {
    durFast: seconds('--dur-fast'),
    durBase: seconds('--dur-base'),
    durSlow: seconds('--dur-slow'),
    glow: css.getPropertyValue('--glow-forge').trim(),
  };
}
