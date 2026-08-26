// Schaubilder für die Foliensätze
//
// Die Bausteine in theme.js können Karten, Tabellen und Listen. Was sie nicht
// können, sind echte Zeichnungen: Knoten und Kanten, ineinandergeschachtelte
// Kästen, gegenübergestellte Stapel. Genau dafür ist diese Datei da.
//
// Jedes Schaubild wird als SVG beschrieben, mit resvg zu einem PNG gerendert
// und von pptxgenjs eingebettet. Die PNGs landen in assets/diagramme/ und
// werden nur neu erzeugt, wenn sie fehlen – der Ordner ist ein Cache.
//
// Maßeinheit im viewBox ist 1/100 Zoll. Ein Schaubild über die volle
// Inhaltsbreite (8,76 Zoll) hat also viewBox-Breite 876. Gerendert wird mit
// dem dreifachen Wert, das entspricht rund 300 dpi.
//
// Nutzung:
//   const D = require("./lib/diagramme");
//   s.addImage({ path: D.topologien(), x: 0.62, y: 1.8, w: 8.76, h: 1.9 });

const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const DIA_DIR = path.join(__dirname, "..", "assets", "diagramme");

// Farben aus theme.js, hier noch einmal als reine Werte
const F = {
  flaeche: "#F5F6FC",
  flaecheHell: "#EEF0FB",
  linie: "#DFE3F0",
  kante: "#9AA2BE", // Verbindungen in Schaubildern – kräftiger als linie
  text: "#434A63",
  textStark: "#272E52",
  textLeise: "#5C6377",
  blau: "#3843AF",
  blauTief: "#EEF0FB",
  teal: "#0F7C86",
  tealTief: "#E6F4F5",
  bernstein: "#9A6310",
  bernsteinTief: "#FBF2E3",
  rot: "#B33A3A",
  rotTief: "#FAECEC",
  weiss: "#FFFFFF",
};

const SCHRIFT = "Arial, Helvetica, sans-serif";

/** Rendert ein SVG als PNG und liefert den Dateipfad. Ergebnis wird gecacht. */
function render(name, svg, viewBreite) {
  fs.mkdirSync(DIA_DIR, { recursive: true });
  const datei = path.join(DIA_DIR, `${name}.png`);
  if (fs.existsSync(datei) && !process.env.DIAGRAMME_NEU) return datei;
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: Math.round(viewBreite * 3) },
    font: { defaultFontFamily: "Arial" },
  }).render();
  fs.writeFileSync(datei, png.asPng());
  return datei;
}

/** Rahmen um ein SVG. Hintergrund bleibt durchsichtig. */
function svg(breite, hoehe, inhalt) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" ` +
    `viewBox="0 0 ${breite} ${hoehe}">` +
    `<defs>` +
    `<marker id="pfeil" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">` +
    `<path d="M0,0 L9,4.5 L0,9 z" fill="${F.text}"/></marker>` +
    `<marker id="pfeilBlau" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">` +
    `<path d="M0,0 L9,4.5 L0,9 z" fill="${F.blau}"/></marker>` +
    `<marker id="pfeilTeal" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">` +
    `<path d="M0,0 L9,4.5 L0,9 z" fill="${F.teal}"/></marker>` +
    `</defs>` +
    inhalt +
    `</svg>`
  );
}

/** Textzeile. y ist die Grundlinie. */
function t(x, y, text, opts = {}) {
  const anker = opts.align === "mitte" ? "middle" : opts.align === "rechts" ? "end" : "start";
  return (
    `<text x="${x}" y="${y}" font-family="${SCHRIFT}" font-size="${opts.groesse ?? 11}" ` +
    `${opts.fett ? 'font-weight="bold" ' : ""}fill="${opts.farbe ?? F.text}" ` +
    `text-anchor="${anker}"${opts.spacing ? ` letter-spacing="${opts.spacing}"` : ""}>` +
    escape(text) +
    `</text>`
  );
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function kasten(x, y, w, h, opts = {}) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.radius ?? 4}" ` +
    `fill="${opts.fuellung ?? F.flaeche}" ` +
    (opts.rand ? `stroke="${opts.rand}" stroke-width="${opts.randBreite ?? 1.6}"` : `stroke="none"`) +
    `/>`
  );
}

