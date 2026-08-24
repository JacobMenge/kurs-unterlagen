// Icon-Pipeline für die Foliensätze
//
// Rendert Marken-Icons aus dem simple-icons-Paket als PNG nach assets/icons/,
// damit pptxgenjs sie einbetten kann. Die Dateien werden nur neu erzeugt,
// wenn sie fehlen – der Ordner dient als Cache.
//
// Nutzung:
//   const { iconPng, svgPng } = require("./lib/icons");
//   const pfad = iconPng("docker");            // Markenfarbe
//   const pfad = iconPng("github", "272E52");  // eigene Farbe
//   const logo = svgPng("assets/logos/cloudhelden.svg", "cloudhelden");

const fs = require("fs");
const path = require("path");
const simpleIcons = require("simple-icons");
const { Resvg } = require("@resvg/resvg-js");

const ICON_DIR = path.join(__dirname, "..", "assets", "icons");
const GROESSE = 256; // Pixelkante der erzeugten PNGs

function sicherstellen() {
  fs.mkdirSync(ICON_DIR, { recursive: true });
}

/** simple-icons-Schlüssel aus einem Slug: "github" -> "siGithub" */
function schluessel(slug) {
  return "si" + slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

/**
 * Rendert ein Marken-Icon als PNG und liefert den Dateipfad.
 * Ohne Farbangabe wird die offizielle Markenfarbe verwendet.
 */
function iconPng(slug, farbe) {
  sicherstellen();
  const icon = simpleIcons[schluessel(slug)];
  if (!icon) {
    throw new Error(`Icon nicht gefunden: ${slug}`);
  }
  const hex = (farbe ?? icon.hex).replace("#", "");
  const datei = path.join(ICON_DIR, `${slug}-${hex}.png`);
  if (fs.existsSync(datei)) return datei;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
    `<path fill="#${hex}" d="${icon.path}"/></svg>`;
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: GROESSE },
  }).render();
  fs.writeFileSync(datei, png.asPng());
  return datei;
}

/** Rendert eine beliebige SVG-Datei als PNG (z. B. das Cloudhelden-Logo). */
function svgPng(svgPfad, name, breite = 512) {
  sicherstellen();
  const datei = path.join(ICON_DIR, `${name}.png`);
  if (fs.existsSync(datei)) return datei;
  const svg = fs.readFileSync(svgPfad, "utf8");
  const png = new Resvg(svg, { fitTo: { mode: "width", value: breite } }).render();
  fs.writeFileSync(datei, png.asPng());
  return datei;
}

module.exports = { iconPng, svgPng };
