// Pinnen alleen als het blok ruim in beeld past; anders zou de bezoeker een afgesneden blok vastzien.
export function pinIfFits(el: HTMLElement, share = 0.8): HTMLElement | false {
  return el.getBoundingClientRect().height <= innerHeight * share ? el : false;
}