function knoten(cx, cy, r, farbe) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${farbe}"/>`;
}

function linie(x1, y1, x2, y2, opts = {}) {
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ` +
    `stroke="${opts.farbe ?? F.linie}" stroke-width="${opts.breite ?? 2}" ` +
    `stroke-linecap="round"${opts.gestrichelt ? ' stroke-dasharray="5 4"' : ""}` +
    `${opts.pfeil ? ` marker-end="url(#${opts.pfeil})"` : ""}/>`
  );
}

// ==================================================== Icons

/**
 * Gezeichnete Sinnbilder für die vier Blöcke von Thema 1.
 * Alle in einem 100x100-Feld konstruiert und über scale() eingepasst,
 * damit sie untereinander gleich groß wirken.
 */
const ICONS = {
  // Netzwerk: ein Knoten in der Mitte, vier drumherum, alle verbunden
  netzwerk(farbe) {
    const r = 9;
    const mitte = [50, 50];
    const aussen = [[50, 14], [86, 50], [50, 86], [14, 50]];
    let out = aussen
      .map(([x, y]) => `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="${farbe}" stroke-width="5" stroke-linecap="round"/>`)
      .join("");
    out += aussen.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${farbe}"/>`).join("");
    out += `<circle cx="${mitte[0]}" cy="${mitte[1]}" r="12" fill="${farbe}"/>`;
    return out;
  },

  // Virtualisierung: ein Wirt, darin drei getrennte Gäste
  virtualisierung(farbe) {
    // unten der Wirt, darüber drei getrennte Gastsysteme
    let out = `<rect x="10" y="66" width="80" height="20" rx="4" fill="${farbe}"/>`;
    [0, 1, 2].forEach((k) => {
      out += `<rect x="${13 + k * 26}" y="20" width="22" height="36" rx="3.5" fill="none" stroke="${farbe}" stroke-width="5"/>`;
    });
    [0, 1, 2].forEach((k) => {
      out += `<line x1="${24 + k * 26}" y1="56" x2="${24 + k * 26}" y2="66" stroke="${farbe}" stroke-width="4"/>`;
    });
    return out;
  },

  // Container: gestapelte Kisten mit Rippen
  container(farbe) {
    let out = `<rect x="14" y="42" width="72" height="42" rx="4" fill="none" stroke="${farbe}" stroke-width="5.5"/>`;
    [30, 44, 58, 72].forEach((x) => {
      out += `<line x1="${x}" y1="50" x2="${x}" y2="76" stroke="${farbe}" stroke-width="4" stroke-linecap="round"/>`;
    });
    out += `<rect x="26" y="16" width="48" height="20" rx="3" fill="${farbe}"/>`;
    return out;
  },

  // Infrastruktur: ein Rack mit drei Einschüben und Statuslampen
  infrastruktur(farbe) {
    let out = `<rect x="20" y="12" width="60" height="66" rx="5" fill="none" stroke="${farbe}" stroke-width="5.5"/>`;
    [23, 40, 57].forEach((y) => {
      out += `<rect x="30" y="${y}" width="40" height="11" rx="2" fill="${farbe}"/>`;
      out += `<circle cx="${64}" cy="${y + 5.5}" r="2.4" fill="#FFFFFF"/>`;
    });
    out += `<line x1="30" y1="78" x2="30" y2="88" stroke="${farbe}" stroke-width="5" stroke-linecap="round"/>`;
    out += `<line x1="70" y1="78" x2="70" y2="88" stroke="${farbe}" stroke-width="5" stroke-linecap="round"/>`;
    return out;
  },

  // Filiale: zwei Häuser, durch eine Leitung verbunden
  standort(farbe) {
    let out = `<path d="M12,46 L30,30 L48,46 L48,78 L12,78 Z" fill="none" stroke="${farbe}" stroke-width="5.5" stroke-linejoin="round"/>`;
    out += `<path d="M56,54 L74,38 L92,54 L92,78 L56,78 Z" fill="none" stroke="${farbe}" stroke-width="5.5" stroke-linejoin="round"/>`;
    out += `<line x1="48" y1="62" x2="56" y2="62" stroke="${farbe}" stroke-width="5.5"/>`;
    return out;
  },

  // Anlage: ein Zahnrad, daneben ein Signalbogen
  anlage(farbe) {
    const cx = 42, cy = 52, R = 26;
    let zaehne = "";
    for (let k = 0; k < 8; k++) {
      const w = (Math.PI * 2 * k) / 8;
      const x1 = cx + (R - 2) * Math.cos(w);
      const y1 = cy + (R - 2) * Math.sin(w);
      const x2 = cx + (R + 9) * Math.cos(w);
      const y2 = cy + (R + 9) * Math.sin(w);
      zaehne += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${farbe}" stroke-width="6" stroke-linecap="round"/>`;
    }
    let out = zaehne;
    out += `<circle cx="${cx}" cy="${cy}" r="${R - 4}" fill="none" stroke="${farbe}" stroke-width="5.5"/>`;
    out += `<circle cx="${cx}" cy="${cy}" r="7" fill="${farbe}"/>`;
    out += `<path d="M78,34 A22,22 0 0 1 78,70" fill="none" stroke="${farbe}" stroke-width="5" stroke-linecap="round"/>`;
    out += `<path d="M88,22 A34,34 0 0 1 88,82" fill="none" stroke="${farbe}" stroke-width="5" stroke-linecap="round"/>`;
    return out;
  },

  // Cloud: Wolke mit Pfeil hinein
  cloud(farbe) {
    let out = `<path d="M26,72 A18,18 0 0 1 28,37 A22,22 0 0 1 70,34 A17,17 0 0 1 74,72 Z" fill="none" stroke="${farbe}" stroke-width="5.5" stroke-linejoin="round"/>`;
    out += `<line x1="50" y1="82" x2="50" y2="52" stroke="${farbe}" stroke-width="5.5" stroke-linecap="round"/>`;
    out += `<path d="M40,62 L50,52 L60,62" fill="none" stroke="${farbe}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return out;
  },
};

/** Setzt ein Icon aus ICONS an eine Stelle und skaliert es auf kante x kante. */
function icon(name, x, y, kante, farbe) {
  const f = (kante / 100).toFixed(4);
  return `<g transform="translate(${x},${y}) scale(${f})">${ICONS[name](farbe)}</g>`;
}

// ==================================================== Weg durch Thema 1

/**
 * Die vier Blöcke von Thema 1 als Weg mit Sinnbildern.
 * Der erste Block ist hervorgehoben – da stehen wir heute.
 * Volle Inhaltsbreite, Höhe 2,25 Zoll.
 */
function wegThema1() {
  const B = 876;
  const H = 190;
  const teile = [];

  const stationen = [
    { icon: "netzwerk", titel: "Netzwerke", sub: "Wie Systeme sich erreichen", aktiv: true },
    { icon: "virtualisierung", titel: "Virtualisierung", sub: "Systeme entkoppeln" },
    { icon: "container", titel: "Container", sub: "Anwendungen verpacken" },
    { icon: "infrastruktur", titel: "Infrastruktur", sub: "Alles zusammenbringen" },
  ];

  const feldW = 186;
  const gap = (B - stationen.length * feldW) / (stationen.length - 1);
  const kreisR = 44;
  const kreisY = 24;

  stationen.forEach((st, i) => {
    const x0 = i * (feldW + gap);
    const cx = x0 + feldW / 2;
    const cy = kreisY + kreisR;

    // Verbindung zur nächsten Station
    if (i < stationen.length - 1) {
      const von = cx + kreisR + 10;
      const bis = x0 + feldW + gap + feldW / 2 - kreisR - 14;
      teile.push(linie(von, cy, bis, cy, { farbe: F.kante, breite: 2.2, pfeil: "pfeil" }));
    }

    const farbe = st.aktiv ? F.blau : F.textLeise;
    const fuellung = st.aktiv ? F.blauTief : F.flaeche;

    teile.push(
      `<circle cx="${cx}" cy="${cy}" r="${kreisR}" fill="${fuellung}" ` +
        `stroke="${farbe}" stroke-width="${st.aktiv ? 2.6 : 1.6}"/>`
    );
    teile.push(icon(st.icon, cx - 27, cy - 27, 54, farbe));

    teile.push(t(cx, kreisY + 2 * kreisR + 32, st.titel, { groesse: 15, fett: true, farbe: st.aktiv ? F.textStark : F.text, align: "mitte" }));
    teile.push(t(cx, kreisY + 2 * kreisR + 52, st.sub, { groesse: 11.5, farbe: F.textLeise, align: "mitte" }));

    if (st.aktiv) {
      teile.push(t(cx, 14, "HIER SIND WIR", { groesse: 10, fett: true, farbe: F.blau, align: "mitte", spacing: 1.4 }));
    }
  });

  return render("weg-thema1", svg(B, H, teile.join("")), B);
}

// ==================================================== Einzel-Icons

/**
 * Rendert ein einzelnes Sinnbild als quadratisches PNG – für die
 * Icon-Ecke der Karten aus theme.js.
 */
function iconDatei(name, farbe) {
  const hex = (farbe || F.blau).replace("#", "");
  return render(
    `icon-${name}-${hex}`,
    svg(100, 100, icon(name, 0, 0, 100, `#${hex}`)),
    100
  );
}

