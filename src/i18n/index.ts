import { nl } from './nl';
import type { Dictionary } from './types';

export type Locale = 'nl' | 'en';
export type { Dictionary };

const dictionaries: Partial<Record<Locale, Dictionary>> = { nl };

/** Teksten voor een taal; valt terug op Nederlands zolang `en.ts` nog niet bestaat (ADR-008). */
export function t(locale: Locale = 'nl'): Dictionary {
  return dictionaries[locale] ?? nl;
}
