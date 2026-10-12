// Welke processtap welk oordeel krijgt. Teksten: t(locale).oordeel.items[id].
export type Verdict = 'go' | 'wait' | 'no';

export const verdicts = [
  { id: 'offerte', verdict: 'go' },
  { id: 'factuur', verdict: 'go' },
  { id: 'planning', verdict: 'wait' },
  { id: 'klacht', verdict: 'no' },
  { id: 'inkoop', verdict: 'no' },
] as const satisfies readonly { id: string; verdict: Verdict }[];

export type VerdictId = (typeof verdicts)[number]['id'];

// Mobiel toont alleen deze vier, in deze volgorde (MobielOordeel.dc.html).
export const verdictsMobile: readonly VerdictId[] = ['offerte', 'planning', 'klacht', 'factuur'];

export const defaultVerdict: VerdictId = 'offerte';