// ==================================================== Topologien

/**
 * Vier Topologien als echte Knoten-Kanten-Zeichnung nebeneinander.
 * Volle Inhaltsbreite, Höhe 1,95 Zoll.
 */
function topologien() {
  const B = 876;
  const H = 195;
  const panelW = 204;
  const gap = (B - 4 * panelW) / 3;
  const teile = [];

  const mitteY = 78;
  const r = 7.5;

  function panel(i, titel, unterzeile, zeichnung, akzent) {
    const x0 = i * (panelW + gap);
    teile.push(kasten(x0, 0, panelW, 126, { fuellung: F.flaeche, radius: 5 }));
    teile.push(zeichnung(x0 + panelW / 2, mitteY));
    teile.push(t(x0 + panelW / 2, 148, titel, { groesse: 14, fett: true, farbe: akzent, align: "mitte" }));
    teile.push(t(x0 + panelW / 2, 168, unterzeile, { groesse: 11, farbe: F.textLeise, align: "mitte" }));
  }

  // Stern: zentraler Switch, vier Knoten drumherum
  panel(0, "Stern", "Ausfall der Mitte trifft alle", (cx, cy) => {
    const arme = [];
    for (let k = 0; k < 6; k++) {
      const w = (Math.PI * 2 * k) / 6 - Math.PI / 2;
      arme.push([cx + 62 * Math.cos(w), cy + 44 * Math.sin(w)]);
    }
    let out = arme.map(([x, y]) => linie(cx, cy, x, y, { farbe: F.kante, breite: 2 })).join("");
    out += `<rect x="${cx - 17}" y="${cy - 11}" width="34" height="22" rx="3" fill="${F.blau}"/>`;
    out += arme.map(([x, y]) => knoten(x, y, r, F.text)).join("");
    return out;
  }, F.blau);

  // Ring: sechs Knoten im Kreis, geschlossene Kette
  panel(1, "Ring", "Bruch wird umgeleitet", (cx, cy) => {
    const R = 42;
    const p = [];
    for (let k = 0; k < 6; k++) {
      const w = (Math.PI * 2 * k) / 6 - Math.PI / 2;
      p.push([cx + R * Math.cos(w), cy + R * Math.sin(w)]);
    }
    let out = "";
    for (let k = 0; k < 6; k++) {
      const a = p[k];
      const b = p[(k + 1) % 6];
      out += linie(a[0], a[1], b[0], b[1], { farbe: F.teal, breite: 2.2 });
    }
    out += p.map(([x, y]) => knoten(x, y, r, F.text)).join("");
    return out;
  }, F.teal);

  // Bus: eine durchgehende Leitung, Knoten mit Stichleitungen
  panel(2, "Bus", "Ein Defekt legt alles lahm", (cx, cy) => {
    const x1 = cx - 72;
    const x2 = cx + 72;
    let out = linie(x1, cy, x2, cy, { farbe: F.textLeise, breite: 3 });
    const xs = [cx - 48, cx - 16, cx + 16, cx + 48];
    out += xs
      .map((x, k) => {
        const oben = k % 2 === 0;
        const y = oben ? cy - 32 : cy + 32;
        return linie(x, cy, x, y, { farbe: F.kante, breite: 2 }) + knoten(x, y, r, F.text);
      })
      .join("");
    return out;
  }, F.textLeise);

  // Masche: fünf Knoten, viele Querverbindungen
  panel(3, "Masche", "Viele Wege, teuer", (cx, cy) => {
    const R = 42;
    const p = [];
    for (let k = 0; k < 5; k++) {
      const w = (Math.PI * 2 * k) / 5 - Math.PI / 2;
      p.push([cx + R * Math.cos(w), cy + R * Math.sin(w)]);
    }
    let out = "";
    for (let a = 0; a < 5; a++) {
      for (let b = a + 1; b < 5; b++) {
        out += linie(p[a][0], p[a][1], p[b][0], p[b][1], { farbe: F.kante, breite: 1.6 });
      }
    }
    out += p.map(([x, y]) => knoten(x, y, r, F.bernstein)).join("");
    return out;
  }, F.bernstein);

  return render("topologien", svg(B, H, teile.join("")), B);
}

