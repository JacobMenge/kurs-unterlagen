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

// ==================================================== Dateneinheiten

/**
 * Mini-Umschläge für die Dateneinheiten-Tabelle: eine Glyphe je Tabellenzeile,
 * exakt auf das Zeilenraster der Tabelle gelegt (rowH 0,36" = 36 Einheiten).
 * Dieselben Farben wie im Kapselungs-Schaubild – die Teilnehmenden sehen das
 * Bild dort vier Folien später in groß wieder.
 */
function dateneinheiten() {
  const B = 252;
  const H = 180;
  const teile = [];
  const blockH = 24;

  function block(x, w, y, farbe, label, labelFarbe) {
    let out = kasten(x, y, w, blockH, { fuellung: farbe, radius: 3 });
    if (label) {
      out += t(x + w / 2, y + blockH / 2 + 3.2, label, {
        groesse: label.length > 4 ? 8.5 : 9,
        fett: true,
        farbe: labelFarbe ?? F.weiss,
        align: "mitte",
      });
    }
    return out;
  }

  function zeile(i, bauen) {
    const cy = i * 36 + 18;
    teile.push(bauen(cy - blockH / 2, cy));
  }

  // Bit: nur das Signal
  zeile(0, (y, cy) => {
    const pkte = [];
    let x = 14;
    let oben = true;
    while (x < 230) {
      pkte.push(`${x},${cy + (oben ? -8 : 8)}`);
      x += 18;
      pkte.push(`${x},${cy + (oben ? -8 : 8)}`);
      oben = !oben;
    }
    return `<polyline points="${pkte.join(" ")}" fill="none" stroke="${F.textLeise}" stroke-width="2.4" stroke-linejoin="round"/>`;
  });

  // Frame: alles verpackt, mit Prüfsumme am Ende
  zeile(1, (y) =>
    block(12, 34, y, F.textLeise, "MAC") +
    block(48, 32, y, F.blau, "IP") +
    block(82, 34, y, F.teal, "TCP") +
    block(118, 114, y, F.bernstein, "Daten") +
    block(234, 18, y, F.textLeise, "FCS")
  );

  // Paket: ohne Rahmen der Sicherungsschicht
  zeile(2, (y) =>
    block(48, 32, y, F.blau, "IP") +
    block(82, 34, y, F.teal, "TCP") +
    block(118, 114, y, F.bernstein, "Daten")
  );

  // Segment: nur noch Transportkopf
  zeile(3, (y) =>
    block(82, 34, y, F.teal, "TCP") +
    block(118, 114, y, F.bernstein, "Daten")
  );

  // Daten: die nackte Nachricht
  zeile(4, (y) => block(118, 114, y, F.bernstein, "Daten"));

  return render("dateneinheiten", svg(B, H, teile.join("")), B);
}

// ==================================================== Abend 2: Adressierung

/**
 * Umfrage-Rückblick: drei Netzwerkfragen als gestapelte Balken.
 * Personalisiert den Einstieg – die Gruppe sieht ihr eigenes Ergebnis.
 */
function umfrageNetz() {
  const B = 876;
  const H = 205;
  const teile = [];
  const zeilen = [
    { frage: "Wofür ist DNS zuständig?", richtig: 14, wn: 0, falsch: 0 },
    { frage: "Aufgabe des Standardgateways?", richtig: 14, wn: 0, falsch: 0 },
    { frage: "/26 – wie viele Geräte passen hinein?", richtig: 8, wn: 2, falsch: 4 },
  ];
  const labelW = 300;
  const barX = labelW + 16;
  const barMax = B - barX - 120;
  const rowH = 34;
  const gap = 16;
  const y0 = 14;

  zeilen.forEach((z, i) => {
    const y = y0 + i * (rowH + gap);
    teile.push(t(labelW, y + rowH / 2 + 4, z.frage, { groesse: 12, fett: true, farbe: F.textStark, align: "rechts" }));
    let x = barX;
    const teileB = [
      [z.richtig, F.teal],
      [z.wn, F.kante],
      [z.falsch, F.rot],
    ];
    teileB.forEach(([anz, farbe]) => {
      if (!anz) return;
      const w = (anz / 14) * barMax;
      teile.push(kasten(x, y, w, rowH, { fuellung: farbe, radius: 3 }));
      if (w > 30) {
        teile.push(t(x + w / 2, y + rowH / 2 + 4, String(anz), { groesse: 12, fett: true, farbe: F.weiss, align: "mitte" }));
      }
      x += w + 2;
    });
    const zusatz = z.falsch ? `${z.richtig} von 14` : "alle 14";
    teile.push(t(x + 8, y + rowH / 2 + 4, zusatz, { groesse: 11, farbe: F.textLeise }));
  });

  // Legende
  const ly = y0 + 3 * (rowH + gap) + 10;
  const legende = [["richtig", F.teal], ["weiß (noch) nicht", F.kante], ["daneben", F.rot]];
  let lx = barX;
  legende.forEach(([label, farbe]) => {
    teile.push(kasten(lx, ly, 16, 16, { fuellung: farbe, radius: 3 }));
    teile.push(t(lx + 22, ly + 12.5, label, { groesse: 11, farbe: F.text }));
    lx += 22 + label.length * 5.6 + 26;
  });

  return render("umfrage-netz", svg(B, H, teile.join("")), B);
}

/**
 * Aufbau einer IPv4-Adresse: vier Oktette dezimal und binär,
 * Netzanteil gegen Hostanteil, darunter die Maske in denselben Farben.
 */
