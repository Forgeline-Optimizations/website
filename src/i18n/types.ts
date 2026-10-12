import type { nl } from './nl';

/** Maakt van letterlijke strings gewone `string`s, zodat een vertaling dezelfde vorm heeft maar andere tekst. */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

/** Vorm van een vertaling; een latere `en.ts` moet hieraan voldoen (`export const en: Dictionary = …`). */
export type Dictionary = Widen<typeof nl>;