// ==================================================== Bandbreite und Latenz

/**
 * Zwei Bilder nebeneinander: viele Spuren gegen langen Weg.
 * Volle Inhaltsbreite, Höhe 1,75 Zoll.
 */
function bandbreiteLatenz() {
  const B = 876;
  const H = 175;
  const teile = [];

  const feldW = 420;
  const rechtsX = B - feldW;

  // ---- links: Bandbreite = Zahl der Spuren
  teile.push(t(0, 14, "BANDBREITE", { groesse: 11, fett: true, farbe: F.blau, spacing: 1.4 }));
  teile.push(t(0, 32, "wie viel gleichzeitig durchpasst", { groesse: 11.5, farbe: F.textLeise }));

  const strX = 0;
  const strY = 46;
  const strW = feldW - 20;
  const spurH = 17;
  const spuren = 4;
  teile.push(kasten(strX, strY, strW, spuren * spurH, { fuellung: F.flaeche, radius: 3 }));
  for (let k = 1; k < spuren; k++) {
    teile.push(
      `<line x1="${strX + 6}" y1="${strY + k * spurH}" x2="${strX + strW - 6}" y2="${strY + k * spurH}" ` +
        `stroke="${F.linie}" stroke-width="1.6" stroke-dasharray="9 7"/>`
    );
  }
  for (let k = 0; k < spuren; k++) {
    const y = strY + k * spurH + 3.5;
    [0, 1, 2].forEach((j) => {
      teile.push(`<rect x="${strX + 14 + j * 30}" y="${y}" width="20" height="10" rx="2" fill="${F.blau}"/>`);
    });
  }
  teile.push(linie(strX + 130, strY + spuren * spurH / 2, strX + strW - 12, strY + spuren * spurH / 2, { farbe: F.blau, breite: 2, pfeil: "pfeilBlau" }));
  teile.push(t(strX, strY + spuren * spurH + 20, "Mehr Spuren = mehr Pakete pro Sekunde.", { groesse: 11, farbe: F.text }));

  // ---- rechts: Latenz = Länge des Weges
  teile.push(t(rechtsX, 14, "LATENZ", { groesse: 11, fett: true, farbe: F.teal, spacing: 1.4 }));
  teile.push(t(rechtsX, 32, "wie lange eins unterwegs ist", { groesse: 11.5, farbe: F.textLeise }));

  const wegY = strY + 30;
  const aX = rechtsX + 14;
  const bX = B - 14;
  teile.push(`<line x1="${aX}" y1="${wegY}" x2="${bX}" y2="${wegY}" stroke="${F.linie}" stroke-width="3" stroke-dasharray="7 6"/>`);
  teile.push(knoten(aX, wegY, 9, F.teal));
  teile.push(knoten(bX, wegY, 9, F.teal));
  teile.push(t(aX, wegY - 16, "hier", { groesse: 11, fett: true, farbe: F.textStark }));
  teile.push(t(bX, wegY - 16, "Server", { groesse: 11, fett: true, farbe: F.textStark, align: "rechts" }));
  teile.push(`<rect x="${aX + 62}" y="${wegY - 5}" width="20" height="10" rx="2" fill="${F.teal}"/>`);
  teile.push(t(rechtsX, wegY + 34, "Ein einzelnes Paket wird nicht schneller,", { groesse: 11, farbe: F.text }));
  teile.push(t(rechtsX, wegY + 50, "nur weil daneben Platz frei ist.", { groesse: 11, farbe: F.text }));

  // Trennlinie zwischen den Feldern
  teile.push(`<line x1="${feldW + 12}" y1="6" x2="${feldW + 12}" y2="${H - 24}" stroke="${F.linie}" stroke-width="1.5"/>`);

  return render("bandbreite-latenz", svg(B, H, teile.join("")), B);
}

