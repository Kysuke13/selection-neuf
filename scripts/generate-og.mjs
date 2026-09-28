import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 1200;
const H = 630;

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function overlaySvg({ kicker, title, subtitle, price, place }) {
  return Buffer.from(`
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d1f18" stop-opacity="0"/>
      <stop offset="0.55" stop-color="#0d1f18" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#0b1a14" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#shade)"/>
  <text x="76" y="92" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="6" fill="#f4efe4" opacity="0.92">${escapeXml(
    kicker,
  )}</text>
  <text x="74" y="486" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-weight="700" fill="#ffffff">${escapeXml(
    title,
  )}</text>
  <text x="78" y="540" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#eef2e9">${escapeXml(
    subtitle,
  )}</text>
  <g>
    <rect x="76" y="566" width="${16 + price.length * 20}" height="46" rx="23" fill="#ffcd73"/>
    <text x="98" y="597" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#183b30">${escapeXml(
      price,
    )}</text>
  </g>
  <text x="${W - 76}" y="597" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#f4efe4" opacity="0.9">${escapeXml(
    place,
  )}</text>
</svg>`);
}

async function build({ source, out, overlay }) {
  const base = await sharp(await readFile(join(root, source)))
    .resize(W, H, { fit: "cover", position: "attention" })
    .toBuffer();

  const jpeg = await sharp(base)
    .composite([{ input: overlaySvg(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toBuffer();

  for (const dest of out) {
    await writeFile(join(root, dest), jpeg);
    console.log(`wrote ${dest} (${Math.round(jpeg.length / 1024)} KB)`);
  }
}

await build({
  source: "public/assets/facade.webp",
  out: ["app/opengraph-image.jpg", "app/twitter-image.jpg"],
  overlay: {
    kicker: "SÉLECTION NEUF",
    title: "Duo Verde",
    subtitle: "Appartements neufs du T2 au T4 · Montpellier",
    price: "Dès 186 538 €",
    place: "Route de Lavérune",
  },
});

await build({
  source: "public/canopea/vue-drone-parc_canopea.jpg",
  out: ["app/canopea/opengraph-image.jpg", "app/canopea/twitter-image.jpg"],
  overlay: {
    kicker: "SÉLECTION NEUF",
    title: "Canopea",
    subtitle: "Appartements neufs du T2 au T5 · Montpellier",
    price: "Dès 219 000 €",
    place: "Nouveau Saint-Roch",
  },
});
