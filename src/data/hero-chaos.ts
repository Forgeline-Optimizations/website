// Het chaos-veld van de hero. Coördinaten in px binnen een vaste doos, overgenomen uit de artboards;
// de doos schaalt als geheel mee. Index `node` verwijst naar t(locale).hero.nodes.

// design/storyboard/Main.dc.html — doos 600 × 580
export const chaosBox = { width: 600, height: 580 };

export const chaosNodes = [
  { node: 0, x: 20, y: 30, rotate: -4 },
  { node: 1, x: 300, y: 0, rotate: 3 },
  { node: 2, x: 370, y: 170, rotate: -2 },
  { node: 3, x: 60, y: 220, rotate: 5 },
  { node: 4, x: 250, y: 330, rotate: -6 },
  { node: 5, x: 40, y: 430, rotate: 2 },
  { node: 6, x: 330, y: 470, rotate: 4 },
] as const;

export const chaosWires = [
  'M115 62 C 220 -10, 300 120, 395 32',
  'M115 62 C 40 140, 240 160, 155 252',
  'M395 32 C 520 60, 380 140, 455 202',
  'M455 202 C 360 300, 260 160, 155 252',
  'M155 252 C 260 260, 200 400, 345 362',
  'M345 362 C 520 340, 560 260, 455 202',
  'M345 362 C 300 460, 160 380, 135 462',
  'M135 462 C 250 560, 330 430, 425 502',
  'M425 502 C 560 470, 420 400, 345 362',
  'M395 32 C 300 200, 470 280, 345 362',
] as const;

// design/storyboard/MobielHero.dc.html — doos 334 × 200 (nodes zonder index).
// `node` is hier de positie in t().hero.nodesMobile (3 labels), niet in het grote hero.nodes.
export const chaosBoxMobile = { width: 334, height: 200 };

export const chaosNodesMobile = [
  { node: 0, x: 0, y: 0, rotate: -4 },
  { node: 1, x: 150, y: 60, rotate: 3 },
  { node: 2, x: 20, y: 130, rotate: -2 },
] as const;