function ipAufbau() {
  const B = 876;
  const H = 235;
  const teile = [];
  const oktette = [
    { dez: "192", bin: "11000000", netz: true },
    { dez: "168", bin: "10101000", netz: true },
    { dez: "2", bin: "00000010", netz: true },
    { dez: "33", bin: "00100001", netz: false },
  ];
  const maske = [
    { dez: "255", bin: "11111111" },
    { dez: "255", bin: "11111111" },
    { dez: "255", bin: "11111111" },
    { dez: "0", bin: "00000000" },
  ];
  const boxW = 168;
  const gap = 14;
  const x0 = 60;

  teile.push(t(x0, 22, "Die Adresse:", { groesse: 12, fett: true, farbe: F.textStark }));
  teile.push(t(x0 + 110, 22, "192.168.2.33 /24", { groesse: 13, fett: true, farbe: F.blau }));

  oktette.forEach((o, i) => {
    const x = x0 + i * (boxW + gap);
    const farbe = o.netz ? F.blau : F.bernstein;
    const tief = o.netz ? F.blauTief : F.bernsteinTief;
    teile.push(kasten(x, 36, boxW, 58, { fuellung: tief, rand: farbe, randBreite: 1.8, radius: 4 }));
    teile.push(t(x + boxW / 2, 60, o.dez, { groesse: 17, fett: true, farbe: F.textStark, align: "mitte" }));
    teile.push(t(x + boxW / 2, 82, o.bin, { groesse: 11.5, farbe: farbe, align: "mitte", spacing: 1.5 }));
  });

  // Maske darunter, bitgenau in denselben Farben
  teile.push(t(x0, 108, "Die Maske:  255.255.255.0", { groesse: 12, fett: true, farbe: F.textStark }));
  maske.forEach((m, i) => {
    const x = x0 + i * (boxW + gap);
    const einsen = m.bin.startsWith("1");
    const farbe = einsen ? F.blau : F.bernstein;
    teile.push(kasten(x, 114, boxW, 42, { fuellung: F.flaeche, radius: 4 }));
    teile.push(t(x + boxW / 2, 131, m.dez, { groesse: 12.5, fett: true, farbe: F.textStark, align: "mitte" }));
    teile.push(t(x + boxW / 2, 149, m.bin, { groesse: 11, farbe: farbe, align: "mitte", spacing: 1.5 }));
  });

  // Klammern unten: Netzanteil / Hostanteil
  const netzEnde = x0 + 3 * boxW + 2 * gap;
  teile.push(linie(x0, 170, netzEnde, 170, { farbe: F.blau, breite: 2.4 }));
  teile.push(t((x0 + netzEnde) / 2, 190, "Netzanteil – 24 Einsen in der Maske, deshalb /24", { groesse: 11.5, fett: true, farbe: F.blau, align: "mitte" }));
  const hostStart = netzEnde + gap;
  teile.push(linie(hostStart, 170, hostStart + boxW, 170, { farbe: F.bernstein, breite: 2.4 }));
  teile.push(t(hostStart + boxW / 2, 190, "Hostanteil", { groesse: 11.5, fett: true, farbe: F.bernstein, align: "mitte" }));
  teile.push(t((x0 + netzEnde) / 2, 210, "sagt, in welchem Netz du wohnst", { groesse: 10.5, farbe: F.textLeise, align: "mitte" }));
  teile.push(t(hostStart + boxW / 2, 210, "sagt, welches Gerät du bist", { groesse: 10.5, farbe: F.textLeise, align: "mitte" }));

  return render("ip-aufbau", svg(B, H, teile.join("")), B);
}

/**
 * Der 62-statt-64-Fehler: ein /26-Block als Adressleiste – Netzadresse und
 * Broadcast sind reserviert, dazwischen die nutzbaren Geräte.
 */