// ==================================================== Kapselung

/**
 * Ineinandergeschachtelte Kopfteile: Frame umschließt Paket umschließt
 * Segment umschließt die Daten. Volle Inhaltsbreite, Höhe 2,05 Zoll.
 */
function kapselung() {
  const B = 876;
  const H = 205;
  const teile = [];

  const ebenen = [
    { name: "Frame", schicht: "Schicht 2", kopf: "MAC", farbe: F.textLeise, tief: F.flaeche, schwanz: "FCS" },
    { name: "Paket", schicht: "Schicht 3", kopf: "IP", farbe: F.blau, tief: F.blauTief },
    { name: "Segment", schicht: "Schicht 4", kopf: "TCP", farbe: F.teal, tief: F.tealTief },
  ];

  const y0 = 22;
  const hoeheAussen = 116;
  const einzug = 16;

  ebenen.forEach((e, i) => {
    const x = i * (einzug + 34);
    const y = y0 + i * einzug;
    const w = B - 2 * x;
    const h = hoeheAussen - 2 * i * einzug;

    teile.push(kasten(x, y, w, h, { fuellung: e.tief, rand: e.farbe, randBreite: 1.8, radius: 4 }));
    // Kopfteil links
    teile.push(
      `<rect x="${x}" y="${y}" width="34" height="${h}" rx="4" fill="${e.farbe}"/>` +
        `<rect x="${x + 26}" y="${y}" width="8" height="${h}" fill="${e.farbe}"/>`
    );
    teile.push(t(x + 17, y + h / 2 + 4, e.kopf, { groesse: 11, fett: true, farbe: F.weiss, align: "mitte" }));
    // Beschriftung über dem Kasten
    teile.push(t(x + 42, y - 6, `${e.name} · ${e.schicht}`, { groesse: 10.5, fett: true, farbe: e.farbe }));
    // Schwanz nur beim Frame
    if (e.schwanz) {
      teile.push(`<rect x="${x + w - 30}" y="${y}" width="30" height="${h}" rx="4" fill="${e.farbe}"/>`);
      teile.push(`<rect x="${x + w - 30}" y="${y}" width="8" height="${h}" fill="${e.farbe}"/>`);
      teile.push(t(x + w - 15, y + h / 2 + 4, e.schwanz, { groesse: 9.5, fett: true, farbe: F.weiss, align: "mitte" }));
    }
  });

  // Innerster Kern: die eigentlichen Daten
  const kx = 2 * (einzug + 34) + 34 + 8;
  const ky = y0 + 2 * einzug + 8;
  const kw = B - 2 * (2 * (einzug + 34)) - 34 - 16;
  const kh = hoeheAussen - 4 * einzug - 16;
  teile.push(kasten(kx, ky, kw, kh, { fuellung: F.bernstein, radius: 3 }));
  teile.push(t(kx + kw / 2, ky + kh / 2 + 5, "Nutzdaten – „GET /index.html“", { groesse: 12.5, fett: true, farbe: F.weiss, align: "mitte" }));

  // Leserichtung unten
  teile.push(linie(30, 178, 330, 178, { farbe: F.text, breite: 1.6, pfeil: "pfeil" }));
  teile.push(t(30, 172, "beim Senden: von innen nach außen verpacken", { groesse: 10.5, farbe: F.textLeise }));
  teile.push(linie(846, 196, 546, 196, { farbe: F.text, breite: 1.6, pfeil: "pfeil" }));
  teile.push(t(846, 190, "beim Empfangen: von außen nach innen auspacken", { groesse: 10.5, farbe: F.textLeise, align: "rechts" }));

  return render("kapselung", svg(B, H, teile.join("")), B);
}

