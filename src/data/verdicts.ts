// Welke soort werk welk oordeel krijgt. Teksten: t(locale).werkwijze.verdict.items[id].
export type Verdict = 'rules' | 'ai' | 'wait' | 'no';

export const verdicts = [
  { id: 'overtypen', verdict: 'rules' },
  { id: 'rommelig', verdict: 'wait' },
  { id: 'documenten', verdict: 'ai' },
  { id: 'persoonlijk', verdict: 'no' },
] as const satisfies readonly { id: string; verdict: Verdict }[];

export type VerdictId = (typeof verdicts)[number]['id'];

export const defaultVerdict: VerdictId = 'overtypen';
