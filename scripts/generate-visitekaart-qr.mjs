// Genereert de QR-fallback voor de digitale visitekaart (voor telefoons die de NFC-emulator niet lezen,
// vooral iPhones). Output gaat naar docs/, niet public/: de QR wordt vanaf de telefoon gedeeld, niet op de
// site getoond.
import { mkdir } from 'node:fs/promises';
import QRCode from 'qrcode';

const URL = 'https://forgelineoptimizations.nl/visitekaart?ref=qr';
// Smeedzwart op werkplaatswit (design/design-system/tokens.json): donker-op-licht, hoog contrast, scant
// betrouwbaar. Een omgekeerde of lage-contrast "merk"-QR scant vaak niet goed.
const colors = { dark: '#111111', light: '#f2f0ec' };
const outDir = 'docs/visitekaart';

await mkdir(outDir, { recursive: true });
await QRCode.toFile(`${outDir}/visitekaart-qr.svg`, URL, {
  type: 'svg',
  margin: 2,
  color: colors,
  errorCorrectionLevel: 'M',
});
await QRCode.toFile(`${outDir}/visitekaart-qr.png`, URL, {
  width: 1024,
  margin: 2,
  color: colors,
  errorCorrectionLevel: 'M',
});
console.log('QR written to', outDir);