// ==================================================== OSI und TCP/IP

/**
 * Die beiden Stapel nebeneinander, mit Zuordnungsklammern dazwischen.
 * Volle Inhaltsbreite, Höhe 2,75 Zoll.
 */
function osiTcpip() {
  const B = 876;
  const H = 275;
  const teile = [];

  const osi = [
    { nr: 7, name: "Anwendung" },
    { nr: 6, name: "Darstellung" },
    { nr: 5, name: "Sitzung" },
    { nr: 4, name: "Transport" },
    { nr: 3, name: "Vermittlung" },
    { nr: 2, name: "Sicherung" },
    { nr: 1, name: "Physisch" },
  ];

  const spaltenW = 232;
  const linksX = 0;
  const rechtsX = 318;
  const zeilenH = 30;
  const gap = 3;
  const y0 = 26;

  teile.push(t(linksX, 14, "OSI – das Lehrmodell", { groesse: 11.5, fett: true, farbe: F.blau, spacing: 0.6 }));
  teile.push(t(rechtsX, 14, "TCP/IP – das gebaute Internet", { groesse: 11.5, fett: true, farbe: F.teal, spacing: 0.6 }));

  osi.forEach((s, i) => {
    const y = y0 + i * (zeilenH + gap);
    teile.push(kasten(linksX, y, spaltenW, zeilenH, { fuellung: F.flaecheHell, radius: 3 }));
    teile.push(`<rect x="${linksX}" y="${y}" width="26" height="${zeilenH}" rx="3" fill="${F.blau}"/>`);
    teile.push(`<rect x="${linksX + 20}" y="${y}" width="6" height="${zeilenH}" fill="${F.blau}"/>`);
    teile.push(t(linksX + 13, y + zeilenH / 2 + 4, String(s.nr), { groesse: 11, fett: true, farbe: F.weiss, align: "mitte" }));
    teile.push(t(linksX + 36, y + zeilenH / 2 + 4, s.name, { groesse: 12, fett: true, farbe: F.textStark }));
  });

  const tcp = [
    { name: "Anwendung", von: 0, bis: 2, beispiele: "HTTP · DNS · SSH · TLS" },
    { name: "Transport", von: 3, bis: 3, beispiele: "TCP · UDP · Ports" },
    { name: "Internet", von: 4, bis: 4, beispiele: "IP · ICMP · Routing" },
    { name: "Netzzugang", von: 5, bis: 6, beispiele: "Ethernet · WLAN · Kabel" },
  ];

  tcp.forEach((g) => {
    const yTop = y0 + g.von * (zeilenH + gap);
    const yBot = y0 + g.bis * (zeilenH + gap) + zeilenH;
    const h = yBot - yTop;

    // Klammer zwischen den Spalten
    const kx = linksX + spaltenW + 14;
    const mitte = (yTop + yBot) / 2;
    teile.push(
      `<path d="M${kx},${yTop + 3} L${kx + 12},${yTop + 3} L${kx + 12},${mitte - 6} L${kx + 24},${mitte} ` +
        `L${kx + 12},${mitte + 6} L${kx + 12},${yBot - 3} L${kx},${yBot - 3}" ` +
        `fill="none" stroke="${F.teal}" stroke-width="1.8" stroke-linejoin="round"/>`
    );
    teile.push(linie(kx + 24, mitte, rechtsX - 4, mitte, { farbe: F.teal, breite: 1.8, pfeil: "pfeilTeal" }));

    teile.push(kasten(rechtsX, yTop, spaltenW, h, { fuellung: F.tealTief, rand: F.teal, randBreite: 1.4, radius: 3 }));
    teile.push(t(rechtsX + 14, mitte - 2, g.name, { groesse: 12.5, fett: true, farbe: F.textStark }));
    teile.push(t(rechtsX + 14, mitte + 14, g.beispiele, { groesse: 10.5, farbe: F.text }));
  });

  // Merksatz rechts außen
  const mx = rechtsX + spaltenW + 30;
  teile.push(kasten(mx, y0, B - mx, 226, { fuellung: F.flaeche, radius: 4 }));
  teile.push(`<rect x="${mx}" y="${y0}" width="4" height="226" rx="2" fill="${F.bernstein}"/>`);
  const merk = [
    "Sitzung und Darstellung",
    "gibt es im echten Netz",
    "nicht als eigene Schicht.",
    "",
    "Sie stecken in dem, was",
    "die Anwendung selbst",
    "macht – zum Beispiel",
    "die Verschlüsselung",
    "durch TLS.",
  ];
  merk.forEach((z, i) => {
    if (!z) return;
    teile.push(t(mx + 16, y0 + 26 + i * 17, z, { groesse: 11, farbe: F.text }));
  });

  return render("osi-tcpip", svg(B, H, teile.join("")), B);
}