function block26() {
  const B = 876;
  const H = 175;
  const teile = [];
  const y = 40;
  const h = 56;
  const x0 = 10;
  const gesamt = B - 20;
  const randW = 118;

  teile.push(t(x0, 22, "Ein /26-Block: 2⁶ = 64 Adressen, hier 192.168.10.64 bis .127", { groesse: 12.5, fett: true, farbe: F.textStark }));

  teile.push(kasten(x0, y, randW, h, { fuellung: F.rot, radius: 4 }));
  teile.push(t(x0 + randW / 2, y + 24, ".64", { groesse: 13, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(t(x0 + randW / 2, y + 42, "Netzadresse", { groesse: 9.5, farbe: F.weiss, align: "mitte" }));

  const mitteX = x0 + randW + 4;
  const mitteW = gesamt - 2 * randW - 8;
  teile.push(kasten(mitteX, y, mitteW, h, { fuellung: F.teal, radius: 4 }));
  teile.push(t(mitteX + mitteW / 2, y + 24, "62 nutzbare Adressen", { groesse: 14, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(t(mitteX + mitteW / 2, y + 42, ".65 bis .126 – hier wohnen die Geräte", { groesse: 10.5, farbe: F.weiss, align: "mitte" }));

  const rechtsX = x0 + gesamt - randW;
  teile.push(kasten(rechtsX, y, randW, h, { fuellung: F.rot, radius: 4 }));
  teile.push(t(rechtsX + randW / 2, y + 24, ".127", { groesse: 13, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(t(rechtsX + randW / 2, y + 42, "Broadcast", { groesse: 9.5, farbe: F.weiss, align: "mitte" }));

  teile.push(t(x0 + gesamt / 2, y + h + 34, "64 Adressen − Netzadresse − Broadcast = 62 Geräte. Wer 64 antwortet, hat die beiden Reservierten vergessen.", { groesse: 12, fett: true, farbe: F.textStark, align: "mitte" }));
  teile.push(t(x0 + gesamt / 2, y + h + 56, "Das gilt in jedem IPv4-Netz: erste Adresse benennt das Netz, letzte ruft alle.", { groesse: 11, farbe: F.textLeise, align: "mitte" }));

  return render("block26", svg(B, H, teile.join("")), B);
}

/**
 * NAT: zwei Haushalte mit identischem privatem Netz, draußen zählt nur die
 * öffentliche Adresse des Routers.
 */
function natWeg() {
  const B = 876;
  const H = 235;
  const teile = [];

  function haus(x, y, oeffentlich) {
    // Heimnetz-Kasten mit Gerät und Router
    teile.push(kasten(x, y, 300, 84, { fuellung: F.blauTief, rand: F.blau, randBreite: 1.6, radius: 5 }));
    teile.push(t(x + 12, y + 20, "Heimnetz 192.168.2.0/24", { groesse: 10.5, fett: true, farbe: F.blau }));
    teile.push(kasten(x + 14, y + 32, 128, 38, { fuellung: F.weiss, rand: F.kante, randBreite: 1.2, radius: 4 }));
    teile.push(t(x + 78, y + 48, "Laptop", { groesse: 10.5, fett: true, farbe: F.textStark, align: "mitte" }));
    teile.push(t(x + 78, y + 63, "192.168.2.33", { groesse: 10, farbe: F.text, align: "mitte" }));
    teile.push(linie(x + 142, y + 51, x + 168, y + 51, { farbe: F.kante, breite: 2 }));
    teile.push(kasten(x + 170, y + 32, 116, 38, { fuellung: F.blau, radius: 4 }));
    teile.push(t(x + 228, y + 48, "Router (NAT)", { groesse: 10.5, fett: true, farbe: F.weiss, align: "mitte" }));
    teile.push(t(x + 228, y + 63, oeffentlich, { groesse: 10, farbe: F.weiss, align: "mitte" }));
  }

  haus(10, 16, "203.0.113.7");
  haus(10, 128, "198.51.100.42");

  // Internet-Wolke rechts
  const wx = 700, wy = 112;
  teile.push(`<path d="M${wx - 60},${wy + 30} A34,34 0 0 1 ${wx - 56},${wy - 26} A42,42 0 0 1 ${wx + 28},${wy - 34} A32,32 0 0 1 ${wx + 62},${wy + 28} Z" fill="${F.tealTief}" stroke="${F.teal}" stroke-width="2"/>`);
  teile.push(t(wx, wy + 4, "Internet", { groesse: 13, fett: true, farbe: F.teal, align: "mitte" }));

  // Pfeile von beiden Routern in die Wolke, beschriftet mit der öffentlichen IP
  teile.push(linie(320, 67, wx - 66, wy - 6, { farbe: F.teal, breite: 2.2, pfeil: "pfeilTeal" }));
  teile.push(linie(320, 179, wx - 66, wy + 22, { farbe: F.teal, breite: 2.2, pfeil: "pfeilTeal" }));
  teile.push(t(480, 72, "draußen sichtbar: 203.0.113.7", { groesse: 10.5, farbe: F.teal }));
  teile.push(t(480, 180, "draußen sichtbar: 198.51.100.42", { groesse: 10.5, farbe: F.teal }));

  // Merkzeile
  teile.push(t(438, 224, "Zweimal dieselbe 192.168.2.33 – kein Konflikt: Nach draußen tritt nur die öffentliche Adresse des Routers auf.", { groesse: 11.5, fett: true, farbe: F.textStark, align: "mitte" }));

  return render("nat-weg", svg(B, H, teile.join("")), B);
}

/**
 * IPv6 kompakt: eine Adresse in Präfix und Interface-ID zerlegt,
 * darunter die link-lokale fe80-Adresse.
 */
function ipv6Aufbau(neutral) {
  const B = 876;
  const H = 190;
  const teile = [];
  const gruppen = ["2001", "0db8", "2b00", "0001", "0000", "0000", "0000", "0033"];
  const boxW = 96;
  const gap = 8;
  const x0 = 22;
  const y = 34;

  teile.push(t(x0, 20, "Eine globale IPv6-Adresse: 2001:db8:2b00:1::33", { groesse: 12.5, fett: true, farbe: F.textStark }));

  gruppen.forEach((g, i) => {
    const x = x0 + i * (boxW + gap);
    const netz = i < 4;
    teile.push(kasten(x, y, boxW, 40, {
      fuellung: netz ? F.blauTief : F.bernsteinTief,
      rand: netz ? F.blau : F.bernstein,
      randBreite: 1.6, radius: 4,
    }));
    teile.push(t(x + boxW / 2, y + 25, g, { groesse: 13, fett: true, farbe: F.textStark, align: "mitte", spacing: 1 }));
  });

  const mitte = x0 + 4 * (boxW + gap) - gap / 2;
  teile.push(linie(x0, y + 54, mitte - 6, y + 54, { farbe: F.blau, breite: 2.4 }));
  teile.push(t((x0 + mitte) / 2, y + 74, "Präfix /64 – das Netz, kommt vom Anbieter oder Router", { groesse: 11, fett: true, farbe: F.blau, align: "mitte" }));
  teile.push(linie(mitte + 6, y + 54, x0 + 8 * (boxW + gap) - gap, y + 54, { farbe: F.bernstein, breite: 2.4 }));
  teile.push(t(mitte + (4 * (boxW + gap)) / 2, y + 74, "Interface-ID – das Gerät, oft selbst gewürfelt", { groesse: 11, fett: true, farbe: F.bernstein, align: "mitte" }));

  // fe80-Zeile
  const fy = y + 96;
  teile.push(kasten(x0, fy, 200, 34, { fuellung: F.tealTief, rand: F.teal, randBreite: 1.6, radius: 4 }));
  teile.push(t(x0 + 100, fy + 22, "fe80::…", { groesse: 13, fett: true, farbe: F.teal, align: "mitte" }));
  const fe80Text = neutral
    ? "Link-local: gibt sich jedes Gerät selbst, gilt nur im eigenen Netzsegment – taucht in jedem ipconfig auf."
    : "Link-local: gibt sich jedes Gerät selbst, gilt nur im eigenen Netzsegment – euer Fund aus dem Schichten-Check.";
  teile.push(t(x0 + 214, fy + 22, fe80Text, { groesse: 11, farbe: F.text }));

  return render(neutral ? "ipv6-aufbau-neutral" : "ipv6-aufbau", svg(B, H, teile.join("")), B);
}

/**
 * Bildspalte zur Präfix-Tabelle: je Zeile ein /24-Streifen, unterteilt in
 * Blöcke der jeweiligen Größe – der erste Block gefüllt. Zeigt ohne Worte,
 * dass jeder Präfix-Schritt den Block halbiert.
 */
function praefixBalken() {
  const B = 252;
  const rowH = 31;
  const zeilen = [1, 2, 4, 8, 16, 32, 64];
  const H = zeilen.length * rowH;
  const teile = [];
  const barW = 204;
  const barH = 19;

  zeilen.forEach((n, i) => {
    const y = i * rowH + (rowH - barH) / 2;
    teile.push(kasten(0, y, barW, barH, { fuellung: F.flaeche, rand: F.linie, randBreite: 1, radius: 2 }));
    teile.push(kasten(0, y, barW / n, barH, { fuellung: F.teal, radius: 2 }));
    for (let k = 1; k < n; k++) {
      const x = (barW / n) * k;
      teile.push(`<line x1="${x.toFixed(1)}" y1="${y}" x2="${x.toFixed(1)}" y2="${y + barH}" stroke="${F.weiss}" stroke-width="${n > 16 ? 0.8 : 1.4}"/>`);
    }
    teile.push(t(barW + 10, y + barH / 2 + 4, "×" + n, { groesse: 10.5, fett: true, farbe: F.teal }));
  });

  return render("praefix-balken", svg(B, H, teile.join("")), B);
}

/**
 * Zahlenstrahl für die Rechenwerkstatt: das letzte Oktett als vier
 * /26-Blöcke, die gesuchte Adresse als Marker im richtigen Block.
 */
function blockStrahl() {
  const B = 876;
  const H = 122;
  const teile = [];
  const y = 34;
  const h = 44;
  const blockW = B / 4;

  ["0", "64", "128", "192"].forEach((start, i) => {
    const x = i * blockW;
    const aktiv = i === 1;
    teile.push(kasten(x + 2, y, blockW - 4, h, {
      fuellung: aktiv ? F.teal : F.flaeche,
      rand: aktiv ? F.teal : F.linie,
      randBreite: 1.2,
      radius: 3,
    }));
    teile.push(t(x + 6, y - 8, "." + start, { groesse: 11, fett: true, farbe: aktiv ? F.teal : F.textLeise }));
    if (aktiv) {
      teile.push(t(x + 14, y + h / 2 + 4, "Netz .64", { groesse: 10.5, fett: true, farbe: F.weiss }));
      teile.push(t(x + blockW - 16, y + h / 2 + 4, "Broadcast .127", { groesse: 10.5, fett: true, farbe: F.weiss, align: "rechts" }));
    }
  });
  teile.push(t(B - 4, y - 8, ".255", { groesse: 11, fett: true, farbe: F.textLeise, align: "rechts" }));

  // Marker für die gesuchte .77
  const mx = blockW + ((77 - 64) / 64) * blockW;
  teile.push(`<path d="M${mx - 7},${y - 16} L${mx + 7},${y - 16} L${mx},${y - 4} Z" fill="${F.blau}"/>`);
  teile.push(t(mx + 12, y - 14, ".77", { groesse: 12, fett: true, farbe: F.blau }));

  teile.push(t(B / 2, y + h + 30, "Blockgröße 64 – die /26-Netze starten bei .0, .64, .128, .192. Die .77 fällt in den Block ab .64.", { groesse: 11.5, fett: true, farbe: F.textStark, align: "mitte" }));

  return render("block-strahl", svg(B, H, teile.join("")), B);
}

// ==================================================== Abend 3: Routing & Co

/**
 * Routing-Entscheidung: ein Paket, eine Routing-Tabelle, der längste
 * passende Präfix gewinnt.
 */
function routingWeg() {
  const B = 876;
  const H = 225;
  const teile = [];

  // Das Paket links
  teile.push(kasten(0, 62, 190, 64, { fuellung: F.bernstein, radius: 5 }));
  teile.push(t(95, 88, "Paket an", { groesse: 11, farbe: F.weiss, align: "mitte" }));
  teile.push(t(95, 108, "172.16.5.7", { groesse: 14, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(linie(196, 94, 246, 94, { farbe: F.text, breite: 2.2, pfeil: "pfeil" }));

  // Die Routing-Tabelle
  const tx = 256;
  const tw = 400;
  const zeilen = [
    { ziel: "192.168.10.0/24", weg: "direkt – eigenes Netz", trifft: false },
    { ziel: "172.16.0.0/16", weg: "über 192.168.10.254", trifft: false },
    { ziel: "172.16.5.0/24", weg: "über 192.168.10.253", trifft: true },
    { ziel: "0.0.0.0/0", weg: "Default: 192.168.10.1", trifft: false },
  ];
  teile.push(t(tx, 24, "Routing-Tabelle des Routers", { groesse: 11, fett: true, farbe: F.textStark }));
  zeilen.forEach((z, i) => {
    const y = 34 + i * 40;
    teile.push(kasten(tx, y, tw, 34, {
      fuellung: z.trifft ? F.teal : F.flaeche,
      rand: z.trifft ? F.teal : F.linie,
      randBreite: 1.2, radius: 3,
    }));
    teile.push(t(tx + 12, y + 22, z.ziel, { groesse: 12, fett: true, farbe: z.trifft ? F.weiss : F.textStark }));
    teile.push(t(tx + tw - 12, y + 22, z.weg, { groesse: 10.5, farbe: z.trifft ? F.weiss : F.text, align: "rechts" }));
  });

  // Erklärung rechts
  const ex = tx + tw + 26;
  teile.push(linie(ex - 2, 34 + 2 * 40 + 17, ex + 22, 34 + 2 * 40 + 17, { farbe: F.teal, breite: 2.2, pfeil: "pfeilTeal" }));
  teile.push(t(ex + 30, 92, "/24 schlägt /16:", { groesse: 12, fett: true, farbe: F.teal }));
  teile.push(t(ex + 30, 110, "die spezifischste", { groesse: 11.5, farbe: F.text }));
  teile.push(t(ex + 30, 126, "Route gewinnt.", { groesse: 11.5, farbe: F.text }));
  teile.push(t(ex + 30, 152, "Passt gar nichts,", { groesse: 11, farbe: F.textLeise }));
  teile.push(t(ex + 30, 168, "fängt die Default-", { groesse: 11, farbe: F.textLeise }));
  teile.push(t(ex + 30, 184, "Route alles auf.", { groesse: 11, farbe: F.textLeise }));

  teile.push(t(B / 2, 214, "Zwei Einträge passen auf 172.16.5.7 – genommen wird der mit dem längeren Präfix.", { groesse: 11.5, fett: true, farbe: F.textStark, align: "mitte" }));

  return render("routing-weg", svg(B, H, teile.join("")), B);
}

/**
 * VLAN: ein physischer Switch, zwei logische Netze. Kontakt gibt es nur
 * über den Router – und dessen Regeln.
 */
function vlanSwitch() {
  const B = 876;
  const H = 240;
  const teile = [];

  // Geräte oben: links Büro (blau), rechts Gäste (bernstein)
  const geraet = (x, label, farbe) => {
    teile.push(kasten(x, 10, 120, 36, { fuellung: F.weiss, rand: farbe, randBreite: 1.6, radius: 4 }));
    teile.push(t(x + 60, 32, label, { groesse: 10.5, fett: true, farbe: F.textStark, align: "mitte" }));
  };
  geraet(60, "PC Buchhaltung", F.blau);
  geraet(200, "PC Vertrieb", F.blau);
  geraet(520, "Gast-Laptop", F.bernstein);
  geraet(660, "Gast-Handy", F.bernstein);

  // Kabel zu den Ports
  [120, 260, 580, 720].forEach((x, i) => {
    teile.push(linie(x, 46, x, 78, { farbe: i < 2 ? F.blau : F.bernstein, breite: 2.2 }));
  });

  // Der Switch mit Ports und logischer Trennung
  teile.push(kasten(40, 78, 760, 64, { fuellung: F.flaeche, rand: F.kante, randBreite: 1.6, radius: 5 }));
  teile.push(t(420, 100, "EIN physischer Switch", { groesse: 11, fett: true, farbe: F.textStark, align: "mitte" }));
  [100, 240, 560, 700].forEach((x, i) => {
    teile.push(kasten(x, 82, 40, 16, { fuellung: i < 2 ? F.blau : F.bernstein, radius: 2 }));
  });
  teile.push(t(200, 128, "VLAN 10 · Büro", { groesse: 11.5, fett: true, farbe: F.blau, align: "mitte" }));
  teile.push(t(640, 128, "VLAN 20 · Gäste", { groesse: 11.5, fett: true, farbe: F.bernstein, align: "mitte" }));
  teile.push(`<line x1="420" y1="106" x2="420" y2="140" stroke="${F.rot}" stroke-width="3" stroke-dasharray="7 5"/>`);
  teile.push(t(420, 156, "logisch getrennt – kein Frame kommt hier direkt rüber", { groesse: 10.5, fett: true, farbe: F.rot, align: "mitte" }));

  // Router darunter als einziger Übergang
  teile.push(linie(240, 142, 380, 186, { farbe: F.blau, breite: 2 }));
  teile.push(linie(600, 142, 460, 186, { farbe: F.bernstein, breite: 2 }));
  teile.push(kasten(370, 186, 100, 38, { fuellung: F.teal, radius: 4 }));
  teile.push(t(420, 202, "Router /", { groesse: 10.5, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(t(420, 216, "Firewall", { groesse: 10.5, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(t(660, 210, "Der einzige Weg zwischen den VLANs –", { groesse: 11, farbe: F.text }));
  teile.push(t(660, 226, "und dort gelten Regeln.", { groesse: 11, farbe: F.text }));

  return render("vlan-switch", svg(B, H, teile.join("")), B);
}

/**
 * Zonenmodell: Internet, DMZ, Büro-LAN und Server-VLAN – die Firewall
 * entscheidet, wer wohin darf.
 */
function zonenModell() {
  const B = 876;
  const H = 235;
  const teile = [];
  const zy = 30;
  const zh = 120;

  const zonen = [
    { x: 0, w: 170, name: "Internet", sub: "alles da draußen", farbe: F.textLeise, tief: F.flaeche },
    { x: 236, w: 180, name: "DMZ", sub: "Webserver, Mail", farbe: F.teal, tief: F.tealTief },
    { x: 482, w: 180, name: "Büro-LAN", sub: "Clients, Drucker", farbe: F.blau, tief: F.blauTief },
    { x: 706, w: 170, name: "Server-VLAN", sub: "Daten, Backup", farbe: F.bernstein, tief: F.bernsteinTief },
  ];
  zonen.forEach((z) => {
    teile.push(kasten(z.x, zy, z.w, zh, { fuellung: z.tief, rand: z.farbe, randBreite: 1.8, radius: 5 }));
    teile.push(t(z.x + z.w / 2, zy + 26, z.name, { groesse: 13, fett: true, farbe: z.farbe, align: "mitte" }));
    teile.push(t(z.x + z.w / 2, zy + 46, z.sub, { groesse: 10.5, farbe: F.textLeise, align: "mitte" }));
  });

  // Firewall-Mauern zwischen den Zonen
  [188, 434, 680].forEach((x) => {
    teile.push(kasten(x, zy - 6, 30, zh + 12, { fuellung: F.rot, radius: 3 }));
    for (let yy = zy + 4; yy < zy + zh; yy += 18) {
      teile.push(`<line x1="${x + 4}" y1="${yy}" x2="${x + 26}" y2="${yy}" stroke="${F.weiss}" stroke-width="1.6"/>`);
    }
  });
  teile.push(t(203, zy + zh + 26, "Firewall", { groesse: 10, fett: true, farbe: F.rot, align: "mitte" }));

  // Erlaubte und verbotene Wege
  teile.push(linie(60, zy + 78, 250, zy + 78, { farbe: F.teal, breite: 2.4, pfeil: "pfeilTeal" }));
  teile.push(t(150, zy + 72, "nur Port 443", { groesse: 9.5, fett: true, farbe: F.teal, align: "mitte" }));
  teile.push(linie(560, zy + 92, 740, zy + 92, { farbe: F.teal, breite: 2.4, pfeil: "pfeilTeal" }));
  teile.push(t(636, zy + 84, "nur benötigte Ports", { groesse: 9.5, fett: true, farbe: F.teal, align: "mitte" }));
  // Internet direkt ins LAN: verboten
  teile.push(linie(60, zy + 104, 470, zy + 104, { farbe: F.rot, breite: 2, gestrichelt: true }));
  teile.push(`<line x1="439" y1="${zy + 94}" x2="459" y2="${zy + 114}" stroke="${F.rot}" stroke-width="3.5"/>`);
  teile.push(`<line x1="459" y1="${zy + 94}" x2="439" y2="${zy + 114}" stroke="${F.rot}" stroke-width="3.5"/>`);
  teile.push(t(265, zy + 118, "direkt ins LAN: gesperrt", { groesse: 9.5, fett: true, farbe: F.rot }));

  teile.push(t(B / 2, zy + zh + 56, "Wer von wo wohin darf, entscheidet die Firewall – nicht die Verkabelung. Der Webserver steht vorn in der DMZ, damit ein Einbruch dort nicht gleich das LAN kostet.", { groesse: 11, fett: true, farbe: F.textStark, align: "mitte" }));

  return render("zonen-modell", svg(B, H, teile.join("")), B);
}

/**
 * Das Blockfinale: der Weg von github.com, Station für Station enthüllbar.
 * stufe 0 = alles offen, 1–5 = so viele Stationen aufgedeckt.
 */
function wegGithub(stufe, neutral) {
  const B = 876;
  const H = 250;
  const teile = [];

  // Browserzeile oben
  teile.push(kasten(238, 8, 400, 34, { fuellung: F.flaeche, rand: F.linie, randBreite: 1.4, radius: 17 }));
  teile.push(t(438, 30, "https://github.com", { groesse: 13, fett: true, farbe: F.textStark, align: "mitte" }));

  const stationen = [
    { name: "Name auflösen", z1: "DNS fragt sich durch:", z2: "github.com → 140.82.121.4" },
    { name: "Verbindung", z1: "TCP auf Port 443,", z2: "dann TLS-Schlüsseltausch" },
    { name: "Anfrage", z1: "HTTP: GET / –", z2: "verpackt wie im Umschlag-Bild" },
    { name: "Der Weg", z1: "Gateway, NAT, viele Router –", z2: "tracert lässt grüßen" },
    { name: "Antwort", z1: "HTML kommt zurück,", z2: "der Browser rendert" },
  ];

  const cy = 92;
  const r = 26;
  const schritt = (B - 176) / 4;
  stationen.forEach((st, i) => {
    const cx = 88 + i * schritt;
    const offen = i < stufe;
    const farbe = offen ? (i === stufe - 1 ? F.blau : F.teal) : F.kante;
    if (i > 0) {
      const vor = 88 + (i - 1) * schritt;
      teile.push(linie(vor + r + 6, cy, cx - r - 6, cy, {
        farbe: i < stufe ? F.teal : F.linie, breite: 2.4,
        pfeil: i < stufe ? "pfeilTeal" : undefined,
      }));
    }
    teile.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${offen ? farbe : F.weiss}" stroke="${farbe}" stroke-width="2.4"/>`);
    teile.push(t(cx, cy + 6, String(i + 1), { groesse: 16, fett: true, farbe: offen ? F.weiss : F.kante, align: "mitte" }));
    teile.push(t(cx, cy + r + 22, st.name, { groesse: 12, fett: true, farbe: offen ? F.textStark : F.textLeise, align: "mitte" }));
    if (offen) {
      teile.push(t(cx, cy + r + 42, st.z1, { groesse: 10, farbe: F.text, align: "mitte" }));
      teile.push(t(cx, cy + r + 57, st.z2, { groesse: 10, farbe: F.text, align: "mitte" }));
    } else {
      teile.push(t(cx, cy + r + 42, "?", { groesse: 14, fett: true, farbe: F.linie, align: "mitte" }));
    }
  });

  const schluss = stufe >= 5
    ? (neutral
        ? "Eine Frage, alle Schichten – und ihr habt sie gerade selbst beantwortet."
        : "Das war die Leitfrage vom ersten Abend – und ihr habt sie gerade selbst beantwortet.")
    : "Wer erzählt die nächste Station?";
  teile.push(t(B / 2, 238, schluss, { groesse: 11.5, fett: true, farbe: stufe >= 5 ? F.teal : F.textLeise, align: "mitte" }));

  return render("weg-github-" + stufe + (neutral ? "-neutral" : ""), svg(B, H, teile.join("")), B);
}

/**
 * Das Subnetting-Rezept als durchlaufendes Beispiel: 172.16.8.90/27 wandert
 * durch die vier Schritte, jedes Zwischenergebnis steht groß im Kasten.
 */
function rezeptWeg() {
  const B = 876;
  const H = 250;
  const teile = [];

  // Beispiel-Chip oben
  teile.push(kasten(288, 6, 300, 32, { fuellung: F.bernstein, radius: 16 }));
  teile.push(t(438, 27, "Beispiel: 172.16.8.90 /27", { groesse: 13, fett: true, farbe: F.weiss, align: "mitte" }));
  teile.push(linie(438, 40, 438, 56, { farbe: F.kante, breite: 2, pfeil: "pfeil" }));

  const boxY = 62;
  const boxH = 128;
  const boxW = 198;
  const gap = (B - 4 * boxW) / 3;

  const schritte = [
    { nr: "1", name: "Hostbits", klein: "32 − Präfix", gross: "32 − 27 = 5", sub: ["fünf Bits gehören", "den Geräten"] },
    { nr: "2", name: "Blockgröße", klein: "2 hoch Hostbits", gross: "2⁵ = 32", sub: ["Netze starten bei", ".0 · .32 · .64 · .96 …"] },
    { nr: "3", name: "Block finden", klein: "Wo liegt die .90?", gross: ".90 → ab .64", sub: ["Blockanfang =", "Netzadresse .64"] },
    { nr: "4", name: "Minus zwei", klein: "Netz + Broadcast weg", gross: "32 − 2 = 30", sub: ["nutzbar .65 – .94,", "Broadcast .95"] },
  ];

  schritte.forEach((st, i) => {
    const x = i * (boxW + gap);
    teile.push(kasten(x, boxY, boxW, boxH, { fuellung: F.tealTief, rand: F.teal, randBreite: 1.6, radius: 5 }));
    teile.push(`<circle cx="${x + 22}" cy="${boxY + 22}" r="13" fill="${F.teal}"/>`);
    teile.push(t(x + 22, boxY + 27, st.nr, { groesse: 12, fett: true, farbe: F.weiss, align: "mitte" }));
    teile.push(t(x + 44, boxY + 27, st.name, { groesse: 12.5, fett: true, farbe: F.textStark }));
    teile.push(t(x + boxW / 2, boxY + 50, st.klein, { groesse: 10, farbe: F.textLeise, align: "mitte" }));
    teile.push(t(x + boxW / 2, boxY + 78, st.gross, { groesse: 17, fett: true, farbe: F.teal, align: "mitte" }));
    teile.push(t(x + boxW / 2, boxY + 100, st.sub[0], { groesse: 10, farbe: F.text, align: "mitte" }));
    teile.push(t(x + boxW / 2, boxY + 115, st.sub[1], { groesse: 10, farbe: F.text, align: "mitte" }));
    if (i < 3) {
      teile.push(linie(x + boxW + 4, boxY + boxH / 2, x + boxW + gap - 4, boxY + boxH / 2, { farbe: F.teal, breite: 2.2, pfeil: "pfeilTeal" }));
    }
  });

  // Ergebniszeile
  teile.push(kasten(138, boxY + boxH + 18, 600, 34, { fuellung: F.flaecheHell, radius: 4 }));
  teile.push(`<rect x="138" y="${boxY + boxH + 18}" width="5" height="34" rx="2.5" fill="${F.teal}"/>`);
  teile.push(t(438, boxY + boxH + 40, "Ergebnis: Netz 172.16.8.64/27 · nutzbar .65 bis .94 · Broadcast .95", { groesse: 12, fett: true, farbe: F.textStark, align: "mitte" }));

  return render("rezept-weg", svg(B, H, teile.join("")), B);
}

/**
 * Aufgaben als Gegeben/Gesucht-Bild: oben der Gegeben-Chip, darunter die
 * Gesucht-Felder. Ungelöst zeigen sie Fragezeichen, gelöst die Werte –
 * identische Geometrie, der Klick füllt die Felder an Ort und Stelle.
 */
const AUFGABEN_BILDER = {
  a: {
    chip: "Gegeben: die Adresse 192.168.10.77 in einem /26-Netz",
    slots: [
      { label: "Netzadresse", wert: "192.168.10.64" },
      { label: "erste nutzbare", wert: ".65" },
      { label: "letzte nutzbare", wert: ".126" },
      { label: "Broadcast", wert: ".127" },
    ],
    note: "Der Blockanfang benennt das Netz, die letzte Adresse ruft alle – beide sind kein Gerät.",
  },
  b: {
    chip: "Gegeben: eine Abteilung braucht Platz für 40 Geräte",
    slots: [
      { label: "Hostbits", wert: "6" },
      { label: "nutzbare Adressen", wert: "2⁶ − 2 = 62" },
      { label: "Präfix", wert: "/26" },
    ],
    note: "Eine Stufe kleiner (/27) böte nur 30 – zu klein für 40. Die kleinste Blockgröße, die reicht.",
  },
  c: {
    chip: "Gegeben: die Adresse 172.16.4.130 in einem /23-Netz",
    slots: [
      { label: "Netzadresse", wert: "172.16.4.0 /23" },
      { label: "nutzbar von – bis", wert: "4.1 – 5.254" },
      { label: "Broadcast", wert: "172.16.5.255" },
    ],
    note: "Blockgröße 512: Das dritte Oktett zählt mit, in Zweierschritten – 4.0 und 5.255 gehören zum selben Block.",
  },
};

function aufgabeBild(nr, geloest) {
  const konf = AUFGABEN_BILDER[nr];
  const B = 876;
  const H = 168;
  const teile = [];

  const chipW = Math.max(360, konf.chip.length * 7.2 + 40);
  teile.push(kasten((B - chipW) / 2, 6, chipW, 32, { fuellung: F.bernstein, radius: 16 }));
  teile.push(t(B / 2, 27, konf.chip, { groesse: 12.5, fett: true, farbe: F.weiss, align: "mitte" }));

  const n = konf.slots.length;
  const gap = 26;
  const slotW = (B - (n - 1) * gap) / n;
  const boxY = 78;
  const boxH = 46;

  konf.slots.forEach((slot, i) => {
    const x = i * (slotW + gap);
    teile.push(t(x + slotW / 2, boxY - 8, slot.label, { groesse: 10.5, fett: true, farbe: F.textLeise, align: "mitte" }));
    if (geloest) {
      teile.push(kasten(x, boxY, slotW, boxH, { fuellung: F.teal, radius: 5 }));
      teile.push(t(x + slotW / 2, boxY + boxH / 2 + 6, slot.wert, { groesse: 16, fett: true, farbe: F.weiss, align: "mitte" }));
    } else {
      teile.push(
        `<rect x="${x}" y="${boxY}" width="${slotW}" height="${boxH}" rx="5" fill="${F.flaeche}" ` +
          `stroke="${F.kante}" stroke-width="1.6" stroke-dasharray="7 5"/>`
      );
      teile.push(t(x + slotW / 2, boxY + boxH / 2 + 7, "?", { groesse: 19, fett: true, farbe: F.kante, align: "mitte" }));
    }
  });

  if (geloest) {
    teile.push(t(B / 2, boxY + boxH + 34, konf.note, { groesse: 11.5, fett: true, farbe: F.textStark, align: "mitte" }));
  }

  return render(`aufgabe-${nr}-${geloest ? "geloest" : "frage"}`, svg(B, H, teile.join("")), B);
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

  const mitteY = 62; // Panel ist 126 hoch – Zeichnung mittig, nichts ragt heraus
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
      arme.push([cx + 60 * Math.cos(w), cy + 40 * Math.sin(w)]);
    }
    let out = arme.map(([x, y]) => linie(cx, cy, x, y, { farbe: F.kante, breite: 2 })).join("");
    out += `<rect x="${cx - 17}" y="${cy - 11}" width="34" height="22" rx="3" fill="${F.blau}"/>`;
    out += arme.map(([x, y]) => knoten(x, y, r, F.text)).join("");
    return out;
  }, F.blau);

  // Ring: sechs Knoten im Kreis, geschlossene Kette
  panel(1, "Ring", "Redundant: Bruch wird verkraftet", (cx, cy) => {
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
  const H = 252;
  const teile = [];

  // Zeilenweise statt verschachtelt: Jede Zeile zeigt einen Einpack-Schritt,
  // benennt die Schicht links, die neue Hülle im Block und den entstehenden
  // Namen rechts. Die Nachricht selbst ist als HTTP ausgewiesen.
  const rowH = 44;
  const gap = 12;
  const y0 = 8;

  // Feste Spalten: die Nachricht bleibt an Ort und Stelle, Kopfteile kommen links dazu
  const NUTZ = { x: 460, w: 310 };
  const TCP = { x: 372, w: 84 };
  const IP = { x: 284, w: 84 };
  const MAC = { x: 196, w: 84 };
  const FCS = { x: 774, w: 44 };

  function blockM(x, w, y, farbe, haupt, sub) {
    let out = kasten(x, y, w, rowH, { fuellung: farbe, radius: 4 });
    out += t(x + w / 2, y + (sub ? 19 : 26), haupt, { groesse: 11.5, fett: true, farbe: F.weiss, align: "mitte" });
    if (sub) out += t(x + w / 2, y + 34, sub, { groesse: 8.5, farbe: F.weiss, align: "mitte" });
    return out;
  }

  const zeilen = [
    {
      links: ["Schicht 7 · Anwendung", "schreibt die Nachricht"],
      name: "Daten", nameFarbe: F.bernstein,
      bloecke: (y) => blockM(NUTZ.x, NUTZ.w, y, F.bernstein, "HTTP", "\u201EGET /index.html\u201C"),
    },
    {
      links: ["Schicht 4 · Transport", "ergänzt die Ports"],
      name: "Segment", nameFarbe: F.teal,
      bloecke: (y) =>
        blockM(TCP.x, TCP.w, y, F.teal, "TCP", "Ports") +
        blockM(NUTZ.x, NUTZ.w, y, F.bernstein, "HTTP", "\u201EGET /index.html\u201C"),
    },
    {
      links: ["Schicht 3 · Vermittlung", "ergänzt die IP-Adressen"],
      name: "Paket", nameFarbe: F.blau,
      bloecke: (y) =>
        blockM(IP.x, IP.w, y, F.blau, "IP", "Quelle → Ziel") +
        blockM(TCP.x, TCP.w, y, F.teal, "TCP", "Ports") +
        blockM(NUTZ.x, NUTZ.w, y, F.bernstein, "HTTP", "\u201EGET /index.html\u201C"),
    },
    {
      links: ["Schicht 2 · Sicherung", "rahmt fürs Kabel, mit Prüfsumme"],
      name: "Frame", nameFarbe: F.textLeise,
      bloecke: (y) =>
        blockM(MAC.x, MAC.w, y, F.textLeise, "MAC", "im LAN") +
        blockM(IP.x, IP.w, y, F.blau, "IP", "Quelle → Ziel") +
        blockM(TCP.x, TCP.w, y, F.teal, "TCP", "Ports") +
        blockM(NUTZ.x, NUTZ.w, y, F.bernstein, "HTTP", "\u201EGET /index.html\u201C") +
        blockM(FCS.x, FCS.w, y, F.textLeise, "FCS", "Prüfung"),
    },
  ];

  zeilen.forEach((z, i) => {
    const y = y0 + i * (rowH + gap);
    const cy = y + rowH / 2;
    teile.push(t(180, cy - 2, z.links[0], { groesse: 11, fett: true, farbe: F.textStark, align: "rechts" }));
    teile.push(t(180, cy + 14, z.links[1], { groesse: 9.5, farbe: F.textLeise, align: "rechts" }));
    teile.push(z.bloecke(y));
    teile.push(t(874, cy + 4, z.name, { groesse: 12, fett: true, farbe: z.nameFarbe, align: "rechts" }));
    // Pfeil zwischen den Zeilen: es ist derselbe Inhalt, eine Hülle mehr
    if (i < zeilen.length - 1) {
      const px = NUTZ.x + NUTZ.w / 2;
      teile.push(linie(px, y + rowH + 1.5, px, y + rowH + gap - 1.5, { farbe: F.kante, breite: 2, pfeil: "pfeil" }));
    }
  });

  // Leserichtung unten
  const fy = y0 + 4 * rowH + 3 * gap + 22;
  teile.push(linie(196, fy - 4, 320, fy - 4, { farbe: F.text, breite: 1.6, pfeil: "pfeil" }));
  teile.push(t(330, fy, "Senden: von oben nach unten", { groesse: 10.5, farbe: F.textLeise }));
  teile.push(linie(818, fy - 4, 694, fy - 4, { farbe: F.text, breite: 1.6, pfeil: "pfeil" }));
  teile.push(t(684, fy, "Empfangen: von unten nach oben", { groesse: 10.5, farbe: F.textLeise, align: "rechts" }));

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

  // Jede OSI-Zeile trägt ihre Aufgabe gleich mit – die Folie soll sich
  // ohne Erklärung von außen lesen lassen.
  const osi = [
    { nr: 7, name: "Anwendung", was: "Protokolle der Programme: Web, Mail, DNS" },
    { nr: 6, name: "Darstellung", was: "Formate, Verschlüsselung – macht heute die Anwendung" },
    { nr: 5, name: "Sitzung", was: "Sitzungen verwalten – macht heute die Anwendung" },
    { nr: 4, name: "Transport", was: "Ende-zu-Ende über Ports: TCP oder UDP" },
    { nr: 3, name: "Vermittlung", was: "Wege zwischen Netzen: IP und Routing" },
    { nr: 2, name: "Sicherung", was: "Zustellung im lokalen Netz: MAC, Frames" },
    { nr: 1, name: "Physisch", was: "Bits aufs Medium: Kabel, Funk, Stecker" },
  ];

  const spaltenW = 446;
  const linksX = 0;
  const rechtsX = 560;
  const tcpW = 316;
  const zeilenH = 30;
  const gap = 3;
  const y0 = 26;

  teile.push(t(linksX, 14, "OSI – das Lehrmodell", { groesse: 11.5, fett: true, farbe: F.blau, spacing: 0.6 }));
  teile.push(t(rechtsX, 14, "TCP/IP – das gebaute Internet", { groesse: 11.5, fett: true, farbe: F.teal, spacing: 0.6 }));

  osi.forEach((sch, i) => {
    const y = y0 + i * (zeilenH + gap);
    teile.push(kasten(linksX, y, spaltenW, zeilenH, { fuellung: F.flaecheHell, radius: 3 }));
    teile.push(`<rect x="${linksX}" y="${y}" width="26" height="${zeilenH}" rx="3" fill="${F.blau}"/>`);
    teile.push(`<rect x="${linksX + 20}" y="${y}" width="6" height="${zeilenH}" fill="${F.blau}"/>`);
    teile.push(t(linksX + 13, y + zeilenH / 2 + 4, String(sch.nr), { groesse: 11, fett: true, farbe: F.weiss, align: "mitte" }));
    teile.push(t(linksX + 36, y + zeilenH / 2 + 4, sch.name, { groesse: 12, fett: true, farbe: F.textStark }));
    teile.push(t(linksX + spaltenW - 12, y + zeilenH / 2 + 4, sch.was, { groesse: 10.5, farbe: F.textLeise, align: "rechts" }));
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

    const kx = linksX + spaltenW + 14;
    const mitte = (yTop + yBot) / 2;
    if (yBot - yTop >= 44) {
      teile.push(
        `<path d="M${kx},${yTop + 3} L${kx + 12},${yTop + 3} L${kx + 12},${mitte - 6} L${kx + 24},${mitte} ` +
          `L${kx + 12},${mitte + 6} L${kx + 12},${yBot - 3} L${kx},${yBot - 3}" ` +
          `fill="none" stroke="${F.teal}" stroke-width="1.8" stroke-linejoin="round"/>`
      );
      teile.push(linie(kx + 24, mitte, rechtsX - 4, mitte, { farbe: F.teal, breite: 1.8, pfeil: "pfeilTeal" }));
    } else {
      teile.push(linie(kx, mitte, rechtsX - 4, mitte, { farbe: F.teal, breite: 1.8, pfeil: "pfeilTeal" }));
    }

    teile.push(kasten(rechtsX, yTop, tcpW, h, { fuellung: F.tealTief, rand: F.teal, randBreite: 1.4, radius: 3 }));
    if (h < 44) {
      teile.push(t(rechtsX + 14, mitte + 4.5, g.name, { groesse: 12.5, fett: true, farbe: F.textStark }));
      teile.push(t(rechtsX + tcpW - 12, mitte + 4, g.beispiele, { groesse: 9.5, farbe: F.text, align: "rechts" }));
    } else {
      teile.push(t(rechtsX + 14, mitte - 2, g.name, { groesse: 12.5, fett: true, farbe: F.textStark }));
      teile.push(t(rechtsX + 14, mitte + 14, g.beispiele, { groesse: 10.5, farbe: F.text }));
    }
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
  const H = 270;
  const teile = [];

  // Windows als Hauptfall, Linux direkt darunter an jeder Stufe –
  // niemand muss für seinen Befehl die Folie verlassen.
  const stufen = [
    { nr: "1", frage: "Steckt überhaupt etwas?", win: "ipconfig", linux: "ip -brief addr", farbe: F.textLeise },
    { nr: "2", frage: "Wen sehe ich lokal?", win: "arp -a", linux: "ip neigh", farbe: F.textLeise },
    { nr: "3", frage: "Komme ich ans Ziel?", win: "ping · tracert", linux: "ping · tracepath", farbe: F.blau },
    { nr: "4", frage: "Ist der Port offen?", win: "Test-NetConnection", linux: "nc -vz", farbe: F.teal },
    { nr: "7", frage: "Kennt jemand den Namen?", win: "nslookup", linux: "resolvectl query", farbe: F.bernstein },
  ];

  const stufeH = 40;
  const stufeGap = 6;
  const stufeW = 372;
  const versatz = 58;
  const basisY = H - 30;

  stufen.forEach((st, i) => {
    const y = basisY - (i + 1) * (stufeH + stufeGap) + stufeGap;
    const w = stufeW;
    const x = i * versatz;

    if (i > 0) {
      teile.push(linie(x, y + stufeH, x, y + stufeH + stufeGap, { farbe: F.linie, breite: 1.5 }));
    }
    teile.push(kasten(x, y, w, stufeH, { fuellung: F.flaeche, radius: 3 }));
    teile.push(`<rect x="${x}" y="${y}" width="30" height="${stufeH}" rx="3" fill="${st.farbe}"/>`);
    teile.push(`<rect x="${x + 24}" y="${y}" width="6" height="${stufeH}" fill="${st.farbe}"/>`);
    teile.push(t(x + 15, y + stufeH / 2 + 4.5, st.nr, { groesse: 12, fett: true, farbe: F.weiss, align: "mitte" }));
    teile.push(t(x + 42, y + stufeH / 2 + 4.5, st.frage, { groesse: 12, fett: true, farbe: F.textStark }));
    teile.push(t(x + w - 14, y + 17, st.win, { groesse: 10.5, farbe: st.farbe, align: "rechts" }));
    teile.push(t(x + w - 14, y + 32, "Linux: " + st.linux, { groesse: 9.5, farbe: F.textLeise, align: "rechts" }));
  });

  const pfeilX = B - 146;
  teile.push(linie(pfeilX, basisY - 4, pfeilX, 14, { farbe: F.text, breite: 2, pfeil: "pfeil" }));
  teile.push(t(pfeilX + 16, 30, "von unten", { groesse: 12, fett: true, farbe: F.textStark }));
  teile.push(t(pfeilX + 16, 48, "nach oben", { groesse: 12, fett: true, farbe: F.textStark }));
  teile.push(t(pfeilX + 16, 74, "Die erste Stufe,", { groesse: 11, farbe: F.textLeise }));
  teile.push(t(pfeilX + 16, 90, "die stumm bleibt,", { groesse: 11, farbe: F.textLeise }));
  teile.push(t(pfeilX + 16, 106, "zeigt, wo du suchst.", { groesse: 11, farbe: F.textLeise }));

  teile.push(linie(0, basisY + 3, stufeW, basisY + 3, { farbe: F.linie, breite: 2 }));

  return render("diagnose-leiter", svg(B, H, teile.join("")), B);
}

module.exports = {
  topologien, kapselung, osiTcpip, diagnoseLeiter, wegThema1, bandbreiteLatenz, dateneinheiten,
  umfrageNetz, ipAufbau, block26, natWeg, ipv6Aufbau, praefixBalken, blockStrahl,
  routingWeg, vlanSwitch, zonenModell, wegGithub, rezeptWeg, aufgabeBild, iconDatei,
  icon, ICONS, F, render, svg, t, kasten, linie, knoten,
};