// ==================================================== Diagnose-Leiter

/**
 * Die Fehlersuche von unten nach oben als Treppe, mit Frage und Befehl je Stufe.
 * Volle Inhaltsbreite, Höhe 2,55 Zoll.
 */
function diagnoseLeiter() {
  const B = 876;
  const H = 255;
  const teile = [];

  const stufen = [
    { nr: "1", frage: "Steckt überhaupt etwas?", befehl: "ipconfig", farbe: F.textLeise },
    { nr: "2", frage: "Wen sehe ich lokal?", befehl: "arp -a", farbe: F.textLeise },
    { nr: "3", frage: "Komme ich ans Ziel?", befehl: "ping · tracert", farbe: F.blau },
    { nr: "4", frage: "Ist der Port offen?", befehl: "Test-NetConnection", farbe: F.teal },
    { nr: "7", frage: "Kennt jemand den Namen?", befehl: "nslookup", farbe: F.bernstein },
  ];

  const stufeH = 34;
  const stufeGap = 7;
  const stufeW = 372;
  const versatz = 58;
  const basisY = H - 30;

  stufen.forEach((s, i) => {
    const y = basisY - (i + 1) * (stufeH + stufeGap) + stufeGap;
    const w = stufeW;
    const x = i * versatz;

    // Stufenkante nach unten, damit die Treppe als Treppe lesbar wird
    if (i > 0) {
      teile.push(linie(x, y + stufeH, x, y + stufeH + stufeGap, { farbe: F.linie, breite: 1.5 }));
    }
    teile.push(kasten(x, y, w, stufeH, { fuellung: F.flaeche, radius: 3 }));
    teile.push(`<rect x="${x}" y="${y}" width="30" height="${stufeH}" rx="3" fill="${s.farbe}"/>`);
    teile.push(`<rect x="${x + 24}" y="${y}" width="6" height="${stufeH}" fill="${s.farbe}"/>`);
    teile.push(t(x + 15, y + stufeH / 2 + 4.5, s.nr, { groesse: 12, fett: true, farbe: F.weiss, align: "mitte" }));
    teile.push(t(x + 42, y + stufeH / 2 + 4.5, s.frage, { groesse: 12, fett: true, farbe: F.textStark }));
    teile.push(t(x + w - 14, y + stufeH / 2 + 4.5, s.befehl, { groesse: 11, farbe: s.farbe, align: "rechts" }));
  });

  // Aufwärtspfeil links
  const pfeilX = B - 146;
  teile.push(linie(pfeilX, basisY - 4, pfeilX, 14, { farbe: F.text, breite: 2, pfeil: "pfeil" }));
  teile.push(t(pfeilX + 16, 30, "von unten", { groesse: 12, fett: true, farbe: F.textStark }));
  teile.push(t(pfeilX + 16, 48, "nach oben", { groesse: 12, fett: true, farbe: F.textStark }));
  teile.push(t(pfeilX + 16, 74, "Die erste Stufe,", { groesse: 11, farbe: F.textLeise }));
  teile.push(t(pfeilX + 16, 90, "die stumm bleibt,", { groesse: 11, farbe: F.textLeise }));
  teile.push(t(pfeilX + 16, 106, "ist die Ursache.", { groesse: 11, farbe: F.textLeise }));

  // Grundlinie unter der untersten Stufe
  teile.push(linie(0, basisY + 3, stufeW, basisY + 3, { farbe: F.linie, breite: 2 }));

  return render("diagnose-leiter", svg(B, H, teile.join("")), B);
}

module.exports = {
  topologien, kapselung, osiTcpip, diagnoseLeiter, wegThema1, bandbreiteLatenz, iconDatei,
  icon, ICONS, F, render, svg, t, kasten, linie, knoten,
};
